import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  Mail, 
  CheckCircle,
  ArrowRight,
  BarChart3,
  Flame,
  Bot
} from 'lucide-react';
import { EnhancedSEOHead } from '@/components/ui/enhanced-seo-head';

/**
 * AI Newsletter Signup Page
 * 
 * Weekly AI-curated newsletter covering viral trends, content strategies,
 * and the hottest KDP (Kindle Direct Publishing) books right now.
 * URL: /ai-newsletter
 */
export default function AINewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setError(null);
      toast.success("You're in! Check your inbox for confirmation.");
    },
    onError: (err: any) => {
      setError(err.message || 'Something went wrong. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    subscribeMutation.mutate({ email, name: undefined });
  };

  // ─── Success State ──────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-emerald-500 text-black rounded-full p-5">
                  <CheckCircle className="w-12 h-12" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              You&apos;re on the List
            </h1>
            <p className="text-lg text-neutral-400 mb-8">
              Your first AI-curated trend report drops next week.
              Check your inbox to confirm your subscription.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest mb-4">
                What&apos;s Coming
              </h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">Weekly viral trend analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">KDP bestseller breakdowns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">AI content strategy tips</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main Page ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <EnhancedSEOHead
        title="AI Trend Newsletter | Weekly KDP & Content Updates"
        description="Get AI-curated weekly updates on viral content trends, KDP bestsellers, and the hottest books dominating the market. Stay ahead of the curve."
        canonical="/ai-newsletter"
        keywords={["AI newsletter", "KDP trends", "book publishing", "content trends", "viral content", "self publishing", "kindle publishing"]}
      />

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 md:pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Weekly Insights
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                  Stay Ahead of
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Viral Trends
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 mb-8 leading-relaxed max-w-lg">
                  Every week, our AI scans thousands of data points to bring you the hottest 
                  KDP books, viral content trends, and publishing insights that actually matter.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-neutral-300">Trend Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-neutral-300">KDP Bestsellers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-neutral-300">Market Data</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    Delivered every Monday
                  </span>
                  <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                  <span>Free forever</span>
                </div>
              </motion.div>

              {/* Right Column - Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                  {/* Card Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Weekly Trend Report</h2>
                        <p className="text-xs text-neutral-500">AI-curated insights delivered to your inbox</p>
                      </div>
                    </div>
                  </div>

                  {/* What You Get */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: Flame, text: "This week's viral content trends" },
                      { icon: BookOpen, text: "KDP hottest books right now" },
                      { icon: TrendingUp, text: "Market movement & opportunities" },
                      { icon: Bot, text: "AI-powered content recommendations" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm text-neutral-300">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition text-sm"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-3.5 rounded-xl font-semibold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {subscribeMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Subscribing...
                        </span>
                      ) : (
                        <>
                          Subscribe to Weekly Trends
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-[11px] text-neutral-600 text-center">
                      No spam. Unsubscribe anytime. We respect your inbox.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What's Inside Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Every Monday
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                What&apos;s Inside Each Issue
              </h2>
              <p className="text-neutral-500 max-w-xl mx-auto">
                Our AI analyzes market data, bestseller lists, and social signals 
                to deliver actionable insights.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Flame,
                  title: "Viral Trend Spotlight",
                  description: "The content formats and topics blowing up this week, with data on why they're working.",
                  color: "text-orange-400",
                  bgColor: "bg-orange-500/10",
                },
                {
                  icon: BookOpen,
                  title: "KDP Hot List",
                  description: "Top-performing books across niches, with insights into covers, titles, and pricing strategies.",
                  color: "text-cyan-400",
                  bgColor: "bg-cyan-500/10",
                },
                {
                  icon: BarChart3,
                  title: "Market Pulse",
                  description: "Data-driven analysis of emerging opportunities and categories worth watching.",
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-24 border-t border-white/5">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                Ready to Stay Ahead?
              </h2>
              <p className="text-neutral-500 mb-8">
                Join creators and publishers who get the inside track every week.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition text-sm"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-neutral-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
