import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface BlogToShopBridgeProps {
  /** The category of the blog post to show relevant recommendation */
  category?: string;
}

const recommendations: Record<string, { title: string; tagline: string; bookSlug: string; bookTitle: string }> = {
  "writing-tips": {
    title: "See These Techniques in Action",
    tagline: "Discover how Reese Astor weaves tension, chemistry, and plot twists into the Manhattan Money Kings series.",
    bookSlug: "the-billionaire-s-executive-assistant",
    bookTitle: "The Billionaire's Executive Assistant",
  },
  "book-news": {
    title: "The Newest Hudson Dynasty Book",
    tagline: "Golden Parachute: Kai Hsu, Miri Doyle-Levine, and the one deal he can't buy his way out of.",
    bookSlug: "golden-parachute",
    bookTitle: "Golden Parachute",
  },
  "behind-the-scenes": {
    title: "Experience the Full Story",
    tagline: "You've seen behind the curtain. Now experience the world of Manhattan's most powerful billionaires.",
    bookSlug: "the-billionaire-s-executive-assistant",
    bookTitle: "The Billionaire's Executive Assistant",
  },
  default: {
    title: "Ready for Your Next Obsession?",
    tagline: "Start the Manhattan Money Kings: steamy billionaire romance, every book a standalone.",
    bookSlug: "the-billionaire-s-executive-assistant",
    bookTitle: "The Billionaire's Executive Assistant",
  },
};

export function BlogToShopBridge({ category }: BlogToShopBridgeProps) {
  const rec = recommendations[category || ""] || recommendations.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border border-[#B59A6A]/30 rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="bg-[#C9A3A0]/20 rounded-lg p-3 flex-shrink-0 hidden md:block">
          <BookOpen className="w-6 h-6 text-[#7A4F4C]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold text-[#4A3B3A] mb-2">
            {rec.title}
          </h3>
          <p className="text-[#4A3B3A]/70 mb-4">
            {rec.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/books">
              <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-semibold">
                Browse the Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={`/books/${rec.bookSlug}`}>
              <Button variant="outline" className="border-[#B59A6A]/30 text-[#7A4F4C] hover:bg-[#C9A3A0]/10">
                Start with {rec.bookTitle}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
