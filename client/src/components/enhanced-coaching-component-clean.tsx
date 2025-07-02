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
import { 
  Play, 
  Pause, 
  ArrowLeft,
  Utensils, 
  Clock, 
  CheckCircle, 
  Activity,
  Sun,
  Moon,
  Brain,
  Heart,
  Zap,
  BarChart
} from 'lucide-react';
import { CoachingComponent } from './coaching-component';
import { useWellnessData } from '@/hooks/use-local-storage';
import { videoScripts, audioScripts, detailedExercises } from '@/lib/hormone-headspace-content';
import type { ModuleComponent } from '@/types/wellness';

interface EnhancedCoachingComponentProps {
  component: ModuleComponent;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function EnhancedCoachingComponent({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentProps) {
  const [responses, setResponses] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { data, updateCoachingProgress } = useWellnessData();

  console.log('EnhancedCoachingComponent rendering:', { componentId: component.id, moduleId });

  const getDetailedContent = () => {
    // Find matching video script
    const videoScript = videoScripts.find(v => 
      component.id.includes('video') && (
        v.id.includes(component.id.split('-')[0]) || 
        component.title.toLowerCase().includes(v.title.toLowerCase().split(' ')[0])
      )
    );
    
    if (videoScript) {
      return { type: 'video-script', content: videoScript };
    }
    
    // Find matching audio script
    const audioScript = audioScripts.find(a => 
      component.id.includes('audio') && (
        a.id.includes(component.id.split('-')[0]) || 
        component.title.toLowerCase().includes(a.title.toLowerCase().split(' ')[0])
      )
    );
    
    if (audioScript) {
      return { type: 'audio-script', content: audioScript };
    }
    
    // Find matching detailed exercise
    const exercise = detailedExercises.find(e => 
      component.id.includes('exercise') && (
        e.id.includes(component.id.split('-')[0]) || 
        component.title.toLowerCase().includes(e.title.toLowerCase().split(' ')[0])
      )
    );
    
    if (exercise) {
      return { type: 'detailed-exercise', content: exercise };
    }
    
    return null;
  };

  const detailedContent = getDetailedContent();

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

  const renderVideoScript = (content: any) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-green-500" />
          {content.title}
        </CardTitle>
        <Badge variant="secondary">{content.duration}</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <span className="text-sm text-gray-600">
              {formatTime(timeElapsed)} / {content.duration}
            </span>
          </div>
          <Progress value={(timeElapsed / (12 * 60)) * 100} className="mb-4" />
        </div>
        
        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-sm text-gray-700">
            {content.script}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold">Key Takeaways:</h4>
          <ul className="space-y-2">
            {content.keyPoints?.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderAudioScript = (content: any) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-500" />
          {content.title}
        </CardTitle>
        <Badge variant="secondary">{content.duration}</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <span className="text-sm text-gray-600">
              {formatTime(timeElapsed)} / {content.duration}
            </span>
          </div>
          <Progress value={(timeElapsed / (15 * 60)) * 100} className="mb-4" />
        </div>
        
        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-sm text-gray-700">
            {content.script}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold">Audio Instructions:</h4>
          <ul className="space-y-2">
            {content.instructions?.map((instruction: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

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

  const renderComponentSpecificContent = () => {
    // Hormone Video - Enhanced Symptom Tracker with Scoring
    if (component.id === 'hormone-video') {
      const currentScore = calculateHormonalScore();
      const interpretation = getScoreInterpretation(currentScore);
      const recommendations = getPersonalizedRecommendations(currentScore);

      return (
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

            {/* Tracking Note */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Tracking Tip</h5>
              <p className="text-sm text-blue-700">
                Track your symptoms daily for 2-4 weeks to identify patterns. Your hormonal symphony changes throughout the month, 
                and understanding these patterns helps you anticipate and manage symptoms more effectively.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Headspace Video - Brain Fog Clearing
    if (component.id === 'headspace-video') {
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Brain Fog Clearing Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Mental clarity techniques designed for your changing brain patterns during midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Explanation of the exercise */}
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
                  <div>
                    <span className="text-sm font-medium">Step 1: Set a timer for 3 minutes</span>
                    <p className="text-xs text-gray-600 mt-1">Use your phone or a kitchen timer. The time limit creates urgency that helps bypass your inner critic.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded border">
                  <Checkbox
                    checked={responses.mentalClearStep2 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep2: checked})}
                  />
                  <div>
                    <span className="text-sm font-medium">Step 2: Write down every racing thought - no judgment</span>
                    <p className="text-xs text-gray-600 mt-1">Let everything flow onto paper: worries, to-dos, random thoughts. Don't edit or organize - just dump it all out.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded border">
                  <Checkbox
                    checked={responses.mentalClearStep3 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep3: checked})}
                  />
                  <div>
                    <span className="text-sm font-medium">Step 3: Notice how your mind feels after the brain dump</span>
                    <p className="text-xs text-gray-600 mt-1">Take 30 seconds to observe: Is there more space? Less mental noise? Any sense of relief or clarity?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Rating System */}
            <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
              <div className="mb-4">
                <Label className="text-lg font-semibold">Mental Clarity Assessment</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Rate your mental clarity right now (complete the exercise above first for best results)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium min-w-[60px]">Rating:</span>
                  <Slider
                    value={[clarityRating]}
                    onValueChange={(value) => setResponses({...responses, clarityRating: value[0]})}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <div className="text-right min-w-[40px]">
                    <span className="text-2xl font-bold text-purple-600">{clarityRating}</span>
                    <div className="text-xs text-gray-500">/ 10</div>
                  </div>
                </div>
                
                {/* Visual clarity scale */}
                <div className="grid grid-cols-10 gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <div key={num} className="text-center">
                      <button
                        onClick={() => setResponses({...responses, clarityRating: num})}
                        className={`w-full h-8 rounded text-xs font-medium transition-all ${
                          num <= clarityRating 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Extremely Foggy</span>
                  <span>Crystal Clear</span>
                </div>
                
                {/* Interpretation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current State:</span>
                    <span className={`text-sm font-semibold ${interpretation.color}`}>
                      {interpretation.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{interpretation.message}</p>
                  
                  {clarityRating >= 7 && (
                    <div className="mt-2 p-2 bg-green-50 rounded border-l-2 border-green-400">
                      <p className="text-xs text-green-700">
                        <strong>Great progress!</strong> This level of clarity will help you tackle tasks more efficiently and feel more confident in your thinking.
                      </p>
                    </div>
                  )}
                  
                  {clarityRating <= 4 && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                      <p className="text-xs text-yellow-700">
                        <strong>Try the exercise:</strong> Even 3 minutes of brain dumping can significantly improve mental clarity. Consider doing this twice daily during challenging periods.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label>Reflection notes:</Label>
              <Textarea
                placeholder="What did you notice about your thoughts? How does your mind feel now compared to before the exercise? Any insights about your mental patterns?"
                value={responses.clarityNotes || ''}
                onChange={(e) => setResponses({...responses, clarityNotes: e.target.value})}
                className="mt-2"
                rows={4}
              />
            </div>

            {/* Additional tip */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Pro Tip for Midlife Brain Fog</h5>
              <p className="text-sm text-purple-700">
                Use this technique before important conversations, decision-making, or when you feel mentally scattered. 
                Many women find it especially helpful first thing in the morning or during the 3 PM energy dip.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Hormone Meditation - Guided Meditation Practice
    if (component.id === 'hormone-meditation') {
      const meditationStep = responses.meditationStep || 'preparation';
      const meditationTime = responses.meditationTime || 0;
      const calmnessRating = responses.calmnessRating || 5;
      const bodyAwarenessRating = responses.bodyAwarenessRating || 5;
      const emotionalBalanceRating = responses.emotionalBalanceRating || 5;

      const getCalmnessInterpretation = (rating: number) => {
        if (rating <= 3) return { level: 'Restless', color: 'text-red-600', message: 'Feeling agitated or unsettled' };
        if (rating <= 5) return { level: 'Somewhat Calm', color: 'text-orange-600', message: 'Some peace with underlying tension' };
        if (rating <= 7) return { level: 'Calm', color: 'text-yellow-600', message: 'Generally peaceful and relaxed' };
        if (rating <= 9) return { level: 'Very Calm', color: 'text-green-600', message: 'Deep sense of tranquility' };
        return { level: 'Deeply Peaceful', color: 'text-green-700', message: 'Profound inner stillness and peace' };
      };

      const meditationSteps = [
        { id: 'preparation', title: 'Preparation', duration: '2 min', description: 'Setting up your space and intention' },
        { id: 'grounding', title: 'Grounding', duration: '3 min', description: 'Connecting with your body and breath' },
        { id: 'hormone-focus', title: 'Hormone Harmony', duration: '7 min', description: 'Visualizing hormonal balance and flow' },
        { id: 'integration', title: 'Integration', duration: '3 min', description: 'Anchoring the practice in your body' }
      ];

      const currentStepIndex = meditationSteps.findIndex(step => step.id === meditationStep);
      const progressPercent = ((currentStepIndex + 1) / meditationSteps.length) * 100;

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Hormone Harmony Meditation
            </CardTitle>
            <p className="text-sm text-gray-600">A 15-minute guided meditation specifically designed to support hormonal balance during midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meditation Benefits */}
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
              <h5 className="font-semibold text-pink-800 mb-2">How Meditation Supports Hormonal Health</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-pink-700">
                <div>
                  <strong>Stress Reduction:</strong> Lowers cortisol levels that can disrupt other hormones
                </div>
                <div>
                  <strong>Better Sleep:</strong> Supports melatonin production for restorative rest
                </div>
                <div>
                  <strong>Nervous System Regulation:</strong> Activates parasympathetic response for healing
                </div>
                <div>
                  <strong>Emotional Balance:</strong> Helps regulate mood-affecting neurotransmitters
                </div>
              </div>
            </div>

            {/* Pre-Meditation Assessment */}
            <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Pre-Meditation Check-In</h4>
              <p className="text-sm text-gray-600 mb-4">Rate how you're feeling right now, then we'll check again after the meditation:</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">Calmness Level</Label>
                    <span className={`text-sm font-semibold ${getCalmnessInterpretation(calmnessRating).color}`}>
                      {getCalmnessInterpretation(calmnessRating).level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Agitated</span>
                    <Slider
                      value={[calmnessRating]}
                      onValueChange={(value) => setResponses({...responses, calmnessRating: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">Peaceful</span>
                    <span className="text-lg font-bold text-pink-600 min-w-[30px]">{calmnessRating}</span>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Body Awareness</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">Disconnected</span>
                    <Slider
                      value={[bodyAwarenessRating]}
                      onValueChange={(value) => setResponses({...responses, bodyAwarenessRating: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">Very Aware</span>
                    <span className="text-lg font-bold text-pink-600 min-w-[30px]">{bodyAwarenessRating}</span>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Emotional Balance</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">Unstable</span>
                    <Slider
                      value={[emotionalBalanceRating]}
                      onValueChange={(value) => setResponses({...responses, emotionalBalanceRating: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">Balanced</span>
                    <span className="text-lg font-bold text-pink-600 min-w-[30px]">{emotionalBalanceRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meditation Practice */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Guided Meditation Practice</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{Math.floor(meditationTime / 60)}:{(meditationTime % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Meditation Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progressPercent)}% Complete</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {/* Meditation Steps */}
              <div className="space-y-3 mb-6">
                {meditationSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      step.id === meditationStep 
                        ? 'border-pink-400 bg-white shadow-sm' 
                        : index < currentStepIndex 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => setResponses({...responses, meditationStep: step.id})}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index < currentStepIndex 
                            ? 'bg-green-500 text-white' 
                            : step.id === meditationStep 
                              ? 'bg-pink-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index < currentStepIndex ? '✓' : index + 1}
                        </div>
                        <div>
                          <h5 className="font-semibold">{step.title}</h5>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{step.duration}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Step Content */}
              <div className="bg-white p-6 rounded-lg border">
                {meditationStep === 'preparation' && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-lg text-center">Preparation Phase</h5>
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Find a comfortable seated position and set your intention for this practice.
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={responses.prepStep1 || false}
                          onCheckedChange={(checked) => setResponses({...responses, prepStep1: checked})}
                        />
                        <span className="text-sm">Find a quiet, comfortable space where you won't be disturbed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={responses.prepStep2 || false}
                          onCheckedChange={(checked) => setResponses({...responses, prepStep2: checked})}
                        />
                        <span className="text-sm">Sit with your spine straight but relaxed, feet flat on the floor</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={responses.prepStep3 || false}
                          onCheckedChange={(checked) => setResponses({...responses, prepStep3: checked})}
                        />
                        <span className="text-sm">Close your eyes or soften your gaze downward</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={responses.prepStep4 || false}
                          onCheckedChange={(checked) => setResponses({...responses, prepStep4: checked})}
                        />
                        <span className="text-sm">Set an intention to support your body's natural wisdom and balance</span>
                      </div>
                    </div>
                  </div>
                )}

                {meditationStep === 'grounding' && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-lg text-center">Grounding Phase</h5>
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Connect deeply with your breath and body awareness.
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h6 className="font-medium mb-2">Breathing Exercise</h6>
                      <p className="text-sm text-gray-700 mb-3">
                        Follow this breathing pattern to activate your parasympathetic nervous system:
                      </p>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">4-7-8 Breath</div>
                        <div className="text-sm space-y-1">
                          <div>Inhale for 4 counts</div>
                          <div>Hold for 7 counts</div>
                          <div>Exhale for 8 counts</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>How many rounds of 4-7-8 breathing have you completed?</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[responses.breathingRounds || 0]}
                          onValueChange={(value) => setResponses({...responses, breathingRounds: value[0]})}
                          max={8}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-lg font-bold text-blue-600 min-w-[30px]">{responses.breathingRounds || 0}</span>
                      </div>
                    </div>
                  </div>
                )}

                {meditationStep === 'hormone-focus' && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-lg text-center">Hormone Harmony Visualization</h5>
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Visualize your endocrine system working in perfect harmony.
                    </div>
                    
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h6 className="font-medium mb-2">Guided Visualization Script</h6>
                      <div className="text-sm text-gray-700 space-y-3">
                        <p>
                          <strong>Imagine</strong> a warm, golden light beginning to glow at the center of your brain, 
                          where your pituitary gland—your body's master regulator—sits like a wise conductor.
                        </p>
                        <p>
                          <strong>See this light</strong> sending gentle signals throughout your body, 
                          communicating with your thyroid, adrenals, and ovaries in perfect harmony.
                        </p>
                        <p>
                          <strong>Visualize</strong> each hormone as a different colored light—estrogen as soft blue, 
                          progesterone as warm green, cortisol as calming lavender—all dancing together in balance.
                        </p>
                        <p>
                          <strong>Feel</strong> your body's natural wisdom guiding this dance, 
                          trusting in its ability to find its new rhythm during this transition.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Which visualization resonated most strongly with you?</Label>
                      <RadioGroup
                        value={responses.visualization || ''}
                        onValueChange={(value) => setResponses({...responses, visualization: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="golden-light" />
                          <Label>The golden light from the pituitary gland</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="colored-hormones" />
                          <Label>The colored lights representing different hormones</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="body-wisdom" />
                          <Label>The sense of body wisdom and natural rhythm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="harmony-dance" />
                          <Label>The feeling of hormones dancing in harmony</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {meditationStep === 'integration' && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-lg text-center">Integration & Closing</h5>
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Anchor this feeling of balance in your body and daily life.
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h6 className="font-medium mb-2">Integration Practice</h6>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>Place both hands on your heart and feel the steady rhythm beneath your palms.</p>
                        <p>Set an intention to carry this sense of harmony with you throughout your day.</p>
                        <p>When you're ready, slowly open your eyes and take three deep breaths.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>What intention would you like to set for supporting your hormonal health today?</Label>
                      <Textarea
                        placeholder="e.g., I will listen to my body's needs with compassion, I will trust my body's wisdom..."
                        value={responses.intention || ''}
                        onChange={(e) => setResponses({...responses, intention: e.target.value})}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = meditationSteps.findIndex(step => step.id === meditationStep);
                      if (currentIndex > 0) {
                        setResponses({...responses, meditationStep: meditationSteps[currentIndex - 1].id});
                      }
                    }}
                    disabled={currentStepIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const currentIndex = meditationSteps.findIndex(step => step.id === meditationStep);
                      if (currentIndex < meditationSteps.length - 1) {
                        setResponses({...responses, meditationStep: meditationSteps[currentIndex + 1].id});
                      }
                    }}
                    disabled={currentStepIndex === meditationSteps.length - 1}
                  >
                    {currentStepIndex === meditationSteps.length - 1 ? 'Complete' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Post-Meditation Reflection */}
            {currentStepIndex === meditationSteps.length - 1 && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Post-Meditation Reflection</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label>How do you feel now compared to before the meditation?</Label>
                    <Textarea
                      placeholder="Describe any changes in your energy, mood, body sensations, or mental clarity..."
                      value={responses.postMeditationReflection || ''}
                      onChange={(e) => setResponses({...responses, postMeditationReflection: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Rate your current calmness level (to compare with your pre-meditation rating):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Agitated</span>
                      <Slider
                        value={[responses.postCalmness || 5]}
                        onValueChange={(value) => setResponses({...responses, postCalmness: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Peaceful</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postCalmness || 5}</span>
                    </div>
                  </div>

                  {responses.postCalmness && calmnessRating && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Your Progress</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Calmness Change:</span>
                        <span className={`font-bold ${
                          responses.postCalmness > calmnessRating 
                            ? 'text-green-600' 
                            : responses.postCalmness < calmnessRating 
                              ? 'text-orange-600' 
                              : 'text-gray-600'
                        }`}>
                          {responses.postCalmness > calmnessRating ? '+' : ''}{responses.postCalmness - calmnessRating} points
                        </span>
                      </div>
                      {responses.postCalmness > calmnessRating && (
                        <p className="text-sm text-green-600 mt-2">
                          Great! The meditation helped increase your sense of calm and balance.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meditation Tips */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Daily Practice Tips</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Practice this meditation at the same time each day to establish a rhythm</li>
                <li>• Morning practice can set a calm tone for your day</li>
                <li>• Evening practice can help prepare your body for restorative sleep</li>
                <li>• Even 5-10 minutes of practice can be beneficial if 15 minutes feels too long</li>
                <li>• Notice how your symptoms change with regular meditation practice</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Breathwork - Cortisol Reset Practice
    if (component.id === 'breathwork') {
      const breathworkPhase = responses.breathworkPhase || 'assessment';
      const stressLevel = responses.stressLevel || 5;
      const energyLevel = responses.energyLevel || 5;
      const breathingTechnique = responses.breathingTechnique || 'box-breathing';
      const practiceRounds = responses.practiceRounds || 0;
      const breathingSpeed = responses.breathingSpeed || 'normal';

      const getStressInterpretation = (level: number) => {
        if (level <= 2) return { status: 'Very Calm', color: 'text-green-700', message: 'You feel relaxed and at ease' };
        if (level <= 4) return { status: 'Mild Stress', color: 'text-green-600', message: 'Some tension but generally manageable' };
        if (level <= 6) return { status: 'Moderate Stress', color: 'text-yellow-600', message: 'Noticeable stress affecting your day' };
        if (level <= 8) return { status: 'High Stress', color: 'text-orange-600', message: 'Significant stress impacting well-being' };
        return { status: 'Very High Stress', color: 'text-red-600', message: 'Overwhelming stress needs immediate attention' };
      };

      const breathingTechniques = [
        {
          id: 'box-breathing',
          name: 'Box Breathing (4-4-4-4)',
          description: 'Equal counts for inhale, hold, exhale, hold',
          pattern: 'Inhale 4 → Hold 4 → Exhale 4 → Hold 4',
          benefits: 'Balances nervous system, reduces anxiety',
          difficulty: 'Beginner'
        },
        {
          id: 'coherent-breathing',
          name: 'Coherent Breathing (5-5)',
          description: 'Slow, rhythmic breathing at 6 breaths per minute',
          pattern: 'Inhale 5 → Exhale 5',
          benefits: 'Activates vagus nerve, promotes heart coherence',
          difficulty: 'Beginner'
        },
        {
          id: 'physiological-sigh',
          name: 'Physiological Sigh',
          description: 'Double inhale followed by long exhale',
          pattern: 'Inhale → Second inhale → Long exhale',
          benefits: 'Rapidly downregulates stress response',
          difficulty: 'Beginner'
        },
        {
          id: 'wim-hof',
          name: 'Modified Wim Hof (3 rounds)',
          description: 'Controlled hyperventilation with breath holds',
          pattern: '30 breaths → Hold → Recovery breath',
          benefits: 'Reduces stress hormones, boosts resilience',
          difficulty: 'Advanced'
        }
      ];

      const currentTechnique = breathingTechniques.find(t => t.id === breathingTechnique) || breathingTechniques[0];
      const stressInterpretation = getStressInterpretation(stressLevel);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Cortisol Reset Breathwork
            </CardTitle>
            <p className="text-sm text-gray-600">An 8-minute breathing practice designed to lower stress hormones and activate your parasympathetic nervous system.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Science Behind Breathwork */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">How Breathwork Reduces Cortisol</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                <div>
                  <strong>Vagus Nerve Activation:</strong> Slow exhales stimulate the vagus nerve, signaling safety to your brain
                </div>
                <div>
                  <strong>Stress Response Reversal:</strong> Controlled breathing shifts you from fight-or-flight to rest-and-digest
                </div>
                <div>
                  <strong>Cortisol Reduction:</strong> Regular practice can lower cortisol levels by up to 25%
                </div>
                <div>
                  <strong>Heart Rate Variability:</strong> Improves your body's ability to adapt to stress
                </div>
              </div>
            </div>

            {/* Pre-Practice Assessment */}
            {breathworkPhase === 'assessment' && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Pre-Practice Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your current state before we begin the breathwork practice:</p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Current Stress Level</Label>
                      <span className={`text-sm font-semibold ${stressInterpretation.color}`}>
                        {stressInterpretation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Very Calm</span>
                      <Slider
                        value={[stressLevel]}
                        onValueChange={(value) => setResponses({...responses, stressLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Stressed</span>
                      <span className="text-lg font-bold text-blue-600 min-w-[30px]">{stressLevel}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stressInterpretation.message}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Energy Level</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Depleted</span>
                      <Slider
                        value={[energyLevel]}
                        onValueChange={(value) => setResponses({...responses, energyLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-blue-600 min-w-[30px]">{energyLevel}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Physical Symptoms (check all that apply):</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Tight shoulders/neck', 'Shallow breathing', 'Racing heart', 'Headache',
                        'Jaw tension', 'Stomach knots', 'Restlessness', 'Fatigue'
                      ].map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`symptom-${symptom}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`symptom-${symptom}`]: checked
                            })}
                          />
                          <Label className="text-sm">{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, breathworkPhase: 'technique-selection'})}
                    className="w-full"
                  >
                    Continue to Technique Selection
                  </Button>
                </div>
              </div>
            )}

            {/* Technique Selection */}
            {breathworkPhase === 'technique-selection' && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Choose Your Breathing Technique</h4>
                <p className="text-sm text-gray-600 mb-4">Based on your stress level of {stressLevel}/10, here are recommended techniques:</p>
                
                <div className="space-y-4">
                  {breathingTechniques.map((technique) => {
                    const isRecommended = 
                      (stressLevel <= 4 && technique.id === 'coherent-breathing') ||
                      (stressLevel >= 5 && stressLevel <= 7 && technique.id === 'box-breathing') ||
                      (stressLevel >= 8 && technique.id === 'physiological-sigh');

                    return (
                      <div 
                        key={technique.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          breathingTechnique === technique.id 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isRecommended ? 'ring-2 ring-green-200' : ''}`}
                        onClick={() => setResponses({...responses, breathingTechnique: technique.id})}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                breathingTechnique === technique.id 
                                  ? 'border-blue-500 bg-blue-500' 
                                  : 'border-gray-300'
                              }`}>
                                {breathingTechnique === technique.id && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <h5 className="font-semibold">{technique.name}</h5>
                              {isRecommended && (
                                <Badge variant="default" className="bg-green-500">Recommended</Badge>
                              )}
                              <Badge variant="outline">{technique.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{technique.description}</p>
                            <div className="text-sm">
                              <strong>Pattern:</strong> {technique.pattern}
                            </div>
                            <div className="text-sm text-green-600">
                              <strong>Benefits:</strong> {technique.benefits}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="font-medium">Breathing Speed Preference:</Label>
                    <RadioGroup
                      value={breathingSpeed}
                      onValueChange={(value) => setResponses({...responses, breathingSpeed: value})}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" />
                        <Label>Slow & Deep</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" />
                        <Label>Normal Pace</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="guided" />
                        <Label>Follow Audio Cues</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, breathworkPhase: 'practice'})}
                    className="w-full"
                  >
                    Start {currentTechnique.name} Practice
                  </Button>
                </div>
              </div>
            )}

            {/* Practice Phase */}
            {breathworkPhase === 'practice' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">{currentTechnique.name}</h4>
                  <p className="text-sm text-gray-600">{currentTechnique.description}</p>
                  <div className="text-lg font-bold text-blue-600 mt-2">{currentTechnique.pattern}</div>
                </div>

                {/* Visual Breathing Guide */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-300 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">Breathe</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practice Instructions */}
                <div className="bg-white p-4 rounded-lg mb-6">
                  {breathingTechnique === 'box-breathing' && (
                    <div className="text-center space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="p-2 bg-blue-100 rounded">Inhale<br/>4 counts</div>
                        <div className="p-2 bg-yellow-100 rounded">Hold<br/>4 counts</div>
                        <div className="p-2 bg-green-100 rounded">Exhale<br/>4 counts</div>
                        <div className="p-2 bg-purple-100 rounded">Hold<br/>4 counts</div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Follow the rhythm: In through nose, hold gently, out through mouth, pause naturally
                      </p>
                    </div>
                  )}

                  {breathingTechnique === 'coherent-breathing' && (
                    <div className="text-center space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-3 bg-blue-100 rounded">Inhale<br/>5 counts</div>
                        <div className="p-3 bg-green-100 rounded">Exhale<br/>5 counts</div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Smooth, continuous breathing. Aim for 6 complete breaths per minute.
                      </p>
                    </div>
                  )}

                  {breathingTechnique === 'physiological-sigh' && (
                    <div className="text-center space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-2 bg-blue-100 rounded">Inhale<br/>Normal</div>
                        <div className="p-2 bg-blue-200 rounded">Second Inhale<br/>Small sip</div>
                        <div className="p-2 bg-green-100 rounded">Long Exhale<br/>Through mouth</div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Repeat 1-3 times when you need rapid stress relief
                      </p>
                    </div>
                  )}

                  {breathingTechnique === 'wim-hof' && (
                    <div className="text-center space-y-2">
                      <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                        <strong className="text-orange-800">Advanced Technique</strong>
                        <p className="text-sm text-orange-700 mt-1">
                          30 full breaths → Exhale and hold → Recovery breath and hold
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Stop if you feel dizzy. Practice on empty stomach in safe environment.
                      </p>
                    </div>
                  )}
                </div>

                {/* Practice Tracker */}
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Practice Rounds Completed:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, practiceRounds: Math.max(0, practiceRounds - 1)})}
                      >
                        -
                      </Button>
                      <span className="text-2xl font-bold text-blue-600 min-w-[40px] text-center">{practiceRounds}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, practiceRounds: practiceRounds + 1})}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[1,2,3,4,5].map((round) => (
                      <div key={round} className={`h-8 rounded flex items-center justify-center text-sm font-medium ${
                        round <= practiceRounds 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {round}
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    {practiceRounds >= 5 && (
                      <Button 
                        onClick={() => setResponses({...responses, breathworkPhase: 'completion'})}
                        className="w-full"
                      >
                        Complete Practice & Assess Results
                      </Button>
                    )}
                    {practiceRounds < 5 && (
                      <p className="text-sm text-gray-600">
                        Complete {5 - practiceRounds} more rounds for optimal cortisol reduction
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Completion Assessment */}
            {breathworkPhase === 'completion' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Post-Practice Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">How do you feel after completing the {currentTechnique.name} practice?</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Current Stress Level (compare with your initial {stressLevel}/10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Very Calm</span>
                      <Slider
                        value={[responses.postStressLevel || 5]}
                        onValueChange={(value) => setResponses({...responses, postStressLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Stressed</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postStressLevel || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Energy Level:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Depleted</span>
                      <Slider
                        value={[responses.postEnergyLevel || 5]}
                        onValueChange={(value) => setResponses({...responses, postEnergyLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postEnergyLevel || 5}</span>
                    </div>
                  </div>

                  {/* Progress Summary */}
                  {responses.postStressLevel && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Your Progress Summary</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Stress Reduction:</span>
                          <span className={`font-bold ${
                            stressLevel - responses.postStressLevel > 0 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            -{stressLevel - responses.postStressLevel} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Energy Change:</span>
                          <span className={`font-bold ${
                            (responses.postEnergyLevel || 5) - energyLevel > 0 
                              ? 'text-green-600' 
                              : (responses.postEnergyLevel || 5) - energyLevel < 0
                                ? 'text-orange-600'
                                : 'text-gray-600'
                          }`}>
                            {(responses.postEnergyLevel || 5) - energyLevel > 0 ? '+' : ''}{(responses.postEnergyLevel || 5) - energyLevel} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Technique Used:</span>
                          <span className="font-medium">{currentTechnique.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rounds Completed:</span>
                          <span className="font-medium">{practiceRounds}/5</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Reflection notes:</Label>
                    <Textarea
                      placeholder="How do you feel now? What did you notice during the practice? Any physical sensations or mental shifts?"
                      value={responses.breathworkReflection || ''}
                      onChange={(e) => setResponses({...responses, breathworkReflection: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, breathworkPhase: 'assessment'})}
                    variant="outline"
                    className="w-full"
                  >
                    Practice Again
                  </Button>
                </div>
              </div>
            )}

            {/* Daily Practice Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">💡 Cortisol Reset Tips</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Practice 2-3 times daily: morning, midday, and before bed</li>
                <li>• Use physiological sighs for acute stress (instant relief)</li>
                <li>• Box breathing is perfect for general anxiety management</li>
                <li>• Coherent breathing works best for heart rate variability</li>
                <li>• Track your stress levels over time to see patterns</li>
                <li>• Practice for 21 days to see lasting cortisol improvements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Morning Ritual - Sunrise Hormone Reset
    if (component.id === 'morning-ritual') {
      const ritualPhase = responses.ritualPhase || 'preparation';
      const wakeTime = responses.wakeTime || '7:00';
      const sunlightExposure = responses.sunlightExposure || 0;
      const hydrationGlasses = responses.hydrationGlasses || 0;
      const movementMinutes = responses.movementMinutes || 0;
      const morningMood = responses.morningMood || 5;
      const energyLevel = responses.energyLevel || 5;

      const ritualSteps = [
        { 
          id: 'hydration', 
          title: 'Hydration Boost', 
          duration: '2 min', 
          description: 'Rehydrate after 8 hours of sleep',
          icon: '💧',
          benefits: ['Kickstarts metabolism', 'Supports cortisol regulation', 'Aids toxin elimination']
        },
        { 
          id: 'sunlight', 
          title: 'Sunlight Exposure', 
          duration: '10-15 min', 
          description: 'Natural light to reset circadian rhythm',
          icon: '☀️',
          benefits: ['Regulates melatonin', 'Boosts serotonin', 'Sets internal clock']
        },
        { 
          id: 'movement', 
          title: 'Gentle Movement', 
          duration: '5-10 min', 
          description: 'Light exercise to activate your system',
          icon: '🧘‍♀️',
          benefits: ['Increases circulation', 'Releases endorphins', 'Reduces morning stiffness']
        },
        { 
          id: 'intention', 
          title: 'Intention Setting', 
          duration: '3-5 min', 
          description: 'Mental preparation for the day',
          icon: '🎯',
          benefits: ['Reduces anxiety', 'Improves focus', 'Creates positive mindset']
        }
      ];

      const currentStepIndex = ritualSteps.findIndex(step => step.id === ritualPhase);
      const progressPercent = ((currentStepIndex + 1) / ritualSteps.length) * 100;

      const getMoodInterpretation = (mood: number) => {
        if (mood <= 3) return { level: 'Low Energy', color: 'text-red-600', message: 'Feeling sluggish or depleted' };
        if (mood <= 5) return { level: 'Moderate', color: 'text-yellow-600', message: 'Some energy but could be better' };
        if (mood <= 7) return { level: 'Good Energy', color: 'text-green-600', message: 'Feeling alert and positive' };
        if (mood <= 9) return { level: 'High Energy', color: 'text-green-700', message: 'Very energized and motivated' };
        return { level: 'Excellent', color: 'text-green-800', message: 'Peak energy and vitality' };
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              Sunrise Hormone Reset Ritual
            </CardTitle>
            <p className="text-sm text-gray-600">A 20-30 minute morning routine designed to optimize your hormonal balance and set a positive tone for your entire day.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Science Behind Morning Rituals */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 className="font-semibold text-yellow-800 mb-2">Why Morning Rituals Matter for Hormones</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
                <div>
                  <strong>Cortisol Rhythm:</strong> Morning light and movement help establish healthy cortisol patterns
                </div>
                <div>
                  <strong>Circadian Reset:</strong> Consistent timing supports all hormone production cycles
                </div>
                <div>
                  <strong>Metabolism Activation:</strong> Early hydration and movement boost metabolic hormones
                </div>
                <div>
                  <strong>Stress Resilience:</strong> Starting calmly reduces stress hormone spikes throughout the day
                </div>
              </div>
            </div>

            {/* Morning Check-in */}
            {ritualPhase === 'preparation' && (
              <div className="bg-white border-2 border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Morning Check-In</h4>
                <p className="text-sm text-gray-600 mb-4">Let's assess how you're feeling this morning and customize your ritual:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">What time did you wake up today?</Label>
                    <div className="mt-2">
                      <input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setResponses({...responses, wakeTime: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Current Energy Level</Label>
                      <span className={`text-sm font-semibold ${getMoodInterpretation(energyLevel).color}`}>
                        {getMoodInterpretation(energyLevel).level}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Exhausted</span>
                      <Slider
                        value={[energyLevel]}
                        onValueChange={(value) => setResponses({...responses, energyLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-yellow-600 min-w-[30px]">{energyLevel}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{getMoodInterpretation(energyLevel).message}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Morning Mood</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Anxious/Low</span>
                      <Slider
                        value={[morningMood]}
                        onValueChange={(value) => setResponses({...responses, morningMood: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Calm/Happy</span>
                      <span className="text-lg font-bold text-yellow-600 min-w-[30px]">{morningMood}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">How did you sleep? (check all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Restful sleep', 'Woke up tired', 'Multiple wake-ups', 'Vivid dreams',
                        'Hot flashes', 'Racing thoughts', 'Good sleep quality', 'Needed alarm'
                      ].map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`sleep-${symptom}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`sleep-${symptom}`]: checked
                            })}
                          />
                          <Label className="text-sm">{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'hydration'})}
                    className="w-full"
                  >
                    Begin Your Hormone Reset Ritual
                  </Button>
                </div>
              </div>
            )}

            {/* Ritual Progress Overview */}
            {ritualPhase !== 'preparation' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Your Morning Ritual Progress</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">~{20 + (currentStepIndex * 5)} min total</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Ritual Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercent)}% Complete</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {ritualSteps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        step.id === ritualPhase 
                          ? 'border-yellow-400 bg-white shadow-sm' 
                          : index < currentStepIndex 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                      onClick={() => setResponses({...responses, ritualPhase: step.id})}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{step.icon}</div>
                        <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                          index < currentStepIndex 
                            ? 'bg-green-500 text-white' 
                            : step.id === ritualPhase 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index < currentStepIndex ? '✓' : index + 1}
                        </div>
                        <h6 className="font-semibold text-sm">{step.title}</h6>
                        <p className="text-xs text-gray-600">{step.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Hydration */}
            {ritualPhase === 'hydration' && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">💧</div>
                  <h4 className="text-xl font-semibold">Hydration Boost</h4>
                  <p className="text-sm text-gray-600">Rehydrate your body after 8 hours of sleep</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Why Morning Hydration Matters</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Cortisol Support:</strong> Proper hydration helps regulate morning cortisol spike</li>
                    <li>• <strong>Metabolism Boost:</strong> Water increases metabolic rate by up to 30%</li>
                    <li>• <strong>Brain Function:</strong> Even mild dehydration affects mood and cognitive function</li>
                    <li>• <strong>Hormone Transport:</strong> Water helps transport hormones throughout your body</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Your Hydration Protocol:</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border">
                        <Checkbox
                          checked={responses.hydroStep1 || false}
                          onCheckedChange={(checked) => setResponses({...responses, hydroStep1: checked})}
                        />
                        <div className="flex-1">
                          <span className="font-medium">Step 1: Warm lemon water (8-12 oz)</span>
                          <p className="text-xs text-gray-600">Squeeze half a lemon into warm water. Supports liver detox and alkalizes your system.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border">
                        <Checkbox
                          checked={responses.hydroStep2 || false}
                          onCheckedChange={(checked) => setResponses({...responses, hydroStep2: checked})}
                        />
                        <div className="flex-1">
                          <span className="font-medium">Step 2: Add a pinch of sea salt</span>
                          <p className="text-xs text-gray-600">Himalayan or sea salt helps with electrolyte balance and adrenal support.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border">
                        <Checkbox
                          checked={responses.hydroStep3 || false}
                          onCheckedChange={(checked) => setResponses({...responses, hydroStep3: checked})}
                        />
                        <div className="flex-1">
                          <span className="font-medium">Step 3: Drink slowly and mindfully</span>
                          <p className="text-xs text-gray-600">Take 2-3 minutes to drink slowly, focusing on nourishing your body.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Glasses of water consumed this morning:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, hydrationGlasses: Math.max(0, hydrationGlasses - 1)})}
                      >
                        -
                      </Button>
                      <span className="text-2xl font-bold text-blue-600 min-w-[40px] text-center">{hydrationGlasses}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, hydrationGlasses: hydrationGlasses + 1})}
                      >
                        +
                      </Button>
                      <span className="text-sm text-gray-600">glasses (8 oz each)</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[1,2,3,4].map((glass) => (
                        <div key={glass} className={`h-12 rounded flex items-center justify-center text-sm font-medium ${
                          glass <= hydrationGlasses 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          💧
                        </div>
                      ))}
                    </div>
                    
                    {hydrationGlasses >= 2 && (
                      <p className="text-sm text-green-600 mt-2">
                        Great! You've met the minimum hydration for hormone support.
                      </p>
                    )}
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'sunlight'})}
                    className="w-full"
                    disabled={hydrationGlasses < 1}
                  >
                    Continue to Sunlight Exposure
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Sunlight */}
            {ritualPhase === 'sunlight' && (
              <div className="bg-white border-2 border-yellow-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">☀️</div>
                  <h4 className="text-xl font-semibold">Sunlight Exposure</h4>
                  <p className="text-sm text-gray-600">Reset your circadian rhythm with natural light</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-yellow-800 mb-2">The Power of Morning Light</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Melatonin Regulation:</strong> Morning light stops melatonin production, improving sleep</li>
                    <li>• <strong>Serotonin Boost:</strong> Sunlight increases serotonin, improving mood and focus</li>
                    <li>• <strong>Cortisol Timing:</strong> Light exposure helps time your natural cortisol awakening response</li>
                    <li>• <strong>Vitamin D:</strong> Even 10 minutes can start vitamin D synthesis</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Sunlight Protocol (choose your option):</Label>
                    <RadioGroup
                      value={responses.sunlightOption || 'outdoor'}
                      onValueChange={(value) => setResponses({...responses, sunlightOption: value})}
                      className="mt-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="outdoor" />
                          <div className="flex-1">
                            <Label className="font-medium">Outdoor sunlight (ideal)</Label>
                            <p className="text-sm text-gray-600">10-15 minutes outside, even if cloudy. No sunglasses needed.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="window" />
                          <div className="flex-1">
                            <Label className="font-medium">By a bright window</Label>
                            <p className="text-sm text-gray-600">15-20 minutes by an east-facing window with maximum light.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="light-therapy" />
                          <div className="flex-1">
                            <Label className="font-medium">Light therapy lamp</Label>
                            <p className="text-sm text-gray-600">10,000 lux light box for 10-15 minutes.</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="font-medium">Minutes of light exposure:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[sunlightExposure]}
                        onValueChange={(value) => setResponses({...responses, sunlightExposure: value[0]})}
                        max={30}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-yellow-600 min-w-[40px]">{sunlightExposure}</span>
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>0 min</span>
                        <span>15 min (ideal)</span>
                        <span>30 min</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            sunlightExposure >= 10 ? 'bg-green-500' : sunlightExposure >= 5 ? 'bg-yellow-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min((sunlightExposure / 30) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {sunlightExposure >= 10 && (
                      <p className="text-sm text-green-600 mt-2">
                        Excellent! This amount of light exposure will help optimize your circadian rhythm.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="font-medium">Activities during light exposure (check all you did):</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Deep breathing', 'Gentle stretching', 'Gratitude practice', 'Reading',
                        'Light walking', 'Journaling', 'Meditation', 'Planning my day'
                      ].map((activity) => (
                        <div key={activity} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`sunlight-${activity}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`sunlight-${activity}`]: checked
                            })}
                          />
                          <Label className="text-sm">{activity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'movement'})}
                    className="w-full"
                    disabled={sunlightExposure < 5}
                  >
                    Continue to Gentle Movement
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Movement */}
            {ritualPhase === 'movement' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">🧘‍♀️</div>
                  <h4 className="text-xl font-semibold">Gentle Movement</h4>
                  <p className="text-sm text-gray-600">Activate your body and boost circulation</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-green-800 mb-2">Benefits of Morning Movement</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Endorphin Release:</strong> Natural mood boosters reduce stress hormones</li>
                    <li>• <strong>Lymphatic Drainage:</strong> Gentle movement helps eliminate toxins</li>
                    <li>• <strong>Energy Activation:</strong> Gets blood flowing to muscles and brain</li>
                    <li>• <strong>Joint Mobility:</strong> Reduces morning stiffness common in perimenopause</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Choose your movement style:</Label>
                    <RadioGroup
                      value={responses.movementType || 'stretching'}
                      onValueChange={(value) => setResponses({...responses, movementType: value})}
                      className="mt-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="stretching" />
                          <div className="flex-1">
                            <Label className="font-medium">Gentle Stretching</Label>
                            <p className="text-sm text-gray-600">Cat-cow, neck rolls, shoulder shrugs, hip circles</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="yoga" />
                          <div className="flex-1">
                            <Label className="font-medium">Sun Salutation</Label>
                            <p className="text-sm text-gray-600">3-5 rounds of gentle yoga flow</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="walking" />
                          <div className="flex-1">
                            <Label className="font-medium">Light Walking</Label>
                            <p className="text-sm text-gray-600">5-10 minutes of easy walking</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="dance" />
                          <div className="flex-1">
                            <Label className="font-medium">Gentle Dance</Label>
                            <p className="text-sm text-gray-600">Free movement to favorite music</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="font-medium">Minutes of movement:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[movementMinutes]}
                        onValueChange={(value) => setResponses({...responses, movementMinutes: value[0]})}
                        max={20}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-green-600 min-w-[40px]">{movementMinutes}</span>
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                    
                    {movementMinutes >= 5 && (
                      <p className="text-sm text-green-600 mt-2">
                        Perfect! Even 5 minutes of morning movement can boost your energy for hours.
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Quick Movement Ideas (check what you did):</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Arm circles', 'Neck stretches', 'Hip circles', 'Calf raises',
                        'Side bends', 'Deep squats', 'Shoulder rolls', 'Ankle rotations'
                      ].map((movement) => (
                        <div key={movement} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`movement-${movement}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`movement-${movement}`]: checked
                            })}
                          />
                          <Label className="text-sm">{movement}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'intention'})}
                    className="w-full"
                    disabled={movementMinutes < 3}
                  >
                    Continue to Intention Setting
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Intention Setting */}
            {ritualPhase === 'intention' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">🎯</div>
                  <h4 className="text-xl font-semibold">Intention Setting</h4>
                  <p className="text-sm text-gray-600">Set a positive direction for your day</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-purple-800 mb-2">Power of Intentional Mornings</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• <strong>Stress Reduction:</strong> Clear intentions reduce decision fatigue and anxiety</li>
                    <li>• <strong>Hormone Balance:</strong> Positive mindset supports healthy cortisol patterns</li>
                    <li>• <strong>Focus Enhancement:</strong> Intention setting improves concentration throughout the day</li>
                    <li>• <strong>Emotional Regulation:</strong> Mindful planning helps manage mood swings</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Today's Primary Intention:</Label>
                    <Textarea
                      placeholder="e.g., I will move through my day with calm confidence... I will listen to my body's needs... I choose to respond rather than react..."
                      value={responses.dailyIntention || ''}
                      onChange={(e) => setResponses({...responses, dailyIntention: e.target.value})}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Three things I'm grateful for this morning:</Label>
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        placeholder="1. Something that makes me smile..."
                        value={responses.gratitude1 || ''}
                        onChange={(e) => setResponses({...responses, gratitude1: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="2. A person who supports me..."
                        value={responses.gratitude2 || ''}
                        onChange={(e) => setResponses({...responses, gratitude2: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        placeholder="3. Something my body does for me..."
                        value={responses.gratitude3 || ''}
                        onChange={(e) => setResponses({...responses, gratitude3: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Priority focus for today (choose one):</Label>
                    <RadioGroup
                      value={responses.dailyFocus || 'self-care'}
                      onValueChange={(value) => setResponses({...responses, dailyFocus: value})}
                      className="mt-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="self-care" />
                          <Label>Self-care & rest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="productivity" />
                          <Label>Productive focus</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="relationships" />
                          <Label>Connection & relationships</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="creativity" />
                          <Label>Creative expression</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="learning" />
                          <Label>Learning & growth</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="balance" />
                          <Label>Overall balance</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="font-medium">How do you want to feel at the end of today?</Label>
                    <Textarea
                      placeholder="Describe the feeling you want to cultivate: calm, accomplished, connected, energized..."
                      value={responses.desiredFeeling || ''}
                      onChange={(e) => setResponses({...responses, desiredFeeling: e.target.value})}
                      className="mt-2"
                      rows={2}
                    />
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'completion'})}
                    className="w-full"
                  >
                    Complete Ritual & Assess Results
                  </Button>
                </div>
              </div>
            )}

            {/* Ritual Completion */}
            {ritualPhase === 'completion' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">🌟</div>
                  <h4 className="text-xl font-semibold">Ritual Complete!</h4>
                  <p className="text-sm text-gray-600">How do you feel after your morning hormone reset?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Current energy level (compare with your starting {energyLevel}/10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Exhausted</span>
                      <Slider
                        value={[responses.postRitualEnergy || 5]}
                        onValueChange={(value) => setResponses({...responses, postRitualEnergy: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postRitualEnergy || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Mood after ritual:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Anxious/Low</span>
                      <Slider
                        value={[responses.postRitualMood || 5]}
                        onValueChange={(value) => setResponses({...responses, postRitualMood: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Calm/Happy</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postRitualMood || 5}</span>
                    </div>
                  </div>

                  {/* Ritual Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-3">Your Morning Ritual Summary</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Hydration:</strong> {hydrationGlasses} glasses
                      </div>
                      <div>
                        <strong>Sunlight:</strong> {sunlightExposure} minutes
                      </div>
                      <div>
                        <strong>Movement:</strong> {movementMinutes} minutes
                      </div>
                      <div>
                        <strong>Wake Time:</strong> {wakeTime}
                      </div>
                    </div>
                    
                    {responses.postRitualEnergy && energyLevel && (
                      <div className="mt-4 p-3 bg-white rounded border">
                        <div className="flex justify-between items-center">
                          <span>Energy Change:</span>
                          <span className={`font-bold ${
                            responses.postRitualEnergy > energyLevel 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {responses.postRitualEnergy > energyLevel ? '+' : ''}{responses.postRitualEnergy - energyLevel} points
                          </span>
                        </div>
                        {responses.postRitualMood && morningMood && (
                          <div className="flex justify-between items-center mt-1">
                            <span>Mood Improvement:</span>
                            <span className={`font-bold ${
                              responses.postRitualMood > morningMood 
                                ? 'text-green-600' 
                                : 'text-gray-600'
                            }`}>
                              {responses.postRitualMood > morningMood ? '+' : ''}{responses.postRitualMood - morningMood} points
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Reflection on your ritual:</Label>
                    <Textarea
                      placeholder="How did each part feel? What worked best? What would you adjust tomorrow?"
                      value={responses.ritualReflection || ''}
                      onChange={(e) => setResponses({...responses, ritualReflection: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, ritualPhase: 'preparation'})}
                    variant="outline"
                    className="w-full"
                  >
                    Plan Tomorrow's Ritual
                  </Button>
                </div>
              </div>
            )}

            {/* Daily Tips */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">💡 Morning Ritual Tips</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Consistency matters more than perfection - even 10 minutes helps</li>
                <li>• Prepare the night before: set out water, clothes, intentions</li>
                <li>• Track your energy patterns to find your optimal wake time</li>
                <li>• Adjust the ritual seasonally - less outdoor time in winter is okay</li>
                <li>• Notice how your hormone symptoms change with regular practice</li>
                <li>• Share your ritual with family so they can support your morning time</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Symptom Tracker - Daily Hormone Harmony Tracker
    if (component.id === 'symptom-tracker') {
      const trackerPhase = responses.trackerPhase || 'overview';
      const trackingDate = responses.trackingDate || new Date().toISOString().split('T')[0];
      const periodDay = responses.periodDay || 0;
      const cyclePhase = responses.cyclePhase || 'unknown';

      // Symptom categories with detailed tracking
      const symptomCategories = [
        {
          id: 'physical',
          title: 'Physical Symptoms',
          icon: '💪',
          color: 'blue',
          symptoms: [
            { id: 'hot-flashes', name: 'Hot flashes/Night sweats', scale: [0, 10] },
            { id: 'fatigue', name: 'Fatigue/Low energy', scale: [0, 10] },
            { id: 'joint-pain', name: 'Joint aches/stiffness', scale: [0, 10] },
            { id: 'headaches', name: 'Headaches', scale: [0, 10] },
            { id: 'breast-tenderness', name: 'Breast tenderness', scale: [0, 10] },
            { id: 'bloating', name: 'Bloating/digestive issues', scale: [0, 10] }
          ]
        },
        {
          id: 'emotional',
          title: 'Emotional/Mental',
          icon: '🧠',
          color: 'purple',
          symptoms: [
            { id: 'mood-swings', name: 'Mood swings', scale: [0, 10] },
            { id: 'anxiety', name: 'Anxiety/worry', scale: [0, 10] },
            { id: 'irritability', name: 'Irritability/anger', scale: [0, 10] },
            { id: 'brain-fog', name: 'Brain fog/memory issues', scale: [0, 10] },
            { id: 'depression', name: 'Low mood/sadness', scale: [0, 10] },
            { id: 'overwhelm', name: 'Feeling overwhelmed', scale: [0, 10] }
          ]
        },
        {
          id: 'sleep',
          title: 'Sleep & Energy',
          icon: '😴',
          color: 'green',
          symptoms: [
            { id: 'sleep-quality', name: 'Sleep quality', scale: [10, 0] }, // Reversed scale
            { id: 'wake-frequency', name: 'Night awakenings', scale: [0, 10] },
            { id: 'morning-energy', name: 'Morning energy', scale: [10, 0] }, // Reversed scale
            { id: 'afternoon-crash', name: 'Afternoon energy crash', scale: [0, 10] },
            { id: 'restlessness', name: 'Restlessness', scale: [0, 10] },
            { id: 'sleep-duration', name: 'Difficulty falling asleep', scale: [0, 10] }
          ]
        },
        {
          id: 'hormonal',
          title: 'Hormonal Signs',
          icon: '🌸',
          color: 'pink',
          symptoms: [
            { id: 'period-changes', name: 'Menstrual irregularities', scale: [0, 10] },
            { id: 'libido', name: 'Low sex drive', scale: [0, 10] },
            { id: 'dry-skin', name: 'Skin/hair changes', scale: [0, 10] },
            { id: 'weight-gain', name: 'Weight gain difficulty', scale: [0, 10] },
            { id: 'food-cravings', name: 'Food cravings', scale: [0, 10] },
            { id: 'temperature-regulation', name: 'Temperature sensitivity', scale: [0, 10] }
          ]
        }
      ];

      const getSymptomScore = (symptomId: string) => responses[`symptom-${symptomId}`] || 0;
      const getCategoryAverage = (category: any) => {
        const scores = category.symptoms.map((s: any) => getSymptomScore(s.id));
        return scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      };

      const overallSymptomScore = symptomCategories.reduce((total, cat) => total + getCategoryAverage(cat), 0) / symptomCategories.length;

      const getSymptomInterpretation = (score: number) => {
        if (score <= 2) return { level: 'Minimal', color: 'text-green-700', message: 'Symptoms are very manageable' };
        if (score <= 4) return { level: 'Mild', color: 'text-green-600', message: 'Some symptoms but generally doing well' };
        if (score <= 6) return { level: 'Moderate', color: 'text-yellow-600', message: 'Noticeable symptoms affecting daily life' };
        if (score <= 8) return { level: 'Significant', color: 'text-orange-600', message: 'Symptoms impacting well-being considerably' };
        return { level: 'Severe', color: 'text-red-600', message: 'Symptoms significantly disrupting daily life' };
      };

      const interpretation = getSymptomInterpretation(overallSymptomScore);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-500" />
              Daily Hormone Harmony Tracker
            </CardTitle>
            <p className="text-sm text-gray-600">Track your perimenopause symptoms to identify patterns and monitor progress over time.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tracking Benefits */}
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h5 className="font-semibold text-indigo-800 mb-2">Why Daily Tracking Helps</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-700">
                <div>
                  <strong>Pattern Recognition:</strong> Identify triggers and timing of symptoms
                </div>
                <div>
                  <strong>Treatment Effectiveness:</strong> Monitor how interventions help over time
                </div>
                <div>
                  <strong>Healthcare Communication:</strong> Provide detailed data to your doctor
                </div>
                <div>
                  <strong>Personal Empowerment:</strong> Take control of your health journey
                </div>
              </div>
            </div>

            {/* Overview Dashboard */}
            {trackerPhase === 'overview' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Today's Tracking Overview</h4>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Tracking Date:</Label>
                    <input
                      type="date"
                      value={trackingDate}
                      onChange={(e) => setResponses({...responses, trackingDate: e.target.value})}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Menstrual Cycle Information (if applicable):</Label>
                    <div className="mt-3 space-y-3">
                      <div>
                        <Label className="text-sm">Day of cycle (if tracking):</Label>
                        <div className="flex items-center gap-4 mt-1">
                          <Slider
                            value={[periodDay]}
                            onValueChange={(value) => setResponses({...responses, periodDay: value[0]})}
                            max={35}
                            min={0}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-lg font-bold text-indigo-600 min-w-[40px]">{periodDay}</span>
                          <span className="text-sm text-gray-600">days</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Set to 0 if cycles have stopped or are irregular</p>
                      </div>

                      <div>
                        <Label className="text-sm">Current phase (best guess):</Label>
                        <RadioGroup
                          value={cyclePhase}
                          onValueChange={(value) => setResponses({...responses, cyclePhase: value})}
                          className="mt-2"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="menstrual" />
                              <Label>Menstrual</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="follicular" />
                              <Label>Follicular</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ovulatory" />
                              <Label>Ovulatory</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="luteal" />
                              <Label>Luteal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="postmenopausal" />
                              <Label>Postmenopausal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unknown" />
                              <Label>Unknown/Irregular</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  {/* Overall Symptom Score */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">Overall Symptom Level</h5>
                      <span className={`text-lg font-bold ${interpretation.color}`}>
                        {interpretation.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          overallSymptomScore <= 3 ? 'bg-green-500' : 
                          overallSymptomScore <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(overallSymptomScore / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>0 (No symptoms)</span>
                      <span>{overallSymptomScore.toFixed(1)}/10</span>
                      <span>10 (Severe)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{interpretation.message}</p>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, trackerPhase: 'physical'})}
                    className="w-full"
                  >
                    Begin Detailed Symptom Tracking
                  </Button>
                </div>
              </div>
            )}

            {/* Category-specific tracking */}
            {symptomCategories.map((category) => (
              trackerPhase === category.id && (
                <div key={category.id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h4 className="text-xl font-semibold">{category.title}</h4>
                    <p className="text-sm text-gray-600">Rate each symptom from 0 (none) to 10 (severe)</p>
                  </div>

                  <div className="space-y-6">
                    {category.symptoms.map((symptom) => {
                      const currentScore = getSymptomScore(symptom.id);
                      const isReversed = symptom.scale[0] > symptom.scale[1];
                      
                      return (
                        <div key={symptom.id} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="font-medium">{symptom.name}</Label>
                            <span className={`text-lg font-bold ${
                              currentScore <= 3 ? 'text-green-600' : 
                              currentScore <= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {currentScore}/10
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <Slider
                              value={[currentScore]}
                              onValueChange={(value) => setResponses({
                                ...responses, 
                                [`symptom-${symptom.id}`]: value[0]
                              })}
                              max={10}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>{isReversed ? 'Excellent' : 'None'}</span>
                              <span>{isReversed ? 'Poor' : 'Severe'}</span>
                            </div>
                            
                            {/* Visual scale with numbers */}
                            <div className="grid grid-cols-11 gap-1">
                              {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setResponses({
                                    ...responses, 
                                    [`symptom-${symptom.id}`]: num
                                  })}
                                  className={`h-8 rounded text-xs font-medium transition-all ${
                                    num === currentScore 
                                      ? `bg-${category.color}-500 text-white` 
                                      : `bg-gray-200 text-gray-600 hover:bg-${category.color}-100`
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Category average */}
                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.title} Average:</span>
                        <span className={`text-xl font-bold ${
                          getCategoryAverage(category) <= 3 ? 'text-green-600' : 
                          getCategoryAverage(category) <= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {getCategoryAverage(category).toFixed(1)}/10
                        </span>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = symptomCategories.findIndex(cat => cat.id === category.id);
                          if (currentIndex > 0) {
                            setResponses({...responses, trackerPhase: symptomCategories[currentIndex - 1].id});
                          } else {
                            setResponses({...responses, trackerPhase: 'overview'});
                          }
                        }}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const currentIndex = symptomCategories.findIndex(cat => cat.id === category.id);
                          if (currentIndex < symptomCategories.length - 1) {
                            setResponses({...responses, trackerPhase: symptomCategories[currentIndex + 1].id});
                          } else {
                            setResponses({...responses, trackerPhase: 'insights'});
                          }
                        }}
                      >
                        {category.id === 'hormonal' ? 'View Insights' : 'Next Category'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Insights and Patterns */}
            {trackerPhase === 'insights' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="text-xl font-semibold">Your Symptom Insights</h4>
                  <p className="text-sm text-gray-600">Based on today's tracking, here are your patterns and recommendations</p>
                </div>

                <div className="space-y-6">
                  {/* Category Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {symptomCategories.map((category) => {
                      const avgScore = getCategoryAverage(category);
                      return (
                        <div key={category.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{category.icon}</span>
                              <span className="font-medium">{category.title}</span>
                            </div>
                            <span className={`text-lg font-bold ${
                              avgScore <= 3 ? 'text-green-600' : 
                              avgScore <= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {avgScore.toFixed(1)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                avgScore <= 3 ? 'bg-green-500' : 
                                avgScore <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(avgScore / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Personalized Recommendations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-3">Personalized Recommendations</h5>
                    <div className="space-y-2 text-sm text-blue-700">
                      {getCategoryAverage(symptomCategories[0]) > 6 && (
                        <div>• Consider cooling techniques and breathwork for hot flashes and physical symptoms</div>
                      )}
                      {getCategoryAverage(symptomCategories[1]) > 6 && (
                        <div>• Focus on stress management and meditation for emotional balance</div>
                      )}
                      {getCategoryAverage(symptomCategories[2]) > 6 && (
                        <div>• Prioritize sleep hygiene and morning light exposure for better rest</div>
                      )}
                      {getCategoryAverage(symptomCategories[3]) > 6 && (
                        <div>• Consider hormonal support strategies and discuss with healthcare provider</div>
                      )}
                      {overallSymptomScore <= 4 && (
                        <div>• You're managing well! Maintain your current practices and track patterns</div>
                      )}
                    </div>
                  </div>

                  {/* Daily Notes */}
                  <div>
                    <Label className="font-medium">Daily notes and observations:</Label>
                    <Textarea
                      placeholder="What might have influenced your symptoms today? Sleep, stress, food, exercise, emotions..."
                      value={responses.dailyNotes || ''}
                      onChange={(e) => setResponses({...responses, dailyNotes: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  {/* Actions for Tomorrow */}
                  <div>
                    <Label className="font-medium">Priority actions for tomorrow:</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Morning sunlight exposure', 'Stress management practice', 'Better sleep hygiene',
                        'Gentle movement/exercise', 'Hydration focus', 'Mindful eating',
                        'Evening wind-down routine', 'Social connection', 'Creative activity'
                      ].map((action) => (
                        <div key={action} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`action-${action}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`action-${action}`]: checked
                            })}
                          />
                          <Label className="text-sm">{action}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, trackerPhase: 'overview'})}
                    variant="outline"
                    className="w-full"
                  >
                    Start New Day's Tracking
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Navigation */}
            {trackerPhase !== 'overview' && trackerPhase !== 'insights' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Tracking Progress</span>
                  <span className="text-sm text-gray-600">
                    {symptomCategories.findIndex(cat => cat.id === trackerPhase) + 1} of {symptomCategories.length} categories
                  </span>
                </div>
                <Progress 
                  value={((symptomCategories.findIndex(cat => cat.id === trackerPhase) + 1) / symptomCategories.length) * 100} 
                  className="h-2" 
                />
              </div>
            )}

            {/* Tracking Tips */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h5 className="font-semibold text-indigo-800 mb-2">💡 Effective Tracking Tips</h5>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Track at the same time each day for consistency</li>
                <li>• Be honest about symptom intensity - this data helps you</li>
                <li>• Note potential triggers: stress, sleep, diet, weather</li>
                <li>• Track for at least 2-3 months to see meaningful patterns</li>
                <li>• Share your data with healthcare providers for better care</li>
                <li>• Celebrate improvements, even small ones</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Mental Clarity Power Practice
    if (component.id === 'clarity-practice') {
      const practicePhase = responses.practicePhase || 'assessment';
      const clarityScore = responses.clarityScore || 5;
      const focusLevel = responses.focusLevel || 5;
      const memorySharpness = responses.memorySharpness || 5;
      const practiceType = responses.practiceType || 'brain-training';
      const completedExercises = responses.completedExercises || [];

      const clarityExercises = [
        {
          id: 'memory-palace',
          name: 'Memory Palace Technique',
          duration: '10 min',
          difficulty: 'Advanced',
          description: 'Create vivid mental locations to store and recall information',
          steps: [
            'Choose a familiar location (your home, office, or route)',
            'Identify 5-7 distinct landmarks in that space',
            'Associate each piece of information with a landmark',
            'Walk through your mental palace to recall the information',
            'Practice the journey 3 times to solidify the memory'
          ],
          benefits: ['Improves long-term memory', 'Enhances spatial thinking', 'Builds mental imagery skills']
        },
        {
          id: 'attention-switching',
          name: 'Attention Switching Exercise',
          duration: '8 min',
          difficulty: 'Intermediate',
          description: 'Train your brain to rapidly switch between different tasks',
          steps: [
            'Set a timer for 1-minute intervals',
            'Task 1: Count backwards from 100 by 7s',
            'Switch: Name animals alphabetically',
            'Switch: List items in your kitchen',
            'Switch: Continue counting backwards from where you left off',
            'Repeat cycle 3 times, noting your switching speed'
          ],
          benefits: ['Improves cognitive flexibility', 'Enhances executive function', 'Reduces brain fog']
        },
        {
          id: 'dual-n-back',
          name: 'Dual N-Back Challenge',
          duration: '12 min',
          difficulty: 'Advanced',
          description: 'Exercise working memory with visual and auditory stimuli',
          steps: [
            'Focus on a 3x3 grid of squares',
            'Track both position and sound sequences',
            'Identify when current stimulus matches one from N steps back',
            'Start with N=1, increase difficulty as you improve',
            'Complete 3 rounds, tracking your accuracy'
          ],
          benefits: ['Boosts working memory', 'Increases processing speed', 'Enhances fluid intelligence']
        },
        {
          id: 'mindful-observation',
          name: 'Mindful Observation Training',
          duration: '6 min',
          difficulty: 'Beginner',
          description: 'Sharpen attention through detailed observation',
          steps: [
            'Choose a complex object (plant, artwork, or view outside)',
            'Observe for 2 minutes, noting every detail',
            'Close your eyes and mentally recreate the image',
            'Open eyes and compare - what did you miss?',
            'Repeat observation, focusing on missed details'
          ],
          benefits: ['Improves sustained attention', 'Enhances visual processing', 'Builds mindfulness']
        },
        {
          id: 'number-sequence',
          name: 'Progressive Number Sequences',
          duration: '7 min',
          difficulty: 'Intermediate',
          description: 'Challenge working memory with increasing complexity',
          steps: [
            'Start with a 3-digit sequence (e.g., 2-4-6)',
            'Add one number following the pattern',
            'Repeat the full sequence aloud',
            'Increase to 4, then 5, then 6 digits',
            'Try different patterns: +3, ×2, fibonacci'
          ],
          benefits: ['Strengthens working memory', 'Improves pattern recognition', 'Enhances mathematical thinking']
        }
      ];

      const getCurrentExercise = () => {
        return clarityExercises.find(ex => ex.id === practiceType) || clarityExercises[0];
      };

      const getClarityInterpretation = (score: number) => {
        if (score <= 3) return { level: 'Foggy', color: 'text-red-600', message: 'Mental clarity feels clouded' };
        if (score <= 5) return { level: 'Moderate', color: 'text-yellow-600', message: 'Some mental clarity with moments of fog' };
        if (score <= 7) return { level: 'Clear', color: 'text-green-600', message: 'Good mental sharpness' };
        if (score <= 9) return { level: 'Sharp', color: 'text-green-700', message: 'Excellent cognitive function' };
        return { level: 'Crystal Clear', color: 'text-green-800', message: 'Peak mental performance' };
      };

      const interpretation = getClarityInterpretation(clarityScore);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Mental Clarity Power Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Targeted cognitive exercises designed to combat brain fog and enhance mental sharpness during hormonal transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Science Behind Cognitive Training */}
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h5 className="font-semibold text-purple-800 mb-2">Why Cognitive Training Works</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-700">
                <div>
                  <strong>Neuroplasticity:</strong> Regular mental exercise creates new neural pathways
                </div>
                <div>
                  <strong>Working Memory:</strong> Targeted practice improves information processing capacity
                </div>
                <div>
                  <strong>Attention Control:</strong> Training enhances focus and reduces distractibility
                </div>
                <div>
                  <strong>Cognitive Reserve:</strong> Building mental strength protects against age-related decline
                </div>
              </div>
            </div>

            {/* Initial Assessment */}
            {practicePhase === 'assessment' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Cognitive Baseline Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your current mental state before beginning the practice:</p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Overall Mental Clarity</Label>
                      <span className={`text-sm font-semibold ${interpretation.color}`}>
                        {interpretation.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Very Foggy</span>
                      <Slider
                        value={[clarityScore]}
                        onValueChange={(value) => setResponses({...responses, clarityScore: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Crystal Clear</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{clarityScore}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{interpretation.message}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Focus & Concentration</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Scattered</span>
                      <Slider
                        value={[focusLevel]}
                        onValueChange={(value) => setResponses({...responses, focusLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Laser Focus</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{focusLevel}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Memory Sharpness</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Forgetful</span>
                      <Slider
                        value={[memorySharpness]}
                        onValueChange={(value) => setResponses({...responses, memorySharpness: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Sharp Recall</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{memorySharpness}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Current challenges (check all that apply):</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Forgetting names', 'Losing train of thought', 'Difficulty concentrating', 'Word-finding issues',
                        'Feeling mentally slow', 'Easily distracted', 'Memory lapses', 'Decision fatigue'
                      ].map((challenge) => (
                        <div key={challenge} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`challenge-${challenge}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`challenge-${challenge}`]: checked
                            })}
                          />
                          <Label className="text-sm">{challenge}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, practicePhase: 'selection'})}
                    className="w-full"
                  >
                    Choose Your Cognitive Training
                  </Button>
                </div>
              </div>
            )}

            {/* Exercise Selection */}
            {practicePhase === 'selection' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Select Your Power Practice</h4>
                <p className="text-sm text-gray-600 mb-4">Choose an exercise based on your current focus level and available time:</p>
                
                <div className="space-y-4">
                  {clarityExercises.map((exercise) => {
                    const isRecommended = 
                      (clarityScore <= 4 && exercise.difficulty === 'Beginner') ||
                      (clarityScore >= 5 && clarityScore <= 7 && exercise.difficulty === 'Intermediate') ||
                      (clarityScore >= 8 && exercise.difficulty === 'Advanced');

                    return (
                      <div 
                        key={exercise.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          practiceType === exercise.id 
                            ? 'border-purple-400 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isRecommended ? 'ring-2 ring-green-200' : ''}`}
                        onClick={() => setResponses({...responses, practiceType: exercise.id})}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                practiceType === exercise.id 
                                  ? 'border-purple-500 bg-purple-500' 
                                  : 'border-gray-300'
                              }`}>
                                {practiceType === exercise.id && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <h5 className="font-semibold">{exercise.name}</h5>
                              {isRecommended && (
                                <Badge variant="default" className="bg-green-500">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                            <div className="flex gap-3 text-xs">
                              <Badge variant="outline">{exercise.duration}</Badge>
                              <Badge variant="outline">{exercise.difficulty}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => setResponses({...responses, practicePhase: 'practice'})}
                  className="w-full mt-6"
                >
                  Start {getCurrentExercise().name}
                </Button>
              </div>
            )}

            {/* Practice Execution */}
            {practicePhase === 'practice' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold mb-2">{getCurrentExercise().name}</h4>
                  <p className="text-sm text-gray-600">{getCurrentExercise().description}</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <Badge variant="secondary">{getCurrentExercise().duration}</Badge>
                    <Badge variant="secondary">{getCurrentExercise().difficulty}</Badge>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg mb-6">
                  <h5 className="font-semibold mb-4">Step-by-Step Instructions</h5>
                  <div className="space-y-3">
                    {getCurrentExercise().steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={responses[`step-${index}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`step-${index}`]: checked
                            })}
                          />
                          <span className="text-sm">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg mb-6">
                  <h5 className="font-semibold mb-2">Expected Benefits</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {getCurrentExercise().benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Practice intensity (how challenging did this feel?):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Too Easy</span>
                      <Slider
                        value={[responses.practiceIntensity || 5]}
                        onValueChange={(value) => setResponses({...responses, practiceIntensity: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Challenging</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{responses.practiceIntensity || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Completion percentage:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[responses.completionRate || 0]}
                        onValueChange={(value) => setResponses({...responses, completionRate: value[0]})}
                        max={100}
                        min={0}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-purple-600 min-w-[50px]">{responses.completionRate || 0}%</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, practicePhase: 'results'})}
                    className="w-full"
                    disabled={!responses.completionRate || responses.completionRate < 50}
                  >
                    Complete Practice & Assess Results
                  </Button>
                </div>
              </div>
            )}

            {/* Results Assessment */}
            {practicePhase === 'results' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🧠✨</div>
                  <h4 className="text-xl font-semibold">Practice Complete!</h4>
                  <p className="text-sm text-gray-600">How do you feel after the {getCurrentExercise().name}?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Mental clarity now (compare with starting {clarityScore}/10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Very Foggy</span>
                      <Slider
                        value={[responses.postClarityScore || 5]}
                        onValueChange={(value) => setResponses({...responses, postClarityScore: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Crystal Clear</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postClarityScore || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Focus level now:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Scattered</span>
                      <Slider
                        value={[responses.postFocusLevel || 5]}
                        onValueChange={(value) => setResponses({...responses, postFocusLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Laser Focus</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postFocusLevel || 5}</span>
                    </div>
                  </div>

                  {/* Progress Summary */}
                  {responses.postClarityScore && responses.postFocusLevel && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Your Cognitive Improvement</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Mental Clarity Change:</span>
                          <span className={`font-bold ${
                            responses.postClarityScore > clarityScore 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {responses.postClarityScore > clarityScore ? '+' : ''}{responses.postClarityScore - clarityScore} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Focus Improvement:</span>
                          <span className={`font-bold ${
                            responses.postFocusLevel > focusLevel 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {responses.postFocusLevel > focusLevel ? '+' : ''}{responses.postFocusLevel - focusLevel} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exercise Completed:</span>
                          <span className="font-medium">{getCurrentExercise().name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion Rate:</span>
                          <span className="font-medium">{responses.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>What did you notice during the practice?</Label>
                    <Textarea
                      placeholder="Describe any mental shifts, challenges, insights, or improvements you experienced..."
                      value={responses.practiceReflection || ''}
                      onChange={(e) => setResponses({...responses, practiceReflection: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Mark this exercise as completed:</Label>
                    <Button
                      onClick={() => {
                        const newCompleted = [...completedExercises];
                        if (!newCompleted.includes(getCurrentExercise().id)) {
                          newCompleted.push(getCurrentExercise().id);
                          setResponses({...responses, completedExercises: newCompleted});
                        }
                      }}
                      className="w-full mt-2"
                      variant={completedExercises.includes(getCurrentExercise().id) ? "default" : "outline"}
                    >
                      {completedExercises.includes(getCurrentExercise().id) ? '✓ Exercise Completed' : 'Mark as Complete'}
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, practicePhase: 'selection'})}
                    variant="outline"
                    className="w-full"
                  >
                    Try Another Exercise
                  </Button>
                </div>
              </div>
            )}

            {/* Completed Exercises Tracker */}
            {completedExercises.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Completed Exercises ({completedExercises.length}/5)</h5>
                <div className="grid grid-cols-1 gap-2">
                  {clarityExercises.map((exercise) => (
                    <div key={exercise.id} className={`text-sm ${
                      completedExercises.includes(exercise.id) 
                        ? 'text-green-700 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {completedExercises.includes(exercise.id) ? '✓' : '○'} {exercise.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Practice Tips */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Cognitive Training Tips</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Practice for 10-15 minutes daily for best results</li>
                <li>• Start with easier exercises and gradually increase difficulty</li>
                <li>• Track your progress to see improvements over time</li>
                <li>• Mix different types of exercises to train various cognitive skills</li>
                <li>• Practice when you're alert, not when mentally fatigued</li>
                <li>• Consistency is more important than duration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Brain Fog Exercise - Mental Clarity Power Practice
    if (component.id === 'brain-fog-exercise') {
      const practicePhase = responses.brainFogPhase || 'assessment';
      const cognitiveLoad = responses.cognitiveLoad || 5;
      const mentalFatigue = responses.mentalFatigue || 5;
      const processingSpeed = responses.processingSpeed || 5;
      const selectedExercise = responses.selectedExercise || 'cognitive-declutter';
      const exerciseRounds = responses.exerciseRounds || 0;

      const brainFogExercises = [
        {
          id: 'cognitive-declutter',
          name: 'Cognitive Declutter Session',
          duration: '8 min',
          difficulty: 'Beginner',
          description: 'Clear mental clutter through structured brain dumping and prioritization',
          icon: '🧹',
          steps: [
            'Set timer for 3 minutes - write down EVERYTHING on your mind',
            'No editing, organizing, or judging - just dump it all out',
            'Circle the 3 most urgent/important items',
            'Cross out things completely outside your control',
            'Choose ONE item to focus on right now',
            'Notice how your mind feels after this clearing'
          ],
          benefits: ['Reduces cognitive overload', 'Improves mental clarity', 'Decreases anxiety']
        },
        {
          id: 'attention-reset',
          name: 'Attention Reset Protocol',
          duration: '6 min',
          difficulty: 'Beginner',
          description: 'Restore focus through targeted attention exercises',
          icon: '🎯',
          steps: [
            'Count your breaths from 1 to 10, then start over',
            'When you lose count, gently return to 1',
            'Focus on the sensation of breathing',
            'Notice thoughts without following them',
            'Complete 3 full cycles of 1-10',
            'Rate your focus improvement'
          ],
          benefits: ['Sharpens attention', 'Calms racing thoughts', 'Builds concentration']
        },
        {
          id: 'memory-boost',
          name: 'Memory Boost Challenge',
          duration: '10 min',
          difficulty: 'Intermediate',
          description: 'Strengthen working memory with progressive exercises',
          icon: '🧠',
          steps: [
            'Start with 3 random words, repeat them back',
            'Add a 4th word, repeat all 4',
            'Continue adding words until you reach your limit',
            'Try the same with numbers',
            'Create a story linking all the words together',
            'Test recall after 2-minute break'
          ],
          benefits: ['Improves working memory', 'Enhances recall ability', 'Builds mental capacity']
        },
        {
          id: 'processing-speed',
          name: 'Mental Processing Accelerator',
          duration: '7 min',
          difficulty: 'Intermediate',
          description: 'Speed up mental processing through timed challenges',
          icon: '⚡',
          steps: [
            'Name 20 animals as fast as possible (time yourself)',
            'Count backwards from 100 by 7s',
            'List words that start with each letter A-Z',
            'Alternate between naming colors and shapes',
            'Complete simple math: 15+27, 84-39, 6×9',
            'Compare your times across rounds'
          ],
          benefits: ['Increases processing speed', 'Improves mental agility', 'Reduces brain fog']
        },
        {
          id: 'executive-function',
          name: 'Executive Function Trainer',
          duration: '12 min',
          difficulty: 'Advanced',
          description: 'Exercise planning, decision-making, and mental flexibility',
          icon: '🎮',
          steps: [
            'Plan your ideal day in 10 steps',
            'Switch between tasks: odd numbers, even numbers, repeat',
            'Make 5 quick decisions: breakfast choice, outfit, route to work',
            'Reorganize a mental list by priority, then by time',
            'Practice inhibition: name colors, ignore the words',
            'Reflect on which tasks felt most challenging'
          ],
          benefits: ['Strengthens decision-making', 'Improves planning skills', 'Enhances mental flexibility']
        }
      ];

      const getCurrentExercise = () => {
        return brainFogExercises.find(ex => ex.id === selectedExercise) || brainFogExercises[0];
      };

      const getCognitiveInterpretation = (score: number) => {
        if (score <= 3) return { level: 'Sharp', color: 'text-green-700', message: 'Mental clarity is excellent' };
        if (score <= 5) return { level: 'Clear', color: 'text-green-600', message: 'Good cognitive function with minor fog' };
        if (score <= 7) return { level: 'Foggy', color: 'text-yellow-600', message: 'Noticeable brain fog affecting thinking' };
        if (score <= 9) return { level: 'Very Foggy', color: 'text-orange-600', message: 'Significant cognitive cloudiness' };
        return { level: 'Severely Foggy', color: 'text-red-600', message: 'Thinking feels very clouded and slow' };
      };

      const overallCognitiveScore = (cognitiveLoad + mentalFatigue + (10 - processingSpeed)) / 3;
      const interpretation = getCognitiveInterpretation(overallCognitiveScore);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              Mental Clarity Power Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Targeted exercises to cut through brain fog and restore mental sharpness during hormonal changes.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brain Fog Science */}
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h5 className="font-semibold text-indigo-800 mb-2">Understanding Perimenopause Brain Fog</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-700">
                <div>
                  <strong>Hormonal Impact:</strong> Estrogen decline affects neurotransmitters and cognitive function
                </div>
                <div>
                  <strong>Working Memory:</strong> Reduced capacity to hold and manipulate information
                </div>
                <div>
                  <strong>Processing Speed:</strong> Slower mental processing and response times
                </div>
                <div>
                  <strong>Attention Control:</strong> Difficulty filtering distractions and maintaining focus
                </div>
              </div>
            </div>

            {/* Cognitive Assessment */}
            {practicePhase === 'assessment' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Brain Fog Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your current cognitive state to customize your practice:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Mental Overload Level</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Clear Mind</span>
                      <Slider
                        value={[cognitiveLoad]}
                        onValueChange={(value) => setResponses({...responses, cognitiveLoad: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Overwhelmed</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[30px]">{cognitiveLoad}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">How cluttered does your mind feel right now?</p>
                  </div>

                  <div>
                    <Label className="font-medium">Mental Fatigue</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Energized</span>
                      <Slider
                        value={[mentalFatigue]}
                        onValueChange={(value) => setResponses({...responses, mentalFatigue: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Exhausted</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[30px]">{mentalFatigue}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">How mentally tired do you feel?</p>
                  </div>

                  <div>
                    <Label className="font-medium">Processing Speed</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Fast & Sharp</span>
                      <Slider
                        value={[processingSpeed]}
                        onValueChange={(value) => setResponses({...responses, processingSpeed: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Slow & Sluggish</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[30px]">{processingSpeed}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">How quickly is your mind working today?</p>
                  </div>

                  {/* Overall Assessment */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">Overall Brain Fog Level</h5>
                      <span className={`text-lg font-bold ${interpretation.color}`}>
                        {interpretation.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          overallCognitiveScore <= 4 ? 'bg-green-500' : 
                          overallCognitiveScore <= 7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(overallCognitiveScore / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>0 (Crystal Clear)</span>
                      <span>{overallCognitiveScore.toFixed(1)}/10</span>
                      <span>10 (Severe Fog)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{interpretation.message}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Current brain fog symptoms (check all that apply):</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Forgetfulness', 'Difficulty concentrating', 'Word-finding problems', 'Mental fatigue',
                        'Confused thinking', 'Slow processing', 'Memory lapses', 'Decision difficulty'
                      ].map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`fog-symptom-${symptom}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`fog-symptom-${symptom}`]: checked
                            })}
                          />
                          <Label className="text-sm">{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, brainFogPhase: 'selection'})}
                    className="w-full"
                  >
                    Choose Your Clarity Exercise
                  </Button>
                </div>
              </div>
            )}

            {/* Exercise Selection */}
            {practicePhase === 'selection' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Select Your Power Practice</h4>
                <p className="text-sm text-gray-600 mb-4">Based on your fog level of {overallCognitiveScore.toFixed(1)}/10, here are recommended exercises:</p>
                
                <div className="space-y-4">
                  {brainFogExercises.map((exercise) => {
                    const isRecommended = 
                      (overallCognitiveScore <= 4 && exercise.difficulty === 'Advanced') ||
                      (overallCognitiveScore > 4 && overallCognitiveScore <= 7 && exercise.difficulty === 'Intermediate') ||
                      (overallCognitiveScore > 7 && exercise.difficulty === 'Beginner');

                    return (
                      <div 
                        key={exercise.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedExercise === exercise.id 
                            ? 'border-indigo-400 bg-indigo-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isRecommended ? 'ring-2 ring-green-200' : ''}`}
                        onClick={() => setResponses({...responses, selectedExercise: exercise.id})}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-2xl">{exercise.icon}</div>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedExercise === exercise.id 
                                  ? 'border-indigo-500 bg-indigo-500' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedExercise === exercise.id && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <h5 className="font-semibold">{exercise.name}</h5>
                              {isRecommended && (
                                <Badge variant="default" className="bg-green-500">Best Match</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                            <div className="flex gap-3 text-xs mb-2">
                              <Badge variant="outline">{exercise.duration}</Badge>
                              <Badge variant="outline">{exercise.difficulty}</Badge>
                            </div>
                            <div className="text-sm text-green-600">
                              <strong>Benefits:</strong> {exercise.benefits.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => setResponses({...responses, brainFogPhase: 'practice'})}
                  className="w-full mt-6"
                >
                  Start {getCurrentExercise().name}
                </Button>
              </div>
            )}

            {/* Practice Session */}
            {practicePhase === 'practice' && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{getCurrentExercise().icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{getCurrentExercise().name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{getCurrentExercise().description}</p>
                  <div className="flex justify-center gap-4">
                    <Badge variant="secondary">{getCurrentExercise().duration}</Badge>
                    <Badge variant="secondary">{getCurrentExercise().difficulty}</Badge>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg mb-6">
                  <h5 className="font-semibold mb-4">Exercise Instructions</h5>
                  <div className="space-y-4">
                    {getCurrentExercise().steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={responses[`practice-step-${index}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`practice-step-${index}`]: checked
                            })}
                          />
                          <span className="text-sm flex-1">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Tracker */}
                <div className="bg-white p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="font-medium">Practice Rounds Completed:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, exerciseRounds: Math.max(0, exerciseRounds - 1)})}
                      >
                        -
                      </Button>
                      <span className="text-2xl font-bold text-indigo-600 min-w-[40px] text-center">{exerciseRounds}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResponses({...responses, exerciseRounds: exerciseRounds + 1})}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map((round) => (
                      <div key={round} className={`h-10 rounded flex items-center justify-center text-sm font-medium ${
                        round <= exerciseRounds 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        Round {round}
                      </div>
                    ))}
                  </div>

                  {exerciseRounds >= 2 && (
                    <p className="text-sm text-green-600 mt-3 text-center">
                      Great progress! You should start feeling mental clarity improvements.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">How challenging was this exercise?</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Too Easy</span>
                      <Slider
                        value={[responses.exerciseChallenge || 5]}
                        onValueChange={(value) => setResponses({...responses, exerciseChallenge: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Hard</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[30px]">{responses.exerciseChallenge || 5}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, brainFogPhase: 'results'})}
                    className="w-full"
                    disabled={exerciseRounds < 1}
                  >
                    Complete Practice & Check Results
                  </Button>
                </div>
              </div>
            )}

            {/* Results Assessment */}
            {practicePhase === 'results' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🌟</div>
                  <h4 className="text-xl font-semibold">Mental Clarity Restored!</h4>
                  <p className="text-sm text-gray-600">How does your mind feel after the {getCurrentExercise().name}?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Mental overload now (compare with starting {cognitiveLoad}/10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Clear Mind</span>
                      <Slider
                        value={[responses.postCognitiveLoad || 3]}
                        onValueChange={(value) => setResponses({...responses, postCognitiveLoad: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Overwhelmed</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postCognitiveLoad || 3}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Mental fatigue now:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Energized</span>
                      <Slider
                        value={[responses.postMentalFatigue || 3]}
                        onValueChange={(value) => setResponses({...responses, postMentalFatigue: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Exhausted</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postMentalFatigue || 3}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Processing speed now:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Fast & Sharp</span>
                      <Slider
                        value={[responses.postProcessingSpeed || 7]}
                        onValueChange={(value) => setResponses({...responses, postProcessingSpeed: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Slow & Sluggish</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postProcessingSpeed || 7}</span>
                    </div>
                  </div>

                  {/* Improvement Summary */}
                  {responses.postCognitiveLoad && responses.postMentalFatigue && responses.postProcessingSpeed && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Your Brain Fog Improvements</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Mental Overload Reduction:</span>
                          <span className={`font-bold ${
                            cognitiveLoad - responses.postCognitiveLoad > 0 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            -{cognitiveLoad - responses.postCognitiveLoad} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mental Fatigue Reduction:</span>
                          <span className={`font-bold ${
                            mentalFatigue - responses.postMentalFatigue > 0 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            -{mentalFatigue - responses.postMentalFatigue} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Speed Improvement:</span>
                          <span className={`font-bold ${
                            responses.postProcessingSpeed - processingSpeed > 0 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            +{responses.postProcessingSpeed - processingSpeed} points
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exercise Completed:</span>
                          <span className="font-medium">{getCurrentExercise().name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rounds Completed:</span>
                          <span className="font-medium">{exerciseRounds}/3</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Describe your mental state now:</Label>
                    <Textarea
                      placeholder="How does your thinking feel? Any improvements in clarity, focus, or mental energy?"
                      value={responses.clarityReflection || ''}
                      onChange={(e) => setResponses({...responses, clarityReflection: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, brainFogPhase: 'selection'})}
                    variant="outline"
                    className="w-full"
                  >
                    Try Another Exercise
                  </Button>
                </div>
              </div>
            )}

            {/* Practice Tips */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h5 className="font-semibold text-indigo-800 mb-2">Brain Fog Combat Tips</h5>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Practice these exercises when brain fog is mild for best results</li>
                <li>• Start with easier exercises and gradually increase difficulty</li>
                <li>• Consistency matters more than duration - even 5 minutes helps</li>
                <li>• Track which exercises work best for your specific fog patterns</li>
                <li>• Combine with good sleep, hydration, and stress management</li>
                <li>• Use these as "mental breaks" during demanding cognitive tasks</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Energy Mapping - Personal Energy Pattern Discovery
    if (component.id === 'energy-mapping') {
      const mappingPhase = responses.energyMappingPhase || 'baseline';
      const currentTime = new Date().getHours();
      const energyReadings = responses.energyReadings || {};
      const energyTriggers = responses.energyTriggers || {};
      const sleepQuality = responses.sleepQuality || 5;
      const stressLevel = responses.stressLevel || 5;

      const timeSlots = [
        { time: '6 AM', hour: 6, label: 'Early Morning', description: 'Just after waking' },
        { time: '8 AM', hour: 8, label: 'Morning', description: 'Start of day routine' },
        { time: '10 AM', hour: 10, label: 'Mid-Morning', description: 'Peak morning hours' },
        { time: '12 PM', hour: 12, label: 'Noon', description: 'Midday energy' },
        { time: '2 PM', hour: 14, label: 'Early Afternoon', description: 'Post-lunch period' },
        { time: '4 PM', hour: 16, label: 'Late Afternoon', description: 'Afternoon dip zone' },
        { time: '6 PM', hour: 18, label: 'Early Evening', description: 'End of workday' },
        { time: '8 PM', hour: 20, label: 'Evening', description: 'Wind-down time' },
        { time: '10 PM', hour: 22, label: 'Late Evening', description: 'Pre-sleep hours' }
      ];

      const energyFactors = [
        { id: 'sleep', name: 'Sleep Quality', icon: '😴', impact: 'high' },
        { id: 'nutrition', name: 'Meals & Nutrition', icon: '🍽️', impact: 'high' },
        { id: 'movement', name: 'Physical Activity', icon: '🏃‍♀️', impact: 'medium' },
        { id: 'stress', name: 'Stress Levels', icon: '😰', impact: 'high' },
        { id: 'hydration', name: 'Hydration', icon: '💧', impact: 'medium' },
        { id: 'social', name: 'Social Interactions', icon: '👥', impact: 'medium' },
        { id: 'environment', name: 'Environment/Weather', icon: '🌤️', impact: 'low' },
        { id: 'hormones', name: 'Hormonal Changes', icon: '🌸', impact: 'high' }
      ];

      const getEnergyLevel = (timeSlot: string) => energyReadings[timeSlot] || 0;
      const averageEnergy = Object.values(energyReadings).length > 0 
        ? Object.values(energyReadings).reduce((a: number, b: number) => a + b, 0) / Object.values(energyReadings).length 
        : 0;

      const getEnergyInterpretation = (level: number) => {
        if (level >= 8) return { status: 'High Energy', color: 'text-green-700', message: 'Peak vitality and alertness' };
        if (level >= 6) return { status: 'Good Energy', color: 'text-green-600', message: 'Solid energy levels' };
        if (level >= 4) return { status: 'Moderate Energy', color: 'text-yellow-600', message: 'Average energy, some fluctuation' };
        if (level >= 2) return { status: 'Low Energy', color: 'text-orange-600', message: 'Below optimal energy levels' };
        return { status: 'Very Low Energy', color: 'text-red-600', message: 'Significant energy depletion' };
      };

      const energyInterpretation = getEnergyInterpretation(averageEnergy);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Personal Energy Pattern Discovery
            </CardTitle>
            <p className="text-sm text-gray-600">Map your daily energy patterns to identify your natural rhythms and optimize your schedule during hormonal transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Energy Science */}
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h5 className="font-semibold text-orange-800 mb-2">Understanding Energy Patterns in Perimenopause</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-orange-700">
                <div>
                  <strong>Circadian Disruption:</strong> Hormonal changes affect your natural daily rhythm
                </div>
                <div>
                  <strong>Cortisol Shifts:</strong> Stress hormone patterns change, affecting energy timing
                </div>
                <div>
                  <strong>Sleep Fragmentation:</strong> Poor sleep quality creates unpredictable energy dips
                </div>
                <div>
                  <strong>Metabolic Changes:</strong> Energy production and usage patterns shift with hormones
                </div>
              </div>
            </div>

            {/* Baseline Assessment */}
            {mappingPhase === 'baseline' && (
              <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Energy Baseline Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Let's establish your current energy foundation before detailed mapping:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Overall energy level today</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Depleted</span>
                      <Slider
                        value={[responses.overallEnergy || 5]}
                        onValueChange={(value) => setResponses({...responses, overallEnergy: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-orange-600 min-w-[30px]">{responses.overallEnergy || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Sleep quality last night</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Terrible</span>
                      <Slider
                        value={[sleepQuality]}
                        onValueChange={(value) => setResponses({...responses, sleepQuality: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Excellent</span>
                      <span className="text-lg font-bold text-orange-600 min-w-[30px]">{sleepQuality}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Current stress level</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Very Calm</span>
                      <Slider
                        value={[stressLevel]}
                        onValueChange={(value) => setResponses({...responses, stressLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Stressed</span>
                      <span className="text-lg font-bold text-orange-600 min-w-[30px]">{stressLevel}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">When do you typically feel most energized? (check all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Early morning (6-9 AM)', 'Mid-morning (9 AM-12 PM)', 'Early afternoon (12-3 PM)', 'Late afternoon (3-6 PM)',
                        'Early evening (6-8 PM)', 'Late evening (8-10 PM)', 'Night (after 10 PM)', 'Energy varies daily'
                      ].map((timeOption) => (
                        <div key={timeOption} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`peak-time-${timeOption}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`peak-time-${timeOption}`]: checked
                            })}
                          />
                          <Label className="text-sm">{timeOption}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">When do you typically experience energy crashes?</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Mid-morning slump', 'After lunch (1-3 PM)', 'Late afternoon (3-5 PM)', 'Early evening',
                        'After dinner', 'No consistent pattern', 'Multiple times daily', 'Rarely crash'
                      ].map((crashTime) => (
                        <div key={crashTime} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`crash-time-${crashTime}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`crash-time-${crashTime}`]: checked
                            })}
                          />
                          <Label className="text-sm">{crashTime}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, energyMappingPhase: 'hourly-tracking'})}
                    className="w-full"
                  >
                    Begin Detailed Energy Mapping
                  </Button>
                </div>
              </div>
            )}

            {/* Hourly Energy Tracking */}
            {mappingPhase === 'hourly-tracking' && (
              <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Hourly Energy Mapping</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your energy level at different times throughout the day (0 = exhausted, 10 = peak energy):</p>
                
                <div className="space-y-6">
                  {/* Current Time Indicator */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Current time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Start with your current energy level, then fill in other time slots based on your typical patterns.
                    </p>
                  </div>

                  {/* Energy Tracking Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {timeSlots.map((slot) => {
                      const energyLevel = getEnergyLevel(slot.time);
                      const isCurrentTime = Math.abs(currentTime - slot.hour) <= 1;
                      
                      return (
                        <div key={slot.time} className={`p-4 border-2 rounded-lg ${
                          isCurrentTime ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-semibold">{slot.time}</h5>
                              <p className="text-xs text-gray-600">{slot.label}</p>
                            </div>
                            {isCurrentTime && (
                              <Badge variant="default" className="bg-blue-500">Now</Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-3">{slot.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Energy Level:</span>
                              <span className={`text-lg font-bold ${
                                energyLevel >= 7 ? 'text-green-600' : 
                                energyLevel >= 4 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {energyLevel}/10
                              </span>
                            </div>
                            
                            <Slider
                              value={[energyLevel]}
                              onValueChange={(value) => setResponses({
                                ...responses, 
                                energyReadings: {...energyReadings, [slot.time]: value[0]}
                              })}
                              max={10}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            
                            <div className="grid grid-cols-11 gap-0.5 mt-2">
                              {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setResponses({
                                    ...responses, 
                                    energyReadings: {...energyReadings, [slot.time]: num}
                                  })}
                                  className={`h-6 rounded text-xs font-medium transition-all ${
                                    num === energyLevel 
                                      ? 'bg-orange-500 text-white' 
                                      : 'bg-gray-200 text-gray-600 hover:bg-orange-100'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Energy Pattern Visualization */}
                  {Object.keys(energyReadings).length >= 3 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Your Energy Pattern Today</h5>
                      <div className="flex items-end gap-2 h-32">
                        {timeSlots.map((slot) => {
                          const level = getEnergyLevel(slot.time);
                          const height = (level / 10) * 100;
                          return (
                            <div key={slot.time} className="flex-1 flex flex-col items-center">
                              <div 
                                className={`w-full rounded-t transition-all ${
                                  level >= 7 ? 'bg-green-500' : 
                                  level >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ height: `${height}%` }}
                              />
                              <span className="text-xs mt-1 text-center">{slot.time}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm">Average Energy:</span>
                        <span className={`text-lg font-bold ${energyInterpretation.color}`}>
                          {averageEnergy.toFixed(1)}/10 - {energyInterpretation.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => setResponses({...responses, energyMappingPhase: 'factors'})}
                    className="w-full"
                    disabled={Object.keys(energyReadings).length < 5}
                  >
                    Analyze Energy Influences
                  </Button>
                </div>
              </div>
            )}

            {/* Energy Factors Analysis */}
            {mappingPhase === 'factors' && (
              <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Energy Influencing Factors</h4>
                <p className="text-sm text-gray-600 mb-4">Rate how much each factor impacts your energy levels today (1 = very negative, 5 = neutral, 10 = very positive):</p>
                
                <div className="space-y-6">
                  {energyFactors.map((factor) => {
                    const impact = energyTriggers[factor.id] || 5;
                    
                    return (
                      <div key={factor.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{factor.icon}</span>
                            <div>
                              <Label className="font-medium">{factor.name}</Label>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${
                                  factor.impact === 'high' ? 'border-red-300 text-red-600' :
                                  factor.impact === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                  'border-gray-300 text-gray-600'
                                }`}>
                                  {factor.impact} impact
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${
                            impact >= 7 ? 'text-green-600' : 
                            impact >= 4 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {impact}/10
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <Slider
                            value={[impact]}
                            onValueChange={(value) => setResponses({
                              ...responses, 
                              energyTriggers: {...energyTriggers, [factor.id]: value[0]}
                            })}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Drains Energy</span>
                            <span>Neutral</span>
                            <span>Boosts Energy</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Factor Analysis */}
                  {Object.keys(energyTriggers).length >= 5 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Energy Factor Analysis</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-green-700 mb-2">Energy Boosters</h6>
                          {energyFactors
                            .filter(factor => energyTriggers[factor.id] >= 7)
                            .map(factor => (
                              <div key={factor.id} className="flex items-center gap-2 text-sm text-green-600">
                                <span>{factor.icon}</span>
                                <span>{factor.name}</span>
                              </div>
                            ))}
                        </div>
                        <div>
                          <h6 className="font-medium text-red-700 mb-2">Energy Drains</h6>
                          {energyFactors
                            .filter(factor => energyTriggers[factor.id] <= 4)
                            .map(factor => (
                              <div key={factor.id} className="flex items-center gap-2 text-sm text-red-600">
                                <span>{factor.icon}</span>
                                <span>{factor.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => setResponses({...responses, energyMappingPhase: 'insights'})}
                    className="w-full"
                    disabled={Object.keys(energyTriggers).length < 4}
                  >
                    Generate Personal Energy Insights
                  </Button>
                </div>
              </div>
            )}

            {/* Personal Insights & Recommendations */}
            {mappingPhase === 'insights' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="text-xl font-semibold">Your Personal Energy Profile</h4>
                  <p className="text-sm text-gray-600">Based on your mapping, here are your unique energy patterns and optimization strategies</p>
                </div>

                <div className="space-y-6">
                  {/* Energy Pattern Summary */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-800 mb-3">Your Energy Pattern Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Peak Energy Times:</strong>
                        <div className="mt-1">
                          {timeSlots
                            .filter(slot => getEnergyLevel(slot.time) >= 7)
                            .map(slot => (
                              <div key={slot.time} className="text-green-600">
                                • {slot.time} ({slot.label})
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <strong>Low Energy Times:</strong>
                        <div className="mt-1">
                          {timeSlots
                            .filter(slot => getEnergyLevel(slot.time) <= 3)
                            .map(slot => (
                              <div key={slot.time} className="text-red-600">
                                • {slot.time} ({slot.label})
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-3">Personalized Energy Optimization</h5>
                    <div className="space-y-3 text-sm text-blue-700">
                      {averageEnergy >= 7 && (
                        <div>• Your overall energy is strong - focus on maintaining these patterns</div>
                      )}
                      {averageEnergy < 5 && (
                        <div>• Priority: Address low energy with sleep, nutrition, and stress management</div>
                      )}
                      {Object.values(energyReadings).some((level: number) => level >= 8) && (
                        <div>• Schedule important tasks during your peak energy windows</div>
                      )}
                      {Object.values(energyReadings).some((level: number) => level <= 2) && (
                        <div>• Plan rest periods during your lowest energy times</div>
                      )}
                      {energyTriggers.sleep <= 4 && (
                        <div>• Critical: Improve sleep quality - this is significantly draining your energy</div>
                      )}
                      {energyTriggers.stress <= 4 && (
                        <div>• Focus on stress management techniques to prevent energy depletion</div>
                      )}
                      {energyTriggers.nutrition <= 4 && (
                        <div>• Optimize meal timing and nutrition to stabilize energy levels</div>
                      )}
                    </div>
                  </div>

                  {/* Energy Schedule Recommendations */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-3">Optimal Daily Schedule</h5>
                    <div className="space-y-2 text-sm text-green-700">
                      {/* High energy recommendations */}
                      {timeSlots
                        .filter(slot => getEnergyLevel(slot.time) >= 7)
                        .slice(0, 2)
                        .map(slot => (
                          <div key={slot.time}>
                            <strong>{slot.time}:</strong> Best time for demanding tasks, important decisions, or challenging workouts
                          </div>
                        ))}
                      
                      {/* Medium energy recommendations */}
                      {timeSlots
                        .filter(slot => getEnergyLevel(slot.time) >= 4 && getEnergyLevel(slot.time) < 7)
                        .slice(0, 2)
                        .map(slot => (
                          <div key={slot.time}>
                            <strong>{slot.time}:</strong> Good for routine tasks, light exercise, or social activities
                          </div>
                        ))}
                      
                      {/* Low energy recommendations */}
                      {timeSlots
                        .filter(slot => getEnergyLevel(slot.time) < 4)
                        .slice(0, 2)
                        .map(slot => (
                          <div key={slot.time}>
                            <strong>{slot.time}:</strong> Rest time - gentle activities, meal prep, or relaxation
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div>
                    <Label className="font-medium">My energy optimization action plan:</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Schedule important tasks during peak energy times',
                        'Plan rest during low energy periods',
                        'Improve sleep quality and consistency',
                        'Optimize meal timing for energy stability',
                        'Add stress management practices',
                        'Track patterns for 1 week to confirm',
                        'Adjust exercise timing to match energy',
                        'Create energy-supportive environment'
                      ].map((action) => (
                        <div key={action} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`action-plan-${action}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`action-plan-${action}`]: checked
                            })}
                          />
                          <Label className="text-sm">{action}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Energy mapping insights and observations:</Label>
                    <Textarea
                      placeholder="What surprised you about your energy patterns? What patterns do you want to change or optimize?"
                      value={responses.energyInsights || ''}
                      onChange={(e) => setResponses({...responses, energyInsights: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, energyMappingPhase: 'baseline'})}
                    variant="outline"
                    className="w-full"
                  >
                    Map Another Day's Energy
                  </Button>
                </div>
              </div>
            )}

            {/* Energy Mapping Tips */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-semibold text-orange-800 mb-2">💡 Energy Mapping Tips</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Map your energy for 3-7 days to identify consistent patterns</li>
                <li>• Note how different foods, activities, and stressors affect your energy</li>
                <li>• Track energy alongside your menstrual cycle if still menstruating</li>
                <li>• Use this data to optimize your schedule and improve productivity</li>
                <li>• Remember that energy patterns can shift with hormonal changes</li>
                <li>• Be patient - finding your new rhythm takes time during perimenopause</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Thought Awareness - Hormonal Thought Awareness Practice
    if (component.id === 'thought-awareness') {
      const awarenessPhase = responses.awarenessPhase || 'assessment';
      const thoughtPattern = responses.thoughtPattern || 'negative-spiral';
      const thoughtIntensity = responses.thoughtIntensity || 5;
      const emotionalImpact = responses.emotionalImpact || 5;
      const thoughtExerciseRounds = responses.thoughtExerciseRounds || 0;

      const thoughtPatterns = [
        {
          id: 'negative-spiral',
          name: 'Negative Thinking Spiral',
          description: 'Cascading negative thoughts that build on each other',
          icon: '🌪️',
          triggers: ['Stress', 'Fatigue', 'Hormonal fluctuations'],
          examples: ['I can\'t handle this', 'Everything is falling apart', 'I\'m failing at everything'],
          techniques: ['Thought stopping', 'Reality checking', 'Pattern interruption']
        },
        {
          id: 'catastrophizing',
          name: 'Catastrophic Thinking',
          description: 'Jumping to worst-case scenarios',
          icon: '🚨',
          triggers: ['Anxiety', 'Sleep deprivation', 'Hormonal surges'],
          examples: ['This headache means something terrible', 'My memory loss is permanent', 'I\'ll never feel normal again'],
          techniques: ['Probability assessment', 'Evidence examination', 'Perspective shifting']
        },
        {
          id: 'all-or-nothing',
          name: 'All-or-Nothing Thinking',
          description: 'Seeing things in black and white extremes',
          icon: '⚫⚪',
          triggers: ['Perfectionism', 'Hormonal imbalance', 'Decision fatigue'],
          examples: ['I\'m either perfect or a failure', 'If I can\'t do it all, why bother', 'This day is completely ruined'],
          techniques: ['Gray area exploration', 'Spectrum thinking', 'Progress acknowledgment']
        },
        {
          id: 'rumination',
          name: 'Obsessive Rumination',
          description: 'Repeatedly cycling through the same worries',
          icon: '🔄',
          triggers: ['Progesterone drops', 'Stress', 'Unresolved concerns'],
          examples: ['What if I said the wrong thing', 'I should have handled that differently', 'Why did that happen'],
          techniques: ['Thought scheduling', 'Worry time', 'Mindful redirection']
        },
        {
          id: 'mind-reading',
          name: 'Mind Reading',
          description: 'Assuming you know what others are thinking',
          icon: '🔮',
          triggers: ['Social anxiety', 'Estrogen fluctuations', 'Self-doubt'],
          examples: ['They think I\'m incompetent', 'Everyone can see I\'m struggling', 'They\'re judging me'],
          techniques: ['Fact vs. assumption', 'Direct communication', 'Self-compassion']
        }
      ];

      const awarenessExercises = [
        {
          id: 'thought-catching',
          name: 'Real-Time Thought Catching',
          duration: '5 min',
          description: 'Identify and capture automatic thoughts as they occur',
          steps: [
            'Set a gentle timer to check in every hour',
            'When the timer goes off, pause and notice your current thoughts',
            'Write down the exact thought without judgment',
            'Rate the emotional intensity (1-10)',
            'Note any physical sensations',
            'Continue with your day mindfully'
          ]
        },
        {
          id: 'evidence-examination',
          name: 'Evidence Examination',
          duration: '8 min',
          description: 'Challenge thoughts by examining evidence for and against',
          steps: [
            'Choose one specific negative thought',
            'List evidence that supports this thought',
            'List evidence that contradicts this thought',
            'Consider alternative explanations',
            'Create a more balanced perspective',
            'Notice how this feels in your body'
          ]
        },
        {
          id: 'perspective-shifting',
          name: 'Perspective Shifting Exercise',
          duration: '6 min',
          description: 'View the situation from different angles',
          steps: [
            'Describe the situation objectively (just facts)',
            'How would your best friend view this situation?',
            'How will this matter in 5 years?',
            'What would you tell someone else in this situation?',
            'What opportunities might this challenge create?',
            'Choose the most helpful perspective'
          ]
        }
      ];

      const getCurrentPattern = () => {
        return thoughtPatterns.find(pattern => pattern.id === thoughtPattern) || thoughtPatterns[0];
      };

      const getIntensityInterpretation = (intensity: number) => {
        if (intensity <= 3) return { level: 'Mild', color: 'text-green-600', message: 'Manageable thought intensity' };
        if (intensity <= 5) return { level: 'Moderate', color: 'text-yellow-600', message: 'Noticeable impact on mood' };
        if (intensity <= 7) return { level: 'Strong', color: 'text-orange-600', message: 'Significantly affecting wellbeing' };
        if (intensity <= 9) return { level: 'Intense', color: 'text-red-600', message: 'Very distressing thoughts' };
        return { level: 'Overwhelming', color: 'text-red-700', message: 'Thoughts feel out of control' };
      };

      const intensityInterpretation = getIntensityInterpretation(thoughtIntensity);

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Hormonal Thought Awareness Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Learn to recognize and reframe thought patterns that intensify during hormonal fluctuations, building mental resilience during perimenopause.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thought-Hormone Connection Science */}
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h5 className="font-semibold text-purple-800 mb-2">How Hormones Affect Your Thoughts</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-700">
                <div>
                  <strong>Estrogen & Serotonin:</strong> Low estrogen reduces serotonin, affecting mood and thought patterns
                </div>
                <div>
                  <strong>Progesterone & GABA:</strong> Declining progesterone reduces calming neurotransmitters
                </div>
                <div>
                  <strong>Cortisol Sensitivity:</strong> Hormonal changes increase stress response and negative thinking
                </div>
                <div>
                  <strong>Neural Pathways:</strong> Repeated negative thoughts create stronger neural patterns during hormonal shifts
                </div>
              </div>
            </div>

            {/* Thought Pattern Assessment */}
            {awarenessPhase === 'assessment' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Thought Pattern Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Let's identify your current thought patterns and their impact:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Overall thought intensity today</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Very Calm</span>
                      <Slider
                        value={[thoughtIntensity]}
                        onValueChange={(value) => setResponses({...responses, thoughtIntensity: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Overwhelming</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{thoughtIntensity}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">How intense are your thoughts right now?</span>
                      <span className={`text-sm font-semibold ${intensityInterpretation.color}`}>
                        {intensityInterpretation.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Emotional impact of thoughts</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">No Impact</span>
                      <Slider
                        value={[emotionalImpact]}
                        onValueChange={(value) => setResponses({...responses, emotionalImpact: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Very Distressing</span>
                      <span className="text-lg font-bold text-purple-600 min-w-[30px]">{emotionalImpact}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">How much do your thoughts affect your emotions?</p>
                  </div>

                  <div>
                    <Label className="font-medium">Recent negative thought patterns (check all that apply):</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Racing thoughts that won\'t stop', 'Worst-case scenario thinking', 'Harsh self-criticism', 'Worry about the future',
                        'Replaying past mistakes', 'Comparing myself to others', 'Feeling like nothing is working', 'Doubting my abilities'
                      ].map((pattern) => (
                        <div key={pattern} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`thought-pattern-${pattern}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`thought-pattern-${pattern}`]: checked
                            })}
                          />
                          <Label className="text-sm">{pattern}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">When do negative thoughts feel strongest?</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Early morning', 'Before my period', 'When I\'m tired', 'During stress',
                        'Late at night', 'When I\'m alone', 'During hot flashes', 'When making decisions'
                      ].map((trigger) => (
                        <div key={trigger} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`thought-trigger-${trigger}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`thought-trigger-${trigger}`]: checked
                            })}
                          />
                          <Label className="text-sm">{trigger}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, awarenessPhase: 'pattern-selection'})}
                    className="w-full"
                  >
                    Identify My Thought Patterns
                  </Button>
                </div>
              </div>
            )}

            {/* Pattern Selection & Education */}
            {awarenessPhase === 'pattern-selection' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Common Hormonal Thought Patterns</h4>
                <p className="text-sm text-gray-600 mb-4">Select the pattern that feels most familiar to you right now:</p>
                
                <div className="space-y-4">
                  {thoughtPatterns.map((pattern) => (
                    <div 
                      key={pattern.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        thoughtPattern === pattern.id 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setResponses({...responses, thoughtPattern: pattern.id})}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{pattern.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              thoughtPattern === pattern.id 
                                ? 'border-purple-500 bg-purple-500' 
                                : 'border-gray-300'
                            }`}>
                              {thoughtPattern === pattern.id && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <h5 className="font-semibold">{pattern.name}</h5>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong className="text-purple-700">Common Triggers:</strong>
                              <span className="text-gray-600"> {pattern.triggers.join(', ')}</span>
                            </div>
                            <div>
                              <strong className="text-purple-700">Examples:</strong>
                              <ul className="text-gray-600 ml-4 mt-1">
                                {pattern.examples.map((example, index) => (
                                  <li key={index} className="list-disc">"{example}"</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-green-700">Helpful Techniques:</strong>
                              <span className="text-gray-600"> {pattern.techniques.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setResponses({...responses, awarenessPhase: 'practice'})}
                  className="w-full mt-6"
                >
                  Practice {getCurrentPattern().name} Awareness
                </Button>
              </div>
            )}

            {/* Awareness Practice */}
            {awarenessPhase === 'practice' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{getCurrentPattern().icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{getCurrentPattern().name} Practice</h4>
                  <p className="text-sm text-gray-600">{getCurrentPattern().description}</p>
                </div>

                <div className="space-y-6">
                  {/* Current Thought Exercise */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Awareness Exercise: Catch It in Action</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Write down a specific thought you're having right now that fits this pattern:</Label>
                        <Textarea
                          placeholder={`Example: "${getCurrentPattern().examples[0]}"`}
                          value={responses.currentThought || ''}
                          onChange={(e) => setResponses({...responses, currentThought: e.target.value})}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="font-medium">What triggered this thought? (What was happening just before?)</Label>
                        <Textarea
                          placeholder="Describe the situation, feeling, or event that led to this thought..."
                          value={responses.thoughtTrigger || ''}
                          onChange={(e) => setResponses({...responses, thoughtTrigger: e.target.value})}
                          className="mt-2"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label className="font-medium">Physical sensations when having this thought:</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            'Tight chest', 'Racing heart', 'Tense shoulders', 'Stomach knots',
                            'Shallow breathing', 'Clenched jaw', 'Restlessness', 'Heavy feeling'
                          ].map((sensation) => (
                            <div key={sensation} className="flex items-center space-x-2">
                              <Checkbox
                                checked={responses[`sensation-${sensation}`] || false}
                                onCheckedChange={(checked) => setResponses({
                                  ...responses,
                                  [`sensation-${sensation}`]: checked
                                })}
                              />
                              <Label className="text-sm">{sensation}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium">How believable does this thought feel right now? (1-10)</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">Not believable</span>
                          <Slider
                            value={[responses.thoughtBelievability || 5]}
                            onValueChange={(value) => setResponses({...responses, thoughtBelievability: value[0]})}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">Completely true</span>
                          <span className="text-lg font-bold text-purple-600 min-w-[30px]">{responses.thoughtBelievability || 5}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reframing Exercise */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Reframing Exercise</h5>
                    
                    <div className="space-y-4">
                      {awarenessExercises.map((exercise, index) => (
                        <div key={exercise.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium">{exercise.name}</h6>
                            <Badge variant="outline">{exercise.duration}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                          
                          <div className="space-y-2">
                            {exercise.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {stepIndex + 1}
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                  <Checkbox
                                    checked={responses[`exercise-${exercise.id}-step-${stepIndex}`] || false}
                                    onCheckedChange={(checked) => setResponses({
                                      ...responses,
                                      [`exercise-${exercise.id}-step-${stepIndex}`]: checked
                                    })}
                                  />
                                  <span className="text-sm">{step}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Thought Creation */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-4">Create Your Balanced Thought</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Rewrite your original thought in a more balanced, realistic way:</Label>
                        <Textarea
                          placeholder="Based on the exercises above, what's a more balanced way to think about this situation?"
                          value={responses.balancedThought || ''}
                          onChange={(e) => setResponses({...responses, balancedThought: e.target.value})}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="font-medium">How believable does this new thought feel? (1-10)</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">Not believable</span>
                          <Slider
                            value={[responses.newThoughtBelievability || 5]}
                            onValueChange={(value) => setResponses({...responses, newThoughtBelievability: value[0]})}
                            max={10}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">Completely true</span>
                          <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.newThoughtBelievability || 5}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Practice Rounds */}
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <Label className="font-medium">Practice Rounds Completed:</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResponses({...responses, thoughtExerciseRounds: Math.max(0, thoughtExerciseRounds - 1)})}
                        >
                          -
                        </Button>
                        <span className="text-2xl font-bold text-purple-600 min-w-[40px] text-center">{thoughtExerciseRounds}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResponses({...responses, thoughtExerciseRounds: thoughtExerciseRounds + 1})}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3].map((round) => (
                        <div key={round} className={`h-10 rounded flex items-center justify-center text-sm font-medium ${
                          round <= thoughtExerciseRounds 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          Round {round}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, awarenessPhase: 'reflection'})}
                    className="w-full"
                    disabled={!responses.balancedThought || thoughtExerciseRounds < 1}
                  >
                    Reflect on Practice Results
                  </Button>
                </div>
              </div>
            )}

            {/* Practice Reflection */}
            {awarenessPhase === 'reflection' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🌟</div>
                  <h4 className="text-xl font-semibold">Thought Awareness Complete!</h4>
                  <p className="text-sm text-gray-600">How has your relationship with your thoughts shifted?</p>
                </div>

                <div className="space-y-6">
                  {/* Before/After Comparison */}
                  {responses.thoughtBelievability && responses.newThoughtBelievability && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Your Thought Transformation</h5>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                            <h6 className="font-medium text-red-800">Original Thought</h6>
                            <p className="text-sm text-red-700 mt-1">"{responses.currentThought}"</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-red-600">Believability:</span>
                              <span className="font-bold text-red-600">{responses.thoughtBelievability}/10</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                            <h6 className="font-medium text-green-800">Balanced Thought</h6>
                            <p className="text-sm text-green-700 mt-1">"{responses.balancedThought}"</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-green-600">Believability:</span>
                              <span className="font-bold text-green-600">{responses.newThoughtBelievability}/10</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <span className={`text-lg font-bold ${
                            responses.newThoughtBelievability > responses.thoughtBelievability 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            Shift: {responses.newThoughtBelievability - responses.thoughtBelievability > 0 ? '+' : ''}{responses.newThoughtBelievability - responses.thoughtBelievability} believability points
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="font-medium">Current emotional state (compare with starting {emotionalImpact}/10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Distressed</span>
                      <Slider
                        value={[responses.postEmotionalState || 5]}
                        onValueChange={(value) => setResponses({...responses, postEmotionalState: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Calm & Clear</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.postEmotionalState || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Key insights from this practice:</Label>
                    <Textarea
                      placeholder="What did you learn about your thought patterns? What surprised you? How might you use this awareness in daily life?"
                      value={responses.awarenessInsights || ''}
                      onChange={(e) => setResponses({...responses, awarenessInsights: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Strategies to remember for next time:</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Notice physical sensations as thought warning signs',
                        'Question the evidence for negative thoughts',
                        'Ask "How would I advise a friend in this situation?"',
                        'Remember that thoughts are not facts',
                        'Practice the balanced thought regularly',
                        'Use these techniques during hormonal fluctuations'
                      ].map((strategy) => (
                        <div key={strategy} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`strategy-${strategy}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`strategy-${strategy}`]: checked
                            })}
                          />
                          <Label className="text-sm">{strategy}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, awarenessPhase: 'assessment'})}
                    variant="outline"
                    className="w-full"
                  >
                    Practice with Different Thought Pattern
                  </Button>
                </div>
              </div>
            )}

            {/* Daily Practice Tips */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Daily Thought Awareness Tips</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Set hourly reminders to check in with your thoughts</li>
                <li>• Keep a thought diary to track patterns over time</li>
                <li>• Practice these techniques especially during hormonal fluctuation periods</li>
                <li>• Remember: thoughts are mental events, not absolute truths</li>
                <li>• Be patient - retraining thought patterns takes consistent practice</li>
                <li>• Combine with other stress management techniques for best results</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Nutrition Planning - Hormone-Supporting Meal Planning
    if (component.id === 'nutrition-planning') {
      const nutritionPhase = responses.nutritionPhase || 'assessment';
      const currentSymptoms = responses.currentSymptoms || [];
      const mealPreferences = responses.mealPreferences || 'balanced';
      const cookingTime = responses.cookingTime || 'moderate';
      const dietaryRestrictions = responses.dietaryRestrictions || [];
      const selectedMealPlan = responses.selectedMealPlan || 'hormone-balance';

      const hormoneSymptoms = [
        {
          id: 'hot-flashes',
          name: 'Hot Flashes & Night Sweats',
          icon: '🔥',
          description: 'Sudden heat episodes and temperature regulation issues',
          supportiveNutrients: ['Phytoestrogens', 'Magnesium', 'Vitamin E', 'Omega-3s'],
          avoidFoods: ['Spicy foods', 'Caffeine', 'Alcohol', 'Sugar spikes'],
          helpfulFoods: ['Flax seeds', 'Soy products', 'Leafy greens', 'Cold-water fish']
        },
        {
          id: 'mood-swings',
          name: 'Mood Swings & Irritability',
          icon: '🎭',
          description: 'Emotional fluctuations and increased sensitivity',
          supportiveNutrients: ['B-Complex', 'Magnesium', 'Tryptophan', 'Complex carbs'],
          avoidFoods: ['Refined sugar', 'Processed foods', 'Excessive caffeine'],
          helpfulFoods: ['Turkey', 'Quinoa', 'Dark chocolate', 'Bananas', 'Oats']
        },
        {
          id: 'sleep-issues',
          name: 'Sleep Disruption & Insomnia',
          icon: '😴',
          description: 'Difficulty falling asleep or staying asleep',
          supportiveNutrients: ['Melatonin precursors', 'Magnesium', 'Calcium', 'Tryptophan'],
          avoidFoods: ['Late caffeine', 'Heavy meals', 'Alcohol before bed'],
          helpfulFoods: ['Cherries', 'Almonds', 'Chamomile tea', 'Turkey', 'Kiwi']
        },
        {
          id: 'weight-gain',
          name: 'Weight Gain & Metabolism',
          icon: '⚖️',
          description: 'Slowed metabolism and difficulty maintaining weight',
          supportiveNutrients: ['Protein', 'Fiber', 'Green tea compounds', 'Chromium'],
          avoidFoods: ['Refined carbs', 'Trans fats', 'High sodium'],
          helpfulFoods: ['Lean protein', 'Green tea', 'Fiber-rich vegetables', 'Berries']
        },
        {
          id: 'brain-fog',
          name: 'Brain Fog & Memory Issues',
          icon: '🧠',
          description: 'Difficulty concentrating and memory lapses',
          supportiveNutrients: ['Omega-3s', 'Antioxidants', 'B-vitamins', 'Choline'],
          avoidFoods: ['High sugar', 'Processed foods', 'Trans fats'],
          helpfulFoods: ['Blueberries', 'Fatty fish', 'Eggs', 'Nuts', 'Avocado']
        },
        {
          id: 'fatigue',
          name: 'Energy Fatigue & Low Stamina',
          icon: '🔋',
          description: 'Persistent tiredness and reduced energy levels',
          supportiveNutrients: ['Iron', 'B-Complex', 'CoQ10', 'Magnesium'],
          avoidFoods: ['Sugar crashes', 'Refined carbs', 'Excess caffeine'],
          helpfulFoods: ['Spinach', 'Lean meats', 'Legumes', 'Dark leafy greens']
        }
      ];

      const mealPlanTypes = [
        {
          id: 'hormone-balance',
          name: 'Hormone Balance Focus',
          icon: '⚖️',
          description: 'Emphasizes phytoestrogens and hormone-regulating nutrients',
          keyFeatures: ['Soy products', 'Flax seeds', 'Cruciferous vegetables', 'Healthy fats'],
          bestFor: ['Hot flashes', 'Mood swings', 'General hormone support'],
          sampleDay: {
            breakfast: 'Flax seed smoothie with berries',
            lunch: 'Quinoa salad with edamame',
            dinner: 'Salmon with broccoli',
            snacks: ['Almonds', 'Greek yogurt with seeds']
          }
        },
        {
          id: 'metabolism-boost',
          name: 'Metabolism Boost',
          icon: '🔥',
          description: 'Supports healthy weight management and metabolic function',
          keyFeatures: ['High protein', 'Green tea', 'Fiber-rich foods', 'Portion control'],
          bestFor: ['Weight gain', 'Slow metabolism', 'Energy fatigue'],
          sampleDay: {
            breakfast: 'Protein-rich egg scramble',
            lunch: 'Grilled chicken salad',
            dinner: 'Lean beef with vegetables',
            snacks: ['Green tea', 'Berries with nuts']
          }
        },
        {
          id: 'brain-support',
          name: 'Brain & Cognitive Support',
          icon: '🧠',
          description: 'Optimizes cognitive function and mental clarity',
          keyFeatures: ['Omega-3 rich foods', 'Antioxidants', 'B-vitamins', 'Low glycemic'],
          bestFor: ['Brain fog', 'Memory issues', 'Concentration problems'],
          sampleDay: {
            breakfast: 'Blueberry walnut oatmeal',
            lunch: 'Sardine avocado toast',
            dinner: 'Herb-crusted cod with quinoa',
            snacks: ['Dark chocolate', 'Mixed nuts']
          }
        },
        {
          id: 'mood-stability',
          name: 'Mood Stability',
          icon: '🌅',
          description: 'Supports emotional balance and stress management',
          keyFeatures: ['Complex carbs', 'Magnesium-rich foods', 'Anti-inflammatory', 'Regular timing'],
          bestFor: ['Mood swings', 'Irritability', 'Stress eating'],
          sampleDay: {
            breakfast: 'Overnight oats with banana',
            lunch: 'Lentil soup with whole grain bread',
            dinner: 'Turkey with sweet potato',
            snacks: ['Dark chocolate', 'Herbal tea']
          }
        }
      ];

      const weeklyMealStructure = {
        monday: { focus: 'Energy Boost', theme: 'Start strong with protein' },
        tuesday: { focus: 'Hormone Support', theme: 'Phytoestrogen-rich foods' },
        wednesday: { focus: 'Brain Power', theme: 'Omega-3 and antioxidants' },
        thursday: { focus: 'Inflammation Control', theme: 'Anti-inflammatory foods' },
        friday: { focus: 'Mood Balance', theme: 'Comfort foods done healthy' },
        saturday: { focus: 'Prep Day', theme: 'Batch cooking and meal prep' },
        sunday: { focus: 'Rest & Restore', theme: 'Easy, nourishing meals' }
      };

      const getCurrentMealPlan = () => {
        return mealPlanTypes.find(plan => plan.id === selectedMealPlan) || mealPlanTypes[0];
      };

      const getSymptomNutrients = () => {
        const selectedSymptoms = hormoneSymptoms.filter(symptom => 
          currentSymptoms.includes(symptom.id)
        );
        const allNutrients = selectedSymptoms.flatMap(symptom => symptom.supportiveNutrients);
        const uniqueNutrients = Array.from(new Set(allNutrients));
        return uniqueNutrients;
      };

      const getAvoidFoods = () => {
        const selectedSymptoms = hormoneSymptoms.filter(symptom => 
          currentSymptoms.includes(symptom.id)
        );
        const allAvoidFoods = selectedSymptoms.flatMap(symptom => symptom.avoidFoods);
        const uniqueAvoidFoods = Array.from(new Set(allAvoidFoods));
        return uniqueAvoidFoods;
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-green-500" />
              Hormone-Supporting Meal Planning
            </CardTitle>
            <p className="text-sm text-gray-600">Create personalized meal plans that support hormonal balance, reduce symptoms, and optimize nutrition during perimenopause.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nutrition Science */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">How Food Supports Hormonal Health</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-700">
                <div>
                  <strong>Phytoestrogens:</strong> Plant compounds that can help balance declining estrogen naturally
                </div>
                <div>
                  <strong>Omega-3 Fatty Acids:</strong> Reduce inflammation and support brain health during transitions
                </div>
                <div>
                  <strong>Magnesium:</strong> Calms the nervous system and supports better sleep quality
                </div>
                <div>
                  <strong>Fiber:</strong> Helps metabolize hormones and supports healthy weight management
                </div>
              </div>
            </div>

            {/* Symptom Assessment */}
            {nutritionPhase === 'assessment' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Hormonal Symptoms Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Select the symptoms you're currently experiencing to get personalized nutrition recommendations:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Which symptoms are you experiencing? (Select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {hormoneSymptoms.map((symptom) => (
                        <div 
                          key={symptom.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            currentSymptoms.includes(symptom.id)
                              ? 'border-green-400 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const newSymptoms = currentSymptoms.includes(symptom.id)
                              ? currentSymptoms.filter(id => id !== symptom.id)
                              : [...currentSymptoms, symptom.id];
                            setResponses({...responses, currentSymptoms: newSymptoms});
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{symptom.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Checkbox
                                  checked={currentSymptoms.includes(symptom.id)}
                                  onChange={() => {}}
                                />
                                <h6 className="font-semibold text-sm">{symptom.name}</h6>
                              </div>
                              <p className="text-xs text-gray-600">{symptom.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">How much time do you typically have for meal preparation?</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[
                        { id: 'minimal', name: 'Minimal (15 min)', icon: '⏱️' },
                        { id: 'moderate', name: 'Moderate (30 min)', icon: '⏰' },
                        { id: 'generous', name: 'Generous (45+ min)', icon: '🕐' }
                      ].map((option) => (
                        <div 
                          key={option.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            cookingTime === option.id
                              ? 'border-green-400 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setResponses({...responses, cookingTime: option.id})}
                        >
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <div className="text-sm font-medium">{option.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Dietary preferences and restrictions:</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free',
                        'Low-carb', 'Mediterranean', 'No restrictions', 'Other'
                      ].map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            checked={dietaryRestrictions.includes(restriction)}
                            onCheckedChange={(checked) => {
                              const newRestrictions = checked
                                ? [...dietaryRestrictions, restriction]
                                : dietaryRestrictions.filter(r => r !== restriction);
                              setResponses({...responses, dietaryRestrictions: newRestrictions});
                            }}
                          />
                          <Label className="text-sm">{restriction}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">What's your main nutrition goal right now?</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Reduce hot flashes and night sweats',
                        'Support stable energy levels',
                        'Improve mood and reduce irritability',
                        'Better sleep quality',
                        'Maintain healthy weight',
                        'Increase mental clarity and focus'
                      ].map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="nutrition-goal"
                            checked={responses.nutritionGoal === goal}
                            onChange={() => setResponses({...responses, nutritionGoal: goal})}
                            className="text-green-600"
                          />
                          <Label className="text-sm">{goal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, nutritionPhase: 'plan-selection'})}
                    className="w-full"
                    disabled={currentSymptoms.length === 0}
                  >
                    Get My Personalized Meal Plan
                  </Button>
                </div>
              </div>
            )}

            {/* Plan Selection */}
            {nutritionPhase === 'plan-selection' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Recommended Meal Plan Types</h4>
                <p className="text-sm text-gray-600 mb-4">Based on your symptoms, here are meal plans designed to support your specific needs:</p>
                
                {/* Personalized Recommendations */}
                {currentSymptoms.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-blue-800 mb-3">Your Personalized Nutrition Priorities</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-blue-700">Focus on these nutrients:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getSymptomNutrients().map((nutrient) => (
                            <Badge key={nutrient} variant="outline" className="text-xs">
                              {nutrient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong className="text-red-700">Consider limiting:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getAvoidFoods().map((food) => (
                            <Badge key={food} variant="destructive" className="text-xs">
                              {food}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {mealPlanTypes.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMealPlan === plan.id 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setResponses({...responses, selectedMealPlan: plan.id})}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{plan.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedMealPlan === plan.id 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300'
                            }`}>
                              {selectedMealPlan === plan.id && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <h5 className="font-semibold">{plan.name}</h5>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                          
                          <div className="space-y-3 text-sm">
                            <div>
                              <strong className="text-green-700">Key Features:</strong>
                              <span className="text-gray-600"> {plan.keyFeatures.join(', ')}</span>
                            </div>
                            <div>
                              <strong className="text-purple-700">Best For:</strong>
                              <span className="text-gray-600"> {plan.bestFor.join(', ')}</span>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded">
                              <h6 className="font-medium mb-2">Sample Day:</h6>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><strong>Breakfast:</strong> {plan.sampleDay.breakfast}</div>
                                <div><strong>Lunch:</strong> {plan.sampleDay.lunch}</div>
                                <div><strong>Dinner:</strong> {plan.sampleDay.dinner}</div>
                                <div><strong>Snacks:</strong> {plan.sampleDay.snacks.join(', ')}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setResponses({...responses, nutritionPhase: 'weekly-plan'})}
                  className="w-full mt-6"
                >
                  Create My 7-Day {getCurrentMealPlan().name} Plan
                </Button>
              </div>
            )}

            {/* Weekly Meal Plan */}
            {nutritionPhase === 'weekly-plan' && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{getCurrentMealPlan().icon}</div>
                  <h4 className="text-xl font-semibold mb-2">Your 7-Day {getCurrentMealPlan().name} Plan</h4>
                  <p className="text-sm text-gray-600">{getCurrentMealPlan().description}</p>
                </div>

                <div className="space-y-6">
                  {/* Weekly Overview */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Weekly Meal Structure</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(weeklyMealStructure).map(([day, details]) => (
                        <div key={day} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-green-700 capitalize">{day}</div>
                          <div className="text-sm font-medium text-gray-800">{details.focus}</div>
                          <div className="text-xs text-gray-600">{details.theme}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Meal Plans */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Detailed Daily Meal Plans</h5>
                    <div className="space-y-4">
                      {Object.entries(weeklyMealStructure).map(([day, details]) => (
                        <div key={day} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium capitalize text-lg">{day}</h6>
                            <Badge variant="outline">{details.focus}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                              <strong className="text-orange-600">Breakfast</strong>
                              <div className="p-2 bg-orange-50 rounded">
                                {getCurrentMealPlan().sampleDay.breakfast}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <strong className="text-blue-600">Lunch</strong>
                              <div className="p-2 bg-blue-50 rounded">
                                {getCurrentMealPlan().sampleDay.lunch}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <strong className="text-purple-600">Dinner</strong>
                              <div className="p-2 bg-purple-50 rounded">
                                {getCurrentMealPlan().sampleDay.dinner}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t">
                            <strong className="text-green-600 text-sm">Snacks & Beverages:</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              {getCurrentMealPlan().sampleDay.snacks.join(' • ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shopping List */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Smart Shopping List</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h6 className="font-medium text-green-700 mb-2">🥬 Vegetables & Fruits</h6>
                        <div className="space-y-1 text-sm">
                          {[
                            'Leafy greens (spinach, kale)',
                            'Broccoli & cauliflower',
                            'Berries (blueberries, strawberries)',
                            'Avocados',
                            'Sweet potatoes'
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                checked={responses[`shopping-${item}`] || false}
                                onCheckedChange={(checked) => setResponses({
                                  ...responses,
                                  [`shopping-${item}`]: checked
                                })}
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-blue-700 mb-2">🐟 Proteins</h6>
                        <div className="space-y-1 text-sm">
                          {[
                            'Wild-caught salmon',
                            'Organic chicken breast',
                            'Eggs (pasture-raised)',
                            'Greek yogurt',
                            'Lentils & beans'
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                checked={responses[`shopping-${item}`] || false}
                                onCheckedChange={(checked) => setResponses({
                                  ...responses,
                                  [`shopping-${item}`]: checked
                                })}
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-purple-700 mb-2">🌾 Grains & Others</h6>
                        <div className="space-y-1 text-sm">
                          {[
                            'Quinoa',
                            'Oats (steel-cut)',
                            'Flax seeds',
                            'Almonds & walnuts',
                            'Olive oil (extra virgin)'
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                checked={responses[`shopping-${item}`] || false}
                                onCheckedChange={(checked) => setResponses({
                                  ...responses,
                                  [`shopping-${item}`]: checked
                                })}
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Prep Tips */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Meal Prep Success Tips</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h6 className="font-medium text-green-700 mb-2">Weekend Prep (2-3 hours)</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Cook grains in bulk (quinoa, brown rice)</li>
                          <li>• Wash and chop vegetables</li>
                          <li>• Prepare protein portions</li>
                          <li>• Make overnight oats</li>
                          <li>• Portion snacks into containers</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-blue-700 mb-2">Daily Quick Assembly</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Mix prepared ingredients</li>
                          <li>• Add fresh herbs and seasonings</li>
                          <li>• Heat and serve</li>
                          <li>• Track how you feel after meals</li>
                          <li>• Adjust portions as needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, nutritionPhase: 'tracking'})}
                    className="w-full"
                  >
                    Start Symptom & Energy Tracking
                  </Button>
                </div>
              </div>
            )}

            {/* Symptom Tracking */}
            {nutritionPhase === 'tracking' && (
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="text-xl font-semibold">Track Your Progress</h4>
                  <p className="text-sm text-gray-600">Monitor how your nutrition changes affect your symptoms</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">How are you feeling after 3 days on this meal plan?</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {currentSymptoms.map((symptomId) => {
                        const symptom = hormoneSymptoms.find(s => s.id === symptomId);
                        if (!symptom) return null;
                        
                        return (
                          <div key={symptom.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{symptom.name}</span>
                              <span className="text-lg">{symptom.icon}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">Much Worse</span>
                              <Slider
                                value={[responses[`symptom-${symptom.id}`] || 5]}
                                onValueChange={(value) => setResponses({
                                  ...responses,
                                  [`symptom-${symptom.id}`]: value[0]
                                })}
                                max={10}
                                min={1}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs text-gray-500">Much Better</span>
                              <span className="text-lg font-bold text-green-600 min-w-[30px]">
                                {responses[`symptom-${symptom.id}`] || 5}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Overall energy level this week:</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Very Low</span>
                      <Slider
                        value={[responses.weeklyEnergyLevel || 5]}
                        onValueChange={(value) => setResponses({...responses, weeklyEnergyLevel: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Excellent</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.weeklyEnergyLevel || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Notes about meals and how they made you feel:</Label>
                    <Textarea
                      placeholder="Which meals gave you the most energy? Any foods that didn't agree with you? How was your sleep after eating this way?"
                      value={responses.mealNotes || ''}
                      onChange={(e) => setResponses({...responses, mealNotes: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Which meals were easiest to prepare and enjoy?</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Breakfast options',
                        'Lunch recipes',
                        'Dinner meals',
                        'Healthy snacks',
                        'Prep-ahead meals',
                        'Quick assembly meals'
                      ].map((meal) => (
                        <div key={meal} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`easy-meal-${meal}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`easy-meal-${meal}`]: checked
                            })}
                          />
                          <Label className="text-sm">{meal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, nutritionPhase: 'assessment'})}
                    variant="outline"
                    className="w-full"
                  >
                    Adjust My Meal Plan
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">🍃 Hormone-Supporting Nutrition Tips</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Eat protein with every meal to stabilize blood sugar</li>
                <li>• Include phytoestrogen-rich foods daily (flax, soy, legumes)</li>
                <li>• Stay hydrated - aim for half your body weight in ounces</li>
                <li>• Time your largest meals earlier in the day</li>
                <li>• Focus on anti-inflammatory foods to reduce symptoms</li>
                <li>• Listen to your body and adjust portions based on hunger</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Evening Wind-Down - Evening Wind-Down Routine Creation
    if (component.id === 'evening-wind-down') {
      const windDownPhase = responses.windDownPhase || 'assessment';
      const sleepChallenges = responses.sleepChallenges || [];
      const bedtimeGoal = responses.bedtimeGoal || '10:00 PM';
      const routineDuration = responses.routineDuration || 60;
      const selectedActivities = responses.selectedActivities || [];
      const currentWindDownTime = responses.currentWindDownTime || 30;

      const sleepChallengeOptions = [
        {
          id: 'falling-asleep',
          name: 'Difficulty Falling Asleep',
          icon: '😴',
          description: 'Takes more than 30 minutes to fall asleep',
          commonCauses: ['Racing thoughts', 'Stress', 'Hormone fluctuations', 'Screen time'],
          solutions: ['Meditation', 'Journaling', 'Reading', 'Progressive relaxation']
        },
        {
          id: 'staying-asleep',
          name: 'Frequent Night Wakings',
          icon: '🌙',
          description: 'Waking up multiple times during the night',
          commonCauses: ['Hot flashes', 'Anxiety', 'Bladder issues', 'Light sensitivity'],
          solutions: ['Cool environment', 'Blackout curtains', 'White noise', 'Herbal tea']
        },
        {
          id: 'early-waking',
          name: 'Early Morning Awakening',
          icon: '🌅',
          description: 'Waking up too early and unable to return to sleep',
          commonCauses: ['Cortisol spikes', 'Depression', 'Age-related changes', 'Light exposure'],
          solutions: ['Sleep mask', 'Relaxation techniques', 'Temperature control', 'Consistent schedule']
        },
        {
          id: 'restless-sleep',
          name: 'Restless or Unrefreshing Sleep',
          icon: '😵‍💫',
          description: 'Feeling tired even after a full night\'s sleep',
          commonCauses: ['Sleep apnea', 'Hormone imbalance', 'Stress', 'Poor sleep hygiene'],
          solutions: ['Exercise earlier', 'Magnesium supplement', 'Sleep study', 'Stress management']
        },
        {
          id: 'racing-thoughts',
          name: 'Racing Thoughts at Bedtime',
          icon: '🧠',
          description: 'Mind won\'t quiet down when trying to sleep',
          commonCauses: ['Anxiety', 'Unfinished tasks', 'Worry', 'Overstimulation'],
          solutions: ['Brain dump journaling', 'Meditation', 'Breathing exercises', 'Worry time']
        },
        {
          id: 'hot-flashes',
          name: 'Night Sweats & Hot Flashes',
          icon: '🔥',
          description: 'Temperature regulation issues disrupting sleep',
          commonCauses: ['Hormone changes', 'Stress', 'Diet', 'Room temperature'],
          solutions: ['Cooling sheets', 'Fan', 'Moisture-wicking sleepwear', 'Temperature control']
        }
      ];

      const windDownActivities = [
        {
          id: 'gentle-stretching',
          name: 'Gentle Stretching',
          icon: '🧘‍♀️',
          duration: '10-15 min',
          category: 'Physical',
          description: 'Light yoga poses and stretches to release physical tension',
          benefits: ['Muscle relaxation', 'Improved circulation', 'Stress relief'],
          instructions: [
            'Child\'s pose for 2 minutes',
            'Gentle spinal twists (1 min each side)',
            'Legs up the wall pose (5 minutes)',
            'Shoulder rolls and neck stretches'
          ]
        },
        {
          id: 'reading',
          name: 'Reading (Physical Book)',
          icon: '📚',
          duration: '15-30 min',
          category: 'Mental',
          description: 'Read fiction or calming non-fiction to quiet the mind',
          benefits: ['Mental escape', 'Eye strain reduction', 'Routine building'],
          instructions: [
            'Choose fiction or light non-fiction',
            'Use warm, dim lighting',
            'Avoid stimulating content',
            'Stop if feeling drowsy'
          ]
        },
        {
          id: 'journaling',
          name: 'Gratitude & Worry Journaling',
          icon: '✍️',
          duration: '10-15 min',
          category: 'Mental',
          description: 'Process the day and clear mental clutter',
          benefits: ['Thought processing', 'Gratitude practice', 'Worry release'],
          instructions: [
            'Write 3 things you\'re grateful for',
            'List any worries or concerns',
            'Set intentions for tomorrow',
            'End with positive affirmation'
          ]
        },
        {
          id: 'herbal-tea',
          name: 'Herbal Tea Ritual',
          icon: '🫖',
          duration: '10-20 min',
          category: 'Sensory',
          description: 'Mindful tea preparation and consumption',
          benefits: ['Hydration', 'Warmth', 'Ritual mindfulness'],
          instructions: [
            'Choose chamomile, passionflower, or valerian',
            'Prepare mindfully - focus on process',
            'Sip slowly and breathe deeply',
            'Finish 1 hour before bed'
          ]
        },
        {
          id: 'meditation',
          name: 'Guided Sleep Meditation',
          icon: '🧘',
          duration: '10-20 min',
          category: 'Mental',
          description: 'Calming meditation focused on sleep preparation',
          benefits: ['Mental quieting', 'Stress reduction', 'Body awareness'],
          instructions: [
            'Find comfortable position in bed',
            'Follow guided body scan',
            'Focus on breath awareness',
            'Allow natural drift toward sleep'
          ]
        },
        {
          id: 'breathing-exercises',
          name: '4-7-8 Breathing',
          icon: '💨',
          duration: '5-10 min',
          category: 'Physical',
          description: 'Structured breathing to activate relaxation response',
          benefits: ['Nervous system calming', 'Quick relaxation', 'Oxygen regulation'],
          instructions: [
            'Inhale for 4 counts',
            'Hold breath for 7 counts',
            'Exhale for 8 counts',
            'Repeat 4-8 cycles'
          ]
        },
        {
          id: 'aromatherapy',
          name: 'Aromatherapy & Essential Oils',
          icon: '🌸',
          duration: '5-15 min',
          category: 'Sensory',
          description: 'Use calming scents to signal bedtime',
          benefits: ['Scent association', 'Stress reduction', 'Atmosphere creation'],
          instructions: [
            'Use lavender, bergamot, or ylang-ylang',
            'Apply to pulse points or diffuse',
            'Practice deep breathing with scent',
            'Create consistent scent routine'
          ]
        },
        {
          id: 'bath-shower',
          name: 'Warm Bath or Shower',
          icon: '🛁',
          duration: '15-25 min',
          category: 'Physical',
          description: 'Temperature therapy for relaxation',
          benefits: ['Muscle relaxation', 'Temperature regulation', 'Transition ritual'],
          instructions: [
            'Keep water warm, not hot',
            'Add Epsom salts or essential oils',
            'Focus on the sensory experience',
            'End 1-2 hours before bed'
          ]
        }
      ];

      const timeSlots = [
        { time: '8:00 PM', label: '8:00 PM - Early start' },
        { time: '8:30 PM', label: '8:30 PM' },
        { time: '9:00 PM', label: '9:00 PM - Common time' },
        { time: '9:30 PM', label: '9:30 PM' },
        { time: '10:00 PM', label: '10:00 PM - Optimal for most' },
        { time: '10:30 PM', label: '10:30 PM' },
        { time: '11:00 PM', label: '11:00 PM - Later bedtime' }
      ];

      const generatePersonalizedRoutine = () => {
        const challengeBasedActivities = sleepChallenges.flatMap(challengeId => {
          const challenge = sleepChallengeOptions.find(c => c.id === challengeId);
          return challenge ? challenge.solutions : [];
        });
        
        const matchingActivities = windDownActivities.filter(activity =>
          challengeBasedActivities.some(solution => 
            activity.name.toLowerCase().includes(solution.toLowerCase()) ||
            activity.description.toLowerCase().includes(solution.toLowerCase())
          )
        );

        return matchingActivities.length > 0 ? matchingActivities : windDownActivities.slice(0, 4);
      };

      const getRoutineTimeline = () => {
        const totalMinutes = routineDuration;
        const bedtime = new Date(`2024-01-01 ${bedtimeGoal}`);
        const startTime = new Date(bedtime.getTime() - totalMinutes * 60000);
        
        return {
          startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bedtime: bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          totalMinutes
        };
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Evening Wind-Down Routine Creation
            </CardTitle>
            <p className="text-sm text-gray-600">Design a personalized evening routine that prepares your body and mind for restorative sleep, addressing your specific sleep challenges.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sleep Science */}
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h5 className="font-semibold text-indigo-800 mb-2">The Science of Evening Wind-Down</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-700">
                <div>
                  <strong>Circadian Rhythm:</strong> Consistent evening routines help regulate your natural sleep-wake cycle
                </div>
                <div>
                  <strong>Cortisol Reduction:</strong> Calming activities lower stress hormones that interfere with sleep
                </div>
                <div>
                  <strong>Melatonin Production:</strong> Reduced light and relaxation activities support natural melatonin release
                </div>
                <div>
                  <strong>Body Temperature:</strong> Gradual cooling signals to your brain that it's time for sleep
                </div>
              </div>
            </div>

            {/* Sleep Challenge Assessment */}
            {windDownPhase === 'assessment' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Sleep Challenge Assessment</h4>
                <p className="text-sm text-gray-600 mb-4">Select all sleep challenges you're currently experiencing to get targeted routine recommendations:</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Current sleep challenges (select all that apply):</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {sleepChallengeOptions.map((challenge) => (
                        <div 
                          key={challenge.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            sleepChallenges.includes(challenge.id)
                              ? 'border-indigo-400 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const newChallenges = sleepChallenges.includes(challenge.id)
                              ? sleepChallenges.filter((id: string) => id !== challenge.id)
                              : [...sleepChallenges, challenge.id];
                            setResponses({...responses, sleepChallenges: newChallenges});
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{challenge.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Checkbox
                                  checked={sleepChallenges.includes(challenge.id)}
                                  onChange={() => {}}
                                />
                                <h6 className="font-semibold text-sm">{challenge.name}</h6>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                              <div className="text-xs">
                                <strong className="text-indigo-600">Common causes:</strong>
                                <span className="text-gray-600"> {challenge.commonCauses.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">What time do you want to be in bed?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((slot) => (
                        <div 
                          key={slot.time}
                          className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            bedtimeGoal === slot.time
                              ? 'border-indigo-400 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setResponses({...responses, bedtimeGoal: slot.time})}
                        >
                          <div className="text-sm font-medium">{slot.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">How much time can you dedicate to your wind-down routine?</Label>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">15 min</span>
                      <Slider
                        value={[routineDuration]}
                        onValueChange={(value) => setResponses({...responses, routineDuration: value[0]})}
                        max={120}
                        min={15}
                        step={15}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">2 hours</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[60px]">{routineDuration} min</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Recommended: 45-90 minutes for optimal benefits</p>
                  </div>

                  <div>
                    <Label className="font-medium">Current wind-down habits (what do you do now?):</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Watch TV', 'Use phone/tablet', 'Scroll social media', 'Work/emails',
                        'Read books', 'Take bath/shower', 'Listen to music', 'Meditate',
                        'Journal', 'Stretch/yoga', 'Drink tea', 'Nothing specific'
                      ].map((habit) => (
                        <div key={habit} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`current-habit-${habit}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`current-habit-${habit}`]: checked
                            })}
                          />
                          <Label className="text-sm">{habit}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, windDownPhase: 'routine-builder'})}
                    className="w-full"
                    disabled={sleepChallenges.length === 0}
                  >
                    Create My Personalized Wind-Down Routine
                  </Button>
                </div>
              </div>
            )}

            {/* Routine Builder */}
            {windDownPhase === 'routine-builder' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Your Personalized Wind-Down Activities</h4>
                
                {/* Timeline Overview */}
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold text-indigo-800 mb-2">Routine Timeline</h5>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-indigo-700">
                      <strong>Start:</strong> {getRoutineTimeline().startTime}
                    </div>
                    <div className="text-indigo-600">
                      <strong>Duration:</strong> {routineDuration} minutes
                    </div>
                    <div className="text-indigo-700">
                      <strong>Bedtime:</strong> {getRoutineTimeline().bedtime}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">Recommended activities based on your sleep challenges:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {generatePersonalizedRoutine().map((activity) => (
                        <div 
                          key={activity.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedActivities.includes(activity.id)
                              ? 'border-indigo-400 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const newActivities = selectedActivities.includes(activity.id)
                              ? selectedActivities.filter((id: string) => id !== activity.id)
                              : [...selectedActivities, activity.id];
                            setResponses({...responses, selectedActivities: newActivities});
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{activity.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selectedActivities.includes(activity.id)}
                                    onChange={() => {}}
                                  />
                                  <h6 className="font-semibold text-sm">{activity.name}</h6>
                                </div>
                                <Badge variant="outline" className="text-xs">{activity.duration}</Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                              
                              <div className="space-y-1 text-xs">
                                <div>
                                  <strong className="text-green-600">Benefits:</strong>
                                  <span className="text-gray-600"> {activity.benefits.join(', ')}</span>
                                </div>
                                
                                {selectedActivities.includes(activity.id) && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded">
                                    <strong className="text-indigo-600">How to do it:</strong>
                                    <ul className="text-gray-600 mt-1 ml-3">
                                      {activity.instructions.map((instruction, index) => (
                                        <li key={index} className="list-disc text-xs">{instruction}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Additional activities to consider:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {windDownActivities
                        .filter(activity => !generatePersonalizedRoutine().find(rec => rec.id === activity.id))
                        .map((activity) => (
                          <div 
                            key={activity.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedActivities.includes(activity.id)
                                ? 'border-indigo-300 bg-indigo-25' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              const newActivities = selectedActivities.includes(activity.id)
                                ? selectedActivities.filter((id: string) => id !== activity.id)
                                : [...selectedActivities, activity.id];
                              setResponses({...responses, selectedActivities: newActivities});
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-lg">{activity.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selectedActivities.includes(activity.id)}
                                    onChange={() => {}}
                                  />
                                  <span className="text-sm font-medium">{activity.name}</span>
                                  <Badge variant="secondary" className="text-xs">{activity.duration}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, windDownPhase: 'schedule'})}
                    className="w-full"
                    disabled={selectedActivities.length === 0}
                  >
                    Create My Evening Schedule
                  </Button>
                </div>
              </div>
            )}

            {/* Schedule Creation */}
            {windDownPhase === 'schedule' && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌙</div>
                  <h4 className="text-xl font-semibold mb-2">Your Personalized Evening Wind-Down Schedule</h4>
                  <p className="text-sm text-gray-600">Optimized for {bedtimeGoal} bedtime with {routineDuration}-minute routine</p>
                </div>

                <div className="space-y-6">
                  {/* Routine Schedule */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Tonight's Schedule</h5>
                    <div className="space-y-3">
                      {selectedActivities.map((activityId, index) => {
                        const activity = windDownActivities.find(a => a.id === activityId);
                        if (!activity) return null;

                        const durationMinutes = parseInt(activity.duration.split('-')[0]) || 15;
                        const totalPreviousMinutes = selectedActivities
                          .slice(0, index)
                          .reduce((total, prevId) => {
                            const prevActivity = windDownActivities.find(a => a.id === prevId);
                            return total + (parseInt(prevActivity?.duration.split('-')[0] || '15'));
                          }, 0);

                        const bedtime = new Date(`2024-01-01 ${bedtimeGoal}`);
                        const activityStartTime = new Date(bedtime.getTime() - (routineDuration - totalPreviousMinutes) * 60000);
                        const activityEndTime = new Date(activityStartTime.getTime() + durationMinutes * 60000);

                        return (
                          <div key={activityId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl">{activity.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h6 className="font-medium">{activity.name}</h6>
                                <span className="text-sm font-medium text-indigo-600">
                                  {activityStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  {activityEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <Checkbox
                              checked={responses[`completed-${activityId}`] || false}
                              onCheckedChange={(checked) => setResponses({
                                ...responses,
                                [`completed-${activityId}`]: checked
                              })}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Environment Setup */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Optimize Your Sleep Environment</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h6 className="font-medium text-indigo-700 mb-2">Lighting</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Dim lights 2 hours before bedtime</li>
                          <li>• Use warm, amber lighting</li>
                          <li>• Avoid blue light from screens</li>
                          <li>• Consider blackout curtains</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-indigo-700 mb-2">Temperature</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Keep room between 60-67°F (15-19°C)</li>
                          <li>• Use breathable bedding</li>
                          <li>• Consider a fan for air circulation</li>
                          <li>• Cooling mattress pad if needed</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-indigo-700 mb-2">Sound</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Use white noise or earplugs</li>
                          <li>• Try nature sounds or soft music</li>
                          <li>• Minimize sudden noises</li>
                          <li>• Consider sound-dampening materials</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-indigo-700 mb-2">Comfort</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Comfortable, supportive mattress</li>
                          <li>• Appropriate pillow height</li>
                          <li>• Clean, fresh bedding</li>
                          <li>• Remove electronic devices</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Digital Sunset */}
                  <div className="bg-white p-6 rounded-lg">
                    <h5 className="font-semibold mb-4">Your "Digital Sunset" Plan</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <strong className="text-orange-700">2 hours before bed</strong>
                          <p className="text-sm text-orange-600">No work emails or stressful content</p>
                        </div>
                        <span className="text-lg">📧❌</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <strong className="text-yellow-700">1 hour before bed</strong>
                          <p className="text-sm text-yellow-600">All screens off (TV, phone, tablet)</p>
                        </div>
                        <span className="text-lg">📱❌</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <strong className="text-green-700">30 minutes before bed</strong>
                          <p className="text-sm text-green-600">In bed with relaxing activities only</p>
                        </div>
                        <span className="text-lg">🛏️✅</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, windDownPhase: 'tracking'})}
                    className="w-full"
                  >
                    Start Tracking My Sleep Quality
                  </Button>
                </div>
              </div>
            )}

            {/* Sleep Quality Tracking */}
            {windDownPhase === 'tracking' && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="text-xl font-semibold">Track Your Sleep Progress</h4>
                  <p className="text-sm text-gray-600">Monitor how your new routine affects your sleep quality</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="font-medium">How well did you sleep last night? (1-10)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Poor</span>
                      <Slider
                        value={[responses.sleepQuality || 5]}
                        onValueChange={(value) => setResponses({...responses, sleepQuality: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Excellent</span>
                      <span className="text-lg font-bold text-indigo-600 min-w-[30px]">{responses.sleepQuality || 5}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">How long did it take you to fall asleep?</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[
                        { value: '0-15 min', label: '0-15 min' },
                        { value: '15-30 min', label: '15-30 min' },
                        { value: '30-60 min', label: '30-60 min' },
                        { value: '60+ min', label: '60+ min' }
                      ].map((option) => (
                        <div 
                          key={option.value}
                          className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            responses.fallAsleepTime === option.value
                              ? 'border-indigo-400 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setResponses({...responses, fallAsleepTime: option.value})}
                        >
                          <div className="text-sm font-medium">{option.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Which parts of your routine were most helpful?</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {selectedActivities.map((activityId) => {
                        const activity = windDownActivities.find(a => a.id === activityId);
                        if (!activity) return null;
                        
                        return (
                          <div key={activityId} className="flex items-center space-x-2">
                            <Checkbox
                              checked={responses[`helpful-${activityId}`] || false}
                              onCheckedChange={(checked) => setResponses({
                                ...responses,
                                [`helpful-${activityId}`]: checked
                              })}
                            />
                            <span className="text-lg">{activity.icon}</span>
                            <Label className="text-sm">{activity.name}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Notes about your sleep experience:</Label>
                    <Textarea
                      placeholder="How did you feel during your wind-down routine? Any challenges or successes? What would you change?"
                      value={responses.sleepNotes || ''}
                      onChange={(e) => setResponses({...responses, sleepNotes: e.target.value})}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Energy level this morning (1-10):</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Exhausted</span>
                      <Slider
                        value={[responses.morningEnergy || 5]}
                        onValueChange={(value) => setResponses({...responses, morningEnergy: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">Energized</span>
                      <span className="text-lg font-bold text-green-600 min-w-[30px]">{responses.morningEnergy || 5}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, windDownPhase: 'assessment'})}
                    variant="outline"
                    className="w-full"
                  >
                    Adjust My Wind-Down Routine
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h5 className="font-semibold text-indigo-800 mb-2">🌙 Evening Wind-Down Success Tips</h5>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Start your routine at the same time each night</li>
                <li>• Dim lights gradually throughout your routine</li>
                <li>• Keep your bedroom cool (60-67°F) for optimal sleep</li>
                <li>• Put away all electronic devices 1 hour before bed</li>
                <li>• If you can't sleep within 20 minutes, get up and do a quiet activity</li>
                <li>• Be patient - it takes 2-3 weeks to establish new sleep habits</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Week 2 - Mirror Work & Affirmations
    if (component.id === 'w2-mirror') {
      const mirrorPhase = responses.mirrorPhase || 'introduction';
      const selectedAffirmationType = responses.selectedAffirmationType || null;
      const personalAffirmations = responses.personalAffirmations || [];
      const mirrorPracticeData = responses.mirrorPracticeData || {};

      const affirmationTypes = [
        {
          id: 'self-worth',
          title: 'Self-Worth & Value',
          description: 'Affirmations that reinforce your inherent worth and value as a person',
          icon: '💎',
          color: 'purple',
          science: 'Research shows self-worth affirmations activate the medial prefrontal cortex, strengthening self-concept',
          examples: [
            'I am worthy of love and respect exactly as I am',
            'My value doesn\'t decrease based on others\' opinions',
            'I deserve good things in my life',
            'I am enough, just as I am right now'
          ]
        },
        {
          id: 'body-acceptance',
          title: 'Body Acceptance & Changes',
          description: 'Loving affirmations for your changing body during midlife transitions',
          icon: '🌸',
          color: 'pink',
          science: 'Body-positive affirmations reduce cortisol and increase body satisfaction scores by 23%',
          examples: [
            'My body is wise and knows how to heal and adapt',
            'I honor my body for all it has carried me through',
            'Each change in my body tells a story of my strength',
            'I treat my body with kindness and compassion'
          ]
        },
        {
          id: 'capability-strength',
          title: 'Capability & Inner Strength',
          description: 'Affirmations that remind you of your competence and resilience',
          icon: '💪',
          color: 'blue',
          science: 'Capability affirmations increase task performance by 15% and reduce anxiety before challenges',
          examples: [
            'I have overcome challenges before and I can do it again',
            'I trust my ability to figure things out',
            'I am capable of learning and growing at any age',
            'My experience and wisdom are valuable assets'
          ]
        },
        {
          id: 'future-possibility',
          title: 'Future & Possibilities',
          description: 'Forward-looking affirmations for embracing new opportunities',
          icon: '🌅',
          color: 'orange',
          science: 'Future-focused affirmations enhance neuroplasticity and goal-directed behavior',
          examples: [
            'Exciting opportunities are coming into my life',
            'I am open to new experiences and adventures',
            'My best chapters are still being written',
            'I create positive change in my life every day'
          ]
        },
        {
          id: 'wisdom-growth',
          title: 'Wisdom & Personal Growth',
          description: 'Affirmations celebrating your accumulated wisdom and ongoing development',
          icon: '🌳',
          color: 'green',
          science: 'Wisdom-based affirmations increase emotional regulation and decision-making confidence',
          examples: [
            'I trust the wisdom I\'ve gained through my experiences',
            'I am constantly evolving and becoming more myself',
            'My perspective and insights matter and have value',
            'I embrace both my strengths and areas for growth'
          ]
        },
        {
          id: 'relationships-connection',
          title: 'Relationships & Connection',
          description: 'Affirmations for healthy relationships and authentic connections',
          icon: '💕',
          color: 'red',
          science: 'Relationship affirmations improve oxytocin production and social bonding behaviors',
          examples: [
            'I attract healthy, supportive relationships into my life',
            'I communicate my needs clearly and kindly',
            'I deserve to be heard and understood',
            'I offer and receive love freely and authentically'
          ]
        }
      ];

      const mirrorTechniques = [
        {
          id: 'gentle-gaze',
          title: 'Gentle Gaze Technique',
          description: 'Start with soft, loving eye contact to build comfort',
          steps: [
            'Look into your eyes with the same gentleness you\'d show a dear friend',
            'Notice any impulse to look away and gently guide your attention back',
            'Soften your facial expression and let your shoulders relax',
            'Take three deep breaths while maintaining gentle eye contact'
          ],
          duration: '2-3 minutes',
          benefits: ['Builds self-compassion', 'Reduces self-criticism', 'Increases emotional safety']
        },
        {
          id: 'appreciation-practice',
          title: 'Appreciation Practice',
          description: 'Focus on aspects of yourself you genuinely appreciate',
          steps: [
            'Look at yourself and find three things you appreciate (eyes, smile, strength)',
            'Speak these appreciations out loud with warmth in your voice',
            'Notice what it feels like to receive genuine appreciation',
            'End with "Thank you for being you"'
          ],
          duration: '3-5 minutes',
          benefits: ['Increases self-acceptance', 'Builds positive self-regard', 'Improves mood']
        },
        {
          id: 'affirmation-practice',
          title: 'Affirmation Speaking Practice',
          description: 'Speak your chosen affirmations while looking into your eyes',
          steps: [
            'Choose 3-5 affirmations that resonate most strongly today',
            'Speak each affirmation slowly and with intention',
            'Notice your emotional response - both resistance and acceptance',
            'Repeat any affirmation that feels particularly challenging until it softens'
          ],
          duration: '5-8 minutes',
          benefits: ['Rewires neural pathways', 'Increases belief in affirmations', 'Builds confidence']
        },
        {
          id: 'conversation-practice',
          title: 'Inner Friend Conversation',
          description: 'Have a supportive conversation with yourself as you would with a best friend',
          steps: [
            'Ask yourself "How are you really doing today?"',
            'Listen with compassion to whatever comes up',
            'Offer yourself encouragement for challenges you\'re facing',
            'End with words of support and love'
          ],
          duration: '5-10 minutes',
          benefits: ['Develops self-compassion', 'Improves emotional awareness', 'Builds inner support system']
        }
      ];

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Mirror Work & Affirmations - Rewiring Self-Talk
            </CardTitle>
            <p className="text-sm text-gray-600">Transform your relationship with yourself through the powerful practice of mirror work and personalized affirmations designed for midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Science Behind Mirror Work */}
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
              <h5 className="font-semibold text-pink-800 mb-2">The Science Behind Mirror Work</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-pink-700">
                <div>
                  <strong>Neural Mirroring:</strong> Looking at yourself activates mirror neurons, enhancing self-awareness
                </div>
                <div>
                  <strong>Vagus Nerve Activation:</strong> Eye contact with yourself stimulates the calming nervous system
                </div>
                <div>
                  <strong>Neuroplasticity:</strong> Repeated positive self-statements create new neural pathways
                </div>
                <div>
                  <strong>Self-Compassion Research:</strong> Mirror work increases self-kindness by 34% in studies
                </div>
              </div>
            </div>

            {/* Introduction Phase */}
            {mirrorPhase === 'introduction' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Understanding Mirror Work Benefits</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[
                      {
                        icon: '🧠',
                        title: 'Rewires Neural Patterns',
                        description: 'Changes automatic self-critical thoughts to supportive ones',
                        color: 'purple'
                      },
                      {
                        icon: '💕',
                        title: 'Builds Self-Compassion',
                        description: 'Develops the same kindness toward yourself as you show others',
                        color: 'pink'
                      },
                      {
                        icon: '🌟',
                        title: 'Increases Confidence',
                        description: 'Strengthens positive self-regard and inner validation',
                        color: 'yellow'
                      },
                      {
                        icon: '🕯️',
                        title: 'Enhances Emotional Safety',
                        description: 'Creates a secure internal relationship with yourself',
                        color: 'blue'
                      }
                    ].map((benefit, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 border-${benefit.color}-400 bg-${benefit.color}-50`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{benefit.icon}</span>
                          <h5 className={`font-semibold text-${benefit.color}-800`}>{benefit.title}</h5>
                        </div>
                        <p className={`text-sm text-${benefit.color}-700`}>{benefit.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">🌸 Perfect for Midlife Women</h5>
                    <p className="text-sm text-gray-700">
                      Mirror work is especially powerful during midlife transitions because it helps you:
                      reconnect with your authentic self, process changes with compassion, and build a loving 
                      relationship with who you're becoming.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={() => setResponses({...responses, mirrorPhase: 'technique-selection'})}
                      className="flex-1"
                    >
                      Choose Your Mirror Technique
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Technique Selection Phase */}
            {mirrorPhase === 'technique-selection' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Choose Your Mirror Work Technique</h4>
                  <p className="text-sm text-gray-600 mb-6">Select the technique that feels most approachable for you today. You can try different techniques as you become more comfortable.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mirrorTechniques.map((technique) => (
                      <div 
                        key={technique.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          responses.selectedMirrorTechnique === technique.id
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                        }`}
                        onClick={() => setResponses({...responses, selectedMirrorTechnique: technique.id})}
                      >
                        <h5 className="font-semibold text-gray-800 mb-2">{technique.title}</h5>
                        <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{technique.duration}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {technique.benefits.map((benefit, index) => (
                              <span key={index} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {responses.selectedMirrorTechnique && (
                    <div className="mt-6 flex gap-3">
                      <Button 
                        onClick={() => setResponses({...responses, mirrorPhase: 'affirmation-selection'})}
                        className="flex-1"
                      >
                        Choose Your Affirmations
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Affirmation Selection Phase */}
            {mirrorPhase === 'affirmation-selection' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Select Your Affirmation Focus Areas</h4>
                  <p className="text-sm text-gray-600 mb-6">Choose 2-3 affirmation types that resonate most with what you need today. Quality over quantity works best.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {affirmationTypes.map((type) => (
                      <div 
                        key={type.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          (responses.selectedAffirmationTypes || []).includes(type.id)
                            ? `border-${type.color}-400 bg-${type.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          const selected = responses.selectedAffirmationTypes || [];
                          const newSelected = selected.includes(type.id)
                            ? selected.filter(id => id !== type.id)
                            : [...selected, type.id];
                          setResponses({...responses, selectedAffirmationTypes: newSelected});
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{type.icon}</span>
                          <h5 className="font-semibold text-gray-800">{type.title}</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        
                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-2">
                          <strong>Research:</strong> {type.science}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Example affirmations:</p>
                          {type.examples.slice(0, 2).map((example, index) => (
                            <p key={index} className="text-xs text-gray-600 italic">• {example}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {(responses.selectedAffirmationTypes || []).length > 0 && (
                    <div className="mt-6 flex gap-3">
                      <Button 
                        onClick={() => setResponses({...responses, mirrorPhase: 'practice'})}
                        className="flex-1"
                      >
                        Start Mirror Practice ({(responses.selectedAffirmationTypes || []).length} {(responses.selectedAffirmationTypes || []).length === 1 ? 'type' : 'types'} selected)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Practice Phase */}
            {mirrorPhase === 'practice' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Mirror Work Practice Session</h4>
                  
                  {/* Selected Technique Guide */}
                  {responses.selectedMirrorTechnique && (
                    <div className="mb-6">
                      {(() => {
                        const technique = mirrorTechniques.find(t => t.id === responses.selectedMirrorTechnique);
                        return (
                          <div className="bg-pink-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-pink-800 mb-2">{technique?.title} Guide</h5>
                            <div className="space-y-2">
                              {technique?.steps.map((step, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-pink-200 text-pink-800 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <p className="text-sm text-pink-700">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Selected Affirmations */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">Your Selected Affirmations</h5>
                    {(responses.selectedAffirmationTypes || []).map((typeId) => {
                      const type = affirmationTypes.find(t => t.id === typeId);
                      return (
                        <div key={typeId} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span>{type?.icon}</span>
                            <h6 className="font-medium text-gray-700">{type?.title}</h6>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {type?.examples.map((affirmation, index) => (
                              <div 
                                key={index}
                                className={`p-3 rounded border-2 cursor-pointer transition-all ${
                                  (responses.selectedAffirmations || []).includes(affirmation)
                                    ? 'border-pink-400 bg-pink-50'
                                    : 'border-gray-200 hover:border-pink-300'
                                }`}
                                onClick={() => {
                                  const selected = responses.selectedAffirmations || [];
                                  const newSelected = selected.includes(affirmation)
                                    ? selected.filter(a => a !== affirmation)
                                    : [...selected, affirmation];
                                  setResponses({...responses, selectedAffirmations: newSelected});
                                }}
                              >
                                <p className="text-sm text-gray-700">{affirmation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Practice Timer */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-gray-800 mb-2">🕯️ Practice Session</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Find a comfortable space with a mirror. Take your time - this is a practice of self-compassion, not performance.
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setResponses({...responses, practiceStarted: !responses.practiceStarted})}
                        variant={responses.practiceStarted ? "secondary" : "default"}
                        size="sm"
                      >
                        {responses.practiceStarted ? 'Pause Practice' : 'Start Practice'}
                      </Button>
                      
                      {responses.practiceStarted && (
                        <span className="text-sm text-gray-600">
                          Practice in progress... take your time
                        </span>
                      )}
                    </div>
                  </div>

                  {responses.practiceStarted && (
                    <div className="space-y-4">
                      <div>
                        <Label>How did the mirror work feel for you today?</Label>
                        <Textarea
                          placeholder="Describe your experience... Was it comfortable? Challenging? What did you notice about your thoughts or feelings?"
                          value={responses.practiceReflection || ''}
                          onChange={(e) => setResponses({...responses, practiceReflection: e.target.value})}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Self-Compassion Level (1-10)</Label>
                        <p className="text-sm text-gray-600 mb-2">How kind and understanding were you toward yourself during this practice?</p>
                        <div className="grid grid-cols-10 gap-1 mb-2">
                          {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                            <div key={num} className="text-center">
                              <button
                                onClick={() => setResponses({...responses, compassionLevel: num})}
                                className={`w-full h-8 rounded text-xs font-medium transition-all ${
                                  num <= (responses.compassionLevel || 0)
                                    ? 'bg-pink-500 text-white' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {num}
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Very Critical</span>
                          <span>Very Compassionate</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setResponses({...responses, mirrorPhase: 'personalization'})}
                          className="flex-1"
                          disabled={!responses.practiceReflection || !responses.compassionLevel}
                        >
                          Create Personal Affirmations
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personalization Phase */}
            {mirrorPhase === 'personalization' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Create Your Personal Affirmations</h4>
                  <p className="text-sm text-gray-600 mb-6">
                    The most powerful affirmations are those that speak directly to your heart. Create 3-5 personal affirmations 
                    that address your specific needs and aspirations.
                  </p>

                  {/* Affirmation Creation Guide */}
                  <div className="bg-purple-50 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-purple-800 mb-2">💜 Creating Effective Affirmations</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-700">
                      <div><strong>Use "I am" statements:</strong> Present tense creates immediate belief</div>
                      <div><strong>Be specific:</strong> Target your exact needs and situations</div>
                      <div><strong>Feel believable:</strong> Should stretch you but not feel impossible</div>
                      <div><strong>Include emotion:</strong> Add feelings of gratitude, love, or excitement</div>
                    </div>
                  </div>

                  {/* Personal Affirmation Builder */}
                  <div className="space-y-4">
                    <div>
                      <Label>What area of your life needs the most support right now?</Label>
                      <Select 
                        value={responses.supportArea || ''} 
                        onValueChange={(value) => setResponses({...responses, supportArea: value})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose the area that feels most important..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self-confidence">Self-confidence and self-worth</SelectItem>
                          <SelectItem value="body-acceptance">Body acceptance and changes</SelectItem>
                          <SelectItem value="relationships">Relationships and connections</SelectItem>
                          <SelectItem value="career-purpose">Career transitions and purpose</SelectItem>
                          <SelectItem value="health-vitality">Health and vitality</SelectItem>
                          <SelectItem value="emotional-balance">Emotional balance and resilience</SelectItem>
                          <SelectItem value="future-excitement">Future possibilities and excitement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {responses.supportArea && (
                      <div>
                        <Label>Create your personal affirmations (3-5 statements)</Label>
                        <p className="text-sm text-gray-600 mb-2">Write affirmations that speak directly to your {responses.supportArea?.replace('-', ' ')} needs:</p>
                        
                        {[0, 1, 2, 3, 4].map((index) => (
                          <div key={index} className="mt-2">
                            <Input
                              placeholder={`Personal affirmation ${index + 1}${index >= 3 ? ' (optional)' : ''}`}
                              value={(responses.personalAffirmationsList || [])[index] || ''}
                              onChange={(e) => {
                                const list = responses.personalAffirmationsList || [];
                                list[index] = e.target.value;
                                setResponses({...responses, personalAffirmationsList: list});
                              }}
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {(responses.personalAffirmationsList || []).filter(a => a?.trim()).length >= 3 && (
                      <div className="space-y-4">
                        <div>
                          <Label>Daily practice commitment</Label>
                          <Select 
                            value={responses.practiceCommitment || ''} 
                            onValueChange={(value) => setResponses({...responses, practiceCommitment: value})}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="How often will you practice mirror work?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily-morning">Daily in the morning (3-5 minutes)</SelectItem>
                              <SelectItem value="daily-evening">Daily in the evening (3-5 minutes)</SelectItem>
                              <SelectItem value="twice-daily">Twice daily - morning and evening</SelectItem>
                              <SelectItem value="every-other-day">Every other day (5-10 minutes)</SelectItem>
                              <SelectItem value="weekly-longer">Weekly longer sessions (10-15 minutes)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setResponses({...responses, mirrorPhase: 'daily-integration'})}
                            className="flex-1"
                            disabled={!responses.practiceCommitment}
                          >
                            Set Up Daily Practice
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Daily Integration Phase */}
            {mirrorPhase === 'daily-integration' && (
              <div className="bg-white border-2 border-pink-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Your Personal Mirror Work Practice Plan</h4>
                
                <div className="space-y-6">
                  {/* Practice Summary */}
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">🌸 Your Practice Summary</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Technique:</strong> {mirrorTechniques.find(t => t.id === responses.selectedMirrorTechnique)?.title}
                      </div>
                      <div>
                        <strong>Frequency:</strong> {responses.practiceCommitment?.replace('-', ' ')}
                      </div>
                      <div>
                        <strong>Focus Areas:</strong> {(responses.selectedAffirmationTypes || []).length} types selected
                      </div>
                      <div>
                        <strong>Personal Affirmations:</strong> {(responses.personalAffirmationsList || []).filter(a => a?.trim()).length} created
                      </div>
                    </div>
                  </div>

                  {/* Personal Affirmations Card */}
                  <div className="bg-white border border-pink-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Your Personal Affirmations</h5>
                    <div className="space-y-2">
                      {(responses.personalAffirmationsList || []).filter(a => a?.trim()).map((affirmation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 bg-pink-200 text-pink-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700 font-medium">{affirmation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice Tips */}
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h5 className="font-semibold text-yellow-800 mb-2">💡 Practice Tips for Success</h5>
                    <div className="space-y-2 text-sm text-yellow-700">
                      <p>• <strong>Start small:</strong> Even 30 seconds of gentle eye contact builds the habit</p>
                      <p>• <strong>Be patient:</strong> Mirror work can feel awkward initially - this is completely normal</p>
                      <p>• <strong>Notice resistance:</strong> When an affirmation feels "fake," it's working on deep patterns</p>
                      <p>• <strong>Track changes:</strong> Notice shifts in your self-talk and confidence over time</p>
                      <p>• <strong>Adjust as needed:</strong> Modify affirmations as you grow and change</p>
                    </div>
                  </div>

                  {/* Integration Reflection */}
                  <div className="space-y-4">
                    <div>
                      <Label>Commitment to yourself</Label>
                      <Textarea
                        placeholder="Write a short commitment statement to yourself about this practice. What do you hope to gain? How will you stay consistent?"
                        value={responses.practiceCommitment || ''}
                        onChange={(e) => setResponses({...responses, practiceCommitmentStatement: e.target.value})}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">🌱 Building Your New Neural Pathways</h5>
                      <p className="text-sm text-green-700">
                        Remember: Every time you speak kindly to yourself in the mirror, you're literally rewiring your brain 
                        for self-compassion. Research shows that neuroplasticity peaks when we combine visual (mirror), 
                        auditory (speaking), and emotional (self-compassion) elements together.
                      </p>
                    </div>

                    <Button 
                      onClick={() => {
                        setResponses({...responses, mirrorWorkCompleted: true});
                        onComplete(component.id, responses);
                      }}
                      className="w-full"
                      disabled={!responses.practiceCommitmentStatement}
                    >
                      Complete Mirror Work & Affirmations Practice
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // Week 2 - Thought Audit Tracker
    if (component.id === 'w2-audit') {
      const auditPhase = responses.auditPhase || 'introduction';
      const currentDay = responses.currentDay || 1;
      const thoughtEntries = responses.thoughtEntries || [];
      const patterns = responses.identifiedPatterns || [];

      const thoughtPatterns = [
        {
          id: 'all-or-nothing',
          name: 'All-or-Nothing Thinking',
          description: 'Seeing things in black and white, with no middle ground',
          examples: [
            'I\'m either perfect or a complete failure',
            'If I can\'t do it perfectly, why bother trying?',
            'Everyone else has it figured out except me'
          ],
          midlifeContext: 'Common during career transitions, body changes, or relationship shifts',
          reframe: 'Life exists in shades of gray. Progress, not perfection, is the goal.',
          icon: '⚖️',
          color: 'red'
        },
        {
          id: 'catastrophizing',
          name: 'Catastrophizing',
          description: 'Expecting the worst possible outcome in any situation',
          examples: [
            'This health symptom must be something serious',
            'If I make a mistake at work, I\'ll be fired',
            'My children will never recover from my parenting mistakes'
          ],
          midlifeContext: 'Amplified by hormone changes affecting anxiety and worry patterns',
          reframe: 'Most feared outcomes don\'t happen. Focus on what\'s likely, not what\'s possible.',
          icon: '🌪️',
          color: 'orange'
        },
        {
          id: 'mind-reading',
          name: 'Mind Reading',
          description: 'Assuming you know what others are thinking without evidence',
          examples: [
            'They think I\'m too old for this job',
            'My partner is disappointed in how I\'ve changed',
            'People are judging my appearance'
          ],
          midlifeContext: 'Self-consciousness about aging and changes amplifies this pattern',
          reframe: 'I can\'t read minds. I\'ll focus on what people actually say and do.',
          icon: '🔮',
          color: 'purple'
        },
        {
          id: 'should-statements',
          name: 'Should Statements',
          description: 'Rigid rules about how you or others "should" behave',
          examples: [
            'I should have accomplished more by this age',
            'I should be handling this transition better',
            'My body should work the way it used to'
          ],
          midlifeContext: 'Especially harsh during life transitions and physical changes',
          reframe: 'Replace "should" with "could" or "would like to" for gentler self-talk.',
          icon: '📏',
          color: 'blue'
        },
        {
          id: 'emotional-reasoning',
          name: 'Emotional Reasoning',
          description: 'Believing that feelings are facts about reality',
          examples: [
            'I feel like a failure, so I must be one',
            'I feel old and invisible, so that\'s how I am',
            'I feel anxious, so something bad will happen'
          ],
          midlifeContext: 'Hormonal fluctuations can intensify emotions, making this pattern stronger',
          reframe: 'Feelings are temporary visitors, not permanent truths about me.',
          icon: '💭',
          color: 'pink'
        },
        {
          id: 'comparison-trap',
          name: 'Comparison Trap',
          description: 'Constantly measuring yourself against others, usually unfavorably',
          examples: [
            'Other women my age look so much better',
            'Everyone else seems to have their life together',
            'I\'m behind where I should be compared to my peers'
          ],
          midlifeContext: 'Social media and societal expectations intensify midlife comparisons',
          reframe: 'My journey is unique. I\'ll compare myself only to who I was yesterday.',
          icon: '🏆',
          color: 'green'
        },
        {
          id: 'time-urgency',
          name: 'Time Urgency',
          description: 'Feeling like it\'s "too late" to change, grow, or pursue dreams',
          examples: [
            'I\'m too old to start something new',
            'I\'ve missed my chance for happiness',
            'There\'s no time left to make meaningful changes'
          ],
          midlifeContext: 'Awareness of aging can create false urgency and limit beliefs',
          reframe: 'I have decades ahead. Every day is a new opportunity to grow and change.',
          icon: '⏰',
          color: 'yellow'
        }
      ];

      const auditQuestions = [
        {
          id: 'trigger',
          question: 'What triggered this thought?',
          placeholder: 'Situation, event, or feeling that started this thought...',
          type: 'textarea'
        },
        {
          id: 'exact-thought',
          question: 'What was the exact thought?',
          placeholder: 'Write the thought exactly as it appeared in your mind...',
          type: 'textarea'
        },
        {
          id: 'emotion',
          question: 'What emotion did this create?',
          placeholder: 'Anger, sadness, anxiety, shame, etc.',
          type: 'text'
        },
        {
          id: 'intensity',
          question: 'How intense was the emotion? (1-10)',
          type: 'scale'
        },
        {
          id: 'pattern',
          question: 'Which thought pattern does this match?',
          type: 'pattern-select'
        },
        {
          id: 'evidence-for',
          question: 'What evidence supports this thought?',
          placeholder: 'Facts and specific examples that support this thought...',
          type: 'textarea'
        },
        {
          id: 'evidence-against',
          question: 'What evidence contradicts this thought?',
          placeholder: 'Facts and examples that challenge this thought...',
          type: 'textarea'
        },
        {
          id: 'balanced-thought',
          question: 'What would be a more balanced thought?',
          placeholder: 'A more realistic, compassionate way to think about this...',
          type: 'textarea'
        },
        {
          id: 'new-emotion',
          question: 'How do you feel with the balanced thought? (1-10)',
          type: 'scale'
        }
      ];

      const weeklyGoals = [
        {
          day: 1,
          focus: 'Awareness Building',
          goal: 'Notice and record 2-3 automatic thoughts without judgment',
          tip: 'Start with thoughts that create mild discomfort - easier to observe'
        },
        {
          day: 2,
          focus: 'Pattern Recognition',
          goal: 'Identify which thought patterns show up most frequently',
          tip: 'Look for your "signature" patterns - we all have 2-3 favorites'
        },
        {
          day: 3,
          focus: 'Evidence Gathering',
          goal: 'Practice examining evidence for and against your thoughts',
          tip: 'Be a detective, not a judge. What would you tell a friend?'
        },
        {
          day: 4,
          focus: 'Balanced Reframing',
          goal: 'Create 2-3 balanced alternative thoughts',
          tip: 'Aim for realistic, not just positive. Balance includes acknowledging challenges'
        },
        {
          day: 5,
          focus: 'Emotional Tracking',
          goal: 'Notice how emotions shift with balanced thinking',
          tip: 'Even small decreases in intensity (8 to 6) represent meaningful progress'
        },
        {
          day: 6,
          focus: 'Self-Compassion Integration',
          goal: 'Practice self-compassion when catching critical thoughts',
          tip: 'Celebrate noticing thoughts rather than criticizing yourself for having them'
        },
        {
          day: 7,
          focus: 'Pattern Interruption',
          goal: 'Catch and redirect 1-2 thoughts in real-time',
          tip: 'Success is in the pause between thought and reaction'
        }
      ];

      const renderThoughtEntry = (entry: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-gray-800">Thought Entry #{index + 1}</h5>
            <Badge variant="outline" className={`${
              entry.pattern ? thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'red' ? 'border-red-200 text-red-700' :
              thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'orange' ? 'border-orange-200 text-orange-700' :
              thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'purple' ? 'border-purple-200 text-purple-700' :
              thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'blue' ? 'border-blue-200 text-blue-700' :
              thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'pink' ? 'border-pink-200 text-pink-700' :
              thoughtPatterns.find(p => p.id === entry.pattern)?.color === 'green' ? 'border-green-200 text-green-700' :
              'border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-700'
            }`}>
              {entry.pattern ? thoughtPatterns.find((p: any) => p.id === entry.pattern)?.name : 'No pattern identified'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Trigger:</strong> {entry.trigger || 'Not specified'}
            </div>
            <div>
              <strong>Emotion:</strong> {entry.emotion || 'Not specified'} ({entry.intensity || 0}/10)
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <strong className="text-sm">Original Thought:</strong>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">
                "{entry.exactThought || 'No thought recorded'}"
              </p>
            </div>
            
            {entry.balancedThought && (
              <div>
                <strong className="text-sm text-green-700">Balanced Thought:</strong>
                <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  "{entry.balancedThought}"
                </p>
              </div>
            )}
          </div>
          
          {entry.intensity && entry.newEmotion && (
            <div className="flex items-center gap-2 text-sm">
              <span>Emotional Intensity:</span>
              <span className="text-red-600 font-medium">{entry.intensity}/10</span>
              <span>→</span>
              <span className="text-green-600 font-medium">{entry.newEmotion}/10</span>
              {entry.newEmotion < entry.intensity && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  -{entry.intensity - entry.newEmotion} point improvement
                </Badge>
              )}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const updated = thoughtEntries.filter((_: any, i: number) => i !== index);
              setResponses({...responses, thoughtEntries: updated});
            }}
            className="text-red-600 hover:text-red-700"
          >
            Remove Entry
          </Button>
        </div>
      );

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Thought Audit Tracker - Transform Your Inner Dialogue
            </CardTitle>
            <p className="text-sm text-gray-600">Systematically identify and replace self-critical thought patterns with balanced, supportive inner dialogue through structured daily tracking.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Science Behind Thought Auditing */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">The Science Behind Thought Auditing</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                <div>
                  <strong>Metacognition:</strong> Thinking about thinking increases self-awareness by 40%
                </div>
                <div>
                  <strong>Pattern Recognition:</strong> Identifying thought patterns is the first step to changing them
                </div>
                <div>
                  <strong>Cognitive Flexibility:</strong> Regular auditing creates multiple perspectives on situations
                </div>
                <div>
                  <strong>Emotional Regulation:</strong> Balanced thoughts reduce emotional reactivity by 25%
                </div>
              </div>
            </div>

            {/* Introduction Phase */}
            {auditPhase === 'introduction' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Understanding Thought Auditing</h4>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">🧠 What is a Thought Audit?</h5>
                      <p className="text-sm text-gray-700">
                        A thought audit is like a financial audit for your mind. Instead of tracking money, 
                        you track your thoughts to see which ones are "profitable" (helpful) and which ones 
                        are "costly" (harmful). This systematic approach helps you become the CEO of your own thinking.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          icon: '🔍',
                          title: 'Identify Patterns',
                          description: 'Recognize your most common unhelpful thought patterns',
                          color: 'blue'
                        },
                        {
                          icon: '⚖️',
                          title: 'Examine Evidence',
                          description: 'Look at facts supporting and contradicting your thoughts',
                          color: 'green'
                        },
                        {
                          icon: '🔄',
                          title: 'Reframe Balanced',
                          description: 'Create realistic, compassionate alternative thoughts',
                          color: 'purple'
                        },
                        {
                          icon: '📈',
                          title: 'Track Progress',
                          description: 'Monitor emotional shifts and pattern changes over time',
                          color: 'orange'
                        }
                      ].map((step, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 border-${step.color}-400 bg-${step.color}-50`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{step.icon}</span>
                            <h5 className={`font-semibold text-${step.color}-800`}>{step.title}</h5>
                          </div>
                          <p className={`text-sm text-${step.color}-700`}>{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
                    <h5 className="font-semibold text-yellow-800 mb-2">🌻 Perfect for Midlife Transitions</h5>
                    <p className="text-sm text-yellow-700">
                      Midlife brings unique thought challenges: "Am I too old?", "Have I wasted time?", 
                      "What if my best years are behind me?" Thought auditing helps you question these 
                      assumptions and build a more supportive inner narrative for this powerful life phase.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setResponses({...responses, auditPhase: 'pattern-learning'})}
                      className="flex-1"
                    >
                      Learn About Thought Patterns
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern Learning Phase */}
            {auditPhase === 'pattern-learning' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Common Thought Patterns in Midlife</h4>
                  <p className="text-sm text-gray-600 mb-6">Learn to recognize these patterns that are especially common during midlife transitions. Click on each pattern to explore it.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {thoughtPatterns.map((pattern) => (
                      <div 
                        key={pattern.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          responses.selectedPattern === pattern.id
                            ? `border-${pattern.color}-400 bg-${pattern.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setResponses({
                          ...responses, 
                          selectedPattern: responses.selectedPattern === pattern.id ? null : pattern.id
                        })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{pattern.icon}</span>
                          <h5 className="font-semibold text-gray-800">{pattern.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                        
                        {responses.selectedPattern === pattern.id && (
                          <div className={`mt-4 space-y-3 p-3 rounded bg-${pattern.color}-25 border border-${pattern.color}-200`}>
                            <div>
                              <h6 className="font-medium text-gray-700 mb-1">Common Examples:</h6>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {pattern.examples.map((example, idx) => (
                                  <li key={idx} className="italic">• "{example}"</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h6 className="font-medium text-gray-700 mb-1">Midlife Context:</h6>
                              <p className="text-sm text-gray-600">{pattern.midlifeContext}</p>
                            </div>
                            
                            <div className={`p-2 rounded bg-${pattern.color}-100`}>
                              <h6 className="font-medium text-gray-700 mb-1">Reframe Strategy:</h6>
                              <p className={`text-sm text-${pattern.color}-700 font-medium`}>{pattern.reframe}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setResponses({...responses, auditPhase: 'introduction'})}
                    >
                      Back to Overview
                    </Button>
                    <Button 
                      onClick={() => setResponses({...responses, auditPhase: 'daily-tracking'})}
                      className="flex-1"
                    >
                      Start 7-Day Tracking Practice
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Tracking Phase */}
            {auditPhase === 'daily-tracking' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">7-Day Thought Tracking Practice</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Day</span>
                      <Select 
                        value={currentDay.toString()} 
                        onValueChange={(value) => setResponses({...responses, currentDay: parseInt(value)})}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7].map(day => (
                            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Daily Goal */}
                  <div className="mb-6">
                    {(() => {
                      const dayGoal = weeklyGoals.find(g => g.day === currentDay);
                      return (
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-800 mb-2">
                            📅 Day {currentDay}: {dayGoal?.focus}
                          </h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Goal:</strong> {dayGoal?.goal}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Tip:</strong> {dayGoal?.tip}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* New Thought Entry Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">Record a New Thought</h5>
                    
                    <div className="space-y-4">
                      {auditQuestions.map((q, index) => (
                        <div key={q.id}>
                          <Label className="text-sm font-medium">{q.question}</Label>
                          
                          {q.type === 'textarea' && (
                            <Textarea
                              placeholder={q.placeholder}
                              value={responses.currentEntry?.[q.id] || ''}
                              onChange={(e) => setResponses({
                                ...responses,
                                currentEntry: {
                                  ...responses.currentEntry,
                                  [q.id]: e.target.value
                                }
                              })}
                              className="mt-1"
                              rows={2}
                            />
                          )}
                          
                          {q.type === 'text' && (
                            <Input
                              placeholder={q.placeholder}
                              value={responses.currentEntry?.[q.id] || ''}
                              onChange={(e) => setResponses({
                                ...responses,
                                currentEntry: {
                                  ...responses.currentEntry,
                                  [q.id]: e.target.value
                                }
                              })}
                              className="mt-1"
                            />
                          )}
                          
                          {q.type === 'scale' && (
                            <div className="mt-2">
                              <div className="grid grid-cols-10 gap-1 mb-2">
                                {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                                  <div key={num} className="text-center">
                                    <button
                                      onClick={() => setResponses({
                                        ...responses,
                                        currentEntry: {
                                          ...responses.currentEntry,
                                          [q.id]: num
                                        }
                                      })}
                                      className={`w-full h-8 rounded text-xs font-medium transition-all ${
                                        num <= (responses.currentEntry?.[q.id] || 0)
                                          ? 'bg-blue-500 text-white' 
                                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                      }`}
                                    >
                                      {num}
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Very Low</span>
                                <span>Very High</span>
                              </div>
                            </div>
                          )}
                          
                          {q.type === 'pattern-select' && (
                            <Select 
                              value={responses.currentEntry?.[q.id] || ''} 
                              onValueChange={(value) => setResponses({
                                ...responses,
                                currentEntry: {
                                  ...responses.currentEntry,
                                  [q.id]: value
                                }
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select the pattern that fits best..." />
                              </SelectTrigger>
                              <SelectContent>
                                {thoughtPatterns.map(pattern => (
                                  <SelectItem key={pattern.id} value={pattern.id}>
                                    {pattern.icon} {pattern.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        onClick={() => {
                          const newEntry = {
                            ...responses.currentEntry,
                            day: currentDay,
                            timestamp: new Date().toISOString()
                          };
                          setResponses({
                            ...responses,
                            thoughtEntries: [...thoughtEntries, newEntry],
                            currentEntry: {}
                          });
                        }}
                        disabled={!responses.currentEntry?.trigger && !responses.currentEntry?.['exact-thought']}
                        className="w-full"
                      >
                        Save Thought Entry
                      </Button>
                    </div>
                  </div>

                  {/* Existing Entries */}
                  {thoughtEntries.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Your Thought Entries ({thoughtEntries.length})</h5>
                      <div className="space-y-4">
                        {thoughtEntries.map((entry: any, index: number) => renderThoughtEntry(entry, index))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setResponses({...responses, auditPhase: 'pattern-learning'})}
                    >
                      Review Patterns
                    </Button>
                    <Button 
                      onClick={() => setResponses({...responses, auditPhase: 'insights'})}
                      className="flex-1"
                      disabled={thoughtEntries.length < 1}
                    >
                      View Insights & Patterns ({thoughtEntries.length}/1 entries minimum)
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Insights Phase */}
            {auditPhase === 'insights' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Your Thought Pattern Insights</h4>
                  
                  {/* Pattern Analysis */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">Most Common Patterns</h5>
                    {(() => {
                      const patternCounts = thoughtEntries.reduce((acc: any, entry: any) => {
                        if (entry.pattern) {
                          acc[entry.pattern] = (acc[entry.pattern] || 0) + 1;
                        }
                        return acc;
                      }, {});
                      
                      const sortedPatterns = Object.entries(patternCounts)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 3);

                      return (
                        <div className="space-y-3">
                          {sortedPatterns.map(([patternId, count], index) => {
                            const pattern = thoughtPatterns.find((p: any) => p.id === patternId);
                            return (
                              <div key={patternId} className={`p-3 rounded-lg border border-${pattern?.color}-200 bg-${pattern?.color}-50`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{pattern?.icon}</span>
                                    <span className="font-medium">{pattern?.name}</span>
                                  </div>
                                  <Badge variant="secondary">{count} times</Badge>
                                </div>
                                <p className={`text-sm text-${pattern?.color}-700 mt-1`}>
                                  <strong>Focus Strategy:</strong> {pattern?.reframe}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Emotional Progress */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">Emotional Intensity Progress</h5>
                    {(() => {
                      const entriesWithBoth = thoughtEntries.filter((e: any) => e.intensity && e.newEmotion);
                      if (entriesWithBoth.length === 0) {
                        return <p className="text-sm text-gray-600">Complete more entries with before/after emotions to see progress.</p>;
                      }
                      
                      const avgImprovement = entriesWithBoth.reduce((sum: number, entry: any) => 
                        sum + (entry.intensity - entry.newEmotion), 0) / entriesWithBoth.length;
                      
                      return (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-600 font-semibold text-lg">📈</span>
                            <span className="font-semibold text-green-800">
                              Average Emotional Improvement: {avgImprovement.toFixed(1)} points
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            You're successfully reducing emotional intensity through balanced thinking! 
                            Even small improvements compound over time.
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Personal Action Plan */}
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Your Personalized Action Plan</h5>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600 font-semibold">1.</span>
                        <p>
                          <strong>Daily Practice:</strong> Continue tracking 1-2 thoughts daily, focusing on your top patterns: {
                            (() => {
                              const patternCounts = thoughtEntries.reduce((acc: any, entry: any) => {
                                if (entry.pattern) {
                                  acc[entry.pattern] = (acc[entry.pattern] || 0) + 1;
                                }
                                return acc;
                              }, {});
                              const topPattern = Object.entries(patternCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
                              return topPattern ? thoughtPatterns.find((p: any) => p.id === topPattern[0])?.name : 'your identified patterns';
                            })()
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600 font-semibold">2.</span>
                        <p>
                          <strong>Quick Check Method:</strong> When you notice strong emotions, ask: "What thought just went through my mind?" Then: "Is this helpful or harmful?"
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600 font-semibold">3.</span>
                        <p>
                          <strong>Weekly Review:</strong> Every Sunday, review your entries to spot patterns and celebrate progress in emotional regulation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setResponses({...responses, auditPhase: 'daily-tracking'})}
                    >
                      Continue Tracking
                    </Button>
                    <Button 
                      onClick={() => {
                        setResponses({...responses, thoughtAuditCompleted: true});
                        onComplete(component.id, responses);
                      }}
                      className="flex-1"
                    >
                      Complete Thought Audit Practice
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // Week 2 - CBT Reframing Techniques (ABCD Model)
    console.log('Checking CBT condition:', component.id, component.id === 'w2-cbt');
    if (component.id === 'w2-cbt') {
      console.log('CBT condition matched! Rendering CBT component');
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
        },
        {
          id: 'mind-reading',
          name: 'Mind Reading',
          description: 'Assuming you know what others are thinking',
          example: '"She thinks I\'m too old and irrelevant"',
          reframe: '"I don\'t actually know what she\'s thinking"',
          keywords: ['thinks', 'believes', 'knows', 'assumes', 'judging']
        },
        {
          id: 'fortune-telling',
          name: 'Fortune Telling',
          description: 'Predicting negative outcomes without evidence',
          example: '"I\'ll never find meaningful work at my age"',
          reframe: '"I can\'t predict the future, and age brings valuable experience"',
          keywords: ['will never', 'going to', 'bound to', 'destined', 'inevitable']
        },
        {
          id: 'personalization',
          name: 'Personalization',
          description: 'Taking responsibility for things outside your control',
          example: '"It\'s my fault my family is stressed"',
          reframe: '"Everyone is responsible for managing their own stress"',
          keywords: ['my fault', 'because of me', 'I caused', 'I should have', 'blame']
        },
        {
          id: 'emotional-reasoning',
          name: 'Emotional Reasoning',
          description: 'Believing feelings are facts',
          example: '"I feel overwhelmed, so I must be failing"',
          reframe: '"Feeling overwhelmed doesn\'t mean I\'m actually failing"',
          keywords: ['feel like', 'must be', 'seems like', 'appears', 'obviously']
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
        },
        {
          id: 'social-gathering',
          title: 'Social Gathering with Younger People',
          situation: 'You\'re at a party where most people are 10-20 years younger than you',
          commonThoughts: [
            'I don\'t belong here',
            'Everyone is looking at me and thinking I\'m old',
            'I have nothing interesting to contribute',
            'I should leave before I embarrass myself'
          ],
          triggerEmotions: ['self-consciousness', 'isolation', 'inadequacy', 'anxiety'],
          physicalSensations: ['blushing', 'tension', 'fidgeting', 'shallow breathing']
        },
        {
          id: 'body-changes',
          title: 'Physical Changes and Energy Levels',
          situation: 'You notice your energy levels aren\'t what they used to be, and your body is changing',
          commonThoughts: [
            'My best years are behind me',
            'I\'m becoming invisible and irrelevant',
            'I\'ll never feel attractive or confident again',
            'Everyone can see that I\'m aging and declining'
          ],
          triggerEmotions: ['sadness', 'grief', 'self-criticism', 'hopelessness'],
          physicalSensations: ['heaviness', 'fatigue', 'slumped posture', 'sighing']
        },
        {
          id: 'family-dynamics',
          title: 'Adult Children Making Independent Decisions',
          situation: 'Your adult child makes a life choice you disagree with or worry about',
          commonThoughts: [
            'I failed as a parent',
            'If I was a better mother, they would make better choices',
            'I should be able to protect them from making mistakes',
            'Their problems are my responsibility'
          ],
          triggerEmotions: ['guilt', 'anxiety', 'helplessness', 'self-blame'],
          physicalSensations: ['tight shoulders', 'headache', 'restlessness', 'clenched jaw']
        },
        {
          id: 'health-concerns',
          title: 'Minor Health Issues and Medical Appointments',
          situation: 'You have a minor health symptom or upcoming medical test',
          commonThoughts: [
            'This is definitely something serious',
            'My body is falling apart',
            'I\'m going to be a burden to my family',
            'This is the beginning of the end'
          ],
          triggerEmotions: ['panic', 'dread', 'overwhelm', 'helplessness'],
          physicalSensations: ['racing heart', 'sweating', 'dizziness', 'nausea']
        },
        {
          id: 'career-transition',
          title: 'Career Changes or Job Search',
          situation: 'You\'re considering a career change or looking for new work in midlife',
          commonThoughts: [
            'No one will hire someone my age',
            'I\'ve wasted too much time to start something new',
            'I should be more established by now',
            'It\'s too late to pursue my dreams'
          ],
          triggerEmotions: ['discouragement', 'regret', 'fear', 'self-doubt'],
          physicalSensations: ['heavy feeling', 'tiredness', 'muscle tension', 'shallow breathing']
        }
      ];

      const getDistortionMatch = (thought) => {
        return thoughtDistortions.find(distortion =>
          distortion.keywords.some(keyword =>
            thought.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      };

      const ABCDAnalyzer = ({ scenario, onComplete }) => {
        const [currentStep, setCurrentStep] = useState('A');
        const [analysis, setAnalysis] = useState({
          A: '', // Activating Event
          B: '', // Beliefs/Thoughts
          C: '', // Consequences (Emotional & Behavioral)
          D: ''  // Disputing/Reframing
        });

        const steps = [
          {
            letter: 'A',
            title: 'Activating Event',
            description: 'The specific situation or trigger that started the emotional response',
            prompt: 'Describe the specific situation that triggered these thoughts and feelings:',
            example: 'At the team meeting, the manager asked everyone to use the new software system',
            tips: [
              'Focus on facts, not interpretations',
              'Be specific about when and where',
              'Avoid adding your thoughts or feelings here',
              'Think of this as what a camera would capture'
            ]
          },
          {
            letter: 'B',
            title: 'Beliefs & Thoughts',
            description: 'The automatic thoughts and beliefs triggered by the situation',
            prompt: 'What thoughts went through your mind? What did you tell yourself?',
            example: '"I\'m too old to learn this. Everyone will think I\'m incompetent."',
            tips: [
              'Write down the exact words in your head',
              'Include both rational and irrational thoughts',
              'Notice any "should" or "must" statements',
              'Look for thoughts that feel automatic'
            ]
          },
          {
            letter: 'C',
            title: 'Consequences',
            description: 'The emotional and behavioral results of your thoughts',
            prompt: 'How did you feel emotionally? What did you do or want to do?',
            example: 'Felt anxious and embarrassed. Avoided speaking up. Considered calling in sick.',
            tips: [
              'Include both emotions and behaviors',
              'Notice physical sensations too',
              'Consider what you avoided doing',
              'Think about long-term consequences'
            ]
          },
          {
            letter: 'D',
            title: 'Disputing & Reframing',
            description: 'Challenge the unhelpful thoughts and create balanced alternatives',
            prompt: 'How can you challenge these thoughts? What\'s a more balanced perspective?',
            example: '"Learning new skills at any age is normal. I have valuable experience to contribute."',
            tips: [
              'Look for evidence for and against the thought',
              'Consider what you\'d tell a friend',
              'Focus on what you can control',
              'Create realistic, balanced statements'
            ]
          }
        ];

        const currentStepData = steps.find(s => s.letter === currentStep);
        const stepIndex = steps.findIndex(s => s.letter === currentStep);
        const isLastStep = stepIndex === steps.length - 1;
        const isFirstStep = stepIndex === 0;

        const getDistortionInsights = () => {
          if (currentStep !== 'B' || !analysis.B) return null;
          
          const matchedDistortions = thoughtDistortions.filter(distortion =>
            distortion.keywords.some(keyword =>
              analysis.B.toLowerCase().includes(keyword.toLowerCase())
            )
          );

          return matchedDistortions.length > 0 ? matchedDistortions : null;
        };

        const getReframingPrompts = () => {
          if (currentStep !== 'D') return [];
          
          return [
            'What evidence supports this thought? What evidence contradicts it?',
            'What would I tell a close friend who had this thought?',
            'How might I view this situation in 5 years?',
            'What aspects of this situation can I actually control?',
            'What\'s the most realistic, balanced way to view this?',
            'How can I focus on my strengths and capabilities?'
          ];
        };

        return (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">ABCD Analysis: {scenario.title}</h4>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Situation:</strong> {scenario.situation}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.letter} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    currentStep === step.letter ? 'bg-blue-500' : 
                    stepIndex > index ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {step.letter}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      stepIndex > index ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step */}
            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-semibold text-blue-700 mb-2">
                  {currentStepData.letter}. {currentStepData.title}
                </h5>
                <p className="text-gray-600 mb-4">{currentStepData.description}</p>
              </div>

              <div>
                <Label className="font-medium text-gray-700">{currentStepData.prompt}</Label>
                <Textarea
                  value={analysis[currentStep]}
                  onChange={(e) => setAnalysis({...analysis, [currentStep]: e.target.value})}
                  placeholder={`Example: ${currentStepData.example}`}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Step-specific content */}
              {currentStep === 'B' && getDistortionInsights() && (
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <h6 className="font-semibold text-orange-800 mb-2">🔍 Thought Pattern Detected</h6>
                  {getDistortionInsights().map((distortion) => (
                    <div key={distortion.id} className="mb-3">
                      <div className="font-medium text-orange-700">{distortion.name}</div>
                      <div className="text-sm text-orange-600">{distortion.description}</div>
                      <div className="text-sm text-orange-600 mt-1">
                        <strong>Reframe:</strong> {distortion.reframe}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 'D' && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h6 className="font-semibold text-green-800 mb-3">💭 Reframing Questions</h6>
                  <div className="space-y-2">
                    {getReframingPrompts().map((prompt, index) => (
                      <div key={index} className="text-sm text-green-700">
                        <strong>•</strong> {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="font-medium text-gray-700 mb-2">💡 Tips for Step {currentStep}</h6>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevIndex = Math.max(0, stepIndex - 1);
                    setCurrentStep(steps[prevIndex].letter);
                  }}
                  disabled={isFirstStep}
                >
                  Previous
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={() => onComplete(analysis)}
                    disabled={!analysis.D.trim()}
                  >
                    Complete Analysis
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const nextIndex = Math.min(steps.length - 1, stepIndex + 1);
                      setCurrentStep(steps[nextIndex].letter);
                    }}
                    disabled={!analysis[currentStep].trim()}
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              CBT Reframing Techniques - The ABCD Model
            </CardTitle>
            <p className="text-sm text-gray-600">Learn to identify and challenge unhelpful thought patterns using Cognitive Behavioral Therapy techniques specifically designed for midlife transitions.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CBT Science */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">The Science Behind CBT</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                <div>
                  <strong>Thought-Feeling Connection:</strong> Your thoughts directly influence your emotions and behaviors
                </div>
                <div>
                  <strong>Neuroplasticity:</strong> You can rewire your brain to think more helpfully at any age
                </div>
                <div>
                  <strong>Automatic Thoughts:</strong> Most negative thoughts happen without conscious awareness
                </div>
                <div>
                  <strong>Evidence-Based:</strong> CBT is proven effective for anxiety, depression, and life transitions
                </div>
              </div>
            </div>

            {/* Introduction Phase */}
            {cbtPhase === 'introduction' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Understanding the ABCD Model</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        letter: 'A',
                        title: 'Activating Event',
                        description: 'The situation or trigger that starts the cycle',
                        icon: '⚡',
                        color: 'red',
                        example: 'Your boss mentions "updating skills"'
                      },
                      {
                        letter: 'B',
                        title: 'Beliefs & Thoughts',
                        description: 'What you tell yourself about the situation',
                        icon: '💭',
                        color: 'orange',
                        example: '"I\'m too old to learn new things"'
                      },
                      {
                        letter: 'C',
                        title: 'Consequences',
                        description: 'Your emotional and behavioral responses',
                        icon: '😟',
                        color: 'yellow',
                        example: 'Feel anxious, avoid training opportunities'
                      },
                      {
                        letter: 'D',
                        title: 'Disputing & Reframing',
                        description: 'Challenge unhelpful thoughts with evidence',
                        icon: '🔍',
                        color: 'green',
                        example: '"I have successfully learned many things throughout my life"'
                      }
                    ].map((step) => (
                      <div key={step.letter} className={`p-4 rounded-lg border-2 border-${step.color}-200 bg-${step.color}-50`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{step.icon}</div>
                          <div>
                            <h6 className="font-semibold">{step.letter}. {step.title}</h6>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        <div className="text-sm bg-white p-2 rounded border-l-4 border-gray-300">
                          <strong>Example:</strong> {step.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h6 className="font-semibold text-blue-800 mb-2">Why ABCD Works for Midlife Women</h6>
                    <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>• Addresses age-related thought patterns</div>
                      <div>• Builds on life experience and wisdom</div>
                      <div>• Tackles perfectionism and self-criticism</div>
                      <div>• Supports confidence during transitions</div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, cbtPhase: 'scenario-selection'})}
                    className="w-full mt-6"
                  >
                    Start Practicing the ABCD Model
                  </Button>
                </div>

                {/* Common Thought Distortions */}
                <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Common Thought Patterns in Midlife</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {thoughtDistortions.map((distortion) => (
                      <div key={distortion.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h6 className="font-semibold text-orange-800 mb-2">{distortion.name}</h6>
                        <p className="text-sm text-orange-700 mb-2">{distortion.description}</p>
                        <div className="text-xs space-y-1">
                          <div className="bg-white p-2 rounded border-l-4 border-red-300">
                            <strong className="text-red-600">Thought:</strong> {distortion.example}
                          </div>
                          <div className="bg-white p-2 rounded border-l-4 border-green-300">
                            <strong className="text-green-600">Reframe:</strong> {distortion.reframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scenario Selection */}
            {cbtPhase === 'scenario-selection' && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Choose a Scenario to Practice</h4>
                <p className="text-sm text-gray-600 mb-4">Select a situation that resonates with you to practice the ABCD model:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarioLibrary.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedScenario === scenario.id
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setResponses({...responses, selectedScenario: scenario.id})}
                    >
                      <h6 className="font-semibold mb-2">{scenario.title}</h6>
                      <p className="text-sm text-gray-600 mb-3">{scenario.situation}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-red-600">Common Thoughts:</strong>
                          <div className="text-gray-600 ml-2">
                            {scenario.commonThoughts[0]}
                          </div>
                        </div>
                        <div>
                          <strong className="text-orange-600">Emotions:</strong>
                          <span className="text-gray-600 ml-2">
                            {scenario.triggerEmotions.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => setResponses({...responses, cbtPhase: 'practice'})}
                    disabled={!selectedScenario}
                    className="flex-1"
                  >
                    Practice with Selected Scenario
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setResponses({...responses, cbtPhase: 'custom-scenario'})}
                  >
                    Use My Own Situation
                  </Button>
                </div>
              </div>
            )}

            {/* Custom Scenario */}
            {cbtPhase === 'custom-scenario' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Create Your Own Scenario</h4>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Describe a recent situation that triggered difficult thoughts or emotions:</Label>
                    <Textarea
                      value={responses.customSituation || ''}
                      onChange={(e) => setResponses({...responses, customSituation: e.target.value})}
                      placeholder="Example: Last week at work, my younger colleague was promoted to a position I had been hoping for..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label className="font-medium">What thoughts went through your mind?</Label>
                    <Textarea
                      value={responses.customThoughts || ''}
                      onChange={(e) => setResponses({...responses, customThoughts: e.target.value})}
                      placeholder="Example: I'm too old for advancement. They probably think I'm outdated. I should just accept being overlooked..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="font-medium">How did you feel? What did you do?</Label>
                    <Textarea
                      value={responses.customConsequences || ''}
                      onChange={(e) => setResponses({...responses, customConsequences: e.target.value})}
                      placeholder="Example: Felt disappointed and discouraged. Avoided my colleague. Considered looking for other jobs..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setResponses({...responses, cbtPhase: 'custom-practice'})}
                      disabled={!responses.customSituation || !responses.customThoughts}
                      className="flex-1"
                    >
                      Practice ABCD with My Situation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setResponses({...responses, cbtPhase: 'scenario-selection'})}
                    >
                      Back to Scenarios
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ABCD Practice with Selected Scenario */}
            {cbtPhase === 'practice' && selectedScenario && (
              <ABCDAnalyzer 
                scenario={scenarioLibrary.find(s => s.id === selectedScenario)}
                onComplete={(analysis) => {
                  setResponses({
                    ...responses, 
                    abcdData: analysis,
                    cbtPhase: 'results'
                  });
                }}
              />
            )}

            {/* ABCD Practice with Custom Scenario */}
            {cbtPhase === 'custom-practice' && (
              <ABCDAnalyzer 
                scenario={{
                  title: 'Your Personal Situation',
                  situation: responses.customSituation || 'Your described situation'
                }}
                onComplete={(analysis) => {
                  setResponses({
                    ...responses, 
                    abcdData: analysis,
                    cbtPhase: 'results'
                  });
                }}
              />
            )}

            {/* Results and Insights */}
            {cbtPhase === 'results' && abcdData.D && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🎯</div>
                    <h4 className="text-xl font-semibold mb-2">Your ABCD Analysis Complete!</h4>
                    <p className="text-sm text-gray-600">You've successfully practiced cognitive reframing</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { letter: 'A', title: 'Activating Event', content: abcdData.A, color: 'red' },
                      { letter: 'B', title: 'Beliefs & Thoughts', content: abcdData.B, color: 'orange' },
                      { letter: 'C', title: 'Consequences', content: abcdData.C, color: 'yellow' },
                      { letter: 'D', title: 'Disputing & Reframing', content: abcdData.D, color: 'green' }
                    ].map((step) => (
                      <div key={step.letter} className="bg-white p-4 rounded-lg border-l-4 border-gray-300">
                        <h6 className="font-semibold text-gray-700 mb-2">{step.letter}. {step.title}</h6>
                        <p className="text-sm text-gray-600">{step.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h6 className="font-semibold text-green-700 mb-2">🌟 Your Reframing Achievement</h6>
                    <p className="text-sm text-gray-600 mb-3">
                      You've successfully transformed an unhelpful thought pattern into a more balanced perspective. 
                      This is a powerful skill that gets stronger with practice.
                    </p>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <strong className="text-green-800">Remember:</strong>
                      <span className="text-green-700"> The goal isn't to think positively all the time, but to think more realistically and helpfully.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                  <h5 className="font-semibold mb-4">Continue Practicing</h5>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setResponses({
                        ...responses, 
                        cbtPhase: 'scenario-selection',
                        selectedScenario: null,
                        abcdData: {}
                      })}
                      className="w-full"
                      variant="outline"
                    >
                      Practice with Another Scenario
                    </Button>
                    <Button 
                      onClick={() => setResponses({
                        ...responses, 
                        cbtPhase: 'daily-practice'
                      })}
                      className="w-full"
                    >
                      Set Up Daily Thought Tracking
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Practice Setup */}
            {cbtPhase === 'daily-practice' && (
              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Daily Thought Tracking Practice</h4>
                <p className="text-sm text-gray-600 mb-4">Set up a simple daily practice to strengthen your reframing skills:</p>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h6 className="font-semibold text-purple-800 mb-2">📝 Your 5-Minute Daily Practice</h6>
                    <div className="text-sm text-purple-700 space-y-2">
                      <div><strong>When:</strong> Choose a consistent time (morning coffee, before bed, etc.)</div>
                      <div><strong>What:</strong> Notice one unhelpful thought from your day</div>
                      <div><strong>How:</strong> Use the ABCD model to reframe it</div>
                      <div><strong>Track:</strong> Rate your mood before and after (1-10)</div>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">When will you practice daily thought tracking?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        'Morning with coffee',
                        'Lunch break',
                        'After work',
                        'Before bed'
                      ].map((time) => (
                        <div 
                          key={time}
                          className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                            responses.practiceTime === time
                              ? 'border-purple-400 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setResponses({...responses, practiceTime: time})}
                        >
                          <div className="text-sm font-medium">{time}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">How will you remind yourself to practice?</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Phone alarm/notification',
                        'Journal next to bed',
                        'Sticky note on mirror',
                        'Calendar reminder',
                        'Link to existing habit'
                      ].map((reminder) => (
                        <div key={reminder} className="flex items-center space-x-2">
                          <Checkbox
                            checked={responses[`reminder-${reminder}`] || false}
                            onCheckedChange={(checked) => setResponses({
                              ...responses,
                              [`reminder-${reminder}`]: checked
                            })}
                          />
                          <Label className="text-sm">{reminder}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setResponses({...responses, cbtPhase: 'introduction'})}
                    className="w-full"
                    disabled={!responses.practiceTime}
                  >
                    Complete CBT Reframing Setup
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">🔧 Quick ABCD Reference</h5>
              <div className="text-sm text-blue-700 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div><strong>A:</strong> What happened?</div>
                <div><strong>B:</strong> What did I think?</div>
                <div><strong>C:</strong> How did I feel/act?</div>
                <div><strong>D:</strong> What's more balanced?</div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Hormone Exercise - Morning Sunlight
    if (component.id === 'hormone-exercise') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              Morning Sunlight Ritual
            </CardTitle>
            <p className="text-sm text-gray-600">Establish morning light exposure for hormone balance.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Design Your Morning Sunlight Practice</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>What time do you typically wake up?</Label>
                  <Input
                    placeholder="e.g., 6:30 AM"
                    value={responses.wakeTime || ''}
                    onChange={(e) => setResponses({...responses, wakeTime: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Preferred sunlight location:</Label>
                  <RadioGroup
                    value={responses.sunlightLocation || ''}
                    onValueChange={(value) => setResponses({...responses, sunlightLocation: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="backyard" />
                      <Label>Backyard/Garden</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balcony" />
                      <Label>Balcony/Patio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="window" />
                      <Label>By a window</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="walk" />
                      <Label>Morning walk</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>How many minutes can you commit to daily?</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[responses.sunlightMinutes || 10]}
                      onValueChange={(value) => setResponses({...responses, sunlightMinutes: value[0]})}
                      max={30}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <span className="font-medium text-lg w-12">{responses.sunlightMinutes || 10} min</span>
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-2 mt-4">
                  <div className="text-center text-sm font-medium">Week 1</div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600">{day}</div>
                  ))}
                  
                  <div className="text-center text-sm">✓</div>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="flex justify-center">
                      <Checkbox
                        checked={responses[`sunlight-day-${day}`] || false}
                        onCheckedChange={(checked) => setResponses({...responses, [`sunlight-day-${day}`]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Sleep Optimization - Evening Wind-Down
    if (component.id === 'sleep-optimization') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Evening Wind-Down Routine
            </CardTitle>
            <p className="text-sm text-gray-600">Create a personalized evening ritual for better sleep.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Build Your Wind-Down Routine</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>What time do you want to start winding down?</Label>
                  <RadioGroup
                    value={responses.windDownStart || ''}
                    onValueChange={(value) => setResponses({...responses, windDownStart: value})}
                    className="mt-2 grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="8pm" />
                      <Label>8:00 PM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="9pm" />
                      <Label>9:00 PM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10pm" />
                      <Label>10:00 PM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="11pm" />
                      <Label>11:00 PM</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Select activities for your routine:</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      'Warm bath', 'Herbal tea', 'Gentle stretching', 'Reading', 
                      'Meditation', 'Journaling', 'Essential oils', 'Soft music'
                    ].map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          checked={responses[`evening-${activity}`] || false}
                          onCheckedChange={(checked) => setResponses({
                            ...responses,
                            [`evening-${activity}`]: checked
                          })}
                        />
                        <Label className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Sleep quality tracker (1-10):</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[responses.sleepQuality || 5]}
                      onValueChange={(value) => setResponses({...responses, sleepQuality: value[0]})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="font-medium text-lg w-8">{responses.sleepQuality || 5}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Energy Management - Energy Mapping
    if (component.id === 'energy-management') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Energy Mapping Tool
            </CardTitle>
            <p className="text-sm text-gray-600">Track your energy patterns to optimize your schedule.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Today's Energy Levels</h4>
              
              <div className="space-y-4">
                {[
                  { time: '6-9 AM', label: 'Early Morning' },
                  { time: '9 AM-12 PM', label: 'Mid Morning' },
                  { time: '12-3 PM', label: 'Afternoon' },
                  { time: '3-6 PM', label: 'Late Afternoon' },
                  { time: '6-9 PM', label: 'Evening' },
                  { time: '9 PM+', label: 'Night' }
                ].map((period) => (
                  <div key={period.time} className="space-y-2">
                    <Label>{period.label} ({period.time})</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[responses[`energy-${period.time}`] || 5]}
                        onValueChange={(value) => setResponses({...responses, [`energy-${period.time}`]: value[0]})}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-medium text-lg w-8">{responses[`energy-${period.time}`] || 5}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <Label>What activities drain your energy most?</Label>
                  <Textarea
                    placeholder="e.g., meetings, household chores, decision-making..."
                    value={responses.energyDrains || ''}
                    onChange={(e) => setResponses({...responses, energyDrains: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>What activities boost your energy?</Label>
                  <Textarea
                    placeholder="e.g., nature walks, creative time, connection with friends..."
                    value={responses.energyBoosts || ''}
                    onChange={(e) => setResponses({...responses, energyBoosts: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Thought Patterns - Thought Awareness
    if (component.id === 'thought-patterns') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Thought Awareness Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Identify and reframe unhelpful thought patterns with compassion.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Common Midlife Thought Patterns</h4>
              
              <div className="space-y-4">
                {[
                  { thought: "I'm too old to change", reframe: "I have wisdom and experience to guide my growth" },
                  { thought: "My best years are behind me", reframe: "Each phase of life offers unique gifts and opportunities" },
                  { thought: "I should have figured this out by now", reframe: "Learning and growth are lifelong processes" },
                  { thought: "My body is betraying me", reframe: "My body is transitioning and deserves compassion" }
                ].map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="text-sm text-red-600 font-medium">
                      Limiting Thought: "{item.thought}"
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Compassionate Reframe: "{item.reframe}"
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={responses[`thought-${index}`] || false}
                        onCheckedChange={(checked) => setResponses({...responses, [`thought-${index}`]: checked})}
                      />
                      <Label className="text-xs text-gray-500">I recognize this pattern</Label>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <Label>Write down a limiting thought you had today:</Label>
                  <Textarea
                    placeholder="What negative thought kept coming up?"
                    value={responses.limitingThought || ''}
                    onChange={(e) => setResponses({...responses, limitingThought: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Rewrite it with compassion:</Label>
                  <Textarea
                    placeholder="How would you speak to a dear friend in this situation?"
                    value={responses.compassionateReframe || ''}
                    onChange={(e) => setResponses({...responses, compassionateReframe: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Default fallback for other components
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Practice</CardTitle>
          <p className="text-sm text-gray-600">This component will have specific interactive content based on its focus area.</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Component-specific content for {component.title} coming soon...</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-coral-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Coaching
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{component.title}</h1>
              <p className="text-gray-600 mt-1">{component.description}</p>
            </div>
            {component.duration && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                <Clock className="w-4 h-4 mr-1" />
                {component.duration} min
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        {detailedContent && (
          <div className="space-y-6">
            {detailedContent.type === 'video-script' && renderVideoScript(detailedContent.content)}
            {detailedContent.type === 'audio-script' && renderAudioScript(detailedContent.content)}
          </div>
        )}

        {/* Component-specific interactive content for Week 1 and Week 2 */}
        {(moduleId === 'week-1' || moduleId === 'week-2') && (
          <div className="mt-8">
            {renderComponentSpecificContent()}
          </div>
        )}

        {/* Completion Section */}
        <div className="mt-8 p-6 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to complete this session?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your progress will be saved and you can always return to review your responses.
              </p>
            </div>
            <Button 
              onClick={handleComplete}
              disabled={isCompleted}
              className="min-w-[120px]"
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}