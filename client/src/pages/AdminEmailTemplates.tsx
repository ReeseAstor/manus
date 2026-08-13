import { useState, useRef, useCallback } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";

type SequenceType = "post-purchase" | "win-back" | "launch" | "series-upsell";

const sequenceInfo: Record<SequenceType, { title: string; description: string; icon: string }> = {
  "post-purchase": {
    title: "Post-Purchase Nurture",
    description: "3 emails triggered after Stripe purchase — deepens loyalty, reduces remorse, and plants seeds for future purchases.",
    icon: "🛍️",
  },
  "win-back": {
    title: "Re-Engagement Win-Back",
    description: "3 emails triggered at 60 days inactive — re-engages or gracefully removes inactive subscribers.",
    icon: "💌",
  },
  "launch": {
    title: "New Release Launch",
    description: "3 emails triggered on release day — announces the new Hudson Dynasty book, shows early reader social proof, and closes the release week with a next-book tease.",
    icon: "🚀",
  },
  "series-upsell": {
    title: "Series Completion / Upsell",
    description: "3 emails triggered when a reader finishes a book — converts the binge momentum to the next title, then to the complete collection + Reader's Club.",
    icon: "📚",
  },
};

export default function AdminEmailTemplates() {
  const [activeSequence, setActiveSequence] = useState<SequenceType>("post-purchase");
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [previewName, setPreviewName] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: sequenceList } = trpc.getEmailSequenceList.useQuery({ sequence: activeSequence });
  const { data: preview } = trpc.getEmailTemplatePreview.useQuery({
    sequence: activeSequence,
    emailIndex: activeEmailIndex,
    buyerName: previewName || undefined,
  });

  const handleCopyHtml = useCallback(async () => {
    if (!preview?.html) return;
    try {
      await navigator.clipboard.writeText(preview.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = preview.html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [preview?.html]);

  const handleSequenceChange = (seq: SequenceType) => {
    setActiveSequence(seq);
    setActiveEmailIndex(0);
    setCopied(false);
  };

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
              Email Templates
            </h1>
            <p style={{ margin: 0, color: "rgba(200,200,200,0.6)", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
              Preview and copy HTML templates for MailerLite automations
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="/mailerlite-setup-guide.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: 8,
                color: "#d4af37",
                textDecoration: "none",
                fontSize: 14,
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
              }}
            >
              Setup Guide
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
        {/* Sequence Tabs */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {(Object.keys(sequenceInfo) as SequenceType[]).map((seq) => (
            <button
              key={seq}
              onClick={() => handleSequenceChange(seq)}
              style={{
                flex: 1,
                padding: "20px 24px",
                backgroundColor: activeSequence === seq ? "rgba(212, 175, 55, 0.1)" : "rgba(26, 31, 58, 0.6)",
                border: `1px solid ${activeSequence === seq ? "rgba(212, 175, 55, 0.4)" : "rgba(212, 175, 55, 0.1)"}`,
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{sequenceInfo[seq].icon}</span>
                <span style={{
                  color: activeSequence === seq ? "#d4af37" : "#e5e5e5",
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "Georgia, serif",
                }}>
                  {sequenceInfo[seq].title}
                </span>
              </div>
              <p style={{
                margin: 0,
                color: "rgba(200,200,200,0.5)",
                fontSize: 13,
                lineHeight: 1.5,
                fontFamily: "Arial, sans-serif",
              }}>
                {sequenceInfo[seq].description}
              </p>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Left Sidebar — Email List */}
          <div style={{ width: 320, flexShrink: 0 }}>
            {/* Personalization Input */}
            <div style={{
              marginBottom: 16,
              padding: "16px",
              backgroundColor: "rgba(26, 31, 58, 0.6)",
              border: "1px solid rgba(212, 175, 55, 0.1)",
              borderRadius: 10,
            }}>
              <label style={{
                display: "block",
                marginBottom: 8,
                color: "rgba(200,200,200,0.6)",
                fontSize: 12,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                Preview with name
              </label>
              <input
                type="text"
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
                placeholder="e.g., Sarah"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  backgroundColor: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: 6,
                  color: "#e5e5e5",
                  fontSize: 14,
                  fontFamily: "Arial, sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Email Cards */}
            {sequenceList?.map((email, index) => (
              <button
                key={email.id}
                onClick={() => { setActiveEmailIndex(index); setCopied(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "18px 16px",
                  marginBottom: 10,
                  backgroundColor: activeEmailIndex === index ? "rgba(212, 175, 55, 0.1)" : "rgba(26, 31, 58, 0.4)",
                  border: `1px solid ${activeEmailIndex === index ? "rgba(212, 175, 55, 0.35)" : "rgba(212, 175, 55, 0.08)"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: activeEmailIndex === index ? "#d4af37" : "rgba(212, 175, 55, 0.15)",
                    color: activeEmailIndex === index ? "#0a0e27" : "#d4af37",
                    fontSize: 13,
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <span style={{
                    color: activeEmailIndex === index ? "#d4af37" : "#e5e5e5",
                    fontSize: 14,
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    lineHeight: 1.3,
                  }}>
                    {email.name}
                  </span>
                </div>
                <p style={{
                  margin: "0 0 6px 36px",
                  color: "rgba(200,200,200,0.5)",
                  fontSize: 12,
                  fontFamily: "Arial, sans-serif",
                }}>
                  <strong style={{ color: "rgba(200,200,200,0.7)" }}>Subject:</strong> {email.subject}
                </p>
                <div style={{ marginLeft: 36, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    backgroundColor: "rgba(212, 175, 55, 0.08)",
                    border: "1px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: 4,
                    color: "#d4af37",
                    fontSize: 11,
                    fontFamily: "Arial, sans-serif",
                  }}>
                    {email.delay}
                  </span>
                </div>
              </button>
            ))}

            {/* Workflow Summary */}
            <div style={{
              marginTop: 16,
              padding: "16px",
              backgroundColor: "rgba(26, 31, 58, 0.4)",
              border: "1px solid rgba(212, 175, 55, 0.08)",
              borderRadius: 10,
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#d4af37",
                fontSize: 12,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                Workflow Summary
              </p>
              {sequenceList?.map((email, index) => (
                <div key={email.id} style={{ marginBottom: index < (sequenceList.length - 1) ? 8 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#d4af37",
                      flexShrink: 0,
                    }} />
                    <span style={{ color: "#c8c8c8", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                      Email {index + 1}: {email.name}
                    </span>
                  </div>
                  {index < (sequenceList.length - 1) && (
                    <div style={{
                      marginLeft: 3,
                      borderLeft: "2px dashed rgba(212, 175, 55, 0.2)",
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 14,
                    }}>
                      <span style={{ color: "rgba(200,200,200,0.4)", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
                        ↓ delay
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Email Preview */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Preview Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              padding: "14px 20px",
              backgroundColor: "rgba(26, 31, 58, 0.6)",
              border: "1px solid rgba(212, 175, 55, 0.1)",
              borderRadius: 10,
            }}>
              <div>
                {preview?.meta && (
                  <>
                    <p style={{
                      margin: "0 0 2px",
                      color: "#d4af37",
                      fontSize: 15,
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}>
                      {preview.meta.name}
                    </p>
                    <p style={{
                      margin: 0,
                      color: "rgba(200,200,200,0.5)",
                      fontSize: 12,
                      fontFamily: "Arial, sans-serif",
                    }}>
                      {preview.meta.purpose}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={handleCopyHtml}
                style={{
                  padding: "10px 24px",
                  backgroundColor: copied ? "#28a745" : "#d4af37",
                  border: "none",
                  borderRadius: 8,
                  color: copied ? "#fff" : "#0a0e27",
                  fontSize: 14,
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? "✓ Copied!" : "Copy HTML"}
              </button>
            </div>

            {/* Subject Line Preview */}
            {preview?.meta && (
              <div style={{
                marginBottom: 16,
                padding: "12px 20px",
                backgroundColor: "rgba(26, 31, 58, 0.4)",
                border: "1px solid rgba(212, 175, 55, 0.08)",
                borderRadius: 8,
              }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <span style={{ color: "rgba(200,200,200,0.4)", fontSize: 11, fontFamily: "Arial, sans-serif" }}>Subject: </span>
                    <span style={{ color: "#e5e5e5", fontSize: 14, fontFamily: "Arial, sans-serif" }}>{preview.meta.subject}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Preview iframe */}
            <div style={{
              border: "1px solid rgba(212, 175, 55, 0.15)",
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#0a0e27",
            }}>
              {preview?.html ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={preview.html}
                  style={{
                    width: "100%",
                    height: 800,
                    border: "none",
                    display: "block",
                  }}
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div style={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(200,200,200,0.4)",
                  fontSize: 16,
                  fontFamily: "Arial, sans-serif",
                }}>
                  Loading preview...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
