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

function UnderstandingYourHormonalSymphony({ onComplete, onClose }: any) {
  const [notes, setNotes] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Understanding Your Hormonal Symphony</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Read the education section and jot down any insights.</p>
        <Textarea placeholder="Insights" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('hormonal-symphony',{notes})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function EnhancedCognitiveAssessment({ onComplete, onClose }: any) {
  const [score, setScore] = useState(0);
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Enhanced Cognitive Assessment</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
            <Button key={n} variant={score===n?'default':'outline'} size="sm" onClick={()=>setScore(n)} className="w-10 h-10 p-0">{n}</Button>
          ))}
        </div>
        <Button className="w-full" onClick={()=>onComplete('enhanced-cognitive-assessment',{score})}>Save Score</Button>
      </CardContent>
    </Card>
  );
}

function FocusMemoryRituals({ onComplete, onClose }: any) {
  const [done, setDone] = useState(false);
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Focus & Memory Rituals</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Practice one ritual and mark complete.</p>
        <Button className="w-full" disabled={done} onClick={()=>{ setDone(true); onComplete('focus-memory-rituals-week3',{completed:true}); }}>Mark Complete</Button>
      </CardContent>
    </Card>
  );
}

function BrainBoostingNutritionPlan({ onComplete, onClose }: any) {
  const [plan, setPlan] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Brain-Boosting Nutrition Plan</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Meals, supplements, hydration..." value={plan} onChange={(e)=>setPlan(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('brain-nutrition-plan',{plan})}>Save Plan</Button>
      </CardContent>
    </Card>
  );
}

function MindManagementSystem({ onComplete, onClose }: any) {
  const [tool, setTool] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Mind Management System</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Tool you will use (timer, focus blocks, breaks...)" value={tool} onChange={(e)=>setTool(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('mind-management-system',{tool})}>Save</Button>
      </CardContent>
    </Card>
  );
}

export default function Week3({ component, onComplete, onClose }: WeekProps) {
  const id = (component?.id || '').toString();
  if (id === 'hormonal-symphony') return <UnderstandingYourHormonalSymphony onComplete={onComplete} onClose={onClose} />;
  if (id === 'enhanced-cognitive-assessment') return <EnhancedCognitiveAssessment onComplete={onComplete} onClose={onClose} />;
  if (id === 'focus-memory-rituals-week3') return <FocusMemoryRituals onComplete={onComplete} onClose={onClose} />;
  if (id === 'brain-nutrition-plan') return <BrainBoostingNutritionPlan onComplete={onComplete} onClose={onClose} />;
  if (id === 'mind-management-system') return <MindManagementSystem onComplete={onComplete} onClose={onClose} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card><CardContent className="p-8 text-center"><h3 className="text-xl font-semibold mb-4">Component Not Found (Week 3)</h3><p className="text-muted-foreground mb-6">This component id is not recognized.</p><Button onClick={onClose}>Back to Program</Button></CardContent></Card>
      </div>
    </div>
  );
}
