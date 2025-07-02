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