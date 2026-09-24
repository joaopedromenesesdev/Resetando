// ========================================
// Resetando — Minha Evolução Screen
// Dedicated progression dashboard:
// Triângulo de Evolução, XP dos Pilares, Níveis, Metas e Alter Ego
// ========================================

import type { AppState, PillarId } from './models';
import { PILLARS } from './models';
import {
  getPillarGoals,
  updateGoalProgress,
} from './storage';
import {
  getGlobalLevelInfo,
  getPillarLevelInfo,
  getEvolutionScale,
  getPillarProgressPercent,
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

  const totalXp = state.totalXp || 0;
  const globalLevel = getGlobalLevelInfo(totalXp);

  const menteXp = state.pillarXp?.mente || 0;
  const corpoXp = state.pillarXp?.corpo || 0;
  const almaXp = state.pillarXp?.alma || 0;

  const maxPillarXp = Math.max(menteXp, corpoXp, almaXp);
  const scale = getEvolutionScale(maxPillarXp);
  const scaleMax = scale.tierMax;

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <p class="page-label">desenvolvimento acumulado</p>
        <h1 class="page-title">Minha Evolução</h1>
      </div>

      <!-- Global Progression Overview Card -->
      <div class="evolution-overview-card">
        <div class="overview-top">
          <div class="overview-level-wrap">
            <span class="overview-badge">NÍVEL GLOBAL</span>
            <div class="overview-level-number">${globalLevel.level}</div>
          </div>
          <div class="overview-xp-wrap">
            <span class="overview-xp-value">${totalXp.toLocaleString('pt-BR')} <span class="overview-xp-unit">XP</span></span>
            <span class="overview-xp-sub">${globalLevel.currentLevelXp} / ${globalLevel.xpForNextLevel} XP para Nível ${globalLevel.level + 1}</span>
          </div>
        </div>
        <div class="overview-bar">
          <div class="overview-fill" style="width: ${globalLevel.progressPercent}%"></div>
        </div>
      </div>

      <!-- Evolution Triangle Graphic Section -->
      ${renderEvolutionTriangleHtml(state)}

      <!-- Pillars Progression Cards -->
      <div class="section-title-wrap">
        <h3 class="section-title">Evolução por Pilar</h3>
        <span class="section-subtitle">XP acumulada em cada dimensão</span>
      </div>

      <div class="evolution-pillars-grid">
        ${PILLARS.map(p => {
          const xp = state.pillarXp?.[p.id] || 0;
          const levelInfo = getPillarLevelInfo(xp);
          const pct = getPillarProgressPercent(xp, scaleMax);
          const goals = getPillarGoals(state, p.id);
          const target = alterEgo ? alterEgo[p.id].target : null;

          return `
            <div class="evolution-pillar-card" data-evolution-pillar="${p.id}">
              <div class="pillar-card-top">
                <div class="pillar-name-wrap">
                  <span class="pillar-icon">${pillarIcon(p.id, 18)}</span>
                  <span class="pillar-card-title">${p.name}</span>
                </div>
                <div class="pillar-level-pill">
                  Nível ${levelInfo.level}
                </div>
              </div>

              <div class="pillar-xp-stats">
                <div class="pillar-xp-stat">
                  <span class="xp-stat-label">XP Acumulada</span>
                  <span class="xp-stat-num">${xp.toLocaleString('pt-BR')} XP</span>
                </div>
                <div class="pillar-xp-stat">
                  <span class="xp-stat-label">Triângulo</span>
                  <span class="xp-stat-num active">${pct}%</span>
                </div>
                ${target !== null ? `
                  <div class="pillar-xp-stat">
                    <span class="xp-stat-label">Alvo Alter Ego</span>
                    <span class="xp-stat-num">${target}%</span>
                  </div>
                ` : ''}
              </div>

              <!-- Level Progress Bar -->
              <div class="pillar-level-bar-wrap">
                <div class="pillar-level-bar">
                  <div class="pillar-level-fill" style="width: ${levelInfo.progressPercent}%"></div>
                </div>
                <span class="pillar-level-hint">
                  ${levelInfo.currentLevelXp} / ${levelInfo.xpForNextLevel} XP para Nível ${levelInfo.level + 1}
                </span>
              </div>

              <!-- Goals for this Pillar -->
              <div class="pillar-goals-preview">
                <div class="pillar-goals-head">
                  <span class="goals-head-label">Metas (${goals.length})</span>
                  <button class="btn-pillar-add-goal" data-add-goal-pillar="${p.id}">
                    ${icon('plus', 12)} Adicionar Meta
                  </button>
                </div>

                ${goals.length === 0 ? `
                  <p class="pillar-no-goals">Nenhuma meta ativa. Concluir uma meta rende +100 XP.</p>
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

      <!-- Optional Alter Ego Promo/Card (if user hasn't set one yet) -->
      ${!hasAlterEgo ? `
        <div class="alter-ego-optional-card">
          <div class="optional-card-content">
            <div class="optional-card-icon">${icon('target', 24)}</div>
            <div class="optional-card-text">
              <h4 class="optional-card-title">Alter Ego (Opcional)</h4>
              <p class="optional-card-desc">
                Defina uma referência pessoal de onde você quer chegar para comparar com sua evolução atual.
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

  // Goal step buttons (-10% / +10% / edit)
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
