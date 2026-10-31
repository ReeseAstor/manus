import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, BookOpen, ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { ShareableResultCard } from "@/components/ShareableResultCard";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { HoneypotField } from "@/components/HoneypotField";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { withAmazonTag } from "@/lib/amazon-tag";

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; trope: string; emoji: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Pick your ideal Friday night",
    options: [
      { text: "A heated debate at a rooftop cocktail bar", trope: "enemies", emoji: "🍸" },
      { text: "A secret rendezvous no one can know about", trope: "forbidden", emoji: "🌙" },
      { text: "Reconnecting with someone from your past", trope: "second-chance", emoji: "✨" },
      { text: "A power dinner with someone who commands the room", trope: "boss", emoji: "🏙️" },
    ],
  },
  {
    id: 2,
    question: "Your dream vacation destination",
    options: [
      { text: "A competitive cooking class in Tuscany", trope: "enemies", emoji: "🇮🇹" },
      { text: "A hidden island only locals know about", trope: "forbidden", emoji: "🏝️" },
      { text: "The city where you had your first love", trope: "second-chance", emoji: "🗼" },
      { text: "A luxury penthouse suite in Manhattan", trope: "boss", emoji: "🌃" },
    ],
  },
  {
    id: 3,
    question: "What quality do you value most in a partner?",
    options: [
      { text: "Someone who challenges me intellectually", trope: "enemies", emoji: "🧠" },
      { text: "Someone who'd risk everything for us", trope: "forbidden", emoji: "🔥" },
      { text: "Someone who never stopped loving me", trope: "second-chance", emoji: "💫" },
      { text: "Someone with ambition and quiet intensity", trope: "boss", emoji: "💎" },
    ],
  },
  {
    id: 4,
    question: "Pick a movie that makes your heart race",
    options: [
      { text: "The Proposal: love born from rivalry", trope: "enemies", emoji: "🎬" },
      { text: "Atonement: love that defies the rules", trope: "forbidden", emoji: "🎭" },
      { text: "The Notebook: love that finds its way back", trope: "second-chance", emoji: "📓" },
      { text: "Fifty Shades: power, control, surrender", trope: "boss", emoji: "🖤" },
    ],
  },
  {
    id: 5,
    question: "How do you handle conflict?",
    options: [
      { text: "I fight back. The tension is half the fun", trope: "enemies", emoji: "⚡" },
      { text: "I keep it hidden. Some battles are private", trope: "forbidden", emoji: "🤫" },
      { text: "I reflect on what went wrong and try again", trope: "second-chance", emoji: "🪞" },
      { text: "I take charge and find the solution", trope: "boss", emoji: "👑" },
    ],
  },
  {
    id: 6,
    question: "Your guilty pleasure is...",
    options: [
      { text: "Hate-watching a show just to argue about it", trope: "enemies", emoji: "📺" },
      { text: "Reading texts you probably shouldn't", trope: "forbidden", emoji: "📱" },
      { text: "Stalking an ex's social media at 2am", trope: "second-chance", emoji: "🌙" },
      { text: "Online shopping for things you don't need", trope: "boss", emoji: "🛍️" },
    ],
  },
  {
    id: 7,
    question: "Pick the scenario that gives you butterflies",
    options: [
      { text: "\"I can't stand you.\" *kisses you against the wall*", trope: "enemies", emoji: "💋" },
      { text: "\"We can't do this.\" *does it anyway*", trope: "forbidden", emoji: "🚫" },
      { text: "\"I never stopped thinking about you.\"", trope: "second-chance", emoji: "💭" },
      { text: "\"You work for me now.\" *intense eye contact*", trope: "boss", emoji: "🔥" },
    ],
  },
];

interface TropeResult {
  trope: string;
  title: string;
  subtitle: string;
  description: string;
  bookTitle: string;
  bookSubtitle: string;
  bookLink: string;
  bookCover: string;
  color: string;
  icon: string;
}

export const tropeResults: Record<string, TropeResult> = {
  enemies: {
    trope: "enemies",
    title: "Enemies-to-Lovers",
    subtitle: "You thrive on tension",
    description:
      "You're drawn to the electric spark between two people who can't stand each other, until they can't resist each other. The banter, the tension, the moment when hate melts into something far more dangerous... that's your sweet spot. You believe the best love stories start with a fight.",
    bookTitle: "Hostile Tender",
    bookSubtitle: "Hudson Dynasty Book 1",
    bookLink: "https://www.amazon.com/dp/B0H1F9PV97",
    bookCover: "https://m.media-amazon.com/images/I/81iGQzEnacL._SL1500_.jpg",
    color: "#7A4F4C",
    icon: "⚔️",
  },
  forbidden: {
    trope: "forbidden",
    title: "Forbidden Romance",
    subtitle: "Rules were made to be broken",
    description:
      "You're captivated by love that shouldn't exist but burns too bright to deny. Whether it's crossing professional boundaries, defying family expectations, or breaking every rule in the book — you believe the most passionate love is the kind that comes with consequences. The higher the stakes, the deeper you fall.",
    bookTitle: "The Billionaire's Forbidden Nanny",
    bookSubtitle: "Manhattan Money Kings Book 4",
    bookLink: "https://www.amazon.com/dp/B0GDZ4T164",
    bookCover: "/author-kit/mmk-4-forbidden-nanny.jpg",
    color: "#7A4F4C",
    icon: "🚫",
  },
  "second-chance": {
    trope: "second-chance",
    title: "Secret Baby / Second Chance",
    subtitle: "Love always finds its way back",
    description:
      "You believe in fate, in the loves that come back around stronger, and in the secrets that change everything. There's something irresistible about unfinished business, about two people who were torn apart finding their way back to each other. You know that sometimes the best love stories have a plot twist.",
    bookTitle: "The Billionaire's Baby Secret",
    bookSubtitle: "Manhattan Money Kings Book 3",
    bookLink: "https://www.amazon.com/dp/B0G12LBZ24",
    bookCover: "/author-kit/mmk-3-baby-secret.jpg",
    color: "#7A4F4C",
    icon: "✨",
  },
  boss: {
    trope: "boss",
    title: "Boss / Power Dynamic",
    subtitle: "Power is the ultimate aphrodisiac",
    description:
      "You're drawn to the magnetic pull of power, ambition, and the moment when control finally slips. There's something intoxicating about a love that starts in the boardroom — where every glance across the conference table is loaded with meaning, and the line between professional and personal becomes impossibly blurred.",
    bookTitle: "The Billionaire's Executive Assistant",
    bookSubtitle: "Manhattan Money Kings Book 1",
    bookLink: "https://www.amazon.com/dp/B0F2W8QL7S",
    bookCover: "/author-kit/mmk-1-executive-assistant.jpg",
    color: "#7A4F4C",
    icon: "👑",
  },
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<TropeResult | null>(null);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [formRenderedAt] = useState(() => Date.now());

  useEffect(() => {
    document.title = "What's Your Romance Trope? | Reese Astor Quiz";
  }, []);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsComplete(true);
      setShowEmailGate(false);
      setShowResult(true);
      // Save quiz result for personalized book recommendations
      if (result) {
        try { localStorage.setItem("romanceQuizResult", result.trope); } catch {}
      }
      toast.success("Welcome! Your personalized results are ready.");
      setTimeout(() => {
        window.open("https://dl.bookfunnel.com/hj09ggitwi", "_blank");
      }, 3000);
    },
    onError: (error) => {
      if (error.message?.includes("already subscribed")) {
        setIsComplete(true);
        setShowEmailGate(false);
        setShowResult(true);
        // Save quiz result for personalized book recommendations
        if (result) {
          try { localStorage.setItem("romanceQuizResult", result.trope); } catch {}
        }
        toast.info("Welcome back! Here are your results.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  const calculateResult = (allAnswers: string[]): TropeResult => {
    const counts: Record<string, number> = {};
    allAnswers.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return tropeResults[winner];
  };

  const handleAnswer = (trope: string) => {
    const newAnswers = [...answers, trope];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const tropeResult = calculateResult(newAnswers);
      setResult(tropeResult);
      setShowEmailGate(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email to see your results.");
      return;
    }
    subscribeMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
      company_website: companyWebsite || undefined,
      formRenderedAt,
      formSubmittedAt: Date.now(),
    });
  };

  const progress = ((currentQuestion + (showEmailGate || showResult ? 1 : 0)) / quizQuestions.length) * 100;

  const quizStructuredData = [{
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "What's Your Romance Trope?",
    description: "Discover which romance trope matches your personality and get a personalized book recommendation from the Manhattan Money Kings series.",
    author: { "@type": "Person", name: "Reese Astor" },
  }];

  return (
    <div className="min-h-screen bg-[#FAF7F7] relative overflow-hidden">
      <EnhancedSEOHead
        title="What's Your Romance Trope? | Reese Astor Quiz"
        description="Take this fun 7-question quiz to discover your romance trope personality and get a personalized book recommendation from the Manhattan Money Kings series."
        canonical="https://reeseastor.com/romance-quiz"
        structuredData={quizStructuredData}
      />

      {/* Background ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C9A3A0]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7A4F4C]/5 blur-[180px] rounded-full" />
      </div>

      <div className="container relative z-10 py-12 md:py-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/20 mb-6">
            <Heart className="h-4 w-4 text-[#7A4F4C]" />
            <span className="text-sm text-[#7A4F4C] font-medium tracking-wider uppercase">Romance Personality Quiz</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#4A3B3A] mb-4">
            What's Your <span className="text-[#7A4F4C]">Romance Trope</span>?
          </h1>
          <p className="text-lg text-[#6E5F5A] max-w-2xl mx-auto">
            Answer 7 quick questions to discover which romance trope matches your personality, plus get a personalized book recommendation.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex justify-between text-sm text-[#6E5F5A] mb-2">
            <span>Question {Math.min(currentQuestion + 1, quizQuestions.length)} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-[#EBD6D3]/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Questions */}
            {!showEmailGate && !showResult && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 shadow-2xl">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3B3A] mb-8 text-center">
                    {quizQuestions[currentQuestion].question}
                  </h2>

                  <div className="space-y-4">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleAnswer(option.trope)}
                        className="w-full p-5 rounded-2xl bg-[#EBD6D3]/0 border border-[#4A3B3A]/10 hover:border-[#B59A6A]/50 hover:bg-[#C9A3A0]/5 transition-all duration-300 text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="text-lg text-[#6E5F5A] group-hover:text-[#4A3B3A] transition-colors">
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {currentQuestion > 0 && (
                    <button
                      onClick={handleBack}
                      className="mt-6 flex items-center gap-2 text-[#6E5F5A] hover:text-[#7A4F4C] transition-colors mx-auto"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Go back</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Email Gate */}
            {showEmailGate && !showResult && result && (
              <motion.div
                key="email-gate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 shadow-2xl text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 mb-8">
                    <Sparkles className="h-10 w-10 text-[#7A4F4C]" />
                  </div>

                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-4">
                    Your Results Are Ready!
                  </h2>
                  <p className="text-lg text-[#6E5F5A] mb-2">
                    We've identified your romance trope personality.
                  </p>
                  <p className="text-[#6E5F5A] mb-8">
                    Enter your email to reveal your result and get a <span className="text-[#7A4F4C] font-semibold">romance novel matched to your trope</span>, free when you join my newsletter.
                  </p>

                  <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                    <HoneypotField value={companyWebsite} onChange={setCompanyWebsite} />
                    <div className="space-y-3 mb-4">
                      <Input
                        type="text"
                        placeholder="First name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#EBD6D3]/30 border-[#4A3B3A]/10 text-[#4A3B3A] placeholder:text-[#6E5F5A] rounded-full px-6 py-6 focus:border-[#B59A6A]/50 focus:ring-[#C9A3A0]/20"
                      />
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[#EBD6D3]/30 border-[#4A3B3A]/10 text-[#4A3B3A] placeholder:text-[#6E5F5A] rounded-full px-6 py-6 focus:border-[#B59A6A]/50 focus:ring-[#C9A3A0]/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      className="w-full bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
                    >
                      {subscribeMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Revealing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <Sparkles className="h-5 w-5" />
                          Reveal My Romance Trope
                        </span>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-[#6E5F5A] mt-6">
                    You'll also get a link to the prequel, free when you join my newsletter. No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {showResult && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 shadow-2xl">
                  {/* Result Header */}
                  <div className="text-center mb-10">
                    <span className="text-6xl mb-4 block">{result.icon}</span>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/20 mb-4">
                      <span className="text-sm text-[#7A4F4C] font-medium tracking-wider uppercase">Your Romance Trope</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#4A3B3A] mb-3">
                      {result.title}
                    </h2>
                    <p className="text-xl text-[#7A4F4C] italic">{result.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-[#6E5F5A] leading-relaxed text-center mb-10 max-w-xl mx-auto">
                    {result.description}
                  </p>

                  {/* Book Recommendation */}
                  <div className="bg-[#EBD6D3]/0 border border-[#4A3B3A]/10 rounded-2xl p-6 md:p-8">
                    <p className="text-sm text-[#7A4F4C] font-medium tracking-wider uppercase mb-4 text-center">
                      Your Perfect Book Match
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-40 h-60 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border border-[#4A3B3A]/10">
                        <img
                          src={result.bookCover}
                          alt={result.bookTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className="font-serif text-2xl font-bold text-[#4A3B3A] mb-1">
                          {result.bookTitle}
                        </h3>
                        <p className="text-[#6E5F5A] mb-3">{result.bookSubtitle}</p>
                        <div className="flex items-center gap-1 mb-4 justify-center md:justify-start">
                          <span className="text-sm text-[#6E5F5A] ml-2">Manhattan Money Kings</span>
                        </div>
                        <p className="text-[#6E5F5A] mb-6 leading-relaxed">
                          Based on your quiz results, this book from the Manhattan Money Kings series is your perfect match. Your copy is being delivered to your inbox now!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                          <Button
                            onClick={() => window.open("https://dl.bookfunnel.com/kw1yge3479", "_blank")}
                            className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-6 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                          >
                            <BookOpen className="mr-2 h-5 w-5" />
                            Get Your Copy
                          </Button>
                          <Button
                            onClick={() => window.open(withAmazonTag(result.bookLink), "_blank")}
                            variant="outline"
                            className="border-[#4A3B3A]/20 text-[#4A3B3A] hover:bg-[#EBD6D3]/30 px-6 py-5 rounded-full"
                          >
                            View on Amazon
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shareable Result Card + Social Sharing */}
                  <ShareableResultCard
                    trope={result.trope}
                    title={result.title}
                    subtitle={result.subtitle}
                    icon={result.icon}
                    color={result.color}
                    bookTitle={result.bookTitle}
                    bookCover={result.bookCover}
                    siteUrl={window.location.origin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
