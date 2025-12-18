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
 * Generate download links for purchased ebooks
 * These links should be signed/temporary URLs from S3 or permanent URLs if files are public
 */
export function generateDownloadLinks(bookId: number): {
  epub: string;
  mobi: string;
  pdf: string;
} {
  // In production, these would be actual S3 URLs or signed URLs
  // For now, return placeholder URLs that point to the My Purchases page
  const baseUrl = "https://reeseastor.us/my-purchases";
  
  return {
    epub: `${baseUrl}?download=epub&book=${bookId}`,
    mobi: `${baseUrl}?download=mobi&book=${bookId}`,
    pdf: `${baseUrl}?download=pdf&book=${bookId}`,
  };
}
