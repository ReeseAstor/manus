import { Button } from "@/components/ui/button";
import { BookOpen, Download, Gift, Star, CheckCircle, Share2, Mail, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section - Premium Offer */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/manhattan-penthouse-view.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/90" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Book Cover */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="absolute -inset-12 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <div className="relative">
                  <div className="absolute -top-6 -right-6 z-10 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-xl shadow-2xl animate-pulse">
                    100% FREE
                  </div>
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
                    <img
                      src="/prequel-cover.jpg"
                      alt="The Billionaire's One Night Stand - Free Prequel"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
                  <Gift className="h-5 w-5 text-[#d4af37]" />
                  <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                    Exclusive Reader Gift
                  </span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
                  Get Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                    Free Book
                  </span>
                </h1>

                <div>
                  <p className="text-3xl font-serif font-bold text-white mb-2">
                    The Billionaire's One Night Stand
                  </p>
                  <p className="text-xl text-[#d4af37]">
                    A Manhattan Money Kings Prequel Novella
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    Loved by thousands
                  </span>
                </div>

                <p className="text-gray-300 text-xl leading-relaxed">
                  One night. One mistake. One billionaire who never forgets. Discover where the Manhattan Money Kings saga began with this steamy standalone novella—absolutely free!
                </p>

                {/* Email Signup Form */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-3 block tracking-wide uppercase">
                        Enter your email for instant access:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="your@email.com"
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
                          {subscribeMutation.isPending ? "Sending..." : "Get Free Book"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      No spam. Unsubscribe anytime. Your privacy is protected.
                    </p>
                  </form>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handleDirectDownload}
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 rounded-full"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Direct Download
                  </Button>
                  <div className="flex items-center gap-2">
                    <img src="/prequel-qr.png" alt="QR Code" className="w-16 h-16 rounded-lg border-2 border-[#d4af37]/30" />
                    <span className="text-xs text-gray-400">Scan to<br />download</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - Benefits Section */}
      <section className="py-20 relative">
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
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                What You'll Get
              </h2>
              <p className="text-xl text-gray-400">
                More than just a free book—an exclusive VIP experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  <span className="text-gray-300 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Luxury Cards */}
      <section className="py-20 relative overflow-hidden">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                What Readers Are Saying
              </h2>
              <p className="text-xl text-gray-400">
                Join thousands of satisfied readers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-xl"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="text-white font-semibold">— {testimonial.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Premium */}
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
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-8">
              <BookOpen className="h-8 w-8 text-[#d4af37]" />
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Dive In?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get instant access to your free prequel and discover why readers can't get enough of the Manhattan Money Kings.
            </p>

            <Button
              onClick={handleDirectDownload}
              size="lg"
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-12 py-8 rounded-full text-xl shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
            >
              <Download className="mr-3 h-6 w-6" />
              Download Your Free Book Now
            </Button>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-400 mb-6">Share this free book with friends:</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('pinterest')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Pinterest
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
