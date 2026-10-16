/**
 * Reese Astor catalog — single source of truth.
 *
 * Add a new book by adding one entry to BOOKS below. The /books catalog,
 * each /books/[slug] page, and structured data are generated from this file.
 * No new pages or nav edits required for new titles.
 *
 * Lanes are intentionally separated. Cards never cross lanes in any rail —
 * romance and recovery have different reader need-states.
 */

export type Lane = "manhattan_money_kings" | "hudson_dynasty" | "intimate_psychological_narratives";
export type BookFormat = "ebook" | "audiobook" | "ebook_and_audiobook";

export type RetailerKey =
  | "amazon_kindle"
  | "amazon_paperback"
  | "audible"
  | "apple_books"
  | "spotify"
  | "elevenreader"
  | "google_play"
  | "gumroad"
  | "bookfunnel";

export type Book = {
  slug: string;
  title: string;
  lane: Lane;
  series_position: number | null;
  format: BookFormat;
  /** Series-position label, e.g. "Book 1", "Prequel novella". */
  position_label: string | null;
  tagline: string;
  blurb: string;
  pull_quote: string | null;
  /** null renders a typographic placeholder until a real cover exists. */
  cover_image: string | null;
  /** 1200x1200 social-share variant. Falls back to cover_image when absent. */
  cover_image_square?: string | null;
  publication_date: string | null;
  kindle_unlimited: boolean;
  retailers: Partial<Record<RetailerKey, string | null>>;
  audiobook_available: boolean;
  isbn: string | null;
  asin: string | null;
  /** Listed price in USD, used for structured data. */
  price_usd: number | null;
};

export const LANE_META: Record<Lane, { eyebrow: string; title: string; subtitle: string }> = {
  manhattan_money_kings: {
    eyebrow: "A SERIES",
    title: "Manhattan Money Kings",
    subtitle: "Manhattan's most powerful men, undone by the women who refuse to look away.",
  },
  hudson_dynasty: {
    eyebrow: "A SERIES IN PROGRESS",
    title: "Hudson Dynasty",
    subtitle: "A family built on acquisitions. A ledger that remembers everything.",
  },
  intimate_psychological_narratives: {
    eyebrow: "A NEW LINE",
    title: "Intimate Psychological Narratives",
    subtitle: "Quiet, intimate audiobooks for the late hours.",
  },
};

export const BOOKS: Book[] = [
  // ─── Manhattan Money Kings ─────────────────────────────────────────────
  {
    slug: "the-billionaires-one-night-stand",
    title: "The Billionaire's One Night Stand",
    lane: "manhattan_money_kings",
    series_position: 0,
    format: "ebook",
    position_label: "Prequel",
    tagline: "One night with Manhattan's most ruthless CEO.",
    blurb:
      "Victoria Cruz never shows weakness, especially after they deny her law firm partnership. James Chen " +
      "doesn't do emotions or touch. His billions buy him control of everything. Except her. One savage night " +
      "shatters all limits. Monday destroys them both: he owns her firm now. Her new boss. Every moment alone " +
      "tests their control. He could break her career. She could expose his empire. Neither will surrender " +
      "first. A steamy billionaire romance. No cliffhanger. Guaranteed HEA.",
    pull_quote: null, // not found in the live EPUB; BookTitle hides "Inside this book" when null
    cover_image: "https://m.media-amazon.com/images/I/815-iFRAlpL._SL1500_.jpg",
    publication_date: null,
    kindle_unlimited: false,
    retailers: {
      // Direct link: swiy.co/05 resolves to The First Acquisition (B0D82GWFD9), not this book.
      amazon_kindle: "https://www.amazon.com/dp/B0DSG7NKGP?tag=reeseastor-20",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0DSG7NKGP",
    price_usd: 0.99,
  },
  {
    slug: "the-billionaire-s-executive-assistant",
    title: "The Billionaire's Executive Assistant",
    lane: "manhattan_money_kings",
    series_position: 1,
    format: "ebook",
    position_label: "Book 1",
    tagline: "The boardroom was never the most dangerous room.",
    blurb:
      "Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a " +
      "competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or " +
      "workplace scandal. When Sarah uncovers financial sabotage orchestrated by Michael's ruthless " +
      "competitor, they're forced into a dangerous alliance that crosses every professional boundary.",
    pull_quote: null, // not found in the live EPUB; BookTitle hides "Inside this book" when null
    cover_image: "/author-kit/mmk-1-executive-assistant.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/b01",
    },
    audiobook_available: false,
    isbn: null,
    asin: null,
    price_usd: 3.99,
  },
  {
    slug: "the-billionaire-s-fake-wife",
    title: "The Billionaire's Fake Wife",
    lane: "manhattan_money_kings",
    series_position: 2,
    format: "ebook",
    position_label: "Book 2",
    tagline: "A ruthless engagement that turns devastatingly real.",
    blurb:
      "When thief Elena breaks into his penthouse, billionaire David Kim catches her red-handed. But " +
      "he makes her an offer she can't refuse: marry him for twelve months " +
      "in exchange for protection from her violent father. As they work together, their forced alliance " +
      "ignites into something neither expected.",
    pull_quote: null,
    cover_image: "/author-kit/mmk-2-fake-wife.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20",
      // Paperback edition (kept as its own button; the Kindle/KU button above is the Kindle edition).
      amazon_paperback: "https://www.amazon.com/dp/B0FD33W6H6?tag=reeseastor-20",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0FCCBNF8X",
    price_usd: 3.99,
  },
  {
    slug: "the-billionaire-s-baby-secret",
    title: "The Billionaire's Baby Secret",
    lane: "manhattan_money_kings",
    series_position: 3,
    format: "ebook",
    position_label: "Book 3",
    tagline: "One night. One secret. One second chance he refuses to lose.",
    blurb:
      "Three years ago, Sophia Reed walked away from a hotel room and a man she should've never trusted — " +
      "rising mogul Dominic Kane. Now the CEO who controls outcomes for a living is back, and the daughter " +
      "Sophia has protected has the storm-gray eyes he can't deny. When Dominic returns to reclaim his " +
      "empire, he discovers the truth he was never meant to miss.",
    pull_quote: null, // not found in the live EPUB; BookTitle hides "Inside this book" when null
    cover_image: "/author-kit/mmk-3-baby-secret.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/3rd",
    },
    audiobook_available: false,
    isbn: null,
    asin: null,
    price_usd: 3.99,
  },
  {
    slug: "the-billionaires-forbidden-nanny",
    title: "The Billionaire's Forbidden Nanny",
    lane: "manhattan_money_kings",
    series_position: 4,
    format: "ebook",
    position_label: "Book 4",
    tagline: "She's the nanny. He's her boss. His mother wants her gone.",
    blurb:
      "When Camille Torres takes a job caring for billionaire Ethan Calloway's silent daughter, she never " +
      "expected to become the family they both desperately need. Ethan hasn't smiled since his wife died. " +
      "His five-year-old daughter hasn't spoken. Seven nannies have quit. He doesn't need another " +
      "complication — especially not one with quick wit, warm hands, and a mouth that talks back.",
    pull_quote: null, // not found in the live EPUB; BookTitle hides "Inside this book" when null
    cover_image: "/author-kit/mmk-4-forbidden-nanny.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/4rd",
    },
    audiobook_available: false,
    isbn: null,
    asin: null,
    price_usd: 3.99,
  },

  // ─── Hudson Dynasty ────────────────────────────────────────────────────
  {
    slug: "the-first-acquisition",
    title: "The First Acquisition",
    lane: "hudson_dynasty",
    series_position: 0,
    format: "ebook_and_audiobook",
    position_label: "Prequel novella",
    tagline: "She was hired to audit his empire. Falling for him could destroy them both.",
    blurb:
      "Forensic compliance attorney Arden Shaw walks into Hudson Vale to investigate a failed acquisition " +
      "and finds a company bleeding secrets from the inside out. Every trail leads back to billionaire CEO " +
      "Sebastian Hudson, who is controlled, dangerous, and impossible to read. When her investigation triggers " +
      "threats, leaks, and a media firestorm, the board pushes them into a public engagement to calm investors. " +
      "A high-heat corporate billionaire romance novella.",
    pull_quote: null, // not found verbatim in the LIVE/PROOF EPUBs or source scripts; BookTitle/Permission hide the quote when null
    cover_image: "/prequel-cover.jpg",
    publication_date: null,
    // Catalog: not enrolled in KU, Kindle $0.99 (free via the BookFunnel signup below).
    kindle_unlimited: false,
    retailers: {
      amazon_kindle: "https://swiy.co/05",
      bookfunnel: "https://dl.bookfunnel.com/kw1yge3479",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: null,
    price_usd: 0.99,
  },
  {
    slug: "hostile-tender",
    title: "Hostile Tender",
    lane: "hudson_dynasty",
    series_position: 1,
    format: "ebook_and_audiobook",
    position_label: "Book 1",
    tagline:
      "One anonymous night. One ruthless billionaire. One building neither of them can afford to lose.",
    blurb:
      "Nia Carter has spent her life fighting for people like her grandmother, Pearl, whose Bronx apartment " +
      "building is being targeted by one of Manhattan's most powerful development families. Dante Hudson was " +
      "raised to win. To acquire. To never let emotion touch the deal. Then one no-names night in a luxury hotel " +
      "changes everything. By morning, Nia learns the stranger she can't stop thinking about is the man behind " +
      "the company trying to demolish the building that raised her. Dante learns the woman who walked out " +
      "before dawn is the tenants' lawyer standing between him and the most important project of his career. " +
      "They should be enemies. They are enemies. But every mediation session, every secret meeting, and every " +
      "stolen touch pulls them deeper into a fight neither one expected. A steamy billionaire romantic suspense " +
      "novel.",
    pull_quote: null, // not found verbatim in the LIVE/PROOF EPUBs or source scripts; BookTitle/Permission hide the quote when null
    cover_image: "https://m.media-amazon.com/images/I/81iGQzEnacL._SL1500_.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/HD1",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: null,
    price_usd: 4.99,
  },
  {
    slug: "poison-pills",
    title: "Poison Pill",
    lane: "hudson_dynasty",
    series_position: 2,
    format: "ebook_and_audiobook",
    position_label: "Book 2",
    tagline:
      "He came to take everything she'd built. She built a trap with his name on it.",
    blurb:
      "Xia Zhao doesn't lose. As the architect of Apex Dynamics' defenses, she spent two years loading the one " +
      "weapon that stops a hostile takeover cold. Corporate raider Damien Vale has taken eleven companies apart in " +
      "nine years, and he has never met a defense he couldn't dismantle until hers. Forced into the same rooms " +
      "and late nights, they find the leak that started this war came from inside her own walls. " +
      "Enemies to lovers, very steamy.",
    pull_quote: null, // not found verbatim in the LIVE/PROOF EPUBs or source scripts; BookTitle/Permission hide the quote when null
    cover_image: "https://storage.mlcdn.com/account_image/1246760/sbcZf9GwBaCWBcC5QKmu8oWakuKfIhojGzbnYNMb.png",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/HD2",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: null,
    price_usd: 4.99,
  },

  {
    // Source: live amazon.com listing for B0HDKNP9F6 (title, blurb, price, Kindle Unlimited, cover)
    // checked 2026-10-15; cover URL and KU status also match the catalog sheet.
    slug: "golden-parachute",
    title: "Golden Parachute",
    lane: "hudson_dynasty",
    series_position: 3,
    format: "ebook",
    position_label: "Book 3",
    tagline:
      "He can restructure a billion dollars of bad debt. He cannot buy his way around the one woman who refuses to be managed.",
    blurb:
      "Miri Doyle-Levine has spent eight years keeping other people on their feet. A home health aide fighting " +
      "her way into nursing school, she has no time for a man who treats every problem like a number he can make " +
      "disappear. Kai Hsu built his life the same way he handles distressed credit: control the risk, close the " +
      "exits, never need anything. Then Miri sees through him in one glance. The chemistry is immediate. The " +
      "terms are not. She refuses his money. He keeps trying to turn care into logistics. And when the body Kai " +
      "has ignored for years finally forces him to stop, both of them have to decide what love looks like when " +
      "rescue is off the table. Miri will not become his cure. Kai will have to become a man who can stay. " +
      "Golden Parachute is a high-heat contemporary romance about class difference, emotional recovery, " +
      "boundaries, and choosing love without surrendering yourself. It can be read as a standalone and ends " +
      "with a complete happily ever after. Content note: explicit consensual sexual content, compulsive sexual " +
      "behavior recovery, and a serious medical emergency.",
    pull_quote: null,
    cover_image: "https://m.media-amazon.com/images/I/81sk9fx+I6L._SL1500_.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0HDKNP9F6?tag=reeseastor-20",
      audible: null,
    },
    // No standalone audiobook is confirmed: the catalog sheet lists the audiobook as VERIFY, and the
    // Amazon page (checked 2026-10-15) shows only an "Audiobook with virtual voice" add-on on the Kindle
    // edition ($0.99 with membership / $1.99). Kept false until a produced audiobook ASIN exists.
    audiobook_available: false,
    isbn: null,
    asin: "B0HDKNP9F6",
    price_usd: 4.99,
  },

  // ─── Intimate Psychological Narratives ────────────────────────────────
  {
    slug: "the-need-for-permission",
    title: "The Need for Permission",
    lane: "intimate_psychological_narratives",
    series_position: 1,
    format: "audiobook",
    position_label: "On the Quiet Recovery of Self-Trust",
    tagline: "A ten-chapter audiobook on rebuilding self-trust, in your own voice and your own hours.",
    blurb:
      "Sixty quiet minutes for the late hours. Across ten chapters, The Need for Permission examines what " +
      "it means to live waiting for someone else to say yes — and what changes the moment you stop. " +
      "Made for listening alone, in the dark, when the house is finally still.",
    pull_quote: null, // not found verbatim in the LIVE/PROOF EPUBs or source scripts; BookTitle/Permission hide the quote when null
    // No cover asset exists yet (needs one from Artistly/Canva). The UI shows a typographic placeholder.
    cover_image: null,
    cover_image_square: null,
    publication_date: null,
    kindle_unlimited: false,
    retailers: {
      // Wired via env at runtime — see RetailerLink in components/permission.
      gumroad: null,
      audible: null,
      apple_books: null,
      spotify: null,
      elevenreader: null,
      google_play: null,
      bookfunnel: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: null,
    price_usd: 4.99,
  },
];

// ─── Lookups ─────────────────────────────────────────────────────────────

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getBooksInLane(lane: Lane): Book[] {
  return BOOKS.filter((b) => b.lane === lane).sort((a, b) => {
    const ap = a.series_position ?? 999;
    const bp = b.series_position ?? 999;
    return ap - bp;
  });
}

/**
 * Lane-scoped recommendations. Never crosses lanes — romance readers don't
 * see the recovery title and vice versa. The Intimate Psychological
 * Narratives lane is the explicit exception: when a recovery reader asks
 * for "more by Reese Astor", the romance lanes are returned but visually
 * de-emphasized in the consuming component.
 */
export function getOtherBooksInLane(slug: string): Book[] {
  const book = getBook(slug);
  if (!book) return [];
  return getBooksInLane(book.lane).filter((b) => b.slug !== slug);
}
