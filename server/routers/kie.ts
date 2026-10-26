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
import { getDb } from "../db";
import { createNewsletter } from "../db";
import { sendEmail } from "../email-service";
import { aiStudioConversations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { checkRateLimit, getClientKey, trackAiUsage } from "../ai-usage";

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
        const clientKey = getClientKey(ctx.req);
        if (!(await checkRateLimit(clientKey, "image"))) {
          trackAiUsage({
            feature: "image",
            model: input.model,
            inputChars: input.prompt.length,
            outputChars: 0,
            status: "rate-limited",
            key: clientKey,
          });
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many image generation requests. Please wait and try again.",
          });
        }
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
        trackAiUsage({
          feature: "image",
          model: input.model,
          inputChars: input.prompt.length,
          outputChars: 0,
          key: clientKey,
        });
        return result;
      } catch (err: any) {
        if (err.code === "TOO_MANY_REQUESTS") throw err;
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
      enhancePrompt: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        let messages = input.messages as GeminiMessage[];
        
        // Auto-enhance the user's prompt if requested
        if (input.enhancePrompt) {
          const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
          if (lastUserMsg) {
            const enhancedPrompt = await enhanceUserPrompt(lastUserMsg.content, input.model as any);
            messages = messages.map(m => 
              m === lastUserMsg ? { ...m, content: enhancedPrompt } : m
            );
          }
        }
        
        const clientKey = getClientKey(ctx.req);
        if (!(await checkRateLimit(clientKey, "chat"))) {
          trackAiUsage({
            feature: "chat",
            model: input.model,
            inputChars: messages.reduce((n, m) => n + m.content.length, 0),
            outputChars: 0,
            status: "rate-limited",
            key: clientKey,
          });
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many AI requests. Please wait a moment and try again.",
          });
        }

        const content = await geminiChat({
          model: input.model as any,
          messages,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });
        trackAiUsage({
          feature: "chat",
          model: input.model,
          inputChars: messages.reduce((n, m) => n + m.content.length, 0),
          outputChars: content.length,
          key: clientKey,
        });
        return { content };
      } catch (err: any) {
        if (err.code === "TOO_MANY_REQUESTS") throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Prompt Enhancement ────────────────────────────────────────────

  enhancePrompt: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1),
      context: z.enum(["newsletter", "social_media", "email", "blog", "general"]).default("general"),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      try {
        const enhanced = await enhanceUserPrompt(input.prompt, "gemini-3-flash", input.context);
        return { enhanced };
      } catch (err: any) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
      }
    }),

  // ─── Conversation History ──────────────────────────────────────────

  listConversations: protectedProcedure
    .query(async ({ ctx }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const conversations = await db.select({
        id: aiStudioConversations.id,
        title: aiStudioConversations.title,
        model: aiStudioConversations.model,
        createdAt: aiStudioConversations.createdAt,
        updatedAt: aiStudioConversations.updatedAt,
      })
        .from(aiStudioConversations)
        .where(eq(aiStudioConversations.userId, ctx.user.id))
        .orderBy(desc(aiStudioConversations.updatedAt))
        .limit(50);
      return conversations;
    }),

  getConversation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const [conversation] = await db.select()
        .from(aiStudioConversations)
        .where(eq(aiStudioConversations.id, input.id))
        .limit(1);
      if (!conversation || conversation.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }
      return {
        ...conversation,
        messages: JSON.parse(conversation.messages) as { role: string; content: string }[],
      };
    }),

  saveConversation: protectedProcedure
    .input(z.object({
      id: z.number().optional(),
      title: z.string().min(1).max(255),
      model: z.string(),
      systemPrompt: z.string().optional(),
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const messagesJson = JSON.stringify(input.messages);
      
      if (input.id) {
        // Update existing
        await db.update(aiStudioConversations)
          .set({
            title: input.title,
            model: input.model,
            systemPrompt: input.systemPrompt || null,
            messages: messagesJson,
          })
          .where(eq(aiStudioConversations.id, input.id));
        return { id: input.id };
      } else {
        // Create new
        const [result] = await db.insert(aiStudioConversations).values({
          userId: ctx.user.id,
          title: input.title,
          model: input.model,
          systemPrompt: input.systemPrompt || null,
          messages: messagesJson,
        }).returning();
        return { id: result.id };
      }
    }),

  deleteConversation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.delete(aiStudioConversations)
        .where(eq(aiStudioConversations.id, input.id));
      return { success: true };
    }),

  // Save generated assets to a newsletter draft
  saveToNewsletter: protectedProcedure
    .input(z.object({
      type: z.enum(["image", "video", "music", "text"]),
      title: z.string().min(1),
      content: z.string().min(1), // HTML content or text to insert
      imageUrls: z.array(z.string()).optional(),
      audioUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      
      // Build HTML content for the newsletter draft
      let htmlContent = "";
      
      if (input.type === "image" && input.imageUrls?.length) {
        htmlContent = `<div style="text-align: center; padding: 20px;">\n`;
        for (const url of input.imageUrls) {
          htmlContent += `  <img src="${url}" alt="AI Generated Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />\n`;
        }
        htmlContent += `</div>\n`;
        if (input.content) {
          htmlContent += `<div style="padding: 20px;">${input.content}</div>`;
        }
      } else if (input.type === "video" && input.videoUrl) {
        htmlContent = `<div style="text-align: center; padding: 20px;">\n`;
        htmlContent += `  <p style="color: #666;">🎬 Video Asset: <a href="${input.videoUrl}" target="_blank">${input.videoUrl}</a></p>\n`;
        htmlContent += `</div>\n`;
        if (input.content) {
          htmlContent += `<div style="padding: 20px;">${input.content}</div>`;
        }
      } else if (input.type === "music" && input.audioUrl) {
        htmlContent = `<div style="text-align: center; padding: 20px;">\n`;
        htmlContent += `  <p style="color: #666;">🎵 Audio Asset: <a href="${input.audioUrl}" target="_blank">${input.audioUrl}</a></p>\n`;
        htmlContent += `</div>\n`;
        if (input.content) {
          htmlContent += `<div style="padding: 20px;">${input.content}</div>`;
        }
      } else {
        // Text/copy content from AI chat
        htmlContent = `<div style="padding: 20px; font-family: Georgia, serif; line-height: 1.8;">${input.content}</div>`;
      }

      try {
        await createNewsletter({
          title: input.title,
          subject: input.title,
          content: htmlContent,
          status: "draft",
          createdBy: ctx.user.id,
        });
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to save to newsletter: ${err.message}`,
        });
      }
    }),

  // ─── Send Test Email ─────────────────────────────────────────────────
  sendTestEmail: protectedProcedure
    .input(
      z.object({
        newsletterId: z.number(),
        recipientEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Fetch the newsletter from the database
      const { newsletters } = await import("../../drizzle/schema");
      const [newsletter] = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.id, input.newsletterId))
        .limit(1);

      if (!newsletter) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Newsletter not found" });
      }

      const subject = `[TEST] ${newsletter.subject || newsletter.title || "Newsletter Draft"}`;
      const testBanner = `<div style="background:#d4af37;color:#1a1a2e;padding:12px 20px;text-align:center;font-family:sans-serif;font-size:14px;font-weight:bold;">⚠️ TEST EMAIL — This is a preview, not sent to subscribers</div>`;
      const html = testBanner + (newsletter.content || "<p>No content</p>");

      const success = await sendEmail({
        to: input.recipientEmail,
        subject,
        html,
        from: {
          email: "hello@reeseastor.com",
          name: "Reese Astor (Test)",
        },
      });

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send test email. Check MailerLite configuration.",
        });
      }

      console.log(`[Newsletter] Test email sent to ${input.recipientEmail} for draft #${input.newsletterId}`);
      return { success: true, sentTo: input.recipientEmail };
    }),
});

// ─── Prompt Enhancement Helper ───────────────────────────────────────────

async function enhanceUserPrompt(
  prompt: string,
  model: GeminiMessage extends any ? any : never,
  context: string = "general"
): Promise<string> {
  const contextInstructions: Record<string, string> = {
    newsletter: "for a romance author's newsletter campaign",
    social_media: "for social media posts promoting romance books",
    email: "for email marketing copy for a romance book series",
    blog: "for a blog post on a romance author's website",
    general: "for content creation",
  };

  const enhanceMessages: GeminiMessage[] = [
    {
      role: "system",
      content: `You are a prompt enhancement specialist. Your job is to take a user's brief prompt and expand it into a more detailed, effective prompt ${contextInstructions[context] || contextInstructions.general}. Keep the original intent but add specificity, tone guidance, and structure. Return ONLY the enhanced prompt text, nothing else. Do not wrap in quotes.`,
    },
    {
      role: "user",
      content: `Enhance this prompt: "${prompt}"`,
    },
  ];

  const enhanced = await geminiChat({
    model: "gemini-3-flash",
    messages: enhanceMessages,
    temperature: 0.7,
    maxTokens: 1000,
  });

  return enhanced;
}
