import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BreathworkVagusProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function BreathworkVagus({ onComplete, onClose }: BreathworkVagusProps) {
  const [activeExercise, setActiveExercise] = useState<'box' | 'coherence' | 'cold' | 'humming'>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // Box breathing states
  const [boxPhase, setBoxPhase] = useState(0); // 0: inhale, 1: hold, 2: exhale, 3: hold
  const [boxCount, setBoxCount] = useState(0);
  
  // Heart coherence states
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  const exercises = [
    {
      id: 'box',
      title: '📦 Box Breathing',
      subtitle: 'Navy SEAL technique for instant calm',
      description: 'Equal counts of inhale, hold, exhale, hold',
      duration: '5 minutes',
      benefits: ['Activates parasympathetic nervous system', 'Reduces cortisol levels', 'Improves focus and decision-making']
    },
    {
      id: 'coherence',
      title: '💖 Heart Coherence',
      subtitle: 'Sync your heart and mind',
      description: 'Breathe into your heart center with appreciation',
      duration: '3 minutes',
      benefits: ['Balances autonomic nervous system', 'Increases emotional resilience', 'Improves heart rate variability']
    },
    {
      id: 'cold',
      title: '❄️ Cold Exposure Breathing',
      subtitle: 'Wim Hof method for stress resilience',
      description: 'Power breathing to build stress tolerance',
      duration: '3 rounds',
      benefits: ['Strengthens vagus nerve', 'Improves stress response', 'Boosts immune function']
    },
    {
      id: 'humming',
      title: '🎵 Vagus Nerve Humming',
      subtitle: 'Direct vagal stimulation',
      description: 'Humming vibrations activate the vagus nerve',
      duration: '2 minutes',
      benefits: ['Direct vagus nerve activation', 'Reduces inflammation', 'Calms nervous system instantly']
    }
  ];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        if (activeExercise === 'box' && boxCount < 4) {
          setBoxCount(prev => (prev + 1) % 4);
          if (boxCount === 3) {
            setBreathCount(prev => prev + 1);
          }
        }
        
        if (activeExercise === 'coherence') {
          setHeartRate(prev => 70 + Math.sin(sessionTime / 5) * 8);
          setCoherenceScore(prev => Math.min(100, prev + Math.random() * 3));
        }
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
  }, [isActive, sessionTime, boxCount, activeExercise]);

  const startExercise = () => {
    setIsActive(true);
    setSessionTime(0);
    setBreathCount(0);
    setBoxCount(0);
    setCoherenceScore(0);
    setProgress(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (!completedExercises.includes(activeExercise)) {
      setCompletedExercises(prev => [...prev, activeExercise]);
    }
  };

  const getPhaseText = () => {
    switch (activeExercise) {
      case 'box':
        const phases = ['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)', 'Hold (4s)'];
        return phases[boxCount];
      case 'coherence':
        return sessionTime % 10 < 5 ? 'Breathe In with Gratitude' : 'Breathe Out Stress';
      case 'cold':
        return sessionTime % 8 < 6 ? 'Power Inhale' : 'Quick Exhale';
      case 'humming':
        return sessionTime % 12 < 8 ? 'Inhale Deeply' : 'Hum on Exhale';
      default:
        return 'Breathe';
    }
  };

  const getExerciseInstructions = () => {
    switch (activeExercise) {
      case 'box':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Box Breathing Instructions</h4>
            <div className="space-y-3 text-sm text-blue-700">
              <p>• Sit comfortably with your back straight</p>
              <p>• Inhale through your nose for 4 counts</p>
              <p>• Hold your breath for 4 counts</p>
              <p>• Exhale through your mouth for 4 counts</p>
              <p>• Hold empty for 4 counts</p>
              <p>• Repeat for 5-10 cycles</p>
            </div>
            {isActive && (
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-blue-800 mb-2">{getPhaseText()}</div>
                <div className="text-lg">Breath #{breathCount + 1}</div>
                <Progress value={(sessionTime % 16) * 6.25} className="mt-2" />
              </div>
            )}
          </div>
        );
      
      case 'coherence':
        return (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <h4 className="font-semibold text-pink-800 mb-3">Heart Coherence Instructions</h4>
            <div className="space-y-3 text-sm text-pink-700">
              <p>• Place one hand on your heart</p>
              <p>• Breathe slowly and deeply into your heart area</p>
              <p>• As you inhale, imagine breathing in appreciation and love</p>
              <p>• As you exhale, release any stress or tension</p>
              <p>• Feel your heart rhythm becoming more coherent</p>
            </div>
            {isActive && (
              <div className="mt-4 text-center space-y-3">
                <div className="text-2xl font-bold text-pink-800">{getPhaseText()}</div>
                <div className="flex justify-between text-sm">
                  <span>Heart Rate: {Math.round(heartRate)} BPM</span>
                  <span>Coherence: {Math.round(coherenceScore)}%</span>
                </div>
                <Progress value={coherenceScore} className="mt-2" />
              </div>
            )}
          </div>
        );
      
      case 'cold':
        return (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
            <h4 className="font-semibold text-cyan-800 mb-3">Cold Exposure Breathing</h4>
            <div className="space-y-3 text-sm text-cyan-700">
              <p>• Take 30 deep, powerful breaths</p>
              <p>• Inhale fully, exhale without forcing</p>
              <p>• After 30 breaths, exhale and hold your breath</p>
              <p>• Hold as long as comfortable</p>
              <p>• Take a deep breath and hold for 15 seconds</p>
              <p>• Repeat for 3 rounds</p>
            </div>
            {isActive && (
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-cyan-800 mb-2">{getPhaseText()}</div>
                <div className="text-lg">Round {Math.floor(breathCount / 30) + 1} - Breath #{(breathCount % 30) + 1}</div>
                <Progress value={(breathCount % 30) * 3.33} className="mt-2" />
              </div>
            )}
          </div>
        );
      
      case 'humming':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-3">Vagus Nerve Humming</h4>
            <div className="space-y-3 text-sm text-purple-700">
              <p>• Sit comfortably and close your eyes</p>
              <p>• Take a deep breath in through your nose</p>
              <p>• Exhale while humming "Mmmmm" or "Ahhhhh"</p>
              <p>• Feel the vibrations in your chest and throat</p>
              <p>• The vibrations directly stimulate your vagus nerve</p>
              <p>• Continue for 2-3 minutes</p>
            </div>
            {isActive && (
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-purple-800 mb-2">{getPhaseText()}</div>
                <div className="text-lg">Session time: {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}</div>
                <Progress value={(sessionTime / 180) * 100} className="mt-2" />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sage-800 mb-4">🌬️ Breathwork & Vagus Nerve Reset</h2>
        <p className="text-lg text-gray-600 mb-6">
          Master breathing techniques that activate your parasympathetic nervous system and regulate stress hormones
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-sage-800">Choose Your Breathing Practice</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {exercises.map((exercise) => {
            const isCompleted = completedExercises.includes(exercise.id);
            const isCurrentlyActive = activeExercise === exercise.id;
            
            return (
              <button
                key={exercise.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md text-left ${
                  isCurrentlyActive
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                onClick={() => setActiveExercise(exercise.id as any)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{exercise.title}</h4>
                  {isCompleted && <span className="text-green-600">✓</span>}
                </div>
                <p className="text-sm text-blue-600 font-medium mb-1">{exercise.subtitle}</p>
                <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                <div className="text-xs text-gray-500 mb-2">Duration: {exercise.duration}</div>
                <div className="space-y-1">
                  {exercise.benefits.map((benefit, idx) => (
                    <div key={idx} className="text-xs text-gray-600">• {benefit}</div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {getExerciseInstructions()}

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={isActive ? stopExercise : startExercise}
            className={`px-8 py-3 ${
              isActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isActive ? 'Stop Practice' : 'Start Practice'}
          </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-amber-800 mb-2">🧠 Science for Midlife Women</h4>
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>Vagus Nerve & Hormones:</strong> Breathing exercises activate your vagus nerve, which helps regulate cortisol and supports hormone balance during perimenopause.</p>
            <p><strong>Stress Resilience:</strong> Regular breathwork strengthens your nervous system's ability to recover from hot flashes, anxiety, and daily stressors.</p>
            <p><strong>Sleep Quality:</strong> These techniques activate your "rest and digest" system, improving sleep quality disrupted by hormonal changes.</p>
            <p><strong>Emotional Regulation:</strong> Breathwork helps manage mood swings and emotional intensity common during midlife transitions.</p>
          </div>
        </div>

        {completedExercises.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-green-800 mb-2">🎉 Progress Summary</h4>
            <p className="text-sm text-green-700">
              You've completed {completedExercises.length} out of {exercises.length} breathing exercises. 
              Each practice strengthens your vagus nerve and builds stress resilience!
            </p>
            <div className="mt-2">
              <Progress value={(completedExercises.length / exercises.length) * 100} className="h-2" />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <Button 
          onClick={() => onComplete('w4-breathwork', { 
            completedExercises,
            totalSessionTime: sessionTime,
            completed: true 
          })}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          Complete Breathwork Session
        </Button>
      </div>
    </div>
  );
}