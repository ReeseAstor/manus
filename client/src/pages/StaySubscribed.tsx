import { useEffect } from "react";
import { Link } from "wouter";

/**
 * Email-exclusive landing page — the "stay on the list" confirmation
 * destination from the win-back sequence's re-engagement ask.
 */
export default function StaySubscribed() {
  useEffect(() => {
    document.title = "You're Staying — Thank You | Reese Astor";
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27", color: "#e5e5e5" }}>
      <div style={{
        height: 4,
        background: "linear-gradient(90deg, #d4af37 0%, #f5d76e 50%, #d4af37 100%)",
      }} />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", color: "#d4af37", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial, sans-serif" }}>
          Romance Author
        </p>
        <h1 style={{ margin: "0 0 8px", color: "#d4af37", fontSize: 32, fontWeight: "bold", letterSpacing: 2, fontFamily: "Georgia, serif" }}>
          REESE ASTOR
        </h1>
        <div style={{ width: 56, height: 1, margin: "24px auto", background: "rgba(212, 175, 55, 0.4)" }} />

        <h2 style={{ margin: "0 0 12px", color: "#f5d76e", fontSize: 28, fontFamily: "Georgia, serif" }}>
          You're staying. Thank you.
        </h2>
        <p style={{ margin: "0 0 8px", color: "#c8c8c8", fontSize: 16, lineHeight: 1.8 }}>
          Noted — I'll keep the emails coming: new releases first, exclusive scenes, and the
          occasional peek behind the Manhattan skyline.
        </p>
        <p style={{ margin: "0 0 32px", color: "rgba(200,200,200,0.6)", fontSize: 14, lineHeight: 1.7 }}>
          No action needed on your part. If you ever change your mind, there's an unsubscribe link
          in every email.
        </p>

        <Link href="/books">
          <span style={{
            display: "inline-block",
            padding: "14px 40px",
            backgroundColor: "#d4af37",
            borderRadius: 8,
            color: "#0a0e27",
            fontSize: 15,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            textDecoration: "none",
            cursor: "pointer",
          }}>
            Browse the Books
          </span>
        </Link>
      </div>
    </div>
  );
}