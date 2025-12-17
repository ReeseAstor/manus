import { Link } from "wouter";
import { Button } from "./ui/button";
import { Menu, X, BookOpen, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/shop", label: "Shop", special: true },
    { href: "/free-book", label: "Free Book" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
          <span className="font-playfair text-2xl font-bold">Reese Astor</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                link.special 
                  ? "text-primary font-bold hover:text-primary/80" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* User Menu */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.name?.split(' ')[0] || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/my-purchases">
                      <DropdownMenuItem className="cursor-pointer">
                        <BookOpen className="w-4 h-4 mr-2" />
                        My Purchases
                      </DropdownMenuItem>
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem className="cursor-pointer">
                            Admin Dashboard
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500"
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Sign In
                </Button>
              )}
            </>
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
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.special 
                    ? "text-primary font-bold hover:text-primary/80" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Menu */}
            {!loading && (
              <div className="pt-4 border-t border-border/40">
                {user ? (
                  <>
                    <Link 
                      href="/profile"
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link 
                      href="/my-purchases"
                      className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      My Purchases
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="flex items-center text-sm font-medium text-red-500 hover:text-red-400 transition-colors py-2 w-full text-left"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
