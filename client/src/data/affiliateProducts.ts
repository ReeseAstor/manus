import type { AffiliateProduct } from "@/components/AffiliateProductCard";

/**
 * Affiliate product data for blog articles.
 * Key = blog post slug, Value = array of products for that article.
 * Store ID: reeseastor-20
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
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The fastest Kindle ever with a glare-free 7\" display, weeks of battery life, and waterproof design. Perfect for bath-time reading without anxiety.",
        whyRecommend: "If you're a heavy reader and don't have one yet, this is the upgrade that will genuinely change your reading life.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Husband Pillow Original Shredded Memory Foam",
        affiliateUrl: "https://www.amazon.com/dp/B0BMPFB4TT?tag=reeseastor-20",
        description: "A bed rest reading pillow with arms, side pockets for your phone and glasses, and shredded memory foam that holds its shape for months.",
        whyRecommend: "Your back will thank you. It's like a warm hug that cradles your head, neck, and arms while you read.",
        priceRange: "Around $55",
        rating: 4.5,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "A rechargeable clip-on book light with 3 color temperatures and 6 brightness settings. Flexible neck design for perfect positioning.",
        whyRecommend: "It's the kind of thing you don't realize you need until you have it, and then you can't imagine reading without it.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {
      "Husband Pillow Original Shredded Memory Foam": {
        url: "https://www.amazon.com/dp/B0BMPFB4TT?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Aimuan Reading Pillow": {
        url: "https://www.amazon.com/dp/B0CQS2SSFW?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Glocusent LED Book Light": {
        url: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Classical Library Candle": {
        url: "https://www.amazon.com/dp/B0F1FY6XT7?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "\"Smells Like She's Writing a Bestseller\" Soy Candle": {
        url: "https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "HAPPYPOP Book Lover Fuzzy Socks": {
        url: "https://www.amazon.com/dp/B0BXLN1ZMH?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Book Lover Wine Glass": {
        url: "https://www.amazon.com/dp/B0DD4FWCJW?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Kindle Paperwhite (newest model, 7\" display)": {
        url: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
    },
  },
  "best-billionaire-romance-series-2024": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (2024)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The perfect e-reader for binge-reading entire romance series. Warm adjustable light, weeks of battery life, and waterproof design for bath-time reading.",
        whyRecommend: "If you're going to binge-read a 5-book series, you need a device that won't die on you. This one lasts weeks.",
        priceRange: "Around $150",
        rating: 4.7,
      },
    ],
    inlineProducts: {},
  },
  "nyc-romance-books-manhattan-guide": {
    ftcDisclosure: true,
    topPicks: [],
    inlineProducts: {},
  },
  "secret-baby-romance-books-guide": {
    ftcDisclosure: true,
    topPicks: [],
    inlineProducts: {},
  },
  "best-kindle-setup-romance-readers": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (2024)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The workhorse e-reader for heavy romance readers. 6.8-inch screen, warm adjustable light, waterproof, and weeks of battery life.",
        whyRecommend: "This is the one I use every single day. If you read 200+ books a year, this is your device.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "Rechargeable clip-on book light with 3 color temperatures and 6 brightness levels. For physical book nights.",
        whyRecommend: "The best book light I've found after testing many. Clips on without being heavy, and the warm setting is perfect.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {},
  },
  "enemies-to-lovers-books-that-ruined-me": {
    ftcDisclosure: true,
    topPicks: [],
    inlineProducts: {},
  },
  "booktok-made-me-buy-it-honest-reviews": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (2024)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "Most viral BookTok romances are in Kindle Unlimited. The Paperwhite is the best way to read them all without going broke.",
        whyRecommend: "I go through BookTok picks fast, about one every two days. KU on a Paperwhite is the most cost-effective way to keep up.",
        priceRange: "Around $150",
        rating: 4.7,
      },
    ],
    inlineProducts: {},
  },
  "reading-self-care-routine-book-lovers": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (2024)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The foundation of any reading self-care routine. Single-purpose device means no notifications pulling you out of the story.",
        whyRecommend: "Removing my phone and reading on a dedicated device was the single biggest improvement to my reading life.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "For physical book nights: clips on, multiple brightness levels, rechargeable, and warm light that won't disturb anyone.",
        whyRecommend: "I use it twice a week for physical ARCs and special editions. The warm light setting is perfect for nighttime reading.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {},
  },
  "romance-reader-gift-guide": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Kindle Paperwhite (7\" Display, Latest Model)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The ultimate gift for any serious reader. Glare-free 7\" display, weeks of battery life, waterproof design, and adjustable warm light for comfortable reading day or night.",
        whyRecommend: "Every book they download after this becomes part of your gift. It's the one upgrade that genuinely changes a reader's life.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Huglanket Book Lovers Wearable Blanket Hoodie",
        affiliateUrl: "https://www.amazon.com/dp/B0CW63NL9F?tag=reeseastor-20",
        description: "An oversized sherpa-lined blanket hoodie with 'My Weekend is All Booked' text. Double-sided fabric with soft flannel and cozy fleece, perfect for marathon reading sessions.",
        whyRecommend: "It's the gift that turns every reading night into an event. Once they put it on, they won't want to take it off.",
        priceRange: "Around $35",
        rating: 4.6,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "A rechargeable clip-on book light with 3 color temperatures and 6 brightness settings. Flexible neck design for perfect positioning without disturbing anyone.",
        whyRecommend: "The gift readers don't know they need until they have it. Then they can't imagine reading without it.",
        priceRange: "Around $13",
        rating: 4.6,
      },
    ],
    inlineProducts: {
      "HAPPYPOP Book Lover Fuzzy Socks": {
        url: "https://www.amazon.com/dp/B0F8BPSCZV?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "\"Too Many Books\" Wine Glass": {
        url: "https://www.amazon.com/dp/B0FWC3HD8X?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Classical Library Candle": {
        url: "https://www.amazon.com/dp/B0F1FY6XT7?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Glocusent LED Book Light": {
        url: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Aimuan Reading Pillow with Arms": {
        url: "https://www.amazon.com/dp/B09V518DRK?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "Kindle Paperwhite (newest model)": {
        url: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
    },
  },
  "what-i-burn-while-i-write": {
    ftcDisclosure: true,
    topPicks: [
      {
        name: "Classical Library Candle",
        affiliateUrl: "https://www.amazon.com/dp/B0F1FY6XT7?tag=reeseastor-20",
        description: "A soy wax candle with notes of aged leather, mahogany, and old paper. Designed to evoke the feeling of a grand library.",
        whyRecommend: "The candle that lives on my writing desk. Light it and you're in the library of a Manhattan penthouse. Pure magic.",
        priceRange: "Around $20",
        rating: 4.6,
      },
      {
        name: "\"Smells Like She's Writing a Bestseller\" Soy Candle",
        affiliateUrl: "https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20",
        description: "A hand-poured soy candle with a witty label and a warm, sweet scent. Perfect for deadline nights and gifting to authors.",
        whyRecommend: "Every writer deserves to smell like the thing they're chasing. It's also my favorite gift for other authors.",
        priceRange: "Around $22",
        rating: 4.7,
      },
    ],
    inlineProducts: {
      "Classical Library Candle": {
        url: "https://www.amazon.com/dp/B0F1FY6XT7?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
      "\"Smells Like She's Writing a Bestseller\" Soy Candle": {
        url: "https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20",
        rel: "noopener noreferrer nofollow",
      },
    },
  },
};
