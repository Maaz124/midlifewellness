import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calendar, Award, Download, BarChart3, Target, BookOpen, Heart } from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';

export default function ProgressPage() {
  const { data } = useWellnessData();
  const [timeRange, setTimeRange] = useState('30');
  const [chartData, setChartData] = useState<any>(null);

  // Mock chart data - in a real app, this would come from your analytics
  const generateMockData = () => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return {
      labels,
      datasets: [
        {
          label: 'Mental Health',
          data: [65, 68, 72, 75],
          borderColor: 'hsl(261, 73%, 66%)',
          backgroundColor: 'hsla(261, 73%, 66%, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: 'hsl(261, 73%, 66%)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Physical Health', 
          data: [60, 63, 68, 70],
          borderColor: 'hsl(14, 86%, 76%)',
          backgroundColor: 'hsla(14, 86%, 76%, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: 'hsl(14, 86%, 76%)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Cognitive Health',
          data: [75, 78, 81, 83],
          borderColor: 'hsl(140, 20%, 65%)',
          backgroundColor: 'hsla(140, 20%, 65%, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: 'hsl(140, 20%, 65%)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  useEffect(() => {
    // Initialize chart when component mounts
    setChartData(generateMockData());
  }, []);

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

  const achievements = [
    {
      id: 'week2-complete',
      title: 'Week 2 Complete',
      description: 'Rewiring Thoughts mastery',
      icon: Award,
      color: 'bg-green-500',
      earnedAt: '2 days ago'
    },
    {
      id: '14-day-streak',
      title: '14-Day Streak',
      description: 'Daily mood tracking',
      icon: TrendingUp,
      color: 'bg-primary',
      earnedAt: '1 day ago'
    }
  ];

  const monthlyStats = {
    avgWellness: Math.round((data.healthScores.mental + data.healthScores.physical + data.healthScores.cognitive) / 3) || 0,
    journalEntries: data.journalEntries.length,
    moodCheckins: data.moodTracking.length,
    goalsAchieved: `${data.goals.filter(g => g.completed).length}/${data.goals.length}`
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress & Insights</h1>
          <p className="text-gray-600">Track your wellness transformation with detailed analytics and personalized insights.</p>
        </div>
        <div className="flex space-x-3">
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
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
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
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-gray-600">Mental Health</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-coral-500 rounded-full"></div>
                    <span className="text-gray-600">Physical Health</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
                    <span className="text-gray-600">Cognitive Health</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                {data.healthScores.overall > 0 ? (
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Tracking: Mental ({data.healthScores.mental}), Physical ({data.healthScores.physical}), Cognitive ({data.healthScores.cognitive})
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Complete health assessments to see your progress</p>
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
              <div className="space-y-3">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className={`w-8 h-8 ${achievement.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{achievement.title}</div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                      </div>
                    </div>
                  );
                })}
                {achievements.length === 0 && (
                  <div className="text-center py-4">
                    <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Complete activities to earn achievements</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood Patterns */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-coral-500" />
              <span>Mood Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
              {data.moodTracking.length > 0 ? (
                <div className="text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Mood distribution chart would appear here</p>
                </div>
              ) : (
                <div className="text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Start tracking your mood to see patterns</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-2xl mb-1">😊</div>
                <div className="text-xs text-gray-500">32%</div>
              </div>
              <div>
                <div className="text-2xl mb-1">🙂</div>
                <div className="text-xs text-gray-500">28%</div>
              </div>
              <div>
                <div className="text-2xl mb-1">😐</div>
                <div className="text-xs text-gray-500">25%</div>
              </div>
              <div>
                <div className="text-2xl mb-1">😔</div>
                <div className="text-xs text-gray-500">12%</div>
              </div>
              <div>
                <div className="text-2xl mb-1">😢</div>
                <div className="text-xs text-gray-500">3%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-20">{day.day}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{day.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
          {data.journalEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data.journalEntries.length}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center p-4 bg-sage/5 rounded-lg">
                  <div className="text-2xl font-bold text-sage-600">
                    {Math.round(data.journalEntries.reduce((acc, entry) => acc + entry.content.split(' ').length, 0) / data.journalEntries.length)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Words/Entry</div>
                </div>
                <div className="text-center p-4 bg-coral/5 rounded-lg">
                  <div className="text-2xl font-bold text-coral-500">
                    {Math.round(data.journalEntries.length / Math.max(1, Math.ceil((Date.now() - new Date(data.userProfile.startDate).getTime()) / (1000 * 60 * 60 * 24))) * 7)}
                  </div>
                  <div className="text-sm text-gray-600">Entries/Week</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Recent Reflections</h4>
                <div className="space-y-3">
                  {data.journalEntries.slice(-3).map((entry, index) => (
                    <div key={entry.id || index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{entry.title || 'Daily Reflection'}</h5>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {entry.content.substring(0, 150)}...
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
