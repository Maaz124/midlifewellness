import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoachingComponent } from '@/components/coaching-component';
import { EnhancedCoachingComponentMinimal } from '@/components/enhanced-coaching-component-working';
import { useWellnessData } from '@/hooks/use-local-storage';
import { coachingModules, getModuleProgress } from '@/lib/coaching-data';
import { Clock, CheckCircle, Lock, BookOpen, FileText, Headphones, Brain, Video, Target, Heart, Lightbulb, Shield, Star } from 'lucide-react';

export default function Coaching() {
  const { data, updateCoachingProgress, resetCoachingProgress } = useWellnessData();
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

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
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'exercise': return <Brain className="w-4 h-4" />;
      case 'worksheet': return <FileText className="w-4 h-4" />;
      case 'reflection': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getModuleIcon = (weekNumber: number) => {
    switch (weekNumber) {
      case 1: return <Heart className="w-6 h-6" />;
      case 2: return <Brain className="w-6 h-6" />;
      case 3: return <Shield className="w-6 h-6" />;
      case 4: return <Target className="w-6 h-6" />;
      case 5: return <Lightbulb className="w-6 h-6" />;
      case 6: return <Star className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const isModuleUnlocked = (weekNumber: number) => {
    return weekNumber <= data.userProfile.currentWeek || weekNumber <= 5; // Unlock first 5 weeks for demo
  };

  const getComponentContent = (component: any) => {
    const contentMap: { [key: string]: any } = {
      // Week 1 - Hormones and Headspace
      'w1-video': {
        content: "In this foundational video, you'll learn about the profound changes happening in your brain during perimenopause and midlife. We'll explore how fluctuating hormones affect neurotransmitters, memory, mood, and cognitive function. Understanding these changes helps normalize your experience and provides a scientific foundation for the strategies we'll implement throughout the program.",
        keyPoints: ["Hormonal impact on brain function", "Neurotransmitter changes during perimenopause", "Why brain fog occurs", "The connection between stress hormones and cognition"],
        actionSteps: ["Complete the hormone symptom tracker", "Begin daily mood observations", "Notice patterns in your energy levels"]
      },
      'w1-journal': {
        content: "This reflective exercise helps you identify the mental and emotional load you've been carrying, often unconsciously. Many midlife women are surprised by how much they've been managing without acknowledgment or support.",
        keyPoints: ["Mental load vs. physical tasks", "Invisible emotional labor", "Impact on cognitive resources", "Recognition as the first step to change"],
        actionSteps: ["List all responsibilities you manage", "Identify which ones drain your energy most", "Consider what you're ready to release or delegate"]
      },
      'w1-tracking': {
        content: "Begin tracking your daily mood, energy levels, and physical symptoms to identify patterns. This data will help you understand your unique hormonal patterns and responses.",
        keyPoints: ["Mood tracking basics", "Energy pattern recognition", "Symptom correlation", "Building self-awareness"],
        actionSteps: ["Track mood 3x daily", "Note energy levels", "Record physical symptoms", "Look for weekly patterns"]
      },
      'w1-awareness': {
        content: "Develop awareness of your automatic thoughts throughout the day. This foundational skill is essential for all the cognitive work we'll do in coming weeks.",
        keyPoints: ["Automatic vs. intentional thoughts", "Thought observation without judgment", "The power of awareness", "Building mindfulness habits"],
        actionSteps: ["Set 3 daily awareness reminders", "Notice thoughts without changing them", "Record patterns you observe"]
      },

      // Week 2 - Rewiring Thoughts  
      'w2-cbt': {
        content: "Learn evidence-based cognitive behavioral therapy techniques to identify and challenge negative thought patterns. You'll master the ABCDE model and thought record process.",
        keyPoints: ["CBT fundamentals", "The ABCDE model", "Thought challenging techniques", "Evidence-based reframing"],
        actionSteps: ["Practice daily thought records", "Use the ABCDE model", "Challenge negative predictions", "Develop balanced thinking"]
      },
      'w2-mirror': {
        content: "Transform your self-talk through mirror work and personalized affirmation practice. This powerful technique helps rewire neural pathways for self-compassion.",
        keyPoints: ["Mirror work benefits", "Affirmation science", "Self-compassion development", "Neural pathway rewiring"],
        actionSteps: ["Daily mirror affirmations", "Write personal affirmations", "Practice self-compassionate language", "Track self-talk changes"]
      },
      'w2-audit': {
        content: "Systematically identify and replace self-critical thoughts with balanced, supportive inner dialogue. This worksheet provides a structured approach to thought transformation.",
        keyPoints: ["Self-critical pattern identification", "Thought replacement strategies", "Inner critic vs. wise mentor", "Sustainable thought change"],
        actionSteps: ["Complete daily thought audits", "Identify top 3 critical patterns", "Create replacement thoughts", "Practice new thought patterns"]
      },
      'w2-nlp': {
        content: "Apply neuro-linguistic programming techniques to rapidly shift limiting beliefs and create empowering mental representations.",
        keyPoints: ["NLP reframing techniques", "Belief change processes", "Mental representation shifts", "Anchoring positive states"],
        actionSteps: ["Practice belief change exercise", "Create positive mental anchors", "Use reframing in challenging situations", "Build new empowering beliefs"]
      },

      // Week 3 - Emotional Regulation & Boundaries
      'w3-patterns': {
        content: "Identify your unique overwhelm triggers and emotional patterns. Understanding these patterns is the first step to developing targeted regulation strategies.",
        keyPoints: ["Personal overwhelm triggers", "Emotional pattern recognition", "Physiological stress signals", "Early warning systems"],
        actionSteps: ["Map personal triggers", "Track emotional intensity", "Identify early warning signs", "Create intervention strategies"]
      },
      'w3-technique': {
        content: "Master the three-step Pause-Label-Shift technique for real-time emotional regulation. This evidence-based approach helps you respond rather than react.",
        keyPoints: ["The pause response", "Emotional labeling benefits", "Conscious shifting techniques", "Building emotional intelligence"],
        actionSteps: ["Practice in low-stakes situations", "Use technique during stress", "Track effectiveness", "Refine personal approach"]
      },
      'w3-boundaries': {
        content: "Learn to establish healthy boundaries in relationships and commitments without guilt or conflict. Develop scripts and strategies for boundary communication.",
        keyPoints: ["Healthy boundary types", "Boundary communication scripts", "Managing guilt and pushback", "Maintaining boundaries consistently"],
        actionSteps: ["Assess current boundaries", "Identify needed boundaries", "Practice boundary conversations", "Implement gradually"]
      },
      'w3-mood-map': {
        content: "Create a visual representation of your emotional landscape to better understand patterns and plan regulation strategies.",
        keyPoints: ["Emotional pattern visualization", "Trigger mapping", "Resource identification", "Pattern interruption strategies"],
        actionSteps: ["Map weekly emotional patterns", "Identify peak challenge times", "Plan support strategies", "Track pattern changes"]
      },

      // Week 4 - Nervous System Reset
      'w4-grounding': {
        content: `🌱 Somatic Grounding Practices - Body-based techniques to regulate your nervous system and find calm in moments of stress.

        Interactive Grounding Session:
        This is your dedicated space for learning and practicing nervous system regulation techniques specifically designed for midlife women.

        🎯 Try This Right Now - 5-4-3-2-1 Technique:
        Take a moment to practice grounding yourself in the present moment:

        👀 Name 5 things you can see: (Blue coffee mug, sunlight through window, wooden table grain...)
        👂 Name 4 things you can hear: (Air conditioning humming, birds outside, your breathing...)
        ✋ Name 3 things you can touch: (Smooth phone screen, soft fabric of your shirt, cool table surface...)
        👃 Name 2 things you can smell: (Coffee brewing, fresh air, cleaning products...)
        👅 Name 1 thing you can taste: (Lingering coffee, toothpaste, just the taste of your mouth...)

        🌟 Notice the Difference:
        How do you feel now compared to when you started? Even this simple practice can shift your nervous system from stress to calm.

        💡 Why This Works for Midlife Women:
        • Hormonal regulation: Grounding activates your vagus nerve, helping balance stress hormones
        • Instant relief: Works during hot flashes, anxiety spikes, or overwhelming moments  
        • Brain training: Strengthens your prefrontal cortex to manage emotional responses
        • Always available: No equipment needed - you can do this anywhere, anytime`,
        keyPoints: [
          "5-4-3-2-1 sensory grounding technique",
          "Progressive body awareness scanning", 
          "4-7-8 calming breath pattern",
          "Vagus nerve activation for hormonal balance",
          "Emergency grounding for acute stress"
        ],
        actionSteps: [
          "Practice 5-4-3-2-1 technique daily for 5 minutes",
          "Use grounding during stressful moments",
          "Notice which senses are most grounding for you", 
          "Build a personal grounding toolkit",
          "Track your nervous system responses"
        ]
      },
      'w4-breathwork': {
        content: "Master breathing techniques and vagus nerve exercises that activate your parasympathetic nervous system for deep calm and restoration.",
        keyPoints: ["Vagus nerve function", "Parasympathetic activation", "Breathing patterns", "Nervous system reset"],
        actionSteps: ["Practice box breathing", "Use cold water technique", "Humming exercises", "Daily vagus nerve toning"]
      },
      'w4-calm-corner': {
        content: "Design a dedicated physical space that supports nervous system regulation and serves as your sanctuary for self-care and restoration.",
        keyPoints: ["Environment and nervous system", "Sensory calming elements", "Sacred space creation", "Accessibility planning"],
        actionSteps: ["Choose your space", "Add calming elements", "Create ritual objects", "Use space daily"]
      },
      'w4-meditation': {
        content: "Guided meditation specifically designed to calm and restore your nervous system through visualization and body awareness techniques.",
        keyPoints: ["Meditation for nervous system", "Visualization techniques", "Body scan practice", "Restoration imagery"],
        actionSteps: ["Daily meditation practice", "Try different techniques", "Track nervous system changes", "Build consistency"]
      },

      // Week 5 - Clarity & Cognitive Flow
      'w5-rituals': {
        content: "Develop daily practices and rituals that enhance cognitive function, memory, and mental clarity through intentional habit design.",
        keyPoints: ["Cognitive enhancement rituals", "Memory support practices", "Focus optimization", "Brain health habits"],
        actionSteps: ["Create morning cognitive ritual", "Design focus practices", "Build memory techniques", "Track cognitive improvements"]
      },
      'w5-nutrition': {
        content: "Learn about foods, supplements, and lifestyle factors that support optimal brain health and cognitive function during midlife.",
        keyPoints: ["Brain-healthy foods", "Supplement strategies", "Hydration and cognition", "Lifestyle factors"],
        actionSteps: ["Plan brain-healthy meals", "Consider supplements", "Optimize hydration", "Track cognitive energy"]
      },
      'w5-planner': {
        content: "Create a personalized weekly planning system that works with your cognitive strengths and energy patterns for maximum effectiveness.",
        keyPoints: ["Energy-based planning", "Cognitive load management", "Priority systems", "Time optimization"],
        actionSteps: ["Map energy patterns", "Design weekly template", "Practice planning", "Refine system"]
      },
      'w5-mind-dump': {
        content: "Learn techniques to clear mental clutter and overwhelm so you can focus on what truly matters most in your life and goals.",
        keyPoints: ["Mental decluttering", "Priority clarification", "Cognitive space", "Focus enhancement"],
        actionSteps: ["Daily mind dumps", "Priority ranking", "Energy allocation", "Focus sessions"]
      },

      // Week 6 - Future Self & Goal Mapping
      'w6-vision': {
        content: "Create a compelling digital vision board that represents your ideal future self and serves as daily inspiration for your growth journey.",
        keyPoints: ["Vision board creation", "Future self visualization", "Goal imagery", "Inspiration tools"],
        actionSteps: ["Collect inspiring images", "Create digital board", "Write vision statements", "Daily visualization"]
      },
      'w6-goals': {
        content: "Learn to set SMART goals that are aligned with your values and create a strategic plan for achieving your most important objectives.",
        keyPoints: ["SMART goal framework", "Values alignment", "Strategic planning", "Milestone creation"],
        actionSteps: ["Define core values", "Set SMART goals", "Create action plans", "Set milestones"]
      },
      'w6-reverse': {
        content: "Master the reverse engineering method to work backwards from your goals and create a clear, actionable roadmap to success.",
        keyPoints: ["Reverse engineering process", "Milestone mapping", "Action step planning", "Timeline creation"],
        actionSteps: ["Start with end goal", "Map backwards", "Define milestones", "Create timeline"]
      },
      'w6-habits': {
        content: "Design sustainable habit loops that support your long-term goals and create lasting positive change in your daily life.",
        keyPoints: ["Habit loop design", "Sustainability strategies", "Behavior change", "Long-term success"],
        actionSteps: ["Identify keystone habits", "Design habit loops", "Create tracking system", "Build consistency"]
      }
    };

    return contentMap[component.id] || {
      content: "Detailed content for this component will guide you through specific exercises and learning objectives tailored for midlife women's wellness journey.",
      keyPoints: ["Key learning objective", "Important concept", "Practical application"],
      actionSteps: ["Complete the exercise", "Reflect on insights", "Apply in daily life"]
    };
  };

  // Show active component if one is selected
  if (activeComponent && activeModuleId) {
    console.log('Coaching Page - Active Component:', activeComponent.id, 'Module:', activeModuleId);
    
    // Use enhanced component for Week 1, Week 2, Week 3, and Week 4 with detailed content
    if (activeModuleId === 'week-1' || activeModuleId === 'week-2' || activeModuleId === 'week-3' || activeModuleId === 'week-4') {
      return (
        <EnhancedCoachingComponentMinimal
          component={activeComponent}
          moduleId={activeModuleId}
          onComplete={handleComponentComplete}
          onClose={() => {
            setActiveComponent(null);
            setActiveModuleId(null);
          }}
        />
      );
    }
    
    // Use regular component for other weeks
    return (
      <CoachingComponent
        component={activeComponent}
        moduleId={activeModuleId}
        onComplete={handleComponentComplete}
        onClose={() => {
          setActiveComponent(null);
          setActiveModuleId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-600 to-sage-600 bg-clip-text text-transparent">
          The Mind Reset Method
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A 6-week transformational journey designed specifically for women navigating midlife transitions
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary">Week {data.userProfile.currentWeek} of 6</Badge>
          <Progress value={(data.userProfile.currentWeek / 6) * 100} className="w-32" />
          <div className="text-sm text-muted-foreground">
            {data.coachingProgress.completedComponents?.length || 0} components completed
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetCoachingProgress();
              window.location.reload();
            }}
            className="text-coral-600 border-coral-200 hover:bg-coral-50"
          >
            Reset Progress
          </Button>
        </div>
      </div>

      {/* Program Overview */}
      <Card className="bg-gradient-to-r from-coral-50 to-sage-50 border-coral-200">
        <CardHeader>
          <CardTitle className="text-xl">Program Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">What You'll Achieve:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Understand and manage hormonal brain changes</li>
                <li>• Transform negative thought patterns</li>
                <li>• Master emotional regulation techniques</li>
                <li>• Reset and strengthen your nervous system</li>
                <li>• Enhance cognitive clarity and focus</li>
                <li>• Create a compelling vision for your future</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Program Features:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Video lessons with expert guidance</li>
                <li>• Interactive worksheets and exercises</li>
                <li>• Guided audio meditations</li>
                <li>• Daily reflection prompts</li>
                <li>• Progress tracking tools</li>
                <li>• Lifetime access to materials</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="grid gap-6">
        {coachingModules.map((module) => {
          const progress = getModuleProgress(module.id, data.coachingProgress.completedComponents || []);
          const isUnlocked = isModuleUnlocked(module.weekNumber);
          
          return (
            <Card key={module.id} className={`transition-all duration-200 ${isUnlocked ? 'hover:shadow-lg' : 'opacity-60'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-coral-100 text-coral-600' : 'bg-muted text-muted-foreground'}`}>
                      {getModuleIcon(module.weekNumber)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">Week {module.weekNumber} • {module.components.length} components</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {isUnlocked ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-24" />
                  </div>
                </div>
                <p className="text-muted-foreground">{module.description}</p>
              </CardHeader>
              
              {isUnlocked && (
                <CardContent>
                  <div className="grid gap-3">
                    {module.components.map((component) => {
                      const isCompleted = data.coachingProgress.completedComponents?.includes(component.id) || false;
                      const componentContent = getComponentContent(component);
                      
                      return (
                        <div key={component.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-sage-100 text-sage-600'}`}>
                              {getComponentIcon(component.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{component.title}</h4>
                              <p className="text-sm text-muted-foreground">{component.description}</p>
                              {component.duration && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Clock className="w-3 h-3" />
                                  {component.duration} minutes
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedComponent(component)}>
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    {getComponentIcon(component.type)}
                                    {component.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {component.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="content" className="mt-4">
                                  <TabsList>
                                    <TabsTrigger value="content">Content</TabsTrigger>
                                    <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                                    <TabsTrigger value="actions">Action Steps</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="content" className="space-y-4">
                                    <p className="text-sm leading-relaxed">{componentContent.content}</p>
                                  </TabsContent>
                                  <TabsContent value="keypoints" className="space-y-2">
                                    <ul className="space-y-2">
                                      {componentContent.keyPoints.map((point: string, index: number) => (
                                        <li key={index} className="text-sm flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 bg-coral-500 rounded-full mt-2 flex-shrink-0" />
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </TabsContent>
                                  <TabsContent value="actions" className="space-y-2">
                                    <ul className="space-y-3">
                                      {componentContent.actionSteps.map((step: string, index: number) => (
                                        <li key={index} className="text-sm flex items-start gap-3">
                                          <div className="w-6 h-6 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            {index + 1}
                                          </div>
                                          {step}
                                        </li>
                                      ))}
                                    </ul>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant={isCompleted ? "secondary" : "default"}
                              onClick={() => handleStartComponent(component, module.id)}
                              disabled={isCompleted}
                            >
                              {isCompleted ? "✓ Done" : "Start"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="bg-sage-50 border-sage-200">
        <CardHeader>
          <CardTitle className="text-lg">How to Use This Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong>Weekly Structure:</strong> Each week builds on the previous, so complete modules in order for best results.</p>
          <p><strong>Time Commitment:</strong> Plan 30-45 minutes per day for optimal progress through the materials.</p>
          <p><strong>Component Types:</strong> Videos provide teaching, worksheets offer structure, exercises are hands-on practice, and reflections deepen integration.</p>
          <p><strong>Progress Tracking:</strong> Mark components complete as you finish them to track your journey and unlock new content.</p>
        </CardContent>
      </Card>
    </div>
  );
}