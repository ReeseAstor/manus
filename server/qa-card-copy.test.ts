import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";
import { RETAILERS } from "../client/src/data/retailers";

const read = (rel: string) => readFileSync(path.join(process.cwd(), rel), "utf8");

const PUBLISHED_HOOK = "She was hired to audit him. The board wants her to wear his ring.";
const REJECTED_HOOK = "She was hired to audit his empire. Falling for him could destroy them both.";
const WEEKEND_HOOK = "One weekend. Her terms. On Monday, he owns her firm.";
const OFFERED_DEAL = "One fake engagement. One deal neither of them can afford to lose.";

describe("D3 newsletter delivery copy", () => {
  it("stops promising an instant download on the home lead magnets", () => {
    const home = read("client/src/pages/Home.tsx");
    expect(home).not.toMatch(/instant download/i);
    expect(home).toContain("Join the newsletter and get your free download.");
    expect(home).toContain("Join the newsletter and get your free downloads.");
    expect(home).not.toContain("emailed to you");
    expect(home).toContain('href={LINKS.firstAcquisition}');
    expect(home).toContain('href={LINKS.oneNightStand}');
  });

  it("says the free-book form joins the newsletter and emails the novella", () => {
    const page = read("client/src/pages/FreeBook.tsx");
    expect(page).not.toMatch(/instant access/i);
    expect(page).toContain("Enter your email to join the newsletter and get your free download:");
    expect(page).toContain("The complete novella, free when you join the newsletter");
    expect(page).not.toContain("emailed");
    expect(page).toContain("https://dl.bookfunnel.com/hj09ggitwi");
  });

  it("rewrites the book-page prequel line and the newsletter arrival line", () => {
    const band = read("client/src/components/author-kit/NewsletterBand.tsx");
    expect(band).not.toMatch(/instantly/i);
    expect(band).toContain("Or join the newsletter and get the free prequel novella →");
    expect(band).not.toContain("by email");
    const newsletter = read("client/src/pages/Newsletter.tsx");
    expect(newsletter).not.toMatch(/arrives instantly|Instant free book/i);
    expect(newsletter).toContain("free book is included when you join. Check your inbox and the promotions tab.");
    expect(newsletter).not.toContain("emailed to you");
    expect(newsletter).toContain("Free book by email");
  });

  it("describes the One Night Stand BookFunnel offer as emailed after joining", () => {
    const html = read("client/public/read/the-billionaires-one-night-stand/index.html");
    expect(html).not.toContain("Read it free on BookFunnel");
    expect(html).not.toContain("Read it free from BookFunnel");
    expect(html).not.toContain("free on BookFunnel");
    expect(html).not.toContain("BookFunnel may ask");
    expect(html).toContain("Join the newsletter to get the free download link by email.");
    expect(html).toContain("The download link is sent by email after you join the newsletter.");
    expect(html).toContain(
      "Not at the moment. It is free when you join the newsletter, and the download link is sent by email. It is also sold on Kindle.",
    );
    expect(html.match(/href="https:\/\/dl\.bookfunnel\.com\/xrodg0t77p"/g)).toHaveLength(2);
    expect(html).toContain("https://www.amazon.com/dp/B0DSG7NKGP?tag=reeseastor-20");
  });

  it("labels the catalog BookFunnel button as a newsletter join and keeps the URL", () => {
    expect(RETAILERS.bookfunnel.label).toBe("Join the newsletter");
    const ons = BOOKS.find(book => book.slug === "the-billionaires-one-night-stand");
    const prequel = BOOKS.find(book => book.slug === "the-first-acquisition");
    expect(ons?.retailers.bookfunnel).toBe("https://dl.bookfunnel.com/xrodg0t77p");
    expect(prequel?.retailers.bookfunnel).toBe("https://dl.bookfunnel.com/kw1yge3479");
    const fallback = read("scripts/lib/book-fallback.mjs");
    expect(fallback).toContain(">Join the newsletter</a>");
    expect(fallback).toContain("Join the newsletter to get the free book.");
    expect(fallback).not.toContain("emailed to you");
    expect(fallback).not.toContain(">Get it free</a>");
  });
});

describe("D4 canon hooks", () => {
  it("uses the published First Acquisition hook on the free-book page and the book tagline", () => {
    const page = read("client/src/pages/FreeBook.tsx");
    expect(page).toContain(PUBLISHED_HOOK);
    expect(page).not.toContain(REJECTED_HOOK);
    const book = BOOKS.find(entry => entry.slug === "the-first-acquisition");
    expect(book?.tagline).toBe(PUBLISHED_HOOK);
    expect(book?.tagline).not.toBe(OFFERED_DEAL);
  });

  it("uses the published hook in the welcome email", () => {
    const welcome = read("server/email-templates/welcome.ts");
    expect(welcome).toContain(
      "She was hired to audit him. The board wants her to wear his ring. A high-heat corporate billionaire romance novella.",
    );
    expect(welcome).not.toContain(REJECTED_HOOK);
  });

  it("uses the one-weekend canon on the One Night Stand catalog tagline", () => {
    const book = BOOKS.find(entry => entry.slug === "the-billionaires-one-night-stand");
    expect(book?.tagline).toBe(WEEKEND_HOOK);
    expect(book?.tagline).not.toContain("One night with Manhattan");
    expect(book?.title).toBe("The Billionaire's One Night Stand");
  });
});
