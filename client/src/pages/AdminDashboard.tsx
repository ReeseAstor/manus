import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, BookOpen, Link2, AlertTriangle, FileText, 
  Users, TrendingUp, Bell, Settings, CheckCircle2, XCircle,
  Clock, BarChart3, Loader2, RefreshCw, ChevronRight,
  AlertCircle, BookMarked, MessageSquare, Mail, Smartphone, Sparkles,
  Mic, Webhook, PenTool, Zap, ArrowRight, Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";

// ─── Workflow Groups ─────────────────────────────────────────────────────────

interface WorkflowModule {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  borderColor: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

interface WorkflowGroup {
  title: string;
  description: string;
  icon: any;
  accentColor: string;
  modules: WorkflowModule[];
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.admin.getDashboardStats.useQuery();
  const { data: recentIssues } = trpc.admin.getRecentQaIssues.useQuery({ limit: 5 });
  const { data: reminders } = trpc.admin.getPendingReminders.useQuery({ limit: 5 });

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
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">Admin access required.</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-6 rounded-full"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const workflowGroups: WorkflowGroup[] = [
    {
      title: "Content & Publishing",
      description: "Create and manage your books, blog posts, and written content",
      icon: PenTool,
      accentColor: "#d4af37",
      modules: [
        {
          title: "Book Management",
          description: "Pricing, characters & storylines",
          icon: BookMarked,
          href: "/admin/books",
          color: "from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-400",
        },
        {
          title: "Blog Management",
          description: "Create and manage blog posts",
          icon: FileText,
          href: "/admin",
          color: "from-amber-500/20 to-amber-600/10",
          borderColor: "border-amber-500/30",
          iconColor: "text-amber-400",
        },
      ],
    },
    {
      title: "Marketing & Outreach",
      description: "Newsletters, SMS campaigns, and subscriber engagement",
      icon: Mail,
      accentColor: "#ec4899",
      modules: [
        {
          title: "Newsletters",
          description: "Email campaigns & subscribers",
          icon: Mail,
          href: "/admin/newsletters",
          color: "from-pink-500/20 to-pink-600/10",
          borderColor: "border-pink-500/30",
          iconColor: "text-pink-400",
        },
        {
          title: "SMS Management",
          description: "SMS campaigns & analytics",
          icon: Smartphone,
          href: "/admin/twilio",
          color: "from-orange-500/20 to-orange-600/10",
          borderColor: "border-orange-500/30",
          iconColor: "text-orange-400",
        },
        {
          title: "SMS Analytics",
          description: "Delivery rates & engagement metrics",
          icon: BarChart3,
          href: "/admin/sms-analytics",
          color: "from-rose-500/20 to-rose-600/10",
          borderColor: "border-rose-500/30",
          iconColor: "text-rose-400",
        },
      ],
    },
    {
      title: "AI Creative Studio",
      description: "Generate images, videos, music, and AI-powered content",
      icon: Sparkles,
      accentColor: "#eab308",
      modules: [
        {
          title: "AI Studio",
          description: "Images, video, music & chat with KIE API",
          icon: Sparkles,
          href: "/admin/ai-studio",
          color: "from-yellow-500/20 to-yellow-600/10",
          borderColor: "border-yellow-500/30",
          iconColor: "text-yellow-400",
          badge: "New",
          badgeColor: "bg-yellow-500/20 text-yellow-400",
        },
        {
          title: "Audio Generator",
          description: "Text-to-speech for audiobook previews",
          icon: Mic,
          href: "/admin/audio",
          color: "from-violet-500/20 to-violet-600/10",
          borderColor: "border-violet-500/30",
          iconColor: "text-violet-400",
        },
      ],
    },
    {
      title: "Quality & Monitoring",
      description: "QA checks, link monitoring, reports, and system health",
      icon: Activity,
      accentColor: "#10b981",
      modules: [
        {
          title: "QA Overview",
          description: "Content consistency & accuracy checks",
          icon: CheckCircle2,
          href: "/admin/qa",
          color: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-500/30",
          iconColor: "text-emerald-400",
        },
        {
          title: "External Links",
          description: "Link tracking & broken link detection",
          icon: Link2,
          href: "/admin/links",
          color: "from-purple-500/20 to-purple-600/10",
          borderColor: "border-purple-500/30",
          iconColor: "text-purple-400",
        },
        {
          title: "Daily Reports",
          description: "Automated website health reports",
          icon: TrendingUp,
          href: "/admin/reports",
          color: "from-indigo-500/20 to-indigo-600/10",
          borderColor: "border-indigo-500/30",
          iconColor: "text-indigo-400",
        },
        {
          title: "Webhooks",
          description: "Manage webhook endpoints & events",
          icon: Webhook,
          href: "/admin/webhooks",
          color: "from-slate-500/20 to-slate-600/10",
          borderColor: "border-slate-500/30",
          iconColor: "text-slate-400",
        },
      ],
    },
    {
      title: "Analytics & Insights",
      description: "Traffic, engagement, and performance metrics",
      icon: BarChart3,
      accentColor: "#06b6d4",
      modules: [
        {
          title: "Stripe Analytics",
          description: "Real-time payment metrics & revenue charts",
          icon: TrendingUp,
          href: "/admin/stripe-analytics",
          color: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-500/30",
          iconColor: "text-emerald-400",
          badge: "New",
          badgeColor: "bg-emerald-500/20 text-emerald-400",
        },
        {
          title: "Site Analytics",
          description: "Traffic, engagement & revenue",
          icon: BarChart3,
          href: "/admin/analytics",
          color: "from-cyan-500/20 to-cyan-600/10",
          borderColor: "border-cyan-500/30",
          iconColor: "text-cyan-400",
        },
        {
          title: "Business Command Center",
          description: "KDP business metrics, goals, tools & daily briefings",
          icon: Zap,
          href: "/admin/command-center",
          color: "from-amber-500/20 to-amber-600/10",
          borderColor: "border-amber-500/30",
          iconColor: "text-amber-400",
        },
      ],
    },
  ];

  const quickActions = [
    { label: "New Blog Post", icon: PenTool, href: "/admin/blog/new", color: "text-amber-400" },
    { label: "New Newsletter", icon: Mail, href: "/admin/newsletters", color: "text-pink-400" },
    { label: "AI Studio", icon: Sparkles, href: "/admin/ai-studio", color: "text-yellow-400" },
    { label: "Run QA Check", icon: CheckCircle2, href: "/admin/qa", color: "text-emerald-400" },
    { label: "Scan Links", icon: Link2, href: "/admin/links", color: "text-purple-400" },
    { label: "Generate Report", icon: FileText, href: "/admin/reports", color: "text-indigo-400" },
    { label: "Command Center", icon: Zap, href: "/admin/command-center", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-10 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                  Command Center
                </h1>
                <p className="text-gray-400">
                  Welcome back, {user.name || "Admin"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => refetchStats()}
                  variant="outline"
                  size="sm"
                  className="border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-4"
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Refresh
                </Button>
                <Link href="/admin/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border border-[#d4af37]/30 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] rounded-full px-4"
                  >
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card className="p-3 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stats?.qaStats?.passedToday || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">QA Passed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stats?.qaStats?.openIssues || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Open Issues</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <Link2 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stats?.linkStats?.totalLinks || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Links Tracked</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20">
                    <Bell className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stats?.remindersCount || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reminders</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-white/15 rounded-full px-3 py-1 h-auto text-xs transition-all"
                  >
                    <action.icon className={`mr-1.5 h-3 w-3 ${action.color}`} />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Workflow Groups */}
      <section className="py-6 relative">
        <div className="container relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Workflow Groups - Left 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                {workflowGroups.map((group, groupIndex) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${group.accentColor}20` }}
                      >
                        <group.icon 
                          className="h-4 w-4"
                          style={{ color: group.accentColor }}
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-white text-sm">{group.title}</h2>
                        <p className="text-[11px] text-gray-500">{group.description}</p>
                      </div>
                    </div>
                    <div className={`grid gap-3 ${group.modules.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                      {group.modules.map((module, moduleIndex) => (
                        <Link key={module.title} href={module.href}>
                          <Card className={`p-4 bg-gradient-to-br ${module.color} border ${module.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className={`p-2 rounded-lg bg-white/10 ${module.iconColor}`}>
                                <module.icon className="h-4 w-4" />
                              </div>
                              <div className="flex items-center gap-2">
                                {module.badge && (
                                  <Badge className={`text-[10px] ${module.badgeColor} border-0 px-1.5 py-0`}>
                                    {module.badge}
                                  </Badge>
                                )}
                                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm text-white mb-0.5">{module.title}</h3>
                            <p className="text-xs text-gray-400">{module.description}</p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar - Right 1/3 */}
              <div className="space-y-5">
                {/* Recent Issues */}
                <Card className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-white">Recent Issues</h3>
                    <Link href="/admin/qa">
                      <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80 text-xs h-auto py-1 px-2">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {recentIssues && recentIssues.length > 0 ? (
                      recentIssues.map((issue) => (
                        <div key={issue.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5">
                          <div className={`p-1 rounded-full mt-0.5 ${
                            issue.severity === 'critical' ? 'bg-red-500/20' :
                            issue.severity === 'warning' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                          }`}>
                            <AlertCircle className={`h-3 w-3 ${
                              issue.severity === 'critical' ? 'text-red-400' :
                              issue.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{issue.description}</p>
                            <p className="text-[10px] text-gray-500">{issue.location}</p>
                          </div>
                          <Badge className={`text-[9px] shrink-0 ${
                            issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {issue.severity}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400/40 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs">All clear — no recent issues</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Pending Reminders */}
                <Card className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-white">Reminders</h3>
                    <Link href="/admin/reminders">
                      <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80 text-xs h-auto py-1 px-2">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {reminders && reminders.length > 0 ? (
                      reminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5">
                          <div className={`p-1 rounded-full mt-0.5 ${
                            reminder.priority === 'urgent' ? 'bg-red-500/20' :
                            reminder.priority === 'high' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                          }`}>
                            <Bell className={`h-3 w-3 ${
                              reminder.priority === 'urgent' ? 'text-red-400' :
                              reminder.priority === 'high' ? 'text-orange-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{reminder.title}</p>
                            {reminder.dueDate && (
                              <p className="text-[10px] text-gray-500">
                                Due: {format(new Date(reminder.dueDate), "MMM d")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs">No pending reminders</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Workflow Shortcuts */}
                <Card className="p-5 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20">
                  <h3 className="font-semibold text-sm text-white mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#d4af37]" />
                    Common Workflows
                  </h3>
                  <div className="space-y-1.5">
                    <Link href="/admin/blog/new">
                      <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-3">
                        <span className="flex items-center gap-2">
                          <PenTool className="h-3 w-3 text-amber-400" />
                          Write &rarr; Publish Blog Post
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href="/admin/newsletters">
                      <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-3">
                        <span className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-pink-400" />
                          Draft &rarr; Send Newsletter
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href="/admin/ai-studio">
                      <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-3">
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-yellow-400" />
                          Generate &rarr; Use AI Assets
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href="/admin/qa">
                      <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-3">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          Audit &rarr; Fix &rarr; Report
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
