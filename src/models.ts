// ========================================
// Resetando — Data Models
// Mirrors future Supabase schema
// ========================================

export type PillarId = 'mente' | 'corpo' | 'alma';

export interface Pillar {
  id: PillarId;
  name: string;
  iconKey: string;
}

export const PILLARS: Pillar[] = [
  { id: 'mente', name: 'Mente', iconKey: 'bookOpen' },
  { id: 'corpo', name: 'Corpo', iconKey: 'dumbbell' },
  { id: 'alma',  name: 'Alma',  iconKey: 'heart' },
];

export interface Habit {
  id: string;
  pillarId: PillarId;
  name: string;
  order: number;
  active: boolean;
  createdAt: string;   // ISO date string
  retiredAt: string | null;
}

export interface PillarXp {
  mente: number;
  corpo: number;
  alma: number;
}

export interface DailyHabit {
  id: string;
  habitId: string;
  pillarId: PillarId;
  habitName: string;   // Snapshot — preserves history
  date: string;        // YYYY-MM-DD
  completed: boolean;
  completedAt: string | null;
  order: number;
  xpAwarded?: boolean;
}

export interface AlterEgoPillar {
  target: number; // 0 - 100
  traits: string[]; // ex: ["disciplinado", "focado"]
}

export interface AlterEgo {
  name: string; // ex: "Minha melhor versão"
  mente: AlterEgoPillar;
  corpo: AlterEgoPillar;
  alma: AlterEgoPillar;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  pillarId: PillarId;
  title: string;
  progress: number; // 0 - 100
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  xpAwarded?: boolean;
}

export interface AppState {
  onboardingComplete: boolean;
  habits: Habit[];
  dailyHabits: DailyHabit[];
  alterEgo?: AlterEgo | null;
  goals: Goal[];
  userName: string;
  createdAt: string;
  // Progression System
  totalXp: number;
  pillarXp: PillarXp;
}

export type TabId = 'hoje' | 'evolucao' | 'historico' | 'habitos' | 'perfil';

