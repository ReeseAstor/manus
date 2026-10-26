import { motion } from "framer-motion";
import { BookOpen, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: BookOpen,
    title: "Where to read",
    description: "Retailer links for each title are on the book pages.",
  },
];

export function WhyBuyDirect() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#FAF7F7] to-[#F0E6E5]">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#7A4F4C] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Where to read
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3B3A] mb-6">
            Find a title.
          </h2>
          <p className="text-[#4A3B3A]/70 text-lg max-w-2xl mx-auto">
            Retailer links for each title are on the book pages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#EBD6D3]/30 backdrop-blur-xl border border-[#B59A6A]/20 rounded-xl p-6 hover:border-[#B59A6A]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C9A3A0]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A3A0]/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-[#7A4F4C]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A3B3A] mb-2">
                {benefit.title}
              </h3>
              <p className="text-[#4A3B3A]/70 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border-2 border-[#B59A6A]/30 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#C9A3A0]/20 flex items-center justify-center">
                <Heart className="w-12 h-12 text-[#7A4F4C]" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold text-[#4A3B3A] mb-4">
                A Personal Note from Reese
              </h3>
              <p className="text-[#4A3B3A]/80 leading-relaxed mb-6">
                Thank you for reading. Each title lists the retailers that carry it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/books">
                  <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-semibold px-6 py-3">
                    Browse Books
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="/reader-club">
                  <Button
                    variant="outline"
                    className="border-[#B59A6A]/30 text-[#7A4F4C] hover:bg-[#C9A3A0]/10 px-6 py-3"
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

/** Compact note for book pages. No link to the retired direct-sales URL. */
export function WhyBuyDirectInline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#EBD6D3]/30 border border-[#B59A6A]/20 rounded-xl p-4 mt-4"
    >
      <p className="text-[#4A3B3A]/70 text-sm leading-relaxed">
        <span className="text-[#7A4F4C] font-semibold">Where to read.</span> Retailer links for each title are on the book pages.
      </p>
    </motion.div>
  );
}
