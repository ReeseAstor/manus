import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import ReaderClub from "./pages/ReaderClub";
import ExclusiveContentDetail from "./pages/ExclusiveContentDetail";
import FreeBook from "./pages/FreeBook";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import BlogEditor from "./pages/BlogEditor";
import AdminAudioGenerator from "./pages/AdminAudioGenerator";
import AdminWebhooks from "./pages/AdminWebhooks";
import AdminTwilio from "./pages/AdminTwilio";
import AdminSmsAnalytics from "./pages/AdminSmsAnalytics";
import { NewsletterManager } from "./pages/NewsletterManager";
import { NewsletterEditor } from "./pages/NewsletterEditor";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CharacterQuiz from "./pages/CharacterQuiz";
import Shop from "./pages/Shop";
import WhyBuyDirectPage from "./pages/WhyBuyDirectPage";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Profile from "./pages/Profile";
import VipClub from "./pages/VipClub";
import VipAudioHub from "./pages/VipAudioHub";
import VipAudioLibrary from "./pages/VipAudioLibrary";
import AuthLogin from "./pages/AuthLogin";
import Newsletter from "./pages/Newsletter";
import NewsletterArchive from "./pages/NewsletterArchive";
import NewsletterDetail from "./pages/NewsletterDetail";
import VipWelcome from "./pages/VipWelcome";
import VipDashboard from "./pages/VipDashboard";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AIChatbot } from "./components/AIChatbot";
import { EmailCapturePopup } from "./components/EmailCapturePopup";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/books"} component={Books} />      <Route path={"/books/:slug"} component={BookDetail} />
      <Route path={"/reader-club"} component={ReaderClub} />
      <Route path={"/reader-club/:slug"} component={ExclusiveContentDetail} />
      <Route path={"/free-book"} component={FreeBook} />
      <Route path={"/quiz"} component={CharacterQuiz} />
      <Route path={"/shop"} component={Shop} />
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
      <Route path={"/admin/audio"} component={AdminAudioGenerator} />
      <Route path={"/admin/webhooks"} component={AdminWebhooks} />
      <Route path={"/admin/twilio"} component={AdminTwilio} />
      <Route path={"/admin/sms-analytics"} component={AdminSmsAnalytics} />
      <Route path={"/admin/blog/new"} component={BlogEditor} />
      <Route path={"/admin/blog/edit/:id"} component={BlogEditor} />
      <Route path={"/admin/newsletters"} component={NewsletterManager} />
      <Route path={"/admin/newsletter/:id"} component={NewsletterEditor} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
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
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
