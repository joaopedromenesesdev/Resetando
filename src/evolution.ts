// ========================================
// Resetando — Minha Evolução Screen
// Dedicated progression dashboard:
// Triângulo de Evolução do Nível Atual, XP do Ciclo, Histórico Total e Metas
// ========================================

import type { AppState, PillarId } from './models';
import { PILLARS } from './models';
import {
  getPillarGoals,
  updateGoalProgress,
} from './storage';
import {
  getCurrentLevelProgress,
} from './progression';
import {
  renderEvolutionTriangleHtml,
  bindEvolutionTriangleEvents,
} from './triangle';
import { openAlterEgoModal, openGoalModal } from './goals_modal';
import { icon, pillarIcon } from './icons';

interface EvolutionCallbacks {
  onStateChange: (state: AppState) => void;
  onNavigateTab?: (tab: 'hoje' | 'habitos' | 'historico' | 'perfil') => void;
}

export function renderEvolution(
  container: HTMLElement,
  state: AppState,
  callbacks: EvolutionCallbacks
): void {
  const alterEgo = state.alterEgo;
  const hasAlterEgo = !!alterEgo;

  const progress = state.progress;
  const levelData = getCurrentLevelProgress(progress);
  const currentLevel = levelData.currentLevel;
  const requiredXP = levelData.requiredXP;
  const nextLevel = currentLevel + 1;
  const totalXP = progress.totalXP || 0;

  // Average completion of current level
  const avgLevelProgress = Math.round(
    (levelData.mente.percent + levelData.corpo.percent + levelData.alma.percent) / 3
  );

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <p class="page-label">desenvolvimento pessoal</p>
        <h1 class="page-title">Minha Evolução</h1>
      </div>

      <!-- Current Level & Historical XP Overview Card (Section 13) -->
      <div class="evolution-overview-card">
        <div class="overview-top">
          <div class="overview-level-wrap">
            <span class="overview-badge">NÍVEL ATUAL</span>
            <div class="overview-level-number">${currentLevel}</div>
          </div>
          <div class="overview-xp-wrap">
            <span class="overview-xp-value">${totalXP.toLocaleString('pt-BR')} <span class="overview-xp-unit">XP TOTAL</span></span>
            <span class="overview-xp-sub">Próximo: Nível ${nextLevel} (${(requiredXP * 2).toLocaleString('pt-BR')} XP por pilar)</span>
          </div>
        </div>

        <div class="overview-cycle-summary">
          <div class="cycle-summary-header">
            <span class="cycle-summary-title">Progresso do Ciclo (${avgLevelProgress}%)</span>
            <span class="cycle-summary-meta">Requisito: ${requiredXP.toLocaleString('pt-BR')} XP por pilar</span>
          </div>
          <div class="overview-bar">
            <div class="overview-fill" style="width: ${avgLevelProgress}%"></div>
          </div>
        </div>
      </div>

      <!-- Evolution Triangle Graphic Section -->
      ${renderEvolutionTriangleHtml(state)}

      <!-- Pillars Progression Breakdown for Current Level (Section 13) -->
      <div class="section-title-wrap">
        <h3 class="section-title">Progresso do Nível ${currentLevel}</h3>
        <span class="section-subtitle">XP acumulado no ciclo atual para avançar de nível</span>
      </div>

      <div class="evolution-pillars-grid">
        ${PILLARS.map(p => {
          let cycleXP = 0;
          let historicalXP = 0;

          if (p.id === 'mente') {
            cycleXP = progress.currentCycleMenteXP || 0;
            historicalXP = progress.menteXP || 0;
          } else if (p.id === 'corpo') {
            cycleXP = progress.currentCycleCorpoXP || 0;
            historicalXP = progress.corpoXP || 0;
          } else if (p.id === 'alma') {
            cycleXP = progress.currentCycleAlmaXP || 0;
            historicalXP = progress.almaXP || 0;
          }

          const pct = Math.min(100, Math.round((cycleXP / requiredXP) * 100));
          const goals = getPillarGoals(state, p.id);
          const target = alterEgo ? alterEgo[p.id].target : null;

          return `
            <div class="evolution-pillar-card" data-evolution-pillar="${p.id}">
              <div class="pillar-card-top">
                <div class="pillar-name-wrap">
                  <span class="pillar-icon">${pillarIcon(p.id, 18)}</span>
                  <span class="pillar-card-title">${p.name}</span>
                </div>
                <div class="pillar-level-pill ${pct >= 100 ? 'ready' : ''}">
                  ${pct >= 100 ? `${icon('check', 12)} Requisito Atingido` : `${pct}% do nível`}
                </div>
              </div>

              <!-- Cycle Progress Bar -->
              <div class="pillar-level-bar-wrap">
                <div class="pillar-level-bar">
                  <div class="pillar-level-fill" style="width: ${pct}%"></div>
                </div>
                <div class="pillar-cycle-nums">
                  <span class="cycle-current">${cycleXP.toLocaleString('pt-BR')} / ${requiredXP.toLocaleString('pt-BR')} XP</span>
                  ${target !== null ? `<span class="cycle-historical">Alvo: ${target}% · Total: ${historicalXP.toLocaleString('pt-BR')} XP</span>` : `<span class="cycle-historical">Total: ${historicalXP.toLocaleString('pt-BR')} XP</span>`}
                </div>
              </div>

              <!-- Goals for this Pillar -->
              <div class="pillar-goals-preview">
                <div class="pillar-goals-head">
                  <span class="goals-head-label">Metas de ${p.name} (${goals.length})</span>
                  <button class="btn-pillar-add-goal" data-add-goal-pillar="${p.id}">
                    ${icon('plus', 12)} Nova Meta (+100 XP)
                  </button>
                </div>

                ${goals.length === 0 ? `
                  <p class="pillar-no-goals">Nenhuma meta ativa. Concluir uma meta rende +100 XP para o ciclo!</p>
                ` : `
                  <div class="pillar-goals-mini-list">
                    ${goals.map(g => `
                      <div class="goal-mini-item">
                        <div class="goal-mini-main">
                          <span class="goal-mini-title">${g.title}</span>
                          <div class="goal-mini-actions">
                            <button class="goal-mini-btn" data-goal-step="dec" data-goal-id="${g.id}">-10%</button>
                            <span class="goal-mini-pct ${g.completed ? 'completed' : ''}">${g.progress}%</span>
                            <button class="goal-mini-btn" data-goal-step="inc" data-goal-id="${g.id}">+10%</button>
                            <button class="goal-mini-edit" data-goal-edit-id="${g.id}" title="Editar Meta">
                              ${icon('edit', 12)}
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
          `;
        }).join('')}
      </div>

      <!-- Optional Alter Ego Reference Info (Section 17) -->
      ${!hasAlterEgo ? `
        <div class="alter-ego-optional-card">
          <div class="optional-card-content">
            <div class="optional-card-icon">${icon('target', 24)}</div>
            <div class="optional-card-text">
              <h4 class="optional-card-title">Alter Ego (Opcional)</h4>
              <p class="optional-card-desc">
                Defina uma referência pessoal de onde você quer chegar para visualizar junto ao seu triângulo.
              </p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-create-alter-ego-bottom">
            Definir Referência
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // Bind evolution triangle interactions
  bindEvolutionTriangleEvents(container, state, {
    onStateChange: (newState) => {
      state = newState;
      callbacks.onStateChange(newState);
    },
    onRerender: () => {
      renderEvolution(container, state, callbacks);
    },
  });

  // Alter ego button from optional card
  container.querySelector('#btn-create-alter-ego-bottom')?.addEventListener('click', () => {
    openAlterEgoModal(state, (newState) => {
      callbacks.onStateChange(newState);
      renderEvolution(container, newState, callbacks);
    });
  });

  // Add goal button from pillar cards
  container.querySelectorAll('[data-add-goal-pillar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pillarId = btn.getAttribute('data-add-goal-pillar') as PillarId;
      openGoalModal(state, {
        defaultPillar: pillarId,
        onSave: (newState) => {
          callbacks.onStateChange(newState);
          renderEvolution(container, newState, callbacks);
        },
      });
    });
  });

  // Goal step buttons (-10% / +10%)
  container.querySelectorAll('[data-goal-step]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const step = btn.getAttribute('data-goal-step');
      const goalId = btn.getAttribute('data-goal-id')!;
      const goal = state.goals?.find(g => g.id === goalId);
      if (!goal) return;

      if (step === 'inc') {
        const next = Math.min(100, goal.progress + 10);
        const newState = updateGoalProgress(state, goalId, next);
        callbacks.onStateChange(newState);
        renderEvolution(container, newState, callbacks);
      } else if (step === 'dec') {
        const next = Math.max(0, goal.progress - 10);
        const newState = updateGoalProgress(state, goalId, next);
        callbacks.onStateChange(newState);
        renderEvolution(container, newState, callbacks);
      }
    });
  });

  // Goal edit buttons
  container.querySelectorAll('[data-goal-edit-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const goalId = btn.getAttribute('data-goal-edit-id')!;
      openGoalModal(state, {
        goalId,
        onSave: (newState) => {
          callbacks.onStateChange(newState);
          renderEvolution(container, newState, callbacks);
        },
      });
    });
  });
}
