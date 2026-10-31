import { motion } from "framer-motion";
import { 
  Gift, 
  Mail, 
  Users, 
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
    icon: Gift,
    title: "Newsletter Prequel",
    description: "Get The First Acquisition free when you join my newsletter. It is the Hudson Dynasty prequel.",
    highlight: "NEWSLETTER GIFT",
  },
  {
    icon: Mail,
    title: "New-release news",
    description: "Notes from Reese Astor when a new book is out.",
  },
];

export function MemberBenefits() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#FAF7F7]/50">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#C9A3A0]/10 border border-[#B59A6A]/30 rounded-full px-4 py-2 text-[#7A4F4C] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            No Cost to Join
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3B3A] mb-6">
            Member Benefits
          </h2>
          <p className="text-[#4A3B3A]/70 text-lg max-w-2xl mx-auto">
            New-release news from Reese Astor, and The First Acquisition free when you join my newsletter.
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
              className="relative bg-[#EBD6D3]/30 backdrop-blur-xl border border-[#B59A6A]/20 rounded-2xl p-6 hover:border-[#B59A6A]/40 transition-all group"
            >
              {benefit.highlight && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-[#4A3B3A] text-[#FAF7F7] px-3 py-1 rounded-full text-xs font-bold">
                    {benefit.highlight}
                  </span>
                </div>
              )}
              
              <div className="w-14 h-14 rounded-xl bg-[#C9A3A0]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A3A0]/20 transition-colors">
                <benefit.icon className="w-7 h-7 text-[#7A4F4C]" />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-[#4A3B3A] mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-[#4A3B3A]/70 text-sm leading-relaxed">
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
          className="bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border-2 border-[#B59A6A]/30 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regular Readers */}
            <div className="bg-[#EBD6D3]/30 rounded-xl p-6 border border-[#4A3B3A]/10">
              <h3 className="text-xl font-semibold text-[#4A3B3A]/60 mb-6">
                Regular Readers
              </h3>
              <ul className="space-y-4">
                {[
                  "Retailer editions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#4A3B3A]/50">
                    <div className="w-5 h-5 rounded-full border border-[#E5D6D3]/30 flex items-center justify-center">
                      <span className="text-xs">✕</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reader's Club Members */}
            <div className="bg-[#C9A3A0]/10 rounded-xl p-6 border-2 border-[#B59A6A]/40 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#4A3B3A] text-[#FAF7F7] px-4 py-1 rounded-full text-sm font-bold">
                  RECOMMENDED
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#7A4F4C] mb-6">
                Reader's Club Members
              </h3>
              <ul className="space-y-4">
                {[
                  "The First Acquisition, free when you join my newsletter",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#4A3B3A]">
                    <div className="w-5 h-5 rounded-full bg-[#4A3B3A] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#4A3B3A]" />
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
    <div className="inline-flex items-center gap-2 bg-[#C9A3A0]/10 border border-[#B59A6A]/30 rounded-lg px-3 py-2">
      <Users className="w-4 h-4 text-[#7A4F4C]" />
      <span className="text-[#4A3B3A] text-sm">
        <span className="text-[#7A4F4C] font-semibold">Reader's Club:</span> new-release news
      </span>
    </div>
  );
}
