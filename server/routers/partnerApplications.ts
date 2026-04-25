import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { partnerApplications } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const partnerApplicationsRouter = router({
  /** Public: Submit a partner application */
  submit: publicProcedure
    .input(
      z.object({
        authorName: z.string().min(1).max(255),
        email: z.string().email().max(320),
        website: z.string().url().optional().or(z.literal("")),
        bookTitle: z.string().min(1).max(255),
        genre: z.string().min(1).max(100),
        tropes: z.string().optional(),
        bookDescription: z.string().min(10).max(2000),
        downloadLink: z.string().url().optional().or(z.literal("")),
        coverImageUrl: z.string().url().optional().or(z.literal("")),
        subscriberCount: z.string().optional(),
        socialLinks: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(partnerApplications).values({
        authorName: input.authorName,
        email: input.email,
        website: input.website || null,
        bookTitle: input.bookTitle,
        genre: input.genre,
        tropes: input.tropes || null,
        bookDescription: input.bookDescription,
        downloadLink: input.downloadLink || null,
        coverImageUrl: input.coverImageUrl || null,
        subscriberCount: input.subscriberCount || null,
        socialLinks: input.socialLinks || null,
      });
      return { success: true };
    }),

  /** Admin: List all partner applications */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected", "all"]).optional().default("all"),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const db = await getDb();
      if (!db) return [];
      if (input.status !== "all") {
        return db
          .select()
          .from(partnerApplications)
          .where(eq(partnerApplications.status, input.status))
          .orderBy(desc(partnerApplications.createdAt));
      }
      return db.select().from(partnerApplications).orderBy(desc(partnerApplications.createdAt));
    }),

  /** Admin: Update application status */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(partnerApplications)
        .set({
          status: input.status,
          adminNotes: input.adminNotes || null,
        })
        .where(eq(partnerApplications.id, input.id));
      return { success: true };
    }),

  /** Admin: Delete an application */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(partnerApplications).where(eq(partnerApplications.id, input.id));
      return { success: true };
    }),
});
