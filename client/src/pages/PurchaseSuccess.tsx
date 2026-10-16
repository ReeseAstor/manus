import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, BookOpen, Mail, ArrowRight } from "lucide-react";
import { Link, useSearch } from "wouter";

export default function PurchaseSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const productName = params.get("product");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/30 rounded-3xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-green-400" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-4">
              Thank You for Your Purchase!
            </h1>
            <p className="text-[#e5e5e5]/70 text-lg mb-2">
              {productName ? (
                <>Your order for <span className="text-[#d4af37] font-semibold">{productName}</span> is confirmed.</>
              ) : (
                <>Your order is confirmed.</>
              )}
            </p>
            <p className="text-[#e5e5e5]/60 text-sm mb-8">
              A confirmation email with a link to your book has been sent to your email address.
            </p>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-serif font-bold text-[#e5e5e5] mb-4">
              What's Next?
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-[#e5e5e5] font-semibold">Check Your Email</h3>
                  <p className="text-[#e5e5e5]/60 text-sm">
                    Your book link is waiting in your inbox. Check spam if you don't see it.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-[#e5e5e5] font-semibold">Open Your Book</h3>
                  <p className="text-[#e5e5e5]/60 text-sm">
                    Your book is delivered through its Amazon Kindle page. The link in the email opens it.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-[#e5e5e5] font-semibold">Start Reading!</h3>
                  <p className="text-[#e5e5e5]/60 text-sm">
                    Dive into the world of Manhattan's billionaires. Enjoy!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/newsletter">
              <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold px-8 py-6 rounded-xl">
                Get the Free Book &amp; Updates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/books">
              <Button 
                variant="outline" 
                className="border-2 border-[#d4af37]/30 bg-transparent hover:bg-white/5 text-[#e5e5e5] font-semibold px-8 py-6 rounded-xl"
              >
                Browse More Books
              </Button>
            </Link>
          </motion.div>

          {/* Support Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#e5e5e5]/50 text-sm mt-8"
          >
            Need help? Contact us at{" "}
            <a href="mailto:info@reeseastor.com" className="text-[#d4af37] hover:underline">
              info@reeseastor.com
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
