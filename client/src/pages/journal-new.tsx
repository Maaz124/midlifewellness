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
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { User } from "@shared/schema";

export default function JournalNew() {
  const { data, upsertTodayJournalEntry, addJournalEntry, addMoodEntry } = useWellnessData();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth();
  const user = authUser as User | null;

  // Optional: Hard reload once on first open to ensure fresh data after navigation
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const key = 'journal_reloaded_once';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, 'true');
        window.location.reload();
      }
    }
  }, [authLoading, isAuthenticated]);


  // Provide default values to prevent undefined errors
  const userProfile = data?.userProfile || { currentWeek: 1 };

  // Fetch journal entries from API when authenticated
  const { data: apiJournalEntries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['/api/journal-entries'],
    queryFn: async () => {
      const res = await fetch('/api/journal-entries', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch journal entries');
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
  });

  // Mutation to save journal entry to API
  const saveJournalEntryMutation = useMutation({
    mutationFn: async (entry: any) => {
      const response = await apiRequest('POST', '/api/journal-entries', entry);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save entry. It's saved locally.",
        variant: "destructive",
      });
    },
  });

  // Merge API entries with strict user scoping; when authenticated, never fall back to local entries
  const safeApiEntries = (Array.isArray(apiJournalEntries) ? apiJournalEntries : []).filter((e: any) => {
    if (!user?.id) return false;
    return e && e.userId === user.id;
  });
  const allJournalEntries = isAuthenticated
    ? safeApiEntries // show only server entries for the logged-in user
    : (data?.journalEntries || []); // guests use local-only entries
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showBreathingDialog, setShowBreathingDialog] = useState(false);
  const [showGratitudeDialog, setShowGratitudeDialog] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(300); // 5 minutes in seconds
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [savedGratitudeEntries, setSavedGratitudeEntries] = useState<Array<{
    id: string;
    items: string[];
    savedAt: string;
    ownerId?: string;
  }>>([]);
  const [viewGratitudeEntry, setViewGratitudeEntry] = useState<{
    id: string;
    items: string[];
    savedAt: string;
  } | null>(null);

  // Fetch digital resources
  const { data: allResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/resources']
  });

  // Fetch gratitude entries (DB) when authenticated
  const { data: apiGratitudeEntries = [], isLoading: isLoadingGratitude } = useQuery({
    queryKey: ['/api/gratitude-entries'],
    queryFn: getQueryFn<any[]>({ on401: 'returnNull' }),
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
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
        // Redirect to payment page with payment details
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
  const categories = ['all', ...Array.from(new Set((allResources as any[]).map(r => r.category).filter(Boolean)))];

  const todaysPrompt = getTodaysPrompt(userProfile.currentWeek);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const todayIso = new Date().toISOString().split('T')[0];
  const todaysEntry = allJournalEntries.find((e: any) => {
    const entryDate = new Date(e.createdAt).toISOString().split('T')[0];
    return entryDate === todayIso;
  });
  const hasTodaysEntry = Boolean(todaysEntry);

  const isEditingToday = hasTodaysEntry;

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

  // Minimum word count required for completing entry
  const MIN_WORD_COUNT = 20;

  // Update word count
  useEffect(() => {
    const words = journalContent.trim() ? journalContent.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
    setWordCount(words);
  }, [journalContent]);

  // Load today's entry (or draft if none) - only once on initial load
  useEffect(() => {
    if (hasInitialized) return;

    const today = new Date().toISOString().split('T')[0];
    const todaysEntry = allJournalEntries.find((e: any) => {
      const entryDate = new Date(e.createdAt).toISOString().split('T')[0];
      return entryDate === today;
    });
    if (todaysEntry) {
      setJournalContent(todaysEntry.content || '');
      if (todaysEntry.mood) setSelectedMood(todaysEntry.mood);
    } else {
      const draft = localStorage.getItem(`journal_draft_${today}`);
      if (draft) setJournalContent(draft);
      const moodList = Array.isArray(data?.moodTracking) ? data!.moodTracking : [];
      const todaysMood = moodList.find((entry: any) => entry.date === today || entry.createdAt?.startsWith(today));
      if (todaysMood) setSelectedMood(todaysMood.mood);
    }

    setHasInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized, user?.id]);

  // Sync gratitude entries from API when authenticated
  useEffect(() => {
    if (isAuthenticated && apiGratitudeEntries && Array.isArray(apiGratitudeEntries)) {
      // Filter to ensure only current user's entries (extra safety)
      const userEntries = apiGratitudeEntries.filter((e: any) =>
        e && e.userId === user?.id
      );
      const mapped = userEntries.map((e: any) => ({
        id: String(e.id),
        items: Array.isArray(e.items) ? e.items : [],
        savedAt: e.savedAt || e.saved_at || new Date().toISOString(),
        ownerId: user?.id,
      }));
      setSavedGratitudeEntries(mapped);
    } else if (!isAuthenticated) {
      // Fallback to localStorage only for guests
      const userId = user?.id || 'guest';
      const savedEntries = localStorage.getItem(`gratitude-entries-${userId}`);
      if (savedEntries) {
        try {
          const parsed = JSON.parse(savedEntries);
          const filtered = Array.isArray(parsed)
            ? parsed.filter((e: any) => !e?.ownerId || e.ownerId === userId)
            : [];
          setSavedGratitudeEntries(filtered);
        } catch (error) {
          console.error('Error loading gratitude entries:', error);
        }
      } else {
        setSavedGratitudeEntries([]);
      }
    }
  }, [apiGratitudeEntries, isAuthenticated, user?.id]);

  // Breathing timer and phase control
  useEffect(() => {
    if (!breathingActive) return;

    const phaseInterval = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000); // 4 seconds per phase

    const timerInterval = setInterval(() => {
      setBreathingTimer(prev => {
        if (prev <= 1) {
          setBreathingActive(false);
          toast({
            title: "Breathing Exercise Complete!",
            description: "Great job taking time for yourself. Notice how you feel.",
          });
          return 300; // Reset to 5 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(timerInterval);
    };
  }, [breathingActive, toast]);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingTimer(300);
    setBreathingPhase('inhale');
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingTimer(300);
  };

  // Mutation to save gratitude entry
  const saveGratitudeMutation = useMutation({
    mutationFn: async (items: string[]) => {
      const response = await apiRequest('POST', '/api/gratitude-entries', { items });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gratitude-entries'] });
      const filledItems = gratitudeItems.filter(item => item.trim());
      toast({
        title: "Gratitude Saved!",
        description: `You recorded ${filledItems.length} thing${filledItems.length > 1 ? 's' : ''} to be grateful for today.`,
      });
      setGratitudeItems(['', '', '']);
      setShowGratitudeDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save gratitude entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveGratitude = () => {
    const filledItems = gratitudeItems.filter(item => item.trim());
    if (filledItems.length === 0) {
      toast({
        title: "Add at least one item",
        description: "Write down something you're grateful for.",
        variant: "destructive",
      });
      return;
    }

    // Save to DB if authenticated; else localStorage
    if (isAuthenticated) {
      saveGratitudeMutation.mutate(gratitudeItems);
    } else {
      // Fallback to localStorage for guests
      const newEntry = {
        id: Date.now().toString(),
        items: gratitudeItems, // Save all three items (including empty ones)
        savedAt: new Date().toISOString(),
        ownerId: user?.id || 'guest',
      };
      const updatedEntries = [newEntry, ...savedGratitudeEntries];
      setSavedGratitudeEntries(updatedEntries);
      const userId = user?.id || 'guest';
      localStorage.setItem(`gratitude-entries-${userId}`, JSON.stringify(updatedEntries));

      toast({
        title: "Gratitude Saved!",
        description: `You recorded ${filledItems.length} thing${filledItems.length > 1 ? 's' : ''} to be grateful for today.`,
      });

      setGratitudeItems(['', '', '']);
      setShowGratitudeDialog(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    addMoodEntry(mood as 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad');
  };

  const handleCompleteEntry = () => {
    if (!selectedMood) return;
    // Ensure minimum word count requirement
    if (wordCount < MIN_WORD_COUNT) {
      toast({
        title: "Reflection too short",
        description: `Please write at least ${MIN_WORD_COUNT} words to complete your entry. You currently have ${wordCount} words.`,
        variant: "destructive",
      });
      return;
    }

    if (!journalContent.trim()) return;

    // Prevent multiple saves
    if (saveJournalEntryMutation.isPending) {
      return;
    }

    const entry: Omit<JournalEntry, 'id'> = {
      title: `${currentDate} Reflection`,
      content: journalContent,
      mood: selectedMood as 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | undefined,
      prompt: todaysPrompt,
      createdAt: new Date().toISOString(),
    };

    // If editing today's entry, do not create a duplicate local entry
    if (!isEditingToday) {
      // Save to localStorage (for offline support) - create if none today
      addJournalEntry(entry);
    }

    // Save to API if authenticated - backend will upsert today's entry
    if (isAuthenticated) {
      saveJournalEntryMutation.mutate(entry);
    }

    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`journal_draft_${today}`);

    // Clear the journal content after saving so user can write a new entry
    setJournalContent('');
    setWordCount(0);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Block access for unauthenticated users - checking after all hooks
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Please log in to write and view your gratitude and journal entries.</p>
            <a href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">Go to Login</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Block access for users without payment
  if (isAuthenticated && !user?.hasCoachingAccess) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Coaching Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Journal features are part of the coaching program. Please complete your purchase to continue.
            </p>
            <a href="/payment">
              <Button className="bg-purple-600 hover:bg-purple-700">Go to Checkout</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-6">
                <Feather className="w-3.5 h-3.5" />
                Your Safe Space for Growth
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Wellness Journal
                </span>
              </h1>
              <p className="text-gray-600 text-lg mb-0 max-w-lg leading-relaxed">
                Connect with your inner self, track your moods, and explore our library of resources. Your story of transformation begins here.
              </p>
            </div>
            <div className="relative min-h-[250px] lg:min-h-full">
              <img 
                src="/images/journal_hero.png" 
                alt="A beautiful journal and tea - Personal Reflection" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden block" />
            </div>
          </div>
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
                      <div className={`text-sm ${wordCount < MIN_WORD_COUNT ? 'text-orange-600' : 'text-gray-500'}`}>
                        {wordCount} / {MIN_WORD_COUNT} words
                        {wordCount < MIN_WORD_COUNT && (
                          <span className="ml-1 text-xs">({MIN_WORD_COUNT - wordCount} more needed)</span>
                        )}
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
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => handleMoodSelect(mood.value)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedMood === mood.value
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
                        disabled={wordCount < MIN_WORD_COUNT || saveJournalEntryMutation.isPending || !selectedMood}
                      >
                        {saveJournalEntryMutation.isPending
                          ? 'Saving...'
                          : (isEditingToday ? 'Save Changes' : 'Complete Entry')}
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
                      <Dialog open={showBreathingDialog} onOpenChange={setShowBreathingDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left border-green-200 hover:bg-green-50"
                            data-testid="button-breathing-exercise"
                          >
                            <div>
                              <div className="font-semibold text-green-700">5-Minute Breathing</div>
                              <div className="text-sm text-gray-600">Calm your nervous system</div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md" data-testid="dialog-breathing">
                          <DialogHeader>
                            <DialogTitle>5-Minute Breathing Exercise</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Timer Display */}
                            <div className="text-center">
                              <div className="text-4xl font-bold text-purple-600 mb-2">
                                {Math.floor(breathingTimer / 60)}:{(breathingTimer % 60).toString().padStart(2, '0')}
                              </div>
                              <div className="text-sm text-gray-600">minutes remaining</div>
                            </div>

                            {/* Breathing Animation Circle */}
                            <div className="flex justify-center">
                              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${breathingActive
                                ? breathingPhase === 'inhale'
                                  ? 'bg-green-200 scale-125 duration-[4000ms]'
                                  : breathingPhase === 'hold'
                                    ? 'bg-blue-200 scale-125 duration-[4000ms]'
                                    : 'bg-purple-200 scale-75 duration-[4000ms]'
                                : 'bg-gray-200'
                                }`}>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">
                                    {breathingActive
                                      ? breathingPhase === 'inhale'
                                        ? '🌬️'
                                        : breathingPhase === 'hold'
                                          ? '⏸️'
                                          : '😌'
                                      : '🧘'
                                    }
                                  </div>
                                  <div className="text-sm font-semibold mt-1 capitalize">
                                    {breathingActive ? breathingPhase : 'Ready'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
                              <p className="font-semibold mb-2">Box Breathing Pattern:</p>
                              <ul className="space-y-1">
                                <li>• Inhale slowly for 4 seconds</li>
                                <li>• Hold your breath for 4 seconds</li>
                                <li>• Exhale slowly for 4 seconds</li>
                                <li>• Repeat for 5 minutes</li>
                              </ul>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex gap-3">
                              {!breathingActive ? (
                                <Button
                                  onClick={startBreathing}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  data-testid="button-start-breathing"
                                >
                                  Start Breathing
                                </Button>
                              ) : (
                                <Button
                                  onClick={stopBreathing}
                                  variant="outline"
                                  className="flex-1"
                                  data-testid="button-stop-breathing"
                                >
                                  Stop
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => setShowBreathingDialog(false)}
                                data-testid="button-close-breathing"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showGratitudeDialog} onOpenChange={setShowGratitudeDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left border-blue-200 hover:bg-blue-50"
                            data-testid="button-gratitude-exercise"
                          >
                            <div>
                              <div className="font-semibold text-blue-700">Gratitude Moment</div>
                              <div className="text-sm text-gray-600">Find three things to appreciate</div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md" data-testid="dialog-gratitude">
                          <DialogHeader>
                            <DialogTitle>Gratitude Practice</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-sm text-gray-600">
                              Take a moment to reflect on three things you're grateful for today. They can be big or small - what matters is noticing them.
                            </p>

                            <div className="space-y-3">
                              {gratitudeItems.map((item, index) => (
                                <div key={index}>
                                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {index + 1}. I'm grateful for...
                                  </label>
                                  <Textarea
                                    placeholder="Something that brought you joy, peace, or meaning today"
                                    value={item}
                                    onChange={(e) => {
                                      const newItems = [...gratitudeItems];
                                      newItems[index] = e.target.value;
                                      setGratitudeItems(newItems);
                                    }}
                                    className="min-h-[60px]"
                                    data-testid={`input-gratitude-${index + 1}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-lg text-xs text-gray-700">
                              <p className="font-semibold mb-1">💡 Gratitude Tip:</p>
                              <p>Research shows that regularly practicing gratitude can improve mood, reduce stress, and enhance overall wellbeing.</p>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={saveGratitude}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                data-testid="button-save-gratitude"
                                disabled={saveGratitudeMutation.isPending}
                              >
                                {saveGratitudeMutation.isPending ? 'Saving...' : 'Save Gratitude'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowGratitudeDialog(false);
                                  setGratitudeItems(['', '', '']);
                                }}
                                data-testid="button-cancel-gratitude"
                                disabled={saveGratitudeMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Saved Gratitude Entries */}
                {savedGratitudeEntries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-blue-600" />
                        Saved Gratitude Entries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {savedGratitudeEntries.map((entry) => {
                          const savedDate = new Date(entry.savedAt);
                          const dateStr = savedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          });
                          const timeStr = savedDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          return (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">
                                  Gratitude Entry
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {dateStr} at {timeStr}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewGratitudeEntry(entry)}
                                className="border-blue-300 text-blue-700 hover:bg-[#E9560C] hover:text-white hover:border-[#E9560C]"
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* View Gratitude Entry Modal */}
                <Dialog open={!!viewGratitudeEntry} onOpenChange={(open) => !open && setViewGratitudeEntry(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gratitude Entry</DialogTitle>
                    </DialogHeader>
                    {viewGratitudeEntry && (
                      <div className="space-y-4 py-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold mb-1">
                            Saved on:{' '}
                            {new Date(viewGratitudeEntry.savedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(viewGratitudeEntry.savedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {viewGratitudeEntry.items.map((item, index) => (
                            <div key={index}>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                {index + 1}. I'm grateful for...
                              </label>
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 min-h-[60px]">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                  {item.trim() || <span className="text-gray-400 italic">Not filled</span>}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() => setViewGratitudeEntry(null)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
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
                    {isLoadingEntries ? (
                      <p className="text-gray-500 text-sm">Loading entries...</p>
                    ) : allJournalEntries.length === 0 ? (
                      <p className="text-gray-500 text-sm">No entries yet. Start writing your first reflection!</p>
                    ) : (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {allJournalEntries.slice().sort((a: any, b: any) =>
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        ).map((entry: any) => (
                          <Dialog key={entry.id}>
                            <DialogTrigger asChild>
                              <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium text-sm">{entry.title}</div>
                                  {entry.mood && (
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs shrink-0 ml-2">
                                      <span>{moodOptions.find(m => m.value === entry.mood)?.emoji}</span>
                                      <span className="font-medium text-gray-600">
                                        {moodOptions.find(m => m.value === entry.mood)?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(entry.createdAt).toLocaleDateString()}
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
                                  {new Date(entry.createdAt).toLocaleDateString()}
                                </div>
                                <div className="prose prose-sm max-w-none">
                                  {entry.content.split('\n').map((paragraph: string, index: number) => (
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