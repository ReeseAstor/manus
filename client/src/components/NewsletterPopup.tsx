import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";


interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");


  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      alert("Success! Check your email for your free book download link.");
      setEmail("");
      setName("");
      onClose();
      // Mark as subscribed in localStorage
      localStorage.setItem("newsletter_subscribed", "true");
    },
    onError: (error) => {
      alert(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({ email, name });
  };

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="relative mx-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-[#d4af37] hover:bg-[#b8941f] text-[#0a0e27] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Card */}
              <div className="relative bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/20">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent pointer-events-none" />

                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

                <div className="relative p-8 md:p-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d4af37]/20 blur-xl rounded-full" />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[#0a0e27]" />
                      </div>
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-3 bg-gradient-to-r from-white via-[#f5f5f5] to-white bg-clip-text text-transparent">
                    Get Your Free Book
                  </h2>

                  <p className="text-[#e5e5e5]/80 text-center mb-6 text-base leading-relaxed">
                    Join my exclusive community and receive{" "}
                    <span className="text-[#d4af37] font-semibold">
                      "The Manhattan Affair"
                    </span>{" "}
                    absolutely free, plus insider writing tips and early access
                    to new releases.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0a0e27]/50 border-[#d4af37]/20 focus:border-[#d4af37] text-white placeholder:text-[#e5e5e5]/40 h-12 rounded-lg transition-all duration-300"
                      />
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Your email address *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#0a0e27]/50 border-[#d4af37]/20 focus:border-[#d4af37] text-white placeholder:text-[#e5e5e5]/40 h-12 rounded-lg transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#9a7a1a] text-[#0a0e27] font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    >
                      {subscribeMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0a0e27]/30 border-t-[#0a0e27] rounded-full animate-spin" />
                          Subscribing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          Get My Free Book
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Privacy note */}
                  <p className="text-[#e5e5e5]/50 text-xs text-center mt-6">
                    No spam, ever. Unsubscribe anytime. Your privacy is
                    protected.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
