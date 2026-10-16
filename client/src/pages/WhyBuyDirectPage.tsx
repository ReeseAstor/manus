import { WhyBuyDirect } from "@/components/WhyBuyDirect";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function WhyBuyDirectPage() {
  useEffect(() => {
    document.title = "Buying Direct from Reese Astor | How It Works";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <EnhancedSEOHead
        title="Buying Direct from Reese Astor | How It Works"
        description="How buying a Reese Astor ebook directly from this site works: Stripe checkout and a book link sent by email."
        canonical="/why-buy-direct"
        keywords={["buy direct from author", "Reese Astor ebooks", "buy books direct"]}
      />

      {/* Back Navigation */}
      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <Link href="/books">
          <Button
            variant="ghost"
            className="text-[#e5e5e5]/70 hover:text-[#d4af37] hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <WhyBuyDirect />

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif font-bold text-[#e5e5e5] mb-12 text-center"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                q: "How do I get my book after purchase?",
                a: "After checkout, a confirmation email with a link to your book on Amazon is sent to the address you provide. If it does not arrive, check your spam folder.",
              },
              {
                q: "Where else can I buy the books?",
                a: "The ebooks are also available on Amazon. You will find the links on each book page.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-[#e5e5e5] mb-3">
                  {faq.q}
                </h3>
                <p className="text-[#e5e5e5]/70 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
