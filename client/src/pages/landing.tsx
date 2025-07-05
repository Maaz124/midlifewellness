import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Brain, 
  Target, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Users, 
  Award,
  Clock,
  Shield,
  Sparkles,
  Mail,
  Gift,
  Download
} from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ThriveMidlifeLogo } from '@/components/ui/logo';

export default function Landing() {
  // SEO optimization for landing page
  useSEO({
    title: "Free Midlife Wellness Assessment - ThriveMidlife",
    description: "Transform your midlife journey with our free wellness assessment. Get personalized insights for hormone balance, mental clarity, and stress management. Start your transformation today.",
    keywords: "free midlife assessment, perimenopause test, hormone balance quiz, women's health evaluation, midlife wellness, stress management assessment"
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadMagnetClaimed, setLeadMagnetClaimed] = useState(false);
  const { toast } = useToast();

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Capture lead and send welcome sequence
      await apiRequest('POST', '/api/capture-lead', {
        email,
        source: 'landing_page',
        leadMagnet: 'free_assessment'
      });

      setLeadMagnetClaimed(true);
      toast({
        title: "Welcome to ThriveMidlife!",
        description: "Check your email for your free wellness guide and assessment access.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (leadMagnetClaimed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Your Transformation Journey!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Check your email for your free "Midlife Wellness Starter Guide" and exclusive assessment access.
            </p>
            
            <Card className="border-purple-200 shadow-lg mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">What's Coming Your Way:</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 text-purple-600 mr-3" />
                    <span>Free "5-Day Hormone Reset Guide" (PDF)</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-3" />
                    <span>Exclusive access to our comprehensive wellness assessment</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-purple-600 mr-3" />
                    <span>Weekly wellness tips and transformation insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
                  Start Your Free Assessment Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                No credit card required • Completely free • Takes 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <ThriveMidlifeLogo size="lg" className="mx-auto mb-8" />
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            FREE WELLNESS ASSESSMENT
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Transform Your <span className="text-purple-600">Midlife Journey</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Feeling overwhelmed by hormonal changes, brain fog, or stress? You're not alone. 
            Get your personalized wellness roadmap with our free assessment designed specifically for midlife women.
          </p>
        </div>

        {/* Lead Capture Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-purple-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">
                Get Your FREE Midlife Wellness Assessment
              </CardTitle>
              <p className="opacity-90">Plus: "5-Day Hormone Reset Guide" (Worth $47)</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLeadCapture} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-lg h-14"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-purple-600 hover:bg-purple-700 h-14 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Get My FREE Assessment + Guide'}
                  <Download className="ml-2 h-6 w-6" />
                </Button>
              </form>
              
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-4">Trusted by over 5,000 midlife women</p>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-800">
            "Finally, someone who understands what I'm going through!"
          </p>
          <p className="text-gray-600">- Sarah M., Age 47</p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Hormone Balance</h3>
              <p className="text-gray-600">
                Understand your hormonal changes and get personalized strategies for balance and vitality.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mental Clarity</h3>
              <p className="text-gray-600">
                Clear brain fog and regain sharp focus with evidence-based cognitive wellness strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Stress Management</h3>
              <p className="text-gray-600">
                Learn nervous system regulation techniques to manage overwhelm and find your calm.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Preview */}
        <Card className="mb-16 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gray-800">
              What You'll Discover in Your Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Mental Health Score</h4>
                    <p className="text-gray-600">Mood, anxiety, and sleep quality assessment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Physical Wellness Score</h4>
                    <p className="text-gray-600">Energy levels and hormonal health indicators</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Cognitive Function Score</h4>
                    <p className="text-gray-600">Memory, focus, and mental clarity evaluation</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Sparkles className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Personalized Recommendations</h4>
                    <p className="text-gray-600">Tailored action plan for your unique needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Progress Tracking</h4>
                    <p className="text-gray-600">Monitor your transformation journey over time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Community Access</h4>
                    <p className="text-gray-600">Connect with like-minded midlife women</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgency and CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                Ready to Transform Your Midlife Experience?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of women who've already started their journey to vibrant midlife wellness.
              </p>
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-lg px-8"
                onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start My Free Assessment Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Takes only 5 minutes • Results instantly available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}