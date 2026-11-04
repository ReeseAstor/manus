import React from "react";
import { ExternalLink } from "lucide-react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";
import { withAmazonTag } from "../lib/amazon-tag";
import { AFFILIATE_LINK_REL, isAmazonAffiliateDestination } from "../lib/blog-recommendations";

export interface AffiliateProduct {
  name: string;
  affiliateUrl: string;
  description: string;
  whyRecommend: string;
  /** Legacy catalog metadata, not displayed without live verification. */
  priceRange: string;
  rating?: number;
  imageUrl?: string;
  aliases?: string[];
  editorialReason?: string;
  tradeoff?: string;
  noPurchaseAlternative?: string;
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
  const affiliateUrl = withAmazonTag(product.affiliateUrl);
  const safeDestination = isAmazonAffiliateDestination(affiliateUrl);

  const handleClick = () => {
    trackClick.mutate({
      productName: product.name,
      affiliateUrl,
      sourceSlug: slug,
      clickType: "card",
    });
  };

  return (
    <article
      className="rounded-2xl border border-[#4A3B3A]/15 bg-[#FAF7F7] p-5 sm:p-6 space-y-4"
      aria-label={`Optional recommendation ${index + 1}: ${product.name}`}
    >
      <h4 className="font-serif text-xl text-[#4A3B3A] leading-snug">{product.name}</h4>
      <p className="text-[#6E5F5A] text-sm leading-relaxed">
        {product.editorialReason || "An optional item to compare if it meets a specific need in your reading or writing routine."}
      </p>
      <dl className="space-y-3 text-sm leading-relaxed text-[#6E5F5A]">
        <div>
          <dt className="font-semibold text-[#4A3B3A]">Consider before buying</dt>
          <dd>{product.tradeoff || "Check the current specifications, fit, care instructions, and return policy. An item you already own may work just as well."}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#4A3B3A]">No purchase needed</dt>
          <dd>{product.noPurchaseAlternative || "Start with what you have, borrow from a friend, or try your library before adding something new."}</dd>
        </div>
      </dl>
      {safeDestination && (
        <a
          href={affiliateUrl}
          target="_blank"
          rel={AFFILIATE_LINK_REL}
          onClick={handleClick}
          className="inline-flex items-center gap-2 py-2 text-sm text-[#7A4F4C] underline underline-offset-4 hover:text-[#4A3B3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          View {product.name} on Amazon
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="sr-only"> (affiliate link, opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}

interface AffiliateProductSectionProps {
  products: AffiliateProduct[];
  title?: string;
  subtitle?: string;
  sourceSlug?: string;
}

export function AffiliateProductSection({
  products,
  title = "Optional reading companions",
  subtitle = "Items mentioned in this article",
  sourceSlug,
}: AffiliateProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="my-12 border-t border-[#4A3B3A]/15 pt-8" aria-label={title}>
      <header className="mb-6 space-y-2">
        <p className="text-sm text-[#7A4F4C]">{title}</p>
        <h3 className="font-serif text-2xl text-[#4A3B3A]">{subtitle}</h3>
        <p className="text-sm leading-relaxed text-[#6E5F5A]">
          These are optional, not a reading checklist. Prices and availability can change; compare the current listing before deciding.
        </p>
      </header>
      <FTCDisclosure />
      <div className="grid gap-4">
        {products.map((product, index) => (
          <AffiliateProductCard key={product.affiliateUrl} product={product} index={index} sourceSlug={sourceSlug} />
        ))}
      </div>
    </section>
  );
}

export function FTCDisclosure() {
  return (
    <aside className="mb-6 p-4 rounded-xl bg-[#EBD6D3]/20 border border-[#4A3B3A]/10" aria-label="Affiliate disclosure">
      <p className="text-[#6E5F5A] text-sm leading-relaxed">
        <span className="font-semibold text-[#4A3B3A]">Affiliate disclosure:</span>{" "}
        As an Amazon Associate I earn from qualifying purchases. Amazon links may earn a commission at no extra cost to you. You do not need to buy anything to enjoy this article.
      </p>
    </aside>
  );
}
