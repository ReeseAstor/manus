import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { Eyebrow } from "./Eyebrow";
import { GOLD, KIT_EASE, RULE_SOFT, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  index: string;
  kicker: string;
  title: string;
  blurb: string;
  cover: string;
  href: string;
  external?: boolean;
  delay?: number;
};

export function BookCard({ index, kicker, title, blurb, cover, href, external, delay = 0 }: Props) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const isExternal = external || /^https?:/i.test(href);

  const inner = (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col cursor-pointer"
      style={{ transition: "all 320ms cubic-bezier(0.65,0.05,0.36,1)" }}
      initial={reduce ? undefined : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: KIT_EASE as unknown as number[], delay }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div
        className="relative overflow-hidden mb-7 bg-black"
        style={{ aspectRatio: "2/3" }}
      >
        <motion.img
          src={cover}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
          animate={reduce ? undefined : { scale: hover ? 1.04 : 1 }}
          transition={{ duration: 0.7, ease: KIT_EASE as unknown as number[] }}
        />
        {/* gold halo on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ boxShadow: "inset 0 0 0 1px rgba(201,166,70,0.5), inset 0 0 80px rgba(201,166,70,0.18)" }}
        />
      </div>

      <div className="flex items-baseline gap-4 mb-[14px]">
        <span className="font-display italic font-normal text-[18px] leading-none" style={{ color: GOLD }}>{index}</span>
        <span className="flex-1 h-px" style={{ background: RULE_SOFT }} />
        <Eyebrow>{kicker}</Eyebrow>
      </div>

      <h3
        className="font-display font-normal text-[26px] leading-[1.2] mb-3"
        style={{ color: TEXT, letterSpacing: "-0.01em", textWrap: "balance" }}
      >
        {title}
      </h3>
      <p
        className="font-cormorant italic text-[17px] leading-[1.5] mb-[18px]"
        style={{ color: TEXT_SOFT, textWrap: "pretty" }}
      >
        {blurb}
      </p>
      <span
        className="font-inter text-[11px] font-semibold uppercase"
        style={{ color: hover ? GOLD : TEXT_SOFT, letterSpacing: "0.32em", transition: "color 240ms" }}
      >
        Read more →
      </span>
    </motion.div>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">{inner}</a>
  ) : (
    <Link href={href}>
      <span className="no-underline block">{inner}</span>
    </Link>
  );
}
