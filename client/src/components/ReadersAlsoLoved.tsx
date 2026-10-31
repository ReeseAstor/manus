import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, BookOpen, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

// Trope-to-book recommendation mapping
// Maps quiz result tropes to book characteristics for personalized suggestions
const TROPE_RECOMMENDATIONS: Record<string, {
  label: string;
  description: string;
  matchReason: string;
}> = {
  "enemies-to-lovers": {
    label: "Enemies to Lovers",
    description: "You love the tension, the banter, and the spark that ignites into passion.",
    matchReason: "Based on your love of enemies-to-lovers dynamics",
  },
  "forbidden-love": {
    label: "Forbidden Love",
    description: "You're drawn to the thrill of what you can't have — and the courage to take it anyway.",
    matchReason: "Because you crave forbidden, high-stakes romance",
  },
  "second-chance": {
    label: "Second Chance",
    description: "You believe in the power of unfinished love stories finding their way back.",
    matchReason: "For fans of second-chance love stories",
  },
  "boss-employee": {
    label: "Boss/Employee",
    description: "You love the power dynamics, the stolen glances across the boardroom.",
    matchReason: "Perfect for fans of workplace romance",
  },
};

// Get the user's quiz result from localStorage
function getQuizResult(): string | null {
  try {
    const result = localStorage.getItem("romanceQuizResult");
    return result;
  } catch {
    return null;
  }
}

interface ReadersAlsoLovedProps {
  currentBookId: number;
  currentBookTropes?: string;
  currentBookSlug: string;
}

export function ReadersAlsoLoved({ currentBookId, currentBookTropes, currentBookSlug }: ReadersAlsoLovedProps) {
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"personalized" | "trope-match" | "series">("personalized");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setQuizResult(getQuizResult());
  }, []);

  // Fetch all books to build recommendations
  const { data: allBooks } = trpc.books.list.useQuery({});

  if (!allBooks || allBooks.length <= 1) return null;

  // Filter out current book
  const otherBooks = allBooks.filter((b: any) => b.id !== currentBookId);
  if (otherBooks.length === 0) return null;

  // Build recommendation categories
  const currentTropes = currentBookTropes?.split(",").map((t) => t.trim().toLowerCase()) || [];

  // 1. Trope-matched books (share tropes with current book)
  const tropeMatched = otherBooks
    .map((book: any) => {
      const bookTropes = book.tropes?.split(",").map((t: string) => t.trim().toLowerCase()) || [];
      const sharedTropes = currentTropes.filter((t: string) => bookTropes.includes(t));
      return { ...book, sharedTropes, matchScore: sharedTropes.length };
    })
    .filter((b: any) => b.matchScore > 0)
    .sort((a: any, b: any) => b.matchScore - a.matchScore);

  // 2. Series books (same series, different order)
  const seriesBooks = otherBooks.filter(
    (b: any) => b.series && allBooks.find((ab: any) => ab.id === currentBookId)?.series === b.series
  ).sort((a: any, b: any) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  // 3. Personalized (based on quiz result)
  const personalizedBooks = quizResult
    ? otherBooks
        .map((book: any) => {
          const bookTropes = book.tropes?.split(",").map((t: string) => t.trim().toLowerCase()) || [];
          const quizTropeLower = quizResult.toLowerCase().replace(/\s+/g, "-");
          const matchesQuiz = bookTropes.some(
            (t: string) =>
              t.includes(quizTropeLower) ||
              quizTropeLower.includes(t.replace(/\s+/g, "-"))
          );
          return { ...book, matchesQuiz, quizScore: matchesQuiz ? 2 : 0 };
        })
        .sort((a: any, b: any) => b.quizScore - a.quizScore)
    : [];

  const quizTropeKey = quizResult?.toLowerCase().replace(/\s+/g, "-") || "";
  const tropeInfo = TROPE_RECOMMENDATIONS[quizTropeKey];

  // Determine which tabs to show
  const tabs: { key: typeof activeTab; label: string; count: number }[] = [];
  if (quizResult && personalizedBooks.length > 0) {
    tabs.push({ key: "personalized", label: "For You", count: personalizedBooks.length });
  }
  if (tropeMatched.length > 0) {
    tabs.push({ key: "trope-match", label: "Similar Vibes", count: tropeMatched.length });
  }
  if (seriesBooks.length > 0) {
    tabs.push({ key: "series", label: "In This Series", count: seriesBooks.length });
  }

  // If no tabs, show a simple related section
  if (tabs.length === 0) {
    return null; // The existing "You Might Also Like" section handles this
  }

  // Set default active tab
  const validTab = tabs.find((t: any) => t.key === activeTab) ? activeTab : tabs[0]?.key || "trope-match";

  const getActiveBooks = () => {
    switch (validTab) {
      case "personalized":
        return personalizedBooks;
      case "trope-match":
        return tropeMatched;
      case "series":
        return seriesBooks;
      default:
        return otherBooks;
    }
  };

  const activeBooks = getActiveBooks();
  const booksPerPage = 3;
  const totalPages = Math.ceil(activeBooks.length / booksPerPage);
  const visibleBooks = activeBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? "fill-[#7A4F4C] text-[#7A4F4C]" : "text-[#4A3B3A]/20"
        }`}
      />
    ));
  };

  return (
    <div className="py-20 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#7A4F4C]" />
            <h2 className="text-4xl font-serif font-bold text-[#4A3B3A]">
              Readers Also Loved
            </h2>
            <Sparkles className="w-6 h-6 text-[#7A4F4C]" />
          </div>

          {/* Personalized message if quiz taken */}
          {quizResult && tropeInfo && validTab === "personalized" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C9A3A0]/15 to-[#C9A3A0]/5 border border-[#B59A6A]/30 mt-3"
            >
              <Heart className="w-4 h-4 text-[#7A4F4C] fill-[#7A4F4C]" />
              <span className="text-[#7A4F4C] text-sm font-medium">
                {tropeInfo.matchReason}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Tab Navigation */}
        {tabs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-3 mb-10"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(0);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  validTab === tab.key
                    ? "bg-[#4A3B3A] text-[#FAF7F7] shadow-lg shadow-[#C9A3A0]/20"
                    : "bg-[#EBD6D3]/30 text-[#FAF7F7]/70 border border-[#B59A6A]/20 hover:bg-[#C9A3A0]/10 hover:text-[#FAF7F7]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Book Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={validTab + currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleBooks.map((book: any, index: number) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/books/${book.slug}`}>
                  <div className="group cursor-pointer bg-[#EBD6D3]/30 backdrop-blur-xl border-2 border-[#B59A6A]/10 hover:border-[#B59A6A]/40 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A3A0]/10">
                    {/* Book Cover */}
                    <div className="relative overflow-hidden aspect-[2/3]">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F7] via-transparent to-transparent opacity-60" />

                      {/* Match Badge */}
                      {validTab === "personalized" && quizResult && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#C9A3A0]/90 text-[#4A3B3A] text-xs font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Picked for You
                        </div>
                      )}
                      {validTab === "trope-match" && "sharedTropes" in book && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#C9A3A0]/90 text-[#4A3B3A] text-xs font-bold flex items-center gap-1.5">
                          <Heart className="w-3 h-3" />
                          {(book as any).sharedTropes.length} Shared Trope{(book as any).sharedTropes.length > 1 ? "s" : ""}
                        </div>
                      )}
                      {validTab === "series" && book.seriesOrder && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#C9A3A0]/90 text-[#4A3B3A] text-xs font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" />
                          Book {book.seriesOrder}
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center justify-center gap-2 bg-[#4A3B3A] text-[#FAF7F7] rounded-xl py-2.5 px-4 font-semibold text-sm">
                          <BookOpen className="w-4 h-4" />
                          View Book
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-[#4A3B3A] mb-1.5 group-hover:text-[#7A4F4C] transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      {book.series && (
                        <p className="text-[#7A4F4C]/70 text-xs font-semibold tracking-wider uppercase mb-2">
                          {book.series} {book.seriesOrder ? `• Book ${book.seriesOrder}` : ""}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(book.rating || 0)}</div>
                        <span className="text-[#4A3B3A]/50 text-xs">
                          {(book.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      {/* Trope Tags */}
                      {book.tropes && (
                        <div className="flex flex-wrap gap-1.5">
                          {book.tropes
                            .split(",")
                            .slice(0, 3)
                            .map((trope: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-[#C9A3A0]/10 border border-[#B59A6A]/20 rounded text-[#7A4F4C]/80 text-xs"
                              >
                                {trope.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="border-[#B59A6A]/30 text-[#7A4F4C] hover:bg-[#C9A3A0]/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentPage
                      ? "bg-[#4A3B3A] scale-125"
                      : "bg-[#FAF7F7]/20 hover:bg-[#C9A3A0]/40"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="border-[#B59A6A]/30 text-[#7A4F4C] hover:bg-[#C9A3A0]/10 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Quiz CTA for non-quiz users */}
        {!quizResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-[#C9A3A0]/10 via-[#C9A3A0]/5 to-[#C9A3A0]/10 border border-[#B59A6A]/20 rounded-2xl p-8 max-w-lg">
              <Sparkles className="w-8 h-8 text-[#7A4F4C] mx-auto mb-3" />
              <h3 className="text-xl font-serif font-bold text-[#4A3B3A] mb-2">
                Get Personalized Recommendations
              </h3>
              <p className="text-[#4A3B3A]/60 text-sm mb-5">
                Take our 2-minute Romance Trope Quiz and we'll match you with your perfect Reese Astor book.
              </p>
              <Link href="/romance-quiz">
                <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-semibold px-6">
                  Take the Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
