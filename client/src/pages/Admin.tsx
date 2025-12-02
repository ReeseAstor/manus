import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Eye, Loader2, Search, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const { data: posts, isLoading, refetch } = trpc.blog.list.useQuery({ published: undefined });
  
  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">Please log in to access the admin dashboard.</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to access this page.</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  // Filter posts based on search and category
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(posts?.map((p) => p.category) || []))];

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
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  Blog Management
                </h1>
                <p className="text-gray-400 text-lg">
                  Create and manage your blog posts with the visual editor
                </p>
              </div>
              <Link href="/admin/blog/new">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Post
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-2xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-3 h-14 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0f1420] text-white">
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts List */}
      <section className="py-12 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10">
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                              {post.title}
                            </h3>
                            <Badge 
                              className={
                                post.published === "published"
                                  ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-4 py-1"
                                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30 px-4 py-1"
                              }
                            >
                              {post.published}
                            </Badge>
                          </div>
                          <p className="text-gray-300 leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="text-[#d4af37]">{post.category}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                            {post.publishedAt && (
                              <>
                                <span>•</span>
                                <span>Published: {format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {post.published === "published" && (
                            <Link href={`/blog/${post.slug}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-5 rounded-full"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-[#d4af37]/30 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-semibold px-4 py-5 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deleteMutation.isPending}
                            className="border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-4 py-5 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-16 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10">
                  <div className="text-center space-y-6">
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {searchQuery || filterCategory !== "all" ? "No posts found" : "No blog posts yet"}
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      {searchQuery || filterCategory !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Create your first blog post to get started."}
                    </p>
                    {!searchQuery && filterCategory === "all" && (
                      <Link href="/admin/blog/new">
                        <Button className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Post
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
