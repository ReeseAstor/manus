import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gift, ChevronRight, Flame, Clock, Heart, Users, Building2, Shield } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function AuditOfTheHeart() {
  useEffect(() => {
    document.title = "Audit of the Heart | Hudson Dynasty Book 1 | Reese Astor";
  }, []);

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Audit of the Heart",
    "author": { "@type": "Person", "name": "Reese Astor" },
    "genre": "Corporate Billionaire Romance",
    "bookFormat": "EBook",
    "numberOfPages": 350,
    "inLanguage": "en",
    "publisher": { "@type": "Organization", "name": "Reese Astor" },
    "url": "https://reeseastor.com/books/audit-of-the-heart",
    "description": "A brilliant compliance attorney is hired to stabilize a Manhattan investment empire, only to be forced into a fake engagement with its ruthless billionaire CEO."
  };

  const chapters = [
    { num: "Act I", title: "The Contract", chapters: "Chapters 1–9", description: "A compliance attorney arrives at Hudson Vale to audit the empire of Manhattan's most dangerous billionaire. When scandal threatens a $4B acquisition, the board forces a fake engagement — and two people who can't stand each other into dangerously close proximity." },
    { num: "Act II", title: "Seduction & Secrets", chapters: "Chapters 10–25", description: "As the fake engagement becomes all too real, buried secrets surface. She's following the money trail. He's protecting someone. The line between professional duty and devastating desire blurs beyond recognition." },
    { num: "Act III", title: "Reckoning", chapters: "Chapters 26–35", description: "The truth detonates. Betrayal, board coups, and a love that was never supposed to be real. When the empire crumbles, only one thing matters — whether they'll choose each other without the contract." },
  ];

  const tropes = [
    "Forced Proximity",
    "Fake Engagement",
    "Office Romance",
    "Off-Limits",
    "Billionaire Romance",
    "Corporate Power Romance",
  ];

  const characters = [
    {
      icon: Shield,
      name: "The FMC — Compliance Attorney",
      description: "Razor-smart, controlled, relentless. She's hired to audit the risk — but he may be the biggest risk of all. A woman with a moral spine of steel and sharp humor under pressure.",
    },
    {
      icon: Building2,
      name: "Sebastian Hudson — CEO",
      description: "Manhattan's most dangerous billionaire. Cold, controlled, strategic — with a protective streak he hides from everyone. Ruthless in the boardroom, devastatingly vulnerable behind closed doors.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="Audit of the Heart | Hudson Dynasty Book 1 | Reese Astor"
        description="A brilliant compliance attorney. A ruthless billionaire CEO. A fake engagement that becomes dangerously real. Audit of the Heart is Book 1 in the Hudson Dynasty series by Reese Astor."
        canonical="/books/audit-of-the-heart"
        ogType="book"
        keywords={["Audit of the Heart", "Hudson Dynasty", "Reese Astor", "billionaire romance", "fake engagement romance", "corporate romance", "forced proximity"]}
        structuredData={[bookSchema]}
      />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/90" />
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Book Cover */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="absolute -inset-12 bg-gradient-to-r from-[#d4af37]/30 to-transparent blur-3xl rounded-full" />
                <div className="relative">
                  <div className="absolute -top-6 -right-6 z-10 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold text-lg shadow-2xl flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Coming Soon
                  </div>
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/audit-of-the-heart-cover-v2-CiyiXxZuMB4J9rT8axkMQv.webp"
                      alt="Audit of the Heart - Hudson Dynasty Book 1 by Reese Astor"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
                  <Flame className="h-5 w-5 text-[#d4af37]" />
                  <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                    Hudson Dynasty &bull; Book 1
                  </span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
                  Audit of the<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37]">
                    Heart
                  </span>
                </h1>

                <p className="text-xl text-[#d4af37]">
                  A Corporate Billionaire Romance
                </p>

                <div className="flex flex-wrap gap-2">
                  {tropes.map((trope) => (
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
                  <span className="text-white font-medium text-sm">Heat Level: 5/5</span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  A brilliant compliance attorney is hired to stabilize Hudson Vale, the Manhattan investment empire run by ruthless billionaire Sebastian Hudson, just as rumors of financial misconduct threaten a major acquisition. When the board forces them into a fake engagement to calm investors and project stability, professional boundaries collapse under forced proximity, dangerous attraction, and the growing suspicion that Sebastian's empire is hiding something explosive.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/free-book">
                      <Gift className="mr-2 h-5 w-5" />
                      Get Notified at Launch
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-7 rounded-full transition-all duration-300 hover:border-[#d4af37]/50"
                  >
                    <Link href="/books">
                      <BookOpen className="mr-2 h-5 w-5" />
                      View All Books
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Trailer */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] to-[#12091e]" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto text-center"
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Book Trailer</h2>
            <div className="rounded-2xl overflow-hidden border-2 border-[#d4af37]/20 shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
                poster="https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/audit-of-the-heart-cover-v2-CiyiXxZuMB4J9rT8axkMQv.webp"
              >
                <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HcjxEIpNhWvIRAIa.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voicey Premise */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#12091e] to-[#0a0e1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#d4af37]/40 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#d4af37]/40 rounded-br-3xl pointer-events-none" />
              
              <div className="text-center mb-6">
                <Heart className="h-8 w-8 text-[#d4af37] mx-auto mb-4" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  In Her Words
                </h2>
              </div>
              
              <blockquote className="text-gray-300 text-xl md:text-2xl leading-relaxed italic text-center">
                "I'm hired to clean up Sebastian Hudson's image, not get tangled in his empire. He's Manhattan's most dangerous billionaire — cold, controlled, and one scandal away from losing the acquisition that could cement Hudson Vale's dominance. When the board decides the answer is a fake engagement between us, I'm forced into his penthouse, his orbit, and the kind of attraction that threatens my judgment just as I start uncovering secrets that could destroy us both."
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Characters */}
      <section className="py-20 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-6">
              <Users className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                Meet the Characters
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
              She Audits the Risk.<br />
              <span className="text-[#d4af37]">He May Be the Biggest Risk of All.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {characters.map((char, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center mb-6">
                  <char.icon className="h-7 w-7 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-3">
                  {char.name}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {char.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Arc */}
      <section className="py-20 relative">
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
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              The Story
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              35 chapters of tension, desire, and billion-dollar stakes
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {chapters.map((act, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c9a961] flex items-center justify-center">
                    <span className="text-black font-bold text-sm">{act.num}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      {act.title}
                    </h3>
                    <p className="text-[#d4af37] text-sm font-medium mb-3">{act.chapters}</p>
                    <p className="text-gray-300 leading-relaxed">{act.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Series Info */}
      <section className="py-20 relative">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="text-center">
              <Flame className="h-8 w-8 text-[#d4af37] mx-auto mb-6" />
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
                About the Hudson Dynasty Series
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Manhattan high finance meets scorching romance. In the Hudson Dynasty world, reputation moves markets, power couples are public assets, and scandal is currency. Each book follows a new couple navigating the treacherous intersection of billion-dollar deals and irresistible desire.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                The series begins with <em className="text-[#d4af37]">Audit of the Heart</em> and continues with <em className="text-[#d4af37]">Hostile Tender</em>. Standalone romances with guaranteed happily-ever-afters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/free-book">
                    <Gift className="mr-2 h-5 w-5" />
                    Get Notified at Launch
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 text-white font-semibold px-10 py-7 rounded-full"
                >
                  <Link href="/books">
                    View All Series
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
