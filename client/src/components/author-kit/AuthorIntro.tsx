import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { GOLD_SOFT, INK, KIT_EASE, TEXT, TEXT_SOFT } from "./tokens";

export function AuthorIntro() {
  const reduce = useReducedMotion();
  return (
    <section className="px-16 py-[140px]" style={{ background: INK }}>
      <motion.div
        className="max-w-[980px] mx-auto text-center"
        initial={reduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE as unknown as number[] }}
      >
        <Eyebrow align="center">The Author</Eyebrow>
        <h2
          className="font-display font-normal text-[48px] leading-[1.15] mt-[22px]"
          style={{ color: TEXT, letterSpacing: "-0.02em", textWrap: "balance" }}
        >
          A novelist of <em className="font-normal">power, secrecy</em>,<br />and the men who break their own rules.
        </h2>
        <div className="mx-auto my-8 h-px w-14" style={{ background: GOLD_SOFT }} />
        <p
          className="font-cormorant text-[21px] leading-[1.7]"
          style={{ color: TEXT_SOFT, textWrap: "pretty" }}
        >
          Reese Astor writes contemporary romance set among Manhattan&rsquo;s most dangerous heirs &mdash; the kind of men who own skylines, board rooms, and the women who finally bring them to their knees. Her novels are slow, deliberate, and built on a single quiet promise: <em>everything you love, taken seriously.</em>
        </p>
      </motion.div>
    </section>
  );
}
