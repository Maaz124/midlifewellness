import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Pause, CheckCircle, Calendar, Clock, Heart, Brain, Sparkles } from 'lucide-react';
// Hormone content - inline data for now
const hormoneContent = {
  intro: "Your body is experiencing a complex symphony of hormonal changes during this phase of life. Understanding these changes is the first step toward reclaiming your vitality and mental clarity.",
  videoScript: "During perimenopause and menopause, estrogen levels fluctuate dramatically, affecting neurotransmitters like serotonin and dopamine that regulate mood, memory, and cognitive function.\n\nThese hormonal shifts can create brain fog, mood swings, and sleep disruption - but understanding the science helps you respond with targeted strategies rather than feeling overwhelmed.\n\nYour brain is remarkably adaptable, and with the right support, you can navigate this transition with greater ease and even discover new strengths.",
  commonSymptoms: [
    "Brain fog or difficulty concentrating",
    "Memory lapses",
    "Mood swings or irritability", 
    "Hot flashes or night sweats",
    "Sleep disturbances",
    "Fatigue or low energy",
    "Anxiety or feeling overwhelmed",
    "Changes in motivation",
    "Difficulty making decisions",
    "Physical tension or aches"
  ]
};

interface EnhancedCoachingComponentMinimalProps {
  component: any;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

// Interactive Focus & Memory Rituals Component
function InteractiveFocusMemoryRituals({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ritualData, setRitualData] = useState({
    selectedRituals: [] as string[],
    practiceTime: 0,
    effectiveness: 0,
    notes: ''
  });

  const rituals = [
    {
      id: 'morning-clarity',
      name: '5-Minute Morning Clarity Ritual',
      description: 'Start your day with focused intention',
      steps: ['Deep breathing', 'Set 3 priorities', 'Visualize success'],
      duration: 5
    },
    {
      id: 'memory-palace',
      name: 'Memory Palace Technique',
      description: 'Create mental associations for better recall',
      steps: ['Choose familiar location', 'Place items mentally', 'Walk through path'],
      duration: 10
    },
    {
      id: 'focus-flow',
      name: 'Focus Flow State',
      description: 'Enter deep concentration mode',
      steps: ['Eliminate distractions', 'Set timer', 'Single-task focus'],
      duration: 15
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Interactive Focus & Memory Rituals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Rituals</h3>
              <div className="grid gap-4">
                {rituals.map(ritual => (
                  <div key={ritual.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                       onClick={() => {
                         const selected = ritualData.selectedRituals.includes(ritual.id) 
                           ? ritualData.selectedRituals.filter(id => id !== ritual.id)
                           : [...ritualData.selectedRituals, ritual.id];
                         setRitualData({...ritualData, selectedRituals: selected});
                       }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{ritual.name}</h4>
                        <p className="text-sm text-gray-600">{ritual.description}</p>
                      </div>
                      <Badge variant={ritualData.selectedRituals.includes(ritual.id) ? "default" : "outline"}>
                        {ritual.duration} min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentStep(1)} 
                disabled={ritualData.selectedRituals.length === 0}
                className="mt-6"
              >
                Practice Selected Rituals
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Practice Session</h3>
              <div className="space-y-4">
                {ritualData.selectedRituals.map(id => {
                  const ritual = rituals.find(r => r.id === id);
                  return (
                    <div key={id} className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold">{ritual?.name}</h4>
                      <ul className="text-sm mt-2 space-y-1">
                        {ritual?.steps.map((step, idx) => (
                          <li key={idx}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setCurrentStep(2)} className="mt-6">
                Complete Practice
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Session Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Effectiveness (1-10)</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <Button
                        key={num}
                        variant={ritualData.effectiveness === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRitualData({...ritualData, effectiveness: num})}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea
                    value={ritualData.notes}
                    onChange={(e) => setRitualData({...ritualData, notes: e.target.value})}
                    placeholder="How did this feel? What worked best?"
                  />
                </div>
                <Button 
                  onClick={() => onComplete('focus-memory-rituals', ritualData)}
                  className="w-full"
                >
                  Complete Ritual Practice
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Brain-Boosting Nutrition Plan Component
function BrainBoostingNutritionPlan({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState({
    omega3: false,
    antioxidants: false,
    proteins: false,
    hydration: false
  });

  const brainFoods = [
    { category: 'Omega-3 Rich', foods: ['Salmon', 'Walnuts', 'Chia seeds', 'Flaxseeds'] },
    { category: 'Antioxidant Power', foods: ['Blueberries', 'Dark chocolate', 'Green tea', 'Spinach'] },
    { category: 'Protein Sources', foods: ['Eggs', 'Greek yogurt', 'Quinoa', 'Lentils'] },
    { category: 'Brain Beverages', foods: ['Water', 'Green tea', 'Herbal teas', 'Bone broth'] }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-green-600" />
          Brain-Boosting Nutrition Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Build Your Brain-Healthy Menu</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {brainFoods.map((category, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{category.category}</h4>
                  <div className="space-y-2">
                    {category.foods.map(food => (
                      <div key={food} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedMeals.includes(food)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMeals([...selectedMeals, food]);
                            } else {
                              setSelectedMeals(selectedMeals.filter(m => m !== food));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{food}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Weekly Nutrition Goals</h3>
            <div className="space-y-3">
              {Object.entries(nutritionGoals).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNutritionGoals({...nutritionGoals, [key]: e.target.checked})}
                    className="rounded"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => onComplete('nutrition-plan', { selectedMeals, nutritionGoals })}
            className="w-full"
            disabled={selectedMeals.length === 0}
          >
            Save My Nutrition Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Mind Management System Component
function MindManagementSystem({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentTechnique, setCurrentTechnique] = useState('');
  const [practiceData, setPracticeData] = useState({
    techniques: [] as string[],
    duration: 0,
    effectiveness: 0,
    insights: ''
  });

  const techniques = [
    { id: 'thought-stopping', name: 'Thought Stopping', description: 'Interrupt negative thought patterns' },
    { id: 'cognitive-reframing', name: 'Cognitive Reframing', description: 'Transform limiting beliefs' },
    { id: 'mindful-observation', name: 'Mindful Observation', description: 'Notice thoughts without judgment' },
    { id: 'worry-time', name: 'Designated Worry Time', description: 'Schedule time for concerns' }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Mind Management System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!currentTechnique && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose a Technique to Practice</h3>
              <div className="grid gap-4">
                {techniques.map(technique => (
                  <div key={technique.id} 
                       className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                       onClick={() => setCurrentTechnique(technique.id)}>
                    <h4 className="font-semibold">{technique.name}</h4>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTechnique && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Practicing: {techniques.find(t => t.id === currentTechnique)?.name}
              </h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-blue-800">
                  Practice this technique for 5-10 minutes. Focus on the process, not perfection.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">How effective was this? (1-10)</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <Button
                        key={num}
                        variant={practiceData.effectiveness === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPracticeData({...practiceData, effectiveness: num})}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Insights & Observations</label>
                  <Textarea
                    value={practiceData.insights}
                    onChange={(e) => setPracticeData({...practiceData, insights: e.target.value})}
                    placeholder="What did you notice? Any insights or challenges?"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentTechnique('');
                      setPracticeData({...practiceData, techniques: [...practiceData.techniques, currentTechnique]});
                    }}
                  >
                    Practice Another
                  </Button>
                  <Button 
                    onClick={() => onComplete('mind-management', {
                      ...practiceData,
                      techniques: [...practiceData.techniques, currentTechnique]
                    })}
                  >
                    Complete Session
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Cortisol Reset Breathwork Component
function CortisolResetBreathwork({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentPhase, setCurrentPhase] = useState('assessment');
  const [breathingData, setBreathingData] = useState({
    preStressLevel: 0,
    postStressLevel: 0,
    selectedTechnique: '',
    sessionDuration: 0,
    completedCycles: 0,
    effectiveness: 0,
    notes: ''
  });
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const breathingTechniques = {
    '4-7-8': {
      name: '4-7-8 Technique',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      inhale: 4,
      hold: 7,
      exhale: 8,
      benefits: ['Reduces cortisol', 'Activates parasympathetic nervous system', 'Promotes deep relaxation'],
      instructions: [
        'Find a comfortable seated position',
        'Place tongue tip behind upper front teeth',
        'Exhale completely through mouth',
        'Close mouth, inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts'
      ]
    },
    'box': {
      name: 'Box Breathing',
      description: 'Equal 4-count rhythm for all phases',
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4,
      benefits: ['Balances nervous system', 'Improves focus', 'Reduces stress hormones'],
      instructions: [
        'Sit with spine straight',
        'Exhale all air from lungs',
        'Inhale through nose for 4 counts',
        'Hold breath for 4 counts',
        'Exhale through mouth for 4 counts',
        'Pause for 4 counts before next cycle'
      ]
    }
  };

  const updateBreathingData = (key: string, value: any) => {
    setBreathingData(prev => ({ ...prev, [key]: value }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          Cortisol Reset Breathwork (8 minutes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentPhase === 'assessment' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Pre-Session Stress Assessment</h3>
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <p className="text-red-800 mb-4">
                  Rate your current stress level to track the effectiveness of this breathwork session.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Very calm</span>
                    <span className="text-sm text-gray-600">Extremely stressed</span>
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(level => (
                      <Button
                        key={level}
                        variant={breathingData.preStressLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateBreathingData('preStressLevel', level)}
                        className={`w-12 h-12 p-0 ${
                          breathingData.preStressLevel === level 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'border-gray-300 hover:border-red-400'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentPhase('technique-selection')}
                disabled={breathingData.preStressLevel === 0}
                className="w-full"
              >
                Continue to Technique Selection
              </Button>
            </div>
          )}

          {currentPhase === 'technique-selection' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Breathing Technique</h3>
              <div className="grid gap-6">
                {Object.entries(breathingTechniques).map(([key, technique]) => (
                  <div key={key} 
                       className={`border rounded-lg p-6 cursor-pointer transition-all ${
                         breathingData.selectedTechnique === key 
                           ? 'border-red-500 bg-red-50' 
                           : 'border-gray-200 hover:border-red-300'
                       }`}
                       onClick={() => updateBreathingData('selectedTechnique', key)}>
                    <h4 className="font-semibold mb-2">{technique.name}</h4>
                    <p className="text-gray-600 mb-4">{technique.description}</p>
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Benefits:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {technique.benefits.map((benefit: string, idx: number) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentPhase('practice')}
                disabled={!breathingData.selectedTechnique}
                className="w-full mt-6"
              >
                Start Breathing Practice
              </Button>
            </div>
          )}

          {currentPhase === 'practice' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Guided {breathingTechniques[breathingData.selectedTechnique as keyof typeof breathingTechniques]?.name} Practice
              </h3>
              
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 mb-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-2xl text-white font-bold capitalize">{breathPhase}</span>
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    {breathPhase === 'inhale' && 'Breathe in slowly through your nose'}
                    {breathPhase === 'hold' && 'Hold your breath gently'}
                    {breathPhase === 'exhale' && 'Exhale slowly through your mouth'}
                    {breathPhase === 'pause' && 'Rest and prepare for next cycle'}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{cycleCount}</div>
                    <div className="text-sm text-gray-600">Cycles Completed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{formatTime(sessionTime)}</div>
                    <div className="text-sm text-gray-600">Session Time</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">8:00</div>
                    <div className="text-sm text-gray-600">Target Duration</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className={isBreathing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {isBreathing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isBreathing ? 'Pause' : 'Start'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPhase('complete')}
                  >
                    End Session
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">Instructions:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {breathingTechniques[breathingData.selectedTechnique as keyof typeof breathingTechniques]?.instructions.map((instruction: string, idx: number) => (
                    <li key={idx}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentPhase === 'complete' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-600">
                    You've completed {formatTime(sessionTime)} of cortisol-reset breathwork.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How do you feel now? (1-10)</label>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Much calmer</span>
                      <span className="text-sm text-gray-600">Same/More stressed</span>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button
                          key={level}
                          variant={breathingData.postStressLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateBreathingData('postStressLevel', level)}
                          className={`w-10 h-10 p-0 ${
                            breathingData.postStressLevel === level 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Session Effectiveness (1-10)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button
                          key={level}
                          variant={breathingData.effectiveness === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateBreathingData('effectiveness', level)}
                          className={`w-10 h-10 p-0 ${
                            breathingData.effectiveness === level 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes & Observations</label>
                    <Textarea
                      value={breathingData.notes}
                      onChange={(e) => updateBreathingData('notes', e.target.value)}
                      placeholder="How did this feel? Any insights or physical sensations?"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-blue-800 mb-2">💡 Integration Tips</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Practice this technique for 2-3 minutes during stressful moments</li>
                  <li>• Use it before important meetings or difficult conversations</li>
                  <li>• Try it when you wake up feeling anxious</li>
                  <li>• Set a daily reminder to practice at the same time each day</li>
                </ul>
              </div>

              <Button 
                onClick={() => onComplete('cortisol-breathwork', {
                  ...breathingData,
                  sessionDuration: sessionTime,
                  completedCycles: cycleCount,
                  improvementScore: breathingData.preStressLevel - breathingData.postStressLevel,
                  completedAt: new Date().toISOString()
                })}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Complete Breathwork Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Resetting Your Mental Space Component  
function ResettingYourMentalSpace({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [clarityData, setClarityData] = useState({
    preMentalClarity: 0,
    postMentalClarity: 0,
    identifiedSymptoms: [] as string[],
    practiceNotes: '',
    completedTechniques: [] as string[],
    effectiveness: 0,
    insights: ''
  });

  const fogSymptoms = [
    'Difficulty concentrating',
    'Forgetting words mid-sentence', 
    'Walking into rooms and forgetting why',
    'Struggling to follow conversations',
    'Feeling mentally "cloudy" or "fuzzy"',
    'Taking longer to process information',
    'Difficulty making decisions',
    'Feeling mentally fatigued'
  ];

  const clarityTechniques = [
    {
      id: 'brain-dump',
      name: '5-Minute Brain Dump',
      description: 'Clear mental clutter by writing everything down',
      steps: [
        'Set a timer for 5 minutes',
        'Write continuously without stopping',
        'Don\'t worry about grammar or organization',
        'Include thoughts, worries, tasks, anything in your mind',
        'When timer ends, review what you wrote',
        'Circle 3 priority items'
      ]
    },
    {
      id: 'focus-reset',
      name: 'Focus Reset Technique',
      description: 'Reset your attention with intentional focus shifts',
      steps: [
        'Look at something far away for 30 seconds',
        'Close your eyes and take 3 deep breaths',
        'Open eyes and focus on something near for 30 seconds',
        'Say out loud: "I am present and focused"',
        'Choose one specific task to focus on',
        'Set intention to give it full attention'
      ]
    },
    {
      id: 'clarity-questions',
      name: 'Clarity Questions',
      description: 'Use targeted questions to sharpen thinking',
      steps: [
        'Ask: "What exactly am I trying to accomplish?"',
        'Ask: "What\'s the most important thing right now?"',
        'Ask: "What would make this clearer?"',
        'Write down your answers',
        'Read them back to yourself',
        'Choose one action to take immediately'
      ]
    },
    {
      id: 'movement-reset',
      name: '2-Minute Movement Reset',
      description: 'Use physical movement to boost mental clarity',
      steps: [
        'Stand up and stretch arms overhead',
        'Do 10 gentle neck rolls',
        'March in place for 30 seconds',
        'Do 5 jumping jacks or arm circles',
        'Take 3 deep breaths while moving arms',
        'Sit down with intention to focus'
      ]
    }
  ];

  const updateClarityData = (key: string, value: any) => {
    setClarityData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Resetting Your Mental Space (10 minutes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentPhase === 'intro' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Understanding Brain Fog</h3>
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-purple-800 mb-4">
                  Brain fog isn't a character flaw or sign of aging - it's a real symptom of hormonal changes 
                  that affect neurotransmitter function. The good news? There are immediate techniques you can 
                  use to clear the mental haze and restore sharp thinking.
                </p>
                <div className="space-y-3 text-sm text-purple-700">
                  <p><strong>What's happening:</strong> Fluctuating estrogen affects acetylcholine and dopamine, 
                  neurotransmitters crucial for attention and memory.</p>
                  <p><strong>Why it matters:</strong> Understanding the science helps you respond strategically 
                  rather than feeling frustrated.</p>
                  <p><strong>The solution:</strong> Targeted techniques that work with your brain's natural 
                  ability to refocus and reset.</p>
                </div>
              </div>

              <div className="bg-white border border-purple-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-800 mb-4">Pre-Session Clarity Check</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your current mental clarity (1-10)</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Very foggy</span>
                  <span className="text-sm text-gray-600">Crystal clear</span>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(level => (
                    <Button
                      key={level}
                      variant={clarityData.preMentalClarity === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateClarityData('preMentalClarity', level)}
                      className={`w-10 h-10 p-0 ${
                        clarityData.preMentalClarity === level 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setCurrentPhase('symptoms')}
                disabled={clarityData.preMentalClarity === 0}
                className="w-full"
              >
                Continue to Symptom Check
              </Button>
            </div>
          )}

          {currentPhase === 'symptoms' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Identify Your Fog Patterns</h3>
              <p className="text-gray-600 mb-6">
                Which of these brain fog symptoms have you experienced recently? 
                (Check all that apply)
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {fogSymptoms.map((symptom: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={clarityData.identifiedSymptoms.includes(symptom)}
                      onChange={(e) => {
                        const symptoms = e.target.checked
                          ? [...clarityData.identifiedSymptoms, symptom]
                          : clarityData.identifiedSymptoms.filter(s => s !== symptom);
                        updateClarityData('identifiedSymptoms', symptoms);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setCurrentPhase('techniques')}
                disabled={clarityData.identifiedSymptoms.length === 0}
                className="w-full"
              >
                Continue to Clarity Techniques
              </Button>
            </div>
          )}

          {currentPhase === 'techniques' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose a Clarity Technique to Practice</h3>
              <p className="text-gray-600 mb-6">
                Select one technique to practice now. You can come back and try others anytime.
              </p>
              
              <div className="grid gap-4">
                {clarityTechniques.map(technique => (
                  <div key={technique.id} 
                       className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                       onClick={() => setCurrentPhase(`practice-${technique.id}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{technique.name}</h4>
                      <Badge variant="outline">Practice Now</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPhase.startsWith('practice-') && (
            <div>
              {clarityTechniques.map(technique => {
                if (currentPhase !== `practice-${technique.id}`) return null;
                
                return (
                  <div key={technique.id}>
                    <h3 className="text-xl font-semibold mb-4">Practice: {technique.name}</h3>
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <p className="text-blue-800 mb-4">{technique.description}</p>
                      <h5 className="font-semibold text-blue-800 mb-3">Step-by-step instructions:</h5>
                      <ol className="text-sm text-blue-700 space-y-2">
                        {technique.steps.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h5 className="font-semibold mb-4">Practice Notes</h5>
                      <Textarea
                        value={clarityData.practiceNotes}
                        onChange={(e) => updateClarityData('practiceNotes', e.target.value)}
                        placeholder="How did this technique feel? What did you notice? Any insights or challenges?"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentPhase('techniques')}
                      >
                        Try Another Technique
                      </Button>
                      <Button 
                        onClick={() => {
                          updateClarityData('completedTechniques', [...clarityData.completedTechniques, technique.id]);
                          setCurrentPhase('complete');
                        }}
                        className="flex-1"
                      >
                        Complete Practice
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentPhase === 'complete' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Mental Space Reset Complete!</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-600">
                    You've completed a mental clarity reset session!
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How is your mental clarity now? (1-10)</label>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Much clearer</span>
                      <span className="text-sm text-gray-600">Same/Worse</span>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button
                          key={level}
                          variant={clarityData.postMentalClarity === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateClarityData('postMentalClarity', level)}
                          className={`w-10 h-10 p-0 ${
                            clarityData.postMentalClarity === level 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    {clarityData.postMentalClarity > 0 && (
                      <div className="text-center text-sm text-gray-600 mt-2">
                        Clarity improvement: {clarityData.postMentalClarity - clarityData.preMentalClarity} points
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Technique Effectiveness (1-10)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button
                          key={level}
                          variant={clarityData.effectiveness === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateClarityData('effectiveness', level)}
                          className={`w-10 h-10 p-0 ${
                            clarityData.effectiveness === level 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Insights</label>
                    <Textarea
                      value={clarityData.insights}
                      onChange={(e) => updateClarityData('insights', e.target.value)}
                      placeholder="What did you learn about your brain fog patterns? Which technique worked best?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-blue-800 mb-2">💡 Integration Tips</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use these techniques whenever you notice brain fog starting</li>
                  <li>• Practice during your typical "fog times" of day</li>
                  <li>• Keep a note on your phone with the technique steps</li>
                  <li>• Combine with other healthy habits (after coffee, before meetings)</li>
                </ul>
              </div>

              <Button 
                onClick={() => onComplete('mental-space-reset', {
                  ...clarityData,
                  improvementScore: clarityData.postMentalClarity - clarityData.preMentalClarity,
                  symptomCount: clarityData.identifiedSymptoms.length,
                  completedAt: new Date().toISOString()
                })}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Complete Mental Space Reset
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Understanding Your Hormonal Symphony Component
function UnderstandingYourHormonalSymphony({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentSection, setCurrentSection] = useState('intro');
  const [assessmentData, setAssessmentData] = useState({
    preScore: 0,
    postScore: 0,
    symptoms: [] as string[],
    insights: '',
    videoWatched: false
  });

  const updateAssessment = (key: string, value: any) => {
    setAssessmentData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" />
          Understanding Your Hormonal Symphony
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentSection === 'intro' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Hormonal Journey</h3>
              <p className="text-gray-600 mb-6">
                {hormoneContent.intro}
              </p>
              
              <div className="bg-pink-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-pink-800 mb-2">Quick Hormone Assessment</h4>
                <p className="text-sm text-pink-700 mb-4">Rate your current hormonal balance (1-10)</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <Button
                      key={num}
                      variant={assessmentData.preScore === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateAssessment('preScore', num)}
                      className={assessmentData.preScore === num ? 'bg-pink-600' : ''}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setCurrentSection('video')}
                disabled={assessmentData.preScore === 0}
              >
                Continue to Video Content
              </Button>
            </div>
          )}

          {currentSection === 'video' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">The Science Behind Your Symptoms</h3>
              
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">12-Minute Educational Video</h4>
                    <p className="text-sm text-gray-600">Understanding hormone fluctuations in midlife</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  {hormoneContent.videoScript.split('\n\n').slice(0, 3).map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => {
                  updateAssessment('videoWatched', true);
                  setCurrentSection('symptoms');
                }}
              >
                I've Watched the Video
              </Button>
            </div>
          )}

          {currentSection === 'symptoms' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Symptom Identification</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {hormoneContent.commonSymptoms.map((symptom: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={assessmentData.symptoms.includes(symptom)}
                      onChange={(e) => {
                        const symptoms = e.target.checked
                          ? [...assessmentData.symptoms, symptom]
                          : assessmentData.symptoms.filter(s => s !== symptom);
                        updateAssessment('symptoms', symptoms);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setCurrentSection('completion')}
                disabled={assessmentData.symptoms.length === 0}
              >
                Complete Assessment
              </Button>
            </div>
          )}

          {currentSection === 'completion' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Assessment Complete</h3>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-green-800 mb-2">Your Hormonal Profile</h4>
                <p className="text-sm text-green-700 mb-4">
                  You've identified {assessmentData.symptoms.length} relevant symptoms.
                </p>
                
                <div className="space-y-2">
                  <div>Initial hormone balance rating: {assessmentData.preScore}/10</div>
                  <div>Symptoms identified: {assessmentData.symptoms.length}</div>
                  <div>Video completed: ✓</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Key Insights</label>
                  <Textarea
                    value={assessmentData.insights}
                    onChange={(e) => updateAssessment('insights', e.target.value)}
                    placeholder="What resonated most with you from this session?"
                  />
                </div>

                <Button 
                  onClick={() => onComplete('hormone-symphony', assessmentData)}
                  className="w-full"
                >
                  Complete Hormonal Symphony Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Enhanced Coaching Component
export function EnhancedCoachingComponentMinimal({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentMinimalProps) {
  // Handle special interactive components
  if (component.id === 'focus-memory-rituals') {
    return <InteractiveFocusMemoryRituals onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'nutrition-plan') {
    return <BrainBoostingNutritionPlan onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'mind-management') {
    return <MindManagementSystem onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'hormone-symphony') {
    return <UnderstandingYourHormonalSymphony onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'cortisol-breathwork') {
    return <CortisolResetBreathwork onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'mental-space-reset') {
    return <ResettingYourMentalSpace onComplete={onComplete} onClose={onClose} />;
  }

  // Default fallback for any other components
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          {component.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800">
              {component.description}
            </p>
          </div>
          
          <Button 
            onClick={() => onComplete(component.id)}
            className="w-full"
          >
            Complete {component.title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}