import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GOLD, KIT_EASE, RULE_SOFT, SURFACE, TEXT_SOFT } from "./tokens";

export type Stat = {
  value: number;
  /** Appended after the number, e.g. "%" or "+". */
  suffix?: string;
  label: string;
  sub?: string;
};

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: KIT_EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Band of animated counters — count up from zero when scrolled into view. */
export function StatsBand({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="px-6 py-20 md:px-16 md:py-24"
      style={{ background: SURFACE, borderTop: `1px solid ${RULE_SOFT}`, borderBottom: `1px solid ${RULE_SOFT}` }}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-y-14 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative px-4 text-center md:px-8"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: KIT_EASE, delay: i * 0.1 }}
          >
            {i > 0 && (
              <span
                className={`absolute inset-y-1 left-0 w-px ${i === 2 ? "hidden lg:block" : ""}`}
                style={{ background: `linear-gradient(180deg, transparent, ${RULE_SOFT}, transparent)` }}
              />
            )}
            <div
              className="font-display text-[52px] leading-none md:text-[64px]"
              style={{ color: GOLD, letterSpacing: "-0.02em" }}
            >
              <CountUp value={stat.value} suffix={stat.suffix} />
            </div>
            <div
              className="font-inter mt-4 text-[11px] font-semibold uppercase"
              style={{ color: "#F2ECDF", letterSpacing: "0.3em" }}
            >
              {stat.label}
            </div>
            {stat.sub && (
              <div className="font-cormorant mt-2 text-[16px] italic" style={{ color: TEXT_SOFT }}>
                {stat.sub}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
