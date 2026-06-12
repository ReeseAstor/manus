import { Link, useLocation } from "wouter";
import { Menu, X, User, ShoppingBag, Settings, LogOut, ChevronDown, Gift } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { GOLD, GOLD_SOFT, INK, KIT_EASE, RAISED, RULE, RULE_SOFT, TEXT, TEXT_SOFT } from "@/components/author-kit/tokens";

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

function NavItem({ href, label, active, small = false, onClick }: {
  href: string; label: string; active: boolean; small?: boolean; onClick?: () => void;
}) {
  return (
    <Link href={href}>
      <span
        onClick={onClick}
        className="font-inter group relative cursor-pointer font-semibold uppercase transition-colors duration-200"
        style={{
          fontSize: small ? 10 : 11,
          letterSpacing: "0.26em",
          color: active ? GOLD : small ? "rgba(185,176,162,0.75)" : TEXT_SOFT,
          paddingBottom: 6,
        }}
      >
        {label}
        {/* Active / hover underline — grows from center */}
        <span
          aria-hidden
          className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
          style={{ background: active ? GOLD : GOLD_SOFT }}
        />
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout } = useAuth();
  const [location] = useLocation();
  const reduce = useReducedMotion();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`);

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

  // Lock body scroll while the full-screen mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const mobileLinks = [
    { href: "/", label: "Home" },
    ...navLinks,
    { href: "/free-book", label: "Free Book" },
    ...secondaryNavLinks,
  ];

  return (
    <>
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ background: "rgba(7,13,28,0.88)", borderBottom: `1px solid ${RULE}` }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 md:px-8">
        {/* Wordmark */}
        <Link href="/">
          <span className="flex cursor-pointer items-baseline gap-3">
            <span
              className="font-display text-[22px] font-medium md:text-[24px]"
              style={{ color: TEXT, letterSpacing: "0.02em" }}
            >
              Reese Astor
            </span>
            <span
              className="font-inter hidden text-[9px] font-semibold uppercase lg:inline"
              style={{ color: GOLD, letterSpacing: "0.3em" }}
            >
              USA Today Bestseller
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.href} {...link} active={isActive(link.href)} />
          ))}

          <span className="hidden h-4 w-px lg:inline-block" style={{ background: RULE_SOFT }} aria-hidden />
          {secondaryNavLinks.map((link) => (
            <span key={link.href} className="hidden lg:inline">
              <NavItem {...link} small active={isActive(link.href)} />
            </span>
          ))}

          {/* Primary funnel CTA — always one click away */}
          <Link href="/free-book">
            <span
              className="font-inter inline-flex cursor-pointer items-center gap-2 text-[10px] font-semibold uppercase transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(201,166,70,0.25)]"
              style={{ background: GOLD, color: INK, padding: "10px 18px", letterSpacing: "0.22em" }}
            >
              <Gift className="h-3.5 w-3.5" />
              Free Book
            </span>
          </Link>

          {/* User Menu */}
          {!loading && (
            user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 transition-colors duration-200"
                  style={{ border: `1px solid ${RULE}`, color: TEXT }}
                >
                  <User className="h-4 w-4" style={{ color: GOLD }} />
                  <span className="font-inter max-w-[110px] truncate text-[12px]">{user.name || "Account"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: TEXT_SOFT }}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 overflow-hidden shadow-2xl"
                    style={{ background: RAISED, border: `1px solid ${RULE}` }}
                  >
                    <Link href="/profile">
                      <button
                        className="font-inter flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] transition-colors hover:bg-[rgba(201,166,70,0.08)]"
                        style={{ color: TEXT }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" style={{ color: GOLD }} />
                        My Profile
                      </button>
                    </Link>
                    <Link href="/my-purchases">
                      <button
                        className="font-inter flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] transition-colors hover:bg-[rgba(201,166,70,0.08)]"
                        style={{ color: TEXT }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4" style={{ color: GOLD }} />
                        My Purchases
                      </button>
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <button
                          className="font-inter flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] transition-colors hover:bg-[rgba(201,166,70,0.08)]"
                          style={{ color: TEXT }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" style={{ color: GOLD }} />
                          Admin Dashboard
                        </button>
                      </Link>
                    )}
                    <hr style={{ borderColor: RULE_SOFT }} />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="font-inter flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="font-inter cursor-pointer text-[10px] font-semibold uppercase transition-colors duration-200 hover:text-[#C9A646]"
                style={{ background: "transparent", border: `1px solid ${RULE}`, color: TEXT_SOFT, padding: "10px 16px", letterSpacing: "0.22em" }}
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </button>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          style={{ color: TEXT }}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>

      {/* Mobile Navigation — full-screen editorial overlay. Rendered outside
          <header> because its backdrop-filter creates a containing block that
          would trap this fixed-position panel. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col overflow-y-auto md:hidden"
            style={{ background: INK }}
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: KIT_EASE }}
          >
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8 py-10">
              {mobileLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? undefined : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: KIT_EASE, delay: 0.05 + i * 0.06 }}
                >
                  <Link href={link.href}>
                    <span
                      className="font-display flex cursor-pointer items-baseline gap-4 py-3 text-[34px] leading-none"
                      style={{ color: isActive(link.href) ? GOLD : TEXT, letterSpacing: "-0.01em" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="font-inter w-7 text-[10px] font-semibold" style={{ color: GOLD_SOFT, letterSpacing: "0.2em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile auth */}
              <motion.div
                className="mt-8 border-t pt-8"
                style={{ borderColor: RULE_SOFT }}
                initial={reduce ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {!loading && (
                  user ? (
                    <div className="flex flex-col gap-4">
                      <Link href="/profile">
                        <span
                          className="font-inter flex cursor-pointer items-center gap-2 text-[12px] font-semibold uppercase"
                          style={{ color: TEXT_SOFT, letterSpacing: "0.22em" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" style={{ color: GOLD }} />
                          My Profile
                        </span>
                      </Link>
                      <Link href="/my-purchases">
                        <span
                          className="font-inter flex cursor-pointer items-center gap-2 text-[12px] font-semibold uppercase"
                          style={{ color: TEXT_SOFT, letterSpacing: "0.22em" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4" style={{ color: GOLD }} />
                          My Purchases
                        </span>
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <span
                            className="font-inter flex cursor-pointer items-center gap-2 text-[12px] font-semibold uppercase"
                            style={{ color: TEXT_SOFT, letterSpacing: "0.22em" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" style={{ color: GOLD }} />
                            Admin Dashboard
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="font-inter flex items-center gap-2 text-left text-[12px] font-semibold uppercase text-red-400"
                        style={{ letterSpacing: "0.22em" }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      className="font-inter text-[12px] font-semibold uppercase"
                      style={{ border: `1px solid ${RULE}`, color: GOLD, padding: "12px 24px", letterSpacing: "0.22em", background: "transparent" }}
                      onClick={() => (window.location.href = getLoginUrl())}
                    >
                      Sign In
                    </button>
                  )
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
