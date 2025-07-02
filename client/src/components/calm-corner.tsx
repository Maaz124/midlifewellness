import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';

interface CalmCornerProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function CalmCorner({ onComplete, onClose }: CalmCornerProps) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [personalItems, setPersonalItems] = useState<string[]>([]);
  const [newPersonalItem, setNewPersonalItem] = useState('');
  const [calmingRituals, setCalmingRituals] = useState<string[]>([]);

  const locations = [
    { id: 'bedroom', name: 'Bedroom Corner', description: 'A quiet corner of your bedroom for morning or evening calm' },
    { id: 'living', name: 'Living Room Nook', description: 'A cozy spot in your main living space' },
    { id: 'office', name: 'Home Office Retreat', description: 'A calming area in your workspace for stress breaks' },
    { id: 'bathroom', name: 'Bathroom Sanctuary', description: 'Transform your bathroom into a spa-like retreat' },
    { id: 'outdoor', name: 'Outdoor Space', description: 'Garden, balcony, or patio calm corner' },
    { id: 'other', name: 'Other Space', description: 'Any other quiet area in your home' }
  ];

  const essentialItems = [
    { id: 'comfortable-chair', name: 'Comfortable Chair or Cushion', category: 'seating' },
    { id: 'soft-blanket', name: 'Soft Blanket or Throw', category: 'comfort' },
    { id: 'small-table', name: 'Small Side Table', category: 'practical' },
    { id: 'plants', name: 'Plants or Flowers', category: 'nature' },
    { id: 'candles', name: 'Candles', category: 'ambiance' },
    { id: 'essential-oils', name: 'Essential Oil Diffuser', category: 'aromatherapy' },
    { id: 'journal', name: 'Journal and Pen', category: 'reflection' },
    { id: 'books', name: 'Inspiring Books', category: 'mental' },
    { id: 'crystals', name: 'Crystals or Stones', category: 'energy' },
    { id: 'artwork', name: 'Calming Artwork or Photos', category: 'visual' },
    { id: 'water', name: 'Small Water Feature', category: 'nature' },
    { id: 'mirror', name: 'Small Mirror for Affirmations', category: 'reflection' }
  ];

  const colorPalettes = [
    { id: 'sage-lavender', name: 'Sage & Lavender', colors: ['#9CAF88', '#B19CD9'], description: 'Calming greens and purples for nervous system regulation' },
    { id: 'ocean-blues', name: 'Ocean Blues', colors: ['#5B9BD5', '#A8D0F0'], description: 'Cooling blues to reduce cortisol and promote peace' },
    { id: 'warm-earth', name: 'Warm Earth Tones', colors: ['#D2B48C', '#CD853F'], description: 'Grounding browns and tans for stability and comfort' },
    { id: 'soft-neutrals', name: 'Soft Neutrals', colors: ['#F5F5DC', '#E6E6FA'], description: 'Gentle creams and whites for mental clarity' },
    { id: 'dusty-rose', name: 'Dusty Rose & Mauve', colors: ['#D2B2A0', '#C8A2C8'], description: 'Feminine pinks for self-compassion and nurturing' }
  ];

  const scents = [
    { id: 'lavender', name: 'Lavender', benefit: 'Reduces anxiety and promotes sleep' },
    { id: 'bergamot', name: 'Bergamot', benefit: 'Balances mood and reduces stress hormones' },
    { id: 'ylang-ylang', name: 'Ylang Ylang', benefit: 'Supports hormonal balance and emotional calm' },
    { id: 'frankincense', name: 'Frankincense', benefit: 'Deepens breathing and spiritual connection' },
    { id: 'clary-sage', name: 'Clary Sage', benefit: 'Specifically helpful for menopause symptoms' },
    { id: 'vanilla', name: 'Vanilla', benefit: 'Comforting and reduces cortisol levels' },
    { id: 'eucalyptus', name: 'Eucalyptus', benefit: 'Clears mental fog and energizes' },
    { id: 'sandalwood', name: 'Sandalwood', benefit: 'Grounds nervous system and aids meditation' }
  ];

  const sounds = [
    { id: 'nature', name: 'Nature Sounds', description: 'Ocean waves, rain, or forest sounds' },
    { id: 'meditation', name: 'Meditation Music', description: 'Gentle instrumental or guided meditations' },
    { id: 'binaural', name: 'Binaural Beats', description: 'Specific frequencies for brain entrainment' },
    { id: 'singing-bowls', name: 'Singing Bowls', description: 'Tibetan bowls for vibrational healing' },
    { id: 'classical', name: 'Classical Music', description: 'Peaceful classical compositions' },
    { id: 'silence', name: 'Intentional Silence', description: 'The power of complete quiet' }
  ];

  const ritualSuggestions = [
    'Take 5 deep breaths before entering your calm corner',
    'Light a candle to signal the start of your calm time',
    'Put your phone in airplane mode',
    'Set a gentle timer for your intended calm duration',
    'Begin with gratitude - name three things you appreciate',
    'End with an intention for how you want to feel',
    'Gently stretch or move your body before leaving',
    'Write one word about your experience in your journal'
  ];

  const toggleSelection = (item: string, currentList: string[], setList: (list: string[]) => void) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const addPersonalItem = () => {
    if (newPersonalItem.trim() && !personalItems.includes(newPersonalItem.trim())) {
      setPersonalItems([...personalItems, newPersonalItem.trim()]);
      setNewPersonalItem('');
    }
  };

  const removePersonalItem = (item: string) => {
    setPersonalItems(personalItems.filter(i => i !== item));
  };

  const isComplete = selectedLocation && selectedItems.length > 0 && selectedColors.length > 0;

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
        <h2 className="text-3xl font-bold text-sage-800 mb-4">🏡 Create Your Calm Corner</h2>
        <p className="text-lg text-gray-600 mb-6">
          Design a personalized sanctuary in your home where you can retreat, recharge, and regulate your nervous system
        </p>
      </div>

      <div className="space-y-8">
        {/* Location Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">1. Choose Your Location</CardTitle>
            <p className="text-gray-600">Where in your home feels most peaceful and private?</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                  selectedLocation === location.id
                    ? 'border-sage-500 bg-sage-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <h4 className="font-semibold text-sage-800 mb-1">{location.name}</h4>
                <p className="text-sm text-gray-600">{location.description}</p>
                {selectedLocation === location.id && (
                  <Check className="text-sage-600 mt-2" size={16} />
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Essential Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">2. Essential Items</CardTitle>
            <p className="text-gray-600">Choose items that support your nervous system regulation (select all that appeal to you)</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            {essentialItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSelection(item.id, selectedItems, setSelectedItems)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all hover:shadow-sm ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {item.name}
                    {isSelected && <Check size={14} />}
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">3. Color Palette</CardTitle>
            <p className="text-gray-600">Colors directly impact your nervous system - choose palettes that feel calming</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {colorPalettes.map((palette) => {
              const isSelected = selectedColors.includes(palette.id);
              return (
                <button
                  key={palette.id}
                  onClick={() => toggleSelection(palette.id, selectedColors, setSelectedColors)}
                  className={`w-full p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{palette.name}</h4>
                    {isSelected && <Check className="text-purple-600" size={16} />}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{palette.description}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Scents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">4. Calming Scents (Optional)</CardTitle>
            <p className="text-gray-600">Aromatherapy specifically chosen for midlife women's needs</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {scents.map((scent) => {
              const isSelected = selectedScents.includes(scent.id);
              return (
                <button
                  key={scent.id}
                  onClick={() => toggleSelection(scent.id, selectedScents, setSelectedScents)}
                  className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{scent.name}</h4>
                    {isSelected && <Check className="text-green-600" size={14} />}
                  </div>
                  <p className="text-xs text-gray-600">{scent.benefit}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Sounds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">5. Calming Sounds (Optional)</CardTitle>
            <p className="text-gray-600">Sound environments that support nervous system regulation</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {sounds.map((sound) => {
              const isSelected = selectedSounds.includes(sound.id);
              return (
                <button
                  key={sound.id}
                  onClick={() => toggleSelection(sound.id, selectedSounds, setSelectedSounds)}
                  className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{sound.name}</h4>
                    {isSelected && <Check className="text-indigo-600" size={14} />}
                  </div>
                  <p className="text-xs text-gray-600">{sound.description}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Personal Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">6. Personal Meaningful Items</CardTitle>
            <p className="text-gray-600">Add items that have special meaning or bring you joy</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPersonalItem}
                onChange={(e) => setNewPersonalItem(e.target.value)}
                placeholder="e.g., family photo, special mug, meaningful jewelry..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                onKeyPress={(e) => e.key === 'Enter' && addPersonalItem()}
              />
              <Button onClick={addPersonalItem} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalItems.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm"
                >
                  {item}
                  <button onClick={() => removePersonalItem(item)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calming Rituals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sage-800">7. Your Calming Rituals</CardTitle>
            <p className="text-gray-600">Choose rituals that will help you transition into and out of your calm space</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {ritualSuggestions.map((ritual, idx) => {
                const isSelected = calmingRituals.includes(ritual);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSelection(ritual, calmingRituals, setCalmingRituals)}
                    className={`p-3 rounded-lg border text-left text-sm transition-all hover:shadow-sm ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {ritual}
                      {isSelected && <Check className="text-amber-600" size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {isComplete && (
          <Card className="bg-gradient-to-r from-sage-50 to-blue-50 border-sage-200">
            <CardHeader>
              <CardTitle className="text-xl text-sage-800">🌟 Your Calm Corner Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Location:</h4>
                <p className="text-gray-700">{locations.find(l => l.id === selectedLocation)?.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Essential Items ({selectedItems.length}):</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedItems.map(itemId => {
                    const item = essentialItems.find(i => i.id === itemId);
                    return (
                      <span key={itemId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {item?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Color Palette:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedColors.map(colorId => {
                    const palette = colorPalettes.find(c => c.id === colorId);
                    return (
                      <span key={colorId} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {palette?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">💡 Next Steps</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Start with just 2-3 essential items - you can add more over time</li>
                  <li>• Use your calm corner for at least 5 minutes daily</li>
                  <li>• Notice how different elements affect your nervous system</li>
                  <li>• Adjust and personalize based on what truly brings you peace</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={() => onComplete('w4-calm-corner', {
            location: selectedLocation,
            items: selectedItems,
            colors: selectedColors,
            scents: selectedScents,
            sounds: selectedSounds,
            personalItems,
            rituals: calmingRituals,
            completed: true
          })}
          disabled={!isComplete}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 disabled:opacity-50"
        >
          {isComplete ? 'Complete Calm Corner Design' : 'Please complete location and items selection'}
        </Button>
      </div>
    </div>
  );
}