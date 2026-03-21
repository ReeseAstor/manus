import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { BookOpen, ChevronRight, Star, Gift, Flame, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import NewReleaseSignup from "@/components/NewReleaseSignup";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function Home() {
  useEffect(() => {
    document.title = "Reese Astor | USA Today Bestselling Romance Author";
  }, []);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Reese Astor",
    "url": "https://reeseastor.com",
    "description": "Official website of Reese Astor, USA Today Bestselling romance author of the Manhattan Money Kings series.",
    "author": {
      "@type": "Person",
      "name": "Reese Astor",
      "url": "https://reeseastor.com/about",
      "jobTitle": "Romance Author & Writing Coach",
      "sameAs": [
        "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
        "https://www.instagram.com/reeseastor"
      ]
    }
  };

  const books = [
    {
      id: 4,
      title: "The Billionaire's Forbidden Nanny: Forbidden and Forever",
      subtitle: "Manhattan Money Kings Book 4 (LAST BOOK)",
      cover: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg",
      description: "She's the nanny. He's her boss. His mother wants her gone. When Camille Torres takes a job caring for Ethan Calloway's silent daughter, she becomes the family they both desperately need.",
      price: "$3.99",
      link: "https://swiy.co/4rd",
      badge: "Final Book",
    },
    {
      id: 3,
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane discovers the daughter he never knew existed, he'll stop at nothing to claim his family.",
      price: "$3.99",
      link: "https://swiy.co/3rd",
      badge: "New Release",
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "When thief Elena Kim breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse.",
      price: "$3.99",
      link: "https://swiy.co/2rd",
    },
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      price: "$3.99",
      link: "https://swiy.co/b01",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="Reese Astor | USA Today Bestselling Romance Author"
        description="Discover the Manhattan Money Kings series by USA Today Bestselling author Reese Astor. Steamy billionaire romances set in New York City. Get a free book today."
        canonical="/"
        keywords={["Reese Astor", "romance author", "billionaire romance", "Manhattan Money Kings", "steamy romance books", "USA Today bestselling author", "free romance book"]}
        structuredData={[homeStructuredData]}
      />

      
      {/* Manhattan Penthouse Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Penthouse View Background with Parallax */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a]" />
        </div>

        {/* Gold Ambient Light Effect */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />
        
        <div className="container relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
                <Star className="h-4 w-4 text-[#d4af37]" fill="#d4af37" />
                <span className="text-sm font-medium text-[#d4af37] tracking-wide">
                  USA TODAY BESTSELLING AUTHOR
                </span>
              </div>

              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                <span className="text-white">Manhattan</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                  Money Kings
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl font-light">
                Where power, passion, and billion-dollar secrets collide in the heart of Manhattan's elite.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-semibold px-8 py-7 rounded-full text-lg shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
                >
                  <a href="https://get.reeseastor.com/kw1yge3479" target="_blank" rel="noopener noreferrer">
                    <Gift className="mr-2 h-5 w-5" />
                    Get Your Free Book
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full text-lg transition-all duration-300 hover:border-[#d4af37]/50"
                >
                  <Link href="/books">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore the Series
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">4</div>
                  <div className="text-sm text-gray-400 mt-1">Books</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">10K+</div>
                  <div className="text-sm text-gray-400 mt-1">Readers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4af37]">★ 4.8</div>
                  <div className="text-sm text-gray-400 mt-1">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Featured Book */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-12 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
              
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#e8c4c4] to-[#d4af37] text-black text-sm font-bold shadow-lg">
                  Final Book
                </div>

                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg"
                  alt="The Billionaire's Forbidden Nanny"
                  className="w-full rounded-2xl shadow-2xl mb-6"
                />

                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  The Billionaire's Forbidden Nanny
                </h3>
                <p className="text-[#d4af37] font-medium mb-4">Manhattan Money Kings Book 4</p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  He hired her to care for his daughter. He never expected to fall for her.
                </p>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <a href="https://swiy.co/4rd" target="_blank" rel="noopener noreferrer">
                    Buy Now
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#d4af37] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* FREE BOOK OFFER - Prominent Lead Magnet Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#1a1020] to-[#0a0e1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center p-10 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-[#1a1428]/80 to-[#d4af37]/5 border-2 border-[#d4af37]/30 backdrop-blur-xl shadow-2xl shadow-[#d4af37]/5 relative overflow-hidden">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#d4af37]/40 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#d4af37]/40 rounded-br-3xl pointer-events-none" />
              
              {/* Book Cover */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -inset-8 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <div className="relative">
                  <div className="absolute -top-5 -right-5 z-10 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-lg shadow-2xl">
                    100% FREE
                  </div>
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/uMHRMKanHXREGUzc.jpeg"
                    alt="The First Acquisition - Free Book"
                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-black/50"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-xl">
                  <Gift className="h-4 w-4" />
                  FREE BOOK FOR NEW READERS
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Start the Series<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">For Free</span>
                </h2>
                
                <p className="text-2xl text-white font-semibold font-serif">
                  The First Acquisition
                </p>
                <p className="text-[#d4af37] font-medium">
                  A Manhattan Billionaire Romance
                </p>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  Power. Passion. Manhattan. When a ruthless billionaire sets his sights on what he wants, nothing stands in his way — not even the woman who was never part of the deal. Get this steamy full-length romance free when you join Reese Astor's VIP reader list.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-lg px-10 py-7 rounded-full shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
                  >
                    <a href="https://get.reeseastor.com/kw1yge3479" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-6 w-6" />
                      Get My Free Book
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full transition-all duration-300 hover:border-[#d4af37]/50"
                  >
                    <Link href="/free-book">
                      Learn More
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-gray-300 text-sm">
                    Loved by <span className="text-white font-semibold">1,700+</span> readers
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Book Showcase - Magazine Style */}
      <section className="py-32 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-6">
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                The Complete Series
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Four Billionaires.<br />Four Unforgettable Romances.
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Dive into the world of Manhattan's most powerful men and the women who capture their hearts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10">
                  {book.badge && (
                    <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black text-xs font-bold shadow-lg z-10">
                      {book.badge}
                    </div>
                  )}

                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[#d4af37] text-sm font-medium">{book.subtitle}</p>
                    </div>

                    <p className="text-gray-400 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-bold text-white">{book.price}</span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-white/10 hover:bg-[#d4af37] hover:text-black border border-white/20 hover:border-[#d4af37] text-white font-semibold px-6 py-5 rounded-full transition-all duration-300"
                      >
                        <a href={book.link} target="_blank" rel="noopener noreferrer">
                          Buy Now
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-white font-semibold px-10 py-7 rounded-full text-lg transition-all duration-300 hover:border-[#d4af37]"
            >
              <Link href="/books">
                View Complete Series
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Hudson Dynasty - Coming Soon Teaser */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#12091e] to-[#0a0e1a]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[180px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#d4af37]/8 via-[#1a1428]/80 to-[#d4af37]/3 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#d4af37]/30 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-3xl pointer-events-none" />

              {/* Book Covers - Dual Display */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -inset-6 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
                <div className="relative flex items-end justify-center gap-4">
                  <div className="absolute -top-4 right-0 z-10 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-2xl flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Coming Soon
                  </div>
                  <Link href="/books/audit-of-the-heart">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/audit-of-the-heart-cover-v2-CiyiXxZuMB4J9rT8axkMQv.webp"
                      alt="Audit of the Heart - Hudson Dynasty Book 1"
                      className="relative w-full max-w-[200px] rounded-xl shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link href="/books/hostile-tender">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/hostile-tender-cover-v2-iH5fGgkRQVjWbk2TchYPdH.webp"
                      alt="Hostile Tender - Hudson Dynasty Book 2"
                      className="relative w-full max-w-[200px] rounded-xl shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </motion.div>

              {/* Content */}
              <div className="space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5">
                  <Flame className="h-4 w-4 text-[#d4af37]" />
                  <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                    New Series
                  </span>
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                  Hudson Dynasty
                </h2>
                
                <p className="text-xl text-white font-semibold font-serif">
                  Audit of the Heart &bull; Hostile Tender
                </p>
                <p className="text-[#d4af37] font-medium">
                  2 Books &bull; Corporate Billionaire Romance
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {["Enemies to Lovers", "Forced Proximity", "Fake Engagement", "Cat & Mouse"].map((trope) => (
                    <Badge 
                      key={trope} 
                      variant="outline" 
                      className="text-xs border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37]"
                    >
                      {trope}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  Manhattan high finance meets scorching romance. Compliance attorneys, forensic auditors, and the billionaires who can't control them. Two standalone novels of power, scandal, and irresistible desire.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/books#hudson-dynasty">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Learn More
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full transition-all duration-300 hover:border-[#d4af37]/50"
                  >
                    <Link href="/free-book">
                      <Gift className="mr-2 h-5 w-5" />
                      Get Notified at Launch
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Release Mailing List Sign-Up */}
      <NewReleaseSignup />
    </div>
  );
}
