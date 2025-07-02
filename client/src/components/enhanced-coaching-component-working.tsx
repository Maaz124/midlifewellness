import { useState, useEffect } from 'react';
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

  // Week 5: Cognitive Clarity Assessment
  if (component.id === 'w5-assessment') {
    const [currentSection, setCurrentSection] = useState(responses.currentSection || 'memory');
    const [memoryAssessment, setMemoryAssessment] = useState(responses.memoryAssessment || {});
    const [focusAssessment, setFocusAssessment] = useState(responses.focusAssessment || {});
    const [clarityAssessment, setClarityAssessment] = useState(responses.clarityAssessment || {});
    const [cognitiveProfile, setCognitiveProfile] = useState(responses.cognitiveProfile || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const memoryQuestions = [
      {
        id: 'short-term',
        question: 'How often do you forget where you put things (keys, phone, glasses)?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
        context: 'Short-term memory challenges are common during hormonal transitions',
        tips: 'Designated spots for important items can help reduce this stress'
      },
      {
        id: 'names-faces',
        question: 'How often do you forget names or faces of people you\'ve recently met?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
        context: 'Social memory can be affected by stress and hormonal changes',
        tips: 'Repeating names aloud and making mental associations can improve retention'
      },
      {
        id: 'appointments',
        question: 'How often do you forget appointments or important dates without reminders?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
        context: 'Prospective memory (remembering to do things) is often impacted first',
        tips: 'Digital calendars with multiple alerts can provide reliable backup support'
      },
      {
        id: 'word-finding',
        question: 'How often do you have trouble finding the right word in conversation?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
        context: 'Word retrieval difficulties often fluctuate with hormonal cycles',
        tips: 'Reading regularly and doing crosswords can help maintain verbal fluency'
      },
      {
        id: 'multistep-tasks',
        question: 'How often do you lose track of multi-step tasks or instructions?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
        context: 'Working memory capacity can be reduced during periods of high stress',
        tips: 'Breaking complex tasks into smaller steps and writing them down helps'
      },
      {
        id: 'recent-changes',
        question: 'Compared to 2-3 years ago, how would you rate your overall memory?',
        scale: ['Much better', 'Somewhat better', 'About the same', 'Somewhat worse', 'Much worse'],
        context: 'Tracking changes over time helps identify patterns and improvements',
        tips: 'Memory changes are often temporary and can improve with targeted strategies'
      }
    ];

    const focusQuestions = [
      {
        id: 'attention-span',
        question: 'How long can you typically focus on a demanding task without distraction?',
        scale: ['2+ hours', '1-2 hours', '30-60 min', '15-30 min', 'Less than 15 min'],
        context: 'Sustained attention often decreases during hormonal fluctuations',
        tips: 'The Pomodoro Technique (25-minute focused blocks) can help rebuild concentration'
      },
      {
        id: 'task-switching',
        question: 'How easily can you switch between different tasks without losing momentum?',
        scale: ['Very easily', 'Easily', 'Moderately', 'With difficulty', 'Very difficult'],
        context: 'Executive function flexibility can be impacted by stress and hormones',
        tips: 'Creating transition rituals between tasks can improve mental flexibility'
      },
      {
        id: 'digital-distraction',
        question: 'How often do digital notifications/devices interrupt your focus?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'],
        context: 'Digital distractions compound natural attention challenges during midlife',
        tips: 'Use Do Not Disturb modes and app timers to create focused work environments'
      },
      {
        id: 'mental-fatigue',
        question: 'How often do you experience mental fatigue by mid-afternoon?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
        context: 'Afternoon cognitive dips are common and often relate to blood sugar and cortisol',
        tips: 'Protein-rich lunches and brief walks can help maintain afternoon mental energy'
      },
      {
        id: 'concentration',
        question: 'How would you rate your ability to concentrate during important conversations?',
        scale: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
        context: 'Social focus requires working memory and attention - both can be affected by stress',
        tips: 'Active listening techniques like summarizing can improve conversation focus'
      },
      {
        id: 'environment-focus',
        question: 'How much do environmental factors (noise, lighting, temperature) affect your ability to focus?',
        scale: ['Not at all', 'Slightly', 'Moderately', 'Significantly', 'Extremely'],
        context: 'Sensitivity to environmental factors often increases during midlife transitions',
        tips: 'Creating optimal environments becomes more important for cognitive performance'
      }
    ];

    const clarityQuestions = [
      {
        id: 'decision-making',
        question: 'How clear and confident are you when making important decisions?',
        scale: ['Very confident', 'Confident', 'Somewhat confident', 'Uncertain', 'Very uncertain'],
        context: 'Decision-making confidence often decreases when cognitive resources are strained',
        tips: 'Pro-and-con lists and trusted advisor input can support clearer decision-making'
      },
      {
        id: 'mental-fog',
        question: 'How often do you experience "brain fog" or mental cloudiness?',
        scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
        context: 'Brain fog is one of the most common complaints during perimenopause and midlife stress',
        tips: 'Hydration, quality sleep, and reducing inflammation can significantly improve mental clarity'
      },
      {
        id: 'problem-solving',
        question: 'How quickly can you work through complex problems compared to a few years ago?',
        scale: ['Much faster', 'Faster', 'Same', 'Slower', 'Much slower'],
        context: 'Processing speed naturally varies but shouldn\'t dramatically decline in midlife',
        tips: 'Breaking problems into smaller steps can compensate for any processing changes'
      },
      {
        id: 'creativity',
        question: 'How would you rate your current creative thinking and new idea generation?',
        scale: ['Very high', 'High', 'Moderate', 'Low', 'Very low'],
        context: 'Creativity often benefits from reduced stress and increased mental space',
        tips: 'Regular breaks, diverse experiences, and reduced multitasking can boost creativity'
      },
      {
        id: 'mental-organization',
        question: 'How organized do your thoughts feel throughout the day?',
        scale: ['Very organized', 'Organized', 'Somewhat organized', 'Disorganized', 'Very disorganized'],
        context: 'Mental organization requires cognitive resources that may be overtaxed during transitions',
        tips: 'External organization systems can free up mental space for clearer thinking'
      },
      {
        id: 'learning-retention',
        question: 'How well do you retain new information compared to a few years ago?',
        scale: ['Much better', 'Better', 'About the same', 'Worse', 'Much worse'],
        context: 'Learning and retention can be affected by stress, sleep quality, and hormonal changes',
        tips: 'Spaced repetition and connecting new info to existing knowledge improves retention'
      }
    ];

    const updateAssessment = (section: string, questionId: string, value: number) => {
      if (section === 'memory') {
        const newAssessment = { ...memoryAssessment, [questionId]: value };
        setMemoryAssessment(newAssessment);
        updateResponses({ memoryAssessment: newAssessment });
      } else if (section === 'focus') {
        const newAssessment = { ...focusAssessment, [questionId]: value };
        setFocusAssessment(newAssessment);
        updateResponses({ focusAssessment: newAssessment });
      } else if (section === 'clarity') {
        const newAssessment = { ...clarityAssessment, [questionId]: value };
        setClarityAssessment(newAssessment);
        updateResponses({ clarityAssessment: newAssessment });
      }
    };

    const calculateScore = (assessment: any, reverse = false) => {
      const values = Object.values(assessment);
      if (values.length === 0) return 0;
      const sum = values.reduce((a: any, b: any) => a + b, 0);
      const avg = sum / values.length;
      return reverse ? 6 - avg : avg;
    };

    const generateProfile = () => {
      const memoryScore = calculateScore(memoryAssessment, true);
      const focusScore = calculateScore(focusAssessment, true);
      const clarityScore = calculateScore(clarityAssessment, true);
      const overallScore = (memoryScore + focusScore + clarityScore) / 3;

      const profile = {
        memoryScore: memoryScore.toFixed(1),
        focusScore: focusScore.toFixed(1),
        clarityScore: clarityScore.toFixed(1),
        overallScore: overallScore.toFixed(1),
        strengths: [],
        challenges: [],
        recommendations: []
      };

      // Identify strengths and challenges
      if (memoryScore >= 4) profile.strengths.push('Strong memory function');
      else if (memoryScore <= 2.5) profile.challenges.push('Memory concerns');

      if (focusScore >= 4) profile.strengths.push('Good focus and attention');
      else if (focusScore <= 2.5) profile.challenges.push('Focus and attention difficulties');

      if (clarityScore >= 4) profile.strengths.push('Clear thinking and decision-making');
      else if (clarityScore <= 2.5) profile.challenges.push('Mental clarity issues');

      // Generate recommendations
      if (memoryScore <= 3) {
        profile.recommendations.push('Practice memory techniques like visualization and association');
        profile.recommendations.push('Consider omega-3 supplements and regular exercise');
      }
      
      if (focusScore <= 3) {
        profile.recommendations.push('Implement focused work blocks with regular breaks');
        profile.recommendations.push('Reduce digital distractions during important tasks');
      }
      
      if (clarityScore <= 3) {
        profile.recommendations.push('Prioritize quality sleep and stress management');
        profile.recommendations.push('Consider mindfulness meditation for mental clarity');
      }

      setCognitiveProfile(profile);
      updateResponses({ cognitiveProfile: profile });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 5
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">🧠 Enhanced Cognitive Clarity Assessment</h2>
          <p className="text-lg text-gray-600">
            Comprehensive evaluation of your cognitive function with real-time insights and personalized tips
          </p>
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✨ NEW: Each question now includes educational context and instant tips to help you understand and improve your cognitive health!
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['memory', 'focus', 'clarity', 'results'].map((section) => (
              <button
                key={section}
                onClick={() => { setCurrentSection(section); updateResponses({ currentSection: section }); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentSection === section
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {currentSection === 'memory' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                🎯 ENHANCED: Questions now include educational context and personalized tips that appear when you select an answer!
              </p>
            </div>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Memory Function Assessment</h3>
            <p className="text-blue-700 mb-6">
              Rate how often you experience these memory-related situations. Each question includes context about why this matters for midlife women:
            </p>
            
            <div className="space-y-6">
              {memoryQuestions.map((q, index) => (
                <div key={q.id} className="bg-white border border-blue-200 rounded-lg p-5">
                  <div className="mb-4">
                    <p className="font-semibold text-blue-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                    <p className="text-sm text-blue-700 mb-2 italic">💡 {q.context}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {q.scale.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => updateAssessment('memory', q.id, optionIndex + 1)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                          memoryAssessment[q.id] === optionIndex + 1
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {memoryAssessment[q.id] && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setCurrentSection('focus'); updateResponses({ currentSection: 'focus' }); }}
              disabled={Object.keys(memoryAssessment).length !== memoryQuestions.length}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Continue to Focus Assessment
            </button>
          </div>
        )}

        {currentSection === 'focus' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Focus & Attention Assessment</h3>
            <p className="text-green-700 mb-6">
              Evaluate your current focus and attention capabilities:
            </p>
            
            <div className="space-y-6">
              {focusQuestions.map((q, index) => (
                <div key={q.id} className="bg-white border border-green-200 rounded-lg p-5">
                  <div className="mb-4">
                    <p className="font-semibold text-green-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                    <p className="text-sm text-green-700 mb-2 italic">💡 {q.context}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {q.scale.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => updateAssessment('focus', q.id, optionIndex + 1)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                          focusAssessment[q.id] === optionIndex + 1
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {focusAssessment[q.id] && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setCurrentSection('clarity'); updateResponses({ currentSection: 'clarity' }); }}
              disabled={Object.keys(focusAssessment).length !== focusQuestions.length}
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Continue to Clarity Assessment
            </button>
          </div>
        )}

        {currentSection === 'clarity' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">Mental Clarity Assessment</h3>
            <p className="text-orange-700 mb-6">
              Assess your current mental clarity and cognitive processing:
            </p>
            
            <div className="space-y-6">
              {clarityQuestions.map((q, index) => (
                <div key={q.id} className="bg-white border border-orange-200 rounded-lg p-5">
                  <div className="mb-4">
                    <p className="font-semibold text-orange-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                    <p className="text-sm text-orange-700 mb-2 italic">💡 {q.context}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {q.scale.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => updateAssessment('clarity', q.id, optionIndex + 1)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                          clarityAssessment[q.id] === optionIndex + 1
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-md'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {clarityAssessment[q.id] && (
                    <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { 
                generateProfile(); 
                setCurrentSection('results'); 
                updateResponses({ currentSection: 'results' }); 
              }}
              disabled={Object.keys(clarityAssessment).length !== clarityQuestions.length}
              className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Generate Your Cognitive Profile
            </button>
          </div>
        )}

        {currentSection === 'results' && cognitiveProfile.overallScore && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Your Cognitive Profile</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-purple-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-900">Memory</h4>
                  <div className="text-2xl font-bold text-purple-600">{cognitiveProfile.memoryScore}/5</div>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-900">Focus</h4>
                  <div className="text-2xl font-bold text-purple-600">{cognitiveProfile.focusScore}/5</div>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-900">Clarity</h4>
                  <div className="text-2xl font-bold text-purple-600">{cognitiveProfile.clarityScore}/5</div>
                </div>
              </div>

              <div className="bg-white border border-purple-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-purple-900 mb-2">Overall Cognitive Score</h4>
                <div className="text-3xl font-bold text-purple-600 text-center">{cognitiveProfile.overallScore}/5</div>
              </div>

              {cognitiveProfile.strengths.length > 0 && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Your Cognitive Strengths:</h4>
                  <ul className="space-y-1">
                    {cognitiveProfile.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-green-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cognitiveProfile.challenges.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Areas for Improvement:</h4>
                  <ul className="space-y-1">
                    {cognitiveProfile.challenges.map((challenge: string, index: number) => (
                      <li key={index} className="text-yellow-700">• {challenge}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Personalized Recommendations:</h4>
                <ul className="space-y-1">
                  {cognitiveProfile.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-blue-700">• {rec}</li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => onComplete('w5-assessment', { 
                  memoryAssessment, 
                  focusAssessment, 
                  clarityAssessment, 
                  cognitiveProfile,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 5: Focus & Memory Rituals
  if (component.id === 'w5-rituals') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'selection');
    const [selectedRituals, setSelectedRituals] = useState(responses.selectedRituals || []);
    const [customSchedule, setCustomSchedule] = useState(responses.customSchedule || {});
    const [practiceData, setPracticeData] = useState(responses.practiceData || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const cognitiveRituals = [
      {
        id: 'morning-clarity',
        name: 'Morning Mental Clarity Routine',
        duration: '10-15 minutes',
        category: 'morning',
        description: 'Start your day with focused attention and clear intentions',
        steps: [
          '2 minutes deep breathing to oxygenate the brain',
          '3 minutes meditation or mindfulness practice',
          'Set 3 clear intentions for the day',
          'Review your top priority tasks',
          'Visualize successful completion of key activities'
        ],
        benefits: ['Enhanced focus', 'Reduced morning brain fog', 'Better decision-making']
      },
      {
        id: 'brain-training',
        name: 'Daily Brain Training Games',
        duration: '10-20 minutes',
        category: 'cognitive',
        description: 'Targeted exercises to improve memory, attention, and processing speed',
        steps: [
          'Memory games (matching, sequence recall)',
          'Attention training (selective focus exercises)',
          'Processing speed challenges (rapid decision tasks)',
          'Working memory exercises (mental math, pattern recognition)',
          'Track progress and adjust difficulty'
        ],
        benefits: ['Improved memory', 'Faster processing', 'Enhanced attention span']
      },
      {
        id: 'focus-blocks',
        name: 'Deep Focus Time Blocks',
        duration: '25-90 minutes',
        category: 'productivity',
        description: 'Structured periods of uninterrupted focus with strategic breaks',
        steps: [
          'Choose single important task',
          'Eliminate all distractions (phone, notifications)',
          'Set timer for focused work period',
          'Take strategic breaks every 25-45 minutes',
          'Review and celebrate progress'
        ],
        benefits: ['Deeper concentration', 'Higher quality work', 'Reduced mental fatigue']
      },
      {
        id: 'memory-palace',
        name: 'Memory Palace Technique',
        duration: '15-30 minutes',
        category: 'memory',
        description: 'Ancient technique for dramatically improving memory recall',
        steps: [
          'Choose a familiar location (your home, workplace)',
          'Identify specific landmarks or rooms',
          'Associate information with visual locations',
          'Practice walking through your memory palace',
          'Regular review and reinforcement'
        ],
        benefits: ['Exceptional memory improvement', 'Better information retention', 'Enhanced creativity']
      },
      {
        id: 'mindful-nutrition',
        name: 'Brain-Boosting Nutrition Timing',
        duration: '5-10 minutes',
        category: 'nutrition',
        description: 'Strategic eating and hydration for optimal cognitive function',
        steps: [
          'Morning: Protein-rich breakfast with healthy fats',
          'Mid-morning: Green tea or matcha for sustained focus',
          'Lunch: Balanced meal with omega-3 rich foods',
          'Afternoon: Brain-healthy snack (nuts, berries)',
          'Evening: Light, nutrient-dense dinner'
        ],
        benefits: ['Sustained energy', 'Reduced brain fog', 'Better memory consolidation']
      },
      {
        id: 'cognitive-break',
        name: 'Cognitive Reset Breaks',
        duration: '3-5 minutes',
        category: 'breaks',
        description: 'Quick mental recharge techniques throughout the day',
        steps: [
          'Step away from current task',
          'Take 10 deep breaths',
          'Do brief physical movement (stretching, walking)',
          'Practice gratitude or positive visualization',
          'Return to task with fresh perspective'
        ],
        benefits: ['Renewed focus', 'Reduced mental fatigue', 'Enhanced creativity']
      }
    ];

    const timeSlots = [
      { id: 'early-morning', name: 'Early Morning (6-8 AM)', description: 'Peak cognitive performance time' },
      { id: 'morning', name: 'Morning (8-11 AM)', description: 'High focus and energy period' },
      { id: 'late-morning', name: 'Late Morning (11 AM-1 PM)', description: 'Good for detail-oriented tasks' },
      { id: 'afternoon', name: 'Afternoon (1-4 PM)', description: 'Creative and collaborative time' },
      { id: 'evening', name: 'Evening (4-7 PM)', description: 'Review and reflection period' },
      { id: 'night', name: 'Night (7-10 PM)', description: 'Relaxation and preparation time' }
    ];

    const toggleRitual = (ritualId: string) => {
      const newSelected = selectedRituals.includes(ritualId)
        ? selectedRituals.filter((id: string) => id !== ritualId)
        : [...selectedRituals, ritualId];
      setSelectedRituals(newSelected);
      updateResponses({ selectedRituals: newSelected });
    };

    const updateSchedule = (ritualId: string, timeSlot: string) => {
      const newSchedule = { ...customSchedule, [ritualId]: timeSlot };
      setCustomSchedule(newSchedule);
      updateResponses({ customSchedule: newSchedule });
    };

    const updatePracticeData = (field: string, value: any) => {
      const newData = { ...practiceData, [field]: value };
      setPracticeData(newData);
      updateResponses({ practiceData: newData });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 5
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">🧘‍♀️ Focus & Memory Rituals</h2>
          <p className="text-lg text-gray-600">
            Design your personalized cognitive enhancement routine for optimal brain performance
          </p>
        </div>

        {currentStep === 'selection' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Choose Your Cognitive Rituals</h3>
              <p className="text-indigo-700 mb-6">
                Select 2-4 rituals that fit your lifestyle and cognitive goals:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {cognitiveRituals.map(ritual => (
                  <div 
                    key={ritual.id} 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRituals.includes(ritual.id)
                        ? 'border-indigo-500 bg-indigo-100'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                    onClick={() => toggleRitual(ritual.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-indigo-900">{ritual.name}</h4>
                      <span className="text-xs bg-indigo-200 px-2 py-1 rounded">{ritual.category}</span>
                    </div>
                    <p className="text-sm text-indigo-700 mb-2">{ritual.description}</p>
                    <p className="text-xs text-indigo-600 mb-3">Duration: {ritual.duration}</p>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-indigo-800 mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {ritual.benefits.map((benefit, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {selectedRituals.includes(ritual.id) && (
                      <div className="mt-3 p-2 bg-indigo-50 rounded">
                        <p className="text-xs font-medium text-indigo-800 mb-1">Steps:</p>
                        <ul className="text-xs text-indigo-700 space-y-1">
                          {ritual.steps.slice(0, 3).map((step, index) => (
                            <li key={index}>• {step}</li>
                          ))}
                          {ritual.steps.length > 3 && (
                            <li>• ... and {ritual.steps.length - 3} more steps</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentStep('schedule'); updateResponses({ currentStep: 'schedule' }); }}
                disabled={selectedRituals.length === 0}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Create Your Schedule ({selectedRituals.length} rituals selected)
              </button>
            </div>
          </div>
        )}

        {currentStep === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Schedule Your Rituals</h3>
              <p className="text-blue-700 mb-6">
                Assign optimal times for each of your selected rituals:
              </p>
              
              <div className="space-y-4">
                {selectedRituals.map((ritualId: string) => {
                  const ritual = cognitiveRituals.find(r => r.id === ritualId);
                  if (!ritual) return null;
                  
                  return (
                    <div key={ritualId} className="bg-white border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">{ritual.name}</h4>
                      <p className="text-sm text-blue-700 mb-3">Duration: {ritual.duration}</p>
                      
                      <div className="grid md:grid-cols-3 gap-2">
                        {timeSlots.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => updateSchedule(ritualId, slot.id)}
                            className={`p-3 rounded-lg text-left transition-colors ${
                              customSchedule[ritualId] === slot.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            <div className="font-medium text-sm">{slot.name}</div>
                            <div className="text-xs opacity-75">{slot.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => { setCurrentStep('practice'); updateResponses({ currentStep: 'practice' }); }}
                disabled={Object.keys(customSchedule).length !== selectedRituals.length}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Start Practice Planning
              </button>
            </div>
          </div>
        )}

        {currentStep === 'practice' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Practice & Implementation Plan</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-green-900 mb-2">
                    What's your biggest cognitive challenge right now?
                  </label>
                  <select 
                    value={practiceData.primaryChallenge || ''}
                    onChange={(e) => updatePracticeData('primaryChallenge', e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg"
                  >
                    <option value="">Select your main challenge...</option>
                    <option value="focus">Difficulty maintaining focus</option>
                    <option value="memory">Memory lapses and forgetfulness</option>
                    <option value="brain-fog">Brain fog and mental cloudiness</option>
                    <option value="decision-fatigue">Decision fatigue and overwhelm</option>
                    <option value="attention-switching">Trouble switching between tasks</option>
                    <option value="creativity">Lack of creative thinking</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-green-900 mb-2">
                    How many days per week can you commit to these rituals?
                  </label>
                  <div className="flex gap-2">
                    {[3, 4, 5, 6, 7].map(days => (
                      <button
                        key={days}
                        onClick={() => updatePracticeData('commitmentDays', days)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          practiceData.commitmentDays === days
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-green-900 mb-2">
                    What time of day do you feel most mentally sharp?
                  </label>
                  <select 
                    value={practiceData.peakTime || ''}
                    onChange={(e) => updatePracticeData('peakTime', e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg"
                  >
                    <option value="">Select your peak time...</option>
                    <option value="early-morning">Early morning (6-8 AM)</option>
                    <option value="morning">Morning (8-11 AM)</option>
                    <option value="late-morning">Late morning (11 AM-1 PM)</option>
                    <option value="afternoon">Afternoon (1-4 PM)</option>
                    <option value="evening">Evening (4-7 PM)</option>
                    <option value="varies">It varies day to day</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-green-900 mb-2">
                    What obstacles might prevent you from maintaining these rituals?
                  </label>
                  <textarea 
                    value={practiceData.potentialObstacles || ''}
                    onChange={(e) => updatePracticeData('potentialObstacles', e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg"
                    rows={3}
                    placeholder="e.g., Busy mornings, irregular schedule, distractions at home..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-green-900 mb-2">
                    How will you track and measure your progress?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Daily mood and energy ratings',
                      'Weekly focus and memory self-assessment',
                      'Task completion quality and speed',
                      'Reduced brain fog episodes',
                      'Improved decision-making confidence'
                    ].map((option, index) => (
                      <label key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={(practiceData.trackingMethods || []).includes(option)}
                          onChange={(e) => {
                            const current = practiceData.trackingMethods || [];
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter((item: string) => item !== option);
                            updatePracticeData('trackingMethods', updated);
                          }}
                          className="rounded border-green-300"
                        />
                        <span className="text-green-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setCurrentStep('summary'); updateResponses({ currentStep: 'summary' }); }}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Generate Your Personal Plan
              </button>
            </div>
          </div>
        )}

        {currentStep === 'summary' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Your Personalized Cognitive Enhancement Plan</h3>
              
              <div className="space-y-6">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Your Selected Rituals & Schedule</h4>
                  <div className="space-y-3">
                    {selectedRituals.map((ritualId: string) => {
                      const ritual = cognitiveRituals.find(r => r.id === ritualId);
                      const timeSlot = timeSlots.find(t => t.id === customSchedule[ritualId]);
                      if (!ritual || !timeSlot) return null;
                      
                      return (
                        <div key={ritualId} className="flex justify-between items-center p-3 bg-purple-50 rounded">
                          <div>
                            <div className="font-medium text-purple-900">{ritual.name}</div>
                            <div className="text-sm text-purple-700">{ritual.duration}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-purple-900">{timeSlot.name}</div>
                            <div className="text-sm text-purple-700">{timeSlot.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Implementation Strategy</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Primary Focus:</p>
                      <p className="text-purple-700">{practiceData.primaryChallenge}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Commitment:</p>
                      <p className="text-purple-700">{practiceData.commitmentDays} days per week</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Peak Performance Time:</p>
                      <p className="text-purple-700">{practiceData.peakTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Tracking Methods:</p>
                      <p className="text-purple-700">{(practiceData.trackingMethods || []).length} selected</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Success Tips</h4>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• Start with just one ritual and build gradually</li>
                    <li>• Set reminders on your phone for the first 2 weeks</li>
                    <li>• Track your progress daily for motivation</li>
                    <li>• Adjust timing if needed - consistency matters more than perfection</li>
                    <li>• Notice improvements in focus and memory after 1-2 weeks</li>
                  </ul>
                </div>

                {practiceData.potentialObstacles && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Obstacle Preparation</h4>
                    <p className="text-red-700 text-sm mb-2">You identified these potential challenges:</p>
                    <p className="text-red-700 italic">"{practiceData.potentialObstacles}"</p>
                    <p className="text-red-700 text-sm mt-2">
                      Consider creating backup mini-rituals (5-minute versions) for busy days.
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onComplete('w5-rituals', { 
                  selectedRituals, 
                  customSchedule, 
                  practiceData,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Save My Cognitive Enhancement Plan
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 5: Brain-Boosting Nutrition Plan
  if (component.id === 'w5-nutrition') {
    const [currentSection, setCurrentSection] = useState(responses.currentSection || 'assessment');
    const [nutritionProfile, setNutritionProfile] = useState(responses.nutritionProfile || {});
    const [mealPlan, setMealPlan] = useState(responses.mealPlan || {});
    const [supplementPlan, setSupplementPlan] = useState(responses.supplementPlan || []);
    const [hydrationPlan, setHydrationPlan] = useState(responses.hydrationPlan || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const brainFoods = {
      proteins: [
        { name: 'Wild-caught salmon', benefits: 'Omega-3 fatty acids for memory', serving: '4-6 oz, 2-3x/week' },
        { name: 'Eggs (with yolk)', benefits: 'Choline for neurotransmitter production', serving: '1-2 eggs daily' },
        { name: 'Greek yogurt', benefits: 'Probiotics for gut-brain connection', serving: '1 cup daily' },
        { name: 'Lean poultry', benefits: 'Tyrosine for focus and alertness', serving: '4-6 oz, 3-4x/week' }
      ],
      healthy_fats: [
        { name: 'Avocados', benefits: 'Monounsaturated fats for blood flow', serving: '1/2 avocado daily' },
        { name: 'Walnuts', benefits: 'ALA omega-3s for brain health', serving: '1 oz (7-9 halves) daily' },
        { name: 'Extra virgin olive oil', benefits: 'Antioxidants and healthy fats', serving: '1-2 tbsp daily' },
        { name: 'Dark chocolate (70%+)', benefits: 'Flavonoids for cognitive function', serving: '1 oz, 3-4x/week' }
      ],
      antioxidants: [
        { name: 'Blueberries', benefits: 'Anthocyanins for memory protection', serving: '1/2 cup daily' },
        { name: 'Leafy greens', benefits: 'Folate and vitamin K', serving: '2-3 cups daily' },
        { name: 'Turmeric', benefits: 'Curcumin for inflammation reduction', serving: '1 tsp daily with black pepper' },
        { name: 'Green tea', benefits: 'L-theanine and EGCG for focus', serving: '2-3 cups daily' }
      ],
      complex_carbs: [
        { name: 'Quinoa', benefits: 'B vitamins and steady glucose', serving: '1/2 cup cooked, 3-4x/week' },
        { name: 'Sweet potatoes', benefits: 'Beta-carotene and fiber', serving: '1 medium, 2-3x/week' },
        { name: 'Oats', benefits: 'Beta-glucan for sustained energy', serving: '1/2 cup dry, 3-4x/week' },
        { name: 'Beans and lentils', benefits: 'Protein and B vitamins', serving: '1/2 cup, 4-5x/week' }
      ]
    };

    const supplements = [
      { 
        name: 'Omega-3 (EPA/DHA)', 
        dosage: '1000-2000mg daily',
        benefits: 'Memory, mood, inflammation reduction',
        timing: 'With meals',
        evidence: 'Strong research support'
      },
      { 
        name: 'Vitamin D3', 
        dosage: '1000-4000 IU daily',
        benefits: 'Cognitive function, mood regulation',
        timing: 'With fat-containing meal',
        evidence: 'Good research support'
      },
      { 
        name: 'B-Complex', 
        dosage: 'As directed on label',
        benefits: 'Energy metabolism, neurotransmitter production',
        timing: 'Morning with breakfast',
        evidence: 'Established benefits'
      },
      { 
        name: 'Magnesium Glycinate', 
        dosage: '200-400mg daily',
        benefits: 'Stress reduction, sleep quality, focus',
        timing: 'Evening',
        evidence: 'Well-documented'
      },
      { 
        name: 'Phosphatidylserine', 
        dosage: '100-300mg daily',
        benefits: 'Memory, cognitive processing speed',
        timing: 'With meals',
        evidence: 'Moderate research support'
      },
      { 
        name: 'Lion\'s Mane Mushroom', 
        dosage: '500-1000mg daily',
        benefits: 'Nerve growth factor, neuroprotection',
        timing: 'With meals',
        evidence: 'Emerging research'
      }
    ];

    const updateProfile = (field: string, value: any) => {
      const newProfile = { ...nutritionProfile, [field]: value };
      setNutritionProfile(newProfile);
      updateResponses({ nutritionProfile: newProfile });
    };

    const updateMealPlan = (meal: string, foods: any[]) => {
      const newPlan = { ...mealPlan, [meal]: foods };
      setMealPlan(newPlan);
      updateResponses({ mealPlan: newPlan });
    };

    const toggleSupplement = (supplement: any) => {
      const isSelected = supplementPlan.some((s: any) => s.name === supplement.name);
      const newPlan = isSelected
        ? supplementPlan.filter((s: any) => s.name !== supplement.name)
        : [...supplementPlan, supplement];
      setSupplementPlan(newPlan);
      updateResponses({ supplementPlan: newPlan });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 5
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4">🥗 Brain-Boosting Nutrition Plan</h2>
          <p className="text-lg text-gray-600">
            Create a personalized nutrition strategy to optimize cognitive function and memory
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['assessment', 'foods', 'supplements', 'plan'].map((section) => (
              <button
                key={section}
                onClick={() => { setCurrentSection(section); updateResponses({ currentSection: section }); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentSection === section
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {currentSection === 'assessment' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Nutrition Assessment</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-green-900 mb-2">
                  What are your main cognitive concerns?
                </label>
                <div className="space-y-2">
                  {[
                    'Memory lapses and forgetfulness',
                    'Afternoon energy crashes',
                    'Difficulty concentrating',
                    'Brain fog and mental cloudiness',
                    'Mood swings affecting thinking',
                    'Trouble with word-finding'
                  ].map((concern, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={(nutritionProfile.concerns || []).includes(concern)}
                        onChange={(e) => {
                          const current = nutritionProfile.concerns || [];
                          const updated = e.target.checked
                            ? [...current, concern]
                            : current.filter((c: string) => c !== concern);
                          updateProfile('concerns', updated);
                        }}
                        className="rounded border-green-300"
                      />
                      <span className="text-green-700">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-green-900 mb-2">
                  How would you describe your current eating pattern?
                </label>
                <select 
                  value={nutritionProfile.eatingPattern || ''}
                  onChange={(e) => updateProfile('eatingPattern', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg"
                >
                  <option value="">Select your pattern...</option>
                  <option value="regular-3-meals">Regular 3 meals with snacks</option>
                  <option value="intermittent-fasting">Intermittent fasting</option>
                  <option value="frequent-small">Frequent small meals</option>
                  <option value="irregular">Irregular, depends on schedule</option>
                  <option value="skip-meals">Often skip meals due to busyness</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-green-900 mb-2">
                  What time of day do you feel mentally sharpest?
                </label>
                <select 
                  value={nutritionProfile.peakCognition || ''}
                  onChange={(e) => updateProfile('peakCognition', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg"
                >
                  <option value="">Select your peak time...</option>
                  <option value="early-morning">Early morning (6-9 AM)</option>
                  <option value="mid-morning">Mid-morning (9 AM-12 PM)</option>
                  <option value="early-afternoon">Early afternoon (12-3 PM)</option>
                  <option value="late-afternoon">Late afternoon (3-6 PM)</option>
                  <option value="evening">Evening (6-9 PM)</option>
                  <option value="varies">Varies day to day</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-green-900 mb-2">
                  How many glasses of water do you typically drink daily?
                </label>
                <select 
                  value={nutritionProfile.hydration || ''}
                  onChange={(e) => updateProfile('hydration', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg"
                >
                  <option value="">Select amount...</option>
                  <option value="1-3">1-3 glasses</option>
                  <option value="4-6">4-6 glasses</option>
                  <option value="7-9">7-9 glasses</option>
                  <option value="10+">10+ glasses</option>
                  <option value="dont-track">I don't track water intake</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-green-900 mb-2">
                  Do you currently take any supplements?
                </label>
                <textarea 
                  value={nutritionProfile.currentSupplements || ''}
                  onChange={(e) => updateProfile('currentSupplements', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg"
                  rows={3}
                  placeholder="List any vitamins, minerals, or other supplements you currently take..."
                />
              </div>
            </div>

            <button 
              onClick={() => { setCurrentSection('foods'); updateResponses({ currentSection: 'foods' }); }}
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Explore Brain-Boosting Foods
            </button>
          </div>
        )}

        {currentSection === 'foods' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Choose Your Brain Foods</h3>
              <p className="text-blue-700 mb-6">
                Select foods you enjoy and can incorporate into your regular meals:
              </p>
              
              {Object.entries(brainFoods).map(([category, foods]) => (
                <div key={category} className="mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3 capitalize">
                    {category.replace('_', ' ')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {foods.map((food, index) => (
                      <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-blue-900">{food.name}</h5>
                          <button
                            onClick={() => {
                              const selectedFoods = mealPlan.selectedFoods || [];
                              const isSelected = selectedFoods.some((f: any) => f.name === food.name);
                              const updated = isSelected
                                ? selectedFoods.filter((f: any) => f.name !== food.name)
                                : [...selectedFoods, { ...food, category }];
                              updateMealPlan('selectedFoods', updated);
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              (mealPlan.selectedFoods || []).some((f: any) => f.name === food.name)
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {(mealPlan.selectedFoods || []).some((f: any) => f.name === food.name) ? 'Selected' : 'Select'}
                          </button>
                        </div>
                        <p className="text-sm text-blue-700 mb-1">{food.benefits}</p>
                        <p className="text-xs text-blue-600">Serving: {food.serving}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => { setCurrentSection('supplements'); updateResponses({ currentSection: 'supplements' }); }}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Review Supplement Options
              </button>
            </div>
          </div>
        )}

        {currentSection === 'supplements' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">Supplement Recommendations</h3>
            <p className="text-orange-700 mb-6">
              Select supplements that align with your cognitive goals and current regimen:
            </p>
            
            <div className="space-y-4">
              {supplements.map((supplement, index) => (
                <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-orange-900">{supplement.name}</h4>
                      <p className="text-sm text-orange-700">{supplement.benefits}</p>
                    </div>
                    <button
                      onClick={() => toggleSupplement(supplement)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        supplementPlan.some((s: any) => s.name === supplement.name)
                          ? 'bg-orange-600 text-white'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      {supplementPlan.some((s: any) => s.name === supplement.name) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-orange-800">Dosage:</span>
                      <p className="text-orange-700">{supplement.dosage}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-800">Timing:</span>
                      <p className="text-orange-700">{supplement.timing}</p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-800">Evidence:</span>
                      <p className="text-orange-700">{supplement.evidence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h4>
              <ul className="space-y-1 text-yellow-700 text-sm">
                <li>• Consult with your healthcare provider before starting new supplements</li>
                <li>• Start with one supplement at a time to assess tolerance</li>
                <li>• Quality matters - choose third-party tested brands</li>
                <li>• Some supplements may interact with medications</li>
              </ul>
            </div>

            <button 
              onClick={() => { setCurrentSection('plan'); updateResponses({ currentSection: 'plan' }); }}
              className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-lg"
            >
              Create Your Nutrition Plan
            </button>
          </div>
        )}

        {currentSection === 'plan' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Your Personalized Brain Nutrition Plan</h3>
              
              <div className="space-y-6">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Selected Brain Foods</h4>
                  {(mealPlan.selectedFoods || []).length > 0 ? (
                    <div className="space-y-2">
                      {(mealPlan.selectedFoods || []).map((food: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                          <div>
                            <span className="font-medium text-purple-900">{food.name}</span>
                            <span className="text-sm text-purple-700 ml-2">({food.category.replace('_', ' ')})</span>
                          </div>
                          <span className="text-sm text-purple-600">{food.serving}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-700">No foods selected yet. Return to the Foods section to make selections.</p>
                  )}
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Supplement Protocol</h4>
                  {supplementPlan.length > 0 ? (
                    <div className="space-y-2">
                      {supplementPlan.map((supplement: any, index: number) => (
                        <div key={index} className="p-2 bg-purple-50 rounded">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-purple-900">{supplement.name}</span>
                            <span className="text-sm text-purple-600">{supplement.dosage}</span>
                          </div>
                          <p className="text-sm text-purple-700">{supplement.timing}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-700">No supplements selected. Return to Supplements section if interested.</p>
                  )}
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Hydration Strategy</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-medium text-purple-800 mb-2">Daily water goal:</label>
                      <select 
                        value={hydrationPlan.dailyGoal || ''}
                        onChange={(e) => {
                          const newPlan = { ...hydrationPlan, dailyGoal: e.target.value };
                          setHydrationPlan(newPlan);
                          updateResponses({ hydrationPlan: newPlan });
                        }}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                      >
                        <option value="">Select daily goal...</option>
                        <option value="8-glasses">8 glasses (64 oz)</option>
                        <option value="10-glasses">10 glasses (80 oz)</option>
                        <option value="12-glasses">12 glasses (96 oz)</option>
                        <option value="half-body-weight">Half body weight in ounces</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium text-purple-800 mb-2">Timing strategy:</label>
                      <div className="space-y-2">
                        {[
                          'Large glass upon waking',
                          'Water before each meal',
                          'Herbal tea mid-morning and afternoon',
                          'Water bottle at desk as reminder'
                        ].map((strategy, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={(hydrationPlan.strategies || []).includes(strategy)}
                              onChange={(e) => {
                                const current = hydrationPlan.strategies || [];
                                const updated = e.target.checked
                                  ? [...current, strategy]
                                  : current.filter((s: string) => s !== strategy);
                                const newPlan = { ...hydrationPlan, strategies: updated };
                                setHydrationPlan(newPlan);
                                updateResponses({ hydrationPlan: newPlan });
                              }}
                              className="rounded border-purple-300"
                            />
                            <span className="text-purple-700">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Implementation Tips</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Start by adding 1-2 brain foods to meals you already enjoy</li>
                    <li>• Meal prep brain-healthy snacks for busy days</li>
                    <li>• Keep a water bottle visible as a hydration reminder</li>
                    <li>• Track energy and focus changes in a simple journal</li>
                    <li>• Allow 2-4 weeks to notice cognitive improvements</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => onComplete('w5-nutrition', { 
                  nutritionProfile, 
                  mealPlan, 
                  supplementPlan, 
                  hydrationPlan,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Save My Nutrition Plan
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 5: Mind Management System
  if (component.id === 'w5-mind-management') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'dump');
    const [brainDumpData, setBrainDumpData] = useState(responses.brainDumpData || []);
    const [priorities, setPriorities] = useState(responses.priorities || { urgent: [], important: [], delegate: [], eliminate: [] });
    const [organizationSystem, setOrganizationSystem] = useState(responses.organizationSystem || {});
    const [implementationPlan, setImplementationPlan] = useState(responses.implementationPlan || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const addBrainDumpItem = (item: string, category: string) => {
      if (item.trim()) {
        const newItem = {
          id: Date.now(),
          text: item.trim(),
          category,
          completed: false,
          priority: 'medium'
        };
        const newData = [...brainDumpData, newItem];
        setBrainDumpData(newData);
        updateResponses({ brainDumpData: newData });
      }
    };

    const updateItemPriority = (itemId: number, newPriority: string) => {
      const updatedData = brainDumpData.map((item: any) => 
        item.id === itemId ? { ...item, priority: newPriority } : item
      );
      setBrainDumpData(updatedData);
      updateResponses({ brainDumpData: updatedData });
    };

    const categorizePriorities = () => {
      const categorized = {
        urgent: brainDumpData.filter((item: any) => item.priority === 'urgent'),
        important: brainDumpData.filter((item: any) => item.priority === 'important'),
        delegate: brainDumpData.filter((item: any) => item.priority === 'delegate'),
        eliminate: brainDumpData.filter((item: any) => item.priority === 'low')
      };
      setPriorities(categorized);
      updateResponses({ priorities: categorized });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 5
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-800 mb-4">🧠 Mind Management System</h2>
          <p className="text-lg text-gray-600">
            Clear mental clutter and organize your thoughts for optimal cognitive performance
          </p>
        </div>

        {currentStep === 'dump' && (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">Brain Dump Exercise</h3>
              <p className="text-teal-700 mb-6">
                Get everything out of your head and onto paper. Add items in different categories:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { category: 'tasks', label: 'Tasks & To-Dos', placeholder: 'e.g., Call doctor, finish report, organize closet' },
                  { category: 'projects', label: 'Projects', placeholder: 'e.g., Kitchen renovation, learn Spanish, start exercise routine' },
                  { category: 'decisions', label: 'Decisions to Make', placeholder: 'e.g., Choose vacation destination, decide on career change' },
                  { category: 'worries', label: 'Worries & Concerns', placeholder: 'e.g., Health concerns, financial stress, family issues' }
                ].map(({ category, label, placeholder }) => (
                  <div key={category} className="bg-white border border-teal-200 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-3">{label}</h4>
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {brainDumpData
                        .filter((item: any) => item.category === category)
                        .map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-teal-50 rounded text-sm">
                            <span className="text-teal-800">{item.text}</span>
                            <select
                              value={item.priority}
                              onChange={(e) => updateItemPriority(item.id, e.target.value)}
                              className="text-xs border border-teal-300 rounded px-1 py-1"
                            >
                              <option value="urgent">Urgent</option>
                              <option value="important">Important</option>
                              <option value="medium">Medium</option>
                              <option value="delegate">Delegate</option>
                              <option value="low">Low/Eliminate</option>
                            </select>
                          </div>
                        ))}
                    </div>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addBrainDumpItem((e.target as HTMLInputElement).value, category);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <p className="text-xs text-teal-600 mt-1">Press Enter to add item</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🎯 Priority Guide</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-yellow-900">Urgent:</span>
                    <p className="text-yellow-700">Must do today/this week</p>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-900">Important:</span>
                    <p className="text-yellow-700">Significant impact, plan soon</p>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-900">Delegate:</span>
                    <p className="text-yellow-700">Someone else can handle</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { 
                  categorizePriorities(); 
                  setCurrentStep('prioritize'); 
                  updateResponses({ currentStep: 'prioritize' }); 
                }}
                disabled={brainDumpData.length === 0}
                className="mt-6 w-full bg-teal-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Organize & Prioritize ({brainDumpData.length} items)
              </button>
            </div>
          </div>
        )}

        {currentStep === 'prioritize' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Priority Matrix</h3>
              <p className="text-blue-700 mb-6">
                Your items organized by priority level:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                    🚨 Urgent ({priorities.urgent.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {priorities.urgent.map((item: any) => (
                      <div key={item.id} className="p-2 bg-white border border-red-200 rounded text-sm">
                        <span className="font-medium text-red-900">{item.text}</span>
                        <span className="text-xs text-red-600 ml-2">({item.category})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                    ⭐ Important ({priorities.important.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {priorities.important.map((item: any) => (
                      <div key={item.id} className="p-2 bg-white border border-orange-200 rounded text-sm">
                        <span className="font-medium text-orange-900">{item.text}</span>
                        <span className="text-xs text-orange-600 ml-2">({item.category})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    👥 Delegate ({priorities.delegate.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {priorities.delegate.map((item: any) => (
                      <div key={item.id} className="p-2 bg-white border border-green-200 rounded text-sm">
                        <span className="font-medium text-green-900">{item.text}</span>
                        <span className="text-xs text-green-600 ml-2">({item.category})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    🗑️ Eliminate ({priorities.eliminate.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {priorities.eliminate.map((item: any) => (
                      <div key={item.id} className="p-2 bg-white border border-gray-200 rounded text-sm">
                        <span className="font-medium text-gray-900">{item.text}</span>
                        <span className="text-xs text-gray-600 ml-2">({item.category})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setCurrentStep('organize'); updateResponses({ currentStep: 'organize' }); }}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Create Organization System
              </button>
            </div>
          </div>
        )}

        {currentStep === 'organize' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Organization System Setup</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What tool will you use for task management?
                  </label>
                  <select 
                    value={organizationSystem.tool || ''}
                    onChange={(e) => {
                      const newSystem = { ...organizationSystem, tool: e.target.value };
                      setOrganizationSystem(newSystem);
                      updateResponses({ organizationSystem: newSystem });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Select your preferred tool...</option>
                    <option value="physical-planner">Physical planner/notebook</option>
                    <option value="smartphone-notes">Smartphone notes app</option>
                    <option value="digital-calendar">Digital calendar (Google, Outlook)</option>
                    <option value="task-app">Task management app (Todoist, Any.do)</option>
                    <option value="simple-list">Simple text list</option>
                    <option value="combination">Combination of tools</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    How often will you review and update your system?
                  </label>
                  <select 
                    value={organizationSystem.reviewFrequency || ''}
                    onChange={(e) => {
                      const newSystem = { ...organizationSystem, reviewFrequency: e.target.value };
                      setOrganizationSystem(newSystem);
                      updateResponses({ organizationSystem: newSystem });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Select review frequency...</option>
                    <option value="daily">Daily (morning or evening)</option>
                    <option value="weekly">Weekly (same day each week)</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="as-needed">As needed when overwhelmed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What's your biggest challenge with staying organized?
                  </label>
                  <textarea 
                    value={organizationSystem.challenge || ''}
                    onChange={(e) => {
                      const newSystem = { ...organizationSystem, challenge: e.target.value };
                      setOrganizationSystem(newSystem);
                      updateResponses({ organizationSystem: newSystem });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                    placeholder="e.g., Forgetting to check my list, getting overwhelmed by too many items, procrastination..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What motivates you to complete tasks?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Checking items off a list',
                      'Seeing progress toward goals',
                      'Reducing stress and worry',
                      'Having more free time',
                      'Feeling accomplished',
                      'Helping others/family'
                    ].map((motivator, index) => (
                      <label key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={(organizationSystem.motivators || []).includes(motivator)}
                          onChange={(e) => {
                            const current = organizationSystem.motivators || [];
                            const updated = e.target.checked
                              ? [...current, motivator]
                              : current.filter((m: string) => m !== motivator);
                            const newSystem = { ...organizationSystem, motivators: updated };
                            setOrganizationSystem(newSystem);
                            updateResponses({ organizationSystem: newSystem });
                          }}
                          className="rounded border-purple-300"
                        />
                        <span className="text-purple-700">{motivator}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setCurrentStep('implementation'); updateResponses({ currentStep: 'implementation' }); }}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Create Implementation Plan
              </button>
            </div>
          </div>
        )}

        {currentStep === 'implementation' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Your Mind Management System</h3>
              
              <div className="space-y-6">
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Quick Stats</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-red-100 rounded">
                      <div className="text-2xl font-bold text-red-600">{priorities.urgent.length}</div>
                      <div className="text-sm text-red-700">Urgent Tasks</div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded">
                      <div className="text-2xl font-bold text-orange-600">{priorities.important.length}</div>
                      <div className="text-sm text-orange-700">Important Tasks</div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded">
                      <div className="text-2xl font-bold text-blue-600">{priorities.delegate.length}</div>
                      <div className="text-sm text-blue-700">To Delegate</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded">
                      <div className="text-2xl font-bold text-gray-600">{priorities.eliminate.length}</div>
                      <div className="text-sm text-gray-700">To Eliminate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Your System Setup</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">Primary Tool:</span>
                      <span className="font-medium text-green-900">{organizationSystem.tool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Review Schedule:</span>
                      <span className="font-medium text-green-900">{organizationSystem.reviewFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Key Motivators:</span>
                      <span className="font-medium text-green-900">{(organizationSystem.motivators || []).length} selected</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Weekly Action Plan</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-medium text-green-800 mb-2">
                        This week, I will focus on completing:
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="10"
                        value={implementationPlan.weeklyFocus || 3}
                        onChange={(e) => {
                          const newPlan = { ...implementationPlan, weeklyFocus: parseInt(e.target.value) };
                          setImplementationPlan(newPlan);
                          updateResponses({ implementationPlan: newPlan });
                        }}
                        className="w-20 px-3 py-2 border border-green-300 rounded-lg mr-2"
                      />
                      <span className="text-green-700">urgent/important tasks</span>
                    </div>

                    <div>
                      <label className="block font-medium text-green-800 mb-2">
                        Daily check-in time:
                      </label>
                      <select 
                        value={implementationPlan.dailyCheckIn || ''}
                        onChange={(e) => {
                          const newPlan = { ...implementationPlan, dailyCheckIn: e.target.value };
                          setImplementationPlan(newPlan);
                          updateResponses({ implementationPlan: newPlan });
                        }}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg"
                      >
                        <option value="">Select check-in time...</option>
                        <option value="morning">Morning (plan the day)</option>
                        <option value="evening">Evening (review progress)</option>
                        <option value="both">Both morning and evening</option>
                        <option value="flexible">Flexible based on schedule</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-green-800 mb-2">
                        Success reward for completing weekly focus:
                      </label>
                      <input 
                        type="text"
                        value={implementationPlan.reward || ''}
                        onChange={(e) => {
                          const newPlan = { ...implementationPlan, reward: e.target.value };
                          setImplementationPlan(newPlan);
                          updateResponses({ implementationPlan: newPlan });
                        }}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg"
                        placeholder="e.g., Movie night, special dinner, day off, favorite activity..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 Next Steps</h4>
                  <ol className="space-y-1 text-blue-700 text-sm">
                    <li>1. Set up your chosen organization tool today</li>
                    <li>2. Transfer your prioritized items to the system</li>
                    <li>3. Schedule your first daily check-in</li>
                    <li>4. Complete one urgent task within 24 hours</li>
                    <li>5. Review progress at your chosen frequency</li>
                  </ol>
                </div>
              </div>

              <button 
                onClick={() => onComplete('w5-mind-management', { 
                  brainDumpData, 
                  priorities, 
                  organizationSystem, 
                  implementationPlan,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Mind Management System
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 2: CBT Reframing Techniques (ABCD Model)
  if (component.id === 'w2-cbt') {
    const cbtPhase = responses.cbtPhase || 'introduction';
    const selectedScenario = responses.selectedScenario || null;
    const abcdData = responses.abcdData || {};
    const practiceScenarios = responses.practiceScenarios || [];

    const thoughtDistortions = [
      {
        id: 'all-or-nothing',
        name: 'All-or-Nothing Thinking',
        description: 'Seeing things in black and white categories',
        example: '"I ate one cookie, so I completely ruined my diet"',
        reframe: '"One cookie doesn\'t define my entire eating pattern"',
        keywords: ['always', 'never', 'perfect', 'ruined', 'completely']
      },
      {
        id: 'catastrophizing',
        name: 'Catastrophizing',
        description: 'Expecting the worst possible outcome',
        example: '"If I don\'t sleep well tonight, tomorrow will be terrible"',
        reframe: '"One poor night doesn\'t determine my entire day"',
        keywords: ['disaster', 'terrible', 'awful', 'worst', 'catastrophe']
      }
    ];

    const scenarioLibrary = [
      {
        id: 'workplace-change',
        title: 'Workplace Technology Changes',
        situation: 'Your workplace is implementing new technology systems that younger colleagues seem to pick up quickly',
        commonThoughts: [
          'I\'m too old to learn this new system',
          'Everyone thinks I\'m outdated and slow',
          'I\'ll probably lose my job because I can\'t keep up',
          'I should just retire rather than embarrass myself'
        ],
        triggerEmotions: ['anxiety', 'shame', 'inadequacy', 'fear'],
        physicalSensations: ['tight chest', 'rapid heartbeat', 'sweaty palms', 'stomach knots']
      }
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              CBT Thought Reframing Workshop
            </CardTitle>
            <p className="text-sm text-gray-600">Master the ABCD model to transform negative thought patterns during midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">The ABCD Model for Thought Transformation</h5>
              <p className="text-sm text-blue-700 mb-3">
                CBT's ABCD model helps midlife women identify and challenge unhelpful thought patterns that often intensify during hormonal transitions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <strong className="text-blue-800">A - Activating Event:</strong>
                  <p className="text-xs text-blue-600">The trigger situation</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong className="text-blue-800">B - Beliefs/Thoughts:</strong>
                  <p className="text-xs text-blue-600">Your automatic thoughts</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong className="text-blue-800">C - Consequences:</strong>
                  <p className="text-xs text-blue-600">Emotions & behaviors</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong className="text-blue-800">D - Disputing:</strong>
                  <p className="text-xs text-blue-600">Challenge & reframe</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Interactive Thought Challenge Exercise</h4>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium mb-2 block">Step 1: Identify a Negative Thought</Label>
                  <p className="text-sm text-gray-600 mb-3">Think of a recent situation that triggered self-critical or catastrophic thinking:</p>
                  <Textarea
                    placeholder="Example: 'I'm failing at everything since turning 45. I can't remember anything and I'm becoming useless...'"
                    value={responses.negativeThought || ''}
                    onChange={(e) => setResponses({...responses, negativeThought: e.target.value})}
                    className="h-20"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 2: Rate Emotional Intensity</Label>
                  <p className="text-sm text-gray-600 mb-3">How strongly do you believe this thought? (1 = barely believe it, 10 = completely believe it)</p>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[responses.emotionalIntensity || 5]}
                      onValueChange={(value) => setResponses({...responses, emotionalIntensity: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-blue-600">{responses.emotionalIntensity || 5}/10</span>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 3: Challenge the Thought</Label>
                  <p className="text-sm text-gray-600 mb-3">What evidence contradicts this thought?</p>
                  <Textarea
                    placeholder="Think of times you've succeeded, positive feedback, accomplishments..."
                    value={responses.contradictingEvidence || ''}
                    onChange={(e) => setResponses({...responses, contradictingEvidence: e.target.value})}
                    className="h-16"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 4: Create a Balanced Thought</Label>
                  <p className="text-sm text-gray-600 mb-3">Rewrite your original thought in a more balanced, realistic way:</p>
                  <Textarea
                    placeholder="Example: 'I'm going through a challenging transition with perimenopause. Some days are harder than others, but I'm learning new strategies to cope.'"
                    value={responses.balancedThought || ''}
                    onChange={(e) => setResponses({...responses, balancedThought: e.target.value})}
                    className="h-24"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 5: Rate New Emotional Intensity</Label>
                  <p className="text-sm text-gray-600 mb-3">How strongly do you believe your balanced thought? Notice any change:</p>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[responses.newEmotionalIntensity || 5]}
                      onValueChange={(value) => setResponses({...responses, newEmotionalIntensity: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-green-600">{responses.newEmotionalIntensity || 5}/10</span>
                  </div>
                  {responses.emotionalIntensity && responses.newEmotionalIntensity && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Change: </span>
                      <span className={responses.newEmotionalIntensity < responses.emotionalIntensity ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {responses.emotionalIntensity} → {responses.newEmotionalIntensity}
                        {responses.newEmotionalIntensity < responses.emotionalIntensity && ' (Improved!)'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Daily Practice</h5>
              <p className="text-sm text-green-700">
                Use this 5-step process whenever you notice negative thought spirals. With practice, challenging unhelpful thoughts becomes automatic, reducing anxiety and building emotional resilience during this life transition.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700 text-white">
                Complete CBT Workshop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 2: Mirror Work & Self-Compassion Practice
  if (component.id === 'w2-mirror') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Mirror Work & Self-Compassion Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Develop a loving relationship with yourself through mirror work and personalized affirmations.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
              <h5 className="font-semibold text-pink-800 mb-2">Why Mirror Work Transforms Self-Talk</h5>
              <p className="text-sm text-pink-700 mb-3">
                Mirror work helps rewire neural pathways for self-compassion. During midlife transitions, it:
              </p>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• <strong>Builds Self-Acceptance:</strong> Creates a direct connection with your inner voice</li>
                <li>• <strong>Identifies Inner Critic:</strong> Makes unconscious negative self-talk conscious</li>
                <li>• <strong>Practices Self-Love:</strong> Develops neural pathways for kindness toward yourself</li>
                <li>• <strong>Improves Body Image:</strong> Supports acceptance during physical changes</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Interactive Mirror Work Exercise</h4>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium mb-2 block">Step 1: Mirror Reflection Assessment</Label>
                  <p className="text-sm text-gray-600 mb-3">When you look in the mirror, what's your first thought?</p>
                  <Textarea
                    placeholder="Be honest about what goes through your mind..."
                    value={responses.mirrorFirstThought || ''}
                    onChange={(e) => setResponses({...responses, mirrorFirstThought: e.target.value})}
                    className="h-16"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 2: Self-Compassion Rating</Label>
                  <p className="text-sm text-gray-600 mb-3">Rate your comfort level with mirror eye contact (1 = very uncomfortable, 10 = completely comfortable)</p>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[responses.mirrorComfort || 5]}
                      onValueChange={(value) => setResponses({...responses, mirrorComfort: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-pink-600">{responses.mirrorComfort || 5}/10</span>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 3: Create Personal Affirmations</Label>
                  <p className="text-sm text-gray-600 mb-3">Complete these personalized affirmation starters:</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">I am learning to accept my...</Label>
                      <Input
                        placeholder="e.g., changing body, new role in life, emotional sensitivity..."
                        value={responses.acceptanceAffirmation || ''}
                        onChange={(e) => setResponses({...responses, acceptanceAffirmation: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">I appreciate my ability to...</Label>
                      <Input
                        placeholder="e.g., adapt to change, support others, find strength in difficult times..."
                        value={responses.strengthAffirmation || ''}
                        onChange={(e) => setResponses({...responses, strengthAffirmation: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">I deserve...</Label>
                      <Input
                        placeholder="e.g., love and respect, time for myself, to feel beautiful at any age..."
                        value={responses.worthinessAffirmation || ''}
                        onChange={(e) => setResponses({...responses, worthinessAffirmation: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 4: Mirror Practice Reflection</Label>
                  <p className="text-sm text-gray-600 mb-3">After saying your affirmations to yourself in the mirror, how did it feel?</p>
                  <Textarea
                    placeholder="Describe any emotions, resistance, surprises, or insights..."
                    value={responses.mirrorPracticeReflection || ''}
                    onChange={(e) => setResponses({...responses, mirrorPracticeReflection: e.target.value})}
                    className="h-20"
                  />
                </div>
              </div>
            </div>

            {(responses.acceptanceAffirmation || responses.strengthAffirmation || responses.worthinessAffirmation) && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-3">💖 Your Personal Affirmations</h5>
                <div className="space-y-2 text-sm text-pink-700">
                  {responses.acceptanceAffirmation && (
                    <p>• I am learning to accept my {responses.acceptanceAffirmation}</p>
                  )}
                  {responses.strengthAffirmation && (
                    <p>• I appreciate my ability to {responses.strengthAffirmation}</p>
                  )}
                  {responses.worthinessAffirmation && (
                    <p>• I deserve {responses.worthinessAffirmation}</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Daily Mirror Work Tips</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Start with just 1-2 minutes daily - consistency matters more than duration</li>
                <li>• Practice during your morning routine for positive day-setting</li>
                <li>• If resistance comes up, acknowledge it with kindness</li>
                <li>• Focus on your eyes - they're the windows to your soul and self-compassion</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={!responses.mirrorPracticeReflection}
              >
                Complete Mirror Work Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback component
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{component.title}</CardTitle>
          <p className="text-sm text-gray-600">{component.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Component content would go here...</p>
            <div className="flex justify-center">
              <Button onClick={() => onComplete(component.id, { completed: true })}>
                Mark Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}