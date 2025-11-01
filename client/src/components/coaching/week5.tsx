import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface WeekProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

function FutureSelfVisualization({ onComplete, onClose }: any) {
  const [vision, setVision] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Future Self Visualization</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Describe your future self..." value={vision} onChange={(e)=>setVision(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('future-self-visualization',{vision})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function SmartGoalArchitecture({ onComplete, onClose }: any) {
  const [goal, setGoal] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>SMART Goal</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Specific, Measurable, Achievable, Relevant, Time-bound" value={goal} onChange={(e)=>setGoal(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('smart-goal-architecture',{goal})}>Save Goal</Button>
      </CardContent>
    </Card>
  );
}

function ReverseEngineeringSuccess({ onComplete, onClose }: any) {
  const [steps, setSteps] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Reverse Engineering Success</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="List the steps backward from success..." value={steps} onChange={(e)=>setSteps(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('reverse-engineering-success',{steps})}>Save Plan</Button>
      </CardContent>
    </Card>
  );
}

function HabitLoopMastery({ onComplete, onClose }: any) {
  const [habit, setHabit] = useState('');
  const [cue, setCue] = useState('');
  const [routine, setRoutine] = useState('');
  const [reward, setReward] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Habit Loop Mastery</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Habit" value={habit} onChange={(e)=>setHabit(e.target.value)} />
        <Textarea placeholder="Cue" value={cue} onChange={(e)=>setCue(e.target.value)} />
        <Textarea placeholder="Routine" value={routine} onChange={(e)=>setRoutine(e.target.value)} />
        <Textarea placeholder="Reward" value={reward} onChange={(e)=>setReward(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('habit-loop-mastery',{habit, cue, routine, reward})}>Save Habit</Button>
      </CardContent>
    </Card>
  );
}

export default function Week5({ component, onComplete, onClose }: WeekProps) {
  const id = (component?.id || '').toString();
  if (id === 'future-self-visualization') return <FutureSelfVisualization onComplete={onComplete} onClose={onClose} />;
  if (id === 'smart-goal-architecture') return <SmartGoalArchitecture onComplete={onComplete} onClose={onClose} />;
  if (id === 'reverse-engineering-success') return <ReverseEngineeringSuccess onComplete={onComplete} onClose={onClose} />;
  if (id === 'habit-loop-mastery') return <HabitLoopMastery onComplete={onComplete} onClose={onClose} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card><CardContent className="p-8 text-center"><h3 className="text-xl font-semibold mb-4">Component Not Found (Week 5-6)</h3><p className="text-muted-foreground mb-6">This component id is not recognized.</p><Button onClick={onClose}>Back to Program</Button></CardContent></Card>
      </div>
    </div>
  );
}
