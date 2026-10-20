/**
 * Reese Astor catalog — single source of truth.
 *
 * Add a new book by adding one entry to BOOKS below. The /books catalog,
 * each /books/[slug] page, and structured data are generated from this file.
 * No new pages or nav edits required for new titles.
 *
 * Lanes are intentionally separated. Cards never cross lanes in any rail.
 */

export type Lane = "manhattan_money_kings" | "hudson_dynasty" | "intimate_psychological_narratives";
export type BookFormat = "ebook" | "audiobook" | "ebook_and_audiobook";

export type RetailerKey =
  | "amazon_kindle"
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
  cover_image: string;
  /** 1200x1200 social-share variant. Falls back to cover_image when absent. */
  cover_image_square?: string;
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
    tagline: "One night was supposed to mean nothing. He decided it would mean everything.",
    blurb:
      "She walked into the bar to forget her name. He spent the next morning learning every syllable of it. " +
      "When the city's most ruthless dealmaker insists one night was never going to be enough, the woman " +
      "who came to him as a stranger has to decide whether to disappear — or stay and be wholly seen.",
    pull_quote: "“You were supposed to be a stranger. You decided otherwise.”",
    cover_image: "https://m.media-amazon.com/images/I/815-iFRAlpL._SL1500_.jpg",
    publication_date: null,
    kindle_unlimited: false,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0DSG7NKGP",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0DSG7NKGP",
    price_usd: null,
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
    pull_quote: "“He didn't hire her to ruin him. She didn't apply expecting to.”",
    cover_image: "/author-kit/mmk-1-executive-assistant.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0F2W8QL7S",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0F2W8QL7S",
    price_usd: null,
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
      "When thief Elena Volkov breaks into his penthouse, billionaire David Kim catches her red-handed. But " +
      "instead of calling the police, he makes her an offer she can't refuse: marry him for twelve months " +
      "in exchange for protection from her violent father. As they work together, their forced alliance " +
      "ignites into something neither expected.",
    pull_quote: "“Twelve months. He intended every one of them.”",
    cover_image: "/author-kit/mmk-2-fake-wife.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0FCCBNF8X",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0FCCBNF8X",
    price_usd: null,
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
    pull_quote: "“He could buy silence. He could not buy back the years.”",
    cover_image: "/author-kit/mmk-3-baby-secret.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0G12LBZ24",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0G12LBZ24",
    price_usd: null,
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
    pull_quote: "“She also had something Gloria would never understand: a little girl who finally called her Mama.”",
    cover_image: "/author-kit/mmk-4-forbidden-nanny.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0GDZ4T164",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0GDZ4T164",
    price_usd: null,
  },

  // ─── Hudson Dynasty ────────────────────────────────────────────────────
  {
    slug: "the-first-acquisition",
    title: "The First Acquisition",
    lane: "hudson_dynasty",
    series_position: 0,
    format: "ebook_and_audiobook",
    position_label: "Prequel novella",
    tagline: "Before the empire. Before the auditor. The night a Hudson decided.",
    blurb:
      "A Hudson Dynasty prequel novella. Twenty years before the RIVIERA Ledger leaks, a young Sebastian " +
      "Hudson makes the first deal that will define every one that follows — and the first promise he " +
      "will fail to keep. A self-contained origin story for the family, the firm, and the silence.",
    pull_quote: "“He did not yet know what an empire cost. He was about to learn.”",
    cover_image: "https://m.media-amazon.com/images/P/B0D82GWFD9.01._SCLZZZZZZZ_SX500_.jpg",
    publication_date: null,
    kindle_unlimited: false,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0D82GWFD9",
      bookfunnel: "https://dl.bookfunnel.com/kw1yge3479",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0D82GWFD9",
    price_usd: 0,
  },
  {
    slug: "hostile-tender",
    title: "Hostile Tender",
    lane: "hudson_dynasty",
    series_position: 1,
    format: "ebook_and_audiobook",
    position_label: "Book 1",
    tagline:
      "She's the federal auditor sent to dismantle his empire. He's Manhattan's most dangerous billionaire fighting to save it.",
    blurb:
      "When the RIVIERA Ledger exposes three generations of Hudson secrets, SDNY forensic auditor Nia " +
      "Carter and CEO Sebastian Hudson are forced into dangerous proximity. The hostile takeover " +
      "escalates. Secrets surface from the family archives. The line between investigation and intimacy " +
      "dissolves — and trusting each other could cost them everything.",
    pull_quote: "“A record outlives the men who keep it. The discipline is in waiting.”",
    cover_image: "https://m.media-amazon.com/images/I/81iGQzEnacL._SL1500_.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0H1F9PV97",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0H1F9PV97",
    price_usd: null,
  },
  {
    slug: "poison-pills",
    title: "Poison Pill",
    lane: "hudson_dynasty",
    series_position: 2,
    format: "ebook_and_audiobook",
    position_label: "Book 2",
    tagline:
      "The takeover failed. The war didn't end — it went underground, into the bloodstream of the family itself.",
    blurb:
      "Book 2 of the Hudson Dynasty. With the hostile bid beaten back, Sebastian Hudson thought he'd " +
      "secured the empire. But a poison-pill defense buried in the family trust is metabolizing into " +
      "something lethal, and Nia Carter's audit has only scratched the surface. As old loyalties turn " +
      "toxic and the people closest to them choose sides, the line between protecting the dynasty and " +
      "destroying it disappears.",
    pull_quote: "“Every defense is a slow poison. The art is choosing who swallows it.”",
    cover_image: "https://m.media-amazon.com/images/P/B0H53BP5S1.01._SCLZZZZZZZ_SX500_.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0H53BP5S1",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0H53BP5S1",
    price_usd: null,
  },
  {
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
      "exits, never need anything. Then Miri sees through him in one glance. The chemistry is immediate. The terms " +
      "are not. She refuses his money. He keeps trying to turn care into logistics. And when the body Kai has " +
      "ignored for years finally forces him to stop, both of them have to decide what love looks like when rescue " +
      "is off the table. Miri will not become his cure. Kai will have to become a man who can stay. Golden " +
      "Parachute is a high-heat contemporary romance about class difference, emotional recovery, boundaries, and " +
      "choosing love without surrendering yourself. It can be read as a standalone and ends with a complete " +
      "happily ever after. Content note: explicit consensual sexual content, compulsive sexual behavior recovery, " +
      "and a serious medical emergency.",
    pull_quote: null,
    cover_image: "https://m.media-amazon.com/images/P/B0HDKNP9F6.01._SCLZZZZZZZ_SX500_.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://www.amazon.com/dp/B0HDKNP9F6",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0HDKNP9F6",
    price_usd: null,
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
