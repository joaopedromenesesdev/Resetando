// ========================================
// Resetando — Triângulo de Evolução
// Visual map of long-term personal transformation:
// Alter Ego (Destination / "Quem eu quero ser") vs. Metas (Evolution / "Onde eu estou")
// ========================================

import type { AppState, PillarId } from './models';
import {
  getPillarGoals,
  getPillarEvolution,
  updateGoalProgress,
} from './storage';
import { openAlterEgoModal, openGoalModal } from './goals_modal';
import { icon } from './icons';

let selectedPillar: PillarId | null = null;

const VIEW_WIDTH = 350;
const VIEW_HEIGHT = 310;
const CX = 175;
const CY = 182;
const RADIUS = 148;

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

  const menteEvol = getPillarEvolution(state, 'mente');
  const corpoEvol = getPillarEvolution(state, 'corpo');
  const almaEvol = getPillarEvolution(state, 'alma');

  const totalGoals = (state.goals || []).length;
  const hasGoals = totalGoals > 0;

  // Alter Ego Points (Destination)
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

  // Evolution Points (Current based on Goals)
  const rem = menteEvol.hasGoals ? menteEvol.progress / 100 : 0;
  const rec = corpoEvol.hasGoals ? corpoEvol.progress / 100 : 0;
  const rea = almaEvol.hasGoals ? almaEvol.progress / 100 : 0;

  const pem = { x: CX + (VM.x - CX) * rem, y: CY + (VM.y - CY) * rem };
  const pec = { x: CX + (VC.x - CX) * rec, y: CY + (VC.y - CY) * rec };
  const pea = { x: CX + (VA.x - CX) * rea, y: CY + (VA.y - CY) * rea };

  const evolutionPointsStr = `${pem.x.toFixed(1)},${pem.y.toFixed(1)} ${pec.x.toFixed(1)},${pec.y.toFixed(1)} ${pea.x.toFixed(1)},${pea.y.toFixed(1)}`;

  const outerTriangleStr = getGuideTrianglePoints(1.0);
  const guide75 = getGuideTrianglePoints(0.75);
  const guide50 = getGuideTrianglePoints(0.5);
  const guide25 = getGuideTrianglePoints(0.25);

  const selectedContext = selectedPillar ? getContextData(selectedPillar, state) : null;

  return `
    <section class="evolution-triangle-card" id="evolution-triangle-card">
      <div class="triangle-header">
        <div class="triangle-header-left">
          <span class="triangle-badge">Longo Prazo</span>
          <h2 class="triangle-title">TRIÂNGULO DE EVOLUÇÃO</h2>
        </div>
        <button class="btn-config-alter-ego" id="btn-open-alter-ego" title="Configurar Alter Ego">
          ${icon('target', 14)} <span>${hasAlterEgo ? alterEgo.name : 'Criar Alter Ego'}</span>
        </button>
      </div>

      <!-- State 1: No Alter Ego -->
      ${!hasAlterEgo ? `
        <div class="triangle-empty-banner">
          <p class="empty-banner-title">Defina seu Alter Ego para descobrir sua direção.</p>
          <p class="empty-banner-desc">Quem você quer se tornar? Estabeleça seus alvos para Mente, Corpo e Alma.</p>
          <button class="btn btn-primary btn-sm" id="btn-empty-alter-ego">
            Definir Alter Ego
          </button>
        </div>
      ` : ''}

      <!-- SVG Graph Section -->
      <div class="triangle-svg-wrapper">
        <svg
          class="triangle-svg"
          viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}"
          width="100%"
          height="auto"
          role="img"
          aria-label="Triângulo de Evolução: Alter Ego vs Metas"
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
          <circle cx="${CX}" cy="${CY}" r="2" class="triangle-center-point" />

          <!-- Alter Ego Triangle (Destino / Linha Dourada Discreta) -->
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

          <!-- Evolution Triangle (Onde estou / Preenchimento Dourado Forte) -->
          ${hasAlterEgo && hasGoals ? `
            <polygon
              id="evolution-progress-polygon"
              points="${evolutionPointsStr}"
              class="triangle-inner-area"
            />
            ${menteEvol.hasGoals ? `<circle cx="${pem.x.toFixed(1)}" cy="${pem.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />` : ''}
            ${corpoEvol.hasGoals ? `<circle cx="${pec.x.toFixed(1)}" cy="${pec.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />` : ''}
            ${almaEvol.hasGoals ? `<circle cx="${pea.x.toFixed(1)}" cy="${pea.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />` : ''}
          ` : ''}

          <!-- Outer Anchor Dots -->
          <circle cx="${VM.x.toFixed(1)}" cy="${VM.y.toFixed(1)}" r="3" class="triangle-outer-dot ${selectedPillar === 'mente' ? 'selected' : ''}" />
          <circle cx="${VC.x.toFixed(1)}" cy="${VC.y.toFixed(1)}" r="3" class="triangle-outer-dot ${selectedPillar === 'corpo' ? 'selected' : ''}" />
          <circle cx="${VA.x.toFixed(1)}" cy="${VA.y.toFixed(1)}" r="3" class="triangle-outer-dot ${selectedPillar === 'alma' ? 'selected' : ''}" />

          <!-- MENTE Vertex Labels (Top) -->
          <g class="triangle-vertex-group ${selectedPillar === 'mente' ? 'selected' : ''}" data-pillar-vertex="mente" role="button" tabindex="0">
            <circle cx="${CX}" cy="20" r="36" class="triangle-touch-target" />
            <text x="${CX}" y="14" class="triangle-label-name" text-anchor="middle">MENTE</text>
            <text x="${CX}" y="27" class="triangle-label-stats" text-anchor="middle">
              ${hasAlterEgo ? (menteEvol.hasGoals ? `Alvo: ${targetM}% · Atual: ${menteEvol.progress}%` : `Alvo: ${targetM}% · Sem metas`) : 'Definir'}
            </text>
          </g>

          <!-- CORPO Vertex Labels (Bottom-Left) -->
          <g class="triangle-vertex-group ${selectedPillar === 'corpo' ? 'selected' : ''}" data-pillar-vertex="corpo" role="button" tabindex="0">
            <circle cx="${(VC.x).toFixed(1)}" cy="280" r="36" class="triangle-touch-target" />
            <text x="${(VC.x).toFixed(1)}" y="280" class="triangle-label-name" text-anchor="middle">CORPO</text>
            <text x="${(VC.x).toFixed(1)}" y="294" class="triangle-label-stats" text-anchor="middle">
              ${hasAlterEgo ? (corpoEvol.hasGoals ? `Alvo: ${targetC}% · Atual: ${corpoEvol.progress}%` : `Alvo: ${targetC}% · Sem metas`) : 'Definir'}
            </text>
          </g>

          <!-- ALMA Vertex Labels (Bottom-Right) -->
          <g class="triangle-vertex-group ${selectedPillar === 'alma' ? 'selected' : ''}" data-pillar-vertex="alma" role="button" tabindex="0">
            <circle cx="${(VA.x).toFixed(1)}" cy="280" r="36" class="triangle-touch-target" />
            <text x="${(VA.x).toFixed(1)}" y="280" class="triangle-label-name" text-anchor="middle">ALMA</text>
            <text x="${(VA.x).toFixed(1)}" y="294" class="triangle-label-stats" text-anchor="middle">
              ${hasAlterEgo ? (almaEvol.hasGoals ? `Alvo: ${targetA}% · Atual: ${almaEvol.progress}%` : `Alvo: ${targetA}% · Sem metas`) : 'Definir'}
            </text>
          </g>
        </svg>
      </div>

      <!-- Legend -->
      ${hasAlterEgo ? `
        <div class="triangle-legend">
          <div class="legend-item">
            <span class="legend-line legend-alter-ego"></span>
            <span class="legend-text">Destino (Alter Ego)</span>
          </div>
          <div class="legend-item">
            <span class="legend-box legend-evolution"></span>
            <span class="legend-text">Evolução Atual (Metas)</span>
          </div>
        </div>
      ` : ''}

      <!-- State 2: Has Alter Ego, but no goals -->
      ${hasAlterEgo && !hasGoals ? `
        <div class="triangle-empty-banner">
          <p class="empty-banner-title">Crie metas para começar sua evolução.</p>
          <p class="empty-banner-desc">O triângulo pontilhado acima representa onde você quer chegar. Suas metas movimentarão o triângulo da evolução.</p>
          <button class="btn btn-primary btn-sm" id="btn-empty-create-goal">
            + Adicionar Primeira Meta
          </button>
        </div>
      ` : ''}

      <!-- Contextual Inspector (Active Pillar) -->
      <div class="triangle-context-panel ${selectedContext ? 'visible' : ''}" id="triangle-context-panel">
        ${selectedContext ? `
          <div class="triangle-context-card">
            <div class="triangle-context-top">
              <div class="context-pillar-header">
                <span class="triangle-context-pillar">${selectedContext.title}</span>
                <span class="context-distance-badge">
                  Distância: ${selectedContext.distance} ${selectedContext.distance === 1 ? 'ponto' : 'pontos'}
                </span>
              </div>
              <button class="triangle-context-dismiss" id="triangle-dismiss-btn" aria-label="Fechar">&times;</button>
            </div>

            <div class="context-stats-grid">
              <div class="context-stat-box">
                <span class="stat-box-label">Alter Ego (Alvo)</span>
                <span class="stat-box-value">${selectedContext.target}%</span>
              </div>
              <div class="context-stat-box">
                <span class="stat-box-label">Evolução Atual</span>
                <span class="stat-box-value ${selectedContext.hasGoals ? 'active' : ''}">
                  ${selectedContext.hasGoals ? `${selectedContext.progress}%` : 'Sem metas'}
                </span>
              </div>
            </div>

            <!-- Traits from Alter Ego -->
            ${selectedContext.traits.length > 0 ? `
              <div class="context-traits-row">
                ${selectedContext.traits.map(t => `<span class="context-trait-chip">${t}</span>`).join('')}
              </div>
            ` : ''}

            <!-- Goals List -->
            <div class="context-goals-section">
              <div class="context-goals-header">
                <span class="context-goals-title">Metas Responsáveis (${selectedContext.goals.length})</span>
                <button class="btn-add-meta-small" id="btn-add-meta-context" data-pillar="${selectedContext.pillarId}">
                  ${icon('plus', 12)} Adicionar Meta
                </button>
              </div>

              ${selectedContext.goals.length === 0 ? `
                <p class="context-no-goals">Nenhuma meta associada a este pilar ainda. Adicione uma meta para começar a evoluir.</p>
              ` : `
                <div class="context-goals-list">
                  ${selectedContext.goals.map(g => `
                    <div class="context-goal-item" data-goal-id="${g.id}">
                      <div class="goal-item-main">
                        <span class="goal-item-title">${g.title}</span>
                        <div class="goal-item-controls">
                          <button class="goal-step-btn" data-action="decrement" data-goal-id="${g.id}">-10%</button>
                          <span class="goal-item-pct">${g.progress}%</span>
                          <button class="goal-step-btn" data-action="increment" data-goal-id="${g.id}">+10%</button>
                          <button class="goal-edit-btn" data-action="edit" data-goal-id="${g.id}" title="Editar Meta">
                            ${icon('edit', 13)}
                          </button>
                        </div>
                      </div>
                      <div class="goal-mini-bar">
                        <div class="goal-mini-fill" style="width: ${g.progress}%"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        ` : `
          <p class="triangle-context-hint">Toque em Mente, Corpo ou Alma para gerenciar metas e ver a distância para o Alter Ego</p>
        `}
      </div>
    </section>
  `;
}

function getContextData(pillarId: PillarId, state: AppState) {
  const alterEgo = state.alterEgo;
  const pillarInfo = alterEgo ? alterEgo[pillarId] : { target: 80, traits: [] };
  const evol = getPillarEvolution(state, pillarId);
  const goals = getPillarGoals(state, pillarId);
  const target = pillarInfo.target;
  const progress = evol.progress;
  const distance = Math.max(0, target - progress);

  const titles: Record<PillarId, string> = {
    mente: 'MENTE',
    corpo: 'CORPO',
    alma: 'ALMA',
  };

  return {
    pillarId,
    title: titles[pillarId],
    target,
    progress,
    distance,
    hasGoals: evol.hasGoals,
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
  card.querySelector('#btn-empty-alter-ego')?.addEventListener('click', openAlterEgoHandler);

  // Open Goal Modal (empty state)
  card.querySelector('#btn-empty-create-goal')?.addEventListener('click', (e) => {
    e.preventDefault();
    openGoalModal(state, {
      onSave: (newState) => {
        callbacks.onStateChange(newState);
        callbacks.onRerender();
      },
    });
  });

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
    const targetPillar = (e.currentTarget as HTMLElement).getAttribute('data-pillar') as PillarId || 'mente';
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
