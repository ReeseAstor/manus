// Website-scope age rule (QA ruling R3, 10/31/2026): a number next to an age word fails everywhere on the site and in
// blog DB copy: "five-year-old", "5 years old", "5yo", "aged 5", "age 5", "turns 16", "3rd grade", "grade 3".
// Plain counts ("books 2 and 3", "chapter 12") are not age shapes and pass. Shared by the rendered check (guards-server.mjs)
// and the blog column scan, so both apply the same rule.
const N = String.raw`(?:\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[\s-](?:one|two|three|four|five|six|seven|eight|nine))?`;
export const AGE_NUMBER_RE = new RegExp(
  [
    String.raw`\b${N}[\s-]+(?:years?|yrs?)[\s-]+old\b`,
    String.raw`\b${N}[\s-]*(?:yo|y\/o)\b`,
    String.raw`\bage[ds]?\s+(?:of\s+)?${N}\b`,
    String.raw`\b(?:turns|turned|turning)\s+${N}\b`,
    String.raw`\b${N}(?:st|nd|rd|th)?[\s-]+grade(?:rs?)?\b`,
    String.raw`\bgrade\s+${N}\b`,
  ].join("|"),
  "gi",
);
export function ageNumberHits(text = "") {
  const out = [];
  const t = String(text).replace(/\u00ad|\u200b/g, "");
  for (const m of t.matchAll(AGE_NUMBER_RE)) {
    out.push({ match: m[0], context: t.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60).replace(/\s+/g, " ").trim() });
  }
  return out;
}
