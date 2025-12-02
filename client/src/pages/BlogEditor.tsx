import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import { useLocation, useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BlogEditor() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const isEdit = params.id && params.id !== "new";
  const postId = isEdit ? parseInt(params.id as string) : undefined;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Writing Tips",
    readTime: "5 min read",
    published: "draft" as "draft" | "published",
  });

  // Fetch existing post if editing
  const { data: posts } = trpc.blog.list.useQuery(
    { published: undefined },
    { enabled: !!isEdit }
  );

  useEffect(() => {
    if (isEdit && posts && postId) {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          readTime: post.readTime,
          published: post.published,
        });
      }
    }
  }, [isEdit, posts, postId]);

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      setLocation("/admin");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog post");
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      setLocation("/admin");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === "title" && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    
    const data = {
      ...formData,
      published: status,
    };

    if (isEdit && postId) {
      updateMutation.mutate({ id: postId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">
              You don't have permission to access this page.
            </p>
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
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
            className="max-w-5xl mx-auto"
          >
            <Link href="/admin">
              <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:text-[#d4af37] hover:bg-white/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
              {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-gray-400 text-lg">
              {isEdit
                ? "Update your blog post with the visual editor"
                : "Write and publish your blog post with rich formatting"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={(e) => handleSubmit(e, "draft")}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Basic Details */}
            <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white mb-6">Basic Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300 font-semibold">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-gray-300 font-semibold">
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="url-friendly-slug"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">
                    URL: /blog/{formData.slug || "your-slug"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300 font-semibold">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f1420] border-white/20">
                        <SelectItem value="Writing Tips">Writing Tips</SelectItem>
                        <SelectItem value="Romance Recommendations">Romance Recommendations</SelectItem>
                        <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                        <SelectItem value="Author Journey">Author Journey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime" className="text-gray-300 font-semibold">
                      Read Time *
                    </Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="5 min read"
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-gray-300 font-semibold">
                    Excerpt *
                  </Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary shown in listings (150-200 characters)"
                    rows={3}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 resize-none rounded-xl"
                  />
                </div>
              </div>
            </Card>

            {/* Content Editor */}
            <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10">
              <h2 className="font-serif text-2xl font-bold text-white mb-6">Content</h2>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="Start writing your blog post... Use the toolbar above for formatting."
              />
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin")}
                disabled={isPending}
                className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 rounded-full"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 rounded-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={isPending}
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {isPending ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
