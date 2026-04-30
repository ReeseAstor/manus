import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  listLinks,
  getLinkBySlug,
  searchLinks,
  createLink,
  updateLinkByUniq,
  updateLinkBySlug,
  shortenUrl,
} from "../switchy";

/**
 * Switchy Link Management Router
 * All procedures require admin role
 */
export const switchyRouter = router({
  /**
   * List all short links from Switchy account
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        const links = await listLinks(input?.limit ?? 50, input?.offset ?? 0);
        return links;
      } catch (error) {
        console.error("[Switchy] Error listing links:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to list links",
        });
      }
    }),

  /**
   * Get a single link by slug
   */
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        const link = await getLinkBySlug(input.slug);
        if (!link) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Link not found" });
        }
        return link;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to get link",
        });
      }
    }),

  /**
   * Search links by URL or title
   */
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        const links = await searchLinks(input.query);
        return links;
      } catch (error) {
        console.error("[Switchy] Error searching links:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to search links",
        });
      }
    }),

  /**
   * Create a new short link
   */
  create: protectedProcedure
    .input(
      z.object({
        url: z.string().url("Please enter a valid URL"),
        slug: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        const result = await createLink({
          url: input.url,
          slug: input.slug,
          title: input.title,
          description: input.description,
          tags: input.tags,
          note: input.note,
        });

        console.log(`[Switchy] Link created: ${result.shortUrl} -> ${input.url}`);
        return result;
      } catch (error) {
        console.error("[Switchy] Error creating link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create link",
        });
      }
    }),

  /**
   * Update an existing link by its uniq ID
   */
  update: protectedProcedure
    .input(
      z.object({
        uniqId: z.number(),
        url: z.string().url().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { uniqId, ...updateData } = input;

      try {
        await updateLinkByUniq(uniqId, updateData);
        console.log(`[Switchy] Link ${uniqId} updated`);
        return { success: true };
      } catch (error) {
        console.error("[Switchy] Error updating link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update link",
        });
      }
    }),

  /**
   * Quick shorten: Takes a URL and returns a short link
   */
  shorten: protectedProcedure
    .input(
      z.object({
        url: z.string().url("Please enter a valid URL"),
        slug: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        const result = await shortenUrl(input.url, {
          slug: input.slug,
          title: input.title,
          description: input.description,
          tags: input.tags,
          note: input.note,
        });

        console.log(`[Switchy] URL shortened: ${result.shortUrl} -> ${input.url}`);
        return result;
      } catch (error) {
        console.error("[Switchy] Error shortening URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to shorten URL",
        });
      }
    }),
});
