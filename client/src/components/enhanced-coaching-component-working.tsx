import { useState, useEffect } from 'react';
import { CognitiveAssessmentFresh } from './cognitive-assessment-fresh';

// Interactive Focus & Memory Rituals Component
function InteractiveFocusMemoryRituals({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentRitual, setCurrentRitual] = useState<string | null>(null);
  const [completedRituals, setCompletedRituals] = useState<string[]>([]);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('morning');

  const rituals = {
    morning: [
      {
        id: 'morning-meditation',
        title: '5-Minute Morning Brain Boost',
        duration: 5,
        description: 'Energize your mind for the day ahead',
        steps: [
          'Sit comfortably with your spine straight',
          'Take 3 deep breaths, counting slowly to 4 on each inhale',
          'Focus on the sensation of your breath at your nostrils',
          'When your mind wanders, gently return to your breath',
          'End by setting an intention for mental clarity today'
        ],
        benefits: 'Increases focus, reduces brain fog, prepares mind for learning'
      },
      {
        id: 'memory-priming',
        title: 'Memory Palace Warm-up',
        duration: 3,
        description: 'Activate your spatial memory system',
        steps: [
          'Visualize walking through your front door',
          'Mentally visit each room in your home',
          'Place 3 important tasks for today in different rooms',
          'Walk through again, collecting each task',
          'Notice how location helps you remember'
        ],
        benefits: 'Strengthens spatial memory, improves task recall'
      }
    ],
    midday: [
      {
        id: 'focus-reset',
        title: 'Midday Mental Reset',
        duration: 7,
        description: 'Clear mental clutter and refocus',
        steps: [
          'Stand and stretch your arms overhead',
          'Take 5 conscious breaths while looking away from screens',
          'Write down 3 things you accomplished this morning',
          'Identify your top priority for the afternoon',
          'Visualize completing that priority successfully'
        ],
        benefits: 'Clears decision fatigue, renews mental energy'
      },
      {
        id: 'cognitive-exercise',
        title: 'Brain Training Burst',
        duration: 5,
        description: 'Quick cognitive flexibility exercise',
        steps: [
          'Name 5 items you can see that are blue',
          'Count backwards from 100 by 7s for 1 minute',
          'Think of 3 words that rhyme with "focus"',
          'Describe your current location to an imaginary friend',
          'Plan tomorrow\'s schedule in reverse order'
        ],
        benefits: 'Improves cognitive flexibility, working memory'
      }
    ],
    evening: [
      {
        id: 'memory-consolidation',
        title: 'Evening Memory Consolidation',
        duration: 10,
        description: 'Help your brain process and store the day\'s learning',
        steps: [
          'Review the 3 most important things you learned today',
          'Connect each learning to something you already knew',
          'Write one sentence about each in a journal',
          'Imagine teaching these concepts to someone else',
          'Set an intention to remember these insights tomorrow'
        ],
        benefits: 'Strengthens long-term memory formation'
      },
      {
        id: 'relaxation-ritual',
        title: 'Cognitive Wind-Down',
        duration: 8,
        description: 'Prepare your mind for restorative sleep',
        steps: [
          'Dim the lights and remove distracting stimuli',
          'Progressive muscle relaxation from head to toe',
          'Practice gratitude for your brain\'s work today',
          'Visualize tomorrow starting with clarity and focus',
          'End with 2 minutes of natural breathing'
        ],
        benefits: 'Reduces cognitive load, prepares for quality sleep'
      }
    ]
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (duration: number) => {
    setPracticeTimer(duration * 60);
    setIsTimerActive(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && practiceTimer > 0) {
      interval = setInterval(() => {
        setPracticeTimer(timer => timer - 1);
      }, 1000);
    } else if (practiceTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, practiceTimer]);

  const completeRitual = (ritualId: string) => {
    if (!completedRituals.includes(ritualId)) {
      setCompletedRituals([...completedRituals, ritualId]);
    }
    setCurrentRitual(null);
    setIsTimerActive(false);
    setPracticeTimer(0);
  };

  const allRitualsCount = Object.values(rituals).flat().length;
  const progressPercentage = (completedRituals.length / allRitualsCount) * 100;

  if (currentRitual) {
    const ritual = Object.values(rituals).flat().find(r => r.id === currentRitual);
    if (!ritual) return null;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            {ritual.title}
          </CardTitle>
          <p className="text-gray-600">{ritual.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timer Section */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <div className="text-4xl font-mono font-bold text-purple-700 mb-4">
                {formatTime(practiceTimer)}
              </div>
              <div className="flex justify-center gap-4">
                {!isTimerActive ? (
                  <Button 
                    onClick={() => startTimer(ritual.duration)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start {ritual.duration} min Practice
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setIsTimerActive(false)}
                    variant="outline"
                  >
                    Pause Timer
                  </Button>
                )}
              </div>
            </div>

            {/* Practice Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Practice Steps
              </h3>
              <div className="grid gap-3">
                {ritual.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Benefits:</h4>
              <p className="text-green-700">{ritual.benefits}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentRitual(null)}
              >
                Back to Rituals
              </Button>
              <Button 
                onClick={() => completeRitual(ritual.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Focus & Memory Rituals
        </CardTitle>
        <CardDescription>
          Build daily habits that enhance cognitive function and memory retention
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {completedRituals.length} of {allRitualsCount} rituals completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Timeframe Selector */}
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="morning">Morning Rituals</TabsTrigger>
              <TabsTrigger value="midday">Midday Boost</TabsTrigger>
              <TabsTrigger value="evening">Evening Wind-Down</TabsTrigger>
            </TabsList>

            {Object.entries(rituals).map(([timeframe, timeframeRituals]) => (
              <TabsContent key={timeframe} value={timeframe}>
                <div className="grid gap-4 md:grid-cols-2">
                  {timeframeRituals.map((ritual) => (
                    <Card key={ritual.id} className="relative">
                      {completedRituals.includes(ritual.id) && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg">{ritual.title}</CardTitle>
                        <CardDescription>{ritual.description}</CardDescription>
                        <Badge variant="secondary" className="w-fit">
                          <Clock className="w-3 h-3 mr-1" />
                          {ritual.duration} minutes
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{ritual.benefits}</p>
                        <Button 
                          onClick={() => setCurrentRitual(ritual.id)}
                          className="w-full"
                          variant={completedRituals.includes(ritual.id) ? "outline" : "default"}
                        >
                          {completedRituals.includes(ritual.id) ? 'Practice Again' : 'Start Practice'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Completion Actions */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => onComplete('w5-rituals', { 
                completedRituals,
                progressPercentage: Math.round(progressPercentage)
              })}
              disabled={completedRituals.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Progress ({completedRituals.length} completed)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Brain-Boosting Nutrition Plan Component
function BrainBoostingNutritionPlan({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedMealPlan, setSelectedMealPlan] = useState('cognitive');
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<Record<string, boolean>>({});
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  const nutritionPlans = {
    cognitive: {
      title: "Cognitive Enhancement Plan",
      description: "Optimize memory, focus, and mental clarity",
      color: "purple",
      keyNutrients: ["Omega-3", "Antioxidants", "B-Vitamins", "Magnesium"],
      dailyMeals: [
        {
          id: 'breakfast-cognitive',
          type: 'breakfast',
          name: 'Brain-Boosting Berry Bowl',
          ingredients: ['Blueberries', 'Walnuts', 'Greek yogurt', 'Chia seeds', 'Honey'],
          brainBenefits: 'Antioxidants improve memory, omega-3s support brain structure',
          prepTime: '5 mins',
          nutrients: ['Anthocyanins', 'Omega-3', 'Protein', 'Fiber']
        },
        {
          id: 'lunch-cognitive',
          type: 'lunch',
          name: 'Salmon & Avocado Power Salad',
          ingredients: ['Wild salmon', 'Avocado', 'Spinach', 'Quinoa', 'Olive oil'],
          brainBenefits: 'DHA supports cognitive function, folate aids neurotransmitter production',
          prepTime: '15 mins',
          nutrients: ['DHA', 'Folate', 'Vitamin E', 'Complex carbs']
        },
        {
          id: 'dinner-cognitive',
          type: 'dinner',
          name: 'Turmeric Chicken with Sweet Potato',
          ingredients: ['Organic chicken', 'Sweet potato', 'Turmeric', 'Broccoli', 'Coconut oil'],
          brainBenefits: 'Curcumin reduces inflammation, beta-carotene protects brain cells',
          prepTime: '25 mins',
          nutrients: ['Curcumin', 'Beta-carotene', 'Protein', 'Vitamin K']
        }
      ]
    },
    hormonal: {
      title: "Hormonal Balance Plan",
      description: "Support hormonal health during midlife transitions",
      color: "pink",
      keyNutrients: ["Phytoestrogens", "Vitamin D", "Calcium", "Iron"],
      dailyMeals: [
        {
          id: 'breakfast-hormonal',
          type: 'breakfast',
          name: 'Flax & Almond Smoothie Bowl',
          ingredients: ['Ground flaxseed', 'Almond butter', 'Spinach', 'Banana', 'Coconut milk'],
          brainBenefits: 'Lignans support hormone balance, magnesium reduces stress',
          prepTime: '7 mins',
          nutrients: ['Lignans', 'Magnesium', 'Potassium', 'Plant protein']
        },
        {
          id: 'lunch-hormonal',
          type: 'lunch',
          name: 'Tempeh Buddha Bowl',
          ingredients: ['Fermented tempeh', 'Edamame', 'Purple cabbage', 'Brown rice', 'Sesame seeds'],
          brainBenefits: 'Isoflavones support cognitive function during menopause',
          prepTime: '20 mins',
          nutrients: ['Isoflavones', 'Probiotics', 'B-vitamins', 'Fiber']
        },
        {
          id: 'dinner-hormonal',
          type: 'dinner',
          name: 'Lentil & Veggie Curry',
          ingredients: ['Red lentils', 'Cauliflower', 'Kale', 'Coconut milk', 'Ginger'],
          brainBenefits: 'Plant estrogens support brain health, iron prevents cognitive fatigue',
          prepTime: '30 mins',
          nutrients: ['Plant estrogens', 'Iron', 'Folate', 'Anti-inflammatory compounds']
        }
      ]
    },
    energy: {
      title: "Sustained Energy Plan",
      description: "Combat fatigue and maintain steady energy levels",
      color: "orange",
      keyNutrients: ["Complex Carbs", "B-Vitamins", "Iron", "CoQ10"],
      dailyMeals: [
        {
          id: 'breakfast-energy',
          type: 'breakfast',
          name: 'Overnight Oats with Nuts',
          ingredients: ['Steel-cut oats', 'Almonds', 'Pumpkin seeds', 'Cinnamon', 'Apple'],
          brainBenefits: 'Stable glucose supports consistent brain energy',
          prepTime: '5 mins prep (overnight)',
          nutrients: ['Complex carbs', 'Magnesium', 'Zinc', 'Fiber']
        },
        {
          id: 'lunch-energy',
          type: 'lunch',
          name: 'Quinoa Power Bowl',
          ingredients: ['Tri-color quinoa', 'Black beans', 'Bell peppers', 'Pumpkin seeds', 'Tahini'],
          brainBenefits: 'Complete proteins and B-vitamins support neurotransmitter production',
          prepTime: '15 mins',
          nutrients: ['Complete protein', 'B-vitamins', 'Iron', 'Healthy fats']
        },
        {
          id: 'dinner-energy',
          type: 'dinner',
          name: 'Grass-Fed Beef with Roasted Vegetables',
          ingredients: ['Lean beef', 'Brussels sprouts', 'Carrots', 'Red potatoes', 'Herbs'],
          brainBenefits: 'Heme iron and B12 prevent cognitive fatigue',
          prepTime: '35 mins',
          nutrients: ['Heme iron', 'B12', 'Zinc', 'Antioxidants']
        }
      ]
    }
  };

  const weeklyGoals = [
    { id: 'omega3', title: 'Include omega-3 rich foods 3x per week', target: 3, current: 0 },
    { id: 'antioxidants', title: 'Eat colorful fruits/vegetables daily', target: 7, current: 0 },
    { id: 'hydration', title: 'Drink 8 glasses of water daily', target: 7, current: 0 },
    { id: 'processed', title: 'Limit processed foods to 2x per week', target: 5, current: 0 },
    { id: 'meal-timing', title: 'Eat at consistent times daily', target: 7, current: 0 }
  ];

  const brainFoods = {
    'Memory Enhancers': ['Blueberries', 'Walnuts', 'Dark chocolate', 'Turmeric', 'Broccoli'],
    'Focus Boosters': ['Green tea', 'Avocados', 'Eggs', 'Fatty fish', 'Pumpkin seeds'],
    'Mood Stabilizers': ['Spinach', 'Yogurt', 'Bananas', 'Oats', 'Dark leafy greens'],
    'Energy Sustainers': ['Quinoa', 'Sweet potatoes', 'Nuts', 'Legumes', 'Chia seeds']
  };

  const supplements = [
    { name: 'Omega-3 (EPA/DHA)', dosage: '1000-2000mg daily', benefit: 'Brain structure and cognitive function' },
    { name: 'Vitamin D3', dosage: '1000-2000 IU daily', benefit: 'Mood regulation and cognitive health' },
    { name: 'B-Complex', dosage: 'As directed', benefit: 'Energy metabolism and neurotransmitter production' },
    { name: 'Magnesium', dosage: '300-400mg daily', benefit: 'Stress reduction and sleep quality' }
  ];

  const generateShoppingList = (plan: string) => {
    const selectedPlan = nutritionPlans[plan as keyof typeof nutritionPlans];
    const allIngredients = selectedPlan.dailyMeals.flatMap(meal => meal.ingredients);
    const uniqueIngredients = [...new Set(allIngredients)];
    setShoppingList(uniqueIngredients);
  };

  const toggleMealComplete = (mealId: string) => {
    if (completedMeals.includes(mealId)) {
      setCompletedMeals(completedMeals.filter(id => id !== mealId));
    } else {
      setCompletedMeals([...completedMeals, mealId]);
    }
  };

  const currentPlan = nutritionPlans[selectedMealPlan as keyof typeof nutritionPlans];
  const completedMealsCount = completedMeals.length;
  const totalMealsCount = Object.values(nutritionPlans).flatMap(plan => plan.dailyMeals).length;
  const progressPercentage = (completedMealsCount / totalMealsCount) * 100;

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-green-600" />
          Brain-Boosting Nutrition Plan
        </CardTitle>
        <CardDescription>
          Fuel your mind with targeted nutrition for cognitive enhancement and hormonal balance
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Meals Completed: {completedMealsCount} of {totalMealsCount}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedMealPlan} onValueChange={setSelectedMealPlan}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {Object.entries(nutritionPlans).map(([key, plan]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${plan.color}-500`}></div>
                {plan.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(nutritionPlans).map(([planKey, plan]) => (
            <TabsContent key={planKey} value={planKey}>
              <div className="space-y-6">
                {/* Plan Overview */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.keyNutrients.map((nutrient) => (
                        <Badge key={nutrient} variant="secondary">
                          {nutrient}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Meals */}
                <div className="grid gap-4 md:grid-cols-3">
                  {plan.dailyMeals.map((meal) => (
                    <Card key={meal.id} className="relative">
                      {completedMeals.includes(meal.id) && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">{meal.type}</CardTitle>
                        <CardDescription>{meal.name}</CardDescription>
                        <Badge variant="outline" className="w-fit">
                          <Clock className="w-3 h-3 mr-1" />
                          {meal.prepTime}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {meal.ingredients.map((ingredient) => (
                                <Badge key={ingredient} variant="secondary" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 text-sm mb-1">Brain Benefits:</h4>
                            <p className="text-blue-700 text-sm">{meal.brainBenefits}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Key Nutrients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {meal.nutrients.map((nutrient) => (
                                <Badge key={nutrient} variant="outline" className="text-xs">
                                  {nutrient}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Button 
                            onClick={() => toggleMealComplete(meal.id)}
                            className="w-full"
                            variant={completedMeals.includes(meal.id) ? "outline" : "default"}
                          >
                            {completedMeals.includes(meal.id) ? 'Completed ✓' : 'Mark as Prepared'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Brain Foods Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Brain Foods Reference Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(brainFoods).map(([category, foods]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-sm text-purple-700">{category}</h4>
                  <div className="space-y-1">
                    {foods.map((food) => (
                      <div key={food} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {food}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shopping List Generator */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Shopping List Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => generateShoppingList(selectedMealPlan)}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate Shopping List for {currentPlan.title}
              </Button>
              
              {shoppingList.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Your Shopping List:</h4>
                  <div className="grid gap-2 md:grid-cols-3">
                    {shoppingList.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <Checkbox />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supplement Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Supplement Recommendations</CardTitle>
            <CardDescription>Consult with healthcare provider before starting any supplements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {supplements.map((supplement) => (
                <div key={supplement.name} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{supplement.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Dosage: {supplement.dosage}</p>
                  <p className="text-sm text-blue-700">{supplement.benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => onComplete('w5-nutrition', { 
              completedMeals,
              selectedPlan: selectedMealPlan,
              progressPercentage: Math.round(progressPercentage),
              shoppingList
            })}
            disabled={completedMeals.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Save Progress ({completedMeals.length} meals completed)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Mind Management System Component
function MindManagementSystem({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedSystems, setCompletedSystems] = useState<string[]>([]);
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    newEmotion: ''
  });
  const [cognitiveDistortions, setCognitiveDistortions] = useState<string[]>([]);
  const [stressManagementTechniques, setStressManagementTechniques] = useState<Record<string, boolean>>({});

  const mindManagementSystems = {
    'thought-restructuring': {
      title: 'Thought Restructuring',
      description: 'Transform negative thought patterns into balanced perspectives',
      icon: '🧠',
      color: 'blue',
      tools: [
        {
          id: 'thought-record',
          name: 'Thought Record Worksheet',
          description: 'Systematic approach to examining and reframing thoughts'
        },
        {
          id: 'distortion-check',
          name: 'Cognitive Distortion Checker',
          description: 'Identify and challenge common thinking errors'
        }
      ]
    },
    'stress-response': {
      title: 'Stress Response Management',
      description: 'Develop effective coping strategies for midlife stressors',
      icon: '⚡',
      color: 'orange',
      tools: [
        {
          id: 'stress-triggers',
          name: 'Stress Trigger Mapping',
          description: 'Identify and prepare for your unique stress patterns'
        },
        {
          id: 'quick-relief',
          name: 'Quick Relief Techniques',
          description: 'Emergency stress management for acute situations'
        }
      ]
    },
    'emotional-regulation': {
      title: 'Emotional Regulation',
      description: 'Navigate hormonal and life transitions with emotional intelligence',
      icon: '💚',
      color: 'green',
      tools: [
        {
          id: 'emotion-wheel',
          name: 'Emotion Identification Wheel',
          description: 'Expand emotional vocabulary and awareness'
        },
        {
          id: 'regulation-strategies',
          name: 'Regulation Strategy Toolkit',
          description: 'Healthy ways to process and manage emotions'
        }
      ]
    },
    'attention-focus': {
      title: 'Attention & Focus Training',
      description: 'Combat brain fog and enhance mental clarity',
      icon: '🎯',
      color: 'purple',
      tools: [
        {
          id: 'attention-exercises',
          name: 'Attention Training Exercises',
          description: 'Strengthen your ability to sustain focus'
        },
        {
          id: 'distraction-management',
          name: 'Distraction Management System',
          description: 'Minimize interruptions and maintain concentration'
        }
      ]
    }
  };

  const distortionsList = [
    { id: 'all-nothing', name: 'All-or-Nothing Thinking', description: 'Seeing things in black and white categories' },
    { id: 'overgeneralization', name: 'Overgeneralization', description: 'Drawing broad conclusions from single events' },
    { id: 'mental-filter', name: 'Mental Filter', description: 'Focusing exclusively on negative details' },
    { id: 'disqualifying-positive', name: 'Disqualifying the Positive', description: 'Rejecting positive experiences' },
    { id: 'jumping-conclusions', name: 'Jumping to Conclusions', description: 'Making assumptions without evidence' },
    { id: 'magnification', name: 'Magnification/Minimization', description: 'Exaggerating negatives or minimizing positives' },
    { id: 'emotional-reasoning', name: 'Emotional Reasoning', description: 'Believing feelings reflect reality' },
    { id: 'should-statements', name: 'Should Statements', description: 'Motivating through guilt and criticism' },
    { id: 'labeling', name: 'Labeling', description: 'Attaching negative labels to yourself or others' },
    { id: 'personalization', name: 'Personalization', description: 'Taking responsibility for things outside your control' }
  ];

  const stressTechniques = {
    immediate: [
      { id: 'box-breathing', name: '4-4-4-4 Box Breathing', duration: '2-5 minutes', effectiveness: 95 },
      { id: 'progressive-relaxation', name: 'Progressive Muscle Relaxation', duration: '10-15 minutes', effectiveness: 92 },
      { id: 'grounding-54321', name: '5-4-3-2-1 Grounding', duration: '3-5 minutes', effectiveness: 88 },
      { id: 'cold-water', name: 'Cold Water Reset', duration: '1-2 minutes', effectiveness: 85 }
    ],
    daily: [
      { id: 'morning-intention', name: 'Morning Intention Setting', duration: '5-10 minutes', effectiveness: 89 },
      { id: 'mindful-transitions', name: 'Mindful Transitions', duration: '1-3 minutes', effectiveness: 87 },
      { id: 'gratitude-practice', name: 'Gratitude Practice', duration: '5 minutes', effectiveness: 91 },
      { id: 'evening-reflection', name: 'Evening Reflection', duration: '10 minutes', effectiveness: 86 }
    ],
    weekly: [
      { id: 'stress-audit', name: 'Weekly Stress Audit', duration: '20-30 minutes', effectiveness: 94 },
      { id: 'boundary-review', name: 'Boundary Review & Reset', duration: '15-20 minutes', effectiveness: 90 },
      { id: 'self-care-planning', name: 'Self-Care Planning', duration: '20 minutes', effectiveness: 88 },
      { id: 'relationship-check', name: 'Relationship Check-in', duration: '15 minutes', effectiveness: 85 }
    ]
  };

  const handleThoughtRecordSubmit = () => {
    if (thoughtRecord.situation && thoughtRecord.automaticThought && thoughtRecord.balancedThought) {
      if (!completedSystems.includes('thought-record')) {
        setCompletedSystems([...completedSystems, 'thought-record']);
      }
    }
  };

  const toggleDistortion = (distortionId: string) => {
    if (cognitiveDistortions.includes(distortionId)) {
      setCognitiveDistortions(cognitiveDistortions.filter(id => id !== distortionId));
    } else {
      setCognitiveDistortions([...cognitiveDistortions, distortionId]);
    }
  };

  const toggleStressTechnique = (techniqueId: string) => {
    setStressManagementTechniques(prev => ({
      ...prev,
      [techniqueId]: !prev[techniqueId]
    }));
  };

  const completedCount = completedSystems.length;
  const totalSystems = Object.keys(mindManagementSystems).length * 2; // 2 tools per system
  const progressPercentage = (completedCount / totalSystems) * 100;

  if (activeSection === 'thought-record') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Thought Record Worksheet
          </CardTitle>
          <CardDescription>
            Transform negative thoughts through systematic examination and reframing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="situation">1. Describe the situation</Label>
                <Textarea
                  id="situation"
                  placeholder="What happened? When and where did it occur?"
                  value={thoughtRecord.situation}
                  onChange={(e) => setThoughtRecord(prev => ({ ...prev, situation: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="automatic-thought">2. What was your automatic thought?</Label>
                <Textarea
                  id="automatic-thought"
                  placeholder="What went through your mind? What did you think would happen?"
                  value={thoughtRecord.automaticThought}
                  onChange={(e) => setThoughtRecord(prev => ({ ...prev, automaticThought: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="emotion">3. What emotions did you feel?</Label>
                <Input
                  id="emotion"
                  placeholder="Anxious, sad, angry, overwhelmed... (Rate intensity 1-10)"
                  value={thoughtRecord.emotion}
                  onChange={(e) => setThoughtRecord(prev => ({ ...prev, emotion: e.target.value }))}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="evidence-for">4. Evidence FOR this thought</Label>
                  <Textarea
                    id="evidence-for"
                    placeholder="What facts support this thought?"
                    value={thoughtRecord.evidenceFor}
                    onChange={(e) => setThoughtRecord(prev => ({ ...prev, evidenceFor: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="evidence-against">5. Evidence AGAINST this thought</Label>
                  <Textarea
                    id="evidence-against"
                    placeholder="What contradicts this thought? What would you tell a friend?"
                    value={thoughtRecord.evidenceAgainst}
                    onChange={(e) => setThoughtRecord(prev => ({ ...prev, evidenceAgainst: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="balanced-thought">6. More balanced, realistic thought</Label>
                <Textarea
                  id="balanced-thought"
                  placeholder="What's a more balanced way to think about this situation?"
                  value={thoughtRecord.balancedThought}
                  onChange={(e) => setThoughtRecord(prev => ({ ...prev, balancedThought: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="new-emotion">7. How do you feel now?</Label>
                <Input
                  id="new-emotion"
                  placeholder="What emotions do you feel with this new perspective? (Rate 1-10)"
                  value={thoughtRecord.newEmotion}
                  onChange={(e) => setThoughtRecord(prev => ({ ...prev, newEmotion: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveSection('overview')}>
                Back to Overview
              </Button>
              <Button 
                onClick={handleThoughtRecordSubmit}
                disabled={!thoughtRecord.situation || !thoughtRecord.automaticThought || !thoughtRecord.balancedThought}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Complete Thought Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeSection === 'distortion-check') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            Cognitive Distortion Checker
          </CardTitle>
          <CardDescription>
            Identify thinking patterns that may be affecting your mood and perspective
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              {distortionsList.map((distortion) => (
                <Card key={distortion.id} className={`cursor-pointer transition-colors ${
                  cognitiveDistortions.includes(distortion.id) ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={cognitiveDistortions.includes(distortion.id)}
                        onCheckedChange={() => toggleDistortion(distortion.id)}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{distortion.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{distortion.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {cognitiveDistortions.length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Identified Patterns ({cognitiveDistortions.length})
                  </h4>
                  <p className="text-yellow-700 text-sm mb-3">
                    Great awareness! These thinking patterns are common and can be changed with practice.
                  </p>
                  <Button 
                    onClick={() => setActiveSection('thought-record')}
                    variant="outline"
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    Work on These with Thought Record
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveSection('overview')}>
                Back to Overview
              </Button>
              <Button 
                onClick={() => {
                  if (!completedSystems.includes('distortion-check')) {
                    setCompletedSystems([...completedSystems, 'distortion-check']);
                  }
                  setActiveSection('overview');
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Save Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeSection === 'stress-management') {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Stress Management Toolkit
          </CardTitle>
          <CardDescription>
            Build your personalized stress response system with evidence-based techniques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="immediate">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="immediate">Immediate Relief</TabsTrigger>
              <TabsTrigger value="daily">Daily Practices</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Systems</TabsTrigger>
            </TabsList>

            {Object.entries(stressTechniques).map(([timeframe, techniques]) => (
              <TabsContent key={timeframe} value={timeframe}>
                <div className="grid gap-4 md:grid-cols-2">
                  {techniques.map((technique) => (
                    <Card key={technique.id} className="relative">
                      {stressManagementTechniques[technique.id] && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{technique.name}</h4>
                            <Badge variant="secondary">{technique.duration}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Effectiveness:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${technique.effectiveness}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold">{technique.effectiveness}%</span>
                          </div>

                          <Button 
                            onClick={() => toggleStressTechnique(technique.id)}
                            className="w-full"
                            variant={stressManagementTechniques[technique.id] ? "outline" : "default"}
                          >
                            {stressManagementTechniques[technique.id] ? 'Practiced ✓' : 'Try This Technique'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-between pt-6 border-t mt-6">
            <Button variant="outline" onClick={() => setActiveSection('overview')}>
              Back to Overview
            </Button>
            <Button 
              onClick={() => {
                if (!completedSystems.includes('stress-management')) {
                  setCompletedSystems([...completedSystems, 'stress-management']);
                }
                setActiveSection('overview');
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Save Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main Overview
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Mind Management System
        </CardTitle>
        <CardDescription>
          Comprehensive cognitive tools for managing thoughts, emotions, and stress during midlife transitions
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Systems Completed: {completedCount} of {totalSystems}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(mindManagementSystems).map(([systemKey, system]) => (
            <Card key={systemKey} className={`border-2 border-${system.color}-200 hover:border-${system.color}-300 transition-colors`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{system.icon}</span>
                  {system.title}
                </CardTitle>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {system.tools.map((tool) => (
                    <div key={tool.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">{tool.name}</h4>
                        <p className="text-xs text-gray-600">{tool.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedSystems.includes(tool.id) && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <Button 
                          size="sm"
                          onClick={() => {
                            if (tool.id === 'thought-record') setActiveSection('thought-record');
                            else if (tool.id === 'distortion-check') setActiveSection('distortion-check');
                            else if (tool.id.includes('stress')) setActiveSection('stress-management');
                          }}
                          className={`bg-${system.color}-600 hover:bg-${system.color}-700`}
                        >
                          {completedSystems.includes(tool.id) ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Tools */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Access Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button 
                onClick={() => setActiveSection('thought-record')}
                variant="outline"
                className="p-4 h-auto flex-col"
              >
                <Brain className="w-6 h-6 mb-2" />
                <span>Thought Record</span>
              </Button>
              <Button 
                onClick={() => setActiveSection('distortion-check')}
                variant="outline"
                className="p-4 h-auto flex-col"
              >
                <Target className="w-6 h-6 mb-2" />
                <span>Distortion Check</span>
              </Button>
              <Button 
                onClick={() => setActiveSection('stress-management')}
                variant="outline"
                className="p-4 h-auto flex-col"
              >
                <Shield className="w-6 h-6 mb-2" />
                <span>Stress Tools</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => onComplete('w5-mind-system', { 
              completedSystems,
              thoughtRecord,
              cognitiveDistortions,
              stressManagementTechniques,
              progressPercentage: Math.round(progressPercentage)
            })}
            disabled={completedSystems.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save Progress ({completedSystems.length} tools completed)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Week 6: Digital Vision Board Component
function DigitalVisionBoard({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [visionData, setVisionData] = useState({
    futureVision: '',
    coreValues: [] as string[],
    lifeAreas: {
      health: { vision: '', priority: 5 },
      relationships: { vision: '', priority: 5 },
      career: { vision: '', priority: 5 },
      personal: { vision: '', priority: 5 },
      financial: { vision: '', priority: 5 },
      spiritual: { vision: '', priority: 5 }
    },
    visualElements: [] as string[],
    actionSteps: [] as string[]
  });
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const coreValuesList = [
    'Authenticity', 'Adventure', 'Balance', 'Beauty', 'Compassion', 'Connection',
    'Creativity', 'Excellence', 'Faith', 'Family', 'Freedom', 'Growth',
    'Health', 'Independence', 'Integrity', 'Joy', 'Justice', 'Knowledge',
    'Leadership', 'Love', 'Peace', 'Purpose', 'Security', 'Service',
    'Spirituality', 'Success', 'Tradition', 'Wisdom'
  ];

  const lifeAreaIcons = {
    health: '🌱',
    relationships: '❤️',
    career: '💼',
    personal: '✨',
    financial: '💰',
    spiritual: '🙏'
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const updateLifeArea = (area: keyof typeof visionData.lifeAreas, field: 'vision' | 'priority', value: string | number) => {
    setVisionData(prev => ({
      ...prev,
      lifeAreas: {
        ...prev.lifeAreas,
        [area]: {
          ...prev.lifeAreas[area],
          [field]: value
        }
      }
    }));
  };

  const progressPercentage = (completedSections.length / 4) * 100;

  if (activeSection === 'values') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Core Values Discovery
          </CardTitle>
          <CardDescription>
            Select up to 5 values that will guide your future self
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {selectedValues.length}/5 Selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {coreValuesList.map((value) => (
                <Button
                  key={value}
                  variant={selectedValues.includes(value) ? "default" : "outline"}
                  onClick={() => toggleValue(value)}
                  disabled={!selectedValues.includes(value) && selectedValues.length >= 5}
                  className="h-auto p-3 text-sm"
                >
                  {value}
                </Button>
              ))}
            </div>

            {selectedValues.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Your Selected Values:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedValues.map((value) => (
                      <Badge key={value} variant="default" className="px-3 py-1">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveSection('overview')}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  setVisionData(prev => ({ ...prev, coreValues: selectedValues }));
                  if (!completedSections.includes('values')) {
                    setCompletedSections([...completedSections, 'values']);
                  }
                  setActiveSection('life-areas');
                }}
                disabled={selectedValues.length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                Continue to Life Areas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeSection === 'life-areas') {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Life Areas Vision
          </CardTitle>
          <CardDescription>
            Define your vision and priorities for each area of your life
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(visionData.lifeAreas).map(([area, data]) => (
              <Card key={area} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg capitalize">
                    <span className="text-2xl">{lifeAreaIcons[area as keyof typeof lifeAreaIcons]}</span>
                    {area}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`${area}-vision`}>Your vision for this area:</Label>
                    <Textarea
                      id={`${area}-vision`}
                      placeholder={`Describe your ideal ${area} in your future...`}
                      value={data.vision}
                      onChange={(e) => updateLifeArea(area as keyof typeof visionData.lifeAreas, 'vision', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${area}-priority`}>Priority Level: {data.priority}/10</Label>
                    <Slider
                      value={[data.priority]}
                      onValueChange={([value]) => updateLifeArea(area as keyof typeof visionData.lifeAreas, 'priority', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveSection('values')}>
                Back to Values
              </Button>
              <Button 
                onClick={() => {
                  if (!completedSections.includes('life-areas')) {
                    setCompletedSections([...completedSections, 'life-areas']);
                  }
                  setActiveSection('action-plan');
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Action Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeSection === 'action-plan') {
    const [newAction, setNewAction] = useState('');

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Action Plan Creation
          </CardTitle>
          <CardDescription>
            Break down your vision into actionable steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Add an action step toward your vision..."
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newAction.trim()) {
                    setVisionData(prev => ({
                      ...prev,
                      actionSteps: [...prev.actionSteps, newAction.trim()]
                    }));
                    setNewAction('');
                  }
                }}
              />
              <Button 
                onClick={() => {
                  if (newAction.trim()) {
                    setVisionData(prev => ({
                      ...prev,
                      actionSteps: [...prev.actionSteps, newAction.trim()]
                    }));
                    setNewAction('');
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {visionData.actionSteps.map((step, index) => (
                <Card key={index} className="bg-green-50 border-green-200">
                  <CardContent className="p-3 flex justify-between items-center">
                    <span>{step}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setVisionData(prev => ({
                          ...prev,
                          actionSteps: prev.actionSteps.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      ✕
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveSection('life-areas')}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (!completedSections.includes('action-plan')) {
                    setCompletedSections([...completedSections, 'action-plan']);
                  }
                  setActiveSection('overview');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Vision Board
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main Overview
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          Digital Vision Board
        </CardTitle>
        <CardDescription>
          Create a comprehensive vision of your future self and the life you want to build
        </CardDescription>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {completedSections.length} of 4 sections</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                ❤️ Core Values Discovery
                {completedSections.includes('values') && <CheckCircle className="w-5 h-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Identify the values that will guide your future decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('values')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {completedSections.includes('values') ? 'Review Values' : 'Start Values Discovery'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                🎯 Life Areas Vision
                {completedSections.includes('life-areas') && <CheckCircle className="w-5 h-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Define your vision for health, relationships, career, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('life-areas')}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!completedSections.includes('values')}
              >
                {completedSections.includes('life-areas') ? 'Review Life Areas' : 'Design Life Vision'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                ✅ Action Plan
                {completedSections.includes('action-plan') && <CheckCircle className="w-5 h-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Break down your vision into actionable steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('action-plan')}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!completedSections.includes('life-areas')}
              >
                {completedSections.includes('action-plan') ? 'Review Action Plan' : 'Create Action Plan'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                ⭐ Vision Summary
              </CardTitle>
              <CardDescription>
                Your complete vision board overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedSections.length === 3 ? (
                <div className="space-y-3">
                  <Badge className="bg-yellow-600">Vision Complete!</Badge>
                  <p className="text-sm text-gray-600">
                    Your vision board is ready. Use it as your north star for goal setting.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Complete the sections above to see your vision summary
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-6 border-t mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => onComplete('w6-vision', { 
              visionData: { ...visionData, coreValues: selectedValues },
              completedSections,
              progressPercentage: Math.round(progressPercentage)
            })}
            disabled={completedSections.length === 0}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Save Vision Board ({completedSections.length} sections completed)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Week 6: SMART Goal Setting Component
function SmartGoalSetting({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [activeGoal, setActiveGoal] = useState<number | null>(null);
  const [goals, setGoals] = useState<Array<{
    id: number;
    title: string;
    category: string;
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
    completed: boolean;
  }>>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: ''
  });

  const goalCategories = [
    { id: 'health', name: 'Health & Wellness', icon: '🌱', color: 'green' },
    { id: 'career', name: 'Career & Purpose', icon: '💼', color: 'blue' },
    { id: 'relationships', name: 'Relationships', icon: '❤️', color: 'red' },
    { id: 'personal', name: 'Personal Growth', icon: '✨', color: 'purple' },
    { id: 'financial', name: 'Financial', icon: '💰', color: 'yellow' },
    { id: 'creative', name: 'Creative & Hobbies', icon: '🎨', color: 'orange' }
  ];

  const addGoal = () => {
    if (newGoal.title && newGoal.category) {
      const goal = {
        ...newGoal,
        id: Date.now(),
        completed: false
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        category: '',
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        timeBound: ''
      });
      setActiveGoal(goal.id);
    }
  };

  const updateGoal = (goalId: number, field: string, value: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, [field]: value } : goal
    ));
  };

  const getSmartScore = (goal: any) => {
    const fields = ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
    const completed = fields.filter(field => goal[field] && goal[field].trim().length > 10).length;
    return (completed / fields.length) * 100;
  };

  if (activeGoal !== null) {
    const goal = goals.find(g => g.id === activeGoal);
    if (!goal) return null;

    const smartScore = getSmartScore(goal);
    const category = goalCategories.find(c => c.id === goal.category);

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{category?.icon}</span>
            SMART Goal: {goal.title}
          </CardTitle>
          <CardDescription>
            Complete each SMART criteria to create a well-defined, achievable goal
          </CardDescription>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>SMART Score: {Math.round(smartScore)}%</span>
              <span>{smartScore === 100 ? 'Complete!' : 'In Progress'}</span>
            </div>
            <Progress value={smartScore} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="specific">Specific - What exactly do you want to achieve?</Label>
              <Textarea
                id="specific"
                placeholder="Be very specific about what you want to accomplish. Avoid vague terms."
                value={goal.specific}
                onChange={(e) => updateGoal(goal.id, 'specific', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="measurable">Measurable - How will you track progress?</Label>
              <Textarea
                id="measurable"
                placeholder="Define specific metrics, numbers, or criteria to measure success."
                value={goal.measurable}
                onChange={(e) => updateGoal(goal.id, 'measurable', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="achievable">Achievable - Is this goal realistic?</Label>
              <Textarea
                id="achievable"
                placeholder="Explain why this goal is challenging yet attainable given your resources and constraints."
                value={goal.achievable}
                onChange={(e) => updateGoal(goal.id, 'achievable', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="relevant">Relevant - Why is this goal important to you?</Label>
              <Textarea
                id="relevant"
                placeholder="Connect this goal to your values, long-term vision, and current life priorities."
                value={goal.relevant}
                onChange={(e) => updateGoal(goal.id, 'relevant', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="timeBound">Time-Bound - When will you achieve this?</Label>
              <Textarea
                id="timeBound"
                placeholder="Set a specific deadline and key milestones along the way."
                value={goal.timeBound}
                onChange={(e) => updateGoal(goal.id, 'timeBound', e.target.value)}
                className="mt-2"
              />
            </div>

            {smartScore === 100 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Goal Complete!</h4>
                  </div>
                  <p className="text-green-700 text-sm">
                    Excellent! Your goal meets all SMART criteria and is ready for action.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveGoal(null)}>
                Back to Goals List
              </Button>
              <Button 
                onClick={() => {
                  updateGoal(goal.id, 'completed', 'true');
                  setActiveGoal(null);
                }}
                disabled={smartScore < 100}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark Goal Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          SMART Goal Setting
        </CardTitle>
        <CardDescription>
          Create Specific, Measurable, Achievable, Relevant, and Time-bound goals aligned with your vision
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Add New Goal */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="Enter a clear, concise goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal category" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          {category.icon} {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addGoal} disabled={!newGoal.title || !newGoal.category}>
                Create Goal
              </Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => {
              const category = goalCategories.find(c => c.id === goal.category);
              const smartScore = getSmartScore(goal);
              
              return (
                <Card key={goal.id} className={`border-2 border-${category?.color}-200 hover:border-${category?.color}-300 transition-colors`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-xl">{category?.icon}</span>
                      {goal.title}
                    </CardTitle>
                    <CardDescription>{category?.name}</CardDescription>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>SMART Score</span>
                        <span>{Math.round(smartScore)}%</span>
                      </div>
                      <Progress value={smartScore} className="h-1" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      onClick={() => setActiveGoal(goal.id)}
                      className={`w-full bg-${category?.color}-600 hover:bg-${category?.color}-700`}
                    >
                      {smartScore === 100 ? 'Review Goal' : 'Complete SMART Criteria'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {goals.length === 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Goals Yet</h3>
                <p className="text-gray-500">Create your first SMART goal using the form above</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => onComplete('w6-goals', { 
                goals,
                completedGoals: goals.filter(g => getSmartScore(g) === 100).length,
                totalGoals: goals.length
              })}
              disabled={goals.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Goals ({goals.filter(g => getSmartScore(g) === 100).length} complete)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Week 6: Reverse Engineer Method Component  
function ReverseEngineerMethod({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<Array<{ id: number; title: string; date: string; completed: boolean }>>([]);
  const [weeklyActions, setWeeklyActions] = useState<Array<{ id: number; week: string; actions: string[]; completed: boolean }>>([]);
  const [activePhase, setActivePhase] = useState('goal-selection');
  const [newAction, setNewAction] = useState<{[key: number]: string}>({});

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '',
      date: '',
      completed: false
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const generateWeeklyPlan = () => {
    if (!targetDate) return;

    const target = new Date(targetDate);
    const now = new Date();
    const weeksUntilTarget = Math.ceil((target.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    const weeks = [];
    for (let i = 1; i <= Math.min(weeksUntilTarget, 12); i++) {
      const weekDate = new Date(now.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
      weeks.push({
        id: i,
        week: `Week ${i} (${weekDate.toLocaleDateString()})`,
        actions: [],
        completed: false
      });
    }
    setWeeklyActions(weeks);
    setActivePhase('weekly-planning');
  };

  const addAction = (weekId: number, action: string) => {
    if (!action.trim()) return;
    
    setWeeklyActions(weeklyActions.map(week => 
      week.id === weekId 
        ? { ...week, actions: [...week.actions, action.trim()] }
        : week
    ));
  };

  const removeAction = (weekId: number, actionIndex: number) => {
    setWeeklyActions(weeklyActions.map(week => 
      week.id === weekId 
        ? { ...week, actions: week.actions.filter((_, i) => i !== actionIndex) }
        : week
    ));
  };

  if (activePhase === 'weekly-planning') {

    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Weekly Action Plan
          </CardTitle>
          <CardDescription>
            Break down your goal into weekly actionable steps
          </CardDescription>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold">Goal: {selectedGoal}</h4>
            <p className="text-sm text-blue-700">Target Date: {new Date(targetDate).toLocaleDateString()}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {weeklyActions.map((week) => (
              <Card key={week.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{week.week}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a specific action for this week..."
                        value={newAction[week.id] || ''}
                        onChange={(e) => setNewAction({ ...newAction, [week.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addAction(week.id, newAction[week.id] || '');
                            setNewAction({ ...newAction, [week.id]: '' });
                          }
                        }}
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          addAction(week.id, newAction[week.id] || '');
                          setNewAction({ ...newAction, [week.id]: '' });
                        }}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {week.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Checkbox />
                          <span className="flex-1 text-sm">{action}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAction(week.id, actionIndex)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>

                    {week.actions.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No actions planned for this week yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-6 border-t mt-6">
            <Button variant="outline" onClick={() => setActivePhase('milestones')}>
              Back to Milestones
            </Button>
            <Button 
              onClick={() => onComplete('w6-reverse', { 
                selectedGoal,
                targetDate,
                milestones,
                weeklyActions,
                totalWeeks: weeklyActions.length,
                totalActions: weeklyActions.reduce((sum, week) => sum + week.actions.length, 0)
              })}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Complete Reverse Engineering
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activePhase === 'milestones') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-600" />
            Key Milestones
          </CardTitle>
          <CardDescription>
            Define 3-5 key milestones between now and your target date
          </CardDescription>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold">Goal: {selectedGoal}</h4>
            <p className="text-sm text-green-700">Target Date: {new Date(targetDate).toLocaleDateString()}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card key={milestone.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Milestone {index + 1}</Badge>
                    </div>
                    
                    <div>
                      <Label htmlFor={`milestone-${milestone.id}`}>Milestone Description</Label>
                      <Input
                        id={`milestone-${milestone.id}`}
                        placeholder="What significant progress point will you reach?"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`date-${milestone.id}`}>Target Date</Label>
                      <Input
                        id={`date-${milestone.id}`}
                        type="date"
                        value={milestone.date}
                        onChange={(e) => updateMilestone(milestone.id, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button 
              onClick={addMilestone}
              variant="outline"
              className="w-full border-dashed"
              disabled={milestones.length >= 5}
            >
              + Add Milestone ({milestones.length}/5)
            </Button>
          </div>

          <div className="flex justify-between pt-6 border-t mt-6">
            <Button variant="outline" onClick={() => setActivePhase('goal-selection')}>
              Back to Goal
            </Button>
            <Button 
              onClick={generateWeeklyPlan}
              disabled={milestones.filter(m => m.title && m.date).length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Generate Weekly Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Goal Selection Phase
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-purple-600" />
          Reverse Engineer Method
        </CardTitle>
        <CardDescription>
          Start with your end goal and work backwards to create a step-by-step plan
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="goal-input">What is your specific goal?</Label>
            <Textarea
              id="goal-input"
              placeholder="Be specific about what you want to achieve (e.g., 'Launch my coaching practice and have 5 paying clients')"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="target-date">By when do you want to achieve this goal?</Label>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="mt-2"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {selectedGoal && targetDate && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Goal Summary</h4>
                <p className="text-purple-700 mb-1"><strong>What:</strong> {selectedGoal}</p>
                <p className="text-purple-700"><strong>When:</strong> {new Date(targetDate).toLocaleDateString()}</p>
                <p className="text-sm text-purple-600 mt-2">
                  Time available: {Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000))} weeks
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => setActivePhase('milestones')}
              disabled={!selectedGoal || !targetDate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue to Milestones
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Week 6: Habit Loop Creator Component
function HabitLoopCreator({ onComplete, onClose }: { onComplete: (id: string, data?: any) => void; onClose: () => void }) {
  const [habits, setHabits] = useState<Array<{
    id: number;
    name: string;
    cue: string;
    routine: string;
    reward: string;
    frequency: string;
    timeOfDay: string;
    location: string;
    completed: boolean;
  }>>([]);
  const [activeHabit, setActiveHabit] = useState<number | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    cue: '',
    routine: '',
    reward: '',
    frequency: 'daily',
    timeOfDay: '',
    location: ''
  });

  const habitTemplates = [
    {
      name: 'Morning Movement',
      cue: 'Feet touch the floor when getting out of bed',
      routine: '10 minutes of stretching or light exercise',
      reward: 'Feel energized and accomplished',
      timeOfDay: 'morning',
      frequency: 'daily'
    },
    {
      name: 'Mindful Moments',
      cue: 'Sit down with my morning coffee',
      routine: '5 minutes of deep breathing or meditation',
      reward: 'Sense of calm and centeredness',
      timeOfDay: 'morning',
      frequency: 'daily'
    },
    {
      name: 'Evening Reflection',
      cue: 'Change into pajamas',
      routine: 'Write 3 things I\'m grateful for',
      reward: 'Positive mindset for better sleep',
      timeOfDay: 'evening',
      frequency: 'daily'
    },
    {
      name: 'Weekend Planning',
      cue: 'Friday evening dinner is finished',
      routine: 'Review week and plan weekend priorities',
      reward: 'Feel organized and intentional',
      timeOfDay: 'evening',
      frequency: 'weekly'
    }
  ];

  const addHabit = (template?: any) => {
    const habitData = template || newHabit;
    const habit = {
      ...habitData,
      id: Date.now(),
      completed: false
    };
    setHabits([...habits, habit]);
    if (!template) {
      setNewHabit({
        name: '',
        cue: '',
        routine: '',
        reward: '',
        frequency: 'daily',
        timeOfDay: '',
        location: ''
      });
    }
    setActiveHabit(habit.id);
  };

  const updateHabit = (habitId: number, field: string, value: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, [field]: value } : habit
    ));
  };

  const getHabitScore = (habit: any) => {
    const requiredFields = ['name', 'cue', 'routine', 'reward'];
    const completed = requiredFields.filter(field => habit[field] && habit[field].trim().length > 0).length;
    return (completed / requiredFields.length) * 100;
  };

  if (activeHabit !== null) {
    const habit = habits.find(h => h.id === activeHabit);
    if (!habit) return null;

    const habitScore = getHabitScore(habit);

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-green-600" />
            Habit Loop: {habit.name || 'New Habit'}
          </CardTitle>
          <CardDescription>
            Design your habit using the proven Cue → Routine → Reward loop
          </CardDescription>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Habit Completeness: {Math.round(habitScore)}%</span>
              <span>{habitScore === 100 ? 'Ready to implement!' : 'Complete all fields'}</span>
            </div>
            <Progress value={habitScore} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="Give your habit a clear, motivating name"
                value={habit.name}
                onChange={(e) => updateHabit(habit.id, 'name', e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={habit.frequency} onValueChange={(value) => updateHabit(habit.id, 'frequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="3x-week">3x per week</SelectItem>
                    <SelectItem value="weekdays">Weekdays only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time-of-day">Time of Day</Label>
                <Select value={habit.timeOfDay} onValueChange={(value) => updateHabit(habit.id, 'timeOfDay', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When will you do this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location/Context</Label>
              <Input
                id="location"
                placeholder="Where will you perform this habit?"
                value={habit.location}
                onChange={(e) => updateHabit(habit.id, 'location', e.target.value)}
              />
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg">The Habit Loop</CardTitle>
                <CardDescription>Complete each part of the loop for maximum success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cue" className="flex items-center gap-2">
                    🔔 Cue (Trigger) - What will remind you to do this habit?
                  </Label>
                  <Textarea
                    id="cue"
                    placeholder="Be very specific about your trigger (e.g., 'After I pour my morning coffee')"
                    value={habit.cue}
                    onChange={(e) => updateHabit(habit.id, 'cue', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="routine" className="flex items-center gap-2">
                    🔄 Routine - What exactly will you do?
                  </Label>
                  <Textarea
                    id="routine"
                    placeholder="Describe the specific action steps (e.g., '5 deep breaths while looking out the window')"
                    value={habit.routine}
                    onChange={(e) => updateHabit(habit.id, 'routine', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="reward" className="flex items-center gap-2">
                    🏆 Reward - How will you celebrate or benefit?
                  </Label>
                  <Textarea
                    id="reward"
                    placeholder="What positive feeling or benefit will you get? (e.g., 'Feel proud and energized')"
                    value={habit.reward}
                    onChange={(e) => updateHabit(habit.id, 'reward', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {habitScore === 100 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Habit Loop Complete!</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    Your habit has all the elements for success. Ready to start your new routine!
                  </p>
                  <div className="text-sm text-green-600">
                    <strong>Your loop:</strong> {habit.cue} → {habit.routine} → {habit.reward}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => setActiveHabit(null)}>
                Back to Habits List
              </Button>
              <Button 
                onClick={() => {
                  updateHabit(habit.id, 'completed', 'true');
                  setActiveHabit(null);
                }}
                disabled={habitScore < 100}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Habit Loop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-green-600" />
          Habit Loop Creator
        </CardTitle>
        <CardDescription>
          Design sustainable habits using the scientifically-proven Cue → Routine → Reward framework
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Habit Templates */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">Quick Start Templates</CardTitle>
              <CardDescription>Choose a template or create your own from scratch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {habitTemplates.map((template, index) => (
                  <Card key={index} className="border border-gray-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        <strong>Cue:</strong> {template.cue}
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => addHabit(template)}
                        className="w-full"
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  onClick={() => addHabit()}
                  variant="outline"
                  className="w-full"
                >
                  Create Custom Habit from Scratch
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Habits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Habit Loops</h3>
            
            {habits.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="p-8 text-center">
                  <Repeat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Habits Yet</h3>
                  <p className="text-gray-500">Use a template above or create your first custom habit</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {habits.map((habit) => {
                  const habitScore = getHabitScore(habit);
                  
                  return (
                    <Card key={habit.id} className="border-2 border-green-200 hover:border-green-300 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-xl">🔄</span>
                          {habit.name || 'Unnamed Habit'}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {habit.frequency} • {habit.timeOfDay}
                        </CardDescription>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Completeness</span>
                            <span>{Math.round(habitScore)}%</span>
                          </div>
                          <Progress value={habitScore} className="h-1" />
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {habit.cue && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Trigger:</strong> {habit.cue}
                          </p>
                        )}
                        
                        <Button 
                          onClick={() => setActiveHabit(habit.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {habitScore === 100 ? 'Review Habit Loop' : 'Complete Habit Loop'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => onComplete('w6-habits', { 
                habits,
                completedHabits: habits.filter(h => getHabitScore(h) === 100).length,
                totalHabits: habits.length
              })}
              disabled={habits.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Habit Loops ({habits.filter(h => getHabitScore(h) === 100).length} complete)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Enhanced Coaching Component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Week4SomaticGrounding } from './week4-somatic-grounding';
import { BreathworkVagus } from './breathwork-vagus';
import { CalmCorner } from './calm-corner';
import { GuidedMeditation } from './guided-meditation';
import { 
  Play, 
  Pause, 
  ArrowLeft,
  Utensils, 
  Clock, 
  CheckCircle, 
  Activity,
  Shield,
  Sun,
  Moon,
  Brain,
  Heart,
  Target,
  Zap,
  BarChart,
  Star,
  Calendar,
  Flag,
  Repeat
} from 'lucide-react';
import { useWellnessData } from '@/hooks/use-local-storage';
import { videoScripts, audioScripts, detailedExercises } from '@/lib/hormone-headspace-content';
import type { ModuleComponent } from '@/types/wellness';

interface EnhancedCoachingComponentMinimalProps {
  component: any;
  moduleId: string;
  onComplete: (componentId: string, data?: any) => void;
  onClose: () => void;
}

export function EnhancedCoachingComponentMinimal({ component, moduleId, onComplete, onClose }: EnhancedCoachingComponentMinimalProps) {
  const [responses, setResponses] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { data, updateCoachingProgress } = useWellnessData();

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(component.id, responses);
    
    // Update coaching progress
    const newCompletedComponents = [...(data.coachingProgress?.completedComponents || []), component.id];
    updateCoachingProgress({
      completedComponents: newCompletedComponents,
      responseData: { ...data.coachingProgress?.responseData, [component.id]: responses }
    });
  };

  // Timer for audio/video content
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Week 4: Somatic Grounding Practices
  if (moduleId === 'week-4' && component.id === 'w4-grounding') {
    return <Week4SomaticGrounding onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Breathwork & Vagus Nerve Reset
  if (moduleId === 'week-4' && component.id === 'w4-breathwork') {
    return <BreathworkVagus onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Create Your Calm Corner
  if (moduleId === 'week-4' && component.id === 'w4-calm-corner') {
    return <CalmCorner onComplete={onComplete} onClose={onClose} />;
  }

  // Week 4: Guided Grounding Meditation
  if (moduleId === 'week-4' && component.id === 'w4-meditation') {
    return <GuidedMeditation onComplete={onComplete} onClose={onClose} />;
  }

  // Week 3: Overwhelm Pattern Analysis
  if (component.id === 'w3-patterns') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'assessment');
    const [overwhelmTriggers, setOverwhelmTriggers] = useState(responses.overwhelmTriggers || []);
    const [patterns, setPatterns] = useState(responses.patterns || {});
    const [strategies, setStrategies] = useState(responses.strategies || []);

    const updateResponses = (newData: any) => {
      // This function updates the component responses
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const overwhelmTriggerOptions = [
      { id: 'too-many-tasks', name: 'Too many tasks at once', category: 'workload' },
      { id: 'time-pressure', name: 'Time pressure and deadlines', category: 'time' },
      { id: 'perfectionism', name: 'Perfectionist expectations', category: 'mindset' },
      { id: 'saying-no', name: 'Difficulty saying no to requests', category: 'boundaries' },
      { id: 'technology', name: 'Technology and information overload', category: 'digital' },
      { id: 'family-demands', name: 'Family demands and caregiving', category: 'relationships' },
      { id: 'financial-stress', name: 'Financial pressures', category: 'money' },
      { id: 'health-concerns', name: 'Health or energy concerns', category: 'physical' },
      { id: 'social-obligations', name: 'Social obligations and events', category: 'social' },
      { id: 'decision-making', name: 'Too many decisions to make', category: 'mental' },
      { id: 'clutter', name: 'Physical clutter and disorganization', category: 'environment' },
      { id: 'hormonal', name: 'Hormonal changes and symptoms', category: 'physical' }
    ];

    const copingStrategies = [
      { id: 'breathing', name: 'Deep breathing exercises', effectiveness: 0 },
      { id: 'prioritizing', name: 'Making priority lists', effectiveness: 0 },
      { id: 'delegating', name: 'Delegating tasks to others', effectiveness: 0 },
      { id: 'boundaries', name: 'Setting clear boundaries', effectiveness: 0 },
      { id: 'exercise', name: 'Physical exercise or movement', effectiveness: 0 },
      { id: 'meditation', name: 'Meditation or mindfulness', effectiveness: 0 },
      { id: 'talking', name: 'Talking to friends or family', effectiveness: 0 },
      { id: 'breaks', name: 'Taking regular breaks', effectiveness: 0 },
      { id: 'nature', name: 'Spending time in nature', effectiveness: 0 },
      { id: 'journaling', name: 'Writing or journaling', effectiveness: 0 }
    ];

    const toggleTrigger = (triggerId: string) => {
      const newTriggers = overwhelmTriggers.includes(triggerId)
        ? overwhelmTriggers.filter(id => id !== triggerId)
        : [...overwhelmTriggers, triggerId];
      setOverwhelmTriggers(newTriggers);
      updateResponses({ overwhelmTriggers: newTriggers });
    };

    const updatePattern = (area: string, value: string) => {
      const newPatterns = { ...patterns, [area]: value };
      setPatterns(newPatterns);
      updateResponses({ patterns: newPatterns });
    };

    const updateStrategyEffectiveness = (strategyId: string, rating: number) => {
      const newStrategies = strategies.map((s: any) => 
        s.id === strategyId ? { ...s, effectiveness: rating } : s
      );
      if (!strategies.find((s: any) => s.id === strategyId)) {
        newStrategies.push({ id: strategyId, effectiveness: rating });
      }
      setStrategies(newStrategies);
      updateResponses({ strategies: newStrategies });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">🧠 Overwhelm Pattern Analysis</h2>
          <p className="text-lg text-gray-600">
            Understanding your unique overwhelm patterns is the first step to managing them effectively
          </p>
        </div>

        {currentStep === 'assessment' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Step 1: Identify Your Triggers</h3>
              <p className="text-indigo-700 mb-4">
                Select all the situations that commonly trigger feelings of overwhelm for you:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {overwhelmTriggerOptions.map(trigger => (
                  <label key={trigger.id} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-indigo-50">
                    <input
                      type="checkbox"
                      checked={overwhelmTriggers.includes(trigger.id)}
                      onChange={() => toggleTrigger(trigger.id)}
                      className="rounded border-indigo-300"
                    />
                    <div>
                      <span className="font-medium">{trigger.name}</span>
                      <span className="text-xs bg-indigo-100 px-2 py-1 rounded ml-2">{trigger.category}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentStep('patterns'); updateResponses({ currentStep: 'patterns' }); }}
                disabled={overwhelmTriggers.length === 0}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Continue to Pattern Analysis
              </button>
            </div>
          </div>
        )}

        {currentStep === 'patterns' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Step 2: Analyze Your Patterns</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What time of day do you most often feel overwhelmed?
                  </label>
                  <select 
                    value={patterns.timeOfDay || ''}
                    onChange={(e) => updatePattern('timeOfDay', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Select a time...</option>
                    <option value="morning">Morning (6am-12pm)</option>
                    <option value="afternoon">Afternoon (12pm-6pm)</option>
                    <option value="evening">Evening (6pm-10pm)</option>
                    <option value="night">Night (10pm-6am)</option>
                    <option value="varies">It varies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What physical sensations do you notice when overwhelmed?
                  </label>
                  <textarea 
                    value={patterns.physicalSensations || ''}
                    onChange={(e) => updatePattern('physicalSensations', e.target.value)}
                    placeholder="e.g., tight chest, racing heart, shallow breathing, tense shoulders..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What thoughts typically run through your mind?
                  </label>
                  <textarea 
                    value={patterns.thoughtPatterns || ''}
                    onChange={(e) => updatePattern('thoughtPatterns', e.target.value)}
                    placeholder="e.g., 'I can't handle this', 'There's too much to do', 'I'm not good enough'..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    How does overwhelm typically affect your behavior?
                  </label>
                  <textarea 
                    value={patterns.behaviorChanges || ''}
                    onChange={(e) => updatePattern('behaviorChanges', e.target.value)}
                    placeholder="e.g., procrastinating, snapping at others, avoiding tasks, eating differently..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>

              <button 
                onClick={() => { setCurrentStep('strategies'); updateResponses({ currentStep: 'strategies' }); }}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Continue to Strategy Assessment
              </button>
            </div>
          </div>
        )}

        {currentStep === 'strategies' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Step 3: Rate Your Coping Strategies</h3>
              <p className="text-green-700 mb-4">
                Rate how effective each strategy has been for you (1 = not helpful, 5 = very helpful):
              </p>
              
              <div className="space-y-3">
                {copingStrategies.map(strategy => (
                  <div key={strategy.id} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                    <span className="font-medium">{strategy.name}</span>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => updateStrategyEffectiveness(strategy.id, rating)}
                          className={`w-8 h-8 rounded-full text-sm font-medium ${
                            (strategies.find((s: any) => s.id === strategy.id)?.effectiveness || 0) === rating
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-200 hover:bg-green-100'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentStep('results'); updateResponses({ currentStep: 'results' }); }}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                View Your Analysis
              </button>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Your Overwhelm Profile</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Your Top Triggers:</h4>
                  <ul className="space-y-1">
                    {overwhelmTriggers.slice(0, 5).map(triggerId => {
                      const trigger = overwhelmTriggerOptions.find(t => t.id === triggerId);
                      return trigger ? (
                        <li key={triggerId} className="text-blue-700">• {trigger.name}</li>
                      ) : null;
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Most Effective Strategies:</h4>
                  <ul className="space-y-1">
                    {strategies
                      .filter((s: any) => s.effectiveness >= 4)
                      .slice(0, 5)
                      .map((strategy: any) => {
                        const strategyData = copingStrategies.find(cs => cs.id === strategy.id);
                        return strategyData ? (
                          <li key={strategy.id} className="text-blue-700">
                            • {strategyData.name} (Rating: {strategy.effectiveness})
                          </li>
                        ) : null;
                      })}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Personalized Recommendations:</h4>
                <ul className="space-y-2 text-blue-800">
                  {patterns.timeOfDay === 'morning' && (
                    <li>• Consider creating a calming morning routine to start your day centered</li>
                  )}
                  {overwhelmTriggers.includes('perfectionism') && (
                    <li>• Practice the "good enough" principle - aim for progress, not perfection</li>
                  )}
                  {overwhelmTriggers.includes('saying-no') && (
                    <li>• Develop scripts for saying no gracefully to protect your energy</li>
                  )}
                  {patterns.physicalSensations && (
                    <li>• Use your physical sensations as early warning signals to implement coping strategies</li>
                  )}
                </ul>
              </div>

              <button 
                onClick={() => onComplete('w3-patterns', { 
                  overwhelmTriggers, 
                  patterns, 
                  strategies,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Pattern Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Pause-Label-Shift Technique
  if (component.id === 'w3-technique') {
    const [currentStep, setCurrentStep] = useState(responses.currentStep || 'learn');
    const [practiceScenario, setPracticeScenario] = useState(responses.practiceScenario || '');
    const [practiceData, setPracticeData] = useState(responses.practiceData || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const emotionCategories = {
      primary: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'],
      midlife: ['Overwhelm', 'Frustration', 'Anxiety', 'Grief', 'Resentment', 'Loneliness', 'Excitement', 'Relief']
    };

    const shiftStrategies = [
      { 
        name: 'Reframe the Perspective', 
        description: 'Look at the situation from a different angle',
        example: 'Instead of "This is terrible" → "This is challenging, but I can handle challenges"'
      },
      { 
        name: 'Focus on What You Can Control', 
        description: 'Identify actionable steps within your influence',
        example: 'I can\'t control the situation, but I can control my response'
      },
      { 
        name: 'Use Self-Compassion', 
        description: 'Treat yourself with the kindness you\'d show a friend',
        example: 'It\'s normal to feel this way. I\'m being human.'
      },
      { 
        name: 'Ground in the Present', 
        description: 'Return attention to the current moment',
        example: 'Right now, I am safe. Right now, I can breathe.'
      },
      { 
        name: 'Consider the Bigger Picture', 
        description: 'Zoom out to see the broader context',
        example: 'How will this matter in a week/month/year?'
      }
    ];

    const practiceScenarios = [
      'Your teenage child just announced they\'re dropping out of college',
      'You made a mistake at work that everyone noticed',
      'Your partner forgot an important anniversary',
      'You\'re feeling overwhelmed by aging parents\' needs',
      'A close friendship is ending due to different life paths',
      'You\'re experiencing new physical symptoms of perimenopause'
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">⏸️ Pause-Label-Shift Technique</h2>
          <p className="text-lg text-gray-600">
            A powerful three-step method for emotional regulation in challenging moments
          </p>
        </div>

        {currentStep === 'learn' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">⏸️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800">PAUSE</h3>
                </div>
                <p className="text-red-700 text-sm">
                  Stop whatever you're doing. Take a conscious breath. Create space between the trigger and your response.
                </p>
                <div className="mt-4 p-3 bg-red-100 rounded">
                  <strong className="text-red-800">Practice:</strong>
                  <p className="text-red-700 text-sm">Count to 5 slowly while breathing deeply</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">🏷️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">LABEL</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  Name the emotion you're experiencing. Be specific and compassionate with yourself.
                </p>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <strong className="text-blue-800">Practice:</strong>
                  <p className="text-blue-700 text-sm">"I notice I'm feeling frustrated and overwhelmed"</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">🔄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">SHIFT</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Choose a more helpful response. Reframe your perspective or focus on what you can control.
                </p>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <strong className="text-green-800">Practice:</strong>
                  <p className="text-green-700 text-sm">Choose a coping strategy that works for you</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧠 Why This Works</h3>
              <p className="text-yellow-700 mb-3">
                This technique leverages neuroscience research on emotional regulation:
              </p>
              <ul className="space-y-2 text-yellow-700">
                <li>• <strong>Pause:</strong> Activates your prefrontal cortex (thinking brain) instead of reacting from the amygdala (emotion brain)</li>
                <li>• <strong>Label:</strong> Research shows naming emotions reduces their intensity by up to 50%</li>
                <li>• <strong>Shift:</strong> Creates new neural pathways for healthier responses over time</li>
              </ul>
            </div>

            <button 
              onClick={() => { setCurrentStep('practice'); updateResponses({ currentStep: 'practice' }); }}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              Practice the Technique
            </button>
          </div>
        )}

        {currentStep === 'practice' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">Practice Session</h3>
              
              <div className="mb-6">
                <label className="block font-medium text-emerald-900 mb-2">
                  Choose a scenario to practice with:
                </label>
                <select 
                  value={practiceScenario}
                  onChange={(e) => { setPracticeScenario(e.target.value); updateResponses({ practiceScenario: e.target.value }); }}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                >
                  <option value="">Select a scenario...</option>
                  {practiceScenarios.map((scenario, index) => (
                    <option key={index} value={scenario}>{scenario}</option>
                  ))}
                  <option value="custom">Use my own situation</option>
                </select>
              </div>

              {practiceScenario === 'custom' && (
                <div className="mb-6">
                  <label className="block font-medium text-emerald-900 mb-2">
                    Describe your situation:
                  </label>
                  <textarea 
                    value={practiceData.customScenario || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, customScenario: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                    rows={3}
                    placeholder="Describe a situation that's been challenging for you..."
                  />
                </div>
              )}

              {practiceScenario && (
                <div className="space-y-6">
                  <div className="p-4 bg-white border border-emerald-200 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Scenario:</h4>
                    <p className="text-emerald-800">{practiceScenario === 'custom' ? practiceData.customScenario : practiceScenario}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">⏸️ Step 1: PAUSE</h4>
                      <p className="text-emerald-700 mb-2">Take a moment to breathe. What do you notice in your body right now?</p>
                      <textarea 
                        value={practiceData.pauseResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, pauseResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={2}
                        placeholder="e.g., tension in shoulders, racing heart, tight jaw..."
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">🏷️ Step 2: LABEL</h4>
                      <p className="text-emerald-700 mb-2">What emotions are you experiencing? Be specific.</p>
                      
                      <div className="mb-3">
                        <p className="text-sm text-emerald-600 mb-2">Common emotions:</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {[...emotionCategories.primary, ...emotionCategories.midlife].map(emotion => (
                            <button
                              key={emotion}
                              onClick={() => {
                                const currentEmotions = practiceData.labeledEmotions || [];
                                const newEmotions = currentEmotions.includes(emotion)
                                  ? currentEmotions.filter((e: string) => e !== emotion)
                                  : [...currentEmotions, emotion];
                                const newData = { ...practiceData, labeledEmotions: newEmotions };
                                setPracticeData(newData);
                                updateResponses({ practiceData: newData });
                              }}
                              className={`px-3 py-1 rounded-full text-sm ${
                                (practiceData.labeledEmotions || []).includes(emotion)
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              }`}
                            >
                              {emotion}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        value={practiceData.labelResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, labelResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={2}
                        placeholder="Complete this: 'I notice I'm feeling...'"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">🔄 Step 3: SHIFT</h4>
                      <p className="text-emerald-700 mb-3">Choose a strategy to shift your perspective or response:</p>
                      
                      <div className="space-y-3 mb-4">
                        {shiftStrategies.map((strategy, index) => (
                          <div key={index} className="border border-emerald-200 rounded-lg p-3">
                            <label className="flex items-start space-x-3">
                              <input
                                type="radio"
                                name="shiftStrategy"
                                value={strategy.name}
                                checked={practiceData.selectedStrategy === strategy.name}
                                onChange={(e) => {
                                  const newData = { ...practiceData, selectedStrategy: e.target.value };
                                  setPracticeData(newData);
                                  updateResponses({ practiceData: newData });
                                }}
                                className="mt-1"
                              />
                              <div>
                                <div className="font-medium text-emerald-900">{strategy.name}</div>
                                <div className="text-sm text-emerald-700">{strategy.description}</div>
                                <div className="text-xs text-emerald-600 italic mt-1">{strategy.example}</div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <textarea 
                        value={practiceData.shiftResponse || ''}
                        onChange={(e) => {
                          const newData = { ...practiceData, shiftResponse: e.target.value };
                          setPracticeData(newData);
                          updateResponses({ practiceData: newData });
                        }}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg"
                        rows={3}
                        placeholder="How would you apply this strategy to your situation? Write your reframed perspective..."
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => { setCurrentStep('reflection'); updateResponses({ currentStep: 'reflection' }); }}
                    disabled={!practiceData.pauseResponse || !practiceData.labelResponse || !practiceData.shiftResponse}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    Complete Practice Session
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'reflection' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">🎯 Practice Reflection</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    How did using this technique feel?
                  </label>
                  <textarea 
                    value={practiceData.feelingReflection || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, feelingReflection: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={3}
                    placeholder="Describe your experience using Pause-Label-Shift..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    What was most challenging about this technique?
                  </label>
                  <textarea 
                    value={practiceData.challengeReflection || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, challengeReflection: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                    rows={2}
                    placeholder="What was difficult or felt unnatural?"
                  />
                </div>

                <div>
                  <label className="block font-medium text-purple-900 mb-2">
                    When will you practice this technique again?
                  </label>
                  <select 
                    value={practiceData.commitmentPlan || ''}
                    onChange={(e) => {
                      const newData = { ...practiceData, commitmentPlan: e.target.value };
                      setPracticeData(newData);
                      updateResponses({ practiceData: newData });
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg"
                  >
                    <option value="">Choose your commitment...</option>
                    <option value="daily">I'll practice this daily for the next week</option>
                    <option value="as-needed">I'll use it when I notice strong emotions</option>
                    <option value="weekly">I'll practice once a week with different scenarios</option>
                    <option value="situations">I'll identify 3 specific situations to practice with</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => onComplete('w3-technique', { 
                  practiceScenario, 
                  practiceData,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Technique Training
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Boundaries Worksheet
  if (component.id === 'w3-boundaries') {
    const [currentSection, setCurrentSection] = useState(responses.currentSection || 'assessment');
    const [boundaryTypes, setBoundaryTypes] = useState(responses.boundaryTypes || {});
    const [situations, setSituations] = useState(responses.situations || []);
    const [scripts, setScripts] = useState(responses.scripts || {});

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const boundaryAreas = [
      {
        id: 'time',
        name: 'Time Boundaries',
        description: 'Protecting your time and energy',
        examples: ['Setting work hours', 'Limiting social commitments', 'Saying no to requests'],
        difficulty: boundaryTypes.time || 1
      },
      {
        id: 'emotional',
        name: 'Emotional Boundaries',
        description: 'Protecting your emotional well-being',
        examples: ['Not absorbing others\' stress', 'Limiting negative conversations', 'Taking breaks from draining people'],
        difficulty: boundaryTypes.emotional || 1
      },
      {
        id: 'physical',
        name: 'Physical Boundaries',
        description: 'Protecting your personal space and body',
        examples: ['Comfortable personal space', 'Appropriate touch', 'Your living environment'],
        difficulty: boundaryTypes.physical || 1
      },
      {
        id: 'digital',
        name: 'Digital Boundaries',
        description: 'Managing technology and online interactions',
        examples: ['Screen time limits', 'Social media breaks', 'Email response times'],
        difficulty: boundaryTypes.digital || 1
      },
      {
        id: 'family',
        name: 'Family Boundaries',
        description: 'Healthy limits with family members',
        examples: ['Adult children relationships', 'Extended family expectations', 'Holiday obligations'],
        difficulty: boundaryTypes.family || 1
      },
      {
        id: 'financial',
        name: 'Financial Boundaries',
        description: 'Protecting your financial resources',
        examples: ['Lending money', 'Gift-giving limits', 'Sharing financial information'],
        difficulty: boundaryTypes.financial || 1
      }
    ];

    const updateBoundaryDifficulty = (area: string, difficulty: number) => {
      const newTypes = { ...boundaryTypes, [area]: difficulty };
      setBoundaryTypes(newTypes);
      updateResponses({ boundaryTypes: newTypes });
    };

    const addSituation = (situation: any) => {
      const newSituations = [...situations, situation];
      setSituations(newSituations);
      updateResponses({ situations: newSituations });
    };

    const updateScript = (area: string, script: string) => {
      const newScripts = { ...scripts, [area]: script };
      setScripts(newScripts);
      updateResponses({ scripts: newScripts });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-800 mb-4">🛡️ Boundaries Worksheet</h2>
          <p className="text-lg text-gray-600">
            Create healthy boundaries that protect your energy and well-being
          </p>
        </div>

        {currentSection === 'assessment' && (
          <div className="space-y-6">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-800 mb-4">Boundary Assessment</h3>
              <p className="text-pink-700 mb-4">
                Rate how difficult each type of boundary is for you to maintain (1 = very easy, 5 = very difficult):
              </p>
              
              <div className="space-y-4">
                {boundaryAreas.map(area => (
                  <div key={area.id} className="bg-white border border-pink-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-pink-900">{area.name}</h4>
                        <p className="text-sm text-pink-700">{area.description}</p>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(level => (
                          <button
                            key={level}
                            onClick={() => updateBoundaryDifficulty(area.id, level)}
                            className={`w-8 h-8 rounded-full text-sm font-medium ${
                              area.difficulty === level
                                ? 'bg-pink-600 text-white' 
                                : 'bg-gray-200 hover:bg-pink-100'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-pink-600">
                      Examples: {area.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => { setCurrentSection('situations'); updateResponses({ currentSection: 'situations' }); }}
                className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded-lg"
              >
                Continue to Specific Situations
              </button>
            </div>
          </div>
        )}

        {currentSection === 'situations' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">Identify Challenging Situations</h3>
              
              <div className="space-y-4">
                {boundaryAreas
                  .filter(area => area.difficulty >= 3)
                  .map(area => (
                    <div key={area.id} className="bg-white border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">{area.name}</h4>
                      <p className="text-orange-700 text-sm mb-3">
                        Describe a specific situation where you struggle with this boundary:
                      </p>
                      <textarea 
                        value={situations.find((s: any) => s.area === area.id)?.description || ''}
                        onChange={(e) => {
                          const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                          if (existingSituationIndex >= 0) {
                            const newSituations = [...situations];
                            newSituations[existingSituationIndex] = {
                              ...newSituations[existingSituationIndex],
                              description: e.target.value
                            };
                            setSituations(newSituations);
                            updateResponses({ situations: newSituations });
                          } else {
                            addSituation({
                              area: area.id,
                              description: e.target.value,
                              people: '',
                              consequences: ''
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg"
                        rows={2}
                        placeholder={`Example: "My adult daughter calls me every day to vent about work, and I feel drained but guilty if I don't answer..."`}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-orange-900 mb-1">Who is involved?</label>
                          <input 
                            value={situations.find((s: any) => s.area === area.id)?.people || ''}
                            onChange={(e) => {
                              const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                              if (existingSituationIndex >= 0) {
                                const newSituations = [...situations];
                                newSituations[existingSituationIndex] = {
                                  ...newSituations[existingSituationIndex],
                                  people: e.target.value
                                };
                                setSituations(newSituations);
                                updateResponses({ situations: newSituations });
                              }
                            }}
                            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
                            placeholder="Family member, friend, colleague..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-orange-900 mb-1">What happens when you don't set boundaries?</label>
                          <input 
                            value={situations.find((s: any) => s.area === area.id)?.consequences || ''}
                            onChange={(e) => {
                              const existingSituationIndex = situations.findIndex((s: any) => s.area === area.id);
                              if (existingSituationIndex >= 0) {
                                const newSituations = [...situations];
                                newSituations[existingSituationIndex] = {
                                  ...newSituations[existingSituationIndex],
                                  consequences: e.target.value
                                };
                                setSituations(newSituations);
                                updateResponses({ situations: newSituations });
                              }
                            }}
                            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
                            placeholder="Exhaustion, resentment, stress..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button 
                onClick={() => { setCurrentSection('scripts'); updateResponses({ currentSection: 'scripts' }); }}
                className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-lg"
              >
                Create Boundary Scripts
              </button>
            </div>
          </div>
        )}

        {currentSection === 'scripts' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Boundary Setting Scripts</h3>
              <p className="text-green-700 mb-4">
                Create scripts for setting boundaries in your challenging situations:
              </p>
              
              <div className="space-y-4">
                {situations.map((situation: any, index: number) => {
                  const area = boundaryAreas.find(a => a.id === situation.area);
                  if (!area) return null;
                  
                  return (
                    <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">{area.name}</h4>
                      <p className="text-sm text-green-700 mb-3">{situation.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            Gentle but firm script:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_gentle`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_gentle`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"I love you and want to support you, but I need to limit our daily calls to 20 minutes so I can manage my own stress levels."`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            If pushback occurs:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_firm`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_firm`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"I understand you're disappointed, but this boundary is important for my well-being. I'm available to talk on Tuesdays and Thursdays."`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-1">
                            Alternative/compromise:
                          </label>
                          <textarea 
                            value={scripts[`${situation.area}_alternative`] || ''}
                            onChange={(e) => updateScript(`${situation.area}_alternative`, e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm"
                            rows={2}
                            placeholder={`"Instead of daily calls, how about we schedule a longer conversation twice a week when I can give you my full attention?"`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Boundary Setting Tips:</h4>
                <ul className="space-y-1 text-green-800 text-sm">
                  <li>• Use "I" statements to express your needs</li>
                  <li>• Be specific about what you need</li>
                  <li>• Offer alternatives when possible</li>
                  <li>• Stay calm and compassionate but firm</li>
                  <li>• Remember: boundaries are self-care, not selfishness</li>
                </ul>
              </div>

              <button 
                onClick={() => onComplete('w3-boundaries', { 
                  boundaryTypes, 
                  situations, 
                  scripts,
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Boundaries Worksheet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Week 3: Weekly Mood Map
  if (component.id === 'w3-mood-map') {
    const [selectedDay, setSelectedDay] = useState(responses.selectedDay || 0);
    const [moodData, setMoodData] = useState(responses.moodData || Array(7).fill(null).map(() => ({
      morning: { mood: 5, energy: 5, notes: '' },
      afternoon: { mood: 5, energy: 5, notes: '' },
      evening: { mood: 5, energy: 5, notes: '' }
    })));
    const [patterns, setPatterns] = useState(responses.patterns || '');
    const [insights, setInsights] = useState(responses.insights || '');

    const updateResponses = (newData: any) => {
      setResponses((prev: any) => ({ ...prev, ...newData }));
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeOfDay = ['morning', 'afternoon', 'evening'];
    const moodLabels = {
      1: 'Very Low',
      2: 'Low', 
      3: 'Below Average',
      4: 'Average',
      5: 'Good',
      6: 'High',
      7: 'Very High',
      8: 'Excellent',
      9: 'Amazing',
      10: 'Peak'
    };

    const updateMoodData = (dayIndex: number, time: string, field: string, value: any) => {
      const newData = [...moodData];
      newData[dayIndex] = {
        ...newData[dayIndex],
        [time]: {
          ...newData[dayIndex][time],
          [field]: value
        }
      };
      setMoodData(newData);
      updateResponses({ moodData: newData });
    };

    const getMoodColor = (mood: number) => {
      if (mood <= 3) return 'bg-red-200 border-red-400';
      if (mood <= 5) return 'bg-yellow-200 border-yellow-400';
      if (mood <= 7) return 'bg-green-200 border-green-400';
      return 'bg-blue-200 border-blue-400';
    };

    const getAverageMood = () => {
      const allMoods = moodData.flatMap(day => [day.morning.mood, day.afternoon.mood, day.evening.mood]);
      return (allMoods.reduce((sum, mood) => sum + mood, 0) / allMoods.length).toFixed(1);
    };

    const getAverageEnergy = () => {
      const allEnergy = moodData.flatMap(day => [day.morning.energy, day.afternoon.energy, day.evening.energy]);
      return (allEnergy.reduce((sum, energy) => sum + energy, 0) / allEnergy.length).toFixed(1);
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Back to Week 3
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-violet-800 mb-4">📈 Weekly Mood Map</h2>
          <p className="text-lg text-gray-600">
            Track your emotional patterns throughout the week to identify trends and triggers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 sticky top-4">
              <h3 className="font-semibold text-violet-800 mb-3">Select Day</h3>
              <div className="space-y-2">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedDay === index
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white border-violet-200 hover:border-violet-300'
                    }`}
                  >
                    <div className="font-medium">{day}</div>
                    {moodData[index] && (
                      <div className="text-xs opacity-75 mt-1">
                        Avg Mood: {((moodData[index].morning.mood + moodData[index].afternoon.mood + moodData[index].evening.mood) / 3).toFixed(1)}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-3 bg-white border border-violet-200 rounded-lg">
                <h4 className="font-semibold text-violet-800 mb-2">Weekly Averages</h4>
                <div className="space-y-1 text-sm">
                  <div>Mood: {getAverageMood()}/10</div>
                  <div>Energy: {getAverageEnergy()}/10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tracking */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-violet-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-violet-800 mb-4">
                {days[selectedDay]} Tracking
              </h3>

              <div className="space-y-6">
                {timeOfDay.map(time => (
                  <div key={time} className={`p-4 rounded-lg border-2 ${getMoodColor(moodData[selectedDay][time].mood)}`}>
                    <h4 className="font-semibold text-gray-800 mb-3 capitalize">{time}</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mood Level (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData[selectedDay][time].mood}
                          onChange={(e) => updateMoodData(selectedDay, time, 'mood', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Low</span>
                          <span className="font-medium">{moodData[selectedDay][time].mood} - {moodLabels[moodData[selectedDay][time].mood as keyof typeof moodLabels]}</span>
                          <span>High</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Energy Level (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData[selectedDay][time].energy}
                          onChange={(e) => updateMoodData(selectedDay, time, 'energy', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Drained</span>
                          <span className="font-medium">{moodData[selectedDay][time].energy}</span>
                          <span>Energized</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (events, triggers, thoughts)
                      </label>
                      <textarea
                        value={moodData[selectedDay][time].notes}
                        onChange={(e) => updateMoodData(selectedDay, time, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="What happened? How did you feel? Any triggers or positive moments?"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern Analysis */}
            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Pattern Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-indigo-900 mb-2">
                    What patterns do you notice in your mood and energy?
                  </label>
                  <textarea
                    value={patterns}
                    onChange={(e) => { setPatterns(e.target.value); updateResponses({ patterns: e.target.value }); }}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg"
                    rows={3}
                    placeholder="e.g., Lower energy in the afternoons, better mood on weekends, stress impacts Tuesday mornings..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-indigo-900 mb-2">
                    What insights can you draw from this week's data?
                  </label>
                  <textarea
                    value={insights}
                    onChange={(e) => { setInsights(e.target.value); updateResponses({ insights: e.target.value }); }}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg"
                    rows={3}
                    placeholder="What triggers affect you most? When are you happiest? What helps boost your mood?"
                  />
                </div>
              </div>

              <button 
                onClick={() => onComplete('w3-mood-map', { 
                  moodData, 
                  patterns, 
                  insights,
                  averageMood: getAverageMood(),
                  averageEnergy: getAverageEnergy(),
                  completedAt: new Date().toISOString()
                })}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg"
              >
                Complete Mood Map
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Week 5: Enhanced Cognitive Clarity Assessment - Using Fresh Component
  if (component.id === 'w5-assessment') {
    console.log('Loading Fresh Cognitive Assessment Component');
    return <CognitiveAssessmentFresh onComplete={onComplete} onClose={onClose} />;
  }

  // Week 5: Interactive Focus & Memory Rituals
  if (component.id === 'w5-rituals') {
    return <InteractiveFocusMemoryRituals onComplete={onComplete} onClose={onClose} />;
  }

  // Week 5: Brain-Boosting Nutrition Plan
  if (component.id === 'w5-nutrition') {
    return <BrainBoostingNutritionPlan onComplete={onComplete} onClose={onClose} />;
  }

  // Week 5: Mind Management System
  if (component.id === 'w5-mind-management') {
    return <MindManagementSystem onComplete={onComplete} onClose={onClose} />;
  }

  // Week 6: Digital Vision Board
  if (component.id === 'w6-vision') {
    return <DigitalVisionBoard onComplete={onComplete} onClose={onClose} />;
  }

  // Week 6: SMART Goal Setting
  if (component.id === 'w6-goals') {
    return <SmartGoalSetting onComplete={onComplete} onClose={onClose} />;
  }

  // Week 6: Reverse Engineer Method
  if (component.id === 'w6-reverse') {
    return <ReverseEngineerMethod onComplete={onComplete} onClose={onClose} />;
  }

  // Week 6: Habit Loop Creator
  if (component.id === 'w6-habits') {
    return <HabitLoopCreator onComplete={onComplete} onClose={onClose} />;
  }

  // Default fallback for any other components
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {component.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">{component.title}</h3>
            <p className="text-gray-600 mb-6">{component.description}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => onComplete(component.id, { completed: true })}>
                Mark Complete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

