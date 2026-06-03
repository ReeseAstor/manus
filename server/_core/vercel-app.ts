import { createApp } from "./app";

/**
 * Vercel serverless entry. Builds the configured Express app and exports it as
 * the default handler.
 *
 * This module is pre-bundled at build time (see vercel.json `buildCommand`)
 * with esbuild (`--bundle --packages=external`) into `dist/server-bundle.mjs`.
 * Bundling inlines every relative import, which is required because the project
 * is authored for a bundler (extensionless / directory imports, `@shared/*`
 * path aliases). Without bundling, Node's native ESM loader on Vercel cannot
 * resolve those specifiers and the function crashes on load with
 * ERR_MODULE_NOT_FOUND.
 */
const app = createApp();
export default app;
