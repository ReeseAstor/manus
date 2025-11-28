import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscribeToMailerLite } from "./mailerlite";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
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
    list: publicProcedure
      .input(
        z.object({
          published: z.boolean().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        const posts = await getAllBlogPosts(input?.published);
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
});

export type AppRouter = typeof appRouter;
