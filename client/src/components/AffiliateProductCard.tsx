import { motion } from "framer-motion";
import { ExternalLink, Star, ShoppingCart } from "lucide-react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

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
  sourceSlug?: string;
}

export function AffiliateProductCard({ product, index, sourceSlug }: AffiliateProductCardProps) {
  const [location] = useLocation();
  const trackClick = trpc.affiliateTracking.trackClick.useMutation();

  const slug = sourceSlug || location.replace(/^\/blog\//, "").replace(/\/$/, "") || "unknown";

  const handleClick = () => {
    trackClick.mutate({
      productName: product.name,
      affiliateUrl: product.affiliateUrl,
      sourceSlug: slug,
      clickType: "card",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FAF7F7]/[0.06] to-[#FAF7F7]/[0.02] border border-[#4A3B3A]/10 hover:border-[#B59A6A]/40 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#C9A3A0]/5"
    >
      <div className="p-6 space-y-4">
        {/* Product Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-serif text-lg font-bold text-[#4A3B3A] group-hover:text-[#7A4F4C] transition-colors leading-tight">
              {product.name}
            </h4>
            <p className="text-[#7A4F4C]/80 font-medium text-sm mt-1">
              {product.priceRange}
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A3A0]/10 flex items-center justify-center border border-[#B59A6A]/20">
            <ShoppingCart className="w-5 h-5 text-[#7A4F4C]" />
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
                    ? "text-[#7A4F4C] fill-[#7A4F4C]"
                    : i < product.rating!
                    ? "text-[#7A4F4C] fill-[#7A4F4C]/50"
                    : "text-[#6E5F5A]"
                }`}
              />
            ))}
            <span className="text-xs text-[#6E5F5A] ml-1">({product.rating})</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[#6E5F5A] text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Why Recommend */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[#C9A3A0]/5 border border-[#B59A6A]/10">
          <span className="text-[#7A4F4C] text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">Why I love it:</span>
          <p className="text-[#6E5F5A] text-xs leading-relaxed">{product.whyRecommend}</p>
        </div>

        {/* CTA Button */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={handleClick}
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-[#C9A3A0]/20"
        >
          Check Price on Amazon
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#C9A3A0]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

interface AffiliateProductSectionProps {
  products: AffiliateProduct[];
  title?: string;
  subtitle?: string;
  sourceSlug?: string;
}

export function AffiliateProductSection({ products, title = "Top Picks", subtitle = "Recommended products from this article", sourceSlug }: AffiliateProductSectionProps) {
  return (
    <div className="my-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/20 mb-4">
          <ShoppingCart className="w-4 h-4 text-[#7A4F4C]" />
          <span className="text-[#7A4F4C] text-sm font-bold uppercase tracking-wider">{title}</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3B3A] mb-2">
          {subtitle}
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A3A0] to-transparent mx-auto" />
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <AffiliateProductCard key={index} product={product} index={index} sourceSlug={sourceSlug} />
        ))}
      </div>
    </div>
  );
}

export function FTCDisclosure() {
  return (
    <div className="mb-8 p-4 rounded-xl bg-[#EBD6D3]/0 border border-[#4A3B3A]/10">
      <p className="text-[#6E5F5A] text-xs leading-relaxed italic">
        <span className="font-semibold text-[#6E5F5A]">Disclosure:</span>{" "}
        As an Amazon Associate I earn from qualifying purchases. This means I may earn a small commission at no extra cost to you if you click a link and make a purchase.
      </p>
    </div>
  );
}
