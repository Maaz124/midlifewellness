import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface WeekTwoComponentsProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export default function WeekTwoComponents({ component, onComplete, onClose }: WeekTwoComponentsProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, { completed: true });
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
                <h4 className="font-semibold text-gray-900 mb-3">Interactive CBT Exercise</h4>
                <p className="text-gray-700 mb-4">
                  Practice identifying thought patterns and reframing them for more empowering perspectives.
                </p>
                
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      Interactive Component Loading...
                    </h3>
                    <p className="text-purple-700">
                      The full CBT worksheet and interactive exercises will load here.
                    </p>
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