import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";

const contentTypes = [
  { id: "bonus_chapter", label: "Bonus Chapter" },
  { id: "interview", label: "Interview" },
  { id: "behind_scenes", label: "Behind the Scenes" },
] as const;

type ContentType = typeof contentTypes[number]["id"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "#0a0e27",
  border: "1px solid rgba(212, 175, 55, 0.2)",
  borderRadius: 8,
  color: "#e5e5e5",
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(200,200,200,0.7)",
  fontSize: 12,
  fontFamily: "Arial, sans-serif",
  textTransform: "uppercase",
  letterSpacing: 1,
};

const emptyForm = {
  title: "",
  slug: "",
  type: "bonus_chapter" as ContentType,
  category: "",
  description: "",
  content: "",
  coverImage: "",
  featured: false,
  displayOrder: 0,
};

export default function ExclusiveContentManager() {
  const { data: items, isLoading, refetch } = trpc.readerClub.getAllContent.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10));

  const createMutation = trpc.readerClub.createContent.useMutation({
    onSuccess: () => {
      toast.success("Content created");
      setForm(emptyForm);
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.readerClub.updateContent.useMutation({
    onSuccess: () => {
      toast.success("Content updated");
      setEditingId(null);
      setForm(emptyForm);
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.readerClub.deleteContent.useMutation({
    onSuccess: () => {
      toast.success("Content deleted");
      if (editingId === null) refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const payload = {
      ...form,
      publishDate: new Date(publishDate + "T12:00:00"),
      displayOrder: Number(form.displayOrder) || 0,
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      slug: item.slug ?? "",
      type: item.type ?? "bonus_chapter",
      category: item.category ?? "",
      description: item.description ?? "",
      content: item.content ?? "",
      coverImage: item.coverImage ?? "",
      featured: item.featured ?? false,
      displayOrder: item.displayOrder ?? 0,
    });
    setPublishDate(item.publishDate ? item.publishDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate({ id });
    }
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
              Exclusive Content Manager
            </h1>
            <p style={{ margin: 0, color: "rgba(200,200,200,0.6)", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
              Manage Reader's Club bonus chapters, interviews, and behind-the-scenes content
            </p>
          </div>
          <button
            onClick={() => { setEditingId(null); setForm(emptyForm); setPublishDate(new Date().toISOString().slice(0, 10)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
            + New Content
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Editor */}
        <div style={{
          backgroundColor: "rgba(26, 31, 58, 0.6)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: 12,
          padding: 24,
        }}>
          <h2 style={{ margin: "0 0 20px", color: "#d4af37", fontSize: 18, fontFamily: "Georgia, serif" }}>
            {editingId !== null ? "Edit Content" : "Create Content"}
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. The Deleted Scene: Michael's POV" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Slug</label>
              <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
            </div>
            <div>
              <label style={labelStyle}>Type *</label>
              <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}>
                {contentTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Hudson Dynasty" />
            </div>
            <div>
              <label style={labelStyle}>Publish Date</label>
              <input type="date" style={inputStyle} value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 70 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short teaser shown on the Reader's Club grid" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Content (Markdown) *</label>
            <textarea style={{ ...inputStyle, minHeight: 220 }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full bonus chapter / interview / behind-the-scenes content..." />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Cover Image URL</label>
            <input style={inputStyle} value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
            <label style={{ ...labelStyle, margin: 0, display: "flex", alignItems: "center", gap: 8, textTransform: "none", letterSpacing: 0 }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ width: 16, height: 16 }}
              />
              Featured on Reader's Club
            </label>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Display Order</label>
              <input type="number" style={inputStyle} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor: "#d4af37",
                border: "none",
                borderRadius: 8,
                color: "#0a0e27",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
              }}
            >
              {editingId !== null ? "Save Changes" : "Create Content"}
            </button>
            {editingId !== null && (
              <button
                onClick={() => { setEditingId(null); setForm(emptyForm); }}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  borderRadius: 8,
                  color: "#d4af37",
                  fontFamily: "Arial, sans-serif",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div>
          <h2 style={{ margin: "0 0 16px", color: "#d4af37", fontSize: 18, fontFamily: "Georgia, serif" }}>
            Existing Content ({items?.length ?? 0})
          </h2>
          {isLoading && <p style={{ color: "rgba(200,200,200,0.6)" }}>Loading...</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items && items.length === 0 && (
              <p style={{ color: "rgba(200,200,200,0.45)", fontSize: 14 }}>No exclusive content yet. Create your first piece on the left.</p>
            )}
            {(items ?? []).map((item: any) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "rgba(26, 31, 58, 0.6)",
                  border: "1px solid rgba(212, 175, 55, 0.15)",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10,
                        fontFamily: "Arial, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        padding: "3px 8px",
                        borderRadius: 6,
                        backgroundColor: "rgba(212, 175, 55, 0.12)",
                        color: "#d4af37",
                      }}>
                        {contentTypes.find((t) => t.id === item.type)?.label ?? item.type}
                      </span>
                      {item.featured && (
                        <span style={{ fontSize: 10, fontFamily: "Arial, sans-serif", padding: "3px 8px", borderRadius: 6, backgroundColor: "rgba(46, 204, 113, 0.12)", color: "#2ecc71" }}>
                          FEATURED
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#f5d76e", fontSize: 16, fontWeight: "bold", fontFamily: "Georgia, serif" }}>
                      {item.title}
                    </p>
                    <p style={{ margin: "4px 0 0", color: "rgba(200,200,200,0.5)", fontSize: 12, fontFamily: "Arial, sans-serif" }}>
                      /reader-club/{item.slug} &bull; {item.category || "Uncategorized"} &bull; {item.publishDate?.slice(0, 10)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: 6,
                        color: "#d4af37",
                        fontSize: 12,
                        fontFamily: "Arial, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(231, 76, 60, 0.4)",
                        borderRadius: 6,
                        color: "#e74c3c",
                        fontSize: 12,
                        fontFamily: "Arial, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}