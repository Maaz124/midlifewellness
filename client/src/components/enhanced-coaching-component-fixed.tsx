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
          <Button variant="outline" size="sm">Previous</Button>
          <Button size="sm">Complete</Button>
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
          onClick={() => onComplete('hormone-meditation', meditationData)}
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