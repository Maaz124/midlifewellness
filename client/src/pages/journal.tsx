import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Feather, Calendar, BookOpen, Search, Map, FileText, Download, ShoppingCart, Filter, DollarSign, Star, Lock, CheckCircle, Heart } from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { getTodaysPrompt } from '@/lib/coaching-data';
import { JournalEntry, MoodEntry } from '@/types/wellness';
import { useQuery } from '@tanstack/react-query';

export default function Journal() {
  const { data, addJournalEntry, addMoodEntry } = useWellnessData();
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Fetch digital resources
  const { data: allResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/resources']
  });

  // Filter resources based on selected filters
  const filteredResources = (allResources as any[]).filter((resource) => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    const priceMatch = priceFilter === 'all' || 
                      (priceFilter === 'free' && resource.price === 0) ||
                      (priceFilter === 'paid' && resource.price > 0);
    return categoryMatch && priceMatch;
  });

  // Get unique categories
  const categories = ['all', ...new Set((allResources as any[]).map(r => r.category).filter(Boolean))];

  const todaysPrompt = getTodaysPrompt(data.userProfile.currentWeek);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const moodOptions = [
    { value: 'very-happy', emoji: '😊', label: 'Great', color: 'bg-green-100 border-green-200' },
    { value: 'happy', emoji: '🙂', label: 'Good', color: 'bg-green-50 border-green-100' },
    { value: 'neutral', emoji: '😐', label: 'Okay', color: 'bg-gray-100 border-gray-200' },
    { value: 'sad', emoji: '😔', label: 'Low', color: 'bg-orange-100 border-orange-200' },
    { value: 'very-sad', emoji: '😢', label: 'Tough', color: 'bg-red-100 border-red-200' },
  ];

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (journalContent.trim()) {
        localStorage.setItem(`journal_draft_${new Date().toISOString().split('T')[0]}`, journalContent);
        setLastSaved('just now');
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [journalContent]);

  // Update word count
  useEffect(() => {
    const words = journalContent.trim() ? journalContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [journalContent]);

  // Load draft on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const draft = localStorage.getItem(`journal_draft_${today}`);
    if (draft) {
      setJournalContent(draft);
    }

    // Load today's mood
    const todaysMood = data.moodTracking.find(
      entry => entry.date === today
    );
    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
    }
  }, [data.moodTracking]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    addMoodEntry(mood);
  };

  const handleCompleteEntry = () => {
    if (journalContent.trim()) {
      const entry: Omit<JournalEntry, 'id'> = {
        title: `${currentDate} Reflection`,
        content: journalContent,
        mood: selectedMood as any,
        prompt: todaysPrompt,
        createdAt: new Date().toISOString()
      };
      
      addJournalEntry(entry);
      
      // Clear draft
      const today = new Date().toISOString().split('T')[0];
      localStorage.removeItem(`journal_draft_${today}`);
      
      setJournalContent('');
      setSelectedMood('');
    }
  };

  const handleSaveDraft = () => {
    if (journalContent.trim()) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`journal_draft_${today}`, journalContent);
      setLastSaved('just now');
    }
  };

  const recentEntries = data.journalEntries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Reflections & Journal</h1>
          <p className="text-gray-600">Track your thoughts, emotions, and insights throughout your journey.</p>
        </div>
        <Button 
          onClick={handleCompleteEntry}
          disabled={!journalContent.trim()}
          className="btn-primary"
        >
          <Feather className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Journal Entry */}
        <div className="lg:col-span-2">
          <Card className="wellness-card">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Feather className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Today's Reflection</CardTitle>
                  <p className="text-sm text-gray-500">{currentDate}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="bg-primary/5 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-primary-800 mb-3">Guided Prompt:</h4>
                <p className="text-primary-700 mb-4">{todaysPrompt}</p>
                <div className="text-xs text-primary-600">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Week {data.userProfile.currentWeek}: Focus Area
                </div>
              </div>

              <Textarea
                className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                placeholder="Start writing your thoughts here..."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>Auto-saved {lastSaved || 'never'}</span>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleSaveDraft}
                    disabled={!journalContent.trim()}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handleCompleteEntry}
                    disabled={!journalContent.trim()}
                    className="btn-primary"
                  >
                    Complete Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Tracking */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-coral-500" />
                <span>Today's Mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      selectedMood === mood.value
                        ? `${mood.color} border-opacity-100`
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <span className="text-xs text-gray-600">{mood.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {data.moodTracking.length > 0 ? (
                  `${data.moodTracking.length}-day tracking streak`
                ) : (
                  'Start tracking your daily mood'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-sage-600" />
                <span>Recent Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEntries.length === 0 ? (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No entries yet</p>
                  </div>
                ) : (
                  recentEntries.map((entry, index) => (
                    <div key={entry.id || index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {new Date(entry.createdAt).getDate()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {entry.title || 'Daily Reflection'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()} • {entry.content.split(' ').length} words
                        </div>
                        {entry.mood && (
                          <div className="mt-1">
                            <span className="text-lg">
                              {moodOptions.find(m => m.value === entry.mood)?.emoji}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {recentEntries.length > 0 && (
                <Button variant="ghost" className="w-full mt-4 text-sm text-primary hover:text-primary-800">
                  View All Entries
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-600" />
                <span>Quick Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full flex items-center space-x-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors text-left" variant="ghost">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Thought Audit</div>
                        <div className="text-xs text-gray-500">Identify negative patterns</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thought Audit Tool</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-gray-600">
                        Use this tool to examine and reframe negative thought patterns.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">What negative thought are you experiencing?</label>
                          <Textarea className="mt-1" placeholder="Write down the specific thought..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">How does this thought make you feel?</label>
                          <Textarea className="mt-1" placeholder="Describe the emotions it brings up..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">What would you tell a friend having this thought?</label>
                          <Textarea className="mt-1" placeholder="Offer yourself the same compassion..." />
                        </div>
                      </div>
                      <Button className="w-full btn-primary">Save Reflection</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full flex items-center space-x-3 p-3 bg-sage/5 rounded-lg hover:bg-sage/10 transition-colors text-left" variant="ghost">
                      <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center">
                        <Map className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Mood Map</div>
                        <div className="text-xs text-gray-500">Weekly emotional patterns</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Weekly Mood Map</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-gray-600">
                        Visualize your emotional patterns throughout the week.
                      </p>
                      <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <div key={day} className="text-center">
                            <div className="text-xs text-gray-500 mb-2">{day}</div>
                            <div className="space-y-1">
                              {moodOptions.map((mood) => (
                                <button
                                  key={mood.value}
                                  className="w-full p-1 rounded text-xs hover:bg-gray-100"
                                >
                                  {mood.emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full btn-primary">Update Mood Map</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
