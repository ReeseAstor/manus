import { useState, useEffect } from "react";
import { X, BookOpen, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Success! Check your email for your free book!");
      setIsVisible(false);
      localStorage.setItem("emailPopupDismissed", "true");
      // Redirect to BookFunnel download page
      window.open("https://dl.bookfunnel.com/xrodg0t77p", "_blank");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    // Check if popup was already dismissed
    const dismissed = localStorage.getItem("emailPopupDismissed");
    if (dismissed) return;

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    subscribeMutation.mutate({ email });
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("emailPopupDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-primary/30 rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Sparkle icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-4 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-serif font-bold text-center mb-2 text-foreground">
            Get Your Free Book!
          </h2>
          
          <p className="text-center text-muted-foreground mb-6">
            Join my reader community and get <span className="text-primary font-semibold">The Billionaire's One Night Stand</span> absolutely free!
          </p>

          {/* Book cover preview */}
          <div className="flex justify-center mb-6">
            <img 
              src="/Yung-LungChenebook.jpg" 
              alt="The Billionaire's One Night Stand"
              className="h-48 w-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-primary/30 focus:border-primary"
              disabled={isSubmitting}
              required
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isSubmitting}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {isSubmitting ? "Sending..." : "Send Me My Free Book!"}
            </Button>
          </form>

          {/* No thanks button */}
          <button
            onClick={handleClose}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I'll pass on the free book
          </button>

          {/* Trust badge */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            🔒 Your email is safe. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </>
  );
}
