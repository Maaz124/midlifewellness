import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface WeekTwoComponentsProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export default function WeekTwoComponents({ component, onComplete, onClose }: WeekTwoComponentsProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const defaultMinutes = useMemo(() => Number(component?.duration) || 10, [component?.duration]);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);

  // Local-only editable fields (prevent parent rehydration from locking inputs)
  const [awarenessNotes, setAwarenessNotes] = useState('');
  const [thoughtLabels, setThoughtLabels] = useState('');
  const [emotionNotes, setEmotionNotes] = useState('');

  // Hydrate from previously saved data (editable afterwards)
  useEffect(() => {
    const saved = (component as any)?.data?.mindfulObservation;
    if (saved) {
      if (typeof saved.awarenessNotes === 'string') setAwarenessNotes(saved.awarenessNotes);
      if (typeof saved.thoughtLabels === 'string') setThoughtLabels(saved.thoughtLabels);
      if (typeof saved.emotionNotes === 'string') setEmotionNotes(saved.emotionNotes);
      if (typeof saved.durationMinutes === 'number') {
        const secs = Math.max(0, Math.floor(saved.durationMinutes * 60));
        setRemainingSeconds(secs);
      }
    }
  }, [component]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!isTimerActive || remainingSeconds <= 0) return;
    const id = setInterval(() => {
      setRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isTimerActive, remainingSeconds]);

  const startTimer = () => {
    setRemainingSeconds(defaultMinutes * 60);
    setIsTimerActive(true);
  };

  const pauseTimer = () => setIsTimerActive(false);
  const resetTimer = () => {
    setIsTimerActive(false);
    setRemainingSeconds(defaultMinutes * 60);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, {
      completed: true,
      mindfulObservation: {
        durationMinutes: defaultMinutes,
        timeRemainingSeconds: remainingSeconds,
        awarenessNotes,
        thoughtLabels,
        emotionNotes,
        completedAt: new Date().toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </div>

        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-2xl text-purple-900 flex items-center gap-3">
              {component.title}
              {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Interactive {component.type}
              </span>
              <span className="text-sm text-purple-600">
                {component.duration} minutes
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Week 2: CBT & Thought Rewiring</h3>
                <p className="text-blue-800">
                  This week focuses on cognitive behavioral therapy techniques specifically designed for midlife transitions. 
                  You'll learn to identify and transform limiting thought patterns that may be holding you back.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Mindful Thought Observation — 10-minute Interactive Practice</h4>
                <p className="text-gray-700 mb-4">
                  Guided thought awareness with timer, prompts, and real-time tracking of thought patterns and emotional responses.
                </p>

                {/* Timer */}
                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Session Timer</div>
                    <div className="text-2xl font-bold text-gray-900">{formatTime(remainingSeconds)}</div>
                  </div>
                  <div className="flex gap-2">
                    {!isTimerActive ? (
                      <Button onClick={startTimer} className="bg-purple-600 hover:bg-purple-700">Start</Button>
                    ) : (
                      <Button variant="outline" onClick={pauseTimer}>Pause</Button>
                    )}
                    <Button variant="outline" onClick={resetTimer}>Reset</Button>
                  </div>
                </div>

                {/* Prompts */}
                <div className="grid gap-6">
                  <div>
                    <Label className="text-sm font-medium">Observe and note what arises (stream of thoughts)</Label>
                    <Textarea
                      placeholder="Write freely. When you notice a thought, you can simply label it 'thinking' and continue observing."
                      value={awarenessNotes}
                      onChange={(e) => setAwarenessNotes(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Thought labels (e.g., planning, judging, worrying)</Label>
                    <Textarea
                      placeholder="Optionally, label categories you notice: planning, judging, future-casting, self-criticism, etc."
                      value={thoughtLabels}
                      onChange={(e) => setThoughtLabels(e.target.value)}
                      className="min-h-[80px] mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Emotional responses</Label>
                    <Textarea
                      placeholder="Note shifts in emotion as you observe (e.g., anxious → neutral, tense → calmer)."
                      value={emotionNotes}
                      onChange={(e) => setEmotionNotes(e.target.value)}
                      className="min-h-[80px] mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Save Progress
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed!' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}