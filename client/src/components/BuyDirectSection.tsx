import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Zap, Gift, Heart, Shield, ArrowRight } from "lucide-react";

interface BuyDirectSectionProps {
  retailPrice: number; // in cents
  directPrice: number; // in cents
  memberPrice: number; // in cents
  directSaleUrl?: string | null;
  amazonUrl?: string | null;
  bookTitle: string;
  isMember?: boolean;
}

export function BuyDirectSection({
  retailPrice,
  directPrice,
  memberPrice,
  directSaleUrl,
  amazonUrl,
  bookTitle,
  isMember = false,
}: BuyDirectSectionProps) {
  const formatPrice = (cents: number) => {
    if (cents === 0) return "FREE";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSavings = (original: number, sale: number) => {
    if (original === 0) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const currentPrice = isMember ? memberPrice : directPrice;
  const savingsPercent = calculateSavings(retailPrice, currentPrice);

  const benefits = [
    { icon: Zap, text: "Instant delivery to your device" },
    { icon: Gift, text: "Exclusive bonus chapter included" },
    { icon: Heart, text: "Support the author directly" },
    { icon: Shield, text: "30-day money-back guarantee" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 backdrop-blur-xl border-2 border-[#d4af37]/40 rounded-2xl p-6 md:p-8"
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="bg-[#d4af37] text-[#0a0e27] px-3 py-1 rounded-full text-sm font-bold">
            BEST VALUE
          </span>
          {savingsPercent > 0 && (
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              Save {savingsPercent}%
            </span>
          )}
        </div>
        {isMember && (
          <span className="text-[#d4af37] text-sm font-semibold">
            ✨ Reader's Club Member
          </span>
        )}
      </div>

      {/* Pricing Display */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl md:text-5xl font-bold text-[#d4af37]">
            {formatPrice(currentPrice)}
          </span>
          {retailPrice > currentPrice && (
            <span className="text-xl text-[#e5e5e5]/50 line-through">
              {formatPrice(retailPrice)}
            </span>
          )}
        </div>
        <p className="text-[#e5e5e5]/70 text-sm">
          {isMember ? "Reader's Club exclusive price" : "Buy direct and save!"}
        </p>
      </div>

      {/* Benefits List */}
      <div className="space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
              <benefit.icon className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-[#e5e5e5]/80 text-sm">{benefit.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Buy Direct Button */}
      {directSaleUrl ? (
        <a
          href={directSaleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold text-lg py-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#d4af37]/20">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Direct & Save {savingsPercent}%
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      ) : amazonUrl ? (
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold text-lg py-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#d4af37]/20">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Get Your Copy Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      ) : null}

      {/* Member Upsell */}
      {!isMember && memberPrice < directPrice && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-[#d4af37]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#e5e5e5] font-semibold text-sm">
                Reader's Club Members Pay Only {formatPrice(memberPrice)}
              </p>
              <p className="text-[#e5e5e5]/60 text-xs">
                Join free and save {calculateSavings(retailPrice, memberPrice)}% on all books
              </p>
            </div>
            <a href="/reader-club">
              <Button
                variant="outline"
                size="sm"
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
              >
                Join Free
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-[#d4af37]/20">
        <div className="flex items-center justify-center gap-4 text-[#e5e5e5]/50 text-xs">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Secure Checkout
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" /> Instant Delivery
          </span>
          <span>•</span>
          <span>All formats included</span>
        </div>
      </div>
    </motion.div>
  );
}

// Compact version for book cards
export function BuyDirectBadge({
  retailPrice,
  directPrice,
}: {
  retailPrice: number;
  directPrice: number;
}) {
  const savingsPercent = Math.round(((retailPrice - directPrice) / retailPrice) * 100);

  if (savingsPercent <= 0) return null;

  return (
    <div className="absolute top-3 left-3 z-10">
      <span className="bg-[#d4af37] text-[#0a0e27] px-2 py-1 rounded-full text-xs font-bold shadow-lg">
        Save {savingsPercent}%
      </span>
    </div>
  );
}
