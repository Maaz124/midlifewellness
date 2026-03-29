import { useRoute, Link } from "wouter";
import { blogPosts } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import LeadCapture from "@/components/marketing/LeadCapture";
import { usePageSEO } from "@/hooks/use-seo";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const post = blogPosts.find((p) => p.slug === params?.slug);

  // Set SEO tags
  usePageSEO(
    post ? `${post.title} | Midlife Wellness Journal` : "Post Not Found",
    post?.excerpt || "",
    post?.keywords.join(", ")
  );

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog">
          <Button variant="link">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 hover:bg-purple-50 hover:text-purple-600 transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Journal
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b pb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                SB
              </div>
              <span className="font-medium text-gray-900">{post.author}</span>
            </div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors">
              <Share2 className="w-4 h-4" /> Share Story
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
          <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
        </div>

        {/* Content */}
        <article 
          className="prose prose-purple lg:prose-xl mx-auto mb-20 prose-headings:font-serif prose-h2:text-3xl prose-h2:mt-12 prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Lead Capture in Post */}
        <div className="my-20 p-8 bg-purple-50 rounded-[2rem] border border-purple-100">
          <LeadCapture 
            title="Enjoying this article?" 
            subtitle="Sign up for Dr. Bukhari's weekly newsletter and get our 'Ultimate Hormone Reset' checklist for free."
          />
        </div>

        {/* Related/Next */}
        <div className="border-t pt-12 flex justify-between items-center text-sm text-gray-500 font-medium italic">
          <span>Targeting Keyword: {post.keywords[0]}</span>
          <Link href="/blog">
            <span className="cursor-pointer hover:text-purple-600">See all stories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
