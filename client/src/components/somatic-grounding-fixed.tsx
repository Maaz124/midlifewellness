import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SomaticGroundingFixedProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function SomaticGroundingFixed({ onComplete, onClose }: SomaticGroundingFixedProps) {
  const [activeTechnique, setActiveTechnique] = useState<'grounding' | 'bodyscan' | 'breathing'>('grounding');
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

  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

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
        <h2 className="text-3xl font-bold text-sage-800 mb-4">🌱 Somatic Grounding Practices</h2>
        <p className="text-lg text-gray-600 mb-6">
          Body-based techniques to regulate your nervous system and find calm in moments of stress
        </p>
      </div>

      <div className="bg-gradient-to-r from-sage-50 to-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-sage-800">Interactive Grounding Session</h3>
        <p className="text-gray-700 mb-4">
          This is your dedicated space for learning and practicing nervous system regulation techniques specifically designed for midlife women.
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