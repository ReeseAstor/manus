import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Stripe module
const mockBalance = {
  available: [{ amount: 150000, currency: "usd" }],
  pending: [{ amount: 25000, currency: "usd" }],
};

const mockCharges = {
  data: [
    {
      id: "ch_1",
      amount: 5000,
      amount_refunded: 0,
      currency: "usd",
      status: "succeeded",
      refunded: false,
      description: "Test payment",
      billing_details: { email: "test@example.com", name: "Test User" },
      receipt_email: "test@example.com",
      created: Math.floor(Date.now() / 1000) - 86400,
      payment_method_details: { type: "card" },
      receipt_url: "https://receipt.stripe.com/test",
    },
    {
      id: "ch_2",
      amount: 10000,
      amount_refunded: 0,
      currency: "usd",
      status: "succeeded",
      refunded: false,
      description: "Another payment",
      billing_details: { email: "user2@example.com", name: "User Two" },
      receipt_email: null,
      created: Math.floor(Date.now() / 1000) - 172800,
      payment_method_details: { type: "card" },
      receipt_url: null,
    },
    {
      id: "ch_3",
      amount: 3000,
      amount_refunded: 3000,
      currency: "usd",
      status: "succeeded",
      refunded: true,
      description: "Refunded payment",
      billing_details: { email: null, name: null },
      receipt_email: null,
      created: Math.floor(Date.now() / 1000) - 259200,
      payment_method_details: { type: "card" },
      receipt_url: null,
    },
    {
      id: "ch_4",
      amount: 2000,
      amount_refunded: 0,
      currency: "usd",
      status: "failed",
      refunded: false,
      description: "Failed payment",
      billing_details: { email: null, name: null },
      receipt_email: null,
      created: Math.floor(Date.now() / 1000) - 345600,
      payment_method_details: { type: "card" },
      receipt_url: null,
    },
  ],
  has_more: false,
};

const mockCustomers = {
  data: [{ id: "cus_1" }, { id: "cus_2" }, { id: "cus_3" }],
  has_more: false,
};

const mockSubscriptions = {
  data: [
    { id: "sub_1", status: "active" },
    { id: "sub_2", status: "active" },
    { id: "sub_3", status: "canceled" },
    { id: "sub_4", status: "past_due" },
  ],
  has_more: false,
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Stripe Analytics - Data Processing Logic", () => {
  describe("Overview calculations", () => {
    it("should calculate total revenue from successful charges", () => {
      const successfulCharges = mockCharges.data.filter(
        (c) => c.status === "succeeded"
      );
      const totalRevenue = successfulCharges.reduce(
        (sum, c) => sum + c.amount,
        0
      );
      const totalRefunded = successfulCharges.reduce(
        (sum, c) => sum + (c.amount_refunded || 0),
        0
      );
      const netRevenue = totalRevenue - totalRefunded;

      // ch_1: 5000, ch_2: 10000, ch_3: 3000 (succeeded) = 18000
      // refunded: ch_3: 3000
      // net: 18000 - 3000 = 15000
      expect(totalRevenue).toBe(18000);
      expect(totalRefunded).toBe(3000);
      expect(netRevenue).toBe(15000);
    });

    it("should calculate average order value correctly", () => {
      const successfulCharges = mockCharges.data.filter(
        (c) => c.status === "succeeded"
      );
      const netRevenue = successfulCharges.reduce(
        (sum, c) => sum + c.amount - (c.amount_refunded || 0),
        0
      );
      const avgOrderValue =
        successfulCharges.length > 0
          ? Math.round(netRevenue / successfulCharges.length)
          : 0;

      // 15000 / 3 = 5000
      expect(avgOrderValue).toBe(5000);
    });

    it("should calculate balance correctly", () => {
      const availableBalance = mockBalance.available.reduce(
        (sum, b) => sum + b.amount,
        0
      );
      const pendingBalance = mockBalance.pending.reduce(
        (sum, b) => sum + b.amount,
        0
      );

      expect(availableBalance).toBe(150000);
      expect(pendingBalance).toBe(25000);
    });

    it("should count subscription statuses correctly", () => {
      const active = mockSubscriptions.data.filter(
        (s) => s.status === "active"
      ).length;
      const canceled = mockSubscriptions.data.filter(
        (s) => s.status === "canceled"
      ).length;
      const pastDue = mockSubscriptions.data.filter(
        (s) => s.status === "past_due"
      ).length;

      expect(active).toBe(2);
      expect(canceled).toBe(1);
      expect(pastDue).toBe(1);
    });

    it("should count total customers", () => {
      expect(mockCustomers.data.length).toBe(3);
    });
  });

  describe("Payment breakdown", () => {
    it("should categorize charges by status", () => {
      const breakdown = {
        succeeded: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
      };

      for (const charge of mockCharges.data) {
        if (charge.refunded) {
          breakdown.refunded += 1;
        } else if (charge.status === "succeeded") {
          breakdown.succeeded += 1;
        } else if (charge.status === "pending") {
          breakdown.pending += 1;
        } else if (charge.status === "failed") {
          breakdown.failed += 1;
        }
      }

      expect(breakdown.succeeded).toBe(2); // ch_1, ch_2 (ch_3 is refunded)
      expect(breakdown.refunded).toBe(1); // ch_3
      expect(breakdown.failed).toBe(1); // ch_4
      expect(breakdown.pending).toBe(0);
    });
  });

  describe("Revenue timeline", () => {
    it("should group charges by date", () => {
      const dailyMap = new Map<
        string,
        { revenue: number; count: number; refunded: number }
      >();

      for (const charge of mockCharges.data) {
        const date = new Date(charge.created * 1000)
          .toISOString()
          .split("T")[0];
        const existing = dailyMap.get(date) || {
          revenue: 0,
          count: 0,
          refunded: 0,
        };
        if (charge.status === "succeeded") {
          existing.revenue += charge.amount - (charge.amount_refunded || 0);
          existing.count += 1;
          existing.refunded += charge.amount_refunded || 0;
        }
        dailyMap.set(date, existing);
      }

      // Should have entries for each unique date
      expect(dailyMap.size).toBeGreaterThan(0);

      // Total revenue across all days should match
      let totalRevenue = 0;
      for (const [, data] of dailyMap) {
        totalRevenue += data.revenue;
      }
      expect(totalRevenue).toBe(15000); // 5000 + 10000 + (3000-3000)
    });

    it("should initialize empty days in the range", () => {
      const days = 7;
      const dailyMap = new Map<
        string,
        { revenue: number; count: number }
      >();

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const key = date.toISOString().split("T")[0];
        dailyMap.set(key, { revenue: 0, count: 0 });
      }

      expect(dailyMap.size).toBe(7);
      // All initialized to 0
      for (const [, data] of dailyMap) {
        expect(data.revenue).toBe(0);
        expect(data.count).toBe(0);
      }
    });
  });

  describe("Recent transactions mapping", () => {
    it("should map charge data to transaction format", () => {
      const transactions = mockCharges.data.map((charge) => ({
        id: charge.id,
        amount: charge.amount,
        amountRefunded: charge.amount_refunded,
        currency: charge.currency,
        status: charge.refunded ? "refunded" : charge.status,
        description: charge.description || "Payment",
        customerEmail:
          charge.billing_details?.email || charge.receipt_email || null,
        customerName: charge.billing_details?.name || null,
        created: charge.created,
        paymentMethod: charge.payment_method_details?.type || null,
        receiptUrl: charge.receipt_url || null,
      }));

      expect(transactions).toHaveLength(4);
      expect(transactions[0].status).toBe("succeeded");
      expect(transactions[0].customerEmail).toBe("test@example.com");
      expect(transactions[0].receiptUrl).toBe(
        "https://receipt.stripe.com/test"
      );
      expect(transactions[2].status).toBe("refunded");
      expect(transactions[3].status).toBe("failed");
    });
  });

  describe("Currency formatting", () => {
    it("should format cents to dollar amounts", () => {
      function formatCurrency(cents: number, currency = "usd") {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.toUpperCase(),
          minimumFractionDigits: 2,
        }).format(cents / 100);
      }

      expect(formatCurrency(5000)).toBe("$50.00");
      expect(formatCurrency(150000)).toBe("$1,500.00");
      expect(formatCurrency(99)).toBe("$0.99");
      expect(formatCurrency(0)).toBe("$0.00");
    });
  });
});
