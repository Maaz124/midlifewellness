import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './use-auth';

interface CoachingProgressData {
  completedComponents: string[];
  currentWeek: number;
  responseData: Record<string, any>;
}

interface CoachingProgressFromDB {
  id: number;
  userId: string;
  weekNumber: number;
  moduleId: string;
  completed: boolean;
  completedAt: string | null;
  progress: number;
}

export function useCoachingProgress() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // User-specific localStorage key
  const localStorageKey = user?.id ? `wellness-data-${user.id}` : 'wellness-data-guest';

  // Load from localStorage initially (for offline/fallback)
  const loadFromLocalStorage = useCallback((): CoachingProgressData => {
    try {
      const item = localStorage.getItem(localStorageKey);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.coachingProgress || {
          completedComponents: [],
          currentWeek: 1,
          responseData: {}
        };
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return {
      completedComponents: [],
      currentWeek: 1,
      responseData: {}
    };
  }, [localStorageKey]);

  // Fetch from backend if authenticated
  const { data: dbProgress, isLoading } = useQuery<CoachingProgressFromDB[]>({
    queryKey: ['/api/coaching-progress'],
    queryFn: async () => {
      const res = await fetch('/api/coaching-progress', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
  });

  // Convert DB format to our format
  const progressData: CoachingProgressData = (() => {
    if (isAuthenticated && dbProgress) {
      if (dbProgress.length === 0) {
        // No DB records yet, use localStorage
        return loadFromLocalStorage();
      }
      // Convert DB records to our format
      const completedComponents: string[] = [];
      const responseData: Record<string, any> = {};
      let maxWeek = 1;

      dbProgress.forEach(record => {
        if (record.completed) {
          completedComponents.push(record.moduleId);
          if (record.completedAt) {
            responseData[record.moduleId] = {
              completedAt: record.completedAt,
              progress: record.progress
            };
          }
        }
        maxWeek = Math.max(maxWeek, record.weekNumber);
      });

      return {
        completedComponents,
        currentWeek: maxWeek,
        responseData
      };
    }
    return loadFromLocalStorage();
  })();

  // Update progress in backend
  const mutation = useMutation({
    mutationFn: async (updates: Partial<CoachingProgressData> & { componentId?: string; moduleId?: string; weekNumber?: number }) => {
      if (!isAuthenticated) {
        // Fallback to localStorage only
        const current = loadFromLocalStorage();
        const updated = { ...current, ...updates };
        if (updates.componentId && !updated.completedComponents.includes(updates.componentId)) {
          updated.completedComponents = [...updated.completedComponents, updates.componentId];
        }
        localStorage.setItem(localStorageKey, JSON.stringify({ coachingProgress: updated }));
        return updated;
      }

      // Save to backend
      if (updates.componentId && updates.moduleId && updates.weekNumber) {
        // Create or update progress record for this component
        const existingProgress = dbProgress?.find(
          p => p.moduleId === updates.moduleId && p.weekNumber === updates.weekNumber
        );

        if (existingProgress) {
          // Update existing record
          await apiRequest('PUT', `/api/coaching-progress/${existingProgress.id}`, {
            completed: true,
            completedAt: new Date().toISOString(),
            progress: 100
          });
        } else {
          // Create new record
          await apiRequest('POST', '/api/coaching-progress', {
            weekNumber: updates.weekNumber,
            moduleId: updates.moduleId,
            completed: true,
            completedAt: new Date().toISOString(),
            progress: 100
          });
        }
      }

      // Invalidate query to refetch
      await queryClient.invalidateQueries({ queryKey: ['/api/coaching-progress'] });
      
      // Also update localStorage as cache
      const current = loadFromLocalStorage();
      const updated = { ...current, ...updates };
      if (updates.componentId && !updated.completedComponents.includes(updates.componentId)) {
        updated.completedComponents = [...updated.completedComponents, updates.componentId];
      }
      localStorage.setItem(localStorageKey, JSON.stringify({ coachingProgress: updated }));

      return updated;
    }
  });

  const updateCoachingProgress = useCallback((updates: Partial<CoachingProgressData> & { componentId?: string; moduleId?: string; weekNumber?: number }) => {
    mutation.mutate(updates);
  }, [mutation]);

  const resetCoachingProgress = useCallback(() => {
    const reset: CoachingProgressData = {
      completedComponents: [],
      currentWeek: 1,
      responseData: {}
    };
    localStorage.setItem(localStorageKey, JSON.stringify({ coachingProgress: reset }));
    if (isAuthenticated) {
      // TODO: Add delete endpoint or handle reset on backend
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-progress'] });
    }
  }, [localStorageKey, isAuthenticated, queryClient]);

  // Sync localStorage when DB data changes
  useEffect(() => {
    if (isAuthenticated && dbProgress) {
      const completedComponents: string[] = [];
      const responseData: Record<string, any> = {};
      let maxWeek = 1;

      dbProgress.forEach(record => {
        if (record.completed) {
          completedComponents.push(record.moduleId);
          if (record.completedAt) {
            responseData[record.moduleId] = {
              completedAt: record.completedAt,
              progress: record.progress
            };
          }
        }
        maxWeek = Math.max(maxWeek, record.weekNumber);
      });

      const syncedData: CoachingProgressData = {
        completedComponents,
        currentWeek: maxWeek,
        responseData
      };

      localStorage.setItem(localStorageKey, JSON.stringify({ coachingProgress: syncedData }));
    }
  }, [dbProgress, isAuthenticated, localStorageKey]);

  return {
    data: {
      coachingProgress: progressData,
      userProfile: user ? {
        name: user.firstName || 'User',
        email: user.email || '',
        startDate: new Date().toISOString().split('T')[0],
        currentWeek: progressData.currentWeek
      } : {
        name: 'Guest',
        email: '',
        startDate: new Date().toISOString().split('T')[0],
        currentWeek: 1
      }
    },
    updateCoachingProgress,
    resetCoachingProgress,
    isLoading: isLoading && isAuthenticated
  };
}

