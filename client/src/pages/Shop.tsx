import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gift, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

// Map book slugs to product IDs
const bookProductMap: Record<string, number> = {
  "the-billionaires-executive-assistant": 30004,
  "the-billionaires-fake-wife": 30005,
  "the-billionaires-baby-secret": 30006,
};

export default function Shop() {
  useEffect(() => {
    document.title = "Shop | Reese Astor Romance Books";
  }, []);

  const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Reese Astor Book Shop",
    "url": "https://reeseastor.com/shop",
    "description": "Buy Reese Astor's ebooks directly from the author.",
    "brand": { "@type": "Brand", "name": "Reese Astor" }
  };

  const { data: books } = trpc.books.list.useQuery();
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handlePurchase = async (productId: number, productName: string) => {
    setLoadingProductId(productId);
    try {
      const result = await createCheckout.mutateAsync({
        productId,
        successUrl: `${window.location.origin}/purchase-success?product=${encodeURIComponent(productName)}`,
        cancelUrl: `${window.location.origin}/shop`,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Unable to start checkout. Please try again.");
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleBookPurchase = async (bookSlug: string, bookTitle: string) => {
    const productId = bookProductMap[bookSlug];
    if (!productId) {
      toast.error("This book is not available for direct purchase yet.");
      return;
    }
    await handlePurchase(productId, bookTitle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <EnhancedSEOHead
        title="Shop | Reese Astor Romance Books"
        description="Buy Reese Astor's Manhattan Money Kings ebooks directly from the author."
        canonical="/shop"
        ogType="product"
        keywords={["Reese Astor shop", "Manhattan Money Kings ebooks", "buy direct from author"]}
        structuredData={[shopStructuredData]}
      />

      {/* Social Proof Banner */}

      {/* Recent Purchase Toast Notifications */}

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/manhattan-night.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e27]/80 to-[#0a0e27]" />

        <div className="container max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#e5e5e5] mb-6">
              Manhattan Money Kings
              <br />
              <span className="text-[#d4af37]">Book Shop</span>
            </h1>
            <p className="text-xl text-[#e5e5e5]/70 max-w-2xl mx-auto mb-8">
              Buy the ebooks directly from the author. After checkout, a confirmation
              email with a link to your book is sent to the address you provide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Individual Books */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0a0e27]/50">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-4">
              Books
            </h2>
            <p className="text-[#e5e5e5]/70 text-lg">
              The ebooks are also available on Amazon; see the book pages for links.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books?.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 transition-all">
                  {/* Book Cover */}
                  <Link href={`/books/${book.slug}`}>
                    <div className="relative overflow-hidden cursor-pointer">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Book Info */}
                  <div className="p-4">
                    <Link href={`/books/${book.slug}`}>
                      <h3 className="text-lg font-serif font-bold text-[#e5e5e5] mb-1 line-clamp-2 group-hover:text-[#d4af37] transition-colors cursor-pointer">
                        {book.title}
                      </h3>
                    </Link>
                    {book.series && (
                      <p className="text-[#e5e5e5]/50 text-xs mb-3">
                        {book.series} • Book {book.seriesOrder}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-[#d4af37]">
                        {formatPrice(book.directPrice || 399)}
                      </span>
                    </div>

                    {/* Buy Button */}
                    <Button
                      onClick={() => handleBookPurchase(book.slug, book.title)}
                      disabled={loadingProductId === bookProductMap[book.slug]}
                      className="w-full bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/30 font-semibold"
                    >
                      {loadingProductId === bookProductMap[book.slug] ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      {loadingProductId === bookProductMap[book.slug] ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy Direct CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border-2 border-[#d4af37]/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <Gift className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-[#e5e5e5] mb-4">
              Start With the Free Prequel
            </h2>
            <p className="text-[#e5e5e5]/70 text-lg mb-8 max-w-2xl mx-auto">
              The First Acquisition is a free prequel novella to the Hudson Dynasty
              series. Join the newsletter to get it, along with new release alerts.
            </p>
            <Link href="/free-book">
              <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold text-lg px-8 py-6 rounded-xl">
                Get the Free Book
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
