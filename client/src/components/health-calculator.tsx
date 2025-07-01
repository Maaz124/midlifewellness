import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  mentalHealthQuestions, 
  physicalHealthQuestions, 
  cognitiveHealthQuestions,
  calculateScore,
  getScoreInterpretation,
  getPersonalizedRecommendations
} from '@/lib/health-calculators';
import { AssessmentQuestion } from '@/types/wellness';
import { Brain, Heart, Lightbulb, CheckCircle, Edit } from 'lucide-react';

interface HealthCalculatorProps {
  type: 'mental' | 'physical' | 'cognitive';
  score: number;
  onScoreUpdate: (score: number) => void;
}

export function HealthCalculator({ type, score, onScoreUpdate }: HealthCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions = type === 'mental' ? mentalHealthQuestions :
                   type === 'physical' ? physicalHealthQuestions :
                   cognitiveHealthQuestions;

  const config = {
    mental: {
      title: 'Mental Health',
      subtitle: 'Emotional Balance',
      description: 'Mood, sleep, anxiety & emotional regulation',
      icon: Brain,
      color: 'primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      gradient: 'gradient-primary'
    },
    physical: {
      title: 'Physical Health',
      subtitle: 'Vitality Index',
      description: 'Energy, hormones, joint health & vitality',
      icon: Heart,
      color: 'coral',
      bgColor: 'bg-coral-50',
      borderColor: 'border-coral-200',
      gradient: 'gradient-coral'
    },
    cognitive: {
      title: 'Cognitive Health',
      subtitle: 'Clarity Score',
      description: 'Memory, focus, clarity & mental sharpness',
      icon: Lightbulb,
      color: 'sage',
      bgColor: 'bg-sage-50',
      borderColor: 'border-sage-200',
      gradient: 'gradient-sage'
    }
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  const handleStartAssessment = () => {
    setIsOpen(true);
    setCurrentQuestion(0);
    setResponses([]);
    setIsComplete(false);
  };

  const handleResponse = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      value: parseInt(value)
    };
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const finalScore = calculateScore(responses, questions);
      onScoreUpdate(finalScore);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentQuestion(0);
    setResponses([]);
    setIsComplete(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[currentQuestion];

  return (
    <>
      <Card className={`wellness-card ${currentConfig.borderColor} overflow-hidden`}>
        <CardHeader className={`${currentConfig.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-sm opacity-90">{currentConfig.subtitle}</div>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold mb-2">{currentConfig.title}</CardTitle>
          <p className="text-sm opacity-90">{currentConfig.description}</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className={`text-sm font-medium text-${currentConfig.color}`}>{score}/100</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          <div className="space-y-3 mb-6">
            {/* Score breakdown indicators */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Assessment</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.floor(score / 20) ? `bg-${currentConfig.color}` : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {getScoreInterpretation(score, type)}
            </p>
            {score > 0 && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            )}
          </div>

          <Button 
            onClick={handleStartAssessment}
            className={`w-full ${currentConfig.bgColor} text-${currentConfig.color}-700 hover:${currentConfig.bgColor}/80`}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            {score > 0 ? 'Retake Assessment' : 'Take Assessment'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Icon className={`w-6 h-6 text-${currentConfig.color}`} />
              <span>{currentConfig.title} Assessment</span>
            </DialogTitle>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </DialogHeader>

          {!isComplete ? (
            <div className="py-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {questions[currentQuestion]?.question}
                </h3>
                
                <RadioGroup 
                  value={currentResponse?.value?.toString() || ''}
                  onValueChange={handleResponse}
                >
                  {questions[currentQuestion]?.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentResponse}
                  className={currentConfig.gradient}
                >
                  {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <CheckCircle className={`w-16 h-16 text-${currentConfig.color} mx-auto mb-4`} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
              <p className="text-lg text-gray-600 mb-4">
                Your {currentConfig.subtitle}: <span className={`font-bold text-${currentConfig.color}`}>{calculateScore(responses, questions)}/100</span>
              </p>
              <p className="text-sm text-gray-600 mb-6">
                {getScoreInterpretation(calculateScore(responses, questions), type)}
              </p>
              
              <div className="text-left mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Personalized Recommendations:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {getPersonalizedRecommendations(calculateScore(responses, questions), type).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={handleClose} className={currentConfig.gradient}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
