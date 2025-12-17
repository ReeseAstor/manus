import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Star, Gift, Sparkles, ArrowRight, Crown } from "lucide-react";
import { Link } from "wouter";

interface BundleOption {
  id: string;
  name: string;
  description: string;
  books: number;
  originalPrice: number;
  bundlePrice: number;
  memberPrice: number;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
}

const bundleOptions: BundleOption[] = [
  {
    id: "single",
    name: "Single Book",
    description: "Start your Manhattan journey",
    books: 1,
    originalPrice: 499,
    bundlePrice: 399,
    memberPrice: 299,
    features: [
      "Choose any book in the series",
      "Instant digital delivery",
      "ePub, Mobi & PDF formats",
    ],
  },
  {
    id: "trilogy",
    name: "Complete Trilogy",
    description: "The full Manhattan Money Kings series",
    books: 3,
    originalPrice: 1497,
    bundlePrice: 999,
    memberPrice: 799,
    features: [
      "All 3 Manhattan Money Kings books",
      "Instant digital delivery",
      "ePub, Mobi & PDF formats",
      "Bonus: Character interviews",
      "Bonus: Deleted scenes",
    ],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Collection",
    description: "Everything + exclusive content",
    books: 4,
    originalPrice: 1796,
    bundlePrice: 1299,
    memberPrice: 999,
    features: [
      "Complete trilogy + prequel",
      "Instant digital delivery",
      "All formats included",
      "Exclusive bonus chapters",
      "Behind-the-scenes content",
      "Character mood boards",
      "Author's playlist",
      "Early access to Book 4",
    ],
    bestValue: true,
  },
];

export default function Shop() {
  const { data: books } = trpc.books.list.useQuery();

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const calculateSavings = (original: number, sale: number) =>
    Math.round(((original - sale) / original) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/manhattan-night.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e27]/80 to-[#0a0e27]" />

        <div className="container max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-4 py-2 text-[#d4af37] text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Buy Direct & Save Up to 40%
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#e5e5e5] mb-6">
              Manhattan Money Kings
              <br />
              <span className="text-[#d4af37]">Book Shop</span>
            </h1>
            <p className="text-xl text-[#e5e5e5]/70 max-w-2xl mx-auto mb-8">
              Get the complete billionaire romance series at exclusive direct prices. 
              Save money, support the author, and receive bonus content with every purchase.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bundle Options */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-4">
              Choose Your Package
            </h2>
            <p className="text-[#e5e5e5]/70 text-lg">
              All purchases include instant delivery and multiple formats
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundleOptions.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden ${
                  bundle.popular || bundle.bestValue
                    ? "border-2 border-[#d4af37]"
                    : "border border-[#d4af37]/20"
                }`}
              >
                {/* Badge */}
                {(bundle.popular || bundle.bestValue) && (
                  <div className="absolute top-0 left-0 right-0 bg-[#d4af37] text-[#0a0e27] text-center py-2 font-bold text-sm">
                    {bundle.bestValue ? (
                      <span className="flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4" /> BEST VALUE
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" /> MOST POPULAR
                      </span>
                    )}
                  </div>
                )}

                <div className={`p-8 ${bundle.popular || bundle.bestValue ? "pt-14" : ""}`}>
                  {/* Header */}
                  <h3 className="text-2xl font-serif font-bold text-[#e5e5e5] mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-[#e5e5e5]/60 text-sm mb-6">{bundle.description}</p>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-[#d4af37]">
                        {formatPrice(bundle.bundlePrice)}
                      </span>
                      <span className="text-lg text-[#e5e5e5]/40 line-through">
                        {formatPrice(bundle.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-semibold">
                        Save {calculateSavings(bundle.originalPrice, bundle.bundlePrice)}%
                      </span>
                      <span className="text-[#e5e5e5]/50 text-xs">
                        {bundle.books} book{bundle.books > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Member Price */}
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg p-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[#e5e5e5]/70 text-sm">Reader's Club Price:</span>
                      <span className="text-[#d4af37] font-bold">
                        {formatPrice(bundle.memberPrice)}
                      </span>
                    </div>
                    <p className="text-[#e5e5e5]/50 text-xs mt-1">
                      Save {calculateSavings(bundle.originalPrice, bundle.memberPrice)}% as a member
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {bundle.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                        <span className="text-[#e5e5e5]/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-6 font-bold text-lg rounded-xl transition-all hover:scale-[1.02] ${
                      bundle.popular || bundle.bestValue
                        ? "bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]"
                        : "bg-white/10 hover:bg-white/20 text-[#e5e5e5] border border-[#d4af37]/30"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Get {bundle.name}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Books */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0a0e27]/50">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-4">
              Or Buy Individual Books
            </h2>
            <p className="text-[#e5e5e5]/70 text-lg">
              Start with any book in the series
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books?.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/books/${book.slug}`}>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 transition-all">
                    {/* Savings Badge */}
                    {book.retailPrice && book.directPrice && book.retailPrice > book.directPrice && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-[#d4af37] text-[#0a0e27] px-2 py-1 rounded-full text-xs font-bold">
                          Save {calculateSavings(book.retailPrice, book.directPrice)}%
                        </span>
                      </div>
                    )}

                    {/* Book Cover */}
                    <div className="relative overflow-hidden">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-serif font-bold text-[#e5e5e5] mb-1 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                        {book.title}
                      </h3>
                      {book.series && (
                        <p className="text-[#e5e5e5]/50 text-xs mb-3">
                          {book.series} • Book {book.seriesOrder}
                        </p>
                      )}

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#d4af37]">
                          {formatPrice(book.directPrice || 399)}
                        </span>
                        {book.retailPrice && book.directPrice && book.retailPrice > book.directPrice && (
                          <span className="text-sm text-[#e5e5e5]/40 line-through">
                            {formatPrice(book.retailPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy Direct CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border-2 border-[#d4af37]/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <Gift className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-[#e5e5e5] mb-4">
              Join the Reader's Club for Even More Savings
            </h2>
            <p className="text-[#e5e5e5]/70 text-lg mb-8 max-w-2xl mx-auto">
              Get 40% off all books, early access to new releases, exclusive bonus content, 
              and a FREE prequel when you join. It's completely free to sign up!
            </p>
            <Link href="/reader-club">
              <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-bold text-lg px-8 py-6 rounded-xl">
                Join Reader's Club Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
