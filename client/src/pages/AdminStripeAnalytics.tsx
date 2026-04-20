import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, CreditCard, Users, TrendingUp, RefreshCw,
  Loader2, ArrowUpRight, ArrowDownRight, ShoppingCart,
  BarChart3, PieChart as PieChartIcon, Clock, ExternalLink,
  Wallet, Activity, Zap, ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(timestamp: number) {
  return format(new Date(timestamp * 1000), "MMM d, yyyy h:mm a");
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return format(d, "MMM d");
}

const STATUS_COLORS: Record<string, string> = {
  succeeded: "#10b981",
  pending: "#f59e0b",
  failed: "#ef4444",
  refunded: "#8b5cf6",
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-4 shadow-2xl">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="text-white font-semibold">
            {entry.name === "Transactions" ? entry.value : formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminStripeAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [timeRange, setTimeRange] = useState(30);

  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = trpc.stripeAnalytics.getOverview.useQuery();

  const {
    data: timeline,
    isLoading: timelineLoading,
    refetch: refetchTimeline,
  } = trpc.stripeAnalytics.getRevenueTimeline.useQuery({ days: timeRange });

  const {
    data: breakdown,
    isLoading: breakdownLoading,
    refetch: refetchBreakdown,
  } = trpc.stripeAnalytics.getPaymentBreakdown.useQuery();

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = trpc.stripeAnalytics.getRecentTransactions.useQuery({ limit: 15 });

  const {
    data: topProducts,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = trpc.stripeAnalytics.getTopProducts.useQuery();

  const isLoading = overviewLoading || timelineLoading || breakdownLoading || transactionsLoading;

  const handleRefreshAll = () => {
    refetchOverview();
    refetchTimeline();
    refetchBreakdown();
    refetchTransactions();
    refetchProducts();
  };

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
            <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold px-8 py-6 rounded-full">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare pie chart data
  const pieData = breakdown
    ? [
        { name: "Succeeded", value: breakdown.succeeded },
        { name: "Pending", value: breakdown.pending },
        { name: "Failed", value: breakdown.failed },
        { name: "Refunded", value: breakdown.refunded },
      ].filter((d) => d.value > 0)
    : [];

  // Prepare timeline chart data
  const chartData = timeline?.map((d) => ({
    date: formatShortDate(d.date),
    Revenue: d.revenue,
    Transactions: d.count,
  })) || [];

  // Prepare top products bar chart data
  const productChartData = topProducts?.map((p) => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name,
    revenue: p.revenue,
    sales: p.count,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-8 overflow-hidden">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-emerald-500/8 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">Stripe Analytics</h1>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 ml-12">Real-time payment metrics from your Stripe account</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefreshAll}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-4"
                >
                  <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full px-4">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Stripe Dashboard
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="py-6">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {overviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : formatCurrency(overview?.totalRevenue || 0, overview?.currency)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Net Revenue</p>
                </Card>
              </motion.div>

              {/* Total Payments */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                      {overview?.successfulCharges || 0} successful
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {overviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : overview?.totalCharges || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Total Payments</p>
                </Card>
              </motion.div>

              {/* Customers */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                      {overview?.subscriptions?.active || 0} subscribed
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {overviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : overview?.totalCustomers || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Total Customers</p>
                </Card>
              </motion.div>

              {/* Avg Order Value */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <ShoppingCart className="h-5 w-5 text-amber-400" />
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                      <Wallet className="h-3 w-3 mr-1" />
                      AOV
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {overviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : formatCurrency(overview?.avgOrderValue || 0, overview?.currency)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Avg Order Value</p>
                </Card>
              </motion.div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {overviewLoading ? "..." : formatCurrency(overview?.availableBalance || 0, overview?.currency)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Available Balance</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {overviewLoading ? "..." : formatCurrency(overview?.pendingBalance || 0, overview?.currency)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pending Balance</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{overviewLoading ? "..." : overview?.subscriptions?.active || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Active Subscriptions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-red-500/20">
                    <Zap className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{overviewLoading ? "..." : overview?.subscriptions?.pastDue || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Past Due</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-6">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Timeline - 2/3 width */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <BarChart3 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">Revenue Over Time</h3>
                        <p className="text-[11px] text-gray-500">Daily revenue and transaction volume</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[7, 14, 30, 60].map((days) => (
                        <Button
                          key={days}
                          variant="ghost"
                          size="sm"
                          onClick={() => setTimeRange(days)}
                          className={`text-xs h-7 px-2.5 rounded-full ${
                            timeRange === days
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {days}d
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[300px]">
                    {timelineLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                      </div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                            tickLine={false}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            yAxisId="revenue"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                            tickLine={false}
                            tickFormatter={(v) => `$${(v / 100).toFixed(0)}`}
                          />
                          <YAxis
                            yAxisId="count"
                            orientation="right"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                            tickLine={false}
                          />
                          <Tooltip content={<RevenueTooltip />} />
                          <Area
                            yAxisId="revenue"
                            type="monotone"
                            dataKey="Revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                          />
                          <Area
                            yAxisId="count"
                            type="monotone"
                            dataKey="Transactions"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#txGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No revenue data yet</p>
                        <p className="text-xs mt-1">Payments will appear here once processed</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Payment Status Breakdown - 1/3 width */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <PieChartIcon className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Payment Status</h3>
                      <p className="text-[11px] text-gray-500">Breakdown by outcome</p>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    {breakdownLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                      </div>
                    ) : pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="45%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={STATUS_COLORS[entry.name.toLowerCase()] || PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value: string) => <span className="text-gray-300 text-xs">{value}</span>}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1f2e",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <PieChartIcon className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No payments yet</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Top Products Chart */}
            {productChartData.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <ShoppingCart className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Top Products by Revenue</h3>
                      <p className="text-[11px] text-gray-500">Best performing products</p>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.3)"
                          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.3)"
                          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                          tickLine={false}
                          tickFormatter={(v) => `$${(v / 100).toFixed(0)}`}
                        />
                        <Tooltip content={<RevenueTooltip />} />
                        <Bar dataKey="revenue" name="Revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="py-6 pb-20">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <CreditCard className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Recent Transactions</h3>
                      <p className="text-[11px] text-gray-500">Latest payment activity</p>
                    </div>
                  </div>
                </div>

                {transactionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Date</th>
                          <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Customer</th>
                          <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Description</th>
                          <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Amount</th>
                          <th className="text-center text-xs text-gray-400 font-medium pb-3 pr-4">Status</th>
                          <th className="text-center text-xs text-gray-400 font-medium pb-3">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4">
                              <span className="text-xs text-gray-300">{formatDate(tx.created)}</span>
                            </td>
                            <td className="py-3 pr-4">
                              <div>
                                <p className="text-xs text-white">{tx.customerName || "—"}</p>
                                <p className="text-[10px] text-gray-500">{tx.customerEmail || ""}</p>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-xs text-gray-300">{tx.description}</span>
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <span className="text-xs font-semibold text-white">
                                {formatCurrency(tx.amount, tx.currency)}
                              </span>
                              {tx.amountRefunded > 0 && (
                                <span className="text-[10px] text-red-400 block">
                                  -{formatCurrency(tx.amountRefunded, tx.currency)} refunded
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-center">
                              <Badge
                                className={`text-[10px] ${
                                  tx.status === "succeeded"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    : tx.status === "refunded"
                                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                    : tx.status === "pending"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }`}
                              >
                                {tx.status}
                              </Badge>
                            </td>
                            <td className="py-3 text-center">
                              {tx.receiptUrl ? (
                                <a href={tx.receiptUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </a>
                              ) : (
                                <span className="text-gray-600 text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No transactions yet</p>
                    <p className="text-gray-600 text-xs mt-1">Transactions will appear here once payments are processed</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
