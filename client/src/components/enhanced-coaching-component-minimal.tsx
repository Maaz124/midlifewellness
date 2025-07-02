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

  // Calculate hormonal symptom score
  const calculateHormonalScore = () => {
    const symptoms = [
      'Hot flashes', 'Night sweats', 'Fatigue', 'Joint aches',
      'Mood swings', 'Irritability', 'Anxiety', 'Overwhelm',
      'Brain fog', 'Memory issues', 'Concentration problems'
    ];
    
    let totalScore = 0;
    let ratedSymptoms = 0;
    
    symptoms.forEach(symptom => {
      if (responses[symptom]) {
        totalScore += responses[symptom];
        ratedSymptoms++;
      }
    });
    
    if (ratedSymptoms === 0) return 0;
    
    // Calculate average score (1-5) and convert to percentage
    const averageScore = totalScore / ratedSymptoms;
    return Math.round((averageScore / 5) * 100);
  };

  const getScoreInterpretation = (score: number) => {
    if (score === 0) return { level: 'Not Rated', message: 'Please rate your symptoms to see your score', color: 'text-gray-500' };
    if (score <= 20) return { level: 'Minimal', message: 'Your symptoms are minimal. Keep monitoring for any changes.', color: 'text-green-600' };
    if (score <= 40) return { level: 'Mild', message: 'You have mild symptoms. Consider gentle lifestyle adjustments.', color: 'text-yellow-600' };
    if (score <= 60) return { level: 'Moderate', message: 'Your symptoms are moderate. Focus on stress management and self-care.', color: 'text-orange-600' };
    if (score <= 80) return { level: 'Significant', message: 'You have significant symptoms. Consider professional support alongside these practices.', color: 'text-red-600' };
    return { level: 'Severe', message: 'Your symptoms are severe. Please discuss with a healthcare provider while using these tools.', color: 'text-red-700' };
  };

  const getPersonalizedRecommendations = (score: number) => {
    if (score <= 20) return [
      'Continue current wellness practices',
      'Maintain regular sleep schedule',
      'Stay hydrated and eat nourishing foods'
    ];
    if (score <= 40) return [
      'Add gentle movement like walking or yoga',
      'Practice daily stress reduction techniques',
      'Consider herbal teas for relaxation'
    ];
    if (score <= 60) return [
      'Prioritize 7-9 hours of quality sleep',
      'Implement daily meditation or breathing exercises',
      'Focus on anti-inflammatory foods',
      'Consider magnesium supplementation (consult healthcare provider)'
    ];
    if (score <= 80) return [
      'Create a structured daily routine',
      'Seek support from friends, family, or support groups',
      'Consider professional counseling for emotional symptoms',
      'Track symptoms daily to identify patterns'
    ];
    return [
      'Consult with a healthcare provider or hormone specialist',
      'Consider comprehensive hormone testing',
      'Explore both conventional and integrative treatment options',
      'Build a strong support network',
      'Use these tools as complementary support'
    ];
  };

  // Hormone Video - Enhanced Symptom Tracker with Scoring
  if (component.id === 'hormone-video') {
    const currentScore = calculateHormonalScore();
    const interpretation = getScoreInterpretation(currentScore);
    const recommendations = getPersonalizedRecommendations(currentScore);

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
              <Activity className="w-5 h-5 text-rose-500" />
              Understanding Your Hormonal Symphony
            </CardTitle>
            <p className="text-sm text-gray-600">Track your daily symptoms and get personalized insights about your hormonal health.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Today's Symptom Assessment</h4>
              <p className="text-sm text-gray-600 mb-4">Rate each symptom from 1 (barely noticeable) to 5 (very severe)</p>
              
              <div className="space-y-4">
                {[
                  { category: 'Physical', symptoms: ['Hot flashes', 'Night sweats', 'Fatigue', 'Joint aches'], color: 'bg-red-100 text-red-800' },
                  { category: 'Emotional', symptoms: ['Mood swings', 'Irritability', 'Anxiety', 'Overwhelm'], color: 'bg-orange-100 text-orange-800' },
                  { category: 'Cognitive', symptoms: ['Brain fog', 'Memory issues', 'Concentration problems'], color: 'bg-yellow-100 text-yellow-800' }
                ].map((group) => (
                  <div key={group.category} className="space-y-2">
                    <Label className="font-medium">{group.category} Symptoms</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {group.symptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <span className="text-sm font-medium">{symptom}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => setResponses({...responses, [symptom]: level})}
                                className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition-all ${
                                  responses[symptom] === level 
                                    ? `${group.color} border-gray-400 shadow-sm` 
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Display and Interpretation */}
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Your Hormonal Health Score</h4>
                <div className="text-right">
                  <div className="text-3xl font-bold text-rose-600">{currentScore}</div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Symptom Severity Level</span>
                  <span className={`text-sm font-semibold ${interpretation.color}`}>
                    {interpretation.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentScore}%` }}
                  ></div>
                </div>
              </div>
              
              <p className={`text-sm ${interpretation.color} mb-4`}>
                {interpretation.message}
              </p>

              {currentScore > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Personalized Recommendations:</h5>
                  <ul className="space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-rose-600 hover:bg-rose-700 text-white">
                Complete Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Brain Fog Exercise - Week 1
  if (component.id === 'brain-fog-exercise') {
    const clarityRating = responses.clarityRating || 5;
    const getClarityInterpretation = (rating: number) => {
      if (rating <= 3) return { level: 'Heavy Fog', color: 'text-red-600', message: 'Your mind feels cloudy and unclear' };
      if (rating <= 5) return { level: 'Some Clarity', color: 'text-orange-600', message: 'You have some mental clarity with moments of fog' };
      if (rating <= 7) return { level: 'Good Clarity', color: 'text-yellow-600', message: 'Your thinking feels clearer and more focused' };
      if (rating <= 9) return { level: 'Sharp Focus', color: 'text-green-600', message: 'Your mind feels alert and well-organized' };
      return { level: 'Crystal Clear', color: 'text-green-700', message: 'Your thinking is exceptionally sharp and clear' };
    };

    const interpretation = getClarityInterpretation(clarityRating);

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
              <Brain className="w-5 h-5 text-purple-500" />
              Brain Fog Clearing Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Mental clarity techniques designed for your changing brain patterns during midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">Why This Exercise Works</h5>
              <p className="text-sm text-blue-700 mb-3">
                During perimenopause, hormonal fluctuations affect neurotransmitters that impact focus and memory. 
                This "brain dump" technique works by:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Clearing Mental Clutter:</strong> Writing thoughts externally frees up cognitive space</li>
                <li>• <strong>Reducing Cognitive Load:</strong> Stops your brain from trying to remember everything at once</li>
                <li>• <strong>Activating the Prefrontal Cortex:</strong> The act of writing engages your brain's executive function</li>
                <li>• <strong>Creating Mental Space:</strong> Gives your mind permission to let go of racing thoughts</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">3-Minute Mental Clear Exercise</h4>
              <p className="text-sm text-purple-700 mb-4">
                <strong>Before starting:</strong> Rate your current mental clarity below, then complete the exercise and rate again to see the difference.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded border">
                  <Checkbox
                    checked={responses.mentalClearStep1 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep1: checked})}
                  />
                  <div className="flex-1">
                    <Label className="font-medium">Step 1: Brain Dump (60 seconds)</Label>
                    <p className="text-sm text-gray-600 mb-2">Write down everything on your mind - thoughts, worries, tasks, anything taking up mental space</p>
                    <Textarea
                      placeholder="Just write... don't worry about organization or grammar. Let it all out..."
                      value={responses.brainDump || ''}
                      onChange={(e) => setResponses({...responses, brainDump: e.target.value})}
                      className="h-24"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded border">
                  <Checkbox
                    checked={responses.mentalClearStep2 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep2: checked})}
                  />
                  <div className="flex-1">
                    <Label className="font-medium">Step 2: Priority Focus (60 seconds)</Label>
                    <p className="text-sm text-gray-600 mb-2">From your brain dump, identify the top 3 most important items that need your attention today</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((num) => (
                        <Input
                          key={num}
                          placeholder={`Priority ${num}:`}
                          value={responses[`priority${num}`] || ''}
                          onChange={(e) => setResponses({...responses, [`priority${num}`]: e.target.value})}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded border">
                  <Checkbox
                    checked={responses.mentalClearStep3 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep3: checked})}
                  />
                  <div className="flex-1">
                    <Label className="font-medium">Step 3: Mental Clarity Check (60 seconds)</Label>
                    <p className="text-sm text-gray-600 mb-2">Rate your mental clarity now (1-10) and note any differences</p>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[clarityRating]}
                        onValueChange={(value) => setResponses({...responses, clarityRating: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-purple-600">{clarityRating}/10</span>
                    </div>
                    <div className={`mt-2 text-sm font-medium ${interpretation.color}`}>
                      {interpretation.level}: {interpretation.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Integration Tip</h5>
              <p className="text-sm text-green-700">
                Use this 3-minute technique whenever you feel mentally scattered. The key is consistency - even 3 minutes daily can create significant improvements in mental clarity over time.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-purple-600 hover:bg-purple-700 text-white">
                Complete Brain Fog Exercise
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Morning Ritual Exercise - Week 1
  if (component.id === 'morning-ritual') {
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
              <Sun className="w-5 h-5 text-orange-500" />
              Sunrise Hormone Reset Ritual
            </CardTitle>
            <p className="text-sm text-gray-600">Create your personalized morning practice to support hormonal balance and energy throughout the day.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="font-semibold text-orange-800 mb-2">The Science Behind Morning Rituals</h5>
              <p className="text-sm text-orange-700 mb-3">
                Your morning hours are when cortisol naturally peaks and hormones reset. A consistent morning ritual:
              </p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• <strong>Regulates Circadian Rhythm:</strong> Supports natural hormone cycles</li>
                <li>• <strong>Stabilizes Blood Sugar:</strong> Prevents energy crashes throughout the day</li>
                <li>• <strong>Reduces Stress Hormones:</strong> Sets a calm tone before daily stressors</li>
                <li>• <strong>Improves Sleep Quality:</strong> Better mornings lead to better nights</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Design Your 15-Minute Morning Ritual</h4>
              <p className="text-sm text-gray-600 mb-4">Choose one activity from each category to create your personalized ritual:</p>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-red-500" />
                    Hydration & Nourishment (5 minutes)
                  </Label>
                  <RadioGroup
                    value={responses.hydrationChoice || ''}
                    onValueChange={(value) => setResponses({...responses, hydrationChoice: value})}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="warm-lemon" id="warm-lemon" />
                        <Label htmlFor="warm-lemon" className="text-sm">Warm lemon water (supports liver detox & vitamin C)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="herbal-tea" id="herbal-tea" />
                        <Label htmlFor="herbal-tea" className="text-sm">Herbal tea blend (chamomile, ginger, or tulsi for calm energy)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="green-smoothie" id="green-smoothie" />
                        <Label htmlFor="green-smoothie" className="text-sm">Green smoothie (leafy greens, protein, healthy fats)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bone-broth" id="bone-broth" />
                        <Label htmlFor="bone-broth" className="text-sm">Warm bone broth (collagen support & minerals)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="font-medium flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-500" />
                    Mindfulness Practice (5 minutes)
                  </Label>
                  <RadioGroup
                    value={responses.mindfulnessChoice || ''}
                    onValueChange={(value) => setResponses({...responses, mindfulnessChoice: value})}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gratitude-journal" id="gratitude-journal" />
                        <Label htmlFor="gratitude-journal" className="text-sm">Gratitude journaling (3 things you appreciate)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="breathing-exercise" id="breathing-exercise" />
                        <Label htmlFor="breathing-exercise" className="text-sm">Box breathing (4-4-4-4 pattern for nervous system calm)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="meditation" id="meditation" />
                        <Label htmlFor="meditation" className="text-sm">Guided meditation (focusing on self-compassion)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intention-setting" id="intention-setting" />
                        <Label htmlFor="intention-setting" className="text-sm">Daily intention setting (how you want to feel today)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="font-medium flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Gentle Movement (5 minutes)
                  </Label>
                  <RadioGroup
                    value={responses.movementChoice || ''}
                    onValueChange={(value) => setResponses({...responses, movementChoice: value})}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stretching" id="stretching" />
                        <Label htmlFor="stretching" className="text-sm">Gentle stretching (neck, shoulders, spine mobility)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yoga-flow" id="yoga-flow" />
                        <Label htmlFor="yoga-flow" className="text-sm">Sun salutation or gentle yoga flow</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tai-chi" id="tai-chi" />
                        <Label htmlFor="tai-chi" className="text-sm">Tai chi or qigong movements</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="walking" id="walking" />
                        <Label htmlFor="walking" className="text-sm">Brief outdoor walk (natural light exposure)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {responses.hydrationChoice && responses.mindfulnessChoice && responses.movementChoice && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">🌅 Your Personalized Morning Ritual</h5>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Hydration:</strong> {responses.hydrationChoice.replace('-', ' ')}</p>
                  <p><strong>Mindfulness:</strong> {responses.mindfulnessChoice.replace('-', ' ')}</p>
                  <p><strong>Movement:</strong> {responses.movementChoice.replace('-', ' ')}</p>
                </div>
                <p className="text-sm text-green-700 mt-3">
                  <strong>Start tomorrow!</strong> Set your alarm 15 minutes earlier and commit to this ritual for the next 7 days. 
                  Notice how your energy, mood, and overall well-being improve.
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Success Tips</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Start small:</strong> Even 5 minutes is better than skipping entirely</li>
                <li>• <strong>Prepare the night before:</strong> Set out your tea, journal, or yoga mat</li>
                <li>• <strong>Be consistent:</strong> Same time, same sequence builds strong neural pathways</li>
                <li>• <strong>Adjust as needed:</strong> Your ritual can evolve with your changing needs</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={!responses.hydrationChoice || !responses.mindfulnessChoice || !responses.movementChoice}
              >
                Complete Morning Ritual Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Symptom Tracker - Week 1
  if (component.id === 'symptom-tracker') {
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
              <BarChart className="w-5 h-5 text-blue-500" />
              Daily Hormone Harmony Tracker
            </CardTitle>
            <p className="text-sm text-gray-600">Track your symptoms and patterns to understand your unique hormonal rhythm.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Today's Tracking (Use sliders to rate intensity)</h4>
              
              <div className="space-y-4">
                {[
                  { label: 'Energy Level', key: 'energy', color: 'bg-yellow-500' },
                  { label: 'Mood Stability', key: 'mood', color: 'bg-green-500' },
                  { label: 'Sleep Quality', key: 'sleep', color: 'bg-purple-500' },
                  { label: 'Hot Flashes', key: 'hotFlashes', color: 'bg-red-500' },
                  { label: 'Brain Clarity', key: 'clarity', color: 'bg-blue-500' },
                  { label: 'Physical Comfort', key: 'comfort', color: 'bg-orange-500' }
                ].map((symptom) => (
                  <div key={symptom.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">{symptom.label}</Label>
                      <span className="text-sm text-gray-500">
                        {responses[symptom.key] || 5}/10
                      </span>
                    </div>
                    <Slider
                      value={[responses[symptom.key] || 5]}
                      onValueChange={(value) => setResponses({...responses, [symptom.key]: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Notes & Observations</h4>
              <Textarea
                placeholder="What patterns do you notice? Any triggers or helpful practices today?"
                value={responses.notes || ''}
                onChange={(e) => setResponses({...responses, notes: e.target.value})}
                className="h-24"
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Today's Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Energy Mapping - Week 1
  if (component.id === 'energy-mapping') {
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
              <Zap className="w-5 h-5 text-yellow-500" />
              Personal Energy Pattern Discovery
            </CardTitle>
            <p className="text-sm text-gray-600">Map your energy throughout the day to optimize your schedule and activities.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Track Your Energy Throughout the Day</h4>
              <p className="text-sm text-gray-600 mb-4">Rate your energy levels at different times (1 = exhausted, 10 = highly energized)</p>
              
              <div className="space-y-4">
                {[
                  { time: '6-8 AM', label: 'Early Morning', key: 'earlyMorning' },
                  { time: '8-10 AM', label: 'Mid Morning', key: 'midMorning' },
                  { time: '10-12 PM', label: 'Late Morning', key: 'lateMorning' },
                  { time: '12-2 PM', label: 'Early Afternoon', key: 'earlyAfternoon' },
                  { time: '2-4 PM', label: 'Mid Afternoon', key: 'midAfternoon' },
                  { time: '4-6 PM', label: 'Late Afternoon', key: 'lateAfternoon' },
                  { time: '6-8 PM', label: 'Early Evening', key: 'earlyEvening' },
                  { time: '8-10 PM', label: 'Late Evening', key: 'lateEvening' }
                ].map((timeSlot) => (
                  <div key={timeSlot.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">{timeSlot.time} - {timeSlot.label}</Label>
                      <span className="text-sm text-gray-500">
                        {responses[timeSlot.key] || 5}/10
                      </span>
                    </div>
                    <Slider
                      value={[responses[timeSlot.key] || 5]}
                      onValueChange={(value) => setResponses({...responses, [timeSlot.key]: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Energy Insights</h4>
              <div className="space-y-3">
                <div>
                  <Label className="font-medium">When do you feel most energized?</Label>
                  <Input
                    placeholder="e.g., Mid-morning around 10 AM"
                    value={responses.peakEnergy || ''}
                    onChange={(e) => setResponses({...responses, peakEnergy: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium">When do you typically experience energy dips?</Label>
                  <Input
                    placeholder="e.g., Mid-afternoon around 2-3 PM"
                    value={responses.energyDips || ''}
                    onChange={(e) => setResponses({...responses, energyDips: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium">What activities or foods boost your energy?</Label>
                  <Textarea
                    placeholder="List specific activities, foods, or practices that help increase your energy..."
                    value={responses.energyBoosters || ''}
                    onChange={(e) => setResponses({...responses, energyBoosters: e.target.value})}
                    className="h-20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Energy Optimization Tips</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Schedule important tasks during your natural energy peaks</li>
                <li>• Plan gentle activities during predictable energy dips</li>
                <li>• Use energy boosters strategically throughout your day</li>
                <li>• Track for a week to identify your unique patterns</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Complete Energy Mapping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Evening Wind-Down - Week 1
  if (component.id === 'evening-wind-down') {
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
              <Moon className="w-5 h-5 text-indigo-500" />
              Evening Wind-Down Routine Creation
            </CardTitle>
            <p className="text-sm text-gray-600">Design your personalized progesterone-supporting evening ritual for better sleep and hormone balance.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h5 className="font-semibold text-indigo-800 mb-2">Why Evening Routines Matter for Hormones</h5>
              <p className="text-sm text-indigo-700 mb-3">
                Your evening routine directly impacts sleep quality and hormone production. A consistent wind-down ritual:
              </p>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• <strong>Supports Progesterone Production:</strong> Calm evenings promote this calming hormone</li>
                <li>• <strong>Reduces Cortisol:</strong> Helps your stress hormone naturally decline</li>
                <li>• <strong>Improves Sleep Architecture:</strong> Better deep sleep phases for recovery</li>
                <li>• <strong>Regulates Body Temperature:</strong> Important for melatonin production</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Create Your 30-Minute Wind-Down (Choose 3-4 activities)</h4>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium mb-3 block">🛁 Physical Comfort (choose 1-2)</Label>
                  <div className="space-y-2">
                    {[
                      'Warm bath with Epsom salts and lavender',
                      'Gentle stretching or restorative yoga',
                      'Self-massage with magnesium oil',
                      'Warm herbal tea (chamomile, passionflower, or lemon balm)'
                    ].map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.physicalActivities?.includes(activity) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.physicalActivities || [];
                            const updated = checked 
                              ? [...current, activity]
                              : current.filter((a: string) => a !== activity);
                            setResponses({...responses, physicalActivities: updated});
                          }}
                        />
                        <Label className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-3 block">🧠 Mental Calm (choose 1-2)</Label>
                  <div className="space-y-2">
                    {[
                      'Journaling - gratitude or brain dump',
                      'Reading fiction or inspirational books',
                      'Meditation or breathing exercises',
                      'Gentle music or nature sounds'
                    ].map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.mentalActivities?.includes(activity) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.mentalActivities || [];
                            const updated = checked 
                              ? [...current, activity]
                              : current.filter((a: string) => a !== activity);
                            setResponses({...responses, mentalActivities: updated});
                          }}
                        />
                        <Label className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-3 block">🌙 Sleep Preparation (choose 1-2)</Label>
                  <div className="space-y-2">
                    {[
                      'Dim lights 1 hour before bed',
                      'Cool bedroom temperature (65-68°F)',
                      'Essential oils diffusion (lavender, bergamot)',
                      'Blue light blocking glasses',
                      'Prepare tomorrow\'s priorities (brain dump)'
                    ].map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.sleepActivities?.includes(activity) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.sleepActivities || [];
                            const updated = checked 
                              ? [...current, activity]
                              : current.filter((a: string) => a !== activity);
                            setResponses({...responses, sleepActivities: updated});
                          }}
                        />
                        <Label className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(responses.physicalActivities?.length > 0 || responses.mentalActivities?.length > 0 || responses.sleepActivities?.length > 0) && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">🌙 Your Personal Evening Ritual</h5>
                <div className="text-sm text-purple-700 space-y-2">
                  {responses.physicalActivities?.length > 0 && (
                    <div>
                      <strong>Physical Comfort:</strong>
                      <ul className="ml-4 list-disc">
                        {responses.physicalActivities.map((activity: string, index: number) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {responses.mentalActivities?.length > 0 && (
                    <div>
                      <strong>Mental Calm:</strong>
                      <ul className="ml-4 list-disc">
                        {responses.mentalActivities.map((activity: string, index: number) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {responses.sleepActivities?.length > 0 && (
                    <div>
                      <strong>Sleep Preparation:</strong>
                      <ul className="ml-4 list-disc">
                        {responses.sleepActivities.map((activity: string, index: number) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Success Strategy</h5>
              <p className="text-sm text-blue-700">
                Start with just 2-3 activities and build gradually. Consistency is more important than perfection. 
                Even 15 minutes of intentional wind-down can significantly improve your sleep quality and hormone balance.
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!responses.physicalActivities?.length && !responses.mentalActivities?.length && !responses.sleepActivities?.length}
              >
                Complete Evening Routine Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 2: CBT Reframing Techniques
  if (component.id === 'w2-cbt') {
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
            <p className="text-sm text-gray-600">Learn cognitive behavioral therapy techniques to transform negative thought patterns during midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">Understanding CBT for Midlife Women</h5>
              <p className="text-sm text-blue-700 mb-3">
                During perimenopause, hormonal fluctuations can intensify negative thought patterns. CBT helps by:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Identifying Thought Distortions:</strong> Recognizing unhelpful thinking patterns</li>
                <li>• <strong>Challenging Negative Thoughts:</strong> Questioning the validity of critical self-talk</li>
                <li>• <strong>Creating Balanced Perspectives:</strong> Developing more realistic and compassionate viewpoints</li>
                <li>• <strong>Building Mental Resilience:</strong> Strengthening your ability to cope with emotional challenges</li>
              </ul>
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
                  <Label className="font-medium mb-2 block">Step 3: Identify Thinking Errors</Label>
                  <p className="text-sm text-gray-600 mb-3">Which of these common thinking patterns apply to your thought? (Check all that apply)</p>
                  <div className="space-y-2">
                    {[
                      'All-or-nothing thinking (seeing things as completely good or bad)',
                      'Mental filtering (focusing only on negative aspects)',
                      'Catastrophizing (imagining the worst possible outcome)',
                      'Mind reading (assuming you know what others think)',
                      'Personalization (blaming yourself for things outside your control)',
                      'Should statements (rigid expectations of how things "should" be)',
                      'Emotional reasoning (believing feelings reflect reality)'
                    ].map((error) => (
                      <div key={error} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.thinkingErrors?.includes(error) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.thinkingErrors || [];
                            const updated = checked 
                              ? [...current, error]
                              : current.filter((e: string) => e !== error);
                            setResponses({...responses, thinkingErrors: updated});
                          }}
                        />
                        <Label className="text-sm">{error}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 4: Challenge the Thought</Label>
                  <p className="text-sm text-gray-600 mb-3">Ask yourself these questions about your negative thought:</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">What evidence supports this thought?</Label>
                      <Textarea
                        placeholder="List factual evidence, not emotions or assumptions..."
                        value={responses.supportingEvidence || ''}
                        onChange={(e) => setResponses({...responses, supportingEvidence: e.target.value})}
                        className="h-16 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">What evidence contradicts this thought?</Label>
                      <Textarea
                        placeholder="Think of times you've succeeded, positive feedback, accomplishments..."
                        value={responses.contradictingEvidence || ''}
                        onChange={(e) => setResponses({...responses, contradictingEvidence: e.target.value})}
                        className="h-16 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">What would you tell a dear friend having this same thought?</Label>
                      <Textarea
                        placeholder="Write with the same compassion you'd show a loved one..."
                        value={responses.friendAdvice || ''}
                        onChange={(e) => setResponses({...responses, friendAdvice: e.target.value})}
                        className="h-16 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 5: Create a Balanced Thought</Label>
                  <p className="text-sm text-gray-600 mb-3">Rewrite your original thought in a more balanced, realistic way:</p>
                  <Textarea
                    placeholder="Example: 'I'm going through a challenging transition with perimenopause. Some days are harder than others, but I'm learning new strategies to cope. I have many strengths and I'm doing the best I can right now.'"
                    value={responses.balancedThought || ''}
                    onChange={(e) => setResponses({...responses, balancedThought: e.target.value})}
                    className="h-24"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 6: Rate New Emotional Intensity</Label>
                  <p className="text-sm text-gray-600 mb-3">How strongly do you believe your balanced thought? Notice any change from Step 2:</p>
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
                Use this 6-step process whenever you notice negative thought spirals. With practice, challenging unhelpful thoughts becomes automatic, reducing anxiety and building emotional resilience during this life transition.
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

  // Week 2: Mirror Work & Affirmations
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
              <h4 className="font-semibold mb-4">Step 1: Mirror Reflection Assessment</h4>
              <p className="text-sm text-gray-600 mb-4">First, let's understand your current relationship with your reflection:</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">When you look in the mirror, what's your first thought?</Label>
                  <Textarea
                    placeholder="Be honest about what goes through your mind..."
                    value={responses.mirrorFirstThought || ''}
                    onChange={(e) => setResponses({...responses, mirrorFirstThought: e.target.value})}
                    className="h-16 mt-2"
                  />
                </div>
                
                <div>
                  <Label className="font-medium">Rate your comfort level with mirror eye contact (1-10):</Label>
                  <div className="flex items-center gap-4 mt-2">
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
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Very uncomfortable</span>
                    <span>Completely comfortable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Step 2: Create Your Personal Affirmations</h4>
              <p className="text-sm text-gray-600 mb-4">Design affirmations that address your specific needs and challenges:</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">For Self-Acceptance (choose or create your own):</Label>
                  <RadioGroup
                    value={responses.selfAcceptanceAffirmation || ''}
                    onValueChange={(value) => setResponses({...responses, selfAcceptanceAffirmation: value})}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="love-myself" id="love-myself" />
                        <Label htmlFor="love-myself" className="text-sm">"I love and accept myself exactly as I am right now"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="worthy" id="worthy" />
                        <Label htmlFor="worthy" className="text-sm">"I am worthy of love, respect, and kindness"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enough" id="enough" />
                        <Label htmlFor="enough" className="text-sm">"I am enough, just as I am"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom-acceptance" id="custom-acceptance" />
                        <Label htmlFor="custom-acceptance" className="text-sm">Create my own:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {responses.selfAcceptanceAffirmation === 'custom-acceptance' && (
                    <Input
                      placeholder="Write your personal self-acceptance affirmation..."
                      value={responses.customAcceptanceAffirmation || ''}
                      onChange={(e) => setResponses({...responses, customAcceptanceAffirmation: e.target.value})}
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label className="font-medium">For Midlife Transitions:</Label>
                  <RadioGroup
                    value={responses.transitionAffirmation || ''}
                    onValueChange={(value) => setResponses({...responses, transitionAffirmation: value})}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="growing-stronger" id="growing-stronger" />
                        <Label htmlFor="growing-stronger" className="text-sm">"I am growing stronger and wiser with each passing day"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="trust-journey" id="trust-journey" />
                        <Label htmlFor="trust-journey" className="text-sm">"I trust my journey and honor the woman I am becoming"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="embrace-change" id="embrace-change" />
                        <Label htmlFor="embrace-change" className="text-sm">"I embrace change as an opportunity for growth and renewal"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom-transition" id="custom-transition" />
                        <Label htmlFor="custom-transition" className="text-sm">Create my own:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {responses.transitionAffirmation === 'custom-transition' && (
                    <Input
                      placeholder="Write your personal transition affirmation..."
                      value={responses.customTransitionAffirmation || ''}
                      onChange={(e) => setResponses({...responses, customTransitionAffirmation: e.target.value})}
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label className="font-medium">For Body Confidence:</Label>
                  <RadioGroup
                    value={responses.bodyAffirmation || ''}
                    onValueChange={(value) => setResponses({...responses, bodyAffirmation: value})}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="body-wisdom" id="body-wisdom" />
                        <Label htmlFor="body-wisdom" className="text-sm">"My body holds wisdom and deserves love and care"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beautiful-strong" id="beautiful-strong" />
                        <Label htmlFor="beautiful-strong" className="text-sm">"I am beautiful, strong, and capable"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grateful-body" id="grateful-body" />
                        <Label htmlFor="grateful-body" className="text-sm">"I am grateful for all my body does for me"</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom-body" id="custom-body" />
                        <Label htmlFor="custom-body" className="text-sm">Create my own:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {responses.bodyAffirmation === 'custom-body' && (
                    <Input
                      placeholder="Write your personal body confidence affirmation..."
                      value={responses.customBodyAffirmation || ''}
                      onChange={(e) => setResponses({...responses, customBodyAffirmation: e.target.value})}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Step 3: Mirror Practice Commitment</h4>
              <p className="text-sm text-gray-600 mb-4">Choose how you'll practice your mirror work:</p>
              
              <div className="space-y-3">
                <div>
                  <Label className="font-medium">When will you practice? (Choose all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Morning routine (while getting ready)',
                      'Before bed (as part of wind-down)',
                      'During difficult moments (for self-soothing)',
                      'Set reminder times throughout the day'
                    ].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.practiceTimes?.includes(time) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.practiceTimes || [];
                            const updated = checked 
                              ? [...current, time]
                              : current.filter((t: string) => t !== time);
                            setResponses({...responses, practiceTimes: updated});
                          }}
                        />
                        <Label className="text-sm">{time}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">How long will you practice each time?</Label>
                  <Select value={responses.practiceDuration || ''} onValueChange={(value) => setResponses({...responses, practiceDuration: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30-seconds">30 seconds (gentle start)</SelectItem>
                      <SelectItem value="1-minute">1 minute (building comfort)</SelectItem>
                      <SelectItem value="2-minutes">2 minutes (deeper practice)</SelectItem>
                      <SelectItem value="5-minutes">5 minutes (full session)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {(responses.selfAcceptanceAffirmation && responses.transitionAffirmation && responses.bodyAffirmation) && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">💜 Your Mirror Work Practice</h5>
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>Your Affirmations:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Self-Acceptance: "{responses.selfAcceptanceAffirmation === 'custom-acceptance' ? responses.customAcceptanceAffirmation : responses.selfAcceptanceAffirmation?.replace('-', ' ')}"</li>
                    <li>• Midlife Transition: "{responses.transitionAffirmation === 'custom-transition' ? responses.customTransitionAffirmation : responses.transitionAffirmation?.replace('-', ' ')}"</li>
                    <li>• Body Confidence: "{responses.bodyAffirmation === 'custom-body' ? responses.customBodyAffirmation : responses.bodyAffirmation?.replace('-', ' ')}"</li>
                  </ul>
                  {responses.practiceTimes?.length > 0 && (
                    <p><strong>Practice Schedule:</strong> {responses.practiceTimes.join(', ')}</p>
                  )}
                  {responses.practiceDuration && (
                    <p><strong>Duration:</strong> {responses.practiceDuration}</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="font-semibold text-orange-800 mb-2">💡 Practice Tips</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• <strong>Start small:</strong> Even 30 seconds daily builds the habit</li>
                <li>• <strong>Be patient:</strong> It may feel awkward at first - this is completely normal</li>
                <li>• <strong>Make eye contact:</strong> Look directly into your eyes while speaking</li>
                <li>• <strong>Speak with kindness:</strong> Use the same tone you'd use with a dear friend</li>
                <li>• <strong>Notice resistance:</strong> When it feels difficult, that's where the healing happens</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={!responses.selfAcceptanceAffirmation || !responses.transitionAffirmation || !responses.bodyAffirmation}
              >
                Complete Mirror Work Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 2: NLP Reframing Practice
  if (component.id === 'w2-nlp') {
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
              <Zap className="w-5 h-5 text-green-500" />
              NLP Reframing Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Use neuro-linguistic programming techniques to transform limiting beliefs and create empowering thought patterns.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">NLP Reframing for Midlife Empowerment</h5>
              <p className="text-sm text-green-700 mb-3">
                NLP reframing helps you shift perspectives and language patterns. For midlife women, this technique:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Changes Internal Language:</strong> Transforms how you talk to yourself</li>
                <li>• <strong>Shifts Perspective:</strong> Helps you see challenges as opportunities</li>
                <li>• <strong>Builds Resourceful States:</strong> Creates mental states that support your goals</li>
                <li>• <strong>Anchors Positive Emotions:</strong> Links empowering feelings to specific thoughts</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Interactive NLP Reframe Exercise</h4>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium mb-2 block">Step 1: Identify a Limiting Belief</Label>
                  <p className="text-sm text-gray-600 mb-3">What belief about yourself or your capabilities is holding you back?</p>
                  <Textarea
                    placeholder="Example: 'I'm too old to start new things' or 'I'm not tech-savvy enough for today's world'"
                    value={responses.limitingBelief || ''}
                    onChange={(e) => setResponses({...responses, limitingBelief: e.target.value})}
                    className="h-20"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 2: Find the Positive Intention</Label>
                  <p className="text-sm text-gray-600 mb-3">What positive purpose might this belief have served in the past?</p>
                  <Textarea
                    placeholder="Example: 'This belief protected me from feeling disappointed or embarrassed if I failed'"
                    value={responses.positiveIntention || ''}
                    onChange={(e) => setResponses({...responses, positiveIntention: e.target.value})}
                    className="h-16"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 3: Challenge with Counter-Examples</Label>
                  <p className="text-sm text-gray-600 mb-3">Think of evidence that contradicts this limiting belief:</p>
                  <Textarea
                    placeholder="Example: 'I learned to use a smartphone at 48, I started yoga at 50, my friend launched a business at 55'"
                    value={responses.counterExamples || ''}
                    onChange={(e) => setResponses({...responses, counterExamples: e.target.value})}
                    className="h-20"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 4: Create an Empowering Reframe</Label>
                  <p className="text-sm text-gray-600 mb-3">Transform your limiting belief into an empowering statement:</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Original belief:</Label>
                      <Input
                        value={responses.limitingBelief || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">New empowering belief:</Label>
                      <Textarea
                        placeholder="Example: 'I am in my prime for learning and growth. My experience gives me wisdom that younger people don't have, and I have the freedom to explore new possibilities.'"
                        value={responses.empoweringBelief || ''}
                        onChange={(e) => setResponses({...responses, empoweringBelief: e.target.value})}
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 5: Anchor the New Belief</Label>
                  <p className="text-sm text-gray-600 mb-3">Create a physical anchor to strengthen your new empowering belief:</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Choose your anchor gesture:</Label>
                      <RadioGroup
                        value={responses.anchorGesture || ''}
                        onValueChange={(value) => setResponses({...responses, anchorGesture: value})}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fist-power" id="fist-power" />
                            <Label htmlFor="fist-power" className="text-sm">Gentle fist pump (strength & determination)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hand-heart" id="hand-heart" />
                            <Label htmlFor="hand-heart" className="text-sm">Hand over heart (self-love & compassion)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="touch-collar" id="touch-collar" />
                            <Label htmlFor="touch-collar" className="text-sm">Touch collarbone (confidence & poise)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="press-palms" id="press-palms" />
                            <Label htmlFor="press-palms" className="text-sm">Press palms together (centered & grounded)</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Practice Instructions:</Label>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p className="mb-2">Right now, practice your anchor:</p>
                        <ol className="space-y-1 list-decimal list-inside">
                          <li>Perform your chosen gesture</li>
                          <li>Say your empowering belief out loud with conviction</li>
                          <li>Visualize yourself living this new belief</li>
                          <li>Hold the gesture for 10 seconds while feeling empowered</li>
                          <li>Release and take a deep breath</li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <Checkbox
                        checked={responses.completedAnchor || false}
                        onCheckedChange={(checked) => setResponses({...responses, completedAnchor: checked})}
                      />
                      <Label className="ml-2 text-sm">I have practiced my anchor gesture</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Step 6: Future Visualization</Label>
                  <p className="text-sm text-gray-600 mb-3">Describe how your life will be different with this new empowering belief:</p>
                  <Textarea
                    placeholder="How will you think, feel, and act differently? What new opportunities will open up?"
                    value={responses.futureVisualization || ''}
                    onChange={(e) => setResponses({...responses, futureVisualization: e.target.value})}
                    className="h-24"
                  />
                </div>
              </div>
            </div>

            {responses.limitingBelief && responses.empoweringBelief && responses.anchorGesture && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">⚡ Your NLP Reframe Summary</h5>
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>Old Limiting Belief:</strong> "{responses.limitingBelief}"</p>
                  <p><strong>New Empowering Belief:</strong> "{responses.empoweringBelief}"</p>
                  <p><strong>Anchor Gesture:</strong> {responses.anchorGesture?.replace('-', ' ')}</p>
                  <p className="text-xs bg-purple-100 p-2 rounded mt-2">
                    <strong>Daily Practice:</strong> Use your anchor gesture whenever you need to access this empowering belief. 
                    The more you practice, the stronger the neural pathway becomes.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Integration Strategy</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Morning Affirmation:</strong> State your new belief while doing your anchor gesture</li>
                <li>• <strong>Before Challenges:</strong> Use your anchor to access your empowered state</li>
                <li>• <strong>Weekly Review:</strong> Notice how your behavior changes as you embody this new belief</li>
                <li>• <strong>Expand:</strong> Apply this reframing technique to other limiting beliefs</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!responses.limitingBelief || !responses.empoweringBelief || !responses.anchorGesture || !responses.completedAnchor}
              >
                Complete NLP Reframing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 2: Thought Audit Tracker
  if (component.id === 'w2-audit') {
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
              <BarChart className="w-5 h-5 text-purple-500" />
              Thought Audit Tracker
            </CardTitle>
            <p className="text-sm text-gray-600">Identify and replace self-critical thoughts with compassionate, realistic alternatives.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h5 className="font-semibold text-purple-800 mb-2">Why Thought Auditing Matters</h5>
              <p className="text-sm text-purple-700 mb-3">
                Most of our thoughts are automatic and unconscious. A thought audit helps you:
              </p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• <strong>Increase Awareness:</strong> Notice your habitual thought patterns</li>
                <li>• <strong>Identify Triggers:</strong> Understand what situations spark negative thinking</li>
                <li>• <strong>Track Progress:</strong> See how your self-talk improves over time</li>
                <li>• <strong>Build New Habits:</strong> Replace criticism with compassion automatically</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Daily Thought Log</h4>
              <p className="text-sm text-gray-600 mb-4">Track 3-5 self-critical thoughts today. For each one, practice reframing:</p>
              
              <div className="space-y-4">
                {[1, 2, 3].map((thoughtNumber) => (
                  <div key={thoughtNumber} className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium mb-3">Thought Entry #{thoughtNumber}</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Time & Situation:</Label>
                        <Input
                          placeholder="e.g., 2:30 PM - Looking in the mirror after lunch"
                          value={responses[`thought${thoughtNumber}Context`] || ''}
                          onChange={(e) => setResponses({...responses, [`thought${thoughtNumber}Context`]: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Critical Thought:</Label>
                        <Textarea
                          placeholder="What exactly did you think? Write it word-for-word..."
                          value={responses[`thought${thoughtNumber}Critical`] || ''}
                          onChange={(e) => setResponses({...responses, [`thought${thoughtNumber}Critical`]: e.target.value})}
                          className="h-16"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Emotional Impact (1-10):</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[responses[`thought${thoughtNumber}Impact`] || 5]}
                            onValueChange={(value) => setResponses({...responses, [`thought${thoughtNumber}Impact`]: value[0]})}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm font-bold text-red-600">{responses[`thought${thoughtNumber}Impact`] || 5}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Compassionate Reframe:</Label>
                        <Textarea
                          placeholder="How would you speak to a dear friend in this situation? Rewrite with kindness..."
                          value={responses[`thought${thoughtNumber}Reframe`] || ''}
                          onChange={(e) => setResponses({...responses, [`thought${thoughtNumber}Reframe`]: e.target.value})}
                          className="h-16"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">New Emotional Impact (1-10):</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[responses[`thought${thoughtNumber}NewImpact`] || 5]}
                            onValueChange={(value) => setResponses({...responses, [`thought${thoughtNumber}NewImpact`]: value[0]})}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm font-bold text-green-600">{responses[`thought${thoughtNumber}NewImpact`] || 5}/10</span>
                        </div>
                        {responses[`thought${thoughtNumber}Impact`] && responses[`thought${thoughtNumber}NewImpact`] && (
                          <div className="mt-1 text-xs">
                            <span className="text-gray-600">Improvement: </span>
                            <span className={responses[`thought${thoughtNumber}NewImpact`] < responses[`thought${thoughtNumber}Impact`] ? 'text-green-600 font-medium' : 'text-gray-600'}>
                              {responses[`thought${thoughtNumber}Impact`]} → {responses[`thought${thoughtNumber}NewImpact`]}
                              {responses[`thought${thoughtNumber}NewImpact`] < responses[`thought${thoughtNumber}Impact`] && ' (Better!)'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Pattern Recognition</h4>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">What themes do you notice in your self-critical thoughts?</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Appearance/body image concerns',
                      'Age-related self-criticism',
                      'Competence/ability doubts',
                      'Comparison to others',
                      'Past mistakes/regrets',
                      'Future worries/fears',
                      'Perfectionism/not being "enough"'
                    ].map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.criticalThemes?.includes(theme) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.criticalThemes || [];
                            const updated = checked 
                              ? [...current, theme]
                              : current.filter((t: string) => t !== theme);
                            setResponses({...responses, criticalThemes: updated});
                          }}
                        />
                        <Label className="text-sm">{theme}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">What times/situations trigger your inner critic most?</Label>
                  <Textarea
                    placeholder="e.g., Mornings when I'm tired, social situations, work presentations, looking in mirrors..."
                    value={responses.triggerSituations || ''}
                    onChange={(e) => setResponses({...responses, triggerSituations: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">What positive changes do you commit to making?</Label>
                  <Textarea
                    placeholder="e.g., I will catch myself when I start comparing to others and remind myself of my unique strengths..."
                    value={responses.positiveCommitments || ''}
                    onChange={(e) => setResponses({...responses, positiveCommitments: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Weekly Practice</h5>
              <p className="text-sm text-green-700">
                Continue this thought audit for 7 days. Notice how awareness alone begins to soften your inner critic. 
                The goal isn't perfect thoughts - it's creating space between you and your automatic reactions.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-purple-600 hover:bg-purple-700 text-white">
                Save Thought Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 3: Overwhelm Pattern Analysis
  if (component.id === 'w3-patterns') {
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
              <Activity className="w-5 h-5 text-orange-500" />
              Personal Overwhelm Pattern Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">Identify your unique emotional overwhelm triggers and develop targeted coping strategies.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="font-semibold text-orange-800 mb-2">Understanding Midlife Overwhelm</h5>
              <p className="text-sm text-orange-700 mb-3">
                Emotional overwhelm during midlife often stems from multiple factors converging. Understanding your patterns helps you:
              </p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• <strong>Recognize Early Warning Signs:</strong> Catch overwhelm before it peaks</li>
                <li>• <strong>Identify Root Causes:</strong> Address underlying issues, not just symptoms</li>
                <li>• <strong>Develop Prevention Strategies:</strong> Create protective boundaries and practices</li>
                <li>• <strong>Build Resilience:</strong> Strengthen your capacity to handle life's challenges</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Overwhelm Trigger Assessment</h4>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium mb-3 block">Physical/Hormonal Triggers (Rate 1-5 how often these contribute to overwhelm):</Label>
                  <div className="space-y-3">
                    {[
                      'Sleep deprivation or poor sleep quality',
                      'Hormonal fluctuations (PMS, perimenopause)',
                      'Physical pain or discomfort',
                      'Fatigue or low energy',
                      'Hunger or blood sugar drops',
                      'Caffeine or alcohol effects'
                    ].map((trigger) => (
                      <div key={trigger} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{trigger}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setResponses({...responses, [`physical_${trigger}`]: rating})}
                              className={`w-8 h-8 rounded-full text-xs font-bold ${
                                responses[`physical_${trigger}`] === rating 
                                  ? 'bg-orange-500 text-white' 
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-3 block">Emotional Triggers (Rate 1-5 how often these contribute to overwhelm):</Label>
                  <div className="space-y-3">
                    {[
                      'Feeling unappreciated or taken for granted',
                      'Criticism or conflict with others',
                      'Financial stress or money worries',
                      'Health concerns (yours or loved ones)',
                      'Feeling like you\'re falling behind peers',
                      'Loss of identity or life purpose uncertainty'
                    ].map((trigger) => (
                      <div key={trigger} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{trigger}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setResponses({...responses, [`emotional_${trigger}`]: rating})}
                              className={`w-8 h-8 rounded-full text-xs font-bold ${
                                responses[`emotional_${trigger}`] === rating 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-3 block">Situational Triggers (Rate 1-5 how often these contribute to overwhelm):</Label>
                  <div className="space-y-3">
                    {[
                      'Too many commitments or obligations',
                      'Technology problems or learning curves',
                      'Unexpected changes or disruptions',
                      'Social events or large gatherings',
                      'Messy or disorganized environment',
                      'Time pressure or rushing'
                    ].map((trigger) => (
                      <div key={trigger} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{trigger}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setResponses({...responses, [`situational_${trigger}`]: rating})}
                              className={`w-8 h-8 rounded-full text-xs font-bold ${
                                responses[`situational_${trigger}`] === rating 
                                  ? 'bg-purple-500 text-white' 
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Pattern Recognition</h4>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">What time of day do you typically feel most overwhelmed?</Label>
                  <RadioGroup
                    value={responses.overwhelmTime || ''}
                    onValueChange={(value) => setResponses({...responses, overwhelmTime: value})}
                    className="mt-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="early-morning" id="early-morning" />
                        <Label htmlFor="early-morning" className="text-sm">Early morning (6-9 AM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="late-morning" id="late-morning" />
                        <Label htmlFor="late-morning" className="text-sm">Late morning (9-12 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon" className="text-sm">Afternoon (12-5 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening" className="text-sm">Evening (5-9 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="night" id="night" />
                        <Label htmlFor="night" className="text-sm">Night (9 PM+)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="varies" id="varies" />
                        <Label htmlFor="varies" className="text-sm">It varies</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="font-medium">Describe a recent overwhelming situation in detail:</Label>
                  <Textarea
                    placeholder="What happened? What triggered it? How did you feel? What thoughts went through your mind?"
                    value={responses.recentOverwhelm || ''}
                    onChange={(e) => setResponses({...responses, recentOverwhelm: e.target.value})}
                    className="h-24 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">What early warning signs do you notice before overwhelm hits?</Label>
                  <Textarea
                    placeholder="Physical sensations, emotional changes, thought patterns, behavior changes..."
                    value={responses.warningSignsPattern || ''}
                    onChange={(e) => setResponses({...responses, warningSignsPattern: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">What currently helps you cope when overwhelm strikes?</Label>
                  <Textarea
                    placeholder="Current strategies that work (even partially) for you..."
                    value={responses.currentCoping || ''}
                    onChange={(e) => setResponses({...responses, currentCoping: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Your Personal Action Plan</h5>
              <p className="text-sm text-green-700">
                Use this analysis to create targeted prevention strategies. Focus on your highest-rated triggers first, 
                and build early intervention practices around your identified warning signs.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-orange-600 hover:bg-orange-700 text-white">
                Complete Pattern Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 3: Pause-Label-Shift Technique
  if (component.id === 'w3-technique') {
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
              <Clock className="w-5 h-5 text-teal-500" />
              Pause-Label-Shift Emotion Regulation
            </CardTitle>
            <p className="text-sm text-gray-600">Master the three-step technique for managing intense emotions in real-time.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
              <h5 className="font-semibold text-teal-800 mb-2">The Science of Pause-Label-Shift</h5>
              <p className="text-sm text-teal-700 mb-3">
                This technique works by engaging your prefrontal cortex to regulate your limbic system. Research shows that:
              </p>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• <strong>Pausing</strong> activates your parasympathetic nervous system</li>
                <li>• <strong>Labeling</strong> emotions reduces their intensity by 50%</li>
                <li>• <strong>Shifting</strong> perspective creates new neural pathways</li>
                <li>• Regular practice builds emotional resilience over time</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Learn the Three Steps</h4>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                  <h5 className="font-semibold text-gray-800 mb-2">Step 1: PAUSE</h5>
                  <p className="text-sm text-gray-700 mb-3">
                    Stop whatever you're doing and create space between yourself and the emotion.
                  </p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium mb-2">Practice the 5-4-3-2-1 Grounding:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 5 things you can see</li>
                      <li>• 4 things you can touch</li>
                      <li>• 3 things you can hear</li>
                      <li>• 2 things you can smell</li>
                      <li>• 1 thing you can taste</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h5 className="font-semibold text-blue-800 mb-2">Step 2: LABEL</h5>
                  <p className="text-sm text-blue-700 mb-3">
                    Name the emotion specifically. The more precise, the more effective.
                  </p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium mb-2">Instead of "I feel bad," try:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>• Frustrated</span>
                      <span>• Anxious</span>
                      <span>• Disappointed</span>
                      <span>• Overwhelmed</span>
                      <span>• Irritated</span>
                      <span>• Resentful</span>
                      <span>• Exhausted</span>
                      <span>• Lonely</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h5 className="font-semibold text-green-800 mb-2">Step 3: SHIFT</h5>
                  <p className="text-sm text-green-700 mb-3">
                    Choose a perspective or action that serves you better.
                  </p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium mb-2">Shift options:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Ask: "What would I tell a friend in this situation?"</li>
                      <li>• Reframe: "This is temporary and I can handle it"</li>
                      <li>• Action: "What one small step can I take right now?"</li>
                      <li>• Self-compassion: "I'm doing the best I can"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Practice Session</h4>
              <p className="text-sm text-gray-600 mb-4">Think of a mildly challenging situation and practice the technique:</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Describe the situation that's bothering you:</Label>
                  <Textarea
                    placeholder="Choose something mildly stressful, not overwhelming..."
                    value={responses.practiceScenario || ''}
                    onChange={(e) => setResponses({...responses, practiceScenario: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium text-gray-800">STEP 1: PAUSE</Label>
                      <p className="text-sm text-gray-600 mb-2">Take a deep breath and ground yourself. Check off when complete:</p>
                      <Checkbox
                        checked={responses.pauseComplete || false}
                        onCheckedChange={(checked) => setResponses({...responses, pauseComplete: checked})}
                      />
                      <Label className="ml-2 text-sm">I have paused and grounded myself</Label>
                    </div>

                    <div>
                      <Label className="font-medium text-blue-800">STEP 2: LABEL</Label>
                      <p className="text-sm text-gray-600 mb-2">What specific emotion are you feeling?</p>
                      <Input
                        placeholder="Be as specific as possible (e.g., frustrated, anxious, disappointed)"
                        value={responses.emotionLabel || ''}
                        onChange={(e) => setResponses({...responses, emotionLabel: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label className="font-medium text-green-800">STEP 3: SHIFT</Label>
                      <p className="text-sm text-gray-600 mb-2">Choose a helpful perspective or action:</p>
                      <Textarea
                        placeholder="How can you reframe this situation or what action can you take?"
                        value={responses.shiftResponse || ''}
                        onChange={(e) => setResponses({...responses, shiftResponse: e.target.value})}
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">How do you feel now compared to before the technique? (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">Before:</span>
                    <Slider
                      value={[responses.beforeIntensity || 5]}
                      onValueChange={(value) => setResponses({...responses, beforeIntensity: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-red-600">{responses.beforeIntensity || 5}/10</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">After:</span>
                    <Slider
                      value={[responses.afterIntensity || 5]}
                      onValueChange={(value) => setResponses({...responses, afterIntensity: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-green-600">{responses.afterIntensity || 5}/10</span>
                  </div>
                  {responses.beforeIntensity && responses.afterIntensity && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Change: </span>
                      <span className={responses.afterIntensity < responses.beforeIntensity ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {responses.beforeIntensity} → {responses.afterIntensity}
                        {responses.afterIntensity < responses.beforeIntensity && ' (Improved!)'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 className="font-semibold text-yellow-800 mb-2">💡 Daily Integration</h5>
              <p className="text-sm text-yellow-700">
                Practice this technique 2-3 times daily, even with mild irritations. The more you use it, 
                the more automatic it becomes. Set phone reminders to check in with your emotions and practice.
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={!responses.practiceScenario || !responses.pauseComplete || !responses.emotionLabel || !responses.shiftResponse}
              >
                Complete Technique Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 3: Boundaries Worksheet
  if (component.id === 'w3-boundaries') {
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
              <Shield className="w-5 h-5 text-emerald-500" />
              Healthy Boundaries Builder
            </CardTitle>
            <p className="text-sm text-gray-600">Establish clear, healthy boundaries in relationships and commitments to protect your energy and well-being.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
              <h5 className="font-semibold text-emerald-800 mb-2">Why Boundaries Matter in Midlife</h5>
              <p className="text-sm text-emerald-700 mb-3">
                During midlife transitions, many women struggle with boundary-setting as roles shift. Healthy boundaries:
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• <strong>Preserve Energy:</strong> Protect your physical and emotional resources</li>
                <li>• <strong>Reduce Resentment:</strong> Prevent overcommitment and burnout</li>
                <li>• <strong>Improve Relationships:</strong> Create clearer, more authentic connections</li>
                <li>• <strong>Honor Your Values:</strong> Align your actions with what matters most</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Boundary Assessment</h4>
              <p className="text-sm text-gray-600 mb-4">Rate how well you currently maintain boundaries in these areas (1 = very poor, 5 = excellent):</p>
              
              <div className="space-y-4">
                {[
                  { area: 'Time boundaries', description: 'Protecting your time and saying no to over-commitment' },
                  { area: 'Emotional boundaries', description: 'Not taking on others\' emotions or problems as your own' },
                  { area: 'Physical boundaries', description: 'Personal space and physical comfort limits' },
                  { area: 'Mental boundaries', description: 'Protecting your thoughts, opinions, and mental space' },
                  { area: 'Digital boundaries', description: 'Managing phone, social media, and screen time' },
                  { area: 'Work boundaries', description: 'Separating work and personal life' }
                ].map((boundary) => (
                  <div key={boundary.area} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Label className="font-medium">{boundary.area}</Label>
                        <p className="text-xs text-gray-600">{boundary.description}</p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setResponses({...responses, [`boundary_${boundary.area}`]: rating})}
                            className={`w-8 h-8 rounded-full text-xs font-bold ${
                              responses[`boundary_${boundary.area}`] === rating 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Specific Boundary Challenges</h4>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Which relationships or situations challenge your boundaries most?</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Family members (parents, siblings, children)',
                      'Spouse/partner',
                      'Friends who are needy or demanding',
                      'Work colleagues or boss',
                      'Neighbors or acquaintances',
                      'Service providers or salespeople',
                      'Social media or online interactions'
                    ].map((relationship) => (
                      <div key={relationship} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.challengingRelationships?.includes(relationship) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.challengingRelationships || [];
                            const updated = checked 
                              ? [...current, relationship]
                              : current.filter((r: string) => r !== relationship);
                            setResponses({...responses, challengingRelationships: updated});
                          }}
                        />
                        <Label className="text-sm">{relationship}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">What makes it hard for you to set boundaries? (Check all that apply)</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Fear of disappointing others',
                      'Guilt about saying no',
                      'Worry about being seen as selfish',
                      'Not wanting to hurt feelings',
                      'Fear of conflict or confrontation',
                      'Habit of people-pleasing',
                      'Unclear about what boundaries I need',
                      'Don\'t know how to communicate boundaries'
                    ].map((barrier) => (
                      <div key={barrier} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses.boundaryBarriers?.includes(barrier) || false}
                          onCheckedChange={(checked) => {
                            const current = responses.boundaryBarriers || [];
                            const updated = checked 
                              ? [...current, barrier]
                              : current.filter((b: string) => b !== barrier);
                            setResponses({...responses, boundaryBarriers: updated});
                          }}
                        />
                        <Label className="text-sm">{barrier}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Create Your Boundary Action Plan</h4>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Choose ONE boundary to focus on first:</Label>
                  <Textarea
                    placeholder="Be specific. Example: 'I will stop checking work emails after 7 PM on weekdays'"
                    value={responses.priorityBoundary || ''}
                    onChange={(e) => setResponses({...responses, priorityBoundary: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">Write your boundary script (exact words you'll use):</Label>
                  <Textarea
                    placeholder="Example: 'I appreciate you thinking of me for this project, but I'm not available to take on additional commitments right now.'"
                    value={responses.boundaryScript || ''}
                    onChange={(e) => setResponses({...responses, boundaryScript: e.target.value})}
                    className="h-24 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">What will you do if someone pushes back on your boundary?</Label>
                  <Textarea
                    placeholder="Plan your response to guilt trips, arguments, or pressure..."
                    value={responses.pushbackPlan || ''}
                    onChange={(e) => setResponses({...responses, pushbackPlan: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">How will you take care of yourself after setting this boundary?</Label>
                  <Textarea
                    placeholder="Self-care activities, supportive people to talk to, ways to manage any guilt..."
                    value={responses.selfCarePlan || ''}
                    onChange={(e) => setResponses({...responses, selfCarePlan: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">When will you practice this boundary this week?</Label>
                  <Input
                    placeholder="Specific day/time or situation when you'll implement this boundary"
                    value={responses.practiceTiming || ''}
                    onChange={(e) => setResponses({...responses, practiceTiming: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {responses.priorityBoundary && responses.boundaryScript && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">🛡️ Your Boundary Plan</h5>
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>Priority Boundary:</strong> {responses.priorityBoundary}</p>
                  <p><strong>Your Script:</strong> "{responses.boundaryScript}"</p>
                  {responses.practiceTiming && <p><strong>Practice Time:</strong> {responses.practiceTiming}</p>}
                  <p className="text-xs bg-purple-100 p-2 rounded mt-2">
                    <strong>Remember:</strong> Setting boundaries is an act of self-respect and self-care. 
                    You're not responsible for managing other people's emotions about your boundaries.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Boundary Setting Tips</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Start small:</strong> Practice with low-stakes situations first</li>
                <li>• <strong>Be clear and direct:</strong> Avoid over-explaining or apologizing excessively</li>
                <li>• <strong>Stay calm:</strong> Emotional reactions can undermine your boundary</li>
                <li>• <strong>Be consistent:</strong> Mixed messages confuse people and weaken boundaries</li>
                <li>• <strong>Give yourself credit:</strong> Boundary-setting gets easier with practice</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleComplete} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!responses.priorityBoundary || !responses.boundaryScript}
              >
                Complete Boundaries Worksheet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Week 3: Weekly Mood Map
  if (component.id === 'w3-mood-map') {
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
              Weekly Emotional Pattern Map
            </CardTitle>
            <p className="text-sm text-gray-600">Create a visual map of your emotional patterns to identify trends and optimize your well-being.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
              <h5 className="font-semibold text-pink-800 mb-2">Understanding Your Emotional Rhythms</h5>
              <p className="text-sm text-pink-700 mb-3">
                Tracking emotional patterns helps you discover your natural rhythms and triggers. This awareness enables you to:
              </p>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• <strong>Predict Vulnerable Times:</strong> Anticipate when you might need extra support</li>
                <li>• <strong>Optimize Scheduling:</strong> Plan important activities during your emotional highs</li>
                <li>• <strong>Identify Triggers:</strong> Notice what situations or factors affect your mood</li>
                <li>• <strong>Celebrate Patterns:</strong> Recognize positive trends and what creates them</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Daily Mood Tracking</h4>
              <p className="text-sm text-gray-600 mb-4">Rate your overall mood for each day this week (1 = very low, 10 = excellent):</p>
              
              <div className="space-y-4">
                {[
                  { day: 'Monday', key: 'monday' },
                  { day: 'Tuesday', key: 'tuesday' },
                  { day: 'Wednesday', key: 'wednesday' },
                  { day: 'Thursday', key: 'thursday' },
                  { day: 'Friday', key: 'friday' },
                  { day: 'Saturday', key: 'saturday' },
                  { day: 'Sunday', key: 'sunday' }
                ].map((dayInfo) => (
                  <div key={dayInfo.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label className="font-medium">{dayInfo.day}</Label>
                      <div className="mt-2">
                        <Slider
                          value={[responses[`mood_${dayInfo.key}`] || 5]}
                          onValueChange={(value) => setResponses({...responses, [`mood_${dayInfo.key}`]: value[0]})}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Low</span>
                          <span className="font-medium">{responses[`mood_${dayInfo.key}`] || 5}/10</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Pattern Analysis</h4>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Which day(s) had your highest mood? What contributed to that?</Label>
                  <Textarea
                    placeholder="Think about activities, interactions, sleep, food, weather, hormones..."
                    value={responses.highMoodFactors || ''}
                    onChange={(e) => setResponses({...responses, highMoodFactors: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">Which day(s) had your lowest mood? What might have influenced that?</Label>
                  <Textarea
                    placeholder="Consider stress, conflicts, physical factors, schedule, etc..."
                    value={responses.lowMoodFactors || ''}
                    onChange={(e) => setResponses({...responses, lowMoodFactors: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">Do you notice any patterns related to:</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div>
                      <Label className="text-sm font-medium">Time of day:</Label>
                      <Input
                        placeholder="e.g., Mornings are harder, evenings are better..."
                        value={responses.timePatterns || ''}
                        onChange={(e) => setResponses({...responses, timePatterns: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Social interactions:</Label>
                      <Input
                        placeholder="e.g., Feel better after talking to friends, drained by certain people..."
                        value={responses.socialPatterns || ''}
                        onChange={(e) => setResponses({...responses, socialPatterns: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Physical factors:</Label>
                      <Input
                        placeholder="e.g., Sleep quality, exercise, hormonal changes, weather..."
                        value={responses.physicalPatterns || ''}
                        onChange={(e) => setResponses({...responses, physicalPatterns: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Activities:</Label>
                      <Input
                        placeholder="e.g., Creative work lifts mood, household tasks feel overwhelming..."
                        value={responses.activityPatterns || ''}
                        onChange={(e) => setResponses({...responses, activityPatterns: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-4">Mood Support Strategies</h4>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Based on your patterns, what could you do more of to support higher moods?</Label>
                  <Textarea
                    placeholder="Specific activities, practices, or changes you want to implement..."
                    value={responses.moodBoosters || ''}
                    onChange={(e) => setResponses({...responses, moodBoosters: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">What could you do less of or avoid during vulnerable times?</Label>
                  <Textarea
                    placeholder="Activities, situations, or commitments that tend to lower your mood..."
                    value={responses.moodDrains || ''}
                    onChange={(e) => setResponses({...responses, moodDrains: e.target.value})}
                    className="h-20 mt-2"
                  />
                </div>

                <div>
                  <Label className="font-medium">Create 3 "mood rescue" activities for challenging days:</Label>
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3].map((num) => (
                      <Input
                        key={num}
                        placeholder={`Rescue activity #${num} (something quick and accessible)`}
                        value={responses[`rescue${num}`] || ''}
                        onChange={(e) => setResponses({...responses, [`rescue${num}`]: e.target.value})}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">💡 Using Your Mood Map</h5>
              <p className="text-sm text-green-700">
                Continue tracking daily for 2-4 weeks to identify deeper patterns. Use this data to make informed decisions 
                about scheduling, self-care, and energy management. Remember: mood fluctuations are normal, especially during midlife transitions.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleComplete} className="bg-pink-600 hover:bg-pink-700 text-white">
                Complete Mood Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback content for other components
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Program
        </Button>
        <Badge variant="secondary">{moduleId}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{component.title}</CardTitle>
          <p className="text-muted-foreground">{component.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Interactive Content</h3>
              <p className="text-gray-700 mb-4">
                This component is currently being enhanced with interactive features. 
                Please check back soon for the full experience.
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Component: {component.id}
              </div>
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