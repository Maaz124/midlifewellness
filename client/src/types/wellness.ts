export interface UserData {
  id?: number;
  name: string;
  email: string;
  startDate: string;
  currentWeek: number;
}

export interface HealthScore {
  mental: number;
  physical: number;
  cognitive: number;
  overall: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'rating' | 'boolean' | 'multiple';
  options?: string[];
  weight: number;
}

export interface AssessmentResponse {
  questionId: string;
  value: number | boolean | string;
}

export interface JournalEntry {
  id?: number;
  title?: string;
  content: string;
  mood?: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
  prompt?: string;
  createdAt: string;
}

export interface Goal {
  id?: number;
  title: string;
  description?: string;
  category: 'sleep' | 'mindfulness' | 'exercise' | 'self-care';
  targetValue?: number;
  currentValue: number;
  targetDate?: string;
  completed: boolean;
  progress: number;
}

export interface Habit {
  id?: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  lastCompleted?: string;
  completedDays: boolean[];
}

export interface CoachingModule {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  components: ModuleComponent[];
  completed: boolean;
  progress: number;
  locked: boolean;
}

export interface ModuleComponent {
  id: string;
  type: 'video' | 'audio' | 'exercise' | 'worksheet' | 'reflection';
  title: string;
  description: string;
  duration?: number;
  completed: boolean;
}

export interface MoodEntry {
  id?: number;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
  notes?: string;
  createdAt: string;
}

export interface ProgressData {
  healthScores: Array<{
    date: string;
    mental: number;
    physical: number;
    cognitive: number;
  }>;
  moodDistribution: Record<string, number>;
  weeklyActivity: Array<{
    day: string;
    percentage: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;
}
