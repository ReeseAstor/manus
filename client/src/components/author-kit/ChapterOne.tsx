import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { Ornament } from "./Ornament";
import { GOLD, INK, KIT_EASE, TEXT, TEXT_SOFT } from "./tokens";

export function ChapterOne() {
  const reduce = useReducedMotion();
  return (
    <section id="chapter-one" className="px-16 py-[160px]" style={{ background: INK }}>
      <motion.div
        className="max-w-[640px] mx-auto"
        initial={reduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: KIT_EASE as unknown as number[] }}
      >
        <div className="text-center">
          <Eyebrow align="center">From the novel</Eyebrow>
          <h2
            className="font-display font-normal text-[44px] leading-[1.1] mt-[22px]"
            style={{ color: TEXT, letterSpacing: "-0.02em" }}
          >
            Chapter <em className="font-normal">One</em>
          </h2>
          <div className="mt-7"><Ornament width={80} /></div>
          <div className="font-cormorant italic text-[17px] mt-[18px]" style={{ color: TEXT_SOFT }}>
            Nia · Pre-tender Day 24
          </div>
        </div>

        <div className="mt-14 font-cormorant text-[20px] leading-[1.7]" style={{ color: TEXT }}>
          <p className="m-0">
            <span
              className="font-display font-medium block float-left mr-3 mt-1"
              style={{ fontSize: 72, lineHeight: 0.85, color: GOLD }}
            >T</span>
            he federal response file reached Nia Carter at 5:14 a.m., and the first thing she understood was that Hudson Vale had already lost control of its own building.
          </p>
          <p className="mt-[22px] indent-[1.5em]" style={{ color: TEXT_SOFT }}>
            Not publicly. Not yet. Publicly, it was a leak: a board packet, a market rumor, a governance embarrassment dressed up as a breach. But the watermark on the stolen file told a colder story.
          </p>
          <p className="mt-2 indent-[1.5em] italic" style={{ color: TEXT_SOFT }}>
            Hudson Vale Holdings. Internal. Restricted.
          </p>
          <p className="mt-[22px] indent-[1.5em]" style={{ color: TEXT_SOFT }}>
            The pages had the faint softness of a copy of a copy. Half the packet had already been chewed through by financial Twitter for sixteen hours. She had washed her hair. She had not slept.
          </p>
        </div>

        <div className="mt-14 text-center"><Ornament width={48} /></div>
        <div className="mt-6 text-center font-cormorant italic text-[18px]" style={{ color: TEXT_SOFT }}>
          The rest is waiting for you.
        </div>
      </motion.div>
    </section>
  );
}
