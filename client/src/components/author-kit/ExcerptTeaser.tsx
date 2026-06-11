import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { Ornament } from "./Ornament";
import { RAButton } from "./RAButton";
import { INK, KIT_EASE, RAISED, TEXT } from "./tokens";

type Props = {
  kicker: string;
  quote: string;
  attribution: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/**
 * Cinematic pull-quote section — an oversized ghost quotation mark behind
 * an italic display excerpt, with an optional CTA row beneath.
 */
export function ExcerptTeaser({
  kicker,
  quote,
  attribution,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: Props) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative overflow-hidden px-6 py-28 md:px-16 md:py-[150px]"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${RAISED} 0%, ${INK} 70%)` }}
    >
      <div
        aria-hidden
        className="font-display pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 select-none leading-none"
        style={{ fontSize: "min(40vw, 420px)", color: "rgba(201,166,70,0.07)" }}
      >
        &ldquo;
      </div>

      <motion.figure
        className="relative m-0 mx-auto max-w-[880px] text-center"
        initial={reduce ? undefined : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE }}
      >
        <Eyebrow align="center">{kicker}</Eyebrow>
        <blockquote
          className="font-display m-0 mt-9 text-[28px] italic leading-[1.42] md:text-[36px]"
          style={{ color: TEXT, letterSpacing: "-0.01em", textWrap: "balance" }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-10">
          <Ornament width={110} />
        </div>
        <figcaption className="mt-7">
          <Eyebrow align="center">{attribution}</Eyebrow>
        </figcaption>
        {(ctaLabel || secondaryLabel) && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-[18px]">
            {ctaLabel && ctaHref && (
              <RAButton variant="primary" size="lg" href={ctaHref}>
                {ctaLabel}
              </RAButton>
            )}
            {secondaryLabel && secondaryHref && (
              <RAButton variant="ghost" size="lg" href={secondaryHref}>
                {secondaryLabel}
              </RAButton>
            )}
          </div>
        )}
      </motion.figure>
    </section>
  );
}
