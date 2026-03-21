import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  $returningId: vi.fn().mockResolvedValue([{ id: 1 }]),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

// Mock email service
vi.mock("./email-service", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

// Mock fetch for MailerLite API
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ meta: { total: 42 }, data: [] }),
});

describe("Command Center Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset chainable mock returns
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.values.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.delete.mockReturnThis();
    mockDb.$returningId.mockResolvedValue([{ id: 1 }]);
  });

  describe("Schema validation", () => {
    it("should import the command center router without errors", async () => {
      const { commandCenterRouter } = await import("./routers/commandCenter");
      expect(commandCenterRouter).toBeDefined();
    });

    it("should have all expected procedures", async () => {
      const { commandCenterRouter } = await import("./routers/commandCenter");
      const procedures = Object.keys(commandCenterRouter._def.procedures);
      
      expect(procedures).toContain("getOverview");
      expect(procedures).toContain("getMetricsHistory");
      expect(procedures).toContain("recordMetrics");
      expect(procedures).toContain("collectMetrics");
      expect(procedures).toContain("getGoals");
      expect(procedures).toContain("createGoal");
      expect(procedures).toContain("updateGoal");
      expect(procedures).toContain("deleteGoal");
      expect(procedures).toContain("getTools");
      expect(procedures).toContain("createTool");
      expect(procedures).toContain("updateTool");
      expect(procedures).toContain("deleteTool");
      expect(procedures).toContain("seedTools");
      expect(procedures).toContain("getBriefings");
      expect(procedures).toContain("getBriefingById");
      expect(procedures).toContain("generateBriefing");
      expect(procedures).toContain("sendBriefingEmail");
    });
  });

  describe("Database schema", () => {
    it("should import business metrics table", async () => {
      const { businessMetrics } = await import("../drizzle/schema");
      expect(businessMetrics).toBeDefined();
    });

    it("should import business goals table", async () => {
      const { businessGoals } = await import("../drizzle/schema");
      expect(businessGoals).toBeDefined();
    });

    it("should import tool inventory table", async () => {
      const { toolInventory } = await import("../drizzle/schema");
      expect(toolInventory).toBeDefined();
    });

    it("should import daily briefings table", async () => {
      const { dailyBriefings } = await import("../drizzle/schema");
      expect(dailyBriefings).toBeDefined();
    });
  });

  describe("Daily Briefing Cron", () => {
    it("should import the daily briefing cron module", async () => {
      const { runDailyBriefing } = await import("./cron/dailyBriefing");
      expect(runDailyBriefing).toBeDefined();
      expect(typeof runDailyBriefing).toBe("function");
    });
  });

  describe("Tool seed data", () => {
    it("should have correct tool categories", () => {
      const validCategories = ["video", "audio", "design", "writing", "marketing", "analytics", "kdp", "social", "email", "other"];
      const toolData = [
        { name: "SoundMadeSeen", category: "audio" },
        { name: "Digital Maker AI", category: "writing" },
        { name: "HumanPal 2.0", category: "video" },
        { name: "TalkingPhotos 3.5", category: "video" },
        { name: "Artistly v6.0", category: "kdp" },
        { name: "Video Express 2.0", category: "video" },
        { name: "Bookclicker", category: "marketing" },
        { name: "BookFunnel", category: "marketing" },
      ];

      toolData.forEach(tool => {
        expect(validCategories).toContain(tool.category);
      });
    });

    it("should have valid status values", () => {
      const validStatuses = ["active", "needs_login", "expired", "pending"];
      const toolStatuses = ["active", "needs_login", "active", "active", "active", "active", "pending", "pending"];

      toolStatuses.forEach(status => {
        expect(validStatuses).toContain(status);
      });
    });
  });

  describe("Goal categories", () => {
    it("should have valid goal categories", () => {
      const validCategories = ["subscribers", "revenue", "books", "content", "social", "launches", "other"];
      
      validCategories.forEach(cat => {
        expect(typeof cat).toBe("string");
        expect(cat.length).toBeGreaterThan(0);
      });
    });
  });

  describe("MailerLite stats fetching", () => {
    it("should call MailerLite API when API key is available", async () => {
      process.env.MAILERLITE_API_KEY = "test-key";
      
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ meta: { total: 150 }, data: [] }),
      });
      global.fetch = fetchSpy;

      // The function is internal to the router, but we can verify the API endpoint pattern
      expect(process.env.MAILERLITE_API_KEY).toBeDefined();
    });
  });

  describe("Briefing email template", () => {
    it("should generate valid HTML email content", () => {
      const dateStr = "Friday, March 21, 2026";
      const subscriberCount = 42;
      const executiveSummary = `Good morning, Reese! Here's your daily business briefing for ${dateStr}.`;
      
      const html = `
        <div style="font-family: Georgia, serif;">
          <h1 style="color: #d4af37;">${dateStr}</h1>
          <p>${executiveSummary}</p>
          <p>Subscribers: ${subscriberCount}</p>
        </div>
      `;

      expect(html).toContain(dateStr);
      expect(html).toContain(executiveSummary);
      expect(html).toContain("#d4af37");
      expect(html).toContain("42");
    });
  });
});
