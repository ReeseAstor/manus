import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { Lock, Unlock, Star, Calendar, BookOpen, Sparkles } from "lucide-react";
import { MemberBenefits } from "@/components/MemberBenefits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ReaderClub() {
  useEffect(() => {
    document.title = "Reader's Club | Reese Astor";
  }, []);

  const [email, setEmail] = useState("");
  const { data: member, isLoading: memberLoading } = trpc.readerClub.checkMembership.useQuery({ email });
  const { data: content, isLoading: contentLoading } = trpc.readerClub.getAllContent.useQuery();
  const joinMutation = trpc.readerClub.join.useMutation();

  const isMember = !!member;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await joinMutation.mutateAsync({ email, name: "" });
      alert("Welcome to the Reader's Club! Check your email for confirmation.");
      window.location.reload();
    } catch (error) {
      alert("Failed to join. Please try again.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bonus_chapter":
        return <BookOpen className="h-5 w-5" />;
      case "interview":
        return <Star className="h-5 w-5" />;
      case "behind_scenes":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bonus_chapter":
        return "Bonus Chapter";
      case "interview":
        return "Character Interview";
      case "behind_scenes":
        return "Behind the Scenes";
      default:
        return type;
    }
  };

  if (memberLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f2e] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f2e] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="Reader's Club | Reese Astor"
        description="New-release news from Reese Astor. The First Acquisition, the Hudson Dynasty prequel, is free."
        canonical="/reader-club"
        keywords={["reader club", "Reese Astor", "The First Acquisition", "romance reader community"]}
      />

      {/* Hero Section */}
      <div
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/manhattan-penthouse.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0e1a]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 mb-8">
            <Sparkles className="h-5 w-5 text-[#d4af37]" />
            <span className="text-[#d4af37] font-semibold">Reader's Club</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-white mb-6">
            Reader's Club
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            New-release news from Reese Astor. The First Acquisition, the Hudson Dynasty prequel, is free.
          </p>

          {!isMember && (
            <motion.form
              onSubmit={handleJoin}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <Button
                type="submit"
                disabled={joinMutation.isPending}
                className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {joinMutation.isPending ? "Joining..." : "Join Free"}
              </Button>
            </motion.form>
          )}

          {isMember && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#d4af37]/20 border-2 border-[#d4af37]"
            >
              <Unlock className="h-6 w-6 text-[#d4af37]" />
              <span className="text-white font-semibold text-lg">You're a Member!</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Content Library */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Reader's Club
          </h2>
          <p className="text-gray-400 text-lg">
            {isMember
              ? "Posts for Reader's Club members."
              : "Join to see member posts."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 h-full">
                {/* Cover Image */}
                {item.coverImage && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Lock Overlay for Non-Members */}
                    {!isMember && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="h-12 w-12 text-[#d4af37]" />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Type Badge */}
                  <Badge className="mb-3 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                    <span className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      {getTypeLabel(item.type)}
                    </span>
                  </Badge>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.publishDate).toLocaleDateString()}
                    </span>
                    {item.category && (
                      <span className="text-[#d4af37]">{item.category}</span>
                    )}
                  </div>

                  {/* Action Button */}
                  {isMember ? (
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold"
                    >
                      <Link href={`/reader-club/${item.slug}`}>
                        Read Now
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Join to Unlock
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {content?.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Nothing is posted here yet.
            </p>
          </div>
        )}
      </div>

      {/* Member Benefits Section */}
      {!isMember && <MemberBenefits />}

      {/* CTA Section for Non-Members */}
      {!isMember && (
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 to-[#c9a961]/5 border border-[#d4af37]/20"
          >
            <Sparkles className="h-12 w-12 text-[#d4af37] mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Ready to Join?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              New-release news from Reese Astor. The First Acquisition is free. Joining is free.
            </p>
            <Button
              onClick={() => {
                document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="px-12 py-6 bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Join the Reader's Club
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
