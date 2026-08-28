import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { GOLD_SOFT, KIT_EASE, TEXT } from "./tokens";

type Props = {
  quote: string;
  attribution: string;
  delay?: number;
};

export function PraiseQuote({ quote, attribution, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="m-0 px-9 py-3"
      style={{ borderLeft: `1px solid ${GOLD_SOFT}` }}
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: KIT_EASE, delay }}
    >
      <blockquote
        className="font-cormorant italic text-[22px] leading-[1.55] mb-6 m-0"
        style={{ color: TEXT, textWrap: "pretty" }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption><Eyebrow>{attribution}</Eyebrow></figcaption>
    </motion.figure>
  );
}
