// ========================================
// Resetando — Alter Ego & Metas Modals
// Clean, mobile-first modals for defining destination & goals
// ========================================

import type { AppState, PillarId, AlterEgo, Goal } from './models';
import { PILLARS } from './models';
import {
  saveAlterEgo,
  createGoal,
  updateGoal,
  deleteGoal,
} from './storage';
import { icon } from './icons';

export function openAlterEgoModal(
  state: AppState,
  onSave: (newState: AppState) => void
): void {
  const existing = state.alterEgo || {
    name: 'Minha melhor versão',
    mente: { target: 90, traits: ['disciplinado', 'focado', 'intelectualmente desenvolvido'] },
    corpo: { target: 75, traits: ['saudável', 'ativo', 'consistente'] },
    alma: { target: 85, traits: ['equilibrado', 'presente', 'conectado com seus valores'] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const modalHtml = `
    <div class="modal-backdrop" id="alter-ego-modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="modal-badge">Direção & Destino</span>
            <h2 class="modal-title">Configurar Alter Ego</h2>
          </div>
          <button class="modal-close" id="alter-ego-close-btn" aria-label="Fechar">&times;</button>
        </div>

        <p class="modal-description">
          O Alter Ego representa quem você deseja se tornar. Defina os alvos de evolução (0 a 100) para cada pilar.
        </p>

        <form id="alter-ego-form" class="modal-form">
          <div class="form-group">
            <label class="form-label" for="ae-name">Nome do seu Alter Ego</label>
            <input
              type="text"
              id="ae-name"
              class="form-input"
              value="${existing.name}"
              placeholder="Ex: Minha melhor versão, Eu 2.0"
              required
            />
          </div>

          <!-- MENTE -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">MENTE</span>
              <span class="ae-pillar-val" id="ae-mente-val">${existing.mente.target}%</span>
            </div>
            <input
              type="range"
              id="ae-mente-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${existing.mente.target}"
            />
            <input
              type="text"
              id="ae-mente-traits"
              class="form-input-subtle"
              value="${existing.mente.traits.join(', ')}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <!-- CORPO -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">CORPO</span>
              <span class="ae-pillar-val" id="ae-corpo-val">${existing.corpo.target}%</span>
            </div>
            <input
              type="range"
              id="ae-corpo-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${existing.corpo.target}"
            />
            <input
              type="text"
              id="ae-corpo-traits"
              class="form-input-subtle"
              value="${existing.corpo.traits.join(', ')}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <!-- ALMA -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">ALMA</span>
              <span class="ae-pillar-val" id="ae-alma-val">${existing.alma.target}%</span>
            </div>
            <input
              type="range"
              id="ae-alma-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${existing.alma.target}"
            />
            <input
              type="text"
              id="ae-alma-traits"
              class="form-input-subtle"
              value="${existing.alma.traits.join(', ')}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="alter-ego-cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="alter-ego-save-btn">Salvar Alter Ego</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Remove any open modal
  document.getElementById('alter-ego-modal-backdrop')?.remove();

  // Append to body
  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHtml;
  document.body.appendChild(wrapper.firstElementChild!);

  const backdrop = document.getElementById('alter-ego-modal-backdrop')!;
  const close = () => backdrop.remove();

  document.getElementById('alter-ego-close-btn')?.addEventListener('click', close);
  document.getElementById('alter-ego-cancel-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Range slider visual feedback
  const bindSlider = (sliderId: string, valId: string) => {
    const slider = document.getElementById(sliderId) as HTMLInputElement;
    const valSpan = document.getElementById(valId);
    if (slider && valSpan) {
      slider.addEventListener('input', () => {
        valSpan.textContent = `${slider.value}%`;
      });
    }
  };
  bindSlider('ae-mente-target', 'ae-mente-val');
  bindSlider('ae-corpo-target', 'ae-corpo-val');
  bindSlider('ae-alma-target', 'ae-alma-val');

  // Submit handler
  const form = document.getElementById('alter-ego-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('ae-name') as HTMLInputElement;
    const menteTarget = Number((document.getElementById('ae-mente-target') as HTMLInputElement).value);
    const corpoTarget = Number((document.getElementById('ae-corpo-target') as HTMLInputElement).value);
    const almaTarget = Number((document.getElementById('ae-alma-target') as HTMLInputElement).value);

    const menteTraits = (document.getElementById('ae-mente-traits') as HTMLInputElement).value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const corpoTraits = (document.getElementById('ae-corpo-traits') as HTMLInputElement).value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const almaTraits = (document.getElementById('ae-alma-traits') as HTMLInputElement).value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newAlterEgo: AlterEgo = {
      name: nameInput.value.trim() || 'Minha melhor versão',
      mente: { target: menteTarget, traits: menteTraits },
      corpo: { target: corpoTarget, traits: corpoTraits },
      alma: { target: almaTarget, traits: almaTraits },
      createdAt: state.alterEgo?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    close();
    const newState = saveAlterEgo(state, newAlterEgo);
    onSave(newState);
  });
}

export function openGoalModal(
  state: AppState,
  options: {
    goalId?: string;
    defaultPillar?: PillarId;
    onSave: (newState: AppState) => void;
  }
): void {
  const existingGoal: Goal | undefined = options.goalId
    ? state.goals?.find(g => g.id === options.goalId)
    : undefined;

  const currentPillar: PillarId = existingGoal?.pillarId || options.defaultPillar || 'mente';
  const currentTitle = existingGoal?.title || '';
  const currentProgress = existingGoal?.progress !== undefined ? existingGoal.progress : 50;

  const modalHtml = `
    <div class="modal-backdrop" id="goal-modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="modal-badge">Construção & Evolução</span>
            <h2 class="modal-title">${existingGoal ? 'Editar Meta' : 'Nova Meta de Evolução'}</h2>
          </div>
          <button class="modal-close" id="goal-close-btn" aria-label="Fechar">&times;</button>
        </div>

        <form id="goal-form" class="modal-form">
          <div class="form-group">
            <label class="form-label" for="goal-title">Título da Meta</label>
            <input
              type="text"
              id="goal-title"
              class="form-input"
              value="${currentTitle}"
              placeholder="Ex: Aprender Python avançado, Ler 12 livros no ano"
              required
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pilar Fundamental</label>
            <div class="pillar-selector">
              ${PILLARS.map(p => `
                <label class="pillar-choice ${currentPillar === p.id ? 'active' : ''}">
                  <input
                    type="radio"
                    name="goal-pillar"
                    value="${p.id}"
                    ${currentPillar === p.id ? 'checked' : ''}
                  />
                  <span>${p.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <div class="goal-slider-header">
              <label class="form-label" for="goal-progress">Progresso Atual</label>
              <span class="goal-slider-value" id="goal-progress-display">${currentProgress}%</span>
            </div>
            <input
              type="range"
              id="goal-progress"
              class="form-range"
              min="0"
              max="100"
              step="5"
              value="${currentProgress}"
            />
          </div>

          <div class="modal-actions">
            ${existingGoal ? `
              <button type="button" class="btn btn-danger-subtle" id="goal-delete-btn">
                ${icon('trash', 14)} Excluir
              </button>
            ` : ''}
            <button type="button" class="btn btn-secondary" id="goal-cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="goal-save-btn">
              ${existingGoal ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('goal-modal-backdrop')?.remove();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHtml;
  document.body.appendChild(wrapper.firstElementChild!);

  const backdrop = document.getElementById('goal-modal-backdrop')!;
  const close = () => backdrop.remove();

  document.getElementById('goal-close-btn')?.addEventListener('click', close);
  document.getElementById('goal-cancel-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Slider progress update
  const slider = document.getElementById('goal-progress') as HTMLInputElement;
  const display = document.getElementById('goal-progress-display');
  if (slider && display) {
    slider.addEventListener('input', () => {
      display.textContent = `${slider.value}%`;
    });
  }

  // Pillar radio styling update
  document.querySelectorAll('input[name="goal-pillar"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pillar-choice').forEach(c => c.classList.remove('active'));
      radio.closest('.pillar-choice')?.classList.add('active');
    });
  });

  // Delete handler
  if (existingGoal) {
    document.getElementById('goal-delete-btn')?.addEventListener('click', () => {
      if (confirm(`Deseja excluir a meta "${existingGoal.title}"?`)) {
        close();
        const newState = deleteGoal(state, existingGoal.id);
        options.onSave(newState);
      }
    });
  }

  // Submit handler
  const form = document.getElementById('goal-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('goal-title') as HTMLInputElement;
    const selectedPillar = (document.querySelector('input[name="goal-pillar"]:checked') as HTMLInputElement)?.value as PillarId || 'mente';
    const progressVal = Number(slider.value);

    close();
    let newState = state;
    if (existingGoal) {
      newState = updateGoal(state, existingGoal.id, {
        title: titleInput.value.trim(),
        pillarId: selectedPillar,
        progress: progressVal,
      });
    } else {
      newState = createGoal(state, selectedPillar, titleInput.value.trim(), progressVal);
    }
    options.onSave(newState);
  });
}
