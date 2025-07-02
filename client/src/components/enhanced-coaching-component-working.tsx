import { useState, useEffect } from 'react';
import { CognitiveAssessmentFresh } from './cognitive-assessment-fresh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Week4SomaticGrounding } from './week4-somatic-grounding';
import { BreathworkVagus } from './breathwork-vagus';
import { CalmCorner } from './calm-corner';
import { GuidedMeditation } from './guided-meditation';
import { 
  Play, 
  Pause, 
  ArrowLeft,
  Utensils, 
  Clock, 
  CheckCircle, 
  Activity,
  Shield,
  Sun,
  Moon,
  Brain,
  Heart,
  Zap,
  BarChart
} from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { videoScripts, audioScripts, detailedExercises } from '@/lib/hormone-headspace-content';
import type { ModuleComponent } from '@/types/wellness';

interface EnhancedCoachingComponentMinimalProps {
  component: any;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function EnhancedCoachingComponentMinimal({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentMinimalProps) {
  const [responses, setResponses] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { data, updateCoachingProgress } = useWellnessData();

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, responses);
    
    // Update coaching progress
    const newCompletedComponents = [...(data.coachingProgress?.completedComponents || []), component.id];
    updateCoachingProgress({
      completedComponents: newCompletedComponents,
      responseData: { ...data.coachingProgress?.responseData, [component.id]: responses }
    });
  };

  // Timer for audio/video content
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Week 4: Somatic Grounding Practices
  if (moduleId === 'week-4' && component.id === 'w4-grounding') {
    return <Week4SomaticGrounding onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Breathwork & Vagus Nerve Reset
  if (moduleId === 'week-4' && component.id === 'w4-breathwork') {
    return <BreathworkVagus onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Create Your Calm Corner
  if (moduleId === 'week-4' && component.id === 'w4-calm-corner') {
    return <CalmCorner onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Guided Grounding Meditation
  if (moduleId === 'week-4' && component.id === 'w4-meditation') {
    return <GuidedMeditation onComplete={onComplete} onClose={onClose} />;
  }

  // Week 3: Overwhelm Pattern Analysis
  if (component.id === 'w3-patterns') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'assessment');
    const [overwhelmTriggers, setOverwhelmTriggers] = useState(responses.overwhelmTriggers || []);
    const [patterns, setPatterns] = useState(responses.patterns || {});
    const [strategies, setStrategies] = useState(responses.strategies || []);

    const updateResponses = (newData: any) => {
      // This function updates the component responses
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const overwhelmTriggerOptions = [
      { id: 'too-many-tasks', name: 'Too many tasks at once', category: 'workload' },
      { id: 'time-pressure', name: 'Time pressure and deadlines', category: 'time' },
      { id: 'perfectionism', name: 'Perfectionist expectations', category: 'mindset' },
      { id: 'saying-no', name: 'Difficulty saying no to requests', category: 'boundaries' },
      { id: 'technology', name: 'Technology and information overload', category: 'digital' },
      { id: 'family-demands', name: 'Family demands and caregiving', category: 'relationships' },
      { id: 'financial-stress', name: 'Financial pressures', category: 'money' },
      { id: 'health-concerns', name: 'Health or energy concerns', category: 'physical' },
      { id: 'social-obligations', name: 'Social obligations and events', category: 'social' },
      { id: 'decision-making', name: 'Too many decisions to make', category: 'mental' },
      { id: 'clutter', name: 'Physical clutter and disorganization', category: 'environment' },
      { id: 'hormonal', name: 'Hormonal changes and symptoms', category: 'physical' }
    ];

    const copingStrategies = [
      { id: 'breathing', name: 'Deep breathing exercises', effectiveness: 0 },
      { id: 'prioritizing', name: 'Making priority lists', effectiveness: 0 },
      { id: 'delegating', name: 'Delegating tasks to others', effectiveness: 0 },
      { id: 'boundaries', name: 'Setting clear boundaries', effectiveness: 0 },
      { id: 'exercise', name: 'Physical exercise or movement', effectiveness: 0 },
      { id: 'meditation', name: 'Meditation or mindfulness', effectiveness: 0 },
      { id: 'talking', name: 'Talking to friends or family', effectiveness: 0 },
      { id: 'breaks', name: 'Taking regular breaks', effectiveness: 0 },
      { id: 'nature', name: 'Spending time in nature', effectiveness: 0 },
      { id: 'journaling', name: 'Writing or journaling', effectiveness: 0 }
    ];

    const toggleTrigger = (triggerId: string) => {
      const newTriggers = overwhelmTriggers.includes(triggerId)
        ? overwhelmTriggers.filter(id => id !== triggerId)
        : [...overwhelmTriggers, triggerId];
      setOverwhelmTriggers(newTriggers);
      updateResponses({ overwhelmTriggers: newTriggers });
    };

    const updatePattern = (area: string, value: string) => {
      const newPatterns = { ...patterns, [area]: value };
      setPatterns(newPatterns);
      updateResponses({ patterns: newPatterns });
    };

    const updateStrategyEffectiveness = (strategyId: string, rating: number) => {
      const newStrategies = strategies.map((s: any) => 
        s.id === strategyId ? { ...s, effectiveness: rating } : s
      );
      if (!strategies.find((s: any) => s.id === strategyId)) {
        newStrategies.push({ id: strategyId, effectiveness: rating });
      }
      setStrategies(newStrategies);
      updateResponses({ strategies: newStrategies });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">🧠 Overwhelm Pattern Analysis</h2>
          <p className="text-lg text-gray-600">
            Understanding your unique overwhelm patterns is the first step to managing them effectively
          </p>
        </div>

        {currentStep === 'assessment' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Step 1: Identify Your Triggers</h3>
              <p className="text-indigo-700 mb-4">
                Select all the situations that commonly trigger feelings of overwhelm for you:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {overwhelmTriggerOptions.map(trigger => (
                  <label key={trigger.id} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-indigo-50">
                    <input
                      type="checkbox"
                      checked={overwhelmTriggers.includes(trigger.id)}
                      onChange={() => toggleTrigger(trigger.id)}
                      className="rounded border-indigo-300"
                    />
                    <div>
                      <span className="font-medium">{trigger.name}</span>
                      <span className="text-xs bg-indigo-100 px-2 py-1 rounded ml-2">{trigger.category}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentStep('patterns'); updateResponses({ currentStep: 'patterns' }); }}
                disabled={overwhelmTriggers.length === 0}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Continue to Pattern Analysis
              </button>
            </div>
          </div>
        )}

        {currentStep === 'patterns' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Step 2: Analyze Your Patterns</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What time of day do you most often feel overwhelmed?
                  </label>
                  <select 
                    value={patterns.timeOfDay || ''}
                    onChange={(e) => updatePattern('timeOfDay', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Select a time...</option>
                    <option value="morning">Morning (6am-12pm)</option>
                    <option value="afternoon">Afternoon (12pm-6pm)</option>
                    <option value="evening">Evening (6pm-10pm)</option>
                    <option value="night">Night (10pm-6am)</option>
                    <option value="varies">It varies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What physical sensations do you notice when overwhelmed?
                  </label>
                  <textarea 
                    value={patterns.physicalSensations || ''}
                    onChange={(e) => updatePattern('physicalSensations', e.target.value)}
                    placeholder="e.g., tight chest, racing heart, shallow breathing, tense shoulders..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What thoughts typically run through your mind?
                  </label>
                  <textarea 
                    value={patterns.thoughtPatterns || ''}
                    onChange={(e) => updatePattern('thoughtPatterns', e.target.value)}
                    placeholder="e.g., 'I can't handle this', 'There's too much to do', 'I'm not good enough'..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    How does overwhelm typically affect your behavior?
                  </label>
                  <textarea 
                    value={patterns.behaviorChanges || ''}
                    onChange={(e) => updatePattern('behaviorChanges', e.target.value)}
                    placeholder="e.g., procrastinating, snapping at others, avoiding tasks, eating differently..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>

              <button 
                onClick={() => { setCurrentStep('strategies'); updateResponses({ currentStep: 'strategies' }); }}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Continue to Strategy Assessment
              </button>
            </div>
          </div>
        )}

        {currentStep === 'strategies' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Step 3: Rate Your Coping Strategies</h3>
              <p className="text-green-700 mb-4">
                Rate how effective each strategy has been for you (1 = not helpful, 5 = very helpful):
              </p>
              
              <div className="space-y-3">
                {copingStrategies.map(strategy => (
                  <div key={strategy.id} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                    <span className="font-medium">{strategy.name}</span>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => updateStrategyEffectiveness(strategy.id, rating)}
                          className={`w-8 h-8 rounded-full text-sm font-medium ${
                            (strategies.find((s: any) => s.id === strategy.id)?.effectiveness || 0) === rating
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-200 hover:bg-green-100'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentStep('results'); updateResponses({ currentStep: 'results' }); }}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                View Your Analysis
              </button>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Your Overwhelm Profile</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Your Top Triggers:</h4>
                  <ul className="space-y-1">
                    {overwhelmTriggers.slice(0, 5).map(triggerId => {
                      const trigger = overwhelmTriggerOptions.find(t => t.id === triggerId);
                      return trigger ? (
                        <li key={triggerId} className="text-blue-700">• {trigger.name}</li>
                      ) : null;
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Most Effective Strategies:</h4>
                  <ul className="space-y-1">
                    {strategies
                      .filter((s: any) => s.effectiveness >= 4)
                      .slice(0, 5)
                      .map((strategy: any) => {
                        const strategyData = copingStrategies.find(cs => cs.id === strategy.id);
                        return strategyData ? (
                          <li key={strategy.id} className="text-blue-700">
                            • {strategyData.name} (Rating: {strategy.effectiveness})
                          </li>
                        ) : null;
                      })}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Personalized Recommendations:</h4>
                <ul className="space-y-2 text-blue-800">
                  {patterns.timeOfDay === 'morning' && (
                    <li>• Consider creating a calming morning routine to start your day centered</li>
                  )}
                  {overwhelmTriggers.includes('perfectionism') && (
                    <li>• Practice the "good enough" principle - aim for progress, not perfection</li>
                  )}
                  {overwhelmTriggers.includes('saying-no') && (
                    <li>• Develop scripts for saying no gracefully to protect your energy</li>
                  )}
                  {patterns.physicalSensations && (
                    <li>• Use your physical sensations as early warning signals to implement coping strategies</li>
                  )}
                </ul>
              </div>

              <button 
                onClick={() => onComplete('w3-patterns', { 
                  overwhelmTriggers, 
                  patterns, 
                  strategies,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Pattern Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Pause-Label-Shift Technique
  if (component.id === 'w3-technique') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'learn');
    const [practiceScenario, setPracticeScenario] = useState(responses.practiceScenario || '');
    const [practiceData, setPracticeData] = useState(responses.practiceData || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const emotionCategories = {
      primary: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'],
      midlife: ['Overwhelm', 'Frustration', 'Anxiety', 'Grief', 'Resentment', 'Loneliness', 'Excitement', 'Relief']
    };

    const shiftStrategies = [
      { 
        name: 'Reframe the Perspective', 
        description: 'Look at the situation from a different angle',
        example: 'Instead of "This is terrible" → "This is challenging, but I can handle challenges"'
      },
      { 
        name: 'Focus on What You Can Control', 
        description: 'Identify actionable steps within your influence',
        example: 'I can\'t control the situation, but I can control my response'
      },
      { 
        name: 'Use Self-Compassion', 
        description: 'Treat yourself with the kindness you\'d show a friend',
        example: 'It\'s normal to feel this way. I\'m being human.'
      },
      { 
        name: 'Ground in the Present', 
        description: 'Return attention to the current moment',
        example: 'Right now, I am safe. Right now, I can breathe.'
      },
      { 
        name: 'Consider the Bigger Picture', 
        description: 'Zoom out to see the broader context',
        example: 'How will this matter in a week/month/year?'
      }
    ];

    const practiceScenarios = [
      'Your teenage child just announced they\'re dropping out of college',
      'You made a mistake at work that everyone noticed',
      'Your partner forgot an important anniversary',
      'You\'re feeling overwhelmed by aging parents\' needs',
      'A close friendship is ending due to different life paths',
      'You\'re experiencing new physical symptoms of perimenopause'
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">⏸️ Pause-Label-Shift Technique</h2>
          <p className="text-lg text-gray-600">
            A powerful three-step method for emotional regulation in challenging moments
          </p>
        </div>

        {currentStep === 'learn' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">⏸️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800">PAUSE</h3>
                </div>
                <p className="text-red-700 text-sm">
                  Stop whatever you're doing. Take a conscious breath. Create space between the trigger and your response.
                </p>
                <div className="mt-4 p-3 bg-red-100 rounded">
                  <strong className="text-red-800">Practice:</strong>
                  <p className="text-red-700 text-sm">Count to 5 slowly while breathing deeply</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">🏷️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">LABEL</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  Name the emotion you're experiencing. Be specific and compassionate with yourself.
                </p>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <strong className="text-blue-800">Practice:</strong>
                  <p className="text-blue-700 text-sm">"I notice I'm feeling frustrated and overwhelmed"</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">🔄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">SHIFT</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Choose a more helpful response. Reframe your perspective or focus on what you can control.
                </p>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <strong className="text-green-800">Practice:</strong>
                  <p className="text-green-700 text-sm">Choose a coping strategy that works for you</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧠 Why This Works</h3>
              <p className="text-yellow-700 mb-3">
                This technique leverages neuroscience research on emotional regulation:
              </p>
              <ul className="space-y-2 text-yellow-700">
                <li>• <strong>Pause:</strong> Activates your prefrontal cortex (thinking brain) instead of reacting from the amygdala (emotion brain)</li>
                <li>• <strong>Label:</strong> Research shows naming emotions reduces their intensity by up to 50%</li>
                <li>• <strong>Shift:</strong> Creates new neural pathways for healthier responses over time</li>
              </ul>
            </div>

            <button 
              onClick={() => { setCurrentStep('practice'); updateResponses({ currentStep: 'practice' }); }}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              Practice the Technique
            </button>
          </div>
        )}

        {currentStep === 'practice' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">Practice Session</h3>
              
              <div className="mb-6">
                <label className="block font-medium text-emerald-900 mb-2">
                  Choose a scenario to practice with:
                </label>
                <select 
                  value={practiceScenario}
                  onChange={(e) => { setPracticeScenario(e.target.value); updateResponses({ practiceScenario: e.target.value }); }}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                >
                  <option value="">Select a scenario...</option>
                  {practiceScenarios.map((scenario, index) => (
                    <option key={index} value={scenario}>{scenario}</option>
                  ))}
                  <option value="custom">Use my own situation</option>
                </select>
              </div>

              {practiceScenario === 'custom' && (
                <div className="mb-6">
                  <label className="block font-medium text-emerald-900 mb-2">
                    Describe your situation:
                  </label>
                  <textarea 
                    value={practiceData.customScenario || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, customScenario: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                    rows={3}
                    placeholder="Describe a situation that's been challenging for you..."
                  />
                </div>
              )}

              {practiceScenario && (
                <div className="space-y-6">
                  <div className="p-4 bg-white border border-emerald-200 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Scenario:</h4>
                    <p className="text-emerald-800">{practiceScenario === 'custom' ? practiceData.customScenario : practiceScenario}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">⏸️ Step 1: PAUSE</h4>
                      <p className="text-emerald-700 mb-2">Take a moment to breathe. What do you notice in your body right now?</p>
                      <textarea 
                        value={practiceData.pauseResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, pauseResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={2}
                        placeholder="e.g., tension in shoulders, racing heart, tight jaw..."
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">🏷️ Step 2: LABEL</h4>
                      <p className="text-emerald-700 mb-2">What emotions are you experiencing? Be specific.</p>
                      
                      <div className="mb-3">
                        <p className="text-sm text-emerald-600 mb-2">Common emotions:</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {[...emotionCategories.primary, ...emotionCategories.midlife].map(emotion => (
                            <button
                              key={emotion}
                              onClick={() => {
                                const currentEmotions = practiceData.labeledEmotions || [];
                                const newEmotions = currentEmotions.includes(emotion)
                                  ? currentEmotions.filter((e: string) => e !== emotion)
                                  : [...currentEmotions, emotion];
                                const newData = { ...practiceData, labeledEmotions: newEmotions };
                                setPracticeData(newData);
                                updateResponses({ practiceData: newData });
                              }}
                              className={`px-3 py-1 rounded-full text-sm ${
                                (practiceData.labeledEmotions || []).includes(emotion)
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              }`}
                            >
                              {emotion}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        value={practiceData.labelResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, labelResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={2}
                        placeholder="Complete this: 'I notice I'm feeling...'"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">🔄 Step 3: SHIFT</h4>
                      <p className="text-emerald-700 mb-3">Choose a strategy to shift your perspective or response:</p>
                      
                      <div className="space-y-3 mb-4">
                        {shiftStrategies.map((strategy, index) => (
                          <div key={index} className="border border-emerald-200 rounded-lg p-3">
                            <label className="flex items-start space-x-3">
                              <input
                                type="radio"
                                name="shiftStrategy"
                                value={strategy.name}
                                checked={practiceData.selectedStrategy === strategy.name}
                                onChange={(e) => {
                                  const newData = { ...practiceData, selectedStrategy: e.target.value };
                                  setPracticeData(newData);
                                  updateResponses({ practiceData: newData });
                                }}
                                className="mt-1"
                              />
                              <div>
                                <div className="font-medium text-emerald-900">{strategy.name}</div>
                                <div className="text-sm text-emerald-700">{strategy.description}</div>
                                <div className="text-xs text-emerald-600 italic mt-1">{strategy.example}</div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <textarea 
                        value={practiceData.shiftResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, shiftResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={3}
                        placeholder="How would you apply this strategy to your situation? Write your reframed perspective..."
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => { setCurrentStep('reflection'); updateResponses({ currentStep: 'reflection' }); }}
                    disabled={!practiceData.pauseResponse || !practiceData.labelResponse || !practiceData.shiftResponse}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    Complete Practice Session
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'reflection' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">🎯 Practice Reflection</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    How did using this technique feel?
                  </label>
                  <textarea 
                    value={practiceData.feelingReflection || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, feelingReflection: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                    placeholder="Describe your experience using Pause-Label-Shift..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What was most challenging about this technique?
                  </label>
                  <textarea 
                    value={practiceData.challengeReflection || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, challengeReflection: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={2}
                    placeholder="What was difficult or felt unnatural?"
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    When will you practice this technique again?
                  </label>
                  <select 
                    value={practiceData.commitmentPlan || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, commitmentPlan: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Choose your commitment...</option>
                    <option value="daily">I'll practice this daily for the next week</option>
                    <option value="as-needed">I'll use it when I notice strong emotions</option>
                    <option value="weekly">I'll practice once a week with different scenarios</option>
                    <option value="situations">I'll identify 3 specific situations to practice with</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => onComplete('w3-technique', { 
                  practiceScenario, 
                  practiceData,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Technique Training
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Boundaries Worksheet
  if (component.id === 'w3-boundaries') {
    const [currentSection, setCurrentSection] = useState(responses.currentSection || 'assessment');
    const [boundaryTypes, setBoundaryTypes] = useState(responses.boundaryTypes || {});
    const [situations, setSituations] = useState(responses.situations || []);
    const [scripts, setScripts] = useState(responses.scripts || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const boundaryAreas = [
      {
        id: 'time',
        name: 'Time Boundaries',
        description: 'Protecting your time and energy',
        examples: ['Setting work hours', 'Limiting social commitments', 'Saying no to requests'],
        difficulty: boundaryTypes.time || 1
      },
      {
        id: 'emotional',
        name: 'Emotional Boundaries',
        description: 'Protecting your emotional well-being',
        examples: ['Not absorbing others\' stress', 'Limiting negative conversations', 'Taking breaks from draining people'],
        difficulty: boundaryTypes.emotional || 1
      },
      {
        id: 'physical',
        name: 'Physical Boundaries',
        description: 'Protecting your personal space and body',
        examples: ['Comfortable personal space', 'Appropriate touch', 'Your living environment'],
        difficulty: boundaryTypes.physical || 1
      },
      {
        id: 'digital',
        name: 'Digital Boundaries',
        description: 'Managing technology and online interactions',
        examples: ['Screen time limits', 'Social media breaks', 'Email response times'],
        difficulty: boundaryTypes.digital || 1
      },
      {
        id: 'family',
        name: 'Family Boundaries',
        description: 'Healthy limits with family members',
        examples: ['Adult children relationships', 'Extended family expectations', 'Holiday obligations'],
        difficulty: boundaryTypes.family || 1
      },
      {
        id: 'financial',
        name: 'Financial Boundaries',
        description: 'Protecting your financial resources',
        examples: ['Lending money', 'Gift-giving limits', 'Sharing financial information'],
        difficulty: boundaryTypes.financial || 1
      }
    ];

    const updateBoundaryDifficulty = (area: string, difficulty: number) => {
      const newTypes = { ...boundaryTypes, [area]: difficulty };
      setBoundaryTypes(newTypes);
      updateResponses({ boundaryTypes: newTypes });
    };

    const addSituation = (situation: any) => {
      const newSituations = [...situations, situation];
      setSituations(newSituations);
      updateResponses({ situations: newSituations });
    };

    const updateScript = (area: string, script: string) => {
      const newScripts = { ...scripts, [area]: script };
      setScripts(newScripts);
      updateResponses({ scripts: newScripts });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-800 mb-4">🛡️ Boundaries Worksheet</h2>
          <p className="text-lg text-gray-600">
            Create healthy boundaries that protect your energy and well-being
          </p>
        </div>

        {currentSection === 'assessment' && (
          <div className="space-y-6">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-800 mb-4">Boundary Assessment</h3>
              <p className="text-pink-700 mb-4">
                Rate how difficult each type of boundary is for you to maintain (1 = very easy, 5 = very difficult):
              </p>
              
              <div className="space-y-4">
                {boundaryAreas.map(area => (
                  <div key={area.id} className="bg-white border border-pink-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-pink-900">{area.name}</h4>
                        <p className="text-sm text-pink-700">{area.description}</p>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(level => (
                          <button
                            key={level}
                            onClick={() => updateBoundaryDifficulty(area.id, level)}
                            className={`w-8 h-8 rounded-full text-sm font-medium ${
                              area.difficulty === level
                                ? 'bg-pink-600 text-white' 
                                : 'bg-gray-200 hover:bg-pink-100'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-pink-600">
                      Examples: {area.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentSection('situations'); updateResponses({ currentSection: 'situations' }); }}
                className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded-lg"
              >
                Continue to Specific Situations
              </button>
            </div>
          </div>
        )}

        {currentSection === 'situations' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">Identify Challenging Situations</h3>
              
              <div className="space-y-4">
                {boundaryAreas
                  .filter(area => area.difficulty >= 3)
                  .map(area => (
                    <div key={area.id} className="bg-white border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">{area.name}</h4>
                      <p className="text-orange-700 text-sm mb-3">
                        Describe a specific situation where you struggle with this boundary:
                      </p>
                      <textarea 
                        value={situations.find((s: any) => s.area === area.id)?.description || ''}
                        onChange={(e) => {
                          const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                          if (existingSituationIndex >= 0) {
                            const newSituations = [...situations];
                            newSituations[existingSituationIndex] = {
                              ...newSituations[existingSituationIndex],
                              description: e.target.value
                            };
                            setSituations(newSituations);
                            updateResponses({ situations: newSituations });
                          } else {
                            addSituation({
                              area: area.id,
                              description: e.target.value,
                              people: '',
                              consequences: ''
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg"
                        rows={2}
                        placeholder={`Example: "My adult daughter calls me every day to vent about work, and I feel drained but guilty if I don't answer..."`}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-orange-900 mb-1">Who is involved?</label>
                          <input 
                            value={situations.find((s: any) => s.area === area.id)?.people || ''}
                            onChange={(e) => {
                              const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                              if (existingSituationIndex >= 0) {
                                const newSituations = [...situations];
                                newSituations[existingSituationIndex] = {
                                  ...newSituations[existingSituationIndex],
                                  people: e.target.value
                                };
                                setSituations(newSituations);
                                updateResponses({ situations: newSituations });
                              }
                            }}
                            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
                            placeholder="Family member, friend, colleague..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-900 mb-1">What happens when you don't set boundaries?</label>
                          <input 
                            value={situations.find((s: any) => s.area === area.id)?.consequences || ''}
                            onChange={(e) => {
                              const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                              if (existingSituationIndex >= 0) {
                                const newSituations = [...situations];
                                newSituations[existingSituationIndex] = {
                                  ...newSituations[existingSituationIndex],
                                  consequences: e.target.value
                                };
                                setSituations(newSituations);
                                updateResponses({ situations: newSituations });
                              }
                            }}
                            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
                            placeholder="Exhaustion, resentment, stress..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button 
                onClick={() => { setCurrentSection('scripts'); updateResponses({ currentSection: 'scripts' }); }}
                className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-lg"
              >
                Create Boundary Scripts
              </button>
            </div>
          </div>
        )}

        {currentSection === 'scripts' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Boundary Setting Scripts</h3>
              <p className="text-green-700 mb-4">
                Create scripts for setting boundaries in your challenging situations:
              </p>
              
              <div className="space-y-4">
                {situations.map((situation: any, index: number) => {
                  const area = boundaryAreas.find(a => a.id === situation.area);
                  if (!area) return null;
                  
                  return (
                    <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">{area.name}</h4>
                      <p className="text-sm text-green-700 mb-3">{situation.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            Gentle but firm script:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_gentle`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_gentle`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"I love you and want to support you, but I need to limit our daily calls to 20 minutes so I can manage my own stress levels."`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            If pushback occurs:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_firm`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_firm`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"I understand you're disappointed, but this boundary is important for my well-being. I'm available to talk on Tuesdays and Thursdays."`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            Alternative/compromise:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_alternative`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_alternative`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"Instead of daily calls, how about we schedule a longer conversation twice a week when I can give you my full attention?"`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Boundary Setting Tips:</h4>
                <ul className="space-y-1 text-green-800 text-sm">
                  <li>• Use "I" statements to express your needs</li>
                  <li>• Be specific about what you need</li>
                  <li>• Offer alternatives when possible</li>
                  <li>• Stay calm and compassionate but firm</li>
                  <li>• Remember: boundaries are self-care, not selfishness</li>
                </ul>
              </div>

              <button 
                onClick={() => onComplete('w3-boundaries', { 
                  boundaryTypes, 
                  situations, 
                  scripts,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Boundaries Worksheet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Weekly Mood Map
  if (component.id === 'w3-mood-map') {
    const [selectedDay, setSelectedDay] = useState(responses.selectedDay || 0);
    const [moodData, setMoodData] = useState(responses.moodData || Array(7).fill(null).map(() => ({
      morning: { mood: 5, energy: 5, notes: '' },
      afternoon: { mood: 5, energy: 5, notes: '' },
      evening: { mood: 5, energy: 5, notes: '' }
    })));
    const [patterns, setPatterns] = useState(responses.patterns || '');
    const [insights, setInsights] = useState(responses.insights || '');

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeOfDay = ['morning', 'afternoon', 'evening'];
    const moodLabels = {
      1: 'Very Low',
      2: 'Low', 
      3: 'Below Average',
      4: 'Average',
      5: 'Good',
      6: 'High',
      7: 'Very High',
      8: 'Excellent',
      9: 'Amazing',
      10: 'Peak'
    };

    const updateMoodData = (dayIndex: number, time: string, field: string, value: any) => {
      const newData = [...moodData];
      newData[dayIndex] = {
        ...newData[dayIndex],
        [time]: {
          ...newData[dayIndex][time],
          [field]: value
        }
      };
      setMoodData(newData);
      updateResponses({ moodData: newData });
    };

    const getMoodColor = (mood: number) => {
      if (mood <= 3) return 'bg-red-200 border-red-400';
      if (mood <= 5) return 'bg-yellow-200 border-yellow-400';
      if (mood <= 7) return 'bg-green-200 border-green-400';
      return 'bg-blue-200 border-blue-400';
    };

    const getAverageMood = () => {
      const allMoods = moodData.flatMap(day => [day.morning.mood, day.afternoon.mood, day.evening.mood]);
      return (allMoods.reduce((sum, mood) => sum + mood, 0) / allMoods.length).toFixed(1);
    };

    const getAverageEnergy = () => {
      const allEnergy = moodData.flatMap(day => [day.morning.energy, day.afternoon.energy, day.evening.energy]);
      return (allEnergy.reduce((sum, energy) => sum + energy, 0) / allEnergy.length).toFixed(1);
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-violet-800 mb-4">📈 Weekly Mood Map</h2>
          <p className="text-lg text-gray-600">
            Track your emotional patterns throughout the week to identify trends and triggers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 sticky top-4">
              <h3 className="font-semibold text-violet-800 mb-3">Select Day</h3>
              <div className="space-y-2">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedDay === index
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white border-violet-200 hover:border-violet-300'
                    }`}
                  >
                    <div className="font-medium">{day}</div>
                    {moodData[index] && (
                      <div className="text-xs opacity-75 mt-1">
                        Avg Mood: {((moodData[index].morning.mood + moodData[index].afternoon.mood + moodData[index].evening.mood) / 3).toFixed(1)}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-3 bg-white border border-violet-200 rounded-lg">
                <h4 className="font-semibold text-violet-800 mb-2">Weekly Averages</h4>
                <div className="space-y-1 text-sm">
                  <div>Mood: {getAverageMood()}/10</div>
                  <div>Energy: {getAverageEnergy()}/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tracking */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-violet-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-violet-800 mb-4">
                {days[selectedDay]} Tracking
              </h3>

              <div className="space-y-6">
                {timeOfDay.map(time => (
                  <div key={time} className={`p-4 rounded-lg border-2 ${getMoodColor(moodData[selectedDay][time].mood)}`}>
                    <h4 className="font-semibold text-gray-800 mb-3 capitalize">{time}</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mood Level (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData[selectedDay][time].mood}
                          onChange={(e) => updateMoodData(selectedDay, time, 'mood', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Low</span>
                          <span className="font-medium">{moodData[selectedDay][time].mood} - {moodLabels[moodData[selectedDay][time].mood as keyof typeof moodLabels]}</span>
                          <span>High</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Energy Level (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData[selectedDay][time].energy}
                          onChange={(e) => updateMoodData(selectedDay, time, 'energy', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Drained</span>
                          <span className="font-medium">{moodData[selectedDay][time].energy}</span>
                          <span>Energized</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (events, triggers, thoughts)
                      </label>
                      <textarea
                        value={moodData[selectedDay][time].notes}
                        onChange={(e) => updateMoodData(selectedDay, time, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="What happened? How did you feel? Any triggers or positive moments?"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern Analysis */}
            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Pattern Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-indigo-900 mb-2">
                    What patterns do you notice in your mood and energy?
                  </label>
                  <textarea
                    value={patterns}
                    onChange={(e) => { setPatterns(e.target.value); updateResponses({ patterns: e.target.value }); }}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg"
                    rows={3}
                    placeholder="e.g., Lower energy in the afternoons, better mood on weekends, stress impacts Tuesday mornings..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-indigo-900 mb-2">
                    What insights can you draw from this week's data?
                  </label>
                  <textarea
                    value={insights}
                    onChange={(e) => { setInsights(e.target.value); updateResponses({ insights: e.target.value }); }}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg"
                    rows={3}
                    placeholder="What triggers affect you most? When are you happiest? What helps boost your mood?"
                  />
                </div>
              </div>

              <button 
                onClick={() => onComplete('w3-mood-map', { 
                  moodData, 
                  patterns, 
                  insights,
                  averageMood: getAverageMood(),
                  averageEnergy: getAverageEnergy(),
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Mood Map
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Week 5: Enhanced Cognitive Clarity Assessment - Using Fresh Component
  if (component.id === 'w5-assessment') {
    return <CognitiveAssessmentFresh onComplete={onComplete} onClose={onClose} />;
  }

  // Default fallback for any other components
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {component.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">{component.title}</h3>
            <p className="text-gray-600 mb-6">{component.description}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => onComplete(component.id, { completed: true })}>
                Mark Complete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

