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

  const renderComponentSpecificContent = () => {
    // Hormone Video - Symptom Tracker
    if (component.id === 'hormone-video') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              Hormonal Symptom Tracker
            </CardTitle>
            <p className="text-sm text-gray-600">Track your daily symptoms to identify patterns.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Today's Symptoms</h4>
              <div className="space-y-4">
                {[
                  { category: 'Physical', symptoms: ['Hot flashes', 'Night sweats', 'Fatigue', 'Joint aches'], color: 'bg-red-100 text-red-800' },
                  { category: 'Emotional', symptoms: ['Mood swings', 'Irritability', 'Anxiety', 'Overwhelm'], color: 'bg-orange-100 text-orange-800' },
                  { category: 'Cognitive', symptoms: ['Brain fog', 'Memory issues', 'Concentration problems'], color: 'bg-yellow-100 text-yellow-800' }
                ].map((group) => (
                  <div key={group.category} className="space-y-2">
                    <Label className="font-medium">{group.category} Symptoms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {group.symptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{symptom}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => setResponses({...responses, [symptom]: level})}
                                className={`w-6 h-6 rounded-full text-xs font-medium ${
                                  responses[symptom] === level 
                                    ? group.color 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          </CardContent>
        </Card>
      );
    }

    // Headspace Video - Brain Fog Clearing
    if (component.id === 'headspace-video') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Brain Fog Clearing Practice
            </CardTitle>
            <p className="text-sm text-gray-600">Mental clarity techniques for your changing brain.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">3-Minute Mental Clear Exercise</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={responses.mentalClearStep1 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep1: checked})}
                  />
                  <span className="text-sm">Set a timer for 3 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={responses.mentalClearStep2 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep2: checked})}
                  />
                  <span className="text-sm">Write down every racing thought - no judgment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={responses.mentalClearStep3 || false}
                    onCheckedChange={(checked) => setResponses({...responses, mentalClearStep3: checked})}
                  />
                  <span className="text-sm">Notice how your mind feels after the brain dump</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Mental clarity rating after exercise (1-10):</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[responses.clarityRating || 5]}
                    onValueChange={(value) => setResponses({...responses, clarityRating: value[0]})}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="font-medium text-lg w-8">{responses.clarityRating || 5}</span>
                </div>
              </div>

              <div className="mt-4">
                <Label>Reflection notes:</Label>
                <Textarea
                  placeholder="What did you notice about your thoughts? How do you feel now?"
                  value={responses.clarityNotes || ''}
                  onChange={(e) => setResponses({...responses, clarityNotes: e.target.value})}
                  className="mt-2"
                />
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