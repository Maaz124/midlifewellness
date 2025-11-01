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

function BreathworkVagusReset({ onComplete, onClose }: any) {
  const [minutes, setMinutes] = useState(5);
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Breathwork • Vagus Reset</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[2,3,5,8,10].map(n => (<Button key={n} variant={minutes===n?'default':'outline'} size="sm" onClick={()=>setMinutes(n)}>{n} min</Button>))}
        </div>
        <Button className="w-full" onClick={()=>onComplete('breathwork-vagus-reset',{minutes, completedAt: new Date().toISOString()})}>Mark Complete</Button>
      </CardContent>
    </Card>
  );
}

function SomaticGroundingPractices({ onComplete, onClose }: any) {
  const [practice, setPractice] = useState('5-4-3-2-1 senses');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Somatic Grounding</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={practice} onChange={(e)=>setPractice(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('somatic-grounding-practices',{practice})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function CreateCalmCorner({ onComplete, onClose }: any) {
  const [items, setItems] = useState('Candle, blanket, soft light');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Create Your Calm Corner</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={items} onChange={(e)=>setItems(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('create-calm-corner',{items})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function GuidedGroundingMeditation({ onComplete, onClose }: any) {
  const [notes, setNotes] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Guided Grounding Meditation</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="How did it feel?" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('guided-grounding-meditation',{notes})}>Mark Complete</Button>
      </CardContent>
    </Card>
  );
}

export default function Week4({ component, onComplete, onClose }: WeekProps) {
  const id = (component?.id || '').toString();
  if (id === 'breathwork-vagus-reset') return <BreathworkVagusReset onComplete={onComplete} onClose={onClose} />;
  if (id === 'somatic-grounding-practices') return <SomaticGroundingPractices onComplete={onComplete} onClose={onClose} />;
  if (id === 'create-calm-corner') return <CreateCalmCorner onComplete={onComplete} onClose={onClose} />;
  if (id === 'guided-grounding-meditation') return <GuidedGroundingMeditation onComplete={onComplete} onClose={onClose} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card><CardContent className="p-8 text-center"><h3 className="text-xl font-semibold mb-4">Component Not Found (Week 4)</h3><p className="text-muted-foreground mb-6">This component id is not recognized.</p><Button onClick={onClose}>Back to Program</Button></CardContent></Card>
      </div>
    </div>
  );
}
