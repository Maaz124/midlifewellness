import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LeadCapture from '@/components/marketing/LeadCapture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calendar, Award, Download, BarChart3, Target, BookOpen, Heart, LineChart, FileDown, History } from 'lucide-react';
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
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: coachingData } = useCoachingProgress();
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

  // Fetch all health assessments from API
  const { data: apiHealthAssessments } = useQuery({
    queryKey: ['/api/health-assessments'],
    queryFn: async () => {
      const res = await fetch('/api/health-assessments', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch health assessments');
      const data = await res.json();

      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch journal entries from API
  const { data: apiJournalEntries = [] } = useQuery({
    queryKey: ['/api/journal-entries'],
    queryFn: async () => {
      const res = await fetch('/api/journal-entries', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch journal entries');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  // Safe fallbacks to avoid undefined during initial render
  const safeScores = data?.healthScores || { mental: 0, physical: 0, cognitive: 0, overall: 0 };
  const safeJournal = isAuthenticated && apiJournalEntries.length > 0
    ? apiJournalEntries
    : (Array.isArray(data?.journalEntries) ? data!.journalEntries : []);
  const safeMood = Array.isArray(data?.moodTracking) ? data!.moodTracking : [];
  const safeGoals = Array.isArray(data?.goals) ? data!.goals : [];

  // Enhanced chart data with dynamic color coding - NOW USING REAL DATA
  const generateChartData = () => {
    // Get real historical data from API, sorted by date
    const mentalAssessments = (apiHealthAssessments || [])
      .filter((a: any) => a.assessmentType === 'mental')
      .sort((a: any, b: any) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    const physicalAssessments = (apiHealthAssessments || [])
      .filter((a: any) => a.assessmentType === 'physical')
      .sort((a: any, b: any) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    const cognitiveAssessments = (apiHealthAssessments || [])
      .filter((a: any) => a.assessmentType === 'cognitive')
      .sort((a: any, b: any) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    // Determine the maximum number of assessments to show
    const maxAssessments = Math.max(
      mentalAssessments.length,
      physicalAssessments.length,
      cognitiveAssessments.length
    );

    // If no assessments, return empty data
    if (maxAssessments === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Limit to last 5 assessments for optimal chart visualization
    const limit = Math.min(maxAssessments, 5);
    const mentalLimited = mentalAssessments.slice(-limit);
    const physicalLimited = physicalAssessments.slice(-limit);
    const cognitiveLimited = cognitiveAssessments.slice(-limit);

    // Create labels from dates - use the assessment with most records
    const primaryAssessments = mentalLimited.length >= physicalLimited.length && mentalLimited.length >= cognitiveLimited.length
      ? mentalLimited
      : physicalLimited.length >= cognitiveLimited.length
        ? physicalLimited
        : cognitiveLimited;

    const labels = primaryAssessments.map((a: any, index: number) => {
      const date = new Date(a.completedAt);
      // Show "Assessment 1", "Assessment 2", etc. or use date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // If we don't have enough labels, pad with generic labels
    while (labels.length < limit) {
      labels.push(`Assessment ${labels.length + 1}`);
    }

    // Extract scores - pad with null if assessment doesn't exist for that time period
    const mentalData = labels.map((_: string, index: number) =>
      mentalLimited[index]?.score ?? null
    );
    const physicalData = labels.map((_: string, index: number) =>
      physicalLimited[index]?.score ?? null
    );
    const cognitiveData = labels.map((_: string, index: number) =>
      cognitiveLimited[index]?.score ?? null
    );

    // Get latest scores for color coding
    const latestMental = mentalLimited[mentalLimited.length - 1]?.score || 0;
    const latestPhysical = physicalLimited[physicalLimited.length - 1]?.score || 0;
    const latestCognitive = cognitiveLimited[cognitiveLimited.length - 1]?.score || 0;

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
          borderColor: getScoreColor(latestMental),
          backgroundColor: chartType === 'bar'
            ? getScoreColor(latestMental) + '80'
            : getScoreColor(latestMental) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(latestMental),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
          spanGaps: true, // Connect points even if there are null values
        },
        {
          label: 'Physical Health',
          data: physicalData,
          borderColor: getScoreColor(latestPhysical),
          backgroundColor: chartType === 'bar'
            ? getScoreColor(latestPhysical) + '80'
            : getScoreColor(latestPhysical) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(latestPhysical),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
          spanGaps: true,
        },
        {
          label: 'Cognitive Health',
          data: cognitiveData,
          borderColor: getScoreColor(latestCognitive),
          backgroundColor: chartType === 'bar'
            ? getScoreColor(latestCognitive) + '80'
            : getScoreColor(latestCognitive) + '20',
          borderWidth: chartType === 'line' ? 3 : 2,
          pointBackgroundColor: getScoreColor(latestCognitive),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line' ? true : false,
          borderRadius: chartType === 'bar' ? 6 : 0,
          borderSkipped: false,
          spanGaps: true,
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
          boxWidth: 8,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
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
          color: '#f3f4f6',
        },
        ticks: {
          callback: function (value: any) {
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

  const chartData = useMemo(() => generateChartData(), [chartType, apiHealthAssessments]);

  const moodDistribution = {
    'very-happy': { value: 32, color: 'hsl(142, 76%, 36%)', label: 'Very Happy' },
    'happy': { value: 45, color: 'hsl(217, 91%, 60%)', label: 'Happy' },
    'neutral': { value: 15, color: 'hsl(45, 93%, 47%)', label: 'Neutral' },
    'sad': { value: 8, color: 'hsl(25, 95%, 53%)', label: 'Sad' }
  };

  const downloadCSV = () => {
    if (!apiHealthAssessments || apiHealthAssessments.length === 0) return;

    // Define CSV headers
    const headers = ['Date', 'Time', 'Assessment Type', 'Score', 'Category'];

    // Format data rows
    const rows = apiHealthAssessments.map((a: any) => {
      const date = new Date(a.completedAt);
      const score = a.score;
      const category = score >= 80 ? 'Excellent' :
        score >= 70 ? 'Very Good' :
          score >= 60 ? 'Good' :
            score >= 40 ? 'Fair' : 'Needs Focus';

      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        a.assessmentType.charAt(0).toUpperCase() + a.assessmentType.slice(1) + ' Health',
        score,
        category
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wellness_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Download week report function
  const downloadWeekReport = (module: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const completedComponents = (coachingData?.coachingProgress?.completedComponents as string[]) || [];
    const responseData = coachingData?.coachingProgress?.responseData || {};

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

  // Comprehensive export report function
  const exportComprehensiveReport = async () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Fetch gratitude entries
    let gratitudeEntries: any[] = [];
    try {
      const res = await fetch('/api/gratitude-entries', { credentials: 'include' });
      if (res.ok) {
        gratitudeEntries = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch gratitude entries:', error);
    }

    const completedComponents = (coachingData?.coachingProgress?.completedComponents as string[]) || [];
    const responseData = coachingData?.coachingProgress?.responseData || {};

    // Helper function to format values
    const formatValue = (value: any): string => {
      if (value === null || value === undefined) return 'Not answered';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'None selected';
      }
      if (typeof value === 'object') {
        return Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }
      return String(value);
    };

    // Get assessment category
    const getAssessmentCategory = (score: number) => {
      if (score >= 80) return 'Excellent';
      if (score >= 70) return 'Very Good';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      return 'Needs Focus';
    };

    const htmlContent = `
      <html>
        <head>
          <title>Comprehensive Wellness Report - ${(user as any)?.firstName || 'User'}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              padding: 40px; 
              max-width: 1000px; 
              margin: 0 auto;
              color: #333;
              line-height: 1.6;
            }
            h1 { 
              text-align: center; 
              color: #2d3748; 
              margin-bottom: 10px;
              font-size: 32px;
              border-bottom: 3px solid #4299e1;
              padding-bottom: 15px;
            }
            h2 {
              color: #2d3748;
              margin-top: 40px;
              margin-bottom: 20px;
              font-size: 24px;
              border-left: 4px solid #4299e1;
              padding-left: 15px;
            }
            h3 {
              color: #4a5568;
              margin-top: 25px;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .subtitle {
              text-align: center;
              color: #718096;
              margin-bottom: 40px;
              font-size: 16px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .info-item {
              background: #f7fafc;
              padding: 12px;
              border-radius: 6px;
              border-left: 3px solid #4299e1;
            }
            .info-label {
              font-weight: 600;
              color: #4a5568;
              font-size: 14px;
            }
            .info-value {
              color: #2d3748;
              font-size: 16px;
              margin-top: 4px;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .week-section {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
            }
            .week-header {
              background: #4a5568;
              color: white;
              padding: 12px 16px;
              border-radius: 6px;
              margin: -20px -20px 20px -20px;
              font-size: 18px;
              font-weight: bold;
            }
            .component {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .component-title {
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 10px;
            }
            .response-item {
              margin-bottom: 10px;
            }
            .question {
              font-weight: 600;
              color: #4a5568;
              font-size: 14px;
            }
            .answer {
              color: #2d3748;
              margin-left: 10px;
            }
            .entry {
              background: #f7fafc;
              border-left: 3px solid #4299e1;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 4px;
            }
            .entry-date {
              font-weight: 600;
              color: #4a5568;
              font-size: 14px;
            }
            .entry-content {
              color: #2d3748;
              margin-top: 8px;
            }
            .assessment-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .assessment-table th {
              background: #4a5568;
              color: white;
              padding: 10px;
              text-align: left;
              font-weight: 600;
            }
            .assessment-table td {
              padding: 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            .assessment-table tr:hover {
              background: #f7fafc;
            }
            .score-excellent { color: #10b981; font-weight: bold; }
            .score-very-good { color: #3b82f6; font-weight: bold; }
            .score-good { color: #f59e0b; font-weight: bold; }
            .score-fair { color: #f97316; font-weight: bold; }
            .score-needs-focus { color: #ef4444; font-weight: bold; }
            .no-data {
              color: #a0aec0;
              font-style: italic;
              text-align: center;
              padding: 20px;
            }
            @media print {
              body { padding: 20px; }
              .section { page-break-inside: avoid; }
              h2 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Comprehensive Wellness Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          
          <!-- User Information -->
          <div class="section">
            <h2>User Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${(user as any)?.firstName || 'N/A'} ${(user as any)?.lastName || ''}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${(user as any)?.email || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Components Completed</div>
                <div class="info-value">${totalCompletedComponents} / ${totalComponents}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Current Week</div>
                <div class="info-value">Week ${(() => {
        for (let i = 0; i < coachingModules.length; i++) {
          const module = coachingModules[i];
          const moduleCompleted = module.components.every(c => completedComponents.includes(c.id));
          if (!moduleCompleted) return i + 1;
        }
        return 6;
      })()} of 6</div>
              </div>
            </div>
          </div>

          <!-- Health Assessments -->
          <div class="section">
            <h2>Health Assessments</h2>
            ${apiHealthAssessments && apiHealthAssessments.length > 0 ? `
              <table class="assessment-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  ${[...apiHealthAssessments]
          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .map((assessment: any) => {
            const score = assessment.score;
            const category = getAssessmentCategory(score);
            const scoreClass = score >= 80 ? 'score-excellent' :
              score >= 70 ? 'score-very-good' :
                score >= 60 ? 'score-good' :
                  score >= 40 ? 'score-fair' : 'score-needs-focus';

            return `
                        <tr>
                          <td>${new Date(assessment.completedAt).toLocaleDateString()} ${new Date(assessment.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td style="text-transform: capitalize;">${assessment.assessmentType} Health</td>
                          <td class="${scoreClass}">${score}</td>
                          <td>${category}</td>
                        </tr>
                      `;
          }).join('')}
                </tbody>
              </table>
            ` : '<div class="no-data">No health assessments completed yet</div>'}
          </div>

          <!-- Coaching Progress by Week -->
          <div class="section">
            <h2>6-Week Coaching Program Progress</h2>
            ${coachingModules.map((module: any) => {
            const weekComponents = module.components.filter((c: any) => completedComponents.includes(c.id));
            const progressPercent = Math.round((weekComponents.length / module.components.length) * 100);

            return `
                <div class="week-section">
                  <div class="week-header">
                    Week ${module.weekNumber}: ${module.title} (${progressPercent}% Complete)
                  </div>
                  <p style="color: #4a5568; margin-bottom: 15px;">${module.description}</p>
                  
                  ${weekComponents.length > 0 ? weekComponents.map((component: any) => {
              const componentData = responseData[component.id] || {};
              const hasData = Object.keys(componentData).length > 0;

              return `
                      <div class="component">
                        <div class="component-title">${component.title}</div>
                        ${hasData ? `
                          ${Object.entries(componentData)
                    .filter(([key]) => !['completedAt', 'progress', 'moduleId', 'weekNumber'].includes(key))
                    .map(([key, value]) => `
                              <div class="response-item">
                                <span class="question">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                <span class="answer">${formatValue(value)}</span>
                              </div>
                            `).join('')}
                        ` : '<div style="color: #a0aec0; font-style: italic;">Completed (no detailed responses recorded)</div>'}
                      </div>
                    `;
            }).join('') : '<div class="no-data">No components completed in this week yet</div>'}
                </div>
              `;
          }).join('')}
          </div>

          <!-- Journal Entries -->
          <div class="section">
            <h2>Journal Entries</h2>
            ${safeJournal.length > 0 ? `
              ${[...safeJournal]
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((entry: any) => `
                  <div class="entry">
                    <div class="entry-date">
                      ${new Date(entry.createdAt).toLocaleDateString()} - ${entry.title || 'Daily Reflection'}
                      ${entry.mood ? ` | Mood: ${entry.mood.replace('-', ' ')}` : ''}
                    </div>
                    <div class="entry-content">${entry.content}</div>
                  </div>
                `).join('')}
            ` : '<div class="no-data">No journal entries yet</div>'}
          </div>

          <!-- Gratitude Entries -->
          <div class="section">
            <h2>Gratitude Entries</h2>
            ${gratitudeEntries.length > 0 ? `
              ${gratitudeEntries
          .sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
          .map((entry: any) => `
                  <div class="entry">
                    <div class="entry-date">${new Date(entry.savedAt).toLocaleDateString()}</div>
                    <div class="entry-content">
                      ${entry.items ? entry.items.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('<br>') : entry.gratitude || 'N/A'}
                    </div>
                  </div>
                `).join('')}
            ` : '<div class="no-data">No gratitude entries yet</div>'}
          </div>

          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Removed forced reload that caused loops on some environments

  // Enforce login requirement for progress page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600 mt-2">Track your wellness journey and achievements</p>
          </div>
          <div className="flex gap-2">

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  View Full History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center">
                    <span>Assessment History</span>
                    <Button onClick={downloadCSV} className="flex items-center gap-2">
                      <FileDown className="w-4 h-4" />
                      Download CSV
                    </Button>
                  </DialogTitle>
                  <DialogDescription>
                    A complete record of all your health assessments.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiHealthAssessments && apiHealthAssessments.length > 0 ? (
                        [...apiHealthAssessments]
                          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                          .map((assessment: any) => {
                            const score = assessment.score;
                            const category = score >= 80 ? 'Excellent' :
                              score >= 70 ? 'Very Good' :
                                score >= 60 ? 'Good' :
                                  score >= 40 ? 'Fair' : 'Needs Focus';
                            const colorClass = score >= 80 ? 'text-emerald-600' :
                              score >= 70 ? 'text-blue-600' :
                                score >= 60 ? 'text-amber-600' :
                                  score >= 40 ? 'text-orange-600' : 'text-red-600';

                            return (
                              <TableRow key={assessment.id}>
                                <TableCell>{new Date(assessment.completedAt).toLocaleDateString()} {new Date(assessment.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                <TableCell className="capitalize font-medium">{assessment.assessmentType} Health</TableCell>
                                <TableCell>
                                  <span className={`font-bold ${colorClass}`}>{score}</span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`${score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        score >= 40 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                          'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                    {category}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No assessments found. Take your first assessment to see history!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="flex items-center gap-2" onClick={exportComprehensiveReport}>
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Wellness Trends Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Wellness Trends
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Your health scores over time</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4">
                {chartData && chartData.labels && chartData.labels.length > 0 ? (
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

          {/* This Month Stats */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Latest Wellness Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(() => {
                        // Calculate overall wellness score from latest assessments (same as dashboard)
                        if (!apiHealthAssessments || apiHealthAssessments.length === 0) return 0;

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

                        // Only calculate average from assessments that have been taken
                        const scores = [mentalScore, physicalScore, cognitiveScore].filter(s => s > 0);
                        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                      })()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Journal Entries This Month</p>
                    <p className="text-2xl font-bold text-purple-700">{entriesThisMonth}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-pink-900">Components Completed</p>
                    <p className="text-2xl font-bold text-pink-700">
                      {totalCompletedComponents} / {totalComponents}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">Current Week</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      Week {(() => {
                        const completedComponents = (coachingData?.coachingProgress?.completedComponents as string[]) || [];
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
                      })()} of 6
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Milestones */}
        <div className="grid">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {coachingModules.map((module, index) => {
                  // Calculate progress for this module
                  const completedComponents = coachingData?.coachingProgress?.completedComponents || [];
                  const moduleProgress = module.components.filter(c => completedComponents.includes(c.id)).length;
                  const totalComponents = module.components.length;
                  const progressPercent = Math.round((moduleProgress / totalComponents) * 100);

                  return (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${progressPercent === 100 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {progressPercent === 100 ? <Award className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{module.title}</p>
                            <p className="text-xs text-gray-500">Week {index + 1}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {progressPercent > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadWeekReport(module)}
                              className="flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span className="hidden sm:inline">Report</span>
                            </Button>
                          )}
                          <span className="text-sm font-medium text-gray-600">{progressPercent}%</span>
                        </div>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>



      {/* Journal Insights */}
      <Card className="wellness-card mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sage-600" />
            <span>Journal Insights</span>
          </CardTitle>
          {safeJournal.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  View Full History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center">
                    <span>Journal History</span>
                    <Button
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        if (!printWindow) return;

                        const htmlContent = `
                          <html>
                            <head>
                              <title>Journal History</title>
                              <style>
                                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                                h1 { text-align: center; color: #333; margin-bottom: 40px; }
                                .entry { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 30px; }
                                .header { display: flex; justify-content: space-between; margin-bottom: 10px; color: #666; font-size: 0.9em; }
                                .title { font-size: 1.2em; font-weight: bold; color: #2d3748; margin-bottom: 10px; }
                                .mood { display: inline-block; background: #f7fafc; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; margin-bottom: 10px; }
                                .content { white-space: pre-wrap; line-height: 1.6; color: #4a5568; }
                              </style>
                            </head>
                            <body>
                              <h1>My Journal History</h1>
                              ${[...safeJournal]
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((entry: any) => `
                                  <div class="entry">
                                    <div class="header">
                                      <span>${new Date(entry.createdAt).toLocaleDateString()}</span>
                                      <span>${new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div class="title">${entry.title || 'Daily Reflection'}</div>
                                    ${entry.mood ? `<div class="mood">Mood: ${entry.mood}</div>` : ''}
                                    <div class="content">${entry.content}</div>
                                  </div>
                                `).join('')}
                              <script>
                                window.onload = () => { window.print(); }
                              </script>
                            </body>
                          </html>
                        `;

                        printWindow.document.write(htmlContent);
                        printWindow.document.close();
                      }}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Mood</TableHead>
                        <TableHead>Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...safeJournal]
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((entry: any) => (
                          <TableRow key={entry.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{entry.title || 'Daily Reflection'}</TableCell>
                            <TableCell>
                              {entry.mood && (
                                <Badge variant="outline" className="capitalize">
                                  {entry.mood.replace('-', ' ')}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-md truncate text-gray-500">
                              {entry.content}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          )}
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
                  {[...safeJournal]
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((entry: any, index: number) => (
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
                        {entry.mood && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              Mood: {entry.mood.replace('-', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Start journaling to gain insights into your wellness journey</p>
              <Button className="btn-primary" onClick={() => setLocation('/journal')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Capture CTA */}
      {(!isAuthenticated || !(user as any)?.hasCoachingAccess) && (
        <section className="mt-16">
          <LeadCapture 
            title="Want Deeper Insights into Your Progress?" 
            subtitle="Join 3,000+ women tracking their midlife transformation. Get our free expert assessment template today."
          />
        </section>
      )}
    </div>
  );
}
