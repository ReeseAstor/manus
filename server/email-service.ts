/**
 * Email Service
 * 
 * Handles sending transactional emails via MailerLite API
 */

// Email service uses MailerLite API for transactional emails
import {
  generatePurchaseConfirmationEmail,
  type PurchaseConfirmationData,
} from "./email-templates/purchase-confirmation";

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: {
    email: string;
    name: string;
  };
}

/**
 * Send a transactional email via MailerLite
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const response = await fetch(`${MAILERLITE_API_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        to: [{ email: params.to }],
        from: params.from || {
          email: "noreply@reeseastor.us",
          name: "Reese Astor",
        },
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("MailerLite email send failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send purchase confirmation email with download links
 */
export async function sendPurchaseConfirmationEmail(
  data: PurchaseConfirmationData
): Promise<boolean> {
  const html = generatePurchaseConfirmationEmail(data);

  return sendEmail({
    to: data.customerEmail,
    subject: `Your ${data.bookTitle} is Ready to Download!`,
    html,
    from: {
      email: "noreply@reeseastor.us",
      name: "Reese Astor",
    },
  });
}

/**
 * Generate download links for purchased ebooks.
 *
 * Each product has an optional `downloadUrl` column in the database. When set
 * the customer is sent directly there (e.g. a BookFunnel or Gumroad claim
 * page). When absent we fall back to the My Purchases page which shows the
 * user's order history and links to each retailer.
 */
export function generateDownloadLinks(bookId: number): {
  epub: string;
  mobi: string;
  pdf: string;
} {
  const baseUrl = "https://reeseastor.us/my-purchases";

  // Map known book IDs to their retailer / delivery URLs so confirmation
  // emails always contain at least one working link even before per-product
  // `downloadUrl` rows are seeded in the database.
  const bookDownloadMap: Record<number, string> = {
    30001: "https://swiy.co/b01",  // Book 1
    30002: "https://swiy.co/mmk",  // Complete trilogy
    30003: "https://swiy.co/05",   // Ultimate collection (incl. prequel)
    30004: "https://swiy.co/b01",  // Executive Assistant
    30005: "https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20",  // Fake Wife (Kindle; swiy.co/2rd was the paperback, 88away0d-20)
    30006: "https://swiy.co/3rd",  // Baby Secret
  };

  const fallback = bookDownloadMap[bookId] || baseUrl;

  return {
    epub: fallback,
    mobi: fallback,
    pdf: fallback,
  };
}
