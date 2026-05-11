/**
 * Writing Studio Workflow Router
 * Processes Hudson Dynasty AI workflow requests via Gemini
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { geminiChat, type GeminiMessage } from "../kie-service";

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

        return {
          workflowId: input.workflowId,
          output: result,
          timestamp: new Date().toISOString(),
        };
      } catch (error: any) {
        console.error(`[Workflow] Error running ${input.workflowId}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to run workflow",
        });
      }
    }),
});
