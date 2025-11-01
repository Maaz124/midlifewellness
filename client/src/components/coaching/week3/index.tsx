/**
 * Week 3: Cognitive Health Components
 */

import React from 'react';
import EnhancedCoachingComponent from '../../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from '../shared/types';

interface Week3Props extends CoachingComponentProps {
  component: {
    id: string;
    title: string;
    type: string;
    duration: number;
  };
}

export default function Week3Components({ component, onComplete, onClose }: Week3Props) {
  const week3ComponentIds = [
    'hormonal-symphony',
    'cognitive-assessment',
    'focus-rituals',
    'brain-nutrition',
    'mind-management',
  ];

  if (!week3ComponentIds.includes(component.id)) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Invalid Week 3 component: {component.id}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EnhancedCoachingComponent
      component={component}
      moduleId="week3"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}

