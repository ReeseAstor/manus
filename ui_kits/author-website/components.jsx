// UI components for Reese Astor author website kit — Editorial / Luxury revision
// Loaded as Babel JSX; exports components to window for use in index.html

const { useState } = React;

const INK     = "#070D1C";
const SURFACE = "#0B1226";
const RAISED  = "#0F1830";
const RULE    = "rgba(201,166,70,0.22)";
const RULE_SOFT = "rgba(236,230,221,0.10)";
const GOLD    = "#C9A646";
const GOLD_SOFT = "rgba(201,166,70,0.6)";
const TEXT    = "#F2ECDF";
const TEXT_SOFT = "#B9B0A2";
const MUTED  = "#7B7464";

// ─── Primitive: Button ──────────────────────────────────────
function RAButton({ children, variant = "primary", size = "md", onClick, href }) {
  const base = {
    primary: { bg: GOLD, color: INK, border: "1px solid " + GOLD },
    outline: { bg: "transparent", color: GOLD, border: "1px solid " + GOLD },
    ghost:   { bg: "transparent", color: TEXT, border: "1px solid " + RULE_SOFT },
  }[variant];
  const sz = size === "lg" ? { padding: "16px 34px", fontSize: 12 } : { padding: "11px 22px", fontSize: 11 };
  const style = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    background: base.bg, color: base.color, border: base.border,
    borderRadius: 0, fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.24em",
    textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
    transition: "all 240ms cubic-bezier(0.65,0.05,0.36,1)", ...sz,
  };
  const Tag = href ? "a" : "button";
  return <Tag style={style} onClick={onClick} href={href}>{children}</Tag>;
}

// ─── Eyebrow (small uppercase gold label) ──────────────────
function Eyebrow({ children, align = "left", color = GOLD }) {
  return (
    <div style={{
      fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
      color, letterSpacing: "0.34em", textTransform: "uppercase",
      textAlign: align,
    }}>{children}</div>
  );
}

// ─── Top navigation ─────────────────────────────────────────
function TopNav({ onNav, current }) {
  const left = ["Books", "Series"];
  const right = ["About", "Journal"];
  const linkStyle = (item) => ({
    fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
    letterSpacing: "0.28em", color: current === item.toLowerCase() ? GOLD : TEXT,
    textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
  });
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(7,13,28,0.88)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid " + RULE_SOFT,
    }}>
      <div style={{ position: "relative", padding: "26px 64px 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={() => onNav?.("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="../../assets/reese-astor-wordmark-gold.png" alt="Reese Astor" style={{ height: 96, display: "block" }} />
        </div>
        <div style={{ position: "absolute", right: 64, top: "50%", transform: "translateY(-50%)" }}>
          <RAButton variant="outline" size="md" onClick={() => onNav?.("newsletter")}>Inner Circle</RAButton>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 44, padding: "0 64px 18px" }}>
        <nav style={{ display: "flex", gap: 44 }}>{left.map(i => <a key={i} onClick={() => onNav?.(i.toLowerCase())} style={linkStyle(i)}>{i}</a>)}</nav>
        <span style={{ width: 48, height: 1, background: GOLD_SOFT }} />
        <nav style={{ display: "flex", gap: 44 }}>{right.map(i => <a key={i} onClick={() => onNav?.(i.toLowerCase())} style={linkStyle(i)}>{i}</a>)}</nav>
      </div>
    </header>
  );
}

// ─── Ornament: filigree diamond divider ────────────────────
function Ornament({ width = 200, color = GOLD_SOFT }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, width: "100%" }}>
      <span style={{ flex: 1, maxWidth: width, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M14 1 L20 7 L14 13 L8 7 Z" stroke={GOLD} strokeWidth="0.8" fill="none" />
        <circle cx="14" cy="7" r="1.2" fill={GOLD} />
      </svg>
      <span style={{ flex: 1, maxWidth: width, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

// ─── Hero — restrained, editorial, with corner marks ───────
function BookHero({ kicker, title, byline, tagline, blurb, cover, primaryCta = "Order the novel", secondaryCta = "Read chapter one", onPrimary, onSecondary }) {
  const parts = title.split("|");
  return (
    <section style={{
      position: "relative", padding: "120px 64px 160px", overflow: "hidden",
      background: "radial-gradient(ellipse at 70% 30%, " + RAISED + " 0%, " + INK + " 65%)",
    }}>
      {/* Soft vertical gold rule on the left margin */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 64, width: 1, background: "linear-gradient(180deg, transparent, " + RULE + " 30%, " + RULE + " 70%, transparent)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 64, width: 1, background: "linear-gradient(180deg, transparent, " + RULE + " 30%, " + RULE + " 70%, transparent)" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 112, alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Hairline frame */}
          <div style={{ position: "absolute", inset: -22, border: "1px solid " + RULE, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: -34, border: "1px solid " + RULE_SOFT, pointerEvents: "none" }} />
          <img src={cover} alt={parts[0]} style={{
            width: "100%", maxWidth: 380, display: "block",
            boxShadow: "0 50px 100px -20px rgba(0,0,0,0.85), 0 16px 36px rgba(0,0,0,0.55)",
          }} />
        </div>
        <div>
          <Eyebrow>{kicker}</Eyebrow>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 400,
            fontSize: 88, lineHeight: 0.94, letterSpacing: "-0.028em",
            color: TEXT, margin: "32px 0 0", textWrap: "balance",
          }}>
            <span style={{ display: "block" }}>{parts[0]}</span>
            {parts[1] && <span style={{ display: "block", fontStyle: "italic", fontWeight: 400, color: TEXT }}>{parts[1]}</span>}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "40px 0 28px" }}>
            <span style={{ height: 1, width: 56, background: GOLD }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: GOLD }}>&#10038;</span>
            <span style={{ height: 1, width: 56, background: GOLD_SOFT }} />
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: TEXT_SOFT, letterSpacing: "0.32em", textTransform: "uppercase", margin: "0 0 32px" }}>{byline}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: "italic", fontWeight: 400, color: TEXT, lineHeight: 1.4, margin: "0 0 24px", textWrap: "pretty", maxWidth: 580 }}>{tagline}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 400, color: TEXT_SOFT, lineHeight: 1.75, margin: "0 0 48px", textWrap: "pretty", maxWidth: 540 }}>{blurb}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <RAButton variant="primary" size="lg" onClick={onPrimary}>{primaryCta}</RAButton>
            <RAButton variant="ghost" size="lg" onClick={onSecondary}>{secondaryCta}</RAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section heading — single, centered, generous ──────────
function SectionHeading({ kicker, title, lead }) {
  const parts = title.split("|");
  return (
    <div style={{ textAlign: "center", marginBottom: 96, maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
      <Eyebrow align="center">{kicker}</Eyebrow>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 400,
        fontSize: 60, color: TEXT, lineHeight: 1.05,
        letterSpacing: "-0.022em", margin: "24px 0 0", textWrap: "balance",
      }}>
        <span>{parts[0]}</span>
        {parts[1] && <em style={{ fontWeight: 400 }}> {parts[1]}</em>}
      </h2>
      <div style={{ marginTop: 36 }}>
        <Ornament width={120} />
      </div>
      {lead && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 20, color: TEXT_SOFT, lineHeight: 1.6, margin: "28px auto 0", maxWidth: 580 }}>{lead}</p>}
    </div>
  );
}

// ─── Manifesto strip — quiet centerpiece ───────────────────
function Manifesto() {
  return (
    <section style={{ padding: "120px 64px", background: INK, position: "relative" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <Ornament width={80} />
        <p style={{
          fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400,
          fontSize: 36, color: TEXT, lineHeight: 1.4, margin: "40px 0", textWrap: "balance",
        }}>
          &ldquo;Power without tenderness is just noise. I write the moment a ruthless man finally goes quiet &mdash; and means it.&rdquo;
        </p>
        <Eyebrow align="center">&mdash; Reese Astor</Eyebrow>
      </div>
    </section>
  );
}

// ─── Book card — flat, editorial, no glow ──────────────────
function BookCard({ index, kicker, title, blurb, cover }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      display: "flex", flexDirection: "column", gap: 0, cursor: "pointer",
      transition: "all 320ms cubic-bezier(0.65,0.05,0.36,1)",
    }}>
      <div style={{ position: "relative", overflow: "hidden", marginBottom: 28, aspectRatio: "2/3", background: "#000" }}>
        <img src={cover} alt={title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hover ? "scale(1.04)" : "scale(1)",
          transition: "transform 700ms cubic-bezier(0.65,0.05,0.36,1)",
        }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: 18, color: GOLD, lineHeight: 1 }}>{index}</span>
        <span style={{ flex: 1, height: 1, background: RULE_SOFT }} />
        <Eyebrow>{kicker}</Eyebrow>
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400,
        color: TEXT, lineHeight: 1.2, letterSpacing: "-0.01em",
        margin: "0 0 12px", textWrap: "balance",
      }}>{title}</h3>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400,
        fontSize: 17, color: TEXT_SOFT, lineHeight: 1.5, margin: "0 0 18px", textWrap: "pretty",
      }}>{blurb}</p>
      <span style={{
        fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
        color: hover ? GOLD : TEXT_SOFT, letterSpacing: "0.32em", textTransform: "uppercase",
        transition: "color 240ms",
      }}>Read more →</span>
    </div>
  );
}

// ─── Praise quote — refined ────────────────────────────────
function PraiseQuote({ quote, attribution }) {
  return (
    <div style={{
      padding: "12px 36px", borderLeft: "1px solid " + GOLD_SOFT,
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400,
        fontSize: 22, color: TEXT, lineHeight: 1.55, margin: "0 0 24px", textWrap: "pretty",
      }}>&ldquo;{quote}&rdquo;</p>
      <Eyebrow>{attribution}</Eyebrow>
    </div>
  );
}

// ─── Author intro — bio band ───────────────────────────────
function AuthorIntro() {
  return (
    <section style={{ padding: "140px 64px", background: INK }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow align="center">The Author</Eyebrow>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 400,
          fontSize: 48, color: TEXT, lineHeight: 1.15,
          letterSpacing: "-0.02em", margin: "22px 0 0", textWrap: "balance",
        }}>
          A novelist of <em style={{ fontWeight: 400 }}>power, secrecy</em>,<br/>and the men who break their own rules.
        </h2>
        <div style={{ margin: "32px auto", height: 1, width: 56, background: GOLD_SOFT }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 21, color: TEXT_SOFT, lineHeight: 1.7, margin: 0, textWrap: "pretty" }}>
          Reese Astor writes contemporary romance set among Manhattan&rsquo;s most dangerous heirs &mdash; the kind of men who own skylines, board rooms, and the women who finally bring them to their knees. Her novels are slow, deliberate, and built on a single quiet promise: <em>everything you love, taken seriously.</em>
        </p>
      </div>
    </section>
  );
}

// ─── Newsletter band — single column, restrained ───────────
function NewsletterBand({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const submit = (e) => { e?.preventDefault?.(); if (email) { setSubscribed(true); onSubscribe?.(email); } };
  return (
    <section style={{ padding: "160px 64px", background: SURFACE, borderTop: "1px solid " + RULE_SOFT, borderBottom: "1px solid " + RULE_SOFT }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow align="center">The Inner Circle</Eyebrow>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 54,
          color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em",
          margin: "22px 0 0", textWrap: "balance",
        }}>News and new releases,<br/><em style={{ fontWeight: 400 }}>straight from Reese.</em></h2>
        <div style={{ margin: "32px auto", height: 1, width: 56, background: GOLD_SOFT }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 21, color: TEXT_SOFT, margin: "0 0 44px", lineHeight: 1.55, textWrap: "pretty" }}>
          News, new releases, and a free prequel novella, straight from Reese.
        </p>
        {subscribed ? (
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 22, color: GOLD }}>
            Welcome. Your free prequel novella is on its way.
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 540, margin: "0 auto", borderBottom: "1px solid " + GOLD_SOFT }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your email address" required
              style={{
                flex: 1, background: "transparent", border: "none",
                color: TEXT, padding: "14px 4px", fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19, outline: "none",
              }}
            />
            <button type="submit" style={{
              background: "transparent", border: "none", color: GOLD,
              padding: "14px 4px", fontFamily: "Inter, sans-serif", fontWeight: 600,
              fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer",
            }}>Subscribe →</button>
          </form>
        )}
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: MUTED, marginTop: 18, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          A couple of emails a month · Unsubscribe anytime
        </p>
        <a href="https://swiy.co/bf0" target="_blank" rel="noopener" style={{ display: "inline-block", marginTop: 26, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, color: GOLD, textDecoration: "none", borderBottom: "1px solid " + GOLD_SOFT, paddingBottom: 2 }}>
          Or join the newsletter and get the free prequel novella →
        </a>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer style={{ padding: "96px 64px 56px", background: INK, color: MUTED }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 64 }}>
        <div>
          <img src="../../assets/reese-astor-wordmark-gold.png" alt="Reese Astor" style={{ height: 64, display: "block", marginBottom: 22 }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, lineHeight: 1.55, color: TEXT_SOFT, margin: 0, maxWidth: 320 }}>
            Manhattan billionaire romance. Power, passion, and the promise of being wholly seen.
          </p>
        </div>
        {[
          { h: "Catalogue", items: ["Manhattan Money Kings", "Hudson Dynasty", "Standalones"] },
          { h: "The Author", items: ["About Reese", "Journal", "Press"] },
          { h: "Contact", items: ["Newsletter", "ARC Reviewers", "General Inquiries"] },
        ].map(col => (
          <div key={col.h}>
            <Eyebrow>{col.h}</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: 14 }}>
              {col.items.map(i => (
                <li key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: TEXT_SOFT, cursor: "pointer" }}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1240, margin: "72px auto 0", paddingTop: 32, borderTop: "1px solid " + RULE_SOFT, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase" }}>© 2026 Reese Astor · Published by 88Away LLC</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase" }}>Privacy · Terms</div>
      </div>
    </footer>
  );
}

// ─── Chapter One excerpt block ─────────────────────────
function ChapterOne() {
  return (
    <section style={{ padding: "160px 64px", background: INK }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <Eyebrow align="center">From the novel</Eyebrow>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 44, color: TEXT, lineHeight: 1.1, margin: "22px 0 0", letterSpacing: "-0.02em" }}>
            Chapter <em style={{ fontWeight: 400 }}>One</em>
          </h2>
          <div style={{ marginTop: 28 }}><Ornament width={80} /></div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, color: TEXT_SOFT, marginTop: 18 }}>Nia · Pre-tender Day 24</div>
        </div>
        <div style={{ marginTop: 56, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: TEXT, lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>
            <span style={{ float: "left", fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 72, lineHeight: 0.85, marginRight: 12, marginTop: 6, color: GOLD }}>T</span>
            he federal response file reached Nia Carter at 5:14 a.m., and the first thing she understood was that Hudson Vale had already lost control of its own building.
          </p>
          <p style={{ marginTop: 22, textIndent: "1.5em", color: TEXT_SOFT }}>Not publicly. Not yet. Publicly, it was a leak: a board packet, a market rumor, a governance embarrassment dressed up as a breach. But the watermark on the stolen file told a colder story.</p>
          <p style={{ marginTop: 8, textIndent: "1.5em", fontStyle: "italic", color: TEXT_SOFT }}>Hudson Vale Holdings. Internal. Restricted.</p>
          <p style={{ marginTop: 22, textIndent: "1.5em", color: TEXT_SOFT }}>The pages had the faint softness of a copy of a copy. Half the packet had already been chewed through by financial Twitter for sixteen hours. She had washed her hair. She had not slept.</p>
        </div>
        <div style={{ marginTop: 56, textAlign: "center" }}><Ornament width={48} /></div>
        <div style={{ marginTop: 24, textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: TEXT_SOFT }}>The rest is waiting for you.</div>
      </div>
    </section>
  );
}

Object.assign(window, { RAButton, Eyebrow, Ornament, TopNav, BookHero, SectionHeading, BookCard, PraiseQuote, AuthorIntro, Manifesto, ChapterOne, NewsletterBand, SiteFooter });
