import { motion, useScroll, useSpring } from "framer-motion";
import { GOLD } from "./tokens";

/** Hairline reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left"
      style={{ scaleX, background: `linear-gradient(90deg, ${GOLD}, #4A3B3A)` }}
    />
  );
}
