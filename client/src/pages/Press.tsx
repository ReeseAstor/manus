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
        description="Press resources, bio, headshots, and contact for Reese Astor, romance author."
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
        style={{ background: "#0B1226", borderTop: `1px solid ${GOLD_SOFT}` }}
      >
        <div className="max-w-[820px] mx-auto">
          <SectionHeading kicker="Bio · Short" title="50 words" />
          <p
            className="font-cormorant text-[19px] leading-[1.75]"
            style={{ color: TEXT, textWrap: "pretty" }}
          >
            Reese Astor writes the Manhattan Money Kings series and the Hudson Dynasty series.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-16 py-[100px]">
        <div className="max-w-[820px] mx-auto">
          <SectionHeading kicker="Bio · Long" title="120 words" />
          <p
            className="font-cormorant text-[19px] leading-[1.75]"
            style={{ color: TEXT, textWrap: "pretty" }}
          >
            Reese Astor writes contemporary billionaire romance set among New York&rsquo;s most
            dangerous heirs &mdash; the Manhattan Money Kings (a prequel and four novels) and the
            Hudson Dynasty (a prequel novella and three novels, including <em>Hostile Tender</em>).
            Reese lives in New York.
          </p>
        </div>
      </section>

      <section
        className="px-6 md:px-16 py-[100px]"
        style={{ background: "#0B1226", borderTop: `1px solid ${GOLD_SOFT}` }}
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
