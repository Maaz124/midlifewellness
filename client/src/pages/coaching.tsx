import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EnhancedCoachingComponentMinimal } from '@/components/enhanced-coaching-component-fixed';
import { useWellnessData } from '@/hooks/use-local-storage';
import { coachingModules } from '@/lib/coaching-data';
import { useLocation } from 'wouter';
import { 
  Clock, 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Headphones, 
  Brain, 
  Video, 
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
  const { data, updateCoachingProgress, resetCoachingProgress } = useWellnessData();
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [openWeeks, setOpenWeeks] = useState<string[]>(['week-1', 'week-2']); // Week 1 and 2 open by default
  const [hasAccess, setHasAccess] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for payment access or payment success from URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const storedAccess = localStorage.getItem('coachingAccess') === 'true';
    
    if (paymentSuccess) {
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
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'audio': return <Headphones className="w-4 h-4 text-green-600" />;
      case 'exercise': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'worksheet': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'reflection': return <BookOpen className="w-4 h-4 text-teal-600" />;
      default: return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    const module = coachingModules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completedCount = module.components.filter(c => 
      completedComponents.includes(c.id)
    ).length;
    
    return Math.round((completedCount / module.components.length) * 100);
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
          <EnhancedCoachingComponentMinimal
            component={activeComponent}
            moduleId={activeModuleId}
            onComplete={handleComponentComplete}
            onClose={() => {
              setActiveComponent(null);
              setActiveModuleId(null);
            }}
          />
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
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Preview Mode - Unlock Full Access</h2>
                  <p className="text-purple-100">See what's included, then get instant access to all interactive components</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">$97</div>
                <div className="text-sm text-purple-200 line-through">$297</div>
                <Button 
                  onClick={() => setLocation('/checkout')}
                  className="mt-2 bg-white text-purple-600 hover:bg-purple-50"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Unlock Now
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
                              className="flex items-center justify-between p-4 rounded-lg border hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getComponentIcon(component.type)}
                                  {isCompleted && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {component.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {component.description}
                                  </p>
                                  {component.duration && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Clock className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {component.duration} minutes
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
                  You've seen the complete program structure. Now unlock all 24 interactive components and start your transformation journey with Dr. Sidra Bukhari's expert guidance.
                </p>
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