// ========================================
// Resetando — History Screen
// Last 7 days ribbon + full history list
// ========================================

import type { AppState } from './models';
import { PILLARS } from './models';
import {
  getToday,
  getWeekdayShort,
  formatDateShort,
  getDayProgress,
  getHistoryDates,
  getLast7Days,
  getDailyHabitsForPillar,
} from './storage';
import { icon, pillarIcon } from './icons';

export function renderHistory(container: HTMLElement, state: AppState): void {
  const today = getToday();
  const last7Days = getLast7Days();
  const allDates = getHistoryDates(state);

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <p class="page-label">progresso</p>
        <h1 class="page-title">Histórico</h1>
      </div>

      <p class="section-title">Últimos 7 dias</p>
      <div class="history-week">
        ${last7Days.map(date => {
          const progress = getDayProgress(state, date);
          const isToday = date === today;
          const isPerfect = progress.total > 0 && progress.completed === progress.total;

          return `
            <div class="week-day ${isToday ? 'today' : ''} ${isPerfect ? 'perfect' : ''}">
              <span class="week-day-label">${getWeekdayShort(date)}</span>
              <span class="week-day-count">${progress.total > 0 ? `${progress.completed}/${progress.total}` : '—'}</span>
            </div>
          `;
        }).join('')}
      </div>

      <p class="section-title">Todos os dias</p>
      <div class="history-list" id="history-list">
        ${allDates.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">${icon('barChart', 40)}</div>
            <p class="empty-text">Seu histórico aparecerá aqui conforme você registra seus hábitos.</p>
          </div>
        ` : allDates.map(date => {
          const progress = getDayProgress(state, date);
          const isConsistent = progress.completed >= 7;
          const isToday = date === today;

          return `
            <div class="history-item ${isConsistent ? 'consistent' : ''}" data-history-date="${date}">
              <div>
                <span class="history-date">${isToday ? 'Hoje' : formatDateShort(date)}</span>
              </div>
              <div class="history-score">
                <span class="history-count">${progress.completed}/${progress.total}</span>
                <span class="history-percent">${progress.percent}%</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div id="history-detail-container"></div>
  `;

  // Bind click events for day detail
  container.querySelectorAll('.history-item[data-history-date]').forEach(item => {
    item.addEventListener('click', () => {
      const date = item.getAttribute('data-history-date');
      if (!date) return;
      showDayDetail(state, date);
    });
  });
}

function showDayDetail(state: AppState, date: string): void {
  const detailContainer = document.getElementById('history-detail-container');
  if (!detailContainer) return;

  const progress = getDayProgress(state, date);
  const today = getToday();
  const isToday = date === today;

  detailContainer.innerHTML = `
    <div class="history-detail-overlay" id="detail-overlay">
      <div class="history-detail-content">
        <div class="modal-handle"></div>
        <div class="detail-header">
          <span class="detail-date">${isToday ? 'Hoje' : formatDateShort(date)}</span>
          <span class="detail-score">${progress.completed}/${progress.total} — ${progress.percent}%</span>
        </div>

        ${PILLARS.map(pillar => {
          const habits = getDailyHabitsForPillar(state, date, pillar.id);
          if (habits.length === 0) return '';

          return `
            <div class="pillar-card" style="pointer-events: none;">
              <div class="pillar-header">
                <div class="pillar-info">
                  <span class="pillar-icon">${pillarIcon(pillar.id, 18)}</span>
                  <span class="pillar-name">${pillar.name}</span>
                </div>
              </div>
              ${habits.map(dh => `
                <div class="habit-item ${dh.completed ? 'completed' : ''}">
                  <div class="habit-checkbox ${dh.completed ? 'checked' : ''}">
                    <span class="check-icon">${icon('check', 14)}</span>
                  </div>
                  <span class="habit-name">${dh.habitName}</span>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Close on overlay click
  const overlay = document.getElementById('detail-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      detailContainer.innerHTML = '';
    }
  });
}
