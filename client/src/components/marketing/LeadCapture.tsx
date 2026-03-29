import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Mail, CheckCircle, ArrowRight, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface LeadCaptureProps {
  variant?: "inline" | "popup" | "sidebar";
  title?: string;
  subtitle?: string;
}

export default function LeadCapture({ 
  variant = "inline", 
  title = "Unlock Your Midlife Wellness Guide",
  subtitle = "Get our exclusive 7-day hormone-balancing checklist and start feeling like yourself again."
}: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/leads", {
        email,
        firstName,
        source: "website_lead_capture",
        leadMagnet: "hormone_checklist"
      });
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your guide is on its way to your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-white w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Check Your Email!</h3>
        <p className="text-green-700">We've sent the Midlife Reset Guide to <strong>{email}</strong>.</p>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10 backdrop-blur-sm border border-white/20 shadow-2xl">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              <span>Limited Time Free Offer</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {subtitle}
            </p>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    alt="User profile"
                  />
                ))}
              </div>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-600" />
                <strong>3,000+ women</strong> already joined
              </span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">First Name</label>
                <Input 
                  placeholder="Your Name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/80 border-purple-100 focus:border-purple-300"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="email"
                    placeholder="name@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/80 border-purple-100 focus:border-purple-300"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-lg font-semibold shadow-lg group"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Me My Free Guide"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[10px] text-center text-gray-400 mt-4 leading-tight">
                We respect your privacy. Unsubscribe at any time. By signing up you agree to our terms.
              </p>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
