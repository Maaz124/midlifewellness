import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Brain, Heart, Target } from 'lucide-react';
import { useLocation } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const publicKey = (import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined) || undefined;
const stripePromise = publicKey ? loadStripe(publicKey) : null;

const CheckoutForm = () => {
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
        // Confirm payment success with backend
        await apiRequest('POST', '/api/payment-success', {
          paymentIntentId: paymentIntent.id,
          amount: 97
        });
        
        // Store payment success in localStorage
        localStorage.setItem('coachingAccess', 'true');
        
        toast({
          title: "Payment Successful!",
          description: "Welcome to the Mind-Body Reset program. A confirmation email has been sent.",
        });
        
        setLocation('/coaching?payment=success');
      } catch (emailError) {
        // Payment succeeded but email failed - still grant access
        localStorage.setItem('coachingAccess', 'true');
        
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isProcessing ? 'Processing...' : 'Complete Purchase - $97'}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Skip creating PaymentIntent if Stripe is not configured in dev
    if (!publicKey) {
      return;
    }
    apiRequest("POST", "/api/create-payment-intent", { amount: 97 })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment Intent Error:', error);
        setLocation('/coaching?error=payment_setup');
      });
  }, []);

  if (!publicKey) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Payments Not Configured</h1>
          <p className="text-gray-600">Add <code>VITE_STRIPE_PUBLIC_KEY</code> to your .env to enable checkout.</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Setting Up Your Payment</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
            <p className="text-gray-600">Preparing secure checkout...</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Having trouble?</strong> Try refreshing the page or contact support at coaching@bloomafter40.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Complete Your BloomAfter40 Journey
        </h1>
        <p className="text-xl text-gray-600">
          Secure your access to the complete 6-week Mind-Body Reset coaching program
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Program Benefits */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              What You're Getting
            </CardTitle>
            <CardDescription>
              Complete access to Dr. Sidra Bukhari's transformational program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">6-Week Structured Program</p>
                <p className="text-sm text-gray-600">24 interactive components with expert guidance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold">CBT & NLP Techniques</p>
                <p className="text-sm text-gray-600">Evidence-based therapeutic approaches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Hormone & Nervous System Focus</p>
                <p className="text-sm text-gray-600">Specialized for midlife women's wellness</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-semibold">Lifetime Access</p>
                <p className="text-sm text-gray-600">Revisit content whenever you need</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/70 rounded-lg">
              <p className="text-center text-lg font-bold text-purple-700">
                One-Time Payment: $97
              </p>
              <p className="text-center text-sm text-gray-600 mt-1">
                (Regular value: $297)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Secure Payment</CardTitle>
            <CardDescription>
              Your payment is secured by Stripe. Health Assessment dashboard remains free.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>30-day money-back guarantee • Secure payment via Stripe</p>
        <p>Health Assessment tools remain completely free</p>
      </div>
    </div>
  );
};