import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, BookOpen, Link2, AlertTriangle, FileText, 
  Users, TrendingUp, Bell, Settings, CheckCircle2, XCircle,
  Clock, BarChart3, Loader2, RefreshCw, ChevronRight,
  AlertCircle, BookMarked, MessageSquare, Mail, Smartphone, Sparkles
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";

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

  const dashboardModules = [
    {
      title: "QA Overview",
      description: "Content consistency & accuracy checks",
      icon: CheckCircle2,
      href: "/admin/qa",
      color: "from-emerald-500/20 to-emerald-600/10",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      stats: stats?.qaStats,
    },
    {
      title: "Book Management",
      description: "Pricing, characters & storylines",
      icon: BookMarked,
      href: "/admin/books",
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      stats: stats?.bookStats,
    },
    {
      title: "External Links",
      description: "Link tracking & broken link detection",
      icon: Link2,
      href: "/admin/links",
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      stats: stats?.linkStats,
    },
    {
      title: "Blog Management",
      description: "Create and manage blog posts",
      icon: FileText,
      href: "/admin",
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      stats: stats?.blogStats,
    },
    {
      title: "Analytics",
      description: "Traffic, engagement & revenue",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "from-cyan-500/20 to-cyan-600/10",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      stats: undefined,
    },
    {
      title: "Newsletters",
      description: "Email campaigns & subscribers",
      icon: Mail,
      href: "/admin/newsletters",
      color: "from-pink-500/20 to-pink-600/10",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
      stats: stats?.newsletterStats,
    },
    {
      title: "SMS Management",
      description: "SMS campaigns & analytics",
      icon: Smartphone,
      href: "/admin/twilio",
      color: "from-orange-500/20 to-orange-600/10",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
      stats: undefined,
    },
    {
      title: "Daily Reports",
      description: "Automated website health reports",
      icon: TrendingUp,
      href: "/admin/reports",
      color: "from-indigo-500/20 to-indigo-600/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      stats: undefined,
    },
    {
      title: "AI Studio",
      description: "Generate images, videos & music for campaigns",
      icon: Sparkles,
      href: "/admin/ai-studio",
      color: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      stats: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                  Welcome back, {user.name || "Admin"}. Here's your website overview.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => refetchStats()}
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-6 rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Link href="/admin/settings">
                  <Button
                    variant="outline"
                    className="border-2 border-[#d4af37]/30 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-semibold px-6 py-6 rounded-full"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.qaStats?.passedToday || 0}</p>
                    <p className="text-xs text-gray-400">QA Checks Passed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.qaStats?.openIssues || 0}</p>
                    <p className="text-xs text-gray-400">Open Issues</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Link2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.linkStats?.totalLinks || 0}</p>
                    <p className="text-xs text-gray-400">External Links</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Bell className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.remindersCount || 0}</p>
                    <p className="text-xs text-gray-400">Pending Reminders</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 relative">
        <div className="container relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dashboard Modules */}
              <div className="lg:col-span-2">
                <h2 className="font-serif text-2xl font-bold text-white mb-6">Management Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardModules.map((module, index) => (
                    <motion.div
                      key={module.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={module.href}>
                        <Card className={`p-6 bg-gradient-to-br ${module.color} border-2 ${module.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-white/10 ${module.iconColor}`}>
                              <module.icon className="h-6 w-6" />
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          <h3 className="font-semibold text-lg text-white mb-1">{module.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                          {module.stats && (
                            <div className="flex gap-4 text-xs">
                              {Object.entries(module.stats).slice(0, 2).map(([key, value]) => (
                                <span key={key} className="text-gray-500">
                                  <span className="text-white font-medium">{String(value)}</span> {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Issues */}
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white">Recent Issues</h3>
                    <Link href="/admin/qa">
                      <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentIssues && recentIssues.length > 0 ? (
                      recentIssues.map((issue) => (
                        <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                          <div className={`p-1.5 rounded-full ${
                            issue.severity === 'critical' ? 'bg-red-500/20' :
                            issue.severity === 'warning' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                          }`}>
                            <AlertCircle className={`h-4 w-4 ${
                              issue.severity === 'critical' ? 'text-red-400' :
                              issue.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{issue.description}</p>
                            <p className="text-xs text-gray-500">{issue.location}</p>
                          </div>
                          <Badge className={`text-xs ${
                            issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {issue.severity}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No recent issues</p>
                    )}
                  </div>
                </Card>

                {/* Pending Reminders */}
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white">Reminders</h3>
                    <Link href="/admin/reminders">
                      <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {reminders && reminders.length > 0 ? (
                      reminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                          <div className={`p-1.5 rounded-full ${
                            reminder.priority === 'urgent' ? 'bg-red-500/20' :
                            reminder.priority === 'high' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                          }`}>
                            <Bell className={`h-4 w-4 ${
                              reminder.priority === 'urgent' ? 'text-red-400' :
                              reminder.priority === 'high' ? 'text-orange-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{reminder.title}</p>
                            {reminder.dueDate && (
                              <p className="text-xs text-gray-500">
                                Due: {format(new Date(reminder.dueDate), "MMM d")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No pending reminders</p>
                    )}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20">
                  <h3 className="font-semibold text-lg text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/admin/qa/run">
                      <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Run QA Check
                      </Button>
                    </Link>
                    <Link href="/admin/links/scan">
                      <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white">
                        <Link2 className="mr-2 h-4 w-4" />
                        Scan Links
                      </Button>
                    </Link>
                    <Link href="/admin/reports/generate">
                      <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
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
