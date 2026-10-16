import { motion } from "framer-motion";
import { Shield, Mail, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// What buying direct actually involves, limited to what the site's code does:
// Stripe-hosted checkout, a confirmation email with a link to the book, and the
// same titles being available on Amazon.
const points = [
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "Payment is handled by Stripe.",
  },
  {
    icon: Mail,
    title: "Delivery by Email",
    description: "After checkout, a confirmation email with a link to your book on Amazon is sent to the address you provide.",
  },
  {
    icon: BookOpen,
    title: "Also on Amazon",
    description: "The ebooks are also available on Amazon. The links are on each book page.",
  },
];

export function WhyBuyDirect() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#d4af37] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Buying Direct
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#e5e5e5] mb-6">
            Buy the Books From the Author
          </h1>
          <p className="text-[#e5e5e5]/70 text-lg max-w-2xl mx-auto">
            You can buy my ebooks straight from this site, or from Amazon. Here is how buying direct works.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-xl p-6 hover:border-[#d4af37]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                <point.icon className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#e5e5e5] mb-2">{point.title}</h3>
              <p className="text-[#e5e5e5]/70 text-sm leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/books">
            <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-semibold px-6 py-3">
              Browse the Books
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="/books">
            <Button
              variant="outline"
              className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 px-6 py-3"
            >
              Browse Books
            </Button>
          </a>
        </div>
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
        <span className="text-[#d4af37] font-semibold">Buying direct:</span> secure checkout on this
        site, with your book link sent by email.
        <a href="/why-buy-direct" className="text-[#d4af37] hover:underline ml-1">
          How it works →
        </a>
      </p>
    </motion.div>
  );
}
