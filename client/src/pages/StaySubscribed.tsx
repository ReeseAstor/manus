import { Link } from "wouter";

/**
 * Email-exclusive landing page — the "stay on the list" confirmation
 * destination from the win-back sequence's re-engagement ask.
 */
export default function StaySubscribed() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F7", color: "#4A3B3A" }}>
      <div style={{
        height: 4,
        background: "linear-gradient(90deg, #4A3B3A 0%, #4A3B3A 50%, #7A4F4C 100%)",
      }} />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", color: "#7A4F4C", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial, sans-serif" }}>
          Billionaire Romance
        </p>
        <h1 style={{ margin: "0 0 8px", color: "#7A4F4C", fontSize: 32, fontWeight: "bold", letterSpacing: 2, fontFamily: "Georgia, serif" }}>
          REESE ASTOR
        </h1>
        <div style={{ width: 56, height: 1, margin: "24px auto", background: "rgba(201, 163, 160, 0.4)" }} />

        <h2 style={{ margin: "0 0 12px", color: "#7A4F4C", fontSize: 28, fontFamily: "Georgia, serif" }}>
          You're staying. Thank you.
        </h2>
        <p style={{ margin: "0 0 8px", color: "#6E5F5A", fontSize: 16, lineHeight: 1.8 }}>
          Noted — I'll keep the emails coming: new releases first, bonus scenes, and the
          occasional peek behind the Manhattan skyline.
        </p>
        <p style={{ margin: "0 0 32px", color: "#6E5F5A", fontSize: 14, lineHeight: 1.7 }}>
          No action needed on your part. If you ever change your mind, there's an unsubscribe link
          in every email.
        </p>

        <Link href="/books">
          <span style={{
            display: "inline-block",
            padding: "14px 40px",
            backgroundColor: "#4A3B3A",
            borderRadius: 8,
            color: "#4A3B3A",
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