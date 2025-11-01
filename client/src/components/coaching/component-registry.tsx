/**
 * Component Registry
 * 
 * This file serves as a central registry for all coaching components.
 * It imports from the main component file and provides a clean interface
 * for accessing components by ID.
 * 
 * Future: Components can be gradually migrated to individual files
 * and this registry updated to import from those files instead.
 */

import EnhancedCoachingComponentMinimal from '../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from './shared/types';

// Component mapping type
export interface ComponentInfo {
  id: string;
  week: number;
  title: string;
  type: string;
  duration: number;
  category: string;
}

// Week 1: Mental Clarity & Mindset
export const WEEK1_COMPONENTS: ComponentInfo[] = [
  { id: 'focus-memory-rituals', week: 1, title: 'Interactive Focus & Memory Rituals', type: 'Practice', duration: 15, category: 'mental-clarity' },
  { id: 'cortisol-breathwork', week: 1, title: 'Cortisol Reset Breathwork', type: 'Practice', duration: 8, category: 'stress-relief' },
  { id: 'mental-space-reset', week: 1, title: 'Resetting Your Mental Space', type: 'Practice', duration: 10, category: 'brain-fog' },
  { id: 'symptom-tracker', week: 1, title: 'Daily Hormone Harmony Tracker', type: 'Tool', duration: 5, category: 'tracking' },
  { id: 'morning-ritual', week: 1, title: 'Sunrise Hormone Reset Ritual', type: 'Ritual', duration: 10, category: 'routine' },
  { id: 'brain-fog-exercise', week: 1, title: 'Mental Clarity Power Practice', type: 'Practice', duration: 8, category: 'brain-fog' },
  { id: 'energy-mapper', week: 1, title: 'Energy Pattern Mapper', type: 'Assessment', duration: 10, category: 'energy' },
  { id: 'thought-pattern-tracker', week: 1, title: 'Thought Pattern Tracker', type: 'Tool', duration: 10, category: 'mindset' },
  { id: 'nutrition-planning', week: 1, title: 'Brain-Boosting Nutrition Planner', type: 'Tool', duration: 15, category: 'nutrition' },
  { id: 'evening-routine', week: 1, title: 'Evening Wind-Down Ritual Creator', type: 'Ritual', duration: 10, category: 'routine' },
];

// Week 2: Emotional Regulation
export const WEEK2_COMPONENTS: ComponentInfo[] = [
  { id: 'cbt-transformation', week: 2, title: 'CBT Thought Transformation System', type: 'Exercise', duration: 20, category: 'cbt' },
  { id: 'mirror-work', week: 2, title: 'Mirror Work & Empowerment Affirmations', type: 'Practice', duration: 15, category: 'self-compassion' },
  { id: 'thought-audit', week: 2, title: 'Thought Audit Tracker', type: 'Tool', duration: 15, category: 'awareness' },
  { id: 'nlp-reframing', week: 2, title: 'NLP Reframing Practice', type: 'Exercise', duration: 20, category: 'nlp' },
  { id: 'hormone-meditation', week: 2, title: 'Hormone Harmony Meditation', type: 'Meditation', duration: 15, category: 'meditation' },
  { id: 'overwhelm-analysis', week: 2, title: 'Overwhelm Pattern Analysis', type: 'Assessment', duration: 15, category: 'overwhelm' },
  { id: 'pause-label-shift', week: 2, title: 'Pause-Label-Shift Technique', type: 'Practice', duration: 10, category: 'regulation' },
  { id: 'boundaries-worksheet', week: 2, title: 'Boundaries Empowerment Worksheet', type: 'Worksheet', duration: 20, category: 'boundaries' },
  { id: 'mood-map', week: 2, title: 'Weekly Mood Map', type: 'Tool', duration: 10, category: 'tracking' },
];

// Week 3: Cognitive Health  
export const WEEK3_COMPONENTS: ComponentInfo[] = [
  { id: 'hormonal-symphony', week: 3, title: 'Understanding Your Hormonal Symphony', type: 'Education', duration: 15, category: 'education' },
  { id: 'cognitive-assessment', week: 3, title: 'Enhanced Cognitive Assessment', type: 'Assessment', duration: 20, category: 'assessment' },
  { id: 'focus-rituals', week: 3, title: 'Focus & Memory Rituals', type: 'Practice', duration: 15, category: 'cognitive' },
  { id: 'brain-nutrition', week: 3, title: 'Brain-Boosting Nutrition Plan', type: 'Plan', duration: 20, category: 'nutrition' },
  { id: 'mind-management', week: 3, title: 'Mind Management System', type: 'System', duration: 25, category: 'cognitive' },
];

// Week 4: Nervous System Regulation
export const WEEK4_COMPONENTS: ComponentInfo[] = [
  { id: 'vagus-reset', week: 4, title: 'Breathwork & Vagus Nerve Reset', type: 'Practice', duration: 15, category: 'nervous-system' },
  { id: 'somatic-grounding', week: 4, title: 'Somatic Grounding Practices', type: 'Practice', duration: 20, category: 'somatic' },
  { id: 'calm-corner', week: 4, title: 'Create Your Calm Corner', type: 'Exercise', duration: 15, category: 'environment' },
  { id: 'grounding-meditation', week: 4, title: 'Guided Grounding Meditation', type: 'Meditation', duration: 20, category: 'meditation' },
];

// Week 5-6: Goals & Future Vision
export const WEEK5_6_COMPONENTS: ComponentInfo[] = [
  { id: 'future-self', week: 5, title: 'Future Self Visualization', type: 'Visualization', duration: 20, category: 'vision' },
  { id: 'smart-goals', week: 5, title: 'SMART Goal Architecture', type: 'Tool', duration: 25, category: 'goals' },
  { id: 'reverse-engineering', week: 6, title: 'Reverse Engineering Success', type: 'Exercise', duration: 20, category: 'planning' },
  { id: 'habit-mastery', week: 6, title: 'Habit Loop Mastery', type: 'System', duration: 25, category: 'habits' },
];

// Combined registry
export const ALL_COMPONENTS: ComponentInfo[] = [
  ...WEEK1_COMPONENTS,
  ...WEEK2_COMPONENTS,
  ...WEEK3_COMPONENTS,
  ...WEEK4_COMPONENTS,
  ...WEEK5_6_COMPONENTS,
];

// Helper to get component info by ID
export function getComponentInfo(id: string): ComponentInfo | undefined {
  return ALL_COMPONENTS.find(c => c.id === id);
}

// Helper to get components by week
export function getComponentsByWeek(week: number): ComponentInfo[] {
  return ALL_COMPONENTS.filter(c => c.week === week);
}

// Main component renderer - imports from the big file for now
export function renderCoachingComponent(props: CoachingComponentProps & { component: any; moduleId: string }) {
  // For now, delegate to the main component file
  // In the future, this can route to individual component files
  return <EnhancedCoachingComponentMinimal {...props} />;
}

export default {
  WEEK1_COMPONENTS,
  WEEK2_COMPONENTS,
  WEEK3_COMPONENTS,
  WEEK4_COMPONENTS,
  WEEK5_6_COMPONENTS,
  ALL_COMPONENTS,
  getComponentInfo,
  getComponentsByWeek,
  renderCoachingComponent,
};

