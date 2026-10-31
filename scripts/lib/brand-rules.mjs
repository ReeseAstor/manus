// Brand rules shared by the rendered check (guards-server op "brand") and the blog column scan (QA CARD-v6 F2, 10/31/2026).
// Rules: DASH (U+2010-U+2015, U+2212, "--", a spaced hyphen inside a line), EMOJI (pictographs, dingbats, FE0F/200D),
// AI (no public AI mention; the one carve-out is the file name "llms.txt", the standard path of the site's text file, which
// appears in <link title="llms.txt">; it is not copy), COUNTDOWN (KDP Countdown Deal wording, same token shape as book-fallback-guard.mjs).
// mode "text"  : strict (visible text, title/meta, raw HTML/JSON-LD): no exemptions.
// mode "lines" : markdown sources (tRPC strings, text files, DB markdown): a line that starts with "- " / "* " (list bullet) has
//                that leading marker ignored, and a line that is only "---" / "***" / "___" (hr) is ignored. Nothing else is exempt.
const DASH_CHARS = /[\u2010-\u2015\u2212]/g;
const DOUBLE_HYPHEN = /--/g;
const SPACED_HYPHEN = /(?<=\S)[ \t\u00A0]+-[ \t\u00A0]+(?=\S)/g;
const EMOJI = /[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D\u2300-\u23FF]/gu;
const AI = /\bA\.?I\.?(?=[\s,.;:!?)'\u2019-]|$)|artificial intelligence|\bChatGPT\b|\bGPT-?\d|\bClaude\b|\bGemini\b|\bLLMs?\b(?!\.txt\b)|machine learning/gi;
const g = String.raw`[\W_]?`;
const COUNTDOWN = new RegExp(String.raw`(?<![a-z])c${g}[o0]${g}[u\u222A]${g}n${g}t[\W_]{0,3}d${g}[o0]${g}w${g}n`, "gi");
const ctx = (t, i, n) => t.slice(Math.max(0, i - 60), i + n + 60).replace(/\s+/g, " ").trim();
function scanLine(line, out, base) {
  for (const [rule, re] of [["DASH", DASH_CHARS], ["DASH", DOUBLE_HYPHEN], ["DASH", SPACED_HYPHEN], ["EMOJI", EMOJI], ["AI", AI], ["COUNTDOWN", COUNTDOWN]]) {
    re.lastIndex = 0;
    for (const m of line.matchAll(re)) out.push({ rule, match: m[0], context: ctx(base, base.indexOf(line) + m.index, m[0].length) });
  }
}
export function brandHits(text = "", mode = "text") {
  const t = String(text);
  const out = [];
  if (mode === "lines") {
    for (const raw of t.split(/\r?\n/)) {
      if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(raw)) continue;
      const line = raw.replace(/^(\s*)[-*]\s+/, "$1  ");
      scanLine(line, out, t.includes(line) ? t : line);
    }
  } else {
    scanLine(t, out, t);
  }
  return out;
}
