// ========================================
// Resetando — Triângulo de Evolução
// Visual map of accumulated evolution for the CURRENT LEVEL:
// HÁBITOS → XP → PILARES → TRIÂNGULO → NÍVEL
// Alter Ego: Optional visual reference layer
// ========================================

import type { AppState, PillarId } from './models';
import {
  getPillarGoals,
  updateGoalProgress,
} from './storage';
import {
  getCurrentLevelProgress,
} from './progression';
import { openAlterEgoModal, openGoalModal } from './goals_modal';
import { icon } from './icons';

let selectedPillar: PillarId | null = null;

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 300;
const CX = 200;
const CY = 176;
const RADIUS = 144;

// Outer reference vertices at 100%
const VM = { x: CX, y: CY - RADIUS };
const VC = {
  x: CX - RADIUS * Math.cos(Math.PI / 6),
  y: CY + RADIUS * Math.sin(Math.PI / 6),
};
const VA = {
  x: CX + RADIUS * Math.cos(Math.PI / 6),
  y: CY + RADIUS * Math.sin(Math.PI / 6),
};

function getGuideTrianglePoints(scale: number): string {
  const m = { x: CX, y: CY - RADIUS * scale };
  const c = {
    x: CX - RADIUS * scale * Math.cos(Math.PI / 6),
    y: CY + RADIUS * scale * Math.sin(Math.PI / 6),
  };
  const a = {
    x: CX + RADIUS * scale * Math.cos(Math.PI / 6),
    y: CY + RADIUS * scale * Math.sin(Math.PI / 6),
  };
  return `${m.x.toFixed(1)},${m.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)} ${a.x.toFixed(1)},${a.y.toFixed(1)}`;
}

export function renderEvolutionTriangleHtml(state: AppState): string {
  const alterEgo = state.alterEgo;
  const hasAlterEgo = !!alterEgo;

  const progress = state.progress;
  const levelData = getCurrentLevelProgress(progress);
  const currentLevel = levelData.currentLevel;
  const requiredXP = levelData.requiredXP;

  // Normalized progress ratios for current cycle (0 at center, 1 at outer vertices)
  const rem = levelData.mente.progressRatio;
  const rec = levelData.corpo.progressRatio;
  const rea = levelData.alma.progressRatio;

  const pctM = levelData.mente.percent;
  const pctC = levelData.corpo.percent;
  const pctA = levelData.alma.percent;

  // Internal Evolution Points (strictly based on current cycle XP)
  const pem = { x: CX + (VM.x - CX) * rem, y: CY + (VM.y - CY) * rem };
  const pec = { x: CX + (VC.x - CX) * rec, y: CY + (VC.y - CY) * rec };
  const pea = { x: CX + (VA.x - CX) * rea, y: CY + (VA.y - CY) * rea };

  const evolutionPointsStr = `${pem.x.toFixed(1)},${pem.y.toFixed(1)} ${pec.x.toFixed(1)},${pec.y.toFixed(1)} ${pea.x.toFixed(1)},${pea.y.toFixed(1)}`;

  // Optional Alter Ego Reference Points (Destination / Targets 0-100%)
  const targetM = alterEgo ? alterEgo.mente.target : 0;
  const targetC = alterEgo ? alterEgo.corpo.target : 0;
  const targetA = alterEgo ? alterEgo.alma.target : 0;

  const rtm = targetM / 100;
  const rtc = targetC / 100;
  const rta = targetA / 100;

  const ptm = { x: CX + (VM.x - CX) * rtm, y: CY + (VM.y - CY) * rtm };
  const ptc = { x: CX + (VC.x - CX) * rtc, y: CY + (VC.y - CY) * rtc };
  const pta = { x: CX + (VA.x - CX) * rta, y: CY + (VA.y - CY) * rta };

  const alterEgoPointsStr = `${ptm.x.toFixed(1)},${ptm.y.toFixed(1)} ${ptc.x.toFixed(1)},${ptc.y.toFixed(1)} ${pta.x.toFixed(1)},${pta.y.toFixed(1)}`;

  // Outer and Concentric Guides (25%, 50%, 75%, 100%)
  const outerTriangleStr = getGuideTrianglePoints(1.0);
  const guide75 = getGuideTrianglePoints(0.75);
  const guide50 = getGuideTrianglePoints(0.5);
  const guide25 = getGuideTrianglePoints(0.25);

  const hasAnyCycleProgress = progress.currentCycleMenteXP > 0 || progress.currentCycleCorpoXP > 0 || progress.currentCycleAlmaXP > 0;
  const selectedContext = selectedPillar ? getContextData(selectedPillar, state, requiredXP) : null;

  return `
    <section class="evolution-triangle-card" id="evolution-triangle-card">
      <div class="triangle-header">
        <div class="triangle-header-left">
          <span class="triangle-badge">NÍVEL ${currentLevel} · CICLO ATUAL</span>
          <h2 class="triangle-title">TRIÂNGULO DE EVOLUÇÃO</h2>
        </div>
        <div class="triangle-header-right">
          <button class="btn-config-alter-ego ${hasAlterEgo ? 'active' : ''}" id="btn-open-alter-ego" title="Alter Ego (Opcional)">
            ${icon('target', 14)}
            <span>${hasAlterEgo ? alterEgo.name : 'Adicionar Alter Ego'}</span>
          </button>
        </div>
      </div>

      <div class="triangle-scale-info">
        <span class="scale-label">Requisito do Nível ${currentLevel}: <strong>${requiredXP.toLocaleString('pt-BR')} XP</strong> por pilar</span>
      </div>

      <!-- SVG Graph Section -->
      <div class="triangle-svg-wrapper">
        <svg
          class="triangle-svg"
          viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}"
          width="100%"
          height="auto"
          role="img"
          aria-label="Triângulo de Evolução do Nível ${currentLevel}"
        >
          <!-- Spokes -->
          <line x1="${CX}" y1="${CY}" x2="${VM.x.toFixed(1)}" y2="${VM.y.toFixed(1)}" class="triangle-spoke" />
          <line x1="${CX}" y1="${CY}" x2="${VC.x.toFixed(1)}" y2="${VC.y.toFixed(1)}" class="triangle-spoke" />
          <line x1="${CX}" y1="${CY}" x2="${VA.x.toFixed(1)}" y2="${VA.y.toFixed(1)}" class="triangle-spoke" />

          <!-- Concentric Guides -->
          <polygon points="${guide25}" class="triangle-guide guide-25" />
          <polygon points="${guide50}" class="triangle-guide guide-50" />
          <polygon points="${guide75}" class="triangle-guide guide-75" />
          <polygon points="${outerTriangleStr}" class="triangle-outer" />
          <circle cx="${CX}" cy="${CY}" r="2.5" class="triangle-center-point" />

          <!-- Optional Alter Ego Reference Triangle (Destino / Linha Tracejada) -->
          ${hasAlterEgo ? `
            <polygon
              id="alter-ego-polygon"
              points="${alterEgoPointsStr}"
              class="triangle-alter-ego-area"
            />
            <circle cx="${ptm.x.toFixed(1)}" cy="${ptm.y.toFixed(1)}" r="3" class="triangle-target-dot" />
            <circle cx="${ptc.x.toFixed(1)}" cy="${ptc.y.toFixed(1)}" r="3" class="triangle-target-dot" />
            <circle cx="${pta.x.toFixed(1)}" cy="${pta.y.toFixed(1)}" r="3" class="triangle-target-dot" />
          ` : ''}

          <!-- Evolution Triangle (Baseado no XP do Ciclo do Nível Atual) -->
          ${hasAnyCycleProgress ? `
            <polygon
              id="evolution-progress-polygon"
              points="${evolutionPointsStr}"
              class="triangle-inner-area"
            />
            <circle cx="${pem.x.toFixed(1)}" cy="${pem.y.toFixed(1)}" r="3.5" class="triangle-inner-dot vertex-mente-dot" />
            <circle cx="${pec.x.toFixed(1)}" cy="${pec.y.toFixed(1)}" r="3.5" class="triangle-inner-dot vertex-corpo-dot" />
            <circle cx="${pea.x.toFixed(1)}" cy="${pea.y.toFixed(1)}" r="3.5" class="triangle-inner-dot vertex-alma-dot" />
          ` : `
            <!-- Início do nível: ponto central iluminado -->
            <circle cx="${CX}" cy="${CY}" r="4" class="triangle-inner-dot origin-dot" />
          `}

          <!-- Outer Anchor Dots -->
          <circle cx="${VM.x.toFixed(1)}" cy="${VM.y.toFixed(1)}" class="triangle-outer-dot ${selectedPillar === 'mente' ? 'selected' : ''}" />
          <circle cx="${VC.x.toFixed(1)}" cy="${VC.y.toFixed(1)}" class="triangle-outer-dot ${selectedPillar === 'corpo' ? 'selected' : ''}" />
          <circle cx="${VA.x.toFixed(1)}" cy="${VA.y.toFixed(1)}" class="triangle-outer-dot ${selectedPillar === 'alma' ? 'selected' : ''}" />

          <!-- MENTE Vertex Labels (Top) -->
          <g class="triangle-vertex-group ${selectedPillar === 'mente' ? 'selected' : ''}" data-pillar-vertex="mente" role="button" tabindex="0">
            <circle cx="${CX}" cy="18" r="34" class="triangle-touch-target" />
            <text x="${CX}" y="14" class="triangle-label-name" text-anchor="middle">MENTE</text>
            <text x="${CX}" y="27" class="triangle-label-stats" text-anchor="middle">
              ${pctM}% (${progress.currentCycleMenteXP}/${requiredXP} XP)
            </text>
          </g>

          <!-- CORPO Vertex Labels (Bottom-Left) -->
          <g class="triangle-vertex-group ${selectedPillar === 'corpo' ? 'selected' : ''}" data-pillar-vertex="corpo" role="button" tabindex="0">
            <circle cx="85" cy="272" r="34" class="triangle-touch-target" />
            <text x="85" y="270" class="triangle-label-name" text-anchor="middle">CORPO</text>
            <text x="85" y="284" class="triangle-label-stats" text-anchor="middle">
              ${pctC}% (${progress.currentCycleCorpoXP}/${requiredXP} XP)
            </text>
          </g>

          <!-- ALMA Vertex Labels (Bottom-Right) -->
          <g class="triangle-vertex-group ${selectedPillar === 'alma' ? 'selected' : ''}" data-pillar-vertex="alma" role="button" tabindex="0">
            <circle cx="315" cy="272" r="34" class="triangle-touch-target" />
            <text x="315" y="270" class="triangle-label-name" text-anchor="middle">ALMA</text>
            <text x="315" y="284" class="triangle-label-stats" text-anchor="middle">
              ${pctA}% (${progress.currentCycleAlmaXP}/${requiredXP} XP)
            </text>
          </g>
        </svg>
      </div>

      <!-- Legend or Progress Notes -->
      ${hasAlterEgo ? `
        <div class="triangle-legend">
          <div class="legend-item">
            <span class="legend-line legend-alter-ego"></span>
            <span class="legend-text">Destino (${alterEgo.name})</span>
          </div>
          <div class="legend-item">
            <span class="legend-box legend-evolution"></span>
            <span class="legend-text">Progresso Nível ${currentLevel}</span>
          </div>
        </div>
      ` : `
        <p class="triangle-caption-note">
          Preencha os três pilares para avançar ao Nível ${currentLevel + 1}.
        </p>
      `}

      <!-- Contextual Inspector (Active Pillar) -->
      <div class="triangle-context-panel ${selectedContext ? 'visible' : ''}" id="triangle-context-panel">
        ${selectedContext ? `
          <div class="triangle-context-card">
            <div class="triangle-context-top">
              <div class="context-pillar-header">
                <span class="triangle-context-pillar">${selectedContext.title}</span>
                <span class="context-level-badge">Ciclo: ${selectedContext.percent}%</span>
                ${hasAlterEgo ? `
                  <span class="context-distance-badge">
                    ${selectedContext.distance === 0 ? 'Alvo atingido' : `Faltam ${selectedContext.distance}% para o alvo`}
                  </span>
                ` : ''}
              </div>
              <button class="triangle-context-dismiss" id="triangle-dismiss-btn" aria-label="Fechar">&times;</button>
            </div>

            <div class="context-stats-grid">
              <div class="context-stat-box">
                <span class="stat-box-label">XP do Nível ${currentLevel}</span>
                <span class="stat-box-value active">${selectedContext.cycleXP} / ${requiredXP} XP</span>
              </div>
              <div class="context-stat-box">
                <span class="stat-box-label">XP Histórico Total</span>
                <span class="stat-box-value">${selectedContext.historicalXP} XP</span>
              </div>
              ${hasAlterEgo ? `
                <div class="context-stat-box">
                  <span class="stat-box-label">Alvo Alter Ego</span>
                  <span class="stat-box-value">${selectedContext.target}%</span>
                </div>
              ` : `
                <div class="context-stat-box">
                  <span class="stat-box-label">Restante para Nível ${currentLevel + 1}</span>
                  <span class="stat-box-value">${Math.max(0, requiredXP - selectedContext.cycleXP)} XP</span>
                </div>
              `}
            </div>

            <!-- Goals List -->
            <div class="context-goals-section">
              <div class="context-goals-header">
                <span class="context-goals-title">Metas de ${selectedContext.title} (${selectedContext.goals.length})</span>
                <button class="btn-add-meta-small" id="btn-add-meta-context" data-pillar="${selectedContext.pillarId}">
                  ${icon('plus', 12)} Adicionar Meta (+100 XP)
                </button>
              </div>

              ${selectedContext.goals.length === 0 ? `
                <p class="context-no-goals">Nenhuma meta ativa. Concluir uma meta rende +100 XP para este pilar!</p>
              ` : `
                <div class="context-goals-list">
                  ${selectedContext.goals.map(g => `
                    <div class="context-goal-item" data-goal-id="${g.id}">
                      <div class="goal-item-main">
                        <span class="goal-item-title">${g.title}</span>
                        <div class="goal-item-controls">
                          <button class="goal-step-btn" data-action="decrement" data-goal-id="${g.id}">-10%</button>
                          <span class="goal-item-pct ${g.completed ? 'completed' : ''}">${g.progress}%</span>
                          <button class="goal-step-btn" data-action="increment" data-goal-id="${g.id}">+10%</button>
                          <button class="goal-edit-btn" data-action="edit" data-goal-id="${g.id}" title="Editar Meta">
                            ${icon('edit', 13)}
                          </button>
                        </div>
                      </div>
                      <div class="goal-mini-bar">
                        <div class="goal-mini-fill" style="width: ${g.progress}%"></div>
                      </div>
                      ${g.completed ? `<div class="goal-rewarded-badge">${icon('check', 11)} +100 XP Concedido</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        ` : `
          <p class="triangle-context-hint">Toque em Mente, Corpo ou Alma para ver detalhes do ciclo e metas</p>
        `}
      </div>
    </section>
  `;
}

function getContextData(pillarId: PillarId, state: AppState, requiredXP: number) {
  const alterEgo = state.alterEgo;
  const pillarInfo = alterEgo ? alterEgo[pillarId] : { target: 80, traits: [] };

  const progress = state.progress;
  let cycleXP = 0;
  let historicalXP = 0;

  if (pillarId === 'mente') {
    cycleXP = progress.currentCycleMenteXP || 0;
    historicalXP = progress.menteXP || 0;
  } else if (pillarId === 'corpo') {
    cycleXP = progress.currentCycleCorpoXP || 0;
    historicalXP = progress.corpoXP || 0;
  } else if (pillarId === 'alma') {
    cycleXP = progress.currentCycleAlmaXP || 0;
    historicalXP = progress.almaXP || 0;
  }

  const percent = Math.min(100, Math.round((cycleXP / requiredXP) * 100));
  const goals = getPillarGoals(state, pillarId);
  const target = pillarInfo.target;
  const distance = Math.max(0, target - percent);

  const titles: Record<PillarId, string> = {
    mente: 'MENTE',
    corpo: 'CORPO',
    alma: 'ALMA',
  };

  return {
    pillarId,
    title: titles[pillarId],
    cycleXP,
    historicalXP,
    percent,
    target,
    distance,
    traits: pillarInfo.traits || [],
    goals,
  };
}

export function bindEvolutionTriangleEvents(
  container: HTMLElement,
  state: AppState,
  callbacks: {
    onStateChange: (newState: AppState) => void;
    onRerender: () => void;
  }
): void {
  const card = container.querySelector('#evolution-triangle-card');
  if (!card) return;

  // Open Alter Ego Modal
  const openAlterEgoHandler = (e: Event) => {
    e.preventDefault();
    openAlterEgoModal(state, (newState) => {
      callbacks.onStateChange(newState);
      callbacks.onRerender();
    });
  };
  card.querySelector('#btn-open-alter-ego')?.addEventListener('click', openAlterEgoHandler);

  // Pillar Vertex Click Handlers
  card.querySelectorAll('[data-pillar-vertex]').forEach(el => {
    const handler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const pilar = el.getAttribute('data-pillar-vertex') as PillarId;
      selectedPillar = selectedPillar === pilar ? null : pilar;
      callbacks.onRerender();
    };
    el.addEventListener('click', handler);
  });

  // Dismiss context
  card.querySelector('#triangle-dismiss-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    selectedPillar = null;
    callbacks.onRerender();
  });

  // Add goal button inside context
  card.querySelector('#btn-add-meta-context')?.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPillar = ((e.currentTarget as HTMLElement).getAttribute('data-pillar') as PillarId) || 'mente';
    openGoalModal(state, {
      defaultPillar: targetPillar,
      onSave: (newState) => {
        callbacks.onStateChange(newState);
        callbacks.onRerender();
      },
    });
  });

  // Goal inline step buttons (-10% / +10% / edit)
  card.querySelectorAll('[data-action][data-goal-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      const goalId = btn.getAttribute('data-goal-id')!;
      const goal = state.goals?.find(g => g.id === goalId);
      if (!goal) return;

      if (action === 'increment') {
        const nextProg = Math.min(100, goal.progress + 10);
        const newState = updateGoalProgress(state, goalId, nextProg);
        callbacks.onStateChange(newState);
        callbacks.onRerender();
      } else if (action === 'decrement') {
        const nextProg = Math.max(0, goal.progress - 10);
        const newState = updateGoalProgress(state, goalId, nextProg);
        callbacks.onStateChange(newState);
        callbacks.onRerender();
      } else if (action === 'edit') {
        openGoalModal(state, {
          goalId,
          onSave: (newState) => {
            callbacks.onStateChange(newState);
            callbacks.onRerender();
          },
        });
      }
    });
  });
}
