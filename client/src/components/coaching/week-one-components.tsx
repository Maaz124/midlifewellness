import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface WeekOneComponentsProps {
  component: any;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export default function WeekOneComponents({ component, onComplete, onClose }: WeekOneComponentsProps) {
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
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Welcome to Your Journey</h3>
                <p className="text-blue-800 mb-4">
                  You're about to begin a transformative experience designed specifically for women navigating midlife transitions. 
                  This interactive component will guide you through {component.title.toLowerCase()}.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900">What You'll Discover:</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Evidence-based techniques for mental clarity</li>
                    <li>Personalized strategies for your unique situation</li>
                    <li>Tools you can use immediately in daily life</li>
                    <li>Progress tracking for lasting transformation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Interactive Exercise</h3>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-gray-700 mb-4">
                    Take a moment to reflect on your current experience. This self-assessment will help personalize 
                    your journey through the program.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How are you feeling about this transition in your life? (1-10 scale)
                      </label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <button
                            key={num}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-purple-100 hover:border-purple-300 text-sm"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's your biggest challenge right now?
                      </label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Share what's on your mind..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What would success look like for you in this program?
                      </label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe your ideal outcome..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Key Takeaways</h3>
                <div className="space-y-2 text-green-800">
                  <p>✓ You've taken the first important step by starting this program</p>
                  <p>✓ Every woman's journey through midlife is unique - honor your experience</p>
                  <p>✓ Small, consistent steps create lasting transformation</p>
                  <p>✓ You have everything within you to navigate this transition successfully</p>
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