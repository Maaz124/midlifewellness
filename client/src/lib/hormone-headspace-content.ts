// Detailed content for Hormone & Headspace coaching section

export interface ExerciseDetail {
  id: string;
  title: string;
  type: 'tracking' | 'reflection' | 'physical' | 'breathing' | 'meditation';
  duration: string;
  instructions: string[];
  materials: string[];
  benefits: string[];
  tips: string[];
}

// DETAILED EXERCISES
export const detailedExercises: ExerciseDetail[] = [
  {
    id: 'hormone-symphony-assessment',
    title: 'Personal Hormone Symphony Assessment',
    type: 'tracking',
    duration: '15 minutes',
    instructions: [
      'Rate your current symptoms on a scale of 1-5',
      'Track patterns over the past month',
      'Identify your most challenging times of day',
      'Note emotional and physical patterns',
      'Create your personalized hormone profile'
    ],
    materials: ['Notebook or tracking app', 'Quiet space for reflection'],
    benefits: [
      'Increased self-awareness of hormonal patterns',
      'Better understanding of symptom triggers',
      'Foundation for targeted interventions',
      'Reduced anxiety about changes'
    ],
    tips: [
      'Be honest about your experiences',
      'Track for at least one week for patterns',
      'Include positive changes too',
      'Share insights with healthcare provider'
    ]
  },
  {
    id: 'mental-clarity-reset',
    title: 'Mental Clarity Reset Toolkit',
    type: 'reflection',
    duration: '10 minutes',
    instructions: [
      'Perform 3-minute brain dump writing',
      'Practice single-tasking exercise',
      'Create energy-based daily schedule',
      'Implement cognitive load reduction',
      'Track mental clarity improvements'
    ],
    materials: ['Timer', 'Journal', 'Pen'],
    benefits: [
      'Reduced mental overwhelm',
      'Improved focus and concentration',
      'Better task prioritization',
      'Increased mental energy'
    ],
    tips: [
      'Start with short practice sessions',
      'Use timer to maintain focus',
      'Celebrate small wins',
      'Be patient with the process'
    ]
  },
  {
    id: 'hormone-harmony-meditation',
    title: 'Hormone Harmony Interactive Practice',
    type: 'meditation',
    duration: '15 minutes',
    instructions: [
      'Find comfortable seated position',
      'Begin with 4-7-8 breathing pattern',
      'Visualize hormonal balance and flow',
      'Send loving-kindness to your body',
      'End with gratitude practice'
    ],
    materials: ['Comfortable space', 'Optional: meditation cushion'],
    benefits: [
      'Reduced stress and cortisol levels',
      'Improved hormonal balance',
      'Enhanced self-compassion',
      'Better sleep quality'
    ],
    tips: [
      'Consistency matters more than duration',
      'Start with shorter sessions if needed',
      'Use guided version initially',
      'Practice at same time daily'
    ]
  },
  {
    id: 'cortisol-reset-breathing',
    title: 'Cortisol Reset Breathing System',
    type: 'breathing',
    duration: '8 minutes',
    instructions: [
      'Inhale for 4 counts through nose',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat cycle 4-8 times',
      'Track stress level before and after'
    ],
    materials: ['Timer', 'Stress level tracking sheet'],
    benefits: [
      'Immediate stress reduction',
      'Lowered cortisol levels',
      'Improved nervous system regulation',
      'Better emotional balance'
    ],
    tips: [
      'Practice on empty stomach',
      'Start slowly and build up',
      'Stop if feeling dizzy',
      'Use during stressful moments'
    ]
  }
];

// ADDITIONAL EXERCISES
export const additionalExercises: ExerciseDetail[] = [
  {
    id: 'symptom-tracker',
    title: 'Daily Hormone Harmony Tracker',
    type: 'tracking',
    duration: '5 minutes daily',
    instructions: [
      'Rate energy levels (1-10)',
      'Track mood fluctuations',
      'Note sleep quality',
      'Record stress triggers',
      'Monitor physical symptoms'
    ],
    materials: ['Tracking app or journal', 'Phone reminders'],
    benefits: [
      'Pattern recognition',
      'Trigger identification',
      'Progress tracking',
      'Healthcare communication tool'
    ],
    tips: [
      'Set daily reminder',
      'Be consistent with timing',
      'Include positive observations',
      'Review weekly for patterns'
    ]
  },
  {
    id: 'morning-ritual',
    title: 'Hormone-Supporting Morning Ritual',
    type: 'physical',
    duration: '15 minutes',
    instructions: [
      'Expose yourself to natural light',
      'Drink large glass of water',
      'Eat protein-rich breakfast',
      'Practice 5 minutes of movement',
      'Set positive intention for day'
    ],
    materials: ['Water bottle', 'Healthy breakfast ingredients'],
    benefits: [
      'Regulated cortisol rhythm',
      'Stable blood sugar',
      'Improved mood',
      'Better energy levels'
    ],
    tips: [
      'Start 15 minutes earlier',
      'Prepare night before',
      'Choose enjoyable movement',
      'Be consistent with timing'
    ]
  }
];

// WORKSHEET TEMPLATES
export const worksheetTemplates = [
  {
    id: 'hormone-tracking',
    title: 'Weekly Hormone Harmony Tracker',
    sections: [
      'Daily Energy Levels (1-10)',
      'Mood Fluctuations',
      'Sleep Quality',
      'Physical Symptoms',
      'Stress Triggers',
      'Weekly Patterns'
    ]
  },
  {
    id: 'mental-clarity',
    title: 'Mental Space Reset Worksheet',
    sections: [
      'Current Mental Overwhelm Level',
      'Main Focus Challenges',
      'Energy Patterns Throughout Day',
      'Cognitive Load Reduction Plan',
      'Weekly Progress Check'
    ]
  }
];