import { GOLD, INK, RULE, TEXT_SOFT } from "./tokens";

type Props = {
  /** Trope tags or short praise fragments, e.g. "Enemies to Lovers". */
  items: string[];
};

/**
 * Infinite horizontal marquee of trope tags between gold hairlines.
 * Two identical groups slide one group-width for a seamless loop
 * (see .kit-marquee-track in index.css); hover pauses, and
 * prefers-reduced-motion renders it static.
 */
export function TropeMarquee({ items }: Props) {
  const group = (ariaHidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span
            className="font-display italic whitespace-nowrap px-7 text-[18px] md:px-10 md:text-[21px]"
            style={{ color: TEXT_SOFT }}
          >
            {item}
          </span>
          <span className="font-display text-[13px] leading-none" style={{ color: GOLD }}>
            &#10038;
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="kit-marquee overflow-hidden py-6"
      style={{ background: INK, borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}
    >
      <div className="kit-marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
