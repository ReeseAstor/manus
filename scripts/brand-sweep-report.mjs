#!/usr/bin/env node
/**
 * Report-only brand sweep: counts em dashes and emoji per file.
 * It never fails (exit 0). It tracks the clean-up separately from the
 * banned-word guard (server/brand-banned-words.test.ts). Once a directory
 * reaches 0, move it into that guard.
 *
 * Usage: node scripts/brand-sweep-report.mjs [--files]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SCAN_DIRS = ["client/public/read", "blog-posts", "server/email-templates", "client/src", "client/public", "server", "shared", "scripts", "ui_kits"];
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".html", ".md", ".json", ".txt", ".css"]);
const EM_DASH = /\u2014|&mdash;|\\u2014/g;
const EMOJI = /\p{Extended_Pictographic}|\\ud83[cd]\\ud[c-f][0-9a-f]{2}/gu;

function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (TEXT_EXT.has(path.extname(name))) yield full;
  }
}

const ROOT_SEEDS = readdirSync(ROOT).filter((n) => /^seed[^/]*\.(?:mjs|js|ts)$/.test(n)).map((n) => path.join(ROOT, n));

const seen = new Set();
const rows = [];
for (const d of [...SCAN_DIRS, "(root seeds)"]) {
  for (const f of d === "(root seeds)" ? ROOT_SEEDS : walk(path.join(ROOT, d))) {
    const rel = path.relative(ROOT, f);
    if (seen.has(rel) || rel === "scripts/brand-sweep-report.mjs") continue;
    seen.add(rel);
    let emLines = 0, emojiLines = 0;
    for (const line of readFileSync(f, "utf8").split("\n")) {
      if (line.match(EM_DASH)) emLines++;
      if (line.match(EMOJI)) emojiLines++;
    }
    if (emLines || emojiLines) rows.push({ rel, emLines, emojiLines });
  }
}

const byDir = {};
for (const r of rows) {
  const dir = SCAN_DIRS.find((d) => r.rel.startsWith(d + "/")) ?? "(root seeds)";
  byDir[dir] ??= { files: 0, emLines: 0, emojiLines: 0 };
  byDir[dir].files++; byDir[dir].emLines += r.emLines; byDir[dir].emojiLines += r.emojiLines;
}
console.log("Brand sweep (report only, never fails)\n");
console.log("dir".padEnd(28), "files".padStart(6), "em-dash lines".padStart(14), "emoji lines".padStart(12));
for (const d of [...SCAN_DIRS, "(root seeds)"]) {
  const v = byDir[d] ?? { files: 0, emLines: 0, emojiLines: 0 };
  console.log(d.padEnd(28), String(v.files).padStart(6), String(v.emLines).padStart(14), String(v.emojiLines).padStart(12));
}
const t = rows.reduce((a, r) => ({ em: a.em + r.emLines, emoji: a.emoji + r.emojiLines }), { em: 0, emoji: 0 });
console.log(`\nTotal: ${rows.length} files, ${t.em} em-dash lines, ${t.emoji} emoji lines`);
if (process.argv.includes("--files")) {
  console.log("\nPer file (em-dash lines / emoji lines):");
  for (const r of rows.sort((a, b) => a.rel.localeCompare(b.rel))) console.log(`${r.rel}\t${r.emLines}\t${r.emojiLines}`);
}
