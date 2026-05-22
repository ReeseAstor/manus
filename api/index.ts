// Vercel Functions entrypoint.
//
// The Express app is pre-bundled at build time into `dist/server-bundle.mjs`
// (see `buildCommand` in vercel.json). Bundling inlines all relative imports so
// the function does not hit ERR_MODULE_NOT_FOUND under Node's native ESM loader.
//
// vercel.json rewrites /api/*, /webhooks/*, /sitemap.xml and /robots.txt to
// this function. Static SPA assets are served directly from dist/public by the
// Vercel CDN, and all other paths fall back to /index.html for the SPA router.
// @ts-ignore - generated at deploy time by the buildCommand esbuild step
import app from "../dist/server-bundle.mjs";

export default app;
