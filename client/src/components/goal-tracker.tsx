import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Moon, Clover, Heart, Dumbbell, Plus, Check, Target, Calendar as CalendarLucide, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Goal, Habit } from '@/types/wellness';

interface GoalTrackerProps {
  goals: Goal[];
  habits: Habit[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (goalId: number, updates: Partial<Goal>) => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  onUpdateHabit: (habitId: number, updates: Partial<Habit>) => void;
}

export function GoalTracker({ goals, habits, onAddGoal, onUpdateGoal, onAddHabit, onUpdateHabit }: GoalTrackerProps) {
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'sleep' as Goal['category'],
    targetValue: 0,
    targetDate: undefined as Date | undefined
  });
  const [habitForm, setHabitForm] = useState({
    name: '',
    description: '',
    frequency: 'daily' as Habit['frequency']
  });

  const categoryIcons = {
    sleep: Moon,
    mindfulness: Clover,
    'self-care': Heart,
    exercise: Dumbbell
  };

  const categoryColors = {
    sleep: 'bg-primary-100 text-primary-700',
    mindfulness: 'bg-sage-100 text-sage-700',
    'self-care': 'bg-coral-100 text-coral-700',
    exercise: 'bg-blue-100 text-blue-700'
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (progress: number) => {
    if (progress >= 80) return 'On track';
    if (progress >= 60) return 'Good progress';
    if (progress >= 40) return 'Behind';
    return 'Needs attention';
  };

  const handleAddGoal = () => {
    if (goalForm.title.trim()) {
      onAddGoal({
        ...goalForm,
        currentValue: 0,
        completed: false,
        progress: 0,
        targetDate: goalForm.targetDate?.toISOString()
      });
      setGoalForm({
        title: '',
        description: '',
        category: 'sleep',
        targetValue: 0,
        targetDate: undefined
      });
      setNewGoalOpen(false);
    }
  };

  const handleAddHabit = () => {
    if (habitForm.name.trim()) {
      onAddHabit({
        ...habitForm,
        streak: 0,
        completedDays: []
      });
      setHabitForm({
        name: '',
        description: '',
        frequency: 'daily'
      });
      setNewHabitOpen(false);
    }
  };

  const toggleHabitCompletion = (habitId: number, dayIndex: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newCompletedDays = [...habit.completedDays];
    newCompletedDays[dayIndex] = !newCompletedDays[dayIndex];
    
    // Calculate new streak
    let newStreak = 0;
    for (let i = newCompletedDays.length - 1; i >= 0; i--) {
      if (newCompletedDays[i]) {
        newStreak++;
      } else {
        break;
      }
    }

    onUpdateHabit(habitId, {
      completedDays: newCompletedDays,
      streak: newStreak,
      lastCompleted: newCompletedDays[dayIndex] ? new Date().toISOString() : habit.lastCompleted
    });
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Habits</h2>
          <p className="text-gray-600">Set meaningful goals and build positive habits that support your midlife wellness journey.</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Improve Sleep Quality"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-description">Description</Label>
                  <Textarea
                    id="goal-description"
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your goal in detail..."
                  />
                </div>
                <div>
                  <Label htmlFor="goal-category">Category</Label>
                  <Select value={goalForm.category} onValueChange={(value: Goal['category']) => setGoalForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sleep">Sleep</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="self-care">Self-Care</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal-target">Target Value (optional)</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    value={goalForm.targetValue}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 30 (for 30 days)"
                  />
                </div>
                <div>
                  <Label>Target Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {goalForm.targetDate ? format(goalForm.targetDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={goalForm.targetDate}
                        onSelect={(date) => setGoalForm(prev => ({ ...prev, targetDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleAddGoal} className="w-full btn-primary">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={newHabitOpen} onOpenChange={setNewHabitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    value={habitForm.name}
                    onChange={(e) => setHabitForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Morning meditation"
                  />
                </div>
                <div>
                  <Label htmlFor="habit-description">Description (optional)</Label>
                  <Textarea
                    id="habit-description"
                    value={habitForm.description}
                    onChange={(e) => setHabitForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your habit..."
                  />
                </div>
                <div>
                  <Label htmlFor="habit-frequency">Frequency</Label>
                  <Select value={habitForm.frequency} onValueChange={(value: Habit['frequency']) => setHabitForm(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddHabit} className="w-full btn-primary">
                  Create Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Goals */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Active Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No goals set yet. Create your first goal to get started!</p>
                </div>
              ) : (
                goals.map((goal) => {
                  const Icon = categoryIcons[goal.category];
                  return (
                    <div key={goal.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{goal.title}</h4>
                          {goal.description && (
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${categoryColors[goal.category]}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm text-primary font-medium">
                          {goal.currentValue}/{goal.targetValue || '∞'}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="mb-4" />
                      
                      <div className="flex items-center justify-between text-sm">
                        {goal.targetDate && (
                          <span className="text-gray-500 flex items-center">
                            <CalendarLucide className="w-4 h-4 mr-1" />
                            {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        <span className={`font-medium ${getStatusColor(goal.progress)}`}>
                          {getStatusText(goal.progress)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Habit Tracker */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              <span>Daily Habits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No habits tracked yet. Add your first habit to start building consistency!</p>
                </div>
              ) : (
                habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{habit.name}</h4>
                        <p className="text-xs text-gray-500">{habit.streak}-day streak</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(7)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => toggleHabitCompletion(habit.id!, index)}
                          className={`w-6 h-6 rounded-sm transition-colors ${
                            habit.completedDays[index]
                              ? 'bg-primary'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
