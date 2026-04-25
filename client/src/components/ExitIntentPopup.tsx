import { useState, useEffect, useCallback } from "react";
import { X, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [hasDismissed, setHasDismissed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Check your inbox for the exclusive deleted scene!");
      setIsVisible(false);
      localStorage.setItem("reese_exit_popup_converted", "true");
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        toast.info("You're already a VIP reader! Check your inbox.");
        setIsVisible(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleExitIntent = useCallback(
    (e: MouseEvent) => {
      // Only trigger when mouse moves above the viewport (toward browser chrome)
      if (e.clientY <= 5 && !hasDismissed) {
        const alreadyConverted = localStorage.getItem("reese_exit_popup_converted");
        const alreadyDismissed = sessionStorage.getItem("reese_exit_popup_dismissed");
        const timedPopupShown = sessionStorage.getItem("reese_newsletter_shown");

        // Don't show if already converted, dismissed this session, or timed popup just shown
        if (alreadyConverted || alreadyDismissed) return;

        // Wait at least 30 seconds before showing exit intent
        const pageLoadTime = parseInt(sessionStorage.getItem("reese_page_load_time") || "0");
        if (Date.now() - pageLoadTime < 30000) return;

        setIsVisible(true);
      }
    },
    [hasDismissed]
  );

  useEffect(() => {
    // Record page load time
    if (!sessionStorage.getItem("reese_page_load_time")) {
      sessionStorage.setItem("reese_page_load_time", Date.now().toString());
    }

    document.addEventListener("mouseleave", handleExitIntent);
    return () => document.removeEventListener("mouseleave", handleExitIntent);
  }, [handleExitIntent]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
    sessionStorage.setItem("reese_exit_popup_dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[90vw] max-w-lg"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gold accent line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              <div className="p-8 md:p-10 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 mb-6">
                  <BookOpen className="h-8 w-8 text-[#d4af37]" />
                </div>

                {/* Headline */}
                <h2 className="font-serif text-3xl font-bold text-white mb-3">
                  Wait — Before You Go!
                </h2>

                <p className="text-gray-300 text-lg mb-2">
                  Get an <span className="text-[#d4af37] font-semibold">exclusive deleted scene</span> from the Manhattan Money Kings series.
                </p>

                <p className="text-gray-500 text-sm mb-6">
                  This scene reveals what happened <em>after</em> the final chapter. Only available to VIP readers.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full px-6 py-6 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20 text-center"
                  />
                  <Button
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
                  >
                    {subscribeMutation.isPending ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Sparkles className="h-5 w-5" />
                        Send Me the Scene
                      </span>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-600 mt-4">
                  Plus a free copy of Book 1. No spam, ever. Unsubscribe anytime.
                </p>

                <button
                  onClick={handleDismiss}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors underline"
                >
                  No thanks, I'll pass on the free scene
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
