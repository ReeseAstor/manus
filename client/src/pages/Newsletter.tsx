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
import { BOOKS } from '@/data/books';
import { Reveal, StaggerReveal, StaggerItem, GlowOrb, GlassCard } from '@/components/author-kit';
import { pinPost } from '@/lib/pin-post';

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
    document.title = "Join Reese Astor's Newsletter | Free Book & New Release Alerts";
  }, []);

  // ─── Main Page ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] relative overflow-hidden">
      <EnhancedSEOHead
        title="Join Reese Astor's Newsletter | Free Book & New Release Alerts"
        description="Subscribe to Reese Astor's newsletter and get The First Acquisition free. Receive bonus scenes, early cover reveals, ARC invitations, and new release alerts."
        canonical="/newsletter"
        keywords={["romance newsletter", "Reese Astor newsletter", "free romance book", "book release alerts", "bonus scenes", "reader newsletter"]}
      />

      {/* Ambient lighting effects */}
      <GlowOrb color="rgba(201, 163, 160,0.15)" size={520} className="top-[-80px] left-[10%]" />
      <GlowOrb color="rgba(201, 163, 160,0.12)" size={360} className="top-[180px] right-[-60px]" />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative z-10 pt-12 md:pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <Reveal direction="left" duration={0.6}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C9A3A0]/10 border border-[#B59A6A]/30 text-[#7A4F4C] px-4 py-2 rounded-full text-sm font-semibold font-['Cormorant_Garamond'] mb-6">
                <Mail className="w-4 h-4" />
                Join the Reese Astor Newsletter
              </div>

              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A3B3A] mb-6 leading-[1.1]">
                Get a Free Book
                <span className="block text-[#7A4F4C] italic mt-2">
                  & Never Miss a Release
                </span>
              </h1>

              <p className="text-lg text-[#6E5F5A] mb-8 font-['Cormorant_Garamond'] leading-relaxed max-w-lg">
                Join the Hudson Dynasty inner circle. Get your free copy of 
                <em className="text-[#7A4F4C]"> The First Acquisition</em>, 
                plus new release alerts, bonus scenes, and early cover reveals delivered 
                straight to your inbox.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#6E5F5A] font-['Cormorant_Garamond']">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7A4F4C]/60" />
                  No spam, ever
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7A4F4C]/60" />
                  Unsubscribe anytime
                </span>
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#7A4F4C]/60" />
                  Free book by email
                </span>
              </div>
            </Reveal>

            {/* Right: Book Cover + Form Card */}
            <Reveal direction="right" delay={0.2} duration={0.6}>
              <GlassCard className="border-[#B59A6A]/20 p-6 md:p-8">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-[140%] h-[2px] bg-gradient-to-l from-[#C9A3A0] to-transparent origin-top-right rotate-[-45deg] translate-y-[14px] translate-x-[14px]" />
                </div>

                {/* Book Preview */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#4A3B3A]/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#C9A3A0]/40 to-transparent rounded-lg blur-sm" />
                    <img 
                      src="/prequel-cover.jpg" 
                      alt="The First Acquisition" 
                      className="relative w-20 h-28 object-cover rounded-lg shadow-xl"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#4A3B3A] text-[#FAF7F7] text-[10px] font-bold px-2 py-0.5 rounded-full font-['Cormorant_Garamond']">
                      FREE
                    </div>
                  </div>
                  <div>
                    <p className="text-[#7A4F4C] text-xs font-semibold font-['Cormorant_Garamond'] uppercase tracking-wider mb-1">
                      Your Free Gift
                    </p>
                    <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#4A3B3A] leading-tight">
                      The First Acquisition
                    </h3>
                    <p className="text-[#6E5F5A] text-xs font-['Cormorant_Garamond'] mt-1">
                      A Manhattan Billionaire Romance (Hudson Dynasty)
                    </p>
                  </div>
                </div>

                {/* Signup — MailerLite embedded form (k0kQw5) */}
                <MailerLiteForm formId="k0kQw5" />

                {/* Expectation setting — improves open rates & reduces spam complaints */}
                <p className="text-xs text-[#6E5F5A] text-center font-['Cormorant_Garamond'] mt-4 leading-relaxed">
                  Expect about <span className="text-[#7A4F4C]">a couple of emails a month</span>. Your free
                  free book is included when you join. Check your inbox and the promotions tab.
                </p>

                {/* Explicit consent — GDPR / CAN-SPAM compliant */}
                <p className="text-[11px] text-[#6E5F5A] text-center font-['Cormorant_Garamond'] mt-3 leading-relaxed">
                  By subscribing, you agree to receive marketing emails from Reese Astor and accept
                  our{' '}
                  <Link href="/privacy">
                    <span className="text-[#6E5F5A] underline underline-offset-2 hover:text-[#7A4F4C] cursor-pointer">
                      Privacy Policy
                    </span>
                  </Link>
                  . No spam. Unsubscribe in one click anytime.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ──────────────────────────────────────────── */}
      <section className="relative z-10 py-16 md:py-24">
        <GlowOrb color="rgba(201, 163, 160,0.18)" size={460} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <GlowOrb color="rgba(201, 163, 160,0.12)" size={320} className="top-[20%] right-[5%]" />

        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-[#7A4F4C] text-sm font-semibold font-['Cormorant_Garamond'] uppercase tracking-widest mb-3">
              What You'll Get
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-[#4A3B3A]">
              More Than Just a Newsletter
            </h2>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {[
              {
                icon: BookOpen,
                title: "New Release Alerts",
                description: "Be the first to know when a new Hudson Dynasty book drops",
              },
              {
                icon: Sparkles,
                title: "Bonus Scenes",
                description: "Bonus scenes from the Hudson Dynasty books, sent to subscribers.",
              },
              {
                icon: Heart,
                title: "First Looks",
                description: "Early cover reveals, release dates, and the occasional behind-the-scenes note.",
              },
              {
                icon: Star,
                title: "Exclusive Giveaways",
                description: "Subscriber-only notes and special reader experiences",
              },
            ].map((benefit) => (
              <StaggerItem key={benefit.title}>
                <GlassCard className="group p-6 border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 h-full">
                  <div className="bg-[#C9A3A0]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-[#C9A3A0]/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-[#7A4F4C]" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4A3B3A] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#6E5F5A] text-sm font-['Cormorant_Garamond'] leading-relaxed">
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
            <p className="text-[#7A4F4C] text-sm font-semibold font-['Cormorant_Garamond'] uppercase tracking-widest mb-3">
              The Hudson Dynasty
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-4">
              A Family Built on Acquisitions. A Ledger That Remembers Everything.
            </h2>
            <p className="text-[#6E5F5A] font-['Cormorant_Garamond'] max-w-2xl mx-auto">
              Start with the free Hudson Dynasty prequel, then read on with Hostile Tender, Poison Pill and Golden Parachute.
            </p>
          </Reveal>

          {/* Book covers row */}
          <StaggerReveal className="flex justify-center items-end gap-3 md:gap-6 mb-12" stagger={0.1}>
            {BOOKS.filter((b) => b.lane === "hudson_dynasty" && b.cover_image)
              .sort((x, y) => (x.series_position ?? 0) - (y.series_position ?? 0))
              .map((b) => ({
                src: b.cover_image as string,
                label: b.series_position === 0 ? "FREE prequel" : b.position_label,
                alt: b.title,
              }))
              .map((book, i) => (
              <StaggerItem key={book.alt} className={`relative group ${i === 0 ? 'z-10' : ''}`}>
                <div className={`relative ${i === 0 ? 'ring-2 ring-[#C9A3A0]/50 rounded-lg' : ''}`}>
                  <img
                    src={book.src}
                    alt={book.alt}
                    className={`rounded-lg shadow-xl object-cover transition-transform duration-300 group-hover:scale-105 ${
                      i === 0 ? 'w-24 h-36 md:w-32 md:h-48' : 'w-20 h-30 md:w-28 md:h-42'
                    }`}
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold font-['Cormorant_Garamond'] px-2 py-0.5 rounded-full whitespace-nowrap ${
                    i === 0 
                      ? 'bg-[#4A3B3A] text-[#FAF7F7]' 
                      : 'bg-[#EBD6D3]/60 text-[#6E5F5A] border border-[#4A3B3A]/20'
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
              <span className="inline-flex items-center gap-2 text-[#7A4F4C] font-semibold font-['Cormorant_Garamond'] hover:underline underline-offset-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                See all the books
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
            <GlassCard className="border-[#B59A6A]/20 p-8 md:p-12">
              <Gift className="w-10 h-10 text-[#7A4F4C] mx-auto mb-4" />
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-4">
                Don't Miss Out
              </h2>
              <p className="text-[#6E5F5A] font-['Cormorant_Garamond'] mb-8 max-w-lg mx-auto">
                Join readers who get new-release news and a free book, all delivered to their inbox. About two emails a month, no spam.
              </p>

              {/* MailerLite embedded form (k0kQw5) */}
              <div className="max-w-md mx-auto">
                <MailerLiteForm formId="k0kQw5" />
              </div>

                {/* Deliverability tip — boosts inbox placement & engagement */}
                <p className="text-[11px] text-[#6E5F5A] text-center font-['Cormorant_Garamond'] mt-4 leading-relaxed max-w-md mx-auto">
                  Tip: add <span className="text-[#7A4F4C]">hello@reeseastor.com</span> to your
                  contacts so your free book never lands in spam. Unsubscribe anytime. See our{' '}
                  <Link href="/privacy">
                    <span className="text-[#6E5F5A] underline underline-offset-2 hover:text-[#7A4F4C] cursor-pointer">
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
  // The enemies-to-lovers reading list stays pinned as the first card.
  const recentPosts = pinPost(posts);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#B59A6A]" />
      </div>
    );
  }

  if (recentPosts.length === 0) return null;

  return (
    <div>
      <Reveal className="text-center mb-10">
        <p className="text-[#7A4F4C] text-sm font-semibold font-['Cormorant_Garamond'] uppercase tracking-widest mb-3">
          Latest from Reese
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-3">
          A Taste of What's in Your Inbox
        </h2>
        <p className="text-[#6E5F5A] font-['Cormorant_Garamond']">
          Here's the kind of content subscribers get first
        </p>
      </Reveal>

      <StaggerReveal className="grid md:grid-cols-3 gap-6 mb-8" stagger={0.1}>
        {recentPosts.map((post) => (
          <StaggerItem key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <GlassCard className="group border-[#4A3B3A]/10 overflow-hidden hover:border-[#B59A6A]/30 h-full flex flex-col">
                <div className="p-5 pb-0">
                  <span className="inline-block bg-[#C9A3A0]/10 text-[#7A4F4C] text-xs font-semibold font-['Cormorant_Garamond'] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#4A3B3A] mb-3 line-clamp-2 group-hover:text-[#7A4F4C] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#6E5F5A] text-sm font-['Cormorant_Garamond'] mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-[#4A3B3A]/10">
                    <span className="flex items-center gap-1 text-[#6E5F5A] font-['Cormorant_Garamond']">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[#7A4F4C] font-semibold font-['Cormorant_Garamond'] flex items-center gap-1 group-hover:gap-2 transition-all text-xs">
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
          <span className="inline-flex items-center gap-2 text-[#7A4F4C] font-semibold font-['Cormorant_Garamond'] hover:underline underline-offset-4 cursor-pointer transition-all">
            View All Blog Posts
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
