import type { AffiliateProduct } from "@/components/AffiliateProductCard";

/**
 * Curated product data for the "Reese's Favorites" storefront page.
 * All links use Amazon Associates Store ID: reeseastor-20
 * 
 * Best practices:
 * - Only recommend products you'd genuinely use/endorse
 * - Include honest descriptions, not hype
 * - Price ranges are approximate and may vary
 * - All links include nofollow per FTC guidelines
 */

export interface ProductCategory {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  products: AffiliateProduct[];
}

export const favoritesCategories: ProductCategory[] = [
  {
    id: "reading-essentials",
    title: "Reading Essentials",
    subtitle: "The tools that make every reading session feel luxurious",
    emoji: "📖",
    products: [
      {
        name: "Kindle Paperwhite (7\" Display, Latest Model)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "The fastest Kindle ever with a glare-free 7\" display, weeks of battery life, and waterproof design. Adjustable warm light for comfortable reading day or night.",
        whyRecommend: "This is the one device that genuinely changed my reading life. I read 3x more books after switching to Kindle.",
        priceRange: "Around $150",
        rating: 4.7,
      },
      {
        name: "Glocusent LED Book Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "A rechargeable clip-on book light with 3 color temperatures and 6 brightness settings. Flexible neck design for perfect positioning.",
        whyRecommend: "For physical book lovers — this tiny light means you can read in bed without waking anyone up.",
        priceRange: "Around $13",
        rating: 4.6,
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
        name: "Aimuan Reading Pillow with Arms",
        affiliateUrl: "https://www.amazon.com/dp/B09V518DRK?tag=reeseastor-20",
        description: "A premium reading pillow with detachable neck roll, side pockets, and firm back support. Available in multiple colors to match your reading nook.",
        whyRecommend: "The neck roll is a game-changer for those marathon reading sessions that turn into 3 AM finishes.",
        priceRange: "Around $45",
        rating: 4.4,
      },
    ],
  },
  {
    id: "cozy-atmosphere",
    title: "Cozy Atmosphere",
    subtitle: "Set the mood for your perfect reading night",
    emoji: "🕯️",
    products: [
      {
        name: "Classical Library Candle",
        affiliateUrl: "https://www.amazon.com/dp/B0F1FY6XT7?tag=reeseastor-20",
        description: "A soy wax candle with notes of aged leather, mahogany, and old paper. Designed to evoke the feeling of a grand library.",
        whyRecommend: "Close your eyes, light this candle, and suddenly you're in the library of a Manhattan penthouse. Pure magic.",
        priceRange: "Around $20",
        rating: 4.5,
      },
      {
        name: "\"Smells Like She's Writing a Bestseller\" Soy Candle",
        affiliateUrl: "https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20",
        description: "A hand-poured soy candle with a witty label that makes the perfect gift for any aspiring or published author.",
        whyRecommend: "I keep this on my writing desk. The scent is lovely, and the label makes me smile every time I sit down to write.",
        priceRange: "Around $18",
        rating: 4.4,
      },
      {
        name: "Huglanket Book Lovers Wearable Blanket Hoodie",
        affiliateUrl: "https://www.amazon.com/dp/B0CW63NL9F?tag=reeseastor-20",
        description: "An oversized sherpa-lined blanket hoodie with 'My Weekend is All Booked' text. Double-sided fabric with soft flannel and cozy fleece.",
        whyRecommend: "Once you put this on, you won't want to take it off. It turns every reading night into an event.",
        priceRange: "Around $35",
        rating: 4.6,
      },
      {
        name: "HAPPYPOP Book Lover Fuzzy Socks",
        affiliateUrl: "https://www.amazon.com/dp/B0BXLN1ZMH?tag=reeseastor-20",
        description: "Cozy fuzzy socks with book-themed designs. Soft, warm, and perfect for curling up with a good romance novel.",
        whyRecommend: "The perfect finishing touch for a cozy reading night. Warm feet = happy reader.",
        priceRange: "Around $12",
        rating: 4.5,
      },
    ],
  },
  {
    id: "book-lover-gifts",
    title: "Book Lover Gifts",
    subtitle: "Perfect presents for the romance reader in your life",
    emoji: "🎁",
    products: [
      {
        name: "Book Lover Wine Glass",
        affiliateUrl: "https://www.amazon.com/dp/B0DD4FWCJW?tag=reeseastor-20",
        description: "A beautifully designed wine glass with book-themed typography. Pairs perfectly with a glass of red and a steamy romance novel.",
        whyRecommend: "Wine + romance novel = the perfect evening. This glass just makes it official.",
        priceRange: "Around $15",
        rating: 4.5,
      },
      {
        name: "\"Too Many Books\" Wine Glass",
        affiliateUrl: "https://www.amazon.com/dp/B0FWC3HD8X?tag=reeseastor-20",
        description: "A stemless wine glass with 'I have too many books' crossed out and 'said no one ever' printed below. A fun conversation starter.",
        whyRecommend: "Because we all know there's no such thing as too many books. The perfect gift for your book club friends.",
        priceRange: "Around $15",
        rating: 4.4,
      },
    ],
  },
  {
    id: "writers-desk",
    title: "Writer's Desk",
    subtitle: "My actual writing setup — the tools behind the books",
    emoji: "✍️",
    products: [
      {
        name: "Moleskine Classic Notebook (Large, Ruled)",
        affiliateUrl: "https://www.amazon.com/dp/B015NG45Q0?tag=reeseastor-20",
        description: "The iconic Moleskine notebook with ivory-colored ruled pages, elastic closure, and ribbon bookmark. 240 pages of pure writing potential.",
        whyRecommend: "Every Manhattan Money Kings plot started in a Moleskine. There's something about the feel of these pages that unlocks creativity.",
        priceRange: "Around $20",
        rating: 4.7,
      },
      {
        name: "Pilot G2 Premium Gel Ink Pens (Black, 0.7mm)",
        affiliateUrl: "https://www.amazon.com/dp/B00006JNJ8?tag=reeseastor-20",
        description: "Ultra-smooth gel ink pens with a comfortable rubber grip. The gold standard for writers who still love putting pen to paper.",
        whyRecommend: "I've tried every pen. These are the ones I keep coming back to. Smooth, reliable, and they don't smear.",
        priceRange: "Around $12 (12-pack)",
        rating: 4.8,
      },
      {
        name: "Bose QuietComfort Ultra Headphones",
        affiliateUrl: "https://www.amazon.com/dp/B0CCZ26B5V?tag=reeseastor-20",
        description: "World-class noise cancellation with immersive spatial audio. Up to 24 hours of battery life. The ultimate focus tool for writers.",
        whyRecommend: "I write in coffee shops. These headphones create a bubble of silence that lets me disappear into my characters' world.",
        priceRange: "Around $380",
        rating: 4.6,
      },
    ],
  },
];

/** Flat list of all products for search/filter */
export const allFavoritesProducts = favoritesCategories.flatMap(cat =>
  cat.products.map(p => ({ ...p, category: cat.id, categoryTitle: cat.title }))
);
