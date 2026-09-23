// ========================================
// Resetando — Tela Inicial Única
// Minimalist, premium entry screen
// ========================================

import type { AppState } from './models';
import { completeOnboarding, saveState } from './storage';
import { renderLogoSvg } from './logo';

interface OnboardingCallbacks {
  onComplete: (state: AppState) => void;
}

export function renderOnboarding(container: HTMLElement, state: AppState, callbacks: OnboardingCallbacks): void {
  container.innerHTML = `
    <div class="onboarding">
      <div class="onboarding-slide">
        <div class="onboarding-icon">
          <div class="hero-logo-wrap">${renderLogoSvg(72, 'hero-logo')}</div>
        </div>
        <h1 class="onboarding-title onboarding-brand">
          <span class="gold">RESET</span>ANDO
        </h1>
        <p class="onboarding-subtitle">
          Uma nova versão de você começa com pequenas ações diárias.
        </p>
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: var(--spacing-sm); padding-bottom: var(--spacing-lg);">
        <button class="btn-primary" id="onboarding-start-btn">Continuar</button>
      </div>
    </div>
  `;

  document.getElementById('onboarding-start-btn')?.addEventListener('click', () => {
    const newState = completeOnboarding(state);
    saveState(newState);
    callbacks.onComplete(newState);
  });
}
