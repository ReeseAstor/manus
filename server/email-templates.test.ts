import { describe, it, expect } from "vitest";
import { generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3, postPurchaseSequence } from "./email-templates/post-purchase";
import { generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3, winBackSequence } from "./email-templates/win-back";

describe("Post-Purchase Email Templates", () => {
  it("should generate Email 1 with correct structure", () => {
    const html = generatePostPurchaseEmail1("Sarah");
    expect(html).toContain("Dear Sarah");
    expect(html).toContain("Thank you");
    expect(html).toContain("in reading order");
    expect(html).toContain("Book 4: The Billionaire&rsquo;s Forbidden Nanny");
    // No invented bonus assets
    expect(html).not.toContain("Spotify");
    expect(html).not.toContain("relationship map");
    expect(html).not.toContain("/reading-companion");
    expect(html).toContain("Reese Astor");
    expect(html).toContain("Romance Author");
    expect(html).toContain("{$unsubscribe}");
  });

  it("should generate Email 1 with default greeting when no name provided", () => {
    const html = generatePostPurchaseEmail1();
    expect(html).toContain("Dear Reader");
    expect(html).not.toContain("Dear undefined");
  });

  it("should generate Email 2 as a check-in with no invented content", () => {
    const html = generatePostPurchaseEmail2("Emily");
    expect(html).toContain("Dear Emily");
    expect(html).toContain("honest review");
    expect(html).not.toContain("deleted scene");
    expect(html).not.toContain("/deleted-scene");
    expect(html).not.toContain("The Night Before Everything Changed");
  });

  it("should generate Email 3 with upsell content", () => {
    const html = generatePostPurchaseEmail3();
    expect(html).toContain("Hudson Dynasty");
    expect(html).toContain("Golden Parachute");
    expect(html).toContain("Manhattan Money Kings, Book 4");
    expect(html).toContain("Browse All the Books");
    // The series has five titles, not a trilogy, and no bundles are offered here
    expect(html).not.toMatch(/trilogy/i);
    expect(html).not.toContain("Ultimate Collection");
    expect(html).not.toContain("VIP Club Membership");
  });

  it("should have correct sequence metadata", () => {
    expect(postPurchaseSequence).toHaveLength(3);
    expect(postPurchaseSequence[0].subject).toBe("Thank you for your order");
    expect(postPurchaseSequence[1].subject).toBe("How is the reading going?");
    expect(postPurchaseSequence[2].subject).toBe("Finished the series? Here's where to read next");
    expect(postPurchaseSequence[0].delay).toContain("1 day");
    expect(postPurchaseSequence[1].delay).toContain("5 day");
    expect(postPurchaseSequence[2].delay).toContain("14 day");
  });

  it("should produce valid HTML for all post-purchase emails", () => {
    const generators = [generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3];
    for (const gen of generators) {
      const html = gen("Test");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
      expect(html).toContain('<meta charset="utf-8">');
      expect(html).toContain("background-color: #0a0e27");
    }
  });
});

describe("Win-Back Email Templates", () => {
  it("should generate Email 1 with welcome back gift", () => {
    const html = generateWinBackEmail1("Jessica");
    expect(html).toContain("Dear Jessica");
    expect(html).toContain("missed having you");
    expect(html).toContain("Exclusive Bonus Chapter");
    expect(html).toContain("Claim Your Bonus Chapter");
    expect(html).toContain("stay on my VIP reader list");
  });

  it("should generate Email 2 with stay/go question", () => {
    const html = generateWinBackEmail2();
    expect(html).toContain("Dear Reader");
    expect(html).toContain("Should I keep sending you emails?");
    expect(html).toContain("Yes! Keep me on the list");
    expect(html).toContain("unsubscribe");
  });

  it("should generate Email 3 with urgency and loss aversion", () => {
    const html = generateWinBackEmail3("Amanda");
    expect(html).toContain("Dear Amanda");
    expect(html).toContain("Removing you from my list tomorrow");
    expect(html).toContain("Final Notice");
    expect(html).toContain("You'll be removed tomorrow");
    expect(html).toContain("Exclusive bonus chapters");
    expect(html).toContain("Early access to new releases");
    expect(html).toContain("Wait — Keep Me Subscribed!");
  });

  it("should have correct sequence metadata", () => {
    expect(winBackSequence).toHaveLength(3);
    expect(winBackSequence[0].subject).toBe("Still there? I have something special for you");
    expect(winBackSequence[1].subject).toBe("Should I keep sending you emails?");
    expect(winBackSequence[2].subject).toBe("Removing you from my list tomorrow");
    expect(winBackSequence[0].delay).toContain("60 days");
    expect(winBackSequence[1].delay).toContain("7 days");
    expect(winBackSequence[2].delay).toContain("14 days");
  });

  it("should produce valid HTML for all win-back emails", () => {
    const generators = [generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3];
    for (const gen of generators) {
      const html = gen("Test");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
      expect(html).toContain('<meta charset="utf-8">');
      expect(html).toContain("background-color: #0a0e27");
    }
  });

  it("should include mobile responsive styles", () => {
    const html = generateWinBackEmail1();
    expect(html).toContain("@media screen and (max-width: 620px)");
    expect(html).toContain("email-container");
  });
});

describe("Email Template Consistency", () => {
  it("should use consistent branding across all templates", () => {
    const allGenerators = [
      generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3,
      generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3,
    ];
    for (const gen of allGenerators) {
      const html = gen();
      expect(html).toContain("REESE ASTOR");
      expect(html).toContain("#d4af37"); // Gold color
      expect(html).toContain("#0a0e27"); // Dark background
      expect(html).toContain("reeseastor.manus.space"); // Site URL
    }
  });

  it("should include unsubscribe links in all templates", () => {
    const allGenerators = [
      generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3,
      generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3,
    ];
    for (const gen of allGenerators) {
      const html = gen();
      expect(html).toContain("{$unsubscribe}");
    }
  });
});
