import { motion } from "framer-motion";
import { 
  Gift, 
  Percent, 
  Clock, 
  BookOpen, 
  Mail, 
  Users, 
  Star,
  Sparkles,
  Check
} from "lucide-react";

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
}

const benefits: Benefit[] = [
  {
    icon: Percent,
    title: "40% Off All Books",
    description: "Exclusive member pricing on every book in the Manhattan Money Kings series and future releases.",
    highlight: "SAVE 40%",
  },
  {
    icon: Clock,
    title: "Early Access",
    description: "Read new releases 10-14 days before they hit Amazon. Be the first to discover what happens next!",
    highlight: "2 WEEKS EARLY",
  },
  {
    icon: Gift,
    title: "Free Book",
    description: "Get 'The First Acquisition' absolutely free when you join. Start the Manhattan Money Kings series from the beginning!",
    highlight: "FREE BOOK",
  },
  {
    icon: BookOpen,
    title: "Bonus Chapters",
    description: "Exclusive scenes and extended epilogues not available anywhere else. See your favorite characters' stories continue.",
  },
  {
    icon: Star,
    title: "Character Interviews",
    description: "Go behind the scenes with exclusive Q&A sessions with your favorite Manhattan Money Kings characters.",
  },
  {
    icon: Mail,
    title: "Author Updates",
    description: "Monthly newsletter with writing updates, sneak peeks, and exclusive giveaways for members only.",
  },
];

export function MemberBenefits() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0a0e27]/50">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-4 py-2 text-[#d4af37] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            100% Free to Join
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#e5e5e5] mb-6">
            Member Benefits
          </h2>
          <p className="text-[#e5e5e5]/70 text-lg max-w-2xl mx-auto">
            Join thousands of romance readers who enjoy exclusive perks, early access, 
            and special member-only content.
          </p>
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
              className="relative bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/40 transition-all group"
            >
              {benefit.highlight && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-[#d4af37] text-[#0a0e27] px-3 py-1 rounded-full text-xs font-bold">
                    {benefit.highlight}
                  </span>
                </div>
              )}
              
              <div className="w-14 h-14 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                <benefit.icon className="w-7 h-7 text-[#d4af37]" />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-[#e5e5e5] mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-[#e5e5e5]/70 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border-2 border-[#d4af37]/30 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regular Readers */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-[#e5e5e5]/60 mb-6">
                Regular Readers
              </h3>
              <ul className="space-y-4">
                {[
                  "Pay full retail price",
                  "Wait for Amazon release",
                  "Standard book content only",
                  "No bonus chapters",
                  "No early access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#e5e5e5]/50">
                    <div className="w-5 h-5 rounded-full border border-[#e5e5e5]/30 flex items-center justify-center">
                      <span className="text-xs">✕</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reader's Club Members */}
            <div className="bg-[#d4af37]/10 rounded-xl p-6 border-2 border-[#d4af37]/40 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#d4af37] text-[#0a0e27] px-4 py-1 rounded-full text-sm font-bold">
                  RECOMMENDED
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#d4af37] mb-6">
                Reader's Club Members
              </h3>
              <ul className="space-y-4">
                {[
                  "40% off all books",
                  "10-14 days early access",
                  "Exclusive bonus chapters",
                  "Character interviews",
                  "Free copy of The First Acquisition",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#e5e5e5]">
                    <div className="w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#0a0e27]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Compact version for other pages
export function MemberBenefitsBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg px-3 py-2">
      <Users className="w-4 h-4 text-[#d4af37]" />
      <span className="text-[#e5e5e5] text-sm">
        <span className="text-[#d4af37] font-semibold">Reader's Club:</span> 40% off + early access
      </span>
    </div>
  );
}
