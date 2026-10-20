/**
 * Bundle the Express server for production.
 *
 * Admin page chunks are sealed into dist/generated/adminChunks.ts (gitignored).
 * This script inlines that file. The tracked stub at
 * server/generated/adminChunks.ts stays empty.
 */
import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const entry = process.argv[2] ?? "server/_core/index.ts";
const outfile = process.argv[3] ?? "dist/index.js";
const sealed = path.join(root, "dist", "generated", "adminChunks.ts");

if (!fs.existsSync(sealed)) {
  console.error(
    "[bundle-server] Missing dist/generated/adminChunks.ts. Run scripts/seal-admin-chunks.mjs first.",
  );
  process.exit(1);
}

const sealedText = fs.readFileSync(sealed, "utf8");
if (!sealedText.includes("export const adminChunks") || !sealedText.includes("WritingStudio-")) {
  console.error("[bundle-server] Sealed admin chunks file is empty. Refusing to bundle.");
  process.exit(1);
}

await esbuild.build({
  entryPoints: [path.join(root, entry)],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: path.join(root, outfile),
  plugins: [
    {
      name: "server-aliases",
      setup(build) {
        build.onResolve({ filter: /^@shared\// }, (args) => {
          const rel = args.path.slice("@shared/".length);
          const base = path.join(root, "shared", rel);
          const candidates = [`${base}.ts`, `${base}.tsx`, `${base}.js`, path.join(base, "index.ts")];
          for (const candidate of candidates) {
            if (fs.existsSync(candidate)) return { path: candidate };
          }
          return { path: `${base}.ts` };
        });
        build.onResolve({ filter: /(?:^|\/)generated\/adminChunks(?:\.ts)?$/ }, () => ({
          path: sealed,
        }));
      },
    },
  ],
});

console.log(`[bundle-server] Wrote ${outfile} with sealed admin chunks.`);
