import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Star, Quote, Award, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    age: "48",
    content: "I finally feel like myself again. After 2 years of mood swings and weight gain, Dr. Bukhari's program helped me reclaim my life in just 6 weeks.",
    image: "https://i.pravatar.cc/100?u=sarah"
  },
  {
    name: "Elena R.",
    age: "52",
    content: "The hormone balance guide was eye-opening. I didn't realize how much my diet was affecting my sleep. This program is a must for any woman over 40.",
    image: "https://i.pravatar.cc/100?u=elena"
  },
  {
    name: "Jennifer L.",
    age: "45",
    content: "Simple, science-backed, and effective. The brain fog has lifted and I have energy I haven't felt since my 30s!",
    image: "https://i.pravatar.cc/100?u=jen"
  }
];

const credentials = [
  { icon: Award, label: "Board Certified Physician", detail: "Internal Medicine & Wellness" },
  { icon: HeartPulse, label: "Hormone Specialist", detail: "Advanced Metabolic Training" },
  { icon: ShieldCheck, label: "Evidence-Based", detail: "Root Cause Resolution" }
];

export default function TrustSignals() {
  return (
    <div className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        {/* Credentials Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Expertise You Can Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((item, index) => (
              <motion.div 
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-gray-500 text-sm">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                <CardContent className="p-8 relative">
                  <Quote className="absolute top-4 right-4 text-purple-100 w-12 h-12" />
                  <div className="flex items-center gap-1 mb-6 text-orange-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-600 italic mb-8 relative z-10">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} className="w-12 h-12 rounded-full ring-2 ring-purple-100" alt={t.name} />
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-1">
                        {t.name} <BadgeCheck className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-xs text-gray-500">Age {t.age} • Verified Patient</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transformation Section */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[2rem] p-12 text-white overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Path to Progress</h2>
              <p className="text-purple-100 text-lg mb-8 leading-relaxed">
                "Midlife is not the beginning of the end, but the start of your most powerful chapter. We don't just treat symptoms; we restore the foundation of your health."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ef197ec2?auto=format&fit=crop&q=80&w=200" alt="Dr. Sidra Bukhari" />
                </div>
                <div>
                  <div className="font-bold text-xl leading-none">Dr. Sidra Bukhari</div>
                  <div className="text-purple-300 text-sm">Founder & Medical Director</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
                  <div className="text-4xl font-bold text-purple-300 mb-1">92%</div>
                  <div className="text-xs uppercase tracking-widest text-purple-200">Energy Increase</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
                  <div className="text-4xl font-bold text-pink-300 mb-1">85%</div>
                  <div className="text-xs uppercase tracking-widest text-pink-200">Better Sleep</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
                  <div className="text-4xl font-bold text-orange-300 mb-1">Join</div>
                  <div className="text-xs uppercase tracking-widest text-orange-200">3k+ Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
                  <div className="text-4xl font-bold text-blue-300 mb-1">Dr. S</div>
                  <div className="text-xs uppercase tracking-widest text-blue-200">Expert Care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
