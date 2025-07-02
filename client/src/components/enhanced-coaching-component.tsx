import { useState, useEffect } from 'react';
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
import { videoScripts, audioScripts, detailedExercises, worksheetTemplates } from '@/lib/hormone-headspace-content';
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
  ArrowLeft,
  Sun,
  Moon,
  Activity,
  Star
} from 'lucide-react';

interface EnhancedCoachingComponentProps {
  component: ModuleComponent;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function EnhancedCoachingComponent({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentProps) {
  const { data, updateCoachingProgress } = useWellnessData();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const [isCompleted, setIsCompleted] = useState(
    (data.coachingProgress?.completedComponents as string[])?.includes(component.id) || false
  );

  // Get detailed content for Week 1 components
  const getDetailedContent = () => {
    if (moduleId === 'week-1') {
      switch (component.id) {
        case 'hormone-video':
          return {
            type: 'video-script',
            content: videoScripts.find(v => v.id === 'hormone-basics')
          };
        case 'headspace-video':
          return {
            type: 'video-script',
            content: videoScripts.find(v => v.id === 'headspace-reset')
          };
        case 'hormone-meditation':
          return {
            type: 'audio-script',
            content: audioScripts.find(a => a.id === 'hormone-balance-meditation')
          };
        case 'breathwork':
          return {
            type: 'audio-script',
            content: audioScripts.find(a => a.id === 'stress-release-breathwork')
          };
        case 'symptom-tracker':
          return {
            type: 'detailed-exercise',
            content: detailedExercises.find(e => e.id === 'hormone-symptom-tracker')
          };
        case 'morning-ritual':
          return {
            type: 'detailed-exercise',
            content: detailedExercises.find(e => e.id === 'morning-hormone-ritual')
          };
        case 'brain-fog-exercise':
          return {
            type: 'detailed-exercise',
            content: detailedExercises.find(e => e.id === 'brain-fog-clearing')
          };
        case 'energy-mapping':
          return {
            type: 'detailed-exercise',
            content: detailedExercises.find(e => e.id === 'energy-mapping')
          };
      }
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

  // Render Video Script Component
  const renderVideoScript = (script: any) => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-coral-50 to-sage-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Play className="w-8 h-8 text-coral-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{script.title}</h3>
            <p className="text-gray-600">Duration: {script.duration}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-coral-600 hover:bg-coral-700 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Video Script
          </Button>
          <span className="ml-4 text-gray-600">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <Tabs defaultValue="script" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="script">Full Script</TabsTrigger>
          <TabsTrigger value="key-points">Key Points</TabsTrigger>
          <TabsTrigger value="exercises">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Video Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {script.script}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="key-points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Key Learning Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {script.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Practice Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {script.exercises.map((exercise: string, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{exercise}</span>
                      <Checkbox
                        checked={completedSections.includes(`exercise-${index}`)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCompletedSections([...completedSections, `exercise-${index}`]);
                          } else {
                            setCompletedSections(completedSections.filter(s => s !== `exercise-${index}`));
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render Audio Script Component
  const renderAudioScript = (script: any) => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sage-50 to-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-8 h-8 text-sage-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{script.title}</h3>
            <p className="text-gray-600">Duration: {script.duration}</p>
            <p className="text-sm text-gray-500">Background: {script.backgroundMusic}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Audio Session
          </Button>
          <span className="ml-4 text-gray-600">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      <Tabs defaultValue="script" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="script">Guided Script</TabsTrigger>
          <TabsTrigger value="instructions">Setup</TabsTrigger>
          <TabsTrigger value="reflection">Reflect</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Guided Audio Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gradient-to-r from-sage-50 to-blue-50 p-4 rounded-lg">
                  {script.script}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {script.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reflection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Post-Session Reflection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="insights">What insights came up during this session?</Label>
                <Textarea
                  id="insights"
                  placeholder="Reflect on your experience..."
                  value={responses.insights || ''}
                  onChange={(e) => setResponses({...responses, insights: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="feeling">How are you feeling right now?</Label>
                <Input
                  id="feeling"
                  placeholder="Describe your current state..."
                  value={responses.feeling || ''}
                  onChange={(e) => setResponses({...responses, feeling: e.target.value})}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render Detailed Exercise Component
  const renderDetailedExercise = (exercise: any) => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-coral-50 to-amber-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-coral-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{exercise.title}</h3>
            <p className="text-gray-600">Duration: {exercise.duration}</p>
            <Badge variant="outline" className="mt-2">{exercise.type}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="instructions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Step-by-Step Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {exercise.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-coral-100 text-coral-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Materials Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.materials.map((material: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sage-600" />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Benefits & Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Benefits:</h4>
                <ul className="space-y-2">
                  {exercise.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="w-4 h-4 text-coral-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Helpful Tips:</h4>
                <ul className="space-y-2">
                  {exercise.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          {exercise.id === 'hormone-symptom-tracker' && (
            <Card>
              <CardHeader>
                <CardTitle>Hormone Symptom Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {worksheetTemplates.hormoneSymptomTracker.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-3">
                    <h4 className="font-medium">{section.name}</h4>
                    <div className="grid gap-3">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">{item}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">1-5:</span>
                            <Slider
                              value={[responses[`${section.name}-${item}`] || 1]}
                              onValueChange={(value) => setResponses({
                                ...responses,
                                [`${section.name}-${item}`]: value[0]
                              })}
                              max={5}
                              min={1}
                              step={1}
                              className="w-20"
                            />
                            <span className="text-sm font-medium w-6">
                              {responses[`${section.name}-${item}`] || 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {exercise.id === 'energy-mapping' && (
            <Card>
              <CardHeader>
                <CardTitle>Energy Pattern Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {worksheetTemplates.energyMapping.timeSlots.map((timeSlot, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">{timeSlot}</h4>
                    {worksheetTemplates.energyMapping.trackingItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[responses[`${timeSlot}-${item}`] || 5]}
                            onValueChange={(value) => setResponses({
                              ...responses,
                              [`${timeSlot}-${item}`]: value[0]
                            })}
                            max={10}
                            min={1}
                            step={1}
                            className="w-24"
                          />
                          <span className="text-sm font-medium w-6">
                            {responses[`${timeSlot}-${item}`] || 5}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(exercise.id === 'morning-hormone-ritual' || exercise.id === 'brain-fog-clearing') && (
            <Card>
              <CardHeader>
                <CardTitle>Practice Reflection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="experience">How was your experience with this practice?</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your experience..."
                    value={responses.experience || ''}
                    onChange={(e) => setResponses({...responses, experience: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="commitment">How will you incorporate this into your routine?</Label>
                  <Textarea
                    id="commitment"
                    placeholder="Your commitment plan..."
                    value={responses.commitment || ''}
                    onChange={(e) => setResponses({...responses, commitment: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

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
            {detailedContent.type === 'detailed-exercise' && renderDetailedExercise(detailedContent.content)}
          </div>
        )}

        {/* Completion Section */}
        <div className="mt-8 p-6 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Ready to Complete?</h3>
              <p className="text-gray-600 text-sm">Mark this component as finished when you're done.</p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={isCompleted}
              className="bg-coral-600 hover:bg-coral-700 text-white"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
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