/**
 * KIE API Router - Admin-only tRPC procedures for AI asset generation
 * Used in the newsletter admin dashboard for creating campaign assets
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getCredits,
  getTaskStatus,
  parseResultUrls,
  generateImage,
  generateImageV2,
  generateImageGrid,
  generateVideo,
  generateMusic,
  getSunoTaskStatus,
  geminiChat,
  IMAGE_MODELS,
  VIDEO_MODELS,
  MUSIC_MODELS,
  LLM_MODELS,
  ASPECT_RATIOS,
  RESOLUTIONS,
  type GeminiMessage,
} from "../kie-service";

function requireAdmin(role: string | undefined) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

export const kieRouter = router({
  // ─── Credits ──────────────────────────────────────────────────────────

  getCredits: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    try {
      const credits = await getCredits();
      return { credits };
    } catch (err: any) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
    }
  }),

  // ─── Model Lists (for UI dropdowns) ─────────────────────────────────

  getModels: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return {
      imageModels: IMAGE_MODELS,
      videoModels: VIDEO_MODELS,
      musicModels: MUSIC_MODELS,
      llmModels: LLM_MODELS,
      aspectRatios: ASPECT_RATIOS,
      resolutions: RESOLUTIONS,
    };
  }),

  // ─── Task Status Polling ────────────────────────────────────────────

  getTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const task = await getTaskStatus(input.taskId);
        const resultUrls = task.resultJson ? parseResultUrls(task.resultJson) : [];
        return { ...task, resultUrls };
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Image Generation ───────────────────────────────────────────────

  generateImage: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1).max(5000),
      model: z.enum(["nano-banana-pro", "nano-banana-2"]).default("nano-banana-pro"),
      aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "1:2", "2:1"]).default("1:1"),
      resolution: z.enum(["1k", "2k", "4k"]).default("2k"),
      outputFormat: z.enum(["png", "jpg", "webp"]).default("png"),
      imageUrls: z.array(z.string().url()).max(14).optional(),
      webSearch: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const genInput = {
          prompt: input.prompt,
          aspectRatio: input.aspectRatio as any,
          resolution: input.resolution as any,
          outputFormat: input.outputFormat as any,
          imageUrls: input.imageUrls,
        };
        const result = input.model === "nano-banana-2"
          ? await generateImageV2({ ...genInput, webSearch: input.webSearch })
          : await generateImage(genInput);
        return result;
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Grid Image Generation ──────────────────────────────────────────

  generateImageGrid: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1).max(5000),
      gridSize: z.enum(["2x2", "3x3"]).default("2x2"),
      aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "1:2", "2:1"]).default("1:1"),
      resolution: z.enum(["1k", "2k", "4k"]).default("2k"),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const result = await generateImageGrid(
          input.prompt,
          input.gridSize,
          input.aspectRatio as any,
          input.resolution as any,
        );
        return result;
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Video Generation ───────────────────────────────────────────────

  generateVideo: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1).max(3000),
      mode: z.enum(["single", "multi"]).default("single"),
      aspectRatio: z.string().optional(),
      duration: z.number().min(1).max(15).optional(),
      withAudio: z.boolean().optional(),
      firstFrameUrl: z.string().url().optional(),
      lastFrameUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const result = await generateVideo({
          prompt: input.prompt,
          mode: input.mode,
          aspectRatio: input.aspectRatio,
          duration: input.duration,
          withAudio: input.withAudio,
          firstFrameUrl: input.firstFrameUrl,
          lastFrameUrl: input.lastFrameUrl,
        });
        return result;
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Music Generation ───────────────────────────────────────────────

  generateMusic: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1).max(5000),
      customMode: z.boolean().default(false),
      instrumental: z.boolean().default(false),
      model: z.enum(["V4", "V4_5", "V4_5PLUS", "V4_5ALL", "V5"]).default("V4_5"),
      style: z.string().max(1000).optional(),
      title: z.string().max(80).optional(),
      negativeTags: z.string().optional(),
      vocalGender: z.enum(["m", "f"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const result = await generateMusic({
          prompt: input.prompt,
          customMode: input.customMode,
          instrumental: input.instrumental,
          model: input.model as any,
          style: input.style,
          title: input.title,
          negativeTags: input.negativeTags,
          vocalGender: input.vocalGender,
        });
        return result;
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  getSunoTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const result = await getSunoTaskStatus(input.taskId);
        return result;
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── LLM Chat (Gemini) ─────────────────────────────────────────────

  geminiChat: protectedProcedure
    .input(z.object({
      model: z.enum(["gemini-3-pro", "gemini-3-flash", "gemini-2.5-pro", "gemini-2.5-flash"]).default("gemini-3-flash"),
      messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })),
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().min(1).max(32000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const content = await geminiChat({
          model: input.model as any,
          messages: input.messages as GeminiMessage[],
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });
        return { content };
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),
});
