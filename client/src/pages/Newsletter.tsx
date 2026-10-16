import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import type { BlogPost } from '@/../../drizzle/schema';
import { 
  BookOpen, Mail, Sparkles, CheckCircle, Calendar, ArrowRight, 
  Heart, Gift, Star, Shield
} from 'lucide-react';
import { Link } from 'wouter';
import { EnhancedSEOHead } from '@/components/ui/enhanced-seo-head';
import { MailerLiteForm } from '@/components/MailerLiteForm';
import { Reveal, StaggerReveal, StaggerItem, GlowOrb, GlassCard } from '@/components/author-kit';

/**
 * Newsletter Signup Page — Manhattan Luxury Redesign
 *
 * Premium landing page optimized for converting book readers into newsletter subscribers.
 * Features The First Acquisition (Hudson Dynasty) as lead magnet, social proof, and Manhattan luxury aesthetic.
 * Signups are handled by the embedded MailerLite form (k0kQw5), which manages its own
 * submission, validation, success state, and the free-book delivery automation.
 * URL: /newsletter
 */
export default function Newsletter() {
  useEffect(() => {
    document.title = "Join Reese Astor's Newsletter | Free Book & Exclusive Content";
  }, []);

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
      <GlowOrb color="rgba(212,175,55,0.15)" size={520} className="top-[-80px] left-[10%]" />
      <GlowOrb color="rgba(110,31,46,0.12)" size={360} className="top-[180px] right-[-60px]" />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative z-10 pt-12 md:pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <Reveal direction="left" duration={0.6}>
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
                Join the Hudson Dynasty inner circle. Get your free copy of 
                <em className="text-[#d4af37]"> The First Acquisition</em>, 
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
            </Reveal>

            {/* Right: Book Cover + Form Card */}
            <Reveal direction="right" delay={0.2} duration={0.6}>
              <GlassCard className="border-[#d4af37]/20 p-6 md:p-8">
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
                      alt="The First Acquisition" 
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
                      The First Acquisition
                    </h3>
                    <p className="text-gray-400 text-xs font-['Montserrat'] mt-1">
                      A Manhattan Billionaire Romance (Hudson Dynasty)
                    </p>
                  </div>
                </div>

                {/* Signup — MailerLite embedded form (k0kQw5) */}
                <MailerLiteForm formId="k0kQw5" />

                {/* Expectation setting — improves open rates & reduces spam complaints */}
                <p className="text-xs text-gray-400 text-center font-['Montserrat'] mt-4 leading-relaxed">
                  Expect about <span className="text-[#d4af37]">2 emails a month</span>. Your free
                  book link arrives instantly — check your inbox (and promotions tab).
                </p>

                {/* Explicit consent — GDPR / CAN-SPAM compliant */}
                <p className="text-[11px] text-gray-500 text-center font-['Montserrat'] mt-3 leading-relaxed">
                  By subscribing, you agree to receive marketing emails from Reese Astor and accept
                  our{' '}
                  <Link href="/privacy">
                    <span className="text-gray-400 underline underline-offset-2 hover:text-[#d4af37] cursor-pointer">
                      Privacy Policy
                    </span>
                  </Link>
                  . No spam — unsubscribe in one click anytime.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ──────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <GlowOrb color="rgba(212,175,55,0.18)" size={460} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <GlowOrb color="rgba(110,31,46,0.12)" size={320} className="top-[20%] right-[5%]" />

        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
              What You'll Get
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white">
              More Than Just a Newsletter
            </h2>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {[
              {
                icon: BookOpen,
                title: "New Release Alerts",
                description: "Be the first to know when a new Hudson Dynasty book drops, with exclusive early access deals",
              },
              {
                icon: Sparkles,
                title: "Bonus Chapters",
                description: "Deleted scenes, extended epilogues, and character POV chapters you won't find anywhere else",
              },
              {
                icon: Heart,
                title: "Behind the Scenes",
                description: "Character inspiration, writing process updates, and sneak peeks at upcoming Hudson Dynasty storylines",
              },
              {
                icon: Star,
                title: "Exclusive Giveaways",
                description: "Subscriber-only contests for signed books, merchandise, and special reader experiences",
              },
            ].map((benefit) => (
              <StaggerItem key={benefit.title}>
                <GlassCard className="group p-6 border-white/10 hover:border-[#d4af37]/30 h-full">
                  <div className="bg-[#d4af37]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-['Montserrat'] leading-relaxed">
                    {benefit.description}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ─── Book Series Preview ───────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
              The Hudson Dynasty
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-4">
              A Family Built on Acquisitions. A Ledger That Remembers Everything.
            </h2>
            <p className="text-gray-400 font-['Montserrat'] max-w-2xl mx-auto">
              Start with the free Hudson Dynasty prequel and discover why readers can't put this series down.
            </p>
          </Reveal>

          {/* Book covers row */}
          <StaggerReveal className="flex justify-center items-end gap-3 md:gap-6 mb-12" stagger={0.1}>
            {[
              { src: "/prequel-cover.jpg", label: "FREE", alt: "Prequel" },
              { src: "/book1-cover.jpg", label: "Book 1", alt: "Book 1" },
              { src: "/book2-cover.jpg", label: "Book 2", alt: "Book 2" },
              { src: "/book3-cover.jpg", label: "Book 3", alt: "Book 3" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg", label: "Book 4", alt: "Book 4" },
            ].map((book, i) => (
              <StaggerItem key={book.alt} className={`relative group ${i === 0 ? 'z-10' : ''}`}>
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
              </StaggerItem>
            ))}
          </StaggerReveal>

          {/* CTA */}
          <div className="text-center">
            <Link href="/books">
              <span className="inline-flex items-center gap-2 text-[#d4af37] font-semibold font-['Montserrat'] hover:underline underline-offset-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                View the Complete Series
                <ArrowRight className="w-4 h-4" />
              </span>
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
          <Reveal>
            <GlassCard className="border-[#d4af37]/20 p-8 md:p-12">
              <Gift className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-4">
                Don't Miss Out
              </h2>
              <p className="text-gray-300 font-['Montserrat'] mb-8 max-w-lg mx-auto">
                Join the list for exclusive content, early access to new releases,
                and a free book — all delivered to their inbox. About two emails a month, no spam.
              </p>

              {/* MailerLite embedded form (k0kQw5) */}
              <div className="max-w-md mx-auto">
                <MailerLiteForm formId="k0kQw5" />
              </div>

                {/* Deliverability tip — boosts inbox placement & engagement */}
                <p className="text-[11px] text-gray-500 text-center font-['Montserrat'] mt-4 leading-relaxed max-w-md mx-auto">
                  Tip: add <span className="text-[#d4af37]">hello@reeseastor.com</span> to your
                  contacts so your free book never lands in spam. Unsubscribe anytime — see our{' '}
                  <Link href="/privacy">
                    <span className="text-gray-400 underline underline-offset-2 hover:text-[#d4af37] cursor-pointer">
                      Privacy Policy
                    </span>
                  </Link>
                  .
                </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/**
 * Recent News Section — Manhattan Luxury Theme
 */
function RecentNewsSection() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery<BlogPost[]>({ published: true });
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
      <Reveal className="text-center mb-10">
        <p className="text-[#d4af37] text-sm font-semibold font-['Montserrat'] uppercase tracking-widest mb-3">
          Latest from Reese
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-white mb-3">
          A Taste of What's in Your Inbox
        </h2>
        <p className="text-gray-400 font-['Montserrat']">
          Here's the kind of content subscribers get first
        </p>
      </Reveal>

      <StaggerReveal className="grid md:grid-cols-3 gap-6 mb-8" stagger={0.1}>
        {recentPosts.map((post) => (
          <StaggerItem key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <GlassCard className="group border-white/10 overflow-hidden hover:border-[#d4af37]/30 h-full flex flex-col">
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
              </GlassCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggerReveal>

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
