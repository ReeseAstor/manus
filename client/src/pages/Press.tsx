import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import {
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  INK,
  SectionHeading,
  TEXT,
  TEXT_SOFT,
} from "@/components/author-kit";

const PRESS_EMAIL = "press@reeseastor.com";

export default function Press() {
  useEffect(() => {
    document.title = "Press · Reese Astor";
  }, []);

  return (
    <div
      className="kit-grain min-h-screen font-cormorant"
      style={{ background: INK, color: TEXT }}
    >
      <EnhancedSEOHead
        title="Press · Reese Astor"
        description="Press resources, bio, covers, and contact for Reese Astor, author of steamy billionaire romance."
        canonical="https://reeseastor.com/press"
      />

      <section className="px-6 md:px-16 py-[140px]">
        <div className="max-w-[820px] mx-auto">
          <Eyebrow>For media, podcasts, and trade</Eyebrow>
          <h1
            className="font-display font-normal text-[44px] md:text-[58px] leading-[1.05] mt-5"
            style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
          >
            Press
          </h1>
          <div className="my-7 h-px w-14" style={{ background: GOLD_SOFT }} />
          <p
            className="font-cormorant italic text-[20px] leading-[1.5]"
            style={{ color: TEXT_SOFT }}
          >
            Interview requests, review copies, podcast appearances, and trade inquiries are welcome.
          </p>
        </div>
      </section>

      <section
        className="px-6 md:px-16 py-[100px]"
        style={{ background: "#F0E6E5", borderTop: `1px solid ${GOLD_SOFT}` }}
      >
        <div className="max-w-[820px] mx-auto">
          <SectionHeading kicker="Bio · Short" title="Short version" />
          <p
            className="font-cormorant text-[19px] leading-[1.75]"
            style={{ color: TEXT, textWrap: "pretty" }}
          >
            Reese Astor writes steamy billionaire romance set in Manhattan and is the author of the
            Hudson Dynasty and Manhattan Money Kings series. Her new line, Intimate Psychological Narratives,
            launches in 2026 with the audiobook <em>The Need for Permission</em>.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-16 py-[100px]">
        <div className="max-w-[820px] mx-auto">
          <SectionHeading kicker="Bio · Long" title="Long version" />
          <p
            className="font-cormorant text-[19px] leading-[1.75]"
            style={{ color: TEXT, textWrap: "pretty" }}
          >
            Reese Astor writes contemporary billionaire romance set among New York&rsquo;s most powerful
            families: the Manhattan Money Kings (a prequel and four standalone novels) and the Hudson
            Dynasty (a prequel novella, <em>Hostile Tender</em>, <em>Poison Pill</em> and
            <em>Golden Parachute</em>). Every book stands alone and ends happily. In 2026 she launches
            Intimate Psychological Narratives, a quieter line of audiobooks for late-night listening.
            The first title, <em>The Need for Permission: On the Quiet Recovery of Self-Trust</em>,
            is a ten-chapter, hour-long meditation on rebuilding self-trust. She believes romance novels
            are more than entertainment &mdash; they&rsquo;re empowerment.
          </p>
        </div>
      </section>

      <section
        className="px-6 md:px-16 py-[100px]"
        style={{ background: "#F0E6E5", borderTop: `1px solid ${GOLD_SOFT}` }}
      >
        <div className="max-w-[820px] mx-auto">
          <SectionHeading kicker="Contact" title="One inbox" />
          <p
            className="font-cormorant text-[19px] leading-[1.75]"
            style={{ color: TEXT_SOFT }}
          >
            All inquiries:{" "}
            <a
              href={`mailto:${PRESS_EMAIL}`}
              className="font-inter no-underline"
              style={{
                color: GOLD,
                letterSpacing: "0.16em",
                borderBottom: `1px solid ${GOLD_SOFT}`,
              }}
            >
              {PRESS_EMAIL}
            </a>
            .
          </p>
          <p
            className="font-cormorant italic text-[16px] leading-[1.6] mt-6"
            style={{ color: TEXT_SOFT }}
          >
            Headshots, cover JPGs at 300dpi, and digital review copies are available on request.
            Please specify outlet and intended publication date.
          </p>
        </div>
      </section>
    </div>
  );
}
