// ========================================
// Resetando — Today Screen
// Main screen: progression summary, daily habits, pillars
// ========================================

import type { AppState, PillarId } from './models';
import { PILLARS } from './models';
import {
  getToday,
  ensureDailyHabits,
  getDailyHabitsForPillar,
  getDayProgress,
  getPillarProgress,
  toggleDailyHabit,
  createHabit,
  getStreak,
} from './storage';
import {
  getGlobalLevelInfo,
  getPillarLevelInfo,
} from './progression';
import { icon, pillarIcon } from './icons';

interface TodayCallbacks {
  onStateChange: (state: AppState) => void;
  onNavigateTab?: (tab: 'evolucao' | 'hoje' | 'habitos' | 'historico' | 'perfil') => void;
}

export function renderToday(container: HTMLElement, state: AppState, callbacks: TodayCallbacks): void {
  const today = getToday();

  // Ensure daily habits exist for today
  state = ensureDailyHabits(state, today);
  callbacks.onStateChange(state);

  const progress = getDayProgress(state, today);
  const streak = getStreak(state);

  const totalXp = state.totalXp || 0;
  const globalLevel = getGlobalLevelInfo(totalXp);

  const menteXp = state.pillarXp?.mente || 0;
  const corpoXp = state.pillarXp?.corpo || 0;
  const almaXp = state.pillarXp?.alma || 0;

  const menteLevel = getPillarLevelInfo(menteXp);
  const corpoLevel = getPillarLevelInfo(corpoXp);
  const almaLevel = getPillarLevelInfo(almaXp);

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <p class="page-label">visão geral</p>
        <h1 class="page-title">Hoje</h1>
      </div>

      ${streak > 0 ? `
        <div class="streak-badge">
          <span class="streak-icon">${icon('flame', 16)}</span>
          <span>${streak} ${streak === 1 ? 'dia' : 'dias'} de consistência</span>
        </div>
      ` : ''}

      <!-- Progression Summary Card (Section 17) -->
      <section class="today-progression-card" id="today-progression-card">
        <div class="today-progression-top">
          <div class="today-level-badge">
            <span class="level-badge-label">PROGRESSÃO GLOBAL</span>
            <span class="level-badge-value">NÍVEL ${globalLevel.level}</span>
          </div>
          <div class="today-xp-total">
            <span class="xp-value">${totalXp.toLocaleString('pt-BR')}</span>
            <span class="xp-unit">XP</span>
          </div>
        </div>

        <div class="today-xp-bar-wrap">
          <div class="today-xp-bar">
            <div class="today-xp-fill" style="width: ${globalLevel.progressPercent}%"></div>
          </div>
          <div class="today-xp-sub-row">
            <span class="today-xp-sub">${globalLevel.currentLevelXp} / ${globalLevel.xpForNextLevel} XP para Nível ${globalLevel.level + 1}</span>
            <span class="today-xp-pct">${globalLevel.progressPercent}%</span>
          </div>
        </div>

        <!-- Pillars Summary Pills -->
        <div class="today-pillars-pills">
          <div class="today-pillar-pill" data-nav-pillar="mente">
            <span class="pill-name">Mente</span>
            <span class="pill-stat">Nvl ${menteLevel.level} · ${menteXp} XP</span>
          </div>
          <div class="today-pillar-pill" data-nav-pillar="corpo">
            <span class="pill-name">Corpo</span>
            <span class="pill-stat">Nvl ${corpoLevel.level} · ${corpoXp} XP</span>
          </div>
          <div class="today-pillar-pill" data-nav-pillar="alma">
            <span class="pill-name">Alma</span>
            <span class="pill-stat">Nvl ${almaLevel.level} · ${almaXp} XP</span>
          </div>
        </div>

        <!-- Navigation link to Minha Evolução -->
        <button class="btn-today-evolution-link" id="btn-goto-evolution">
          <div class="btn-evolution-link-left">
            <span class="evolution-link-icon">${icon('triangle', 16)}</span>
            <span class="evolution-link-text">Minha Evolução</span>
          </div>
          <div class="btn-evolution-link-right">
            <span class="evolution-link-hint">Ver Triângulo</span>
            <span class="evolution-link-arrow">${icon('chevronRight', 16)}</span>
          </div>
        </button>
      </section>

      <!-- Daily Habit Progress -->
      <div class="progress-container">
        <div class="progress-summary">
          <span class="progress-number">${progress.completed}</span>
          <span class="progress-total">${progress.total > 0 ? `/ ${progress.total} hábitos concluídos hoje` : 'hábitos cadastrados'}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percent}%"></div>
        </div>
      </div>

      <!-- Pillars and Daily Habits List -->
      <div id="pillars-container">
        ${PILLARS.map(pillar => {
          const pillarProgress = getPillarProgress(state, today, pillar.id);
          const dailyHabits = getDailyHabitsForPillar(state, today, pillar.id);

          return `
            <div class="pillar-card">
              <div class="pillar-header">
                <div class="pillar-info">
                  <span class="pillar-icon">${pillarIcon(pillar.id, 18)}</span>
                  <span class="pillar-name">${pillar.name}</span>
                </div>
                <span class="pillar-count">${pillarProgress.completed} / ${pillarProgress.total}</span>
              </div>

              ${dailyHabits.length === 0 ? `
                <div class="empty-pillar-habits">
                  <p class="empty-pillar-text">Nenhum hábito cadastrado</p>
                  <button class="btn-today-add-habit" data-today-add-pillar="${pillar.id}">
                    ${icon('plus', 14)} <span>Adicionar hábito</span>
                  </button>
                </div>
              ` : `
                ${dailyHabits.map(dh => `
                  <div class="habit-item ${dh.completed ? 'completed' : ''}" data-daily-habit-id="${dh.id}">
                    <div class="habit-checkbox ${dh.completed ? 'checked' : ''}">
                      <span class="check-icon">${icon('check', 14)}</span>
                    </div>
                    <span class="habit-name">${dh.habitName}</span>
                    <span class="habit-xp-pill">+10 XP</span>
                  </div>
                `).join('')}

                ${dailyHabits.length < 3 ? `
                  <button class="btn-today-add-habit btn-add-more" data-today-add-pillar="${pillar.id}">
                    ${icon('plus', 12)} <span>Adicionar outro hábito (${dailyHabits.length}/3)</span>
                  </button>
                ` : ''}
              `}
            </div>
          `;
        }).join('')}
      </div>

      ${progress.total > 0 && progress.completed === progress.total ? `
        <div class="perfect-day">
          <div class="perfect-day-icon">${icon('sparkles', 40)}</div>
          <p class="perfect-day-title">Dia perfeito!</p>
          <p class="perfect-day-sub">Todos os ${progress.total} hábitos concluídos. Sua evolução agradece!</p>
        </div>
      ` : ''}
    </div>

    <div id="today-modal-container"></div>
  `;

  // Go to Minha Evolução tab
  container.querySelector('#btn-goto-evolution')?.addEventListener('click', () => {
    callbacks.onNavigateTab?.('evolucao');
  });

  // Pillars pills navigation
  container.querySelectorAll('[data-nav-pillar]').forEach(pill => {
    pill.addEventListener('click', () => {
      callbacks.onNavigateTab?.('evolucao');
    });
  });

  // Bind habit toggle events (instant +10 XP with toast & storage update)
  container.querySelectorAll('.habit-item[data-daily-habit-id]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-daily-habit-id');
      if (!id) return;
      const newState = toggleDailyHabit(state, id);
      renderToday(container, newState, callbacks);
    });
  });

  // Bind quick add habit from Today screen
  container.querySelectorAll('[data-today-add-pillar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pillarId = btn.getAttribute('data-today-add-pillar') as PillarId;
      if (!pillarId) return;
      showTodayAddModal(pillarId, state, callbacks, container);
    });
  });
}

function showTodayAddModal(
  pillarId: PillarId,
  state: AppState,
  callbacks: TodayCallbacks,
  mainContainer: HTMLElement
): void {
  const modalContainer = document.getElementById('today-modal-container');
  if (!modalContainer) return;

  const pillarObj = PILLARS.find(p => p.id === pillarId);
  const pillarTitle = pillarObj ? pillarObj.name : pillarId;

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="today-modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${pillarIcon(pillarId, 20)} Novo Hábito · ${pillarTitle}</h2>
        <p class="modal-subtitle" style="margin-top: 4px; margin-bottom: var(--spacing-md); color: var(--text-tertiary); font-size: var(--font-size-xs);">
          Cada conclusão diária gera +10 XP para o pilar ${pillarTitle}.
        </p>
        <input
          type="text"
          class="modal-input"
          id="today-habit-input"
          placeholder="Ex: Ler 10 páginas, Treinar 30 min..."
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions" style="margin-top: var(--spacing-md);">
          <button class="btn-secondary" id="today-modal-cancel">Cancelar</button>
          <button class="btn-primary" id="today-modal-save">Salvar Hábito</button>
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById('today-habit-input') as HTMLInputElement;
  input?.focus();

  const closeModal = () => { modalContainer.innerHTML = ''; };

  document.getElementById('today-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('today-modal-overlay')) closeModal();
  });

  document.getElementById('today-modal-cancel')?.addEventListener('click', closeModal);

  const saveHabit = () => {
    const name = input?.value?.trim();
    if (!name) return;
    const newState = createHabit(state, pillarId, name);
    callbacks.onStateChange(newState);
    closeModal();
    renderToday(mainContainer, newState, callbacks);
  };

  document.getElementById('today-modal-save')?.addEventListener('click', saveHabit);

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveHabit();
    if (e.key === 'Escape') closeModal();
  });
}
