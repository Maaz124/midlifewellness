import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Play, Headphones, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoPlayer, AudioPlayer, YouTubePlayer } from './media-player';
import { ModuleComponent } from '@/types/wellness';
import { behaviorTracker } from '@/lib/behavior-tracking';

interface CoachingMediaComponentProps {
  component: ModuleComponent;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function CoachingMediaComponent({ component, moduleId, onComplete, onClose }: CoachingMediaComponentProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Track component start
    if (behaviorTracker.isTrackingActive()) {
      if (component.type === 'video') {
        behaviorTracker.trackVideoWatch(component.title, 0);
      }
    }
  }, [component]);

  const handleMediaProgress = (currentTime: number, duration: number) => {
    const progress = Math.round((currentTime / duration) * 100);
    setWatchProgress(progress);

    // Track video/audio progress at 25%, 50%, 75%, and 100%
    if ([25, 50, 75, 100].includes(progress) && !isTracking) {
      setIsTracking(true);
      if (behaviorTracker.isTrackingActive()) {
        if (component.type === 'video') {
          behaviorTracker.trackVideoWatch(component.title, progress);
        }
      }
      setTimeout(() => setIsTracking(false), 1000);
    }
  };

  const handleMediaComplete = () => {
    setIsCompleted(true);
    setWatchProgress(100);
    
    // Track completion
    if (behaviorTracker.isTrackingActive()) {
      if (component.type === 'video') {
        behaviorTracker.trackVideoWatch(component.title, 100);
      }
    }

    // Auto-complete after media ends
    setTimeout(() => {
      onComplete(component.id, { watchProgress: 100, completed: true });
    }, 1000);
  };

  const handleManualComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, { watchProgress, completed: true });
  };

  const getComponentIcon = () => {
    switch (component.type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const renderMediaPlayer = () => {
    if (component.type === 'video') {
      if (component.youtubeId) {
        return (
          <YouTubePlayer
            videoId={component.youtubeId}
            title={component.title}
            description={component.description}
            onProgress={handleMediaProgress}
            onComplete={handleMediaComplete}
          />
        );
      } else if (component.mediaUrl) {
        return (
          <VideoPlayer
            src={component.mediaUrl}
            title={component.title}
            description={component.description}
            thumbnail={component.thumbnail}
            onProgress={handleMediaProgress}
            onComplete={handleMediaComplete}
          />
        );
      }
    } else if (component.type === 'audio' && component.mediaUrl) {
      return (
        <AudioPlayer
          src={component.mediaUrl}
          title={component.title}
          description={component.description}
          onProgress={handleMediaProgress}
          onComplete={handleMediaComplete}
        />
      );
    }

    // Fallback for components without media
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            {getComponentIcon()}
            <div>
              <h3 className="font-semibold text-lg mb-2">{component.title}</h3>
              <p className="text-gray-600 mb-4">{component.description}</p>
              <p className="text-sm text-gray-500">
                Duration: {component.duration} minutes
              </p>
            </div>
            <Button onClick={handleManualComplete} className="mt-4">
              <Play className="h-4 w-4 mr-2" />
              Start Experience
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {getComponentIcon()}
            <CardTitle className="text-xl">{component.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          {watchProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{watchProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${watchProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Media Player */}
          {renderMediaPlayer()}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {component.duration && `${component.duration} minutes`}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {!isCompleted && watchProgress >= 80 && (
                <Button onClick={handleManualComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}