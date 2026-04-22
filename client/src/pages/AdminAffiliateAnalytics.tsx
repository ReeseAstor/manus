import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MousePointerClick,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Clock,
  Package,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const GOLD = "#d4af37";
const GOLD_LIGHT = "#e8d48b";
const CHART_COLORS = ["#d4af37", "#e8d48b", "#8b7355", "#c9a961", "#b8860b"];

export default function AdminAffiliateAnalytics() {
  const [days, setDays] = useState(30);
  const analytics = trpc.affiliateTracking.getAnalytics.useQuery({ days });
  const recentClicks = trpc.affiliateTracking.getRecentClicks.useQuery({ limit: 20 });

  const kpis = analytics.data?.kpis;
  const dailyClicks = analytics.data?.dailyClicks || [];
  const productBreakdown = analytics.data?.productBreakdown || [];
  const sourceBreakdown = analytics.data?.sourceBreakdown || [];
  const typeBreakdown = analytics.data?.typeBreakdown || [];

  // Format daily clicks for the chart
  const chartData = dailyClicks.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: d.clicks,
    unique: d.uniqueSessions,
  }));

  // Format type breakdown for pie chart
  const pieData = typeBreakdown.map((t: any) => ({
    name: t.clickType === "card" ? "Product Cards" : t.clickType === "inline" ? "Inline Links" : "Favorites Page",
    value: t.clicks,
  }));

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-[#d4af37]" />
                Affiliate Analytics
              </h1>
              <p className="text-xs text-gray-500">Amazon Associates Performance Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Date range selector */}
            <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              {[
                { label: "7d", value: 7 },
                { label: "14d", value: 14 },
                { label: "30d", value: 30 },
                { label: "90d", value: 90 },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDays(option.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    days === option.value
                      ? "bg-[#d4af37] text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                analytics.refetch();
                recentClicks.refetch();
              }}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${analytics.isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Total Clicks",
              value: kpis?.totalClicks ?? 0,
              icon: MousePointerClick,
              format: "number",
            },
            {
              label: "Unique Visitors",
              value: kpis?.uniqueClicks ?? 0,
              icon: Users,
              format: "number",
            },
            {
              label: "Est. Conversions",
              value: kpis?.estimatedConversions ?? 0,
              icon: TrendingUp,
              format: "number",
              tooltip: "Based on 8% click-to-purchase rate",
            },
            {
              label: "Est. Revenue",
              value: kpis?.estimatedRevenue ?? 0,
              icon: DollarSign,
              format: "currency",
              tooltip: "4% commission, $25 avg order, 8% conversion",
            },
            {
              label: "Avg Clicks/Day",
              value: kpis?.avgClicksPerDay ?? 0,
              icon: BarChart3,
              format: "decimal",
            },
            {
              label: "Unique Rate",
              value: kpis?.clickThroughRate ?? 0,
              icon: TrendingUp,
              format: "percent",
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#d4af37]/30 transition-all"
              title={kpi.tooltip}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {analytics.isLoading ? (
                  <span className="animate-pulse">—</span>
                ) : kpi.format === "currency" ? (
                  `$${(kpi.value as number).toFixed(2)}`
                ) : kpi.format === "percent" ? (
                  `${kpi.value}%`
                ) : kpi.format === "decimal" ? (
                  (kpi.value as number).toFixed(1)
                ) : (
                  kpi.value.toLocaleString()
                )}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Clicks Over Time - Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#d4af37]" />
              Clicks Over Time
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD_LIGHT} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={GOLD_LIGHT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke={GOLD}
                    fill="url(#clickGradient)"
                    strokeWidth={2}
                    name="Total Clicks"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke={GOLD_LIGHT}
                    fill="url(#uniqueGradient)"
                    strokeWidth={2}
                    name="Unique Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MousePointerClick className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No click data yet. Clicks will appear here as visitors interact with your affiliate links.</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Click Type Breakdown - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              Click Sources
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-500">
                <p className="text-sm text-center">No data yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Row: Top Products + Top Sources + Recent Clicks */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Products by Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              Top Products
            </h3>
            {productBreakdown.length > 0 ? (
              <div className="space-y-3">
                {productBreakdown.map((product: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{product.productName}</p>
                      {product.productId && (
                        <p className="text-xs text-gray-500">ASIN: {product.productId}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-sm font-bold text-[#d4af37]">{product.clicks}</span>
                      <span className="text-xs text-gray-500">clicks</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No product clicks yet</p>
            )}
          </motion.div>

          {/* Top Source Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              Top Source Articles
            </h3>
            {sourceBreakdown.length > 0 ? (
              <div className="space-y-3">
                {sourceBreakdown.map((source: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex-1 min-w-0">
                      <Link href={`/blog/${source.sourceSlug}`}>
                        <span className="text-sm text-white hover:text-[#d4af37] transition-colors truncate block cursor-pointer">
                          {source.sourceSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-sm font-bold text-[#d4af37]">{source.clicks}</span>
                      <span className="text-xs text-gray-500">clicks</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No source data yet</p>
            )}
          </motion.div>

          {/* Recent Clicks Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10"
          >
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#d4af37]" />
              Recent Clicks
            </h3>
            {recentClicks.data && recentClicks.data.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {recentClicks.data.map((click: any) => (
                  <div key={click.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      click.clickType === "card" ? "bg-[#d4af37]" : click.clickType === "favorites" ? "bg-green-500" : "bg-blue-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{click.productName}</p>
                      <p className="text-[10px] text-gray-500">
                        {click.sourceSlug} · {new Date(click.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      click.clickType === "card"
                        ? "bg-[#d4af37]/10 text-[#d4af37]"
                        : click.clickType === "favorites"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-400/10 text-blue-400"
                    }`}>
                      {click.clickType}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No clicks recorded yet</p>
            )}
          </motion.div>
        </div>

        {/* Earnings Estimate Disclaimer */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <p className="text-gray-500 text-xs leading-relaxed">
            <span className="font-semibold text-gray-400">Note:</span>{" "}
            Estimated conversions and revenue are based on industry averages for Amazon Associates (4% commission rate, 8% click-to-purchase conversion, $25 average order value). Actual earnings depend on product category, customer behavior, and seasonal trends. Amazon reports actual earnings in your Associates dashboard with a 60-day delay.
          </p>
        </div>
      </div>
    </div>
  );
}
