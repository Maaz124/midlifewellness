import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Pause, CheckCircle, Heart, Brain, Clock } from 'lucide-react';
import { useCoachingProgress } from '@/hooks/use-coaching-progress';

interface WeekProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

function InteractiveFocusMemoryRituals({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [ritualData, setRitualData] = useState({
    selectedRituals: [] as string[],
    practiceTime: 0,
    effectiveness: 0,
    notes: ''
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['focus-memory-rituals'];
    if (saved && typeof saved === 'object') {
      setRitualData(prev => ({
        ...prev,
        selectedRituals: Array.isArray(saved.selectedRituals) ? saved.selectedRituals : prev.selectedRituals,
        practiceTime: saved.practiceTime || prev.practiceTime,
        effectiveness: saved.effectiveness || prev.effectiveness,
        notes: saved.notes || prev.notes
      }));
    }
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  const rituals = [
    { id: 'morning-clarity', name: '5-Minute Morning Clarity Ritual', description: 'Start your day with focused intention', steps: ['Deep breathing', 'Set 3 priorities', 'Visualize success'], duration: 5 },
    { id: 'memory-palace', name: 'Memory Palace Technique', description: 'Create mental associations for better recall', steps: ['Choose familiar location', 'Place items mentally', 'Walk through path'], duration: 10 },
    { id: 'focus-flow', name: 'Focus Flow State', description: 'Enter deep concentration mode', steps: ['Eliminate distractions', 'Set timer', 'Single-task focus'], duration: 15 },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Interactive Focus & Memory Rituals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Rituals</h3>
              <div className="grid gap-4">
                {rituals.map(ritual => (
                  <div key={ritual.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                       onClick={() => {
                         const selected = ritualData.selectedRituals.includes(ritual.id)
                           ? ritualData.selectedRituals.filter(id => id !== ritual.id)
                           : [...ritualData.selectedRituals, ritual.id];
                         setRitualData({...ritualData, selectedRituals: selected});
                       }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{ritual.name}</h4>
                        <p className="text-sm text-gray-600">{ritual.description}</p>
                      </div>
                      <Badge variant={ritualData.selectedRituals.includes(ritual.id) ? "default" : "outline"}>
                        {ritual.duration} min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setCurrentStep(1)} disabled={ritualData.selectedRituals.length === 0} className="mt-6">
                Practice Selected Rituals
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Practice Session</h3>
              <div className="space-y-4">
                {ritualData.selectedRituals.map(id => {
                  const ritual = rituals.find(r => r.id === id);
                  return (
                    <div key={id} className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold">{ritual?.name}</h4>
                      <ul className="text-sm mt-2 space-y-1">
                        {ritual?.steps.map((step, idx) => (
                          <li key={idx}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setCurrentStep(2)} className="mt-6">
                Complete Practice
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Session Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Effectiveness (1-10)</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <Button key={num} variant={ritualData.effectiveness === num ? "default" : "outline"} size="sm" onClick={() => setRitualData({...ritualData, effectiveness: num})}>
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea value={ritualData.notes} onChange={(e) => setRitualData({...ritualData, notes: e.target.value})} placeholder="How did this feel? What worked best?" />
                </div>
                <Button onClick={() => onComplete('focus-memory-rituals', ritualData)} className="w-full">
                  Complete Ritual Practice
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CortisolResetBreathwork({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [currentPhase, setCurrentPhase] = useState('assessment');
  const [breathingData, setBreathingData] = useState({
    preStressLevel: 0,
    postStressLevel: 0,
    selectedTechnique: '',
    sessionDuration: 0,
    completedCycles: 0,
    effectiveness: 0,
    notes: ''
  });
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const practicePhaseInitialized = useRef(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['cortisol-breathwork'];
    if (saved && typeof saved === 'object') {
      setBreathingData(prev => ({ ...prev, ...saved }));
    }
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  const breathingTechniques = {
    '4-7-8': {
      name: '4-7-8 Technique', description: 'Inhale for 4, hold for 7, exhale for 8', inhale: 4, hold: 7, exhale: 8, pause: 0,
      benefits: ['Reduces cortisol', 'Activates parasympathetic nervous system', 'Promotes deep relaxation'],
      instructions: [
        'Find a comfortable seated position',
        'Place tongue tip behind upper front teeth',
        'Exhale completely through mouth',
        'Close mouth, inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts',
      ],
    },
    'box': {
      name: 'Box Breathing', description: 'Equal 4-count rhythm for all phases', inhale: 4, hold: 4, exhale: 4, pause: 4,
      benefits: ['Balances nervous system', 'Improves focus', 'Reduces stress hormones'],
      instructions: [
        'Sit with spine straight',
        'Exhale all air from lungs',
        'Inhale through nose for 4 counts',
        'Hold breath for 4 counts',
        'Exhale through mouth for 4 counts',
        'Pause for 4 counts before next cycle',
      ],
    },
  } as const;

  const updateBreathingData = (key: string, value: any) => setBreathingData(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (currentPhase === 'practice' && !practicePhaseInitialized.current) {
      setIsBreathing(false);
      setSessionTime(0);
      setCycleCount(0);
      setBreathPhase('inhale');
      practicePhaseInitialized.current = true;
    }
    if (currentPhase !== 'practice') {
      practicePhaseInitialized.current = false;
    }
  }, [currentPhase]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isBreathing) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          const technique = breathingTechniques[breathingData.selectedTechnique as keyof typeof breathingTechniques];
          if (technique) {
            const totalCycleTime = technique.inhale + technique.hold + technique.exhale + (technique as any).pause;
            const cyclePosition = newTime % totalCycleTime;
            if (cyclePosition < technique.inhale) setBreathPhase('inhale');
            else if (cyclePosition < technique.inhale + technique.hold) setBreathPhase('hold');
            else if (cyclePosition < technique.inhale + technique.hold + technique.exhale) setBreathPhase('exhale');
            else setBreathPhase('pause');
            if (cyclePosition === 0 && newTime > 0) setCycleCount(prev => prev + 1);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isBreathing, breathingData.selectedTechnique]);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          Cortisol Reset Breathwork (8 minutes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentPhase === 'assessment' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Pre-Session Stress Assessment</h3>
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <p className="text-red-800 mb-4">Rate your current stress level to track the effectiveness of this breathwork session.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Very calm</span><span className="text-sm text-gray-600">Extremely stressed</span></div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(level => (
                      <Button key={level} variant={breathingData.preStressLevel === level ? "default" : "outline"} size="sm" onClick={() => updateBreathingData('preStressLevel', level)} className={`w-12 h-12 p-0 ${breathingData.preStressLevel === level ? 'bg-red-600 hover:bg-red-700' : 'border-gray-300 hover:border-red-400'}`}>
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={() => setCurrentPhase('technique-selection')} disabled={breathingData.preStressLevel === 0} className="w-full">Continue to Technique Selection</Button>
            </div>
          )}

          {currentPhase === 'technique-selection' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Breathing Technique</h3>
              <div className="grid gap-6">
                {Object.entries(breathingTechniques).map(([key, technique]) => (
                  <div key={key} className={`border rounded-lg p-6 cursor-pointer transition-all border-gray-200 hover:border-red-300`} onClick={() => { updateBreathingData('selectedTechnique', key); setTimeout(() => setCurrentPhase('practice'), 0); }}>
                    <h4 className="font-semibold mb-2">{technique.name}</h4>
                    <p className="text-gray-600 mb-4">{technique.description}</p>
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Benefits:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(technique as any).benefits.map((b: string, idx: number) => (<li key={idx}>• {b}</li>))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPhase === 'practice' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Guided {(breathingTechniques as any)[breathingData.selectedTechnique]?.name} Practice</h3>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 mb-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-2xl text-white font-bold capitalize">{breathPhase}</span>
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    {breathPhase === 'inhale' && 'Breathe in slowly through your nose'}
                    {breathPhase === 'hold' && 'Hold your breath gently'}
                    {breathPhase === 'exhale' && 'Exhale slowly through your mouth'}
                    {breathPhase === 'pause' && 'Rest and prepare for next cycle'}
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                  <div className="bg-white rounded-lg p-4"><div className="text-2xl font-bold text-blue-600">{cycleCount}</div><div className="text-sm text-gray-600">Cycles Completed</div></div>
                  <div className="bg-white rounded-lg p-4"><div className="text-2xl font-bold text-green-600">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2,'0')}</div><div className="text-sm text-gray-600">Session Time</div></div>
                  <div className="bg-white rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">8:00</div><div className="text-sm text-gray-600">Target Duration</div></div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => { if (!hasStarted) setHasStarted(true); setIsBreathing(!isBreathing); }} className={isBreathing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
                    {isBreathing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isBreathing ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentPhase('complete')}>End Session</Button>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">Instructions:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {(breathingTechniques as any)[breathingData.selectedTechnique]?.instructions.map((instruction: string, idx: number) => (<li key={idx}>• {instruction}</li>))}
                </ul>
              </div>
            </div>
          )}

          {currentPhase === 'complete' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-white" /></div>
                  <p className="text-green-600">You've completed {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2,'0')} of cortisol-reset breathwork.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How do you feel now? (1-10)</label>
                    <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Much calmer</span><span className="text-sm text-gray-600">Same/More stressed</span></div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button key={level} variant={breathingData.postStressLevel === level ? "default" : "outline"} size="sm" onClick={() => updateBreathingData('postStressLevel', level)} className={`w-10 h-10 p-0 ${breathingData.postStressLevel === level ? 'bg-green-600 hover:bg-green-700' : 'border-gray-300 hover:border-green-400'}`}>{level}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Effectiveness (1-10)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button key={level} variant={breathingData.effectiveness === level ? "default" : "outline"} size="sm" onClick={() => updateBreathingData('effectiveness', level)} className={`w-10 h-10 p-0 ${breathingData.effectiveness === level ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:border-blue-400'}`}>{level}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes & Observations</label>
                    <Textarea value={breathingData.notes} onChange={(e) => updateBreathingData('notes', e.target.value)} placeholder="How did this feel? Any insights or physical sensations?" />
                  </div>
                </div>
              </div>
              <Button onClick={() => onComplete('cortisol-breathwork', { ...breathingData, sessionDuration: sessionTime, completedCycles: cycleCount, improvementScore: breathingData.preStressLevel - breathingData.postStressLevel, completedAt: new Date().toISOString() })} className="w-full bg-green-600 hover:bg-green-700">
                Complete Breathwork Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResettingYourMentalSpace({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [clarityData, setClarityData] = useState({
    preMentalClarity: 0,
    postMentalClarity: 0,
    identifiedSymptoms: [] as string[],
    practiceNotes: '',
    completedTechniques: [] as string[],
    effectiveness: 0,
    insights: ''
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['mental-space-reset'];
    if (saved && typeof saved === 'object') setClarityData(prev => ({ ...prev, ...saved }));
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  const fogSymptoms = [
    'Difficulty concentrating', 'Forgetting words mid-sentence', 'Walking into rooms and forgetting why', 'Struggling to follow conversations', 'Feeling mentally "cloudy" or "fuzzy"', 'Taking longer to process information', 'Difficulty making decisions', 'Feeling mentally fatigued',
  ];

  const clarityTechniques = [
    { id: 'brain-dump', name: '5-Minute Brain Dump', description: 'Clear mental clutter by writing everything down', steps: ['Set a timer for 5 minutes','Write continuously without stopping','Don\'t worry about grammar or organization','Include thoughts, worries, tasks, anything in your mind','When timer ends, review what you wrote','Circle 3 priority items'] },
    { id: 'focus-reset', name: 'Focus Reset Technique', description: 'Reset your attention with intentional focus shifts', steps: ['Look at something far away for 30 seconds','Close your eyes and take 3 deep breaths','Open eyes and focus on something near for 30 seconds','Say out loud: "I am present and focused"','Choose one specific task to focus on','Set intention to give it full attention'] },
    { id: 'clarity-questions', name: 'Clarity Questions', description: 'Use targeted questions to sharpen thinking', steps: ['Ask: "What exactly am I trying to accomplish?"','Ask: "What\'s the most important thing right now?"','Ask: "What would make this clearer?"','Write down your answers','Read them back to yourself','Choose one action to take immediately'] },
    { id: 'movement-reset', name: '2-Minute Movement Reset', description: 'Use physical movement to boost mental clarity', steps: ['Stand up and stretch arms overhead','Do 10 gentle neck rolls','March in place for 30 seconds','Do 5 jumping jacks or arm circles','Take 3 deep breaths while moving arms','Sit down with intention to focus'] },
  ];

  const updateClarityData = (key: string, value: any) => setClarityData(prev => ({ ...prev, [key]: value }));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Resetting Your Mental Space (10 minutes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentPhase === 'intro' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Understanding Brain Fog</h3>
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-purple-800 mb-4">Brain fog isn't a character flaw or sign of aging - it's a real symptom of hormonal changes that affect neurotransmitter function.</p>
                <div className="space-y-3 text-sm text-purple-700">
                  <p><strong>What's happening:</strong> Fluctuating estrogen affects acetylcholine and dopamine, neurotransmitters crucial for attention and memory.</p>
                  <p><strong>Why it matters:</strong> Understanding the science helps you respond strategically rather than feeling frustrated.</p>
                  <p><strong>The solution:</strong> Targeted techniques that work with your brain's natural ability to refocus and reset.</p>
                </div>
              </div>
              <div className="bg-white border border-purple-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-800 mb-4">Pre-Session Clarity Check</h4>
                <p className="text-sm text-gray-600 mb-4">Rate your current mental clarity (1-10)</p>
                <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Very foggy</span><span className="text-sm text-gray-600">Crystal clear</span></div>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(level => (
                    <Button key={level} variant={clarityData.preMentalClarity === level ? "default" : "outline"} size="sm" onClick={() => updateClarityData('preMentalClarity', level)} className={`w-10 h-10 p-0 ${clarityData.preMentalClarity === level ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-300 hover:border-purple-400'}`}>{level}</Button>
                  ))}
                </div>
              </div>
              <Button onClick={() => setCurrentPhase('symptoms')} disabled={clarityData.preMentalClarity === 0} className="w-full">Continue to Symptom Check</Button>
            </div>
          )}

          {currentPhase === 'symptoms' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Identify Your Fog Patterns</h3>
              <p className="text-gray-600 mb-6">Which of these brain fog symptoms have you experienced recently? (Check all that apply)</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {fogSymptoms.map((symptom: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input type="checkbox" checked={clarityData.identifiedSymptoms.includes(symptom)} onChange={(e) => {
                      const symptoms = e.target.checked ? [...clarityData.identifiedSymptoms, symptom] : clarityData.identifiedSymptoms.filter(s => s !== symptom);
                      updateClarityData('identifiedSymptoms', symptoms);
                    }} className="rounded" />
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setCurrentPhase('techniques')} disabled={clarityData.identifiedSymptoms.length === 0} className="w-full">Continue to Clarity Techniques</Button>
            </div>
          )}

          {currentPhase === 'techniques' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose a Clarity Technique to Practice</h3>
              <div className="grid gap-4">
                {clarityTechniques.map(technique => (
                  <div key={technique.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setCurrentPhase(`practice-${technique.id}`)}>
                    <div className="flex items-center justify-between mb-2"><h4 className="font-semibold">{technique.name}</h4><Badge variant="outline">Practice Now</Badge></div>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPhase.startsWith('practice-') && (
            <div>
              {clarityTechniques.map(technique => {
                if (currentPhase !== `practice-${technique.id}`) return null;
                return (
                  <div key={technique.id}>
                    <h3 className="text-xl font-semibold mb-4">Practice: {technique.name}</h3>
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <p className="text-blue-800 mb-4">{technique.description}</p>
                      <h5 className="font-semibold text-blue-800 mb-3">Step-by-step instructions:</h5>
                      <ol className="text-sm text-blue-700 space-y-2">
                        {technique.steps.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span><span>{step}</span></li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h5 className="font-semibold mb-4">Practice Notes</h5>
                      <Textarea value={clarityData.practiceNotes} onChange={(e) => updateClarityData('practiceNotes', e.target.value)} placeholder="How did this technique feel? What did you notice? Any insights or challenges?" rows={4} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setCurrentPhase('techniques')}>Try Another Technique</Button>
                      <Button onClick={() => { updateClarityData('completedTechniques', [...clarityData.completedTechniques, technique.id]); setCurrentPhase('complete'); }} className="flex-1">Complete Practice</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentPhase === 'complete' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Mental Space Reset Complete!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-6"><div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-white" /></div><p className="text-green-600">You've completed a mental clarity reset session!</p></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How is your mental clarity now? (1-10)</label>
                    <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Much clearer</span><span className="text-sm text-gray-600">Same/Worse</span></div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button key={level} variant={clarityData.postMentalClarity === level ? "default" : "outline"} size="sm" onClick={() => updateClarityData('postMentalClarity', level)} className={`w-10 h-10 p-0 ${clarityData.postMentalClarity === level ? 'bg-green-600 hover:bg-green-700' : 'border-gray-300 hover:border-green-400'}`}>{level}</Button>
                      ))}
                    </div>
                    {clarityData.postMentalClarity > 0 && (
                      <div className="text-center text-sm text-gray-600 mt-2">Clarity improvement: {clarityData.postMentalClarity - clarityData.preMentalClarity} points</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Technique Effectiveness (1-10)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(level => (
                        <Button key={level} variant={clarityData.effectiveness === level ? "default" : "outline"} size="sm" onClick={() => updateClarityData('effectiveness', level)} className={`w-10 h-10 p-0 ${clarityData.effectiveness === level ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:border-blue-400'}`}>{level}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Insights</label>
                    <Textarea value={clarityData.insights} onChange={(e) => updateClarityData('insights', e.target.value)} placeholder="What did you learn about your brain fog patterns? Which technique worked best?" rows={3} />
                  </div>
                </div>
              </div>
              <Button onClick={() => onComplete('mental-space-reset', { ...clarityData, improvementScore: clarityData.postMentalClarity - clarityData.preMentalClarity, symptomCount: clarityData.identifiedSymptoms.length, completedAt: new Date().toISOString() })} className="w-full bg-green-600 hover:bg-green-700">Complete Mental Space Reset</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InteractiveSymptomTracker({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [symptoms, setSymptoms] = useState({ hotFlashes: 0, brainFog: 0, moodSwings: 0, sleepQuality: 0, energyLevel: 0, anxiety: 0 });
  const [insights, setInsights] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['symptom-tracker'];
    if (saved && typeof saved === 'object') {
      if (saved.symptoms) setSymptoms(saved.symptoms);
      if (typeof saved.insights === 'string') setInsights(saved.insights);
    }
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back to Coaching</Button>
        </div>
        <CardTitle className="flex items-center gap-2"><Heart className="w-6 h-6 text-pink-600" />Daily Hormone Harmony Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Rate how you're feeling today in each area (0-10 scale)</p>
          {Object.entries(symptoms).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <div className="flex gap-2">
                {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button key={level} variant={value === level ? "default" : "outline"} size="sm" onClick={() => setSymptoms(prev => ({...prev, [key]: level}))} className="w-10 h-10 p-0">{level}</Button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-2">Daily Insights</label>
            <Textarea value={insights} onChange={(e) => setInsights(e.target.value)} placeholder="What patterns do you notice? Any triggers or helpful strategies?" />
          </div>
          <Button onClick={() => onComplete('symptom-tracker', {symptoms, insights})} className="w-full">Save Daily Tracking</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MorningRitualCreator({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [customRitual, setCustomRitual] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['morning-ritual'];
    if (saved && typeof saved === 'object') {
      if (Array.isArray(saved.selectedPractices)) setSelectedPractices(saved.selectedPractices);
      if (typeof saved.customRitual === 'string') setCustomRitual(saved.customRitual);
    }
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  const ritualOptions = [
    'Morning sunlight exposure (5 min)','Gratitude practice (3 min)','Gentle stretching (5 min)','Deep breathing (2 min)','Hormone-supporting breakfast','Hydration with lemon water','Intention setting (2 min)'
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back to Coaching</Button></div>
        <CardTitle className="flex items-center gap-2"><Clock className="w-6 h-6 text-orange-600" />Sunrise Hormone Reset Ritual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">Choose practices for your personalized morning ritual:</p>
          <div className="grid gap-3">
            {ritualOptions.map(option => (
              <div key={option} className="flex items-center gap-3 p-3 border rounded-lg">
                <input type="checkbox" checked={selectedPractices.includes(option)} onChange={(e) => { if (e.target.checked) setSelectedPractices([...selectedPractices, option]); else setSelectedPractices(selectedPractices.filter(p => p !== option)); }} className="rounded" />
                <span>{option}</span>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Add Custom Practice</label>
            <Textarea value={customRitual} onChange={(e) => setCustomRitual(e.target.value)} placeholder="Any other morning practices you'd like to include?" />
          </div>
          <Button onClick={() => onComplete('morning-ritual', {selectedPractices, customRitual})} className="w-full" disabled={selectedPractices.length === 0}>Create My Morning Ritual</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BrainFogClearingPractice({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const { data: progressData } = useCoachingProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceData, setPracticeData] = useState({ preFogLevel: 0, postFogLevel: 0, completedTechniques: [] as string[], effectiveness: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (hasInitialized) return;
    const saved = progressData?.coachingProgress?.responseData?.['brain-fog-exercise'];
    if (saved && typeof saved === 'object') { setPracticeData(prev => ({ ...prev, ...saved })); setCurrentStep(2); }
    setHasInitialized(true);
  }, [hasInitialized, progressData]);

  const techniques = [
    'Cold water on wrists (30 seconds)','Deep breathing with counting (2 minutes)','Quick physical movement (1 minute)','Brain dump writing (3 minutes)','Mindful focus exercise (2 minutes)'
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back to Coaching</Button></div>
        <CardTitle className="flex items-center gap-2"><Brain className="w-6 h-6 text-purple-600" />Mental Clarity Power Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pre-Practice Assessment</h3>
              <p className="text-gray-600 mb-4">Rate your current brain fog level (0-10):</p>
              <div className="flex gap-2 mb-6">
                {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button key={level} variant={practiceData.preFogLevel === level ? "default" : "outline"} size="sm" onClick={() => setPracticeData(prev => ({...prev, preFogLevel: level}))} className="w-10 h-10 p-0">{level}</Button>
                ))}
              </div>
              <Button onClick={() => setCurrentStep(1)} disabled={practiceData.preFogLevel === 0}>Continue</Button>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose and Practice Techniques</h3>
              <div className="grid gap-3">
                {techniques.map(t => (
                  <label key={t} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input type="checkbox" checked={practiceData.completedTechniques.includes(t)} onChange={(e) => setPracticeData(prev => ({...prev, completedTechniques: e.target.checked ? [...prev.completedTechniques, t] : prev.completedTechniques.filter(x => x !== t)}))} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6"><Button onClick={() => setCurrentStep(2)} disabled={practiceData.completedTechniques.length === 0}>Complete Practice</Button></div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Post-Practice Review</h3>
              <div className="flex gap-2 mb-4">
                {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button key={level} variant={practiceData.postFogLevel === level ? "default" : "outline"} size="sm" onClick={() => setPracticeData(prev => ({...prev, postFogLevel: level}))} className="w-10 h-10 p-0">{level}</Button>
                ))}
              </div>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(level => (
                  <Button key={level} variant={practiceData.effectiveness === level ? "default" : "outline"} size="sm" onClick={() => setPracticeData(prev => ({...prev, effectiveness: level}))} className="w-10 h-10 p-0">{level}</Button>
                ))}
              </div>
              <Button className="mt-6 w-full" onClick={() => onComplete('brain-fog-exercise', { ...practiceData, improvement: practiceData.preFogLevel - practiceData.postFogLevel, completedAt: new Date().toISOString() })}>Save Results</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Week1({ component, onComplete, onClose }: WeekProps) {
  const id = (component?.id || '').toString();
  if (id === 'focus-memory-rituals') return <InteractiveFocusMemoryRituals onComplete={onComplete} onClose={onClose} />;
  if (id === 'cortisol-breathwork') return <CortisolResetBreathwork onComplete={onComplete} onClose={onClose} />;
  if (id === 'mental-space-reset') return <ResettingYourMentalSpace onComplete={onComplete} onClose={onClose} />;
  if (id === 'symptom-tracker') return <InteractiveSymptomTracker onComplete={onComplete} onClose={onClose} />;
  if (id === 'morning-ritual') return <MorningRitualCreator onComplete={onComplete} onClose={onClose} />;
  if (id === 'brain-fog-exercise') return <BrainFogClearingPractice onComplete={onComplete} onClose={onClose} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Component Not Found</h3>
            <p className="text-muted-foreground mb-6">This Week 1 component is not yet extracted.</p>
            <Button onClick={onClose}>Back to Program</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



