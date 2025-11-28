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
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "https://m.media-amazon.com/images/I/81n7gqi8zAL._SL1500_.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      price: "$0.99",
      link: "https://amzn.to/4ja7blJ",
      available: true,
    },
    {
      id: 2,
      title: "The Billionaire's Baby Secret: Hidden and His",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "https://m.media-amazon.com/images/I/81n7gqi8zAL._SL1500_.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden.",
      price: "$0.99",
      preorder: true,
      releaseDate: "December 1, 2025",
      link: "https://swiy.co/3rd",
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

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {books.map((book) => (
              <Card key={book.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full md:w-48 h-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-primary font-semibold mb-1">{book.subtitle}</p>
                        <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {book.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">{book.price}</span>
                        {book.preorder && (
                          <span className="text-sm text-muted-foreground">
                            Preorder • {book.releaseDate}
                          </span>
                        )}
                      </div>

                      <a href={book.link} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <Heart className="mr-2 h-4 w-4" />
                          {book.preorder ? "Preorder Now" : "Get Your Copy"}
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/books">
              <Button variant="outline" size="lg">
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                  About Reese Astor
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Former VP in corporate finance turned bestselling romance author and business strategist. I help women transform their creative passion into profitable businesses.
                  </p>
                  <p>
                    My Manhattan Money Kings series brings you steamy billionaire romance with strong heroines, powerful heroes, and happily-ever-afters that will make your heart race.
                  </p>
                  <p>
                    Beyond writing, I coach aspiring authors on the business of romance writing, from crafting compelling stories to mastering KDP and building sustainable author careers.
                  </p>
                </div>
                <Link href="/about">
                  <Button variant="outline">
                    Learn More About Me
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Join the Community</span>
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Get Exclusive Updates
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Subscribe to receive updates on new releases, exclusive content, writing tips, and special promotions delivered straight to your inbox.
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              No spam, unsubscribe anytime. Read our{" "}
              <Link href="/privacy">
                <a className="text-primary hover:underline">privacy policy</a>
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
