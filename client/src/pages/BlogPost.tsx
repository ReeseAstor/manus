import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { useEffect } from "react";
import { EnhancedSEOHead, generateArticleSchema } from "@/components/ui/enhanced-seo-head";
import { breadcrumbSchema } from "@/data/structured-data";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@shared/site";
import { BlogToShopBridge } from "@/components/BlogToShopBridge";
import { BlogContentUpgrade } from "@/components/BlogContentUpgrade";
import { AffiliateProductSection, FTCDisclosure } from "@/components/AffiliateProductCard";
import { affiliateProductsBySlug } from "@/data/affiliateProducts";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });
  const { data: relatedPosts } = trpc.blog.list.useQuery(
    { published: true, category: post?.category },
    { enabled: !!post?.category }
  );

  // Filter out current post from related posts and limit to 3
  const filteredRelatedPosts = relatedPosts
    ?.filter((p) => p.slug !== slug)
    .slice(0, 3) || [];

  // Check if this article has affiliate product data
  const affiliateData = slug ? affiliateProductsBySlug[slug] : undefined;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7A4F4C]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl font-bold text-[#4A3B3A]">Post Not Found</h1>
          <p className="text-[#6E5F5A]">The blog post you're looking for doesn't exist.</p>
          <Button
            asChild
            className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-8 py-6 rounded-full"
          >
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
      <EnhancedSEOHead
        title={`${post.title} | Reese Astor`}
        description={(post as { metaDescription?: string | null }).metaDescription || post.excerpt || post.title}
        canonical={`/blog/${slug}`}
        ogType="article"
        ogImage={(post as { featuredImage?: string | null }).featuredImage || undefined}
        publishDate={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}
        modifiedDate={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
        structuredData={[
          generateArticleSchema({
            title: post.title,
            description: post.excerpt ?? post.title,
            url: absoluteUrl(`/blog/${slug}`),
            image: absoluteUrl((post as { featuredImage?: string | null }).featuredImage || DEFAULT_OG_IMAGE),
            publishDate: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
            modifiedDate: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#C9A3A0]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link href="/blog">
              <Button
                variant="ghost"
                className="mb-8 text-[#6E5F5A] hover:text-[#7A4F4C] hover:bg-[#EBD6D3]/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Category Badge */}
            <Badge className="bg-[#C9A3A0]/10 text-[#7A4F4C] border border-[#B59A6A]/30 px-4 py-1 text-sm font-medium mb-6">
              {post.category}
            </Badge>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#4A3B3A] mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-[#6E5F5A] mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {post.publishedAt
                    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                    : format(new Date(post.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 pb-8 border-b border-[#4A3B3A]/10">
              <span className="text-[#6E5F5A] text-sm font-medium">Share:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="text-[#6E5F5A] hover:text-[#7A4F4C] hover:bg-[#EBD6D3]/30"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="text-[#6E5F5A] hover:text-[#7A4F4C] hover:bg-[#EBD6D3]/30"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="text-[#6E5F5A] hover:text-[#7A4F4C] hover:bg-[#EBD6D3]/30"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("copy")}
                className="text-[#6E5F5A] hover:text-[#7A4F4C] hover:bg-[#EBD6D3]/30"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image Hero Banner */}
      {post.featuredImage && (
        <section className="relative">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#4A3B3A]/50 -mt-8"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F7]/40 to-transparent" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-16 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Excerpt */}
            <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10">
              <p className="text-xl text-[#6E5F5A] leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Audio Player */}
            {post.audioUrl && (
              <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-[#C9A3A0]/10 via-transparent to-[#C9A3A0]/5 border-2 border-[#B59A6A]/20 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A3A0] to-[#C9A3A0] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#4A3B3A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#4A3B3A]">Listen to this Article</h3>
                    <p className="text-sm text-[#6E5F5A]">Audio narration available</p>
                  </div>
                </div>
                <audio
                  controls
                  className="w-full"
                  style={{
                    filter: 'invert(1) hue-rotate(180deg)',
                    borderRadius: '12px',
                  }}
                >
                  <source src={post.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* FTC Disclosure for affiliate articles */}
            {affiliateData?.ftcDisclosure && <FTCDisclosure />}

            {/* Main Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-16">
              <div className="text-[#6E5F5A] leading-relaxed space-y-6 text-lg">
                <Streamdown>{post.content}</Streamdown>
              </div>
            </div>

            {/* Content Upgrade - Contextual email capture */}
            <BlogContentUpgrade blogSlug={slug} />

            {/* Affiliate Product Recommendations */}
            {affiliateData?.topPicks && affiliateData.topPicks.length > 0 && (
              <AffiliateProductSection
                products={affiliateData.topPicks}
                title="Top Picks"
                subtitle="Recommended Products from This Article"
                sourceSlug={post.slug}
              />
            )}

            {/* Author Bio Section */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-[#C9A3A0]/10 via-transparent to-[#C9A3A0]/5 border-2 border-[#B59A6A]/20 backdrop-blur-xl shadow-2xl mb-16">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 flex items-center justify-center border-2 border-[#B59A6A]/30">
                    <span className="text-3xl font-serif font-bold text-[#7A4F4C]">RA</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-[#4A3B3A] mb-3">
                    About Reese Astor
                  </h3>
                  <p className="text-[#6E5F5A] leading-relaxed mb-4">
                    Reese Astor writes steamy billionaire romance set in Manhattan: the Hudson Dynasty and the Manhattan Money Kings. Every book stands alone and ends happily.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-6 py-5 rounded-full"
                    >
                      <Link href="/about">Learn More</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-2 border-[#4A3B3A]/20 bg-[#EBD6D3]/30 hover:bg-[#EBD6D3]/60 text-[#4A3B3A] font-semibold px-6 py-5 rounded-full"
                    >
                      <Link href="/books">View Books</Link>
                    </Button>
                  </div>
                </div>
              </div>
            {/* Blog to Shop Bridge */}
            <BlogToShopBridge category={post.category?.toLowerCase().replace(/\s+/g, '-')} />
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Posts Section */}
      {filteredRelatedPosts.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#4A3B3A] text-center mb-12">
                Related Articles
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {filteredRelatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#C9A3A0]/10">
                        <div className="space-y-4">
                          <Badge className="bg-[#C9A3A0]/10 text-[#7A4F4C] border border-[#B59A6A]/30 px-4 py-1 text-xs font-medium">
                            {relatedPost.category}
                          </Badge>

                          <h3 className="font-serif text-xl font-bold text-[#4A3B3A] group-hover:text-[#7A4F4C] transition-colors leading-tight">
                            {relatedPost.title}
                          </h3>

                          <p className="text-[#6E5F5A] leading-relaxed line-clamp-3 text-sm">
                            {relatedPost.excerpt}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-[#6E5F5A] pt-4 border-t border-[#4A3B3A]/10">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/blog">View All Articles</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
