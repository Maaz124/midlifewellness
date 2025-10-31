import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavHeader } from "@/components/nav-header";
import { Footer } from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import Coaching from "@/pages/coaching";
import Journal from "@/pages/journal-new";
import Progress from "@/pages/progress";
import Community from "@/pages/community";
import About from "@/pages/about";
import ProfileSettings from "@/pages/profile";
import Checkout from "@/pages/checkout";
import ResourceCheckout from "@/pages/resource-checkout";
import ContactCoaching from "@/pages/contact-coaching";
import EmailSignatures from "@/pages/email-signatures";
import PerimenopauseEducation from "@/pages/perimenopause-education";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import MedicalDisclaimer from "@/pages/medical-disclaimer";
import Accessibility from "@/pages/accessibility";
import Register from "@/pages/register";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/coaching" component={Coaching} />
          <Route path="/journal" component={Journal} />
          <Route path="/progress" component={Progress} />
          <Route path="/perimenopause-guide" component={PerimenopauseEducation} />
          <Route path="/community" component={Community} />
          <Route path="/about" component={About} />
          <Route path="/profile" component={ProfileSettings} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/resource-checkout" component={ResourceCheckout} />
          <Route path="/contact-coaching" component={ContactCoaching} />
          <Route path="/email-signatures" component={EmailSignatures} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/medical-disclaimer" component={MedicalDisclaimer} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
