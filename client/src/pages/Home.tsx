import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, Sparkles, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Home() {
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

  const books = [
    {
      id: 3,
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane discovers the daughter he never knew existed, he'll stop at nothing to claim his family—and win back the woman who got away.",
      price: "$2.99",
      link: "https://www.amazon.com/dp/B0DRZG5KKD",
      available: true,
      badge: "New Release",
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "He caught her breaking into his office. She was after evidence that could destroy his rival. His solution? A marriage contract neither expected to fulfill.",
      price: "$2.99",
      link: "https://www.amazon.com/dp/B0FCCBNF8X",
      available: true,
    },
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      price: "$0.99",
      link: "https://www.amazon.com/dp/B0F2W8QL7S",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Bestselling Romance Author</span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Welcome to the World of
              <span className="block text-primary mt-2">Reese Astor</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive into steamy billionaire romance novels and discover how to turn your creative passion into a profitable writing career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/books">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore My Books
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline" className="font-semibold">
                  Learn Writing & Publishing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free Prequel Section */}
      <section className="py-16 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-y border-primary/20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Book Cover */}
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
                <img
                  src="/prequel-cover.jpg"
                  alt="The Billionaire's One Night Stand - Free Prequel"
                  className="relative w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  FREE NEWSLETTER BONUS
                </div>
                
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                  Get Your Free Prequel!
                </h2>
                
                <p className="text-xl text-foreground font-semibold">
                  The Billionaire's One Night Stand
                </p>
                
                <p className="text-muted-foreground">
                  A Manhattan Money Kings Prequel. Discover where it all began with this steamy standalone novella—absolutely free when you join my newsletter!
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="flex-1 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    <a href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Download Free Now
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                  <div className="text-center">
                    <img src="/prequel-qr.png" alt="QR Code" className="w-24 h-24 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Scan to download</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Also available on</p>
                    <a href="https://www.amazon.com/dp/B0DSG7NKGP" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                      Amazon Kindle
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Manhattan Money Kings Series
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Indulge in steamy billionaire romance where power meets passion in the heart of New York City.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      {book.badge && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            {book.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-primary font-semibold mb-1">{book.subtitle}</p>
                        <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {book.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{book.price}</span>
                      </div>

                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <a href={book.link} target="_blank" rel="noopener noreferrer">
                          <Heart className="mr-2 h-4 w-4" />
                          Get Your Copy
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/books">
                View All Books
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              About Reese Astor
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Reese Astor writes steamy, high-glamour contemporary romance where ruthless billionaires fall hard for the women who refuse to be conquered. When she's not crafting swoon-worthy happily-ever-afters, you'll find her with coffee in hand, plotting her next novel during late-night writing sessions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As a writing coach, Reese helps aspiring authors turn their creative passion into a profitable career. She specializes in teaching romance writers how to craft compelling stories, build engaged readerships, and navigate the world of independent publishing.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-4">
              <Link href="/about">
                Learn More About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Join My Newsletter
            </h2>
            <p className="text-lg text-muted-foreground">
              Get your FREE prequel novella, exclusive content, early access to new releases, and behind-the-scenes insights into my writing process.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
