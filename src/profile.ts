// ========================================
// Resetando — Profile Screen
// Stats, philosophy, data export
// ========================================

import type { AppState } from './models';
import {
  getStreak,
  getHistoryDates,
  getDayProgress,
} from './storage';
import { icon } from './icons';
import { renderLogoSvg } from './logo';

interface ProfileCallbacks {
  onStateChange: (state: AppState) => void;
  onReset: () => void;
}

export function renderProfile(container: HTMLElement, state: AppState, callbacks: ProfileCallbacks): void {
  const streak = getStreak(state);
  const allDates = getHistoryDates(state);
  const totalDays = allDates.length;

  // Calculate stats
  let totalCompleted = 0;
  let totalPossible = 0;
  let consistentDays = 0;
  let perfectDays = 0;

  allDates.forEach(date => {
    const progress = getDayProgress(state, date);
    totalCompleted += progress.completed;
    totalPossible += progress.total;
    if (progress.completed >= 7) consistentDays++;
    if (progress.total > 0 && progress.completed === progress.total) perfectDays++;
  });

  const overallPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  container.innerHTML = `
    <div class="page">
      <div class="profile-brand">
        <div class="profile-logo-wrap">${renderLogoSvg(52, 'profile-logo')}</div>
        <h1 class="profile-brand-name"><span class="gold">RESET</span>ANDO</h1>
        <p class="profile-brand-tagline">Evolução pessoal · Mente, Corpo e Alma</p>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">${icon('flame', 20)} ${streak}</div>
          <div class="stat-label">Sequência Atual</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalDays}</div>
          <div class="stat-label">Dias Registrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${perfectDays}</div>
          <div class="stat-label">Dias Perfeitos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${overallPercent}%</div>
          <div class="stat-label">Taxa de Adesão</div>
        </div>
      </div>

      <div class="profile-stats" style="grid-template-columns: 1fr;">
        <div class="stat-card" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div class="stat-label" style="text-align: left;">Dias Consistentes (≥ 7/9)</div>
          </div>
          <div class="stat-value" style="margin-bottom: 0;">${consistentDays}/${totalDays}</div>
        </div>
      </div>

      <p class="section-title" style="margin-top: var(--spacing-lg);">Filosofia</p>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${icon('scale', 18)} Os 3 Pilares</h3>
        <p class="philosophy-text">
          Você não é apenas mente, corpo ou alma — é a soma dos três.
          Quando um pilar enfraquece, os outros sentem o impacto.
          Quando os três estão fortes, você vive com propósito e equilíbrio.
        </p>
      </div>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${icon('target', 18)} 9 Compromissos</h3>
        <p class="philosophy-text">
          Não tente mudar tudo de uma vez. 3 hábitos para cada pilar. 9 no total.
          Pequenos, consistentes, repetidos. A disciplina nasce da simplicidade.
        </p>
      </div>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${icon('flame', 18)} Consistência > Perfeição</h3>
        <p class="philosophy-text">
          Você não precisa de 9/9 todos os dias. 7 de 9 já mantém sua sequência.
          O objetivo não é perfeccionismo — é não viver no piloto automático.
        </p>
      </div>

      <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-md); border-top: 1px solid var(--border-subtle);">
        <button class="btn-danger" id="reset-data" style="width: 100%; border: 1px solid rgba(220, 38, 38, 0.25); border-radius: var(--radius-md); padding: var(--spacing-md);">
          ${icon('trash', 14)}
          Resetar todos os dados
        </button>
      </div>
    </div>
  `;

  // Reset
  document.getElementById('reset-data')?.addEventListener('click', () => {
    if (confirm('Tem certeza? Todos os seus dados serão permanentemente apagados.')) {
      if (confirm('Esta ação não pode ser desfeita. Deseja realmente continuar?')) {
        localStorage.removeItem('resetando_data');
        localStorage.removeItem('3pilares_data');
        callbacks.onReset();
      }
    }
  });
}
