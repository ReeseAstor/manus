/**
 * Admin route table. This module is an admin chunk (see vite.config.ts chunkFileNames and
 * scripts/seal-admin-chunks.mjs): it is removed from the public CDN build and served only to
 * an admin session, so admin paths and page names stay out of the public bundle.
 * App.tsx mounts it behind <AdminRoute> for /admin and /admin/*.
 */
import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const Admin = lazy(() => import("./Admin"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const AdminQA = lazy(() => import("./AdminQA"));
const AdminLinks = lazy(() => import("./AdminLinks"));
const AdminBooks = lazy(() => import("./AdminBooks"));
const AdminCanonArchive = lazy(() => import("./AdminCanonArchive"));
const AdminReports = lazy(() => import("./AdminReports"));
const AdminCommandCenter = lazy(() => import("./AdminCommandCenter"));
const AdminStripeAnalytics = lazy(() => import("./AdminStripeAnalytics"));
const AdminEmailTemplates = lazy(() => import("./AdminEmailTemplates"));
const AdminAffiliateAnalytics = lazy(() => import("./AdminAffiliateAnalytics"));
const AdminPartnerApplications = lazy(() => import("./AdminPartnerApplications"));
const AdminSocialMediaKit = lazy(() => import("./AdminSocialMediaKit"));
const AdminSwitchy = lazy(() => import("./AdminSwitchy"));
const AdminAudioGenerator = lazy(() => import("./AdminAudioGenerator"));
const AdminWebhooks = lazy(() => import("./AdminWebhooks"));
const AdminTwilio = lazy(() => import("./AdminTwilio"));
const AdminSmsAnalytics = lazy(() => import("./AdminSmsAnalytics"));
const AdminAIUsage = lazy(() => import("./AdminAIUsage"));
const ExclusiveContentManager = lazy(() => import("./ExclusiveContentManager"));
const AdminAIStudio = lazy(() => import("./AdminAIStudio"));
const WritingStudio = lazy(() => import("./WritingStudio"));
const BlogEditor = lazy(() => import("./BlogEditor"));
const NewsletterManager = lazy(() =>
  import("./NewsletterManager").then(m => ({ default: m.NewsletterManager })),
);
const NewsletterEditor = lazy(() =>
  import("./NewsletterEditor").then(m => ({ default: m.NewsletterEditor })),
);

export default function AdminRoutes() {
  return (
    <Switch>
      <Route path={"/admin"}><Admin /></Route>
      <Route path={"/admin/dashboard"}><AdminDashboard /></Route>
      <Route path={"/admin/qa"}><AdminQA /></Route>
      <Route path={"/admin/links"}><AdminLinks /></Route>
      <Route path={"/admin/books"}><AdminBooks /></Route>
      <Route path={"/admin/canon-archive"}><AdminCanonArchive /></Route>
      <Route path={"/admin/reports"}><AdminReports /></Route>
      <Route path={"/admin/command-center"}><AdminCommandCenter /></Route>
      <Route path={"/admin/stripe-analytics"}><AdminStripeAnalytics /></Route>
      <Route path={"/admin/email-templates"}><AdminEmailTemplates /></Route>
      <Route path={"/admin/usage"}><AdminAIUsage /></Route>
      <Route path={"/admin/exclusive-content"}><ExclusiveContentManager /></Route>
      <Route path={"/admin/affiliate-analytics"}><AdminAffiliateAnalytics /></Route>
      <Route path={"/admin/partner-applications"}><AdminPartnerApplications /></Route>
      <Route path={"/admin/social-media-kit"}><AdminSocialMediaKit /></Route>
      <Route path={"/admin/switchy"}><AdminSwitchy /></Route>
      <Route path={"/admin/audio"}><AdminAudioGenerator /></Route>
      <Route path={"/admin/webhooks"}><AdminWebhooks /></Route>
      <Route path={"/admin/twilio"}><AdminTwilio /></Route>
      <Route path={"/admin/sms-analytics"}><AdminSmsAnalytics /></Route>
      <Route path={"/admin/studio"}><AdminAIStudio /></Route>
      <Route path={"/admin/writing-studio"}><WritingStudio /></Route>
      <Route path={"/admin/blog/new"}><BlogEditor /></Route>
      <Route path={"/admin/blog/edit/:id"}><BlogEditor /></Route>
      <Route path={"/admin/newsletters"}><NewsletterManager /></Route>
      <Route path={"/admin/newsletter/:id"}><NewsletterEditor /></Route>
      {/* Old paths, kept working for bookmarks. */}
      <Route path={"/admin/ai-studio"}><Redirect to="/admin/studio" replace /></Route>
      <Route path={"/admin/ai-usage"}><Redirect to="/admin/usage" replace /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}
