/**
 * Week 1: Mental Clarity & Mindset Components
 * 
 * This module exports all Week 1 coaching components.
 * Components are currently imported from the main file but can be
 * gradually migrated to separate files in this directory.
 */

import React from 'react';
import EnhancedCoachingComponent from '../../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from '../shared/types';

interface Week1Props extends CoachingComponentProps {
  component: {
    id: string;
    title: string;
    type: string;
    duration: number;
  };
}

/**
 * Week 1 Component Router
 * Routes to the appropriate Week 1 component based on component ID
 */
export default function Week1Components({ component, onComplete, onClose }: Week1Props) {
  // Map component IDs to their implementations
  const week1ComponentIds = [
    'focus-memory-rituals',
    'cortisol-breathwork',
    'mental-space-reset',
    'symptom-tracker',
    'morning-ritual',
    'brain-fog-exercise',
    'energy-mapper',
    'thought-pattern-tracker',
    'nutrition-planning',
    'evening-routine',
  ];

  // Validate this is a Week 1 component
  if (!week1ComponentIds.includes(component.id)) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Invalid Week 1 component: {component.id}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Go Back
        </button>
      </div>
    );
  }

  // For now, delegate to the main component file
  // In the future, individual components can be imported from separate files
  return (
    <EnhancedCoachingComponent
      component={component}
      moduleId="week1"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}

// Individual component exports (for future use when components are extracted)
// export { InteractiveFocusMemoryRituals } from './focus-memory-rituals';
// export { CortisolResetBreathwork } from './cortisol-breathwork';
// etc...

