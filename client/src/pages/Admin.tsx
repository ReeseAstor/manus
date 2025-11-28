import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-foreground">
                Blog Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage your blog posts
              </p>
            </div>
            <Link href="/admin/blog/new">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-5 w-5" />
                New Post
              </Button>
            </Link>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-playfair text-2xl font-bold text-foreground">
                            {post.title}
                          </h3>
                          <Badge variant={post.published === "published" ? "default" : "secondary"}>
                            {post.published}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {post.category}</span>
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
                      <div className="flex items-center gap-2">
                        {post.published === "published" && (
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">No blog posts yet</h3>
                <p className="text-muted-foreground">
                  Create your first blog post to get started.
                </p>
                <Link href="/admin/blog/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
