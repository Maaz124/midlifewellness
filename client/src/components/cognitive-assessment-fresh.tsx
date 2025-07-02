import { useState } from 'react';

interface CognitiveAssessmentProps {
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function CognitiveAssessmentFresh({ onComplete, onClose }: CognitiveAssessmentProps) {
  console.log('CognitiveAssessmentFresh component is rendering!');
  const [currentSection, setCurrentSection] = useState('memory');
  const [memoryAssessment, setMemoryAssessment] = useState<Record<string, number>>({});
  const [focusAssessment, setFocusAssessment] = useState<Record<string, number>>({});
  const [clarityAssessment, setClarityAssessment] = useState<Record<string, number>>({});

  const memoryQuestions = [
    {
      id: 'name-recall',
      question: 'How often do you forget names of people you\'ve met recently?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Name recall is one of the first areas affected by stress and hormonal changes',
      tips: 'Use association techniques - connect names to familiar people or objects'
    },
    {
      id: 'item-location',
      question: 'How frequently do you misplace everyday items (keys, phone, glasses)?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Spatial memory can be impacted by sleep quality and stress levels',
      tips: 'Create designated spots for important items and use them consistently'
    },
    {
      id: 'appointments',
      question: 'How often do you forget appointments or important dates?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Prospective memory (remembering to do things) is often impacted first',
      tips: 'Digital calendars with multiple alerts can provide reliable backup support'
    },
    {
      id: 'word-finding',
      question: 'How often do you have trouble finding the right word in conversation?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Word retrieval difficulties often fluctuate with hormonal cycles',
      tips: 'Reading regularly and doing crosswords can help maintain verbal fluency'
    },
    {
      id: 'multistep-tasks',
      question: 'How often do you lose track of multi-step tasks or instructions?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Working memory capacity can be reduced during periods of high stress',
      tips: 'Breaking complex tasks into smaller steps and writing them down helps'
    },
    {
      id: 'recent-changes',
      question: 'Compared to 2-3 years ago, how would you rate your overall memory?',
      scale: ['Much better', 'Somewhat better', 'About the same', 'Somewhat worse', 'Much worse'],
      context: 'Tracking changes over time helps identify patterns and improvements',
      tips: 'Memory changes are often temporary and can improve with targeted strategies'
    }
  ];

  const focusQuestions = [
    {
      id: 'attention-span',
      question: 'How long can you typically focus on a demanding task without distraction?',
      scale: ['2+ hours', '1-2 hours', '30-60 min', '15-30 min', 'Less than 15 min'],
      context: 'Sustained attention often decreases during hormonal fluctuations',
      tips: 'The Pomodoro Technique (25-minute focused blocks) can help rebuild concentration'
    },
    {
      id: 'task-switching',
      question: 'How easily can you switch between different tasks without losing momentum?',
      scale: ['Very easily', 'Easily', 'Moderately', 'With difficulty', 'Very difficult'],
      context: 'Executive function flexibility can be impacted by stress and hormones',
      tips: 'Creating transition rituals between tasks can improve mental flexibility'
    },
    {
      id: 'distractibility',
      question: 'How easily are you distracted by background noise or activity?',
      scale: ['Never distracted', 'Rarely', 'Sometimes', 'Often', 'Very easily'],
      context: 'Sensory processing sensitivity often increases during midlife',
      tips: 'Noise-canceling headphones and designated quiet spaces can help maintain focus'
    },
    {
      id: 'reading-focus',
      question: 'How often do you find yourself re-reading the same paragraph?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Reading comprehension requires sustained visual and cognitive attention',
      tips: 'Taking notes while reading can help maintain active engagement'
    },
    {
      id: 'mind-wandering',
      question: 'During conversations, how often does your mind wander?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Social attention can be affected by internal stress and preoccupation',
      tips: 'Mindfulness practices can help improve present-moment awareness'
    },
    {
      id: 'mental-fatigue',
      question: 'How quickly do you experience mental fatigue during cognitive tasks?',
      scale: ['Never fatigued', 'After 3+ hours', 'After 1-2 hours', 'After 30-60 min', 'Within 30 min'],
      context: 'Cognitive endurance often decreases when the brain is working harder to compensate',
      tips: 'Regular breaks and proper nutrition support sustained mental energy'
    }
  ];

  const clarityQuestions = [
    {
      id: 'decision-making',
      question: 'How confident do you feel when making everyday decisions?',
      scale: ['Very confident', 'Confident', 'Moderately confident', 'Uncertain', 'Very uncertain'],
      context: 'Decision-making relies on working memory and can be impacted by information overload',
      tips: 'Simplifying choices and using decision frameworks can reduce cognitive load'
    },
    {
      id: 'problem-solving',
      question: 'How easily can you work through complex problems step by step?',
      scale: ['Very easily', 'Easily', 'Moderately', 'With difficulty', 'Very difficult'],
      context: 'Executive function includes planning and problem-solving abilities',
      tips: 'Mind mapping and structured problem-solving approaches can provide clarity'
    },
    {
      id: 'mental-clarity',
      question: 'How often do you experience "brain fog" or mental cloudiness?',
      scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
      context: 'Brain fog is common during hormonal transitions and can be managed',
      tips: 'Hydration, movement, and stress reduction are key factors in mental clarity'
    },
    {
      id: 'information-processing',
      question: 'How well do you process and understand new information?',
      scale: ['Very well', 'Well', 'Adequately', 'With difficulty', 'Very poorly'],
      context: 'Information processing speed can vary with stress levels and sleep quality',
      tips: 'Active learning techniques like summarizing and questioning improve comprehension'
    },
    {
      id: 'mental-organization',
      question: 'How organized do your thoughts feel throughout the day?',
      scale: ['Very organized', 'Organized', 'Moderately organized', 'Scattered', 'Very scattered'],
      context: 'Mental organization reflects executive function and emotional regulation',
      tips: 'Daily planning and brain dumps can help organize thoughts and priorities'
    },
    {
      id: 'cognitive-confidence',
      question: 'How confident are you in your overall thinking abilities?',
      scale: ['Very confident', 'Confident', 'Moderately confident', 'Unconfident', 'Very unconfident'],
      context: 'Cognitive confidence affects performance and willingness to engage in mental challenges',
      tips: 'Celebrating small cognitive successes helps rebuild confidence over time'
    }
  ];

  const updateAssessment = (section: string, questionId: string, value: number) => {
    if (section === 'memory') {
      setMemoryAssessment(prev => ({ ...prev, [questionId]: value }));
    } else if (section === 'focus') {
      setFocusAssessment(prev => ({ ...prev, [questionId]: value }));
    } else if (section === 'clarity') {
      setClarityAssessment(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const calculateResults = () => {
    const memoryScore = Object.values(memoryAssessment).reduce((sum, val) => sum + val, 0) / memoryQuestions.length;
    const focusScore = Object.values(focusAssessment).reduce((sum, val) => sum + val, 0) / focusQuestions.length;
    const clarityScore = Object.values(clarityAssessment).reduce((sum, val) => sum + val, 0) / clarityQuestions.length;
    
    return {
      memory: Math.round((6 - memoryScore) * 20),
      focus: Math.round((6 - focusScore) * 20),
      clarity: Math.round((6 - clarityScore) * 20),
      overall: Math.round(((6 - memoryScore) + (6 - focusScore) + (6 - clarityScore)) / 3 * 20)
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <button
        onClick={onClose}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ← Back to Week 5
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">🧠 Enhanced Cognitive Clarity Assessment v2.0</h2>
        <p className="text-lg text-gray-600">
          Comprehensive evaluation of your cognitive function with real-time insights and personalized tips
        </p>
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg animate-pulse">
          <p className="text-sm text-blue-800 font-medium">
            🎯 ENHANCED VERSION ACTIVE: Now featuring 18 detailed questions with educational context and instant tips!
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['memory', 'focus', 'clarity', 'results'].map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentSection === section
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {currentSection === 'memory' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              🎯 ENHANCED: Questions now include educational context and personalized tips that appear when you select an answer!
            </p>
          </div>
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Memory Function Assessment</h3>
          <p className="text-blue-700 mb-6">
            Rate how often you experience these memory-related situations. Each question includes context about why this matters for midlife women:
          </p>
          
          <div className="space-y-6">
            {memoryQuestions.map((q, index) => (
              <div key={q.id} className="bg-white border border-blue-200 rounded-lg p-5">
                <div className="mb-4">
                  <p className="font-semibold text-blue-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                  <p className="text-sm text-blue-700 mb-2 italic">💡 {q.context}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.scale.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => updateAssessment('memory', q.id, optionIndex + 1)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                        memoryAssessment[q.id] === optionIndex + 1
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {memoryAssessment[q.id] && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentSection('focus')}
            disabled={Object.keys(memoryAssessment).length !== memoryQuestions.length}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Continue to Focus Assessment
          </button>
        </div>
      )}

      {currentSection === 'focus' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Focus & Attention Assessment</h3>
          <p className="text-green-700 mb-6">
            Evaluate your current focus and attention capabilities with detailed insights:
          </p>
          
          <div className="space-y-6">
            {focusQuestions.map((q, index) => (
              <div key={q.id} className="bg-white border border-green-200 rounded-lg p-5">
                <div className="mb-4">
                  <p className="font-semibold text-green-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                  <p className="text-sm text-green-700 mb-2 italic">💡 {q.context}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.scale.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => updateAssessment('focus', q.id, optionIndex + 1)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                        focusAssessment[q.id] === optionIndex + 1
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {focusAssessment[q.id] && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentSection('clarity')}
            disabled={Object.keys(focusAssessment).length !== focusQuestions.length}
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Continue to Clarity Assessment
          </button>
        </div>
      )}

      {currentSection === 'clarity' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Mental Clarity Assessment</h3>
          <p className="text-purple-700 mb-6">
            Assess your mental clarity and cognitive confidence with personalized insights:
          </p>
          
          <div className="space-y-6">
            {clarityQuestions.map((q, index) => (
              <div key={q.id} className="bg-white border border-purple-200 rounded-lg p-5">
                <div className="mb-4">
                  <p className="font-semibold text-purple-900 mb-2 text-lg">{index + 1}. {q.question}</p>
                  <p className="text-sm text-purple-700 mb-2 italic">💡 {q.context}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.scale.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => updateAssessment('clarity', q.id, optionIndex + 1)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                        clarityAssessment[q.id] === optionIndex + 1
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-md'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {clarityAssessment[q.id] && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">💡 Helpful Tip:</span> {q.tips}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentSection('results')}
            disabled={Object.keys(clarityAssessment).length !== clarityQuestions.length}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            View Results
          </button>
        </div>
      )}

      {currentSection === 'results' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Your Cognitive Profile</h3>
          {(() => {
            const results = calculateResults();
            return (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Memory</h4>
                    <p className="text-2xl font-bold text-blue-900">{results.memory}/100</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Focus</h4>
                    <p className="text-2xl font-bold text-green-900">{results.focus}/100</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Clarity</h4>
                    <p className="text-2xl font-bold text-purple-900">{results.clarity}/100</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-indigo-900">
                    Overall Cognitive Score: {results.overall}/100
                  </p>
                </div>
                <button
                  onClick={() => onComplete('w5-assessment', { cognitiveProfile: results })}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium"
                >
                  Complete Assessment
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}