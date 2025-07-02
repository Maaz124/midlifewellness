import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Play, Pause } from 'lucide-react';
import { SomaticGrounding } from './somatic-grounding';

interface EnhancedCoachingComponentMinimalProps {
  component: any;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function EnhancedCoachingComponentMinimal({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentMinimalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Week 4: Somatic Grounding Practices
  if (moduleId === 'week-4' && component.id === 'w4-grounding') {
    return <SomaticGrounding onComplete={onComplete} onClose={onClose} />;
  }

  // Default fallback content for other components
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Program
        </Button>
        <Badge variant="secondary">{moduleId}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{component.title}</CardTitle>
          <p className="text-muted-foreground">{component.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Interactive Content</h3>
              <p className="text-gray-700 mb-4">
                This component is currently being enhanced with interactive features. 
                Please check back soon for the full experience.
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Component: {component.id}
              </div>
              <Button onClick={() => onComplete(component.id, { completed: true })}>
                Mark Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}