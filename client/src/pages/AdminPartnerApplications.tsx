import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { EnhancedSEOHead } from "../components/ui/enhanced-seo-head";
import { motion, AnimatePresence } from "framer-motion";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminPartnerApplications() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});

  const { data: applications, refetch } = trpc.partnerApplications.list.useQuery({ status: statusFilter });
  const updateStatus = trpc.partnerApplications.updateStatus.useMutation({ onSuccess: () => refetch() });
  const deleteApp = trpc.partnerApplications.delete.useMutation({ onSuccess: () => refetch() });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const statusCounts = {
    all: applications?.length || 0,
    pending: applications?.filter((a) => a.status === "pending").length || 0,
    approved: applications?.filter((a) => a.status === "approved").length || 0,
    rejected: applications?.filter((a) => a.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <EnhancedSEOHead title="Partner Applications | Admin" description="Manage partner author applications" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">
              Partner <span className="text-[#d4af37]">Applications</span>
            </h1>
            <p className="text-gray-400">
              Review and manage author partnership requests for group promotions
            </p>
          </div>
          <Button
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#d4af37] text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-70">
                ({status === "all" ? applications?.length || 0 : statusCounts[status]})
              </span>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {!applications || applications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No applications found</p>
            <p className="text-sm mt-2">Partner applications will appear here when authors apply via the promo page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  {/* Summary Row */}
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#d4af37] font-bold text-lg">
                          {app.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white truncate">{app.authorName}</h3>
                        <p className="text-sm text-gray-400 truncate">{app.bookTitle}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-3">
                        <span className="text-xs text-gray-500">{app.genre}</span>
                        {app.subscriberCount && (
                          <span className="text-xs text-gray-500">{app.subscriberCount} subs</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${expandedId === app.id ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === app.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left: Author & Book Info */}
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                              <p className="text-white mt-1">{app.email}</p>
                            </div>
                            {app.website && (
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Website</label>
                                <p className="mt-1">
                                  <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline">
                                    {app.website}
                                  </a>
                                </p>
                              </div>
                            )}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Genre</label>
                              <p className="text-white mt-1">{app.genre}</p>
                            </div>
                            {app.tropes && (
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Tropes</label>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {app.tropes.split(",").map((trope, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                                      {trope.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {app.subscriberCount && (
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Newsletter Subscribers</label>
                                <p className="text-white mt-1">{app.subscriberCount}</p>
                              </div>
                            )}
                          </div>

                          {/* Right: Book Description & Links */}
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Book Description</label>
                              <p className="text-gray-300 mt-1 text-sm leading-relaxed">{app.bookDescription}</p>
                            </div>
                            {app.downloadLink && (
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Download Link</label>
                                <p className="mt-1">
                                  <a href={app.downloadLink} target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline text-sm">
                                    {app.downloadLink}
                                  </a>
                                </p>
                              </div>
                            )}
                            {app.coverImageUrl && (
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Cover Image</label>
                                <div className="mt-1 w-24 h-36 rounded-lg overflow-hidden border border-white/10">
                                  <img src={app.coverImageUrl} alt={app.bookTitle} className="w-full h-full object-cover" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Notes & Actions */}
                        <div className="p-5 border-t border-white/5 space-y-4">
                          <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Admin Notes</label>
                            <textarea
                              value={adminNotes[app.id] ?? app.adminNotes ?? ""}
                              onChange={(e) => setAdminNotes({ ...adminNotes, [app.id]: e.target.value })}
                              placeholder="Add internal notes about this application..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/30 resize-none"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() =>
                                updateStatus.mutate({
                                  id: app.id,
                                  status: "approved",
                                  adminNotes: adminNotes[app.id] ?? app.adminNotes ?? undefined,
                                })
                              }
                              disabled={app.status === "approved" || updateStatus.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                updateStatus.mutate({
                                  id: app.id,
                                  status: "rejected",
                                  adminNotes: adminNotes[app.id] ?? app.adminNotes ?? undefined,
                                })
                              }
                              disabled={app.status === "rejected" || updateStatus.isPending}
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm"
                            >
                              Reject
                            </Button>
                            <Button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this application?")) {
                                  deleteApp.mutate({ id: app.id });
                                }
                              }}
                              disabled={deleteApp.isPending}
                              variant="outline"
                              className="border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/20 text-sm ml-auto"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
