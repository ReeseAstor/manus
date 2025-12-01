import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import LuxuryHero from "@/components/LuxuryHero";
import Interactive3DBookShowcase from "@/components/Interactive3DBookShowcase";
import { Book3LaunchBanner } from "@/components/Book3LaunchBanner";
import { motion } from "framer-motion";

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
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane discovers the daughter he never knew existed, he'll stop at nothing to claim his family.",
      price: "$2.99",
      link: "https://www.amazon.com/dp/B0DRZG5KKD",
      badge: "New Release",
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "When gymnast-turned-thief Lily Chen breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse.",
      price: "$2.99",
      link: "https://www.amazon.com/dp/B0FCCBNF8X",
    },
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      price: "$0.99",
      link: "https://www.amazon.com/dp/B0F2W8QL7S",
    },
  ];

  return (
    <div className="min-h-screen">
      <Book3LaunchBanner />
      {/* Luxury Hero Section */}
      <LuxuryHero />

      {/* Free Prequel Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/luxury-texture.jpg')",
            backgroundSize: "cover",
          }}
        />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 backdrop-blur-sm shadow-2xl">
              {/* Book Cover */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full" />
                <img
                  src="/prequel-cover.jpg"
                  alt="The Billionaire's One Night Stand - Free Prequel"
                  className="relative w-full max-w-sm mx-auto rounded-xl shadow-2xl"
                />
              </motion.div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg">
                  FREE NEWSLETTER BONUS
                </div>
                
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                  Get Your Free Prequel!
                </h2>
                
                <p className="text-xl text-foreground font-semibold">
                  The Billionaire's One Night Stand
                </p>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A Manhattan Money Kings Prequel. Discover where it all began with this steamy standalone novella—absolutely free when you join my newsletter!
                </p>

                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <a href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-6 w-6" />
                    Download Free Now
                  </a>
                </Button>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                  <img src="/prequel-qr.png" alt="QR Code" className="w-24 h-24" />
                  <div className="text-sm text-muted-foreground text-left">
                    <p className="font-semibold">Scan to download</p>
                    <p>or get it on <a href="https://www.amazon.com/dp/B0DSG7NKGP" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive 3D Book Showcase */}
      <Interactive3DBookShowcase books={books} />

      {/* Newsletter Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/luxury-texture.jpg')",
            backgroundSize: "cover",
          }}
        />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 backdrop-blur-sm shadow-2xl">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
              
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
                Join My Newsletter
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Get exclusive updates, free books, and behind-the-scenes content delivered to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-6 text-lg rounded-full border-2 border-primary/30 focus:border-primary bg-background/50 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={subscribeMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 rounded-full shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
