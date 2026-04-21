import { motion } from "framer-motion";
import { ExternalLink, Star, ShoppingCart } from "lucide-react";

export interface AffiliateProduct {
  name: string;
  affiliateUrl: string;
  description: string;
  whyRecommend: string;
  priceRange: string;
  rating?: number;
  imageUrl?: string;
}

interface AffiliateProductCardProps {
  product: AffiliateProduct;
  index: number;
}

export function AffiliateProductCard({ product, index }: AffiliateProductCardProps) {
  return (
    <motion.div
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
            <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors leading-tight">
              {product.name}
            </h4>
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

        {/* Why Recommend */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">Why I love it:</span>
          <p className="text-gray-300 text-xs leading-relaxed">{product.whyRecommend}</p>
        </div>

        {/* CTA Button */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/20"
        >
          Check Price on Amazon
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#d4af37]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

interface AffiliateProductSectionProps {
  products: AffiliateProduct[];
  title?: string;
  subtitle?: string;
}

export function AffiliateProductSection({ products, title = "Top Picks", subtitle = "Recommended products from this article" }: AffiliateProductSectionProps) {
  return (
    <div className="my-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
          <ShoppingCart className="w-4 h-4 text-[#d4af37]" />
          <span className="text-[#d4af37] text-sm font-bold uppercase tracking-wider">{title}</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
          {subtitle}
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <AffiliateProductCard key={index} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

export function FTCDisclosure() {
  return (
    <div className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/10">
      <p className="text-gray-500 text-xs leading-relaxed italic">
        <span className="font-semibold text-gray-400">Disclosure:</span>{" "}
        As an Amazon Associate I earn from qualifying purchases. This means I may earn a small commission at no extra cost to you if you click a link and make a purchase.
      </p>
    </div>
  );
}
