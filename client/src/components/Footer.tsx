import { Link } from "wouter";
import { Facebook, Instagram, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-playfair text-xl font-bold text-primary">Reese Astor</h3>
            <p className="text-sm text-muted-foreground">
              Bestselling romance author and writing coach helping women turn their creative passion into profitable businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/books" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Books
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/coaching" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Coaching
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/reeseastor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61571178214136"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@reeseastor.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Reese Astor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
