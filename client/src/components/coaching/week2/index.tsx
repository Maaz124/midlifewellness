/**
 * Week 2: Emotional Regulation Components
 */

import React from 'react';
import EnhancedCoachingComponent from '../../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from '../shared/types';

interface Week2Props extends CoachingComponentProps {
  component: {
    id: string;
    title: string;
    type: string;
    duration: number;
  };
}

export default function Week2Components({ component, onComplete, onClose }: Week2Props) {
  const week2ComponentIds = [
    'cbt-transformation',
    'mirror-work',
    'thought-audit',
    'nlp-reframing',
    'hormone-meditation',
    'overwhelm-analysis',
    'pause-label-shift',
    'boundaries-worksheet',
    'mood-map',
  ];

  if (!week2ComponentIds.includes(component.id)) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Invalid Week 2 component: {component.id}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EnhancedCoachingComponent
      component={component}
      moduleId="week2"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}

