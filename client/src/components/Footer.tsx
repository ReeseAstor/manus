import { Link } from "wouter";
import { Facebook, Instagram, Mail, BookOpen, Gift, Bell } from "lucide-react";

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
              USA Today Bestselling romance author. Power, passion, and Manhattan collide in the Manhattan Money Kings series.
            </p>
            {/* Free Book CTA in Footer */}
            <a
              href="https://BookHip.com/JHRBVXT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <Gift className="h-4 w-4" />
              Get a Free Book
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/books">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Books</a>
              </Link>
              <Link href="/free-book">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Free Book
                </a>
              </Link>
              <Link href="/newsletter">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  Newsletter
                </a>
              </Link>
              <Link href="/blog">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a>
              </Link>
              <Link href="/shop">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</a>
              </Link>
              <Link href="/favorites">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Reese's Favorites</a>
              </Link>
              <Link href="/about">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              </Link>
              <Link href="/terms">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              </Link>
              <Link href="/sms">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Text Alerts</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
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
                href="https://www.facebook.com/people/Reese-Astor/61571178214136/"
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
            <p className="text-xs text-muted-foreground mt-4">
              Join 1,700+ readers on the VIP list for exclusive content and new release alerts.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Reese Astor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
