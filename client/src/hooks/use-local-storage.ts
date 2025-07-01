import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useWellnessData() {
  const [data, setData] = useLocalStorage('thriveMidlifeData', {
    userProfile: {
      name: '',
      email: '',
      startDate: new Date().toISOString(),
      currentWeek: 1
    },
    healthScores: {
      mental: 0,
      physical: 0,
      cognitive: 0,
      overall: 0
    },
    journalEntries: [],
    moodTracking: [],
    goals: [],
    habits: [],
    coachingProgress: [],
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

  const addMoodEntry = (mood: string, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      moodTracking: [
        ...prev.moodTracking.filter(entry => entry.date !== today),
        { date: today, mood, notes, timestamp: new Date().toISOString() }
      ]
    }));
  };

  const updateGoal = (goalId: number, updates: any) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
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
      habits: prev.habits.map(habit => 
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

  const updateCoachingProgress = (weekNumber: number, progress: number) => {
    setData(prev => ({
      ...prev,
      coachingProgress: prev.coachingProgress.map(cp => 
        cp.weekNumber === weekNumber ? { ...cp, progress } : cp
      )
    }));
  };

  return {
    data,
    updateHealthScores,
    addJournalEntry,
    addMoodEntry,
    updateGoal,
    addGoal,
    updateHabit,
    addHabit,
    updateCoachingProgress
  };
}
