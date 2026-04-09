import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });

const mysql2 = await import('mysql2/promise');
const connection = await mysql2.createConnection(process.env.DATABASE_URL);

// Real Amazon URLs found via search
const products = {
  // Reading accessories
  husbandPillow: 'https://www.amazon.com/Husband-Pillow-Original-Shredded-Removable/dp/B0BMPFB4TT',
  aimuan: 'https://www.amazon.com/Aimuan-Reading-Sleeping-Pregnancy-Standard/dp/B09V518DRK',
  glocusent: 'https://www.amazon.com/Glocusent-Brightness-Bendable-Rechargeable-Repairing/dp/B07WNRN9WQ',
  classicalCandle: 'https://www.amazon.com/dp/B0F1FY6XT7',
  bestsellerCandle: 'https://www.amazon.com/Smells-Like-Writing-Bestseller1-Candle/dp/B0CMTXKBWW',
  fuzzySocks: 'https://www.amazon.com/dp/B0F8BPSCZV',
  wineGlass: 'https://www.amazon.com/reading-Bookworm-Christmas-Birthday-Readers58/dp/B0FWC3HD8X',
  kindle: 'https://www.amazon.com/All-new-Amazon-Kindle-Paperwhite-glare-free/dp/B0CFPJYX7P',
  // Books
  blackTies: 'https://www.amazon.com/Black-Ties-White-Lies-Billionaire-ebook/dp/B0BHL1JX9P',
  bossyBillionaire: 'https://www.amazon.com/Bossy-Billionaire-Billion-Dollar-Men-Book-ebook/dp/B0CKTFT366',
  twistedPawn: 'https://www.amazon.com/Twisted-Pawn-Society-Villains-Book-ebook/dp/B0F8FML9QY',
  billionaireSecretMarriage: 'https://www.amazon.com/dp/B07D7LPC3J',
};

// Blog 1: The Ultimate Cozy Reading Night Setup
const blog1Content = `<p>There's a difference between reading a book and <em>living</em> inside one. I've spent years perfecting my reading ritual, and I'm convinced that the right setup doesn't just make reading more comfortable — it makes the story better. When your body is at ease, your mind slips into the world on the page faster, deeper, and longer.</p>

<p>So here's everything I actually use and love for my own reading nights. Some of these I discovered by accident, some I hunted down specifically, and all of them have earned a permanent spot in my routine.</p>

<h2>The Throne: A Proper Reading Pillow</h2>

<p>If you're reading in bed propped up against a flat pillow, you're working too hard. A dedicated bed rest pillow with arms changes everything. I use the <a href="${products.husbandPillow}" target="_blank" rel="noopener noreferrer">Husband Pillow Original Shredded Memory Foam</a> — it has side pockets for your phone and glasses, and the shredded memory foam means it actually holds its shape after months of use. Your back will thank you.</p>

<p>For something a bit more compact, the <a href="${products.aimuan}" target="_blank" rel="noopener noreferrer">Aimuan Reading Pillow</a> is a great option if you like to move between the bed and the sofa. It's lighter, still has the arm support, and comes in several colors.</p>

<h2>The Light: Because Overhead Lighting Is the Enemy</h2>

<p>Harsh overhead lighting is the fastest way to kill a mood. I keep a dedicated book light clipped to whatever I'm reading — the <a href="${products.glocusent}" target="_blank" rel="noopener noreferrer">Glocusent LED Book Light</a> is the one I reach for every single time. It has multiple brightness settings, a flexible neck design, and a long-lasting rechargeable battery. It's the kind of thing you don't realize you need until you have it, and then you can't imagine reading without it.</p>

<h2>The Scent: Candles That Set the Scene</h2>

<p>I'm a firm believer that scent is the fastest way to shift your mood. When I'm writing, I burn something woodsy and warm. When I'm reading, I want something that feels like a library or a cozy evening in.</p>

<p>The <a href="${products.classicalCandle}" target="_blank" rel="noopener noreferrer">Classical Library Candle</a> — with notes of bergamot rose, amber, and sandalwood — is exactly that. It smells like old books and expensive apartments, which, honestly, is the vibe I'm always chasing.</p>

<p>And if you want something a little more playful, the <a href="${products.bestsellerCandle}" target="_blank" rel="noopener noreferrer">"Smells Like She's Writing a Bestseller" Soy Candle</a> is a gift I've given to every writer I know. It's funny, it smells incredible, and it burns for hours.</p>

<h2>The Socks: Non-Negotiable</h2>

<p>Cold feet ruin books. I'm not being dramatic. The <a href="${products.fuzzySocks}" target="_blank" rel="noopener noreferrer">HAPPYPOP Book Lover Fuzzy Socks</a> have little bookshelf patterns and are genuinely the softest things I own. They make a perfect gift for any reader in your life.</p>

<h2>The Glass: Because You Deserve It</h2>

<p>Whether it's wine, sparkling water, or a fancy mocktail, reading is better with something in your hand. The <a href="${products.wineGlass}" target="_blank" rel="noopener noreferrer">Book Lover Wine Glass</a> says <em>"There Is No Such Thing As Too Many Books"</em> on the side, which is both a statement and a lifestyle. It's a stemless glass — practical, pretty, and endlessly giftable.</p>

<h2>The Device: For When You Want to Travel Light</h2>

<p>Sometimes I don't want to hold a physical book. The <a href="${products.kindle}" target="_blank" rel="noopener noreferrer">Kindle Paperwhite (newest model, 7" display)</a> is still my favorite e-reader — the glare-free display is crisp, the battery lasts weeks, and it's waterproof, which means I can read in the bath without anxiety. If you're a heavy reader and you don't have one yet, this is the upgrade that will genuinely change your reading life.</p>

<p><em>What does your reading setup look like? I'm always looking for new additions to the ritual — drop a comment and let me know.</em></p>`;

// Blog 2: Best Billionaire Romance Books
const blog2Content = `<p>If you've made it through all four Manhattan Money Kings books and you're standing in that particular kind of literary grief — the one where you've finished a series and the world feels slightly less interesting — first of all, I understand completely. Second: I've got you.</p>

<p>These are the books I recommend to readers who loved the Manhattan Money Kings world. They share the same DNA: powerful men with complicated pasts, women who don't fold easily, and the kind of slow-burn tension that makes you read past midnight.</p>

<h2>Black Ties and White Lies — Kat Singleton</h2>

<p>This is the book I recommend most often to readers who loved the fake relationship arc in <em>The Billionaire's Fake Wife</em>. Beck is the kind of hero who is infuriating in exactly the right way — arrogant, controlled, and completely undone by the one woman he was never supposed to want. The forced proximity and ex's-older-brother dynamic make this one genuinely hard to put down.</p>

<p><a href="${products.blackTies}" target="_blank" rel="noopener noreferrer"><strong>Get it on Amazon →</strong></a></p>

<h2>Bossy Billionaire — M. Robinson</h2>

<p>If you liked the alpha-with-a-heart-of-gold energy in the Manhattan Money Kings, M. Robinson's <em>Bossy Billionaire</em> delivers that in full. It's the first in the Billion-Dollar Men series, and it hits all the right notes: a powerful CEO, a woman who challenges him at every turn, and a romance that builds slowly before it explodes. The banter is sharp and the chemistry is real.</p>

<p><a href="${products.bossyBillionaire}" target="_blank" rel="noopener noreferrer"><strong>Get it on Amazon →</strong></a></p>

<h2>Twisted Pawn — L.J. Shen</h2>

<p>For readers who liked the darker, more morally complex edges of the series — particularly the power dynamics — L.J. Shen's <em>Twisted Pawn</em> is a must. It's a dark revenge romance with a hero who is genuinely difficult to like at first, which makes the eventual emotional payoff even more satisfying. Shen is one of the best in the genre at writing men who are broken in interesting ways.</p>

<p><a href="${products.twistedPawn}" target="_blank" rel="noopener noreferrer"><strong>Get it on Amazon →</strong></a></p>

<h2>The Billionaire's Secret Marriage — Tamie Dearen</h2>

<p>If you want something with a bit more warmth and heart — a grumpy-sunshine dynamic with real emotional depth — Tamie Dearen's <em>The Billionaire's Secret Marriage</em> is a lovely read. It's a USA Today bestselling title with a hero rescue arc and the kind of overcoming-the-odds story that leaves you smiling.</p>

<p><a href="${products.billionaireSecretMarriage}" target="_blank" rel="noopener noreferrer"><strong>Get it on Amazon →</strong></a></p>

<p><em>Have a billionaire romance recommendation I should add to this list? I read everything my readers send me — leave it in the comments.</em></p>`;

// Blog 3: Writing Candles
const blog3Content = `<p>I have a theory about scent and writing: the right candle doesn't just smell good, it becomes a trigger. After enough sessions burning the same candle while writing, your brain starts to associate that scent with the creative state. You light it, and something in you shifts — the noise of the day quiets, and the story gets louder.</p>

<p>I've been testing this theory for years. Here's what I've learned.</p>

<h2>My Current Writing Candle</h2>

<p>When I'm drafting anything in the Manhattan Money Kings world — all that glass and steel and expensive cologne energy — I burn the <a href="${products.classicalCandle}" target="_blank" rel="noopener noreferrer">Classical Library Candle</a>. The bergamot and rose top notes feel sophisticated without being sweet, and the cedarwood and sandalwood base is exactly the kind of warm, grounded scent that makes me feel like I'm writing in a penthouse library. Which is, obviously, the goal.</p>

<p>It's a 4oz soy wax candle with about 20 hours of burn time — enough to get me through a solid writing sprint or two.</p>

<h2>For the Lighter Days</h2>

<p>When I'm editing or doing lighter creative work — brainstorming, outlining, answering reader mail — I switch to something softer. The <a href="${products.bestsellerCandle}" target="_blank" rel="noopener noreferrer">"Smells Like She's Writing a Bestseller" Soy Candle</a> is my go-to for those sessions. The scent is warm and a little floral, and honestly, reading the label every time I light it is its own small motivational moment.</p>

<h2>Why a Writing Scent Works</h2>

<p>There's real science behind scent-based memory and focus. Olfactory cues are processed in the limbic system — the part of the brain that handles emotion and memory — which is why a particular smell can transport you instantly to a specific place or state of mind. Writers have used this for centuries. Proust wrote an entire novel about it.</p>

<p>The practical version: pick one candle, burn it only when you write, and give it a few weeks. You'll be surprised how quickly your brain learns the shortcut.</p>

<h2>A Gift Idea for the Writers in Your Life</h2>

<p>If you have a writer friend who deserves something thoughtful, the <a href="${products.bestsellerCandle}" target="_blank" rel="noopener noreferrer">"Smells Like She's Writing a Bestseller" candle</a> is genuinely one of the best gifts I've ever received. It's specific enough to feel personal and practical enough to actually get used. Pair it with a nice notebook and you have a complete gift that any writer will love.</p>

<p><em>What do you burn while you read or write? I'm always looking for new additions to the ritual.</em></p>`;

// Blog 4: Romance Reader Gift Guide
const blog4Content = `<p>Romance readers are, as a group, the most enthusiastic and devoted readers on the planet. We read fast, we read a lot, and we have opinions. If you're shopping for one of us — or shopping for yourself, which is always valid — here's what actually lands.</p>

<p>I've organized this by budget, because a great gift doesn't have to be expensive. It just has to be right.</p>

<h2>Under $20: The Thoughtful Touches</h2>

<p><strong>Book Lover Fuzzy Socks</strong> — The <a href="${products.fuzzySocks}" target="_blank" rel="noopener noreferrer">HAPPYPOP Book Lover Fuzzy Socks</a> come with little bookshelf patterns. They're warm, they're soft, and they're the kind of thing a reader will actually use every single day. A perfect stocking stuffer or add-on gift.</p>

<p><strong>Bookish Wine Glass</strong> — The <a href="${products.wineGlass}" target="_blank" rel="noopener noreferrer">"Too Many Books" Wine Glass</a> is a stemless glass that says everything a romance reader believes. It's practical, it's funny, and it's the kind of gift that gets used at every reading night.</p>

<p><strong>A Writing Candle</strong> — The <a href="${products.classicalCandle}" target="_blank" rel="noopener noreferrer">Classical Library Candle</a> is a beautiful, atmospheric candle with bergamot, amber, and sandalwood notes. It smells expensive and it's not. Perfect for the reader who loves a mood.</p>

<h2>$20–$50: The Upgrade</h2>

<p><strong>A Proper Book Light</strong> — The <a href="${products.glocusent}" target="_blank" rel="noopener noreferrer">Glocusent LED Book Light</a> is the gift that readers don't know they need until they have it. Multiple brightness settings, a flexible neck, and a long-lasting rechargeable battery. Around $20–25.</p>

<p><strong>A Reading Pillow</strong> — The <a href="${products.aimuan}" target="_blank" rel="noopener noreferrer">Aimuan Reading Pillow with Arms</a> is the kind of gift that changes someone's reading life. If your person reads in bed or on the sofa, this is the upgrade they've been putting off buying for themselves.</p>

<h2>$50+: The Big Gift</h2>

<p><strong>A Kindle Paperwhite</strong> — If there's one gift that every serious reader should have, it's the <a href="${products.kindle}" target="_blank" rel="noopener noreferrer">Kindle Paperwhite (newest model)</a>. The 7" glare-free display, weeks of battery life, and waterproof design make it the best e-reader on the market. It's the gift that keeps giving — every book they download after this is part of your gift. Currently $159.99.</p>

<p><em>What's on your own reading wishlist? Drop it in the comments — I'm always looking for gift ideas to add to this list.</em></p>`;

const updates = [
  { slug: 'ultimate-cozy-reading-night-setup', content: blog1Content },
  { slug: 'best-billionaire-romance-books-after-manhattan-money-kings', content: blog2Content },
  { slug: 'favorite-candles-for-writing-mood', content: blog3Content },
  { slug: 'romance-reader-gift-guide', content: blog4Content },
];

for (const update of updates) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await connection.execute(
    'UPDATE blog_posts SET content = ?, updatedAt = ? WHERE slug = ?',
    [update.content, now, update.slug]
  );
  console.log(`✓ Updated: ${update.slug}`);
}

console.log('\nAll 4 blog posts updated with real Amazon links!');
await connection.end();
