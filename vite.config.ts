import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";


const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
    // NOTE: manualChunks was removed entirely after two production blank-page
    // outages caused by Rollup's inability to preserve initialization order
    // across chunk boundaries when transitive deps form cycles.
    //
    // First outage (PR #7): the `diagrams` chunk (mermaid/cytoscape) threw
    //   "Cannot access 'ke' before initialization" on import.
    // Second outage (this commit): the `icons` chunk (lucide-react) threw
    //   "Cannot read properties of undefined (reading 'forwardRef')" because
    //   the `react` chunk hadn't finished initializing when icons evaluated.
    //
    // Both crashes blanked the entire SPA. Manual chunking is fragile for
    // this dep graph and the small first-paint improvement isn't worth
    // shipping bricked production. Let Vite/Rollup chunk automatically.
    //
    // If we revisit this for perf, the safer route is route-level dynamic
    // import() + lazy(), not output.manualChunks.
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
