import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Books from "./pages/Books";
import FreeBook from "./pages/FreeBook";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import BlogEditor from "./pages/BlogEditor";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CharacterQuiz from "./pages/CharacterQuiz";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AIChatbot } from "./components/AIChatbot";
import { EmailCapturePopup } from "./components/EmailCapturePopup";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/books"} component={Books} />
      <Route path={"/free-book"} component={FreeBook} />
      <Route path={"/quiz"} component={CharacterQuiz} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/blog/new"} component={BlogEditor} />
      <Route path={"/admin/blog/edit/:id"} component={BlogEditor} />
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
