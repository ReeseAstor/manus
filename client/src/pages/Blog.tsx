import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Loader2, Sparkles, Mail } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

export default function Blog() {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
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

  const placeholderPosts = [
    {
      id: 1,
      title: "5 Essential Tips for Writing Steamy Romance Scenes",
      excerpt: "Learn how to write compelling, authentic intimate scenes that enhance your story and connect with readers on an emotional level.",
      category: "Writing Tips",
      date: "November 15, 2025",
      readTime: "8 min read",
      slug: "writing-steamy-romance-scenes",
    },
    {
      id: 2,
      title: "From Zero to Published: My Self-Publishing Journey",
      excerpt: "How I went from corporate VP to bestselling romance author, and the lessons I learned along the way about KDP publishing.",
      category: "Author Journey",
      date: "November 10, 2025",
      readTime: "12 min read",
      slug: "self-publishing-journey",
    },
    {
      id: 3,
      title: "Building Your Author Brand on Social Media",
      excerpt: "Practical strategies for growing your author platform on Instagram and Facebook without spending hours online every day.",
      category: "Marketing",
      date: "November 5, 2025",
      readTime: "10 min read",
      slug: "author-brand-social-media",
    },
    {
      id: 4,
      title: "The Business Side of Romance Writing",
      excerpt: "Why treating your writing like a business is the key to building a sustainable, profitable author career.",
      category: "Business Strategy",
      date: "October 28, 2025",
      readTime: "15 min read",
      slug: "business-side-romance-writing",
    },
    {
      id: 5,
      title: "Character Development: Creating Unforgettable Heroes",
      excerpt: "The secrets to crafting billionaire heroes who are powerful yet vulnerable, dominant yet respectful, and utterly irresistible.",
      category: "Writing Tips",
      date: "October 20, 2025",
      readTime: "9 min read",
      slug: "character-development-heroes",
    },
    {
      id: 6,
      title: "Email List Building for Authors: A Complete Guide",
      excerpt: "How to grow your email list from zero to thousands of engaged readers who can't wait for your next release.",
      category: "Marketing",
      date: "October 12, 2025",
      readTime: "11 min read",
      slug: "email-list-building-authors",
    },
  ];

  // Use placeholder posts if no real posts exist
  const displayPosts = blogPosts && blogPosts.length > 0 ? blogPosts : (!selectedCategory ? placeholderPosts : []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
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
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                Insights & Inspiration
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">
              Writing & Publishing Blog
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Tips, strategies, and insights on romance writing, self-publishing, and building a profitable author business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
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
                      ? "bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black border-0 hover:shadow-lg hover:shadow-[#d4af37]/30"
                      : "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-[#d4af37]/50"
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
      <section className="py-20 relative">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
            </div>
          ) : displayPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {displayPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10">
                      <div className="space-y-6">
                        {/* Category Badge */}
                        <div className="inline-flex">
                          <Badge className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-4 py-1 text-xs font-medium">
                            {post.category}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-400 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {"publishedAt" in post && post.publishedAt
                                ? format(new Date(post.publishedAt), "MMM d, yyyy")
                                : "date" in post
                                ? post.date
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-[#d4af37] font-medium group-hover:gap-4 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 text-center"
            >
              <p className="text-gray-400 text-lg">No blog posts found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA - Luxury Design */}
      <section className="py-32 relative overflow-hidden">
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
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-8">
              <Mail className="h-8 w-8 text-[#d4af37]" />
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Never Miss a Post
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Subscribe to get writing tips, publishing strategies, and exclusive content delivered to your inbox every week.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-7 text-lg rounded-full border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={subscribeMutation.isPending}
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">
                No spam. Unsubscribe anytime. Your privacy is protected.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
