import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Lazy load the large coaching component to improve page performance
const EnhancedCoachingComponentMinimal = lazy(() => 
  import('@/components/enhanced-coaching-component-fixed').then(module => ({
    default: module.EnhancedCoachingComponentMinimal
  }))
);

import { useWellnessData } from '@/hooks/use-local-storage';
import { coachingModules } from '@/lib/coaching-data';
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
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function Coaching() {
  // SEO optimization with structured data for course
  useSEO('coaching');
  
  const { data, updateCoachingProgress, resetCoachingProgress } = useWellnessData();
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [openWeeks, setOpenWeeks] = useState<string[]>(['week-1', 'week-2']); // Week 1 and 2 open by default
  const [hasAccess, setHasAccess] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for payment access, admin access, or payment success from URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const adminAccess = urlParams.get('admin') === 'true';
    const storedAccess = localStorage.getItem('coachingAccess') === 'true';
    
    if (paymentSuccess || adminAccess) {
      localStorage.setItem('coachingAccess', 'true');
      setHasAccess(true);
    } else if (storedAccess) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, []);

  const handleComponentComplete = (componentId: string, responseData?: any) => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    if (!completedComponents.includes(componentId)) {
      updateCoachingProgress({
        completedComponents: [...completedComponents, componentId],
        currentWeek: data.userProfile.currentWeek,
        responseData: responseData || {}
      });
    }
    setActiveComponent(null);
    setActiveModuleId(null);
  };

  const handleStartComponent = (component: any, moduleId: string) => {
    setActiveComponent(component);
    setActiveModuleId(moduleId);
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'worksheet': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'reflection': return <BookOpen className="w-4 h-4 text-teal-600" />;
      default: return <Brain className="w-4 h-4 text-purple-600" />;
    }
  };

  // Memoize module progress calculations to improve performance
  const moduleProgressMap = useMemo(() => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    const progressMap: Record<string, number> = {};
    
    coachingModules.forEach(module => {
      const completedCount = module.components.filter(c => 
        completedComponents.includes(c.id)
      ).length;
      progressMap[module.id] = Math.round((completedCount / module.components.length) * 100);
    });
    
    return progressMap;
  }, [data.coachingProgress?.completedComponents]);

  const getModuleProgress = (moduleId: string) => {
    return moduleProgressMap[moduleId] || 0;
  };

  const toggleWeek = (weekId: string) => {
    setOpenWeeks(prev => 
      prev.includes(weekId) 
        ? prev.filter(id => id !== weekId)
        : [...prev, weekId]
    );
  };

  const getTotalCompletedComponents = () => {
    return (data.coachingProgress?.completedComponents as string[])?.length || 0;
  };

  const getCurrentWeek = () => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    
    for (let i = 0; i < coachingModules.length; i++) {
      const module = coachingModules[i];
      const moduleCompleted = module.components.every(c => 
        completedComponents.includes(c.id)
      );
      
      if (!moduleCompleted) {
        return i + 1;
      }
    }
    
    return 6; // All weeks completed
  };

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
            <EnhancedCoachingComponentMinimal
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

  // Show preview with payment protection on components
  const showPreview = !hasAccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Payment Banner for Preview Mode */}
        {showPreview && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg border border-purple-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">🔒 Program Preview - Full Content Below</h2>
                  <p className="text-purple-100">Browse all 6 weeks and 24 components, then unlock to start your transformation</p>
                </div>
              </div>
              <div className="text-center bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">$97</div>
                <div className="text-sm text-purple-200 line-through">Regular: $297</div>
                <div className="text-green-200 font-semibold mb-2">Save 67% Today</div>
                <Button 
                  onClick={() => setLocation('/checkout')}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Unlock All Components
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">The Mind Reset Method</h1>
            <p className="text-xl text-gray-600">
              A 6-week transformational journey designed specifically for women navigating midlife transitions
            </p>
          </div>

          {!showPreview && (
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <Badge variant="outline" className="text-lg py-2 px-4">
                Week {getCurrentWeek()} of 6
              </Badge>
              <span>{getTotalCompletedComponents()} components completed</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => resetCoachingProgress()}
                className="flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Progress
              </Button>
            </div>
          )}
          
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <Badge variant="outline" className="text-lg py-2 px-4 bg-purple-50 border-purple-200">
                  6 Comprehensive Weeks
                </Badge>
                <Badge variant="outline" className="text-lg py-2 px-4 bg-purple-50 border-purple-200">
                  24 Interactive Components
                </Badge>
                <Badge variant="outline" className="text-lg py-2 px-4 bg-purple-50 border-purple-200">
                  Lifetime Access
                </Badge>
              </div>
              <div className="text-center bg-green-50 border border-green-200 p-3 rounded-lg">
                <p className="text-green-800 font-medium">✨ Join hundreds of women already transforming their midlife experience</p>
                <p className="text-green-700 text-sm">Dr. Sidra's proven methodology based on real clinical results</p>
              </div>
            </div>
          )}
        </div>

        {/* Program Overview */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Program Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">What You'll Achieve:</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Understand and manage hormonal brain changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Transform negative thought patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Master emotional regulation techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Reset and strengthen your nervous system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Enhance cognitive clarity and focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Create a compelling vision for your future</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Program Features:</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Video lessons with expert guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Interactive worksheets and exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Guided audio meditations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Daily reflection prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Progress tracking tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Lifetime access to materials</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Modules */}
        <div className="space-y-6">
          {coachingModules.map((module) => {
            const moduleProgress = getModuleProgress(module.id);
            const isOpen = openWeeks.includes(module.id);
            const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];

            return (
              <Card key={module.id} className="border-2 border-gray-200">
                <Collapsible open={isOpen} onOpenChange={() => toggleWeek(module.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <CardTitle className="text-xl text-gray-900">
                              {module.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline">
                                Week {module.weekNumber} • {module.components.length} components
                              </Badge>
                              <span className="text-sm font-medium text-green-600">
                                {moduleProgress}%
                              </span>
                            </div>
                            <CardDescription className="mt-2 text-gray-600">
                              {module.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={moduleProgress} className="w-20" />
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
                      <div className="space-y-3">
                        {module.components.map((component) => {
                          const isCompleted = completedComponents.includes(component.id);
                          
                          return (
                            <div 
                              key={component.id}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                                showPreview 
                                  ? 'border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 hover:border-purple-300' 
                                  : 'hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {showPreview ? (
                                    <div className="p-1 bg-purple-100 rounded">
                                      {getComponentIcon(component.type)}
                                    </div>
                                  ) : (
                                    getComponentIcon(component.type)
                                  )}
                                  {isCompleted && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  {showPreview && (
                                    <Lock className="w-3 h-3 text-purple-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-medium ${showPreview ? 'text-purple-900' : 'text-gray-900'}`}>
                                    {component.title}
                                    {showPreview && (
                                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        Interactive
                                      </span>
                                    )}
                                  </h4>
                                  <p className={`text-sm ${showPreview ? 'text-purple-700' : 'text-gray-600'}`}>
                                    {component.description}
                                    {showPreview && (
                                      <span className="block mt-1 text-xs text-purple-600 font-medium">
                                        🎯 Evidence-based technique • Proven results
                                      </span>
                                    )}
                                  </p>
                                  {component.duration && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Clock className={`w-3 h-3 ${showPreview ? 'text-purple-500' : 'text-gray-500'}`} />
                                      <span className={`text-xs ${showPreview ? 'text-purple-600' : 'text-gray-500'}`}>
                                        {component.duration} minutes of transformation
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {showPreview ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setLocation('/checkout')}
                                    className="flex items-center gap-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                                  >
                                    <Lock className="w-3 h-3" />
                                    Unlock
                                  </Button>
                                ) : (
                                  <Button
                                    variant={isCompleted ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => handleStartComponent(component, module.id)}
                                    className="flex items-center gap-1"
                                  >
                                    {isCompleted ? (
                                      <>
                                        <Eye className="w-3 h-3" />
                                        View
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-3 h-3" />
                                        Start
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* How to Use Section */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900">How to Use This Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-green-800">
              <div>
                <span className="font-semibold">Weekly Structure:</span> Each week builds on the previous, so complete modules in order for best results.
              </div>
              <div>
                <span className="font-semibold">Time Commitment:</span> Plan 30-45 minutes per day for optimal progress through the materials.
              </div>
              <div>
                <span className="font-semibold">Component Types:</span> Videos provide teaching, worksheets offer structure, exercises are hands-on practice, and reflections deepen integration.
              </div>
              <div>
                <span className="font-semibold">Progress Tracking:</span> Mark components complete as you finish them to track your journey and unlock new content.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Call-to-Action for Preview Users */}
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
                  You've seen Dr. Sidra's complete program structure. Join hundreds of women already transforming their midlife experience with this evidence-based approach.
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
                        <CreditCard className="w-5 h-5 mr-3" />
                        Get Instant Access Now
                      </Button>
                      <div>
                        <Button 
                          onClick={() => {
                            localStorage.setItem('coachingAccess', 'true');
                            setHasAccess(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        >
                          Try Demo Access (Testing)
                        </Button>
                      </div>
                      <p className="text-xs text-purple-200">30-day money-back guarantee</p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm mt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Dr. Sidra's Expertise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Start Immediately</span>
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