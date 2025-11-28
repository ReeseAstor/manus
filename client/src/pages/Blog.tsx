import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Blog() {
  const [email, setEmail] = useState("");
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

  const blogPosts = [
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

  const categories = ["All", "Writing Tips", "Marketing", "Business Strategy", "Author Journey"];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
            Writing & Publishing Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Tips, strategies, and insights on romance writing, self-publishing, and building a profitable author business.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-card border-border hover:shadow-xl transition-shadow group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>

                <h2 className="font-playfair text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-3xl mx-auto text-center space-y-6 py-12 px-6 rounded-lg bg-gradient-to-br from-primary/10 via-background to-background border border-border">
          <h2 className="font-playfair text-3xl font-bold text-foreground">
            Never Miss a Post
          </h2>
          <p className="text-muted-foreground">
            Subscribe to get writing tips, publishing strategies, and exclusive content delivered to your inbox every week.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-background"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
