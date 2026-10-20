import { motion } from "framer-motion";
import { DollarSign, Heart, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComparisonItem {
  feature: string;
  direct: string;
  retailer: string;
  directBetter: boolean;
}

const comparisons: ComparisonItem[] = [
  {
    feature: "Author Earnings",
    direct: "96% to Author",
    retailer: "35-70% to Author",
    directBetter: true,
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Where to read",
    description: "Retailer links for each title are on the book pages.",
  },
  {
    icon: Heart,
    title: "Support the Author",
    description: "I earn 96% from direct sales vs. 35-70% from retailers. Your support directly funds more books!",
  },
  {
    icon: Shield,
    title: "Money-Back Guarantee",
    description: "Not satisfied? Get a full refund within 30 days, no questions asked.",
  },
];

export function WhyBuyDirect() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#d4af37] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Why Buy Direct?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#e5e5e5] mb-6">
            Support the Author.
          </h2>
          <p className="text-[#e5e5e5]/70 text-lg max-w-2xl mx-auto">
            A direct sale returns more of the price to the author. Retailer links for each title are on the book pages.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl overflow-hidden mb-16"
        >
          <div className="grid grid-cols-3 bg-[#d4af37]/10 p-4 border-b border-[#d4af37]/20">
            <div className="text-[#e5e5e5]/60 font-semibold text-sm">Feature</div>
            <div className="text-center">
              <span className="bg-[#d4af37] text-[#0a0e27] px-3 py-1 rounded-full text-sm font-bold">
                Buy Direct
              </span>
            </div>
            <div className="text-center text-[#e5e5e5]/60 font-semibold text-sm">
              Retailers
            </div>
          </div>
          {comparisons.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-3 p-4 border-b border-[#d4af37]/10 last:border-b-0 hover:bg-white/5 transition-colors"
            >
              <div className="text-[#e5e5e5] font-medium">{item.feature}</div>
              <div className="text-center">
                <span
                  className={`font-semibold ${
                    item.directBetter ? "text-[#d4af37]" : "text-[#e5e5e5]/70"
                  }`}
                >
                  {item.direct}
                </span>
              </div>
              <div className="text-center text-[#e5e5e5]/50">{item.retailer}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-xl p-6 hover:border-[#d4af37]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#e5e5e5] mb-2">
                {benefit.title}
              </h3>
              <p className="text-[#e5e5e5]/70 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Author Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border-2 border-[#d4af37]/30 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                <Heart className="w-12 h-12 text-[#d4af37]" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold text-[#e5e5e5] mb-4">
                A Personal Note from Reese
              </h3>
              <p className="text-[#e5e5e5]/80 leading-relaxed mb-6">
                "When you buy from Amazon, I earn about $1.75 per book. When you buy direct, 
                I earn $4.80. That extra income lets me write full-time and create more of 
                the Manhattan Money Kings stories you love. Thank you for supporting independent authors!"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/books">
                  <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-semibold px-6 py-3">
                    Browse Books
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="/reader-club">
                  <Button
                    variant="outline"
                    className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 px-6 py-3"
                  >
                    Join Reader's Club (Free)
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Compact inline version for book pages
export function WhyBuyDirectInline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-[#d4af37]/20 rounded-xl p-4 mt-4"
    >
      <p className="text-[#e5e5e5]/70 text-sm leading-relaxed">
        <span className="text-[#d4af37] font-semibold">Why buy direct?</span> A direct sale returns more of the price to the author. 
        <a href="/why-buy-direct" className="text-[#d4af37] hover:underline ml-1">
          Learn more →
        </a>
      </p>
    </motion.div>
  );
}
