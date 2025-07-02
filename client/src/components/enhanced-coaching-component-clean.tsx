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