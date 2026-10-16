import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Mail, ExternalLink, ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function MyPurchases() {
  useEffect(() => {
    document.title = "My Purchases | Reese Astor";
  }, []);

  const { data: orders, isLoading } = trpc.stripe.getMyOrdersWithProducts.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <section className="relative py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-4 py-2 text-[#d4af37] text-sm font-semibold mb-6">
              <ShoppingCart className="w-4 h-4" />
              Your Library
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#e5e5e5] mb-4">
              My Purchases
            </h1>
            <p className="text-[#e5e5e5]/60 text-lg">
              Find the links to your purchased books.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl p-12 text-center"
            >
              <ShoppingCart className="w-16 h-16 text-[#d4af37]/40 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold text-[#e5e5e5] mb-4">
                No Purchases Yet
              </h2>
              <p className="text-[#e5e5e5]/60 mb-8 max-w-md mx-auto">
                You haven't made any purchases yet. Browse our collection and start your Manhattan journey.
              </p>
              <Link href="/books">
                <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold px-8 py-6 rounded-xl">
                  Browse Books
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold text-[#e5e5e5]">
                      {order.productName}
                    </h3>
                    <p className="text-[#e5e5e5]/50 text-sm mt-1">
                      {order.productDescription}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[#e5e5e5]/40">
                      <span>{formatDate(order.createdAt)}</span>
                      <span className="text-[#d4af37] font-semibold">
                        {formatPrice(order.amount)}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {order.downloadUrl ? (
                      <a
                        href={order.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold">
                          <Download className="w-4 h-4 mr-2" />
                          Open book link
                        </Button>
                      </a>
                    ) : (
                      <Link href="/books">
                        <Button variant="outline" className="border-[#d4af37]/30 text-[#e5e5e5]">
                          <BookOpen className="w-4 h-4 mr-2" />
                          View in Shop
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-[#e5e5e5]/40 text-sm">
              Need help with your purchase? Contact us at{" "}
              <a
                href="mailto:support@reeseastor.us"
                className="text-[#d4af37] hover:underline"
              >
                support@reeseastor.us
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
