// Vercel Functions entrypoint. Wraps the Express app from server/_core/app.ts.
// Vercel auto-detects an exported Express instance and routes invocations to it.
//
// Local dev still uses `server/_core/index.ts` (which calls `app.listen`).
// In production on Vercel, this file is the only request handler — every
// /api/*, /sitemap.xml, and /robots.txt route is rewritten to it via
// vercel.json. Static SPA assets are served directly from dist/public by
// Vercel's CDN.
import { createApp } from "../server/_core/app";

const app = createApp();
export default app;
