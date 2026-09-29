import { describe, it, expect, vi, beforeEach } from "vitest";
import { workflowRouter } from "./routers/workflow";
import { workflows } from "../client/src/data/workflows";

vi.mock("./ai-usage", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./ai-usage")>();
  return {
    ...mod,
    checkRateLimit: vi.fn(),
    getClientKey: vi.fn(() => "test-client"),
    trackAiUsage: vi.fn(),
  };
});

vi.mock("./kie-service", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./kie-service")>();
  return { ...mod, geminiChat: vi.fn() };
});

import { geminiChat } from "./kie-service";
import { checkRateLimit, trackAiUsage } from "./ai-usage";

function adminContext() {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@reeseastor.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} },
    res: {},
  } as any;
}

function nonAdminContext() {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} },
    res: {},
  } as any;
}

const validInput = {
  workflowId: "canon-control",
  systemPrompt: workflows[1].systemPrompt,
  userPrompt: workflows[1].userPromptTemplate.replace("{{INPUT}}", "Draft chapter about the breach"),
};

describe("workflow.run — authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    const caller = workflowRouter.createCaller({ user: null } as any);
    await expect(caller.run(validInput)).rejects.toThrow("Please login");
  });

  it("rejects non-admin users with FORBIDDEN", async () => {
    const caller = workflowRouter.createCaller(nonAdminContext());
    await expect(caller.run(validInput)).rejects.toThrow("Admin access required");
    expect(geminiChat).not.toHaveBeenCalled();
  });
});

describe("workflow.run — input validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing workflowId", async () => {
    const caller = workflowRouter.createCaller(adminContext());
    const { workflowId, ...rest } = validInput;
    await expect(caller.run(rest as any)).rejects.toThrow();
    expect(geminiChat).not.toHaveBeenCalled();
  });

  it("rejects empty systemPrompt", async () => {
    const caller = workflowRouter.createCaller(adminContext());
    await expect(caller.run({ ...validInput, systemPrompt: "" })).rejects.toThrow();
  });

  it("rejects empty userPrompt", async () => {
    const caller = workflowRouter.createCaller(adminContext());
    await expect(caller.run({ ...validInput, userPrompt: "" })).rejects.toThrow();
  });
});

describe("workflow.run — execution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls geminiChat with system and user messages", async () => {
    vi.mocked(geminiChat).mockResolvedValue("Audit result: no canon violations.");
    vi.mocked(checkRateLimit).mockReturnValue(true);

    const caller = workflowRouter.createCaller(adminContext());
    const result = await caller.run(validInput);

    expect(geminiChat).toHaveBeenCalledWith({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: validInput.systemPrompt },
        { role: "user", content: validInput.userPrompt },
      ],
      temperature: 0.4,
      maxTokens: 8000,
    });
    expect(result).toEqual({
      workflowId: "canon-control",
      output: "Audit result: no canon violations.",
      timestamp: expect.any(String),
    });
  });

  it("returns ALL 10 workflow outputs when each is run", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(true);
    const caller = workflowRouter.createCaller(adminContext());

    for (const workflow of workflows) {
      vi.mocked(geminiChat).mockResolvedValueOnce(`Output for ${workflow.id}`);
      const result = await caller.run({
        workflowId: workflow.id,
        systemPrompt: workflow.systemPrompt,
        userPrompt: workflow.userPromptTemplate.replace("{{INPUT}}", "test input"),
      });
      expect(result.workflowId).toBe(workflow.id);
      expect(result.output).toBe(`Output for ${workflow.id}`);
      expect(result.timestamp).toBeTruthy();
    }
  });

  it("tracks AI usage on success", async () => {
    vi.mocked(geminiChat).mockResolvedValue("output");
    vi.mocked(checkRateLimit).mockReturnValue(true);

    const caller = workflowRouter.createCaller(adminContext());
    await caller.run(validInput);

    expect(trackAiUsage).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: "workflow",
        model: "gemini-2.5-flash",
        inputChars: validInput.systemPrompt.length + validInput.userPrompt.length,
        outputChars: 6,
        key: "test-client",
      })
    );
  });
});

describe("workflow.run — rate limiting & errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects with TOO_MANY_REQUESTS when rate limited", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);

    const caller = workflowRouter.createCaller(adminContext());
    await expect(caller.run(validInput)).rejects.toThrow(
      "Too many workflow requests. Please wait a moment and try again."
    );
    expect(geminiChat).not.toHaveBeenCalled();
    expect(trackAiUsage).toHaveBeenCalledWith(
      expect.objectContaining({ feature: "workflow", status: "rate-limited" })
    );
  });

  it("surfaces geminiChat errors as INTERNAL_SERVER_ERROR", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(true);
    vi.mocked(geminiChat).mockRejectedValue(new Error("Gemini outage"));

    const caller = workflowRouter.createCaller(adminContext());
    await expect(caller.run(validInput)).rejects.toThrow("Gemini outage");
    expect(trackAiUsage).toHaveBeenCalledWith(
      expect.objectContaining({ feature: "workflow", status: "error" })
    );
  });
});

describe("workflow prompt builder contract", () => {
  it("substitutes {{INPUT}} exactly once for every workflow", () => {
    for (const workflow of workflows) {
      const userPrompt = workflow.userPromptTemplate.replace("{{INPUT}}", "sample chapter");
      expect(userPrompt).toContain("sample chapter");
      expect(userPrompt).not.toContain("{{INPUT}}");
    }
  });
});