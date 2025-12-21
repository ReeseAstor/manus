import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Sparkles, Quote, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Hero Section - Sophisticated Profile with Author Photo */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/manhattan-penthouse-view.jpg')",
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
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative order-2 lg:order-1"
            >
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
                  USA Today Bestseller
                </div>
              </div>
            </motion.div>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="order-1 lg:order-2 text-center lg:text-left space-y-8"
            >
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
                From Corporate Finance VP to USA TODAY Bestselling Romance Author
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#d4af37]">100K+</div>
                  <div className="text-sm text-gray-400 mt-1">Readers</div>
                </div>
                <div className="h-12 w-px bg-white/20 hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#d4af37]">4</div>
                  <div className="text-sm text-gray-400 mt-1">Books Published</div>
                </div>
                <div className="h-12 w-px bg-white/20 hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#d4af37]">★ 4.7</div>
                  <div className="text-sm text-gray-400 mt-1">Average Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section - Editorial Layout */}
      <section className="py-32 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              {/* Quote */}
              <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl">
                <Quote className="absolute top-8 left-8 h-12 w-12 text-[#d4af37]/30" />
                <blockquote className="relative z-10 text-2xl md:text-3xl font-serif text-white leading-relaxed text-center italic pt-8">
                  "I believe romance novels are more than just entertainment—they're empowerment."
                </blockquote>
              </div>

              {/* Bio Content */}
              <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
                <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
                    My Journey
                  </h2>
                  <div className="space-y-6">
                    <p>
                      I spent years climbing the corporate ladder as a VP in finance, mastering spreadsheets and boardroom negotiations. But at night, I was writing steamy romance novels, creating worlds where passion and power collide.
                    </p>
                    <p>
                      The turning point came when I realized I could help other women do the same—turn their creative dreams into profitable businesses. I left corporate America to write full-time and teach aspiring authors the business strategies that actually work.
                    </p>
                    <p>
                      Today, I'm a USA TODAY bestselling romance author with the Manhattan Money Kings series and a business strategist helping women build sustainable author careers. I bring my corporate expertise to the creative world, showing writers how to treat their passion like the business it deserves to be.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I Do - Luxury Cards */}
      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                What I Do
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Crafting stories that empower and building businesses that inspire
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  Write Romance
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Crafting steamy billionaire romance novels with strong heroines, powerful heroes, and guaranteed happily-ever-afters that make hearts race.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  Teach & Mentor
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Teaching aspiring authors the business side of writing—from KDP mastery to marketing strategies that actually convert readers into fans.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  Empower Women
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Helping women turn their creative passion into profitable businesses and build the freedom-based lifestyle they deserve.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Writing Philosophy - Feature Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/manhattan-night-skyline.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Expertise - Grid Layout */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/gold-marble-texture.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Areas of Expertise
              </h2>
              <p className="text-xl text-gray-400">
                Blending creative storytelling with business acumen
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Romance Writing",
                "KDP Publishing",
                "Author Marketing",
                "Business Strategy",
                "Creative Entrepreneurship",
                "Content Creation",
                "Brand Building",
                "Reader Engagement",
              ].map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 group"
                >
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] group-hover:scale-125 transition-transform" />
                  <span className="text-white font-medium text-lg">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* My Writing Desk - Gallery Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm mb-6">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                  Behind the Scenes
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                My Writing Desk
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A peek into where the magic happens—my cozy workspace and favorite writing tools
              </p>
            </div>

            {/* Main Desk Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/images/writing-desk-main.png"
                alt="My cozy writing desk setup"
                className="relative w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md">
                <p className="text-white font-medium">Where Every Story Begins</p>
                <p className="text-gray-300 text-sm">My antique desk by the window, complete with fresh flowers and endless cups of coffee</p>
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src="/images/writing-tools-notebook.png"
                  alt="Leather journal and fountain pen"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-semibold mb-1">Plot Planning</h4>
                  <p className="text-gray-300 text-sm">My leather journal where every love story starts as handwritten notes</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src="/images/writing-tools-books.png"
                  alt="Bookshelf with romance novels"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-semibold mb-1">Inspiration Corner</h4>
                  <p className="text-gray-300 text-sm">My collection of favorite romance novels and writing guides</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src="/images/writing-tools-coffee.png"
                  alt="Coffee and reading setup"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-semibold mb-1">Morning Ritual</h4>
                  <p className="text-gray-300 text-sm">Coffee, chocolate, and a good book—the perfect writing fuel</p>
                </div>
              </motion.div>
            </div>

            {/* Writing Tools List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <h3 className="font-serif text-2xl font-bold text-white mb-6 text-center">My Favorite Writing Tools</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Scrivener", desc: "For organizing complex plots" },
                  { name: "Leather Journal", desc: "For handwritten brainstorms" },
                  { name: "Noise-canceling headphones", desc: "For deep focus sessions" },
                  { name: "Endless coffee", desc: "The real secret ingredient" },
                ].map((tool, index) => (
                  <div key={tool.name} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-3">
                      <span className="text-[#d4af37] font-bold">{index + 1}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{tool.name}</h4>
                    <p className="text-gray-400 text-sm">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Elegant */}
      <section className="py-32 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl"
          >
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
                className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                <Link href="/free-book">
                  Get Free Prequel
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
