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
import { SomaticGroundingFixed } from './somatic-grounding-fixed';
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
    return <SomaticGroundingFixed onComplete={onComplete} onClose={onClose} />;
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