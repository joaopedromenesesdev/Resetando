// ========================================
// Resetando — Progression & Gamification System
// Strict cycle-based progression:
// HÁBITOS → XP → PILARES → TRIÂNGULO → NÍVEL
// ========================================

import type { AppState, PillarId, UserProgress, XPEvent } from './models';
import { saveState } from './storage';

// BASE_XP_PER_PILLAR represents 1 full week of XP for a pillar.
// Easily configurable in this single location.
export const BASE_XP_PER_PILLAR = 630;

/**
 * Calculates required XP per pillar for a given level.
 * Formula: requiredXP = BASE_XP_PER_PILLAR * 2^(level - 1)
 * Level 1 → 2: 630
 * Level 2 → 3: 1260
 * Level 3 → 4: 2520
 * Level 4 → 5: 5040
 * Level 5 → 6: 10080
 */
export function calculateRequiredXP(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return BASE_XP_PER_PILLAR * Math.pow(2, safeLevel - 1);
}

/**
 * Calculates current progress ratio (0 to 1) for a pillar in the current cycle.
 */
export function calculatePillarProgress(cycleXP: number, requiredXP: number): number {
  if (requiredXP <= 0) return 0;
  return Math.min(Math.max(0, cycleXP) / requiredXP, 1);
}

export function getDefaultUserProgress(): UserProgress {
  return {
    totalXP: 0,
    menteXP: 0,
    corpoXP: 0,
    almaXP: 0,
    currentLevel: 1,
    currentCycleMenteXP: 0,
    currentCycleCorpoXP: 0,
    currentCycleAlmaXP: 0,
  };
}

export interface LevelUpResult {
  newProgress: UserProgress;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
}

/**
 * Checks if all three pillars have reached the required XP for the current level.
 * If yes, advances levels, carrying over all excess XP to the next cycle.
 * Handles multi-level progression seamlessly.
 */
export function checkAndProcessLevelUp(progress: UserProgress): LevelUpResult {
  let currentLevel = Math.max(1, progress.currentLevel);
  let cycleM = Math.max(0, progress.currentCycleMenteXP);
  let cycleC = Math.max(0, progress.currentCycleCorpoXP);
  let cycleA = Math.max(0, progress.currentCycleAlmaXP);
  const oldLevel = currentLevel;
  let levelsGained = 0;

  while (true) {
    const required = calculateRequiredXP(currentLevel);
    // ALL 3 pillars must reach the requirement to level up
    if (cycleM >= required && cycleC >= required && cycleA >= required) {
      cycleM -= required;
      cycleC -= required;
      cycleA -= required;
      currentLevel += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const leveledUp = levelsGained > 0;
  const newProgress: UserProgress = {
    ...progress,
    currentLevel,
    currentCycleMenteXP: cycleM,
    currentCycleCorpoXP: cycleC,
    currentCycleAlmaXP: cycleA,
  };

  return {
    newProgress,
    leveledUp,
    oldLevel,
    newLevel: currentLevel,
    levelsGained,
  };
}

export interface AddXpResult {
  newState: AppState;
  eventAdded: boolean;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
}

/**
 * Central function to award XP.
 * Enforces strict idempotency via unique referenceId.
 * Updates historical total XP and current cycle XP.
 * Checks and processes level-up transitions.
 */
export function addXP(
  state: AppState,
  pillar: PillarId,
  amount: number,
  source: string,
  referenceId: string
): AddXpResult {
  const currentEvents = state.xpEvents || [];
  const currentProg = state.progress || getDefaultUserProgress();
  const oldLevel = currentProg.currentLevel;

  // Idempotency check: if referenceId already rewarded, do not award again
  if (currentEvents.some(e => e.referenceId === referenceId)) {
    return {
      newState: state,
      eventAdded: false,
      leveledUp: false,
      oldLevel,
      newLevel: oldLevel,
    };
  }

  const safeAmount = Math.max(0, Math.round(amount));
  if (safeAmount === 0) {
    return {
      newState: state,
      eventAdded: false,
      leveledUp: false,
      oldLevel,
      newLevel: oldLevel,
    };
  }

  // Create XP event record
  const newEvent: XPEvent = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    pillar,
    amount: safeAmount,
    source,
    referenceId,
    createdAt: new Date().toISOString(),
  };

  // Update progress
  const updatedProgress: UserProgress = {
    ...currentProg,
    totalXP: (currentProg.totalXP || 0) + safeAmount,
    menteXP: pillar === 'mente' ? (currentProg.menteXP || 0) + safeAmount : (currentProg.menteXP || 0),
    corpoXP: pillar === 'corpo' ? (currentProg.corpoXP || 0) + safeAmount : (currentProg.corpoXP || 0),
    almaXP: pillar === 'alma' ? (currentProg.almaXP || 0) + safeAmount : (currentProg.almaXP || 0),
    currentCycleMenteXP: pillar === 'mente' ? (currentProg.currentCycleMenteXP || 0) + safeAmount : (currentProg.currentCycleMenteXP || 0),
    currentCycleCorpoXP: pillar === 'corpo' ? (currentProg.currentCycleCorpoXP || 0) + safeAmount : (currentProg.currentCycleCorpoXP || 0),
    currentCycleAlmaXP: pillar === 'alma' ? (currentProg.currentCycleAlmaXP || 0) + safeAmount : (currentProg.currentCycleAlmaXP || 0),
  };

  // Check level up with excess carry-over
  const levelResult = checkAndProcessLevelUp(updatedProgress);

  const newState: AppState = {
    ...state,
    progress: levelResult.newProgress,
    xpEvents: [...currentEvents, newEvent],
    // Maintain legacy sync fields
    totalXp: levelResult.newProgress.totalXP,
    pillarXp: {
      mente: levelResult.newProgress.menteXP,
      corpo: levelResult.newProgress.corpoXP,
      alma: levelResult.newProgress.almaXP,
    },
  };

  saveState(newState);

  // Show visual feedback toast
  showXpToast(safeAmount, pillar, source);

  // If leveled up, trigger level up announcement modal
  if (levelResult.leveledUp) {
    const nextReq = calculateRequiredXP(levelResult.newLevel);
    showLevelUpModal(levelResult.newLevel, nextReq);
  }

  return {
    newState,
    eventAdded: true,
    leveledUp: levelResult.leveledUp,
    oldLevel,
    newLevel: levelResult.newLevel,
  };
}

export function getCurrentLevelProgress(progress: UserProgress): {
  currentLevel: number;
  requiredXP: number;
  mente: { cycleXP: number; requiredXP: number; percent: number; progressRatio: number };
  corpo: { cycleXP: number; requiredXP: number; percent: number; progressRatio: number };
  alma: { cycleXP: number; requiredXP: number; percent: number; progressRatio: number };
  totalXP: number;
  allPillarsCompleted: boolean;
} {
  const currentLevel = Math.max(1, progress.currentLevel);
  const requiredXP = calculateRequiredXP(currentLevel);

  const ratioM = calculatePillarProgress(progress.currentCycleMenteXP, requiredXP);
  const ratioC = calculatePillarProgress(progress.currentCycleCorpoXP, requiredXP);
  const ratioA = calculatePillarProgress(progress.currentCycleAlmaXP, requiredXP);

  const percentM = Math.min(100, Math.round(ratioM * 100));
  const percentC = Math.min(100, Math.round(ratioC * 100));
  const percentA = Math.min(100, Math.round(ratioA * 100));

  return {
    currentLevel,
    requiredXP,
    mente: {
      cycleXP: Math.min(requiredXP, progress.currentCycleMenteXP),
      requiredXP,
      percent: percentM,
      progressRatio: ratioM,
    },
    corpo: {
      cycleXP: Math.min(requiredXP, progress.currentCycleCorpoXP),
      requiredXP,
      percent: percentC,
      progressRatio: ratioC,
    },
    alma: {
      cycleXP: Math.min(requiredXP, progress.currentCycleAlmaXP),
      requiredXP,
      percent: percentA,
      progressRatio: ratioA,
    },
    totalXP: progress.totalXP || 0,
    allPillarsCompleted: percentM >= 100 && percentC >= 100 && percentA >= 100,
  };
}

// ---- Visual Feedback: Floating XP Toast ----
export function showXpToast(amount: number, pillarId: PillarId, source?: string): void {
  if (typeof document === 'undefined' || !document.body) return;

  // Remove existing toast if present
  const oldToast = document.querySelector('.xp-feedback-toast');
  if (oldToast) {
    oldToast.remove();
  }

  const names: Record<PillarId, string> = {
    mente: 'MENTE',
    corpo: 'CORPO',
    alma: 'ALMA',
  };

  const isBonus = source && source.includes('bonus');

  const toast = document.createElement('div');
  toast.className = 'xp-feedback-toast';
  toast.innerHTML = `
    <span class="xp-feedback-amount">+${amount} XP</span>
    <span class="xp-feedback-divider">·</span>
    <span class="xp-feedback-pillar">${names[pillarId]}</span>
    ${isBonus ? `<span class="xp-feedback-bonus-tag">BÔNUS</span>` : ''}
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast?.classList?.add('fade-out');
    setTimeout(() => toast?.remove(), 400);
  }, 1800);
}

// ---- Visual Feedback: Level Up Modal ----
export function showLevelUpModal(newLevel: number, requiredXP: number): void {
  document.getElementById('level-up-modal-backdrop')?.remove();

  const modalHtml = `
    <div class="modal-backdrop level-up-backdrop" id="level-up-modal-backdrop">
      <div class="modal-card level-up-card">
        <div class="level-up-glow"></div>
        <div class="level-up-badge">NOVO NÍVEL ALCANÇADO</div>
        <div class="level-up-title-wrap">
          <span class="level-up-number">NÍVEL ${newLevel}</span>
        </div>
        <p class="level-up-congrats">
          Você completou o ciclo de evolução nos três pilares.
        </p>
        <div class="level-up-info-box">
          <span class="level-up-info-label">Novo Requisito do Ciclo</span>
          <span class="level-up-info-value">${requiredXP.toLocaleString('pt-BR')} XP por pilar</span>
        </div>
        <p class="level-up-footnote">
          Seu histórico de XP continua totalmente preservado. O triângulo foi reiniciado para este novo patamar.
        </p>
        <button class="btn btn-primary" id="btn-close-level-up">
          Continuar Evoluindo
        </button>
      </div>
    </div>
  `;

  if (typeof document === 'undefined' || !document.body) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHtml;
  if (wrapper.firstElementChild) {
    document.body.appendChild(wrapper.firstElementChild);
  }

  const backdrop = document.getElementById('level-up-modal-backdrop');
  const close = () => backdrop?.remove();

  document.getElementById('btn-close-level-up')?.addEventListener('click', close);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
}

