import { WhyBuyDirect } from "@/components/WhyBuyDirect";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function WhyBuyDirectPage() {
  useEffect(() => {
    document.title = "Why Buy Direct from Reese Astor | Support Your Author";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <EnhancedSEOHead
        title="Why Buy Direct from Reese Astor | Support Your Author"
        description="Learn why buying directly from Reese Astor means more royalties for the author."
        canonical="/why-buy-direct"
        keywords={["buy direct from author", "support romance authors", "author royalties", "buy books direct"]}
      />

      {/* Back Navigation */}
      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <Link href="/shop">
          <Button
            variant="ghost"
            className="text-[#e5e5e5]/70 hover:text-[#d4af37] hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
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
                q: "What formats do I receive when I buy direct?",
                a: "You'll receive your book in ePub, Mobi (Kindle), and PDF formats. This means you can read on any device - Kindle, Kobo, Nook, iPad, phone, or computer.",
              },
              {
                q: "How do I get my book after purchase?",
                a: "Immediately after purchase, you'll receive an email with download links for all formats. You can download your book instantly - no waiting!",
              },
              {
                q: "Can I read direct purchases on my Kindle?",
                a: "Yes! You'll receive a Mobi file that works perfectly on Kindle. You can either email it to your Kindle or transfer via USB. We include simple instructions with your purchase.",
              },
              {
                q: "What if I'm not satisfied with my purchase?",
                a: "I offer a 30-day money-back guarantee on all direct purchases. If you're not happy for any reason, just email me and I'll refund your purchase - no questions asked.",
              },
              {
                q: "Do direct purchases include the same content as Amazon?",
                a: "Direct purchases include MORE content! You get the complete book plus exclusive bonus chapters, deleted scenes, and behind-the-scenes content not available anywhere else.",
              },
              {
                q: "How much more does the author earn from direct sales?",
                a: "When you buy from Amazon, I earn about 35-70% depending on the price. When you buy direct, I earn 96% of the sale price. Your support directly funds more books!",
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
