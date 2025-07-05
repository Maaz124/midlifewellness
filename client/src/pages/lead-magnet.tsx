import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  CheckCircle, 
  Clock, 
  Star,
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  Mail,
  FileText,
  Play
} from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { ThriveMidlifeLogo } from '@/components/ui/logo';

export default function LeadMagnet() {
  // SEO optimization
  useSEO({
    title: "Free 5-Day Hormone Reset Guide - ThriveMidlife",
    description: "Download your free hormone reset guide with daily action steps to balance your hormones naturally. Includes meal plans, sleep strategies, and stress management techniques.",
    keywords: "free hormone reset guide, hormone balance, perimenopause guide, women's health, natural hormone balance"
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 47,
    seconds: 30
  });

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <ThriveMidlifeLogo size="md" className="mx-auto mb-4" />
          <Badge className="bg-green-100 text-green-800 mb-4">
            ✓ EMAIL CONFIRMED - ACCESS GRANTED
          </Badge>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Your Free Guide is Ready! 🎁
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Download the complete "5-Day Hormone Reset Guide" and start transforming your health today.
            </p>
          </div>

          {/* Urgency Timer */}
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-xl font-semibold text-red-800">Limited Time Bonus Access</h3>
              </div>
              <div className="flex justify-center space-x-4 text-2xl font-bold text-red-600 mb-4">
                <div className="bg-white rounded px-3 py-2">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <div className="text-xs text-gray-500">HOURS</div>
                </div>
                <div className="self-center">:</div>
                <div className="bg-white rounded px-3 py-2">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <div className="text-xs text-gray-500">MINS</div>
                </div>
                <div className="self-center">:</div>
                <div className="bg-white rounded px-3 py-2">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <div className="text-xs text-gray-500">SECS</div>
                </div>
              </div>
              <p className="text-red-700">
                Bonus: Free access to our premium assessment expires in {timeLeft.hours} hours!
              </p>
            </CardContent>
          </Card>

          {/* Download Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Guide Preview */}
            <Card className="border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  Your Complete Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Day 1:</strong> Hormone-Balancing Foods & Shopping List</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Day 2:</strong> Sleep Optimization Protocol</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Day 3:</strong> Stress-Busting Techniques</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Day 4:</strong> Movement & Exercise Guidelines</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span><strong>Day 5:</strong> Long-term Hormone Health Plan</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 mb-4">
                    <Download className="mr-2 h-5 w-5" />
                    Download Your Guide (PDF)
                  </Button>
                  <p className="text-sm text-gray-500">47 pages • Instant download • No ads</p>
                </div>
              </CardContent>
            </Card>

            {/* Bonus Content */}
            <Card className="border-gold-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Exclusive Bonuses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Play className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold">Guided Meditation Audio</h4>
                    </div>
                    <p className="text-sm text-gray-600">15-minute hormone harmony meditation</p>
                    <Badge className="mt-2">Value: $27</Badge>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Heart className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-semibold">Quick Start Checklist</h4>
                    </div>
                    <p className="text-sm text-gray-600">Daily action items for immediate results</p>
                    <Badge className="mt-2">Value: $17</Badge>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Brain className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold">Premium Assessment Access</h4>
                    </div>
                    <p className="text-sm text-gray-600">Comprehensive wellness evaluation</p>
                    <Badge className="mt-2">Value: $97</Badge>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    Total Value: $141
                  </div>
                  <div className="text-lg text-gray-600">
                    Your Price: <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="border-blue-200 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Download & Read</h3>
                  <p className="text-sm text-gray-600">Get your guide and start with Day 1 today</p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Take Assessment</h3>
                  <p className="text-sm text-gray-600">Get your personalized wellness scores</p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Get Support</h3>
                  <p className="text-sm text-gray-600">Join our community and coaching program</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card className="border-green-200 bg-green-50 mb-8">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "This guide changed everything for me! I finally understand what my body needs during perimenopause. The sleep tips alone were worth gold!"
              </blockquote>
              <p className="font-semibold">- Jennifer K., Age 48</p>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                Start Your Assessment Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            
            <p className="text-gray-600">
              Ready to take the next step? Get your personalized wellness roadmap.
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span>Check your email for more tips</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>No spam, ever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}