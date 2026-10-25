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
  /** Trope keywords, as readers search them. Used in JSON-LD and llms.txt. */
  tropes?: string[];
  /** Lead couple, hero first. */
  characters?: string[];
};

export const LANE_META: Record<Lane, { eyebrow: string; title: string; subtitle: string }> = {
  manhattan_money_kings: {
    eyebrow: "A SERIES",
    title: "Manhattan Money Kings",
    subtitle: "Manhattan's most powerful men, undone by the women who refuse to look away.",
  },
  hudson_dynasty: {
    eyebrow: "A SERIES",
    title: "Hudson Dynasty",
    subtitle: "Each book stands alone. The dynasty does not.",
  },
  intimate_psychological_narratives: {
    eyebrow: "A NEW LINE",
    title: "Intimate Psychological Narratives",
    subtitle: "Quiet, intimate audiobooks for the late hours.",
  },
};

export const BOOKS: Book[] = [
  // ─── Manhattan Money Kings ─────────────────────────────────────────────
  // Canon: ACCURATE_BOOK_INFO.md. Prequel + Books 1–4.
  // Kindle Unlimited (owner-confirmed 10/2026): every Reese Astor title is in KU
  // except the two free prequels, The First Acquisition and One Night Stand.
  {
    slug: "the-billionaires-one-night-stand",
    title: "The Billionaire's One Night Stand",
    lane: "manhattan_money_kings",
    series_position: 0,
    format: "ebook",
    position_label: "Prequel",
    tagline: "One night was supposed to mean nothing. He decided it would mean everything.",
    blurb:
      "Victoria walked into an upscale Manhattan bar the night she was passed over for partner. James Chen, " +
      "the self-made tech billionaire every magazine wants to profile, was not supposed to be the one who " +
      "noticed. One night was the plan. He has other ideas.",
    pull_quote: "“You were supposed to be a stranger. You decided otherwise.”",
    cover_image: "/covers/mmk-0-one-night-stand.jpg",
    publication_date: null,
    kindle_unlimited: false,
    // Free prequel: BookFunnel is the only link shown, so the Amazon $0.99
    // listing never competes with the newsletter signup.
    retailers: {
      bookfunnel: "https://dl.bookfunnel.com/xrodg0t77p",
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0DSG7NKGP",
    price_usd: 0,
    tropes: ["one night stand", "billionaire romance", "Manhattan"],
    characters: ["James Chen", "Victoria"],
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
      amazon_kindle: "https://swiy.co/b01",
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0F2W8QL7S",
    price_usd: 3.99,
    tropes: ["boss and assistant", "forbidden romance", "corporate intrigue"],
    characters: ["Michael Hastings", "Sarah Shah"],
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
      "Lily Chen, a gymnast turned thief, breaks into David Kim's penthouse to steal the secrets her father " +
      "demands. The billionaire catches her red-handed. Instead of calling the police, he makes her an offer: " +
      "marry him, and he keeps her out of her father's reach. Their forced alliance turns into something " +
      "neither of them planned for.",
    pull_quote: "“Twelve months. He intended every one of them.”",
    cover_image: "/author-kit/mmk-2-fake-wife.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/2rd",
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0FCCBNF8X",
    price_usd: 3.99,
    tropes: ["fake marriage", "enemies to lovers", "forced proximity"],
    characters: ["David Kim", "Lily Chen"],
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
      "Three years ago, Sophia Reed walked away from a hotel room and a man she should never have trusted, " +
      "rising mogul Dominic Kane. Now the CEO who controls outcomes for a living is back, and the daughter " +
      "Sophia has protected has eyes he can't deny. When Dominic returns to reclaim his empire, he " +
      "discovers the truth he was never meant to miss.",
    pull_quote: "“He could buy silence. He could not buy back the years.”",
    cover_image: "/author-kit/mmk-3-baby-secret.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/3rd",
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0G12LBZ24",
    price_usd: 3.99,
    tropes: ["secret baby", "second chance", "workplace romance"],
    characters: ["Dominic Kane", "Sophia Reed"],
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
      "expected to become the family they both need. Ethan hasn't smiled since his wife died. His " +
      "five-year-old daughter hasn't spoken. Seven nannies have quit. He doesn't need another " +
      "complication, especially not one with quick wit, warm hands, and a mouth that talks back.",
    pull_quote: "“She also had something Gloria would never understand: a little girl who finally called her Mama.”",
    cover_image: "/author-kit/mmk-4-forbidden-nanny.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/4rd",
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0GDZ4T164",
    price_usd: 3.99,
    tropes: ["nanny romance", "single dad", "forbidden romance"],
    characters: ["Ethan Calloway", "Camille Torres"],
  },

  // ─── Hudson Dynasty ────────────────────────────────────────────────────
  // Canon: prequel + Books 1–3. Each book stands alone; the dynasty does not.
  {
    slug: "the-first-acquisition",
    title: "The First Acquisition",
    lane: "hudson_dynasty",
    series_position: 0,
    format: "ebook_and_audiobook",
    position_label: "Prequel novella",
    tagline: "One fake engagement. One deal neither of them can afford to lose.",
    blurb:
      "Sebastian Hudson, CEO. Arden Shaw, forensic compliance attorney. One fake engagement that is " +
      "supposed to protect them both. The Hudson Dynasty starts here.",
    pull_quote: null,
    cover_image: "/covers/hd-0-first-acquisition.jpg",
    publication_date: null,
    kindle_unlimited: false,
    // Free prequel: BookFunnel only (see note on the MMK prequel above).
    retailers: {
      bookfunnel: "https://dl.bookfunnel.com/kw1yge3479",
      audible: null,
    },
    audiobook_available: true,
    isbn: null,
    asin: "B0D82GWFD9",
    price_usd: 0,
    tropes: ["fake engagement", "billionaire romance"],
    characters: ["Sebastian Hudson", "Arden Shaw"],
  },
  {
    slug: "hostile-tender",
    title: "Hostile Tender",
    lane: "hudson_dynasty",
    series_position: 1,
    format: "ebook",
    position_label: "Book 1",
    tagline: "Trust is a weapon. Desire is the risk.",
    blurb:
      "Dante Hudson builds Manhattan. Nia Carter defends the Bronx tenants his family's redevelopment would " +
      "push out. She is the one obstacle his money can't move, and he is the one man she can't afford to " +
      "want. An enemies-to-lovers standalone in the Hudson Dynasty.",
    pull_quote: null,
    cover_image: "/covers/hd-1-hostile-tender.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/HD1",
      audible: null,
    },
    audiobook_available: false,
    isbn: null,
    asin: "B0H1F9PV97",
    price_usd: 4.99,
    tropes: ["enemies to lovers", "billionaire developer", "steamy"],
    characters: ["Dante Hudson", "Nia Carter"],
  },
  {
    slug: "poison-pill",
    title: "Poison Pill",
    lane: "hudson_dynasty",
    series_position: 2,
    format: "ebook",
    position_label: "Book 2",
    tagline: "Power has a price. Love is the liability.",
    blurb:
      "Damien Vale is the corporate raider. Dr. Xia Zhao is the founder and scientist whose company he " +
      "wants. A slow-burn, very steamy hostile-takeover romance in the Hudson Dynasty.",
    pull_quote: null,
    cover_image: "/covers/hd-2-poison-pill.jpg",
    publication_date: null,
    kindle_unlimited: true,
    retailers: {
      amazon_kindle: "https://swiy.co/HD2",
      audible: null,
    },
    audiobook_available: false,
    isbn: null,
    asin: null,
    price_usd: 4.99,
    tropes: ["hostile takeover", "slow burn", "very steamy"],
    characters: ["Damien Vale", "Dr. Xia Zhao"],
  },
  {
    slug: "golden-parachute",
    title: "Golden Parachute",
    lane: "hudson_dynasty",
    series_position: 3,
    format: "ebook",
    position_label: "Book 3",
    tagline: "The golden parachute was never the money.",
    blurb:
      "Kai Hsu can restructure a billion dollars of bad debt. He cannot buy his way around Miri " +
      "Doyle-Levine, the home health aide working her way into nursing school who refuses to be managed. " +
      "A class-divide standalone in the Hudson Dynasty, told in dual POV, with high heat and a happy ending.",
    pull_quote: null,
    cover_image: "/covers/hd-3-golden-parachute.jpg",
    publication_date: "2026-08-09",
    kindle_unlimited: true,
    retailers: {
      // TODO(owner): replace with the dp/<ASIN> link once the ASIN is on file.
      amazon_kindle: "https://www.amazon.com/s?k=Golden+Parachute+Reese+Astor&i=digital-text",
    },
    audiobook_available: false,
    isbn: null,
    asin: null,
    price_usd: null,
    tropes: ["class divide", "dual POV", "high heat", "HEA"],
    characters: ["Kai Hsu", "Miri Doyle-Levine"],
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
    pull_quote:
      "“You do not need anyone's permission to be the person you already are. You only need to stop waiting for it.”",
    cover_image: "/covers/permission-cover.jpg",
    cover_image_square: "/covers/permission-square-1200.jpg",
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
