import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send, Edit, Trash2, Search, Mail, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterManager() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: newsletters, isLoading } = trpc.newsletters.list.useQuery();
  const { data: stats } = trpc.newsletters.getStats.useQuery();
  
  const deleteNewsletter = trpc.newsletters.delete.useMutation({
    onSuccess: () => {
      alert("Newsletter deleted successfully");
      window.location.reload();
    },
    onError: (error) => {
      alert(error.message || "Failed to delete newsletter");
    },
  });

  const filteredNewsletters = newsletters?.filter((newsletter) =>
    newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this newsletter?")) {
      deleteNewsletter.mutate({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-serif font-bold text-[#e5e5e5] mb-2">
                Newsletter Manager
              </h1>
              <p className="text-[#e5e5e5]/60 text-lg">
                Create and manage your email campaigns
              </p>
            </div>
            <Button
              onClick={() => setLocation("/admin/newsletter/new")}
              className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-semibold px-8 py-6 text-lg rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Newsletter
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <Mail className="w-8 h-8 text-[#d4af37]" />
                </div>
                <div className="text-3xl font-bold text-[#e5e5e5] mb-1">
                  {stats.totalNewsletters}
                </div>
                <div className="text-[#e5e5e5]/60 text-sm">Total Campaigns</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-[#d4af37]" />
                </div>
                <div className="text-3xl font-bold text-[#e5e5e5] mb-1">
                  {stats.totalSubscribers}
                </div>
                <div className="text-[#e5e5e5]/60 text-sm">Active Subscribers</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <Send className="w-8 h-8 text-[#d4af37]" />
                </div>
                <div className="text-3xl font-bold text-[#e5e5e5] mb-1">
                  {stats.sentNewsletters}
                </div>
                <div className="text-[#e5e5e5]/60 text-sm">Sent Campaigns</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-[#d4af37]" />
                </div>
                <div className="text-3xl font-bold text-[#e5e5e5] mb-1">
                  {stats.averageOpenRate}%
                </div>
                <div className="text-[#e5e5e5]/60 text-sm">Avg. Open Rate</div>
              </motion.div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e5e5e5]/40" />
            <Input
              type="text"
              placeholder="Search newsletters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-[#d4af37]/20 text-[#e5e5e5] placeholder:text-[#e5e5e5]/40 h-14 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Newsletters List */}
        <div className="space-y-4">
          {filteredNewsletters && filteredNewsletters.length > 0 ? (
            filteredNewsletters.map((newsletter, index) => (
              <motion.div
                key={newsletter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-serif font-bold text-[#e5e5e5]">
                        {newsletter.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase ${getStatusColor(
                          newsletter.status
                        )}`}
                      >
                        {newsletter.status}
                      </span>
                    </div>
                    <p className="text-[#e5e5e5]/60 mb-4">
                      <strong>Subject:</strong> {newsletter.subject}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-[#e5e5e5]/40">
                      <span>Recipients: {newsletter.recipientCount}</span>
                      {newsletter.status === "sent" && (
                        <>
                          <span>Opens: {newsletter.openCount}</span>
                          <span>Clicks: {newsletter.clickCount}</span>
                          <span>
                            Sent: {new Date(newsletter.sentAt!).toLocaleDateString()}
                          </span>
                        </>
                      )}
                      {newsletter.status === "scheduled" && newsletter.scheduledAt && (
                        <span>
                          Scheduled: {new Date(newsletter.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {newsletter.status === "draft" && (
                      <Button
                        onClick={() => setLocation(`/admin/newsletter/${newsletter.id}`)}
                        variant="ghost"
                        className="text-[#d4af37] hover:bg-[#d4af37]/10"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(newsletter.id)}
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Mail className="w-16 h-16 text-[#e5e5e5]/20 mx-auto mb-4" />
              <p className="text-[#e5e5e5]/60 text-lg mb-6">
                {searchQuery ? "No newsletters found" : "No newsletters yet"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setLocation("/admin/newsletter/new")}
                  className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-semibold px-8 py-6 text-lg rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Newsletter
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
