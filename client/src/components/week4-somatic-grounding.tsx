import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Timer, Heart, Zap } from 'lucide-react';

interface Week4SomaticGroundingProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function Week4SomaticGrounding({ onComplete, onClose }: Week4SomaticGroundingProps) {
  const [activeTechnique, setActiveTechnique] = useState<'grounding' | 'bodyscan' | 'breathing' | 'progressive' | 'nervous-system'>('grounding');
  const [responses, setResponses] = useState({
    sight: '',
    hearing: '',
    touch: '',
    smell: '',
    taste: ''
  });
  const [stressLevel, setStressLevel] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [tensionReleased, setTensionReleased] = useState<Record<string, boolean>>({});
  const [nervousSystemState, setNervousSystemState] = useState('assessment');
  
  const timerRef = useRef<NodeJS.Timeout>();

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

  const progressiveSteps = [
    { muscle: 'Hands and Arms', instruction: 'Make fists, hold for 5 seconds, then release', benefit: 'Releases upper body tension' },
    { muscle: 'Face and Scalp', instruction: 'Scrunch your face tightly, hold, then soften', benefit: 'Relieves facial tension and headaches' },
    { muscle: 'Neck and Shoulders', instruction: 'Lift shoulders to ears, hold, then drop', benefit: 'Reduces stress-related neck pain' },
    { muscle: 'Chest and Back', instruction: 'Pull shoulder blades together, hold, release', benefit: 'Opens chest and improves posture' },
    { muscle: 'Abdomen', instruction: 'Tighten core muscles, hold, then soften', benefit: 'Releases digestive tension' },
    { muscle: 'Legs and Feet', instruction: 'Point toes, tighten legs, hold, then relax', benefit: 'Grounds and stabilizes your energy' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({ ...prev, [field]: value }));
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

  const startBreathingExercise = () => {
    setIsActive(true);
    setSessionTime(0);
    setBreathCount(0);
  };

  const stopBreathingExercise = () => {
    setIsActive(false);
    if (!completedTechniques.includes('breathing')) {
      setCompletedTechniques(prev => [...prev, 'breathing']);
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

  useEffect(() => {
    if (isActive && activeTechnique === 'breathing') {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setBreathCount(prev => prev + 1);
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
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sage-50 to-blue-50 p-6 rounded-lg">
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

            <div className="grid md:grid-cols-2 gap-4">
              <button 
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  activeTechnique === 'progressive' 
                    ? 'border-orange-500 bg-orange-50 shadow-md' 
                    : 'border-orange-200 bg-white hover:border-orange-300'
                }`}
                onClick={() => setActiveTechnique('progressive')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💪</span>
                  <h4 className="font-semibold text-orange-800">Progressive Relaxation</h4>
                </div>
                <p className="text-sm text-gray-600">Tense and release muscle groups for deep relaxation</p>
              </button>
              
              <button 
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  activeTechnique === 'nervous-system' 
                    ? 'border-red-500 bg-red-50 shadow-md' 
                    : 'border-red-200 bg-white hover:border-red-300'
                }`}
                onClick={() => setActiveTechnique('nervous-system')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-semibold text-red-800">Nervous System Reset</h4>
                </div>
                <p className="text-sm text-gray-600">Quick techniques for immediate regulation</p>
              </button>
            </div>
          </div>

          {/* 5-4-3-2-1 Grounding Exercise */}
          {activeTechnique === 'grounding' && (
            <Card>
              <CardHeader>
                <CardTitle>🎯 5-4-3-2-1 Grounding Technique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This technique uses your five senses to ground you in the present moment. Take your time with each step:
                </p>
                
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

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">🌟 Notice the Difference</h5>
                  <p className="text-blue-700 text-sm mb-3">
                    How do you feel now compared to when you started? Even this simple practice can shift your nervous system from fight-or-flight to rest-and-digest.
                  </p>
                  <Button 
                    onClick={() => markTechniqueComplete('grounding')}
                    disabled={completedTechniques.includes('grounding')}
                    className="w-full"
                  >
                    {completedTechniques.includes('grounding') ? 'Completed ✓' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Body Scan Exercise */}
          {activeTechnique === 'bodyscan' && (
            <Card>
              <CardHeader>
                <CardTitle>💆‍♀️ Guided Body Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Step {currentBodyPart + 1} of {bodyPartsForScan.length}
                    </span>
                    <Progress value={((currentBodyPart + 1) / bodyPartsForScan.length) * 100} className="w-32" />
                  </div>
                </div>

                {!isActive ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      Find a comfortable position and close your eyes if you feel safe doing so. We'll systematically scan through your body, releasing tension as we go.
                    </p>
                    <Button onClick={startBodyScan} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Body Scan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">
                        Focus on: {bodyPartsForScan[currentBodyPart].name}
                      </h5>
                      <p className="text-green-700 text-sm mb-3">
                        {bodyPartsForScan[currentBodyPart].instruction}
                      </p>
                      <p className="text-green-600 text-xs">
                        Take 10-15 seconds to really notice this area of your body. Breathe into any tension you find.
                      </p>
                    </div>
                    
                    <Button onClick={nextBodyPart} className="w-full">
                      {currentBodyPart < bodyPartsForScan.length - 1 ? 'Next Area' : 'Complete Body Scan'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4-7-8 Breathing Exercise */}
          {activeTechnique === 'breathing' && (
            <Card>
              <CardHeader>
                <CardTitle>🌬️ 4-7-8 Breathing Exercise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    This breathing pattern activates your parasympathetic nervous system. Inhale for 4, hold for 7, exhale for 8.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4</div>
                      <div className="text-sm text-blue-800">Inhale</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">7</div>
                      <div className="text-sm text-yellow-800">Hold</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-green-800">Exhale</div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="text-lg font-semibold text-purple-800">
                        Session Time: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-purple-600">
                        Breaths: {Math.floor(breathCount / 19)} cycles
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button onClick={startBreathingExercise} className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Start Breathing
                      </Button>
                    ) : (
                      <Button onClick={stopBreathingExercise} variant="outline" className="flex-1">
                        <Pause className="w-4 h-4 mr-2" />
                        Complete Session
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progressive Muscle Relaxation */}
          {activeTechnique === 'progressive' && (
            <Card>
              <CardHeader>
                <CardTitle>💪 Progressive Muscle Relaxation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Systematically tense and release each muscle group. Check off each step as you complete it:
                </p>
                
                <div className="space-y-3">
                  {progressiveSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={tensionReleased[step.muscle] || false}
                        onChange={() => toggleTensionRelease(step.muscle)}
                        className="mt-1 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.muscle}</div>
                        <div className="text-sm text-gray-600">{step.instruction}</div>
                        <div className="text-xs text-gray-500 mt-1">{step.benefit}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(tensionReleased).length === progressiveSteps.length && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Button 
                      onClick={() => markTechniqueComplete('progressive')}
                      disabled={completedTechniques.includes('progressive')}
                      className="w-full"
                    >
                      {completedTechniques.includes('progressive') ? 'Completed ✓' : 'Complete Progressive Relaxation'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Nervous System Reset */}
          {activeTechnique === 'nervous-system' && (
            <Card>
              <CardHeader>
                <CardTitle>⚡ Quick Nervous System Reset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">🧊 Cold Water Reset</h5>
                    <p className="text-red-700 text-sm mb-3">
                      Run cold water over your wrists or splash your face. The vagus nerve responds immediately to cold.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => markTechniqueComplete('cold-reset')}>
                      Tried It
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">🎵 Humming/Singing</h5>
                    <p className="text-blue-700 text-sm mb-3">
                      Hum or sing for 30 seconds. The vibrations stimulate the vagus nerve and calm your system.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => markTechniqueComplete('humming')}>
                      Tried It
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">👁️ Eye Movement</h5>
                    <p className="text-green-700 text-sm mb-3">
                      Slowly look left, then right, then up and down. This bilateral movement helps regulate your nervous system.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => markTechniqueComplete('eye-movement')}>
                      Tried It
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">🤗 Self-Hug</h5>
                    <p className="text-purple-700 text-sm mb-3">
                      Wrap your arms around yourself and squeeze gently. This releases oxytocin and calms your nervous system.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => markTechniqueComplete('self-hug')}>
                      Tried It
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <Button 
                    onClick={() => markTechniqueComplete('nervous-system')}
                    disabled={completedTechniques.includes('nervous-system')}
                    className="w-full"
                  >
                    {completedTechniques.includes('nervous-system') ? 'Completed ✓' : 'Complete Reset Techniques'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Completion */}
      <div className="text-center mt-8">
        <Button 
          onClick={() => onComplete('w4-grounding', { 
            completedTechniques,
            stressLevel,
            symptoms,
            responses,
            tensionReleased
          })}
          className="w-full md:w-auto px-8"
          disabled={completedTechniques.length === 0}
        >
          Complete Somatic Grounding Session
        </Button>
        
        <p className="text-sm text-gray-500 mt-2">
          Complete at least one technique to finish this session
        </p>
      </div>
    </div>
  );
}