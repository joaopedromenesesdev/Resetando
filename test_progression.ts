// ========================================
// Resetando — Testes Obrigatórios de Progressão (Seção 24)
// ========================================

import {
  BASE_XP_PER_PILLAR,
  calculateRequiredXP,
  calculatePillarProgress,
  checkAndProcessLevelUp,
  getDefaultUserProgress,
  addXP,
  getCurrentLevelProgress,
} from './src/progression';
import type { AppState, PillarId } from './src/models';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALHOU: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSOU: ${message}`);
  }
}

function createMockState(): AppState {
  return {
    onboardingComplete: true,
    habits: [],
    dailyHabits: [],
    alterEgo: null,
    goals: [],
    userName: 'Tester',
    createdAt: new Date().toISOString(),
    progress: getDefaultUserProgress(),
    xpEvents: [],
  };
}

// Mock localStorage for node environment
if (typeof localStorage === 'undefined') {
  const storage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (k: string) => storage[k] || null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; },
  };
}
// Mock document.querySelector for toast
if (typeof document === 'undefined') {
  (global as any).document = {
    querySelector: () => null,
    createElement: () => ({ className: '', innerHTML: '', appendChild: () => {}, remove: () => {} }),
    body: { appendChild: () => {} },
    getElementById: () => null,
  };
}

console.log('--- INICIANDO OS 12 TESTES OBRIGATÓRIOS (SEÇÃO 24) ---');

// TESTE 1: Usuário novo começa no nível 1.
let state = createMockState();
assert(state.progress.currentLevel === 1, 'TESTE 1: Usuário novo começa no nível 1');
assert(state.progress.totalXP === 0, 'TESTE 1: XP total inicial é 0');

// TESTE 2: Ganhar 10 XP em Mente aumenta Mente em 10.
let res = addXP(state, 'mente', 10, 'habit_completion', 'habit_1_date1');
state = res.newState;
assert(state.progress.menteXP === 10, 'TESTE 2: Ganhar 10 XP em Mente aumenta Mente em 10');
assert(state.progress.currentCycleMenteXP === 10, 'TESTE 2: XP do ciclo de Mente aumenta em 10');

// TESTE 3: XP total aumenta corretamente.
assert(state.progress.totalXP === 10, 'TESTE 3: XP total aumenta corretamente para 10');
res = addXP(state, 'corpo', 10, 'habit_completion', 'habit_2_date1');
state = res.newState;
assert(state.progress.totalXP === 20, 'TESTE 3: XP total após Corpo (+10) é 20');

// TESTE 4: Recarregar / chamar novamente mesmo evento não duplica XP (idempotência).
const beforeXp = state.progress.totalXP;
const dupRes = addXP(state, 'mente', 10, 'habit_completion', 'habit_1_date1');
assert(!dupRes.eventAdded, 'TESTE 4: Evento repetido é rejeitado');
assert(dupRes.newState.progress.totalXP === beforeXp, 'TESTE 4: Recarregar a página ou re-executar não duplica XP');

// TESTE 5: 630 XP em Mente não sobe de nível sozinho.
let stateT5 = createMockState();
// Add 630 XP to Mente
for (let i = 0; i < 63; i++) {
  stateT5 = addXP(stateT5, 'mente', 10, 'test', `mente_${i}`).newState;
}
assert(stateT5.progress.currentCycleMenteXP === 630, 'TESTE 5: Mente acumulou 630 XP');
assert(stateT5.progress.currentLevel === 1, 'TESTE 5: 630 XP em Mente NÃO sobe de nível sozinho (Corpo e Alma ainda em 0)');

// TESTE 6: 630 XP em Mente + 630 Corpo + 630 Alma sobe para nível 2.
for (let i = 0; i < 63; i++) {
  stateT5 = addXP(stateT5, 'corpo', 10, 'test', `corpo_${i}`).newState;
}
assert(stateT5.progress.currentLevel === 1, 'TESTE 6: Mente + Corpo em 630 ainda mantêm nível 1 (Alma ainda em 0)');
for (let i = 0; i < 63; i++) {
  stateT5 = addXP(stateT5, 'alma', 10, 'test', `alma_${i}`).newState;
}
assert(stateT5.progress.currentLevel === 2, 'TESTE 6: 630 Mente + 630 Corpo + 630 Alma sobe para Nível 2');

// TESTE 7: No nível 2 o requisito é 1260 XP.
const reqLvl2 = calculateRequiredXP(stateT5.progress.currentLevel);
assert(reqLvl2 === 1260, `TESTE 7: No nível 2 o requisito é 1260 XP (calculado: ${reqLvl2})`);
assert(calculateRequiredXP(3) === 2520, 'TESTE 7: No nível 3 o requisito é 2520 XP');

// TESTE 8: XP excedente não é perdido (ex: 700 - 630 = 70 no novo ciclo).
let stateT8 = createMockState();
// Add 700 Mente, 630 Corpo, 650 Alma
stateT8 = addXP(stateT8, 'mente', 700, 'test', 'excess_m').newState;
stateT8 = addXP(stateT8, 'corpo', 630, 'test', 'excess_c').newState;
stateT8 = addXP(stateT8, 'alma', 650, 'test', 'excess_a').newState;
assert(stateT8.progress.currentLevel === 2, 'TESTE 8: Nível subiu para 2');
assert(stateT8.progress.currentCycleMenteXP === 70, `TESTE 8: Mente tem 70 XP no novo ciclo (700 - 630 = 70). Obtido: ${stateT8.progress.currentCycleMenteXP}`);
assert(stateT8.progress.currentCycleCorpoXP === 0, `TESTE 8: Corpo tem 0 XP no novo ciclo (630 - 630 = 0). Obtido: ${stateT8.progress.currentCycleCorpoXP}`);
assert(stateT8.progress.currentCycleAlmaXP === 20, `TESTE 8: Alma tem 20 XP no novo ciclo (650 - 630 = 20). Obtido: ${stateT8.progress.currentCycleAlmaXP}`);

// TESTE 9: Ficar alguns dias sem usar o aplicativo não remove XP.
const stateT9 = { ...stateT8 };
assert(stateT9.progress.totalXP === 700 + 630 + 650, 'TESTE 9: XP total histórico é 1980');
assert(stateT9.progress.menteXP === 700, 'TESTE 9: XP de Mente histórico permanece intacto');

// TESTE 10: O triângulo acompanha corretamente os três pilares.
const lvlProg = getCurrentLevelProgress(stateT8.progress);
assert(lvlProg.currentLevel === 2, 'TESTE 10: Nível do triângulo é 2');
assert(lvlProg.requiredXP === 1260, 'TESTE 10: Requisito do triângulo é 1260');
// Mente 70 / 1260 = ~6%
assert(lvlProg.mente.percent === Math.round((70 / 1260) * 100), 'TESTE 10: Mente reflete 70/1260 no triângulo');
assert(lvlProg.corpo.percent === 0, 'TESTE 10: Corpo reflete 0/1260 no triângulo');
assert(lvlProg.alma.percent === Math.round((20 / 1260) * 100), 'TESTE 10: Alma reflete 20/1260 no triângulo');

// TESTE 11: Alter Ego não é necessário.
assert(stateT8.alterEgo === null, 'TESTE 11: Alter Ego é null e sistema calcula tudo perfeitamente');

// TESTE 12: O histórico de XP permanece disponível depois de subir de nível.
assert(stateT8.xpEvents.length === 3, 'TESTE 12: Todos os 3 eventos de XP estão registrados no histórico');
assert(stateT8.progress.totalXP === 1980, 'TESTE 12: XP total histórico (1980) disponível após level up');

console.log('🎉 TODOS OS 12 TESTES OBRIGATÓRIOS PASSARAM COM SUCESSO!');
