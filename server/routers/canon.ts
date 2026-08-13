import { and, asc, eq, ilike, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  books,
  canonChunks,
  canonDocuments,
  editorialApprovals,
  readerEntitlements,
  series,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

const MAX_CHUNK_CHARS = 1_600;
const CHUNK_OVERLAP_CHARS = 200;

function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let offset = 0;
  while (offset < normalized.length) {
    let end = Math.min(offset + MAX_CHUNK_CHARS, normalized.length);
    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf("\n", end);
      if (boundary > offset + Math.floor(MAX_CHUNK_CHARS / 2)) end = boundary;
    }
    chunks.push(normalized.slice(offset, end).trim());
    if (end >= normalized.length) break;
    offset = Math.max(end - CHUNK_OVERLAP_CHARS, offset + 1);
  }
  return chunks.filter(Boolean);
}

function questionTerms(question: string): string[] {
  return [...new Set(question.toLowerCase().match(/[a-z0-9]{4,}/g) ?? [])].slice(0, 8);
}

async function database() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Canon archive is not configured" });
  return db;
}

export const canonRouter = router({
  listSeries: publicProcedure.query(async () => {
    const db = await database();
    return db.select().from(series).where(eq(series.status, "published")).orderBy(asc(series.displayOrder));
  }),

  ask: publicProcedure
    .input(z.object({ question: z.string().trim().min(3).max(1_000), seriesSlug: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await database();
      const terms = questionTerms(input.question);
      if (!terms.length) return { excerpts: [], refusal: "Please ask a more specific question about the books." };

      const textCondition = or(...terms.map((term) => ilike(canonChunks.content, `%${term}%`)))!;
      const conditions = [
        eq(canonChunks.approved, true),
        eq(canonChunks.readerVisible, true),
        eq(series.status, "published"),
        textCondition,
      ];
      if (input.seriesSlug) conditions.push(eq(series.slug, input.seriesSlug));

      const excerpts = await db
        .select({ content: canonChunks.content, citation: canonChunks.citation, documentTitle: canonDocuments.title })
        .from(canonChunks)
        .innerJoin(canonDocuments, eq(canonChunks.documentId, canonDocuments.id))
        .innerJoin(series, eq(canonDocuments.seriesId, series.id))
        .where(and(...conditions))
        .orderBy(asc(canonChunks.sequence))
        .limit(5);

      return {
        excerpts,
        refusal: excerpts.length ? null : "I can’t verify that from the approved book archive.",
      };
    }),

  myEntitlements: protectedProcedure.query(async ({ ctx }) => {
    const db = await database();
    return db.select().from(readerEntitlements).where(and(eq(readerEntitlements.userId, ctx.user.id), eq(readerEntitlements.status, "active")));
  }),

  admin: router({
    createSeries: adminProcedure
      .input(z.object({ name: z.string().trim().min(1).max(255), slug: z.string().trim().regex(/^[a-z0-9-]+$/), description: z.string().max(5_000).optional(), displayOrder: z.number().int().min(0).default(0) }))
      .mutation(async ({ input }) => {
        const db = await database();
        const [created] = await db.insert(series).values({ ...input, status: "draft" }).returning();
        return created;
      }),

    setSeriesStatus: adminProcedure
      .input(z.object({ seriesId: z.number().int().positive(), status: z.enum(["draft", "published"]) }))
      .mutation(async ({ input }) => {
        const db = await database();
        const [updated] = await db.update(series).set({ status: input.status, updatedAt: new Date() }).where(eq(series.id, input.seriesId)).returning();
        if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Series not found" });
        return updated;
      }),

    registerDocument: adminProcedure
      .input(z.object({ seriesId: z.number().int().positive(), bookId: z.number().int().positive().optional(), title: z.string().trim().min(1).max(255), storageKey: z.string().trim().min(1).max(1_000), sourceType: z.enum(["manuscript", "series_bible", "author_note"]).default("manuscript") }))
      .mutation(async ({ input }) => {
        const db = await database();
        const [created] = await db.insert(canonDocuments).values(input).returning();
        return created;
      }),

    ingestText: adminProcedure
      .input(z.object({ documentId: z.number().int().positive(), text: z.string().min(1).max(500_000), chapter: z.string().trim().max(255).optional() }))
      .mutation(async ({ input }) => {
        const db = await database();
        const document = await db.select().from(canonDocuments).where(eq(canonDocuments.id, input.documentId)).limit(1);
        if (!document[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Canon document not found" });
        const chunks = chunkText(input.text);
        const citation = `${document[0].title}${input.chapter ? ` — ${input.chapter}` : ""}`.slice(0, 512);
        await db.transaction(async (tx) => {
          await tx.delete(canonChunks).where(eq(canonChunks.documentId, input.documentId));
          if (chunks.length) {
            await tx.insert(canonChunks).values(chunks.map((content, index) => ({
              documentId: input.documentId,
              chapter: input.chapter,
              sequence: index,
              content,
              citation,
            })));
          }
          await tx.update(canonDocuments).set({ status: "indexed", updatedAt: new Date() }).where(eq(canonDocuments.id, input.documentId));
        });
        return { documentId: input.documentId, chunksCreated: chunks.length, status: "indexed" };
      }),

    listChunks: adminProcedure
      .input(z.object({ documentId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await database();
        return db.select({ id: canonChunks.id, chapter: canonChunks.chapter, sequence: canonChunks.sequence, content: canonChunks.content, citation: canonChunks.citation, approved: canonChunks.approved, readerVisible: canonChunks.readerVisible }).from(canonChunks).where(eq(canonChunks.documentId, input.documentId)).orderBy(asc(canonChunks.sequence));
      }),

    approveChunks: adminProcedure
      .input(z.object({ chunkIds: z.array(z.number().int().positive()).min(1).max(100), readerVisible: z.boolean(), notes: z.string().max(2_000).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await database();
        await db.transaction(async (tx) => {
          await tx.update(canonChunks).set({ approved: true, readerVisible: input.readerVisible }).where(inArray(canonChunks.id, input.chunkIds));
          await tx.insert(editorialApprovals).values(input.chunkIds.map((resourceId) => ({ resourceType: "canon_chunk", resourceId, status: "approved", approvedBy: ctx.user.id, approvedAt: new Date(), notes: input.notes })));
        });
        return { approved: input.chunkIds.length };
      }),

    grantEntitlement: adminProcedure
      .input(z.object({ userId: z.number().int().positive(), entitlementKey: z.string().trim().min(1).max(255), productId: z.number().int().positive().optional(), expiresAt: z.coerce.date().optional() }))
      .mutation(async ({ input }) => {
        const db = await database();
        const [created] = await db.insert(readerEntitlements).values(input).returning();
        return created;
      }),

    listDocuments: adminProcedure.query(async () => {
      const db = await database();
      return db.select({ id: canonDocuments.id, title: canonDocuments.title, storageKey: canonDocuments.storageKey, status: canonDocuments.status, seriesName: series.name, bookTitle: books.title }).from(canonDocuments).innerJoin(series, eq(canonDocuments.seriesId, series.id)).leftJoin(books, eq(canonDocuments.bookId, books.id)).orderBy(asc(canonDocuments.createdAt));
    }),
  }),
});
