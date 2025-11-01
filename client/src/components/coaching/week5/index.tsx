/**
 * Week 5-6: Goals & Future Vision Components
 */

import React from 'react';
import EnhancedCoachingComponent from '../../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from '../shared/types';

interface Week5Props extends CoachingComponentProps {
  component: {
    id: string;
    title: string;
    type: string;
    duration: number;
  };
}

export default function Week5Components({ component, onComplete, onClose }: Week5Props) {
  const week5ComponentIds = [
    'future-self',
    'smart-goals',
    'reverse-engineering',
    'habit-mastery',
  ];

  if (!week5ComponentIds.includes(component.id)) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Invalid Week 5-6 component: {component.id}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EnhancedCoachingComponent
      component={component}
      moduleId="week5"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}

