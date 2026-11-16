import type { AffiliateProduct } from "@/components/AffiliateProductCard";

/**
 * Curated product data for the "Reese's Favorites" storefront page.
 * All links use Amazon Associates Store ID: reeseastor-20
 *
 * Best practices:
 * - Only recommend products you'd genuinely use/endorse
 * - Include honest descriptions, not hype
 * - Do not state static Amazon prices or star ratings; those change
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
        name: "Kindle Paperwhite 16GB (2024 model)",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "A 7-inch glare-free display, up to 12 weeks of battery life, waterproof design, and adjustable light from white to amber.",
        whyRecommend: "This is the one device that genuinely changed my reading life. I read 3x more books after switching to Kindle.",
      },
      {
        name: "Glocusent Neck Reading Light",
        affiliateUrl: "https://www.amazon.com/dp/B07WNRN9WQ?tag=reeseastor-20",
        description: "A rechargeable, hands-free neck reading light with 3 color temperatures and 6 brightness settings. Lasts up to 80 hours and charges over USB-C.",
        whyRecommend: "For physical book lovers, this tiny light means you can read in bed without waking anyone up.",
      },
      {
        name: "Husband Pillow Medium Reading Pillow with Arms, Purple",
        affiliateUrl: "https://www.amazon.com/dp/B0BMPFB4TT?tag=reeseastor-20",
        description: "A medium bed-rest reading pillow with arms, a neck roll, side pockets, and a removable cover. Filled with memory foam for sitting up in bed.",
        whyRecommend: "Your back will thank you. It's like a warm hug that cradles your head, neck, and arms while you read.",
      },
      {
        name: "Aimuan Reading Pillow with Arms, Ivory",
        affiliateUrl: "https://www.amazon.com/dp/B09V518DRK?tag=reeseastor-20",
        description: "An 18-inch reading pillow with arms and a carry handle. Soft faux-fur cover with polyester fill, shown here in Ivory.",
        whyRecommend: "This is the pillow I reach for during marathon reading sessions that turn into 3 AM finishes.",
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
        description: "A 4 oz soy wax candle with notes of bergamot rose, wood, amber, cedarwood, and sandalwood. Designed to evoke the feeling of a classic library.",
        whyRecommend: "Close your eyes, light this candle, and suddenly you're in the library of a Manhattan penthouse. Pure magic.",
      },
      {
        name: "\"Smells Like She's Writing a Bestseller\" Scented Soy Candle",
        affiliateUrl: "https://www.amazon.com/dp/B0DXPL9RL2?tag=reeseastor-20",
        description: "A 9 oz soy wax candle with a witty writer-themed label and a lavender scent. It comes gift-boxed and is rated for 50 or more hours of burn time.",
        whyRecommend: "I keep this on my writing desk. The scent is lovely, and the label makes me smile every time I sit down to write.",
      },
      {
        name: "Krifey Wearable Blanket Hoodie, Full Coverage Oversized Sherpa",
        affiliateUrl: "https://www.amazon.com/dp/B0FXWF75B4?tag=reeseastor-20",
        description: "An oversized wearable blanket hoodie with flannel fleece on the outside and sherpa lining inside, plus a large front pocket. Made for lounging and reading.",
        whyRecommend: "Once you put this on, you won't want to take it off. It turns every reading night into an event.",
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
        name: "C M Books & Wine Stemless Wine Glass, 17 oz",
        affiliateUrl: "https://www.amazon.com/dp/B0DTYGQYGQ?tag=reeseastor-20",
        description: "A 17 oz stemless wine glass with an etched Books & Wine design of stacked books and a wine glass. Dishwasher safe.",
        whyRecommend: "Wine and a romance novel make the perfect evening. This glass just makes it official.",
      },
      {
        name: "There Is No Such Thing as Too Many Books Wine Glass, 15 oz",
        affiliateUrl: "https://www.amazon.com/dp/B0FWC3HD8X?tag=reeseastor-20",
        description: "A 15 oz stemless wine glass with book-lover typography, packed in a gift box and dishwasher safe.",
        whyRecommend: "Because we all know there's no such thing as too many books. The perfect gift for your book club friends.",
      },
      {
        name: "TILISMA Handmade Walnut Book Page Holder",
        affiliateUrl: "https://www.amazon.com/dp/B07PGW7C8R?tag=reeseastor-20",
        description: "A handmade walnut thumb book page holder that keeps your book open with one hand. Perfect for reading while eating or drinking. Available in multiple sizes.",
        whyRecommend: "A small luxury that solves a real problem. Once you try it, you'll wonder how you ever read without one.",
      },
      {
        name: "Personalized Leather Bookmark with Pen Holder",
        affiliateUrl: "https://www.amazon.com/dp/B078SDB5WY?tag=reeseastor-20",
        description: "A genuine leather bookmark with a pen holder, handmade in the USA. Customize it with a short name or initials, and choose gold or silver foil in several colors.",
        whyRecommend: "A beautiful, personal touch that makes every book feel special. I keep one stamped with my initials, and it is my favorite.",
      },
    ],
  },
  {
    id: "writers-desk",
    title: "Writer's Desk",
    subtitle: "My actual writing setup, the tools behind the books",
    emoji: "✍️",
    products: [
      {
        name: "Moleskine Classic Notebook, Large, Plain, Sapphire Blue, Hard Cover",
        affiliateUrl: "https://www.amazon.com/dp/B015NG45Q0?tag=reeseastor-20",
        description: "The iconic Moleskine notebook with ivory-colored plain pages, elastic closure, and ribbon bookmark. 240 pages of pure writing potential.",
        whyRecommend: "Every Manhattan Money Kings plot started in a Moleskine. There's something about the feel of these pages that unlocks creativity.",
      },
      {
        name: "Pilot G2 Premium Gel Ink Pens (Black, 0.5mm Extra Fine)",
        affiliateUrl: "https://www.amazon.com/dp/B00006JNJ8?tag=reeseastor-20",
        description: "Extra Fine 0.5 mm gel ink pens with a comfortable rubber grip, sold as a dozen box. Smooth, refillable, and quick drying.",
        whyRecommend: "I've tried every pen. These are the ones I keep coming back to. Smooth, reliable, and they don't smear.",
      },
      {
        name: "Bose QuietComfort Headphones",
        affiliateUrl: "https://www.amazon.com/dp/B0CCZ26B5V?tag=reeseastor-20",
        description: "Active noise cancellation with high-fidelity audio and up to 24 hours of battery life. The ultimate focus tool for writers.",
        whyRecommend: "I write in coffee shops. These headphones create a bubble of silence that lets me disappear into my characters' world.",
      },
      {
        name: "VISOONE Classic Lightweight Semi Rimless Blue Light Blocking Glasses",
        affiliateUrl: "https://www.amazon.com/dp/B0C6MD8YBR?tag=reeseastor-20",
        description: "Lightweight semi-rimless blue light filtering glasses with anti-glare lenses. Built for long writing and reading sessions, with a protective case included.",
        whyRecommend: "After 8-hour writing days, my eyes used to ache. These glasses made a noticeable difference within the first week.",
      },
    ],
  },
];

/** Flat list of all products for search/filter */
export const allFavoritesProducts = favoritesCategories.flatMap(cat =>
  cat.products.map(p => ({ ...p, category: cat.id, categoryTitle: cat.title }))
);
