import { blogPosts } from "@/lib/blog-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, User } from "lucide-react";
import LeadCapture from "@/components/marketing/LeadCapture";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-serif">Wellness Journal</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, science-backed advice, and community stories to support your midlife journey.
          </p>
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
