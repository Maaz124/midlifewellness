import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Timer, Heart, Zap } from 'lucide-react';

interface SomaticGroundingFixedProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function SomaticGroundingFixed({ onComplete, onClose }: SomaticGroundingFixedProps) {
  const [activeTechnique, setActiveTechnique] = useState<'grounding' | 'bodyscan' | 'breathing' | 'nervous-system' | 'progressive'>('grounding');
  const [responses, setResponses] = useState({
    sight: '',
    hearing: '',
    touch: '',
    smell: '',
    taste: ''
  });
  const [bodyParts, setBodyParts] = useState<Record<string, boolean>>({});
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [nervousSystemState, setNervousSystemState] = useState('assessment');
  const [stressLevel, setStressLevel] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([]);
  const [progressiveStep, setProgressiveStep] = useState(0);
  const [tensionReleased, setTensionReleased] = useState<Record<string, boolean>>({});
  
  const timerRef = useRef<NodeJS.Timeout>();

  // Data and handlers
  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const nervousSystemSymptoms = [
    { id: 'racing-heart', name: 'Racing heart or palpitations', category: 'physical' },
    { id: 'shallow-breathing', name: 'Shallow or rapid breathing', category: 'physical' },
    { id: 'muscle-tension', name: 'Muscle tension or clenching', category: 'physical' },
    { id: 'digestive-issues', name: 'Digestive discomfort', category: 'physical' },
    { id: 'racing-thoughts', name: 'Racing thoughts or mental chatter', category: 'mental' },
    { id: 'overwhelm', name: 'Feeling overwhelmed or scattered', category: 'mental' },
    { id: 'irritability', name: 'Irritability or emotional reactivity', category: 'emotional' },
    { id: 'anxiety', name: 'Anxiety or worry', category: 'emotional' },
    { id: 'fatigue', name: 'Fatigue or feeling drained', category: 'energy' },
    { id: 'restlessness', name: 'Restlessness or inability to settle', category: 'energy' }
  ];

  const bodyPartsForScan = [
    { name: 'Crown of head', instruction: 'Notice any tension or sensations at the top of your head' },
    { name: 'Forehead and temples', instruction: 'Release any furrowing or holding in your brow' },
    { name: 'Eyes and jaw', instruction: 'Let your eyes soften and jaw drop slightly open' },
    { name: 'Neck and shoulders', instruction: 'Allow your shoulders to drop away from your ears' },
    { name: 'Arms and hands', instruction: 'Let your arms feel heavy and hands rest completely' },
    { name: 'Chest and heart', instruction: 'Breathe space into your chest and heart center' },
    { name: 'Stomach and core', instruction: 'Release any holding or gripping in your belly' },
    { name: 'Lower back and hips', instruction: 'Let your lower back settle and hips release' },
    { name: 'Thighs and knees', instruction: 'Feel the weight of your legs completely supported' },
    { name: 'Calves and feet', instruction: 'Let your feet root down and legs feel heavy' }
  ];

  const progressiveRelaxationSteps = [
    { muscle: 'Hands and Arms', instruction: 'Make fists, hold for 5 seconds, then release', benefit: 'Releases upper body tension' },
    { muscle: 'Face and Scalp', instruction: 'Scrunch your face tightly, hold, then soften', benefit: 'Relieves facial tension and headaches' },
    { muscle: 'Neck and Shoulders', instruction: 'Lift shoulders to ears, hold, then drop', benefit: 'Reduces stress-related neck pain' },
    { muscle: 'Chest and Back', instruction: 'Pull shoulder blades together, hold, release', benefit: 'Opens chest and improves posture' },
    { muscle: 'Abdomen', instruction: 'Tighten core muscles, hold, then soften', benefit: 'Releases digestive tension' },
    { muscle: 'Legs and Feet', instruction: 'Point toes, tighten legs, hold, then relax', benefit: 'Grounds and stabilizes your energy' }
  ];

  useEffect(() => {
    if (isActive && activeTechnique === 'breathing') {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, activeTechnique]);

  const startBreathingExercise = () => {
    setIsActive(true);
    setIsBreathing(true);
    setSessionTime(0);
    setBreathCount(0);
  };

  const stopBreathingExercise = () => {
    setIsActive(false);
    setIsBreathing(false);
    if (!completedTechniques.includes('breathing')) {
      setCompletedTechniques(prev => [...prev, 'breathing']);
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const markTechniqueComplete = (technique: string) => {
    if (!completedTechniques.includes(technique)) {
      setCompletedTechniques(prev => [...prev, technique]);
    }
  };

  const startBodyScan = () => {
    setCurrentBodyPart(0);
    setIsActive(true);
  };

  const nextBodyPart = () => {
    if (currentBodyPart < bodyPartsForScan.length - 1) {
      setCurrentBodyPart(prev => prev + 1);
    } else {
      setIsActive(false);
      markTechniqueComplete('bodyscan');
    }
  };

  const toggleTensionRelease = (muscle: string) => {
    setTensionReleased(prev => ({
      ...prev,
      [muscle]: !prev[muscle]
    }));
  };

  const getProgressPercentage = () => {
    const totalTechniques = 5;
    return (completedTechniques.length / totalTechniques) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onClose}
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Week 4
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Progress: {completedTechniques.length}/5 techniques
          </div>
          <Progress value={getProgressPercentage()} className="w-24" />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sage-800 mb-4">🌱 Somatic Grounding Practices</h2>
        <p className="text-lg text-gray-600 mb-6">
          Body-based techniques to regulate your nervous system and find calm in moments of stress
        </p>
        
        {completedTechniques.length > 0 && (
          <div className="flex justify-center gap-2 mb-4">
            {completedTechniques.map(technique => (
              <Badge key={technique} variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {technique}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Nervous System Assessment */}
      {nervousSystemState === 'assessment' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Nervous System Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Let's start by assessing your current nervous system state. Check any symptoms you're experiencing:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {nervousSystemSymptoms.map(symptom => (
                <label key={symptom.id} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom.id)}
                    onChange={() => toggleSymptom(symptom.id)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <span className="font-medium">{symptom.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{symptom.category}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <label className="block font-medium text-gray-900 mb-2">
                Current stress level (1-10):
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Calm</span>
                <span className="font-semibold">{stressLevel}</span>
                <span>Very Stressed</span>
              </div>
            </div>

            <Button 
              onClick={() => setNervousSystemState('techniques')}
              className="w-full"
            >
              Begin Grounding Techniques
            </Button>
          </CardContent>
        </Card>
      )}

      {nervousSystemState === 'techniques' && (
        <>
          <div className="bg-gradient-to-r from-sage-50 to-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4 text-sage-800">Interactive Grounding Session</h3>
            <p className="text-gray-700 mb-4">
              Choose a technique below to begin your nervous system regulation practice:
            </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <button 
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              activeTechnique === 'grounding' 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-blue-200 bg-white hover:border-blue-300'
            }`}
            onClick={() => setActiveTechnique('grounding')}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👁️</span>
              <h4 className="font-semibold text-blue-800">5-4-3-2-1 Grounding</h4>
            </div>
            <p className="text-sm text-gray-600">Use your senses to anchor yourself in the present moment</p>
          </button>
          
          <button 
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              activeTechnique === 'bodyscan' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-green-200 bg-white hover:border-green-300'
            }`}
            onClick={() => setActiveTechnique('bodyscan')}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💆‍♀️</span>
              <h4 className="font-semibold text-green-800">Body Scan</h4>
            </div>
            <p className="text-sm text-gray-600">Systematically release tension throughout your body</p>
          </button>
          
          <button 
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              activeTechnique === 'breathing' 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-purple-200 bg-white hover:border-purple-300'
            }`}
            onClick={() => setActiveTechnique('breathing')}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌬️</span>
              <h4 className="font-semibold text-purple-800">4-7-8 Breathing</h4>
            </div>
            <p className="text-sm text-gray-600">Rhythmic breathing to activate relaxation</p>
          </button>
        </div>

        {activeTechnique === 'grounding' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-blue-800 mb-3">🎯 Try This Right Now - 5-4-3-2-1 Technique</h4>
            <p className="text-sm text-blue-700 mb-4">Take a moment to practice grounding yourself in the present moment:</p>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-blue-900 mb-2">👀 Name 5 things you can see:</label>
                <input 
                  type="text" 
                  placeholder="Blue coffee mug, sunlight through window, wooden table grain..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responses.sight}
                  onChange={(e) => handleInputChange('sight', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block font-medium text-blue-900 mb-2">👂 Name 4 things you can hear:</label>
                <input 
                  type="text" 
                  placeholder="Air conditioning humming, birds outside, your breathing..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responses.hearing}
                  onChange={(e) => handleInputChange('hearing', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block font-medium text-blue-900 mb-2">✋ Name 3 things you can touch:</label>
                <input 
                  type="text" 
                  placeholder="Smooth phone screen, soft fabric of your shirt, cool table surface..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responses.touch}
                  onChange={(e) => handleInputChange('touch', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block font-medium text-blue-900 mb-2">👃 Name 2 things you can smell:</label>
                <input 
                  type="text" 
                  placeholder="Coffee brewing, fresh air, cleaning products..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responses.smell}
                  onChange={(e) => handleInputChange('smell', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block font-medium text-blue-900 mb-2">👅 Name 1 thing you can taste:</label>
                <input 
                  type="text" 
                  placeholder="Lingering coffee, toothpaste, just the taste of your mouth..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={responses.taste}
                  onChange={(e) => handleInputChange('taste', e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 mb-4">
              <h4 className="font-semibold text-amber-800 mb-2">🌟 Notice the Difference</h4>
              <p className="text-sm text-amber-700">
                How do you feel now compared to when you started? Even this simple practice can shift your nervous system from stress to calm.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">💡 Why This Works for Midlife Women</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>• <strong>Hormonal regulation:</strong> Grounding activates your vagus nerve, helping balance stress hormones</p>
                <p>• <strong>Instant relief:</strong> Works during hot flashes, anxiety spikes, or overwhelming moments</p>
                <p>• <strong>Brain training:</strong> Strengthens your prefrontal cortex to manage emotional responses</p>
                <p>• <strong>Always available:</strong> No equipment needed - you can do this anywhere, anytime</p>
              </div>
            </div>
          </div>
        )}

        {activeTechnique === 'bodyscan' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-green-800 mb-3">💆‍♀️ Body Scan Practice</h4>
            <p className="text-sm text-green-700 mb-4">Systematically release tension throughout your body:</p>
            
            <div className="space-y-3">
              <p className="text-sm text-green-700 font-medium">Focus on each body part and notice any tension:</p>
              {['Head & Jaw', 'Neck & Shoulders', 'Arms & Hands', 'Chest & Heart', 'Abdomen', 'Lower Back', 'Hips', 'Thighs', 'Calves', 'Feet'].map((part, index) => (
                <div key={part} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id={`body-${index}`}
                    checked={bodyParts[part] || false}
                    onChange={(e) => setBodyParts(prev => ({ ...prev, [part]: e.target.checked }))}
                    className="rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor={`body-${index}`} className="text-sm text-green-800">{part} - Notice, breathe, release</label>
                </div>
              ))}
              
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                <h5 className="font-semibold text-green-800 mb-2">💡 For Midlife Women:</h5>
                <p className="text-sm text-green-700">Body scanning helps identify where you store stress and hormonal tension. Many women notice tight shoulders from carrying emotional load, or tension in the abdomen from perimenopause changes.</p>
              </div>
            </div>
          </div>
        )}

        {activeTechnique === 'breathing' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-purple-800 mb-3">🌬️ 4-7-8 Breathing Exercise</h4>
            <p className="text-sm text-purple-700 mb-4">Follow this rhythm to activate your relaxation response:</p>
            
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                <p className="text-lg font-semibold text-purple-800 mb-2">Breath Count: {breathCount}</p>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>1. Inhale through nose for 4 counts</p>
                  <p>2. Hold breath for 7 counts</p>
                  <p>3. Exhale through mouth for 8 counts</p>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setIsBreathing(!isBreathing);
                  if (!isBreathing) setBreathCount(prev => prev + 1);
                }}
                className={`px-6 py-3 ${isBreathing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}`}
              >
                {isBreathing ? 'Breathing...' : 'Start Breathing Exercise'}
              </Button>
              
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mt-4">
                <h5 className="font-semibold text-purple-800 mb-2">💡 Perfect for Hot Flashes:</h5>
                <p className="text-sm text-purple-700">This breathing pattern helps regulate your nervous system during hormonal surges and can reduce the intensity and duration of hot flashes.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <Button 
          onClick={() => onComplete('w4-grounding', { 
            activeTechnique, 
            responses, 
            bodyParts, 
            breathCount, 
            completed: true 
          })}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          Complete Grounding Practice
        </Button>
      </div>
    </div>
  );
}