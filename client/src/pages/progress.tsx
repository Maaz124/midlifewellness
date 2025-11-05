import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calendar, Award, Download, BarChart3, Target, BookOpen, Heart, LineChart } from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { useLocation } from 'wouter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { coachingModules } from '@/lib/coaching-data';
import { useCoachingProgress } from '@/hooks/use-coaching-progress';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressPage() {
  const { data } = useWellnessData();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: coachingData } = useCoachingProgress();
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  // Chart data generated via memo to avoid relying on async effects
  // and to render immediately on navigation without reloads

  // Safe fallbacks to avoid undefined during initial render
  const safeScores = data?.healthScores || { mental: 0, physical: 0, cognitive: 0, overall: 0 };
  const safeJournal = Array.isArray(data?.journalEntries) ? data!.journalEntries : [];
  const safeMood = Array.isArray(data?.moodTracking) ? data!.moodTracking : [];
  const safeGoals = Array.isArray(data?.goals) ? data!.goals : [];

  // Enhanced chart data with dynamic color coding
  const generateChartData = () => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'];
    
    // Simulate weekly progress data leading to current scores
    const mentalData = [45, 55, 62, 68, safeScores.mental || 0];
    const physicalData = [40, 50, 58, 65, safeScores.physical || 0];
    const cognitiveData = [50, 60, 68, 75, safeScores.cognitive || 0];
    
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'hsl(142, 76%, 36%)'; // Excellent - Green
      if (score >= 70) return 'hsl(217, 91%, 60%)'; // Very Good - Blue
      if (score >= 60) return 'hsl(45, 93%, 47%)'; // Good - Yellow
      if (score >= 40) return 'hsl(25, 95%, 53%)'; // Fair - Orange
      return 'hsl(0, 84%, 60%)'; // Poor - Red
    };

    return {
      labels,
      datasets: [
        {
          label: 'Mental Health',
          data: mentalData,
          borderColor: getScoreColor(safeScores.mental || 0),
          backgroundColor: chartType === 'bar' 
            ? getScoreColor(safeScores.mental || 0) + '80'
            : getScoreColor(safeScores.mental || 0) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(safeScores.mental || 0),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
        },
        {
          label: 'Physical Health', 
          data: physicalData,
          borderColor: getScoreColor(safeScores.physical || 0),
          backgroundColor: chartType === 'bar'
            ? getScoreColor(safeScores.physical || 0) + '80'
            : getScoreColor(safeScores.physical || 0) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(safeScores.physical || 0),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
        },
        {
          label: 'Cognitive Health',
          data: cognitiveData,
          borderColor: getScoreColor(safeScores.cognitive || 0),
          backgroundColor: chartType === 'bar'
            ? getScoreColor(safeScores.cognitive || 0) + '80'
            : getScoreColor(safeScores.cognitive || 0) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(safeScores.cognitive || 0),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const score = context.parsed.y;
            const category = score >= 80 ? 'Excellent' :
                           score >= 70 ? 'Very Good' :
                           score >= 60 ? 'Good' :
                           score >= 40 ? 'Fair' : 'Needs Focus';
            return `${context.dataset.label}: ${score} (${category})`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
          color: '#6b7280',
          font: {
            size: 11,
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    }
  };

  const chartData = useMemo(() => generateChartData(), [chartType, safeScores.mental, safeScores.physical, safeScores.cognitive]);

  const moodDistribution = {
    'very-happy': { value: 32, color: 'hsl(142, 76%, 36%)', label: 'Very Happy' },
    'happy': { value: 28, color: 'hsl(217, 91%, 60%)', label: 'Happy' },
    'neutral': { value: 25, color: 'hsl(45, 93%, 47%)', label: 'Neutral' },
    'sad': { value: 12, color: 'hsl(25, 95%, 53%)', label: 'Sad' },
    'very-sad': { value: 3, color: 'hsl(0, 84%, 60%)', label: 'Very Sad' }
  };

  const weeklyActivity = [
    { day: 'Monday', percentage: 85, color: 'hsl(142, 76%, 36%)' },
    { day: 'Tuesday', percentage: 92, color: 'hsl(142, 76%, 36%)' },
    { day: 'Wednesday', percentage: 78, color: 'hsl(217, 91%, 60%)' },
    { day: 'Thursday', percentage: 88, color: 'hsl(142, 76%, 36%)' },
    { day: 'Friday', percentage: 95, color: 'hsl(142, 76%, 36%)' },
    { day: 'Saturday', percentage: 72, color: 'hsl(45, 93%, 47%)' },
    { day: 'Sunday', percentage: 81, color: 'hsl(217, 91%, 60%)' }
  ];
  
  // Helper function to get color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'hsl(142, 76%, 36%)'; // Excellent - Green
    if (percentage >= 80) return 'hsl(217, 91%, 60%)'; // Very Good - Blue  
    if (percentage >= 70) return 'hsl(45, 93%, 47%)'; // Good - Yellow
    if (percentage >= 50) return 'hsl(25, 95%, 53%)'; // Fair - Orange
    return 'hsl(0, 84%, 60%)'; // Poor - Red
  };
  
  const getScoreCategory = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 80) return { label: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 70) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score >= 50) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Needs Focus', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const completedComponentsList = (coachingData?.coachingProgress?.completedComponents
    || (data as any)?.coachingProgress?.completedComponents
    || []) as string[];
  const totalCompletedComponents = Array.isArray(completedComponentsList)
    ? completedComponentsList.length
    : 0;

  // Calculate progress for each week (1-6)
  const weekProgress = useMemo(() => {
    const completedComponents = completedComponentsList;
    const progressMap: Record<number, number> = {};
    
    coachingModules.forEach(module => {
      const completedCount = module.components.filter(c => 
        completedComponents.includes(c.id)
      ).length;
      progressMap[module.weekNumber] = Math.round((completedCount / module.components.length) * 100);
    });
    
    return progressMap;
  }, [completedComponentsList]);


  const totalComponents = (coachingModules || []).reduce((acc: number, m: any) => acc + (m.components?.length || 0), 0);

  // Compute monthly aggregates
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const entriesThisMonth = safeJournal.filter((e: any) => {
    const d = new Date(e.createdAt || e.date || now);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  const goalsRatio = totalComponents > 0 ? totalCompletedComponents / totalComponents : 0;
  const moodRatio = daysInMonth > 0 ? Math.min(1, entriesThisMonth / daysInMonth) : 0;
  const avgWellnessPercent = Math.round(((goalsRatio + moodRatio) / 2) * 100);

  const monthlyStats = {
    avgWellness: avgWellnessPercent,
    journalEntries: safeJournal.length,
    moodCheckins: safeJournal.length,
    goalsAchieved: `${totalCompletedComponents}/${totalComponents}`
  };

  // Removed forced reload that caused loops on some environments

  // Enforce login requirement for progress page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // No explicit loading gate needed now; chartData is derived synchronously

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress & Insights</h1>
          <p className="text-gray-600">Track your wellness transformation with detailed analytics and personalized insights.</p>
        </div>
        <div className="flex space-x-3">
          <Select value={chartType} onValueChange={(value: 'line' | 'bar') => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Line Chart
                </div>
              </SelectItem>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Bar Chart
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Chart */}
        <div className="lg:col-span-2">
          <Card className="wellness-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Wellness Trends</span>
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      safeScores.mental >= 80 ? 'bg-emerald-500' :
                      safeScores.mental >= 70 ? 'bg-blue-500' :
                      safeScores.mental >= 60 ? 'bg-amber-500' :
                      safeScores.mental >= 40 ? 'bg-orange-500' : 'bg-rose-500'
                    }`}></div>
                    <span className="text-gray-700 font-medium">Mental Health</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      safeScores.mental >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      safeScores.mental >= 70 ? 'bg-blue-100 text-blue-800' :
                      safeScores.mental >= 60 ? 'bg-amber-100 text-amber-800' :
                      safeScores.mental >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                    }`}>{safeScores.mental}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      safeScores.physical >= 80 ? 'bg-emerald-500' :
                      safeScores.physical >= 70 ? 'bg-blue-500' :
                      safeScores.physical >= 60 ? 'bg-amber-500' :
                      safeScores.physical >= 40 ? 'bg-orange-500' : 'bg-rose-500'
                    }`}></div>
                    <span className="text-gray-700 font-medium">Physical Health</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      safeScores.physical >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      safeScores.physical >= 70 ? 'bg-blue-100 text-blue-800' :
                      safeScores.physical >= 60 ? 'bg-amber-100 text-amber-800' :
                      safeScores.physical >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                    }`}>{safeScores.physical}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      safeScores.cognitive >= 80 ? 'bg-emerald-500' :
                      safeScores.cognitive >= 70 ? 'bg-blue-500' :
                      safeScores.cognitive >= 60 ? 'bg-amber-500' :
                      safeScores.cognitive >= 40 ? 'bg-orange-500' : 'bg-rose-500'
                    }`}></div>
                    <span className="text-gray-700 font-medium">Cognitive Health</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      safeScores.cognitive >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      safeScores.cognitive >= 70 ? 'bg-blue-100 text-blue-800' :
                      safeScores.cognitive >= 60 ? 'bg-amber-100 text-amber-800' :
                      safeScores.cognitive >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                    }`}>{safeScores.cognitive}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4">
                {chartData && safeScores.overall > 0 ? (
                  <div className="h-full">
                    {chartType === 'line' ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Bar data={chartData} options={chartOptions} />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                      {chartType === 'line' ? (
                        <LineChart className="w-8 h-8 text-blue-500" />
                      ) : (
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Wellness Trends Awaiting Data</h3>
                    <p className="text-gray-500 text-sm">Complete your health assessments to see beautiful color-coded {chartType} chart visualization</p>
                    <div className="flex items-center space-x-2 mt-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                    >
                      Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="space-y-6">
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-sage-600" />
                <span>This Month</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Wellness Score</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-800">{monthlyStats.avgWellness}</span>
                    {monthlyStats.avgWellness > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+8</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Journal Entries</span>
                  <span className="text-lg font-bold text-gray-800">{monthlyStats.journalEntries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mood Check-ins</span>
                  <span className="text-lg font-bold text-gray-800">{monthlyStats.moodCheckins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Goals Progress</span>
                  <span className="text-lg font-bold text-gray-800">{monthlyStats.goalsAchieved}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-coral-500" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {/* Week Progress Bars */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-3">Module Progress</div>
                  <div className="space-y-4">
                    {coachingModules.map((module) => {
                      const progress = weekProgress[module.weekNumber] || 0;
                      return (
                        <div key={module.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <Badge variant="outline" className="text-xs">
                                Week {module.weekNumber} • {module.components.length} components
                              </Badge>
                              <span className="text-sm font-medium text-green-600">
                                {progress}%
                              </span>
                            </div>
                            <Progress value={progress} className="w-20 h-2" />
                          </div>
                          <p className="text-xs text-gray-500 ml-0">{module.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      

      {/* Journal Insights */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sage-600" />
            <span>Journal Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {safeJournal.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{safeJournal.length}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center p-4 bg-sage/5 rounded-lg">
                  <div className="text-2xl font-bold text-sage-600">
                    {Math.round(safeJournal.reduce((acc: number, entry: any) => acc + (entry.content?.split(' ').length || 0), 0) / Math.max(1, safeJournal.length))}
                  </div>
                  <div className="text-sm text-gray-600">Avg Words/Entry</div>
                </div>
                <div className="text-center p-4 bg-coral/5 rounded-lg">
                  <div className="text-2xl font-bold text-coral-500">
                    {Math.round(safeJournal.length / Math.max(1, Math.ceil((Date.now() - new Date((data?.userProfile?.startDate || new Date()).toString()).getTime()) / (1000 * 60 * 60 * 24))) * 7)}
                  </div>
                  <div className="text-sm text-gray-600">Entries/Week</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Recent Reflections</h4>
                <div className="space-y-3">
                  {safeJournal.slice(-3).map((entry: any, index: number) => (
                    <div key={entry.id || index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{entry.title || 'Daily Reflection'}</h5>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {String(entry.content || '').substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Start journaling to gain insights into your wellness journey</p>
              <Button className="btn-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
