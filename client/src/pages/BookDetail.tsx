import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { EnhancedSEOHead, generateBookSchema } from "@/components/ui/enhanced-seo-head";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, Heart, Share2 } from "lucide-react";
import { BuyDirectSection } from "@/components/BuyDirectSection";
import { WhyBuyDirectInline } from "@/components/WhyBuyDirect";
import { ReadersAlsoLoved } from "@/components/ReadersAlsoLoved";
import { motion } from "framer-motion";

export default function BookDetail() {
  const [, params] = useRoute("/books/:slug");
  const slug = params?.slug || "";
  
  const [showFullChapter, setShowFullChapter] = useState(false);
  
  const { data: book, isLoading } = trpc.books.getBySlug.useQuery({ slug });
  const { data: reviews } = trpc.books.getReviews.useQuery(
    { bookId: book?.id! },
    { enabled: !!book?.id }
  );
  const { data: relatedBooks } = trpc.books.getRelated.useQuery(
    { bookId: book?.id!, limit: 3 },
    { enabled: !!book?.id }
  );

  // Track book view for logged-in users
  const { user } = useAuth();
  const trackViewMutation = trpc.profile.trackView.useMutation();
  
  useEffect(() => {
    if (user && book?.id) {
      trackViewMutation.mutate({ bookId: book.id });
    }
  }, [user, book?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-4">Book Not Found</h1>
          <Link href="/books">
            <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]">
              Back to Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-[#d4af37] text-[#d4af37]" : "text-[#e5e5e5]/20"
        }`}
      />
    ));
  };

  const buyLinks = [
    { name: "Amazon", url: book.amazonUrl, icon: "📚" },
    { name: "Apple Books", url: book.appleUrl, icon: "🍎" },
    { name: "Kobo", url: book.koboUrl, icon: "📖" },
    { name: "Barnes & Noble", url: book.barnesNobleUrl, icon: "🏛️" },
    { name: "Google Play", url: book.googlePlayUrl, icon: "▶️" },
  ].filter((link) => link.url);

  const bookSchema = generateBookSchema({
    name: book.title,
    description: book.description || `${book.title} by Reese Astor - A Manhattan Money Kings billionaire romance.`,
    url: `https://reeseastor.com/books/${slug}`,
    genre: "Billionaire Romance",
    currency: "USD",
    rating: book.rating || undefined,
    reviewCount: reviews?.length || undefined,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <EnhancedSEOHead
        title={`${book.title} | Reese Astor Romance`}
        description={book.description?.slice(0, 155) || `Read ${book.title} by Reese Astor. A steamy Manhattan billionaire romance from the Manhattan Money Kings series.`}
        canonical={`/books/${slug}`}
        ogType="book"
        keywords={[book.title, "Reese Astor", "billionaire romance", "Manhattan Money Kings", slug.replace(/-/g, " ")]}
        structuredData={[bookSchema]}
      />

      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/manhattan-night.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e27]/80 to-[#0a0e27]" />

        <div className="container max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          >
            {/* Book Cover */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="relative w-full max-w-md rounded-2xl shadow-2xl border-4 border-[#d4af37]/30"
                />
                {book.series && (
                  <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0a0e27] px-4 py-2 rounded-full font-bold text-sm">
                    Book {book.seriesOrder}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              {book.series && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[#d4af37] text-sm font-semibold tracking-wider uppercase">
                    {book.series} • Book {book.seriesOrder}
                  </p>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl lg:text-6xl font-serif font-bold text-[#e5e5e5] leading-tight"
              >
                {book.title}
              </motion.h1>

              {/* Rating */}
              {(book.rating ?? 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex">{renderStars(book.rating!)}</div>
                  <span className="text-[#e5e5e5]/60 text-lg">
                    {book.rating!.toFixed(1)} ({book.reviewCount || 0} reviews)
                  </span>
                </motion.div>
              )}

              {/* Metadata */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-3"
              >
                {book.heatLevel && (
                  <span className="px-4 py-2 bg-white/5 border border-[#d4af37]/20 rounded-full text-[#e5e5e5] text-sm">
                    🔥 Heat Level: {book.heatLevel}/5
                  </span>
                )}
                {book.pageCount && (
                  <span className="px-4 py-2 bg-white/5 border border-[#d4af37]/20 rounded-full text-[#e5e5e5] text-sm">
                    📄 {book.pageCount} pages
                  </span>
                )}
                {book.publishDate && (
                  <span className="px-4 py-2 bg-white/5 border border-[#d4af37]/20 rounded-full text-[#e5e5e5] text-sm">
                    📅 {new Date(book.publishDate).getFullYear()}
                  </span>
                )}
              </motion.div>

              {/* Tropes */}
              {book.tropes && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-2"
                >
                  {book.tropes.split(",").map((trope, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-[#d4af37] text-sm font-semibold"
                    >
                      {trope.trim()}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Video Trailer */}
              {book.trailerVideoUrl && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="rounded-2xl overflow-hidden border-2 border-[#d4af37]/20"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-sm mx-auto rounded-2xl"
                    poster={book.coverImage}
                  >
                    <source src={book.trailerVideoUrl} type="video/mp4" />
                  </video>
                </motion.div>
              )}

              {/* Audio Sample */}
              {book.audioSampleUrl && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-[#d4af37]/20">
                      <svg className="h-5 w-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#e5e5e5]">Listen to Sample</p>
                      <p className="text-xs text-[#e5e5e5]/60">Narrated excerpt from the book</p>
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
                </motion.div>
              )}

              {/* Buy Direct Section */}
              <BuyDirectSection
                retailPrice={book.retailPrice || 499}
                directPrice={book.directPrice || 399}
                memberPrice={book.memberPrice || 299}
                directSaleUrl={book.directSaleUrl}
                amazonUrl={book.amazonUrl}
                bookTitle={book.title}
              />
              
              {/* Why Buy Direct */}
              <WhyBuyDirectInline />

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-3"
              >
                <Button
                  variant="outline"
                  className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-6">
              About This Book
            </h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[#e5e5e5]/80 text-lg leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sample Chapter */}
      {book.sampleChapter && (
        <div className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0a0e27]/50">
          <div className="container max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-6">
                Read a Sample
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <div
                  className={`text-[#e5e5e5]/80 text-lg leading-relaxed whitespace-pre-line ${
                    !showFullChapter ? "max-h-96 overflow-hidden relative" : ""
                  }`}
                >
                  {book.sampleChapter}
                  {!showFullChapter && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e27] to-transparent" />
                  )}
                </div>
              </div>
              <Button
                onClick={() => setShowFullChapter(!showFullChapter)}
                variant="outline"
                className="mt-6 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
              >
                {showFullChapter ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Read More
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-serif font-bold text-[#e5e5e5] mb-12 text-center"
            >
              Reader Reviews
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold text-lg">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[#e5e5e5] font-semibold">
                        {review.reviewerName}
                      </h3>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-[#e5e5e5]/70 leading-relaxed line-clamp-4">
                    {review.review}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Readers Also Loved - Personalized Recommendations */}
      <ReadersAlsoLoved
        currentBookId={book.id}
        currentBookTropes={book.tropes || undefined}
        currentBookSlug={slug}
      />
    </div>
  );
}
