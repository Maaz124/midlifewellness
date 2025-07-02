import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface GuidedMeditationProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function GuidedMeditation({ onComplete, onClose }: GuidedMeditationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10); // minutes
  const [currentPhase, setCurrentPhase] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(4);

  const intervalRef = useRef<NodeJS.Timeout>();
  const totalDuration = selectedDuration * 60; // Convert to seconds

  const meditationScript = {
    5: [
      { time: 0, phase: 'Welcome', instruction: 'Welcome to your grounding meditation. Find a comfortable position and close your eyes.' },
      { time: 30, phase: 'Settling', instruction: 'Take three deep breaths, allowing your body to settle into this moment.' },
      { time: 60, phase: 'Body Awareness', instruction: 'Notice your body supported by the chair or floor. Feel the weight of your body.' },
      { time: 120, phase: 'Breath Focus', instruction: 'Now bring attention to your natural breath, without changing it.' },
      { time: 180, phase: 'Grounding', instruction: 'Feel your connection to the earth beneath you. You are safe and supported.' },
      { time: 240, phase: 'Integration', instruction: 'Take a moment to appreciate this sense of calm and groundedness.' },
      { time: 270, phase: 'Closing', instruction: 'When you\'re ready, gently open your eyes and return to the room.' }
    ],
    10: [
      { time: 0, phase: 'Welcome', instruction: 'Welcome to your grounding meditation. Find a comfortable position and close your eyes.' },
      { time: 60, phase: 'Settling', instruction: 'Take five deep breaths, allowing tension to melt away with each exhale.' },
      { time: 120, phase: 'Body Scan', instruction: 'Starting from the top of your head, slowly scan down through your body.' },
      { time: 240, phase: 'Emotional Awareness', instruction: 'Notice any emotions present without judgment. They are welcome here.' },
      { time: 360, phase: 'Breath Anchor', instruction: 'Use your breath as an anchor, returning here whenever your mind wanders.' },
      { time: 480, phase: 'Loving Kindness', instruction: 'Send yourself compassion for all you\'ve been through, especially during this life transition.' },
      { time: 540, phase: 'Integration', instruction: 'Feel this sense of peace settling into every cell of your body.' },
      { time: 570, phase: 'Closing', instruction: 'Carry this feeling of groundedness with you as you slowly return.' }
    ],
    15: [
      { time: 0, phase: 'Welcome', instruction: 'Welcome to your extended grounding meditation. Settle into your sacred space.' },
      { time: 90, phase: 'Deep Settling', instruction: 'Allow yourself to fully arrive here. There\'s nowhere else you need to be.' },
      { time: 180, phase: 'Body Connection', instruction: 'Feel the wisdom of your body, honoring all the changes it\'s experiencing.' },
      { time: 360, phase: 'Emotional Presence', instruction: 'Welcome any emotions that arise. They are messengers worthy of your attention.' },
      { time: 540, phase: 'Nervous System Reset', instruction: 'Imagine your nervous system finding its natural rhythm, like waves on a calm shore.' },
      { time: 720, phase: 'Self-Compassion', instruction: 'Place your hand on your heart. Feel the love you have for yourself growing.' },
      { time: 810, phase: 'Future Self', instruction: 'Connect with your wise, future self who has navigated this transition beautifully.' },
      { time: 870, phase: 'Closing', instruction: 'Take these final moments to anchor this peace deeply within you.' }
    ]
  };

  const currentScript = meditationScript[selectedDuration as keyof typeof meditationScript] || meditationScript[10];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Update breathing animation
          const breathCycle = Math.floor(newTime / 4) % 2; // 4 seconds inhale/exhale
          setBreathingPhase(breathCycle === 0 ? 'inhale' : 'exhale');
          setBreathingCount(4 - (newTime % 4));
          
          // Find current instruction
          const currentInstructionObj = currentScript
            .slice()
            .reverse()
            .find(item => newTime >= item.time);
          
          if (currentInstructionObj) {
            setCurrentPhase(currentInstructionObj.phase);
            setCurrentInstruction(currentInstructionObj.instruction);
          }
          
          // Check if meditation is complete
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            setSessionCompleted(true);
            return totalDuration;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalDuration, currentScript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetMeditation = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setSessionCompleted(false);
    setCurrentPhase('');
    setCurrentInstruction('');
  };

  const progressPercentage = (currentTime / totalDuration) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          onClick={onClose}
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Week 4
        </Button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sage-800 mb-4">🧘‍♀️ Guided Grounding Meditation</h2>
        <p className="text-lg text-gray-600 mb-6">
          A specialized meditation for midlife women to regulate the nervous system and find inner calm
        </p>
      </div>

      {!isPlaying && currentTime === 0 && !sessionCompleted && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">Choose Your Meditation Duration</CardTitle>
            <p className="text-gray-600">Select the length that feels right for you today</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            {[5, 10, 15].map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`p-4 rounded-lg border text-center transition-all hover:shadow-md ${
                  selectedDuration === duration
                    ? 'border-sage-500 bg-sage-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <div className="text-2xl font-bold text-sage-800 mb-1">{duration} min</div>
                <div className="text-sm text-gray-600">
                  {duration === 5 && 'Quick reset for busy moments'}
                  {duration === 10 && 'Balanced practice for daily calm'}
                  {duration === 15 && 'Deep restoration for stress relief'}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="bg-gradient-to-br from-sage-50 via-blue-50 to-purple-50 rounded-xl p-8 mb-6">
        <div className="text-center space-y-6">
          {/* Breathing Animation */}
          <div className="flex justify-center mb-6">
            <div 
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-sage-300 to-blue-300 flex items-center justify-center transition-all duration-1000 ${
                breathingPhase === 'inhale' ? 'scale-110' : 'scale-90'
              }`}
            >
              <div className="text-white font-medium text-center">
                <div className="text-lg">{breathingPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}</div>
                <div className="text-2xl font-bold">{breathingCount}</div>
              </div>
            </div>
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <div className="bg-white/70 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold text-sage-800 mb-2">{currentPhase}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{currentInstruction}</p>
            </div>
          )}

          {/* Time Display */}
          <div className="text-3xl font-bold text-sage-800 mb-4">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Progress value={progressPercentage} className="h-3 bg-white/50" />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
              disabled={sessionCompleted}
            >
              {isPlaying ? (
                <>
                  <Pause size={20} className="mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" />
                  {currentTime === 0 ? 'Start Meditation' : 'Resume'}
                </>
              )}
            </Button>

            {currentTime > 0 && (
              <Button
                onClick={resetMeditation}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                <RotateCcw size={20} className="mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preparation Tips */}
      {!isPlaying && currentTime === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-sage-800">Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Volume2 size={16} className="text-sage-600 mt-0.5" />
              <span>Find a quiet space where you won't be disturbed</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sage-600">🪑</span>
              <span>Sit comfortably with your back supported</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sage-600">📱</span>
              <span>Turn off notifications or put your phone in airplane mode</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sage-600">🧘‍♀️</span>
              <span>Close your eyes or soften your gaze downward</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {sessionCompleted && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
          <CardContent className="text-center p-6">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🌟 Meditation Complete</h3>
            <p className="text-green-700 mb-4">
              You've completed your {selectedDuration}-minute grounding meditation. Notice how you feel now compared to when you started.
            </p>
            <div className="bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Integration Practices</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Take a moment to journal about your experience</li>
                <li>• Notice any shifts in your body, mind, or emotions</li>
                <li>• Carry this sense of groundedness into your day</li>
                <li>• Return to this practice whenever you need centering</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits for Midlife Women */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-sage-800">Why This Practice Supports Midlife Women</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div>
            <strong className="text-sage-800">Nervous System Regulation:</strong> Regular meditation helps balance the autonomic nervous system, reducing hot flashes and anxiety.
          </div>
          <div>
            <strong className="text-sage-800">Hormone Balance:</strong> Mindfulness practices can help regulate cortisol and support overall hormonal health.
          </div>
          <div>
            <strong className="text-sage-800">Emotional Resilience:</strong> Meditation builds capacity to navigate the emotional changes of midlife with greater ease.
          </div>
          <div>
            <strong className="text-sage-800">Sleep Quality:</strong> Regular practice improves sleep patterns often disrupted during perimenopause.
          </div>
          <div>
            <strong className="text-sage-800">Self-Compassion:</strong> Develops a kinder relationship with yourself during this time of transition.
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => onComplete('w4-meditation', {
            duration: selectedDuration,
            sessionCompleted: sessionCompleted,
            sessionTime: currentTime,
            completed: true
          })}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          Complete Meditation Session
        </Button>
      </div>
    </div>
  );
}