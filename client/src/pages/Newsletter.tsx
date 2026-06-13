import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { 
  BookOpen, Mail, Sparkles, CheckCircle, Calendar, ArrowRight, 
  Heart, Gift, Star, Bell, Shield, Download
} from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { EnhancedSEOHead } from '@/components/ui/enhanced-seo-head';

/**
 * Newsletter Signup Page — Manhattan Luxury Redesign
 * 
 * Premium landing page optimized for converting book readers into newsletter subscribers.
 * Features the free prequel as lead magnet, social proof, and Manhattan luxury aesthetic.
 * URL: /newsletter
 */
export default function Newsletter() {
  useEffect(() => {
    document.title = "Join Reese Astor's Newsletter | Free Book & Exclusive Content";
  }, []);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookUrl, setBookUrl] = useState<string>('https://BookHip.com/JHRBVXT');

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data: any) => {
      const url = data?.bookDownloadUrl || 'https://BookHip.com/JHRBVXT';
      setBookUrl(url);
      setIsSubmitted(true);
      setError(null);
      toast.success("Welcome to the inner circle!");
      // Deliver the free book immediately by opening the BookFunnel page.
      window.open(url, '_blank', 'noopener,noreferrer');
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

  // ─── Success State ──────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Success Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping opacity-20" />
                <div className="relative bg-gradient-to-br from-[#d4af37] to-[#b8962e] text-[#0a0e1a] rounded-full p-6">
                  <CheckCircle className="w-16 h-16" />
                </div>
              </div>
            </motion.div>

            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold text-white mb-4">
              You're In the Inner Circle
            </h1>
            <p className="text-xl text-gray-300 mb-4 font-['Montserrat']">
              Your free copy of <em className="text-[#d4af37]">The Billionaire's One Night Stand</em> is ready to download
            </p>
            <p className="text-gray-400 mb-10 font-['Montserrat']">
              Welcome to the Manhattan Money Kings world. If your download didn&apos;t open automatically, use the button below.
            </p>

            {/* What's Coming Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 rounded-2xl p-8 mb-10"
            >
              <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#d4af37] mb-6">What's Coming Your Way</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="bg-[#d4af37]/10 rounded-lg p-2 flex-shrink-0">
                    <Download className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">Free Prequel</h3>
                    <p className="text-xs text-gray-400">Download link in your welcome email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#d4af37]/10 rounded-lg p-2 flex-shrink-0">
                    <Bell className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">New Releases</h3>
                    <p className="text-xs text-gray-400">First to know about every new book</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#d4af37]/10 rounded-lg p-2 flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">Bonus Content</h3>
                    <p className="text-xs text-gray-400">Deleted scenes and extended epilogues</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a0e1a] rounded-lg font-bold font-['Montserrat'] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore the Series
                </motion.span>
              </Link>
              <a href={bookUrl} target="_blank" rel="noopener noreferrer">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#d4af37]/40 text-[#d4af37] rounded-lg font-bold font-['Montserrat'] hover:bg-[#d4af37]/10 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Your Free Book
                </motion.span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main Page ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] relative overflow-hidden">
      <EnhancedSEOHead
        title="Join Reese Astor's Newsletter | Free Book & Exclusive Content"
        description="Subscribe to Reese Astor's newsletter and get The First Acquisition free. Receive exclusive bonus scenes, early cover reveals, and new release alerts."
        canonical="/newsletter"
        keywords={["romance newsletter", "Reese Astor newsletter", "free romance book", "book release alerts", "exclusive bonus content", "reader newsletter"]}
      />

      {/* Ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-[#d4af37]/3 rounded-full blur-[120px]" />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative z-10 pt-12 md:pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 rounded-full text-sm font-semibold font-['Montserrat'] mb-6">
                <Mail className="w-4 h-4" />
                Join 10,000+ Romance Readers
              </div>

              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                Get a Free Book
                <span className="block text-[#d4af37] italic mt-2">
                  & Never Miss a Release
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 font-['Montserrat'] leading-relaxed max-w-lg">
                Join the Manhattan Money Kings inner circle. Get your free copy of 
                <em className="text-[#d4af37]"> The Billionaire's One Night Stand</em>, 
                plus new release alerts, deleted scenes, and exclusive bonus content delivered 
                straight to your inbox.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-['Montserrat']">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#d4af37]/60" />
                  No spam, ever
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d4af37]/60" />
                  Unsubscribe anytime
                </span>
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#d4af37]/60" />
                  Instant free book
                </span>
              </div>
            </motion.div>

            {/* Right: Book Cover + Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 rounded-2xl p-6 md:p-8 relative">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-[140%] h-[2px] bg-gradient-to-l from-[#d4af37] to-transparent origin-top-right rotate-[-45deg] translate-y-[14px] translate-x-[14px]" />
                </div>

                {/* Book Preview */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#d4af37]/40 to-transparent rounded-lg blur-sm" />
                    <img 
                      src="/prequel-cover.jpg" 
                      alt="The Billionaire's One Night Stand" 
                      className="relative w-20 h-28 object-cover rounded-lg shadow-xl"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#d4af37] text-[#0a0e1a] text-[10px] font-bold px-2 py-0.5 rounded-full font-['Montserrat']">
                      FREE
                    </div>
                  </div>
                  <div>
                    <p className="text-[#d4af37] text-xs font-semibold font-['Montserrat'] uppercase tracking-wider mb-1">
                      Your Free Gift
                    </p>
                    <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-white leading-tight">
                      The Billionaire's One Night Stand
                    </h3>
                    <p className="text-gray-400 text-xs font-['Montserrat'] mt-1">
                      Manhattan Money Kings Prequel
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm font-['Montserrat']">{error}</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First name (optional)"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/30 transition font-['Montserrat'] text-sm"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Your email address"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/30 transition font-['Montserrat'] text-sm"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a0e1a] py-4 rounded-lg font-bold text-base font-['Montserrat'] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                      <span className="flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Get My Free Book
                      </span>
                    )}
                  </motion.button>

                  <p className="text-[11px] text-gray-500 text-center font-['Montserrat']">
                    By subscribing, you agree to receive emails from Reese Astor. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ──────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
              What You'll Get
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white">
              More Than Just a Newsletter
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "New Release Alerts",
                description: "Be the first to know when a new Manhattan Money Kings book drops, with exclusive early access deals",
              },
              {
                icon: Sparkles,
                title: "Bonus Chapters",
                description: "Deleted scenes, extended epilogues, and character POV chapters you won't find anywhere else",
              },
              {
                icon: Heart,
                title: "Behind the Scenes",
                description: "Character inspiration, writing process updates, and sneak peeks at upcoming storylines",
              },
              {
                icon: Star,
                title: "Exclusive Giveaways",
                description: "Subscriber-only contests for signed books, merchandise, and special reader experiences",
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#d4af37]/30 transition-all duration-300"
              >
                <div className="bg-[#d4af37]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm font-['Montserrat'] leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ─── Book Series Preview ───────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
              The Manhattan Money Kings
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-4">
              Four Billionaires. Four Love Stories.
            </h2>
            <p className="text-gray-400 font-['Montserrat'] max-w-2xl mx-auto">
              Start with the free prequel and discover why readers can't put this series down.
            </p>
          </motion.div>

          {/* Book covers row */}
          <div className="flex justify-center items-end gap-3 md:gap-6 mb-12">
            {[
              { src: "/prequel-cover.jpg", label: "FREE", alt: "Prequel" },
              { src: "/book1-cover.jpg", label: "Book 1", alt: "Book 1" },
              { src: "/book2-cover.jpg", label: "Book 2", alt: "Book 2" },
              { src: "/book3-cover.jpg", label: "Book 3", alt: "Book 3" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg", label: "Book 4", alt: "Book 4" },
            ].map((book, i) => (
              <motion.div
                key={book.alt}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative group ${i === 0 ? 'z-10' : ''}`}
              >
                <div className={`relative ${i === 0 ? 'ring-2 ring-[#d4af37]/50 rounded-lg' : ''}`}>
                  <img
                    src={book.src}
                    alt={book.alt}
                    className={`rounded-lg shadow-xl object-cover transition-transform duration-300 group-hover:scale-105 ${
                      i === 0 ? 'w-24 h-36 md:w-32 md:h-48' : 'w-20 h-30 md:w-28 md:h-42'
                    }`}
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold font-['Montserrat'] px-2 py-0.5 rounded-full whitespace-nowrap ${
                    i === 0 
                      ? 'bg-[#d4af37] text-[#0a0e1a]' 
                      : 'bg-white/10 text-gray-300 border border-white/20'
                  }`}>
                    {book.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/books">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-[#d4af37] font-semibold font-['Montserrat'] hover:underline underline-offset-4 cursor-pointer transition-all"
              >
                View the Complete Series
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Recent Blog Posts ─────────────────────────────────────────── */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <RecentNewsSection />
        </div>
      </section>

      {/* ─── Final CTA Section ─────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-2xl p-8 md:p-12">
              <Gift className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-4">
                Don't Miss Out
              </h2>
              <p className="text-gray-300 font-['Montserrat'] mb-8 max-w-lg mx-auto">
                Join thousands of readers who get exclusive content, early access to new releases, 
                and a free book — all delivered to their inbox.
              </p>

              {/* Inline mini form */}
              <form 
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/30 transition font-['Montserrat'] text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a0e1a] rounded-lg font-bold text-sm font-['Montserrat'] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {subscribeMutation.isPending ? 'Joining...' : 'Get Free Book'}
                </motion.button>
              </form>
              {error && (
                <p className="text-red-400 text-sm mt-3 font-['Montserrat']">{error}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/**
 * Recent News Section — Manhattan Luxury Theme
 */
function RecentNewsSection() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ published: true });
  const recentPosts = posts?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]" />
      </div>
    );
  }

  if (recentPosts.length === 0) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
          Latest from Reese
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-3">
          A Taste of What's in Your Inbox
        </h2>
        <p className="text-gray-400 font-['Montserrat']">
          Here's the kind of content subscribers get first
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {recentPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#d4af37]/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="p-5 pb-0">
                  <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold font-['Montserrat'] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-['Montserrat'] mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                    <span className="flex items-center gap-1 text-gray-500 font-['Montserrat']">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[#d4af37] font-semibold font-['Montserrat'] flex items-center gap-1 group-hover:gap-2 transition-all text-xs">
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-[#d4af37] font-semibold font-['Montserrat'] hover:underline underline-offset-4 cursor-pointer transition-all">
            View All Blog Posts
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
