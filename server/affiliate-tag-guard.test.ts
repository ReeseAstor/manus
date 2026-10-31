import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.join(__dirname, "..");
const DIRS = ["blog-posts", "client/src", "client/public", "server", "shared", "scripts"];
const RETIRED_TAG = ["88away0d", "20"].join("-");

function files(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else if (/\.(md|mdx|ts|tsx|js|mjs|cjs|json|html|txt)$/.test(name)) out.push(full);
  }
  return out;
}

describe("Amazon associate tag", () => {
  it(`no source, content or page file uses the retired tag ${RETIRED_TAG}`, () => {
    const hits = DIRS.flatMap((d) => files(path.join(ROOT, d)))
      .filter((f) => readFileSync(f, "utf8").includes(RETIRED_TAG))
      .map((f) => path.relative(ROOT, f));
    expect(hits).toEqual([]);
  });
});
