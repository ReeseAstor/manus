import { motion, useMotionValue, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Eyebrow } from "./Eyebrow";
import { RAButton } from "./RAButton";
import { GOLD, GOLD_SOFT, INK, RAISED, RULE, RULE_SOFT, TEXT, TEXT_SOFT, KIT_EASE } from "./tokens";

type Props = {
  kicker: string;
  /** Vertical-bar splits title into two display lines, e.g. "Hostile|Tender". */
  title: string;
  byline: string;
  tagline: string;
  blurb: string;
  cover: string;
  primaryCta?: string;
  primaryHref?: string;
  primaryExternal?: boolean;
  secondaryCta?: string;
  secondaryHref?: string;
};

export function BookHero({
  kicker, title, byline, tagline, blurb, cover,
  primaryCta = "Order the novel",
  primaryHref = "/books",
  primaryExternal = false,
  secondaryCta = "Browse the series",
  secondaryHref = "/books",
}: Props) {
  const reduce = useReducedMotion();
  const parts = title.split("|");

  // Section scroll-linked parallax for the cover
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -60]);

  // Subtle pointer-tracking tilt on the cover
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(dy * -8);
    tiltY.set(dx * 8);
  };
  const onPointerLeave = () => { tiltX.set(0); tiltY.set(0); };

  // Reset tilt on unmount
  useEffect(() => () => { tiltX.set(0); tiltY.set(0); }, [tiltX, tiltY]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pt-[96px] pb-[120px] sm:px-10 lg:px-16 lg:pt-[120px] lg:pb-[160px]"
      style={{ background: `radial-gradient(ellipse at 70% 30%, ${RAISED} 0%, ${INK} 65%)` }}
    >
      <div className="absolute inset-y-0 left-16 hidden w-px lg:block" style={{ background: `linear-gradient(180deg, transparent, ${RULE} 30%, ${RULE} 70%, transparent)` }} />
      <div className="absolute inset-y-0 right-16 hidden w-px lg:block" style={{ background: `linear-gradient(180deg, transparent, ${RULE} 30%, ${RULE} 70%, transparent)` }} />

      <div className="max-w-[1240px] mx-auto grid items-center gap-16 lg:gap-28 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Cover (parallax + tilt) */}
        <motion.div
          className="relative flex justify-center [transform-style:preserve-3d]"
          style={{ y: coverY }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div
            aria-hidden
            className="kit-halo-pulse pointer-events-none absolute -inset-16"
            style={{
              background: "radial-gradient(circle, rgba(201,166,70,0.16) 0%, transparent 62%)",
              filter: "blur(36px)",
            }}
          />
          <div className="pointer-events-none absolute -inset-[22px] border" style={{ borderColor: RULE }} />
          <div className="pointer-events-none absolute -inset-[34px] border" style={{ borderColor: RULE_SOFT }} />
          <motion.img
            src={cover}
            alt={parts[0]}
            className="block w-full max-w-[380px] select-none"
            style={{
              boxShadow: "0 50px 100px -20px rgba(0,0,0,0.85), 0 16px 36px rgba(0,0,0,0.55)",
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d",
            }}
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: KIT_EASE }}
            draggable={false}
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: KIT_EASE, delay: 0.15 }}
        >
          <Eyebrow>{kicker}</Eyebrow>
          <h1
            className="font-display font-normal text-[52px] sm:text-[68px] md:text-[80px] lg:text-[88px] leading-[0.94] mt-8"
            style={{ color: TEXT, letterSpacing: "-0.028em", textWrap: "balance" }}
          >
            {/* Masked line reveal — each line rises out of an overflow clip.
                pb/-mb keep descenders (g, y) from being clipped by the mask. */}
            {parts.map((part, i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className={`block ${i === 1 ? "italic" : ""}`}
                  style={{ color: TEXT }}
                  initial={reduce ? undefined : { y: "112%" }}
                  animate={reduce ? undefined : { y: 0 }}
                  transition={{ duration: 1.1, ease: KIT_EASE, delay: 0.25 + i * 0.14 }}
                >
                  {part}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="flex items-center gap-[18px] my-[40px_28px] mt-10 mb-7">
            <span className="h-px w-14" style={{ background: GOLD }} />
            <span className="font-display italic text-base" style={{ color: GOLD }}>&#10038;</span>
            <span className="h-px w-14" style={{ background: GOLD_SOFT }} />
          </div>
          <p className="font-inter text-xs uppercase mb-8" style={{ color: TEXT_SOFT, letterSpacing: "0.32em" }}>{byline}</p>
          <p className="font-cormorant italic text-[28px] leading-[1.4] mb-6 max-w-[580px]" style={{ color: TEXT, textWrap: "pretty" }}>
            {tagline}
          </p>
          <p className="font-cormorant text-[19px] leading-[1.75] mb-12 max-w-[540px]" style={{ color: TEXT_SOFT, textWrap: "pretty" }}>
            {blurb}
          </p>
          <div className="flex flex-wrap items-center gap-[18px]">
            <RAButton variant="primary" size="lg" href={primaryHref} external={primaryExternal}>{primaryCta}</RAButton>
            <RAButton variant="ghost" size="lg" href={secondaryHref}>{secondaryCta}</RAButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span className="font-inter text-[10px] uppercase" style={{ color: TEXT_SOFT, letterSpacing: "0.42em" }}>
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden" style={{ background: RULE_SOFT }}>
          <span className="kit-scroll-cue-dot absolute left-0 top-0 h-4 w-px" style={{ background: GOLD }} />
        </span>
      </motion.div>
    </section>
  );
}
