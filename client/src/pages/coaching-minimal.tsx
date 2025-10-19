import { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Lazy load the large coaching component
const EnhancedCoachingComponent = lazy(() => 
  import('@/components/enhanced-coaching-component-fixed').then(module => ({
    default: module.EnhancedCoachingComponentMinimal
  }))
);

import { useWellnessData } from '@/hooks/use-local-storage';
import { useLocation } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { structuredDataTemplates } from '@/lib/seo';
import { 
  Clock, 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Play,
  Eye,
  Lock,
  Sparkles,
  Heart,
  Star,
  ArrowRight,
  Users,
  Target,
  Zap
} from 'lucide-react';

// Minimal coaching data structure for faster loading
const minimalCoachingData = [
  {
    id: 'week1',
    title: 'Week 1: Foundation & Awareness',
    weekNumber: 1,
    description: 'Build your foundation with awareness and assessment tools.',
    componentCount: 11,
    isUnlocked: true
  },
  {
    id: 'week2',
    title: 'Week 2: Thought Rewiring with CBT',
    weekNumber: 2,
    description: 'Master cognitive behavioral techniques for thought transformation.',
    componentCount: 4,
    isUnlocked: false
  },
  {
    id: 'week3',
    title: 'Week 3: Emotion Regulation & Boundaries',
    weekNumber: 3,
    description: 'Develop healthy emotional patterns and clear boundaries.',
    componentCount: 4,
    isUnlocked: false
  },
  {
    id: 'week4',
    title: 'Week 4: Nervous System Reset',
    weekNumber: 4,
    description: 'Reset your nervous system with proven somatic techniques.',
    componentCount: 4,
    isUnlocked: false
  },
  {
    id: 'week5',
    title: 'Week 5: Clarity & Cognitive Flow',
    weekNumber: 5,
    description: 'Enhance mental clarity and cognitive performance.',
    componentCount: 4,
    isUnlocked: false
  },
  {
    id: 'week6',
    title: 'Week 6: Future Self & Goal Mapping',
    weekNumber: 6,
    description: 'Design your future self and create sustainable goals.',
    componentCount: 4,
    isUnlocked: false
  }
];

export default function CoachingMinimal() {
  const [openWeeks, setOpenWeeks] = useState<string[]>(['week1']);
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { data, updateCoachingProgress } = useWellnessData();
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SEO Configuration
  useSEO({
    title: "6-Week Mind-Body Reset Coaching Program | BloomAfter40",
    description: "Transform your midlife experience with Dr. Sidra's evidence-based 6-week coaching program. Interactive CBT techniques, mindfulness practices, and personalized wellness strategies for women.",
    keywords: "midlife coaching, women's wellness, CBT therapy, mindfulness, perimenopause support, mind-body reset",
    structuredData: structuredDataTemplates.course
  });

  useEffect(() => {
    // Check if user has coaching access
    const hasAccess = localStorage.getItem('coachingAccess') === 'true';
    if (!hasAccess) {
      setShowPreview(true);
    }
    
    // Simulate loading time then show content
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleWeek = (weekId: string) => {
    setOpenWeeks(prev => 
      prev.includes(weekId) 
        ? prev.filter(id => id !== weekId)
        : [...prev, weekId]
    );
  };

  const handleComponentClick = (component: any, moduleId: string) => {
    if (showPreview && moduleId !== 'week1') {
      setLocation('/checkout');
      return;
    }
    
    setActiveComponent(component);
    setActiveModuleId(moduleId);
  };

  const handleComponentComplete = (componentId: string) => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    if (!completedComponents.includes(componentId)) {
      updateCoachingProgress({
        completedComponents: [...completedComponents, componentId]
      });
    }
    
    setActiveComponent(null);
    setActiveModuleId(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Coaching Program</h3>
            <p className="text-muted-foreground">Preparing your wellness journey...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show individual component
  if (activeComponent && activeModuleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Loading Interactive Component</h3>
                  <p className="text-muted-foreground">Preparing your personalized coaching experience...</p>
                </CardContent>
              </Card>
            </div>
          }>
            <EnhancedCoachingComponent
              component={activeComponent}
              moduleId={activeModuleId}
              onComplete={handleComponentComplete}
              onClose={() => {
                setActiveComponent(null);
                setActiveModuleId(null);
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            6-Week Mind-Body Reset Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your midlife experience with Dr. Sidra's evidence-based coaching program
          </p>
        </div>

        {/* Program Overview */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900">Program Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-800 mb-3">What You'll Get:</h3>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>31 interactive coaching components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>CBT and mindfulness techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Progress tracking tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Lifetime access to materials</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 mb-3">Perfect For:</h3>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Women in midlife transitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Managing perimenopause symptoms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Seeking mental clarity and balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>Ready for transformation</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Modules - Simplified */}
        <div className="space-y-6">
          {minimalCoachingData.map((module) => {
            const isOpen = openWeeks.includes(module.id);
            const isLocked = showPreview && !module.isUnlocked;

            return (
              <Card key={module.id} className={`border-2 ${isLocked ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
                <Collapsible open={isOpen} onOpenChange={() => toggleWeek(module.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                              {module.title}
                              {isLocked && <Lock className="w-5 h-5 text-purple-600" />}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline">
                                Week {module.weekNumber} • {module.componentCount} components
                              </Badge>
                              {isLocked && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  Unlock with Full Access
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mt-2 text-gray-600">
                              {module.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="text-center py-8">
                        {isLocked ? (
                          <div className="space-y-4">
                            <div className="bg-purple-100 p-4 rounded-lg">
                              <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                              <p className="text-purple-800 font-medium">Unlock Full Program Access</p>
                              <p className="text-purple-600 text-sm mt-2">
                                Get instant access to all {module.componentCount} interactive components in this week
                              </p>
                            </div>
                            <Button 
                              onClick={() => setLocation('/checkout')}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Unlock Now - $97
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-gray-600">
                              Click "Load Components" to see all {module.componentCount} interactive exercises and worksheets
                            </p>
                            <Button 
                              onClick={() => {
                                // This would load the full coaching data dynamically
                                alert('This would load the full component list for Week 1');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Load Components
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* Call to Action for Preview Users */}
        {showPreview && (
          <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-8 text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold">Ready to Transform Your Midlife Experience?</h2>
                <p className="text-xl text-purple-100">
                  Join hundreds of women already transforming their midlife experience with this evidence-based approach.
                </p>
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <p className="text-lg font-semibold text-yellow-200">⚡ Limited Time: Launch Special Pricing</p>
                  <p className="text-purple-200 text-sm">This introductory price won't last forever</p>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">$97</div>
                    <div className="text-sm text-purple-200 line-through">Regular: $297</div>
                    <div className="text-lg font-semibold">Save $200 Today</div>
                  </div>
                  <div className="text-center">
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setLocation('/checkout')}
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
                      >
                        Get Full Access Now
                      </Button>
                      <p className="text-xs text-purple-200">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}