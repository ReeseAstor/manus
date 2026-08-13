import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, CheckCircle, BookOpen, Bell, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

export default function NewReleaseSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Welcome to the inner circle! Your free book is on its way.");
      // Open BookFunnel after signup
      setTimeout(() => {
        window.open("https://swiy.co/05", "_blank");
      }, 2000);
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        setIsSubmitted(true);
        toast.info("You're already on the list!");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim(), name: name.trim() || undefined });
  };

  const benefits = [
    { icon: Gift, text: "Free copy of The First Acquisition" },
    { icon: Bell, text: "New release alerts before anyone else" },
    { icon: BookOpen, text: "Exclusive bonus chapters & epilogues" },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
          backgroundSize: "cover",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/8 blur-[160px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#d4af37]/30 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-3xl pointer-events-none" />

            {!isSubmitted ? (
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-8">
                  <Sparkles className="h-8 w-8 text-[#d4af37]" />
                </div>

                {/* Heading */}
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                  Join the VIP Reader List
                </h2>
                <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Get a <span className="text-[#d4af37] font-semibold">free copy of The First Acquisition</span> plus
                  exclusive content, early release alerts, and bonus chapters.
                </p>
                <p className="text-sm text-gray-400 mb-10">
                  Join 1,700+ readers who already love the Manhattan Money Kings series.
                </p>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                  {benefits.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                        <b.icon className="h-5 w-5 text-[#d4af37]" />
                      </div>
                      <span className="text-sm text-gray-300 text-center leading-snug">
                        {b.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <Input
                      type="text"
                      placeholder="First name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-[0.8] bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full px-6 py-6 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20 transition-colors"
                    />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full px-6 py-6 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20 transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    className="w-full sm:w-auto btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {subscribeMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        Get My Free Book
                      </span>
                    )}
                  </Button>
                </form>

                <p className="text-sm text-gray-500 mt-6">
                  No spam, ever. Unsubscribe anytime. Your privacy is protected.
                </p>
              </div>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 mb-8">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>

                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                  You're In!
                </h2>
                <p className="text-xl text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed">
                  Your free copy of{" "}
                  <span className="text-[#d4af37] font-semibold">
                    The First Acquisition
                  </span>
                  {" "}is being delivered to your inbox now. A download page should open in a new tab shortly.
                </p>
                <p className="text-gray-400 mb-8">
                  You'll be the first to know about every new Manhattan Money Kings release.
                </p>
                <Button
                  onClick={() => window.open("https://swiy.co/05", "_blank")}
                  className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Get Your Free Book
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
