import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavHeader } from "@/components/nav-header";
import { Footer } from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import Coaching from "@/pages/coaching";
import Journal from "@/pages/journal";
import Progress from "@/pages/progress";
import Community from "@/pages/community";
import About from "@/pages/about";
import Checkout from "@/pages/checkout";
import ContactCoaching from "@/pages/contact-coaching";
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
          <Route path="/community" component={Community} />
          <Route path="/about" component={About} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/contact-coaching" component={ContactCoaching} />
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
