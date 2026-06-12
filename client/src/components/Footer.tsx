import { Link } from "wouter";
import { Facebook, Instagram, Mail, Gift } from "lucide-react";
import { GOLD, GOLD_SOFT, INK, MUTED, RULE, RULE_SOFT, TEXT, TEXT_SOFT } from "@/components/author-kit/tokens";

const exploreLinks = [
  { href: "/books", label: "Books" },
  { href: "/free-book", label: "Free Book" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" },
  { href: "/favorites", label: "Reese's Favorites" },
  { href: "/about", label: "About" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/sms", label: "Text Alerts" },
  { href: "/contact", label: "Contact" },
];

function ColumnHead({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="font-inter mb-6 text-[10px] font-semibold uppercase"
      style={{ color: GOLD, letterSpacing: "0.34em" }}
    >
      {children}
    </h4>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <a
        className="font-cormorant text-[16px] no-underline transition-colors duration-200 hover:text-[#C9A646]"
        style={{ color: TEXT_SOFT }}
      >
        {label}
      </a>
    </Link>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: INK, borderTop: `1px solid ${RULE}` }}>
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-20 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/">
              <a className="font-display inline-block text-[28px] no-underline" style={{ color: TEXT, letterSpacing: "0.01em" }}>
                Reese Astor
              </a>
            </Link>
            <div
              className="font-inter mt-2 text-[9px] font-semibold uppercase"
              style={{ color: GOLD, letterSpacing: "0.3em" }}
            >
              USA Today Bestselling Author
            </div>
            <p
              className="font-cormorant mt-5 max-w-[300px] text-[16px] italic leading-[1.6]"
              style={{ color: TEXT_SOFT, textWrap: "pretty" }}
            >
              Power, passion, and Manhattan collide — in the Money Kings series and the Hudson Dynasty novels.
            </p>
            <a
              href="https://BookHip.com/JHRBVXT"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase no-underline transition-all duration-200 hover:-translate-y-px"
              style={{ background: GOLD, color: INK, padding: "12px 22px", letterSpacing: "0.22em" }}
            >
              <Gift className="h-3.5 w-3.5" />
              Get a Free Book
            </a>
          </div>

          {/* Explore */}
          <div>
            <ColumnHead>Explore</ColumnHead>
            <nav className="flex flex-col gap-2.5">
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <ColumnHead>Fine Print</ColumnHead>
            <nav className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <ColumnHead>Connect</ColumnHead>
            <div className="flex gap-3">
              {[
                { href: "https://www.instagram.com/reeseastor/", label: "Instagram", Icon: Instagram },
                { href: "https://www.facebook.com/people/Reese-Astor/61571178214136/", label: "Facebook", Icon: Facebook },
                { href: "mailto:contact@reeseastor.com", label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center transition-all duration-200 hover:-translate-y-px"
                  style={{ border: `1px solid ${RULE}`, color: GOLD }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="font-cormorant mt-6 text-[15px] italic leading-[1.6]" style={{ color: TEXT_SOFT }}>
              Join 1,700+ readers on the VIP list for exclusive content and new release alerts.
            </p>
          </div>
        </div>

        {/* Baseline */}
        <div
          className="mt-16 flex flex-col items-center gap-3 border-t pt-8 md:flex-row md:justify-between"
          style={{ borderColor: RULE_SOFT }}
        >
          <p className="font-inter m-0 text-[11px] uppercase" style={{ color: MUTED, letterSpacing: "0.22em" }}>
            &copy; {currentYear} Reese Astor · All rights reserved
          </p>
          <p className="font-display m-0 text-[14px] italic" style={{ color: GOLD_SOFT }}>
            Written in New York. &#10038;
          </p>
        </div>
      </div>
    </footer>
  );
}
