import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, BookOpen, Sparkles, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Book3LaunchBanner } from "@/components/Book3LaunchBanner";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  const [email, setEmail] = useState("");

  // SEO Meta Tags
  useEffect(() => {
    // Title: 54 characters (within 30-60 range)
    document.title = "Reese Astor | Billionaire Romance Author & Bestseller";
    
    // Meta description: 156 characters (within 50-160 range)
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = "Discover the Manhattan Money Kings series by USA Today bestselling author Reese Astor. Steamy billionaire romance with alpha heroes and happily ever afters.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywordsContent = "billionaire romance, romance author, Manhattan Money Kings, steamy romance, alpha billionaire, contemporary romance, Reese Astor, romance books, secret baby romance, fake marriage romance";
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywordsContent;
      document.head.appendChild(meta);
    }

    // Open Graph tags for social sharing
    const setOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    setOgMeta('og:title', 'Reese Astor | Billionaire Romance Author');
    setOgMeta('og:description', 'USA Today bestselling author of the Manhattan Money Kings series. Steamy billionaire romance with alpha heroes.');
    setOgMeta('og:type', 'website');
    setOgMeta('og:image', '/book3-cover.jpg');

    // Twitter Card tags
    const setTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', 'Reese Astor | Billionaire Romance Author');
    setTwitterMeta('twitter:description', 'USA Today bestselling author of the Manhattan Money Kings series.');
    setTwitterMeta('twitter:image', '/book3-cover.jpg');
  }, []);
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
      link: "https://swiy.co/3rd",
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <Book3LaunchBanner />
      
      {/* Manhattan Penthouse Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Penthouse View Background with Parallax */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/manhattan-penthouse-view.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a]" />
        </div>

        {/* Gold Ambient Light Effect */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />
        
        <div className="container relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
                <Star className="h-4 w-4 text-[#d4af37]" fill="#d4af37" />
                <span className="text-sm font-medium text-[#d4af37] tracking-wide">
                  USA TODAY BESTSELLING AUTHOR
                </span>
              </div>

              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                <span className="text-white">Manhattan</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                  Money Kings
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl font-light">
                Where power, passion, and billion-dollar secrets collide in the heart of Manhattan's elite.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-semibold px-8 py-7 rounded-full text-lg shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
                >
                  <Link href="/books">
                    Explore the Series
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full text-lg transition-all duration-300 hover:border-[#d4af37]/50"
                >
                  <Link href="/free-book">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Get Free Prequel
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">4</div>
                  <div className="text-sm text-gray-400 mt-1">Books</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">10K+</div>
                  <div className="text-sm text-gray-400 mt-1">Readers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">★ 4.8</div>
                  <div className="text-sm text-gray-400 mt-1">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Featured Book */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-12 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
              
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black text-sm font-bold shadow-lg">
                  NEW RELEASE
                </div>

                <img
                  src="/book3-cover.jpg"
                  alt="The Billionaire's Baby Secret"
                  className="w-full rounded-2xl shadow-2xl mb-6"
                />

                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  The Billionaire's Baby Secret
                </h3>
                <p className="text-[#d4af37] font-medium mb-4">Manhattan Money Kings Book 3</p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  One night. One secret. One second chance he refuses to lose.
                </p>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <a href="https://swiy.co/3rd" target="_blank" rel="noopener noreferrer">
                    Get It Now - $2.99
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#d4af37] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Editorial Book Showcase - Magazine Style */}
      <section className="py-32 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-6">
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                The Complete Series
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Three Billionaires.<br />Three Unforgettable Romances.
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Dive into the world of Manhattan's most powerful men and the women who capture their hearts.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10">
                  {book.badge && (
                    <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black text-xs font-bold shadow-lg z-10">
                      {book.badge}
                    </div>
                  )}

                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[#d4af37] text-sm font-medium">{book.subtitle}</p>
                    </div>

                    <p className="text-gray-400 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-bold text-white">{book.price}</span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-white/10 hover:bg-[#d4af37] hover:text-black border border-white/20 hover:border-[#d4af37] text-white font-semibold px-6 py-5 rounded-full transition-all duration-300"
                      >
                        <a href={book.link} target="_blank" rel="noopener noreferrer">
                          Buy Now
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-white font-semibold px-10 py-7 rounded-full text-lg transition-all duration-300 hover:border-[#d4af37]"
            >
              <Link href="/books">
                View Complete Series
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Free Prequel - Luxury Offer Section */}
      <section className="py-32 relative overflow-hidden">
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

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl">
              {/* Book Cover */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -inset-8 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <img
                  src="/prequel-cover.jpg"
                  alt="The Billionaire's One Night Stand - Free Prequel"
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-xl">
                  FREE NEWSLETTER BONUS
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Start Your Journey<br />
                  <span className="text-[#d4af37]">For Free</span>
                </h2>
                
                <p className="text-2xl text-white font-semibold">
                  The Billionaire's One Night Stand
                </p>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  A Manhattan Money Kings Prequel. Discover where it all began with this steamy standalone novella—absolutely free when you join my newsletter!
                </p>

                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-lg px-10 py-7 rounded-full shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
                >
                  <a href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-6 w-6" />
                    Download Free Now
                  </a>
                </Button>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                  <img src="/prequel-qr.png" alt="QR Code" className="w-24 h-24 rounded-lg border-2 border-[#d4af37]/30" />
                  <div className="text-sm text-gray-400 text-left">
                    <p className="font-semibold text-white">Scan to download</p>
                    <p>or get it on <a href="https://swiy.co/3rd" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline">Amazon</a></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section - Elegant Signup */}
      <section className="py-32 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-8">
                <Sparkles className="h-8 w-8 text-[#d4af37]" />
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Join the Inner Circle
              </h2>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Get exclusive updates, free books, sneak peeks, and behind-the-scenes content delivered to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-7 text-lg rounded-full border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={subscribeMutation.isPending}
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <p className="text-sm text-gray-500 mt-6">
                No spam. Unsubscribe anytime. Your privacy is protected.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
