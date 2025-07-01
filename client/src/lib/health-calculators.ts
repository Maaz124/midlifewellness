import { AssessmentQuestion } from '@/types/wellness';

export const mentalHealthQuestions: AssessmentQuestion[] = [
  {
    id: 'phq9_1',
    question: 'Over the last 2 weeks, how often have you had little interest or pleasure in doing things?',
    type: 'rating',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    weight: 1
  },
  {
    id: 'phq9_2',
    question: 'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
    type: 'rating',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    weight: 1
  },
  {
    id: 'phq9_3',
    question: 'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
    type: 'rating',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    weight: 1
  },
  {
    id: 'gad7_1',
    question: 'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?',
    type: 'rating',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    weight: 1
  },
  {
    id: 'gad7_2',
    question: 'Over the last 2 weeks, how often have you not been able to stop or control worrying?',
    type: 'rating',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    weight: 1
  },
  {
    id: 'sleep_quality',
    question: 'How would you rate your overall sleep quality?',
    type: 'rating',
    options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    weight: 1.5
  },
  {
    id: 'emotional_regulation',
    question: 'How well do you feel you manage your emotions day-to-day?',
    type: 'rating',
    options: ['Very poorly', 'Poorly', 'Moderately well', 'Well', 'Very well'],
    weight: 1.2
  },
  {
    id: 'stress_management',
    question: 'How effectively do you handle stress in your daily life?',
    type: 'rating',
    options: ['Very ineffectively', 'Ineffectively', 'Moderately', 'Effectively', 'Very effectively'],
    weight: 1.2
  },
  {
    id: 'social_support',
    question: 'How satisfied are you with your social support network?',
    type: 'rating',
    options: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'],
    weight: 1
  }
];

export const physicalHealthQuestions: AssessmentQuestion[] = [
  {
    id: 'energy_levels',
    question: 'How would you rate your energy levels throughout the day?',
    type: 'rating',
    options: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
    weight: 1.5
  },
  {
    id: 'hot_flashes',
    question: 'How often do you experience hot flashes or night sweats?',
    type: 'rating',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'],
    weight: 1
  },
  {
    id: 'joint_pain',
    question: 'How would you rate any joint pain or stiffness you experience?',
    type: 'rating',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'],
    weight: 1
  },
  {
    id: 'physical_activity',
    question: 'How often do you engage in physical activity or exercise?',
    type: 'rating',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
    weight: 1.3
  },
  {
    id: 'menstrual_changes',
    question: 'Have you noticed changes in your menstrual cycle?',
    type: 'rating',
    options: ['No changes', 'Slight changes', 'Moderate changes', 'Significant changes', 'Menopause'],
    weight: 0.8
  },
  {
    id: 'weight_management',
    question: 'How satisfied are you with your current weight management?',
    type: 'rating',
    options: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'],
    weight: 1
  },
  {
    id: 'digestive_health',
    question: 'How would you rate your digestive health?',
    type: 'rating',
    options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    weight: 1
  },
  {
    id: 'libido',
    question: 'How has your libido/sexual interest changed recently?',
    type: 'rating',
    options: ['Significantly decreased', 'Decreased', 'No change', 'Increased', 'Significantly increased'],
    weight: 0.8
  }
];

export const cognitiveHealthQuestions: AssessmentQuestion[] = [
  {
    id: 'memory_recall',
    question: 'How often do you have difficulty remembering recent events or conversations?',
    type: 'rating',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'],
    weight: 1.5
  },
  {
    id: 'focus_concentration',
    question: 'How well can you focus and concentrate on tasks?',
    type: 'rating',
    options: ['Very poorly', 'Poorly', 'Moderately well', 'Well', 'Very well'],
    weight: 1.5
  },
  {
    id: 'word_finding',
    question: 'How often do you have trouble finding the right words when speaking?',
    type: 'rating',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'],
    weight: 1.2
  },
  {
    id: 'mental_clarity',
    question: 'How clear and sharp does your thinking feel most days?',
    type: 'rating',
    options: ['Very foggy', 'Foggy', 'Moderate', 'Clear', 'Very clear'],
    weight: 1.5
  },
  {
    id: 'multitasking',
    question: 'How well can you handle multiple tasks at once?',
    type: 'rating',
    options: ['Very poorly', 'Poorly', 'Moderately well', 'Well', 'Very well'],
    weight: 1
  },
  {
    id: 'decision_making',
    question: 'How confident do you feel when making decisions?',
    type: 'rating',
    options: ['Very unconfident', 'Unconfident', 'Moderately confident', 'Confident', 'Very confident'],
    weight: 1.2
  },
  {
    id: 'learning_new_things',
    question: 'How easy is it for you to learn new information or skills?',
    type: 'rating',
    options: ['Very difficult', 'Difficult', 'Moderate', 'Easy', 'Very easy'],
    weight: 1
  }
];

export function calculateScore(responses: any[], questions: AssessmentQuestion[]): number {
  let totalScore = 0;
  let totalWeight = 0;

  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question) {
      let normalizedScore = 0;
      
      if (typeof response.value === 'number') {
        // For rating questions, normalize to 0-100 scale
        const maxValue = question.options ? question.options.length - 1 : 4;
        
        // Reverse scoring for negative questions
        if (question.id.includes('phq9') || question.id.includes('gad7') || 
            question.id.includes('hot_flashes') || question.id.includes('joint_pain') ||
            question.id.includes('memory_recall') || question.id.includes('word_finding')) {
          normalizedScore = ((maxValue - response.value) / maxValue) * 100;
        } else {
          normalizedScore = (response.value / maxValue) * 100;
        }
      }
      
      totalScore += normalizedScore * question.weight;
      totalWeight += question.weight;
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

export function getScoreInterpretation(score: number, type: 'mental' | 'physical' | 'cognitive'): string {
  if (score >= 80) {
    return type === 'mental' ? 'Excellent emotional balance' : 
           type === 'physical' ? 'Excellent vitality' : 'Excellent cognitive clarity';
  } else if (score >= 60) {
    return type === 'mental' ? 'Good emotional balance' : 
           type === 'physical' ? 'Good vitality' : 'Good cognitive clarity';
  } else if (score >= 40) {
    return type === 'mental' ? 'Moderate emotional balance' : 
           type === 'physical' ? 'Moderate vitality' : 'Moderate cognitive clarity';
  } else {
    return type === 'mental' ? 'Consider focusing on emotional wellness' : 
           type === 'physical' ? 'Consider focusing on physical wellness' : 'Consider focusing on cognitive wellness';
  }
}

export function getPersonalizedRecommendations(score: number, type: 'mental' | 'physical' | 'cognitive'): string[] {
  const recommendations = [];

  if (type === 'mental') {
    if (score < 60) {
      recommendations.push('Practice daily mindfulness or meditation');
      recommendations.push('Establish a consistent sleep routine');
      recommendations.push('Consider journaling to process emotions');
    }
    if (score < 40) {
      recommendations.push('Reach out to a mental health professional');
      recommendations.push('Focus on stress management techniques');
    }
  } else if (type === 'physical') {
    if (score < 60) {
      recommendations.push('Incorporate gentle exercise into your routine');
      recommendations.push('Focus on nutrition and hydration');
      recommendations.push('Consider discussing hormone balance with your doctor');
    }
    if (score < 40) {
      recommendations.push('Consult with a healthcare provider');
      recommendations.push('Prioritize rest and recovery');
    }
  } else if (type === 'cognitive') {
    if (score < 60) {
      recommendations.push('Practice brain training exercises');
      recommendations.push('Ensure adequate sleep for cognitive function');
      recommendations.push('Consider omega-3 supplements for brain health');
    }
    if (score < 40) {
      recommendations.push('Discuss cognitive concerns with your healthcare provider');
      recommendations.push('Focus on stress reduction techniques');
    }
  }

  return recommendations;
}
