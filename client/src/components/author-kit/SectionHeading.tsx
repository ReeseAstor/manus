import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { Ornament } from "./Ornament";
import { KIT_EASE, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  kicker: string;
  /** Use a vertical bar to split into two lines, e.g. "Manhattan|Money Kings". */
  title: string;
  lead?: string;
};

export function SectionHeading({ kicker, title, lead }: Props) {
  const parts = title.split("|");
  const reduce = useReducedMotion();
  const motionFrom = reduce ? undefined : { opacity: 0, y: 24 };
  const motionTo   = reduce ? undefined : { opacity: 1, y: 0 };
  return (
    <motion.div
      className="text-center mb-24 max-w-[720px] mx-auto"
      initial={motionFrom}
      whileInView={motionTo}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: KIT_EASE }}
    >
      <Eyebrow align="center">{kicker}</Eyebrow>
      <h2
        className="font-display font-normal text-[40px] md:text-[60px] leading-[1.05] mt-6"
        style={{ color: TEXT, letterSpacing: "-0.022em", textWrap: "balance" }}
      >
        <span>{parts[0]}</span>
        {parts[1] && <em className="font-normal not-italic md:italic"> {parts[1]}</em>}
      </h2>
      <div className="mt-9"><Ornament width={120} /></div>
      {lead && (
        <p
          className="font-cormorant italic text-[20px] leading-[1.6] mt-7 mx-auto max-w-[580px]"
          style={{ color: TEXT_SOFT }}
        >
          {lead}
        </p>
      )}
    </motion.div>
  );
}
