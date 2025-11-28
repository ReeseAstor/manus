import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Save, Eye } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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

  const { data: existingPost, isLoading: loadingPost } = trpc.blog.getBySlug.useQuery(
    { slug: "" },
    { enabled: false }
  );

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

  if (authLoading || (isEdit && loadingPost)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <Button onClick={() => setLocation("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-playfair text-4xl font-bold text-foreground">
              {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit
                ? "Update your blog post details"
                : "Fill in the details to create a new blog post"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter post title"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="url-friendly-slug"
                    required
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be the URL: /blog/{formData.slug || "your-slug"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Writing Tips">Writing Tips</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                        <SelectItem value="Author Journey">Author Journey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time *</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="5 min read"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary of the post (shown in listings)"
                    rows={3}
                    required
                    className="bg-background resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog post content here... (Markdown supported)"
                    rows={20}
                    required
                    className="bg-background resize-y font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting: **bold**, *italic*, # headings, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isPending}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {isPending ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
