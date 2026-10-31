// Line-delimited JSON bridge from rendered-check.py to the build guards (same modules the prerender uses).
// In: {"op":"free","src":"...","kind":"html|markdown"} | {"op":"ku","html":"...","slug":"..."|null} | {"op":"visible","html":"..."}
// Out: one JSON line per request: {"ok":true,"result":...} or {"ok":false,"error":"..."} (the caller fails closed).
import readline from "node:readline";
import path from "node:path";
import { pathToFileURL } from "node:url";
const lib = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "lib");
const free = await import(pathToFileURL(path.join(lib, "free-wording-guard.mjs")).href);
const ku = await import(pathToFileURL(path.join(lib, "book-fallback-guard.mjs")).href);
const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of rl) {
  let out;
  try {
    const q = JSON.parse(line);
    if (q.op === "free") out = { ok: true, result: free.bareFreeClaims(q.src, { kind: q.kind || "html" }) };
    else if (q.op === "ku") out = { ok: true, result: ku.fallbackProblems(q.html, q.slug ?? undefined) };
    else if (q.op === "visible") out = { ok: true, result: ku.visibleText(q.html).replace(/\s+/g, " ") };
    else if (q.op === "meta") out = { ok: true, result: { line: ku.EXPECTED_KINDLE_PLUS_LINE, ku: ku.KU_TITLE_SLUGS, nonku: ku.NON_KU_TITLE_SLUGS } };
    else out = { ok: false, error: `unknown op ${q.op}` };
  } catch (e) {
    out = { ok: false, error: String(e && e.stack || e).slice(0, 500) };
  }
  process.stdout.write(JSON.stringify(out) + "\n");
}
