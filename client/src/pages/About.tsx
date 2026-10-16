import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { BookOpen, Heart, Sparkles, Quote, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { Reveal, StaggerReveal, StaggerItem, GlowOrb, GlassCard } from "@/components/author-kit";

export default function About() {
  useEffect(() => {
    document.title = "About Reese Astor | Romance Author";
  }, []);

  const authorStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Reese Astor",
    "url": "https://reeseastor.com/about",
    "jobTitle": "Romance Author & Writing Coach",
    "description": "Romance author of the Manhattan Money Kings series.",
    "sameAs": [
      "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
      "https://www.instagram.com/reeseastor"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="About Reese Astor | Romance Author"
        description="Meet Reese Astor, author of steamy billionaire romances. Discover the story behind the Manhattan Money Kings and Hudson Dynasty series."
        canonical="/about"
        keywords={["Reese Astor biography", "romance author", "writing coach", "Manhattan Money Kings author", "about Reese Astor"]}
        structuredData={[authorStructuredData]}
      />

      {/* Hero Section - Sophisticated Profile with Author Photo */}
      <section className="relative py-32 overflow-hidden">
        <GlowOrb color="rgba(212,175,55,0.18)" size={520} className="-top-32 -left-32" />
        <GlowOrb color="rgba(110,31,46,0.12)" size={420} className="top-1/3 -right-20" />

        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Author Photo */}
            <Reveal direction="right" duration={1} className="relative order-2 lg:order-1">
              <div className="relative max-w-md mx-auto">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-2xl" />
                <div className="absolute -inset-2 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-xl" />
                
                <img
                  src="/images/reese-astor-author.png"
                  alt="Reese Astor - Romance Author"
                  className="relative rounded-xl shadow-2xl w-full object-cover aspect-[3/4]"
                />
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Romance Author
                </div>
              </div>
            </Reveal>

            {/* Author Info */}
            <Reveal direction="up" duration={1} className="order-1 lg:order-2 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                  About the Author
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Reese Astor
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                Author of the Manhattan Money Kings and Hudson Dynasty Series
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4af37]">Manhattan Money Kings</div>
                  <div className="text-sm text-gray-400 mt-1">Series</div>
                </div>
                <div className="h-12 w-px bg-white/20 hidden sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4af37]">Hudson Dynasty</div>
                  <div className="text-sm text-gray-400 mt-1">Series</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story Section - Editorial Layout */}
      <section className="py-32 relative ambient-section">
        <GlowOrb color="rgba(212,175,55,0.15)" size={480} className="top-1/4 -left-40" />
        <GlowOrb color="rgba(110,31,46,0.12)" size={360} className="bottom-1/4 -right-32" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <Reveal className="space-y-12">
              {/* Quote */}
              <GlassCard className="p-12 rounded-3xl !border-2 !border-[#d4af37]/20 !bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5">
                <Quote className="absolute top-8 left-8 h-12 w-12 text-[#d4af37]/30" />
                <blockquote className="relative z-10 text-2xl md:text-3xl font-serif text-white leading-relaxed text-center italic pt-8">
                  "I believe romance novels are more than just entertainment—they're empowerment."
                </blockquote>
              </GlassCard>

              {/* Bio Content */}
              <GlassCard className="p-10 rounded-3xl">
                <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
                    My Journey
                  </h2>
                  <div className="space-y-6">
                    <p>
                      I write steamy romance novels, creating worlds where passion and power collide.
                    </p>
                    <p>
                      I also share what I have learned about writing and publishing with aspiring authors.
                    </p>
                    <p>
                      Today, I'm a romance author with the Manhattan Money Kings and Hudson Dynasty series, and I write about the business of being an author for writers building their own careers.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
      {/* What I Do - Luxury Cards */}
      <section className="py-20 relative ambient-section">
        <GlowOrb color="rgba(212,175,55,0.16)" size={500} className="top-0 left-1/3 -translate-x-1/2" />
        <GlowOrb color="rgba(110,31,46,0.13)" size={380} className="bottom-20 -right-24" />

        <div className="container">
          <Reveal className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                What I Do
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Crafting stories that empower and building businesses that inspire
              </p>
            </div>

            <StaggerReveal className="grid md:grid-cols-3 gap-8" stagger={0.12}>
              <StaggerItem className="h-full">
                <GlassCard className="group h-full p-8 rounded-3xl hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4af37]/10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4">
                    Write Romance
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Crafting steamy billionaire romance novels with strong heroines, powerful heroes, and guaranteed happily-ever-afters that make hearts race.
                  </p>
                </GlassCard>
              </StaggerItem>

              <StaggerItem className="h-full">
                <GlassCard className="group h-full p-8 rounded-3xl hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4af37]/10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4">
                    Teach & Mentor
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Teaching aspiring authors the business side of writing—from KDP mastery to marketing strategies that actually convert readers into fans.
                  </p>
                </GlassCard>
              </StaggerItem>

              <StaggerItem className="h-full">
                <GlassCard className="group h-full p-8 rounded-3xl hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4af37]/10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4">
                    Empower Women
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Helping women turn their creative passion into profitable businesses and build the freedom-based lifestyle they deserve.
                  </p>
                </GlassCard>
              </StaggerItem>
            </StaggerReveal>
          </Reveal>
        </div>
      </section>

      {/* Writing Philosophy - Feature Section */}
      <section className="py-20 relative overflow-hidden ambient-section">
        <GlowOrb color="rgba(212,175,55,0.15)" size={420} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

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

        <div className="container relative z-10">
          <Reveal className="max-w-4xl mx-auto">
            <GlassCard className="p-12 md:p-16 rounded-3xl !border-2 !border-[#d4af37]/20 !bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                  My Writing Philosophy
                </h2>
              </div>

              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  I believe romance novels are more than just entertainment—they're empowerment. My stories feature strong, independent women who don't need saving but choose partnership. They're about equals finding love while building empires, raising families, and changing the world.
                </p>
                <p>
                  Every book I write celebrates female ambition, sexual agency, and the radical idea that women can have it all: the career, the love, the passion, and the happily-ever-after.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Expertise - Grid Layout */}
      <section className="py-20 relative ambient-section">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <Reveal className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Areas of Expertise
              </h2>
              <p className="text-xl text-gray-400">
                Blending creative storytelling with business acumen
              </p>
            </div>

            <StaggerReveal className="grid md:grid-cols-2 gap-4" stagger={0.08}>
              {[
                "Romance Writing",
                "KDP Publishing",
                "Author Marketing",
                "Business Strategy",
                "Creative Entrepreneurship",
                "Content Creation",
                "Brand Building",
                "Reader Engagement",
              ].map((skill) => (
                <StaggerItem key={skill} className="h-full">
                  <GlassCard className="flex items-center gap-4 p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all duration-300 group h-full">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] group-hover:scale-125 transition-transform" />
                    <span className="text-white font-medium text-lg">{skill}</span>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </Reveal>
        </div>
      </section>

      {/* CTA Section - Elegant */}
      <section className="py-32 relative ambient-section">
        <GlowOrb color="rgba(212,175,55,0.18)" size={460} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="container">
          <Reveal className="max-w-4xl mx-auto">
            <GlassCard className="text-center p-12 md:p-16 rounded-3xl shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-8">
                <Heart className="h-8 w-8 text-[#d4af37]" />
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Let's Connect
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Whether you're here for steamy romance or writing inspiration, I'm excited to have you in my world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/books">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Read My Books
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-10 py-7 rounded-full"
                >
                  <a href="https://dl.bookfunnel.com/kw1yge3479" target="_blank" rel="noopener noreferrer">
                    Get Your Free Book
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
