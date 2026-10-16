import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ExternalLink, Star, ShoppingCart, Search, Filter, ArrowUp, Sparkles } from "lucide-react";
import { favoritesCategories, allFavoritesProducts } from "@/data/favoritesProducts";
import { FTCDisclosure } from "@/components/AffiliateProductCard";
import { trpc } from "@/lib/trpc";

export default function Favorites() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const trackClick = trpc.affiliateTracking.trackClick.useMutation();

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 600);
  };

  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleProductClick = (productName: string, affiliateUrl: string) => {
    trackClick.mutate({
      productName,
      affiliateUrl,
      sourceSlug: "reeses-favorites",
      clickType: "favorites",
    });
  };

  // Filter products
  const filteredCategories = favoritesCategories
    .filter(cat => !activeCategory || cat.id === activeCategory)
    .map(cat => ({
      ...cat,
      products: cat.products.filter(p =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(cat => cat.products.length > 0);

  const totalProducts = filteredCategories.reduce((sum, cat) => sum + cat.products.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#d4af37]/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6">
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <span className="text-[#d4af37] text-sm font-bold uppercase tracking-wider">Curated by Reese</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Reese's <span className="text-[#d4af37]">Favorites</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
              My personally curated collection of products I actually use and love — from the reading pillow that changed my life to the candle that smells like a Manhattan library.
            </p>

            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Every product on this page is something I've personally tried and genuinely recommend. No filler, no fluff — just the things that make reading and writing better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FTC Disclosure */}
      <div className="max-w-6xl mx-auto px-6">
        <FTCDisclosure />
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  !activeCategory
                    ? "bg-[#d4af37] text-black"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                All ({allFavoritesProducts.length})
              </button>
              {favoritesCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#d4af37] text-black"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.emoji} {cat.title} ({cat.products.length})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <AnimatePresence mode="wait">
          {filteredCategories.map((category, catIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              id={category.id}
            >
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{category.emoji}</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                    {category.title}
                  </h2>
                </div>
                <p className="text-gray-400 text-sm ml-12">
                  {category.subtitle}
                </p>
                <div className="w-24 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent mt-4 ml-12" />
              </div>

              {/* Product Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {category.products.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#d4af37]/40 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/5"
                  >
                    <div className="p-6 space-y-4">
                      {/* Product Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-[#d4af37]/80 font-medium text-sm mt-1">
                            {product.priceRange}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
                          <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
                        </div>
                      </div>

                      {/* Rating Stars */}
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!)
                                  ? "text-[#d4af37] fill-[#d4af37]"
                                  : i < product.rating!
                                  ? "text-[#d4af37] fill-[#d4af37]/50"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {product.description}
                      </p>

                      {/* Why Recommend - Personal Touch */}
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10">
                        <Sparkles className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-wider block mb-1">Reese's Take:</span>
                          <p className="text-gray-300 text-xs leading-relaxed italic">"{product.whyRecommend}"</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        onClick={() => handleProductClick(product.name, product.affiliateUrl)}
                        className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/20"
                      >
                        Check Price on Amazon
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#d4af37]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No products match your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="mt-4 text-[#d4af37] hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
            Have a Product Suggestion?
          </h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            I'm always looking for new products to try. If you've found something amazing that belongs on this page, let me know! Send me a message through the{" "}
            <a href="/contact" className="text-[#d4af37] underline underline-offset-2 hover:no-underline">contact page</a>{" "}
            or reply to any of my newsletters.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>{allFavoritesProducts.length} products curated</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>{favoritesCategories.length} categories</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Updated regularly</span>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/20 transition-all z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
