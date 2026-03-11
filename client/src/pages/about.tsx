import { AboutDoctor } from '@/components/about-doctor';
import TrustSignals from '@/components/marketing/TrustSignals';
import LeadCapture from '@/components/marketing/LeadCapture';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-20">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Meet Your Wellness Expert</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover the comprehensive medical expertise and transformational approach behind MidlifeRebalance's 
          evidence-based wellness methodology.
        </p>
      </div>
      
      <section>
        <AboutDoctor />
      </section>

      <section className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <TrustSignals />
      </section>

      <section className="container mx-auto px-4">
        <LeadCapture 
          title="Ready to Start Your Transformation?" 
          subtitle="Download Dr. Bukhari's signature Midlife Wellness Roadmap and take the first step toward reclaiming your vibrant health today."
        />
      </section>
    </div>
  );
}