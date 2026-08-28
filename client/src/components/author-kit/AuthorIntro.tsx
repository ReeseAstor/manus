import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { Eyebrow } from "./Eyebrow";
import { GOLD, GOLD_SOFT, INK, KIT_EASE, TEXT, TEXT_SOFT } from "./tokens";

// Bio + pull-quote sourced verbatim from client/src/pages/About.tsx.
export function AuthorIntro() {
  const reduce = useReducedMotion();
  return (
    <section className="px-16 py-[140px]" style={{ background: INK }}>
      <motion.div
        className="max-w-[980px] mx-auto text-center"
        initial={reduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE }}
      >
        <Eyebrow align="center">About the Author</Eyebrow>
        <h2
          className="font-display font-normal text-[44px] md:text-[52px] leading-[1.1] mt-[22px]"
          style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
        >
          Reese Astor
        </h2>
        <div
          className="font-cormorant italic mt-4 text-[20px]"
          style={{ color: TEXT_SOFT }}
        >
          From Corporate Finance VP to USA TODAY Bestselling Romance Author
        </div>
        <div className="mx-auto my-8 h-px w-14" style={{ background: GOLD_SOFT }} />
        <blockquote
          className="font-display italic text-[28px] md:text-[32px] leading-[1.4] mb-10 m-0"
          style={{ color: TEXT, textWrap: "balance" }}
        >
          &ldquo;I believe romance novels are more than just entertainment&mdash;they&rsquo;re empowerment.&rdquo;
        </blockquote>
        <p
          className="font-cormorant text-[19px] leading-[1.75] max-w-[720px] mx-auto"
          style={{ color: TEXT_SOFT, textWrap: "pretty" }}
        >
          A former finance VP turned full-time novelist, Reese Astor is the author of the Manhattan Money Kings series and the Hudson Dynasty novels. She writes contemporary romance set among New York&rsquo;s most dangerous heirs &mdash; men who own skylines, board rooms, and the women who finally bring them to their knees.
        </p>
        <div className="mt-10">
          <Link href="/about">
            <a
              className="font-inter text-[11px] font-semibold uppercase no-underline"
              style={{
                color: GOLD,
                letterSpacing: "0.28em",
                borderBottom: `1px solid ${GOLD_SOFT}`,
                paddingBottom: 3,
              }}
            >
              More about Reese →
            </a>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
