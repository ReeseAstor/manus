/**
 * Writing Studio Workflow Router
 * Processes Hudson Dynasty AI workflow requests via Gemini
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { geminiChat, type GeminiMessage } from "../kie-service";
import { checkRateLimit, getClientKey, trackAiUsage } from "../ai-usage";

function requireAdmin(role: string | undefined) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

export const workflowRouter = router({
  /**
   * Run a workflow with the given input text
   */
  run: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().min(1),
        systemPrompt: z.string().min(1),
        userPrompt: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);

      const clientKey = getClientKey(ctx.req);
      if (!checkRateLimit(clientKey, "workflow")) {
        trackAiUsage({
          feature: "workflow",
          model: "gemini-2.5-flash",
          inputChars: input.systemPrompt.length + input.userPrompt.length,
          outputChars: 0,
          status: "rate-limited",
          key: clientKey,
        });
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many workflow requests. Please wait a moment and try again.",
        });
      }

      const messages: GeminiMessage[] = [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: input.userPrompt },
      ];

      try {
        const result = await geminiChat({
          model: "gemini-2.5-flash",
          messages,
          temperature: 0.4,
          maxTokens: 8000,
        });

        trackAiUsage({
          feature: "workflow",
          model: "gemini-2.5-flash",
          inputChars: input.systemPrompt.length + input.userPrompt.length,
          outputChars: result.length,
          key: clientKey,
        });

        return {
          workflowId: input.workflowId,
          output: result,
          timestamp: new Date().toISOString(),
        };
      } catch (error: any) {
        console.error(`[Workflow] Error running ${input.workflowId}:`, error);
        trackAiUsage({
          feature: "workflow",
          model: "gemini-2.5-flash",
          inputChars: input.systemPrompt.length + input.userPrompt.length,
          outputChars: 0,
          status: "error",
          key: clientKey,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to run workflow",
        });
      }
    }),
});
