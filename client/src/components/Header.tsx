import { Link } from "wouter";
import { Button } from "./ui/button";
import { Menu, X, User, ShoppingBag, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary nav follows the catalog brief — Books carries every title
  // (lane separation is handled inside /books), so Audiobooks / Latest
  // Release are intentionally absent. Secondary group is rendered smaller.
  const navLinks = [
    { href: "/books", label: "Books" },
    { href: "/about", label: "About" },
    { href: "/newsletter", label: "Newsletter" },
  ];
  const secondaryNavLinks = [
    { href: "/press", label: "Press" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <span className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors cursor-pointer">
            <span className="font-playfair text-2xl font-bold">Reese Astor</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-primary">
                {link.label}
              </span>
            </Link>
          ))}

          {/* Secondary nav — smaller, slightly muted */}
          <span className="hidden lg:inline-block w-px h-4 bg-border/40 mx-1" aria-hidden />
          {secondaryNavLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer text-muted-foreground/70 hover:text-primary">
                {link.label}
              </span>
            </Link>
          ))}

          {/* User Menu */}
          {!loading && (
            user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition-colors"
                >
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-sm text-[#e5e5e5]">{user.name || "Account"}</span>
                  <ChevronDown className={`w-4 h-4 text-[#e5e5e5]/60 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1f3a] border border-[#d4af37]/20 rounded-lg shadow-xl overflow-hidden">
                    <Link href="/profile">
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-[#e5e5e5] hover:bg-[#d4af37]/10 flex items-center gap-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                    </Link>
                    <Link href="/my-purchases">
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-[#e5e5e5] hover:bg-[#d4af37]/10 flex items-center gap-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Purchases
                      </button>
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <button 
                          className="w-full px-4 py-2 text-left text-sm text-[#e5e5e5] hover:bg-[#d4af37]/10 flex items-center gap-2"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      </Link>
                    )}
                    <hr className="border-[#d4af37]/10" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Sign In
              </Button>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col space-y-4 py-4">
            {[...navLinks, ...secondaryNavLinks].map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Mobile User Menu */}
            {!loading && (
              user ? (
                <>
                  <hr className="border-border/40" />
                  <Link href="/profile">
                    <span 
                      className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </span>
                  </Link>
                  <Link href="/my-purchases">
                    <span 
                      className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      My Purchases
                    </span>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <span 
                        className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 w-fit"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Sign In
                </Button>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
