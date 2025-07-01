import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, Clover, Hand, Play, Pause, SkipBack, SkipForward, Minus, Plus } from 'lucide-react';

export function MeditationTimer() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale');
  const [meditationTime, setMeditationTime] = useState(600); // 10 minutes in seconds
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationRemaining, setMeditationRemaining] = useState(600);
  const [groundingActive, setGroundingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState('5 things you can see');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState('Week 4: Nervous System Reset');

  const breathingInterval = useRef<NodeJS.Timeout>();
  const meditationInterval = useRef<NodeJS.Timeout>();
  const groundingInterval = useRef<NodeJS.Timeout>();

  const breathingCycle = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const breathingDurations = [4, 7, 8, 1]; // 4-7-8 breathing pattern
  const groundingSteps = [
    '5 things you can see',
    '4 things you can touch',
    '3 things you can hear',
    '2 things you can smell',
    '1 thing you can taste'
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreathing = () => {
    if (breathingActive) {
      setBreathingActive(false);
      if (breathingInterval.current) clearInterval(breathingInterval.current);
      return;
    }

    setBreathingActive(true);
    let phaseIndex = 0;
    let phaseTime = 0;

    const runBreathingCycle = () => {
      const currentPhaseDuration = breathingDurations[phaseIndex];
      
      if (phaseTime === 0) {
        setBreathingPhase(breathingCycle[phaseIndex]);
      }
      
      phaseTime++;
      
      if (phaseTime >= currentPhaseDuration) {
        phaseIndex = (phaseIndex + 1) % breathingCycle.length;
        phaseTime = 0;
      }
    };

    breathingInterval.current = setInterval(runBreathingCycle, 1000);
  };

  const startMeditation = () => {
    if (meditationActive) {
      setMeditationActive(false);
      if (meditationInterval.current) clearInterval(meditationInterval.current);
      return;
    }

    setMeditationActive(true);
    setMeditationRemaining(meditationTime);

    meditationInterval.current = setInterval(() => {
      setMeditationRemaining(prev => {
        if (prev <= 1) {
          setMeditationActive(false);
          // Play completion sound or notification
          return meditationTime;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const adjustMeditationTime = (increment: number) => {
    if (!meditationActive) {
      const newTime = Math.max(60, Math.min(3600, meditationTime + increment));
      setMeditationTime(newTime);
      setMeditationRemaining(newTime);
    }
  };

  const startGrounding = () => {
    if (groundingActive) {
      setGroundingActive(false);
      if (groundingInterval.current) clearInterval(groundingInterval.current);
      setGroundingStep(groundingSteps[0]);
      return;
    }

    setGroundingActive(true);
    let stepIndex = 0;
    setGroundingStep(groundingSteps[stepIndex]);

    groundingInterval.current = setInterval(() => {
      stepIndex++;
      if (stepIndex >= groundingSteps.length) {
        setGroundingActive(false);
        setGroundingStep('Exercise Complete!');
        setTimeout(() => setGroundingStep(groundingSteps[0]), 2000);
        return;
      }
      setGroundingStep(groundingSteps[stepIndex]);
    }, 30000); // 30 seconds per step
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    // Here you would integrate with actual audio playback
  };

  useEffect(() => {
    return () => {
      if (breathingInterval.current) clearInterval(breathingInterval.current);
      if (meditationInterval.current) clearInterval(meditationInterval.current);
      if (groundingInterval.current) clearInterval(groundingInterval.current);
    };
  }, []);

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-sage-50 via-white to-primary-50 rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 gradient-sage rounded-xl flex items-center justify-center">
              <Clover className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Mindfulness & Breathing</h2>
          </div>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Take a moment to center yourself with guided breathing exercises and meditation practices 
            designed to support nervous system regulation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Breathing Exercise */}
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">4-7-8 Breathing</h3>
                <p className="text-sm text-gray-600 mb-4">Calm your nervous system with this simple breathing pattern</p>
                <div className={`text-3xl font-bold mb-4 ${breathingActive ? 'text-sage-600' : 'text-gray-400'}`}>
                  {breathingPhase}
                </div>
                <Button 
                  onClick={startBreathing}
                  className={`w-full ${breathingActive ? 'btn-secondary' : 'btn-secondary'}`}
                >
                  {breathingActive ? 'Stop Session' : 'Start Session'}
                </Button>
              </CardContent>
            </Card>

            {/* Meditation Timer */}
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clover className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Meditation Timer</h3>
                <p className="text-sm text-gray-600 mb-4">Set a timer for your personal meditation practice</p>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustMeditationTime(-60)}
                    disabled={meditationActive}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-3xl font-bold text-primary-600">
                    {formatTime(meditationActive ? meditationRemaining : meditationTime)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustMeditationTime(60)}
                    disabled={meditationActive}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={startMeditation}
                  className="w-full btn-primary"
                >
                  {meditationActive ? 'Stop Timer' : 'Start Timer'}
                </Button>
              </CardContent>
            </Card>

            {/* Grounding Exercise */}
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hand className="w-8 h-8 text-coral-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">5-4-3-2-1 Grounding</h3>
                <p className="text-sm text-gray-600 mb-4">Ground yourself using your five senses</p>
                <div className="text-lg font-medium text-coral-600 mb-4 h-12 flex items-center justify-center">
                  {groundingStep}
                </div>
                <Button
                  onClick={startGrounding}
                  className="w-full btn-coral"
                >
                  {groundingActive ? 'Stop Exercise' : 'Begin Exercise'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Audio Controls */}
          <Card className="wellness-card max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Guided Meditation</h3>
              <div className="flex items-center justify-center space-x-6 mb-4">
                <Button variant="outline" size="sm">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button onClick={toggleAudio} size="lg" className="btn-primary">
                  {audioPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-800 mb-2">{currentTrack}</div>
                <div className="text-sm text-gray-500">Guided grounding meditation • 12:30</div>
              </div>
              <Progress value={audioProgress} className="w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
