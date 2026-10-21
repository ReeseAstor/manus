import { Link } from "wouter";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { Reveal } from "@/components/author-kit";
import { getBooksInLane, LANE_META } from "@/data/books";
import { breadcrumbSchema, personSchema, AUTHOR_DESCRIPTION } from "@/data/structured-data";

/**
 * About — pen-name bio. House rules: no career history, no location beyond
 * "Manhattan" as the books' setting, no credentials that can't be sourced.
 */
const SERIES = ["hudson_dynasty", "manhattan_money_kings"] as const;

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] text-gray-200">
      <EnhancedSEOHead
        title="About Reese Astor | Billionaire Romance Author"
        description={AUTHOR_DESCRIPTION}
        canonical="/about"
        ogType="website"
        structuredData={[
          personSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="container py-28">
        <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-14 items-start max-w-6xl mx-auto">
          <Reveal>
            <img
              src="/images/reese-astor-author.png"
              alt="Reese Astor"
              width={720}
              height={960}
              className="rounded-xl shadow-2xl w-full object-cover aspect-[3/4]"
            />
          </Reveal>

          <Reveal direction="up" className="space-y-8">
            <p className="text-sm tracking-[0.3em] uppercase text-[#d4af37]">About the author</p>
            <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight">Reese Astor</h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Steamy billionaire romance, set in Manhattan. Every book stands alone and ends happily.
            </p>

            <div className="space-y-5 text-lg leading-relaxed text-gray-300">
              <p>
                I write about powerful people who have learned to negotiate everything except each other.
                The money in my books is part of the plot: takeovers, redevelopment fights, family trusts,
                bad debt. So is the heat, and so is the happy ending.
              </p>
              <p>
                There are two series. The Hudson Dynasty follows one Manhattan family and the people who
                refuse to be acquired by it. The Manhattan Money Kings are standalone romances about men who
                control everything except the women who walk into their lives.
              </p>
              <p>
                If you are new, start with a free prequel:{" "}
                <a className="text-[#d4af37] underline" href="https://dl.bookfunnel.com/kw1yge3479" target="_blank" rel="noopener noreferrer">
                  The First Acquisition
                </a>{" "}
                for the Hudsons, or{" "}
                <a className="text-[#d4af37] underline" href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                  The Billionaire&rsquo;s One Night Stand
                </a>{" "}
                for the Money Kings.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container pb-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {SERIES.map((lane) => (
            <Reveal key={lane} className="border border-white/10 rounded-2xl p-8">
              <h2 className="font-serif text-3xl text-white">{LANE_META[lane].title}</h2>
              <p className="text-gray-400 mt-2">{LANE_META[lane].subtitle}</p>
              <ol className="mt-6 space-y-2">
                {getBooksInLane(lane).map((b) => (
                  <li key={b.slug}>
                    <Link href={`/books/${b.slug}`} className="text-white hover:text-[#d4af37]">
                      <span className="text-gray-500 text-sm mr-2">{b.position_label}</span>
                      {b.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-14 flex flex-wrap gap-4">
          <Link href="/books" className="px-6 py-3 rounded-md bg-[#d4af37] text-[#0a1628] font-semibold">
            See all books
          </Link>
          <Link href="/newsletter" className="px-6 py-3 rounded-md border border-[#d4af37]/40 text-[#d4af37]">
            Join the newsletter
          </Link>
          <Link href="/press" className="px-6 py-3 rounded-md border border-white/20 text-gray-200">
            Press kit
          </Link>
        </div>
      </section>
    </div>
  );
}
