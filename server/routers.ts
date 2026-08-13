import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { aiRouter } from "./routers/ai-simple";
import { stripeRouter } from "./routers/stripe";
import { stripeAnalyticsRouter } from "./routers/stripeAnalytics";
import { vipRouter } from "./routers/vip";
import { audioRouter } from "./routers/audio";
import { adminRouter } from "./routers/admin";
import { twilioRouter } from "./routers/twilio";
import { smsAnalyticsRouter } from "./routers/smsAnalytics";
import { kieRouter } from "./routers/kie";
import { commandCenterRouter } from "./routers/commandCenter";
import { affiliateTrackingRouter } from "./routers/affiliateTracking";
import { partnerApplicationsRouter } from "./routers/partnerApplications";
import { switchyRouter } from "./routers/switchy";
import { workflowRouter } from "./routers/workflow";
import { aiUsageRouter } from "./routers/ai-usage";
import { canonRouter } from "./routers/canon";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscribeToMailerLite, sendMailerLiteCampaign, getMailerLiteSubscribers } from "./mailerlite";
import { sendEmail } from "./email-service";
import { generateWelcomeEmail } from "./email-templates/welcome";
import { generateEmailTemplate, sanitizeEmailContent } from "./emailTemplate";
import { postPurchaseSequence, generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3 } from "./email-templates/post-purchase";
import { winBackSequence, generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3 } from "./email-templates/win-back";
import { launchSequence, generateLaunchEmail1, generateLaunchEmail2, generateLaunchEmail3 } from "./email-templates/launch-sequence";
import { seriesUpsellSequence, generateSeriesUpsellEmail1, generateSeriesUpsellEmail2, generateSeriesUpsellEmail3 } from "./email-templates/series-upsell";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllBooks,
  getBookBySlug,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookReviews,
  createBookReview,
  deleteBookReview,
  getRelatedBooks,
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  getAllSubscribers,
  getSubscriberByEmail,
  createSubscriber,
  updateSubscriber,
  unsubscribeByEmail,
  getAllExclusiveContent,
  getFeaturedExclusiveContent,
  getExclusiveContentBySlug,
  getExclusiveContentById,
  createExclusiveContent,
  updateExclusiveContent,
  deleteExclusiveContent,
  getReaderClubMemberByEmail,
  createReaderClubMember,
  updateReaderClubMemberAccess,
  trackContentAccess,
  getContentAccessStats,
  getUserPreferences,
  upsertUserPreferences,
  getUserWithPreferences,
  trackBookView,
  getRecentlyViewedBooks,
  clearBrowsingHistory,
  getUserPurchases,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  stripe: stripeRouter,
  stripeAnalytics: stripeAnalyticsRouter,
  vip: vipRouter,
  audio: audioRouter,
  admin: adminRouter,
  twilio: twilioRouter,
  smsAnalytics: smsAnalyticsRouter,
  kie: kieRouter,
  commandCenter: commandCenterRouter,
  affiliateTracking: affiliateTrackingRouter,
  partnerApplications: partnerApplicationsRouter,
  switchy: switchyRouter,
  workflow: workflowRouter,
  aiUsage: aiUsageRouter,
  canon: canonRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Please enter a valid email address"),
          name: z.string().optional(),
          /**
           * Optional MailerLite group ID. When set, the subscriber is added
           * to this group instead of (or in addition to, depending on the
           * MailerLite SDK) the default Reader's Club group. Used by
           * landing-specific forms (e.g. /permission) to drive launch
           * segmentation.
           */
          groupId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // MailerLite group IDs must be numeric. Sanitize any configured value
        // so a malformed/non-numeric env var can't cause the whole signup to
        // fail with a 422. An empty/invalid value is treated as "no group".
        const rawGroupId = input.groupId || process.env.MAILERLITE_GROUP_ID;
        const groupId =
          rawGroupId && /^\d+$/.test(rawGroupId.trim())
            ? rawGroupId.trim()
            : undefined;
        const result = await subscribeToMailerLite(
          input.email,
          input.name,
          groupId
        );
        
        if (!result.success) {
          throw new Error(result.message);
        }

        // The free book is delivered via BookFunnel/BookHip. MailerLite does
        // not expose a transactional /emails endpoint, so we surface the
        // download link to the client (shown + auto-opened on the success
        // screen) and rely on a MailerLite automation for the welcome email.
        // We still attempt the welcome email for environments where a custom
        // transactional sender is wired up, but never fail the signup on it.
        const bookDownloadUrl = "https://swiy.co/05";

        try {
          const welcomeHtml = generateWelcomeEmail({
            subscriberName: input.name,
          });
          await sendEmail({
            to: input.email,
            subject: "Welcome! Your Free Book Is Waiting \u{1F4D6}",
            html: welcomeHtml,
          });
          console.log(`[Newsletter] Welcome email attempted for ${input.email}`);
        } catch (emailError) {
          // Log but don't fail the subscription if the welcome email fails
          console.error("[Newsletter] Failed to send welcome email:", emailError);
        }

        return { ...result, bookDownloadUrl };
      }),
  }),

  blog: router({
    uploadImage: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileType: z.string(),
          fileData: z.string(), // base64 encoded
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can upload images",
          });
        }

        // Decode base64 and upload to S3
        const buffer = Buffer.from(input.fileData, "base64");
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const key = `blog-images/${timestamp}-${randomSuffix}-${input.fileName}`;
        
        const result = await storagePut(key, buffer, input.fileType);
        
        return {
          url: result.url,
          key: result.key,
        };
      }),

    list: publicProcedure
      .input(
        z.object({
          published: z.boolean().optional(),
          category: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        const posts = await getAllBlogPosts(input?.published, input?.category);
        return posts;
      }),

    // Content calendar - get all posts with scheduled dates for admin view
    contentCalendar: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      const { getScheduledPosts } = await import("./cron/blogPublisher");
      const scheduled = await getScheduledPosts();
      const allPosts = await getAllBlogPosts();
      return {
        scheduled,
        published: allPosts.filter((p: any) => p.published === 'published'),
        drafts: allPosts.filter((p: any) => p.published === 'draft' && !p.scheduledPublishAt),
        total: allPosts.length,
      };
    }),

    // Trigger scheduled post publishing manually
    publishScheduled: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      const { publishScheduledPosts } = await import("./cron/blogPublisher");
      return await publishScheduledPosts();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }
        return post;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().min(1),
          content: z.string().min(1),
          category: z.string().min(1),
          readTime: z.string().min(1),
          published: z.enum(["draft", "published"]).default("draft"),
          scheduledPublishAt: z.string().nullable().optional(),
          seoKeywords: z.string().nullable().optional(),
          metaDescription: z.string().max(320).nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can create blog posts",
          });
        }

        const publishedAt = input.published === "published" ? new Date() : null;
        const scheduledPublishAt = input.scheduledPublishAt ? new Date(input.scheduledPublishAt) : null;
        
        await createBlogPost({
          ...input,
          authorId: ctx.user.id,
          publishedAt,
          scheduledPublishAt,
          seoKeywords: input.seoKeywords || null,
          metaDescription: input.metaDescription || null,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          excerpt: z.string().min(1).optional(),
          content: z.string().min(1).optional(),
          category: z.string().min(1).optional(),
          readTime: z.string().min(1).optional(),
          published: z.enum(["draft", "published"]).optional(),
          scheduledPublishAt: z.string().nullable().optional(),
          seoKeywords: z.string().nullable().optional(),
          metaDescription: z.string().max(320).nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update blog posts",
          });
        }

        const { id, scheduledPublishAt: scheduledStr, ...updateData } = input;
        
        // If publishing for the first time, set publishedAt
        if (updateData.published === "published") {
          const existingPost = await getBlogPostBySlug(input.slug || "");
          if (existingPost && !existingPost.publishedAt) {
            (updateData as any).publishedAt = new Date();
          }
        }

        const finalUpdate: any = { ...updateData };
        if (scheduledStr !== undefined) {
          finalUpdate.scheduledPublishAt = scheduledStr ? new Date(scheduledStr) : null;
        }

        await updateBlogPost(id, finalUpdate);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can delete blog posts",
          });
        }

        await deleteBlogPost(input.id);
        return { success: true };
      }),

    generateAudio: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can generate audio",
          });
        }

        const { generateSpeech } = await import("./_core/textToSpeech");
        
        // Get the blog post
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }

        // Generate audio from blog content
        const audioBuffer = await generateSpeech(post.content);
        
        // Upload to S3
        const timestamp = Date.now();
        const key = `blog-audio/${post.slug}-${timestamp}.mp3`;
        const result = await storagePut(key, audioBuffer, "audio/mpeg");
        
        // Update blog post with audio URL
        await updateBlogPost(post.id, { audioUrl: result.url });
        
        return {
          success: true,
          audioUrl: result.url,
        };
      }),
  }),

  books: router({
    list: publicProcedure
      .input(z.object({ featuredOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return await getAllBooks(input?.featuredOnly);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const book = await getBookBySlug(input.slug);
        if (!book) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found",
          });
        }
        return book;
      }),

    getReviews: publicProcedure
      .input(z.object({ bookId: z.number(), featuredOnly: z.boolean().optional() }))
      .query(async ({ input }) => {
        return await getBookReviews(input.bookId, input.featuredOnly);
      }),

    getRelated: publicProcedure
      .input(z.object({ bookId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getRelatedBooks(input.bookId, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          series: z.string().optional(),
          seriesOrder: z.number().optional(),
          coverImage: z.string().min(1),
          description: z.string().min(1),
          sampleChapter: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          reviewCount: z.number().optional(),
          tropes: z.string().optional(),
          heatLevel: z.number().min(1).max(5).optional(),
          pageCount: z.number().optional(),
          publishDate: z.string().optional(),
          amazonUrl: z.string().optional(),
          appleUrl: z.string().optional(),
          koboUrl: z.string().optional(),
          barnesNobleUrl: z.string().optional(),
          googlePlayUrl: z.string().optional(),
          featured: z.boolean().optional(),
          displayOrder: z.number().optional(),
          trailerVideoUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can create books",
          });
        }
        await createBook(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          series: z.string().optional(),
          seriesOrder: z.number().optional(),
          coverImage: z.string().optional(),
          description: z.string().optional(),
          sampleChapter: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          reviewCount: z.number().optional(),
          tropes: z.string().optional(),
          heatLevel: z.number().min(1).max(5).optional(),
          pageCount: z.number().optional(),
          publishDate: z.string().optional(),
          amazonUrl: z.string().optional(),
          appleUrl: z.string().optional(),
          koboUrl: z.string().optional(),
          barnesNobleUrl: z.string().optional(),
          googlePlayUrl: z.string().optional(),
          featured: z.boolean().optional(),
          displayOrder: z.number().optional(),
          trailerVideoUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update books",
          });
        }
        const { id, ...updateData } = input;
        await updateBook(id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can delete books",
          });
        }
        await deleteBook(input.id);
        return { success: true };
      }),
  }),

  newsletters: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view newsletters",
        });
      }
      return await getAllNewsletters();
    }),

    getAll: publicProcedure.query(async () => {
      // Public access to sent newsletters only
      const newsletters = await getAllNewsletters();
      return newsletters.filter((n) => n.status === "sent");
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const newsletter = await getNewsletterById(input.id);
        if (!newsletter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Newsletter not found",
          });
        }
        // Only allow access to sent newsletters for public
        if (newsletter.status !== "sent") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This newsletter is not available",
          });
        }
        return newsletter;
      }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view stats",
        });
      }
      const newsletters = await getAllNewsletters();
      const subscribers = await getAllSubscribers(true);
      const sentNewsletters = newsletters.filter((n) => n.status === "sent");
      const totalOpens = sentNewsletters.reduce((sum, n) => sum + (n.openCount || 0), 0);
      const totalRecipients = sentNewsletters.reduce((sum, n) => sum + (n.recipientCount || 0), 0);
      
      return {
        totalNewsletters: newsletters.length,
        sentNewsletters: sentNewsletters.length,
        totalSubscribers: subscribers.length,
        averageOpenRate: totalRecipients > 0 ? Math.round((totalOpens / totalRecipients) * 100) : 0,
      };
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          subject: z.string().min(1),
          preheader: z.string().optional(),
          content: z.string().min(1),
          status: z.enum(["draft", "scheduled", "sent"]).optional(),
          scheduledAt: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can create newsletters",
          });
        }
        await createNewsletter({
          ...input,
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          subject: z.string().optional(),
          preheader: z.string().optional(),
          content: z.string().optional(),
          status: z.enum(["draft", "scheduled", "sent"]).optional(),
          scheduledAt: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update newsletters",
          });
        }
        const { id, ...updateData } = input;
        await updateNewsletter(id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can delete newsletters",
          });
        }
        await deleteNewsletter(input.id);
        return { success: true };
      }),

    listSubscribers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view subscribers",
        });
      }
      return await getAllSubscribers();
    }),

    send: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can send newsletters",
          });
        }

        const newsletter = await getNewsletterById(input.id);
        if (!newsletter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Newsletter not found",
          });
        }

        // Get active subscribers count
        const subscribers = await getAllSubscribers(true);
        const recipientCount = subscribers.length;

        // Generate email HTML from template
        const sanitizedContent = sanitizeEmailContent(newsletter.content);
        const emailHtml = generateEmailTemplate({
          subject: newsletter.subject,
          preheader: newsletter.preheader || undefined,
          content: sanitizedContent,
        });

        // Send via MailerLite
        const groupId = process.env.MAILERLITE_GROUP_ID;
        const result = await sendMailerLiteCampaign(
          newsletter.subject,
          emailHtml,
          groupId
        );

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: result.message,
          });
        }

        // Update newsletter status
        await updateNewsletter(input.id, {
          status: "sent",
          sentAt: new Date(),
          recipientCount,
        });

        return { success: true, recipientCount };
      }),

    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can duplicate newsletters",
          });
        }
        const original = await getNewsletterById(input.id);
        if (!original) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Newsletter not found",
          });
        }
        await createNewsletter({
          title: `Copy of ${original.title}`,
          subject: original.subject,
          preheader: original.preheader ?? undefined,
          content: original.content,
          status: "draft",
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),
  }),

  ai: aiRouter,

  readerClub: router({
    // Get all exclusive content
    getAllContent: publicProcedure.query(async () => {
      return await getAllExclusiveContent();
    }),

    // Get featured exclusive content
    getFeaturedContent: publicProcedure.query(async () => {
      return await getFeaturedExclusiveContent();
    }),

    // Get exclusive content by slug
    getContentBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const content = await getExclusiveContentBySlug(input.slug);
        if (!content) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Content not found" });
        }
        return content;
      }),

    // Check membership status
    checkMembership: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return await getReaderClubMemberByEmail(input.email);
      }),

    // Join Reader's Club
    join: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if already a member
        const existing = await getReaderClubMemberByEmail(input.email);
        if (existing) {
          return { success: true, message: "You're already a member!" };
        }

        // Create new member
        const memberId = await createReaderClubMember({
          email: input.email,
          name: input.name || null,
        });

        // Also subscribe to newsletter
        try {
          await subscribeToMailerLite(input.email, input.name || "");
        } catch (error) {
          console.error("Failed to subscribe to MailerLite:", error);
        }

        return { success: true, memberId, message: "Welcome to the Reader's Club!" };
      }),

    // Track content access
    trackAccess: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          contentId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const member = await getReaderClubMemberByEmail(input.email);
        if (!member) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a member" });
        }

        await updateReaderClubMemberAccess(member.id);
        await trackContentAccess(member.id, input.contentId);

        return { success: true };
      }),

    // Admin: Create exclusive content
    createContent: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          type: z.enum(["bonus_chapter", "interview", "behind_scenes"]),
          category: z.string().optional(),
          description: z.string().optional(),
          content: z.string(),
          coverImage: z.string().optional(),
          bookId: z.number().optional(),
          featured: z.boolean().optional(),
          displayOrder: z.number().optional(),
          publishDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const contentId = await createExclusiveContent(input);
        return { success: true, contentId };
      }),

    // Admin: Update exclusive content
    updateContent: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          type: z.enum(["bonus_chapter", "interview", "behind_scenes"]).optional(),
          category: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
          coverImage: z.string().optional(),
          bookId: z.number().optional(),
          featured: z.boolean().optional(),
          displayOrder: z.number().optional(),
          publishDate: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const { id, ...updates } = input;
        await updateExclusiveContent(id, updates);
        return { success: true };
      }),

    // Admin: Delete exclusive content
    deleteContent: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        await deleteExclusiveContent(input.id);
        return { success: true };
      }),

    // Admin: Get content access stats
    getContentStats: protectedProcedure
      .input(z.object({ contentId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        return await getContentAccessStats(input.contentId);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Please enter a valid email address"),
          subject: z.string().min(1, "Subject is required"),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
      )
      .mutation(async ({ input }) => {
        const { notifyOwner } = await import("./_core/notification");
        
        const emailContent = `
New Contact Form Submission

From: ${input.name} (${input.email})
Subject: ${input.subject}

Message:
${input.message}

---
This message was sent via the contact form on your website.
Reply directly to: ${input.email}
        `;

        const success = await notifyOwner({
          title: `New Contact: ${input.subject}`,
          content: emailContent,
        });

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send message. Please try again later.",
          });
        }

        return {
          success: true,
          message: "Thank you for your message! I'll get back to you soon.",
        };
      }),
  }),

  // ==================== Profile Router ====================
  profile: router({
    // Get current user's profile with preferences
    get: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getUserWithPreferences(ctx.user.id);
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }
      return profile;
    }),

    // Get user preferences
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await getUserPreferences(ctx.user.id);
      return prefs || {
        emailNewReleases: true,
        emailNewsletter: true,
        emailPromotions: true,
        emailBlogPosts: false,
        preferredFormat: "epub",
        displayName: null,
        bio: null,
        favoriteGenres: null,
      };
    }),

    // Update user preferences
    updatePreferences: protectedProcedure
      .input(
        z.object({
          emailNewReleases: z.boolean().optional(),
          emailNewsletter: z.boolean().optional(),
          emailPromotions: z.boolean().optional(),
          emailBlogPosts: z.boolean().optional(),
          preferredFormat: z.enum(["epub", "mobi", "pdf"]).optional(),
          displayName: z.string().max(100).nullable().optional(),
          bio: z.string().max(500).nullable().optional(),
          favoriteGenres: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const updated = await upsertUserPreferences(ctx.user.id, input);
        return updated;
      }),

    // Get purchase history with stats
    getPurchaseHistory: protectedProcedure.query(async ({ ctx }) => {
      const purchases = await getUserPurchases(ctx.user.id);
      
      // Calculate stats
      const totalSpent = purchases.reduce((sum, p) => sum + (p.purchase.purchasePrice || 0), 0);
      const totalBooks = purchases.length;
      const totalDownloads = purchases.reduce((sum, p) => sum + (p.purchase.downloadCount || 0), 0);
      
      return {
        purchases: purchases.map(p => ({
          id: p.purchase.id,
          bookId: p.purchase.bookId,
          bookTitle: p.book.title,
          bookCover: p.book.coverImage,
          bookSlug: p.book.slug,
          purchaseType: p.purchase.purchaseType,
          purchasePrice: p.purchase.purchasePrice,
          downloadCount: p.purchase.downloadCount,
          lastDownloadAt: p.purchase.lastDownloadAt,
          purchasedAt: p.purchase.purchasedAt,
        })),
        stats: {
          totalSpent,
          totalBooks,
          totalDownloads,
          memberSince: ctx.user.createdAt,
        },
      };
    }),

    // Track book view
    trackView: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await trackBookView(ctx.user.id, input.bookId);
        return { success: true };
      }),

    // Get recently viewed books
    getRecentlyViewed: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(20).default(10) }).optional())
      .query(async ({ ctx, input }) => {
        const limit = input?.limit || 10;
        const history = await getRecentlyViewedBooks(ctx.user.id, limit);
        return history.map(h => ({
          bookId: h.book.id,
          bookTitle: h.book.title,
          bookSlug: h.book.slug,
          bookCover: h.book.coverImage,
          bookSeries: h.book.series,
          viewCount: h.history.viewCount,
          lastViewedAt: h.history.lastViewedAt,
        }));
      }),

    // Clear browsing history
    clearHistory: protectedProcedure.mutation(async ({ ctx }) => {
      await clearBrowsingHistory(ctx.user.id);
      return { success: true };
    }),
  }),

  // Email Template Preview Routes (admin only)
  getEmailTemplatePreview: protectedProcedure
    .input(z.object({
      sequence: z.enum(["post-purchase", "win-back", "launch", "series-upsell"]),
      emailIndex: z.number().min(0).max(2),
      buyerName: z.string().optional(),
    }))
    .query(({ input }) => {
      const { sequence, emailIndex, buyerName } = input;
      const sequenceMap = {
        "post-purchase": {
          generators: [generatePostPurchaseEmail1, generatePostPurchaseEmail2, generatePostPurchaseEmail3],
          data: postPurchaseSequence,
        },
        "win-back": {
          generators: [generateWinBackEmail1, generateWinBackEmail2, generateWinBackEmail3],
          data: winBackSequence,
        },
        "launch": {
          generators: [generateLaunchEmail1, generateLaunchEmail2, generateLaunchEmail3],
          data: launchSequence,
        },
        "series-upsell": {
          generators: [generateSeriesUpsellEmail1, generateSeriesUpsellEmail2, generateSeriesUpsellEmail3],
          data: seriesUpsellSequence,
        },
      } as const;
      const { generators, data } = sequenceMap[sequence];
      const generator = generators[emailIndex] as (arg: unknown) => string;
      const html = (sequence === "launch" || sequence === "series-upsell")
        ? generator({ subscriberName: buyerName })
        : generator(buyerName);
      const meta = data[emailIndex];
      return { html, meta };
    }),

  getEmailSequenceList: protectedProcedure
    .input(z.object({ sequence: z.enum(["post-purchase", "win-back", "launch", "series-upsell"]) }))
    .query(({ input }) => {
      const sequenceMap = {
        "post-purchase": postPurchaseSequence,
        "win-back": winBackSequence,
        "launch": launchSequence,
        "series-upsell": seriesUpsellSequence,
      } as const;
      const data = sequenceMap[input.sequence];
      return data.map(({ generate, ...rest }) => rest);
    }),
});

export type AppRouter = typeof appRouter;
