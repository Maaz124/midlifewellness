/**
 * Week 4: Nervous System Regulation Components
 */

import React from 'react';
import EnhancedCoachingComponent from '../../enhanced-coaching-component-fixed';
import { CoachingComponentProps } from '../shared/types';

interface Week4Props extends CoachingComponentProps {
  component: {
    id: string;
    title: string;
    type: string;
    duration: number;
  };
}

export default function Week4Components({ component, onComplete, onClose }: Week4Props) {
  const week4ComponentIds = [
    'vagus-reset',
    'somatic-grounding',
    'calm-corner',
    'grounding-meditation',
  ];

  if (!week4ComponentIds.includes(component.id)) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Invalid Week 4 component: {component.id}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EnhancedCoachingComponent
      component={component}
      moduleId="week4"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}

