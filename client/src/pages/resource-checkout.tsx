import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  resourceTitle: string;
  resourcePrice: number;
}

function CheckoutForm({ clientSecret, resourceTitle, resourcePrice }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/journal?payment_success=true`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Purchase Successful!",
        description: `${resourceTitle} has been added to your library.`,
      });
      setLocation('/journal');
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CreditCard className="w-5 h-5 mr-2" />
            Purchase Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Resource:</span>
              <span className="font-medium">{resourceTitle}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${resourcePrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button 
              type="submit" 
              disabled={!stripe || !elements || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Complete Purchase - $${resourcePrice.toFixed(2)}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResourceCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const resourceId = urlParams.get('resource_id');

    if (!paymentIntentId || !resourceId) {
      toast({
        title: "Error",
        description: "Invalid checkout parameters.",
        variant: "destructive",
      });
      setLocation('/journal');
      return;
    }

    // Get payment intent client secret and resource details
    Promise.all([
      apiRequest('GET', `/api/payment-intent/${paymentIntentId}`).then(res => res.json()),
      apiRequest('GET', `/api/resources/${resourceId}`).then(res => res.json())
    ]).then(([paymentData, resourceData]) => {
      setClientSecret(paymentData.clientSecret);
      setResource(resourceData);
      setLoading(false);
    }).catch(error => {
      console.error('Error loading checkout data:', error);
      toast({
        title: "Error",
        description: "Failed to load checkout information.",
        variant: "destructive",
      });
      setLocation('/journal');
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!clientSecret || !resource) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Unable to load checkout information.</p>
            <Button 
              onClick={() => setLocation('/journal')}
              className="mt-4"
            >
              Return to Journal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/journal')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journal
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Complete Your Purchase</h1>
        <p className="text-gray-600 mt-2">Secure checkout for your digital wellness resource</p>
      </div>

      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#9333ea',
            }
          }
        }}
      >
        <CheckoutForm 
          clientSecret={clientSecret}
          resourceTitle={resource.title}
          resourcePrice={resource.price}
        />
      </Elements>
    </div>
  );
}