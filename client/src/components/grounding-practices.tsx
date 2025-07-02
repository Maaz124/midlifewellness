import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Play, CheckCircle, Heart, Brain, Waves } from 'lucide-react';

interface GroundingPracticesProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function GroundingPractices({ onComplete, onClose }: GroundingPracticesProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'assessment' | 'practice' | 'integration'>('intro');
  const [currentTechnique, setCurrentTechnique] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [responses, setResponses] = useState<any>({
    stressSignals: {},
    practiceResults: {},
    personalPlan: ''
  });

  const techniques = [
    {
      id: 'five-senses',
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to anchor yourself in the present moment',
      duration: '3-5 minutes',
      icon: <Brain className="w-6 h-6" />,
      steps: [
        { sense: 'Sight', count: 5, prompt: 'Look around and name 5 things you can see', examples: ['Blue coffee mug', 'Sunlight through window', 'Wooden table grain'] },
        { sense: 'Hearing', count: 4, prompt: 'Listen and identify 4 sounds you can hear', examples: ['Air conditioning', 'Birds outside', 'Your breathing'] },
        { sense: 'Touch', count: 3, prompt: 'Feel 3 different textures around you', examples: ['Smooth phone screen', 'Soft fabric', 'Cool table surface'] },
        { sense: 'Smell', count: 2, prompt: 'Take a deep breath and notice 2 scents', examples: ['Coffee brewing', 'Fresh air', 'Cleaning products'] },
        { sense: 'Taste', count: 1, prompt: 'Notice 1 taste in your mouth right now', examples: ['Lingering coffee', 'Toothpaste', 'Natural mouth taste'] }
      ]
    },
    {
      id: 'body-scan',
      title: 'Progressive Body Awareness',
      description: 'Systematically tune into your body to release tension',
      duration: '10-15 minutes',
      icon: <Heart className="w-6 h-6" />,
      bodyParts: [
        { area: 'Head & Face', focus: 'Forehead, eyes, jaw', release: 'Let your face soften like melting butter' },
        { area: 'Neck & Shoulders', focus: 'Base of skull, shoulders', release: 'Imagine warm honey flowing down your neck' },
        { area: 'Arms & Hands', focus: 'Arms, hands, fingers', release: 'Let your arms become heavy and sink' },
        { area: 'Chest & Heart', focus: 'Ribcage, heart area', release: 'Breathe space into your chest' },
        { area: 'Abdomen', focus: 'Belly, digestive area', release: 'Let your belly be soft and round' },
        { area: 'Hips & Pelvis', focus: 'Hip bones, lower back', release: 'Imagine your hips melting into the ground' },
        { area: 'Legs & Feet', focus: 'Thighs, calves, feet', release: 'Let your legs be completely heavy' }
      ]
    },
    {
      id: 'breathing',
      title: '4-7-8 Calming Breath',
      description: 'Rhythmic breathing to activate your relaxation response',
      duration: '5-10 minutes',
      icon: <Waves className="w-6 h-6" />,
      pattern: [
        { phase: 'Inhale', count: 4, instruction: 'Breathe in slowly through your nose' },
        { phase: 'Hold', count: 7, instruction: 'Hold your breath gently' },
        { phase: 'Exhale', count: 8, instruction: 'Exhale slowly through your mouth' }
      ]
    }
  ];

  const stressSignals = [
    {
      category: 'Physical',
      signals: ['Tight shoulders', 'Clenched jaw', 'Shallow breathing', 'Racing heart', 'Stomach tension', 'Headaches']
    },
    {
      category: 'Mental',
      signals: ['Racing thoughts', 'Difficulty focusing', 'Overthinking', 'Memory problems', 'Mental fog', 'Indecision']
    },
    {
      category: 'Emotional',
      signals: ['Irritability', 'Anxiety', 'Feeling overwhelmed', 'Mood swings', 'Feeling disconnected', 'Tearfulness']
    }
  ];

  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-sage-800 mb-4">🌱 Somatic Grounding Practices</h2>
        <p className="text-lg text-gray-600 mb-6">
          Body-based techniques to regulate your nervous system and find calm in moments of stress
        </p>
      </div>

      <div className="bg-gradient-to-r from-sage-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-sage-800">Why Grounding Matters in Midlife</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-sage-700 mb-2">Common Midlife Stressors:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Hormonal changes affecting mood and energy</li>
              <li>• Caregiving for aging parents and children</li>
              <li>• Career transitions and financial pressures</li>
              <li>• Physical changes and health concerns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sage-700 mb-2">Grounding Benefits:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Activates your calming nervous system</li>
              <li>• Reduces anxiety and overwhelm quickly</li>
              <li>• Improves focus and mental clarity</li>
              <li>• Builds resilience for daily challenges</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setCurrentPhase('assessment')}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          Start Your Assessment
        </Button>
      </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentPhase('intro')} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-sage-800">📊 Your Current Stress Signals</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Check all the stress signals you've experienced in the past week. This helps us understand how your nervous system is responding:
      </p>

      <div className="space-y-6">
        {stressSignals.map((category) => (
          <div key={category.category} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">{category.category} Signals:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {category.signals.map((signal, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`signal-${category.category}-${i}`}
                    checked={responses.stressSignals?.[signal] || false}
                    onCheckedChange={(checked) => setResponses({
                      ...responses,
                      stressSignals: {
                        ...responses.stressSignals,
                        [signal]: checked
                      }
                    })}
                  />
                  <Label htmlFor={`signal-${category.category}-${i}`} className="text-sm cursor-pointer">
                    {signal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">🌟 Remember</h4>
        <p className="text-sm text-amber-700">
          These responses are normal reactions to stress. Grounding practices help your nervous system return to balance.
        </p>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setCurrentPhase('practice')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          Begin Interactive Practice
        </Button>
      </div>
    </div>
  );

  const renderPractice = () => {
    const technique = techniques[currentTechnique];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setCurrentPhase('assessment')} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-sage-800">🎯 Interactive Practice Session</h2>
        </div>

        {/* Technique Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {techniques.map((tech, index) => (
            <Card 
              key={tech.id} 
              className={`cursor-pointer transition-all ${index === currentTechnique ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
              onClick={() => setCurrentTechnique(index)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {tech.icon}
                  <CardTitle className="text-sm">{tech.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-2">{tech.description}</p>
                <Badge variant="outline" className="text-xs">{tech.duration}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Technique Practice */}
        <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            {technique.icon}
            <h3 className="text-lg font-semibold text-blue-800">{technique.title}</h3>
          </div>

          {technique.id === 'five-senses' && (
            <div className="space-y-4">
              <p className="text-blue-700 mb-4">Follow each step below and write what you notice:</p>
              {technique.steps?.map((step, i) => (
                <div key={i} className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Step {i + 1}: {step.sense} - Find {step.count}
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">{step.prompt}</p>
                  <div className="mb-3">
                    <p className="text-xs text-blue-600 mb-1">Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {step.examples.map((example, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{example}</Badge>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder={`List ${step.count} things you can ${step.sense.toLowerCase()}...`}
                    className="mt-2"
                    rows={2}
                    value={responses.practiceResults?.[`${step.sense}-${i}`] || ''}
                    onChange={(e) => setResponses({
                      ...responses,
                      practiceResults: {
                        ...responses.practiceResults,
                        [`${step.sense}-${i}`]: e.target.value
                      }
                    })}
                  />
                </div>
              ))}
            </div>
          )}

          {technique.id === 'body-scan' && (
            <div className="space-y-4">
              <p className="text-blue-700 mb-4">Focus on each body area and rate your tension level:</p>
              {technique.bodyParts?.map((part, i) => (
                <div key={i} className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{part.area}</h4>
                  <p className="text-sm text-blue-700 mb-2">Focus on: {part.focus}</p>
                  <p className="text-sm font-medium text-blue-800 mb-3">Release: {part.release}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Tight', 'Neutral', 'Relaxed'].map((level) => (
                      <Button 
                        key={level}
                        variant={responses.practiceResults?.[`${part.area}-tension`] === level ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setResponses({
                          ...responses,
                          practiceResults: {
                            ...responses.practiceResults,
                            [`${part.area}-tension`]: level
                          }
                        })}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {technique.id === 'breathing' && (
            <div className="space-y-4">
              <p className="text-blue-700 mb-4">Follow the 4-7-8 breathing pattern. Complete 4 rounds:</p>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-800 mb-4">Round {Math.min(practiceStep + 1, 4)} of 4</div>
                {technique.pattern?.map((phase, i) => (
                  <div key={i} className="mb-4">
                    <div className="text-lg font-semibold text-blue-900">{phase.phase} for {phase.count} seconds</div>
                    <div className="text-sm text-blue-700">{phase.instruction}</div>
                  </div>
                ))}
                <Button 
                  onClick={() => setPracticeStep(Math.min(practiceStep + 1, 4))}
                  className="mt-4"
                  disabled={practiceStep >= 4}
                >
                  {practiceStep < 4 ? 'Complete Round' : 'Finished!'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => setCurrentPhase('integration')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            Complete Practice Session
          </Button>
        </div>
      </div>
    );
  };

  const renderIntegration = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentPhase('practice')} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-sage-800">✨ Integration & Daily Practice</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 mb-4">🎉 Great work! You've completed your grounding practice session.</h3>
        <p className="text-green-700 mb-4">
          Regular practice builds resilience and makes these tools more effective when you need them most.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Create Your Personal Grounding Plan</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="personal-plan" className="text-sm font-medium">
              Which technique felt most helpful? When will you practice it this week?
            </Label>
            <Textarea
              id="personal-plan"
              placeholder="Example: I'll use 5-4-3-2-1 grounding when I feel overwhelmed at work, and do body scans before bed..."
              className="mt-2"
              rows={4}
              value={responses.personalPlan}
              onChange={(e) => setResponses({...responses, personalPlan: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Quick Reference for Daily Life</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Morning:</strong> 2-minute body scan to start your day centered</p>
          <p>• <strong>Stressful moments:</strong> 5-4-3-2-1 grounding for immediate relief</p>
          <p>• <strong>Evening:</strong> 4-7-8 breathing to transition into rest</p>
          <p>• <strong>Emergency:</strong> Any technique for 30 seconds is better than none</p>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => onComplete('w4-grounding', responses)}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Grounding Practices
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Progress value={(currentPhase === 'intro' ? 25 : currentPhase === 'assessment' ? 50 : currentPhase === 'practice' ? 75 : 100)} className="h-2" />
      </div>

      {currentPhase === 'intro' && renderIntroduction()}
      {currentPhase === 'assessment' && renderAssessment()}
      {currentPhase === 'practice' && renderPractice()}
      {currentPhase === 'integration' && renderIntegration()}
    </div>
  );
}