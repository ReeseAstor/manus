import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { checkRateLimit, trackAiUsage } from "../ai-usage";
import { getDb } from "../db";
import { 
  audioUsage, 
  generatedAudio, 
  vipMembers,
  vipTiers,
  steamyStories 
} from "../../drizzle/schema";
import { eq, and, sql, gte, desc } from "drizzle-orm";
import {
  ALL_VOICES,
  STANDARD_VOICES,
  PREMIUM_VOICES,
  TIER_LIMITS,
  CHARACTER_VOICE_MAPPINGS,
  generateAudio,
  generateVoicePreview,
  estimateMinutes,
  type SubscriptionTier,
} from "../_core/audioService";

const VIP_AUDIO_MESSAGE =
  "Audio generation is for VIP members. Upgrade your membership to continue.";

type AudioDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

/** Map a tier slug or name onto the audio allowance. Unknown paid tiers use bronze. */
export function tierFromLabel(label: string): SubscriptionTier {
  const value = label.toLowerCase();
  if (value.includes("gold")) return "gold";
  if (value.includes("silver")) return "silver";
  if (value.includes("bronze")) return "bronze";
  return "bronze";
}

async function activeMembershipTier(db: AudioDb, userId: number): Promise<SubscriptionTier | null> {
  const rows = await db
    .select({ slug: vipTiers.slug, name: vipTiers.name })
    .from(vipMembers)
    .innerJoin(vipTiers, eq(vipMembers.tierId, vipTiers.id))
    .where(and(eq(vipMembers.userId, userId), eq(vipMembers.status, "active")))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return tierFromLabel(`${row.slug} ${row.name}`);
}

async function minutesUsedThisMonth(db: AudioDb, userId: number): Promise<number> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const usageResult = await db
    .select({
      totalMinutes: sql<number>`COALESCE(SUM(${audioUsage.minutesUsed}), 0)`,
    })
    .from(audioUsage)
    .where(and(eq(audioUsage.userId, userId), gte(audioUsage.createdAt, monthStart)));
  return Number(usageResult[0]?.totalMinutes || 0);
}

function assertWithinMinutes(currentMinutes: number, estimatedMinutes: number, limit: number) {
  if (currentMinutes + estimatedMinutes > limit) {
    throw new Error(
      `Audio limit exceeded. You have ${limit - currentMinutes} minutes remaining this month.`,
    );
  }
}

export const audioRouter = router({
  // ============================================
  // VOICE LIBRARY
  // ============================================
  
  /**
   * Get all available voices. Admin-only: the response carries vendor voice ids.
   * The reader page keeps this query disabled (SHOW_READER_VOICE_LIBRARY = false).
   */
  getVoices: adminProcedure
    .input(z.object({
      includePremium: z.boolean().optional().default(false),
    }))
    .query(async ({ input }) => {
      if (input.includePremium) {
        return {
          standard: STANDARD_VOICES,
          premium: PREMIUM_VOICES,
          all: ALL_VOICES,
        };
      }
      return {
        standard: STANDARD_VOICES,
        premium: [],
        all: STANDARD_VOICES,
      };
    }),

  /**
   * Get character voice mappings for books. Admin-only (internal voice casting).
   */
  getCharacterVoices: adminProcedure.query(async () => {
    return CHARACTER_VOICE_MAPPINGS;
  }),

  /**
   * Generate a voice preview sample
   */
  previewVoice: protectedProcedure
    .input(z.object({
      voiceId: z.enum(ALL_VOICES.map((voice) => voice.id) as [string, ...string[]]),
    }))
    .mutation(async ({ ctx, input }) => {
      const clientKey = `user:${ctx.user.id}`;
      if (!(await checkRateLimit(clientKey, "voice-preview"))) {
        trackAiUsage({
          feature: "voice-preview",
          model: "elevenlabs",
          inputChars: input.voiceId.length,
          outputChars: 0,
          status: "rate-limited",
          key: clientKey,
        });
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many voice previews. Please wait and try again.",
        });
      }
      const audioUrl = await generateVoicePreview(input.voiceId);
      return { audioUrl };
    }),

  // ============================================
  // USAGE TRACKING
  // ============================================

  /**
   * Get user's audio usage for current month
   */
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const userId = ctx.user.id;
    
    // Get start of current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const tierName = (await activeMembershipTier(db, userId)) ?? "free";
    const limits = TIER_LIMITS[tierName];
    
    // Get usage for current month
    const usageResult = await db
      .select({
        totalMinutes: sql<number>`COALESCE(SUM(${audioUsage.minutesUsed}), 0)`,
        totalGenerations: sql<number>`COUNT(*)`,
      })
      .from(audioUsage)
      .where(
        and(
          eq(audioUsage.userId, userId),
          gte(audioUsage.createdAt, monthStart)
        )
      );
    
    const usage = usageResult[0] || { totalMinutes: 0, totalGenerations: 0 };
    
    return {
      tier: tierName,
      limits,
      usage: {
        minutesUsed: Number(usage.totalMinutes),
        minutesRemaining: Math.max(0, limits.monthlyMinutes - Number(usage.totalMinutes)),
        generationsThisMonth: Number(usage.totalGenerations),
      },
      canGenerate: Number(usage.totalMinutes) < limits.monthlyMinutes,
    };
  }),

  // ============================================
  // AUDIO GENERATION
  // ============================================

  /**
   * Generate audio from text (single voice)
   */
  generateAudio: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(50000),
      voiceId: z.string().optional(),
      storyId: z.string().optional(),
      title: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      const isAdmin = ctx.user.role === "admin";
      const estimatedMinutes = estimateMinutes(input.text.length);

      if (!isAdmin) {
        const tierName = await activeMembershipTier(db, userId);
        if (!tierName) {
          throw new TRPCError({ code: "FORBIDDEN", message: VIP_AUDIO_MESSAGE });
        }
        const limits = TIER_LIMITS[tierName];
        const voice = ALL_VOICES.find(v => v.id === input.voiceId);
        if (voice?.isPremium && !limits.canUsePremiumVoices) {
          throw new Error("Premium voices require Gold membership");
        }
        assertWithinMinutes(await minutesUsedThisMonth(db, userId), estimatedMinutes, limits.monthlyMinutes);
      }
      
      // Generate audio
      const result = await generateAudio({
        text: input.text,
        voiceId: input.voiceId,
        userId: String(userId),
        storyId: input.storyId,
      });
      
      // Record usage
      await db.insert(audioUsage).values({
        userId,
        minutesUsed: estimatedMinutes,
        characterCount: input.text.length,
        voiceId: result.voiceUsed,
        storyId: input.storyId || null,
      });
      
      // Save generated audio record
      await db.insert(generatedAudio).values({
        id: crypto.randomUUID(),
        userId,
        storyId: input.storyId || null,
        title: input.title || "Generated Audio",
        audioUrl: result.audioUrl,
        durationSeconds: result.durationSeconds,
        voiceId: result.voiceUsed,
        characterCount: result.characterCount,
      });
      
      return result;
    }),

  // ============================================
  // AUDIO LIBRARY
  // ============================================

  /**
   * Get user's generated audio library
   */
  getLibrary: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      const audioList = await db
        .select()
        .from(generatedAudio)
        .where(eq(generatedAudio.userId, userId))
        .orderBy(desc(generatedAudio.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return audioList;
    }),

  /**
   * Delete generated audio
   */
  deleteAudio: protectedProcedure
    .input(z.object({
      audioId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      await db.delete(generatedAudio).where(
        and(
          eq(generatedAudio.id, input.audioId),
          eq(generatedAudio.userId, userId)
        )
      );
      
      return { success: true };
    }),

  // ============================================
  // STORY AUDIO
  // ============================================

  /**
   * Generate audio for a VIP story
   */
  generateStoryAudio: protectedProcedure
    .input(z.object({
      storyId: z.number(),
      voiceId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      // Get the story
      const storyResult = await db
        .select()
        .from(steamyStories)
        .where(eq(steamyStories.id, input.storyId))
        .limit(1);
      
      const story = storyResult[0];
      if (!story) {
        throw new Error("Story not found");
      }

      // Until VIP launches, only admins and active members can spend ElevenLabs.
      // Admins are not capped. Members use their tier's monthly minutes.
      if (ctx.user.role !== "admin") {
        const tierName = await activeMembershipTier(db, userId);
        if (!tierName) {
          throw new TRPCError({ code: "FORBIDDEN", message: VIP_AUDIO_MESSAGE });
        }
        const limits = TIER_LIMITS[tierName];
        const estimatedMinutes = estimateMinutes(story.content.length);
        assertWithinMinutes(await minutesUsedThisMonth(db, userId), estimatedMinutes, limits.monthlyMinutes);
      }
      
      // Generate audio
      const result = await generateAudio({
        text: story.content,
        voiceId: input.voiceId,
        userId: String(userId),
        storyId: String(input.storyId),
      });
      
      // Update story with audio URL
      await db.update(steamyStories)
        .set({ audioUrl: result.audioUrl })
        .where(eq(steamyStories.id, input.storyId));
      
      // Record usage
      const estimatedMinutes = estimateMinutes(story.content.length);
      await db.insert(audioUsage).values({
        userId,
        minutesUsed: estimatedMinutes,
        characterCount: story.content.length,
        voiceId: result.voiceUsed,
        storyId: String(input.storyId),
      });
      
      return result;
    }),

  // ============================================
  // AUDIO EXPORT
  // ============================================

  /**
   * Get download URL for audio (if user has download permission)
   */
  getDownloadUrl: protectedProcedure
    .input(z.object({
      audioId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      const tierName = (await activeMembershipTier(db, userId)) ?? "free";
      const limits = TIER_LIMITS[tierName];
      
      if (!limits.canDownload) {
        throw new Error("Audio download requires Bronze membership or higher");
      }
      
      // Get the audio record
      const audioResult = await db
        .select()
        .from(generatedAudio)
        .where(and(
          eq(generatedAudio.id, input.audioId),
          eq(generatedAudio.userId, userId)
        ))
        .limit(1);
      
      const audio = audioResult[0];
      if (!audio) {
        throw new Error("Audio not found");
      }
      
      return { downloadUrl: audio.audioUrl };
    }),
});

export type AudioRouter = typeof audioRouter;
