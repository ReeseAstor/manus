import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./styles/animations.css";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// ───── Eager: customer-facing routes on the buy funnel (load fast) ─────
import Home from "./pages/Home";
import BooksCatalog from "./pages/BooksCatalog";
import BookTitle from "./pages/BookTitle";
import AuditOfTheHeart from "./pages/AuditOfTheHeart";
import HostileTender from "./pages/HostileTender";
import FreeBook from "./pages/FreeBook";
import Permission from "./pages/Permission";
import Press from "./pages/Press";
import Shop from "./pages/Shop";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReaderClub from "./pages/ReaderClub";
import ExclusiveContentDetail from "./pages/ExclusiveContentDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// ───── Lazy: admin, editors, and rarely-hit gated routes ─────
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminQA = lazy(() => import("./pages/AdminQA"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminBooks = lazy(() => import("./pages/AdminBooks"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminCommandCenter = lazy(() => import("./pages/AdminCommandCenter"));
const AdminStripeAnalytics = lazy(() => import("./pages/AdminStripeAnalytics"));
const AdminEmailTemplates = lazy(() => import("./pages/AdminEmailTemplates"));
const AdminAffiliateAnalytics = lazy(() => import("./pages/AdminAffiliateAnalytics"));
const AdminPartnerApplications = lazy(() => import("./pages/AdminPartnerApplications"));
const AdminSocialMediaKit = lazy(() => import("./pages/AdminSocialMediaKit"));
const AdminSwitchy = lazy(() => import("./pages/AdminSwitchy"));
const AdminAudioGenerator = lazy(() => import("./pages/AdminAudioGenerator"));
const AdminWebhooks = lazy(() => import("./pages/AdminWebhooks"));
const AdminTwilio = lazy(() => import("./pages/AdminTwilio"));
const AdminSmsAnalytics = lazy(() => import("./pages/AdminSmsAnalytics"));
const AdminAIStudio = lazy(() => import("./pages/AdminAIStudio"));
const WritingStudio = lazy(() => import("./pages/WritingStudio"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const NewsletterManager = lazy(() =>
  import("./pages/NewsletterManager").then(m => ({ default: m.NewsletterManager })),
);
const NewsletterEditor = lazy(() =>
  import("./pages/NewsletterEditor").then(m => ({ default: m.NewsletterEditor })),
);
const CharacterQuiz = lazy(() => import("./pages/CharacterQuiz"));
const RomanceTropeQuiz = lazy(() => import("./pages/Quiz"));
const WhyBuyDirectPage = lazy(() => import("./pages/WhyBuyDirectPage"));
const Profile = lazy(() => import("./pages/Profile"));
const VipClub = lazy(() => import("./pages/VipClub"));
const VipWelcome = lazy(() => import("./pages/VipWelcome"));
const VipDashboard = lazy(() => import("./pages/VipDashboard"));
const VipAudioHub = lazy(() => import("./pages/VipAudioHub"));
const VipAudioLibrary = lazy(() => import("./pages/VipAudioLibrary"));
const AuthLogin = lazy(() => import("./pages/AuthLogin"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const NewsletterArchive = lazy(() => import("./pages/NewsletterArchive"));
const NewsletterDetail = lazy(() => import("./pages/NewsletterDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Promo = lazy(() => import("./pages/Promo"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AIChatbot } from "./components/AIChatbot";
import { EmailCapturePopup } from "./components/EmailCapturePopup";
import { ExitIntentPopup } from "./components/ExitIntentPopup";

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#C9A646]/30 border-t-[#C9A646] rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/books"} component={BooksCatalog} />
        <Route path={"/books/audit-of-the-heart"} component={AuditOfTheHeart} />
        <Route path={"/books/hostile-tender"} component={HostileTender} />
        <Route path={"/books/:slug"} component={BookTitle} />
        <Route path={"/permission"} component={Permission} />
        <Route path={"/press"} component={Press} />
        <Route path={"/reader-club"} component={ReaderClub} />
        <Route path={"/reader-club/:slug"} component={ExclusiveContentDetail} />
        <Route path={"/free-book"} component={FreeBook} />
        <Route path={"/quiz"} component={CharacterQuiz} />
        <Route path={"/romance-quiz"} component={RomanceTropeQuiz} />
        <Route path={"/shop"} component={Shop} />
        <Route path={"/favorites"} component={Favorites} />
        <Route path={"/promo"} component={Promo} />
        <Route path={"/why-buy-direct"} component={WhyBuyDirectPage} />
        <Route path={"/purchase-success"} component={PurchaseSuccess} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/vip-club"} component={VipClub} />
        <Route path={"/vip-club/welcome"} component={VipWelcome} />
        <Route path={"/vip-club/dashboard"} component={VipDashboard} />
        <Route path={"/auth/login"} component={AuthLogin} />
        <Route path={"/newsletter"} component={Newsletter} />
        <Route path={"/newsletter-archive"} component={NewsletterArchive} />
        <Route path={"/newsletter-archive/:id"} component={NewsletterDetail} />
        <Route path={"/vip-audio"} component={VipAudioHub} />
        <Route path={"/vip-audio-library"} component={VipAudioLibrary} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/admin/dashboard"} component={AdminDashboard} />
        <Route path={"/admin/qa"} component={AdminQA} />
        <Route path={"/admin/links"} component={AdminLinks} />
        <Route path={"/admin/books"} component={AdminBooks} />
        <Route path={"/admin/reports"} component={AdminReports} />
        <Route path={"/admin/command-center"} component={AdminCommandCenter} />
        <Route path={"/admin/stripe-analytics"} component={AdminStripeAnalytics} />
        <Route path={"/admin/email-templates"} component={AdminEmailTemplates} />
        <Route path={"/admin/affiliate-analytics"} component={AdminAffiliateAnalytics} />
        <Route path={"/admin/partner-applications"} component={AdminPartnerApplications} />
        <Route path={"/admin/social-media-kit"} component={AdminSocialMediaKit} />
        <Route path={"/admin/switchy"} component={AdminSwitchy} />
        <Route path={"/admin/audio"} component={AdminAudioGenerator} />
        <Route path={"/admin/webhooks"} component={AdminWebhooks} />
        <Route path={"/admin/twilio"} component={AdminTwilio} />
        <Route path={"/admin/sms-analytics"} component={AdminSmsAnalytics} />
        <Route path={"/admin/ai-studio"} component={AdminAIStudio} />
        <Route path={"/admin/writing-studio"} component={WritingStudio} />
        <Route path={"/admin/blog/new"} component={BlogEditor} />
        <Route path={"/admin/blog/edit/:id"} component={BlogEditor} />
        <Route path={"/admin/newsletters"} component={NewsletterManager} />
        <Route path={"/admin/newsletter/:id"} component={NewsletterEditor} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
            <AIChatbot />
            <EmailCapturePopup />
            <ExitIntentPopup />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
