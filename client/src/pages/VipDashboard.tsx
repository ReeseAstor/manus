import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import {
  Crown,
  Headphones,
  BookOpen,
  Heart,
  Settings,
  Clock,
} from 'lucide-react';

function membershipLabel(status: string | null | undefined): string {
  switch (status) {
    case "active":
      return "VIP Member • Active";
    case "paused":
      return "Membership paused";
    case "pending":
      return "Membership starting";
    case "past_due":
      return "Payment past due";
    case "canceled":
    case "cancelled":
      return "Membership canceled";
    case "expired":
      return "Membership ended";
    default:
      return "No active membership";
  }
}

export default function VipDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'history' | 'settings'>('overview');

  const { data: user } = trpc.auth.me.useQuery();
  const { data: stories } = trpc.vip.getStories.useQuery({ limit: 100 }, { enabled: !!user });
  const dashboardQuery = trpc.vip.getDashboard.useQuery(undefined, { enabled: !!user });
  const dashboard = dashboardQuery.data;
  const statsReady = dashboardQuery.isSuccess;

  if (!user) {
    setLocation('/auth/login?redirect=/vip-club/dashboard');
    return null;
  }

  const recentStories = stories?.slice(0, 3) || [];
  const memberSince = dashboard?.memberSince
    ? new Date(dashboard.memberSince).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : '—';
  const nextBilling = dashboard?.currentPeriodEnd
    ? new Date(dashboard.currentPeriodEnd).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBD6D3] via-[#EBD6D3] to-[#EBD6D3]">
      {/* Header */}
      <div className="bg-[#4A3B3A] text-[#FAF7F7] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-8 h-8" />
                <h1 className="text-3xl font-bold">VIP Dashboard</h1>
              </div>
              <p className="text-[#7A4F4C]">
                Welcome back, {user.name || 'VIP Member'}!
              </p>
            </div>
            <button
              onClick={() => setLocation('/vip-audio-library')}
              className="px-6 py-3 bg-[#FAF7F7] text-[#7A4F4C] rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Library
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-[#FAF7F7] rounded-xl shadow-lg mb-8 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#4A3B3A] text-[#FAF7F7]'
                : 'text-[#6E5F5A] hover:bg-[#F0E6E5]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-[#4A3B3A] text-[#FAF7F7]'
                : 'text-[#6E5F5A] hover:bg-[#F0E6E5]'
            }`}
          >
            My Library
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[#4A3B3A] text-[#FAF7F7]'
                : 'text-[#6E5F5A] hover:bg-[#F0E6E5]'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#4A3B3A] text-[#FAF7F7]'
                : 'text-[#6E5F5A] hover:bg-[#F0E6E5]'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-[#7A4F4C]" />
                  <h3 className="text-sm font-semibold text-[#6E5F5A]">Stories Played</h3>
                </div>
                <p className="text-3xl font-bold text-[#4A3B3A]">{statsReady ? dashboard?.storiesPlayed ?? 0 : "—"}</p>
              </div>

              <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Headphones className="w-6 h-6 text-[#7A4F4C]" />
                  <h3 className="text-sm font-semibold text-[#6E5F5A]">Minutes Listened</h3>
                </div>
                <p className="text-3xl font-bold text-[#4A3B3A]">{statsReady ? dashboard?.minutesPlayed ?? 0 : "—"}</p>
              </div>

              <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-[#7A4F4C]" />
                  <h3 className="text-sm font-semibold text-[#6E5F5A]">Favorites</h3>
                </div>
                <p className="text-3xl font-bold text-[#4A3B3A]">{statsReady ? dashboard?.favorites.length ?? 0 : "—"}</p>
              </div>

              <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-[#7A4F4C]" />
                  <h3 className="text-sm font-semibold text-[#6E5F5A]">Member Since</h3>
                </div>
                <p className="text-xl font-bold text-[#4A3B3A]">{memberSince}</p>
              </div>
            </div>

            {/* Continue Reading */}
            <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#4A3B3A] mb-6">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    className="border border-[#E5D6D3] rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setLocation(`/vip-audio-library`)}
                  >
                    <div className="inline-block px-3 py-1 bg-[#EBD6D3] text-[#7A4F4C] rounded-full text-xs font-semibold mb-3">
                      {story.category?.toUpperCase() || 'ROMANCE'}
                    </div>
                    <h3 className="text-lg font-bold text-[#4A3B3A] mb-2">{story.title}</h3>
                    <p className="text-sm text-[#6E5F5A] mb-3 line-clamp-2">
                      {story.excerpt || story.content?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                        <span key={i} className="text-[#7A4F4C] text-sm">🔥</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-[#4A3B3A] rounded-xl shadow-lg p-8 text-[#FAF7F7]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Subscription</h2>
                  <p className="text-[#7A4F4C] mb-4">
                    {membershipLabel(dashboard?.subscriptionStatus)}
                  </p>
                  {nextBilling && (
                    <p className="text-sm text-[#7A4F4C]">
                      Current period ends {nextBilling}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-6 py-3 bg-[#FAF7F7] text-[#7A4F4C] rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Library Tab */}
        {activeTab === 'library' && (
          <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-[#7A4F4C]" />
              <h2 className="text-2xl font-bold text-[#4A3B3A]">Favorite Stories</h2>
            </div>
            <p className="text-[#6E5F5A] mb-6">
              Stories you've marked as favorites will appear here.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {(dashboard?.favorites ?? []).map((story) => (
                <div
                  key={story.id}
                  className="border border-[#E5D6D3] rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setLocation(`/vip-audio-library`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-block px-3 py-1 bg-[#EBD6D3] text-[#7A4F4C] rounded-full text-xs font-semibold">
                      {story.category?.toUpperCase() || 'ROMANCE'}
                    </div>
                    <Heart className="w-5 h-5 text-[#7A4F4C] fill-[#7A4F4C]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#4A3B3A] mb-2">{story.title}</h3>
                  <p className="text-sm text-[#6E5F5A] mb-3 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                      <span key={i} className="text-[#7A4F4C] text-sm">🔥</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#7A4F4C]" />
              <h2 className="text-2xl font-bold text-[#4A3B3A]">Listening History</h2>
            </div>
            <p className="text-[#6E5F5A] mb-6">
              Track your reading and listening progress across all VIP stories.
            </p>
            <div className="space-y-4">
              {dashboardQuery.isError && (
                <p className="text-[#6E5F5A]">Listening history is unavailable right now.</p>
              )}
              {statsReady && (dashboard?.history.length ?? 0) === 0 && (
                <p className="text-[#6E5F5A]">No listening history yet.</p>
              )}
              {(dashboard?.history ?? []).map((story) => (
                <div
                  key={story.id}
                  className="flex items-center gap-4 p-4 border border-[#E5D6D3] rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setLocation(`/vip-audio-library`)}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-[#7A4F4C]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#4A3B3A]">{story.title}</h3>
                    <p className="text-sm text-[#6E5F5A]">
                      {new Date(story.playedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      {' • '}
                      {(story.progress ?? 0) < 60
                        ? 'Under a minute'
                        : `${Math.round((story.progress ?? 0) / 60)} minutes`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                      <span key={i} className="text-[#7A4F4C] text-sm">🔥</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#FAF7F7] rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-8 h-8 text-[#6E5F5A]" />
                <h2 className="text-2xl font-bold text-[#4A3B3A]">Account Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#4A3B3A] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-[#E5D6D3] rounded-lg bg-[#F0E6E5] text-[#6E5F5A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A3B3A] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-[#E5D6D3] rounded-lg bg-[#F0E6E5] text-[#6E5F5A]"
                  />
                </div>

                <div className="pt-6 border-t border-[#E5D6D3]">
                  <h3 className="text-lg font-bold text-[#4A3B3A] mb-4">Subscription Management</h3>
                  <p className="text-[#6E5F5A] mb-4">
                    Manage your VIP membership, update payment method, or cancel your subscription.
                  </p>
                  <button className="px-6 py-3 bg-[#4A3B3A] text-[#FAF7F7] rounded-lg font-semibold hover:shadow-lg transition-all">
                    Manage in Stripe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
