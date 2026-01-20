import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";

type TimeRange = "7d" | "30d" | "90d" | "all";

export default function AdminSmsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  
  const { data: analytics, isLoading } = trpc.smsAnalytics.getAnalytics.useQuery({ timeRange });
  const { data: recentMessages } = trpc.smsAnalytics.getRecentMessages.useQuery({ limit: 10 });
  const { data: optTrends } = trpc.smsAnalytics.getOptTrends.useQuery({ timeRange });

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0%";
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0";
    return value.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "queued": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "undelivered": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SMS Analytics Dashboard</h1>
              <p className="text-pink-100 mt-1">Track delivery rates, opt-in trends, and engagement</p>
            </div>
            <Link href="/admin/twilio">
              <a className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                ← Back to Twilio Settings
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {(["7d", "30d", "90d", "all"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-pink-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {range === "7d" ? "Last 7 Days" : 
               range === "30d" ? "Last 30 Days" : 
               range === "90d" ? "Last 90 Days" : "All Time"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Sent */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">Total Sent</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(analytics?.totalSent)}</p>
                <p className="text-sm text-gray-500 mt-1">messages sent</p>
              </div>

              {/* Delivery Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">Delivery Rate</span>
                </div>
                <p className="text-3xl font-bold text-green-400">{formatPercent(analytics?.deliveryRate)}</p>
                <p className="text-sm text-gray-500 mt-1">{formatNumber(analytics?.totalDelivered)} delivered</p>
              </div>

              {/* Opt-In Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">Net Subscribers</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {formatNumber((analytics?.totalOptIns || 0) - (analytics?.totalOptOuts || 0))}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  +{formatNumber(analytics?.totalOptIns)} / -{formatNumber(analytics?.totalOptOuts)}
                </p>
              </div>

              {/* Response Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">Response Rate</span>
                </div>
                <p className="text-3xl font-bold text-pink-400">{formatPercent(analytics?.responseRate)}</p>
                <p className="text-sm text-gray-500 mt-1">{formatNumber(analytics?.totalResponses)} responses</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Delivery Status Breakdown */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Delivery Status Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: "Delivered", value: analytics?.totalDelivered || 0, color: "bg-green-500" },
                    { label: "Sent", value: analytics?.totalSent ? analytics.totalSent - (analytics.totalDelivered || 0) - (analytics.totalFailed || 0) : 0, color: "bg-blue-500" },
                    { label: "Failed", value: analytics?.totalFailed || 0, color: "bg-red-500" },
                  ].map((item) => {
                    const total = analytics?.totalSent || 1;
                    const percent = (item.value / total) * 100;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white">{formatNumber(item.value)} ({percent.toFixed(1)}%)</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opt-In/Opt-Out Trends */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Subscription Trends</h3>
                {optTrends && optTrends.length > 0 ? (
                  <div className="space-y-3">
                    {optTrends.slice(0, 7).map((trend: { date: string; optIns: number; optOuts: number }, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm w-24">
                          {new Date(trend.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex-1 flex gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-400 text-sm">+{trend.optIns}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-red-400 text-sm">-{trend.optOuts}</span>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${trend.optIns - trend.optOuts >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {trend.optIns - trend.optOuts >= 0 ? "+" : ""}{trend.optIns - trend.optOuts}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No subscription data yet</p>
                    <p className="text-sm mt-1">Trends will appear as users opt in/out</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Messages Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Recent Messages</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentMessages && recentMessages.length > 0 ? (
                      recentMessages.map((message: { id: number; toPhoneNumber: string; messageBody: string; status: string; sentAt: Date }) => (
                        <tr key={message.id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {message.toPhoneNumber}
                          </td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate">
                            {message.messageBody}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                              {message.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(message.sentAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No messages sent yet. Send your first SMS from the Twilio settings page.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Stats Footer */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{formatNumber(analytics?.activeSubscribers)}</p>
                <p className="text-sm text-gray-400">Active Subscribers</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{formatNumber(analytics?.todaySent)}</p>
                <p className="text-sm text-gray-400">Sent Today</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">{formatNumber(analytics?.thisWeekOptIns)}</p>
                <p className="text-sm text-gray-400">New This Week</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-pink-400">{formatPercent(analytics?.avgDeliveryTime)}</p>
                <p className="text-sm text-gray-400">Avg Delivery (sec)</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
