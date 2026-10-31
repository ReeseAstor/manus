import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Loader2, Sparkles, Mail } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

const POSTS_PER_PAGE = 9;

export default function Blog() {
  useEffect(() => {
    document.title = "Reese Astor Blog | Romance Reads";
  }, []);

  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  
  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  const { data: blogPosts, isLoading } = trpc.blog.list.useQuery({ 
    published: true,
    category: selectedCategory 
  });
  
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Thank you for subscribing! Check your email for confirmation.");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({ email });
    }
  };

  // Get unique categories from all posts (fetch without category filter for category list)
  const { data: allPosts } = trpc.blog.list.useQuery({ published: true });
  const uniqueCategories = allPosts?.map((post) => post.category) || [];
  const categories = ["All", ...Array.from(new Set(uniqueCategories))];

  const placeholderPosts: NonNullable<typeof blogPosts> = [];

  // Empty when the API has no posts, so the empty state shows instead of sample articles.
  const allDisplayPosts: NonNullable<typeof blogPosts> =
    blogPosts && blogPosts.length > 0 ? blogPosts : placeholderPosts;
  
  // Paginated posts - show only visibleCount posts
  const displayPosts = useMemo(() => {
    return allDisplayPosts.slice(0, visibleCount);
  }, [allDisplayPosts, visibleCount]);

  const hasMore = allDisplayPosts.length > visibleCount;
  const remainingCount = allDisplayPosts.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
      <EnhancedSEOHead
        title="Reese Astor Blog | Romance Reads"
        description="Reese Astor's reading lists and notes on steamy billionaire romance."
        canonical="/blog"
        ogType="website"
        keywords={["Reese Astor blog", "Manhattan Money Kings", "romance books", "what to read next", "steamy romance"]}
      />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#C9A3A0]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#B59A6A]/30 bg-[#C9A3A0]/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#7A4F4C]" />
              <span className="text-sm font-medium text-[#7A4F4C] tracking-widest uppercase">
                From Reese
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#4A3B3A] leading-tight">
              The Reese Astor Blog
            </h1>

            <p className="text-xl md:text-2xl text-[#6E5F5A] font-light max-w-3xl mx-auto leading-relaxed">
              Reading lists and notes from Reese on steamy billionaire romance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 relative ambient-section">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
              >
                <Badge
                  variant={(category === "All" && !selectedCategory) || category === selectedCategory ? "default" : "outline"}
                  className={`cursor-pointer px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                    (category === "All" && !selectedCategory) || category === selectedCategory
                      ? "bg-[#4A3B3A] text-[#FAF7F7] border-0 hover:shadow-lg hover:shadow-[#C9A3A0]/30"
                      : "border-2 border-[#4A3B3A]/20 bg-[#EBD6D3]/30 text-[#FAF7F7] hover:bg-[#EBD6D3]/60 hover:border-[#B59A6A]/50"
                  }`}
                  onClick={() => setSelectedCategory(category === "All" ? undefined : category)}
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 relative ambient-section">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#7A4F4C]" />
            </div>
          ) : displayPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {displayPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index % POSTS_PER_PAGE) * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="h-full rounded-3xl card-premium bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#C9A3A0]/10 overflow-hidden">
                        {/* Featured Image */}
                        {"featuredImage" in post && post.featuredImage && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <img
                              src={post.featuredImage as string}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F7]/60 to-transparent" />
                          </div>
                        )}
                        <div className="space-y-6 p-8">
                          {/* Category Badge */}
                          <div className="inline-flex">
                            <Badge className="bg-[#C9A3A0]/10 text-[#7A4F4C] border border-[#B59A6A]/30 px-4 py-1 text-xs font-medium">
                              {post.category}
                            </Badge>
                          </div>

                          {/* Title */}
                          <h2 className="font-serif text-2xl font-bold text-[#4A3B3A] group-hover:text-[#7A4F4C] transition-colors leading-tight">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-[#6E5F5A] leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-[#6E5F5A] pt-4 border-t border-[#4A3B3A]/10">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {post.publishedAt
                                  ? format(new Date(post.publishedAt), "MMM d, yyyy")
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-[#7A4F4C] font-medium group-hover:gap-4 transition-all">
                            <span>Read More</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center mt-16 gap-4"
                >
                  <p className="text-[#6E5F5A] text-sm">
                    Showing {displayPosts.length} of {allDisplayPosts.length} posts
                  </p>
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    className="bg-gradient-to-r from-[#C9A3A0]/20 to-[#C9A3A0]/20 hover:from-[#C9A3A0]/30 hover:to-[#C9A3A0]/30 text-[#7A4F4C] border-2 border-[#B59A6A]/30 hover:border-[#B59A6A]/60 font-semibold px-12 py-7 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#C9A3A0]/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    Load More Posts
                    <span className="ml-2 text-sm opacity-70">({remainingCount} remaining)</span>
                  </Button>
                </motion.div>
              )}

              {/* All posts loaded message */}
              {!hasMore && allDisplayPosts.length > POSTS_PER_PAGE && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center mt-16"
                >
                  <p className="text-[#6E5F5A] text-sm italic">
                    You've reached the end: all {allDisplayPosts.length} posts loaded
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 text-center"
            >
              <p className="text-[#6E5F5A] text-lg">No blog posts found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA - Luxury Design */}
      <section className="py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#C9A3A0]/10 via-transparent to-[#C9A3A0]/5 border-2 border-[#B59A6A]/20 backdrop-blur-xl shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 mb-8">
              <Mail className="h-8 w-8 text-[#7A4F4C]" />
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#4A3B3A] mb-6">
              Never Miss a Post
            </h2>
            
            <p className="text-xl text-[#6E5F5A] mb-10 max-w-2xl mx-auto leading-relaxed">
              Get new posts and new-release news in your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-7 text-lg rounded-full border-2 border-[#4A3B3A]/20 focus:border-[#B59A6A] bg-[#EBD6D3]/30 backdrop-blur-sm text-[#4A3B3A] placeholder:text-[#6E5F5A]"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={subscribeMutation.isPending}
                  className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-[#6E5F5A] text-center mt-4">
                No spam. Unsubscribe anytime. Your privacy is protected.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
