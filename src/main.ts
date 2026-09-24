// ========================================
// Resetando — Main Entry Point
// App shell, routing, navigation
// ========================================

import './style.css';
import type { AppState, TabId } from './models';
import { loadState, getToday, formatNavDate } from './storage';
import { renderOnboarding } from './onboarding';
import { renderToday } from './today';
import { renderEvolution } from './evolution';
import { renderHistory } from './history';
import { renderHabits } from './habits';
import { renderProfile } from './profile';
import { icon } from './icons';
import { renderLogoSvg } from './logo';

class App {
  private state: AppState;
  private currentTab: TabId = 'hoje';
  private appEl: HTMLElement;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.state = loadState();
    this.init();
  }

  private init(): void {
    if (!this.state.onboardingComplete) {
      this.renderOnboarding();
    } else {
      this.renderApp();
    }
  }

  private renderOnboarding(): void {
    this.appEl.innerHTML = '<div id="content"></div>';
    const content = document.getElementById('content')!;

    renderOnboarding(content, this.state, {
      onComplete: (newState) => {
        this.state = newState;
        this.renderApp();
      },
    });
  }

  private renderApp(): void {
    const today = getToday();
    this.appEl.innerHTML = `
      ${this.renderTopNavBar(today)}
      <div id="content"></div>
      ${this.renderNavBar()}
    `;

    this.bindNav();
    this.renderCurrentTab();
  }

  private renderTopNavBar(today: string): string {
    return `
      <header class="top-nav-bar" id="top-nav-bar">
        <div class="top-nav-brand">
          <span class="top-nav-logo">${renderLogoSvg(24)}</span>
          <span class="top-nav-name"><span class="gold">RESET</span>ANDO</span>
        </div>
        <div class="top-nav-info">
          <div class="top-nav-date">
            <span class="nav-date-icon">${icon('calendar', 13)}</span>
            <span class="nav-date-text">${formatNavDate(today)}</span>
          </div>
        </div>
      </header>
    `;
  }

  private renderNavBar(): string {
    const tabs: { id: TabId; iconHtml: string; label: string }[] = [
      { id: 'hoje', iconHtml: icon('sun', 20), label: 'Hoje' },
      { id: 'evolucao', iconHtml: icon('triangle', 20), label: 'Evolução' },
      { id: 'habitos', iconHtml: icon('listChecks', 20), label: 'Hábitos' },
      { id: 'historico', iconHtml: icon('calendar', 20), label: 'Histórico' },
      { id: 'perfil', iconHtml: icon('user', 20), label: 'Perfil' },
    ];

    return `
      <nav class="bottom-nav" id="bottom-nav">
        ${tabs.map(tab => `
          <button
            class="nav-item ${this.currentTab === tab.id ? 'active' : ''}"
            data-tab="${tab.id}"
            aria-label="${tab.label}"
          >
            <span class="nav-icon">${tab.iconHtml}</span>
            <span class="nav-label">${tab.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  public navigateToTab(tab: TabId): void {
    if (tab && tab !== this.currentTab) {
      this.currentTab = tab;
      const nav = document.getElementById('bottom-nav');
      if (nav) {
        nav.outerHTML = this.renderNavBar();
        this.bindNav();
      }
      this.renderCurrentTab();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private bindNav(): void {
    document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as TabId;
        this.navigateToTab(tab);
      });
    });
  }

  private renderCurrentTab(): void {
    const content = document.getElementById('content')!;

    switch (this.currentTab) {
      case 'hoje':
        renderToday(content, this.state, {
          onStateChange: (s) => { this.state = s; },
          onNavigateTab: (t) => { this.navigateToTab(t); },
        });
        break;
      case 'evolucao':
        renderEvolution(content, this.state, {
          onStateChange: (s) => { this.state = s; },
          onNavigateTab: (t) => { this.navigateToTab(t); },
        });
        break;
      case 'historico':
        renderHistory(content, this.state);
        break;
      case 'habitos':
        renderHabits(content, this.state, {
          onStateChange: (s) => { this.state = s; },
        });
        break;
      case 'perfil':
        renderProfile(content, this.state, {
          onStateChange: (s) => { this.state = s; },
          onReset: () => {
            this.state = loadState();
            this.renderOnboarding();
          },
        });
        break;
    }
  }
}

// Initialize
new App();
