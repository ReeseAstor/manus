import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BookOpen, Gift, Heart, Users, Star, ArrowRight, CheckCircle, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

interface PromoBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  tropes: string[];
  description: string;
  featured?: boolean;
}

// Featured book (Reese Astor's) + partner author books
const promoBooks: PromoBook[] = [
  {
    id: 1,
    title: "The First Acquisition",
    author: "Reese Astor",
    cover: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg",
    genre: "Billionaire Romance",
    tropes: ["Boss Romance", "Power Dynamic", "Manhattan"],
    description: "When a ruthless billionaire acquires more than a company — he acquires her heart. A sizzling Manhattan romance where boardroom battles become bedroom wars.",
    featured: true,
  },
  {
    id: 2,
    title: "Tempted by the Tycoon",
    author: "Partner Author",
    cover: "",
    genre: "Billionaire Romance",
    tropes: ["Enemies to Lovers", "Office Romance"],
    description: "She's his biggest rival. He's her worst nightmare. But when a business merger forces them together, the only thing more dangerous than their competition is their chemistry.",
  },
  {
    id: 3,
    title: "The CEO's Secret",
    author: "Partner Author",
    cover: "",
    genre: "Contemporary Romance",
    tropes: ["Secret Baby", "Second Chance"],
    description: "Five years ago, she walked away. Now she's back — with a secret that will change everything. A heart-wrenching second chance romance with a twist.",
  },
  {
    id: 4,
    title: "Forbidden Nights",
    author: "Partner Author",
    cover: "",
    genre: "Dark Romance",
    tropes: ["Forbidden Love", "Age Gap"],
    description: "He's off-limits. She doesn't care. When forbidden desire meets unstoppable attraction, rules are made to be broken.",
  },
  {
    id: 5,
    title: "His Redemption",
    author: "Partner Author",
    cover: "",
    genre: "Romantic Suspense",
    tropes: ["Protector Romance", "Damaged Hero"],
    description: "A former soldier with a dark past. A woman on the run. When danger brings them together, he'll risk everything to keep her safe.",
  },
  {
    id: 6,
    title: "Wicked Arrangement",
    author: "Partner Author",
    cover: "",
    genre: "Billionaire Romance",
    tropes: ["Fake Relationship", "Forced Proximity"],
    description: "A fake engagement. A real attraction. When a billionaire needs a pretend fiancée, he picks the one woman who can't stand him.",
  },
];

export default function Promo() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("You're in! Check your email for download links.");
      setTimeout(() => {
        window.open("https://swiy.co/05", "_blank");
      }, 2000);
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        setIsSubmitted(true);
        toast.info("Welcome back! Your download link is on its way.");
        setTimeout(() => {
          window.open("https://swiy.co/05", "_blank");
        }, 2000);
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

  const promoStructuredData = [{
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Romance Book Giveaway - Free Books from Top Romance Authors",
    description: "Grab free romance books from bestselling authors. Limited-time multi-author giveaway featuring billionaire romance, dark romance, and contemporary love stories.",
    organizer: { "@type": "Person", name: "Reese Astor" },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    isAccessibleForFree: true,
  }];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <EnhancedSEOHead
        title="Free Romance Books Giveaway | Multi-Author Promo | Reese Astor"
        description="Grab free romance books from bestselling authors! Limited-time multi-author giveaway featuring billionaire romance, dark romance, and contemporary love stories."
        canonical="https://reeseastor.com/promo"
        structuredData={promoStructuredData}
      />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 via-transparent to-[#d4af37]/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Clock className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium tracking-wider uppercase">
              Limited Time — Ends Soon
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Grab <span className="text-[#d4af37]">Free Books</span> from
            <br />Top Romance Authors
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join our exclusive multi-author giveaway and discover your next obsession.
            Steamy billionaire romances, forbidden love stories, and heart-pounding second chances — all free.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#d4af37]" />
              <span className="text-white font-semibold">{promoBooks.length} Free Books</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#d4af37]" />
              <span className="text-white font-semibold">6 Bestselling Authors</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#d4af37]" />
              <span className="text-white font-semibold">100% Free</span>
            </div>
          </div>
        </motion.div>

        {/* Email Capture - Above the fold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto mb-20"
        >
          {!isSubmitted ? (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-[#d4af37]/20 shadow-2xl">
              <div className="text-center mb-6">
                <Sparkles className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                <h2 className="font-serif text-2xl font-bold text-white mb-2">
                  Claim Your Free Books
                </h2>
                <p className="text-gray-400 text-sm">
                  Enter your email below and we'll send download links for all {promoBooks.length} books instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {subscribeMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Gift className="mr-2 h-5 w-5" />
                      Send Me All {promoBooks.length} Free Books
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Instant delivery
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  No spam, ever
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Unsubscribe anytime
                </span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                You're In! 🎉
              </h3>
              <p className="text-gray-300 mb-4">
                Check your email for download links. Your free books are on their way!
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#d4af37] hover:underline"
                >
                  try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Book - Reese Astor's */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
              <Star className="h-4 w-4 text-[#d4af37] fill-[#d4af37]" />
              <span className="text-sm text-[#d4af37] font-medium tracking-wider uppercase">
                Featured Book
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#d4af37]/5 to-white/[0.02] border border-[#d4af37]/20 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-[#d4af37]/30">
                <img
                  src={promoBooks[0].cover}
                  alt={promoBooks[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase bg-[#d4af37]/10 px-3 py-1 rounded-full">
                    USA Today Bestseller
                  </span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-1">
                  {promoBooks[0].title}
                </h3>
                <p className="text-[#d4af37] font-medium mb-3">by {promoBooks[0].author}</p>
                <div className="flex items-center gap-1 mb-3 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">4.8 average rating</span>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {promoBooks[0].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {promoBooks[0].tropes.map((trope) => (
                    <span
                      key={trope}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
                    >
                      {trope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              All Books in This <span className="text-[#d4af37]">Giveaway</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Each book is a full-length novel from a bestselling romance author. Claim them all with a single email.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                  book.featured
                    ? "bg-gradient-to-br from-[#d4af37]/10 to-white/[0.02] border-[#d4af37]/30"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Book Cover */}
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <BookOpen className="h-12 w-12 text-gray-600 mb-3" />
                      <p className="text-gray-500 text-sm text-center font-medium">{book.title}</p>
                      <p className="text-gray-600 text-xs text-center mt-1">by {book.author}</p>
                      <p className="text-[#d4af37]/40 text-xs mt-3 italic">Partner slot available</p>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div>
                  {book.featured && (
                    <span className="text-[10px] text-[#d4af37] font-semibold tracking-[0.15em] uppercase mb-1 block">
                      ★ Featured
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold text-white mb-0.5">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#d4af37] mb-2">by {book.author}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {book.tropes.map((trope) => (
                      <span
                        key={trope}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500"
                      >
                        {trope}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-white mb-3">
              How It <span className="text-[#d4af37]">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Enter Your Email",
                description: "Sign up with your email address above. It takes 10 seconds.",
                icon: Mail,
              },
              {
                step: "2",
                title: "Get Download Links",
                description: "We'll send you links to download all books via BookFunnel — works on any device.",
                icon: BookOpen,
              },
              {
                step: "3",
                title: "Start Reading",
                description: "Download to your Kindle, phone, tablet, or computer and dive into your next obsession.",
                icon: Heart,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-[#d4af37]" />
                </div>
                <div className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-[#d4af37]/20">
            <h2 className="font-serif text-2xl font-bold text-white mb-3">
              Don't Miss Out
            </h2>
            <p className="text-gray-400 mb-6">
              This giveaway won't last forever. Claim your free books now before the promotion ends.
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Claim Your Free Books Now
            </Button>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Are these books really free?",
                a: "Yes! All books in this giveaway are 100% free. Each participating author has generously offered a full-length novel for you to enjoy.",
              },
              {
                q: "How do I download the books?",
                a: "After entering your email, you'll receive download links via BookFunnel. BookFunnel works on Kindle, Apple Books, Kobo, Nook, and any other e-reader or device.",
              },
              {
                q: "Will I be signed up for newsletters?",
                a: "You'll be added to each participating author's newsletter so you can stay updated on new releases and exclusive content. You can unsubscribe from any author at any time.",
              },
              {
                q: "How long is this promotion available?",
                a: "This is a limited-time promotion. We recommend claiming your books as soon as possible to ensure you don't miss out.",
              },
              {
                q: "What genres are included?",
                a: "This giveaway features billionaire romance, contemporary romance, dark romance, and romantic suspense — all with steamy, emotional storylines.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* For Authors Section - Application Form */}
        <PartnerApplicationForm />
      </div>
    </div>
  );
}

function PartnerApplicationForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    authorName: "",
    email: "",
    website: "",
    bookTitle: "",
    genre: "",
    tropes: "",
    bookDescription: "",
    downloadLink: "",
    coverImageUrl: "",
    subscriberCount: "",
    socialLinks: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.partnerApplications.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted! We'll review it and get back to you within 48 hours.");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.email || !formData.bookTitle || !formData.genre || !formData.bookDescription) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-20"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Are You a Romance <span className="text-[#d4af37]">Author</span>?
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Want to participate in our next group promotion? We're looking for romance authors
            with quality books to join our cross-promotion events.
          </p>
        </div>

        {!showForm && !submitted && (
          <div className="text-center">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Apply to Partner With Us
            </Button>
          </div>
        )}

        {submitted && (
          <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h4 className="font-serif text-xl font-bold text-white mb-2">Application Received!</h4>
            <p className="text-gray-400">
              Thank you for your interest. We'll review your application and get back to you within 48 hours.
            </p>
          </div>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Author Name *</label>
                <Input
                  value={formData.authorName}
                  onChange={(e) => updateField("authorName", e.target.value)}
                  placeholder="Your pen name"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="author@example.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://yoursite.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Newsletter Subscribers</label>
                <Input
                  value={formData.subscriberCount}
                  onChange={(e) => updateField("subscriberCount", e.target.value)}
                  placeholder="e.g. 2,500"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <h4 className="text-sm font-semibold text-white mb-4">Book Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Book Title *</label>
                  <Input
                    value={formData.bookTitle}
                    onChange={(e) => updateField("bookTitle", e.target.value)}
                    placeholder="Your book title"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Genre *</label>
                  <Input
                    value={formData.genre}
                    onChange={(e) => updateField("genre", e.target.value)}
                    placeholder="e.g. Billionaire Romance"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Tropes (comma-separated)</label>
              <Input
                value={formData.tropes}
                onChange={(e) => updateField("tropes", e.target.value)}
                placeholder="e.g. Enemies to Lovers, Office Romance, Second Chance"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Book Description *</label>
              <textarea
                value={formData.bookDescription}
                onChange={(e) => updateField("bookDescription", e.target.value)}
                placeholder="A brief description of your book (2-3 sentences)..."
                required
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d4af37]/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">BookFunnel/StoryOrigin Link</label>
                <Input
                  value={formData.downloadLink}
                  onChange={(e) => updateField("downloadLink", e.target.value)}
                  placeholder="https://bookfunnel.com/..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Cover Image URL</label>
                <Input
                  value={formData.coverImageUrl}
                  onChange={(e) => updateField("coverImageUrl", e.target.value)}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Social Media Links</label>
              <Input
                value={formData.socialLinks}
                onChange={(e) => updateField("socialLinks", e.target.value)}
                placeholder="Instagram, TikTok, Facebook URLs (comma-separated)"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-11 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-white/10 text-gray-400 hover:text-white rounded-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
