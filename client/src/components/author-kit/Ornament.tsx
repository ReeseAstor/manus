import { motion, useReducedMotion } from "framer-motion";
import { GOLD, GOLD_SOFT, KIT_EASE } from "./tokens";

type Props = { width?: number; color?: string };

/** Filigree diamond divider — gold hairlines with a draw-on reveal. */
export function Ornament({ width = 200, color = GOLD_SOFT }: Props) {
  const reduce = useReducedMotion();
  const lineDuration = reduce ? 0 : 1.2;
  return (
    <div className="flex items-center justify-center gap-[18px] w-full">
      <span
        className="flex-1 h-px"
        style={{ maxWidth: width, background: `linear-gradient(to right, transparent, ${color})` }}
      />
      <motion.svg
        width="28"
        height="14"
        viewBox="0 0 28 14"
        fill="none"
        className="shrink-0"
        initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: lineDuration, ease: KIT_EASE as unknown as number[] }}
      >
        <path d="M14 1 L20 7 L14 13 L8 7 Z" stroke={GOLD} strokeWidth="0.8" fill="none" />
        <circle cx="14" cy="7" r="1.2" fill={GOLD} />
      </motion.svg>
      <span
        className="flex-1 h-px"
        style={{ maxWidth: width, background: `linear-gradient(to left, transparent, ${color})` }}
      />
    </div>
  );
}
