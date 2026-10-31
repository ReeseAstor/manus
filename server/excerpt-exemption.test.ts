import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// QA v5 ruling D2: the dash exemption may sit only on the two /read book excerpts (quoted published text),
// so the marker can't be used to launder other copy.
const ROOT = path.join(__dirname, "..");
const ALLOWED = ["client/public/read/poison-pill/index.html", "client/public/read/the-billionaires-one-night-stand/index.html"];
const SKIP = /(^|\/)(node_modules|dist|\.git|__fixtures__)(\/|$)|\.test\.ts$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    const rel = path.relative(ROOT, p);
    if (SKIP.test(rel)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|tsx?|jsx?|mjs|md|json)$/.test(e.name)) out.push(rel);
  }
  return out;
}

describe("excerpt dash exemption (QA D2)", () => {
  it("data-book-excerpt appears exactly twice site-wide, once on each allowed excerpt block", () => {
    const hits: string[] = [];
    for (const dir of ["client", "shared", "server", "scripts/lib", "scripts/prerender-static.mjs"]) {
      const abs = path.join(ROOT, dir);
      const files = fs.statSync(abs).isDirectory() ? walk(abs) : [dir];
      for (const f of files) {
        const n = (fs.readFileSync(path.join(ROOT, f), "utf8").match(/data-book-excerpt/g) || []).length;
        for (let i = 0; i < n; i++) hits.push(f);
      }
    }
    expect(hits.sort()).toEqual([...ALLOWED].sort());
    for (const f of ALLOWED) {
      const html = fs.readFileSync(path.join(ROOT, f), "utf8");
      expect(html).toMatch(/<div class="excerpt" data-book-excerpt>/);
    }
  });

  it("the rendered check exempts only [data-book-excerpt] and only on those two routes", () => {
    const py = fs.readFileSync(path.join(ROOT, "scripts/rendered-check/rendered-check.py"), "utf8");
    expect(py).toContain('p.closest("[data-book-excerpt]")');
    expect(py).not.toMatch(/closest\("[^"]*\.excerpt/);
    expect(py).toContain('EXCERPT_ROUTES = {"/read/poison-pill", "/read/the-billionaires-one-night-stand"}');
  });
});
