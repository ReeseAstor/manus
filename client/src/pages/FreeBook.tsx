import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Download, Gift, Star, Heart, CheckCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function FreeBook() {
  const [email, setEmail] = useState("");
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Success! Check your email for your free book download link.");
      setEmail("");
      // Redirect to BookFunnel after a short delay
      setTimeout(() => {
        window.open("https://dl.bookfunnel.com/xrodg0t77p", "_blank");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({ email });
    }
  };

  const handleDirectDownload = () => {
    window.open("https://dl.bookfunnel.com/xrodg0t77p", "_blank");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Get a FREE steamy billionaire romance novella by Reese Astor!";
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "This prequel hooked me instantly! The chemistry is off the charts and I immediately bought the entire series.",
    },
    {
      name: "Jessica T.",
      rating: 5,
      text: "Steamy, sophisticated, and utterly addictive. Reese Astor knows how to write billionaire romance!",
    },
    {
      name: "Amanda R.",
      rating: 5,
      text: "I couldn't put it down! The perfect introduction to the Manhattan Money Kings world.",
    },
  ];

  const benefits = [
    "Instant access to the complete novella",
    "Exclusive bonus content and character insights",
    "Early notifications for new releases",
    "Special reader-only discounts on the series",
    "Behind-the-scenes author updates",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="container relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Book Cover */}
              <div className="relative">
                <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                      100% FREE
                    </div>
                  </div>
                  <img
                    src="/prequel-cover.jpg"
                    alt="The Billionaire's One Night Stand - Free Prequel"
                    className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">FREE READER MAGNET</span>
                </div>

                <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Get Your Free Book Today!
                </h1>

                <p className="text-2xl font-semibold text-foreground">
                  The Billionaire's One Night Stand
                </p>

                <p className="text-lg text-muted-foreground">
                  A Manhattan Money Kings Prequel Novella
                </p>

                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    Loved by thousands of readers
                  </span>
                </div>

                <p className="text-muted-foreground text-lg">
                  One night. One mistake. One billionaire who never forgets. Discover where the Manhattan Money Kings saga began with this steamy standalone novella—absolutely free!
                </p>

                {/* Email Signup Form */}
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Enter your email to get instant access:
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1"
                          />
                          <Button 
                            type="submit" 
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={subscribeMutation.isPending}
                          >
                            {subscribeMutation.isPending ? (
                              "Sending..."
                            ) : (
                              <>
                                <Download className="mr-2 h-5 w-5" />
                                Get Free Book
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By subscribing, you'll also receive exclusive updates, bonus content, and special offers. Unsubscribe anytime.
                      </p>
                    </form>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleDirectDownload}
                    className="flex-1"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Direct Download Link
                  </Button>
                  <a 
                    href="https://www.amazon.com/dp/B0DSG7NKGP" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="lg" className="w-full">
                      View on Amazon
                    </Button>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <img src="/prequel-qr.png" alt="QR Code" className="w-24 h-24" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold">Scan to download</p>
                    <p>on your mobile device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-center text-foreground mb-12">
              What You'll Get
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book Preview Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-center text-foreground mb-8">
              A Taste of What's Inside
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground italic mb-6">
                    "The moment our eyes met across the crowded Manhattan ballroom, I knew this night would change everything. He was power in a tuxedo. Danger wrapped in charm. And I was about to make the biggest mistake of my life..."
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">The Billionaire's One Night Stand</strong> introduces you to the glittering, cutthroat world of Manhattan's elite. When an ambitious journalist crosses paths with a ruthless tech billionaire at a charity gala, one impulsive decision sets off a chain of events that will ripple through the entire series.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    This standalone prequel can be read before or after the main series, giving you exclusive insight into the connections, rivalries, and secrets that drive the Manhattan Money Kings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-center text-foreground mb-12">
              What Readers Are Saying
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      — {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About the Series Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-playfair text-4xl font-bold text-foreground">
              Fall in Love with the Manhattan Money Kings Series
            </h2>
            <p className="text-lg text-muted-foreground">
              After you devour the free prequel, continue the journey with three full-length novels featuring ruthless billionaires, forbidden romance, and happily-ever-afters that will leave you breathless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a href="/books">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore the Full Series
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Is this really free?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Absolutely 100% free. No credit card required. Just enter your email and get instant access to the complete novella.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    What format will I receive?
                  </h3>
                  <p className="text-muted-foreground">
                    You'll receive the book through BookFunnel, which allows you to download in multiple formats including EPUB, MOBI (Kindle), and PDF. Read on any device!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Do I need to read this before the main series?
                  </h3>
                  <p className="text-muted-foreground">
                    Not required! This prequel can be enjoyed before or after reading the main Manhattan Money Kings series. It's a standalone story that enriches the overall experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Will I receive spam emails?
                  </h3>
                  <p className="text-muted-foreground">
                    Never! You'll only receive occasional updates about new releases, exclusive content, and special offers. You can unsubscribe at any time with one click.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Ready to Start Reading?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of readers who've fallen in love with the Manhattan Money Kings. Get your free book now!
            </p>
            
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 text-lg h-14"
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? "Sending..." : "Get My Free Book"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    100% free. No credit card required. Instant access.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Share this free book with friends:</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("pinterest")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Pinterest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
