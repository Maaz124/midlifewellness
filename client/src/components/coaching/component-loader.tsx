import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load week component modules
const Week1Components = lazy(() => import('./week1'));
const Week2Components = lazy(() => import('./week2'));
const Week3Components = lazy(() => import('./week3'));
const Week4Components = lazy(() => import('./week4'));
const Week5Components = lazy(() => import('./week5'));

interface ComponentLoaderProps {
  component: any;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function ComponentLoader({ component, moduleId, onComplete, onClose }: ComponentLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate brief loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Interactive Component</h3>
            <p className="text-muted-foreground">Preparing your personalized coaching experience...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to the appropriate component based on module and component type
  const getComponent = () => {
    const componentProps = {
      component,
      onComplete,
      onClose,
    };

    switch (moduleId) {
      case 'week1':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Week1Components {...componentProps} />
          </Suspense>
        );
      case 'week2':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Week2Components {...componentProps} />
          </Suspense>
        );
      case 'week3':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Week3Components {...componentProps} />
          </Suspense>
        );
      case 'week4':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Week4Components {...componentProps} />
          </Suspense>
        );
      case 'week5':
      case 'week6':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Week5Components {...componentProps} />
          </Suspense>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 p-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">Component Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    This interactive component is being prepared for you.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                  >
                    Back to Program
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return getComponent();
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Component</h3>
          <p className="text-muted-foreground">Almost ready...</p>
        </CardContent>
      </Card>
    </div>
  );
}