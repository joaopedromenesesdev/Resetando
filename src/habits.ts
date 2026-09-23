// ========================================
// Resetando — Habits Management Screen
// View, edit, reorder habits
// ========================================

import type { AppState, PillarId } from './models';
import { PILLARS } from './models';
import {
  getActiveHabitsForPillar,
  replaceHabit,
  createHabit,
  retireHabit,
} from './storage';
import { icon, pillarIcon } from './icons';

interface HabitsCallbacks {
  onStateChange: (state: AppState) => void;
}

export function renderHabits(container: HTMLElement, state: AppState, callbacks: HabitsCallbacks): void {
  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <p class="page-label">gerenciar</p>
        <h1 class="page-title">Hábitos</h1>
      </div>

      <div class="notice-banner">
        ${icon('alertTriangle', 16)}
        <span>Alterações nos hábitos serão aplicadas a partir de amanhã.</span>
      </div>

      ${PILLARS.map(pillar => {
        const habits = getActiveHabitsForPillar(state, pillar.id);

        return `
          <div class="habits-section">
            <div class="habits-section-header">
              <div class="habits-section-title">
                ${pillarIcon(pillar.id, 18)}
                <span>${pillar.name}</span>
              </div>
              <span style="font-size: var(--font-size-sm); color: var(--text-tertiary);">${habits.length}/3</span>
            </div>

            ${habits.map((habit, index) => `
              <div class="habit-manage-item" data-habit-id="${habit.id}" data-pillar="${pillar.id}">
                <span class="habit-order">${index + 1}</span>
                <span class="habit-manage-name">${habit.name}</span>
                <button class="habit-edit-btn" data-edit-id="${habit.id}" aria-label="Editar hábito">
                  ${icon('edit', 16)}
                </button>
              </div>
            `).join('')}

            ${habits.length < 3 ? `
              <button class="btn-secondary btn-with-icon" data-add-pillar="${pillar.id}" style="margin-top: var(--spacing-xs);">
                ${icon('plus', 16)}
                <span>Adicionar hábito</span>
              </button>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div id="habit-modal-container"></div>
  `;

  // Bind edit buttons
  container.querySelectorAll('[data-edit-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.getAttribute('data-edit-id');
      if (!habitId) return;
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) return;
      showEditModal(state, habitId, habit.name, habit.pillarId, callbacks, container);
    });
  });

  // Bind add buttons
  container.querySelectorAll('[data-add-pillar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pillarId = btn.getAttribute('data-add-pillar') as PillarId;
      if (!pillarId) return;
      showAddModal(state, pillarId, callbacks, container);
    });
  });
}

function showEditModal(
  state: AppState,
  habitId: string,
  currentName: string,
  pillarId: PillarId,
  callbacks: HabitsCallbacks,
  mainContainer: HTMLElement
): void {
  const modalContainer = document.getElementById('habit-modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${pillarIcon(pillarId, 20)} Editar hábito</h2>
        <input
          type="text"
          class="modal-input"
          id="modal-input"
          value="${currentName}"
          placeholder="Nome do hábito"
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancelar</button>
          <button class="btn-primary" id="modal-save">Salvar</button>
        </div>
        <button class="btn-danger" id="modal-delete">
          ${icon('trash', 14)}
          Remover este hábito
        </button>
      </div>
    </div>
  `;

  const input = document.getElementById('modal-input') as HTMLInputElement;
  input?.focus();
  input?.select();

  const closeModal = () => { modalContainer.innerHTML = ''; };

  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

  document.getElementById('modal-save')?.addEventListener('click', () => {
    const newName = input?.value?.trim();
    if (!newName) return;
    if (newName !== currentName) {
      const newState = replaceHabit(state, habitId, newName);
      callbacks.onStateChange(newState);
      renderHabits(mainContainer, newState, callbacks);
    }
    closeModal();
  });

  document.getElementById('modal-delete')?.addEventListener('click', () => {
    const newState = retireHabit(state, habitId);
    callbacks.onStateChange(newState);
    renderHabits(mainContainer, newState, callbacks);
    closeModal();
  });
}

function showAddModal(
  state: AppState,
  pillarId: PillarId,
  callbacks: HabitsCallbacks,
  mainContainer: HTMLElement
): void {
  const modalContainer = document.getElementById('habit-modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${pillarIcon(pillarId, 20)} Novo hábito</h2>
        <input
          type="text"
          class="modal-input"
          id="modal-input"
          placeholder="Nome do hábito"
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancelar</button>
          <button class="btn-primary" id="modal-save">Adicionar</button>
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById('modal-input') as HTMLInputElement;
  input?.focus();

  const closeModal = () => { modalContainer.innerHTML = ''; };

  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

  document.getElementById('modal-save')?.addEventListener('click', () => {
    const name = input?.value?.trim();
    if (!name) return;
    const newState = createHabit(state, pillarId, name);
    callbacks.onStateChange(newState);
    renderHabits(mainContainer, newState, callbacks);
    closeModal();
  });
}
