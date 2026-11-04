import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PUBLISHER_MAILING_IDENTITY, PUBLISHER_MAILING_LINES } from "../shared/publisher";
import { SITE_URL } from "../shared/site";
import { Footer } from "../client/src/components/Footer";
import { generateEmailTemplate } from "./emailTemplate";
import { generateWelcomeEmail } from "./email-templates/welcome";
import { generatePurchaseConfirmationEmail } from "./email-templates/purchase-confirmation";
import * as postPurchase from "./email-templates/post-purchase";
import * as seriesUpsell from "./email-templates/series-upsell";
import * as launch from "./email-templates/launch-sequence";
import * as winBack from "./email-templates/win-back";

vi.mock("wouter", () => ({ Link: ({ children }: { children: unknown }) => children }));

function expectMailingAddress(html: string) {
  for (const line of PUBLISHER_MAILING_LINES) {
    expect(html).toContain(line);
  }
  expect(html).not.toMatch(/verified address|author residence|guaranteed compliant/i);
}

describe("operator-supplied publisher mailing identity", () => {
  it("uses the exact supplied business identity, not an author biography", () => {
    expect(PUBLISHER_MAILING_IDENTITY).toEqual({
      website: SITE_URL,
      name: "88Away LLC",
      street: "500 8th Avenue FRNT 3 #1662",
      city: "Manhattan",
      region: "NY",
      postalCode: "10018",
      country: "United States",
    });
    expect(PUBLISHER_MAILING_LINES).toEqual([
      "88Away LLC", "500 8th Avenue FRNT 3 #1662", "Manhattan, NY 10018", "United States",
    ]);
  });

  it("renders a labeled publisher address in the site footer without changing contact links", () => {
    const html = renderToStaticMarkup(createElement(Footer));
    expectMailingAddress(html);
    expect(html).toContain('<address class="mt-3 text-xs leading-relaxed not-italic" aria-label="Publisher mailing address">');
    expect(html).toContain('href="mailto:contact@reeseastor.com"');
    expect(html).toContain('href="https://dl.bookfunnel.com/kw1yge3479"');
  });

  it("includes the mailing address in newsletter HTML and preserves supplied unsubscribe URLs", () => {
    const options = { subject: "News", content: "<p>An update</p>" };
    const html = generateEmailTemplate({ ...options, unsubscribeUrl: "https://example.org/existing-preference-link" });
    expectMailingAddress(html);
    expect(html).toContain('href="https://example.org/existing-preference-link"');
    expect(generateEmailTemplate(options)).not.toMatch(/>\s*Unsubscribe\s*</);
  });

  it("includes the address in the existing welcome email without inventing unsubscribe endpoints", () => {
    const html = generateWelcomeEmail({});
    expectMailingAddress(html);
    expect(html).toContain('href="https://dl.bookfunnel.com/kw1yge3479"');
    expect(html).not.toContain("/unsubscribe");
  });

  it("includes the address in transactional confirmation without adding marketing preference links", () => {
    const html = generatePurchaseConfirmationEmail({
      customerName: "Reader",
      customerEmail: "reader@example.org",
      orderNumber: "TEST-1",
      purchaseDate: "2026-11-04",
      bookTitle: "A Book",
      purchasePrice: "$0",
      downloadLinks: { epub: "https://example.org/existing-delivery", mobi: "", pdf: "" },
    });
    expectMailingAddress(html);
    expect(html).toContain('href="https://example.org/existing-delivery"');
    expect(html).not.toContain("/unsubscribe");
  });

  for (const [name, group] of Object.entries({ postPurchase, seriesUpsell, launch, winBack })) {
    it(`includes the shared address in every ${name} sequence email and preserves provider unsubscribe placeholders`, () => {
      const generators = Object.entries(group).filter(([key, value]) => key.startsWith("generate") && typeof value === "function");
      expect(generators).toHaveLength(3);
      for (const [, generate] of generators) {
        const html = (generate as () => string)();
        expectMailingAddress(html);
        expect(html).toContain('href="{$unsubscribe}"');
      }
    });
  }
});
