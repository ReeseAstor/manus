import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { Eyebrow } from "./Eyebrow";
import { GOLD, KIT_EASE, MUTED, RULE_SOFT, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  title: string;
  excerpt: string;
  category: string;
  href: string;
  /** e.g. "Nov 15, 2025" */
  dateLabel?: string;
  /** e.g. "8 min read" */
  readTime?: string;
  image?: string;
  delay?: number;
};

/** Editorial article card for the journal — hairline rules, no glass. */
export function JournalCard({
  title, excerpt, category, href, dateLabel, readTime, image, delay = 0,
}: Props) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Link href={href}>
      <motion.article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex h-full cursor-pointer flex-col"
        initial={reduce ? undefined : { opacity: 0, y: 30 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: KIT_EASE, delay }}
        whileHover={reduce ? undefined : { y: -6 }}
      >
        {image && (
          <div className="relative mb-6 overflow-hidden bg-black" style={{ aspectRatio: "16/10" }}>
            <motion.img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full select-none object-cover"
              draggable={false}
              animate={reduce ? undefined : { scale: hover ? 1.04 : 1 }}
              transition={{ duration: 0.7, ease: KIT_EASE }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={false}
              animate={{ opacity: hover ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ boxShadow: "inset 0 0 0 1px rgba(201,166,70,0.5), inset 0 0 80px rgba(201,166,70,0.15)" }}
            />
          </div>
        )}

        <div className="mb-[14px] flex items-baseline gap-4">
          <Eyebrow>{category}</Eyebrow>
          <span className="h-px flex-1" style={{ background: RULE_SOFT }} />
        </div>

        <h3
          className="font-display mb-3 text-[24px] font-normal leading-[1.22]"
          style={{ color: hover ? GOLD : TEXT, letterSpacing: "-0.01em", textWrap: "balance", transition: "color 240ms" }}
        >
          {title}
        </h3>

        <p
          className="font-cormorant mb-5 text-[17px] italic leading-[1.55] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box] overflow-hidden"
          style={{ color: TEXT_SOFT, textWrap: "pretty" }}
        >
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-inter text-[11px] uppercase" style={{ color: MUTED, letterSpacing: "0.22em" }}>
            {[dateLabel, readTime].filter(Boolean).join(" · ")}
          </span>
          <span
            className="font-inter text-[11px] font-semibold uppercase"
            style={{ color: hover ? GOLD : TEXT_SOFT, letterSpacing: "0.28em", transition: "color 240ms" }}
          >
            Read →
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
