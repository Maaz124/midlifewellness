// Detailed scripts and content for Hormone & Headspace coaching section

export interface VideoScript {
  id: string;
  title: string;
  duration: string;
  script: string;
  keyPoints: string[];
  exercises: string[];
}

export interface AudioScript {
  id: string;
  title: string;
  duration: string;
  script: string;
  backgroundMusic: string;
  instructions: string[];
}

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

// VIDEO SCRIPTS
export const videoScripts: VideoScript[] = [
  {
    id: 'hormone-basics',
    title: 'Understanding Your Hormonal Symphony',
    duration: '12 minutes',
    script: `
[INTRO - 0:00-0:30]
Welcome to Week 1 of your Mind-Body Reset journey. I'm here to guide you through understanding the beautiful, complex symphony of hormones that influence every aspect of your midlife experience.

[MAIN CONTENT - 0:30-10:00]
Let's start with the truth: your hormones aren't broken, they're transitioning. Think of perimenopause as your body's wisdom preparing for the next chapter of your life.

The three key players we'll focus on:

ESTROGEN - Your mood stabilizer
- Fluctuating estrogen affects serotonin production
- This explains the emotional rollercoaster you might be experiencing
- Low estrogen can impact memory and focus - you're not losing your mind

PROGESTERONE - Your calm companion  
- Known as nature's anti-anxiety hormone
- Declining progesterone can disrupt sleep and increase anxiety
- Understanding this helps you respond with compassion, not frustration

CORTISOL - Your stress responder
- Chronic stress during midlife amplifies hormonal symptoms
- When cortisol is elevated, it interferes with other hormone production
- Learning to manage stress becomes crucial for hormonal balance

[PRACTICAL SECTION - 10:00-11:30]
Your daily hormone-supporting practices:
1. Morning sunlight exposure - regulates cortisol rhythm
2. Protein at breakfast - stabilizes blood sugar and mood
3. Evening wind-down routine - supports progesterone production
4. Mindful movement - not intense exercise that spikes cortisol

[CLOSING - 11:30-12:00]
Remember: You're not at the mercy of your hormones. You're learning to dance with them. This week, we'll build your personalized hormone harmony toolkit.
    `,
    keyPoints: [
      'Hormones are transitioning, not broken',
      'Estrogen affects mood and memory',
      'Progesterone supports calm and sleep',
      'Cortisol management is crucial',
      'Daily practices support hormone balance'
    ],
    exercises: [
      'Daily hormone symptom tracking',
      'Morning sunlight practice',
      'Evening wind-down routine creation'
    ]
  },
  {
    id: 'headspace-reset',
    title: 'Resetting Your Mental Space',
    duration: '10 minutes',
    script: `
[INTRO - 0:00-0:45]
Your mind during perimenopause might feel like a browser with too many tabs open. Today we're learning to close the unnecessary ones and focus on what truly matters.

[MAIN CONTENT - 0:45-8:00]
THE PERIMENOPAUSE BRAIN TRUTH:
Your brain is literally rewiring itself. The prefrontal cortex - your executive function center - is adapting to hormonal changes. This isn't decline, it's renovation.

COMMON EXPERIENCES:
- "Brain fog" - difficulty concentrating
- Word retrieval challenges
- Feeling mentally scattered
- Overwhelm with daily tasks

THE RESET APPROACH:
Instead of fighting these changes, we'll work WITH your brain's new patterns.

TECHNIQUE 1: The 3-Minute Mental Clear
- Set a timer for 3 minutes
- Write down every thought racing through your mind
- Don't judge, just dump it all onto paper
- Notice how your mind feels clearer after

TECHNIQUE 2: Single-Tasking Practice
- Choose ONE task for the next 25 minutes
- Put phone in another room
- Focus solely on that task
- Celebrate completion before moving to the next

TECHNIQUE 3: Energy-Based Scheduling
- Track your mental energy patterns for one week
- Schedule demanding tasks during your peak energy times
- Use low-energy times for routine or creative tasks

[PRACTICAL APPLICATION - 8:00-9:30]
This week's challenge:
- Practice the 3-Minute Mental Clear every morning
- Implement single-tasking for at least two work sessions daily
- Begin tracking your energy patterns

[CLOSING - 9:30-10:00]
Your changing brain is not a problem to solve - it's a masterpiece being refined. Trust the process and be patient with yourself.
    `,
    keyPoints: [
      'Perimenopause brain is renovating, not declining',
      'Brain fog is temporary and manageable',
      'Single-tasking improves focus and reduces overwhelm',
      'Energy-based scheduling maximizes productivity',
      'Mental clearing creates space for clarity'
    ],
    exercises: [
      '3-Minute Mental Clear practice',
      'Single-tasking implementation',
      'Energy pattern tracking'
    ]
  }
];

// AUDIO SCRIPTS
export const audioScripts: AudioScript[] = [
  {
    id: 'hormone-balance-meditation',
    title: 'Hormone Harmony Meditation',
    duration: '15 minutes',
    backgroundMusic: 'Soft nature sounds with gentle chimes',
    script: `
[SETTLING IN - 0:00-2:00]
Find a comfortable position... close your eyes or soften your gaze... 
Take three deep breaths, allowing each exhale to release any tension you're carrying...

[BODY AWARENESS - 2:00-5:00]
Now, bring your attention to your body... Notice how it feels in this moment without trying to change anything...
Your body is wise... it has carried you through so much... and it's navigating this transition with incredible intelligence...

Place one hand on your heart, one on your belly... Feel the rhythm of your breath... the steady beat of your heart...
These rhythms are connected to your hormonal rhythms... all working together in perfect coordination...

[VISUALIZATION - 5:00-10:00]
Imagine a warm, golden light beginning to glow in your lower belly... This is the light of your feminine wisdom...
As you breathe, this light grows brighter... spreading warmth throughout your reproductive system...
See this light communicating with every cell... every hormone... bringing balance and harmony...

The light moves up to your heart... surrounding it with compassion for yourself during this transition...
It continues to your mind... clearing away worry and bringing clarity and peace...

[AFFIRMATIONS - 10:00-13:00]
As you rest in this warm light, repeat these truths to yourself:
"My body is wise and capable..."
"I trust my body's natural rhythms..."
"I am exactly where I need to be..."
"I embrace this phase of my life with grace..."
"My hormones are finding their new balance..."

[INTEGRATION - 13:00-15:00]
Take a moment to send gratitude to your body... for all it does for you...
Slowly begin to wiggle your fingers and toes... take three deep breaths...
When you're ready, gently open your eyes...
Carry this sense of harmony with you throughout your day...
    `,
    instructions: [
      'Find a quiet, comfortable space',
      'Use headphones for best experience',
      'Practice at the same time daily for consistency',
      'Keep a journal nearby for post-meditation insights'
    ]
  },
  {
    id: 'stress-release-breathwork',
    title: 'Cortisol Reset Breathwork',
    duration: '8 minutes',
    backgroundMusic: 'Ocean waves with soft ambient tones',
    script: `
[INTRODUCTION - 0:00-1:00]
This breathwork practice is designed to reset your nervous system and lower cortisol levels...
We'll use a specific rhythm that signals safety to your body...
Find a comfortable seated position with your spine tall but relaxed...

[TECHNIQUE EXPLANATION - 1:00-2:00]
We'll practice the 4-7-8 breath:
Inhale for 4 counts through your nose...
Hold for 7 counts...
Exhale for 8 counts through your mouth with a whooshing sound...

This pattern activates your parasympathetic nervous system - your rest and digest mode...

[GUIDED PRACTICE - 2:00-6:30]
Let's begin... 
Exhale completely first... empty your lungs...

Inhale through your nose for 4... 2... 3... 4...
Hold... 2... 3... 4... 5... 6... 7...
Exhale with a whoosh for 8... 2... 3... 4... 5... 6... 7... 8...

[Continue for 4 complete cycles with guidance]

Beautiful... you're sending signals of safety to every cell in your body...

[CLOSING INTEGRATION - 6:30-8:00]
Return to natural breathing... notice how your body feels...
You've just given your nervous system a gift...
Your cortisol levels are naturally lowering...
Your body is remembering how to rest...
Take this sense of calm with you into your day...
    `,
    instructions: [
      'Practice on empty stomach or 2 hours after eating',
      'Start with 4 cycles, build up to 8',
      'Stop if you feel dizzy and return to normal breathing',
      'Use morning or evening for best results'
    ]
  }
];

// DETAILED EXERCISES
export const detailedExercises: ExerciseDetail[] = [
  {
    id: 'hormone-symptom-tracker',
    title: 'Daily Hormone Harmony Tracker',
    type: 'tracking',
    duration: '5 minutes daily',
    instructions: [
      'Complete this tracker at the same time each evening',
      'Rate each symptom on a scale of 1-5 (1 = none, 5 = severe)',
      'Note any patterns between symptoms and daily activities',
      'Look for trends over 2-week periods rather than daily changes',
      'Use insights to adjust your hormone-supporting practices'
    ],
    materials: [
      'Tracking sheet or app',
      'Pen or digital device',
      'Calendar for reference'
    ],
    benefits: [
      'Identifies personal hormone patterns',
      'Reduces anxiety by providing clarity',
      'Helps predict and prepare for difficult days',
      'Tracks progress of interventions',
      'Empowers informed conversations with healthcare providers'
    ],
    tips: [
      'Don\'t judge symptoms, just observe them',
      'Include positive symptoms too (good energy, clear thinking)',
      'Note sleep quality and stress levels',
      'Track menstrual cycle if still present',
      'Be consistent for most accurate patterns'
    ]
  },
  {
    id: 'morning-hormone-ritual',
    title: 'Sunrise Hormone Reset Ritual',
    type: 'physical',
    duration: '15 minutes',
    instructions: [
      'Begin within 30 minutes of waking',
      'Step outside or sit by a bright window',
      'Face east toward the sunrise if possible',
      'Take 10 deep breaths while feeling sunlight on your face',
      'Do 5 minutes of gentle stretching or movement',
      'Drink 16oz of water with a pinch of sea salt',
      'Eat protein within 30 minutes of this ritual'
    ],
    materials: [
      'Outdoor space or bright window',
      'Comfortable clothing',
      'Water bottle',
      'High-quality sea salt',
      'Protein-rich breakfast prepared'
    ],
    benefits: [
      'Regulates circadian rhythm and cortisol',
      'Improves sleep quality',
      'Stabilizes blood sugar',
      'Enhances mood and energy',
      'Supports healthy hormone production'
    ],
    tips: [
      'Consistency matters more than perfection',
      'Cloudy days still provide beneficial light',
      'Wear minimal sunglasses to allow light exposure',
      'Combine with gratitude practice for added benefits',
      'Adjust timing seasonally but maintain routine'
    ]
  },
  {
    id: 'brain-fog-clearing',
    title: 'Mental Clarity Power Practice',
    type: 'reflection',
    duration: '10 minutes',
    instructions: [
      'Sit comfortably with paper and pen',
      'Set timer for 3 minutes',
      'Write continuously - every thought in your head',
      'Don\'t edit or judge, just brain dump',
      'When timer sounds, take 3 deep breaths',
      'Read what you wrote without judgment',
      'Circle the 3 most important items',
      'Choose 1 to focus on for the next 25 minutes'
    ],
    materials: [
      'Paper and pen (not digital)',
      'Timer',
      'Quiet space',
      'Comfortable seating'
    ],
    benefits: [
      'Clears mental clutter immediately',
      'Reduces overwhelm and anxiety',
      'Improves focus and decision-making',
      'Reveals subconscious concerns',
      'Creates mental space for creativity'
    ],
    tips: [
      'Write fast, don\'t think',
      'Include emotions, not just tasks',
      'Do this before important work sessions',
      'Keep writings private to encourage honesty',
      'Notice patterns in recurring thoughts'
    ]
  },
  {
    id: 'energy-mapping',
    title: 'Personal Energy Pattern Discovery',
    type: 'tracking',
    duration: '2 minutes, 4 times daily',
    instructions: [
      'Set 4 alarms: morning, midday, afternoon, evening',
      'When alarm sounds, rate energy level 1-10',
      'Note what you\'re doing and how you feel',
      'Rate mental clarity separately from physical energy',
      'Track for 2 full weeks minimum',
      'Look for patterns and plan accordingly'
    ],
    materials: [
      'Phone with alarms',
      'Energy tracking sheet',
      'Pen or note-taking app'
    ],
    benefits: [
      'Optimizes daily schedule for peak performance',
      'Reduces frustration with low-energy periods',
      'Improves work-life balance',
      'Identifies energy drains and boosters',
      'Supports better self-care planning'
    ],
    tips: [
      'Include weekend tracking for full picture',
      'Note correlation with meals and activities',
      'Track hormonal cycle influence if applicable',
      'Adjust expectations based on patterns',
      'Use insights to batch similar tasks'
    ]
  },
  {
    id: 'evening-wind-down',
    title: 'Evening Wind-Down Routine Creation',
    type: 'meditation',
    duration: '20 minutes',
    instructions: [
      'Begin ritual 1 hour before intended sleep time',
      'Dim all lights and turn off screens',
      'Take warm bath or shower with Epsom salts',
      'Practice gentle yoga or stretching (5 minutes)',
      'Do the hormone harmony meditation (15 minutes)',
      'Write 3 things you\'re grateful for',
      'Set intention for restful sleep'
    ],
    materials: [
      'Epsom salts',
      'Dim lighting or candles',
      'Comfortable clothes',
      'Journal',
      'Essential oils (optional: lavender, chamomile)'
    ],
    benefits: [
      'Naturally boosts progesterone production',
      'Improves sleep quality and duration',
      'Reduces next-day cortisol levels',
      'Calms nervous system',
      'Creates healthy sleep associations'
    ],
    tips: [
      'Keep bedroom cool (65-68°F)',
      'Use blackout curtains or eye mask',
      'No caffeine after 2 PM',
      'Keep consistent timing even on weekends',
      'If can\'t sleep, continue relaxation practices'
    ]
  }
];

// ADDITIONAL EXERCISES
export const additionalExercises: ExerciseDetail[] = [
  {
    id: 'thought-awareness-practice',
    title: 'Hormonal Thought Awareness Practice',
    type: 'reflection',
    duration: '10 minutes',
    instructions: [
      'Set aside 10 minutes for quiet reflection',
      'Close your eyes and take 5 deep breaths',
      'Notice what thoughts arise about your body and hormones',
      'Observe these thoughts without judgment - just notice them',
      'Write down any recurring thought patterns you observe',
      'For each negative thought, write a compassionate reframe'
    ],
    materials: [
      'Quiet space',
      'Journal or paper',
      'Pen',
      'Timer'
    ],
    benefits: [
      'Increases awareness of hormone-related thought patterns',
      'Reduces self-criticism and judgment',
      'Builds mindful observation skills',
      'Creates space between thoughts and reactions',
      'Develops self-compassion during hormonal changes'
    ],
    tips: [
      'Don\'t try to stop thoughts, just observe them',
      'Be curious rather than critical about your thoughts',
      'Notice the difference between facts and interpretations',
      'Practice this daily for best results',
      'Celebrate small shifts in awareness'
    ]
  },
  {
    id: 'hormone-nutrition-planning',
    title: 'Hormone-Supporting Meal Planning',
    type: 'tracking',
    duration: '15 minutes',
    instructions: [
      'Review your current eating patterns for one week',
      'Identify meals that support vs. stress your hormones',
      'Plan 3 hormone-supporting meals for the upcoming week',
      'Include protein, healthy fats, and fiber at each meal',
      'Schedule your meal prep time',
      'Create a grocery list based on your meal plan'
    ],
    materials: [
      'Food diary or tracking app',
      'Meal planning template',
      'Grocery list',
      'Calendar for meal prep scheduling'
    ],
    benefits: [
      'Stabilizes blood sugar and energy levels',
      'Supports healthy hormone production',
      'Reduces cortisol spikes from poor nutrition',
      'Improves mood and mental clarity',
      'Creates structure for busy days'
    ],
    tips: [
      'Focus on whole, unprocessed foods',
      'Include omega-3 rich foods for hormone production',
      'Eat regularly to maintain blood sugar stability',
      'Prepare snacks in advance for busy days',
      'Listen to your body\'s hunger and fullness cues'
    ]
  }
];

// WORKSHEET TEMPLATES
export const worksheetTemplates = {
  hormoneSymptomTracker: {
    title: 'Weekly Hormone Harmony Tracker',
    sections: [
      {
        name: 'Physical Symptoms',
        items: ['Hot flashes', 'Night sweats', 'Fatigue', 'Joint aches', 'Headaches', 'Weight changes']
      },
      {
        name: 'Emotional Symptoms', 
        items: ['Mood swings', 'Anxiety', 'Irritability', 'Depression', 'Overwhelm', 'Emotional sensitivity']
      },
      {
        name: 'Cognitive Symptoms',
        items: ['Brain fog', 'Memory issues', 'Concentration difficulty', 'Word finding problems', 'Mental fatigue']
      },
      {
        name: 'Sleep & Energy',
        items: ['Sleep quality', 'Energy level', 'Morning alertness', 'Afternoon energy', 'Evening wind-down']
      }
    ]
  },
  energyMapping: {
    title: 'Personal Energy Pattern Map',
    timeSlots: ['6-9 AM', '9 AM-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9 PM-12 AM'],
    trackingItems: ['Physical Energy', 'Mental Clarity', 'Emotional State', 'Motivation Level', 'Focus Ability']
  },
  thoughtAwareness: {
    title: 'Hormonal Thought Pattern Tracker',
    sections: [
      {
        name: 'Common Thought Categories',
        prompts: [
          'What thoughts come up about my changing body?',
          'How do I talk to myself about my symptoms?',
          'What fears do I have about this transition?',
          'What expectations am I placing on myself?',
          'How do I compare myself to other women?'
        ]
      },
      {
        name: 'Compassionate Reframes',
        examples: [
          'Instead of "My body is failing me" → "My body is transitioning with wisdom"',
          'Instead of "I\'m losing my mind" → "My brain is adapting to new hormonal patterns"',
          'Instead of "I should be handling this better" → "I\'m learning to navigate this transition with grace"'
        ]
      }
    ]
  },
  nutritionPlanning: {
    title: 'Hormone-Supporting Meal Planner',
    categories: [
      {
        name: 'Protein Sources',
        options: ['Wild-caught fish', 'Grass-fed meat', 'Organic eggs', 'Legumes', 'Hemp seeds', 'Quinoa']
      },
      {
        name: 'Healthy Fats',
        options: ['Avocado', 'Olive oil', 'Nuts', 'Seeds', 'Coconut oil', 'Fatty fish']
      },
      {
        name: 'Fiber-Rich Vegetables',
        options: ['Leafy greens', 'Cruciferous vegetables', 'Colorful bell peppers', 'Sweet potatoes', 'Artichokes', 'Brussels sprouts']
      },
      {
        name: 'Hormone-Supporting Herbs',
        options: ['Turmeric', 'Ginger', 'Maca root', 'Ashwagandha', 'Holy basil', 'Spearmint']
      }
    ],
    mealStructure: {
      breakfast: 'Protein + Healthy Fat + Fiber + Optional: Hormone-supporting herb',
      lunch: 'Protein + Vegetables + Healthy Fat + Complex carbs',
      dinner: 'Protein + Vegetables + Healthy Fat + Light carbs',
      snacks: 'Protein + Fat or Fiber-rich fruit + nuts'
    }
  }
};