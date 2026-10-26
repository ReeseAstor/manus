import type { Book } from "@/data/books";
import { resolveRetailers } from "@/data/retailers";
import { GOLD, INK, TEXT } from "./tokens";

type Props = {
  book: Book;
  /**
   * Layout: "grid" wraps to multiple rows; "row" forces single row;
   * "stack" puts every button on its own full-width row (narrow cards).
   */
  layout?: "grid" | "row" | "stack";
  /** Hide the Kindle+ (formerly Kindle Unlimited) pitch even if applicable. */
  hideKindleUnlimited?: boolean;
};

/**
 * Renders the buy-button matrix for a book. Resolves URLs from env vars +
 * book data; any channel without a usable URL is hidden, never rendered as
 * a dead link. KU titles get a "Read free with Kindle+" primary button
 * pointing at the same Amazon link.
 */
export function RetailerButtons({ book, layout = "grid", hideKindleUnlimited }: Props) {
  const retailers = resolveRetailers(book);
  if (retailers.length === 0 && !book.kindle_unlimited) return null;

  const amazon = retailers.find((r) => r.meta.key === "amazon_kindle");
  const showKU = book.kindle_unlimited && amazon && !hideKindleUnlimited;

  const baseBtn =
    `font-inter ${layout === "stack" ? "flex w-full" : "inline-flex"} items-center justify-center gap-2 text-[11px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px text-center`;

  return (
    <div
      className={
        layout === "stack"
          ? "grid grid-cols-1 gap-3"
          : layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
            : "flex flex-wrap gap-3"
      }
    >
      {showKU && amazon && (
        <a
          href={amazon.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={baseBtn}
          style={{
            color: INK,
            background: GOLD,
            padding: layout === "stack" ? "14px 12px" : "14px 22px",
            letterSpacing: layout === "stack" ? "0.04em" : "0.08em",
            textTransform: "none",
          }}
        >
          Read free with Kindle+ (formerly Kindle Unlimited).
        </a>
      )}
      {retailers.map(({ meta, href }) => {
        // If we already showed KU primary for Amazon, render Amazon as a
        // secondary "Buy" outline button.
        const isSecondaryAmazon = showKU && meta.key === "amazon_kindle";
        const label = isSecondaryAmazon ? "Buy on Amazon" : meta.label;
        return (
          <a
            key={meta.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={baseBtn}
            style={{
              color: TEXT,
              background: "transparent",
              padding: "14px 22px",
              letterSpacing: "0.22em",
              border: `1px solid ${GOLD}`,
            }}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
