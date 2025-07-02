import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useWellnessData } from '@/hooks/use-local-storage';
import { ModuleComponent } from '@/types/wellness';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  PenTool, 
  Heart,
  Brain,
  Target,
  Timer,
  Volume2,
  VolumeX,
  ArrowRight,
  Download,
  Star
} from 'lucide-react';

interface CoachingComponentProps {
  component: ModuleComponent;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function CoachingComponent({ component, moduleId, onComplete, onClose }: CoachingComponentProps) {
  const { data } = useWellnessData();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(
    (data.coachingProgress?.completedComponents as string[])?.includes(component.id) || false
  );

  const getComponentSteps = () => {
    const stepMap: { [key: string]: any[] } = {
      // Week 1 - Hormones and Headspace
      'w1-video': [
        {
          type: 'intro',
          title: 'Understanding Brain Changes in Midlife',
          content: 'Welcome to your first lesson. In this video, we\'ll explore the fascinating science behind what\'s happening in your brain during perimenopause and midlife transitions.',
          duration: 2
        },
        {
          type: 'video-content',
          title: 'The Hormone-Brain Connection',
          content: 'Estrogen and progesterone aren\'t just reproductive hormones - they\'re powerful brain chemicals that affect neurotransmitters like serotonin, dopamine, and GABA. When these hormones fluctuate, it directly impacts your mood, memory, and cognitive function.',
          keyPoints: [
            'Estrogen supports serotonin production and mood regulation',
            'Progesterone has a calming effect on the nervous system',
            'Hormone fluctuations can cause brain fog and memory issues',
            'Understanding these changes reduces self-blame and anxiety'
          ],
          duration: 8
        },
        {
          type: 'video-content',
          title: 'Why Brain Fog Happens',
          content: 'Brain fog isn\'t "all in your head" - it\'s a real neurological phenomenon. Declining estrogen affects the hippocampus (memory center) and prefrontal cortex (executive function), making it harder to concentrate and remember things.',
          keyPoints: [
            'Hippocampus changes affect memory formation',
            'Prefrontal cortex changes impact focus and decision-making',
            'Sleep disruption compounds cognitive challenges',
            'Stress hormones worsen brain fog symptoms'
          ],
          duration: 6
        },
        {
          type: 'reflection',
          title: 'Personal Reflection',
          content: 'Take a moment to reflect on your own experience with brain changes.',
          questions: [
            'What brain fog symptoms have you noticed?',
            'How have these changes affected your daily life?',
            'What would you like to understand better about your brain health?'
          ],
          duration: 4
        },
        {
          type: 'action-plan',
          title: 'Your Next Steps',
          content: 'Based on what you\'ve learned, here are your action steps for the week.',
          actions: [
            'Complete the hormone symptom tracker daily',
            'Notice patterns between symptoms and your cycle',
            'Begin the thought awareness exercise',
            'Practice self-compassion when experiencing brain fog'
          ],
          duration: 2
        }
      ],
      'w1-journal': [
        {
          type: 'intro',
          title: 'What Am I Carrying?',
          content: 'This reflective exercise will help you identify the mental and emotional load you\'ve been carrying, often without full awareness.',
          duration: 1
        },
        {
          type: 'guided-reflection',
          title: 'Mental Load Assessment',
          content: 'Let\'s explore the invisible work you do every day.',
          prompts: [
            'List all the tasks, responsibilities, and decisions you manage daily',
            'What emotional needs of others do you attend to?',
            'What planning and organizing happens in your mind?',
            'What would happen if you stopped doing these things?'
          ],
          duration: 10
        },
        {
          type: 'deeper-exploration',
          title: 'Energy Drain Analysis',
          content: 'Now let\'s identify what\'s draining your mental energy most.',
          questions: [
            'Which responsibilities feel heaviest to you?',
            'What tasks do you do because "someone has to"?',
            'Where do you feel resentment or exhaustion?',
            'What support do you need but haven\'t asked for?'
          ],
          duration: 8
        },
        {
          type: 'action-planning',
          title: 'Release and Delegate',
          content: 'Identify what you\'re ready to release or change.',
          categories: [
            'Tasks I can delegate or share',
            'Responsibilities I can release',
            'Expectations I can adjust',
            'Support I need to request'
          ],
          duration: 6
        }
      ],
      'w1-tracking': [
        {
          type: 'intro',
          title: 'Mood & Symptom Tracking',
          content: 'Daily tracking helps you identify patterns and understand your unique hormonal rhythms.',
          duration: 1
        },
        {
          type: 'tracking-setup',
          title: 'Setting Up Your Tracker',
          content: 'We\'ll track key indicators that reveal hormonal patterns.',
          categories: [
            'Mood (morning, afternoon, evening)',
            'Energy levels (1-10 scale)',
            'Physical symptoms (hot flashes, sleep, etc.)',
            'Cognitive function (focus, memory)'
          ],
          duration: 3
        },
        {
          type: 'practice-tracking',
          title: 'Practice Session',
          content: 'Let\'s do your first tracking session right now.',
          trackingItems: [
            { label: 'Current mood', type: 'mood-scale' },
            { label: 'Energy level', type: 'number-scale', min: 1, max: 10 },
            { label: 'Physical symptoms', type: 'checkbox-list', options: ['Hot flashes', 'Fatigue', 'Sleep issues', 'Headaches', 'Joint aches'] },
            { label: 'Focus level', type: 'number-scale', min: 1, max: 10 }
          ],
          duration: 5
        },
        {
          type: 'pattern-recognition',
          title: 'What to Look For',
          content: 'Learn to identify meaningful patterns in your data.',
          patterns: [
            'Weekly cycles in mood and energy',
            'Symptom clusters that appear together',
            'Triggers that worsen symptoms',
            'Times of day when you feel best/worst'
          ],
          duration: 3
        }
      ],
      'w1-awareness': [
        {
          type: 'intro',
          title: 'Thought Awareness Practice',
          content: 'This foundational skill helps you notice automatic thoughts without trying to change them.',
          duration: 1
        },
        {
          type: 'mindfulness-training',
          title: 'The Observer Mind',
          content: 'Learn to step back and observe your thoughts like clouds passing in the sky.',
          techniques: [
            'Notice thoughts without judgment',
            'Label thoughts as "thinking"',
            'Return attention to the present moment',
            'Practice curiosity instead of criticism'
          ],
          duration: 5
        },
        {
          type: 'practice-session',
          title: 'Guided Practice',
          content: 'Let\'s practice thought observation together.',
          steps: [
            'Sit comfortably and close your eyes',
            'Notice what thoughts arise naturally',
            'When you catch a thought, simply say "thinking"',
            'Gently return to observing without engagement'
          ],
          duration: 8
        },
        {
          type: 'daily-integration',
          title: 'Daily Awareness Plan',
          content: 'How to integrate thought awareness into your daily life.',
          strategies: [
            'Set 3 random phone reminders daily',
            'Use transition moments (doorways, red lights)',
            'Practice during routine activities',
            'Keep a simple thought log'
          ],
          duration: 3
        }
      ],

      // Week 2 - Rewiring Thoughts
      'w2-cbt': [
        {
          type: 'intro',
          title: 'CBT Reframing Techniques',
          content: 'Cognitive Behavioral Therapy provides powerful tools to identify and transform negative thought patterns.',
          duration: 2
        },
        {
          type: 'concept-learning',
          title: 'The ABCDE Model',
          content: 'Learn this evidence-based framework for challenging negative thoughts.',
          model: {
            A: 'Adversity - What happened?',
            B: 'Beliefs - What did you tell yourself?',
            C: 'Consequences - How did you feel/behave?',
            D: 'Disputation - How can you challenge the belief?',
            E: 'Energization - How do you feel after reframing?'
          },
          duration: 6
        },
        {
          type: 'practice-exercise',
          title: 'ABCDE in Action',
          content: 'Practice the ABCDE model with a personal example.',
          guidance: 'Think of a recent situation that upset you and work through each step',
          duration: 10
        },
        {
          type: 'thought-patterns',
          title: 'Common Thinking Traps',
          content: 'Recognize these common cognitive distortions in midlife.',
          patterns: [
            'All-or-nothing thinking',
            'Catastrophizing',
            'Mind reading',
            'Should statements',
            'Emotional reasoning'
          ],
          duration: 5
        }
      ],

      // Week 3 - Emotional Regulation & Boundaries
      'w3-technique': [
        {
          type: 'intro',
          title: 'Pause-Label-Shift Technique',
          content: 'Master this three-step process for emotional regulation in real-time.',
          duration: 1
        },
        {
          type: 'technique-breakdown',
          title: 'The Three Steps',
          content: 'Learn each component of this powerful technique.',
          steps: {
            pause: 'Take a conscious pause before reacting',
            label: 'Name the emotion you\'re experiencing',
            shift: 'Choose a conscious response'
          },
          duration: 4
        },
        {
          type: 'guided-practice',
          title: 'Practice Session',
          content: 'Practice with common midlife scenarios.',
          scenarios: [
            'Feeling overwhelmed by responsibilities',
            'Experiencing criticism or judgment',
            'Dealing with unexpected changes',
            'Managing family conflict'
          ],
          duration: 12
        },
        {
          type: 'integration-plan',
          title: 'Daily Integration',
          content: 'How to use this technique in daily life.',
          strategies: [
            'Start with low-stress situations',
            'Use physical cues as reminders',
            'Practice in the moment',
            'Reflect on what worked'
          ],
          duration: 3
        }
      ],

      // Default for components without specific steps
      'default': [
        {
          type: 'intro',
          title: 'Getting Started',
          content: 'Welcome to this coaching component. You\'ll learn practical strategies and tools for your wellness journey.',
          duration: 1
        },
        {
          type: 'content',
          title: 'Main Content',
          content: 'This component contains valuable insights and exercises designed specifically for midlife women.',
          duration: 10
        },
        {
          type: 'practice',
          title: 'Practice Exercise',
          content: 'Apply what you\'ve learned through guided practice.',
          duration: 8
        },
        {
          type: 'reflection',
          title: 'Reflection',
          content: 'Take time to reflect on your insights and plan next steps.',
          duration: 3
        }
      ]
    };

    return stepMap[component.id] || stepMap['default'];
  };

  const steps = getComponentSteps();
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, responses);
  };

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'intro':
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-coral-600" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {currentStepData.content}
              </p>
              {currentStepData.duration && (
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentStepData.duration} minutes
                </Badge>
              )}
            </div>
          </div>
        );

      case 'video-content':
        return (
          <div className="space-y-6">
            <div className="bg-sage-50 rounded-lg p-6 border-2 border-sage-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData.duration} minute video segment
                  </p>
                </div>
              </div>
              <p className="mb-4 leading-relaxed">{currentStepData.content}</p>
              {currentStepData.keyPoints && (
                <div className="space-y-2">
                  <h4 className="font-medium">Key Points:</h4>
                  <ul className="space-y-1">
                    {currentStepData.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 'guided-reflection':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.content}</p>
            </div>
            <div className="space-y-6">
              {currentStepData.prompts?.map((prompt: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">{prompt}</Label>
                  <Textarea
                    placeholder="Reflect on this question..."
                    value={responses[`prompt_${index}`] || ''}
                    onChange={(e) => setResponses({
                      ...responses,
                      [`prompt_${index}`]: e.target.value
                    })}
                    className="min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'practice-tracking':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.content}</p>
            </div>
            <div className="grid gap-6">
              {currentStepData.trackingItems?.map((item: any, index: number) => (
                <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  {item.type === 'mood-scale' && (
                    <RadioGroup
                      value={responses[`tracking_${index}`] || ''}
                      onValueChange={(value) => setResponses({
                        ...responses,
                        [`tracking_${index}`]: value
                      })}
                    >
                      {['very-sad', 'sad', 'neutral', 'happy', 'very-happy'].map((mood) => (
                        <div key={mood} className="flex items-center space-x-2">
                          <RadioGroupItem value={mood} id={mood} />
                          <Label htmlFor={mood} className="capitalize">{mood.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {item.type === 'number-scale' && (
                    <div className="space-y-2">
                      <Slider
                        value={[responses[`tracking_${index}`] || item.min || 1]}
                        onValueChange={(value) => setResponses({
                          ...responses,
                          [`tracking_${index}`]: value[0]
                        })}
                        max={item.max || 10}
                        min={item.min || 1}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {responses[`tracking_${index}`] || item.min || 1} / {item.max || 10}
                      </div>
                    </div>
                  )}
                  {item.type === 'checkbox-list' && (
                    <div className="space-y-2">
                      {item.options?.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}_${optionIndex}`}
                            checked={responses[`tracking_${index}_${optionIndex}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`tracking_${index}_${optionIndex}`]: checked
                            })}
                          />
                          <Label htmlFor={`${index}_${optionIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'practice-exercise':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.content}</p>
            </div>
            {currentStepData.model && (
              <div className="grid gap-4">
                {Object.entries(currentStepData.model).map(([key, value]: [string, any], index) => (
                  <div key={key} className="p-4 bg-coral-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center text-sm font-bold text-coral-600">
                        {key}
                      </div>
                      <h4 className="font-medium">{value}</h4>
                    </div>
                    <Textarea
                      placeholder={`Enter your ${key} here...`}
                      value={responses[`abcde_${key}`] || ''}
                      onChange={(e) => setResponses({
                        ...responses,
                        [`abcde_${key}`]: e.target.value
                      })}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            )}
            {currentStepData.guidance && (
              <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
                <p className="text-sm text-sage-700">{currentStepData.guidance}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {currentStepData.content}
              </p>
            </div>
            {currentStepData.steps && (
              <div className="grid gap-3">
                {currentStepData.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            ← Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{component.title}</h1>
            <p className="text-sm text-muted-foreground">{component.description}</p>
          </div>
        </div>
        {isCompleted && (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-coral-500' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {currentStep === steps.length - 1 ? (
          <Button onClick={handleComplete} disabled={isCompleted}>
            {isCompleted ? 'Completed' : 'Complete'}
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}