import type { AffiliateProduct } from "@/components/AffiliateProductCard";

/**
 * Affiliate product data for blog articles.
 * Key = blog post slug, Value = array of products for that article.
 * Store ID: 88away0d-20
 */

export const affiliateProductsBySlug: Record<string, {
  ftcDisclosure: boolean;
  topPicks: AffiliateProduct[];
  inlineProducts: Record<string, { url: string; rel: string }>;
}> = {
  "ultimate-cozy-reading-night-setup": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (7\" Display, Latest Model)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=88away0d-20",
        description: "The fastest Kindle ever with a glare-free 7\" display, weeks of battery life, and waterproof design. Perfect for bath-time reading without anxiety.",
        whyRecommend: "If you're a heavy reader and don't have one yet, this is the upgrade that will genuinely change your reading life.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Husband Pillow Original Shredded Memory Foam",
        affiliateUrl: "https://www.amazon.com/dp/B0BMPFB4TT?tag=88away0d-20",
        description: "A bed rest reading pillow with arms, side pockets for your phone and glasses, and shredded memory foam that holds its shape for months.",
        whyRecommend: "Your back will thank you — it's like a warm hug that cradles your head, neck, and arms while you read.",
        priceRange: "Around $55",
        rating: 4.5,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20",
        description: "A rechargeable clip-on book light with 3 color temperatures and 6 brightness settings. Flexible neck design for perfect positioning.",
        whyRecommend: "It's the kind of thing you don't realize you need until you have it, and then you can't imagine reading without it.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {
      "Husband Pillow Original Shredded Memory Foam": {
        url: "https://www.amazon.com/dp/B0BMPFB4TT?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Aimuan Reading Pillow": {
        url: "https://www.amazon.com/dp/B0CQS2SSFW?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Glocusent LED Book Light": {
        url: "https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Classical Library Candle": {
        url: "https://www.amazon.com/dp/B0F1FY6XT7?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "\"Smells Like She's Writing a Bestseller\" Soy Candle": {
        url: "https://www.amazon.com/dp/B0CMTXKBWW?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "HAPPYPOP Book Lover Fuzzy Socks": {
        url: "https://www.amazon.com/dp/B0F1THN236?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Book Lover Wine Glass": {
        url: "https://www.amazon.com/dp/B0DD4FWCJW?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Kindle Paperwhite (newest model, 7\" display)": {
        url: "https://www.amazon.com/dp/B0CFPJYX7P?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
    },
  },
  "romance-reader-gift-guide": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (7\" Display, Latest Model)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=88away0d-20",
        description: "The ultimate gift for any serious reader. Glare-free 7\" display, weeks of battery life, waterproof design, and adjustable warm light for comfortable reading day or night.",
        whyRecommend: "Every book they download after this becomes part of your gift. It's the one upgrade that genuinely changes a reader's life.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Huglanket Book Lovers Wearable Blanket Hoodie",
        affiliateUrl: "https://www.amazon.com/dp/B0CW63NL9F?tag=88away0d-20",
        description: "An oversized sherpa-lined blanket hoodie with 'My Weekend is All Booked' text. Double-sided fabric with soft flannel and cozy fleece — perfect for marathon reading sessions.",
        whyRecommend: "It's the gift that turns every reading night into an event. Once they put it on, they won't want to take it off.",
        priceRange: "Around $35",
        rating: 4.6,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20",
        description: "A rechargeable clip-on book light with 3 color temperatures and 6 brightness settings. Flexible neck design for perfect positioning without disturbing anyone.",
        whyRecommend: "The gift readers don't know they need until they have it. Then they can't imagine reading without it.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {
      "HAPPYPOP Book Lover Fuzzy Socks": {
        url: "https://www.amazon.com/dp/B0F8BPSCZV?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "\"Too Many Books\" Wine Glass": {
        url: "https://www.amazon.com/dp/B0FWC3HD8X?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Classical Library Candle": {
        url: "https://www.amazon.com/dp/B0F1FY6XT7?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Glocusent LED Book Light": {
        url: "https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Aimuan Reading Pillow with Arms": {
        url: "https://www.amazon.com/dp/B09V518DRK?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
      "Kindle Paperwhite (newest model)": {
        url: "https://www.amazon.com/dp/B0CFPJYX7P?tag=88away0d-20",
        rel: "noopener noreferrer nofollow",
      },
    },
  },
};
