import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';

interface WeekProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

function CBTThoughtTransformationSystem({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [thought, setThought] = useState('');
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [reframe, setReframe] = useState('');

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div>
        <CardTitle className="flex items-center gap-2"><Brain className="w-6 h-6 text-purple-600" />CBT Thought Transformation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Automatic thought" value={thought} onChange={(e)=>setThought(e.target.value)} />
        <Textarea placeholder="Evidence for" value={evidenceFor} onChange={(e)=>setEvidenceFor(e.target.value)} />
        <Textarea placeholder="Evidence against" value={evidenceAgainst} onChange={(e)=>setEvidenceAgainst(e.target.value)} />
        <Textarea placeholder="Balanced reframe" value={reframe} onChange={(e)=>setReframe(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('cbt-thought-transformation',{thought,evidenceFor,evidenceAgainst,reframe})}>Save Reframe</Button>
      </CardContent>
    </Card>
  );
}

function MirrorWorkEmpowermentAffirmations({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [affirmation, setAffirmation] = useState('I am worthy and enough.');
  const [notes, setNotes] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div>
        <CardTitle className="flex items-center gap-2"><Sparkles className="w-6 h-6 text-pink-600" />Mirror Work & Affirmations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={affirmation} onChange={(e)=>setAffirmation(e.target.value)} />
        <Textarea placeholder="Reflections..." value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('mirror-affirmations',{affirmation,notes})}>Save Practice</Button>
      </CardContent>
    </Card>
  );
}

function ThoughtAuditTracker({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [entries, setEntries] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div>
        <CardTitle>Thought Audit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Log a thought" value={current} onChange={(e)=>setCurrent(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={()=>{ if(current.trim()){ setEntries([...entries,current.trim()]); setCurrent(''); }}}>Add</Button>
          <Button variant="outline" onClick={()=>{ setEntries([]); }}>Clear</Button>
        </div>
        <div className="space-y-2">
          {entries.map((t,i)=>(<div key={i} className="p-3 border rounded">{t}</div>))}
        </div>
        <Button className="w-full" onClick={()=>onComplete('thought-audit',{entries})}>Save Audit</Button>
      </CardContent>
    </Card>
  );
}

function NLPReframingPractice({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [situation, setSituation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>NLP Reframe</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Situation" value={situation} onChange={(e)=>setSituation(e.target.value)} />
        <Textarea placeholder="Current meaning" value={meaning} onChange={(e)=>setMeaning(e.target.value)} />
        <Textarea placeholder="New empowering meaning" value={newMeaning} onChange={(e)=>setNewMeaning(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('nlp-reframing',{situation,meaning,newMeaning})}>Save Reframe</Button>
      </CardContent>
    </Card>
  );
}

function HormoneHarmonyMeditation({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [notes, setNotes] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Hormone Harmony Meditation</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Spend 5-10 minutes in a quiet place. Focus on slow breathing and a gentle body scan.</p>
        <Textarea placeholder="How did you feel?" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('hormone-harmony-meditation',{notes, completedAt: new Date().toISOString()})}>Mark Complete</Button>
      </CardContent>
    </Card>
  );
}

function OverwhelmPatternAnalysis({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [triggers, setTriggers] = useState('');
  const [supports, setSupports] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Overwhelm Pattern Analysis</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Common triggers" value={triggers} onChange={(e)=>setTriggers(e.target.value)} />
        <Textarea placeholder="Regulation supports" value={supports} onChange={(e)=>setSupports(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('overwhelm-patterns',{triggers, supports})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function PauseLabelShiftTechnique({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [label, setLabel] = useState('');
  const [shift, setShift] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Pause • Label • Shift</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Label the emotion" value={label} onChange={(e)=>setLabel(e.target.value)} />
        <Textarea placeholder="Shift with action" value={shift} onChange={(e)=>setShift(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('pause-label-shift',{label, shift})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function BoundariesWorksheet({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [boundary, setBoundary] = useState('');
  const [script, setScript] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Boundaries Practice</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Boundary you need" value={boundary} onChange={(e)=>setBoundary(e.target.value)} />
        <Textarea placeholder="I-statement script" value={script} onChange={(e)=>setScript(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('boundaries-worksheet',{boundary, script})}>Save</Button>
      </CardContent>
    </Card>
  );
}

function WeeklyMoodMap({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [weekNotes, setWeekNotes] = useState('');
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><div className="flex items-center justify-between mb-4"><Button variant="outline" onClick={onClose} className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></div><CardTitle>Weekly Mood Map</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Observations across the week" value={weekNotes} onChange={(e)=>setWeekNotes(e.target.value)} />
        <Button className="w-full" onClick={()=>onComplete('weekly-mood-map',{weekNotes})}>Save</Button>
      </CardContent>
    </Card>
  );
}

export default function Week2({ component, onComplete, onClose }: WeekProps) {
  const id = (component?.id || '').toString();
  if (id === 'cbt-thought-transformation') return <CBTThoughtTransformationSystem onComplete={onComplete} onClose={onClose} />;
  if (id === 'mirror-affirmations') return <MirrorWorkEmpowermentAffirmations onComplete={onComplete} onClose={onClose} />;
  if (id === 'thought-audit') return <ThoughtAuditTracker onComplete={onComplete} onClose={onClose} />;
  if (id === 'nlp-reframing') return <NLPReframingPractice onComplete={onComplete} onClose={onClose} />;
  if (id === 'hormone-harmony-meditation') return <HormoneHarmonyMeditation onComplete={onComplete} onClose={onClose} />;
  if (id === 'overwhelm-patterns') return <OverwhelmPatternAnalysis onComplete={onComplete} onClose={onClose} />;
  if (id === 'pause-label-shift') return <PauseLabelShiftTechnique onComplete={onComplete} onClose={onClose} />;
  if (id === 'boundaries-worksheet') return <BoundariesWorksheet onComplete={onComplete} onClose={onClose} />;
  if (id === 'weekly-mood-map') return <WeeklyMoodMap onComplete={onComplete} onClose={onClose} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Component Not Found (Week 2)</h3>
            <p className="text-muted-foreground mb-6">This component id is not recognized.</p>
            <Button onClick={onClose}>Back to Program</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
