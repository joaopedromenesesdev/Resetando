// ========================================
// Resetando — Progression & Gamification System
// XP, Levels, and Triangle Normalization
// ========================================

import type { PillarId } from './models';

export interface LevelInfo {
  level: number;
  currentLevelXp: number; // XP accumulated within current level
  xpForNextLevel: number; // XP needed to advance to next level from current level
  progressPercent: number; // 0 - 100% within current level
  totalXp: number;
}

export interface ScaleTier {
  tierMax: number;
  tierName: string;
  tierIndex: number;
}

// ---- Pillar Levels ----
// Calibrated to user specifications:
// 350 XP -> Level 4
// 420 XP -> Level 5
// 470 XP -> Level 6
const PILLAR_THRESHOLDS = [
  0,    // Lvl 1
  80,   // Lvl 2
  180,  // Lvl 3
  300,  // Lvl 4
  410,  // Lvl 5
  465,  // Lvl 6
  580,  // Lvl 7
  710,  // Lvl 8
  850,  // Lvl 9
  1000, // Lvl 10
];

export function getPillarLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.round(xp || 0));

  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = PILLAR_THRESHOLDS[1];

  for (let i = 0; i < PILLAR_THRESHOLDS.length; i++) {
    if (safeXp >= PILLAR_THRESHOLDS[i]) {
      level = i + 1;
      prevThreshold = PILLAR_THRESHOLDS[i];
      nextThreshold = i + 1 < PILLAR_THRESHOLDS.length
        ? PILLAR_THRESHOLDS[i + 1]
        : prevThreshold + 150;
    } else {
      break;
    }
  }

  // Handle beyond max predefined threshold
  if (safeXp >= PILLAR_THRESHOLDS[PILLAR_THRESHOLDS.length - 1]) {
    const excess = safeXp - PILLAR_THRESHOLDS[PILLAR_THRESHOLDS.length - 1];
    const extraLevels = Math.floor(excess / 150);
    level = PILLAR_THRESHOLDS.length + extraLevels;
    prevThreshold = PILLAR_THRESHOLDS[PILLAR_THRESHOLDS.length - 1] + extraLevels * 150;
    nextThreshold = prevThreshold + 150;
  }

  const range = nextThreshold - prevThreshold;
  const currentLevelXp = safeXp - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / range) * 100)));

  return {
    level,
    currentLevelXp,
    xpForNextLevel: range,
    progressPercent,
    totalXp: safeXp,
  };
}

// ---- Global Level ----
// Calibrated to user specification:
// 1240 XP -> Level 8
const GLOBAL_THRESHOLDS = [
  0,    // Lvl 1
  100,  // Lvl 2
  230,  // Lvl 3
  380,  // Lvl 4
  550,  // Lvl 5
  740,  // Lvl 6
  950,  // Lvl 7
  1180, // Lvl 8
  1430, // Lvl 9
  1700, // Lvl 10
  2000, // Lvl 11
];

export function getGlobalLevelInfo(totalXp: number): LevelInfo {
  const safeXp = Math.max(0, Math.round(totalXp || 0));

  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = GLOBAL_THRESHOLDS[1];

  for (let i = 0; i < GLOBAL_THRESHOLDS.length; i++) {
    if (safeXp >= GLOBAL_THRESHOLDS[i]) {
      level = i + 1;
      prevThreshold = GLOBAL_THRESHOLDS[i];
      nextThreshold = i + 1 < GLOBAL_THRESHOLDS.length
        ? GLOBAL_THRESHOLDS[i + 1]
        : prevThreshold + 300;
    } else {
      break;
    }
  }

  if (safeXp >= GLOBAL_THRESHOLDS[GLOBAL_THRESHOLDS.length - 1]) {
    const excess = safeXp - GLOBAL_THRESHOLDS[GLOBAL_THRESHOLDS.length - 1];
    const extraLevels = Math.floor(excess / 300);
    level = GLOBAL_THRESHOLDS.length + extraLevels;
    prevThreshold = GLOBAL_THRESHOLDS[GLOBAL_THRESHOLDS.length - 1] + extraLevels * 300;
    nextThreshold = prevThreshold + 300;
  }

  const range = nextThreshold - prevThreshold;
  const currentLevelXp = safeXp - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / range) * 100)));

  return {
    level,
    currentLevelXp,
    xpForNextLevel: range,
    progressPercent,
    totalXp: safeXp,
  };
}

// ---- Evolution Scale / Triangle Normalization ----
// Smooth tier curve without artificial permanent ceilings:
// Tier 1: 500 XP (400 XP -> 80% as in user example)
// Expands progressively as XP increases
const SCALE_TIERS: ScaleTier[] = [
  { tierMax: 500, tierName: 'Fundação', tierIndex: 1 },
  { tierMax: 1000, tierName: 'Desenvolvimento', tierIndex: 2 },
  { tierMax: 2000, tierName: 'Consolidação', tierIndex: 3 },
  { tierMax: 4000, tierName: 'Avançado', tierIndex: 4 },
  { tierMax: 7500, tierName: 'Maestria', tierIndex: 5 },
  { tierMax: 12000, tierName: 'Transcendência', tierIndex: 6 },
];

export function getEvolutionScale(highestPillarXp: number): ScaleTier {
  const safeXp = Math.max(0, Math.round(highestPillarXp || 0));

  for (let i = 0; i < SCALE_TIERS.length; i++) {
    // Transition to next scale once any pillar reaches 95% of current tier
    if (safeXp < SCALE_TIERS[i].tierMax * 0.95) {
      return SCALE_TIERS[i];
    }
  }

  const lastTier = SCALE_TIERS[SCALE_TIERS.length - 1].tierMax;
  const step = 5000;
  const extraSteps = Math.ceil((safeXp - lastTier * 0.95) / step);
  const tierMax = lastTier + extraSteps * step;

  return {
    tierMax,
    tierName: `Nível Superior ${extraSteps}`,
    tierIndex: SCALE_TIERS.length + extraSteps,
  };
}

export function getPillarProgressPercent(pillarXp: number, scaleMax: number): number {
  if (scaleMax <= 0) return 0;
  const safeXp = Math.max(0, pillarXp || 0);
  const pct = Math.round((safeXp / scaleMax) * 100);
  return Math.min(100, Math.max(0, pct));
}

// ---- Visual Feedback: Floating XP Toast ----
export function showXpToast(amount: number, pillarId: PillarId, isLevelUp = false): void {
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

  const toast = document.createElement('div');
  toast.className = 'xp-feedback-toast';
  toast.innerHTML = `
    <span class="xp-feedback-amount">+${amount} XP</span>
    <span class="xp-feedback-divider">·</span>
    <span class="xp-feedback-pillar">${names[pillarId]}</span>
    ${isLevelUp ? `<span class="xp-feedback-levelup">SUBIU DE NÍVEL!</span>` : ''}
  `;

  document.body.appendChild(toast);

  // Auto remove after animation completes
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}
