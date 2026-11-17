import {
  AFFILIATE_DISCLOSURE,
  MEMBERSHIP_OFFERS,
} from "@/data/membership-offers";
import { GOLD, RULE, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  /** "row" for the wide catalogue band, "stack" for narrow card columns. */
  layout?: "row" | "stack";
};

/**
 * Membership offers that pay a bounty instead of a commission. The two
 * destinations are Amazon's own landing pages, so they are not book-specific
 * and are not filtered by a title's formats.
 */
export function MembershipOffers({ layout = "row" }: Props) {
  return (
    <section
      aria-label="Amazon membership offers"
      className="mt-8 border-t pt-6"
      style={{ borderColor: RULE }}
    >
      <h3
        className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: GOLD }}
      >
        Reading options
      </h3>
      <div
        className={
          layout === "stack"
            ? "grid grid-cols-1 gap-3 mt-4"
            : "flex flex-wrap gap-3 mt-4"
        }
      >
        {MEMBERSHIP_OFFERS.map((offer) => (
          <a
            key={offer.key}
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer nofollow"
            className="font-inter inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
            style={{
              color: TEXT,
              border: `1px solid ${GOLD}`,
              padding: "14px 22px",
              letterSpacing: "0.22em",
            }}
          >
            {offer.label}
            <span className="sr-only">
              {" "}
              (affiliate link, opens in a new tab)
            </span>
          </a>
        ))}
      </div>
      <p
        className="font-cormorant text-[15px] leading-snug mt-4 m-0"
        style={{ color: TEXT_SOFT }}
      >
        {MEMBERSHIP_OFFERS.map((offer) => offer.detail).join(" ")}{" "}
        {AFFILIATE_DISCLOSURE}
      </p>
    </section>
  );
}
