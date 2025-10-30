import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

interface WellnessData {
  userProfile: {
    name: string;
    email: string;
    startDate: string;
    currentWeek: number;
  };
  healthScores: {
    mental: number;
    physical: number;
    cognitive: number;
    overall: number;
  };
  journalEntries: any[];
  moodTracking: any[];
  goals: any[];
  habits: any[];
  coachingProgress: {
    completedComponents: string[];
    currentWeek: number;
    responseData: any;
  };
  progressData: {
    healthScores: any[];
    moodDistribution: any;
    weeklyActivity: any[];
    achievements: any[];
  };
}

export function useWellnessData() {
  const [data, setData] = useLocalStorage<WellnessData>('wellness-data', {
    userProfile: {
      name: 'Sarah',
      email: 'sarah@example.com',
      startDate: new Date().toISOString().split('T')[0],
      currentWeek: 1
    },
    healthScores: {
      mental: 65,
      physical: 72,
      cognitive: 58,
      overall: 65
    },
    journalEntries: [],
    moodTracking: [],
    goals: [],
    habits: [],
    coachingProgress: {
      completedComponents: [],
      currentWeek: 1,
      responseData: {}
    },
    progressData: {
      healthScores: [],
      moodDistribution: {},
      weeklyActivity: [],
      achievements: []
    }
  });

  const updateHealthScores = (scores: Partial<typeof data.healthScores>) => {
    setData(prev => ({
      ...prev,
      healthScores: { ...prev.healthScores, ...scores }
    }));
  };

  const addJournalEntry = (entry: any) => {
    setData(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, { ...entry, id: Date.now() }]
    }));
  };

  const upsertTodayJournalEntry = (entry: any) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existingIndex = prev.journalEntries.findIndex((e: any) => {
        const d = new Date(e.createdAt).toISOString().split('T')[0];
        return d === today;
      });
      if (existingIndex >= 0) {
        const updated = [...prev.journalEntries];
        const existing = updated[existingIndex];
        updated[existingIndex] = { ...existing, ...entry };
        return { ...prev, journalEntries: updated };
      }
      return {
        ...prev,
        journalEntries: [...prev.journalEntries, { ...entry, id: Date.now() }]
      };
    });
  };

  const updateJournalEntry = (id: number, updates: any) => {
    setData(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.map((e: any) => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const addMoodEntry = (mood: string, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      moodTracking: [
        ...prev.moodTracking.filter((entry: any) => entry.date !== today),
        { date: today, mood, notes, timestamp: new Date().toISOString() }
      ]
    }));
  };

  const updateGoal = (goalId: number, updates: any) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map((goal: any) => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  };

  const addGoal = (goal: any) => {
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: Date.now() }]
    }));
  };

  const updateHabit = (habitId: number, updates: any) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map((habit: any) => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    }));
  };

  const addHabit = (habit: any) => {
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, { ...habit, id: Date.now() }]
    }));
  };

  const updateCoachingProgress = (progressData: any) => {
    setData(prev => ({
      ...prev,
      coachingProgress: {
        ...prev.coachingProgress,
        ...progressData
      }
    }));
  };

  const resetCoachingProgress = () => {
    setData(prev => ({
      ...prev,
      coachingProgress: {
        completedComponents: [],
        currentWeek: 1,
        responseData: {}
      }
    }));
  };

  return {
    data,
    updateHealthScores,
    addJournalEntry,
    upsertTodayJournalEntry,
    updateJournalEntry,
    addMoodEntry,
    updateGoal,
    addGoal,
    updateHabit,
    addHabit,
    updateCoachingProgress,
    resetCoachingProgress
  };
}