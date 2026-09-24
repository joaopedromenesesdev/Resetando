// ========================================
// Resetando — Tela Inicial Única
// Minimalist, premium entry screen with animated video
// ========================================

import type { AppState } from './models';
import { completeOnboarding, saveState } from './storage';

interface OnboardingCallbacks {
  onComplete: (state: AppState) => void;
}

export function renderOnboarding(container: HTMLElement, state: AppState, callbacks: OnboardingCallbacks): void {
  container.innerHTML = `
    <div class="onboarding">
      <div class="onboarding-slide">
        <div class="onboarding-video-wrap">
          <video
            id="onboarding-video"
            class="onboarding-video"
            src="./animacao_entrada.mp4"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
          ></video>
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

  const video = document.getElementById('onboarding-video') as HTMLVideoElement;
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

  document.getElementById('onboarding-start-btn')?.addEventListener('click', () => {
    const newState = completeOnboarding(state);
    saveState(newState);
    callbacks.onComplete(newState);
  });
}
