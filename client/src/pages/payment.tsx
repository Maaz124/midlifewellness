import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Brain, HeartPulse, Target, ShieldCheck, Gift, LogIn } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import TrustSignals from '@/components/marketing/TrustSignals';

const CheckoutForm = ({ price }: { price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await apiRequest('POST', '/api/payment-success', {
          paymentIntentId: paymentIntent.id,
          amount: price
        });
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        queryClient.setQueryData(["/api/auth/user"], (old: any) => 
          old ? { ...old, hasCoachingAccess: true } : old
        );
        
        localStorage.setItem('coachingAccess', 'true');
        
        toast({
          title: "Welcome to Mind-Body Reset! 🎉",
          description: "Your payment was successful. A confirmation email has been sent.",
        });
        
        setLocation('/coaching?payment=success');
      } catch (emailError) {
        localStorage.setItem('coachingAccess', 'true');
        queryClient.setQueryData(["/api/auth/user"], (old: any) => 
          old ? { ...old, hasCoachingAccess: true } : old
        );
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        toast({
          title: "Payment Successful!",
          description: "Welcome to the Mind-Body Reset program.",
        });
        
        setLocation('/coaching?payment=success');
      }
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Complete Purchase • $${price.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default function Payment() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isClaimingFree, setIsClaimingFree] = useState(false);

  // Fetch Stripe publishable key from API
  const { data: stripeKeyData, isLoading: isLoadingStripeKey } = useQuery({
    queryKey: ['/api/stripe-public-key'],
    queryFn: async () => {
      const res = await fetch('/api/stripe-public-key');
      return res.json();
    },
  });

  // Load Stripe when key is available
  useEffect(() => {
    if (stripeKeyData?.publishableKey) {
      setStripePromise(loadStripe(stripeKeyData.publishableKey));
    }
  }, [stripeKeyData?.publishableKey]);

  // Fetch coaching prices from database
  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['/api/coaching-price'],
    queryFn: async () => {
      const res = await fetch('/api/coaching-price');
      return res.json();
    },
  });
  
  const price = priceData?.currentPrice ?? 150;
  const regularPrice = priceData?.regularPrice ?? 297;
  const isFree = price === 0;

  useEffect(() => {
    if (priceLoading || isLoadingStripeKey || isFree || !user) {
      return;
    }
    
    if (!stripeKeyData?.publishableKey) {
      return;
    }
    
    apiRequest("POST", "/api/create-payment-intent", {})
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment Intent Error:', error);
        setLocation('/coaching?error=payment_setup');
      });
  }, [priceLoading, isLoadingStripeKey, stripeKeyData?.publishableKey, setLocation, isFree, user]);

  const handleClaimFreeAccess = async () => {
    setIsClaimingFree(true);
    try {
      await apiRequest('POST', '/api/claim-free-coaching', {});
      
      // Force update the cache to guarantee immediate UI unlock
      queryClient.setQueryData(["/api/auth/user"], (old: any) => 
        old ? { ...old, hasCoachingAccess: true } : old
      );
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      localStorage.setItem('coachingAccess', 'true');
      
      toast({
        title: "Welcome! 🎉",
        description: "Your free access has been granted. Let's begin your transformation.",
      });
      
      setLocation('/coaching?payment=success');
    } catch (error: any) {
      toast({
        title: "Error claiming access",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
      setIsClaimingFree(false);
    }
  };

  if (priceLoading || isLoadingStripeKey || isLoadingAuth) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full" />
        <p className="text-gray-500 animate-pulse font-medium">Preparing your secure checkout...</p>
      </div>
    );
  }

  if (!isFree && (!stripeKeyData?.publishableKey || !stripeKeyData?.configured)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <Card className="max-w-md w-full shadow-lg border-orange-200">
          <CardHeader className="bg-orange-50/50 rounded-t-xl pb-4">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Configuration Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-6">The payment system is currently being set up. Please try again shortly or contact support.</p>
            <Button variant="outline" onClick={() => setLocation('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && !isFree && !clientSecret) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
          <div className="animate-spin w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Initializing Secure Payment</h2>
        <p className="text-gray-500">Establishing a secure connection to Stripe...</p>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-indigo-500" />,
      title: "CBT & NLP Techniques",
      desc: "Reprogram limiting beliefs with evidence-based cognitive strategies."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
      title: "Hormone Harmony",
      desc: "Nurture your nervous system for optimal midlife hormonal balance."
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      title: "6-Week Action Plan",
      desc: "Step-by-step guidance to reclaim your energy and clarity."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
      title: "Lifetime Access",
      desc: "Revisit Dr. Sidra's transformational materials whenever you need."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] pb-24">
      {/* Decorative Background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-purple-100/50 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            MidlifeRebalance Premium Coaching
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
          >
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Mind-Body Reset</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Join Dr. Sidra Bukhari and unlock the holistic toolkit designed specifically for women mastering the midlife transition.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column - Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Unlock Immediately</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50/80 hover:bg-purple-50/50 transition-colors">
                    <div className="shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial / Credibility marker */}
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-indigo-200 shadow-sm overflow-hidden">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Secure & Confidential</h4>
                <p className="text-gray-600 text-sm mt-1">Your privacy and data security are our highest priorities. All payments are encrypted by Stripe.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            {isFree && (
              <div className="absolute -top-6 inset-x-0 mx-auto w-max z-20">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform cursor-default">
                  <Gift className="w-5 h-5" />
                  Limited Time Free Access
                </div>
              </div>
            )}
            
            <Card className={`overflow-hidden shadow-xl border-gray-200/60 backdrop-blur-xl bg-white/95 ${isFree ? 'border-orange-200 ring-4 ring-orange-500/20' : ''}`}>
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-500 mb-1">Order Summary</h3>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Coaching Program</h4>
                    <p className="text-sm text-gray-500 mt-1">Lifetime Access</p>
                  </div>
                  <div className="text-right">
                    {price < regularPrice && (
                      <span className="text-sm text-gray-400 line-through block mb-1">
                        ${regularPrice.toFixed(2)}
                      </span>
                    )}
                    <span className={`text-3xl font-extrabold ${isFree ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600' : 'text-gray-900'}`}>
                      {isFree ? 'FREE' : `$${price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                {!user ? (
                  <div className="py-2 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                      <LogIn className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h4>
                      <p className="text-gray-600 text-sm">Please create an account or sign in to complete your checkout and unlock your access.</p>
                    </div>
                    <div className="space-y-3 pt-4">
                      <Button 
                        className="w-full h-12 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md text-white"
                        onClick={() => setLocation('/register?redirect=/payment')}
                      >
                        Create Free Account
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-lg font-medium border-2 border-purple-200 hover:bg-purple-50 text-purple-700 bg-white"
                        onClick={() => setLocation('/login?redirect=/payment')}
                      >
                        Sign In to Existing Account
                      </Button>
                    </div>
                  </div>
                ) : isFree ? (
                  <div className="py-6 text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-10 h-10 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">You qualify for free access!</h4>
                      <p className="text-gray-600">Claim your lifetime access to the Mind-Body Reset program without entering any payment details.</p>
                    </div>
                    <Button 
                      onClick={handleClaimFreeAccess}
                      disabled={isClaimingFree}
                      className="w-full h-14 text-lg font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl"
                    >
                      {isClaimingFree ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Claiming Access...
                        </span>
                      ) : (
                        "Claim Free Access Now"
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
                      <span>Secure Checkout</span>
                      <div className="flex gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium">100% Secure</span>
                      </div>
                    </div>
                    {stripePromise && clientSecret && (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                        <CheckoutForm price={price} />
                      </Elements>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50/80 px-8 py-5 text-xs text-center text-gray-500 border-t border-gray-100">
                <p className="mx-auto">By completing your purchase, you agree to our Terms of Service. Need help? Contact coaching@midliferebalance.com</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Trust Signals Section */}
      <section className="mt-20">
        <TrustSignals />
      </section>
    </div>
  );
};