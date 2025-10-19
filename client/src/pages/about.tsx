import { AboutDoctor } from '@/components/about-doctor';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Meet Your Wellness Expert</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the comprehensive medical expertise and transformational approach behind BloomAfter40's 
          evidence-based wellness methodology.
        </p>
      </div>
      
      <AboutDoctor />
    </div>
  );
}