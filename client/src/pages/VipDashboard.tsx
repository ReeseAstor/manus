import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import {
  Crown,
  Headphones,
  BookOpen,
  Heart,
  Settings,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function VipDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'history' | 'settings'>('overview');

  const { data: user } = trpc.auth.me.useQuery();
  const { data: stories } = trpc.vip.getStories.useQuery({ limit: 100 });

  if (!user) {
    setLocation('/auth/login?redirect=/vip-club/dashboard');
    return null;
  }

  // Mock data for demonstration (replace with real data from backend)
  const stats = {
    storiesRead: 12,
    minutesListened: 245,
    favoriteStories: 5,
    memberSince: 'January 2025',
  };

  const recentStories = stories?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-8 h-8" />
                <h1 className="text-3xl font-bold">VIP Dashboard</h1>
              </div>
              <p className="text-pink-100">
                Welcome back, {user.name || 'VIP Member'}!
              </p>
            </div>
            <button
              onClick={() => setLocation('/vip-audio-library')}
              className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Library
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Library
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
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
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Stories Read</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.storiesRead}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Headphones className="w-6 h-6 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Minutes Listened</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.minutesListened}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-rose-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Favorites</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.favoriteStories}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Member Since</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{stats.memberSince}</p>
              </div>
            </div>

            {/* Continue Reading */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setLocation(`/vip-audio-library`)}
                  >
                    <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold mb-3">
                      {story.category?.toUpperCase() || 'ROMANCE'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {story.excerpt || story.content?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                        <span key={i} className="text-orange-500 text-sm">🔥</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Subscription</h2>
                  <p className="text-pink-100 mb-4">
                    VIP Member • Active
                  </p>
                  <p className="text-sm text-pink-100">
                    Next billing date: February 12, 2025
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Library Tab */}
        {activeTab === 'library' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-rose-600" />
              <h2 className="text-2xl font-bold text-gray-900">Favorite Stories</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Stories you've marked as favorites will appear here.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {recentStories.slice(0, 3).map((story) => (
                <div
                  key={story.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setLocation(`/vip-audio-library`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                      {story.category?.toUpperCase() || 'ROMANCE'}
                    </div>
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {story.excerpt || story.content?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                      <span key={i} className="text-orange-500 text-sm">🔥</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Listening History</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Track your reading and listening progress across all VIP stories.
            </p>
            <div className="space-y-4">
              {recentStories.map((story, index) => (
                <div
                  key={story.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setLocation(`/vip-audio-library`)}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{story.title}</h3>
                    <p className="text-sm text-gray-600">
                      Listened {3 - index} days ago • {Math.floor(Math.random() * 20 + 10)} minutes
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: story.heatLevel || 4 }).map((_, i) => (
                      <span key={i} className="text-orange-500 text-sm">🔥</span>
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
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-8 h-8 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage your VIP membership, update payment method, or cancel your subscription.
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
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
