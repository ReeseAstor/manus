import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const premiumProducts = [
  {
    name: "Manhattan Money Kings: The Complete Insider's Collection",
    description: "All 3 books + prequel in premium formats with exclusive 50+ page bonus epilogues for each couple, character interviews, deleted scenes, behind-the-scenes author commentary, printable character art collection, and reading soundtrack playlist.",
    price: 9700, // $97.00 in cents
    currency: "usd",
    type: "one_time",
    features: JSON.stringify([
      "All 3 Manhattan Money Kings books + prequel",
      "50+ pages of exclusive bonus epilogues",
      "Character interviews and deleted scenes",
      "Behind-the-scenes author commentary",
      "Printable character art collection",
      "Curated reading soundtrack playlist",
    ]),
    active: true,
  },
  {
    name: "Write Your Own Billionaire Romance Masterclass",
    description: "10-module video course teaching romance writing with workbooks, templates, plotting tools, your personal writing process and techniques, character development worksheets, scene-by-scene breakdown of bestsellers, and private Facebook group access.",
    price: 29700, // $297.00 in cents
    currency: "usd",
    type: "one_time",
    features: JSON.stringify([
      "10 comprehensive video modules",
      "Workbooks and plotting templates",
      "Personal writing process insights",
      "Character development worksheets",
      "Scene-by-scene bestseller breakdowns",
      "Private Facebook group access",
    ]),
    active: true,
  },
  {
    name: "Alpha Hero Blueprint Template Pack",
    description: "25+ character profile templates, trope combination guide, dialogue examples and voice development, emotional arc mapping tools, and romance beat sheets.",
    price: 4700, // $47.00 in cents
    currency: "usd",
    type: "one_time",
    features: JSON.stringify([
      "25+ character profile templates",
      "Trope combination guide",
      "Dialogue examples and voice development",
      "Emotional arc mapping tools",
      "Romance beat sheets",
    ]),
    active: true,
  },
  {
    name: "VIP Reader Experience Annual Membership",
    description: "Monthly exclusive short stories (12 per year), quarterly video calls, early access to all new releases (2 weeks early), signed paperback of each new book, name in acknowledgments, and private Discord community.",
    price: 49700, // $497.00/year in cents
    currency: "usd",
    type: "subscription",
    features: JSON.stringify([
      "12 exclusive short stories per year",
      "Quarterly video calls with author",
      "Early access to new releases (2 weeks)",
      "Signed paperback of each new book",
      "Name in book acknowledgments",
      "Private Discord community access",
    ]),
    active: true,
  },
  {
    name: "Book Club in a Box",
    description: "Complete discussion guide for all 3 books, printable character cards, Manhattan-themed cocktail recipes, playlist and mood boards, author video Q&A (30 min recording), and certificates for book club members.",
    price: 6700, // $67.00 in cents
    currency: "usd",
    type: "one_time",
    features: JSON.stringify([
      "Complete discussion guides for all 3 books",
      "Printable character cards",
      "Manhattan-themed cocktail recipes",
      "Curated playlist and mood boards",
      "30-minute author Q&A video",
      "Book club member certificates",
    ]),
    active: true,
  },
];

async function seedProducts() {
  console.log("Seeding products...");
  
  for (const product of premiumProducts) {
    await db.insert(products).values(product);
    console.log(`✓ Added: ${product.name}`);
  }
  
  console.log("\n✅ All products seeded successfully!");
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error("Error seeding products:", error);
  process.exit(1);
});
