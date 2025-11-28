import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Post Not Found</h2>
            <p className="text-muted-foreground">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.publishedAt && (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>
                  </div>
                  <span>•</span>
                </>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <Card className="bg-card border-border">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-invert max-w-none">
                <Streamdown>{post.content}</Streamdown>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter CTA */}
          <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-border">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-foreground">
                Enjoyed this post?
              </h3>
              <p className="text-muted-foreground">
                Subscribe to get more writing tips and publishing strategies delivered to your inbox.
              </p>
              <Link href="/blog">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe to Newsletter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Back to Blog */}
          <div className="text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
