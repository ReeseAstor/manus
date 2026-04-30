import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Link2, Loader2, RefreshCw, ChevronLeft, ExternalLink,
  Plus, Search, Copy, Check, Pencil, Globe, Tag, StickyNote
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface EditingLink {
  uniq: number;
  slug: string;
  url: string;
  title: string;
  description: string;
  note: string;
  tags: string[];
}

export default function AdminSwitchy() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState<EditingLink | null>(null);
  const [newLink, setNewLink] = useState({
    url: "",
    slug: "",
    title: "",
    description: "",
    tags: "",
    note: "",
  });

  const { data: links, isLoading, refetch } = trpc.switchy.list.useQuery({ limit: 100, offset: 0 });

  const { data: searchResults, isLoading: isSearching } = trpc.switchy.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const createMutation = trpc.switchy.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Short link created: ${data.shortUrl}`);
      setShowCreateForm(false);
      setNewLink({ url: "", slug: "", title: "", description: "", tags: "", note: "" });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create link");
    },
  });

  const updateMutation = trpc.switchy.update.useMutation({
    onSuccess: () => {
      toast.success("Link updated successfully");
      setEditingLink(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update link");
    },
  });

  const shortenMutation = trpc.switchy.shorten.useMutation({
    onSuccess: (data) => {
      toast.success(`URL shortened: ${data.shortUrl}`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to shorten URL");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const copyToClipboard = (slug: string, domain: string) => {
    const shortUrl = `https://${domain}/${slug}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedSlug(slug);
    toast.success("Short URL copied to clipboard");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const displayLinks = searchQuery.length >= 2 ? searchResults : links;

  const stats = {
    total: links?.length || 0,
    swiy: links?.filter((l) => l.domain === "swiy.co").length || 0,
    tagged: links?.filter((l) => l.tags && l.tags.length > 0).length || 0,
  };

  const handleCreate = () => {
    createMutation.mutate({
      url: newLink.url,
      slug: newLink.slug || undefined,
      title: newLink.title || undefined,
      description: newLink.description || undefined,
      tags: newLink.tags ? newLink.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      note: newLink.note || undefined,
    });
  };

  const handleUpdate = () => {
    if (!editingLink) return;
    updateMutation.mutate({
      uniqId: editingLink.uniq,
      url: editingLink.url || undefined,
      title: editingLink.title || undefined,
      description: editingLink.description || undefined,
      note: editingLink.note || undefined,
      tags: editingLink.tags,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  Link Shortener
                </h1>
                <p className="text-gray-400 text-lg">
                  Create and manage swiy.co short links via Switchy
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingLink(null);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-6 rounded-full"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Short Link
                </Button>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-6 rounded-full"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Links</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <p className="text-2xl font-bold text-blue-400">{stats.swiy}</p>
                <p className="text-sm text-gray-400">swiy.co Links</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20">
                <p className="text-2xl font-bold text-[#d4af37]">{stats.tagged}</p>
                <p className="text-sm text-gray-400">Tagged</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Create / Edit Form */}
      {(showCreateForm || editingLink) && (
        <section className="py-4">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingLink ? `Edit Link: ${editingLink.slug}` : "Create New Short Link"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Destination URL *</label>
                    <Input
                      placeholder="https://example.com/your-long-url"
                      value={editingLink ? editingLink.url : newLink.url}
                      onChange={(e) =>
                        editingLink
                          ? setEditingLink({ ...editingLink, url: e.target.value })
                          : setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  {!editingLink && (
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Custom Slug (optional)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm whitespace-nowrap">swiy.co/</span>
                        <Input
                          placeholder="my-link"
                          value={newLink.slug}
                          onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Title (OG Title)</label>
                    <Input
                      placeholder="Link title for social sharing"
                      value={editingLink ? editingLink.title : newLink.title}
                      onChange={(e) =>
                        editingLink
                          ? setEditingLink({ ...editingLink, title: e.target.value })
                          : setNewLink({ ...newLink, title: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Description (OG Description)</label>
                    <Input
                      placeholder="Link description for social sharing"
                      value={editingLink ? editingLink.description : newLink.description}
                      onChange={(e) =>
                        editingLink
                          ? setEditingLink({ ...editingLink, description: e.target.value })
                          : setNewLink({ ...newLink, description: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Tags (comma-separated)</label>
                    <Input
                      placeholder="book, amazon, series"
                      value={
                        editingLink
                          ? editingLink.tags.join(", ")
                          : newLink.tags
                      }
                      onChange={(e) =>
                        editingLink
                          ? setEditingLink({
                              ...editingLink,
                              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            })
                          : setNewLink({ ...newLink, tags: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Note (internal)</label>
                    <Input
                      placeholder="Internal note about this link"
                      value={editingLink ? editingLink.note : newLink.note}
                      onChange={(e) =>
                        editingLink
                          ? setEditingLink({ ...editingLink, note: e.target.value })
                          : setNewLink({ ...newLink, note: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {editingLink ? (
                    <Button
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                      className="bg-[#d4af37] hover:bg-[#c9a961] text-black"
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreate}
                      disabled={!newLink.url || createMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Link2 className="h-4 w-4 mr-2" />
                      )}
                      Create Short Link
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingLink(null);
                    }}
                    variant="ghost"
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Quick Shorten Bar */}
      {!showCreateForm && !editingLink && (
        <section className="py-4">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-600/[0.02] border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400 whitespace-nowrap">Quick Shorten:</span>
                  <Input
                    placeholder="Paste a URL to shorten instantly..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const url = (e.target as HTMLInputElement).value.trim();
                        if (url) {
                          shortenMutation.mutate({ url });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                    className="bg-white/5 border-white/10 text-white flex-1"
                  />
                  {shortenMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  )}
                </div>
                {shortenMutation.data && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-400">Result:</span>
                    <code className="text-blue-400 text-sm bg-blue-500/10 px-2 py-1 rounded">
                      {shortenMutation.data.shortUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white h-7 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(shortenMutation.data!.shortUrl);
                        toast.success("Copied!");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Links List */}
      <section className="py-4 pb-16">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search links by URL, title, or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Links */}
            {isLoading || isSearching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
              </div>
            ) : displayLinks && displayLinks.length > 0 ? (
              <div className="space-y-3">
                {displayLinks.map((link) => (
                  <Card
                    key={link.uniq}
                    className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Globe className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Short URL */}
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-0.5 rounded">
                              {link.domain}/{link.id}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white h-6 px-1.5"
                              onClick={() => copyToClipboard(link.id, link.domain)}
                            >
                              {copiedSlug === link.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <a
                              href={`https://${link.domain}/${link.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>

                          {/* Title */}
                          {link.title && (
                            <p className="text-white font-medium text-sm truncate mb-0.5">
                              {link.title}
                            </p>
                          )}

                          {/* Destination URL */}
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {link.domain}
                            </Badge>
                            {link.tags &&
                              link.tags.length > 0 &&
                              link.tags.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30 text-xs"
                                >
                                  <Tag className="h-2.5 w-2.5 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            {link.note && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <StickyNote className="h-3 w-3" />
                                {link.note}
                              </span>
                            )}
                            <span className="text-xs text-gray-600">
                              Created {format(new Date(link.createdDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingLink({
                              uniq: link.uniq,
                              slug: link.id,
                              url: link.url,
                              title: link.title || "",
                              description: link.description || "",
                              note: link.note || "",
                              tags: link.tags || [],
                            });
                            setShowCreateForm(false);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                <Link2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white font-medium">No links found</p>
                <p className="text-gray-400 text-sm">
                  Create your first short link to get started.
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
