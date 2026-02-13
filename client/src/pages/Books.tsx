import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, BookOpen, Gift, ChevronRight, Sparkles } from "lucide-react";
import { Book4PreorderBanner } from "@/components/Book4PreorderBanner";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Books() {
  const books = [
    {
      id: 4,
      title: "The Billionaire's Forbidden Nanny: Forbidden and Forever",
      subtitle: "Manhattan Money Kings Book 4 (LAST BOOK)",
      cover: "/book4-cover.jpg",
      description: "She's the nanny. He's her boss. His mother wants her gone. When Camille Torres takes a job caring for billionaire Ethan Calloway's silent daughter, she never expected to become the family they both desperately need.",
      fullBlurb: "She's the nanny. He's her boss. His mother wants her gone.\n\nCamille Torres doesn't belong in a Park Avenue penthouse. She belongs in the Bronx, finishing her teaching degree and keeping her family afloat. But when a billionaire offers her a salary that could change everything, she takes the job—and walks straight into trouble.\n\nEthan Calloway hasn't smiled since his wife died. His five-year-old daughter hasn't spoken. Seven nannies have quit. He doesn't need another complication—especially not one with quick wit, warm hands, and a mouth that talks back.\n\nBut Lily starts drawing again. Then laughing. Then reaching for Camille like she's safety.\n\nAnd Ethan? He's reaching too.\n\nOne kiss in the kitchen. One night that changes everything. One secret that his mother will use to destroy them both.\n\nGloria Calloway doesn't lose. She has money, connections, and a custody lawyer on speed dial. Camille has a thrift-store blazer and the Bronx.\n\nBut she also has something Gloria will never understand:\nA little girl who finally calls her Mama.",
      price: "$0.99",
      regularPrice: "$4.99",
      link: "https://swiy.co/4rd",
      genre: ["Nanny Romance", "Widower", "Forbidden Love", "Found Family"],
      pages: 350,
      rating: 0,
      reviews: 0,
      available: true,
      badge: "Pre-Order - Final Book",
      featured: true,
      preorder: true,
      launchDate: "February 3, 2026",
    },
    {
      id: 3,
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden.",
      fullBlurb: "Three years ago, Sophia Reed walked away from a hotel room and a man she should've never trusted—rising mogul Dominic Kane. She built stability the hard way: early trains, late invoices, and a tiny apartment where nothing could touch the life growing inside her. Now the CEO who controls outcomes for a living is back… and the daughter Sophia's protected has the storm-gray eyes he can't deny. When Dominic returns to reclaim his empire, he discovers the truth he was never meant to miss—and a city eager to devour the scandal. He can buy silence, clear rooms, bend markets. But Sophia has rules: boundaries around her child, transparency instead of power plays, and love that's earned, not purchased. Between boardroom wars, paparazzi flash storms, and a custody fight waiting to ignite, he has to become more than a headline and more than a boss. He has to be the father Bella needs…and the partner Sophia deserves.",
      price: "$2.99",
      regularPrice: "$4.99",
      link: "https://swiy.co/3rd",
      genre: ["Secret Baby", "Second Chance", "Billionaire Romance"],
      pages: 340,
      rating: 4.9,
      reviews: 523,
      available: true,
      badge: "New Release",
      featured: true,
      audioSampleUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book3-sample-1767436046982.mp3",
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "When thief Elena Kim breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse.",
      fullBlurb: "Elena Kim never expected her latest heist to go wrong. Breaking into billionaire David Kim's penthouse was supposed to be her ticket to freedom. Instead, she finds herself caught by a man who's more dangerous—and more compelling—than any mark she's ever targeted. David Kim built his empire on control, precision, and never letting anyone get close. But this beautiful thief has shattered every rule he lives by. Instead of turning her over to the police, he offers a deal: marry him for 12 months in exchange for protection from her violent father. As they work together, their forced alliance ignites into something neither expected. With her father's threats escalating and David's empire at risk, Elena must decide: betray the man she's falling for, or risk everything for a chance at redemption and love.",
      price: "$2.99",
      regularPrice: "$4.99",
      link: "https://www.amazon.com/dp/B0FCCBNF8X",
      genre: ["Fake Marriage", "Suspense", "Billionaire Romance"],
      pages: 350,
      rating: 4.7,
      reviews: 892,
      available: true,
      audioSampleUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book2-sample-1767436022553.mp3",
    },
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or workplace scandal.",
      fullBlurb: "Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or workplace scandal. When Sarah uncovers financial sabotage orchestrated by Michael's ruthless competitor, they're forced into a dangerous alliance that crosses every professional boundary. Their forbidden attraction ignites amid corporate espionage, blackmail, and media scrutiny—with both their careers and reputations hanging in the balance. As they fight to expose the truth, Sarah must decide: sacrifice her growing feelings to protect the Redwood project, or risk everything for a relationship that could destroy them both.",
      price: "$0.99",
      regularPrice: "$4.99",
      link: "https://www.amazon.com/dp/B0F2W8QL7S",
      genre: ["Billionaire Romance", "Office Romance", "Steamy"],
      pages: 320,
      rating: 4.5,
      reviews: 1247,
      available: true,
      audioSampleUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book1-sample-1767436000744.mp3",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <Book4PreorderBanner />
      
      {/* Hero Section - Editorial Magazine Style */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/95 via-[#0a0e1a]/90 to-[#0a0e1a]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                The Complete Series
              </span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              <span className="text-white">Manhattan</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                Money Kings
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
              Where power, passion, and billion-dollar secrets collide in the heart of Manhattan's elite
            </p>

            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#d4af37]">4</div>
                <div className="text-sm text-gray-400 mt-1">Books</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold text-[#d4af37]">★ 4.7</div>
                <div className="text-sm text-gray-400 mt-1">Average Rating</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold text-[#d4af37]">2.6K+</div>
                <div className="text-sm text-gray-400 mt-1">Reviews</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Prequel - Premium Offer Banner */}
      <section className="py-16 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-3 gap-8 items-center p-10 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <img
                  src="/prequel-cover.jpg"
                  alt="The Billionaire's One Night Stand - Free Prequel"
                  className="relative w-full max-w-xs mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-lg">
                  <Gift className="h-4 w-4" />
                  FREE NEWSLETTER BONUS
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  The Billionaire's One Night Stand
                </h2>
                
                <p className="text-lg text-gray-300">
                  Victoria Cruz was just passed over for partnership at Manhattan's most prestigious law firm. James Chen is the billionaire tech mogul who offers her one night to forget everything. But when James acquires her firm without warning, their passionate encounter becomes a corporate battlefield.
                </p>
                
                {/* Audio Sample for Prequel */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-[#d4af37]/20">
                      <svg className="h-5 w-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Listen to Sample</p>
                      <p className="text-xs text-gray-400">Narrated excerpt from the prequel</p>
                    </div>
                  </div>
                  <audio 
                    controls 
                    className="w-full"
                    style={{
                      height: '40px',
                      filter: 'invert(1) hue-rotate(180deg)',
                    }}
                  >
                    <source src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book05-sample-1767435983947.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <a href="https://dl.bookfunnel.com/xrodg0t77p" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Download Free Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold"
                  >
                    <a href="https://swiy.co/3rd" target="_blank" rel="noopener noreferrer">
                      View on Amazon
                    </a>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                  <img src="/prequel-qr.png" alt="QR Code" className="w-16 h-16 rounded-lg border-2 border-[#d4af37]/30" />
                  <p className="text-xs text-gray-400">Scan QR code for instant access</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Books - Editorial Layout */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <div className="space-y-24">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Book Cover */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="relative group">
                      {book.badge && (
                        <div className="absolute -top-4 -right-4 z-10 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-2xl">
                          {book.badge}
                        </div>
                      )}
                      
                      <div className="absolute -inset-8 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
                      
                      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl group-hover:border-[#d4af37]/30 transition-all duration-500">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div>
                      <p className="text-sm text-[#d4af37] font-semibold tracking-widest uppercase mb-3">
                        {book.subtitle}
                      </p>
                      <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {book.title}
                      </h2>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {book.genre.map((g) => (
                          <Badge 
                            key={g} 
                            variant="outline" 
                            className="text-xs border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] hover:bg-[#d4af37]/10"
                          >
                            {g}
                          </Badge>
                        ))}
                      </div>

                      {book.rating > 0 && (
                        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(book.rating)
                                    ? "fill-[#d4af37] text-[#d4af37]"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white font-semibold">
                            {book.rating}
                          </span>
                          <span className="text-gray-400">
                            ({book.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                      )}

                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        {book.fullBlurb}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                        <span>{book.pages} pages</span>
                        <span>•</span>
                        <span>Available Now</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Audio Sample Player */}
                      {book.audioSampleUrl && (
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-[#d4af37]/20">
                              <svg className="h-5 w-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">Listen to Sample</p>
                              <p className="text-xs text-gray-400">Narrated excerpt from the book</p>
                            </div>
                          </div>
                          <audio 
                            controls 
                            className="w-full"
                            style={{
                              height: '40px',
                              filter: 'invert(1) hue-rotate(180deg)',
                            }}
                          >
                            <source src={book.audioSampleUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-white">{book.price}</span>
                        <span className="text-xl text-gray-500 line-through">
                          {book.regularPrice}
                        </span>
                        <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                          Limited Time
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          asChild
                          size="lg"
                          className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                          <a href={book.link} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Buy Now
                          </a>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white py-7"
                        >
                          <Link href={`/books/${book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                            <ChevronRight className="mr-2 h-5 w-5" />
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < books.length - 1 && (
                  <div className="mt-24 flex items-center justify-center">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Series Info - Luxury Card */}
      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6">
                <BookOpen className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                About the Series
              </h3>
            </div>
            
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                Welcome to Manhattan, where billion-dollar deals are made in boardrooms and hearts are won in bedrooms. The Manhattan Money Kings series follows powerful billionaires who rule the business world but find themselves powerless against the women who capture their hearts.
              </p>
              <p>
                Each book is a standalone romance with a guaranteed happily-ever-after, but they're best enjoyed in order to catch all the interconnected storylines and cameos from your favorite characters.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-white font-semibold px-10 py-7 rounded-full"
              >
                <Link href="/free-book">
                  Start with the Free Prequel
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
