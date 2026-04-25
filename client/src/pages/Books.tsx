import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, BookOpen, Gift, ChevronRight, Sparkles, Bell, Mail, CheckCircle, Clock, Flame, Camera, MapPin, User, Building2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function Books() {
  useEffect(() => {
    document.title = "Book Series by Reese Astor | Romance Novels";
  }, []);

  const mmkStructuredData = {
    "@context": "https://schema.org",
    "@type": "BookSeries",
    "name": "Manhattan Money Kings",
    "author": { "@type": "Person", "name": "Reese Astor" },
    "genre": "Billionaire Romance",
    "numberOfBooks": 4,
    "url": "https://reeseastor.com/books"
  };

  const hdStructuredData = {
    "@context": "https://schema.org",
    "@type": "BookSeries",
    "name": "Hudson Dynasty",
    "author": { "@type": "Person", "name": "Reese Astor" },
    "genre": "Corporate Billionaire Romance",
    "numberOfBooks": 2,
    "url": "https://reeseastor.com/books"
  };

  const books = [
    {
      id: 4,
      slug: "the-billionaires-forbidden-nanny",
      title: "The Billionaire's Forbidden Nanny: Forbidden and Forever",
      subtitle: "Manhattan Money Kings Book 4 (LAST BOOK)",
      cover: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wyOruOlpqOcFfhnS.jpg",
      description: "She's the nanny. He's her boss. His mother wants her gone. When Camille Torres takes a job caring for billionaire Ethan Calloway's silent daughter, she never expected to become the family they both desperately need.",
      fullBlurb: "She's the nanny. He's her boss. His mother wants her gone.\n\nCamille Torres doesn't belong in a Park Avenue penthouse. She belongs in the Bronx, finishing her teaching degree and keeping her family afloat. But when a billionaire offers her a salary that could change everything, she takes the job—and walks straight into trouble.\n\nEthan Calloway hasn't smiled since his wife died. His five-year-old daughter hasn't spoken. Seven nannies have quit. He doesn't need another complication—especially not one with quick wit, warm hands, and a mouth that talks back.\n\nBut Lily starts drawing again. Then laughing. Then reaching for Camille like she's safety.\n\nAnd Ethan? He's reaching too.\n\nOne kiss in the kitchen. One night that changes everything. One secret that his mother will use to destroy them both.\n\nGloria Calloway doesn't lose. She has money, connections, and a custody lawyer on speed dial. Camille has a thrift-store blazer and the Bronx.\n\nBut she also has something Gloria will never understand:\nA little girl who finally calls her Mama.",
      price: "$3.99",
      regularPrice: "$3.99",
      link: "https://swiy.co/4rd",
      genre: ["Nanny Romance", "Widower", "Forbidden Love", "Found Family"],
      pages: 350,
      rating: 0,
      reviews: 0,
      available: true,
      badge: "Final Book",
      featured: true,

    },
    {
      id: 3,
      slug: "the-billionaire-s-baby-secret",
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden.",
      fullBlurb: "Three years ago, Sophia Reed walked away from a hotel room and a man she should've never trusted—rising mogul Dominic Kane. She built stability the hard way: early trains, late invoices, and a tiny apartment where nothing could touch the life growing inside her. Now the CEO who controls outcomes for a living is back… and the daughter Sophia's protected has the storm-gray eyes he can't deny. When Dominic returns to reclaim his empire, he discovers the truth he was never meant to miss—and a city eager to devour the scandal. He can buy silence, clear rooms, bend markets. But Sophia has rules: boundaries around her child, transparency instead of power plays, and love that's earned, not purchased. Between boardroom wars, paparazzi flash storms, and a custody fight waiting to ignite, he has to become more than a headline and more than a boss. He has to be the father Bella needs…and the partner Sophia deserves.",
      price: "$3.99",
      regularPrice: "$3.99",
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
      slug: "the-billionaire-s-fake-wife",
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "When thief Elena Kim breaks into his penthouse, billionaire David Kim catches her red-handed. But instead of calling the police, he makes her an offer she can't refuse.",
      fullBlurb: "Elena Kim never expected her latest heist to go wrong. Breaking into billionaire David Kim's penthouse was supposed to be her ticket to freedom. Instead, she finds herself caught by a man who's more dangerous—and more compelling—than any mark she's ever targeted. David Kim built his empire on control, precision, and never letting anyone get close. But this beautiful thief has shattered every rule he lives by. Instead of turning her over to the police, he offers a deal: marry him for 12 months in exchange for protection from her violent father. As they work together, their forced alliance ignites into something neither expected. With her father's threats escalating and David's empire at risk, Elena must decide: betray the man she's falling for, or risk everything for a chance at redemption and love.",
      price: "$3.99",
      regularPrice: "$3.99",
      link: "https://swiy.co/2rd",
      genre: ["Fake Marriage", "Suspense", "Billionaire Romance"],
      pages: 350,
      rating: 4.7,
      reviews: 892,
      available: true,
      audioSampleUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book2-sample-1767436022553.mp3",
    },
    {
      id: 1,
      slug: "the-billionaire-s-executive-assistant",
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or workplace scandal.",
      fullBlurb: "Sarah Shah needs this job to pay her mother's mounting medical bills. Michael Hastings needs a competent assistant to save his billion-dollar Redwood project. Neither can afford distractions or workplace scandal. When Sarah uncovers financial sabotage orchestrated by Michael's ruthless competitor, they're forced into a dangerous alliance that crosses every professional boundary. Their forbidden attraction ignites amid corporate espionage, blackmail, and media scrutiny—with both their careers and reputations hanging in the balance. As they fight to expose the truth, Sarah must decide: sacrifice her growing feelings to protect the Redwood project, or risk everything for a relationship that could destroy them both.",
      price: "$3.99",
      regularPrice: "$3.99",
      link: "https://swiy.co/b01",
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
      <EnhancedSEOHead
        title="Book Series by Reese Astor | Romance Novels"
        description="Explore the Manhattan Money Kings and Hudson Dynasty series by Reese Astor. Steamy billionaire romances of power, passion, and love in New York City."
        canonical="/books"
        ogType="book"
        keywords={["Manhattan Money Kings", "billionaire romance series", "Reese Astor books", "steamy romance", "New York romance", "book series order"]}
        structuredData={[mmkStructuredData, hdStructuredData]}
      />

      
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
                Two Series. One World.
              </span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              <span className="text-white">Reese Astor</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                Book Series
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
              Manhattan Money Kings &bull; Hudson Dynasty
            </p>

            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#d4af37]">2</div>
                <div className="text-sm text-gray-400 mt-1">Series</div>
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
      <section className="py-16 relative ambient-section">
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
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/uMHRMKanHXREGUzc.jpeg"
                  alt="The First Acquisition - Free Book"
                  className="relative w-full max-w-xs mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-lg">
                  <Gift className="h-4 w-4" />
                  FREE BOOK FOR NEW READERS
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  The First Acquisition
                </h2>
                
                <p className="text-lg text-gray-300">
                  Power. Passion. Manhattan. When a ruthless billionaire sets his sights on what he wants, nothing stands in his way — not even the woman who was never part of the deal. Get this steamy full-length romance free when you join Reese Astor's VIP reader list.
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
                    <source src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/book-samples/book05-sample-1767435983947.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <a href="https://BookHip.com/JHRBVXT" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Get Free via BookFunnel
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

      {/* Manhattan Money Kings Series */}
      <section className="py-20 relative ambient-section" id="manhattan-money-kings">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          {/* Series Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-6">
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                Complete 4-Book Series
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
              Manhattan Money Kings
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Where power, passion, and billion-dollar secrets collide in the heart of Manhattan's elite.
            </p>
          </motion.div>

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
                        {book.price !== book.regularPrice && (
                          <>
                            <span className="text-xl text-gray-500 line-through">
                              {book.regularPrice}
                            </span>
                            <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                              Limited Time
                            </Badge>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          asChild
                          size="lg"
                          className="flex-1 btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                          <Link href={`/books/${book.slug}`}>
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
      <section className="py-20 relative ambient-section">
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

      {/* Hudson Dynasty Series - Coming Soon */}
      <section className="py-24 relative overflow-hidden" id="hudson-dynasty">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#12091e] to-[#0a0e1a]" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          {/* Series Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm mb-6">
              <Flame className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                New Series Coming Soon
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6">
              <span className="text-white">Hudson</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                Dynasty
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Steamy, high-gloss corporate romance where Manhattan's most dangerous billionaires meet the women who refuse to play by their rules.
            </p>
          </motion.div>

          {/* Audit of the Heart - Featured Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Book Cover */}
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
                <div className="relative group">
                  <div className="absolute -top-5 -right-5 z-10 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-2xl flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Coming Soon
                  </div>
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl group-hover:border-[#d4af37]/30 transition-all duration-500">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/audit-of-the-heart-cover-v2-CiyiXxZuMB4J9rT8axkMQv.webp"
                      alt="Audit of the Heart - Hudson Dynasty Book 1"
                      className="w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#d4af37] font-semibold tracking-widest uppercase mb-3">
                    Hudson Dynasty Book 1
                  </p>
                  <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Audit of the Heart
                  </h3>
                  <p className="text-lg text-[#d4af37]/80 font-medium mb-6">
                    A Corporate Billionaire Romance
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Forced Proximity", "Fake Engagement", "Office Romance", "Off-Limits", "Billionaire Romance"].map((trope) => (
                    <Badge 
                      key={trope} 
                      variant="outline" 
                      className="text-xs border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] hover:bg-[#d4af37]/10"
                    >
                      {trope}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Flame key={i} className="h-4 w-4 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-white font-medium text-sm">High Heat</span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  A brilliant compliance attorney is hired to stabilize Hudson Vale, the Manhattan investment empire run by ruthless billionaire Sebastian Hudson, just as rumors of financial misconduct threaten a major acquisition. When the board forces them into a fake engagement to calm investors, professional boundaries collapse under forced proximity, dangerous attraction, and the growing suspicion that Sebastian's empire is hiding something explosive.
                </p>

                <blockquote className="border-l-4 border-[#d4af37]/50 pl-6 py-2 italic text-gray-400 text-lg">
                  "I'm hired to clean up Sebastian Hudson's image, not get tangled in his empire. He's Manhattan's most dangerous billionaire — cold, controlled, and one scandal away from losing everything."
                </blockquote>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/books/audit-of-the-heart">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Read More
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white py-7"
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

          {/* Hostile Tender - Coming Soon Book 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20"
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Book Details - Left side for alternating layout */}
              <div className="space-y-6 order-2 lg:order-1">
                <div>
                  <p className="text-sm text-[#d4af37] font-semibold tracking-widest uppercase mb-3">
                    Hudson Dynasty Book 2
                  </p>
                  <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Hostile Tender
                  </h3>
                  <p className="text-lg text-[#d4af37]/80 font-medium mb-6">
                    A Corporate Billionaire Romance
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Enemies to Lovers", "Forced Proximity", "Cat & Mouse", "Forbidden Attraction", "Billionaire Romance"].map((trope) => (
                    <Badge 
                      key={trope} 
                      variant="outline" 
                      className="text-xs border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] hover:bg-[#d4af37]/10"
                    >
                      {trope}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Flame key={i} className="h-4 w-4 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>
                  <span className="text-white font-medium text-sm">High Heat</span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  She's the federal auditor sent to dismantle his empire. He's Manhattan's most dangerous billionaire fighting to save it. When the RIVIERA Ledger exposes three generations of Hudson secrets, SDNY forensic auditor Nia Carter is dispatched to untangle the truth — and she's the one woman Sebastian Hudson can't control.
                </p>

                <blockquote className="border-l-4 border-[#d4af37]/50 pl-6 py-2 italic text-gray-400 text-lg">
                  "Every foundation develops fault lines, Mr. Hudson. I am merely the specialist tasked with mapping them."
                </blockquote>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/books/hostile-tender">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Read More
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white py-7"
                  >
                    <Link href="/free-book">
                      <Gift className="mr-2 h-5 w-5" />
                      Get Notified at Launch
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Book Cover - Right side */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-8 bg-gradient-to-l from-[#d4af37]/20 to-transparent blur-3xl rounded-full" />
                <div className="relative group">
                  <div className="absolute -top-5 -left-5 z-10 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-sm shadow-2xl flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Coming Soon
                  </div>
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl group-hover:border-[#d4af37]/30 transition-all duration-500">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/hostile-tender-cover-v2-iH5fGgkRQVjWbk2TchYPdH.webp"
                      alt="Hostile Tender - Hudson Dynasty Book 2"
                      className="w-full rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Behind the Scenes Gallery */}
          <BehindTheScenes />

          {/* Series Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto mt-20 p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                About the Hudson Dynasty Series
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Manhattan high finance meets scorching romance. In the Hudson Dynasty world, reputation moves markets, power couples are public assets, and scandal is currency. Each book follows a new couple navigating the treacherous intersection of billion-dollar deals and irresistible desire.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The series begins with <em className="text-[#d4af37]">Audit of the Heart</em> and continues with <em className="text-[#d4af37]">Hostile Tender</em>. Standalone romances with guaranteed happily-ever-afters.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Sign-Up Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container relative z-10">
          <BooksNewsletterSignup />
        </div>
      </section>
    </div>
  );
}

function BooksNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Welcome to the inner circle!");
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        setIsSubmitted(true);
        toast.info("You're already on the list!");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    subscribeMutation.mutate({ email: email.trim(), name: name.trim() || undefined });
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/30"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/20 mb-5">
          <CheckCircle className="h-8 w-8 text-[#d4af37]" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-3">You're In!</h3>
        <p className="text-gray-300 text-base">
          Check your inbox for your free copy of <em>The First Acquisition</em>.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left — value proposition */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Reader's Inner Circle
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Never Miss a New
            <span className="text-[#d4af37]"> Release</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Join 1,700+ readers who get first access to new books, bonus chapters, and exclusive content — plus a free copy of The First Acquisition.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Bell, text: "New release alerts before anyone else" },
              { icon: Gift, text: "Exclusive bonus chapters & epilogues" },
              { icon: BookOpen, text: "Free copy of The First Acquisition" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4af37]/15 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-[#d4af37]" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="p-10 md:p-12 bg-white/[0.03] border-l border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
              <Mail className="h-4 w-4 text-[#d4af37]" />
            </div>
            <span className="text-white font-semibold text-sm">Get New Release Alerts</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="First name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4af37]/50 h-12 rounded-xl"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4af37]/50 h-12 rounded-xl"
            />
            <Button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#b8960c] hover:from-[#e5c84a] hover:to-[#d4af37] text-black font-bold rounded-xl text-sm tracking-wide transition-all duration-300"
            >
              {subscribeMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Subscribing...
                </span>
              ) : (
                "Get New Release Alerts →"
              )}
            </Button>
            <p className="text-gray-600 text-xs text-center">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function BehindTheScenes() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const btsItems = [
    {
      id: 1,
      type: "character" as const,
      title: "Sebastian Hudson",
      subtitle: "The Ice King",
      description: "CEO of Hudson Vale. Cold, calculated, strategic — a man who spent thirty-two years constructing barriers of glass, steel, and silence. Manhattan's most dangerous billionaire.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/bts-sebastian-hudson-FZbNqjAYLdPfLQ9RumWYon.webp",
      book: "Both Books",
      quote: "\"Every empire has a price. Mine was silence.\"",
    },
    {
      id: 2,
      type: "character" as const,
      title: "Nadia",
      subtitle: "Compliance Attorney",
      description: "Razor-smart, controlled, relentless. Hired to audit the risk at Hudson Vale — but Sebastian may be the biggest risk of all. A woman with a moral spine of steel and sharp humor under pressure.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/bts-nadia-compliance-TXbz4WyuwT8tkCNvZtdmXy.webp",
      book: "Audit of the Heart",
      quote: "\"I audit the risk. He may be the biggest risk of all.\"",
    },
    {
      id: 3,
      type: "character" as const,
      title: "Nia Carter",
      subtitle: "SDNY Forensic Auditor",
      description: "Clinical, precise, immutable. The daughter of a disgraced SEC investigator, Nia carries her father's Ghurka briefcase and a decade of preparation. She trusts nothing she hasn't personally encrypted.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/bts-nia-carter-knwbSZm9f2FyVybKKMcLXC.webp",
      book: "Hostile Tender",
      quote: "\"Every foundation develops fault lines, Mr. Hudson. I am merely the specialist tasked with mapping them.\"",
    },
    {
      id: 4,
      type: "location" as const,
      title: "Hudson Vale Tower",
      subtitle: "Midtown Manhattan",
      description: "The glass citadel where empires are built and destroyed. Sebastian's 42nd-floor office overlooks all of Manhattan — a kingdom of steel and silence where every window reflects the weight of a dynasty.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/bts-hudson-vale-hq-9vMxaXEgcdHBd7hoi2oHXw.webp",
      book: "Both Books",
      quote: null,
    },
    {
      id: 5,
      type: "location" as const,
      title: "The Boardroom",
      subtitle: "42nd Floor, Hudson Vale",
      description: "Where hostile takeovers are plotted and billion-dollar deals collapse. The mahogany table has witnessed three generations of Hudson power plays — and the night Nia Carter changed everything.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/bts-boardroom-jUkYNPaXJVemAicAXt2tre.webp",
      book: "Hostile Tender",
      quote: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-24"
    >
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm mb-6">
          <Camera className="h-4 w-4 text-[#d4af37]" />
          <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
            Behind the Scenes
          </span>
        </div>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Inside the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">Hudson Dynasty</span>
        </h3>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Meet the characters and explore the world of Manhattan high finance, corporate warfare, and irresistible desire.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {btsItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                  {item.type === "character" ? (
                    <User className="h-3 w-3 text-[#d4af37]" />
                  ) : (
                    <MapPin className="h-3 w-3 text-[#d4af37]" />
                  )}
                  <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wider">
                    {item.type === "character" ? "Character" : "Location"}
                  </span>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="font-serif text-base font-bold text-white leading-tight mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[#d4af37] text-xs font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          
          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] border border-white/10 shadow-2xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden">
              <img
                src={btsItems[selectedImage].image}
                alt={btsItems[selectedImage].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a2e]/30 hidden md:block" />
            </div>

            {/* Details */}
            <div className="p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20">
                  {btsItems[selectedImage].type === "character" ? (
                    <User className="h-3.5 w-3.5 text-[#d4af37]" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5 text-[#d4af37]" />
                  )}
                  <span className="text-xs font-medium text-[#d4af37] uppercase tracking-wider">
                    {btsItems[selectedImage].type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{btsItems[selectedImage].book}</span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
                {btsItems[selectedImage].title}
              </h3>
              <p className="text-[#d4af37] font-medium mb-6">
                {btsItems[selectedImage].subtitle}
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                {btsItems[selectedImage].description}
              </p>

              {btsItems[selectedImage].quote && (
                <blockquote className="border-l-2 border-[#d4af37]/50 pl-4 py-2">
                  <p className="text-gray-400 italic text-sm leading-relaxed">
                    {btsItems[selectedImage].quote}
                  </p>
                </blockquote>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : btsItems.length - 1);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-[#d4af37]/30 transition-all duration-300"
                >
                  ← Previous
                </button>
                <span className="text-gray-600 text-sm">
                  {selectedImage + 1} / {btsItems.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < btsItems.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-[#d4af37]/30 transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
