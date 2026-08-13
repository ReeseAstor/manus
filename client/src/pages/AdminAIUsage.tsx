import { trpc } from "../lib/trpc";
import { Link } from "wouter";

const featureLabels: Record<string, string> = {
  chat: "Reader Chatbot",
  workflow: "AI Workflow Tool",
  image: "Image Generation",
  video: "Video Generation",
  "prompt-enhance": "Prompt Enhancement",
  other: "Other",
};

const statusColors: Record<string, string> = {
  ok: "#2ecc71",
  "rate-limited": "#e74c3c",
  error: "#e67e22",
};

function formatUsd(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

export default function AdminAIUsage() {
  const { data: stats, isLoading, refetch } = trpc.aiUsage.getStats.useQuery();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27", color: "#e5e5e5" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        padding: "24px 32px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Link href="/admin">
              <a style={{ color: "#d4af37", textDecoration: "none", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
                ← Back to Dashboard
              </a>
            </Link>
            <h1 style={{ margin: "8px 0 4px", color: "#d4af37", fontSize: 28, fontFamily: "Georgia, serif" }}>
              AI Usage &amp; Costs
            </h1>
            <p style={{ margin: 0, color: "rgba(200,200,200,0.6)", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
              Rate limiting, Gemini cost tracking, and recent AI interactions
            </p>
          </div>
          <button
            onClick={() => refetch()}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: 8,
              color: "#d4af37",
              fontSize: 14,
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
        {isLoading && (
          <p style={{ color: "rgba(200,200,200,0.6)" }}>Loading usage stats...</p>
        )}

        {stats && (
          <>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Requests Today", value: String(stats.today.requests), sub: `7-day: ${stats.last7Days.requests}` },
                { label: "Estimated Cost Today", value: formatUsd(stats.today.costUsd), sub: `7-day: ${formatUsd(stats.last7Days.costUsd)}` },
                { label: "Rate-Limited Today", value: String(stats.today.rateLimited), sub: "blocked requests" },
                { label: "Errors Today", value: String(stats.today.errors), sub: "failed calls" },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: "rgba(26, 31, 58, 0.6)",
                    border: "1px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: 12,
                    padding: "20px 24px",
                  }}
                >
                  <p style={{ margin: "0 0 6px", color: "rgba(200,200,200,0.6)", fontSize: 12, fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
                    {card.label}
                  </p>
                  <p style={{ margin: "0 0 4px", color: "#d4af37", fontSize: 30, fontWeight: "bold", fontFamily: "Georgia, serif" }}>
                    {card.value}
                  </p>
                  <p style={{ margin: 0, color: "rgba(200,200,200,0.45)", fontSize: 13, fontFamily: "Arial, sans-serif" }}>
                    {card.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Per-model cost breakdown */}
            <h2 style={{ color: "#d4af37", fontSize: 20, fontFamily: "Georgia, serif", margin: "0 0 16px" }}>Cost by Model (Today)</h2>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(212, 175, 55, 0.15)", marginBottom: 28 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "rgba(26, 31, 58, 0.6)" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    {["Model", "Requests", "Estimated Cost"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(200,200,200,0.6)", fontSize: 12, fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.today.perModel).length === 0 && (
                    <tr><td colSpan={3} style={{ padding: "16px 20px", color: "rgba(200,200,200,0.45)", fontSize: 13 }}>No AI calls recorded yet today.</td></tr>
                  )}
                  {Object.entries(stats.today.perModel).map(([model, m]) => (
                    <tr key={model} style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.08)" }}>
                      <td style={{ padding: "12px 20px", fontFamily: "Arial, sans-serif", fontSize: 14 }}>{model}</td>
                      <td style={{ padding: "12px 20px", fontFamily: "Arial, sans-serif", fontSize: 14 }}>{m.requests}</td>
                      <td style={{ padding: "12px 20px", fontFamily: "Arial, sans-serif", fontSize: 14, color: "#d4af37" }}>{formatUsd(m.costUsd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent interactions */}
            <h2 style={{ color: "#d4af37", fontSize: 20, fontFamily: "Georgia, serif", margin: "0 0 16px" }}>Recent Interactions</h2>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(212, 175, 55, 0.15)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "rgba(26, 31, 58, 0.6)" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.2)" }}>
                    {["Time", "Feature", "Model", "In Tokens", "Out Tokens", "Cost", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(200,200,200,0.6)", fontSize: 12, fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: "16px 20px", color: "rgba(200,200,200,0.45)", fontSize: 13 }}>No interactions recorded yet (resets on redeploy).</td></tr>
                  )}
                  {stats.recent.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.08)" }}>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(200,200,200,0.7)" }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13 }}>
                        {featureLabels[entry.feature] ?? entry.feature}
                      </td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13 }}>{entry.model}</td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13 }}>{entry.inputTokens}</td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13 }}>{entry.outputTokens}</td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13, color: "#d4af37" }}>{formatUsd(entry.costUsd)}</td>
                      <td style={{ padding: "10px 20px", fontFamily: "Arial, sans-serif", fontSize: 13, color: statusColors[entry.status] ?? "#e5e5e5" }}>
                        {entry.status === "ok" ? "OK" : entry.status === "rate-limited" ? "Rate-limited" : "Error"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: 16, color: "rgba(200,200,200,0.4)", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
              Costs are estimated from token counts (approx 4 chars/token) and public Gemini pricing. Rate limits are enforced per client IP; in-memory stats reset on redeploy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}