import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { RetailerButtons } from "@/components/author-kit";
import { BOOKS, LANE_META } from "@/data/books";

export default function Shop() {
  useEffect(() => {
    document.title = "Books | Reese Astor";
  }, []);

  const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Reese Astor Books",
    url: "https://www.reeseastor.com/shop",
    description: "Reese Astor titles, with links to the stores that carry them.",
    brand: { "@type": "Brand", name: "Reese Astor" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
      <EnhancedSEOHead
        title="Books | Reese Astor"
        description="Every Reese Astor title, with links to the stores that carry it."
        canonical="https://www.reeseastor.com/shop"
        ogType="website"
        keywords={["Reese Astor books", "Manhattan Money Kings", "Hudson Dynasty"]}
        structuredData={[shopStructuredData]}
      />

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF7F7]/80 to-[#FAF7F7]" />
        <div className="container max-w-6xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3B3A] mb-6">
              Books by
              <br />
              <span className="text-[#7A4F4C]">Reese Astor</span>
            </h1>
            <p className="text-xl text-[#4A3B3A]/70 max-w-2xl mx-auto mb-8">
              Every Reese Astor title, with links to your favorite store.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#FAF7F7]/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOOKS.map((book, index) => (
              <motion.div
                key={book.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="relative bg-[#EBD6D3]/30 backdrop-blur-xl border border-[#B59A6A]/20 rounded-2xl overflow-hidden hover:border-[#B59A6A]/40 transition-all h-full">
                  <Link href={`/books/${book.slug}`}>
                    <div className="relative overflow-hidden cursor-pointer">
                      <img
                        src={book.cover_image ?? undefined}
                        alt={`${book.title} — cover`}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/books/${book.slug}`}>
                      <h2 className="text-lg font-serif font-bold text-[#4A3B3A] mb-1 line-clamp-2 group-hover:text-[#7A4F4C] transition-colors cursor-pointer">
                        {book.title}
                      </h2>
                    </Link>
                    <p className="text-[#4A3B3A]/50 text-xs mb-3">
                      {LANE_META[book.lane].title}
                      {book.position_label ? ` • ${book.position_label}` : ""}
                    </p>
                    {book.price_usd === 0 && (
                      <p className="text-xl font-bold text-[#7A4F4C] mb-4">Free</p>
                    )}
                    <RetailerButtons book={book} layout="grid" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border-2 border-[#B59A6A]/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <Gift className="w-16 h-16 text-[#7A4F4C] mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-[#4A3B3A] mb-4">
              Join the Reader's Club
            </h2>
            <p className="text-[#4A3B3A]/70 text-lg mb-8 max-w-2xl mx-auto">
              New-release news from Reese Astor. The First Acquisition, the Hudson Dynasty prequel, is free.
            </p>
            <Link href="/free-book">
              <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold text-lg px-8 py-6 rounded-xl">
                Join Reader's Club
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
