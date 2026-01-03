import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { useEffect } from "react";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });
  const { data: relatedPosts } = trpc.blog.list.useQuery(
    { published: true, category: post?.category },
    { enabled: !!post?.category }
  );

  // Filter out current post from related posts and limit to 3
  const filteredRelatedPosts = relatedPosts
    ?.filter((p) => p.slug !== slug)
    .slice(0, 3) || [];

  // SEO Meta Tags - Update document head when post loads
  useEffect(() => {
    if (post) {
      // Update page title
      document.title = `${post.title} | Reese Astor - Romance Author`;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.excerpt);
      
      // Update or create Open Graph tags for social sharing
      const ogTags = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:site_name', content: 'Reese Astor - Romance Author' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.title },
        { name: 'twitter:description', content: post.excerpt },
      ];
      
      ogTags.forEach(tag => {
        const selector = tag.property 
          ? `meta[property="${tag.property}"]` 
          : `meta[name="${tag.name}"]`;
        let metaTag = document.querySelector(selector);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          if (tag.property) metaTag.setAttribute('property', tag.property);
          if (tag.name) metaTag.setAttribute('name', tag.name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });
      
      // Add article-specific meta tags
      let articleAuthor = document.querySelector('meta[name="author"]');
      if (!articleAuthor) {
        articleAuthor = document.createElement('meta');
        articleAuthor.setAttribute('name', 'author');
        document.head.appendChild(articleAuthor);
      }
      articleAuthor.setAttribute('content', 'Reese Astor');
      
      // Add keywords based on category
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const baseKeywords = 'romance books, billionaire romance, Manhattan Money Kings, Reese Astor';
      const categoryKeywords: Record<string, string> = {
        'Reading Recommendations': 'book recommendations, romance series, best romance books 2024',
        'Writing Tips': 'romance writing tips, how to write romance, author advice',
        'Author Journey': 'self-publishing, indie author, author business',
        'Marketing': 'book marketing, author platform, social media for authors',
      };
      metaKeywords.setAttribute('content', `${baseKeywords}, ${categoryKeywords[post.category] || ''}`);
    }
    
    // Cleanup - reset title when leaving page
    return () => {
      document.title = 'Reese Astor - Romance Author & Writing Coach';
    };
  }, [post]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl font-bold text-white">Post Not Found</h1>
          <p className="text-gray-400">The blog post you're looking for doesn't exist.</p>
          <Button
            asChild
            className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full"
          >
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/manhattan-night-skyline.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link href="/blog">
              <Button
                variant="ghost"
                className="mb-8 text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Category Badge */}
            <Badge className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-4 py-1 text-sm font-medium mb-6">
              {post.category}
            </Badge>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {post.publishedAt
                    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                    : format(new Date(post.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 pb-8 border-b border-white/10">
              <span className="text-gray-400 text-sm font-medium">Share:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("copy")}
                className="text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Excerpt */}
            <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <p className="text-xl text-gray-300 leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Audio Player */}
            {post.audioUrl && (
              <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c9a961] flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Listen to this Article</h3>
                    <p className="text-sm text-gray-400">Audio narration available</p>
                  </div>
                </div>
                <audio
                  controls
                  className="w-full"
                  style={{
                    filter: 'invert(1) hue-rotate(180deg)',
                    borderRadius: '12px',
                  }}
                >
                  <source src={post.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-16">
              <div className="text-gray-300 leading-relaxed space-y-6 text-lg">
                <Streamdown>{post.content}</Streamdown>
              </div>
            </div>

            {/* Author Bio Section */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl mb-16">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center border-2 border-[#d4af37]/30">
                    <span className="text-3xl font-serif font-bold text-[#d4af37]">RA</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">
                    About Reese Astor
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    USA Today Bestselling Author of steamy billionaire romance. Former corporate VP turned full-time author, helping aspiring writers build profitable author businesses through coaching and mentorship.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-6 py-5 rounded-full"
                    >
                      <Link href="/about">Learn More</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-5 rounded-full"
                    >
                      <Link href="/books">View Books</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Posts Section */}
      {filteredRelatedPosts.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/manhattan-penthouse-view.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white text-center mb-12">
                Related Articles
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {filteredRelatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10">
                        <div className="space-y-4">
                          <Badge className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-4 py-1 text-xs font-medium">
                            {relatedPost.category}
                          </Badge>

                          <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                            {relatedPost.title}
                          </h3>

                          <p className="text-gray-400 leading-relaxed line-clamp-3 text-sm">
                            {relatedPost.excerpt}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/blog">View All Articles</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
