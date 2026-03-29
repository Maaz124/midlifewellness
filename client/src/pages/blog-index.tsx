import { blogPosts } from "@/lib/blog-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import LeadCapture from "@/components/marketing/LeadCapture";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                Expert Insights & Stories
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                The Wellness <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Journal
                </span>
              </h1>
              <p className="text-gray-600 text-lg mb-0 max-w-lg leading-relaxed">
                Science-backed advice, personal transformation stories, and expert guidance to help you navigate midlife and menopause with confidence.
              </p>
            </div>
            <div className="relative min-h-[300px] lg:min-h-full">
              <img 
                src="/images/blog/midlife_weight_gain.png" 
                alt="Smiling woman in a wellness-focused kitchen" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden block" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="cursor-pointer hover:shadow-2xl transition-all h-full border-none group bg-white overflow-hidden flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  <CardTitle className="text-2xl font-serif line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 line-clamp-3 italic">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 text-purple-600 hover:text-purple-700 hover:bg-transparent group/btn">
                    Read Story <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Lead Capture in Blog Index */}
        <section className="mt-20">
          <LeadCapture 
            title="Download Our Ultimate Hormone Health Checklist" 
            subtitle="Get started today with the exact rituals our patients use to restore balance in midlife."
          />
        </section>
      </div>
    </div>
  );
}
