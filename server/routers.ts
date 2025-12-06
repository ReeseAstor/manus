import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { aiRouter } from "./routers/ai-simple";
import { stripeRouter } from "./routers/stripe";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscribeToMailerLite, sendMailerLiteCampaign, getMailerLiteSubscribers } from "./mailerlite";
import { generateEmailTemplate, sanitizeEmailContent } from "./emailTemplate";
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
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  stripe: stripeRouter,
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
        })
      )
      .mutation(async ({ input }) => {
        const groupId = process.env.MAILERLITE_GROUP_ID;
        const result = await subscribeToMailerLite(
          input.email,
          input.name,
          groupId
        );
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        return result;
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
        
        await createBlogPost({
          ...input,
          authorId: ctx.user.id,
          publishedAt,
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
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update blog posts",
          });
        }

        const { id, ...updateData } = input;
        
        // If publishing for the first time, set publishedAt
        if (updateData.published === "published") {
          const existingPost = await getBlogPostBySlug(input.slug || "");
          if (existingPost && !existingPost.publishedAt) {
            (updateData as any).publishedAt = new Date();
          }
        }

        await updateBlogPost(id, updateData);
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

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can view newsletters",
          });
        }
        const newsletter = await getNewsletterById(input.id);
        if (!newsletter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Newsletter not found",
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
  }),

  ai: aiRouter,

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
});

export type AppRouter = typeof appRouter;
