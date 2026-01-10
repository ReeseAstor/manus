import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Heart, Mail, BookOpen, Sparkles, CheckCircle } from 'lucide-react';

/**
 * Newsletter Signup Page
 * 
 * Standalone page optimized for converting book readers into newsletter subscribers.
 * Can be linked from books, social media, or promotional materials.
 * URL: /newsletter
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setError(null);
      setEmail('');
      setName('');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to subscribe. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    subscribeMutation.mutate({ email, name: name || undefined });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Success Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-green-500 text-white rounded-full p-6">
                <CheckCircle className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Family! 💕
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You're officially part of my reader community. Check your inbox for a special welcome gift!
          </p>

          {/* What to Expect */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect:</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">New Releases</h3>
                <p className="text-sm text-gray-600">
                  Be the first to know about new books, cover reveals, and exclusive pre-orders
                </p>
              </div>
              <div>
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bonus Content</h3>
                <p className="text-sm text-gray-600">
                  Deleted scenes, character interviews, and behind-the-scenes writing updates
                </p>
              </div>
              <div>
                <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
                <p className="text-sm text-gray-600">
                  Special discounts, giveaways, and subscriber-only promotions
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/books"
              className="inline-flex items-center justify-center px-8 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
            >
              Browse My Books
            </a>
            <a
              href="/vip-club"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Join VIP Club
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" />
            Join 10,000+ Romance Readers
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Get Exclusive Romance Content
            <span className="block text-pink-600">Delivered to Your Inbox</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to my newsletter for new release alerts, deleted scenes, character deep-dives, 
            and special subscriber-only giveaways. Plus, get a <strong>free bonus epilogue</strong> when you join!
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should I call you?"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-lg"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-5 rounded-lg font-bold text-lg hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            >
              {subscribeMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Yes! Send Me Free Bonus Content'
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center">
              I respect your privacy. Unsubscribe anytime. No spam, ever. 
              By subscribing, you agree to receive emails from Reese Astor.
            </p>
          </form>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 rounded-full p-3 flex-shrink-0">
                <BookOpen className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Early Access to New Releases</h3>
                <p className="text-gray-600 text-sm">
                  Get notified before anyone else when a new book drops, plus exclusive pre-order bonuses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Deleted Scenes & Bonus Chapters</h3>
                <p className="text-gray-600 text-sm">
                  Read the scenes that didn't make it into the books, plus extended epilogues
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 rounded-full p-3 flex-shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Behind-the-Scenes Updates</h3>
                <p className="text-gray-600 text-sm">
                  Get a peek into my writing process, character inspiration, and what I'm working on next
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Subscriber-Only Giveaways</h3>
                <p className="text-gray-600 text-sm">
                  Enter exclusive contests for signed books, merchandise, and special prizes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <p className="text-gray-600 italic mb-4">
            "I love getting Reese's newsletters! The deleted scenes are my favorite - 
            I get to spend more time with my favorite characters. Highly recommend subscribing!"
          </p>
          <p className="font-semibold text-gray-900">— Sarah M., Newsletter Subscriber</p>
        </div>
      </div>
    </div>
  );
}
