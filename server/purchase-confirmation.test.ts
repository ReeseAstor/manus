import { describe, it, expect, vi } from "vitest";
import { generatePurchaseConfirmationEmail } from "./email-templates/purchase-confirmation";
import type { PurchaseConfirmationData } from "./email-templates/purchase-confirmation";

describe("Purchase Confirmation Email System", () => {
  describe("Email Template Generation", () => {
    it("should generate HTML email with all required data", () => {
      const testData: PurchaseConfirmationData = {
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        orderNumber: "12345",
        purchaseDate: "December 17, 2024",
        bookTitle: "The Billionaire's Executive Assistant",
        bookCover: "https://example.com/cover.jpg",
        purchasePrice: "$9.99",
        downloadLinks: {
          epub: "https://example.com/download/epub",
          mobi: "https://example.com/download/mobi",
          pdf: "https://example.com/download/pdf",
        },
      };

      const html = generatePurchaseConfirmationEmail(testData);

      // Verify HTML structure
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");

      // Verify customer data
      expect(html).toContain("Jane Doe");
      expect(html).toContain("jane@example.com");
      expect(html).toContain("12345");

      // Verify book details
      expect(html).toContain("The Billionaire's Executive Assistant");
      expect(html).toContain("$9.99");

      // Verify download links
      expect(html).toContain("https://example.com/download/epub");
      expect(html).toContain("https://example.com/download/mobi");
      expect(html).toContain("https://example.com/download/pdf");

      // Verify branding
      expect(html).toContain("Reese Astor");
    });

    it("should include all three download format buttons", () => {
      const testData: PurchaseConfirmationData = {
        customerName: "Test User",
        customerEmail: "test@example.com",
        orderNumber: "999",
        purchaseDate: "December 17, 2024",
        bookTitle: "Test Book",
        bookCover: "https://example.com/cover.jpg",
        purchasePrice: "$4.99",
        downloadLinks: {
          epub: "https://example.com/epub",
          mobi: "https://example.com/mobi",
          pdf: "https://example.com/pdf",
        },
      };

      const html = generatePurchaseConfirmationEmail(testData);

      // Check for download buttons
      expect(html).toContain("Download ePub");
      expect(html).toContain("Download Mobi");
      expect(html).toContain("Download PDF");

      // Check for format descriptions
      expect(html).toContain("For most e-readers");
      expect(html).toContain("For Kindle devices");
      expect(html).toContain("Universal format");
    });

    it("should include help section and support contact", () => {
      const testData: PurchaseConfirmationData = {
        customerName: "Test User",
        customerEmail: "test@example.com",
        orderNumber: "123",
        purchaseDate: "December 17, 2024",
        bookTitle: "Test Book",
        bookCover: "https://example.com/cover.jpg",
        purchasePrice: "$9.99",
        downloadLinks: {
          epub: "https://example.com/epub",
          mobi: "https://example.com/mobi",
          pdf: "https://example.com/pdf",
        },
      };

      const html = generatePurchaseConfirmationEmail(testData);

      expect(html).toContain("Need Help?");
      expect(html).toContain("support@reeseastor.com");
    });

    it("should include link to My Purchases page", () => {
      const testData: PurchaseConfirmationData = {
        customerName: "Test User",
        customerEmail: "test@example.com",
        orderNumber: "123",
        purchaseDate: "December 17, 2024",
        bookTitle: "Test Book",
        bookCover: "https://example.com/cover.jpg",
        purchasePrice: "$9.99",
        downloadLinks: {
          epub: "https://example.com/epub",
          mobi: "https://example.com/mobi",
          pdf: "https://example.com/pdf",
        },
      };

      const html = generatePurchaseConfirmationEmail(testData);

      expect(html).toContain("my-purchases");
      expect(html).toContain("reeseastor.us");
    });
  });

  describe("Email Styling", () => {
    it("should include Manhattan luxury design elements", () => {
      const testData: PurchaseConfirmationData = {
        customerName: "Test User",
        customerEmail: "test@example.com",
        orderNumber: "123",
        purchaseDate: "December 17, 2024",
        bookTitle: "Test Book",
        bookCover: "https://example.com/cover.jpg",
        purchasePrice: "$9.99",
        downloadLinks: {
          epub: "https://example.com/epub",
          mobi: "https://example.com/mobi",
          pdf: "https://example.com/pdf",
        },
      };

      const html = generatePurchaseConfirmationEmail(testData);

      // Check for luxury color scheme (gold #d4af37, navy #0a0e27)
      expect(html).toContain("#d4af37"); // Gold accent
      expect(html).toContain("#0a0e27"); // Navy background

      // Check for responsive design
      expect(html).toContain("@media");
      expect(html).toContain("max-width: 600px");
    });
  });
});

describe("Download Link Generation", () => {
  it("should generate download links for all formats", async () => {
    const { generateDownloadLinks } = await import("./email-service");
    
    const links = generateDownloadLinks(1);

    expect(links).toHaveProperty("epub");
    expect(links).toHaveProperty("mobi");
    expect(links).toHaveProperty("pdf");

    // Verify links are valid URLs
    expect(links.epub).toMatch(/^https?:\/\//);
    expect(links.mobi).toMatch(/^https?:\/\//);
    expect(links.pdf).toMatch(/^https?:\/\//);
  });
});
