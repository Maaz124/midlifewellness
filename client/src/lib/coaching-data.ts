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
        id: 'w1-video',
        type: 'video',
        title: 'Understanding Brain Changes',
        description: 'Learn about hormonal impacts on cognition and mood',
        duration: 15,
        completed: false
      },
      {
        id: 'w1-journal',
        type: 'reflection',
        title: 'What Am I Carrying?',
        description: 'Reflective journaling exercise to identify mental load',
        completed: false
      },
      {
        id: 'w1-tracking',
        type: 'exercise',
        title: 'Mood & Symptom Tracking',
        description: 'Begin daily tracking of mood and physical symptoms',
        completed: false
      },
      {
        id: 'w1-awareness',
        type: 'exercise',
        title: 'Thought Awareness Task',
        description: 'Daily practice to notice automatic thoughts',
        completed: false
      }
    ]
  },
  {
    id: 'week-2',
    weekNumber: 2,
    title: 'Rewiring Thoughts',
    description: 'CBT & NLP reframing techniques to transform negative thinking patterns',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w2-cbt',
        type: 'video',
        title: 'CBT Reframing Techniques',
        description: 'Learn cognitive behavioral therapy methods for thought transformation',
        duration: 18,
        completed: false
      },
      {
        id: 'w2-mirror',
        type: 'exercise',
        title: 'Mirror Work & Affirmations',
        description: 'Practice self-compassion through mirror work and affirmation scripting',
        completed: false
      },
      {
        id: 'w2-audit',
        type: 'worksheet',
        title: 'Thought Audit Tracker',
        description: 'Tool to identify and replace self-critical thoughts',
        completed: false
      },
      {
        id: 'w2-nlp',
        type: 'exercise',
        title: 'NLP Reframing Practice',
        description: 'Neuro-linguistic programming techniques for positive thinking',
        completed: false
      }
    ]
  },
  {
    id: 'week-3',
    weekNumber: 3,
    title: 'Emotion Regulation & Boundaries',
    description: 'Managing emotional overwhelm and setting healthy boundaries',
    completed: false,
    progress: 0,
    locked: false,
    components: [
      {
        id: 'w3-patterns',
        type: 'worksheet',
        title: 'Overwhelm Pattern Analysis',
        description: 'Identify your personal emotional overwhelm triggers',
        completed: false
      },
      {
        id: 'w3-technique',
        type: 'exercise',
        title: 'Pause-Label-Shift Technique',
        description: 'Learn the three-step emotion regulation method',
        completed: false
      },
      {
        id: 'w3-boundaries',
        type: 'worksheet',
        title: 'Boundaries Worksheet',
        description: 'Establish healthy boundaries in relationships and commitments',
        completed: false
      },
      {
        id: 'w3-mood-map',
        type: 'exercise',
        title: 'Weekly Mood Map',
        description: 'Create a visual map of your emotional patterns',
        completed: false
      }
    ]
  },
  {
    id: 'week-4',
    weekNumber: 4,
    title: 'Nervous System Reset',
    description: 'Somatic practices, breathwork, and vagus nerve reset techniques',
    completed: false,
    progress: 0,
    locked: true,
    components: [
      {
        id: 'w4-grounding',
        type: 'exercise',
        title: 'Somatic Grounding Practices',
        description: 'Body-based techniques to regulate your nervous system',
        completed: false
      },
      {
        id: 'w4-breathwork',
        type: 'exercise',
        title: 'Breathwork & Vagus Nerve Reset',
        description: 'Breathing techniques to activate the parasympathetic nervous system',
        completed: false
      },
      {
        id: 'w4-calm-corner',
        type: 'worksheet',
        title: 'Create Your Calm Corner',
        description: 'Design a dedicated space for relaxation and self-care',
        completed: false
      },
      {
        id: 'w4-meditation',
        type: 'audio',
        title: 'Guided Grounding Meditation',
        description: 'Audio meditation for nervous system regulation',
        duration: 12,
        completed: false
      }
    ]
  },
  {
    id: 'week-5',
    weekNumber: 5,
    title: 'Clarity & Cognitive Flow',
    description: 'Focus enhancement, memory support, and mental clarity tools',
    completed: false,
    progress: 0,
    locked: true,
    components: [
      {
        id: 'w5-rituals',
        type: 'exercise',
        title: 'Focus & Memory Rituals',
        description: 'Daily practices to enhance cognitive function',
        completed: false
      },
      {
        id: 'w5-nutrition',
        type: 'worksheet',
        title: 'Nutritional Brain Support',
        description: 'Guide to foods and supplements that support brain health',
        completed: false
      },
      {
        id: 'w5-planner',
        type: 'worksheet',
        title: 'Weekly Focus Planner',
        description: 'Tool to prioritize and organize your mental energy',
        completed: false
      },
      {
        id: 'w5-mind-dump',
        type: 'exercise',
        title: 'Mind-Dump & Prioritization',
        description: 'Clear mental clutter and focus on what matters most',
        completed: false
      }
    ]
  },
  {
    id: 'week-6',
    weekNumber: 6,
    title: 'Future Self & Goal Mapping',
    description: 'Vision creation, SMART goal setting, and sustainable habit formation',
    completed: false,
    progress: 0,
    locked: true,
    components: [
      {
        id: 'w6-vision',
        type: 'exercise',
        title: 'Digital Vision Board',
        description: 'Create a visual representation of your future self',
        completed: false
      },
      {
        id: 'w6-goals',
        type: 'worksheet',
        title: 'SMART Goal Setting',
        description: 'Develop specific, measurable, achievable goals aligned with your values',
        completed: false
      },
      {
        id: 'w6-reverse',
        type: 'exercise',
        title: 'Reverse Engineer Method',
        description: 'Work backwards from your goals to create actionable steps',
        completed: false
      },
      {
        id: 'w6-habits',
        type: 'exercise',
        title: 'Habit Loop Creator',
        description: 'Design sustainable habits that support your long-term goals',
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
