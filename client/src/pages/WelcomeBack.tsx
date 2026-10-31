import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";

/**
 * Email-exclusive landing page — the "Claim Your Bonus Chapter" destination
 * from the win-back sequence. Newsletter-gated: subscribing unlocks the
 * bonus chapter teaser + Reader's Club link.
 */
export default function WelcomeBack() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => setError(e.message || "Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F7", color: "#4A3B3A" }}>
      <div style={{
        height: 4,
        background: "linear-gradient(90deg, #4A3B3A 0%, #4A3B3A 50%, #7A4F4C 100%)",
      }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", color: "#7A4F4C", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial, sans-serif" }}>
          Billionaire Romance
        </p>
        <h1 style={{ margin: "0 0 8px", color: "#7A4F4C", fontSize: 32, fontWeight: "bold", letterSpacing: 2, fontFamily: "Georgia, serif" }}>
          REESE ASTOR
        </h1>
        <div style={{ width: 56, height: 1, margin: "24px auto", background: "rgba(201, 163, 160, 0.4)" }} />

        {!submitted ? (
          <>
            <h2 style={{ margin: "0 0 12px", color: "#7A4F4C", fontSize: 28, fontFamily: "Georgia, serif" }}>
              Welcome back. Your bonus chapter is waiting.
            </h2>
            <p style={{ margin: "0 0 8px", color: "#6E5F5A", fontSize: 16, lineHeight: 1.8 }}>
              I wrote a brand-new bonus chapter that takes place after the events of the
              Manhattan Money Kings trilogy. It's never been published anywhere — and it's yours,
              just for coming back.
            </p>
            <p style={{ margin: "0 0 32px", color: "#6E5F5A", fontSize: 14, lineHeight: 1.7 }}>
              Confirm your email below and I'll take you straight to it.
            </p>

            <form onSubmit={handleSubmit} style={{ maxWidth: 440, margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  marginBottom: 12,
                  backgroundColor: "#F0E6E5",
                  border: "1px solid rgba(201, 163, 160, 0.25)",
                  borderRadius: 8,
                  color: "#4A3B3A",
                  fontSize: 15,
                  fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {error && (
                <p style={{ margin: "0 0 12px", color: "#7A4F4C", fontSize: 13, fontFamily: "Arial, sans-serif" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  backgroundColor: "#4A3B3A",
                  border: "none",
                  borderRadius: 8,
                  color: "#4A3B3A",
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  cursor: "pointer",
                }}
              >
                {subscribeMutation.isPending ? "Confirming…" : "Confirm & Unlock My Bonus Chapter"}
              </button>
              <p style={{ margin: "12px 0 0", color: "#6E5F5A", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 12px", color: "#7A4F4C", fontSize: 28, fontFamily: "Georgia, serif" }}>
              You're in. Here's your gift.
            </h2>
            <p style={{ margin: "0 0 24px", color: "#6E5F5A", fontSize: 16, lineHeight: 1.8 }}>
              The bonus chapter (plus every other exclusive scene, deleted chapter, and
              behind-the-scenes look) lives in the Reader's Club — your private corner of the penthouse.
            </p>
            <Link href="/newsletter">
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
                Join the Newsletter
              </span>
            </Link>
            <p style={{ margin: "24px 0 0", color: "#6E5F5A", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
              Or get the prequel, free when you join my newsletter:{" "}
              <a href="https://dl.bookfunnel.com/kw1yge3479" style={{ color: "#7A4F4C" }}>The First Acquisition</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}