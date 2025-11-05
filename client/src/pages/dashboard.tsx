import { HealthCalculator } from '@/components/health-calculator';
import { AboutDoctor } from '@/components/about-doctor';
import { useWellnessData } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Target, BookOpen, RefreshCw, Sparkles, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Logo } from '@/components/logo';
import { useSEO } from '@/hooks/use-seo';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  // SEO optimization for dashboard page
  useSEO('dashboard');
  
  // Fetch coaching prices from database
  const { data: priceData } = useQuery({
    queryKey: ['/api/coaching-price'],
    queryFn: async () => {
      const res = await fetch('/api/coaching-price');
      return res.json();
    },
  });
  const currentPrice = priceData?.currentPrice ?? 150;
  const regularPrice = priceData?.regularPrice ?? 297;
  
  const { data, updateHealthScores } = useWellnessData();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const hasAccess = !!(user as any)?.hasCoachingAccess;
  const accessGrantedAt = (user as any)?.coachingAccessGrantedAt as string | undefined;

  // Provide default values to prevent undefined errors
  const userProfile = data?.userProfile || { currentWeek: 1 };
  const journalEntries = data?.journalEntries || [];
  
  // Fetch journal entries from API (one per day) when authenticated
  const { data: apiJournalEntries = [], isLoading: isLoadingApiEntries } = useQuery({
    queryKey: ['/api/journal-entries'],
    queryFn: async () => {
      const res = await fetch('/api/journal-entries', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch journal entries');
      return res.json();
    },
    enabled: !!isAuthenticated,
    staleTime: 30000,
  });

  // Fetch health assessments from backend when authenticated
  const { data: apiHealthAssessments = [] } = useQuery({
    queryKey: ['/api/health-assessments'],
    queryFn: async () => {
      const res = await fetch('/api/health-assessments', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch health assessments');
      return res.json();
    },
    enabled: !!isAuthenticated,
    staleTime: 30000,
  });

  // Calculate health scores from backend data or fallback to local storage
  const getHealthScores = () => {
    if (isAuthenticated && Array.isArray(apiHealthAssessments) && apiHealthAssessments.length > 0) {
      // Get latest assessment for each type
      const mental = apiHealthAssessments
        .filter((a: any) => a.assessmentType === 'mental')
        .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
      const physical = apiHealthAssessments
        .filter((a: any) => a.assessmentType === 'physical')
        .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
      const cognitive = apiHealthAssessments
        .filter((a: any) => a.assessmentType === 'cognitive')
        .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

      const mentalScore = mental?.score || 0;
      const physicalScore = physical?.score || 0;
      const cognitiveScore = cognitive?.score || 0;
      const overall = Math.round((mentalScore + physicalScore + cognitiveScore) / 3);

      return { mental: mentalScore, physical: physicalScore, cognitive: cognitiveScore, overall };
    }
    // Fallback to local storage
    return data?.healthScores || { mental: 0, physical: 0, cognitive: 0, overall: 0 };
  };

  const healthScores = getHealthScores();
  const activeDaysCount = isAuthenticated ? (Array.isArray(apiJournalEntries) ? apiJournalEntries.length : 0) : journalEntries.length;
  const moodTracking = data?.moodTracking || [];
  const coachingProgress = data?.coachingProgress || { completedComponents: [], currentWeek: 1, responseData: {} };

  const handleScoreUpdate = (type: 'mental' | 'physical' | 'cognitive', score: number) => {
    // Update local storage for fallback (non-authenticated users)
    const newScores = { [type]: score };
    const scores = { ...healthScores, ...newScores };
    const overall = Math.round((scores.mental + scores.physical + scores.cognitive) / 3);
    updateHealthScores({ ...newScores, overall });
    
    // Note: Backend save is handled in HealthCalculator component
  };

  const quickActions = [
    {
      label: 'Continue Coaching',
      description: `Week ${userProfile.currentWeek}`,
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-3">
            Navigate midlife with confidence through personalized health insights, 
            evidence-based coaching, and supportive tools designed specifically for women.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            <strong>Please note:</strong> This is a self-help coaching program, not medical advice. 
            Consult your healthcare provider for serious mental health concerns.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  healthScores.overall >= 80 ? 'bg-emerald-100' :
                  healthScores.overall >= 70 ? 'bg-blue-100' :
                  healthScores.overall >= 60 ? 'bg-amber-100' :
                  healthScores.overall >= 40 ? 'bg-orange-100' : 'bg-rose-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    healthScores.overall >= 80 ? 'text-emerald-600' :
                    healthScores.overall >= 70 ? 'text-blue-600' :
                    healthScores.overall >= 60 ? 'text-amber-600' :
                    healthScores.overall >= 40 ? 'text-orange-600' : 'text-rose-600'
                  }`} />
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    healthScores.overall >= 80 ? 'text-emerald-600' :
                    healthScores.overall >= 70 ? 'text-blue-600' :
                    healthScores.overall >= 60 ? 'text-amber-600' :
                    healthScores.overall >= 40 ? 'text-orange-600' : 'text-rose-600'
                  }`}>{healthScores.overall}</span>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ml-2 ${
                    healthScores.overall >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    healthScores.overall >= 70 ? 'bg-blue-100 text-blue-800' :
                    healthScores.overall >= 60 ? 'bg-amber-100 text-amber-800' :
                    healthScores.overall >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {healthScores.overall >= 80 ? 'Excellent' :
                     healthScores.overall >= 70 ? 'Very Good' :
                     healthScores.overall >= 60 ? 'Good' :
                     healthScores.overall >= 40 ? 'Fair' : 'Needs Focus'}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Overall Wellness</h3>
              <p className="text-sm text-gray-500">
                {healthScores.overall > 0 ? '+12 points this month' : 'Take assessments to get started'}
              </p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-sage-600" />
                </div>
                <span className="text-2xl font-bold text-sage-600">{userProfile.currentWeek}/6</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Coaching Progress</h3>
              <p className="text-sm text-gray-500">Week {userProfile.currentWeek}: Active</p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-coral-500" />
                </div>
                <span className="text-2xl font-bold text-coral-500">
                  {activeDaysCount}
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
            <p className="text-xs text-gray-500 mt-1">
              <em>Note: These assessments are for wellness coaching purposes and do not replace professional medical evaluation.</em>
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <HealthCalculator 
            type="mental" 
            score={healthScores.mental}
            onScoreUpdate={(score) => handleScoreUpdate('mental', score)}
          />
          <HealthCalculator 
            type="physical" 
            score={healthScores.physical}
            onScoreUpdate={(score) => handleScoreUpdate('physical', score)}
          />
          <HealthCalculator 
            type="cognitive" 
            score={healthScores.cognitive}
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
              {(!hasAccess && coachingProgress.completedComponents.length === 0) ? (
                <div className="text-center py-8 space-y-4">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Transform Your Life?</h3>
                    <p className="text-gray-500 mb-4">Access the complete 6-week Mind Reset Method coaching program</p>
                  </div>
                  <div className="space-y-2">
                    <Link href="/coaching">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Explore Full Program - ${currentPrice.toFixed(2)}
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500">
                      Includes 24 interactive components, progress tracking, and lifetime access
                    </p>
                  </div>
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
                        <p className="font-medium text-gray-900">Week {userProfile.currentWeek}: In Progress</p>
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
        {/* Only show success message if payment is completed (hasCoachingAccess is true and coachingAccessGrantedAt exists) */}
        {hasAccess && accessGrantedAt ? (
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Successfully Done
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-semibold text-lg">
                      Payment Amount: ${currentPrice.toFixed(2)}
                    </p>
                    {accessGrantedAt && (
                      <>
                        <p className="text-base">
                          Date: {new Date(accessGrantedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-base">
                          Time: {new Date(accessGrantedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                      <span className="line-through">${regularPrice.toFixed(2)}</span>
                      <span className="text-2xl font-bold text-purple-700 ml-2">${currentPrice.toFixed(2)}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {regularPrice > 0 ? `${Math.round((1 - currentPrice / regularPrice) * 100)}% OFF` : ''}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/coaching">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Unlock Your Program
                      </Button>
                    </Link>
                  </div>
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
        )}
      </section>

      {/* About Dr. Sidra Bukhari */}
      <section>
        <AboutDoctor />
      </section>

      
    </div>
  );
}
