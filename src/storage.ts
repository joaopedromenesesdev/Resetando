// ========================================
// Resetando — Storage Service
// localStorage-based, ready for Supabase migration
// ========================================

import type { AppState, Habit, DailyHabit, PillarId, AlterEgo, Goal, PillarXp } from './models';
import { showXpToast } from './progression';

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
  return {
    onboardingComplete: false,
    habits: [],
    dailyHabits: [],
    alterEgo: null,
    goals: [],
    userName: '',
    createdAt: new Date().toISOString(),
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

    // Progression XP Migration & Validation
    if (parsed.pillarXp === undefined || parsed.totalXp === undefined) {
      const pillarXp: PillarXp = { mente: 0, corpo: 0, alma: 0 };
      let totalXp = 0;

      if (Array.isArray(parsed.dailyHabits)) {
        parsed.dailyHabits.forEach(dh => {
          if (dh.completed) {
            dh.xpAwarded = true;
            pillarXp[dh.pillarId] = (pillarXp[dh.pillarId] || 0) + 10;
            totalXp += 10;
          }
        });
      }

      if (Array.isArray(parsed.goals)) {
        parsed.goals.forEach(g => {
          if (g.completed || g.progress >= 100) {
            g.xpAwarded = true;
            pillarXp[g.pillarId] = (pillarXp[g.pillarId] || 0) + 100;
            totalXp += 100;
          }
        });
      }

      parsed.pillarXp = pillarXp;
      parsed.totalXp = totalXp;
      modified = true;
    } else {
      parsed.pillarXp = {
        mente: Math.max(0, parsed.pillarXp.mente || 0),
        corpo: Math.max(0, parsed.pillarXp.corpo || 0),
        alma: Math.max(0, parsed.pillarXp.alma || 0),
      };
      parsed.totalXp = Math.max(
        0,
        parsed.totalXp || (parsed.pillarXp.mente + parsed.pillarXp.corpo + parsed.pillarXp.alma)
      );
    }

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
  let xpGained = 0;
  let gainedPillar: PillarId | null = null;

  const pillarXp: PillarXp = {
    mente: state.pillarXp?.mente || 0,
    corpo: state.pillarXp?.corpo || 0,
    alma: state.pillarXp?.alma || 0,
  };
  let totalXp = state.totalXp || 0;

  const dailyHabits = state.dailyHabits.map(dh => {
    if (dh.id === dailyHabitId) {
      const nextCompleted = !dh.completed;
      const alreadyAwarded = !!dh.xpAwarded;

      // Award XP only on the first completion of this daily habit instance
      if (nextCompleted && !alreadyAwarded) {
        xpGained = 10;
        gainedPillar = dh.pillarId;
        pillarXp[dh.pillarId] = (pillarXp[dh.pillarId] || 0) + 10;
        totalXp += 10;
      }

      return {
        ...dh,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
        // Once awarded, remains awarded (XP is never lost or duplicated on re-toggle)
        xpAwarded: alreadyAwarded || nextCompleted,
      };
    }
    return dh;
  });

  const newState = { ...state, dailyHabits, pillarXp, totalXp };
  saveState(newState);

  // Immediate visual feedback
  if (xpGained > 0 && gainedPillar) {
    showXpToast(xpGained, gainedPillar);
  }

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

  const pillarXp: PillarXp = {
    mente: state.pillarXp?.mente || 0,
    corpo: state.pillarXp?.corpo || 0,
    alma: state.pillarXp?.alma || 0,
  };
  let totalXp = state.totalXp || 0;

  if (isCompleted) {
    pillarXp[pillarId] += 100;
    totalXp += 100;
    showXpToast(100, pillarId);
  }

  const goals = state.goals || [];
  const newState = { ...state, goals: [...goals, newGoal], pillarXp, totalXp };
  saveState(newState);
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

  const pillarXp: PillarXp = {
    mente: state.pillarXp?.mente || 0,
    corpo: state.pillarXp?.corpo || 0,
    alma: state.pillarXp?.alma || 0,
  };
  let totalXp = state.totalXp || 0;

  const isCompleted = clampedProgress >= 100;
  const shouldAwardXp = isCompleted && !targetGoal.xpAwarded;

  if (shouldAwardXp) {
    pillarXp[targetGoal.pillarId] += 100;
    totalXp += 100;
    showXpToast(100, targetGoal.pillarId);
  }

  const updatedGoals = goals.map(g =>
    g.id === goalId
      ? {
          ...g,
          progress: clampedProgress,
          completed: isCompleted,
          xpAwarded: g.xpAwarded || shouldAwardXp,
          updatedAt: new Date().toISOString(),
        }
      : g
  );

  const newState = { ...state, goals: updatedGoals, pillarXp, totalXp };
  saveState(newState);
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

  const pillarXp: PillarXp = {
    mente: state.pillarXp?.mente || 0,
    corpo: state.pillarXp?.corpo || 0,
    alma: state.pillarXp?.alma || 0,
  };
  let totalXp = state.totalXp || 0;

  const isCompleted = newProgress >= 100;
  const shouldAwardXp = isCompleted && !targetGoal.xpAwarded;

  if (shouldAwardXp) {
    pillarXp[newPillarId] += 100;
    totalXp += 100;
    showXpToast(100, newPillarId);
  }

  const updatedGoals = goals.map(g => {
    if (g.id !== goalId) return g;
    return {
      ...g,
      title: updates.title !== undefined ? updates.title.trim() : g.title,
      pillarId: newPillarId,
      progress: newProgress,
      completed: isCompleted,
      xpAwarded: g.xpAwarded || shouldAwardXp,
      updatedAt: new Date().toISOString(),
    };
  });

  const newState = { ...state, goals: updatedGoals, pillarXp, totalXp };
  saveState(newState);
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
  return state.pillarXp?.[pillarId] || 0;
}

export function getTotalXp(state: AppState): number {
  if (state.totalXp !== undefined) return state.totalXp;
  return (
    (state.pillarXp?.mente || 0) +
    (state.pillarXp?.corpo || 0) +
    (state.pillarXp?.alma || 0)
  );
}


