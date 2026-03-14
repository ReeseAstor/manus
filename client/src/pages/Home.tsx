import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Star } from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "wouter";
import NewReleaseSignup from "@/components/NewReleaseSignup";

export default function Home() {

  const books = [
    {
      id: 4,
      title: "The Billionaire's Forbidden Nanny: Forbidden and Forever",
      subtitle: "Manhattan Money Kings Book 4 (LAST BOOK)",
      cover: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg",
      description: "She's the nanny. He's her boss. His mother wants her gone. When Camille Torres takes a job caring for Ethan Calloway's silent daughter, she becomes the family they both desperately need.",
      price: "$4.99",
      link: "https://swiy.co/4rd",
      badge: "Final Book",
    },
    {
      id: 3,
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane discovers the daughter he never knew existed, he'll stop at nothing to claim his family.",
      price: "$2.99",
      link: "https://swiy.co/3rd",
      badge: "New Release",
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "When thief Elena Kim breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse.",
      price: "$2.99",
      link: "https://swiy.co/2rd",
    },
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      price: "$0.99",
      link: "https://swiy.co/b01",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">

      
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
                  <Link href="/books">
                    Explore the Series
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full text-lg transition-all duration-300 hover:border-[#d4af37]/50"
                >
                  <Link href="/free-book">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Get Free Prequel
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

      {/* Free Prequel - Luxury Offer Section */}
      <section className="py-32 relative overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl">
              {/* Book Cover */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -inset-8 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <img
                  src="/prequel-cover.jpg"
                  alt="The Billionaire's One Night Stand - Free Prequel"
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-xl">
                  FREE NEWSLETTER BONUS
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Start Your Journey<br />
                  <span className="text-[#d4af37]">For Free</span>
                </h2>
                
                <p className="text-2xl text-white font-semibold">
                  The Billionaire's One Night Stand
                </p>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  Victoria Cruz was just passed over for partnership. James Chen is the billionaire who offers her one night to forget. But when he acquires her firm without warning, their passionate encounter becomes a corporate battlefield. Get this steamy enemies-to-lovers novella free!
                </p>

                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-lg px-10 py-7 rounded-full shadow-2xl shadow-[#d4af37]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#d4af37]/50"
                >
                  <a href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-6 w-6" />
                    Download Free Now
                  </a>
                </Button>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                  <img src="/prequel-qr.png" alt="QR Code" className="w-24 h-24 rounded-lg border-2 border-[#d4af37]/30" />
                  <div className="text-sm text-gray-400 text-left">
                    <p className="font-semibold text-white">Scan to download</p>
                    <p>or get it on <a href="https://swiy.co/3rd" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline">Amazon</a></p>
                  </div>
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
