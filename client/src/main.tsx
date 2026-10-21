import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Prerendered pages (scripts/prerender-static.mjs) carry their own head tags
// for crawlers. Remove them before React mounts so Helmet is the single
// source of meta tags in the browser.
document.querySelectorAll("[data-pre]").forEach((node) => node.remove());

// Analytics loads only when configured, so unset placeholders never ship.
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsSiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
if (analyticsEndpoint && analyticsSiteId) {
  const tag = document.createElement("script");
  tag.defer = true;
  tag.src = `${analyticsEndpoint}/umami`;
  tag.dataset.websiteId = analyticsSiteId;
  document.body.appendChild(tag);
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);
