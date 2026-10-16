import { Button } from "@/components/ui/button";
import { BookOpen, Gift, Star, CheckCircle, Share2, Mail, ChevronRight, Heart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { HoneypotField } from "@/components/HoneypotField";
import { motion } from "framer-motion";
import { EnhancedSEOHead, generateBookSchema } from "@/components/ui/enhanced-seo-head";

export default function FreeBook() {
  useEffect(() => {
    document.title = "Free Book: The First Acquisition | Reese Astor Romance";
  }, []);

  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [formRenderedAt] = useState(() => Date.now());
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Success! Redirecting you to download your free book...");
      setEmail("");
      // Redirect to BookFunnel after a short delay
      setTimeout(() => {
        window.open("https://dl.bookfunnel.com/hj09ggitwi", "_blank");
      }, 1500);
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        toast.info("You're already on the list! Redirecting to your free book...");
        setTimeout(() => {
          window.open("https://dl.bookfunnel.com/hj09ggitwi", "_blank");
        }, 1500);
      } else {
        toast.error(error.message || "Failed to subscribe. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({
        email,
        company_website: companyWebsite || undefined,
        formRenderedAt,
        formSubmittedAt: Date.now(),
      });
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Get a FREE steamy billionaire romance by Reese Astor!";
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const benefits = [
    "Instant access to the complete full-length novella",
    "The perfect introduction to the Hudson Dynasty series",
    "Early notifications for new releases",
    "Exclusive bonus content and character insights",
    "Behind-the-scenes author updates",
  ];

  const freeBookSchema = generateBookSchema({
    name: "The First Acquisition: A Manhattan Billionaire Romance (Hudson Dynasty)",
    description: "A steamy billionaire romance where power, passion, and Manhattan collide. The prequel novella to the Hudson Dynasty series by Reese Astor.",
    url: "https://reeseastor.com/free-book",
    genre: "Billionaire Romance",
    price: "0",
    currency: "USD",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="Free Book: The First Acquisition | Reese Astor Romance"
        description="Download The First Acquisition for free. A steamy Manhattan billionaire romance and Hudson Dynasty prequel novella by Reese Astor. Join the newsletter and start reading today."
        canonical="/free-book"
        ogType="book"
        keywords={["free romance book", "The First Acquisition", "free billionaire romance", "Reese Astor free book", "Hudson Dynasty", "Manhattan Money Kings", "reader magnet"]}
        structuredData={[freeBookSchema]}
      />

      {/* Hero Section - Premium Offer */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
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
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/uMHRMKanHXREGUzc.jpeg"
                      alt="The First Acquisition - A Manhattan Billionaire Romance"
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
                    Free Book for New Readers
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
                    The First Acquisition
                  </p>
                  <p className="text-xl text-[#d4af37]">
                    A Manhattan Billionaire Romance (Hudson Dynasty)
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    Loved by romance readers
                  </span>
                </div>

                <p className="text-gray-300 text-xl leading-relaxed">
                  Power. Passion. Manhattan. She was hired to audit his empire. Falling for him could destroy them both. This high-heat corporate billionaire prequel novella is the perfect introduction to the Hudson Dynasty world.
                </p>

                {/* Email Signup Form */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <HoneypotField value={companyWebsite} onChange={setCompanyWebsite} />
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
                          className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
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
                More than just a free book — your VIP pass to the Hudson Dynasty world
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
                  className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300"
                >
                  <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0" />
                  <span className="text-gray-200 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Share Section */}
      <section className="py-16 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-white mb-6">
              Know Someone Who'd Love This?
            </h2>
            <p className="text-gray-400 mb-8">
              Share the love — tell a friend about this free book offer.
            </p>
            <div className="flex justify-center gap-4">
              {["facebook", "twitter", "pinterest"].map((platform) => (
                <Button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 text-white px-6 py-5 rounded-full capitalize"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {platform}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1020] to-[#0a0e1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/8 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Sparkles className="h-12 w-12 text-[#d4af37] mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Enter the World of<br />
              <span className="text-[#d4af37]">the Hudson Dynasty?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Your free copy of The First Acquisition is waiting.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-xl px-12 py-8 rounded-full shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
            >
              <a href="https://dl.bookfunnel.com/kw1yge3479" target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-3 h-7 w-7" />
                Claim Your Free Copy Now
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
