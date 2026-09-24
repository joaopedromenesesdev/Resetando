// ========================================
// Resetando — Storage Service
// localStorage-based, ready for Supabase migration
// ========================================

import type { AppState, Habit, DailyHabit, PillarId, AlterEgo, Goal } from './models';
import {
  addXP,
  getDefaultUserProgress,
  checkAndProcessLevelUp,
} from './progression';

const PRIMARY_STORAGE_KEY = 'resetando_data';
const LEGACY_STORAGE_KEY = '3pilares_data';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  return `${day} ${months[date.getMonth()]}`;
}

export function formatDateFull(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${weekdays[date.getDay()]}, ${day} de ${months[date.getMonth()]} de ${year}`;
}

export function getWeekdayShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  return days[date.getDay()];
}

export function formatNavDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${weekdays[date.getDay()]}, ${day} ${months[date.getMonth()]}`;
}

function getDefaultState(): AppState {
  const progress = getDefaultUserProgress();
  return {
    onboardingComplete: false,
    habits: [],
    dailyHabits: [],
    alterEgo: null,
    goals: [],
    userName: '',
    createdAt: new Date().toISOString(),
    progress,
    xpEvents: [],
    totalXp: 0,
    pillarXp: { mente: 0, corpo: 0, alma: 0 },
  };
}

// Preset habit names from old default seeds to clean up
const PRESET_DEFAULT_HABIT_NAMES = new Set([
  'estudar programação',
  'ler 20 páginas',
  'praticar foco diário',
  'treinar',
  'beber 2l de água',
  'dormir antes das 23h',
  'orar / meditar',
  'escrever no diário',
  'tempo com a família',
]);

// ---- Load / Save ----
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.goals) parsed.goals = [];
    if (parsed.alterEgo === undefined) parsed.alterEgo = null;

    let modified = false;

    // Progression XP & Events Migration
    if (!parsed.progress) {
      parsed.progress = getDefaultUserProgress();
      if (parsed.pillarXp) {
        parsed.progress.menteXP = parsed.pillarXp.mente || 0;
        parsed.progress.corpoXP = parsed.pillarXp.corpo || 0;
        parsed.progress.almaXP = parsed.pillarXp.alma || 0;
        parsed.progress.totalXP = parsed.totalXp || (parsed.progress.menteXP + parsed.progress.corpoXP + parsed.progress.almaXP);
        parsed.progress.currentCycleMenteXP = parsed.progress.menteXP;
        parsed.progress.currentCycleCorpoXP = parsed.progress.corpoXP;
        parsed.progress.currentCycleAlmaXP = parsed.progress.almaXP;
        const check = checkAndProcessLevelUp(parsed.progress);
        parsed.progress = check.newProgress;
      }
      modified = true;
    }

    if (!Array.isArray(parsed.xpEvents)) {
      parsed.xpEvents = [];
      modified = true;
    }

    // Keep synchronized helper fields
    parsed.totalXp = parsed.progress.totalXP;
    parsed.pillarXp = {
      mente: parsed.progress.menteXP,
      corpo: parsed.progress.corpoXP,
      alma: parsed.progress.almaXP,
    };


    // Remove legacy pre-defined habits if present in user storage
    if (Array.isArray(parsed.habits)) {
      const filtered = parsed.habits.filter(
        h => !PRESET_DEFAULT_HABIT_NAMES.has(h.name.trim().toLowerCase())
      );
      if (filtered.length !== parsed.habits.length) {
        parsed.habits = filtered;
        modified = true;
      }
    }

    if (Array.isArray(parsed.dailyHabits)) {
      const filteredDaily = parsed.dailyHabits.filter(
        dh => !PRESET_DEFAULT_HABIT_NAMES.has(dh.habitName.trim().toLowerCase())
      );
      if (filteredDaily.length !== parsed.dailyHabits.length) {
        parsed.dailyHabits = filteredDaily;
        modified = true;
      }
    }

    if (modified) {
      saveState(parsed);
    }

    return parsed;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  const serialized = JSON.stringify(state);
  localStorage.setItem(PRIMARY_STORAGE_KEY, serialized);
  localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
}

// ---- Habit CRUD ----
export function createHabit(state: AppState, pillarId: PillarId, name: string): AppState {
  const pillarHabits = state.habits.filter(h => h.pillarId === pillarId && h.active);
  const habit: Habit = {
    id: generateId(),
    pillarId,
    name: name.trim(),
    order: pillarHabits.length,
    active: true,
    createdAt: new Date().toISOString(),
    retiredAt: null,
  };
  const today = getToday();
  const dailyHabit: DailyHabit = {
    id: generateId(),
    habitId: habit.id,
    pillarId: habit.pillarId,
    habitName: habit.name,
    date: today,
    completed: false,
    completedAt: null,
    order: habit.order,
  };
  const newState = {
    ...state,
    habits: [...state.habits, habit],
    dailyHabits: [...state.dailyHabits, dailyHabit],
  };
  saveState(newState);
  return newState;
}

export function updateHabit(state: AppState, habitId: string, newName: string): AppState {
  const habits = state.habits.map(h =>
    h.id === habitId ? { ...h, name: newName.trim() } : h
  );
  // Also update habitName in dailyHabits for consistency
  const dailyHabits = state.dailyHabits.map(dh =>
    dh.habitId === habitId ? { ...dh, habitName: newName.trim() } : dh
  );
  const newState = { ...state, habits, dailyHabits };
  saveState(newState);
  return newState;
}

export function retireHabit(state: AppState, habitId: string): AppState {
  const habits = state.habits.map(h =>
    h.id === habitId ? { ...h, active: false, retiredAt: new Date().toISOString() } : h
  );
  const today = getToday();
  const dailyHabits = state.dailyHabits.filter(
    dh => !(dh.habitId === habitId && dh.date === today)
  );
  const newState = { ...state, habits, dailyHabits };
  saveState(newState);
  return newState;
}

export function replaceHabit(state: AppState, oldHabitId: string, newName: string): AppState {
  const oldHabit = state.habits.find(h => h.id === oldHabitId);
  if (!oldHabit) return state;

  // Retire old habit
  let newState = retireHabit(state, oldHabitId);

  // Create new habit with same pillar and order
  const newHabit: Habit = {
    id: generateId(),
    pillarId: oldHabit.pillarId,
    name: newName.trim(),
    order: oldHabit.order,
    active: true,
    createdAt: new Date().toISOString(),
    retiredAt: null,
  };
  newState = { ...newState, habits: [...newState.habits, newHabit] };
  saveState(newState);
  return newState;
}

// ---- Daily Habits ----
export function getActiveHabits(state: AppState): Habit[] {
  return state.habits
    .filter(h => h.active)
    .sort((a, b) => a.order - b.order);
}

export function getActiveHabitsForPillar(state: AppState, pillarId: PillarId): Habit[] {
  return getActiveHabits(state).filter(h => h.pillarId === pillarId);
}

export function ensureDailyHabits(state: AppState, date: string): AppState {
  const activeHabits = getActiveHabits(state);
  const existingForDate = state.dailyHabits.filter(dh => dh.date === date);

  const activeHabitIds = new Set(activeHabits.map(h => h.id));
  const validExisting = existingForDate.filter(dh => activeHabitIds.has(dh.habitId));

  const missingHabits = activeHabits.filter(
    h => !existingForDate.some(dh => dh.habitId === h.id)
  );

  if (missingHabits.length === 0 && validExisting.length === existingForDate.length) {
    return state;
  }

  const newDailyHabits: DailyHabit[] = missingHabits.map(habit => ({
    id: generateId(),
    habitId: habit.id,
    pillarId: habit.pillarId,
    habitName: habit.name,
    date,
    completed: false,
    completedAt: null,
    order: habit.order,
  }));

  const otherDates = state.dailyHabits.filter(dh => dh.date !== date);
  const newState = {
    ...state,
    dailyHabits: [...otherDates, ...validExisting, ...newDailyHabits],
  };
  saveState(newState);
  return newState;
}

export function getDailyHabitsForDate(state: AppState, date: string): DailyHabit[] {
  return state.dailyHabits
    .filter(dh => dh.date === date)
    .sort((a, b) => a.order - b.order);
}

export function getDailyHabitsForPillar(state: AppState, date: string, pillarId: PillarId): DailyHabit[] {
  return getDailyHabitsForDate(state, date).filter(dh => dh.pillarId === pillarId);
}

export function toggleDailyHabit(state: AppState, dailyHabitId: string): AppState {
  const target = state.dailyHabits.find(dh => dh.id === dailyHabitId);
  if (!target) return state;

  const nextCompleted = !target.completed;
  const dailyHabits = state.dailyHabits.map(dh => {
    if (dh.id === dailyHabitId) {
      return {
        ...dh,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
        xpAwarded: true,
      };
    }
    return dh;
  });

  let newState: AppState = { ...state, dailyHabits };

  if (nextCompleted) {
    // 1. Award habit completion XP (+10 XP)
    const habitRef = `habit_${target.id}_${target.date}`;
    newState = addXP(newState, target.pillarId, 10, 'habit_completion', habitRef).newState;

    // 2. Check pillar completion bonus (3 of 3 habits of that pillar: +15 XP)
    const pillarHabits = newState.dailyHabits.filter(h => h.pillarId === target.pillarId && h.date === target.date);
    if (pillarHabits.length > 0 && pillarHabits.every(h => h.completed)) {
      const pillarBonusRef = `bonus_pillar_${target.pillarId}_${target.date}`;
      newState = addXP(newState, target.pillarId, 15, 'pillar_bonus', pillarBonusRef).newState;
    }

    // 3. Check perfect day bonus (all habits for date completed: +10 XP Mente, +10 XP Corpo, +10 XP Alma)
    const allDateHabits = newState.dailyHabits.filter(h => h.date === target.date);
    if (allDateHabits.length >= 3 && allDateHabits.every(h => h.completed)) {
      newState = addXP(newState, 'mente', 10, 'perfect_day_bonus', `bonus_perfect_day_mente_${target.date}`).newState;
      newState = addXP(newState, 'corpo', 10, 'perfect_day_bonus', `bonus_perfect_day_corpo_${target.date}`).newState;
      newState = addXP(newState, 'alma', 10, 'perfect_day_bonus', `bonus_perfect_day_alma_${target.date}`).newState;
    }
  }

  saveState(newState);
  return newState;
}

// ---- Progress ----
export function getDayProgress(state: AppState, date: string): { completed: number; total: number; percent: number } {
  const dailyHabits = getDailyHabitsForDate(state, date);
  const total = dailyHabits.length;
  const completed = dailyHabits.filter(dh => dh.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export function getPillarProgress(state: AppState, date: string, pillarId: PillarId): { completed: number; total: number } {
  const habits = getDailyHabitsForPillar(state, date, pillarId);
  return {
    completed: habits.filter(h => h.completed).length,
    total: habits.length,
  };
}

// ---- Consistency / Streak ----
const CONSISTENCY_THRESHOLD = 7; // out of 9

export function isConsistentDay(state: AppState, date: string): boolean {
  const { completed } = getDayProgress(state, date);
  return completed >= CONSISTENCY_THRESHOLD;
}

export function getStreak(state: AppState): number {
  let streak = 0;
  const today = getToday();
  const todayDate = new Date(today + 'T12:00:00');

  // Start from yesterday and go back
  // But also check today if it's consistent
  const todayProgress = getDayProgress(state, today);
  if (todayProgress.total > 0 && todayProgress.completed >= CONSISTENCY_THRESHOLD) {
    streak = 1;
  }

  // Go back from yesterday
  for (let i = 1; i <= 365; i++) {
    const checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    const progress = getDayProgress(state, dateStr);
    if (progress.total === 0) break; // No data for this day

    if (progress.completed >= CONSISTENCY_THRESHOLD) {
      streak++;
    } else {
      break;
    }
  }

  // If today isn't consistent yet, check if yesterday is the start of the streak
  if (todayProgress.total > 0 && todayProgress.completed < CONSISTENCY_THRESHOLD) {
    streak = 0;
    for (let i = 1; i <= 365; i++) {
      const checkDate = new Date(todayDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const progress = getDayProgress(state, dateStr);
      if (progress.total === 0) break;

      if (progress.completed >= CONSISTENCY_THRESHOLD) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}

// ---- History ----
export function getHistoryDates(state: AppState): string[] {
  const dates = new Set<string>();
  state.dailyHabits.forEach(dh => dates.add(dh.date));
  return Array.from(dates).sort((a, b) => b.localeCompare(a)); // newest first
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date(getToday() + 'T12:00:00');
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// ---- Onboarding ----
export function completeOnboarding(state: AppState): AppState {
  const newState = { ...state, onboardingComplete: true };
  saveState(newState);
  return newState;
}

// ---- Alter Ego CRUD ----
export function saveAlterEgo(state: AppState, alterEgo: AlterEgo): AppState {
  const newState = { ...state, alterEgo };
  saveState(newState);
  return newState;
}

export function removeAlterEgo(state: AppState): AppState {
  const newState = { ...state, alterEgo: null };
  saveState(newState);
  return newState;
}

// ---- Goals CRUD ----
export function createGoal(
  state: AppState,
  pillarId: PillarId,
  title: string,
  progress: number
): AppState {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const isCompleted = clampedProgress >= 100;
  const newGoal: Goal = {
    id: generateId(),
    pillarId,
    title: title.trim(),
    progress: clampedProgress,
    completed: isCompleted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    xpAwarded: isCompleted,
  };

  const goals = state.goals || [];
  let newState = { ...state, goals: [...goals, newGoal] };

  if (isCompleted) {
    newState = addXP(newState, pillarId, 100, 'goal_completion', `goal_${newGoal.id}`).newState;
  } else {
    saveState(newState);
  }

  return newState;
}

export function updateGoalProgress(
  state: AppState,
  goalId: string,
  progress: number
): AppState {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const goals = state.goals || [];
  const targetGoal = goals.find(g => g.id === goalId);
  if (!targetGoal) return state;

  const isCompleted = clampedProgress >= 100;
  const updatedGoals = goals.map(g =>
    g.id === goalId
      ? {
          ...g,
          progress: clampedProgress,
          completed: isCompleted,
          updatedAt: new Date().toISOString(),
        }
      : g
  );

  let newState = { ...state, goals: updatedGoals };

  if (isCompleted) {
    newState = addXP(newState, targetGoal.pillarId, 100, 'goal_completion', `goal_${targetGoal.id}`).newState;
  } else {
    saveState(newState);
  }

  return newState;
}

export function updateGoal(
  state: AppState,
  goalId: string,
  updates: { title?: string; pillarId?: PillarId; progress?: number }
): AppState {
  const goals = state.goals || [];
  const targetGoal = goals.find(g => g.id === goalId);
  if (!targetGoal) return state;

  const newProgress = updates.progress !== undefined
    ? Math.max(0, Math.min(100, Math.round(updates.progress)))
    : targetGoal.progress;
  const newPillarId = updates.pillarId || targetGoal.pillarId;
  const isCompleted = newProgress >= 100;

  const updatedGoals = goals.map(g => {
    if (g.id !== goalId) return g;
    return {
      ...g,
      title: updates.title !== undefined ? updates.title.trim() : g.title,
      pillarId: newPillarId,
      progress: newProgress,
      completed: isCompleted,
      updatedAt: new Date().toISOString(),
    };
  });

  let newState = { ...state, goals: updatedGoals };

  if (isCompleted) {
    newState = addXP(newState, newPillarId, 100, 'goal_completion', `goal_${targetGoal.id}`).newState;
  } else {
    saveState(newState);
  }

  return newState;
}

export function deleteGoal(state: AppState, goalId: string): AppState {
  const goals = state.goals || [];
  const updatedGoals = goals.filter(g => g.id !== goalId);
  const newState = { ...state, goals: updatedGoals };
  saveState(newState);
  return newState;
}

export function getPillarGoals(state: AppState, pillarId: PillarId): Goal[] {
  return (state.goals || []).filter(g => g.pillarId === pillarId);
}

export function getPillarEvolution(state: AppState, pillarId: PillarId): {
  progress: number;
  goalCount: number;
  hasGoals: boolean;
} {
  const goals = getPillarGoals(state, pillarId);
  if (goals.length === 0) {
    return { progress: 0, goalCount: 0, hasGoals: false };
  }
  const sum = goals.reduce((acc, g) => acc + g.progress, 0);
  const avg = Math.round(sum / goals.length);
  return { progress: avg, goalCount: goals.length, hasGoals: true };
}

export function getPillarXp(state: AppState, pillarId: PillarId): number {
  if (state.progress) {
    if (pillarId === 'mente') return state.progress.menteXP || 0;
    if (pillarId === 'corpo') return state.progress.corpoXP || 0;
    if (pillarId === 'alma') return state.progress.almaXP || 0;
  }
  return state.pillarXp?.[pillarId] || 0;
}

export function getTotalXp(state: AppState): number {
  return state.progress?.totalXP ?? state.totalXp ?? (
    (state.pillarXp?.mente || 0) +
    (state.pillarXp?.corpo || 0) +
    (state.pillarXp?.alma || 0)
  );
}



