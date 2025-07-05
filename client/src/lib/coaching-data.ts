import { CoachingModule, ModuleComponent } from '@/types/wellness';

export const coachingModules: CoachingModule[] = [
  {
    id: 'week-1',
    weekNumber: 1,
    title: 'Hormones & Headspace',
    description: 'Understanding perimenopause brain shifts and tracking mood patterns',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'hormone-symphony',
        type: 'exercise',
        title: 'Your Personal Hormone Symphony Assessment',
        description: 'Interactive 12-step hormonal pattern mapping with personalized insights, symptom tracking, and educational content about brain changes during perimenopause',
        completed: false
      },
      {
        id: 'mental-space-reset',
        type: 'exercise',
        title: 'Mental Clarity Reset Toolkit',
        description: 'Interactive 10-minute brain fog clearing practice with cognitive exercises, focus techniques, and mental clarity tracking system',
        completed: false
      },
      {
        id: 'hormone-meditation',
        type: 'exercise',
        title: 'Hormone Harmony Interactive Practice',
        description: '15-minute guided self-practice with breathing prompts, visualization cues, and hormonal balance tracking for deep relaxation',
        completed: false
      },
      {
        id: 'cortisol-breathwork',
        type: 'exercise',
        title: 'Cortisol Reset Breathing System',
        description: '8-minute interactive breathing practice with timer, pattern guidance, stress level tracking, and cortisol reduction techniques',
        completed: false
      },
      {
        id: 'symptom-tracker',
        type: 'exercise',
        title: 'Daily Hormone Harmony Tracker',
        description: 'Interactive symptom tracking with sliders and insights',
        completed: false
      },
      {
        id: 'morning-ritual',
        type: 'exercise',
        title: 'Sunrise Hormone Reset Ritual',
        description: '15-minute morning practice for hormone regulation',
        completed: false
      },
      {
        id: 'brain-fog-exercise',
        type: 'exercise',
        title: 'Mental Clarity Power Practice',
        description: '10-minute brain fog clearing technique with tracking',
        completed: false
      },
      {
        id: 'energy-mapping',
        type: 'exercise',
        title: 'Personal Energy Pattern Discovery',
        description: 'Interactive energy tracking across different time periods',
        completed: false
      },
      {
        id: 'thought-awareness',
        type: 'reflection',
        title: 'Hormonal Thought Awareness Practice',
        description: 'Interactive thought pattern tracker with reframe exercises',
        completed: false
      },
      {
        id: 'nutrition-planning',
        type: 'worksheet',
        title: 'Hormone-Supporting Meal Planning',
        description: 'Food selection tool and weekly meal planner',
        completed: false
      },
      {
        id: 'evening-wind-down',
        type: 'exercise',
        title: 'Evening Wind-Down Routine Creation',
        description: 'Design your personalized progesterone-supporting evening ritual',
        duration: 20,
        completed: false
      }
    ]
  },
  {
    id: 'week-2',
    weekNumber: 2,
    title: 'Rewiring Thoughts',
    description: 'Transform limiting beliefs using evidence-based CBT & NLP techniques specifically designed for midlife cognitive transformation',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w2-cbt-intro-interactive',
        type: 'exercise',
        title: 'CBT Discovery Workshop for Midlife Women',
        description: 'Interactive 12-step cognitive behavioral therapy exploration with examples, self-assessment tools, and personalized insights for midlife challenges',
        completed: false
      },
      {
        id: 'w2-mindful-thought-tracker',
        type: 'exercise',
        title: 'Mindful Thought Observation Interactive Practice',
        description: '10-minute guided thought awareness exercise with timer, prompts, and real-time tracking of thought patterns and emotional responses',
        completed: false
      },
      {
        id: 'w2-cbt-reframing',
        type: 'exercise',
        title: 'CBT Thought Transformation System',
        description: 'Master the 5-step cognitive behavioral therapy framework to identify, challenge, and reframe automatic negative thoughts with real-time practice scenarios',
        completed: false
      },
      {
        id: 'w2-mirror-affirmations',
        type: 'exercise',
        title: 'Mirror Work & Empowerment Affirmations',
        description: 'Design personalized affirmation scripts and practice self-compassion techniques through guided mirror work sessions',
        completed: false
      },
      {
        id: 'w2-thought-audit',
        type: 'worksheet',
        title: 'Comprehensive Thought Pattern Audit',
        description: 'Complete 7-day thought tracking system to identify negative patterns, triggers, and replacement strategies with scoring analysis',
        completed: false
      },
      {
        id: 'w2-nlp-reframing',
        type: 'exercise',
        title: 'NLP Language Pattern Mastery',
        description: 'Learn advanced neuro-linguistic programming techniques including anchoring, reframing, and submodality shifts for lasting thought transformation',
        completed: false
      }
    ]
  },
  {
    id: 'week-3',
    weekNumber: 3,
    title: 'Emotion Regulation & Boundaries',
    description: 'Master emotional overwhelm and create protective boundaries for midlife transitions',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w3-patterns',
        type: 'worksheet',
        title: 'Overwhelm Pattern Analysis',
        description: 'Complete comprehensive analysis of your overwhelm triggers, physical responses, and most effective coping strategies',
        completed: false
      },
      {
        id: 'w3-technique',
        type: 'exercise',
        title: 'Pause-Label-Shift Technique',
        description: 'Master the neuroscience-backed 3-step emotion regulation method with guided practice scenarios',
        completed: false
      },
      {
        id: 'w3-boundaries',
        type: 'worksheet',
        title: 'Boundaries Worksheet',
        description: 'Design personalized boundary scripts for time, emotional, family, and digital situations',
        completed: false
      },
      {
        id: 'w3-mood-map',
        type: 'exercise',
        title: 'Weekly Mood Map',
        description: 'Track daily mood and energy patterns across morning, afternoon, and evening with insights analysis',
        completed: false
      }
    ]
  },
  {
    id: 'week-4',
    weekNumber: 4,
    title: 'Nervous System Reset',
    description: 'Somatic practices, breathwork, and vagus nerve reset techniques for midlife regulation',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w4-grounding',
        type: 'exercise',
        title: 'Somatic Grounding Practices',
        description: 'Master 5 powerful body-based techniques including 5-4-3-2-1 grounding, body scan, progressive relaxation, and quick nervous system resets',
        completed: false
      },
      {
        id: 'w4-breathwork',
        type: 'exercise',
        title: 'Breathwork & Vagus Nerve Reset',
        description: 'Learn box breathing, heart coherence, cold exposure breathing, and humming techniques for instant calm',
        completed: false
      },
      {
        id: 'w4-calm-corner',
        type: 'worksheet',
        title: 'Create Your Calm Corner',
        description: 'Design your personalized sanctuary with color psychology, aromatherapy, and mindful rituals',
        completed: false
      },
      {
        id: 'w4-meditation',
        type: 'exercise',
        title: 'Guided Grounding Meditation',
        description: '12-minute nervous system regulation meditation with body scan and breath awareness',
        duration: 12,
        completed: false
      }
    ]
  },
  {
    id: 'week-5',
    weekNumber: 5,
    title: 'Clarity & Cognitive Flow',
    description: 'Enhance mental clarity, memory, and focus during midlife transitions and hormonal changes',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w5-assessment',
        type: 'worksheet',
        title: '🧠 Enhanced Cognitive Clarity Assessment',
        description: 'NEW: 18 detailed questions with educational context and instant personalized tips for midlife cognitive health',
        completed: false
      },
      {
        id: 'w5-rituals',
        type: 'exercise',
        title: 'Focus & Memory Rituals',
        description: 'Design personalized daily cognitive enhancement routines including brain training, mindfulness, and memory techniques',
        completed: false
      },
      {
        id: 'w5-nutrition',
        type: 'worksheet',
        title: 'Brain-Boosting Nutrition Plan',
        description: 'Create customized meal plans with cognitive-supporting foods, supplements, and hydration strategies for midlife',
        completed: false
      },
      {
        id: 'w5-mind-management',
        type: 'exercise',
        title: 'Mind Management System',
        description: 'Master brain dump techniques, priority matrices, and cognitive load management for mental clarity',
        completed: false
      }
    ]
  },
  {
    id: 'week-6',
    weekNumber: 6,
    title: 'Future Self & Goal Mapping',
    description: 'Design your thriving future through values-based vision creation, evidence-based goal setting, and sustainable habit formation specifically for midlife women',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w6-vision',
        type: 'exercise',
        title: '🎯 Future Self Visualization & Values Mapping',
        description: '5-step comprehensive visioning process with values assessment, life wheel analysis, and personalized future self creation for midlife transitions',
        completed: false
      },
      {
        id: 'w6-goals',
        type: 'worksheet',
        title: 'SMART Goal Architecture System',
        description: 'Evidence-based goal framework with 6 life domains, implementation timeline, obstacle anticipation, and success metrics for midlife women',
        completed: false
      },
      {
        id: 'w6-reverse',
        type: 'exercise',
        title: 'Reverse Engineering Success Method',
        description: 'Strategic backward planning with milestone mapping, resource identification, and action sequencing for sustainable goal achievement',
        completed: false
      },
      {
        id: 'w6-habits',
        type: 'exercise',
        title: 'Habit Loop Mastery System',
        description: 'Neuroscience-based habit formation with cue-routine-reward loops, implementation intentions, and habit stacking for lasting change',
        completed: false
      }
    ]
  }
];

export const journalPrompts = [
  {
    week: 1,
    prompts: [
      "What mental and emotional load am I carrying that I hadn't fully acknowledged?",
      "How has my relationship with my body changed in recent years?",
      "What thoughts about myself have become automatic? Are they serving me?",
      "What would it feel like to give myself permission to rest?"
    ]
  },
  {
    week: 2,
    prompts: [
      "What story have I been telling myself about my worth?",
      "When I look in the mirror, what would my best friend want me to see?",
      "What would I say to a daughter facing the same challenges I am?",
      "How can I reframe this difficult situation to find growth or meaning?"
    ]
  },
  {
    week: 3,
    prompts: [
      "What emotions have I been carrying that I need to acknowledge and release?",
      "Where in my life do I need stronger boundaries?",
      "What would it look like to prioritize my own needs without guilt?",
      "How can I create more emotional space in my daily life?"
    ]
  },
  {
    week: 4,
    prompts: [
      "What does safety feel like in my body?",
      "When do I feel most grounded and present?",
      "What activities help me feel calm and centered?",
      "How can I create more moments of peace in my day?"
    ]
  },
  {
    week: 5,
    prompts: [
      "What activities make me feel most mentally sharp and engaged?",
      "How has my relationship with my cognitive abilities evolved?",
      "What would it look like to embrace my brain's unique strengths?",
      "How can I optimize my environment for better focus and clarity?"
    ]
  },
  {
    week: 6,
    prompts: [
      "What does my most fulfilled future self look like?",
      "What values do I want to guide my next chapter?",
      "What legacy do I want to create?",
      "How can I align my daily actions with my deepest values?"
    ]
  }
];

export function getTodaysPrompt(weekNumber: number): string {
  const weekPrompts = journalPrompts.find(p => p.week === weekNumber);
  if (!weekPrompts) return "What am I grateful for today, and how can I build on that feeling?";
  
  const dayIndex = Math.floor(Math.random() * weekPrompts.prompts.length);
  return weekPrompts.prompts[dayIndex];
}

export function getModuleProgress(moduleId: string, completedComponents: string[]): number {
  const module = coachingModules.find(m => m.id === moduleId);
  if (!module) return 0;
  
  const completed = module.components.filter(c => completedComponents.includes(c.id)).length;
  return Math.round((completed / module.components.length) * 100);
}
