import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Pause, CheckCircle, Calendar, Clock, Heart, Brain, Sparkles, FileText } from 'lucide-react';
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

// Interactive Symptom Tracker Component
function InteractiveSymptomTracker({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [symptoms, setSymptoms] = useState({
    hotFlashes: 0,
    brainFog: 0,
    moodSwings: 0,
    sleepQuality: 0,
    energyLevel: 0,
    anxiety: 0
  });
  const [insights, setInsights] = useState('');

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
          Daily Hormone Harmony Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Rate how you're feeling today in each area (0-10 scale)</p>
          
          {Object.entries(symptoms).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex gap-2">
                {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button
                    key={level}
                    variant={value === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSymptoms(prev => ({...prev, [key]: level}))}
                    className="w-10 h-10 p-0"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2">Daily Insights</label>
            <Textarea
              value={insights}
              onChange={(e) => setInsights(e.target.value)}
              placeholder="What patterns do you notice? Any triggers or helpful strategies?"
            />
          </div>

          <Button onClick={() => onComplete('symptom-tracker', {symptoms, insights})} className="w-full">
            Save Daily Tracking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Morning Ritual Creator Component
function MorningRitualCreator({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [customRitual, setCustomRitual] = useState('');

  const ritualOptions = [
    'Morning sunlight exposure (5 min)',
    'Gratitude practice (3 min)',
    'Gentle stretching (5 min)',
    'Deep breathing (2 min)',
    'Hormone-supporting breakfast',
    'Hydration with lemon water',
    'Intention setting (2 min)'
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
          <Clock className="w-6 h-6 text-orange-600" />
          Sunrise Hormone Reset Ritual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Choose practices for your personalized morning ritual:</p>
          
          <div className="grid gap-3">
            {ritualOptions.map(option => (
              <div key={option} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedPractices.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPractices([...selectedPractices, option]);
                    } else {
                      setSelectedPractices(selectedPractices.filter(p => p !== option));
                    }
                  }}
                  className="rounded"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Add Custom Practice</label>
            <Textarea
              value={customRitual}
              onChange={(e) => setCustomRitual(e.target.value)}
              placeholder="Any other morning practices you'd like to include?"
            />
          </div>

          <Button 
            onClick={() => onComplete('morning-ritual', {selectedPractices, customRitual})}
            className="w-full"
            disabled={selectedPractices.length === 0}
          >
            Create My Morning Ritual
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Brain Fog Clearing Practice Component
function BrainFogClearingPractice({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceData, setPracticeData] = useState({
    preFogLevel: 0,
    postFogLevel: 0,
    completedTechniques: [] as string[],
    effectiveness: 0
  });

  const techniques = [
    'Cold water on wrists (30 seconds)',
    'Deep breathing with counting (2 minutes)',
    'Quick physical movement (1 minute)',
    'Brain dump writing (3 minutes)',
    'Mindful focus exercise (2 minutes)'
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
          Mental Clarity Power Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pre-Practice Assessment</h3>
              <p className="text-gray-600 mb-4">Rate your current brain fog level (0-10):</p>
              <div className="flex gap-2 mb-6">
                {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button
                    key={level}
                    variant={practiceData.preFogLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPracticeData(prev => ({...prev, preFogLevel: level}))}
                    className="w-10 h-10 p-0"
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentStep(1)}
                disabled={practiceData.preFogLevel === 0}
              >
                Start Clearing Practice
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">10-Minute Clearing Session</h3>
              <div className="space-y-4">
                {techniques.map((technique, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const completed = e.target.checked
                          ? [...practiceData.completedTechniques, technique]
                          : practiceData.completedTechniques.filter(t => t !== technique);
                        setPracticeData(prev => ({...prev, completedTechniques: completed}));
                      }}
                      className="rounded"
                    />
                    <span>{technique}</span>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setCurrentStep(2)}
                className="mt-6"
                disabled={practiceData.completedTechniques.length === 0}
              >
                Complete Practice
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Post-Practice Assessment</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-2">Brain fog level now (0-10):</p>
                  <div className="flex gap-2">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                      <Button
                        key={level}
                        variant={practiceData.postFogLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPracticeData(prev => ({...prev, postFogLevel: level}))}
                        className="w-10 h-10 p-0"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Overall effectiveness (0-10):</p>
                  <div className="flex gap-2">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                      <Button
                        key={level}
                        variant={practiceData.effectiveness === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPracticeData(prev => ({...prev, effectiveness: level}))}
                        className="w-10 h-10 p-0"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => onComplete('brain-fog-exercise', practiceData)}
                className="w-full mt-6"
                disabled={practiceData.postFogLevel === 0 || practiceData.effectiveness === 0}
              >
                Save Practice Results
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Energy Pattern Mapper Component
function EnergyPatternMapper({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [energyLevels, setEnergyLevels] = useState({
    morning: 0,
    midday: 0,
    afternoon: 0,
    evening: 0
  });
  const [patterns, setPatterns] = useState('');

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
          <Sparkles className="w-6 h-6 text-yellow-600" />
          Personal Energy Pattern Discovery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Track your energy levels throughout the day:</p>
          
          {Object.entries(energyLevels).map(([time, level]) => (
            <div key={time} className="space-y-2">
              <label className="block text-sm font-medium capitalize">{time} Energy</label>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(energyLevel => (
                  <Button
                    key={energyLevel}
                    variant={level === energyLevel ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnergyLevels(prev => ({...prev, [time]: energyLevel}))}
                    className="w-10 h-10 p-0"
                  >
                    {energyLevel}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2">Observed Patterns</label>
            <Textarea
              value={patterns}
              onChange={(e) => setPatterns(e.target.value)}
              placeholder="What patterns do you notice? When do you feel most/least energized?"
            />
          </div>

          <Button 
            onClick={() => onComplete('energy-mapping', {energyLevels, patterns})}
            className="w-full"
          >
            Save Energy Pattern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Thought Pattern Tracker Component
function ThoughtPatternTracker({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [thoughts, setThoughts] = useState<{trigger: string, thought: string, reframe: string}[]>([]);
  const [currentThought, setCurrentThought] = useState({trigger: '', thought: '', reframe: ''});

  const addThought = () => {
    if (currentThought.trigger && currentThought.thought) {
      setThoughts([...thoughts, currentThought]);
      setCurrentThought({trigger: '', thought: '', reframe: ''});
    }
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
          <Brain className="w-6 h-6 text-blue-600" />
          Hormonal Thought Awareness Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trigger/Situation</label>
              <Textarea
                value={currentThought.trigger}
                onChange={(e) => setCurrentThought(prev => ({...prev, trigger: e.target.value}))}
                placeholder="What happened that triggered this thought?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Negative Thought</label>
              <Textarea
                value={currentThought.thought}
                onChange={(e) => setCurrentThought(prev => ({...prev, thought: e.target.value}))}
                placeholder="What negative thought came up?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Helpful Reframe</label>
              <Textarea
                value={currentThought.reframe}
                onChange={(e) => setCurrentThought(prev => ({...prev, reframe: e.target.value}))}
                placeholder="How can you reframe this more positively?"
              />
            </div>

            <Button onClick={addThought} disabled={!currentThought.trigger || !currentThought.thought}>
              Add Thought Pattern
            </Button>
          </div>

          {thoughts.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Tracked Patterns ({thoughts.length})</h4>
              <div className="space-y-3">
                {thoughts.map((thought, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="text-sm">
                      <strong>Trigger:</strong> {thought.trigger}
                    </div>
                    <div className="text-sm text-red-600">
                      <strong>Thought:</strong> {thought.thought}
                    </div>
                    {thought.reframe && (
                      <div className="text-sm text-green-600">
                        <strong>Reframe:</strong> {thought.reframe}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={() => onComplete('thought-awareness', {thoughts})}
            className="w-full"
            disabled={thoughts.length === 0}
          >
            Complete Thought Tracking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Nutrition Planning Tool Component
function NutritionPlanningTool({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = useState('');

  const hormoneFoods = [
    'Wild salmon', 'Avocados', 'Leafy greens', 'Berries', 'Nuts and seeds',
    'Sweet potatoes', 'Cruciferous vegetables', 'Lean proteins', 'Whole grains',
    'Greek yogurt', 'Green tea', 'Dark chocolate'
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
          Hormone-Supporting Meal Planning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Select hormone-supporting foods to include in your weekly plan:</p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {hormoneFoods.map(food => (
              <div key={food} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedFoods.includes(food)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFoods([...selectedFoods, food]);
                    } else {
                      setSelectedFoods(selectedFoods.filter(f => f !== food));
                    }
                  }}
                  className="rounded"
                />
                <span>{food}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Weekly Meal Ideas</label>
            <Textarea
              value={mealPlan}
              onChange={(e) => setMealPlan(e.target.value)}
              placeholder="Plan some specific meals using your selected foods..."
              rows={5}
            />
          </div>

          <Button 
            onClick={() => onComplete('nutrition-planning', {selectedFoods, mealPlan})}
            className="w-full"
            disabled={selectedFoods.length === 0}
          >
            Save Nutrition Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Evening Routine Creator Component
function EveningRoutineCreator({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [routineSteps, setRoutineSteps] = useState<string[]>([]);
  const [customSteps, setCustomSteps] = useState('');

  const routineOptions = [
    'Dim lights 1 hour before bed',
    'No screens 30 minutes before sleep',
    'Gentle stretching or yoga',
    'Gratitude journaling',
    'Herbal tea (chamomile or passionflower)',
    'Reading or meditation',
    'Essential oils (lavender)',
    'Progressive muscle relaxation'
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
          <Clock className="w-6 h-6 text-indigo-600" />
          Evening Wind-Down Routine Creation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Design your progesterone-supporting evening ritual:</p>
          
          <div className="grid gap-3">
            {routineOptions.map(option => (
              <div key={option} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={routineSteps.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRoutineSteps([...routineSteps, option]);
                    } else {
                      setRoutineSteps(routineSteps.filter(s => s !== option));
                    }
                  }}
                  className="rounded"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Custom Steps</label>
            <Textarea
              value={customSteps}
              onChange={(e) => setCustomSteps(e.target.value)}
              placeholder="Any other evening practices that help you wind down?"
            />
          </div>

          <Button 
            onClick={() => onComplete('evening-wind-down', {routineSteps, customSteps})}
            className="w-full"
            disabled={routineSteps.length === 0}
          >
            Create Evening Routine
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// CBT Reframing Techniques Component
function CBTReframingTechniques({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [thoughtData, setThoughtData] = useState({
    situation: '',
    automaticThought: '',
    emotions: [] as string[],
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    newEmotions: [] as string[],
    actionPlan: ''
  });

  const emotionOptions = [
    'Anxious', 'Sad', 'Angry', 'Frustrated', 'Overwhelmed', 'Guilty', 
    'Ashamed', 'Disappointed', 'Hopeless', 'Confused', 'Calm', 'Hopeful', 
    'Confident', 'Peaceful', 'Motivated', 'Grateful', 'Excited', 'Content'
  ];

  const cbtSteps = [
    {
      title: 'Identify the Situation',
      description: 'What specific situation triggered your negative thoughts?',
      field: 'situation'
    },
    {
      title: 'Capture Automatic Thoughts',
      description: 'What thoughts immediately came to mind? Write them exactly as they occurred.',
      field: 'automaticThought'
    },
    {
      title: 'Identify Emotions',
      description: 'What emotions did these thoughts create? Select all that apply.',
      field: 'emotions'
    },
    {
      title: 'Evidence For',
      description: 'What evidence supports this thought? Be specific and factual.',
      field: 'evidenceFor'
    },
    {
      title: 'Evidence Against',
      description: 'What evidence contradicts this thought? Look for alternative perspectives.',
      field: 'evidenceAgainst'
    },
    {
      title: 'Create Balanced Thought',
      description: 'Based on the evidence, what\'s a more balanced, realistic thought?',
      field: 'balancedThought'
    },
    {
      title: 'New Emotions',
      description: 'How do you feel with this new balanced thought?',
      field: 'newEmotions'
    },
    {
      title: 'Action Plan',
      description: 'What specific actions will you take based on this new perspective?',
      field: 'actionPlan'
    }
  ];

  const handleEmotionToggle = (emotion: string, field: 'emotions' | 'newEmotions') => {
    setThoughtData(prev => ({
      ...prev,
      [field]: prev[field].includes(emotion) 
        ? prev[field].filter(e => e !== emotion)
        : [...prev[field], emotion]
    }));
  };

  const canProceed = (step: number) => {
    const currentField = cbtSteps[step].field;
    if (currentField === 'emotions' || currentField === 'newEmotions') {
      return thoughtData[currentField].length > 0;
    }
    return thoughtData[currentField as keyof typeof thoughtData] !== '';
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
          <Brain className="w-6 h-6 text-blue-600" />
          CBT Reframing Techniques
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / cbtSteps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {cbtSteps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{cbtSteps[currentStep].title}</h3>
            <p className="text-gray-600">{cbtSteps[currentStep].description}</p>
          </div>

          {(cbtSteps[currentStep].field === 'emotions' || cbtSteps[currentStep].field === 'newEmotions') ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {emotionOptions.map(emotion => (
                  <Button
                    key={emotion}
                    variant={thoughtData[cbtSteps[currentStep].field as 'emotions' | 'newEmotions'].includes(emotion) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEmotionToggle(emotion, cbtSteps[currentStep].field as 'emotions' | 'newEmotions')}
                    className="text-sm"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Selected: {thoughtData[cbtSteps[currentStep].field as 'emotions' | 'newEmotions'].join(', ')}
              </div>
            </div>
          ) : (
            <Textarea
              value={thoughtData[cbtSteps[currentStep].field as keyof typeof thoughtData] as string}
              onChange={(e) => setThoughtData(prev => ({
                ...prev,
                [cbtSteps[currentStep].field]: e.target.value
              }))}
              placeholder="Type your response here..."
              rows={4}
              className="w-full"
            />
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < cbtSteps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed(currentStep)}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w2-cbt', thoughtData)}
                disabled={!canProceed(currentStep)}
                className="ml-auto"
              >
                Complete CBT Exercise
              </Button>
            )}
          </div>

          {currentStep === cbtSteps.length - 1 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Your CBT Journey Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Situation:</strong> {thoughtData.situation}</div>
                <div><strong>Original Thought:</strong> {thoughtData.automaticThought}</div>
                <div><strong>Original Emotions:</strong> {thoughtData.emotions.join(', ')}</div>
                <div><strong>Balanced Thought:</strong> {thoughtData.balancedThought}</div>
                <div><strong>New Emotions:</strong> {thoughtData.newEmotions.join(', ')}</div>
                <div><strong>Action Plan:</strong> {thoughtData.actionPlan}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mirror Work & Affirmations Component
function MirrorWorkAffirmations({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAffirmations, setSelectedAffirmations] = useState<string[]>([]);
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');

  const affirmationCategories = {
    'Self-Worth': [
      'I am worthy of love and respect exactly as I am',
      'I honor my journey and celebrate my growth',
      'I am enough, right here, right now',
      'I trust in my inner wisdom and strength'
    ],
    'Midlife Transition': [
      'I embrace this powerful phase of my life',
      'I am becoming who I was meant to be',
      'My experience and wisdom are valuable gifts',
      'I create my own definition of success and happiness'
    ],
    'Body & Health': [
      'I appreciate my body for all it has done for me',
      'I nourish myself with kindness and compassion',
      'My body is wise and knows how to heal',
      'I treat myself with the same love I give others'
    ],
    'Confidence': [
      'I trust my decisions and honor my choices',
      'I speak my truth with courage and grace',
      'I am capable of handling whatever comes my way',
      'I shine my light brightly and inspire others'
    ]
  };

  const steps = [
    {
      title: 'Choose Your Affirmations',
      description: 'Select affirmations that resonate with you from each category'
    },
    {
      title: 'Mirror Practice',
      description: 'Stand in front of a mirror and practice saying your chosen affirmations'
    },
    {
      title: 'Reflection',
      description: 'Reflect on your experience and any insights that came up'
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
          <Heart className="w-6 h-6 text-pink-600" />
          Mirror Work & Affirmations
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {currentStep === 0 && (
            <div className="space-y-6">
              {Object.entries(affirmationCategories).map(([category, affirmations]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-semibold text-lg text-pink-700">{category}</h4>
                  <div className="space-y-2">
                    {affirmations.map(affirmation => (
                      <div key={affirmation} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-pink-50">
                        <input
                          type="checkbox"
                          checked={selectedAffirmations.includes(affirmation)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAffirmations([...selectedAffirmations, affirmation]);
                            } else {
                              setSelectedAffirmations(selectedAffirmations.filter(a => a !== affirmation));
                            }
                          }}
                          className="rounded mt-1"
                        />
                        <span className="text-sm">{affirmation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-pink-700">Create Your Own</h4>
                <Textarea
                  value={customAffirmation}
                  onChange={(e) => setCustomAffirmation(e.target.value)}
                  placeholder="Write a personal affirmation that speaks to your heart..."
                  rows={3}
                />
                {customAffirmation && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedAffirmations([...selectedAffirmations, customAffirmation]);
                      setCustomAffirmation('');
                    }}
                  >
                    Add Custom Affirmation
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-pink-50 p-6 rounded-lg">
                <h4 className="font-semibold text-pink-900 mb-3">Mirror Practice Instructions</h4>
                <ol className="space-y-2 text-sm text-pink-800">
                  <li>1. Stand in front of a mirror where you can see your face clearly</li>
                  <li>2. Take three deep breaths and connect with yourself</li>
                  <li>3. Look into your own eyes with kindness and compassion</li>
                  <li>4. Say each affirmation slowly and with intention</li>
                  <li>5. Notice any resistance or emotions that come up</li>
                  <li>6. Be patient and gentle with yourself</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Your Selected Affirmations:</h4>
                <div className="space-y-2">
                  {selectedAffirmations.map((affirmation, index) => (
                    <div key={index} className="p-3 bg-white border rounded-lg">
                      <p className="text-center font-medium text-pink-700">"{affirmation}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Take your time with this practice. When you're ready, move to the next step.</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Reflection Notes</label>
                <Textarea
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="How did that feel? What came up for you during the mirror work? Any insights or resistance you noticed?"
                  rows={6}
                />
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-900 mb-2">Daily Practice Tips</h4>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Practice mirror work for 2-3 minutes each morning</li>
                  <li>• Start with one affirmation and build up over time</li>
                  <li>• Notice which affirmations feel most challenging</li>
                  <li>• Be patient - this practice gets easier with time</li>
                  <li>• Celebrate small shifts in how you feel</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 0 && selectedAffirmations.length === 0}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w2-mirror', {
                  selectedAffirmations,
                  customAffirmation,
                  reflectionNotes
                })}
                disabled={!reflectionNotes.trim()}
                className="ml-auto"
              >
                Complete Mirror Work
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Thought Audit Tracker Component
function ThoughtAuditTracker({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [thoughts, setThoughts] = useState<{
    time: string;
    trigger: string;
    thought: string;
    distortion: string;
    replacement: string;
    intensity: number;
    newIntensity: number;
  }[]>([]);

  const [currentThought, setCurrentThought] = useState({
    time: '',
    trigger: '',
    thought: '',
    distortion: '',
    replacement: '',
    intensity: 5,
    newIntensity: 5
  });

  const cognitiveDistortions = [
    'All-or-Nothing Thinking',
    'Overgeneralization',
    'Mental Filter',
    'Disqualifying the Positive',
    'Jumping to Conclusions',
    'Magnification/Minimization',
    'Emotional Reasoning',
    'Should Statements',
    'Labeling',
    'Personalization'
  ];

  const addThought = () => {
    if (currentThought.thought && currentThought.replacement) {
      setThoughts([...thoughts, { ...currentThought, time: new Date().toLocaleTimeString() }]);
      setCurrentThought({
        time: '',
        trigger: '',
        thought: '',
        distortion: '',
        replacement: '',
        intensity: 5,
        newIntensity: 5
      });
    }
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
          <FileText className="w-6 h-6 text-green-600" />
          Thought Audit Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">How to Use This Tool</h4>
            <p className="text-sm text-green-800">
              Throughout your day, when you notice a negative or self-critical thought, use this tracker to identify 
              the pattern and create a more balanced alternative. The goal is awareness and gentle reframing.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trigger/Situation</label>
                <input
                  type="text"
                  value={currentThought.trigger}
                  onChange={(e) => setCurrentThought(prev => ({...prev, trigger: e.target.value}))}
                  placeholder="What happened?"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cognitive Distortion</label>
                <select
                  value={currentThought.distortion}
                  onChange={(e) => setCurrentThought(prev => ({...prev, distortion: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a pattern...</option>
                  {cognitiveDistortions.map(distortion => (
                    <option key={distortion} value={distortion}>{distortion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Negative Thought</label>
              <Textarea
                value={currentThought.thought}
                onChange={(e) => setCurrentThought(prev => ({...prev, thought: e.target.value}))}
                placeholder="What self-critical thought came up?"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Intensity (1-10)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentThought.intensity}
                  onChange={(e) => setCurrentThought(prev => ({...prev, intensity: parseInt(e.target.value)}))}
                  className="flex-1"
                />
                <span className="text-sm">10</span>
                <span className="w-8 text-center font-medium">{currentThought.intensity}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Balanced Replacement Thought</label>
              <Textarea
                value={currentThought.replacement}
                onChange={(e) => setCurrentThought(prev => ({...prev, replacement: e.target.value}))}
                placeholder="What's a more balanced, compassionate way to think about this?"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Intensity (1-10)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentThought.newIntensity}
                  onChange={(e) => setCurrentThought(prev => ({...prev, newIntensity: parseInt(e.target.value)}))}
                  className="flex-1"
                />
                <span className="text-sm">10</span>
                <span className="w-8 text-center font-medium">{currentThought.newIntensity}</span>
              </div>
            </div>

            <Button 
              onClick={addThought}
              disabled={!currentThought.thought || !currentThought.replacement}
              className="w-full"
            >
              Add Thought Entry
            </Button>
          </div>

          {thoughts.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Tracked Thoughts ({thoughts.length})</h4>
              <div className="space-y-3">
                {thoughts.map((thought, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">{thought.time}</span>
                      <span className="text-sm bg-blue-100 px-2 py-1 rounded">{thought.distortion}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Trigger:</strong> {thought.trigger}</div>
                      <div><strong>Negative:</strong> {thought.thought} (Intensity: {thought.intensity})</div>
                      <div><strong>Balanced:</strong> {thought.replacement} (Intensity: {thought.newIntensity})</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">Pattern Insights</h5>
                <div className="text-sm text-green-800">
                  <p>Most common distortion: {
                    thoughts.reduce((acc, curr) => {
                      acc[curr.distortion] = (acc[curr.distortion] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)[
                      Object.keys(thoughts.reduce((acc, curr) => {
                        acc[curr.distortion] = (acc[curr.distortion] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)).reduce((a, b) => 
                        thoughts.reduce((acc, curr) => {
                          acc[curr.distortion] = (acc[curr.distortion] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)[a] > thoughts.reduce((acc, curr) => {
                          acc[curr.distortion] = (acc[curr.distortion] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)[b] ? a : b
                      )
                    ] || 'None yet'
                  }</p>
                  <p>Average intensity reduction: {
                    thoughts.length > 0 
                      ? ((thoughts.reduce((sum, t) => sum + t.intensity, 0) / thoughts.length) - 
                         (thoughts.reduce((sum, t) => sum + t.newIntensity, 0) / thoughts.length)).toFixed(1)
                      : '0'
                  } points</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={() => onComplete('w2-audit', { thoughts })}
            className="w-full"
            disabled={thoughts.length === 0}
          >
            Complete Thought Audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// NLP Reframing Practice Component
function NLPReframingPractice({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentTechnique, setCurrentTechnique] = useState(0);
  const [practiceData, setPracticeData] = useState({
    anchoringResults: { trigger: '', positiveState: '', effectiveness: 0 },
    reframingResults: { challenge: '', perspectives: [] as string[], chosenFrame: '', confidence: 0 },
    visualizationResults: { goal: '', obstacles: [] as string[], solutions: [] as string[], clarity: 0 },
    languageResults: { limitingBeliefs: [] as string[], empoweringBeliefs: [] as string[], integration: '' }
  });

  const techniques = [
    {
      title: 'Anchoring Positive States',
      description: 'Create a physical anchor for accessing confident, calm states',
      component: 'anchoring'
    },
    {
      title: 'Perspective Reframing',
      description: 'View challenges from multiple empowering perspectives',
      component: 'reframing'
    },
    {
      title: 'Future Visualization',
      description: 'Create clear mental movies of your desired outcomes',
      component: 'visualization'
    },
    {
      title: 'Language Patterns',
      description: 'Transform limiting language into empowering statements',
      component: 'language'
    }
  ];

  const renderAnchoringPractice = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Anchoring Instructions</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Think of a time when you felt completely confident and capable</li>
          <li>2. Relive that memory - see what you saw, hear what you heard</li>
          <li>3. As the feeling peaks, press your thumb and forefinger together</li>
          <li>4. Hold for 10 seconds, then release</li>
          <li>5. Repeat 3-5 times to strengthen the anchor</li>
        </ol>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Describe your confident memory</label>
          <Textarea
            value={practiceData.anchoringResults.trigger}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              anchoringResults: { ...prev.anchoringResults, trigger: e.target.value }
            }))}
            placeholder="What memory did you use for anchoring?"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How did it feel to access that state?</label>
          <Textarea
            value={practiceData.anchoringResults.positiveState}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              anchoringResults: { ...prev.anchoringResults, positiveState: e.target.value }
            }))}
            placeholder="Describe the feelings and sensations you experienced..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Effectiveness (1-10)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={practiceData.anchoringResults.effectiveness}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                anchoringResults: { ...prev.anchoringResults, effectiveness: parseInt(e.target.value) }
              }))}
              className="flex-1"
            />
            <span className="text-sm">10</span>
            <span className="w-8 text-center font-medium">{practiceData.anchoringResults.effectiveness}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReframingPractice = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Perspective Reframing</h4>
        <p className="text-sm text-green-800">
          Think of a current challenge and view it from at least 3 different perspectives:
          the optimist, the pragmatist, and the wise mentor.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Challenge</label>
          <Textarea
            value={practiceData.reframingResults.challenge}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              reframingResults: { ...prev.reframingResults, challenge: e.target.value }
            }))}
            placeholder="What challenge would you like to reframe?"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Different Perspectives</label>
          <div className="space-y-3">
            {['Optimist Perspective', 'Pragmatist Perspective', 'Wise Mentor Perspective'].map((perspective, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium mb-1">{perspective}</label>
                <Textarea
                  value={practiceData.reframingResults.perspectives[idx] || ''}
                  onChange={(e) => {
                    const newPerspectives = [...practiceData.reframingResults.perspectives];
                    newPerspectives[idx] = e.target.value;
                    setPracticeData(prev => ({
                      ...prev,
                      reframingResults: { ...prev.reframingResults, perspectives: newPerspectives }
                    }));
                  }}
                  placeholder={`How would the ${perspective.toLowerCase()} view this challenge?`}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Chosen Empowering Frame</label>
          <Textarea
            value={practiceData.reframingResults.chosenFrame}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              reframingResults: { ...prev.reframingResults, chosenFrame: e.target.value }
            }))}
            placeholder="Which perspective feels most empowering and why?"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confidence Level (1-10)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={practiceData.reframingResults.confidence}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                reframingResults: { ...prev.reframingResults, confidence: parseInt(e.target.value) }
              }))}
              className="flex-1"
            />
            <span className="text-sm">10</span>
            <span className="w-8 text-center font-medium">{practiceData.reframingResults.confidence}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisualizationPractice = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">Future Visualization</h4>
        <p className="text-sm text-purple-800">
          Create a detailed mental movie of achieving a goal, including potential obstacles and how you'll overcome them.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Goal/Desired Outcome</label>
          <Textarea
            value={practiceData.visualizationResults.goal}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              visualizationResults: { ...prev.visualizationResults, goal: e.target.value }
            }))}
            placeholder="What do you want to achieve? Be specific and detailed."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Potential Obstacles</label>
          <div className="space-y-2">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                type="text"
                value={practiceData.visualizationResults.obstacles[idx] || ''}
                onChange={(e) => {
                  const newObstacles = [...practiceData.visualizationResults.obstacles];
                  newObstacles[idx] = e.target.value;
                  setPracticeData(prev => ({
                    ...prev,
                    visualizationResults: { ...prev.visualizationResults, obstacles: newObstacles }
                  }));
                }}
                placeholder={`Potential obstacle ${idx + 1}`}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Solutions & Strategies</label>
          <div className="space-y-2">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                type="text"
                value={practiceData.visualizationResults.solutions[idx] || ''}
                onChange={(e) => {
                  const newSolutions = [...practiceData.visualizationResults.solutions];
                  newSolutions[idx] = e.target.value;
                  setPracticeData(prev => ({
                    ...prev,
                    visualizationResults: { ...prev.visualizationResults, solutions: newSolutions }
                  }));
                }}
                placeholder={`Solution for obstacle ${idx + 1}`}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visualization Clarity (1-10)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={practiceData.visualizationResults.clarity}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                visualizationResults: { ...prev.visualizationResults, clarity: parseInt(e.target.value) }
              }))}
              className="flex-1"
            />
            <span className="text-sm">10</span>
            <span className="w-8 text-center font-medium">{practiceData.visualizationResults.clarity}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguagePractice = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-2">Language Pattern Transformation</h4>
        <p className="text-sm text-orange-800">
          Transform limiting language patterns into empowering ones. Notice how changing your language changes your mindset.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Limiting Beliefs/Statements</label>
          <div className="space-y-2">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                type="text"
                value={practiceData.languageResults.limitingBeliefs[idx] || ''}
                onChange={(e) => {
                  const newBeliefs = [...practiceData.languageResults.limitingBeliefs];
                  newBeliefs[idx] = e.target.value;
                  setPracticeData(prev => ({
                    ...prev,
                    languageResults: { ...prev.languageResults, limitingBeliefs: newBeliefs }
                  }));
                }}
                placeholder={`Limiting belief ${idx + 1} (e.g., "I'm too old to...")`}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Empowering Alternatives</label>
          <div className="space-y-2">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                type="text"
                value={practiceData.languageResults.empoweringBeliefs[idx] || ''}
                onChange={(e) => {
                  const newBeliefs = [...practiceData.languageResults.empoweringBeliefs];
                  newBeliefs[idx] = e.target.value;
                  setPracticeData(prev => ({
                    ...prev,
                    languageResults: { ...prev.languageResults, empoweringBeliefs: newBeliefs }
                  }));
                }}
                placeholder={`Empowering version of belief ${idx + 1}`}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Integration Plan</label>
          <Textarea
            value={practiceData.languageResults.integration}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              languageResults: { ...prev.languageResults, integration: e.target.value }
            }))}
            placeholder="How will you integrate these new empowering language patterns into your daily life?"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const getCurrentComponent = () => {
    switch (techniques[currentTechnique].component) {
      case 'anchoring': return renderAnchoringPractice();
      case 'reframing': return renderReframingPractice();
      case 'visualization': return renderVisualizationPractice();
      case 'language': return renderLanguagePractice();
      default: return null;
    }
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
          <Sparkles className="w-6 h-6 text-purple-600" />
          NLP Reframing Practice
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentTechnique + 1) / techniques.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {currentTechnique + 1} of {techniques.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{techniques[currentTechnique].title}</h3>
            <p className="text-gray-600">{techniques[currentTechnique].description}</p>
          </div>

          {getCurrentComponent()}

          <div className="flex justify-between pt-4">
            {currentTechnique > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentTechnique(prev => prev - 1)}
              >
                Previous Technique
              </Button>
            )}
            
            {currentTechnique < techniques.length - 1 ? (
              <Button 
                onClick={() => setCurrentTechnique(prev => prev + 1)}
                className="ml-auto"
              >
                Next Technique
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w2-nlp', practiceData)}
                className="ml-auto"
              >
                Complete NLP Practice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hormone Harmony Meditation Component
function HormoneHarmonyMeditation({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('check-in');
  const [meditationData, setMeditationData] = useState({
    preAssessment: {
      calmness: 5,
      bodyAwareness: 5,
      emotionalBalance: 5
    },
    postAssessment: {
      calmness: 5,
      reflection: '',
      intention: ''
    },
    completedSections: [] as string[]
  });

  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const sections = [
    { id: 'check-in', title: 'Pre-Meditation Check-In', icon: '📋' },
    { id: 'practice', title: 'Guided Meditation Practice', icon: '🧘‍♀️' },
    { id: 'reflection', title: 'Post-Meditation Reflection', icon: '📝' }
  ];

  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const meditationPhases = [
    {
      title: 'Preparation',
      description: 'Setting up your space and intention',
      duration: 2,
      completed: true,
      instructions: [
        'Find a comfortable seated position with your spine naturally straight',
        'Close your eyes or soften your gaze downward',
        'Place one hand on your heart and one on your belly',
        'Take a moment to set an intention for this practice',
        'Allow your breath to settle into its natural rhythm'
      ],
      guidance: 'This phase helps you transition from daily activities into a meditative state. Take your time to get comfortable and present.'
    },
    {
      title: 'Grounding',
      description: 'Connecting with your body and breath',
      duration: 3,
      completed: true,
      instructions: [
        'Begin to notice your natural breath without changing it',
        'Feel the weight of your body supported by the chair or cushion',
        'Scan from the top of your head down to your toes',
        'Allow any tension to soften with each exhale',
        'Notice where you feel most connected to the ground'
      ],
      guidance: 'Grounding helps regulate your nervous system and prepares your body for deeper meditation work.'
    },
    {
      title: 'Hormone Harmony',
      description: 'Visualizing hormonal balance and flow',
      duration: 7,
      completed: true,
      instructions: [
        'Imagine a warm, golden light filling your entire body',
        'See this light flowing through your endocrine system',
        'Visualize your hormones in perfect harmony and balance',
        'Send appreciation to your ovaries, adrenals, and thyroid',
        'Trust in your body\'s innate wisdom to heal and regulate',
        'Feel the gentle rhythm of hormonal flow throughout your body'
      ],
      guidance: 'This visualization supports hormonal balance by reducing stress and promoting healing through the mind-body connection.'
    },
    {
      title: 'Integration',
      description: 'Anchoring the practice in your body',
      duration: 3,
      completed: false,
      instructions: [
        'Place both hands on your heart and feel the steady rhythm',
        'Set an intention to carry this harmony throughout your day',
        'Begin to wiggle your fingers and toes',
        'Take three deep, conscious breaths',
        'When ready, slowly open your eyes',
        'Notice how you feel in this moment'
      ],
      guidance: 'Integration helps you bring the benefits of meditation into your daily life and maintain the sense of balance you\'ve created.'
    }
  ];

  const renderCheckIn = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">How Meditation Supports Hormonal Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div><strong>Stress Reduction:</strong> Lowers cortisol levels that can disrupt other hormones</div>
          <div><strong>Better Sleep:</strong> Supports melatonin production for restorative rest</div>
          <div><strong>Nervous System Regulation:</strong> Activates parasympathetic response for healing</div>
          <div><strong>Emotional Balance:</strong> Helps regulate mood-affecting neurotransmitters</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Pre-Meditation Check-In</h4>
        <p className="text-gray-600 mb-6">Rate how you're feeling right now, then we'll check again after the meditation:</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Calmness Level</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-16">Agitated</span>
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.preAssessment.calmness}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  preAssessment: { ...prev.preAssessment, calmness: parseInt(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16">Peaceful</span>
              <span className="w-8 text-center font-medium bg-purple-100 rounded px-2 py-1">{meditationData.preAssessment.calmness}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Body Awareness</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-16">Disconnected</span>
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.preAssessment.bodyAwareness}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  preAssessment: { ...prev.preAssessment, bodyAwareness: parseInt(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16">Very Aware</span>
              <span className="w-8 text-center font-medium bg-purple-100 rounded px-2 py-1">{meditationData.preAssessment.bodyAwareness}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emotional Balance</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-16">Unstable</span>
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.preAssessment.emotionalBalance}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  preAssessment: { ...prev.preAssessment, emotionalBalance: parseInt(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16">Balanced</span>
              <span className="w-8 text-center font-medium bg-purple-100 rounded px-2 py-1">{meditationData.preAssessment.emotionalBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-purple-600 mb-2">0:00</div>
        <div className="text-lg text-gray-600 mb-4">Meditation Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-purple-600 h-3 rounded-full" style={{ width: '100%' }} />
        </div>
        <div className="text-sm text-gray-600">100% Complete</div>
      </div>

      <div className="space-y-4">
        {meditationPhases.map((phase, index) => (
          <div 
            key={phase.title}
            className={`border rounded-lg transition-all duration-200 cursor-pointer ${
              phase.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
            } ${expandedPhase === phase.title ? 'ring-2 ring-purple-300' : 'hover:border-purple-300'}`}
            onClick={() => setExpandedPhase(expandedPhase === phase.title ? null : phase.title)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {phase.completed && <span className="text-green-600">✓</span>}
                  {phase.title}
                  <span className="text-purple-600 ml-2">
                    {expandedPhase === phase.title ? '▼' : '▶'}
                  </span>
                </h4>
                <span className="text-sm text-gray-500">{phase.duration} min</span>
              </div>
              <p className="text-sm text-gray-600">{phase.description}</p>
              
              {expandedPhase === phase.title && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Phase Guidance</h5>
                    <p className="text-sm text-purple-800">{phase.guidance}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Step-by-Step Instructions</h5>
                    <ol className="space-y-2">
                      {phase.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPhase(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mark as completed if not already
                        if (!phase.completed) {
                          // Update completion status
                          console.log(`Completed ${phase.title}`);
                        }
                      }}
                    >
                      {phase.completed ? 'Practice Again' : 'Start Practice'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Integration & Closing</h4>
        <p className="text-sm text-purple-800 mb-4">
          Anchor this feeling of balance in your body and daily life.
        </p>
        <div className="space-y-2 text-sm text-purple-800">
          <p><strong>Integration Practice</strong></p>
          <p>• Place both hands on your heart and feel the steady rhythm beneath your palms.</p>
          <p>• Set an intention to carry this sense of harmony with you throughout your day.</p>
          <p>• When you're ready, slowly open your eyes and take three deep breaths.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">What intention would you like to set for supporting your hormonal health today?</label>
        <Textarea
          value={meditationData.postAssessment.intention}
          onChange={(e) => setMeditationData(prev => ({
            ...prev,
            postAssessment: { ...prev.postAssessment, intention: e.target.value }
          }))}
          placeholder="e.g., I will listen to my body's needs with compassion, I will trust my body's wisdom..."
          rows={3}
          className="mb-4"
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveSection('check-in')}
          >
            Previous
          </Button>
          <Button 
            size="sm"
            onClick={() => setActiveSection('reflection')}
          >
            Continue to Reflection
          </Button>
        </div>
      </div>
    </div>
  );

  const renderReflection = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">Post-Meditation Reflection</h4>
        <p className="text-gray-600 mb-4">How do you feel now compared to before the meditation?</p>
        <Textarea
          value={meditationData.postAssessment.reflection}
          onChange={(e) => setMeditationData(prev => ({
            ...prev,
            postAssessment: { ...prev.postAssessment, reflection: e.target.value }
          }))}
          placeholder="Describe any changes in your energy, mood, body sensations, or mental clarity..."
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Rate your current calmness level (to compare with your pre-meditation rating):</label>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-500 w-16">Agitated</span>
          <input
            type="range"
            min="1"
            max="10"
            value={meditationData.postAssessment.calmness}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              postAssessment: { ...prev.postAssessment, calmness: parseInt(e.target.value) }
            }))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-16">Peaceful</span>
          <span className="w-8 text-center font-medium bg-purple-100 rounded px-2 py-1">{meditationData.postAssessment.calmness}</span>
        </div>
        <div className="text-sm text-gray-600">
          Change from before: {meditationData.postAssessment.calmness - meditationData.preAssessment.calmness > 0 ? '+' : ''}
          {meditationData.postAssessment.calmness - meditationData.preAssessment.calmness} points
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Daily Practice Tips</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Practice this meditation at the same time each day to establish a rhythm</li>
          <li>• Morning practice can set a calm tone for your day</li>
          <li>• Evening practice can help prepare your body for restorative sleep</li>
          <li>• Even 5-10 minutes of practice can be beneficial if 15 minutes feels too long</li>
          <li>• Notice how your symptoms change with regular meditation practice</li>
        </ul>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-4">Ready to complete this session?</p>
        <p className="text-xs text-gray-500 mb-4">Your progress will be saved and you can always return to review your responses.</p>
        <Button 
          onClick={() => {
            console.log('Complete button clicked!', meditationData);
            onComplete('hormone-meditation', meditationData);
          }}
          className="w-full"
          size="lg"
        >
          Complete Session
        </Button>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-purple-600" />
          Hormone Harmony Meditation
        </CardTitle>
        <p className="text-gray-600 mt-2">A 15-minute guided meditation specifically designed to support hormonal balance during midlife transitions.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Section Navigation */}
          <div className="flex border-b">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>

          {/* Section Content */}
          {activeSection === 'check-in' && renderCheckIn()}
          {activeSection === 'practice' && renderPractice()}
          {activeSection === 'reflection' && renderReflection()}
        </div>
      </CardContent>
    </Card>
  );
}

// Week 3 Components - Emotion Regulation & Boundaries

// Overwhelm Pattern Analysis Component
function OverwhelmPatternAnalysis({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisData, setAnalysisData] = useState({
    triggers: {
      work: false,
      family: false,
      health: false,
      financial: false,
      social: false,
      time: false,
      technology: false,
      other: ''
    },
    physicalSymptoms: {
      tension: false,
      headaches: false,
      fatigue: false,
      heartRacing: false,
      breathShallow: false,
      digestive: false,
      sleep: false,
      other: ''
    },
    emotionalSymptoms: {
      anxiety: false,
      irritability: false,
      sadness: false,
      anger: false,
      numbness: false,
      overwhelm: false,
      guilt: false,
      other: ''
    },
    currentStrategies: '',
    effectiveStrategies: [] as string[],
    personalizedPlan: {
      earlyWarnings: '',
      preventive: '',
      inTheMoment: '',
      recovery: ''
    }
  });

  const steps = [
    'Overwhelm Triggers Assessment',
    'Physical Response Mapping',
    'Emotional Pattern Recognition',
    'Strategy Evaluation',
    'Personalized Action Plan'
  ];

  const copingStrategies = [
    { id: 'breathing', name: 'Deep breathing exercises', category: 'Physical' },
    { id: 'movement', name: 'Physical movement/exercise', category: 'Physical' },
    { id: 'nature', name: 'Time in nature', category: 'Environmental' },
    { id: 'boundaries', name: 'Setting clear boundaries', category: 'Behavioral' },
    { id: 'delegation', name: 'Delegating tasks', category: 'Behavioral' },
    { id: 'meditation', name: 'Meditation/mindfulness', category: 'Mental' },
    { id: 'journaling', name: 'Journaling/writing', category: 'Mental' },
    { id: 'support', name: 'Talking to support system', category: 'Social' },
    { id: 'rest', name: 'Quality sleep/rest', category: 'Physical' },
    { id: 'nutrition', name: 'Proper nutrition', category: 'Physical' }
  ];

  const renderTriggersStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Understanding Your Overwhelm Triggers</h4>
        <p className="text-sm text-blue-800">
          Identifying your specific triggers is the first step toward effective overwhelm management. 
          Check all areas that commonly create stress or overwhelm in your life.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-4">Select your main overwhelm triggers:</h5>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries({
            work: 'Work/Career demands',
            family: 'Family responsibilities',
            health: 'Health concerns',
            financial: 'Financial pressures',
            social: 'Social obligations',
            time: 'Time management',
            technology: 'Technology/digital overwhelm'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={analysisData.triggers[key as keyof typeof analysisData.triggers] as boolean}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev,
                  triggers: { ...prev.triggers, [key]: e.target.checked }
                }))}
                className="rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Other triggers (please specify):</label>
          <Textarea
            value={analysisData.triggers.other}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              triggers: { ...prev.triggers, other: e.target.value }
            }))}
            placeholder="Describe any other specific triggers..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  const renderPhysicalStep = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-3">Your Physical Response to Overwhelm</h4>
        <p className="text-sm text-orange-800">
          Your body sends clear signals when overwhelm begins. Learning to recognize these early 
          warning signs helps you intervene before overwhelm becomes unmanageable.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-4">How does overwhelm show up in your body?</h5>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries({
            tension: 'Muscle tension (shoulders, neck, jaw)',
            headaches: 'Headaches or migraines',
            fatigue: 'Sudden fatigue or exhaustion',
            heartRacing: 'Heart racing or palpitations',
            breathShallow: 'Shallow or rapid breathing',
            digestive: 'Digestive issues or nausea',
            sleep: 'Sleep disruption or insomnia'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={analysisData.physicalSymptoms[key as keyof typeof analysisData.physicalSymptoms] as boolean}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev,
                  physicalSymptoms: { ...prev.physicalSymptoms, [key]: e.target.checked }
                }))}
                className="rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Other physical symptoms:</label>
          <Textarea
            value={analysisData.physicalSymptoms.other}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              physicalSymptoms: { ...prev.physicalSymptoms, other: e.target.value }
            }))}
            placeholder="Describe any other physical responses..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  const renderEmotionalStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Emotional Overwhelm Patterns</h4>
        <p className="text-sm text-purple-800">
          Emotions during overwhelm can feel intense and confusing. Identifying your emotional 
          patterns helps you respond with compassion rather than judgment.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-4">What emotions typically arise during overwhelm?</h5>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries({
            anxiety: 'Anxiety or worry',
            irritability: 'Irritability or impatience',
            sadness: 'Sadness or depression',
            anger: 'Anger or frustration',
            numbness: 'Emotional numbness',
            overwhelm: 'Feeling completely overwhelmed',
            guilt: 'Guilt or self-blame'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={analysisData.emotionalSymptoms[key as keyof typeof analysisData.emotionalSymptoms] as boolean}
                onChange={(e) => setAnalysisData(prev => ({
                  ...prev,
                  emotionalSymptoms: { ...prev.emotionalSymptoms, [key]: e.target.checked }
                }))}
                className="rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Other emotional responses:</label>
          <Textarea
            value={analysisData.emotionalSymptoms.other}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              emotionalSymptoms: { ...prev.emotionalSymptoms, other: e.target.value }
            }))}
            placeholder="Describe any other emotional responses..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  const renderStrategyStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Current Coping Strategy Assessment</h4>
        <p className="text-sm text-green-800">
          Let's evaluate what you're currently doing to manage overwhelm and identify what works best for you.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">What strategies do you currently use when feeling overwhelmed?</label>
        <Textarea
          value={analysisData.currentStrategies}
          onChange={(e) => setAnalysisData(prev => ({
            ...prev,
            currentStrategies: e.target.value
          }))}
          placeholder="Describe your current coping methods (both helpful and unhelpful)..."
          rows={4}
        />
      </div>

      <div>
        <h5 className="font-medium mb-4">Which strategies have been most effective for you?</h5>
        <div className="space-y-3">
          {copingStrategies.map((strategy) => (
            <label key={strategy.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={analysisData.effectiveStrategies.includes(strategy.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAnalysisData(prev => ({
                      ...prev,
                      effectiveStrategies: [...prev.effectiveStrategies, strategy.id]
                    }));
                  } else {
                    setAnalysisData(prev => ({
                      ...prev,
                      effectiveStrategies: prev.effectiveStrategies.filter(id => id !== strategy.id)
                    }));
                  }
                }}
                className="rounded"
              />
              <div>
                <span className="text-sm font-medium">{strategy.name}</span>
                <span className="text-xs text-gray-500 ml-2">({strategy.category})</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActionPlanStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Your Personalized Overwhelm Management Plan</h4>
        <p className="text-sm text-indigo-800">
          Based on your patterns and effective strategies, create a comprehensive plan for managing overwhelm at every stage.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Early Warning System</label>
          <p className="text-xs text-gray-600 mb-2">What are your first signs that overwhelm is building?</p>
          <Textarea
            value={analysisData.personalizedPlan.earlyWarnings}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              personalizedPlan: { ...prev.personalizedPlan, earlyWarnings: e.target.value }
            }))}
            placeholder="e.g., Shoulders getting tense, feeling rushed, starting to multitask frantically..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preventive Strategies</label>
          <p className="text-xs text-gray-600 mb-2">Daily practices to prevent overwhelm from building:</p>
          <Textarea
            value={analysisData.personalizedPlan.preventive}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              personalizedPlan: { ...prev.personalizedPlan, preventive: e.target.value }
            }))}
            placeholder="e.g., Morning meditation, time-blocking, regular breaks, boundary setting..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">In-the-Moment Tools</label>
          <p className="text-xs text-gray-600 mb-2">What you'll do when overwhelm hits:</p>
          <Textarea
            value={analysisData.personalizedPlan.inTheMoment}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              personalizedPlan: { ...prev.personalizedPlan, inTheMoment: e.target.value }
            }))}
            placeholder="e.g., STOP technique, 4-7-8 breathing, step outside, ask for help..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Recovery & Reset</label>
          <p className="text-xs text-gray-600 mb-2">How you'll restore after an overwhelming period:</p>
          <Textarea
            value={analysisData.personalizedPlan.recovery}
            onChange={(e) => setAnalysisData(prev => ({
              ...prev,
              personalizedPlan: { ...prev.personalizedPlan, recovery: e.target.value }
            }))}
            placeholder="e.g., Gentle movement, nourishing meal, early bedtime, self-compassion practice..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

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
          Overwhelm Pattern Analysis
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Complete comprehensive analysis of your overwhelm triggers and responses</p>
          </div>

          {currentStep === 0 && renderTriggersStep()}
          {currentStep === 1 && renderPhysicalStep()}
          {currentStep === 2 && renderEmotionalStep()}
          {currentStep === 3 && renderStrategyStep()}
          {currentStep === 4 && renderActionPlanStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w3-patterns', analysisData)}
                className="ml-auto"
              >
                Complete Analysis
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Pause-Label-Shift Technique Component
function PauseLabelShiftTechnique({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceData, setPracticeData] = useState({
    scenarios: {} as Record<string, { pause?: string; label?: string; shift?: string }>,
    personalPractice: {
      situation: '',
      pauseResponse: '',
      labelResponse: '',
      shiftResponse: '',
      reflection: ''
    },
    confidenceLevel: 5,
    commitments: [] as string[]
  });

  const steps = [
    'Learn the Technique',
    'Guided Practice Scenarios',
    'Personal Application',
    'Integration Planning'
  ];

  const practiceScenarios = [
    {
      id: 'work-deadline',
      title: 'Overwhelming Work Deadline',
      situation: 'You have three major projects due tomorrow and your boss just added another urgent task. You feel your chest tightening and panic rising.',
      pausePrompt: 'What would PAUSE look like in this moment?',
      labelPrompt: 'How would you LABEL what you\'re experiencing?',
      shiftPrompt: 'What SHIFT would be most helpful?'
    },
    {
      id: 'family-conflict',
      title: 'Family Disagreement',
      situation: 'Your teenager is arguing with you about curfew, raising their voice and saying "you don\'t understand anything!" You feel anger and hurt building.',
      pausePrompt: 'How would you create a PAUSE here?',
      labelPrompt: 'What emotions and thoughts would you LABEL?',
      shiftPrompt: 'What SHIFT could improve this interaction?'
    },
    {
      id: 'health-anxiety',
      title: 'Health Concern Spiral',
      situation: 'You\'ve been feeling more tired lately and start googling symptoms. Soon you\'re convinced something serious is wrong and your mind is racing with worst-case scenarios.',
      pausePrompt: 'Where would you PAUSE this spiral?',
      labelPrompt: 'What would you LABEL about this experience?',
      shiftPrompt: 'What SHIFT would serve you better?'
    }
  ];

  const renderLearnStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">The Neuroscience Behind Pause-Label-Shift</h4>
        <p className="text-sm text-blue-800 mb-4">
          This technique activates your prefrontal cortex (thinking brain) to regulate your amygdala (emotional brain), 
          creating space between trigger and response.
        </p>
        <div className="text-xs text-blue-700">
          Research shows that simply naming emotions can reduce amygdala activity by up to 50%, giving you back emotional control.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⏸️</span>
          </div>
          <h5 className="font-semibold text-red-900 mb-2">1. PAUSE</h5>
          <p className="text-sm text-red-800 mb-3">
            Stop the automatic reaction. Take a breath. Create space.
          </p>
          <div className="text-xs text-red-700">
            <strong>Techniques:</strong> Deep breath, count to 5, step back, close eyes briefly
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <h5 className="font-semibold text-yellow-900 mb-2">2. LABEL</h5>
          <p className="text-sm text-yellow-800 mb-3">
            Name what you're experiencing without judgment.
          </p>
          <div className="text-xs text-yellow-700">
            <strong>Examples:</strong> "I'm feeling overwhelmed," "I notice anxiety," "There's anger here"
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h5 className="font-semibold text-green-900 mb-2">3. SHIFT</h5>
          <p className="text-sm text-green-800 mb-3">
            Choose a more helpful response aligned with your values.
          </p>
          <div className="text-xs text-green-700">
            <strong>Options:</strong> Perspective shift, action change, self-compassion, problem-solving
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h5 className="font-semibold mb-3">Why This Works in Midlife</h5>
        <ul className="text-sm space-y-2">
          <li>• <strong>Hormonal fluctuations</strong> can make emotions feel more intense - this technique provides stability</li>
          <li>• <strong>Accumulated stress</strong> from multiple life responsibilities requires conscious regulation</li>
          <li>• <strong>Neuroplasticity</strong> means you can still rewire automatic responses at any age</li>
          <li>• <strong>Life experience</strong> gives you wisdom to draw upon when shifting perspectives</li>
        </ul>
      </div>
    </div>
  );

  const renderPracticeStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Guided Practice Scenarios</h4>
        <p className="text-sm text-blue-800">
          Practice applying the Pause-Label-Shift technique to common overwhelming situations. 
          Think through each step and write your responses.
        </p>
      </div>

      {practiceScenarios.map((scenario, index) => (
        <div key={scenario.id} className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <h5 className="font-semibold text-lg">{scenario.title}</h5>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Scenario:</p>
            <p className="text-sm text-gray-600 mt-1">{scenario.situation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-700">⏸️ PAUSE</label>
              <p className="text-xs text-gray-600">{scenario.pausePrompt}</p>
              <Textarea
                value={practiceData.scenarios[scenario.id]?.pause || ''}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  scenarios: {
                    ...prev.scenarios,
                    [scenario.id]: {
                      ...prev.scenarios[scenario.id],
                      pause: e.target.value
                    }
                  }
                }))}
                placeholder="Describe your pause strategy..."
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-700">🏷️ LABEL</label>
              <p className="text-xs text-gray-600">{scenario.labelPrompt}</p>
              <Textarea
                value={practiceData.scenarios[scenario.id]?.label || ''}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  scenarios: {
                    ...prev.scenarios,
                    [scenario.id]: {
                      ...prev.scenarios[scenario.id],
                      label: e.target.value
                    }
                  }
                }))}
                placeholder="Name what you're experiencing..."
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-700">⚡ SHIFT</label>
              <p className="text-xs text-gray-600">{scenario.shiftPrompt}</p>
              <Textarea
                value={practiceData.scenarios[scenario.id]?.shift || ''}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  scenarios: {
                    ...prev.scenarios,
                    [scenario.id]: {
                      ...prev.scenarios[scenario.id],
                      shift: e.target.value
                    }
                  }
                }))}
                placeholder="Choose your helpful response..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPersonalStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Apply to Your Personal Situation</h4>
        <p className="text-sm text-purple-800">
          Think of a recent situation where you felt overwhelmed. Apply the Pause-Label-Shift technique 
          and practice what you could do differently next time.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Describe a recent overwhelming situation:</label>
        <Textarea
          value={practiceData.personalPractice.situation}
          onChange={(e) => setPracticeData(prev => ({
            ...prev,
            personalPractice: { ...prev.personalPractice, situation: e.target.value }
          }))}
          placeholder="Describe what happened, how you felt, and how you responded..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏸️</span>
            <label className="text-sm font-medium text-red-700">How could you have PAUSED?</label>
          </div>
          <Textarea
            value={practiceData.personalPractice.pauseResponse}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPractice: { ...prev.personalPractice, pauseResponse: e.target.value }
            }))}
            placeholder="What pause technique would have helped you create space?"
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <label className="text-sm font-medium text-yellow-700">How would you LABEL the experience?</label>
          </div>
          <Textarea
            value={practiceData.personalPractice.labelResponse}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPractice: { ...prev.personalPractice, labelResponse: e.target.value }
            }))}
            placeholder="Name the emotions, thoughts, and sensations you noticed..."
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <label className="text-sm font-medium text-green-700">What SHIFT would have served you better?</label>
          </div>
          <Textarea
            value={practiceData.personalPractice.shiftResponse}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPractice: { ...prev.personalPractice, shiftResponse: e.target.value }
            }))}
            placeholder="What different response would align with your values and goals?"
            rows={4}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Reflection on this practice:</label>
        <Textarea
          value={practiceData.personalPractice.reflection}
          onChange={(e) => setPracticeData(prev => ({
            ...prev,
            personalPractice: { ...prev.personalPractice, reflection: e.target.value }
          }))}
          placeholder="What insights did you gain? How might this technique help you in the future?"
          rows={3}
        />
      </div>
    </div>
  );

  const renderIntegrationStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Integration & Daily Practice</h4>
        <p className="text-sm text-green-800">
          The key to mastering this technique is consistent practice. Plan how you'll integrate 
          Pause-Label-Shift into your daily life.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">How confident do you feel about using this technique? (1 = Not confident, 10 = Very confident)</label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Not confident</span>
          <input
            type="range"
            min="1"
            max="10"
            value={practiceData.confidenceLevel}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              confidenceLevel: parseInt(e.target.value)
            }))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500">Very confident</span>
          <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">{practiceData.confidenceLevel}</span>
        </div>
      </div>

      <div>
        <h5 className="font-medium mb-4">Choose your integration commitments:</h5>
        <div className="space-y-3">
          {[
            'Practice one micro-pause each day (even just taking one conscious breath)',
            'Use the labeling technique when I notice strong emotions arising',
            'Apply the full Pause-Label-Shift method at least once this week',
            'Share this technique with someone in my support system',
            'Set a daily reminder to check in with my emotional state',
            'Practice this technique during low-stress moments to build the habit'
          ].map((commitment, index) => (
            <label key={index} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={practiceData.commitments.includes(commitment)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPracticeData(prev => ({
                      ...prev,
                      commitments: [...prev.commitments, commitment]
                    }));
                  } else {
                    setPracticeData(prev => ({
                      ...prev,
                      commitments: prev.commitments.filter(c => c !== commitment)
                    }));
                  }
                }}
                className="rounded mt-1"
              />
              <span className="text-sm">{commitment}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">Quick Reference Card</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>⏸️ PAUSE:</strong> Stop, breathe, create space</p>
          <p><strong>🏷️ LABEL:</strong> "I notice..." or "I'm feeling..."</p>
          <p><strong>⚡ SHIFT:</strong> Ask "What would serve me better right now?"</p>
        </div>
      </div>
    </div>
  );

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
          Pause-Label-Shift Technique
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Master the neuroscience-backed 3-step emotion regulation method</p>
          </div>

          {currentStep === 0 && renderLearnStep()}
          {currentStep === 1 && renderPracticeStep()}
          {currentStep === 2 && renderPersonalStep()}
          {currentStep === 3 && renderIntegrationStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w3-technique', practiceData)}
                className="ml-auto"
              >
                Complete Practice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Boundaries Worksheet Component
function BoundariesWorksheet({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [boundariesData, setBoundariesData] = useState({
    assessment: {
      currentChallenges: [] as string[],
      difficultSituations: '',
      boundaryViolations: '',
      stressLevel: 5
    },
    timeScripts: {
      saying_no: '',
      time_requests: '',
      interruptions: '',
      work_overload: '',
      social_obligations: ''
    },
    emotionalScripts: {
      support_requests: '',
      criticism: '',
      guilt_trips: '',
      emotional_dumping: '',
      manipulation: ''
    },
    familyScripts: {
      expectations: '',
      responsibilities: '',
      personal_time: '',
      parenting_pressure: '',
      elder_care: ''
    },
    digitalScripts: {
      work_hours: '',
      social_media: '',
      availability: '',
      urgent_messages: '',
      phone_calls: ''
    },
    practiceScenarios: {} as Record<string, { situation: string; script: string; confidence: number }>,
    practiceCommitments: [] as string[]
  });

  const steps = [
    'Boundary Assessment',
    'Time Boundaries',
    'Emotional Boundaries', 
    'Family Boundaries',
    'Digital Boundaries',
    'Practice Scenarios',
    'Implementation Plan'
  ];

  const boundaryTypes = [
    'Saying no to requests without guilt',
    'Managing work-life balance',
    'Dealing with criticism or judgment',
    'Setting limits on emotional support',
    'Protecting personal time and space',
    'Managing family expectations',
    'Controlling digital availability',
    'Handling manipulation or guilt trips'
  ];

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Understanding Your Boundary Challenges</h4>
        <p className="text-sm text-blue-800">
          Before creating scripts, let's identify your specific boundary challenges and current stress patterns.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-4">Which boundary areas are most challenging for you?</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {boundaryTypes.map((type, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={boundariesData.assessment.currentChallenges.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBoundariesData(prev => ({
                      ...prev,
                      assessment: {
                        ...prev.assessment,
                        currentChallenges: [...prev.assessment.currentChallenges, type]
                      }
                    }));
                  } else {
                    setBoundariesData(prev => ({
                      ...prev,
                      assessment: {
                        ...prev.assessment,
                        currentChallenges: prev.assessment.currentChallenges.filter(c => c !== type)
                      }
                    }));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Describe your most difficult boundary situations:</label>
        <Textarea
          value={boundariesData.assessment.difficultSituations}
          onChange={(e) => setBoundariesData(prev => ({
            ...prev,
            assessment: { ...prev.assessment, difficultSituations: e.target.value }
          }))}
          placeholder="What situations make it hardest for you to maintain boundaries? Who are the people involved?"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Recent boundary violations or disappointments:</label>
        <Textarea
          value={boundariesData.assessment.boundaryViolations}
          onChange={(e) => setBoundariesData(prev => ({
            ...prev,
            assessment: { ...prev.assessment, boundaryViolations: e.target.value }
          }))}
          placeholder="Times when you said yes but wished you'd said no, or when others crossed your boundaries..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Current stress level from boundary issues (1 = No stress, 10 = Overwhelming)</label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">No stress</span>
          <input
            type="range"
            min="1"
            max="10"
            value={boundariesData.assessment.stressLevel}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              assessment: { ...prev.assessment, stressLevel: parseInt(e.target.value) }
            }))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500">Overwhelming</span>
          <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">{boundariesData.assessment.stressLevel}</span>
        </div>
      </div>
    </div>
  );

  const renderTimeBoundariesStep = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-3">Time Boundary Scripts</h4>
        <p className="text-sm text-orange-800">
          Protect your time and energy with clear, respectful language. Practice these scripts until they feel natural.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Saying no to requests:</label>
          <p className="text-xs text-gray-600 mb-2">For non-essential requests that would overload your schedule</p>
          <Textarea
            value={boundariesData.timeScripts.saying_no}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              timeScripts: { ...prev.timeScripts, saying_no: e.target.value }
            }))}
            placeholder="e.g., 'I appreciate you thinking of me, but I'm not available for that right now. I hope you find someone who can help.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Managing time-consuming requests:</label>
          <p className="text-xs text-gray-600 mb-2">When people ask for significant time investments</p>
          <Textarea
            value={boundariesData.timeScripts.time_requests}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              timeScripts: { ...prev.timeScripts, time_requests: e.target.value }
            }))}
            placeholder="e.g., 'That sounds important. Let me check my calendar and get back to you tomorrow with what I can realistically commit to.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Handling interruptions:</label>
          <p className="text-xs text-gray-600 mb-2">When your focused time is being disrupted</p>
          <Textarea
            value={boundariesData.timeScripts.interruptions}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              timeScripts: { ...prev.timeScripts, interruptions: e.target.value }
            }))}
            placeholder="e.g., 'I'm in deep focus right now. Can we schedule 15 minutes later today to discuss this properly?'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preventing work overload:</label>
          <p className="text-xs text-gray-600 mb-2">When asked to take on additional work responsibilities</p>
          <Textarea
            value={boundariesData.timeScripts.work_overload}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              timeScripts: { ...prev.timeScripts, work_overload: e.target.value }
            }))}
            placeholder="e.g., 'I want to deliver quality work. To take this on, I'd need to adjust deadlines on X and Y projects. Should we prioritize this over those?'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Managing social obligations:</label>
          <p className="text-xs text-gray-600 mb-2">For social events or commitments that drain your energy</p>
          <Textarea
            value={boundariesData.timeScripts.social_obligations}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              timeScripts: { ...prev.timeScripts, social_obligations: e.target.value }
            }))}
            placeholder="e.g., 'I'm not able to commit to that right now. I'm focusing on some personal priorities, but I hope you have a wonderful time.'"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderEmotionalBoundariesStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Emotional Boundary Scripts</h4>
        <p className="text-sm text-purple-800">
          Protect your emotional energy while maintaining compassionate relationships. These scripts help you support others without depleting yourself.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Limiting emotional support requests:</label>
          <p className="text-xs text-gray-600 mb-2">When someone frequently seeks emotional support beyond your capacity</p>
          <Textarea
            value={boundariesData.emotionalScripts.support_requests}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              emotionalScripts: { ...prev.emotionalScripts, support_requests: e.target.value }
            }))}
            placeholder="e.g., 'I care about you and I can see you're struggling. I have about 10 minutes to listen right now, and then I'd encourage you to reach out to [professional/other support].'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Responding to criticism or judgment:</label>
          <p className="text-xs text-gray-600 mb-2">When others criticize your choices or lifestyle</p>
          <Textarea
            value={boundariesData.emotionalScripts.criticism}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              emotionalScripts: { ...prev.emotionalScripts, criticism: e.target.value }
            }))}
            placeholder="e.g., 'I understand you have a different perspective. This is what works for me right now.' or 'I'm not open to feedback on this topic.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Handling guilt trips:</label>
          <p className="text-xs text-gray-600 mb-2">When others try to make you feel guilty for your boundaries</p>
          <Textarea
            value={boundariesData.emotionalScripts.guilt_trips}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              emotionalScripts: { ...prev.emotionalScripts, guilt_trips: e.target.value }
            }))}
            placeholder="e.g., 'I understand you're disappointed. My decision isn't about you - it's about what I need to take care of myself right now.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stopping emotional dumping:</label>
          <p className="text-xs text-gray-600 mb-2">When conversations become one-sided venting sessions</p>
          <Textarea
            value={boundariesData.emotionalScripts.emotional_dumping}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              emotionalScripts: { ...prev.emotionalScripts, emotional_dumping: e.target.value }
            }))}
            placeholder="e.g., 'I can hear how frustrated you are. I'm not in the right headspace to be helpful with this today. Can we catch up when I'm more available to really listen?'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Addressing manipulation:</label>
          <p className="text-xs text-gray-600 mb-2">When others use emotional manipulation to get their way</p>
          <Textarea
            value={boundariesData.emotionalScripts.manipulation}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              emotionalScripts: { ...prev.emotionalScripts, manipulation: e.target.value }
            }))}
            placeholder="e.g., 'I notice this conversation is getting pressured. I need to take a step back. Let's revisit this when we can discuss it more calmly.'"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderFamilyBoundariesStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Family Boundary Scripts</h4>
        <p className="text-sm text-green-800">
          Family relationships often have the most complex boundary challenges. These scripts help you maintain love while protecting your well-being.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Managing family expectations:</label>
          <p className="text-xs text-gray-600 mb-2">When family expects you to fulfill traditional or assumed roles</p>
          <Textarea
            value={boundariesData.familyScripts.expectations}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              familyScripts: { ...prev.familyScripts, expectations: e.target.value }
            }))}
            placeholder="e.g., 'I love our family and I'm not able to take on that responsibility right now. Let's brainstorm other solutions together.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Redistributing family responsibilities:</label>
          <p className="text-xs text-gray-600 mb-2">When you're carrying too much of the family load</p>
          <Textarea
            value={boundariesData.familyScripts.responsibilities}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              familyScripts: { ...prev.familyScripts, responsibilities: e.target.value }
            }))}
            placeholder="e.g., 'I've been handling most of [specific tasks]. I need to share this load. Here's what I can continue doing, and here's what I need help with...'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Protecting personal time:</label>
          <p className="text-xs text-gray-600 mb-2">When family members don't respect your need for alone time</p>
          <Textarea
            value={boundariesData.familyScripts.personal_time}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              familyScripts: { ...prev.familyScripts, personal_time: e.target.value }
            }))}
            placeholder="e.g., 'I need one hour of uninterrupted time to recharge. This isn't about not wanting to be with you - it's about me taking care of myself so I can be present with you later.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Handling parenting pressure:</label>
          <p className="text-xs text-gray-600 mb-2">When others judge or pressure your parenting decisions</p>
          <Textarea
            value={boundariesData.familyScripts.parenting_pressure}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              familyScripts: { ...prev.familyScripts, parenting_pressure: e.target.value }
            }))}
            placeholder="e.g., 'I appreciate that you care about [child's name]. [Partner] and I have discussed this and we're comfortable with our approach.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Managing elder care expectations:</label>
          <p className="text-xs text-gray-600 mb-2">When family assumes you'll provide extensive elder care</p>
          <Textarea
            value={boundariesData.familyScripts.elder_care}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              familyScripts: { ...prev.familyScripts, elder_care: e.target.value }
            }))}
            placeholder="e.g., 'I want to support [family member] in the best way possible. Let's have a family meeting to discuss how we can all contribute to their care in sustainable ways.'"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderDigitalBoundariesStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Digital Boundary Scripts</h4>
        <p className="text-sm text-indigo-800">
          Technology can blur boundaries between work and personal life. These scripts help you maintain digital wellness.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Setting work hours boundaries:</label>
          <p className="text-xs text-gray-600 mb-2">For emails, messages, or calls outside your designated work hours</p>
          <Textarea
            value={boundariesData.digitalScripts.work_hours}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              digitalScripts: { ...prev.digitalScripts, work_hours: e.target.value }
            }))}
            placeholder="e.g., 'I received your message. I check work communications between 9-5 on weekdays. I'll respond by [specific time] tomorrow.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Managing social media interactions:</label>
          <p className="text-xs text-gray-600 mb-2">When social media becomes overwhelming or intrusive</p>
          <Textarea
            value={boundariesData.digitalScripts.social_media}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              digitalScripts: { ...prev.digitalScripts, social_media: e.target.value }
            }))}
            placeholder="e.g., 'I'm taking a break from social media to focus on personal priorities. I'll catch up with you through [preferred method] instead.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Controlling availability expectations:</label>
          <p className="text-xs text-gray-600 mb-2">When others expect immediate responses to messages</p>
          <Textarea
            value={boundariesData.digitalScripts.availability}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              digitalScripts: { ...prev.digitalScripts, availability: e.target.value }
            }))}
            placeholder="e.g., 'I typically respond to messages within 24-48 hours. If something is truly urgent, please call me directly.'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Handling 'urgent' messages:</label>
          <p className="text-xs text-gray-600 mb-2">When everything is labeled as urgent but isn't truly an emergency</p>
          <Textarea
            value={boundariesData.digitalScripts.urgent_messages}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              digitalScripts: { ...prev.digitalScripts, urgent_messages: e.target.value }
            }))}
            placeholder="e.g., 'I see you marked this as urgent. To help me prioritize, can you let me know what happens if this waits until [tomorrow/Monday]?'"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Managing unexpected phone calls:</label>
          <p className="text-xs text-gray-600 mb-2">When people call without scheduling, expecting immediate availability</p>
          <Textarea
            value={boundariesData.digitalScripts.phone_calls}
            onChange={(e) => setBoundariesData(prev => ({
              ...prev,
              digitalScripts: { ...prev.digitalScripts, phone_calls: e.target.value }
            }))}
            placeholder="e.g., 'I'm not available to talk right now. Can we schedule 20 minutes sometime this week when I can give you my full attention?'"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderPracticeScenariosStep = () => {
    const scenarios = [
      {
        id: 'overwhelming-request',
        title: 'Overwhelming Work Request',
        situation: 'Your colleague asks you to help with their project that would require 10+ hours of work, saying "You\'re the only one who can help me!"'
      },
      {
        id: 'family-guilt',
        title: 'Family Guilt Trip',
        situation: 'Your mother says "I guess you\'re too busy for family" when you can\'t attend every family gathering.'
      },
      {
        id: 'friend-emotional-dump',
        title: 'Friend\'s Emotional Dumping',
        situation: 'A friend calls daily to vent about their relationship problems but never asks how you\'re doing or follows your advice.'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-3">Practice Boundary Scenarios</h4>
          <p className="text-sm text-yellow-800">
            Practice applying your boundary scripts to realistic scenarios. Rate your confidence to track progress.
          </p>
        </div>

        {scenarios.map((scenario, index) => (
          <div key={scenario.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <h5 className="font-semibold text-lg">{scenario.title}</h5>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Scenario:</p>
              <p className="text-sm text-gray-600 mt-1">{scenario.situation}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your boundary response:</label>
              <Textarea
                value={boundariesData.practiceScenarios[scenario.id]?.script || ''}
                onChange={(e) => setBoundariesData(prev => ({
                  ...prev,
                  practiceScenarios: {
                    ...prev.practiceScenarios,
                    [scenario.id]: {
                      ...prev.practiceScenarios[scenario.id],
                      situation: scenario.situation,
                      script: e.target.value
                    }
                  }
                }))}
                placeholder="Write how you would respond using your boundary scripts..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confidence level (1-10):</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Not confident</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={boundariesData.practiceScenarios[scenario.id]?.confidence || 5}
                  onChange={(e) => setBoundariesData(prev => ({
                    ...prev,
                    practiceScenarios: {
                      ...prev.practiceScenarios,
                      [scenario.id]: {
                        ...prev.practiceScenarios[scenario.id],
                        situation: scenario.situation,
                        confidence: parseInt(e.target.value)
                      }
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Very confident</span>
                <span className="w-8 text-center font-medium bg-yellow-100 rounded px-2 py-1">
                  {boundariesData.practiceScenarios[scenario.id]?.confidence || 5}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderImplementationStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Implementation & Practice Plan</h4>
        <p className="text-sm text-green-800">
          Boundaries become stronger with practice. Choose specific commitments to integrate into your daily life.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-4">Choose your boundary practice commitments:</h5>
        <div className="space-y-3">
          {[
            'Practice saying no to one small request this week',
            'Use one emotional boundary script when someone drains my energy',
            'Set specific work hours and communicate them to colleagues/family',
            'Schedule and protect 30 minutes of daily personal time',
            'Have one honest conversation about redistributing family responsibilities',
            'Create an email auto-response about my availability',
            'Practice one boundary script in the mirror daily until it feels natural',
            'Ask for 24 hours to think before committing to any new requests',
            'Share my boundary goals with a trusted friend or partner for support',
            'Review and adjust my boundary scripts weekly based on what works'
          ].map((commitment, index) => (
            <label key={index} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={boundariesData.practiceCommitments.includes(commitment)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBoundariesData(prev => ({
                      ...prev,
                      practiceCommitments: [...prev.practiceCommitments, commitment]
                    }));
                  } else {
                    setBoundariesData(prev => ({
                      ...prev,
                      practiceCommitments: prev.practiceCommitments.filter(c => c !== commitment)
                    }));
                  }
                }}
                className="rounded mt-1"
              />
              <span className="text-sm">{commitment}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">Remember: Boundary Setting Tips</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start with low-stakes situations to build confidence</li>
          <li>• Your "no" is a complete sentence - you don't need elaborate explanations</li>
          <li>• Expect some pushback initially - people are used to your old patterns</li>
          <li>• Consistency is key - maintain boundaries even when it feels uncomfortable</li>
          <li>• Self-care isn't selfish - you can't pour from an empty cup</li>
        </ul>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-green-600" />
          Boundaries Worksheet
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Design personalized boundary scripts for time, emotional, family, and digital situations</p>
          </div>

          {currentStep === 0 && renderAssessmentStep()}
          {currentStep === 1 && renderTimeBoundariesStep()}
          {currentStep === 2 && renderEmotionalBoundariesStep()}
          {currentStep === 3 && renderFamilyBoundariesStep()}
          {currentStep === 4 && renderDigitalBoundariesStep()}
          {currentStep === 5 && renderPracticeScenariosStep()}
          {currentStep === 6 && renderImplementationStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w3-boundaries', boundariesData)}
                className="ml-auto"
              >
                Complete Boundaries Worksheet
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Weekly Mood Map Component
function WeeklyMoodMap({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [moodData, setMoodData] = useState({
    weeklyGoals: {
      emotional: '',
      stress: '',
      selfCare: ''
    },
    dailyMoods: {} as Record<string, {
      overall: number;
      energy: number;
      stress: number;
      anxiety: number;
      joy: number;
      confidence: number;
      triggers: string[];
      highlights: string;
      challenges: string;
      copingStrategies: string[];
    }>,
    weeklyReflection: {
      patterns: '',
      triggers: '',
      strengths: '',
      improvements: '',
      insights: '',
      nextWeekGoals: ''
    },
    progressTracking: {
      emotionRegulation: 5,
      stressManagement: 5,
      selfAwareness: 5,
      boundarySuccess: 5
    }
  });

  const steps = [
    'Set Weekly Intentions',
    'Daily Mood Tracking',
    'Pattern Recognition',
    'Progress Review'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const emotionTriggers = [
    'Work stress', 'Family tension', 'Health concerns', 'Financial worry',
    'Social pressure', 'Hormonal changes', 'Sleep issues', 'Technology overload',
    'Relationship conflict', 'Time pressure', 'Decision fatigue', 'Comparison'
  ];

  const copingStrategies = [
    'Deep breathing', 'Physical exercise', 'Meditation', 'Journaling',
    'Talk to friend', 'Time in nature', 'Creative activity', 'Rest/nap',
    'Healthy boundaries', 'Professional help', 'Self-compassion', 'Problem-solving'
  ];

  const getMoodColor = (value: number) => {
    if (value <= 2) return 'bg-red-500';
    if (value <= 4) return 'bg-orange-500';
    if (value <= 6) return 'bg-yellow-500';
    if (value <= 8) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getMoodLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Good';
    return 'Excellent';
  };

  const renderWeeklyIntentionsStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Set Your Weekly Emotional Intentions</h4>
        <p className="text-sm text-indigo-800">
          Before tracking daily moods, set clear intentions for your emotional well-being this week. 
          These will guide your awareness and help you recognize progress.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Emotional regulation goal for this week:</label>
          <p className="text-xs text-gray-600 mb-2">What specific emotion or emotional pattern do you want to work on?</p>
          <Textarea
            value={moodData.weeklyGoals.emotional}
            onChange={(e) => setMoodData(prev => ({
              ...prev,
              weeklyGoals: { ...prev.weeklyGoals, emotional: e.target.value }
            }))}
            placeholder="e.g., I want to notice when I feel overwhelmed and use my pause-label-shift technique..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stress management intention:</label>
          <p className="text-xs text-gray-600 mb-2">How do you want to handle stress differently this week?</p>
          <Textarea
            value={moodData.weeklyGoals.stress}
            onChange={(e) => setMoodData(prev => ({
              ...prev,
              weeklyGoals: { ...prev.weeklyGoals, stress: e.target.value }
            }))}
            placeholder="e.g., I will take 5-minute breathing breaks when I notice stress building..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Self-care commitment:</label>
          <p className="text-xs text-gray-600 mb-2">What specific self-care practice will you prioritize?</p>
          <Textarea
            value={moodData.weeklyGoals.selfCare}
            onChange={(e) => setMoodData(prev => ({
              ...prev,
              weeklyGoals: { ...prev.weeklyGoals, selfCare: e.target.value }
            }))}
            placeholder="e.g., I will spend 15 minutes each morning in quiet reflection or gentle movement..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderDailyTrackingStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Daily Mood & Emotion Tracking</h4>
        <p className="text-sm text-purple-800">
          Track multiple dimensions of your emotional experience each day. This comprehensive view 
          helps identify patterns and celebrate progress.
        </p>
      </div>

      <div className="space-y-8">
        {daysOfWeek.map((day) => (
          <div key={day} className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-lg">{day}</h5>
              <div className="text-sm text-gray-500">
                Overall: <span className={`px-2 py-1 rounded text-white text-xs ${getMoodColor(moodData.dailyMoods[day]?.overall || 5)}`}>
                  {getMoodLabel(moodData.dailyMoods[day]?.overall || 5)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'overall', label: 'Overall Mood' },
                { key: 'energy', label: 'Energy Level' },
                { key: 'stress', label: 'Stress Level' },
                { key: 'anxiety', label: 'Anxiety Level' },
                { key: 'joy', label: 'Joy/Contentment' },
                { key: 'confidence', label: 'Confidence' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium">{label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={moodData.dailyMoods[day]?.[key as keyof typeof moodData.dailyMoods[string]] || 5}
                      onChange={(e) => setMoodData(prev => ({
                        ...prev,
                        dailyMoods: {
                          ...prev.dailyMoods,
                          [day]: {
                            ...prev.dailyMoods[day],
                            [key]: parseInt(e.target.value)
                          }
                        }
                      }))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">10</span>
                    <span className="w-6 text-center text-sm font-medium">
                      {moodData.dailyMoods[day]?.[key as keyof typeof moodData.dailyMoods[string]] || 5}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Main triggers or stressors:</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                {emotionTriggers.map((trigger) => (
                  <label key={trigger} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moodData.dailyMoods[day]?.triggers?.includes(trigger) || false}
                      onChange={(e) => {
                        const currentTriggers = moodData.dailyMoods[day]?.triggers || [];
                        const newTriggers = e.target.checked 
                          ? [...currentTriggers, trigger]
                          : currentTriggers.filter(t => t !== trigger);
                        
                        setMoodData(prev => ({
                          ...prev,
                          dailyMoods: {
                            ...prev.dailyMoods,
                            [day]: {
                              ...prev.dailyMoods[day],
                              triggers: newTriggers
                            }
                          }
                        }));
                      }}
                      className="rounded"
                    />
                    <span className="text-xs">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Highlights of the day:</label>
                <Textarea
                  value={moodData.dailyMoods[day]?.highlights || ''}
                  onChange={(e) => setMoodData(prev => ({
                    ...prev,
                    dailyMoods: {
                      ...prev.dailyMoods,
                      [day]: {
                        ...prev.dailyMoods[day],
                        highlights: e.target.value
                      }
                    }
                  }))}
                  placeholder="What went well? What are you grateful for?"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Challenges faced:</label>
                <Textarea
                  value={moodData.dailyMoods[day]?.challenges || ''}
                  onChange={(e) => setMoodData(prev => ({
                    ...prev,
                    dailyMoods: {
                      ...prev.dailyMoods,
                      [day]: {
                        ...prev.dailyMoods[day],
                        challenges: e.target.value
                      }
                    }
                  }))}
                  placeholder="What was difficult? What drained your energy?"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Coping strategies used:</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {copingStrategies.map((strategy) => (
                  <label key={strategy} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moodData.dailyMoods[day]?.copingStrategies?.includes(strategy) || false}
                      onChange={(e) => {
                        const currentStrategies = moodData.dailyMoods[day]?.copingStrategies || [];
                        const newStrategies = e.target.checked 
                          ? [...currentStrategies, strategy]
                          : currentStrategies.filter(s => s !== strategy);
                        
                        setMoodData(prev => ({
                          ...prev,
                          dailyMoods: {
                            ...prev.dailyMoods,
                            [day]: {
                              ...prev.dailyMoods[day],
                              copingStrategies: newStrategies
                            }
                          }
                        }));
                      }}
                      className="rounded"
                    />
                    <span className="text-xs">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPatternRecognitionStep = () => {
    const getAverageScore = (metric: string) => {
      const scores = Object.values(moodData.dailyMoods).map(day => {
        const value = day[metric as keyof typeof day];
        return typeof value === 'number' ? value : 5;
      });
      return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '5.0';
    };

    const getMostCommonTriggers = () => {
      const triggerCounts: Record<string, number> = {};
      Object.values(moodData.dailyMoods).forEach(day => {
        day.triggers?.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      });
      return Object.entries(triggerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([trigger, count]) => `${trigger} (${count} days)`);
    };

    const getMostUsedStrategies = () => {
      const strategyCounts: Record<string, number> = {};
      Object.values(moodData.dailyMoods).forEach(day => {
        day.copingStrategies?.forEach(strategy => {
          strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
        });
      });
      return Object.entries(strategyCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([strategy, count]) => `${strategy} (${count} days)`);
    };

    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">Weekly Pattern Analysis</h4>
          <p className="text-sm text-green-800">
            Review your week's emotional patterns to identify trends, strengths, and areas for growth.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Overall Mood</h5>
            <div className="text-2xl font-bold text-purple-600">{getAverageScore('overall')}/10</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Energy</h5>
            <div className="text-2xl font-bold text-blue-600">{getAverageScore('energy')}/10</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Stress</h5>
            <div className="text-2xl font-bold text-orange-600">{getAverageScore('stress')}/10</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Anxiety</h5>
            <div className="text-2xl font-bold text-red-600">{getAverageScore('anxiety')}/10</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Joy</h5>
            <div className="text-2xl font-bold text-green-600">{getAverageScore('joy')}/10</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium text-sm text-gray-700">Average Confidence</h5>
            <div className="text-2xl font-bold text-indigo-600">{getAverageScore('confidence')}/10</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-medium text-orange-900 mb-3">Most Common Triggers</h5>
            <ul className="text-sm text-orange-800 space-y-1">
              {getMostCommonTriggers().map((trigger, index) => (
                <li key={index}>• {trigger}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-3">Most Used Coping Strategies</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              {getMostUsedStrategies().map((strategy, index) => (
                <li key={index}>• {strategy}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Emotional patterns you noticed:</label>
            <Textarea
              value={moodData.weeklyReflection.patterns}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                weeklyReflection: { ...prev.weeklyReflection, patterns: e.target.value }
              }))}
              placeholder="What patterns do you see in your moods? Any connections between events and emotions?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Main triggers and their impact:</label>
            <Textarea
              value={moodData.weeklyReflection.triggers}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                weeklyReflection: { ...prev.weeklyReflection, triggers: e.target.value }
              }))}
              placeholder="Which triggers had the biggest impact? How did they affect your mood and energy?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emotional strengths and wins:</label>
            <Textarea
              value={moodData.weeklyReflection.strengths}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                weeklyReflection: { ...prev.weeklyReflection, strengths: e.target.value }
              }))}
              placeholder="When did you handle emotions well? What coping strategies worked best?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Areas for improvement:</label>
            <Textarea
              value={moodData.weeklyReflection.improvements}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                weeklyReflection: { ...prev.weeklyReflection, improvements: e.target.value }
              }))}
              placeholder="What would you like to handle differently? What new strategies might help?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key insights and discoveries:</label>
            <Textarea
              value={moodData.weeklyReflection.insights}
              onChange={(e) => setMoodData(prev => ({
                ...prev,
                weeklyReflection: { ...prev.weeklyReflection, insights: e.target.value }
              }))}
              placeholder="What did you learn about yourself? Any surprising connections or realizations?"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderProgressReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Weekly Progress Review</h4>
        <p className="text-sm text-blue-800">
          Assess your progress in key emotional regulation areas and set intentions for the coming week.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Rate your progress this week (1-10):</h5>
          <div className="space-y-4">
            {[
              { key: 'emotionRegulation', label: 'Emotion Regulation Skills', description: 'Using pause-label-shift and other techniques' },
              { key: 'stressManagement', label: 'Stress Management', description: 'Handling overwhelm and pressure effectively' },
              { key: 'selfAwareness', label: 'Self-Awareness', description: 'Noticing emotions and triggers in the moment' },
              { key: 'boundarySuccess', label: 'Boundary Success', description: 'Maintaining healthy boundaries with others' }
            ].map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <div>
                  <label className="text-sm font-medium">{label}</label>
                  <p className="text-xs text-gray-600">{description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Poor</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodData.progressTracking[key as keyof typeof moodData.progressTracking]}
                    onChange={(e) => setMoodData(prev => ({
                      ...prev,
                      progressTracking: {
                        ...prev.progressTracking,
                        [key]: parseInt(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">Excellent</span>
                  <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">
                    {moodData.progressTracking[key as keyof typeof moodData.progressTracking]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Goals for next week:</label>
          <Textarea
            value={moodData.weeklyReflection.nextWeekGoals}
            onChange={(e) => setMoodData(prev => ({
              ...prev,
              weeklyReflection: { ...prev.weeklyReflection, nextWeekGoals: e.target.value }
            }))}
            placeholder="Based on this week's patterns, what do you want to focus on next week?"
            rows={4}
          />
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-semibold text-green-900 mb-2">Celebration & Acknowledgment</h5>
          <p className="text-sm text-green-800">
            You completed a full week of emotional awareness and tracking! This level of self-reflection 
            is a powerful step toward emotional regulation and mental wellness. Acknowledge your commitment 
            to growth and self-understanding.
          </p>
        </div>
      </div>
    </div>
  );

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
          <Calendar className="w-6 h-6 text-purple-600" />
          Weekly Mood Map
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Visual tracking helps identify emotional patterns and regulation progress</p>
          </div>

          {currentStep === 0 && renderWeeklyIntentionsStep()}
          {currentStep === 1 && renderDailyTrackingStep()}
          {currentStep === 2 && renderPatternRecognitionStep()}
          {currentStep === 3 && renderProgressReviewStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w3-mood-map', moodData)}
                className="ml-auto"
              >
                Complete Mood Map
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// WEEK 4 COMPONENTS - NERVOUS SYSTEM RESET

// Somatic Grounding Practices Component
function SomaticGroundingPractices({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceData, setPracticeData] = useState({
    nervousSystemAssessment: {
      currentState: 5,
      stressSigns: [] as string[],
      triggerPatterns: '',
      copingHistory: '',
      goals: ''
    },
    techniqueProgress: {} as Record<string, {
      practiced: boolean;
      effectiveness: number;
      experience: string;
      confidence: number;
      integrateDaily: boolean;
    }>,
    personalPlan: {
      dailyTechniques: [] as string[],
      emergencyTechniques: [] as string[],
      practiceSchedule: '',
      trackingMethod: '',
      progressGoals: ''
    }
  });

  const steps = [
    'Nervous System Assessment',
    'Learn 5-4-3-2-1 Grounding',
    'Progressive Body Scan',
    'Quick Reset Techniques',
    'Emergency Grounding Tools',
    'Personal Integration Plan'
  ];

  const stressSigns = [
    'Rapid heartbeat', 'Shallow breathing', 'Muscle tension', 'Restlessness',
    'Mind racing', 'Sweating', 'Digestive issues', 'Sleep problems',
    'Irritability', 'Difficulty concentrating', 'Fatigue', 'Headaches'
  ];

  const techniques = [
    {
      id: 'grounding-5-4-3-2-1',
      name: '5-4-3-2-1 Sensory Grounding',
      description: 'Use your five senses to anchor yourself in the present moment',
      timeNeeded: '3-5 minutes',
      when: 'Anxiety, overwhelm, panic'
    },
    {
      id: 'body-scan',
      name: 'Progressive Body Scan',
      description: 'Systematic tension release from head to toe',
      timeNeeded: '10-15 minutes',
      when: 'Before sleep, during breaks'
    },
    {
      id: 'quick-reset',
      name: 'Quick Reset Techniques',
      description: '30-second grounding tools for immediate relief',
      timeNeeded: '30 seconds - 2 minutes',
      when: 'In public, at work, during conversations'
    },
    {
      id: 'emergency-grounding',
      name: 'Emergency Grounding',
      description: 'Intensive techniques for acute distress',
      timeNeeded: '5-10 minutes',
      when: 'Panic attacks, severe overwhelm'
    }
  ];

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <div className="bg-teal-50 p-6 rounded-lg">
        <h4 className="font-semibold text-teal-900 mb-3">Understanding Your Nervous System</h4>
        <p className="text-sm text-teal-800">
          Your nervous system is constantly adapting to life's demands. In midlife, hormonal changes can make 
          this system more sensitive. Let's assess your current state and build personalized grounding tools.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Current nervous system activation level (1 = Completely calm, 10 = Highly activated)</label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Calm</span>
          <input
            type="range"
            min="1"
            max="10"
            value={practiceData.nervousSystemAssessment.currentState}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              nervousSystemAssessment: { 
                ...prev.nervousSystemAssessment, 
                currentState: parseInt(e.target.value) 
              }
            }))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500">Activated</span>
          <span className="w-8 text-center font-medium bg-teal-100 rounded px-2 py-1">
            {practiceData.nervousSystemAssessment.currentState}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {practiceData.nervousSystemAssessment.currentState <= 3 && "You're in a calm, regulated state"}
          {practiceData.nervousSystemAssessment.currentState >= 4 && practiceData.nervousSystemAssessment.currentState <= 6 && "You're experiencing moderate activation"}
          {practiceData.nervousSystemAssessment.currentState >= 7 && "You're in a highly activated state - perfect time to practice grounding"}
        </div>
      </div>

      <div>
        <h5 className="font-medium mb-4">Which physical stress signs do you currently experience?</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stressSigns.map((sign) => (
            <label key={sign} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={practiceData.nervousSystemAssessment.stressSigns.includes(sign)}
                onChange={(e) => {
                  const current = practiceData.nervousSystemAssessment.stressSigns;
                  setPracticeData(prev => ({
                    ...prev,
                    nervousSystemAssessment: {
                      ...prev.nervousSystemAssessment,
                      stressSigns: e.target.checked 
                        ? [...current, sign]
                        : current.filter(s => s !== sign)
                    }
                  }));
                }}
                className="rounded"
              />
              <span className="text-sm">{sign}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">What situations typically activate your nervous system?</label>
        <Textarea
          value={practiceData.nervousSystemAssessment.triggerPatterns}
          onChange={(e) => setPracticeData(prev => ({
            ...prev,
            nervousSystemAssessment: { 
              ...prev.nervousSystemAssessment, 
              triggerPatterns: e.target.value 
            }
          }))}
          placeholder="e.g., Work deadlines, family conflicts, health appointments, social situations, financial discussions..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">What grounding or calming techniques have you tried before?</label>
        <Textarea
          value={practiceData.nervousSystemAssessment.copingHistory}
          onChange={(e) => setPracticeData(prev => ({
            ...prev,
            nervousSystemAssessment: { 
              ...prev.nervousSystemAssessment, 
              copingHistory: e.target.value 
            }
          }))}
          placeholder="What has worked? What hasn't? What would you like to learn?"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your goals for nervous system regulation:</label>
        <Textarea
          value={practiceData.nervousSystemAssessment.goals}
          onChange={(e) => setPracticeData(prev => ({
            ...prev,
            nervousSystemAssessment: { 
              ...prev.nervousSystemAssessment, 
              goals: e.target.value 
            }
          }))}
          placeholder="e.g., Feel calmer in social situations, sleep better, reduce anxiety during work stress..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderGroundingStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">5-4-3-2-1 Sensory Grounding Technique</h4>
        <p className="text-sm text-blue-800">
          This technique uses your five senses to bring you immediately into the present moment. 
          It's one of the most effective tools for anxiety and overwhelm.
        </p>
      </div>

      <div className="bg-white border-2 border-blue-200 rounded-lg p-6 space-y-4">
        <h5 className="font-semibold text-lg text-blue-900">Learn the Technique:</h5>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div>
              <h6 className="font-medium">NOTICE 5 things you can SEE</h6>
              <p className="text-sm text-gray-600">Look around and name 5 specific things: "I see a blue coffee mug, a wooden desk, green leaves on the plant..."</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h6 className="font-medium">NOTICE 4 things you can TOUCH</h6>
              <p className="text-sm text-gray-600">Feel textures around you: "I feel the smooth table surface, my soft sweater, the cool air on my skin..."</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h6 className="font-medium">NOTICE 3 things you can HEAR</h6>
              <p className="text-sm text-gray-600">Listen carefully: "I hear birds outside, the hum of the refrigerator, my own breathing..."</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h6 className="font-medium">NOTICE 2 things you can SMELL</h6>
              <p className="text-sm text-gray-600">Take a gentle breath: "I smell coffee, fresh air, my perfume, the clean scent of soap..."</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h6 className="font-medium">NOTICE 1 thing you can TASTE</h6>
              <p className="text-sm text-gray-600">Notice any taste in your mouth, or take a sip of water: "I taste the mint from my gum, the lingering coffee..."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h6 className="font-medium text-yellow-900 mb-2">Practice Right Now:</h6>
        <p className="text-sm text-yellow-800">Take 3 minutes to practice this technique. Go slowly and really focus on each sense.</p>
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">How effective was this technique for you? (1-10)</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Not helpful</span>
              <input
                type="range"
                min="1"
                max="10"
                value={practiceData.techniqueProgress['grounding-5-4-3-2-1']?.effectiveness || 5}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'grounding-5-4-3-2-1': {
                      ...prev.techniqueProgress['grounding-5-4-3-2-1'],
                      effectiveness: parseInt(e.target.value),
                      practiced: true
                    }
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Very helpful</span>
              <span className="w-8 text-center font-medium bg-yellow-100 rounded px-2 py-1">
                {practiceData.techniqueProgress['grounding-5-4-3-2-1']?.effectiveness || 5}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Describe your experience with this technique:</label>
            <Textarea
              value={practiceData.techniqueProgress['grounding-5-4-3-2-1']?.experience || ''}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                techniqueProgress: {
                  ...prev.techniqueProgress,
                  'grounding-5-4-3-2-1': {
                    ...prev.techniqueProgress['grounding-5-4-3-2-1'],
                    experience: e.target.value,
                    practiced: true
                  }
                }
              }))}
              placeholder="What did you notice? How did your body feel before and after? What was challenging or helpful?"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBodyScanStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Progressive Body Scan for Deep Relaxation</h4>
        <p className="text-sm text-green-800">
          This technique systematically releases tension throughout your body. Perfect for unwinding 
          after stressful days or preparing for restful sleep.
        </p>
      </div>

      <div className="bg-white border-2 border-green-200 rounded-lg p-6 space-y-6">
        <h5 className="font-semibold text-lg text-green-900">Guided Body Scan Practice:</h5>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h6 className="font-medium mb-2">Preparation (1 minute)</h6>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Find a comfortable position (sitting or lying down)</li>
              <li>• Close your eyes or soften your gaze</li>
              <li>• Take 3 deep, slow breaths</li>
              <li>• Set intention to release tension and connect with your body</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="p-3 border-l-4 border-green-400 bg-green-25">
              <h6 className="font-medium">Head & Face (2 minutes)</h6>
              <p className="text-sm text-gray-600">Notice your scalp, forehead, eyes, cheeks, jaw. Consciously relax each area. Let your jaw drop slightly open.</p>
            </div>

            <div className="p-3 border-l-4 border-blue-400 bg-blue-25">
              <h6 className="font-medium">Neck & Shoulders (2 minutes)</h6>
              <p className="text-sm text-gray-600">Feel the weight of your head. Notice shoulder tension. Imagine your shoulders melting away from your ears.</p>
            </div>

            <div className="p-3 border-l-4 border-purple-400 bg-purple-25">
              <h6 className="font-medium">Arms & Hands (2 minutes)</h6>
              <p className="text-sm text-gray-600">Scan down your arms to your fingertips. Make a fist, then release completely. Feel the contrast.</p>
            </div>

            <div className="p-3 border-l-4 border-orange-400 bg-orange-25">
              <h6 className="font-medium">Chest & Heart (2 minutes)</h6>
              <p className="text-sm text-gray-600">Notice your breathing without changing it. Feel your heartbeat. Send appreciation to your heart for all it does.</p>
            </div>

            <div className="p-3 border-l-4 border-red-400 bg-red-25">
              <h6 className="font-medium">Torso & Back (2 minutes)</h6>
              <p className="text-sm text-gray-600">Scan your abdomen, lower back, spine. Notice areas of tension or comfort without judgment.</p>
            </div>

            <div className="p-3 border-l-4 border-indigo-400 bg-indigo-25">
              <h6 className="font-medium">Hips & Pelvis (1 minute)</h6>
              <p className="text-sm text-gray-600">Notice this center of your body. Breathe into this area and allow any held tension to release.</p>
            </div>

            <div className="p-3 border-l-4 border-pink-400 bg-pink-25">
              <h6 className="font-medium">Legs & Feet (3 minutes)</h6>
              <p className="text-sm text-gray-600">Scan thighs, knees, calves, ankles, feet, toes. Wiggle your toes, then let them rest completely.</p>
            </div>

            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-25">
              <h6 className="font-medium">Whole Body Integration (1 minute)</h6>
              <p className="text-sm text-gray-600">Feel your entire body as one connected system. Notice the relaxation you've created. Take 3 gratitude breaths.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h6 className="font-medium text-green-900 mb-2">Practice Reflection:</h6>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Body scan effectiveness (1-10):</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Not helpful</span>
              <input
                type="range"
                min="1"
                max="10"
                value={practiceData.techniqueProgress['body-scan']?.effectiveness || 5}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'body-scan': {
                      ...prev.techniqueProgress['body-scan'],
                      effectiveness: parseInt(e.target.value),
                      practiced: true
                    }
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Very helpful</span>
              <span className="w-8 text-center font-medium bg-green-100 rounded px-2 py-1">
                {practiceData.techniqueProgress['body-scan']?.effectiveness || 5}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What did you discover about your body?</label>
            <Textarea
              value={practiceData.techniqueProgress['body-scan']?.experience || ''}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                techniqueProgress: {
                  ...prev.techniqueProgress,
                  'body-scan': {
                    ...prev.techniqueProgress['body-scan'],
                    experience: e.target.value,
                    practiced: true
                  }
                }
              }))}
              placeholder="Where do you hold tension? What areas felt good? What surprised you?"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickResetStep = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-3">Quick Reset Techniques for Immediate Relief</h4>
        <p className="text-sm text-orange-800">
          These 30-second to 2-minute techniques can be used anywhere - at work, in public, 
          during conversations - for instant nervous system regulation.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6 bg-white">
          <h5 className="font-semibold text-lg mb-4">The 30-Second Reset Toolkit</h5>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h6 className="font-medium text-blue-900">Tactical Breathing (30 seconds)</h6>
              <p className="text-sm text-gray-600 mb-2">Inhale for 4, hold for 4, exhale for 6. Repeat 3-4 times.</p>
              <div className="text-xs text-blue-700">Use: During meetings, conversations, when feeling overwhelmed</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h6 className="font-medium text-green-900">Feet on Floor Reset (15 seconds)</h6>
              <p className="text-sm text-gray-600 mb-2">Press feet firmly into ground, feel the connection, take one deep breath.</p>
              <div className="text-xs text-green-700">Use: While sitting at desk, in waiting rooms, before difficult conversations</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h6 className="font-medium text-purple-900">Peripheral Vision (20 seconds)</h6>
              <p className="text-sm text-gray-600 mb-2">Look straight ahead, slowly expand awareness to see as wide as possible without moving eyes.</p>
              <div className="text-xs text-purple-700">Use: When feeling tunnel vision, anxiety, or mental overwhelm</div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h6 className="font-medium text-red-900">Hand Temperature Awareness (30 seconds)</h6>
              <p className="text-sm text-gray-600 mb-2">Notice the temperature of your hands, rub them together, place on heart or belly.</p>
              <div className="text-xs text-red-700">Use: When hands are cold/sweaty from stress, before presentations</div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h6 className="font-medium text-yellow-900">Gentle Neck Release (45 seconds)</h6>
              <p className="text-sm text-gray-600 mb-2">Slowly drop chin to chest, roll head side to side gently, return to center.</p>
              <div className="text-xs text-yellow-700">Use: Between tasks, after screen time, when feeling tense</div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h5 className="font-semibold text-lg mb-4">2-Minute Power Resets</h5>
          
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h6 className="font-medium text-indigo-900">Cold Water Face Reset</h6>
              <p className="text-sm text-gray-600 mb-2">Splash cold water on face and wrists, or hold ice cube. Activates parasympathetic nervous system.</p>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg">
              <h6 className="font-medium text-pink-900">Wall Push Reset</h6>
              <p className="text-sm text-gray-600 mb-2">Find wall, place palms flat, lean in and push gently 10 times. Releases upper body tension.</p>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg">
              <h6 className="font-medium text-teal-900">Silent Humming Reset</h6>
              <p className="text-sm text-gray-600 mb-2">Close mouth, hum quietly (or internally) for 30 seconds. Vibrations stimulate vagus nerve.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h6 className="font-medium text-orange-900 mb-2">Practice Challenge:</h6>
        <p className="text-sm text-orange-800 mb-3">Try 3 different quick reset techniques right now. Rate their effectiveness.</p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Quick reset techniques effectiveness (1-10):</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Not helpful</span>
              <input
                type="range"
                min="1"
                max="10"
                value={practiceData.techniqueProgress['quick-reset']?.effectiveness || 5}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'quick-reset': {
                      ...prev.techniqueProgress['quick-reset'],
                      effectiveness: parseInt(e.target.value),
                      practiced: true
                    }
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Very helpful</span>
              <span className="w-8 text-center font-medium bg-orange-100 rounded px-2 py-1">
                {practiceData.techniqueProgress['quick-reset']?.effectiveness || 5}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Which techniques worked best for you and why?</label>
            <Textarea
              value={practiceData.techniqueProgress['quick-reset']?.experience || ''}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                techniqueProgress: {
                  ...prev.techniqueProgress,
                  'quick-reset': {
                    ...prev.techniqueProgress['quick-reset'],
                    experience: e.target.value,
                    practiced: true
                  }
                }
              }))}
              placeholder="Which felt most natural? Which would you use at work? Which for anxiety?"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyStep = () => (
    <div className="space-y-6">
      <div className="bg-red-50 p-6 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-3">Emergency Grounding for Intense Overwhelm</h4>
        <p className="text-sm text-red-800">
          These intensive techniques are for moments of acute distress, panic, or severe overwhelm. 
          They provide deeper nervous system regulation when you need it most.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-white">
          <h5 className="font-semibold text-lg mb-4 text-red-700">STOP Technique for Panic</h5>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-3 bg-red-50 rounded">
              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">S</span>
              <div>
                <h6 className="font-medium">STOP what you're doing</h6>
                <p className="text-sm text-gray-600">Pause all activity, don't make decisions, resist fight/flight urges</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-orange-50 rounded">
              <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">T</span>
              <div>
                <h6 className="font-medium">TAKE a breath</h6>
                <p className="text-sm text-gray-600">One long, slow exhale (8 counts), then natural breathing</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-yellow-50 rounded">
              <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm">O</span>
              <div>
                <h6 className="font-medium">OBSERVE your body</h6>
                <p className="text-sm text-gray-600">Notice physical sensations without judging them</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-green-50 rounded">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">P</span>
              <div>
                <h6 className="font-medium">PROCEED with intention</h6>
                <p className="text-sm text-gray-600">Choose your next action from a calmer place</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h5 className="font-semibold text-lg mb-4 text-blue-700">Intensive Grounding Sequence</h5>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h6 className="font-medium">1. Physical Grounding (2 minutes)</h6>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                <li>• Press hands firmly on a solid surface</li>
                <li>• Feel your body weight in the chair/floor</li>
                <li>• Squeeze and release major muscle groups</li>
                <li>• Hold an ice cube or splash cold water on wrists</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h6 className="font-medium">2. Mental Grounding (3 minutes)</h6>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                <li>• Name 5 things you can see in detail</li>
                <li>• Count backwards from 100 by 7s (100, 93, 86...)</li>
                <li>• Recite something you know by heart (poem, song, prayer)</li>
                <li>• Describe your surroundings out loud in detail</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h6 className="font-medium">3. Emotional Grounding (2 minutes)</h6>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                <li>• Say "This feeling is temporary" 3 times</li>
                <li>• Think of someone who makes you feel safe</li>
                <li>• Remind yourself: "I am safe in this moment"</li>
                <li>• Focus on one thing you're grateful for</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h5 className="font-semibold text-lg mb-4 text-purple-700">Container Breathing for Overwhelm</h5>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="space-y-3">
              <p className="text-sm text-gray-700"><strong>Step 1:</strong> Imagine your distress as a color or shape</p>
              <p className="text-sm text-gray-700"><strong>Step 2:</strong> Breathe it into an imaginary container (box, balloon, bubble)</p>
              <p className="text-sm text-gray-700"><strong>Step 3:</strong> Seal the container with each exhale</p>
              <p className="text-sm text-gray-700"><strong>Step 4:</strong> Place container outside your body (mentally)</p>
              <p className="text-sm text-gray-700"><strong>Step 5:</strong> Know you can open it later when you're ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h6 className="font-medium text-red-900 mb-2">Emergency Technique Assessment:</h6>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Confidence in using these emergency techniques (1-10):</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Not confident</span>
              <input
                type="range"
                min="1"
                max="10"
                value={practiceData.techniqueProgress['emergency-grounding']?.confidence || 5}
                onChange={(e) => setPracticeData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'emergency-grounding': {
                      ...prev.techniqueProgress['emergency-grounding'],
                      confidence: parseInt(e.target.value),
                      practiced: true
                    }
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Very confident</span>
              <span className="w-8 text-center font-medium bg-red-100 rounded px-2 py-1">
                {practiceData.techniqueProgress['emergency-grounding']?.confidence || 5}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Which emergency technique feels most accessible to you?</label>
            <Textarea
              value={practiceData.techniqueProgress['emergency-grounding']?.experience || ''}
              onChange={(e) => setPracticeData(prev => ({
                ...prev,
                techniqueProgress: {
                  ...prev.techniqueProgress,
                  'emergency-grounding': {
                    ...prev.techniqueProgress['emergency-grounding'],
                    experience: e.target.value,
                    practiced: true
                  }
                }
              }))}
              placeholder="Which would you remember in a crisis? What feels most natural? What concerns do you have?"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationPlanStep = () => (
    <div className="space-y-6">
      <div className="bg-teal-50 p-6 rounded-lg">
        <h4 className="font-semibold text-teal-900 mb-3">Personal Grounding Integration Plan</h4>
        <p className="text-sm text-teal-800">
          Create your personalized toolkit based on what you've learned. This plan will help you 
          integrate somatic grounding into your daily life and have tools ready for any situation.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Choose your daily grounding practices:</h5>
          <div className="space-y-3">
            {[
              'Morning body scan (5-10 minutes)',
              'Midday quick reset check-in (1-2 minutes)',
              '5-4-3-2-1 grounding when stressed',
              'Evening progressive relaxation',
              'Tactical breathing during challenging moments',
              'Cold water reset when overwhelmed',
              'Feet-on-floor grounding during work',
              'Wall push reset between tasks'
            ].map((practice) => (
              <label key={practice} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={practiceData.personalPlan.dailyTechniques.includes(practice)}
                  onChange={(e) => {
                    const current = practiceData.personalPlan.dailyTechniques;
                    setPracticeData(prev => ({
                      ...prev,
                      personalPlan: {
                        ...prev.personalPlan,
                        dailyTechniques: e.target.checked 
                          ? [...current, practice]
                          : current.filter(p => p !== practice)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{practice}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Emergency grounding toolkit (for crisis moments):</h5>
          <div className="space-y-3">
            {[
              'STOP technique for panic',
              'Intensive 7-minute grounding sequence',
              'Container breathing for overwhelm',
              'Cold water face/wrist reset',
              'Call trusted person while grounding',
              'Remove myself from triggering situation',
              'Use emergency grounding app or recording',
              'Practice basic safety reminders'
            ].map((technique) => (
              <label key={technique} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={practiceData.personalPlan.emergencyTechniques.includes(technique)}
                  onChange={(e) => {
                    const current = practiceData.personalPlan.emergencyTechniques;
                    setPracticeData(prev => ({
                      ...prev,
                      personalPlan: {
                        ...prev.personalPlan,
                        emergencyTechniques: e.target.checked 
                          ? [...current, technique]
                          : current.filter(t => t !== technique)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{technique}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your weekly practice schedule:</label>
          <Textarea
            value={practiceData.personalPlan.practiceSchedule}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPlan: { ...prev.personalPlan, practiceSchedule: e.target.value }
            }))}
            placeholder="e.g., Monday/Wednesday/Friday: 10-minute body scan before work. Daily: 5-4-3-2-1 grounding when I feel stress building..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How will you track your progress?</label>
          <Textarea
            value={practiceData.personalPlan.trackingMethod}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPlan: { ...prev.personalPlan, trackingMethod: e.target.value }
            }))}
            placeholder="e.g., Phone notes after each practice, weekly check-ins with myself, rating stress levels before/after techniques..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your 30-day grounding goals:</label>
          <Textarea
            value={practiceData.personalPlan.progressGoals}
            onChange={(e) => setPracticeData(prev => ({
              ...prev,
              personalPlan: { ...prev.personalPlan, progressGoals: e.target.value }
            }))}
            placeholder="e.g., Use quick reset techniques daily at work, feel more calm during family stress, sleep better using body scan..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <h5 className="font-semibold text-teal-900 mb-2">Grounding Success Reminders</h5>
        <ul className="text-sm text-teal-800 space-y-1">
          <li>• Start small - even 30 seconds of grounding makes a difference</li>
          <li>• Practice when calm so techniques are available when stressed</li>
          <li>• Your nervous system learns through repetition and kindness</li>
          <li>• Different techniques work for different situations - experiment</li>
          <li>• Progress isn't linear - celebrate small improvements</li>
          <li>• Trust your body's wisdom and healing capacity</li>
        </ul>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-teal-600" />
          Somatic Grounding Practices
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Master 5 powerful body-based techniques for nervous system regulation</p>
          </div>

          {currentStep === 0 && renderAssessmentStep()}
          {currentStep === 1 && renderGroundingStep()}
          {currentStep === 2 && renderBodyScanStep()}
          {currentStep === 3 && renderQuickResetStep()}
          {currentStep === 4 && renderEmergencyStep()}
          {currentStep === 5 && renderIntegrationPlanStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w4-grounding', practiceData)}
                className="ml-auto"
              >
                Complete Grounding Practices
              </Button>
            )}
          </div>
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
// Breathwork & Vagus Nerve Reset Component
function BreathworkVagusReset({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [currentBreathPhase, setCurrentBreathPhase] = useState('inhale');
  const [breathingData, setBreathingData] = useState({
    vagusNerveAssessment: {
      currentStress: 5,
      breathingQuality: 5,
      vagusSymptoms: [] as string[],
      heartRateVariability: 5,
      recoveryGoals: ''
    },
    techniqueProgress: {} as Record<string, {
      practiced: boolean;
      effectiveness: number;
      duration: number;
      experience: string;
      physiologicalResponse: string;
      confidence: number;
    }>,
    personalProtocol: {
      dailyBreathwork: [] as string[],
      stressInterventions: [] as string[],
      vagusActivation: [] as string[],
      practiceSchedule: '',
      emergencyProtocol: '',
      progressTracking: ''
    }
  });

  const steps = [
    'Vagus Nerve Assessment',
    'Box Breathing Mastery',
    'Heart Rate Variability',
    'Cold Exposure Breathing',
    'Humming & Toning Techniques',
    'Personal Breathwork Protocol'
  ];

  const vagusSymptoms = [
    'Difficulty recovering from stress', 'Poor digestion', 'Irregular heart rate', 
    'Shallow breathing', 'Tension in neck/shoulders', 'Difficulty sleeping',
    'Emotional volatility', 'Brain fog', 'Chronic fatigue', 'Anxiety',
    'Inflammation issues', 'Poor stress resilience'
  ];

  const breathingTechniques = [
    {
      id: 'box-breathing',
      name: 'Box Breathing (4-4-4-4)',
      description: 'Military-grade technique for instant calm and focus',
      pattern: 'Inhale 4 → Hold 4 → Exhale 4 → Hold 4',
      benefits: 'Activates parasympathetic nervous system, reduces cortisol',
      duration: '5-10 minutes'
    },
    {
      id: 'coherent-breathing',
      name: 'Heart Coherence Breathing',
      description: 'Optimize heart rate variability for emotional regulation',
      pattern: 'Inhale 5 → Exhale 5 (with heart focus)',
      benefits: 'Balances autonomic nervous system, improves HRV',
      duration: '10-15 minutes'
    },
    {
      id: 'cold-exposure',
      name: 'Cold Exposure Breathing',
      description: 'Wim Hof inspired technique for stress resilience',
      pattern: '30 power breaths → Hold → Cold exposure',
      benefits: 'Builds stress tolerance, activates brown fat',
      duration: '15-20 minutes'
    },
    {
      id: 'humming-toning',
      name: 'Humming & Vagal Toning',
      description: 'Vibrational therapy for vagus nerve stimulation',
      pattern: 'Inhale → Long humming exhale (Om, Ahh, Mmm)',
      benefits: 'Direct vagus nerve stimulation, reduces inflammation',
      duration: '5-10 minutes'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTime = prev + 1;
          const cycle = Math.floor(newTime / 16); // 16 seconds per cycle
          const phase = newTime % 16;
          
          if (phase <= 4) setCurrentBreathPhase('inhale');
          else if (phase <= 8) setCurrentBreathPhase('hold');
          else if (phase <= 12) setCurrentBreathPhase('exhale');
          else setCurrentBreathPhase('hold');
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Understanding Your Vagus Nerve</h4>
        <p className="text-sm text-blue-800">
          Your vagus nerve is the longest cranial nerve, connecting your brain to major organs. 
          It's your body's "reset button" - when activated, it triggers the rest-and-digest response, 
          reducing stress hormones and promoting healing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Current stress level (1-10)</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Calm</span>
              <input
                type="range"
                min="1"
                max="10"
                value={breathingData.vagusNerveAssessment.currentStress}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  vagusNerveAssessment: { 
                    ...prev.vagusNerveAssessment, 
                    currentStress: parseInt(e.target.value) 
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Stressed</span>
              <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">
                {breathingData.vagusNerveAssessment.currentStress}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Breathing quality (1-10)</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Shallow</span>
              <input
                type="range"
                min="1"
                max="10"
                value={breathingData.vagusNerveAssessment.breathingQuality}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  vagusNerveAssessment: { 
                    ...prev.vagusNerveAssessment, 
                    breathingQuality: parseInt(e.target.value) 
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Deep</span>
              <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">
                {breathingData.vagusNerveAssessment.breathingQuality}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Stress recovery ability (1-10)</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Poor</span>
              <input
                type="range"
                min="1"
                max="10"
                value={breathingData.vagusNerveAssessment.heartRateVariability}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  vagusNerveAssessment: { 
                    ...prev.vagusNerveAssessment, 
                    heartRateVariability: parseInt(e.target.value) 
                  }
                }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Excellent</span>
              <span className="w-8 text-center font-medium bg-blue-100 rounded px-2 py-1">
                {breathingData.vagusNerveAssessment.heartRateVariability}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Vagus nerve dysfunction signs:</h5>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {vagusSymptoms.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={breathingData.vagusNerveAssessment.vagusSymptoms.includes(symptom)}
                  onChange={(e) => {
                    const current = breathingData.vagusNerveAssessment.vagusSymptoms;
                    setBreathingData(prev => ({
                      ...prev,
                      vagusNerveAssessment: {
                        ...prev.vagusNerveAssessment,
                        vagusSymptoms: e.target.checked 
                          ? [...current, symptom]
                          : current.filter(s => s !== symptom)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{symptom}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your breathwork and stress recovery goals:</label>
        <Textarea
          value={breathingData.vagusNerveAssessment.recoveryGoals}
          onChange={(e) => setBreathingData(prev => ({
            ...prev,
            vagusNerveAssessment: { 
              ...prev.vagusNerveAssessment, 
              recoveryGoals: e.target.value 
            }
          }))}
          placeholder="e.g., Recover faster from stressful meetings, improve sleep quality, reduce anxiety during family conflicts, build resilience for daily challenges..."
          rows={3}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Your Vagus Nerve Health Score</h5>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-blue-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${(
                  (breathingData.vagusNerveAssessment.breathingQuality + 
                   breathingData.vagusNerveAssessment.heartRateVariability + 
                   (10 - breathingData.vagusNerveAssessment.currentStress) + 
                   (12 - breathingData.vagusNerveAssessment.vagusSymptoms.length)) / 35
                ) * 100}%` 
              }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round((
              (breathingData.vagusNerveAssessment.breathingQuality + 
               breathingData.vagusNerveAssessment.heartRateVariability + 
               (10 - breathingData.vagusNerveAssessment.currentStress) + 
               (12 - breathingData.vagusNerveAssessment.vagusSymptoms.length)) / 35
            ) * 100)}%
          </span>
        </div>
        <p className="text-sm text-blue-800 mt-2">
          {Math.round((
            (breathingData.vagusNerveAssessment.breathingQuality + 
             breathingData.vagusNerveAssessment.heartRateVariability + 
             (10 - breathingData.vagusNerveAssessment.currentStress) + 
             (12 - breathingData.vagusNerveAssessment.vagusSymptoms.length)) / 35
          ) * 100) >= 70 ? "Excellent vagus nerve health!" : 
          Math.round((
            (breathingData.vagusNerveAssessment.breathingQuality + 
             breathingData.vagusNerveAssessment.heartRateVariability + 
             (10 - breathingData.vagusNerveAssessment.currentStress) + 
             (12 - breathingData.vagusNerveAssessment.vagusSymptoms.length)) / 35
          ) * 100) >= 50 ? "Good foundation - room for improvement" : "Significant opportunity for vagus nerve strengthening"}
        </p>
      </div>
    </div>
  );

  const renderBoxBreathingStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Box Breathing Mastery</h4>
        <p className="text-sm text-green-800">
          Box breathing (4-4-4-4) is used by Navy SEALs, elite athletes, and emergency responders. 
          It instantly activates your parasympathetic nervous system, reducing cortisol and promoting clarity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border-2 border-green-200 rounded-lg p-6">
            <h5 className="font-semibold text-lg mb-4">Interactive Box Breathing Guide</h5>
            
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-green-300 rounded-lg"></div>
              <div 
                className={`absolute w-4 h-4 bg-green-600 rounded-full transition-all duration-1000 ${
                  currentBreathPhase === 'inhale' ? 'top-0 left-0' :
                  currentBreathPhase === 'hold' && Math.floor(breathingTimer / 4) % 4 === 1 ? 'top-0 right-0' :
                  currentBreathPhase === 'exhale' ? 'bottom-0 right-0' : 'bottom-0 left-0'
                }`}
              ></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 capitalize">{currentBreathPhase}</div>
                  <div className="text-sm text-green-600">
                    {currentBreathPhase === 'inhale' ? 'Breathe in slowly' :
                     currentBreathPhase === 'exhale' ? 'Breathe out slowly' : 'Hold your breath'}
                  </div>
                  <div className="text-lg font-mono text-green-800 mt-2">
                    {Math.floor(breathingTimer / 60)}:{(breathingTimer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={() => {
                  setIsBreathingActive(!isBreathingActive);
                  if (!isBreathingActive) {
                    setBreathingTimer(0);
                    setCurrentBreathPhase('inhale');
                  }
                }}
                variant={isBreathingActive ? "destructive" : "default"}
                className="w-full"
              >
                {isBreathingActive ? 'Stop Practice' : 'Start Box Breathing'}
              </Button>
              
              {breathingTimer > 0 && (
                <div className="text-sm text-green-700">
                  Completed cycles: {Math.floor(breathingTimer / 16)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h6 className="font-medium text-green-900 mb-2">Step-by-Step Instructions:</h6>
            <ol className="text-sm text-green-800 space-y-2">
              <li><strong>1. Inhale (4 counts):</strong> Breathe in slowly through your nose, expanding your belly</li>
              <li><strong>2. Hold (4 counts):</strong> Keep the air in your lungs, stay relaxed</li>
              <li><strong>3. Exhale (4 counts):</strong> Slowly release through your mouth, like blowing out a candle</li>
              <li><strong>4. Hold (4 counts):</strong> Empty lungs, pause before the next inhale</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h6 className="font-medium text-yellow-900 mb-2">Pro Tips:</h6>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Start with 5-10 cycles, build up to 20</li>
              <li>• If dizzy, slow down or take a break</li>
              <li>• Focus on smooth, even breathing</li>
              <li>• Practice daily for maximum benefit</li>
              <li>• Use during stressful moments for instant calm</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Box breathing effectiveness (1-10):</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Not helpful</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={breathingData.techniqueProgress['box-breathing']?.effectiveness || 5}
                  onChange={(e) => setBreathingData(prev => ({
                    ...prev,
                    techniqueProgress: {
                      ...prev.techniqueProgress,
                      'box-breathing': {
                        ...prev.techniqueProgress['box-breathing'],
                        effectiveness: parseInt(e.target.value),
                        practiced: true
                      }
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Very helpful</span>
                <span className="w-8 text-center font-medium bg-green-100 rounded px-2 py-1">
                  {breathingData.techniqueProgress['box-breathing']?.effectiveness || 5}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">How long did you practice?</label>
              <input
                type="number"
                min="1"
                max="60"
                value={breathingData.techniqueProgress['box-breathing']?.duration || 5}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'box-breathing': {
                      ...prev.techniqueProgress['box-breathing'],
                      duration: parseInt(e.target.value),
                      practiced: true
                    }
                  }
                }))}
                className="w-full p-2 border rounded"
                placeholder="Minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Describe your experience:</label>
              <Textarea
                value={breathingData.techniqueProgress['box-breathing']?.experience || ''}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'box-breathing': {
                      ...prev.techniqueProgress['box-breathing'],
                      experience: e.target.value,
                      practiced: true
                    }
                  }
                }))}
                placeholder="How did you feel before vs after? What was challenging? What felt natural?"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeartCoherenceStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Heart Rate Variability & Coherence</h4>
        <p className="text-sm text-purple-800">
          Heart Rate Variability (HRV) measures your autonomic nervous system's flexibility. 
          Higher HRV indicates better stress resilience and emotional regulation. This breathing 
          technique optimizes your heart-brain connection.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
            <h5 className="font-semibold text-lg mb-4">Heart-Focused Breathing</h5>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-6xl mb-2">💜</div>
                <div className="text-sm text-purple-700">Place one hand on your heart</div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <h6 className="font-medium">Step 1: Heart Focus</h6>
                  <p className="text-sm text-gray-600">Direct your attention to your heart area. Feel the physical sensation of your heartbeat.</p>
                </div>

                <div className="p-3 bg-purple-100 rounded-lg">
                  <h6 className="font-medium">Step 2: Slow Breathing</h6>
                  <p className="text-sm text-gray-600">Breathe slowly and deeply: 5 seconds in, 5 seconds out (6 breaths per minute).</p>
                </div>

                <div className="p-3 bg-purple-100 rounded-lg">
                  <h6 className="font-medium">Step 3: Positive Emotion</h6>
                  <p className="text-sm text-gray-600">Activate appreciation, compassion, or care while breathing. Feel it in your heart.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h6 className="font-medium text-purple-900 mb-2">Why This Works:</h6>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Your heart has 40,000 neurons - it's a "little brain"</li>
              <li>• Heart rhythm affects brain function and emotions</li>
              <li>• Coherent heart rhythm = coherent mind</li>
              <li>• Positive emotions increase heart coherence</li>
              <li>• Regular practice builds emotional resilience</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h6 className="font-medium mb-3">Practice Session:</h6>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Target: 6 breaths/minute</span>
                <span>Duration: 10-15 minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Inhale: 5 seconds</span>
                <span>Exhale: 5 seconds</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {isBreathingActive ? (currentBreathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out') : 'Ready to Begin'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Heart coherence effectiveness (1-10):</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Not helpful</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={breathingData.techniqueProgress['coherent-breathing']?.effectiveness || 5}
                  onChange={(e) => setBreathingData(prev => ({
                    ...prev,
                    techniqueProgress: {
                      ...prev.techniqueProgress,
                      'coherent-breathing': {
                        ...prev.techniqueProgress['coherent-breathing'],
                        effectiveness: parseInt(e.target.value),
                        practiced: true
                      }
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Very helpful</span>
                <span className="w-8 text-center font-medium bg-purple-100 rounded px-2 py-1">
                  {breathingData.techniqueProgress['coherent-breathing']?.effectiveness || 5}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Physical sensations noticed:</label>
              <Textarea
                value={breathingData.techniqueProgress['coherent-breathing']?.physiologicalResponse || ''}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'coherent-breathing': {
                      ...prev.techniqueProgress['coherent-breathing'],
                      physiologicalResponse: e.target.value,
                      practiced: true
                    }
                  }
                }))}
                placeholder="e.g., Heart rate slowed, felt calmer, chest felt warm, breathing became easier..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColdExposureStep = () => (
    <div className="space-y-6">
      <div className="bg-cyan-50 p-6 rounded-lg">
        <h4 className="font-semibold text-cyan-900 mb-3">Cold Exposure Breathing</h4>
        <p className="text-sm text-cyan-800">
          Inspired by Wim Hof's method, this technique builds stress resilience by training your 
          nervous system to stay calm under physical stress. It strengthens your vagus nerve and 
          improves your ability to handle life's challenges.
        </p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
        <h5 className="font-medium text-red-900 mb-2">⚠️ Important Safety Guidelines</h5>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Never practice in water or while driving</li>
          <li>• Stop if you feel dizzy or uncomfortable</li>
          <li>• Start with warm water, gradually decrease temperature</li>
          <li>• Pregnant women should consult healthcare provider</li>
          <li>• Those with heart conditions should seek medical approval</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border-2 border-cyan-200 rounded-lg p-6">
            <h5 className="font-semibold text-lg mb-4">Power Breathing Protocol</h5>
            
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50 rounded-lg">
                <h6 className="font-medium text-cyan-900 mb-2">Phase 1: Power Breaths (30 rounds)</h6>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>1. Deep inhale through nose (fill belly, then chest)</li>
                  <li>2. Quick exhale through mouth (don't force it)</li>
                  <li>3. Repeat 30 times rhythmically</li>
                  <li>4. You may feel tingling - this is normal</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h6 className="font-medium text-blue-900 mb-2">Phase 2: Retention Hold</h6>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. After 30th exhale, take deep breath</li>
                  <li>2. Exhale completely and hold (empty lungs)</li>
                  <li>3. Hold until you feel urge to breathe</li>
                  <li>4. Take recovery breath and hold 10-15 seconds</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h6 className="font-medium text-green-900 mb-2">Phase 3: Cold Exposure</h6>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>1. After breathing, apply cold (shower/ice)</li>
                  <li>2. Start with 30 seconds, build up gradually</li>
                  <li>3. Breathe calmly and steadily during cold</li>
                  <li>4. Focus on staying relaxed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-cyan-50 p-4 rounded-lg">
            <h6 className="font-medium text-cyan-900 mb-2">Progression Schedule:</h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Week 1:</span>
                <span>Warm-cool water, 30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Week 2:</span>
                <span>Cool water, 1 minute</span>
              </div>
              <div className="flex justify-between">
                <span>Week 3:</span>
                <span>Cold water, 1-2 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Week 4+:</span>
                <span>Very cold, 2+ minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h6 className="font-medium text-yellow-900 mb-2">Benefits You'll Experience:</h6>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Increased stress resilience</li>
              <li>• Better immune function</li>
              <li>• Enhanced focus and energy</li>
              <li>• Improved mood regulation</li>
              <li>• Greater confidence in handling challenges</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Cold exposure confidence (1-10):</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Anxious</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={breathingData.techniqueProgress['cold-exposure']?.confidence || 5}
                  onChange={(e) => setBreathingData(prev => ({
                    ...prev,
                    techniqueProgress: {
                      ...prev.techniqueProgress,
                      'cold-exposure': {
                        ...prev.techniqueProgress['cold-exposure'],
                        confidence: parseInt(e.target.value),
                        practiced: true
                      }
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Confident</span>
                <span className="w-8 text-center font-medium bg-cyan-100 rounded px-2 py-1">
                  {breathingData.techniqueProgress['cold-exposure']?.confidence || 5}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your cold exposure experience:</label>
              <Textarea
                value={breathingData.techniqueProgress['cold-exposure']?.experience || ''}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'cold-exposure': {
                      ...prev.techniqueProgress['cold-exposure'],
                      experience: e.target.value,
                      practiced: true
                    }
                  }
                }))}
                placeholder="How did the breathing feel? What happened during cold exposure? What did you notice about your stress response?"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHummingStep = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 p-6 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-3">Humming & Vagal Toning</h4>
        <p className="text-sm text-amber-800">
          Humming creates vibrations that directly stimulate your vagus nerve. This ancient practice 
          (found in yoga, meditation, and sound healing) is one of the most effective ways to activate 
          your parasympathetic nervous system and reduce inflammation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
            <h5 className="font-semibold text-lg mb-4">Vagal Toning Techniques</h5>
            
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg">
                <h6 className="font-medium text-amber-900 mb-2">Om Humming</h6>
                <p className="text-sm text-amber-800 mb-2">The classic "Om" sound creates maximum vagal stimulation.</p>
                <div className="text-sm text-gray-600">
                  <strong>Practice:</strong> Inhale deeply → Long "Oooommmmm" exhale → Repeat 10-20 times
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h6 className="font-medium text-orange-900 mb-2">Bee Breath (Bhramari)</h6>
                <p className="text-sm text-orange-800 mb-2">Sounds like a bee buzzing. Excellent for anxiety.</p>
                <div className="text-sm text-gray-600">
                  <strong>Practice:</strong> Block ears with thumbs → Inhale → Hum like a bee on exhale
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h6 className="font-medium text-yellow-900 mb-2">Ahh Toning</h6>
                <p className="text-sm text-yellow-800 mb-2">Heart-opening sound that releases tension.</p>
                <div className="text-sm text-gray-600">
                  <strong>Practice:</strong> Inhale → Long "Ahhhhh" with open mouth → Feel chest vibration
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h6 className="font-medium text-red-900 mb-2">Mmm Humming</h6>
                <p className="text-sm text-red-800 mb-2">Simple mouth-closed humming. Great for beginners.</p>
                <div className="text-sm text-gray-600">
                  <strong>Practice:</strong> Lips closed → Inhale → Hum "Mmmmm" → Feel head vibration
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg">
            <h6 className="font-medium text-amber-900 mb-2">The Science Behind Humming:</h6>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Vibrations stimulate vagus nerve directly</li>
              <li>• Increases nitric oxide production</li>
              <li>• Reduces stress hormones and inflammation</li>
              <li>• Activates parasympathetic nervous system</li>
              <li>• Improves heart rate variability</li>
              <li>• Enhances mood and reduces anxiety</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h6 className="font-medium text-green-900 mb-2">Practice Guidelines:</h6>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Start with 5-10 minutes daily</li>
              <li>• Practice in private space initially</li>
              <li>• Focus on the vibrations, not the sound</li>
              <li>• Longer exhales = more vagal stimulation</li>
              <li>• Can be done silently in public</li>
              <li>• Combine with breathing for maximum effect</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h6 className="font-medium text-blue-900 mb-2">When to Use Humming:</h6>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Before stressful meetings or events</li>
              <li>• When feeling anxious or overwhelmed</li>
              <li>• After difficult conversations</li>
              <li>• As part of morning or evening routine</li>
              <li>• During meditation or mindfulness practice</li>
              <li>• When you need to calm down quickly</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Humming technique effectiveness (1-10):</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Not helpful</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={breathingData.techniqueProgress['humming-toning']?.effectiveness || 5}
                  onChange={(e) => setBreathingData(prev => ({
                    ...prev,
                    techniqueProgress: {
                      ...prev.techniqueProgress,
                      'humming-toning': {
                        ...prev.techniqueProgress['humming-toning'],
                        effectiveness: parseInt(e.target.value),
                        practiced: true
                      }
                    }
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Very helpful</span>
                <span className="w-8 text-center font-medium bg-amber-100 rounded px-2 py-1">
                  {breathingData.techniqueProgress['humming-toning']?.effectiveness || 5}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Which humming technique felt most natural?</label>
              <Textarea
                value={breathingData.techniqueProgress['humming-toning']?.experience || ''}
                onChange={(e) => setBreathingData(prev => ({
                  ...prev,
                  techniqueProgress: {
                    ...prev.techniqueProgress,
                    'humming-toning': {
                      ...prev.techniqueProgress['humming-toning'],
                      experience: e.target.value,
                      practiced: true
                    }
                  }
                }))}
                placeholder="Which sound felt best? What vibrations did you feel? How did your stress level change?"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProtocolStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Personal Breathwork Protocol</h4>
        <p className="text-sm text-indigo-800">
          Create your personalized breathwork system based on your goals, schedule, and preferences. 
          This protocol will be your go-to toolkit for stress management, energy regulation, and 
          nervous system optimization.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Your Daily Breathwork Foundation:</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Box breathing (5-10 minutes morning)',
              'Heart coherence breathing (10-15 minutes)',
              'Quick box breathing during stress',
              'Humming practice (5-10 minutes)',
              'Cold exposure breathing (2-3x weekly)',
              'Bedtime breathing for sleep',
              'Breathing breaks every 2 hours',
              'Mini-breathing resets between tasks'
            ].map((practice) => (
              <label key={practice} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={breathingData.personalProtocol.dailyBreathwork.includes(practice)}
                  onChange={(e) => {
                    const current = breathingData.personalProtocol.dailyBreathwork;
                    setBreathingData(prev => ({
                      ...prev,
                      personalProtocol: {
                        ...prev.personalProtocol,
                        dailyBreathwork: e.target.checked 
                          ? [...current, practice]
                          : current.filter(p => p !== practice)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{practice}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Stress Intervention Techniques:</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Box breathing for immediate calm',
              'Heart coherence for emotional regulation',
              'Humming for quick nervous system reset',
              'Cold water on wrists for activation',
              'Power breathing for energy boost',
              'Long exhales for anxiety relief',
              'Breath holding for panic attacks',
              'Vagal toning for overwhelm'
            ].map((technique) => (
              <label key={technique} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={breathingData.personalProtocol.stressInterventions.includes(technique)}
                  onChange={(e) => {
                    const current = breathingData.personalProtocol.stressInterventions;
                    setBreathingData(prev => ({
                      ...prev,
                      personalProtocol: {
                        ...prev.personalProtocol,
                        stressInterventions: e.target.checked 
                          ? [...current, technique]
                          : current.filter(t => t !== technique)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{technique}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Vagus Nerve Activation Plan:</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Daily humming practice',
              'Cold shower endings',
              'Gargling with salt water',
              'Singing or chanting',
              'Diaphragmatic breathing',
              'Yoga with breath awareness',
              'Meditation with Om chanting',
              'Laughter and social connection'
            ].map((activity) => (
              <label key={activity} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={breathingData.personalProtocol.vagusActivation.includes(activity)}
                  onChange={(e) => {
                    const current = breathingData.personalProtocol.vagusActivation;
                    setBreathingData(prev => ({
                      ...prev,
                      personalProtocol: {
                        ...prev.personalProtocol,
                        vagusActivation: e.target.checked 
                          ? [...current, activity]
                          : current.filter(a => a !== activity)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your weekly breathwork schedule:</label>
          <Textarea
            value={breathingData.personalProtocol.practiceSchedule}
            onChange={(e) => setBreathingData(prev => ({
              ...prev,
              personalProtocol: { ...prev.personalProtocol, practiceSchedule: e.target.value }
            }))}
            placeholder="e.g., Morning: 10 min box breathing. Lunch: 5 min heart coherence. Evening: 5 min humming. Weekend: Cold exposure breathing..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Emergency stress protocol:</label>
          <Textarea
            value={breathingData.personalProtocol.emergencyProtocol}
            onChange={(e) => setBreathingData(prev => ({
              ...prev,
              personalProtocol: { ...prev.personalProtocol, emergencyProtocol: e.target.value }
            }))}
            placeholder="e.g., Step 1: 5 rounds box breathing. Step 2: Heart coherence with gratitude. Step 3: Humming if still stressed. Step 4: Cold water on wrists..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How will you track your breathwork progress?</label>
          <Textarea
            value={breathingData.personalProtocol.progressTracking}
            onChange={(e) => setBreathingData(prev => ({
              ...prev,
              personalProtocol: { ...prev.personalProtocol, progressTracking: e.target.value }
            }))}
            placeholder="e.g., Rate stress before/after practice, track HRV with app, weekly reflection on emotional regulation, notice sleep quality changes..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <h5 className="font-semibold text-indigo-900 mb-2">Your Breathwork Success Plan</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h6 className="font-medium text-indigo-800 mb-1">Week 1-2: Foundation</h6>
            <ul className="text-indigo-700 space-y-1">
              <li>• Master box breathing technique</li>
              <li>• Practice 5-10 minutes daily</li>
              <li>• Use during minor stress</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-indigo-800 mb-1">Week 3-4: Expansion</h6>
            <ul className="text-indigo-700 space-y-1">
              <li>• Add heart coherence practice</li>
              <li>• Begin humming techniques</li>
              <li>• Extend practice time</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-indigo-800 mb-1">Week 5-6: Integration</h6>
            <ul className="text-indigo-700 space-y-1">
              <li>• Try cold exposure breathing</li>
              <li>• Use techniques preventively</li>
              <li>• Develop personal protocols</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-indigo-800 mb-1">Week 7+: Mastery</h6>
            <ul className="text-indigo-700 space-y-1">
              <li>• Automatic stress responses</li>
              <li>• Teach others techniques</li>
              <li>• Continue refining practice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-blue-600" />
          Breathwork & Vagus Nerve Reset
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Master powerful breathing techniques for instant calm and nervous system optimization</p>
          </div>

          {currentStep === 0 && renderAssessmentStep()}
          {currentStep === 1 && renderBoxBreathingStep()}
          {currentStep === 2 && renderHeartCoherenceStep()}
          {currentStep === 3 && renderColdExposureStep()}
          {currentStep === 4 && renderHummingStep()}
          {currentStep === 5 && renderProtocolStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w4-breathwork', breathingData)}
                className="ml-auto"
              >
                Complete Breathwork Training
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create Your Calm Corner Component
function CreateCalmCorner({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [calmCornerData, setCalmCornerData] = useState({
    spaceAssessment: {
      availableSpace: '',
      timeAvailable: '',
      privacyLevel: 5,
      currentChallenges: '',
      sanctuaryGoals: ''
    },
    sensoryDesign: {
      colors: [] as string[],
      lighting: [] as string[],
      textures: [] as string[],
      sounds: [] as string[],
      scents: [] as string[]
    },
    essentialItems: {
      comfort: [] as string[],
      mindfulness: [] as string[],
      grounding: [] as string[],
      inspiration: [] as string[]
    },
    ritualPractices: {
      entryRitual: '',
      breathingPractice: '',
      mindfulnessActivity: '',
      gratitudePractice: '',
      exitRitual: ''
    },
    maintenancePlan: {
      dailyTending: '',
      weeklyRefresh: '',
      monthlyEvolution: '',
      seasonalChanges: '',
      boundaryMaintenance: ''
    }
  });

  const steps = [
    'Space Assessment & Planning',
    'Sensory Environment Design',
    'Essential Items & Tools',
    'Mindful Rituals & Practices',
    'Maintenance & Evolution Plan'
  ];

  const colorOptions = [
    { name: 'Soft Blues', effect: 'Calming, reduces anxiety', hex: '#E6F3FF' },
    { name: 'Sage Greens', effect: 'Grounding, promotes balance', hex: '#E8F5E8' },
    { name: 'Warm Beiges', effect: 'Comforting, creates security', hex: '#F5F1E8' },
    { name: 'Lavender', effect: 'Soothing, aids relaxation', hex: '#F0E6FF' },
    { name: 'Soft Pinks', effect: 'Nurturing, self-compassion', hex: '#FFE6F0' },
    { name: 'Cream & Ivory', effect: 'Pure, creates clarity', hex: '#FFFEF7' },
    { name: 'Dusty Rose', effect: 'Gentle warmth, emotional healing', hex: '#F5E6E8' },
    { name: 'Pale Yellow', effect: 'Uplifting, promotes joy', hex: '#FFFACD' }
  ];

  const lightingOptions = [
    'Soft table lamps', 'String lights', 'Candles or LED candles', 'Salt lamps',
    'Natural sunlight', 'Dimmer switches', 'Colored bulbs', 'Lanterns',
    'Fairy lights', 'Floor lamps', 'Natural light filtering', 'Sunrise lamps'
  ];

  const textureOptions = [
    'Soft throw blankets', 'Velvet cushions', 'Fuzzy rugs', 'Smooth stones',
    'Wooden elements', 'Silk fabrics', 'Cashmere throws', 'Bamboo items',
    'Cotton comfort items', 'Linen textures', 'Faux fur accents', 'Natural fibers'
  ];

  const soundOptions = [
    'Nature sounds', 'Soft instrumental music', 'Singing bowls', 'Wind chimes',
    'White noise machine', 'Meditation bells', 'Classical music', 'Ambient sounds',
    'Rain sounds', 'Ocean waves', 'Forest sounds', 'Complete silence'
  ];

  const scentOptions = [
    'Lavender essential oil', 'Eucalyptus', 'Vanilla candles', 'Sandalwood',
    'Chamomile', 'Rose', 'Bergamot', 'Fresh flowers',
    'Cedar', 'Lemon balm', 'Frankincense', 'Fresh air/no scent'
  ];

  const comfortItems = [
    'Meditation cushion', 'Soft throw blanket', 'Comfortable chair', 'Floor pillows',
    'Ottoman or footrest', 'Eye pillow', 'Weighted blanket', 'Ergonomic support',
    'Reading nook setup', 'Yoga mat', 'Bolster pillow', 'Bean bag chair'
  ];

  const mindfulnessItems = [
    'Journal and pen', 'Meditation timer', 'Inspirational books', 'Oracle cards',
    'Gratitude jar', 'Mindfulness bell', 'Meditation app/device', 'Affirmation cards',
    'Vision board', 'Prayer beads', 'Meditation stones', 'Breathing guide poster'
  ];

  const groundingItems = [
    'Crystals or stones', 'Plants or flowers', 'Water element (bowl/fountain)', 'Wood elements',
    'Sand tray', 'Smooth river rocks', 'Essential oil diffuser', 'Natural textures',
    'Grounding mat', 'Earth elements', 'Textured objects', 'Balance stones'
  ];

  const inspirationItems = [
    'Meaningful photos', 'Inspiring quotes', 'Art or mandalas', 'Vision board',
    'Spiritual symbols', 'Achievement reminders', 'Motivational books', 'Personal totems',
    'Goal visualization tools', 'Meaningful jewelry', 'Legacy items', 'Dream catchers'
  ];

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Creating Your Personal Sanctuary</h4>
        <p className="text-sm text-green-800">
          Your calm corner is more than a physical space - it's a sacred sanctuary that signals to your nervous system 
          that it's time to rest, restore, and reconnect. Even the smallest corner can become a powerful refuge when 
          designed with intention.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">What space do you have available for your calm corner?</label>
          <Textarea
            value={calmCornerData.spaceAssessment.availableSpace}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              spaceAssessment: { ...prev.spaceAssessment, availableSpace: e.target.value }
            }))}
            placeholder="e.g., Corner of bedroom, part of living room, home office nook, guest room, outdoor patio, even a dedicated chair..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How much time can you realistically spend in your calm corner daily?</label>
          <Textarea
            value={calmCornerData.spaceAssessment.timeAvailable}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              spaceAssessment: { ...prev.spaceAssessment, timeAvailable: e.target.value }
            }))}
            placeholder="e.g., 10 minutes in morning, 15 minutes after work, weekend meditation sessions, quick breathing breaks..."
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Privacy level needed (1 = Public/shared space, 10 = Completely private)</label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Shared</span>
            <input
              type="range"
              min="1"
              max="10"
              value={calmCornerData.spaceAssessment.privacyLevel}
              onChange={(e) => setCalmCornerData(prev => ({
                ...prev,
                spaceAssessment: { 
                  ...prev.spaceAssessment, 
                  privacyLevel: parseInt(e.target.value) 
                }
              }))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">Private</span>
            <span className="w-8 text-center font-medium bg-green-100 rounded px-2 py-1">
              {calmCornerData.spaceAssessment.privacyLevel}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {calmCornerData.spaceAssessment.privacyLevel <= 3 && "Shared space - focus on portable, subtle calming elements"}
            {calmCornerData.spaceAssessment.privacyLevel >= 4 && calmCornerData.spaceAssessment.privacyLevel <= 7 && "Semi-private - can add personal touches and small sanctuary items"}
            {calmCornerData.spaceAssessment.privacyLevel >= 8 && "Private space - can create full sensory sanctuary with all desired elements"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What are your main challenges in creating calm spaces?</label>
          <Textarea
            value={calmCornerData.spaceAssessment.currentChallenges}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              spaceAssessment: { ...prev.spaceAssessment, currentChallenges: e.target.value }
            }))}
            placeholder="e.g., Lack of space, family interruptions, clutter, noise, limited budget, time constraints, perfectionism..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What do you hope your calm corner will provide for you?</label>
          <Textarea
            value={calmCornerData.spaceAssessment.sanctuaryGoals}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              spaceAssessment: { ...prev.spaceAssessment, sanctuaryGoals: e.target.value }
            }))}
            placeholder="e.g., Daily stress relief, morning meditation space, creative inspiration, emotional processing, spiritual connection..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Calm Corner Success Principles</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start small - even a single chair can be transformed</li>
          <li>• Consistency matters more than perfection</li>
          <li>• Use items that speak to your senses and soul</li>
          <li>• Create clear boundaries (even invisible ones)</li>
          <li>• Make it easily accessible for daily use</li>
          <li>• Allow it to evolve with your needs</li>
        </ul>
      </div>
    </div>
  );

  const renderSensoryDesignStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Sensory Environment Design</h4>
        <p className="text-sm text-purple-800">
          Your nervous system responds to sensory input before conscious thought. By designing a multi-sensory 
          environment that promotes calm, you create an automatic trigger for relaxation and safety.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Color Psychology - Choose colors that promote your desired state:</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <label key={color.name} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={calmCornerData.sensoryDesign.colors.includes(color.name)}
                  onChange={(e) => {
                    const current = calmCornerData.sensoryDesign.colors;
                    setCalmCornerData(prev => ({
                      ...prev,
                      sensoryDesign: {
                        ...prev.sensoryDesign,
                        colors: e.target.checked 
                          ? [...current, color.name]
                          : current.filter(c => c !== color.name)
                      }
                    }));
                  }}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  calmCornerData.sensoryDesign.colors.includes(color.name) 
                    ? 'border-purple-500 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-purple-300'
                }`} style={{ backgroundColor: color.hex }}>
                  <div className="font-medium text-sm">{color.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{color.effect}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Lighting - Select lighting that supports relaxation:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lightingOptions.map((light) => (
              <label key={light} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.sensoryDesign.lighting.includes(light)}
                  onChange={(e) => {
                    const current = calmCornerData.sensoryDesign.lighting;
                    setCalmCornerData(prev => ({
                      ...prev,
                      sensoryDesign: {
                        ...prev.sensoryDesign,
                        lighting: e.target.checked 
                          ? [...current, light]
                          : current.filter(l => l !== light)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{light}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Textures - Choose textures that feel comforting:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {textureOptions.map((texture) => (
              <label key={texture} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.sensoryDesign.textures.includes(texture)}
                  onChange={(e) => {
                    const current = calmCornerData.sensoryDesign.textures;
                    setCalmCornerData(prev => ({
                      ...prev,
                      sensoryDesign: {
                        ...prev.sensoryDesign,
                        textures: e.target.checked 
                          ? [...current, texture]
                          : current.filter(t => t !== texture)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{texture}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Sounds - Select audio elements for your space:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {soundOptions.map((sound) => (
              <label key={sound} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.sensoryDesign.sounds.includes(sound)}
                  onChange={(e) => {
                    const current = calmCornerData.sensoryDesign.sounds;
                    setCalmCornerData(prev => ({
                      ...prev,
                      sensoryDesign: {
                        ...prev.sensoryDesign,
                        sounds: e.target.checked 
                          ? [...current, sound]
                          : current.filter(s => s !== sound)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{sound}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Scents - Choose aromatherapy elements:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {scentOptions.map((scent) => (
              <label key={scent} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.sensoryDesign.scents.includes(scent)}
                  onChange={(e) => {
                    const current = calmCornerData.sensoryDesign.scents;
                    setCalmCornerData(prev => ({
                      ...prev,
                      sensoryDesign: {
                        ...prev.sensoryDesign,
                        scents: e.target.checked 
                          ? [...current, scent]
                          : current.filter(s => s !== scent)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{scent}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h5 className="font-medium text-purple-900 mb-2">Sensory Design Tips</h5>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Layer multiple senses for deeper impact</li>
          <li>• Choose 2-3 primary colors to avoid overstimulation</li>
          <li>• Soft, warm lighting is more calming than bright, cool light</li>
          <li>• Natural textures connect you to earth energy</li>
          <li>• Consistent scents help trigger relaxation response</li>
          <li>• Consider seasonal changes to keep space fresh</li>
        </ul>
      </div>
    </div>
  );

  const renderEssentialItemsStep = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-3">Essential Items & Tools</h4>
        <p className="text-sm text-orange-800">
          The objects in your calm corner should serve both functional and emotional purposes. Each item 
          should either support your practice or bring you joy, peace, and connection to your highest self.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Comfort Items - Physical support for relaxation:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {comfortItems.map((item) => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.essentialItems.comfort.includes(item)}
                  onChange={(e) => {
                    const current = calmCornerData.essentialItems.comfort;
                    setCalmCornerData(prev => ({
                      ...prev,
                      essentialItems: {
                        ...prev.essentialItems,
                        comfort: e.target.checked 
                          ? [...current, item]
                          : current.filter(i => i !== item)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Mindfulness Tools - Support for practice and reflection:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mindfulnessItems.map((item) => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.essentialItems.mindfulness.includes(item)}
                  onChange={(e) => {
                    const current = calmCornerData.essentialItems.mindfulness;
                    setCalmCornerData(prev => ({
                      ...prev,
                      essentialItems: {
                        ...prev.essentialItems,
                        mindfulness: e.target.checked 
                          ? [...current, item]
                          : current.filter(i => i !== item)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Grounding Elements - Connection to earth and nature:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {groundingItems.map((item) => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.essentialItems.grounding.includes(item)}
                  onChange={(e) => {
                    const current = calmCornerData.essentialItems.grounding;
                    setCalmCornerData(prev => ({
                      ...prev,
                      essentialItems: {
                        ...prev.essentialItems,
                        grounding: e.target.checked 
                          ? [...current, item]
                          : current.filter(i => i !== item)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Inspiration Items - Personal meaning and motivation:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {inspirationItems.map((item) => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={calmCornerData.essentialItems.inspiration.includes(item)}
                  onChange={(e) => {
                    const current = calmCornerData.essentialItems.inspiration;
                    setCalmCornerData(prev => ({
                      ...prev,
                      essentialItems: {
                        ...prev.essentialItems,
                        inspiration: e.target.checked 
                          ? [...current, item]
                          : current.filter(i => i !== item)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h5 className="font-medium text-orange-900 mb-2">Essential vs. Enhancement</h5>
          <div className="text-sm text-orange-800 space-y-1">
            <div><strong>Essential (Start here):</strong></div>
            <div>• One comfortable seating option</div>
            <div>• One soft texture (blanket/pillow)</div>
            <div>• One calming scent or candle</div>
            <div>• Journal or reflection tool</div>
            <div>• One inspirational item</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Budget-Friendly Options</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Use existing chair + throw blanket</div>
            <div>• Print meaningful quotes or photos</div>
            <div>• Gather stones/shells from nature</div>
            <div>• Repurpose scarves for soft textures</div>
            <div>• Use phone for meditation music</div>
            <div>• Create DIY vision board</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRitualsStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Mindful Rituals & Practices</h4>
        <p className="text-sm text-indigo-800">
          Rituals transform ordinary moments into sacred ones. By creating consistent practices in your calm corner, 
          you train your nervous system to shift into rest mode quickly and deeply.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Entry Ritual - How will you transition into your calm corner?</label>
          <Textarea
            value={calmCornerData.ritualPractices.entryRitual}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              ritualPractices: { ...prev.ritualPractices, entryRitual: e.target.value }
            }))}
            placeholder="e.g., Remove shoes, light candle, take 3 deep breaths, set intention, place phone aside, wash hands mindfully..."
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600">
            <strong>Purpose:</strong> Signals to your nervous system that you're entering sacred time
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Breathing Practice - Your go-to breathwork in this space:</label>
          <Textarea
            value={calmCornerData.ritualPractices.breathingPractice}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              ritualPractices: { ...prev.ritualPractices, breathingPractice: e.target.value }
            }))}
            placeholder="e.g., 5 minutes of box breathing, heart coherence breathing, 4-7-8 breathing, gentle belly breathing..."
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600">
            <strong>Purpose:</strong> Activates parasympathetic nervous system and centers your mind
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mindfulness Activity - Your preferred present-moment practice:</label>
          <Textarea
            value={calmCornerData.ritualPractices.mindfulnessActivity}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              ritualPractices: { ...prev.ritualPractices, mindfulnessActivity: e.target.value }
            }))}
            placeholder="e.g., Body scan meditation, loving-kindness practice, mindful journaling, guided meditation, nature observation..."
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600">
            <strong>Purpose:</strong> Cultivates awareness and presence while releasing mental chatter
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gratitude Practice - How will you cultivate appreciation?</label>
          <Textarea
            value={calmCornerData.ritualPractices.gratitudePractice}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              ritualPractices: { ...prev.ritualPractices, gratitudePractice: e.target.value }
            }))}
            placeholder="e.g., Write 3 things I'm grateful for, gratitude meditation, appreciate my body, send love to family, celebrate small wins..."
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600">
            <strong>Purpose:</strong> Shifts brain chemistry toward positivity and abundance
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Exit Ritual - How will you complete your practice?</label>
          <Textarea
            value={calmCornerData.ritualPractices.exitRitual}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              ritualPractices: { ...prev.ritualPractices, exitRitual: e.target.value }
            }))}
            placeholder="e.g., Set intention for day ahead, blow out candle, place hands on heart, thank my space, gentle stretch..."
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600">
            <strong>Purpose:</strong> Seals in the peaceful energy and prepares you for daily activities
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h5 className="font-medium text-indigo-900 mb-2">Sample 10-Minute Morning Ritual</h5>
          <div className="text-sm text-indigo-800 space-y-1">
            <div>1. Light candle, set phone aside (1 min)</div>
            <div>2. Box breathing practice (3 min)</div>
            <div>3. Body scan or meditation (4 min)</div>
            <div>4. Gratitude journaling (1 min)</div>
            <div>5. Set intention, blow out candle (1 min)</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-900 mb-2">Sample 5-Minute Evening Ritual</h5>
          <div className="text-sm text-green-800 space-y-1">
            <div>1. Settle in with soft blanket (30 sec)</div>
            <div>2. Release the day with exhales (2 min)</div>
            <div>3. Appreciate 3 good moments (1 min)</div>
            <div>4. Body relaxation practice (1 min)</div>
            <div>5. Set peaceful intention for sleep (30 sec)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceStep = () => (
    <div className="space-y-6">
      <div className="bg-teal-50 p-6 rounded-lg">
        <h4 className="font-semibold text-teal-900 mb-3">Maintenance & Evolution Plan</h4>
        <p className="text-sm text-teal-800">
          A living calm corner evolves with your needs and seasons of life. Regular tending keeps the space 
          energetically fresh and personally meaningful, while protecting its sacred purpose.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Daily Tending - How will you keep your space sacred?</label>
          <Textarea
            value={calmCornerData.maintenancePlan.dailyTending}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              maintenancePlan: { ...prev.maintenancePlan, dailyTending: e.target.value }
            }))}
            placeholder="e.g., Tidy items after use, fluff cushions, straighten blankets, ensure candles are safely extinguished, reset items mindfully..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Weekly Refresh - Weekly rejuvenation practices:</label>
          <Textarea
            value={calmCornerData.maintenancePlan.weeklyRefresh}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              maintenancePlan: { ...prev.maintenancePlan, weeklyRefresh: e.target.value }
            }))}
            placeholder="e.g., Dust surfaces, wash throws/cushions, change water for plants, refresh scents, rearrange items slightly, clean crystals..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Monthly Evolution - How will your space grow with you?</label>
          <Textarea
            value={calmCornerData.maintenancePlan.monthlyEvolution}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              maintenancePlan: { ...prev.maintenancePlan, monthlyEvolution: e.target.value }
            }))}
            placeholder="e.g., Add new inspirational quotes, rotate seasonal items, introduce new scents, update vision board, assess what's working..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Seasonal Changes - Connecting with natural rhythms:</label>
          <Textarea
            value={calmCornerData.maintenancePlan.seasonalChanges}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              maintenancePlan: { ...prev.maintenancePlan, seasonalChanges: e.target.value }
            }))}
            placeholder="e.g., Spring: fresh flowers, light colors. Summer: cooling elements. Fall: warm textures, gratitude focus. Winter: cozy lighting, reflection..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Boundary Maintenance - Protecting your sacred space:</label>
          <Textarea
            value={calmCornerData.maintenancePlan.boundaryMaintenance}
            onChange={(e) => setCalmCornerData(prev => ({
              ...prev,
              maintenancePlan: { ...prev.maintenancePlan, boundaryMaintenance: e.target.value }
            }))}
            placeholder="e.g., Keep work items out, ask family to respect space, use 'do not disturb' signals, maintain phone-free zone, gentle education about purpose..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <h5 className="font-semibold text-teal-900 mb-2">Your Calm Corner Success Metrics</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h6 className="font-medium text-teal-800 mb-1">Frequency Indicators:</h6>
            <ul className="text-teal-700 space-y-1">
              <li>• Using space consistently</li>
              <li>• Looking forward to practice time</li>
              <li>• Automatic stress relief when entering</li>
              <li>• Family/friends respecting boundaries</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-teal-800 mb-1">Effectiveness Indicators:</h6>
            <ul className="text-teal-700 space-y-1">
              <li>• Faster transition to calm state</li>
              <li>• Improved overall stress management</li>
              <li>• Better sleep and energy</li>
              <li>• Increased emotional resilience</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h5 className="font-medium text-amber-900 mb-2">Troubleshooting Common Challenges</h5>
        <div className="text-sm text-amber-800 space-y-2">
          <div><strong>Not using it regularly:</strong> Lower barriers (keep simpler), link to existing habits, start with just 2 minutes</div>
          <div><strong>Space feels stagnant:</strong> Add one new element, change positioning, introduce seasonal items</div>
          <div><strong>Family interruptions:</strong> Create visual cues, educate about importance, use "busy" signals</div>
          <div><strong>Perfectionism paralysis:</strong> Start with one item and build gradually, remember process over perfection</div>
        </div>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-green-600" />
          Create Your Calm Corner
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">Design your personalized sanctuary for daily restoration and nervous system regulation</p>
          </div>

          {currentStep === 0 && renderAssessmentStep()}
          {currentStep === 1 && renderSensoryDesignStep()}
          {currentStep === 2 && renderEssentialItemsStep()}
          {currentStep === 3 && renderRitualsStep()}
          {currentStep === 4 && renderMaintenanceStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w4-calm-corner', calmCornerData)}
                className="ml-auto"
              >
                Complete Calm Corner Design
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Guided Grounding Meditation Component
function GuidedGroundingMeditation({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('preparation');
  const [meditationData, setMeditationData] = useState({
    personalAssessment: {
      experienceLevel: 'beginner',
      currentStress: 5,
      physicalTension: 5,
      mentalChatter: 5,
      preferredDuration: 12,
      specificConcerns: ''
    },
    meditationPreferences: {
      voiceGuidance: true,
      backgroundSounds: [] as string[],
      visualCues: true,
      breathingPrompts: true,
      bodyAwareness: true
    },
    sessionExperience: {
      beforeStress: 5,
      afterStress: 5,
      beforeTension: 5,
      afterTension: 5,
      beforeMentalClarity: 5,
      afterMentalClarity: 5,
      insights: '',
      challenges: '',
      favoriteAspects: ''
    },
    practiceIntegration: {
      dailySchedule: '',
      adaptations: '',
      progressGoals: '',
      reminderSystems: ''
    }
  });

  const steps = [
    'Personal Meditation Assessment',
    'Meditation Preferences Setup',
    'Guided 12-Minute Practice',
    'Post-Meditation Reflection',
    'Daily Practice Integration'
  ];

  const meditationPhases = [
    { name: 'Preparation', duration: 60, description: 'Settling into comfortable position' },
    { name: 'Breath Awareness', duration: 180, description: 'Connecting with natural breathing rhythm' },
    { name: 'Body Scan', duration: 300, description: 'Progressive relaxation from head to toe' },
    { name: 'Grounding Visualization', duration: 180, description: 'Connecting with earth energy' },
    { name: 'Present Moment', duration: 120, description: 'Cultivating awareness and presence' },
    { name: 'Integration', duration: 60, description: 'Preparing to return to daily activities' }
  ];

  const backgroundSoundOptions = [
    'Forest sounds', 'Ocean waves', 'Gentle rain', 'Singing bowls',
    'Soft instrumental', 'Nature symphony', 'Wind through trees', 'Mountain stream',
    'Tibetan bells', 'Ambient tones', 'Silence (no background)', 'Heartbeat rhythm'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setMeditationTimer(prev => {
          const newTime = prev + 1;
          
          // Calculate current phase based on timer
          let cumulativeTime = 0;
          for (const phase of meditationPhases) {
            cumulativeTime += phase.duration;
            if (newTime <= cumulativeTime) {
              setCurrentPhase(phase.name.toLowerCase().replace(' ', '-'));
              break;
            }
          }
          
          // Auto-complete when meditation finishes
          if (newTime >= 720) { // 12 minutes total
            setIsPlaying(false);
            setCurrentPhase('complete');
          }
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-3">Personal Meditation Assessment</h4>
        <p className="text-sm text-indigo-800">
          This grounding meditation is designed to calm your nervous system, release physical tension, 
          and bring you into present-moment awareness. Let's personalize it to your current needs and experience level.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Your meditation experience level:</label>
          <div className="space-y-2">
            {[
              { value: 'complete-beginner', label: 'Complete Beginner', desc: 'New to meditation or very little experience' },
              { value: 'beginner', label: 'Beginner', desc: 'Some guided meditations, still learning' },
              { value: 'intermediate', label: 'Intermediate', desc: 'Regular practice, comfortable with guidance' },
              { value: 'experienced', label: 'Experienced', desc: 'Consistent practice, can meditate independently' }
            ].map((level) => (
              <label key={level.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="experience"
                  value={level.value}
                  checked={meditationData.personalAssessment.experienceLevel === level.value}
                  onChange={(e) => setMeditationData(prev => ({
                    ...prev,
                    personalAssessment: { ...prev.personalAssessment, experienceLevel: e.target.value }
                  }))}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{level.label}</div>
                  <div className="text-xs text-gray-600">{level.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-3">Current stress level (1-10)</label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.personalAssessment.currentStress}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  personalAssessment: { ...prev.personalAssessment, currentStress: parseInt(e.target.value) }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Calm</span>
                <span className="font-medium">{meditationData.personalAssessment.currentStress}</span>
                <span>Stressed</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Physical tension (1-10)</label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.personalAssessment.physicalTension}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  personalAssessment: { ...prev.personalAssessment, physicalTension: parseInt(e.target.value) }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Relaxed</span>
                <span className="font-medium">{meditationData.personalAssessment.physicalTension}</span>
                <span>Tense</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Mental chatter (1-10)</label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={meditationData.personalAssessment.mentalChatter}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  personalAssessment: { ...prev.personalAssessment, mentalChatter: parseInt(e.target.value) }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Quiet</span>
                <span className="font-medium">{meditationData.personalAssessment.mentalChatter}</span>
                <span>Racing</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Preferred meditation duration:</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 5, label: '5 minutes', desc: 'Quick reset' },
              { value: 8, label: '8 minutes', desc: 'Short practice' },
              { value: 12, label: '12 minutes', desc: 'Standard session' },
              { value: 15, label: '15 minutes', desc: 'Extended practice' }
            ].map((duration) => (
              <label key={duration.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value={duration.value}
                  checked={meditationData.personalAssessment.preferredDuration === duration.value}
                  onChange={(e) => setMeditationData(prev => ({
                    ...prev,
                    personalAssessment: { ...prev.personalAssessment, preferredDuration: parseInt(e.target.value) }
                  }))}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                  meditationData.personalAssessment.preferredDuration === duration.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}>
                  <div className="font-medium text-sm">{duration.label}</div>
                  <div className="text-xs text-gray-600">{duration.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any specific concerns or intentions for this practice?</label>
          <Textarea
            value={meditationData.personalAssessment.specificConcerns}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              personalAssessment: { ...prev.personalAssessment, specificConcerns: e.target.value }
            }))}
            placeholder="e.g., Feeling overwhelmed today, need help with sleep preparation, processing difficult emotions, preparing for stressful event..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <h5 className="font-medium text-indigo-900 mb-2">Benefits of Grounding Meditation</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <ul className="space-y-1">
            <li>• Activates parasympathetic nervous system</li>
            <li>• Reduces cortisol and stress hormones</li>
            <li>• Improves emotional regulation</li>
            <li>• Enhances present-moment awareness</li>
          </ul>
          <ul className="space-y-1">
            <li>• Releases physical tension</li>
            <li>• Calms mental chatter</li>
            <li>• Improves sleep quality</li>
            <li>• Builds stress resilience</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Meditation Preferences Setup</h4>
        <p className="text-sm text-purple-800">
          Customize your meditation experience to create the most supportive environment for your practice. 
          These preferences will help create a deeply personalized grounding session.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-medium mb-4">Guidance Preferences:</h5>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={meditationData.meditationPreferences.voiceGuidance}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  meditationPreferences: { ...prev.meditationPreferences, voiceGuidance: e.target.checked }
                }))}
                className="rounded"
              />
              <div>
                <span className="font-medium text-sm">Voice Guidance</span>
                <p className="text-xs text-gray-600">Gentle spoken instructions throughout the practice</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={meditationData.meditationPreferences.visualCues}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  meditationPreferences: { ...prev.meditationPreferences, visualCues: e.target.checked }
                }))}
                className="rounded"
              />
              <div>
                <span className="font-medium text-sm">Visual Cues</span>
                <p className="text-xs text-gray-600">On-screen prompts and phase indicators</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={meditationData.meditationPreferences.breathingPrompts}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  meditationPreferences: { ...prev.meditationPreferences, breathingPrompts: e.target.checked }
                }))}
                className="rounded"
              />
              <div>
                <span className="font-medium text-sm">Breathing Prompts</span>
                <p className="text-xs text-gray-600">Gentle reminders to return to breath awareness</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={meditationData.meditationPreferences.bodyAwareness}
                onChange={(e) => setMeditationData(prev => ({
                  ...prev,
                  meditationPreferences: { ...prev.meditationPreferences, bodyAwareness: e.target.checked }
                }))}
                className="rounded"
              />
              <div>
                <span className="font-medium text-sm">Body Awareness Cues</span>
                <p className="text-xs text-gray-600">Guidance for body scan and physical relaxation</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-4">Background Sounds - Choose what supports your relaxation:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {backgroundSoundOptions.map((sound) => (
              <label key={sound} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={meditationData.meditationPreferences.backgroundSounds.includes(sound)}
                  onChange={(e) => {
                    const current = meditationData.meditationPreferences.backgroundSounds;
                    setMeditationData(prev => ({
                      ...prev,
                      meditationPreferences: {
                        ...prev.meditationPreferences,
                        backgroundSounds: e.target.checked 
                          ? [...current, sound]
                          : current.filter(s => s !== sound)
                      }
                    }));
                  }}
                  className="rounded"
                />
                <span className="text-sm">{sound}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h5 className="font-medium text-purple-900 mb-2">Meditation Setup Tips</h5>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Find a comfortable seated or lying position</li>
          <li>• Ensure you won't be interrupted for the full duration</li>
          <li>• Consider dimming lights or using an eye pillow</li>
          <li>• Have a blanket nearby for warmth and comfort</li>
          <li>• Turn off notifications on devices</li>
          <li>• Set an intention for your practice</li>
        </ul>
      </div>
    </div>
  );

  const renderMeditationStep = () => {
    const totalDuration = meditationData.personalAssessment.preferredDuration * 60; // Convert to seconds
    const progress = (meditationTimer / totalDuration) * 100;
    const currentPhaseIndex = meditationPhases.findIndex(phase => 
      phase.name.toLowerCase().replace(' ', '-') === currentPhase
    );
    const currentPhaseData = meditationPhases[currentPhaseIndex] || meditationPhases[0];

    return (
      <div className="space-y-6">
        <div className="bg-emerald-50 p-6 rounded-lg">
          <h4 className="font-semibold text-emerald-900 mb-3">Guided Grounding Meditation</h4>
          <p className="text-sm text-emerald-800">
            Allow yourself to settle into this time of restoration. There's nothing you need to do except 
            follow along gently and give yourself this gift of presence.
          </p>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-emerald-700">
              {Math.floor(meditationTimer / 60)}:{(meditationTimer % 60).toString().padStart(2, '0')}
            </div>
            
            <div className="w-full bg-emerald-200 rounded-full h-3">
              <div 
                className="bg-emerald-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="space-y-2">
              <h5 className="text-xl font-semibold text-emerald-900 capitalize">
                {currentPhase.replace('-', ' ')}
              </h5>
              <p className="text-emerald-700">{currentPhaseData?.description}</p>
            </div>

            <div className="space-y-4">
              {!isPlaying ? (
                <Button 
                  onClick={() => {
                    setIsPlaying(true);
                    setMeditationTimer(0);
                    setCurrentPhase('preparation');
                  }}
                  size="lg"
                  className="w-full"
                >
                  Begin Meditation
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsPlaying(false)}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Pause Practice
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setIsPlaying(false);
                      setMeditationTimer(0);
                      setCurrentPhase('preparation');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Restart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meditation Phase Content */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            {currentPhase === 'preparation' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Settling In</h6>
                <p className="text-gray-700">
                  Find a comfortable position. Allow your body to be supported. 
                  Close your eyes or soften your gaze. Take a moment to arrive here fully.
                </p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  Notice how your body feels right now. There's no need to change anything, 
                  just become aware of your current state.
                </div>
              </div>
            )}

            {currentPhase === 'breath-awareness' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Breath Awareness</h6>
                <p className="text-gray-700">
                  Bring your attention to your natural breath. Don't change it, 
                  just notice the gentle rhythm of inhaling and exhaling.
                </p>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  If your mind wanders, that's completely normal. Gently guide your 
                  attention back to the sensation of breathing.
                </div>
              </div>
            )}

            {currentPhase === 'body-scan' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Body Scan Relaxation</h6>
                <p className="text-gray-700">
                  Starting from the top of your head, slowly scan down through your body. 
                  Notice any areas of tension and breathe softness into them.
                </p>
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                  Head and face... neck and shoulders... arms and hands... 
                  chest and heart... abdomen... hips... legs and feet...
                </div>
              </div>
            )}

            {currentPhase === 'grounding-visualization' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Earth Connection</h6>
                <p className="text-gray-700">
                  Imagine roots growing from your body into the earth below. 
                  Feel yourself supported and connected to the stable ground.
                </p>
                <div className="text-sm text-gray-600 bg-amber-50 p-3 rounded">
                  Draw up the earth's calm, steady energy. Let it fill your body 
                  with stability and peace.
                </div>
              </div>
            )}

            {currentPhase === 'present-moment' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Present Moment Awareness</h6>
                <p className="text-gray-700">
                  Rest in this moment of pure being. Nothing to do, nowhere to go, 
                  just awareness itself resting in awareness.
                </p>
                <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                  You are safe. You are here. You are enough, exactly as you are.
                </div>
              </div>
            )}

            {currentPhase === 'integration' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Gentle Return</h6>
                <p className="text-gray-700">
                  Begin to deepen your breath. Wiggle your fingers and toes. 
                  Carry this sense of calm with you as you return to your day.
                </p>
                <div className="text-sm text-gray-600 bg-teal-50 p-3 rounded">
                  Take three deep breaths. When you're ready, gently open your eyes.
                </div>
              </div>
            )}

            {currentPhase === 'complete' && (
              <div className="text-center space-y-3">
                <h6 className="font-semibold text-lg">Practice Complete</h6>
                <p className="text-gray-700">
                  Well done. You've given yourself a beautiful gift of presence and calm. 
                  Notice how you feel now compared to when you began.
                </p>
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                  Take a moment to appreciate this time you've invested in your wellbeing.
                </div>
              </div>
            )}
          </div>
        </div>

        {meditationData.meditationPreferences.backgroundSounds.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h6 className="font-medium mb-2">Selected Background: </h6>
            <div className="text-sm text-gray-700">
              {meditationData.meditationPreferences.backgroundSounds.join(', ')}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReflectionStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Post-Meditation Reflection</h4>
        <p className="text-sm text-blue-800">
          Reflection helps integrate your meditation experience and track the benefits of your practice. 
          Take a moment to notice what shifted during your session.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <h5 className="font-medium">Stress Level</h5>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Before: {meditationData.sessionExperience.beforeStress}</div>
            <div className="text-sm font-medium mb-2">After:</div>
            <input
              type="range"
              min="1"
              max="10"
              value={meditationData.sessionExperience.afterStress}
              onChange={(e) => setMeditationData(prev => ({
                ...prev,
                sessionExperience: { ...prev.sessionExperience, afterStress: parseInt(e.target.value) }
              }))}
              className="w-full"
            />
            <div className="text-center font-medium text-blue-600">
              {meditationData.sessionExperience.afterStress}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium">Physical Tension</h5>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Before: {meditationData.sessionExperience.beforeTension}</div>
            <div className="text-sm font-medium mb-2">After:</div>
            <input
              type="range"
              min="1"
              max="10"
              value={meditationData.sessionExperience.afterTension}
              onChange={(e) => setMeditationData(prev => ({
                ...prev,
                sessionExperience: { ...prev.sessionExperience, afterTension: parseInt(e.target.value) }
              }))}
              className="w-full"
            />
            <div className="text-center font-medium text-blue-600">
              {meditationData.sessionExperience.afterTension}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-medium">Mental Clarity</h5>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Before: {meditationData.sessionExperience.beforeMentalClarity}</div>
            <div className="text-sm font-medium mb-2">After:</div>
            <input
              type="range"
              min="1"
              max="10"
              value={meditationData.sessionExperience.afterMentalClarity}
              onChange={(e) => setMeditationData(prev => ({
                ...prev,
                sessionExperience: { ...prev.sessionExperience, afterMentalClarity: parseInt(e.target.value) }
              }))}
              className="w-full"
            />
            <div className="text-center font-medium text-blue-600">
              {meditationData.sessionExperience.afterMentalClarity}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Insights or realizations from your practice:</label>
          <Textarea
            value={meditationData.sessionExperience.insights}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              sessionExperience: { ...prev.sessionExperience, insights: e.target.value }
            }))}
            placeholder="e.g., Noticed how tense my shoulders were, felt more connected to my body, mind became quieter than expected..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any challenges you experienced:</label>
          <Textarea
            value={meditationData.sessionExperience.challenges}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              sessionExperience: { ...prev.sessionExperience, challenges: e.target.value }
            }))}
            placeholder="e.g., Mind kept wandering, difficult to sit still, felt emotional, hard to focus on breath..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Favorite aspects of the meditation:</label>
          <Textarea
            value={meditationData.sessionExperience.favoriteAspects}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              sessionExperience: { ...prev.sessionExperience, favoriteAspects: e.target.value }
            }))}
            placeholder="e.g., Body scan was deeply relaxing, grounding visualization felt powerful, loved the gentle guidance..."
            rows={3}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Your Meditation Benefits Summary</h5>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium">Stress Reduction:</div>
            <div className="text-blue-800">
              {meditationData.sessionExperience.beforeStress - meditationData.sessionExperience.afterStress > 0 
                ? `↓ ${meditationData.sessionExperience.beforeStress - meditationData.sessionExperience.afterStress} points` 
                : 'Maintained calm state'}
            </div>
          </div>
          <div>
            <div className="font-medium">Tension Release:</div>
            <div className="text-blue-800">
              {meditationData.sessionExperience.beforeTension - meditationData.sessionExperience.afterTension > 0 
                ? `↓ ${meditationData.sessionExperience.beforeTension - meditationData.sessionExperience.afterTension} points` 
                : 'Maintained relaxation'}
            </div>
          </div>
          <div>
            <div className="font-medium">Mental Clarity:</div>
            <div className="text-blue-800">
              {meditationData.sessionExperience.afterMentalClarity - meditationData.sessionExperience.beforeMentalClarity > 0 
                ? `↑ ${meditationData.sessionExperience.afterMentalClarity - meditationData.sessionExperience.beforeMentalClarity} points` 
                : 'Maintained clarity'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationStep = () => (
    <div className="space-y-6">
      <div className="bg-teal-50 p-6 rounded-lg">
        <h4 className="font-semibold text-teal-900 mb-3">Daily Practice Integration</h4>
        <p className="text-sm text-teal-800">
          Regular meditation practice creates lasting changes in your brain and nervous system. 
          Let's create a sustainable plan to integrate grounding meditation into your daily life.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Your ideal daily meditation schedule:</label>
          <Textarea
            value={meditationData.practiceIntegration.dailySchedule}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              practiceIntegration: { ...prev.practiceIntegration, dailySchedule: e.target.value }
            }))}
            placeholder="e.g., 10 minutes each morning after coffee, 5 minutes before bed, weekend longer sessions, meditation breaks during work..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Adaptations for busy or challenging days:</label>
          <Textarea
            value={meditationData.practiceIntegration.adaptations}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              practiceIntegration: { ...prev.practiceIntegration, adaptations: e.target.value }
            }))}
            placeholder="e.g., 3-minute breathing practice, walking meditation, mindful moments during daily tasks, evening body scan..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your meditation progress goals for the next month:</label>
          <Textarea
            value={meditationData.practiceIntegration.progressGoals}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              practiceIntegration: { ...prev.practiceIntegration, progressGoals: e.target.value }
            }))}
            placeholder="e.g., Meditate 5 days per week, feel calmer during stressful situations, improve sleep quality, develop consistent routine..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reminder systems and accountability:</label>
          <Textarea
            value={meditationData.practiceIntegration.reminderSystems}
            onChange={(e) => setMeditationData(prev => ({
              ...prev,
              practiceIntegration: { ...prev.practiceIntegration, reminderSystems: e.target.value }
            }))}
            placeholder="e.g., Phone reminders, meditation app, practice buddy, calendar blocks, meditation space setup as visual cue..."
            rows={3}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-teal-50 p-4 rounded-lg">
          <h5 className="font-medium text-teal-900 mb-2">Building Your Practice</h5>
          <div className="text-sm text-teal-800 space-y-1">
            <div><strong>Week 1-2:</strong> 5-8 minutes daily, focus on consistency</div>
            <div><strong>Week 3-4:</strong> 10-12 minutes, explore different techniques</div>
            <div><strong>Month 2:</strong> 15+ minutes, develop personal style</div>
            <div><strong>Ongoing:</strong> Adapt length based on needs and schedule</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-900 mb-2">Success Indicators</h5>
          <div className="text-sm text-green-800 space-y-1">
            <div>• Looking forward to meditation time</div>
            <div>• Faster recovery from stressful events</div>
            <div>• Improved emotional regulation</div>
            <div>• Better sleep and energy levels</div>
            <div>• Increased self-awareness</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h5 className="font-medium text-amber-900 mb-2">Troubleshooting Common Challenges</h5>
        <div className="text-sm text-amber-800 space-y-2">
          <div><strong>Can't find time:</strong> Start with 3-5 minutes, link to existing habits, use transition moments</div>
          <div><strong>Mind too busy:</strong> That's normal! Meditation is practice, not perfection. Shorter sessions more frequently</div>
          <div><strong>Falling asleep:</strong> Try sitting up, eyes slightly open, or practice at different times</div>
          <div><strong>Lack of motivation:</strong> Remember your why, track benefits, find meditation buddy or group</div>
        </div>
      </div>
    </div>
  );

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
          <Heart className="w-6 h-6 text-purple-600" />
          Guided Grounding Meditation
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep]}</h3>
            <p className="text-gray-600">12-minute nervous system regulation meditation with personalized guidance</p>
          </div>

          {currentStep === 0 && renderAssessmentStep()}
          {currentStep === 1 && renderPreferencesStep()}
          {currentStep === 2 && renderMeditationStep()}
          {currentStep === 3 && renderReflectionStep()}
          {currentStep === 4 && renderIntegrationStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={() => onComplete('w4-meditation', meditationData)}
                className="ml-auto"
              >
                Complete Meditation Practice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  if (component.id === 'hormone-meditation') {
    return <HormoneHarmonyMeditation onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'cortisol-breathwork') {
    return <CortisolResetBreathwork onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'mental-space-reset') {
    return <ResettingYourMentalSpace onComplete={onComplete} onClose={onClose} />;
  }

  // Add handlers for Week 1 interactive components
  if (component.id === 'symptom-tracker') {
    return <InteractiveSymptomTracker onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'morning-ritual') {
    return <MorningRitualCreator onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'brain-fog-exercise') {
    return <BrainFogClearingPractice onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'energy-mapping') {
    return <EnergyPatternMapper onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'thought-awareness') {
    return <ThoughtPatternTracker onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'nutrition-planning') {
    return <NutritionPlanningTool onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'evening-wind-down') {
    return <EveningRoutineCreator onComplete={onComplete} onClose={onClose} />;
  }

  // Week 2 Components
  if (component.id === 'w2-cbt') {
    return <CBTReframingTechniques onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w2-mirror') {
    return <MirrorWorkAffirmations onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w2-audit') {
    return <ThoughtAuditTracker onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w2-nlp') {
    return <NLPReframingPractice onComplete={onComplete} onClose={onClose} />;
  }

  // Week 3 Components
  if (component.id === 'w3-patterns') {
    return <OverwhelmPatternAnalysis onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w3-technique') {
    return <PauseLabelShiftTechnique onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w3-boundaries') {
    return <BoundariesWorksheet onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w3-mood-map') {
    return <WeeklyMoodMap onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4 Components
  if (component.id === 'w4-grounding') {
    return <SomaticGroundingPractices onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w4-breathwork') {
    return <BreathworkVagusReset onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w4-calm-corner') {
    return <CreateCalmCorner onComplete={onComplete} onClose={onClose} />;
  }

  if (component.id === 'w4-meditation') {
    return <GuidedGroundingMeditation onComplete={onComplete} onClose={onClose} />;
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