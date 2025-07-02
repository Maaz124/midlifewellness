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
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Activity,
  Sun,
  Moon,
  Brain,
  Heart,
  Zap
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

        {/* Component-specific interactive content for Week 1 */}
        {moduleId === 'week-1' && (
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