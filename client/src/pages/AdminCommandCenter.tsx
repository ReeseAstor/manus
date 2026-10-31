import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, DollarSign, BookOpen, FileText,
  Target, Wrench, Mail, TrendingUp, ExternalLink, Clock,
  Loader2, RefreshCw, ChevronRight, AlertCircle, CheckCircle2,
  Plus, Sparkles, BarChart3, Zap, Play, Send, Eye,
  Video, Mic, Palette, PenTool, ShoppingBag, Share2,
  Globe, ArrowRight, Calendar, Trophy, Flame
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

// ─── Category Colors ─────────────────────────────────────────────────────────

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  video: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  audio: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  design: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  writing: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  marketing: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  analytics: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  kdp: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  social: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  email: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  other: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  needs_login: { bg: "bg-amber-500/20", text: "text-amber-400" },
  expired: { bg: "bg-red-500/20", text: "text-red-400" },
  pending: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

const goalCategoryIcons: Record<string, any> = {
  subscribers: Users,
  revenue: DollarSign,
  books: BookOpen,
  content: FileText,
  social: Share2,
  launches: Flame,
  other: Target,
};

// ─── Metric Card Component ───────────────────────────────────────────────────

function MetricCard({ title, value, subtitle, icon: Icon, color = "text-[#d4af37]" }: {
  title: string; value: string | number; subtitle?: string; icon: any; color?: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#a0937d] uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

// ─── Tool Card Component ─────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: any }) {
  const cat = categoryColors[tool.category] || categoryColors.other;
  const status = statusColors[tool.status] || statusColors.pending;
  const features = tool.features ? JSON.parse(tool.features) : [];
  const useCases = tool.kdpUseCases ? JSON.parse(tool.kdpUseCases) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={`bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border ${cat.border} hover:border-[#d4af37]/40 transition-all duration-300 p-4`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tool.iconEmoji || "🔧"}</span>
            <div>
              <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className={`${cat.bg} ${cat.text} border-0 text-[10px] px-1.5 py-0`}>
                  {tool.category}
                </Badge>
                <Badge className={`${status.bg} ${status.text} border-0 text-[10px] px-1.5 py-0`}>
                  {tool.status === "needs_login" ? "needs login" : tool.status}
                </Badge>
              </div>
            </div>
          </div>
          {tool.status === "active" && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {tool.description && (
          <p className="text-xs text-white/50 mb-2 line-clamp-2">{tool.description}</p>
        )}

        {tool.plan && (
          <p className="text-[10px] text-[#a0937d] mb-2">Plan: {tool.plan}</p>
        )}

        {useCases.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {useCases.slice(0, 3).map((uc: string, i: number) => (
              <span key={i} className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded">
                {uc}
              </span>
            ))}
            {useCases.length > 3 && (
              <span className="text-[10px] text-white/30">+{useCases.length - 3} more</span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Goal Card Component ─────────────────────────────────────────────────────

function GoalCard({ goal, onUpdate }: { goal: any; onUpdate: () => void }) {
  const Icon = goalCategoryIcons[goal.category] || Target;
  const progress = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
  const daysLeft = Math.max(0, Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#d4af37]/10">
            <Icon className="h-4 w-4 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{goal.title}</h3>
            <p className="text-[10px] text-white/40">{daysLeft} days remaining</p>
          </div>
        </div>
        <span className={`text-lg font-bold ${progress >= 100 ? "text-emerald-400" : progress >= 50 ? "text-[#d4af37]" : "text-white/60"}`}>
          {progress}%
        </span>
      </div>

      <div className="w-full bg-white/5 rounded-full h-2 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-[#d4af37]" : "bg-white/30"}`}
        />
      </div>

      <div className="flex justify-between text-xs text-white/40">
        <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
        <span>Due {format(new Date(goal.endDate), "MMM d")}</span>
      </div>
    </Card>
  );
}

// ─── Briefing Card Component ─────────────────────────────────────────────────

function BriefingCard({ briefing }: { briefing: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#d4af37]/10">
            <FileText className="h-4 w-4 text-[#d4af37]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              {format(new Date(briefing.briefingDate), "EEEE, MMMM d, yyyy")}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {briefing.emailSent && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] px-1.5 py-0">
                  Emailed
                </Badge>
              )}
            </div>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-white/40 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div>
                <p className="text-xs text-[#d4af37] font-semibold mb-1">Executive Summary</p>
                <p className="text-xs text-white/60 whitespace-pre-line">{briefing.executiveSummary}</p>
              </div>
              {briefing.subscriberUpdate && (
                <div>
                  <p className="text-xs text-[#d4af37] font-semibold mb-1">Subscribers</p>
                  <p className="text-xs text-white/60">{briefing.subscriberUpdate}</p>
                </div>
              )}
              {briefing.revenueUpdate && (
                <div>
                  <p className="text-xs text-[#d4af37] font-semibold mb-1">Revenue</p>
                  <p className="text-xs text-white/60">{briefing.revenueUpdate}</p>
                </div>
              )}
              {briefing.goalProgress && (
                <div>
                  <p className="text-xs text-[#d4af37] font-semibold mb-1">Goal Progress</p>
                  <p className="text-xs text-white/60 whitespace-pre-line">{briefing.goalProgress}</p>
                </div>
              )}
              {briefing.actionItems && (
                <div>
                  <p className="text-xs text-[#d4af37] font-semibold mb-1">Action Items</p>
                  <ul className="text-xs text-white/60 space-y-1">
                    {JSON.parse(briefing.actionItems).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#d4af37] mt-0.5">&#x2022;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── New Goal Modal ──────────────────────────────────────────────────────────

function NewGoalModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const createGoal = trpc.commandCenter.createGoal.useMutation();
  const [form, setForm] = useState({
    title: "",
    category: "subscribers" as const,
    targetValue: 100,
    currentValue: 0,
    unit: "subscribers",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    description: "",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      await createGoal.mutateAsync(form);
      toast.success(`Goal created: ${form.title}`);
      onCreated();
      onClose();
      setForm({ ...form, title: "", description: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create goal");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="bg-[#0f1420] border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#d4af37]" />
            New Business Goal
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/60 block mb-1">Goal Title</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Reach 500 email subscribers"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as any })}
                >
                  <option value="subscribers">Subscribers</option>
                  <option value="revenue">Revenue</option>
                  <option value="books">Books</option>
                  <option value="content">Content</option>
                  <option value="social">Social</option>
                  <option value="launches">Launches</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Unit</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g., subscribers, dollars"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Target Value</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.targetValue}
                  onChange={e => setForm({ ...form, targetValue: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Current Value</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.currentValue}
                  onChange={e => setForm({ ...form, currentValue: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Description (optional)</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none resize-none"
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose} className="text-white/60">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.title || createGoal.isPending}
              className="bg-[#d4af37] text-black hover:bg-[#c4a030]"
            >
              {createGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Create Goal
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Main Command Center Page ────────────────────────────────────────────────

export default function AdminCommandCenter() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [toolFilter, setToolFilter] = useState<string>("all");

  // Data fetching
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = trpc.commandCenter.getOverview.useQuery();
  const { data: tools, isLoading: toolsLoading, refetch: refetchTools } = trpc.commandCenter.getTools.useQuery();
  const { data: goals, refetch: refetchGoals } = trpc.commandCenter.getGoals.useQuery({ status: "active" });
  const { data: briefings, refetch: refetchBriefings } = trpc.commandCenter.getBriefings.useQuery({ limit: 5 });

  // Mutations
  const seedTools = trpc.commandCenter.seedTools.useMutation();
  const generateBriefing = trpc.commandCenter.generateBriefing.useMutation();
  const collectMetrics = trpc.commandCenter.collectMetrics.useMutation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center">Admin Access Required</h2>
          <p className="text-white/60 text-center mt-2">This page is only accessible to administrators.</p>
        </Card>
      </div>
    );
  }

  const handleSeedTools = async () => {
    try {
      const result = await seedTools.mutateAsync();
      toast.success(result.message);
      refetchTools();
    } catch (err: any) {
      toast.error(err.message || "Failed to seed tools");
    }
  };

  const handleGenerateBriefing = async () => {
    try {
      const result = await generateBriefing.mutateAsync();
      toast.success("Briefing generated! Your daily briefing is ready.");
      refetchBriefings();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate briefing");
    }
  };

  const handleCollectMetrics = async () => {
    try {
      const result = await collectMetrics.mutateAsync();
      toast.success(`Metrics collected - Subscribers: ${result.collected.subscribers}, Orders: ${result.collected.orders}`);
      refetchOverview();
    } catch (err: any) {
      toast.error(err.message || "Failed to collect metrics");
    }
  };

  const filteredTools = tools?.filter((t: any) => toolFilter === "all" || t.category === toolFilter) || [];
  const toolCategories = Array.from(new Set(tools?.map((t: any) => t.category) || []));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30">
                <Zap className="h-6 w-6 text-[#d4af37]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Business Command Center</h1>
            </div>
            <p className="text-sm text-white/50">Your KDP business at a glance. Track goals, manage tools, and review daily briefings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollectMetrics}
              disabled={collectMetrics.isPending}
              className="border-white/10 text-white/60 hover:text-white hover:border-[#d4af37]/50"
            >
              {collectMetrics.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
              Collect Metrics
            </Button>
            <Button
              size="sm"
              onClick={handleGenerateBriefing}
              disabled={generateBriefing.isPending}
              className="bg-[#d4af37] text-black hover:bg-[#c4a030]"
            >
              {generateBriefing.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
              Generate Briefing
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <MetricCard
            title="Subscribers"
            value={overview?.subscribers || 0}
            icon={Users}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${((overview?.monthlyRevenue || 0) / 100).toFixed(0)}`}
            subtitle={`${overview?.monthlyOrders || 0} orders`}
            icon={DollarSign}
            color="text-emerald-400"
          />
          <MetricCard
            title="Published Posts"
            value={overview?.publishedPosts || 0}
            icon={FileText}
            color="text-blue-400"
          />
          <MetricCard
            title="Books"
            value={overview?.totalBooks || 0}
            icon={BookOpen}
            color="text-purple-400"
          />
          <MetricCard
            title="Users"
            value={overview?.totalUsers || 0}
            icon={Users}
            color="text-pink-400"
          />
          <MetricCard
            title="Active Goals"
            value={goals?.length || 0}
            icon={Target}
            color="text-orange-400"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Goals & Briefings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Business Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#d4af37]" />
                  Business Goals
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewGoal(true)}
                  className="text-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10 h-7 px-2"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>

              {goals && goals.length > 0 ? (
                <div className="space-y-3">
                  {goals.map((goal: any) => (
                    <GoalCard key={goal.id} goal={goal} onUpdate={() => refetchGoals()} />
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 text-center">
                  <Target className="h-8 w-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/40">No active goals</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewGoal(true)}
                    className="text-[#d4af37] mt-2"
                  >
                    Set your first goal
                  </Button>
                </Card>
              )}
            </div>

            {/* Daily Briefings */}
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[#d4af37]" />
                Daily Briefings
              </h2>

              {briefings && briefings.length > 0 ? (
                <div className="space-y-3">
                  {briefings.map((b: any) => (
                    <BriefingCard key={b.id} briefing={b} />
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 text-center">
                  <FileText className="h-8 w-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/40">No briefings yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateBriefing}
                    disabled={generateBriefing.isPending}
                    className="text-[#d4af37] mt-2"
                  >
                    Generate your first briefing
                  </Button>
                </Card>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-[#d4af37]" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
                  { label: "AI Studio", href: "/admin/studio", icon: Sparkles },
                  { label: "Blog Editor", href: "/admin/blog/new", icon: PenTool },
                  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
                  { label: "QA Center", href: "/admin/qa", icon: CheckCircle2 },
                  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-colors p-3 cursor-pointer flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-[#d4af37]" />
                      <span className="text-xs text-white/70">{item.label}</span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tool Inventory */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#d4af37]" />
                Tool Inventory
                {tools && <span className="text-sm font-normal text-white/40">({tools.length} tools)</span>}
              </h2>
              {(!tools || tools.length === 0) && (
                <Button
                  size="sm"
                  onClick={handleSeedTools}
                  disabled={seedTools.isPending}
                  className="bg-[#d4af37] text-black hover:bg-[#c4a030]"
                >
                  {seedTools.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
                  Load Tools
                </Button>
              )}
            </div>

            {/* Category Filter */}
            {tools && tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button
                  onClick={() => setToolFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    toolFilter === "all"
                      ? "bg-[#d4af37] text-black"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  All ({tools.length})
                </button>
                {toolCategories.map(cat => {
                  const catCount = tools.filter((t: any) => t.category === cat).length;
                  const colors = categoryColors[cat as string] || categoryColors.other;
                  return (
                    <button
                      key={cat}
                      onClick={() => setToolFilter(cat as string)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                        toolFilter === cat
                          ? `${colors.bg} ${colors.text} border ${colors.border}`
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      {cat} ({catCount})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tool Grid */}
            {toolsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
              </div>
            ) : filteredTools.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredTools.map((tool: any) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : tools && tools.length === 0 ? (
              <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-8 text-center">
                <Wrench className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 mb-4">No tools loaded yet. Click "Load Tools" to import your AppSumo tool inventory.</p>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-8 text-center">
                <p className="text-white/40">No tools match the selected filter.</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Goal Modal */}
      <NewGoalModal
        open={showNewGoal}
        onClose={() => setShowNewGoal(false)}
        onCreated={() => refetchGoals()}
      />
    </div>
  );
}
