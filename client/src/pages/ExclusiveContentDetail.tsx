import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Calendar, BookOpen, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function ExclusiveContentDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  
  const { data: content, isLoading: contentLoading } = trpc.readerClub.getContentBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );
  
  const { data: member } = trpc.readerClub.checkMembership.useQuery(
    { email },
    { enabled: !!email }
  );
  
  const trackAccessMutation = trpc.readerClub.trackAccess.useMutation();

  const isMember = !!member;

  // Check for stored email in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("readerClubEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Track content access when member views content
  useEffect(() => {
    if (isMember && content && email) {
      trackAccessMutation.mutate({ email, contentId: content.id });
    }
  }, [isMember, content, email]);

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

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <div className="text-[#7A4F4C] text-xl">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#4A3B3A] mb-4">Content Not Found</h1>
          <Button asChild>
            <Link href="/newsletter">Back to Reader's Club</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If not a member, show locked content
  if (!isMember) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
        <div className="container mx-auto px-4 py-20">
          <Button
            variant="ghost"
            onClick={() => setLocation("/newsletter")}
            className="mb-8 text-[#6E5F5A] hover:text-[#4A3B3A]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reader's Club
          </Button>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-3xl bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border border-[#B59A6A]/20"
            >
              <Lock className="h-20 w-20 text-[#7A4F4C] mx-auto mb-6" />
              <h1 className="font-serif text-4xl font-bold text-[#4A3B3A] mb-4">
                Members-Only Content
              </h1>
              <p className="text-[#6E5F5A] text-lg mb-8">
                This exclusive content is available only to Reader's Club members.
                Join for free to unlock access!
              </p>
              <Button
                size="lg"
                onClick={() => setLocation("/newsletter")}
                className="px-12 py-6 bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold text-lg rounded-xl"
              >
                Join the Reader's Club
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
      {/* Hero Section */}
      {content.coverImage && (
        <div
          className="relative h-[50vh] flex items-end overflow-hidden"
          style={{
            backgroundImage: `url(${content.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F7]/50 via-[#FAF7F7]/70 to-[#FAF7F7]" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/newsletter")}
            className="mb-8 text-[#6E5F5A] hover:text-[#4A3B3A]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reader's Club
          </Button>

          {/* Type Badge */}
          <Badge className="mb-4 bg-[#C9A3A0]/20 text-[#7A4F4C] border border-[#B59A6A]/30">
            <span className="flex items-center gap-2">
              {getTypeIcon(content.type)}
              {getTypeLabel(content.type)}
            </span>
          </Badge>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold text-[#4A3B3A] mb-6"
          >
            {content.title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-6 text-[#6E5F5A] mb-12 pb-12 border-b border-[#4A3B3A]/10"
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {new Date(content.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {content.category && (
              <span className="text-[#7A4F4C]">{content.category}</span>
            )}
          </motion.div>

          {/* Description */}
          {content.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[#6E5F5A] mb-12 leading-relaxed"
            >
              {content.description}
            </motion.div>
          )}

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none mb-16"
          >
            <Streamdown>{content.content}</Streamdown>
          </motion.article>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-[#C9A3A0]/10 to-[#C9A3A0]/5 border border-[#B59A6A]/20 text-center"
          >
            <Sparkles className="h-10 w-10 text-[#7A4F4C] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#4A3B3A] mb-3">
              Enjoying the Exclusive Content?
            </h3>
            <p className="text-[#6E5F5A] mb-6">
              Explore more bonus chapters, character interviews, and behind-the-scenes content
              in the Reader's Club.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold"
            >
              <Link href="/newsletter">Explore More Content</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
