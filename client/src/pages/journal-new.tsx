import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Feather, Calendar, BookOpen, FileText, Download, ShoppingCart, Filter, Star, Heart, Map } from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { getTodaysPrompt } from '@/lib/coaching-data';
import { JournalEntry, MoodEntry } from '@/types/wellness';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function JournalNew() {
  const { data, addJournalEntry, addMoodEntry } = useWellnessData();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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

  // Purchase mutation
  const purchaseResource = useMutation({
    mutationFn: async (resourceId: number) => {
      const response = await apiRequest('POST', '/api/purchase-resource', { resourceId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.clientSecret) {
        // Redirect to checkout page with payment details
        const resourceId = encodeURIComponent(data.resourceId || '');
        const paymentIntent = encodeURIComponent(data.paymentIntentId || '');
        window.location.href = `/resource-checkout?payment_intent=${paymentIntent}&resource_id=${resourceId}`;
      } else {
        toast({
          title: "Purchase Successful",
          description: "Your resource has been purchased successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (resourceId: number) => {
    if (!isAuthenticated && !authLoading) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase digital resources.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    
    if (authLoading) {
      toast({
        title: "Please Wait",
        description: "Checking authentication...",
      });
      return;
    }
    
    purchaseResource.mutate(resourceId);
  };

  const handleFreeDownload = (resource: any) => {
    // Create download link
    const downloadUrl = `/api/download-resource/${resource.id}`;
    window.open(downloadUrl, '_blank');
    
    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded.`,
    });
  };

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
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        prompt: todaysPrompt,
        createdAt: new Date().toISOString(),
      };

      addJournalEntry(entry);
      
      // Clear form
      const today = new Date().toISOString().split('T')[0];
      localStorage.removeItem(`journal_draft_${today}`);
      
      setJournalContent('');
      setSelectedMood('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Daily Journal & Wellness Library
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personal space for reflection, growth, and accessing curated wellness resources
          </p>
        </div>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <Feather className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Wellness Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Journal Writing Section */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Feather className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-xl">Today's Reflection</CardTitle>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {wordCount} words
                      </div>
                      {lastSaved && (
                        <div className="text-xs text-green-600">
                          Saved {lastSaved}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Today's Prompt */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">✨</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-purple-800 mb-1">Today's Prompt</h3>
                          <p className="text-purple-700 text-sm leading-relaxed">{todaysPrompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Journal Input */}
                    <Textarea
                      placeholder="Start writing your thoughts and reflections here..."
                      className="min-h-[300px] border-gray-200 focus:border-purple-300 resize-none"
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                    />

                    {/* Mood Selection */}
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        How are you feeling today?
                      </h3>
                      <div className="grid grid-cols-5 gap-2">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => handleMoodSelect(mood.value)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              selectedMood === mood.value 
                                ? 'border-purple-500 bg-purple-50' 
                                : mood.color
                            }`}
                          >
                            <div className="text-2xl mb-1">{mood.emoji}</div>
                            <div className="text-xs font-medium">{mood.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button 
                        onClick={handleCompleteEntry}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={!journalContent.trim()}
                      >
                        Complete Entry
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setJournalContent('')}
                        className="border-gray-300"
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mindfulness Quick Practice */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-green-600" />
                      Quick Mindfulness Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 text-left border-green-200 hover:bg-green-50"
                      >
                        <div>
                          <div className="font-semibold text-green-700">5-Minute Breathing</div>
                          <div className="text-sm text-gray-600">Calm your nervous system</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 text-left border-blue-200 hover:bg-blue-50"
                      >
                        <div>
                          <div className="font-semibold text-blue-700">Gratitude Moment</div>
                          <div className="text-sm text-gray-600">Find three things to appreciate</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Recent Entries */}
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Recent Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.journalEntries.length === 0 ? (
                      <p className="text-gray-500 text-sm">No entries yet. Start writing your first reflection!</p>
                    ) : (
                      <div className="space-y-3">
                        {data.journalEntries.slice(0, 5).map((entry) => (
                          <Dialog key={entry.id}>
                            <DialogTrigger asChild>
                              <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="font-medium text-sm">{entry.title}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(entry.date).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {entry.content.substring(0, 100)}...
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{entry.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <div className="text-sm text-gray-500 mb-4">
                                  {new Date(entry.date).toLocaleDateString()}
                                </div>
                                <div className="prose prose-sm max-w-none">
                                  {entry.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-3">{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <div className="max-w-6xl mx-auto">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Filter by:</span>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resources Grid */}
              {resourcesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource: any) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            <Badge variant="secondary" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          {resource.price === 0 ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Free
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-purple-700 border-purple-200">
                              ${(resource.price / 100).toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>{resource.category}</span>
                          {resource.totalPages && (
                            <span>{resource.totalPages} pages</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {resource.price === 0 ? (
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                              onClick={() => handleFreeDownload(resource)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Free
                            </Button>
                          ) : (
                            <Button 
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              size="sm"
                              onClick={() => handlePurchase(resource.id)}
                              disabled={purchaseResource.isPending}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {purchaseResource.isPending ? 'Processing...' : `Purchase $${(resource.price / 100).toFixed(2)}`}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredResources.length === 0 && !resourcesLoading && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more resources.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}