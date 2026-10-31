import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, CheckCircle, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ContentUpgrade {
  slug: string;
  title: string;
  description: string;
  ctaText: string;
  icon: "download" | "gift" | "sparkles";
}

const contentUpgrades: Record<string, ContentUpgrade> = {
  "ultimate-cozy-reading-night-setup": {
    slug: "ultimate-cozy-reading-night-setup",
    title: "Download the Cozy Reading Night Checklist",
    description:
      "Get the complete printable checklist with everything you need for the perfect reading night — plus 5 bonus cozy drink recipes.",
    ctaText: "Send Me the Checklist",
    icon: "download",
  },
  "romance-reader-gift-guide-2026": {
    slug: "romance-reader-gift-guide-2026",
    title: "Get the Full 50-Item Gift Guide",
    description:
      "The blog only covers the highlights. Get the complete 50-item curated gift guide with direct links and price comparisons.",
    ctaText: "Send the Full Guide",
    icon: "gift",
  },
  "5-tips-writing-steamy-scenes": {
    slug: "5-tips-writing-steamy-scenes",
    title: "Free: My 10-Point Steamy Scene Checklist",
    description:
      "The blog gives you 5 tips — but my private checklist covers all 10 elements that make a steamy scene unforgettable.",
    ctaText: "Get the Checklist",
    icon: "sparkles",
  },
  "behind-scenes-manhattan-money-kings": {
    slug: "behind-scenes-manhattan-money-kings",
    title: "Exclusive Character Profiles & Family Tree",
    description:
      "Get the full character dossiers, family tree, and timeline of the Manhattan Money Kings world — including details that never made it into the books.",
    ctaText: "Send Me the Profiles",
    icon: "sparkles",
  },
  "how-to-start-romance-book-club": {
    slug: "how-to-start-romance-book-club",
    title: "Book Club Discussion Guide, Free When You Join My Newsletter",
    description:
      "Download the complete discussion guide for The First Acquisition — 25 questions, character analysis prompts, and wine pairing suggestions.",
    ctaText: "Get the Guide",
    icon: "download",
  },
};

interface BlogContentUpgradeProps {
  blogSlug: string;
}

export function BlogContentUpgrade({ blogSlug }: BlogContentUpgradeProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const upgrade = contentUpgrades[blogSlug];
  if (!upgrade) return null;

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(true);
      toast.success("Check your inbox! Your content upgrade is on its way.");
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        setIsSubscribed(true);
        toast.info("You're already on the list! We'll send it to your inbox.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim() });
  };

  const IconComponent =
    upgrade.icon === "download" ? Download : upgrade.icon === "gift" ? Gift : Sparkles;

  if (isSubscribed) {
    return (
      <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border border-[#B59A6A]/30">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-6 w-6 text-[#7A4F4C]" />
          <h3 className="font-serif text-xl font-bold text-[#4A3B3A]">You're In!</h3>
        </div>
        <p className="text-[#6E5F5A]">
          Check your inbox — your content upgrade is on its way. While you wait, why not explore the{" "}
          <a href="/books" className="text-[#7A4F4C] hover:underline">
            Manhattan Money Kings series
          </a>
          ?
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] border border-[#B59A6A]/20 relative overflow-hidden">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A3A0]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C9A3A0]/10">
            <IconComponent className="h-5 w-5 text-[#7A4F4C]" />
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/20">
            <span className="text-xs text-[#7A4F4C] font-medium tracking-wider uppercase">
              Bonus Content
            </span>
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#4A3B3A] mb-2">{upgrade.title}</h3>
        <p className="text-[#6E5F5A] mb-6">{upgrade.description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-[#EBD6D3]/30 border-[#4A3B3A]/10 text-[#4A3B3A] placeholder:text-[#6E5F5A] rounded-full px-6 py-5 focus:border-[#B59A6A]/50 focus:ring-[#C9A3A0]/20"
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-8 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {subscribeMutation.isPending ? "Sending..." : upgrade.ctaText}
          </Button>
        </form>

        <p className="text-xs text-[#6E5F5A] mt-3">
          Plus a romance novel, free when you join my newsletter. No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
