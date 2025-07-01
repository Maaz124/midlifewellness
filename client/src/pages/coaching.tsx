import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, Lock, Play, Calendar, Award, Video, FileText, Headphones, PenTool } from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { coachingModules } from '@/lib/coaching-data';
import { ModuleComponent } from '@/types/wellness';

export default function Coaching() {
  const { data, updateCoachingProgress } = useWellnessData();
  const [selectedModule, setSelectedModule] = useState(null);

  const getModuleStatus = (weekNumber: number) => {
    if (weekNumber < data.userProfile.currentWeek) return 'completed';
    if (weekNumber === data.userProfile.currentWeek) return 'current';
    return 'locked';
  };

  const getModuleProgress = (weekNumber: number) => {
    const progress = data.coachingProgress.find(p => p.weekNumber === weekNumber);
    return progress?.progress || 0;
  };

  const getComponentIcon = (type: ModuleComponent['type']) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'worksheet': return FileText;
      case 'exercise': return PenTool;
      case 'reflection': return PenTool;
      default: return FileText;
    }
  };

  const handleContinueWeek = (weekNumber: number) => {
    // Update current week if advancing
    if (weekNumber > data.userProfile.currentWeek) {
      // Logic to advance week would go here
    }
    
    // For demo purposes, just update progress
    const currentProgress = getModuleProgress(weekNumber);
    updateCoachingProgress(weekNumber, Math.min(100, currentProgress + 25));
  };

  const currentWeek = data.userProfile.currentWeek;
  const overallProgress = (currentWeek - 1) / 6 * 100;

  return (
    <div className="space-y-12">
      {/* Program Header */}
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          The Mind Reset Method
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          A 6-week interactive coaching journey designed specifically for midlife women navigating transitions with grace and confidence.
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Week {currentWeek}</div>
            <div>of 6</div>
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sage-600">{Math.round(overallProgress)}%</div>
            <div>Complete</div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="gradient-primary rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">6 Weeks</h3>
            <p className="text-purple-100">Structured program with weekly milestones</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Expert Content</h3>
            <p className="text-purple-100">Video lessons, audio meditations, and worksheets</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p className="text-purple-100">Monitor your transformation journey</p>
          </div>
        </div>
      </section>

      {/* Current Week Highlight */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="wellness-card border-2 border-primary">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {currentWeek}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {coachingModules[currentWeek - 1]?.title}
                    </h3>
                    <Badge className="bg-primary text-white">Current Week</Badge>
                  </div>
                </div>
                <Play className="w-8 h-8 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">
                {coachingModules[currentWeek - 1]?.description}
              </p>

              <div className="space-y-4 mb-6">
                {coachingModules[currentWeek - 1]?.components.map((component, index) => {
                  const Icon = getComponentIcon(component.type);
                  const isCompleted = index < 2; // Demo: first 2 components completed
                  
                  return (
                    <div key={component.id} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : index === 2 ? 'bg-primary' : 'border-2 border-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : index === 2 ? (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {component.title}
                          </span>
                        </div>
                        {component.duration && (
                          <span className="text-xs text-gray-500">{component.duration} min</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Week Progress</span>
                  <span className="text-sm text-primary font-medium">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              <Button 
                onClick={() => handleContinueWeek(currentWeek)}
                className="w-full btn-primary"
              >
                Continue Week {currentWeek}
                <Play className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle>Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coachingModules.slice(0, 3).map((module) => {
                  const status = getModuleStatus(module.weekNumber);
                  const progress = getModuleProgress(module.weekNumber);
                  
                  return (
                    <div key={module.id} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                      status === 'completed' ? 'bg-green-50 border-green-200' :
                      status === 'current' ? 'bg-primary/5 border-primary/20' :
                      'bg-gray-50 border-gray-200 opacity-60'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'current' ? 'bg-primary text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : module.weekNumber}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{module.title}</h4>
                        <p className="text-sm text-gray-500">
                          {status === 'completed' ? 'Completed' :
                           status === 'current' ? `${progress}% complete` :
                           `Unlocks after Week ${module.weekNumber - 1}`}
                        </p>
                      </div>
                      {status === 'current' && (
                        <div className="w-8 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      )}
                      {status === 'locked' && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                  );
                })}
                
                {/* Upcoming weeks */}
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500 mb-2">+ 3 more weeks to unlock</div>
                  <div className="flex justify-center space-x-2">
                    {[4, 5, 6].map((week) => (
                      <div key={week} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                        {week}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Modules Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Complete Program Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachingModules.map((module) => {
            const status = getModuleStatus(module.weekNumber);
            const progress = getModuleProgress(module.weekNumber);
            
            return (
              <Card key={module.id} className={`wellness-card ${
                status === 'current' ? 'border-primary border-2' : ''
              }`}>
                <CardHeader className={`${
                  status === 'completed' ? 'bg-green-50' :
                  status === 'current' ? 'bg-primary/5' :
                  'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      status === 'completed' ? 'bg-green-500 text-white' :
                      status === 'current' ? 'bg-primary text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : module.weekNumber}
                    </div>
                    {status === 'locked' && <Lock className="w-5 h-5 text-gray-400" />}
                    {status === 'current' && <Clock className="w-5 h-5 text-primary" />}
                    {status === 'completed' && <Award className="w-5 h-5 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    {module.components.slice(0, 2).map((component) => {
                      const Icon = getComponentIcon(component.type);
                      return (
                        <div key={component.id} className="flex items-center space-x-2">
                          <Icon className="w-3 h-3 text-gray-400" />
                          <span>{component.title}</span>
                        </div>
                      );
                    })}
                    {module.components.length > 2 && (
                      <div className="text-gray-400">+ {module.components.length - 2} more activities</div>
                    )}
                  </div>

                  {status === 'current' && (
                    <>
                      <Progress value={progress} className="mb-4" />
                      <Button 
                        onClick={() => handleContinueWeek(module.weekNumber)}
                        className="w-full btn-primary"
                        size="sm"
                      >
                        Continue
                      </Button>
                    </>
                  )}
                  
                  {status === 'completed' && (
                    <Button variant="outline" className="w-full" size="sm">
                      Review Content
                    </Button>
                  )}
                  
                  {status === 'locked' && (
                    <Button variant="outline" className="w-full opacity-50" size="sm" disabled>
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
