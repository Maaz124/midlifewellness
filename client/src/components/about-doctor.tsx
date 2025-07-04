import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, User, Award, BookOpen, Users } from 'lucide-react';

export function AboutDoctor() {
  const credentials = [
    { icon: Brain, label: "Psychiatrist", color: "bg-purple-100 text-purple-700" },
    { icon: User, label: "NLP Life Coach", color: "bg-blue-100 text-blue-700" },
    { icon: Heart, label: "Mindfulness Trainer", color: "bg-green-100 text-green-700" },
    { icon: BookOpen, label: "CBT Informed", color: "bg-amber-100 text-amber-700" },
    { icon: Award, label: "Gynecologist", color: "bg-rose-100 text-rose-700" }
  ];

  const expertise = [
    {
      title: "Holistic Women's Health",
      description: "Combining psychiatric expertise with gynecological knowledge to address the unique challenges women face during midlife transitions.",
      highlight: "Dual Medical Specialization"
    },
    {
      title: "Evidence-Based Therapy",
      description: "Integrating Cognitive Behavioral Therapy (CBT) principles with Neuro-Linguistic Programming for transformative mental health outcomes.",
      highlight: "CBT & NLP Integration"
    },
    {
      title: "Mindfulness & Wellness",
      description: "Certified mindfulness trainer helping clients develop sustainable practices for stress reduction and emotional regulation.",
      highlight: "Certified Training"
    },
    {
      title: "Real-World Experience",
      description: "Having worked with hundreds of clients across different medical specialties, bringing authentic understanding to every wellness journey.",
      highlight: "Clinical Experience"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-rose-600 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dr. Sidra Bukhari</h2>
          <p className="text-lg text-gray-600 font-medium">Psychiatrist • NLP Life Coach • Mindfulness Trainer</p>
        </div>

        {/* Credentials Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {credentials.map((cred, index) => (
            <Badge key={index} variant="secondary" className={`${cred.color} px-3 py-1 flex items-center gap-2`}>
              <cred.icon className="w-4 h-4" />
              {cred.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Personal Story */}
      <Card className="bg-gradient-to-br from-purple-50 to-rose-50 border-purple-200">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">A Journey of Healing & Transformation</h3>
          
          <div className="prose prose-lg text-gray-700 max-w-none space-y-4">
            <p className="text-center italic text-purple-700 font-medium">
              "True healing happens when we address the mind, body, and spirit as one interconnected system."
            </p>
            
            <p>
              My journey in medicine began with a deep calling to understand the complexities of human health from multiple perspectives. 
              As a <strong>dual-trained physician</strong> in both Psychiatry and Gynecology, I've had the unique privilege of witnessing 
              how mental and physical health intertwine, particularly in women's lives.
            </p>

            <p>
              Throughout my career, I've worked with <strong>hundreds of clients</strong> navigating the challenging waters of midlife 
              transitions, hormonal changes, and mental health struggles. What I discovered was profound: traditional medical approaches, 
              while essential, often missed the deeper emotional and psychological patterns that kept women stuck in cycles of stress, 
              anxiety, and burnout.
            </p>

            <p>
              This realization led me to expand beyond conventional medicine into the transformative worlds of 
              <strong>Neuro-Linguistic Programming (NLP)</strong> and <strong>mindfulness training</strong>. As a certified NLP life coach 
              and mindfulness trainer, I learned to help clients rewire limiting thought patterns and develop sustainable practices for 
              emotional regulation.
            </p>

            <p>
              My training in <strong>Cognitive Behavioral Therapy (CBT)</strong> bridges the gap between clinical psychology and practical 
              life coaching, allowing me to offer evidence-based techniques that create lasting change. Having worked in gynecology, 
              I understand the intimate connection between hormonal health and mental wellbeing—knowledge that proves invaluable when 
              supporting women through perimenopause and midlife transitions.
            </p>

            <p className="font-medium text-purple-800">
              ThriveMidlife represents the culmination of everything I've learned: a comprehensive approach that honors both the 
              science of medicine and the art of transformation. Every technique, every assessment, and every guided practice in 
              this program comes from real clinical experience and genuine understanding of what women need to thrive.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expertise Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {expertise.map((area, index) => (
          <Card key={index} className="wellness-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{area.title}</h4>
                    <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                      {area.highlight}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Philosophy Quote */}
      <Card className="bg-gradient-to-r from-purple-600 to-rose-600 text-white">
        <CardContent className="p-8 text-center">
          <blockquote className="text-xl font-medium mb-4">
            "Every woman deserves to feel empowered, balanced, and vibrant—regardless of age or life stage. 
            My mission is to provide the tools, insights, and support that make this transformation not just possible, but inevitable."
          </blockquote>
          <cite className="text-purple-200">— Dr. Sidra Bukhari</cite>
        </CardContent>
      </Card>
    </div>
  );
}

export default AboutDoctor;