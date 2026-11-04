import React from "react";
import {
  editionAmazonUrl,
  EDITION_LABELS,
  getLiveBookEditions,
} from "@/data/book-editions";

/** Paid editions stay secondary to the existing primary reading/free-prequel action. */
export function BookEditions({ slug, title }: { slug: string; title: string }) {
  const editions = getLiveBookEditions(slug);
  if (editions.length === 0) return null;
  return (
    <details className="mt-6 border-t border-[#4A3B3A]/15 pt-5 text-left">
      <summary className="cursor-pointer text-[#7A4F4C] focus-visible:outline-2 focus-visible:outline-offset-4">
        Formats and Amazon editions
      </summary>
      <div className="pt-5 space-y-4">
        <p className="text-sm text-[#6E5F5A]">
          Choose the format that suits you. Check Amazon for current prices,
          availability, and edition details.
        </p>
        <aside
          aria-label="Affiliate disclosure"
          className="text-sm text-[#6E5F5A]"
        >
          As an Amazon Associate I earn from qualifying purchases. Amazon links
          may earn a commission at no extra cost to you.
        </aside>
        <ul
          className="flex flex-wrap gap-3"
          aria-label={`Confirmed editions of ${title}`}
        >
          {editions.map(edition => (
            <li key={edition.format}>
              <a
                href={editionAmazonUrl(edition)!}
                target="_blank"
                rel="sponsored noopener noreferrer nofollow"
                className="inline-block border border-[#7A4F4C]/40 rounded px-4 py-3 text-[#4A3B3A] hover:bg-[#EBD6D3]/30 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {EDITION_LABELS[edition.format]}
                <span className="sr-only">
                  {" "}
                  of {title} on Amazon (affiliate link, opens in a new tab)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
