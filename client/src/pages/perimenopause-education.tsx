import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Activity, 
  Moon, 
  Thermometer, 
  Battery, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Shield,
  Leaf,
  BookOpen,
  Stethoscope
} from 'lucide-react';
import { updatePageSEO } from '@/lib/seo';
import { useEffect } from 'react';

export default function PerimenopauseEducation() {
  useEffect(() => {
    updatePageSEO({
      title: "Understanding Perimenopause - Complete Guide | BloomAfter40",
      description: "Comprehensive guide to perimenopause: learn about physiological, psychological, and cognitive changes, common symptoms, and evidence-based coping strategies for midlife women.",
      keywords: "perimenopause guide, perimenopause symptoms, hormonal changes, midlife women, menopause transition, perimenopause coping strategies"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Educational Resource</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Understanding Perimenopause
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive guide to navigating the physiological, psychological, and cognitive changes during midlife
          </p>
        </div>

        {/* What is Perimenopause Section */}
        <Card className="mb-8" data-testid="card-what-is-perimenopause">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Stethoscope className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">What is Perimenopause?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed">
              Perimenopause, meaning "around menopause," is the transitional period before menopause when your body begins its natural shift away from reproductive years. This phase typically begins in your 40s but can start in your mid-30s for some women.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Key Facts
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Duration:</strong> Typically lasts 4-10 years, with an average of 4 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Age Range:</strong> Usually begins between ages 35-50, most commonly in the 40s</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Natural Process:</strong> A normal biological transition, not a disease or disorder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Menopause Marker:</strong> Officially reached menopause after 12 consecutive months without a period</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="physiological" className="mb-8" data-testid="tabs-perimenopause-info">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="physiological" className="flex items-center gap-2" data-testid="tab-physiological">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Physiological</span>
            </TabsTrigger>
            <TabsTrigger value="psychological" className="flex items-center gap-2" data-testid="tab-psychological">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Psychological</span>
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex items-center gap-2" data-testid="tab-cognitive">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Cognitive</span>
            </TabsTrigger>
          </TabsList>

          {/* Physiological Changes */}
          <TabsContent value="physiological" className="space-y-6">
            <Card data-testid="card-physiological-changes">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  Physiological Changes During Perimenopause
                </CardTitle>
                <CardDescription>Understanding the physical transformations your body experiences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Hormonal Changes */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Hormonal Fluctuations
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    The hallmark of perimenopause is erratic hormone levels, particularly estrogen and progesterone. Rather than declining steadily, these hormones fluctuate wildly—sometimes higher, sometimes lower than normal levels.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li><strong>Estrogen:</strong> Fluctuates unpredictably, causing irregular periods and various symptoms</li>
                    <li><strong>Progesterone:</strong> Declines earlier than estrogen, affecting menstrual regularity and sleep</li>
                    <li><strong>FSH (Follicle Stimulating Hormone):</strong> Rises as ovaries become less responsive</li>
                    <li><strong>Testosterone:</strong> Gradual decline affecting energy and libido</li>
                  </ul>
                </div>

                {/* Common Physical Symptoms */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Common Physical Symptoms
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800" data-testid="card-vasomotor-symptoms">
                      <h4 className="font-semibold mb-2 text-rose-900 dark:text-rose-300">Vasomotor Symptoms</h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Hot flashes (sudden heat waves)</li>
                        <li>• Night sweats disrupting sleep</li>
                        <li>• Flushing and rapid heartbeat</li>
                        <li>• Temperature regulation issues</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="card-menstrual-changes">
                      <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">Menstrual Changes</h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Irregular cycle length</li>
                        <li>• Heavier or lighter bleeding</li>
                        <li>• Spotting between periods</li>
                        <li>• Skipped periods</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800" data-testid="card-physical-discomfort">
                      <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-300">Physical Discomfort</h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Joint and muscle aches</li>
                        <li>• Headaches and migraines</li>
                        <li>• Breast tenderness</li>
                        <li>• Heart palpitations</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800" data-testid="card-metabolic-changes">
                      <h4 className="font-semibold mb-2 text-green-900 dark:text-green-300">Metabolic Changes</h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>• Weight gain (especially abdominal)</li>
                        <li>• Slower metabolism</li>
                        <li>• Changes in body composition</li>
                        <li>• Increased insulin resistance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sleep Disruptions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Sleep Disruptions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Up to 60% of perimenopausal women experience sleep disturbances caused by hormonal fluctuations, night sweats, and increased anxiety. Poor sleep further exacerbates other symptoms.
                  </p>
                </div>

                {/* Genitourinary Health */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    Genitourinary Health Changes
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Declining estrogen levels directly affect the urogenital tract, causing a condition called Genitourinary Syndrome of Menopause (GSM). These changes can significantly impact quality of life but are often treatable.
                  </p>
                  
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-lg border border-pink-200 dark:border-pink-800 space-y-4" data-testid="card-genitourinary-health">
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-pink-900 dark:text-pink-300">Recurrent Urinary Tract Infections (UTIs)</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Why it happens:</strong> Estrogen helps maintain healthy vaginal and urethral tissue. As estrogen declines, the vaginal pH becomes less acidic, reducing protective bacteria and thinning the urethral lining, making infections more likely.
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Symptoms:</strong> Frequent, urgent, or painful urination; cloudy or strong-smelling urine; pelvic discomfort
                      </p>
                    </div>

                    <div className="border-t border-pink-200 dark:border-pink-700 pt-4">
                      <h4 className="font-semibold mb-2 text-pink-900 dark:text-pink-300">Dyspareunia (Painful Intercourse)</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Why it happens:</strong> Reduced estrogen causes vaginal tissue to become thinner, less elastic, and drier (vaginal atrophy). This can lead to discomfort, burning, or pain during sexual activity.
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Symptoms:</strong> Vaginal dryness, burning sensation, pain during penetration, reduced natural lubrication, longer arousal time
                      </p>
                    </div>

                    <div className="border-t border-pink-200 dark:border-pink-700 pt-4">
                      <h4 className="font-semibold mb-2 text-pink-900 dark:text-pink-300">Post-Coital Bleeding</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Why it happens:</strong> The vaginal walls become more fragile and less lubricated due to declining estrogen, making them more susceptible to minor tears or irritation during intercourse.
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Important:</strong> While common in perimenopause, post-coital bleeding should always be evaluated by a healthcare provider to rule out other conditions.
                      </p>
                    </div>

                    <div className="bg-pink-100 dark:bg-pink-900/40 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold mb-2 text-pink-900 dark:text-pink-300">Coping Strategies for Genitourinary Issues</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>• <strong>Vaginal moisturizers:</strong> Use regularly (2-3x/week) to maintain tissue hydration, not just during intercourse</li>
                        <li>• <strong>Water-based lubricants:</strong> Apply generously before and during sexual activity</li>
                        <li>• <strong>Vaginal estrogen therapy:</strong> Low-dose creams, tablets, or rings can restore vaginal tissue health (consult your doctor)</li>
                        <li>• <strong>Hydration:</strong> Drink plenty of water to support urinary tract health</li>
                        <li>• <strong>Pelvic floor exercises:</strong> Strengthen muscles to improve bladder control and sexual function (see exercise section)</li>
                        <li>• <strong>Cotton underwear:</strong> Breathable fabrics reduce moisture and irritation</li>
                        <li>• <strong>Avoid irritants:</strong> Perfumed soaps, douches, and harsh detergents can worsen symptoms</li>
                        <li>• <strong>Regular sexual activity:</strong> Helps maintain vaginal elasticity and blood flow</li>
                        <li>• <strong>Urinate after intercourse:</strong> Reduces UTI risk by flushing bacteria</li>
                        <li>• <strong>See a healthcare provider:</strong> Many effective treatments are available; don't suffer in silence</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Psychological Changes */}
          <TabsContent value="psychological" className="space-y-6">
            <Card data-testid="card-psychological-changes">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Psychological Changes During Perimenopause
                </CardTitle>
                <CardDescription>Emotional and mental health shifts during the transition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Hormonal fluctuations significantly impact neurotransmitters like serotonin, dopamine, and GABA, which regulate mood, anxiety, and emotional stability. These changes are biological, not "all in your head."
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Mood Changes */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800" data-testid="card-mood-fluctuations">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-900 dark:text-yellow-300">Mood Fluctuations</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Increased irritability and anger</li>
                      <li>• Mood swings and emotional volatility</li>
                      <li>• Feelings of sadness or tearfulness</li>
                      <li>• Reduced stress tolerance</li>
                      <li>• Emotional sensitivity</li>
                    </ul>
                  </div>

                  {/* Anxiety */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800" data-testid="card-anxiety-worry">
                    <h3 className="font-semibold text-lg mb-3 text-orange-900 dark:text-orange-300">Anxiety & Worry</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• New or worsening anxiety</li>
                      <li>• Panic attacks (even without prior history)</li>
                      <li>• Racing thoughts</li>
                      <li>• Feeling overwhelmed easily</li>
                      <li>• Heightened sense of dread</li>
                    </ul>
                  </div>

                  {/* Depression Risk */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="card-depression-symptoms">
                    <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-300">Depression Symptoms</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Low mood or persistent sadness</li>
                      <li>• Loss of interest in activities</li>
                      <li>• Fatigue and low energy</li>
                      <li>• Feelings of hopelessness</li>
                      <li>• Social withdrawal</li>
                    </ul>
                  </div>

                  {/* Self-Perception */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800" data-testid="card-self-perception">
                    <h3 className="font-semibold text-lg mb-3 text-purple-900 dark:text-purple-300">Self-Perception Changes</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Questioning identity and purpose</li>
                      <li>• Concerns about aging</li>
                      <li>• Reduced confidence</li>
                      <li>• Body image struggles</li>
                      <li>• Relationship strain</li>
                    </ul>
                  </div>

                </div>

                <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-lg border-l-4 border-purple-600">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>Important:</strong> Women with a history of depression, PMS, or postpartum depression have a higher risk of depressive symptoms during perimenopause. If you experience persistent low mood, talk to a healthcare provider.
                  </p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Cognitive Changes */}
          <TabsContent value="cognitive" className="space-y-6">
            <Card data-testid="card-cognitive-changes">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Cognitive Changes During Perimenopause
                </CardTitle>
                <CardDescription>Understanding "brain fog" and mental clarity challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Estrogen plays a crucial role in brain function, affecting memory, focus, and processing speed. Fluctuating estrogen levels during perimenopause can cause noticeable cognitive changes that are temporary and manageable.
                </p>

                <div className="space-y-4">
                  
                  {/* Memory Issues */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="card-memory-challenges">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-blue-900 dark:text-blue-300">
                      <Brain className="w-5 h-5" />
                      Memory Challenges
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-7">
                      <li>• Difficulty recalling words or names</li>
                      <li>• Forgetting why you entered a room</li>
                      <li>• Misplacing items more frequently</li>
                      <li>• Trouble retaining new information</li>
                      <li>• Short-term memory lapses</li>
                    </ul>
                  </div>

                  {/* Focus & Concentration */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800" data-testid="card-focus-concentration">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-purple-900 dark:text-purple-300">
                      <Activity className="w-5 h-5" />
                      Focus & Concentration
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-7">
                      <li>• Difficulty maintaining attention</li>
                      <li>• Easily distracted by thoughts or environment</li>
                      <li>• Mental fatigue during tasks</li>
                      <li>• Reduced ability to multitask</li>
                      <li>• Slower information processing</li>
                    </ul>
                  </div>

                  {/* Executive Function */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800" data-testid="card-decision-making">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-green-900 dark:text-green-300">
                      <Lightbulb className="w-5 h-5" />
                      Decision-Making & Planning
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-7">
                      <li>• Decision fatigue and indecisiveness</li>
                      <li>• Difficulty organizing complex tasks</li>
                      <li>• Reduced mental flexibility</li>
                      <li>• Challenges with problem-solving</li>
                      <li>• Feeling mentally "slower"</li>
                    </ul>
                  </div>

                </div>

                <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>Reassurance:</strong> These cognitive changes are typically temporary. Research shows that cognitive function stabilizes after menopause. Brain fog is not early dementia—it's a hormonal symptom that improves with targeted strategies.
                  </p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Common Problems Section */}
        <Card className="mb-8" data-testid="card-common-problems">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl">Most Common Problems During Perimenopause</CardTitle>
            </div>
            <CardDescription>
              Understanding the interconnected challenges women face during this transition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Physical Health Challenges</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Battery className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Persistent Fatigue:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Exhaustion despite adequate sleep, often worsened by sleep disruptions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Hot Flashes & Night Sweats:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Affecting 75% of perimenopausal women, often disrupting daily activities and sleep</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Sleep Disturbances:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty falling asleep, staying asleep, or non-restorative sleep</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Weight Gain & Body Changes:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Metabolic slowdown and redistribution of fat to the abdomen</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Emotional & Mental Challenges</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Brain Fog:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Memory lapses, difficulty concentrating, and mental clarity issues</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Mood Volatility:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Unpredictable mood swings, irritability, and emotional sensitivity</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Anxiety & Worry:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">New or intensified anxiety, including panic attacks and racing thoughts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Loss of Confidence:</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Self-doubt, identity questioning, and reduced self-esteem</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-300">The Ripple Effect</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                These symptoms don't occur in isolation—they create a cascade effect. Poor sleep worsens brain fog and mood. Anxiety intensifies hot flashes. Fatigue reduces motivation for healthy habits. Understanding these connections helps you address root causes rather than just symptoms.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Coping Strategies Section */}
        <Card className="mb-8" data-testid="card-coping-strategies">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Evidence-Based Coping Strategies</CardTitle>
            </div>
            <CardDescription>
              Practical, science-backed approaches to manage perimenopause symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Lifestyle Strategies */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                Lifestyle & Self-Care
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800" data-testid="card-nutrition-diet">
                  <h4 className="font-semibold mb-3 text-green-900 dark:text-green-300">Nutrition & Diet</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Prioritize protein (supports muscle mass and satiety)</li>
                    <li>• Include healthy fats (omega-3s for brain health)</li>
                    <li>• Eat phytoestrogen-rich foods (flax, soy, legumes)</li>
                    <li>• Reduce caffeine and alcohol (triggers for hot flashes)</li>
                    <li>• Stay hydrated (8+ glasses of water daily)</li>
                    <li>• Limit processed foods and added sugars</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="card-exercise-movement">
                  <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">Exercise & Movement Overview</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• <strong>Strength training:</strong> 2-3x/week to maintain muscle mass and bone density</li>
                    <li>• <strong>Cardiovascular exercise:</strong> 150 min/week moderate activity</li>
                    <li>• <strong>Yoga or Pilates:</strong> Improves flexibility and stress</li>
                    <li>• <strong>Daily walking:</strong> 30+ minutes for mood and metabolism</li>
                    <li>• <strong>Balance exercises:</strong> Prevent falls and bone loss risks</li>
                  </ul>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-3 italic">See specialized exercises below for bone density and pelvic floor health</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800" data-testid="card-sleep-hygiene">
                  <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-300">Sleep Hygiene</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Maintain consistent sleep/wake times</li>
                    <li>• Keep bedroom cool (60-67°F / 15-19°C)</li>
                    <li>• Use breathable bedding and moisture-wicking sleepwear</li>
                    <li>• Limit screen time 1 hour before bed</li>
                    <li>• Try relaxation techniques (meditation, deep breathing)</li>
                    <li>• Avoid large meals 2-3 hours before sleep</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800" data-testid="card-stress-management">
                  <h4 className="font-semibold mb-3 text-orange-900 dark:text-orange-300">Stress Management</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• <strong>Mindfulness meditation:</strong> 10-20 min daily</li>
                    <li>• <strong>Deep breathing:</strong> Activates parasympathetic nervous system</li>
                    <li>• <strong>Journaling:</strong> Process emotions and track patterns</li>
                    <li>• <strong>Social connection:</strong> Talk with supportive friends</li>
                    <li>• <strong>Boundaries:</strong> Learn to say no and prioritize self-care</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Specialized Exercise Programs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Specialized Exercises for Perimenopausal Women
              </h3>
              
              {/* Bone Density Exercises */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800" data-testid="card-bone-density-exercises">
                <h4 className="font-semibold text-lg mb-3 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Bone Density & Osteoporosis Prevention Exercises
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Declining estrogen accelerates bone loss during perimenopause. Weight-bearing and resistance exercises are crucial for maintaining bone density and preventing osteoporosis. Aim for 30-45 minutes, 4-5 times per week.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Weight-Bearing Impact Exercises</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">These create stress on bones, stimulating bone formation</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Brisk walking or hiking:</strong> 30-45 min, 4-5x/week with varied terrain or inclines</li>
                      <li>• <strong>Jogging or running:</strong> If joints allow; start gradually with walk-jog intervals</li>
                      <li>• <strong>Stair climbing:</strong> Use actual stairs or stair-stepper machines</li>
                      <li>• <strong>Dancing:</strong> Zumba, ballroom, or any upbeat dance style</li>
                      <li>• <strong>Tennis or pickleball:</strong> Racquet sports with direction changes</li>
                      <li>• <strong>Jump rope or jumping jacks:</strong> Low-impact jumps if appropriate for fitness level</li>
                    </ul>
                  </div>

                  <div className="border-t border-indigo-200 dark:border-indigo-700 pt-4">
                    <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Resistance Training for Bone Strength</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Build muscle and stimulate bone growth; 2-3x/week</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Squats and lunges:</strong> 3 sets of 10-15 reps (targets hips, spine, legs)</li>
                      <li>• <strong>Deadlifts:</strong> With appropriate weight; strengthens spine and hips</li>
                      <li>• <strong>Step-ups:</strong> Use a sturdy bench; 3 sets of 12 reps per leg</li>
                      <li>• <strong>Overhead press:</strong> With dumbbells or resistance bands; strengthens shoulders and spine</li>
                      <li>• <strong>Chest press:</strong> Protects against spinal fractures</li>
                      <li>• <strong>Bent-over rows:</strong> Strengthens back and improves posture</li>
                      <li>• <strong>Bicep curls and tricep extensions:</strong> Maintains arm bone density</li>
                      <li>• <strong>Plank variations:</strong> Core strength protects spine</li>
                    </ul>
                  </div>

                  <div className="border-t border-indigo-200 dark:border-indigo-700 pt-4">
                    <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Balance & Posture Exercises</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Prevent falls that can cause fractures</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Single-leg stands:</strong> Hold for 30 seconds each leg, progress to eyes closed</li>
                      <li>• <strong>Heel-to-toe walk:</strong> Walk in a straight line, placing heel directly in front of toes</li>
                      <li>• <strong>Tai Chi:</strong> Gentle movements that improve balance and bone health</li>
                      <li>• <strong>Yoga tree pose:</strong> Balance on one leg with hands in prayer position</li>
                      <li>• <strong>Standing on one leg while doing tasks:</strong> Brushing teeth, washing dishes</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-lg mt-4">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <strong>Important Tips:</strong> Start slowly if new to exercise. Work with a physical therapist or certified trainer to ensure proper form. Get a bone density scan (DEXA) to establish baseline. Add calcium (1200mg/day) and vitamin D (800-1000 IU/day) supplementation as recommended by your doctor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pelvic Floor Exercises */}
              <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800" data-testid="card-pelvic-floor-exercises">
                <h4 className="font-semibold text-lg mb-3 text-pink-900 dark:text-pink-300 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Pelvic Floor Exercises: Kegels & Beyond
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Declining estrogen weakens pelvic floor muscles, leading to urinary incontinence, pelvic organ prolapse, and reduced sexual function. Consistent pelvic floor exercises can prevent and improve these conditions. Practice daily for best results.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Basic Kegel Exercises</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Strengthen the muscles that support bladder, uterus, and rectum</p>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <p className="font-semibold mb-1">How to Find Your Pelvic Floor Muscles:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Stop urination midstream—those are your pelvic floor muscles (only do this to identify, not as regular practice)</li>
                          <li>• Or imagine you're trying to hold in gas—you'll feel the muscles tighten</li>
                          <li>• You should feel a lifting sensation internally, not tightening of buttocks or thighs</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold mb-1">Basic Kegel Technique:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• <strong>Contract:</strong> Tighten pelvic floor muscles and hold for 5 seconds</li>
                          <li>• <strong>Relax:</strong> Release for 5 seconds</li>
                          <li>• <strong>Repeat:</strong> 10 times per set, 3 sets daily</li>
                          <li>• <strong>Progress:</strong> Gradually increase hold time to 10 seconds as you get stronger</li>
                          <li>• <strong>Breathe normally:</strong> Don't hold your breath</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-pink-200 dark:border-pink-700 pt-4">
                    <h5 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Advanced Pelvic Floor Exercises</h5>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Quick flicks:</strong> Rapid contract-release (1 second each) for 10 reps; improves muscle response</li>
                      <li>• <strong>Elevator Kegels:</strong> Contract in stages (floor 1, 2, 3) gradually tightening more, then release in stages</li>
                      <li>• <strong>Bridge pose with Kegel:</strong> Lie on back, knees bent, lift hips while contracting pelvic floor; hold 10 seconds</li>
                      <li>• <strong>Squats with Kegel:</strong> At the bottom of a squat, contract pelvic floor before rising</li>
                      <li>• <strong>Wall sits with Kegel:</strong> Hold wall sit position while doing Kegel contractions</li>
                    </ul>
                  </div>

                  <div className="border-t border-pink-200 dark:border-pink-700 pt-4">
                    <h5 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Functional Pelvic Floor Training</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Practice in real-life scenarios</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Pre-emptive contractions:</strong> Tighten pelvic floor BEFORE coughing, sneezing, or lifting</li>
                      <li>• <strong>During standing activities:</strong> Practice Kegels while washing dishes or waiting in line</li>
                      <li>• <strong>Posture awareness:</strong> Maintain good posture to support pelvic floor function</li>
                      <li>• <strong>Deep core engagement:</strong> Coordinate pelvic floor with deep abdominal breathing</li>
                    </ul>
                  </div>

                  <div className="border-t border-pink-200 dark:border-pink-700 pt-4">
                    <h5 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Additional Supports for Incontinence & Prolapse</h5>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>• <strong>Maintain healthy weight:</strong> Reduces pressure on pelvic floor</li>
                      <li>• <strong>Avoid constipation:</strong> Straining weakens pelvic muscles; eat fiber-rich foods</li>
                      <li>• <strong>Limit heavy lifting:</strong> Use proper technique and engage core when necessary</li>
                      <li>• <strong>Avoid high-impact if severe prolapse:</strong> Consult a pelvic floor physical therapist</li>
                      <li>• <strong>Pelvic floor physical therapy:</strong> Specialized PT can provide biofeedback and personalized exercises</li>
                      <li>• <strong>Pessary devices:</strong> Medical devices that support prolapsed organs (fitted by doctor)</li>
                      <li>• <strong>Vaginal estrogen:</strong> Can improve tissue strength and reduce urinary symptoms</li>
                    </ul>
                  </div>

                  <div className="bg-pink-100 dark:bg-pink-900/40 p-4 rounded-lg mt-4">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <strong>Important:</strong> If you experience pain, worsening symptoms, or can't identify your pelvic floor muscles, consult a pelvic floor physical therapist. They can assess your specific needs and create a personalized program. Results typically appear within 4-6 weeks of consistent daily practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mind-Body Practices */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Mind-Body & Cognitive Support
              </h3>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-lg space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300">Cognitive-Behavioral Therapy (CBT)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Evidence shows CBT effectively reduces hot flashes, improves mood, and helps manage anxiety during perimenopause. It teaches you to identify and reframe unhelpful thought patterns.
                </p>
              </div>

              <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-lg space-y-3">
                <h4 className="font-semibold text-purple-900 dark:text-purple-300">Mindfulness-Based Stress Reduction (MBSR)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Regular mindfulness practice reduces stress hormones, improves emotional regulation, and helps you respond rather than react to perimenopausal symptoms.
                </p>
              </div>

              <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-lg space-y-3">
                <h4 className="font-semibold text-green-900 dark:text-green-300">Brain Training for Cognitive Symptoms</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Use memory aids (lists, phone reminders, calendars)</li>
                  <li>• Practice single-tasking instead of multitasking</li>
                  <li>• Engage in mentally stimulating activities (puzzles, reading)</li>
                  <li>• Prioritize tasks during peak mental clarity times</li>
                  <li>• Take regular breaks to prevent mental fatigue</li>
                </ul>
              </div>
            </div>

            {/* Medical & Professional Support */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Medical & Professional Support
              </h3>
              
              <div className="space-y-3">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-lg border border-rose-200 dark:border-rose-800">
                  <h4 className="font-semibold mb-2 text-rose-900 dark:text-rose-300">Hormone Therapy (HT)</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    For many women, hormone therapy effectively relieves hot flashes, night sweats, and mood symptoms. Discuss benefits and risks with your doctor.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    Best when started within 10 years of menopause onset or before age 60.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">Non-Hormonal Medications</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• SSRIs/SNRIs for mood and hot flashes</li>
                    <li>• Gabapentin for night sweats</li>
                    <li>• Cognitive enhancers if appropriate</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-300">Complementary Approaches</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Acupuncture (may reduce hot flashes)</li>
                    <li>• Supplements: Vitamin D, Magnesium, Omega-3s (consult doctor first)</li>
                    <li>• Black cohosh or evening primrose oil (limited evidence)</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold mb-2 text-green-900 dark:text-green-300">Therapy & Counseling</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Working with a therapist specializing in women's health or midlife transitions can provide invaluable support for emotional challenges, identity shifts, and relationship changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Reminder */}
            <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-lg border-l-4 border-purple-600">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                When to Seek Professional Help
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Symptoms severely impacting quality of life or daily functioning</li>
                <li>• Persistent depression, anxiety, or suicidal thoughts</li>
                <li>• Unmanaged heavy or irregular bleeding</li>
                <li>• Severe sleep disruption lasting more than a few weeks</li>
                <li>• Concerns about cognitive changes (rule out other causes)</li>
              </ul>
            </div>

          </CardContent>
        </Card>

        {/* Closing Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 rounded-lg text-center">
          <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            You're Not Alone in This Journey
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Perimenopause is a significant life transition, but it doesn't have to be overwhelming. With the right knowledge, support, and strategies, you can navigate this phase with confidence and emerge stronger. Remember: these changes are temporary, manageable, and a natural part of life's evolution.
          </p>
          <p className="mt-4 text-purple-700 dark:text-purple-300 font-medium">
            The BloomAfter40 program is designed to support you every step of the way.
          </p>
        </div>

      </div>
    </div>
  );
}
