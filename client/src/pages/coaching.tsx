import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import the original component but use it more efficiently
import { EnhancedCoachingComponentMinimal } from '@/components/enhanced-coaching-component-fixed';
import LeadCapture from '@/components/marketing/LeadCapture';

import { useWellnessData } from '@/hooks/use-local-storage';
import { useCoachingProgress } from '@/hooks/use-coaching-progress';
import { coachingModules } from '@/lib/coaching-data';
import { useLocation } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { structuredDataTemplates } from '@/lib/seo';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
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
  Sparkles,
  Download
} from 'lucide-react';

export default function Coaching() {
  // SEO optimization with structured data for course
  useSEO('coaching');

  const { data: wellnessData } = useWellnessData(); // Keep for other wellness data
  const { data: coachingData, updateCoachingProgress: updateCoachingProgressDB, resetCoachingProgress: resetCoachingProgressDB } = useCoachingProgress();
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [openWeeks, setOpenWeeks] = useState<string[]>(['week-1', 'week-2']); // Week 1 and 2 open by default
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch coaching prices from database
  const { data: priceData } = useQuery({
    queryKey: ['/api/coaching-price'],
    queryFn: async () => {
      const res = await fetch('/api/coaching-price');
      return res.json();
    },
  });
  const price = priceData?.currentPrice ?? 150; // Default if not loaded
  const regularPrice = priceData?.regularPrice ?? 297;

  // Check login status first, then payment status
  const needsLogin = !isAuthenticated;
  const needsPayment = isAuthenticated && !user?.hasCoachingAccess;
  const hasAccess = isAuthenticated && user?.hasCoachingAccess;

  // Use coaching progress from new hook (database-backed) or fallback to wellness data
  const data = {
    ...wellnessData,
    coachingProgress: coachingData?.coachingProgress || wellnessData.coachingProgress
  };
  const updateCoachingProgress = updateCoachingProgressDB;
  const resetCoachingProgress = resetCoachingProgressDB;

  // Scroll to top when component opens
  useEffect(() => {
    if (activeComponent && activeModuleId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeComponent, activeModuleId]);

  const handleComponentComplete = (componentId: string, responseData?: any) => {
    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];

    // Find the module for this component to get weekNumber
    const module = coachingModules.find(m =>
      m.components.some(c => c.id === componentId)
    );

    if (module) {
      // Always save/update - overwrite existing data if component was already completed
      updateCoachingProgress({
        componentId,
        moduleId: module.id,
        weekNumber: module.weekNumber,
        responseData: responseData || {}
      });

      // Add to completed components if not already there
      if (!completedComponents.includes(componentId)) {
        updateCoachingProgress({
          completedComponents: [...completedComponents, componentId]
        });
      }
    } else {
      // Fallback if module not found - always update responseData
      const updatedCompleted = completedComponents.includes(componentId)
        ? completedComponents
        : [...completedComponents, componentId];

      updateCoachingProgress({
        completedComponents: updatedCompleted,
        currentWeek: data.userProfile?.currentWeek || 1,
        responseData: {
          ...(data.coachingProgress?.responseData || {}),
          [componentId]: responseData || {}
        }
      });
    }

    setActiveComponent(null);
    setActiveModuleId(null);
    // Scroll to top when closing component to return to module list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartComponent = (component: any, moduleId: string) => {
    setActiveComponent(component);
    setActiveModuleId(moduleId);
    // Scroll to top when opening a component
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const downloadWeekReport = (module: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const completedComponents = (data.coachingProgress?.completedComponents as string[]) || [];
    const responseData = data.coachingProgress?.responseData || {};

    // Filter components for this week that have been completed
    const weekComponents = module.components.filter((c: any) =>
      completedComponents.includes(c.id)
    );

    if (weekComponents.length === 0) {
      alert('No completed components in this week yet.');
      printWindow.close();
      return;
    }

    // Helper function to format response values
    const formatValue = (value: any, key: string): string => {
      if (value === null || value === undefined) return 'Not answered';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'None selected';
      }
      if (typeof value === 'object') {
        // Handle nested objects (like slider values, etc.)
        return Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }
      return String(value);
    };

    // Generate HTML content
    const htmlContent = `
      <html>
        <head>
          <title>Week ${module.weekNumber} Report - ${module.title}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              padding: 40px; 
              max-width: 900px; 
              margin: 0 auto;
              color: #333;
            }
            h1 { 
              text-align: center; 
              color: #2d3748; 
              margin-bottom: 10px;
              font-size: 28px;
            }
            .subtitle {
              text-align: center;
              color: #718096;
              margin-bottom: 40px;
              font-size: 16px;
            }
            .component {
              margin-bottom: 40px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              background: #f7fafc;
            }
            .component-header {
              background: #4a5568;
              color: white;
              padding: 12px 16px;
              border-radius: 6px;
              margin: -20px -20px 20px -20px;
            }
            .component-title {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .component-description {
              font-size: 14px;
              color: #e2e8f0;
              margin: 5px 0 0 0;
            }
            .response-section {
              margin-top: 15px;
            }
            .question {
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 8px;
              font-size: 15px;
            }
            .answer {
              background: white;
              padding: 12px;
              border-radius: 4px;
              margin-bottom: 15px;
              border-left: 3px solid #4299e1;
              color: #4a5568;
              line-height: 1.6;
            }
            .no-data {
              color: #a0aec0;
              font-style: italic;
              padding: 20px;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
              .component { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Week ${module.weekNumber}: ${module.title}</h1>
          <div class="subtitle">${module.description}</div>
          
          ${weekComponents.map((component: any) => {
      const componentData = responseData[component.id] || {};
      const hasData = Object.keys(componentData).length > 0;

      return `
              <div class="component">
                <div class="component-header">
                  <div class="component-title">${component.title}</div>
                  <div class="component-description">${component.description}</div>
                </div>
                
                ${hasData ? `
                  <div class="response-section">
                    ${Object.entries(componentData)
            .filter(([key]) => !['completedAt', 'progress', 'moduleId', 'weekNumber'].includes(key))
            .map(([key, value]) => `
                        <div class="question">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</div>
                        <div class="answer">${formatValue(value, key)}</div>
                      `).join('')}
                  </div>
                ` : `
                  <div class="no-data">No detailed responses recorded for this component</div>
                `}
              </div>
            `;
    }).join('')}
          
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
        {/* Login/Payment Banner for Preview Mode */}
        {showPreview && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg border border-purple-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  {needsLogin ? (
                    <>
                      <h2 className="text-xl font-bold">🔒 Sign In to View Full Program</h2>
                      <p className="text-purple-100">Create a free account to browse all 6 weeks and 24 components</p>
                    </>
                  ) : needsPayment ? (
                    <>
                      <h2 className="text-xl font-bold">🔒 Program Preview - Full Content Below</h2>
                      <p className="text-purple-100">Browse all 6 weeks and 24 components, then unlock to start your transformation</p>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="text-center bg-white/10 p-4 rounded-lg space-y-3">
                {needsLogin ? (
                  <>
                    <div className="text-2xl font-bold">Start Your Journey</div>
                    <p className="text-sm text-purple-200">Free to browse • ${price.toFixed(2)} to unlock</p>
                    <Button
                      onClick={() => setLocation('/login')}
                      className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                      data-testid="button-login-to-browse"
                    >
                      Sign In / Create Account
                    </Button>
                  </>
                ) : needsPayment ? (
                  <>
                    <div className="text-3xl font-bold">${price.toFixed(2)}</div>
                    <div className="text-sm text-purple-200 line-through">Regular: ${regularPrice.toFixed(2)}</div>
                    <div className="text-green-200 font-semibold mb-2">Save {Math.round((1 - price / regularPrice) * 100)}% Today</div>
                    <Button
                      onClick={() => setLocation('/payment')}
                      className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                      data-testid="button-checkout"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Secure Checkout - ${price.toFixed(2)}
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-800">Important Medical Disclaimer</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                This program provides self-help coaching and educational content for personal development.
                It is <strong>not intended as medical advice</strong> or as a substitute for professional healthcare.
                If you are experiencing severe mental health symptoms, depression, anxiety, or any serious medical condition,
                please consult with your doctor or a qualified healthcare professional before participating.
                Your health and wellbeing are our priority.
              </p>
            </div>
          </div>
        </div>

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
                          {!showPreview && moduleProgress > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadWeekReport(module);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Report
                            </Button>
                          )}
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
                              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${showPreview
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
                                  needsLogin ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setLocation('/login')}
                                      className="flex items-center gap-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                                    >
                                      <Lock className="w-3 h-3" />
                                      Sign in first
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setLocation('/payment')}
                                      className="flex items-center gap-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                                    >
                                      <Lock className="w-3 h-3" />
                                      Unlock (${price.toFixed(2)})
                                    </Button>
                                  )
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

        {showPreview && (
          <section className="mt-12">
            <LeadCapture 
              title="Not Ready to Join the Full Program?" 
              subtitle="Download our free 'Midlife Reset Checklist' and start your journey with these 5 simple daily habits."
            />
          </section>
        )}

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
                    <div className="text-3xl font-bold">${price.toFixed(2)}</div>
                    <div className="text-sm text-purple-200 line-through">Regular: ${regularPrice.toFixed(2)}</div>
                    <div className="text-lg font-semibold">Save ${(regularPrice - price).toFixed(2)} Today</div>
                  </div>
                  <div className="text-center">
                    <div className="space-y-3">
                      {needsLogin ? (
                        <Button
                          onClick={() => setLocation('/login')}
                          size="lg"
                          className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
                          data-testid="button-login-bottom"
                        >
                          Sign In to Continue
                        </Button>
                      ) : needsPayment ? (
                        <Button
                          onClick={() => setLocation('/payment')}
                          size="lg"
                          className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
                          data-testid="button-checkout-bottom"
                        >
                          <CreditCard className="w-5 h-5 mr-3" />
                          Get Instant Access Now
                        </Button>
                      ) : null}
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