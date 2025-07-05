import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  Phone, 
  Mail, 
  MessageSquare, 
  Heart,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CoachingInquiry {
  name: string;
  email: string;
  phone: string;
  coachingType: 'group' | 'individual' | 'both';
  preferredSchedule: string;
  experience: string;
  goals: string;
  challenges: string;
  additionalInfo: string;
}

export default function ContactCoaching() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CoachingInquiry>({
    name: '',
    email: '',
    phone: '',
    coachingType: 'group',
    preferredSchedule: '',
    experience: '',
    goals: '',
    challenges: '',
    additionalInfo: ''
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: CoachingInquiry) => {
      return await apiRequest("POST", "/api/coaching-inquiry", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Thank you for your interest. Dr. Sidra will personally review your inquiry and respond within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        coachingType: 'group',
        preferredSchedule: '',
        experience: '',
        goals: '',
        challenges: '',
        additionalInfo: ''
      });
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your inquiry. Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.goals.trim()) {
      toast({
        title: "Please Complete Required Fields",
        description: "Name, email, and goals are required to submit your coaching inquiry.",
        variant: "destructive"
      });
      return;
    }
    submitInquiryMutation.mutate(formData);
  };

  const updateFormData = (field: keyof CoachingInquiry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Personal Coaching with Dr. Sidra Bukhari
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Midlife Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Take the next step in your wellness journey with personalized coaching designed specifically for women navigating midlife transitions.
          </p>
        </div>

        {/* Coaching Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle className="text-purple-900">Group Coaching</CardTitle>
                  <CardDescription>Supportive community-based sessions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Weekly 90-minute group sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Maximum 8 women per group
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Peer support and accountability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Access to exclusive resources
                </li>
              </ul>
              <Badge className="mt-4 bg-purple-100 text-purple-700">Starting at $197/month</Badge>
            </CardContent>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-pink-600" />
                <div>
                  <CardTitle className="text-pink-900">1:1 Coaching</CardTitle>
                  <CardDescription>Personalized individual sessions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  60-minute private sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Customized coaching plan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Direct access to Dr. Sidra
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Flexible scheduling options
                </li>
              </ul>
              <Badge className="mt-4 bg-pink-100 text-pink-700">Starting at $297/session</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              Request Personal Coaching
            </CardTitle>
            <CardDescription>
              Fill out this form to discuss your coaching needs with Dr. Sidra Bukhari. All inquiries receive a personal response within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="coachingType" className="text-sm font-medium text-gray-700">
                    Coaching Interest *
                  </Label>
                  <Select value={formData.coachingType} onValueChange={(value) => updateFormData('coachingType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select coaching type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Group Coaching</SelectItem>
                      <SelectItem value="individual">1:1 Individual Coaching</SelectItem>
                      <SelectItem value="both">Both Options (Let's Discuss)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="schedule" className="text-sm font-medium text-gray-700">
                  Preferred Schedule
                </Label>
                <Input
                  id="schedule"
                  value={formData.preferredSchedule}
                  onChange={(e) => updateFormData('preferredSchedule', e.target.value)}
                  placeholder="e.g., Tuesday evenings, Wednesday mornings, weekends"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Previous Coaching Experience
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  placeholder="Tell us about any previous coaching, therapy, or personal development work you've done..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="goals" className="text-sm font-medium text-gray-700">
                  Goals & Aspirations *
                </Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => updateFormData('goals', e.target.value)}
                  placeholder="What specific goals would you like to achieve through coaching? What changes do you want to see in your life?"
                  rows={4}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="challenges" className="text-sm font-medium text-gray-700">
                  Current Challenges
                </Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => updateFormData('challenges', e.target.value)}
                  placeholder="What are the main challenges or struggles you're facing right now?"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                  Additional Information
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Anything else you'd like Dr. Sidra to know about your situation or coaching needs..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                disabled={submitInquiryMutation.isPending}
              >
                {submitInquiryMutation.isPending ? (
                  "Submitting Your Inquiry..."
                ) : (
                  <>
                    Submit Coaching Inquiry
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">
              Dr. Sidra Bukhari personally reviews every coaching inquiry
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Your information is completely confidential and will only be used to assess coaching fit and respond to your inquiry. 
            We respect your privacy and will never share your details with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}