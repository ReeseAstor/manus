/**
 * SEO Metadata for reeseastor.com — All Book Pages + Homepage
 * 
 * HOW TO USE:
 * 1. Import this file into each page component
 * 2. Pass the relevant entry to <EnhancedSEOHead /> (already in client/src/components/ui/enhanced-seo-head.tsx)
 * 3. Each entry is keyed by URL slug for easy lookup
 *
 * Example usage in BookDetail.tsx:
 *   import { bookSeoMeta } from '@/data/seo-book-metadata';
 *   const seo = bookSeoMeta[book.slug] ?? bookSeoMeta['_default'];
 *   <EnhancedSEOHead {...seo} canonical={`/books/${book.slug}`} />
 */

export interface BookSeoEntry {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'book';
}

export const bookSeoMeta: Record<string, BookSeoEntry> = {

  // ─── HOMEPAGE ────────────────────────────────────────────────────────────────
  '_home': {
    title: 'Reese Astor | Billionaire Romance',
    description:
      'Steamy billionaire romance set in Manhattan. Read the Manhattan Money Kings series and Hudson Dynasty novels by Reese Astor, on Kindle Unlimited.',
    keywords: [
      'billionaire romance',
      'steamy billionaire romance',
      'contemporary romance Kindle Unlimited',
      'Manhattan romance novels',
      'romance author',
      'Reese Astor books',
      'Manhattan Money Kings',
      'Hudson Dynasty romance',
    ],
    ogTitle: 'Reese Astor | Steamy Billionaire Romance',
    ogDescription:
      "Power, passion, and Manhattan's elite. Dive into the Manhattan Money Kings series by romance author Reese Astor. Available on Kindle Unlimited.",
    ogType: 'website',
  },

  // ─── THE BILLIONAIRE'S EXECUTIVE ASSISTANT (MMK Book 1) ──────────────────────
  // Amazon ASIN: B0F2W8QL7S | URL: /books/the-billionaire-s-executive-assistant
  'the-billionaire-s-executive-assistant': {
    title: "Steamy Boss Romance | The Billionaire's Executive Assistant",
    description:
      "He's the alpha billionaire CEO. She's the executive assistant who can't afford to fall for him. A forbidden workplace romance on Kindle Unlimited, Manhattan Money Kings Book 1.",
    keywords: [
      'steamy boss employee romance',
      'alpha billionaire office romance',
      'workplace romance Kindle Unlimited',
      'forbidden boss romance',
      'enemies to lovers workplace romance',
      'billionaire executive assistant romance',
      'Manhattan Money Kings book 1',
    ],
    ogTitle: "The Billionaire's Executive Assistant | Forbidden Office Romance",
    ogDescription:
      'Enemies-to-lovers tension, corporate intrigue, and a slow-burn that ignites. Read Book 1 of the Manhattan Money Kings series by Reese Astor.',
    ogType: 'book',
  },

  // ─── THE BILLIONAIRE'S FAKE WIFE (MMK Book 2) ────────────────────────────────
  // Amazon ASIN: B0FCCBNF8X | URL: /books/the-billionaire-s-fake-wife
  'the-billionaire-s-fake-wife': {
    title: "Billionaire Fake Wife Romance | Pregnant & Protected",
    description:
      'She broke into his penthouse. He made her his contract wife. A steamy fake marriage romance with forced proximity and real feelings, Manhattan Money Kings Book 2 on Kindle Unlimited.',
    keywords: [
      'billionaire fake wife romance',
      'fake marriage romance books',
      'contract wife romance',
      'pregnant and protected romance',
      'forced proximity romance',
      'fake relationship Kindle Unlimited',
      'Manhattan Money Kings book 2',
    ],
    ogTitle: "The Billionaire's Fake Wife | Contract Marriage Billionaire Romance",
    ogDescription:
      "Twelve months as his fake wife. Five million dollars. And a danger she never saw coming. Steamy fake relationship romance by Reese Astor on Kindle Unlimited.",
    ogType: 'book',
  },

  // ─── THE BILLIONAIRE'S BABY SECRET (MMK Book 3) ──────────────────────────────
  // Amazon ASIN: B0G12LBZ24 | URL: /books/the-billionaire-s-baby-secret
  'the-billionaire-s-baby-secret': {
    title: "Secret Baby Billionaire Romance | Hidden and His",
    description:
      'One night. One secret. One second chance he refuses to lose. A steamy secret baby romance with billionaire protector heat and real stakes, Manhattan Money Kings Book 3.',
    keywords: [
      'secret baby billionaire romance',
      'second chance secret baby',
      'billionaire protector romance',
      'hidden baby romance books',
      'off limits one night stand romance',
      'second chance romance Kindle Unlimited',
      'Manhattan Money Kings book 3',
    ],
    ogTitle: "The Billionaire's Baby Secret | Second Chance Secret Baby Romance",
    ogDescription:
      "He came back to reclaim his empire, and discovered the daughter she kept hidden. Second chance secret baby romance by Reese Astor on Kindle Unlimited.",
    ogType: 'book',
  },

  // ─── THE BILLIONAIRE'S FORBIDDEN NANNY (MMK Book 4) ──────────────────────────
  // Amazon ASIN: B0GDZ4T164 | URL: /books/the-billionaires-forbidden-nanny
  'the-billionaires-forbidden-nanny': {
    title: "Forbidden Nanny Romance | Off-Limits Billionaire Boss",
    description:
      "She's the nanny. He's her boss. His mother wants her gone. A forbidden romance with forced proximity and found family heat, Manhattan Money Kings Book 4 on Kindle Unlimited.",
    keywords: [
      'forbidden nanny romance',
      'off-limits nanny billionaire',
      'nanny boss romance books',
      'forbidden romance Kindle Unlimited',
      'forced proximity romance',
      'found family romance',
      'Manhattan Money Kings book 4',
    ],
    ogTitle: "The Billionaire's Forbidden Nanny | Forbidden Boss Romance",
    ogDescription:
      "Off-limits, emotionally charged, and impossible to resist. Read the final Manhattan Money Kings novel by Reese Astor, on Kindle Unlimited.",
    ogType: 'book',
  },

  // ─── HOSTILE TENDER (Hudson Dynasty Book 1) ──────────────────────────────────
  // Amazon ASIN: B0H1F9PV97 | URL: /books/hostile-tender
  'hostile-tender': {
    title: "Enemies to Lovers Billionaire Romance | Hostile Tender",
    description:
      "She was sent to dismantle his empire. He's Manhattan's most dangerous billionaire. A steamy enemies-to-lovers romance from the Hudson Dynasty series by Reese Astor.",
    keywords: [
      'enemies to lovers billionaire romance',
      'corporate investigation romance',
      'auditor billionaire romance',
      'Hudson Dynasty romance',
      'dark billionaire romance series',
      'enemies to lovers forced proximity',
      'Manhattan billionaire romance',
    ],
    ogTitle: "Hostile Tender | Enemies to Lovers Corporate Billionaire Romance",
    ogDescription:
      "When a forensic auditor and a billionaire CEO are forced into dangerous proximity, investigation becomes intimacy. Hudson Dynasty Book 1 by Reese Astor.",
    ogType: 'book',
  },

  // ─── THE FIRST ACQUISITION (Free Lead Magnet) ────────────────────────────────
  // Amazon ASIN: B0D82GWFD9 | URL: /free-book
  '_free-book': {
    title: "Free Manhattan Billionaire Romance | The First Acquisition",
    description:
      "Get a full-length Manhattan billionaire romance free. The First Acquisition is Reese Astor's Inner Circle welcome gift — no strings, just steamy romance.",
    keywords: [
      'free billionaire romance book',
      'free contemporary romance Kindle Unlimited',
      'Manhattan billionaire romance free',
      'Reese Astor free book',
      'romance author newsletter free book',
    ],
    ogTitle: "Free Billionaire Romance: The First Acquisition by Reese Astor",
    ogDescription:
      "A complete standalone Manhattan billionaire romance, yours free when you join the Inner Circle. Sign up and start reading instantly.",
    ogType: 'book',
  },

  // ─── THE BILLIONAIRE'S ONE NIGHT STAND ───────────────────────────────────────
  // Amazon ASIN: B0DSG7NKGP | URL: /books/the-billionaires-one-night-stand
  'the-billionaires-one-night-stand': {
    title: "Billionaire One Night Stand Romance | Reese Astor",
    description:
      "One unforgettable night with Manhattan's most powerful billionaire. A steamy, fast-paced one night stand romance on Kindle Unlimited by Reese Astor.",
    keywords: [
      'billionaire one night stand romance',
      'one night stand romance Kindle Unlimited',
      'accidental pregnancy romance',
      'steamy contemporary romance standalone',
      'fast burn billionaire romance',
    ],
    ogTitle: "The Billionaire's One Night Stand | Steamy Contemporary Romance",
    ogDescription:
      "No strings. No expectations. Until one night changes everything. A standalone steamy billionaire romance by Reese Astor on Kindle Unlimited.",
    ogType: 'book',
  },

  // ─── FALLBACK DEFAULT ─────────────────────────────────────────────────────────
  '_default': {
    title: 'Reese Astor | Billionaire Romance',
    description:
      'Steamy billionaire contemporary romance by Reese Astor. Read the Manhattan Money Kings series and Hudson Dynasty novels on Kindle Unlimited.',
    keywords: [
      'billionaire romance',
      'steamy billionaire romance',
      'contemporary romance',
      'Kindle Unlimited romance',
      'Reese Astor',
    ],
    ogTitle: 'Reese Astor | Steamy Billionaire Romance',
    ogDescription:
      "Power, passion, and Manhattan's elite. Read the Manhattan Money Kings series by Reese Astor.",
    ogType: 'website',
  },
};

/**
 * IMPLEMENTATION NOTES FOR DEVELOPERS
 * ────────────────────────────────────
 *
 * 1. BOOK DETAIL PAGES (client/src/pages/BookDetail.tsx)
 *    Import this file and look up by book slug:
 *
 *      import { bookSeoMeta } from '@/data/seo-book-metadata';
 *      const seo = bookSeoMeta[book.slug] ?? bookSeoMeta['_default'];
 *      <EnhancedSEOHead
 *        title={seo.title}
 *        description={seo.description}
 *        keywords={seo.keywords}
 *        canonical={`/books/${book.slug}`}
 *        ogType={seo.ogType}
 *        ogImage={book.coverImage ?? '/images/default-og-image.jpg'}
 *      />
 *
 * 2. HOMEPAGE (client/src/pages/Home.tsx)
 *      const seo = bookSeoMeta['_home'];
 *      <EnhancedSEOHead title={seo.title} description={seo.description} keywords={seo.keywords} canonical="/" />
 *
 * 3. FREE BOOK PAGE (client/src/pages/FreeBook.tsx)
 *      const seo = bookSeoMeta['_free-book'];
 *      <EnhancedSEOHead {...seo} canonical="/free-book" />
 *
 * 4. STRUCTURED DATA — pass to EnhancedSEOHead for Google rich results:
 *      structuredData={[{
 *        "@context": "https://schema.org",
 *        "@type": "Book",
 *        "name": book.title,
 *        "author": { "@type": "Person", "name": "Reese Astor" },
 *        "isbn": book.asin,
 *        "url": `https://reeseastor.com/books/${book.slug}`,
 *        "image": book.coverImage,
 *        "description": seo.description,
 *        "genre": "Romance",
 *        "inLanguage": "en",
 *        "offers": { "@type": "Offer", "price": "3.99", "priceCurrency": "USD" }
 *      }]}
 *
 * 5. BLOG POSTS (client/src/pages/BlogPost.tsx)
 *    Use ogType="article" with publishDate/modifiedDate from the post record.
 *    Title: post h1 + " | Reese Astor"
 *    Description: post excerpt trimmed to 155 chars
 */
