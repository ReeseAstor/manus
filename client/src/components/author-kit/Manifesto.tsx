import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { Ornament } from "./Ornament";
import { INK, KIT_EASE, TEXT } from "./tokens";

export function Manifesto() {
  const reduce = useReducedMotion();
  return (
    <section className="relative px-16 py-[120px]" style={{ background: INK }}>
      <motion.div
        className="max-w-[880px] mx-auto text-center"
        initial={reduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE as unknown as number[] }}
      >
        <Ornament width={80} />
        <p
          className="font-display italic font-normal text-[36px] leading-[1.4] my-10"
          style={{ color: TEXT, textWrap: "balance" }}
        >
          &ldquo;Power without tenderness is just noise. I write the moment a ruthless man finally goes quiet &mdash; and means it.&rdquo;
        </p>
        <Eyebrow align="center">&mdash; Reese Astor</Eyebrow>
      </motion.div>
    </section>
  );
}
