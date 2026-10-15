import { motion, AnimatePresence } from "framer-motion";
import { Users, Star, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const readerReviews = [
  { name: "Sarah M.", text: "I devoured the entire trilogy in one weekend!", rating: 5 },
  { name: "Jessica R.", text: "The chemistry between the leads is unmatched.", rating: 5 },
  { name: "Amanda K.", text: "Best billionaire romance I've read this year.", rating: 5 },
  { name: "Rachel T.", text: "I couldn't put it down — stayed up until 3am!", rating: 5 },
  { name: "Emily W.", text: "The plot twists had me gasping out loud.", rating: 5 },
  { name: "Lauren B.", text: "Reese Astor is now an auto-buy author for me.", rating: 5 },
  { name: "Megan D.", text: "Steamy, emotional, and absolutely addictive.", rating: 5 },
  { name: "Christina H.", text: "The Manhattan setting is so vivid and glamorous.", rating: 5 },
];

export function SocialProofBanner() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % readerReviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#d4af37]/5 border-y border-[#d4af37]/20 py-4">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Trust Badges */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#e5e5e5]/70 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Steamy billionaire romance</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[#e5e5e5]/70 text-sm">
              <Users className="w-4 h-4 text-[#d4af37]" />
              <span>Loved by romance readers</span>
            </div>
          </div>

          {/* Rotating Reviews */}
          <div className="flex items-center gap-2 min-h-[24px]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentReview}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-[#e5e5e5]/70 text-sm italic"
              >
                "{readerReviews[currentReview].text}" — {readerReviews[currentReview].name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
