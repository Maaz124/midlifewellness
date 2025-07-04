import { HealthCalculator } from '@/components/health-calculator';
import { MeditationTimer } from '@/components/meditation-timer';
import { AboutDoctor } from '@/components/about-doctor';
import { useWellnessData } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Target, BookOpen, RefreshCw, Sparkles, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Logo } from '@/components/logo';

export default function Dashboard() {
  const { data, updateHealthScores } = useWellnessData();

  const handleScoreUpdate = (type: 'mental' | 'physical' | 'cognitive', score: number) => {
    const newScores = { [type]: score };
    
    // Calculate overall score
    const scores = { ...data.healthScores, ...newScores };
    const overall = Math.round((scores.mental + scores.physical + scores.cognitive) / 3);
    
    updateHealthScores({ ...newScores, overall });
  };

  const quickActions = [
    {
      label: 'Continue Coaching',
      description: `Week ${data.userProfile.currentWeek}`,
      href: '/coaching',
      icon: 'fas fa-play-circle',
      color: 'bg-primary text-white'
    },
    {
      label: 'Journal Entry',
      description: 'Daily reflection',
      href: '/journal',
      icon: 'fas fa-book',
      color: 'bg-coral text-white'
    },
    {
      label: 'View Progress',
      description: 'See your journey',
      href: '/progress',
      icon: 'fas fa-chart-line',
      color: 'bg-sage text-white'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-sage/5 py-12 rounded-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="xl" className="animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate midlife with confidence through personalized health insights, 
            evidence-based coaching, and supportive tools designed specifically for women.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  data.healthScores.overall >= 80 ? 'bg-emerald-100' :
                  data.healthScores.overall >= 70 ? 'bg-blue-100' :
                  data.healthScores.overall >= 60 ? 'bg-amber-100' :
                  data.healthScores.overall >= 40 ? 'bg-orange-100' : 'bg-rose-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    data.healthScores.overall >= 80 ? 'text-emerald-600' :
                    data.healthScores.overall >= 70 ? 'text-blue-600' :
                    data.healthScores.overall >= 60 ? 'text-amber-600' :
                    data.healthScores.overall >= 40 ? 'text-orange-600' : 'text-rose-600'
                  }`} />
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    data.healthScores.overall >= 80 ? 'text-emerald-600' :
                    data.healthScores.overall >= 70 ? 'text-blue-600' :
                    data.healthScores.overall >= 60 ? 'text-amber-600' :
                    data.healthScores.overall >= 40 ? 'text-orange-600' : 'text-rose-600'
                  }`}>{data.healthScores.overall}</span>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ml-2 ${
                    data.healthScores.overall >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    data.healthScores.overall >= 70 ? 'bg-blue-100 text-blue-800' :
                    data.healthScores.overall >= 60 ? 'bg-amber-100 text-amber-800' :
                    data.healthScores.overall >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {data.healthScores.overall >= 80 ? 'Excellent' :
                     data.healthScores.overall >= 70 ? 'Very Good' :
                     data.healthScores.overall >= 60 ? 'Good' :
                     data.healthScores.overall >= 40 ? 'Fair' : 'Needs Focus'}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Overall Wellness</h3>
              <p className="text-sm text-gray-500">
                {data.healthScores.overall > 0 ? '+12 points this month' : 'Take assessments to get started'}
              </p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-sage-600" />
                </div>
                <span className="text-2xl font-bold text-sage-600">{data.userProfile.currentWeek}/6</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Coaching Progress</h3>
              <p className="text-sm text-gray-500">Week {data.userProfile.currentWeek}: Active</p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-coral-500" />
                </div>
                <span className="text-2xl font-bold text-coral-500">
                  {data.journalEntries.length + data.moodTracking.length}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Active Days</h3>
              <p className="text-sm text-gray-500">Journal & mood entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button className={`w-full h-20 ${action.color} flex flex-col items-center justify-center space-y-2`}>
                <i className={`${action.icon} text-xl`}></i>
                <div className="text-center">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Health Assessment Dashboard */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Assessment Dashboard</h2>
            <p className="text-gray-600">Complete your health calculators to get personalized insights and recommendations.</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <HealthCalculator 
            type="mental" 
            score={data.healthScores.mental}
            onScoreUpdate={(score) => handleScoreUpdate('mental', score)}
          />
          <HealthCalculator 
            type="physical" 
            score={data.healthScores.physical}
            onScoreUpdate={(score) => handleScoreUpdate('physical', score)}
          />
          <HealthCalculator 
            type="cognitive" 
            score={data.healthScores.cognitive}
            onScoreUpdate={(score) => handleScoreUpdate('cognitive', score)}
          />
        </div>
      </section>

      {/* Recent Progress */}
      <section>
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Progress This Week</span>
              <Link href="/progress">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.coachingProgress.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Start your coaching journey to track progress</p>
                  <Link href="/coaching">
                    <Button className="btn-primary">Begin Coaching</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-white"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Completed assessments</p>
                        <p className="text-sm text-gray-600">Health calculators done</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <i className="fas fa-clock text-white"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Week {data.userProfile.currentWeek}: In Progress</p>
                        <p className="text-sm text-gray-600">Continue your journey</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">Active</div>
                      <Progress value={33} className="w-16 h-2 mt-1" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Coaching Program Promotion */}
      <section>
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <Badge className="bg-purple-600 text-white">Premium Program</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Ready for Deep Transformation?
                </h3>
                <p className="text-gray-700">
                  Unlock Dr. Sidra Bukhari's complete 6-week Mind-Body Reset program with 24 interactive components designed specifically for midlife women.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="line-through">$297</span>
                    <span className="text-2xl font-bold text-purple-700 ml-2">$97</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">67% OFF</Badge>
                </div>
                <Link href="/coaching">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Unlock Full Program
                  </Button>
                </Link>
              </div>
              <div className="p-6 bg-white/50">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>24 Interactive Coaching Components</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>CBT & NLP Therapeutic Techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Hormone & Nervous System Focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Lifetime Access to All Content</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-4 italic">
                    *Health Assessment dashboard always stays FREE
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* About Dr. Sidra Bukhari */}
      <section>
        <AboutDoctor />
      </section>

      {/* Meditation Timer */}
      <MeditationTimer />
    </div>
  );
}
