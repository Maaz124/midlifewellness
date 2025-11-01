// Shared types and interfaces for coaching components

export interface CoachingComponentProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
  completeId?: string;
}

export interface RitualData {
  selectedRituals: string[];
  practiceTime: number;
  effectiveness: number;
  notes: string;
}

export interface BreathworkSession {
  duration: number;
  pattern: string;
  completed: boolean;
  notes: string;
}

export interface ThoughtPattern {
  id: string;
  thought: string;
  category: string;
  intensity: number;
  reframe?: string;
}

export interface EnergyLevel {
  time: string;
  level: number;
  activity: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
  intensity: number;
  triggers?: string[];
  notes?: string;
}

export interface GoalData {
  title: string;
  category: string;
  steps: string[];
  timeline: string;
  progress: number;
}

export interface HabitData {
  name: string;
  frequency: string;
  cue: string;
  routine: string;
  reward: string;
  streak: number;
}

