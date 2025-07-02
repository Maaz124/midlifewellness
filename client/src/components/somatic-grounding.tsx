import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SomaticGroundingProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function SomaticGrounding({ onComplete, onClose }: SomaticGroundingProps) {
  const [responses, setResponses] = useState({
    sight: '',
    hearing: '',
    touch: '',
    smell: '',
    taste: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👁️</span>
              <h4 className="font-semibold text-blue-800">5-4-3-2-1 Grounding</h4>
            </div>
            <p className="text-sm text-gray-600">Use your senses to anchor yourself in the present moment</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💆‍♀️</span>
              <h4 className="font-semibold text-green-800">Body Scan</h4>
            </div>
            <p className="text-sm text-gray-600">Systematically release tension throughout your body</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌬️</span>
              <h4 className="font-semibold text-purple-800">4-7-8 Breathing</h4>
            </div>
            <p className="text-sm text-gray-600">Rhythmic breathing to activate relaxation</p>
          </div>
        </div>

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
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
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

      <div className="text-center">
        <Button 
          onClick={() => onComplete('w4-grounding', { responses, completed: true })}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Grounding Practice
        </Button>
      </div>
    </div>
  );
}