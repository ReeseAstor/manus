/**
 * Generate luxury Manhattan-themed email HTML template
 * Email-safe HTML with inline styles for maximum compatibility
 */

interface EmailTemplateOptions {
  subject: string;
  preheader?: string;
  content: string;
  subscriberName?: string;
  unsubscribeUrl?: string;
}

export function generateEmailTemplate(options: EmailTemplateOptions): string {
  const { subject, preheader, content, subscriberName, unsubscribeUrl } = options;

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject}</title>
  ${preheader ? `<style type="text/css">
    .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
  </style>` : ''}
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .outlook-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e27; font-family: Georgia, 'Times New Roman', serif;">
  ${preheader ? `<span class="preheader">${preheader}</span>` : ''}
  
  <!-- Email Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0e27;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(to bottom, rgba(212, 175, 55, 0.1) 0%, transparent 100%);">
              <h1 style="margin: 0; color: #d4af37; font-size: 32px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                Reese Astor
              </h1>
              <p style="margin: 10px 0 0; color: rgba(229, 229, 229, 0.6); font-size: 14px; letter-spacing: 1px;">
                ROMANCE AUTHOR
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          ${subscriberName ? `
          <tr>
            <td style="padding: 0 40px 20px;">
              <p style="margin: 0; color: #e5e5e5; font-size: 18px; line-height: 1.6;">
                Hello ${subscriberName},
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="color: #e5e5e5; font-size: 16px; line-height: 1.8;">
                ${content}
              </div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 10px; color: #e5e5e5; font-size: 16px; font-style: italic;">
                With love and passion,
              </p>
              <p style="margin: 0; color: #d4af37; font-size: 20px; font-weight: bold;">
                Reese Astor
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 2px; background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.manus.space" style="color: #d4af37; text-decoration: none; font-size: 14px;">
                      Website
                    </a>
                  </td>
                  <td style="padding: 0 10px; color: rgba(229, 229, 229, 0.3);">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.manus.space/books" style="color: #d4af37; text-decoration: none; font-size: 14px;">
                      Books
                    </a>
                  </td>
                  <td style="padding: 0 10px; color: rgba(229, 229, 229, 0.3);">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.manus.space/blog" style="color: #d4af37; text-decoration: none; font-size: 14px;">
                      Blog
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Address & Unsubscribe -->
              <p style="margin: 0 0 10px; color: rgba(229, 229, 229, 0.4); font-size: 12px; line-height: 1.6;">
                You're receiving this email because you subscribed to Reese Astor's newsletter.
              </p>
              ${unsubscribeUrl ? `
              <p style="margin: 0; color: rgba(229, 229, 229, 0.4); font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: rgba(212, 175, 55, 0.6); text-decoration: underline;">
                  Unsubscribe
                </a>
              </p>
              ` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

/**
 * Convert rich HTML content to email-safe HTML
 * Strips unsupported tags and converts to inline styles
 */
export function sanitizeEmailContent(html: string): string {
  // Basic sanitization - in production, use a proper HTML sanitizer
  return html
    .replace(/<p>/g, '<p style="margin: 0 0 16px; color: #e5e5e5; font-size: 16px; line-height: 1.8;">')
    .replace(/<h1>/g, '<h1 style="margin: 0 0 20px; color: #d4af37; font-size: 28px; font-weight: bold; line-height: 1.3;">')
    .replace(/<h2>/g, '<h2 style="margin: 0 0 16px; color: #d4af37; font-size: 24px; font-weight: bold; line-height: 1.3;">')
    .replace(/<h3>/g, '<h3 style="margin: 0 0 14px; color: #d4af37; font-size: 20px; font-weight: bold; line-height: 1.3;">')
    .replace(/<a /g, '<a style="color: #d4af37; text-decoration: underline;" ')
    .replace(/<strong>/g, '<strong style="color: #d4af37; font-weight: bold;">')
    .replace(/<em>/g, '<em style="font-style: italic;">')
    .replace(/<ul>/g, '<ul style="margin: 0 0 16px; padding-left: 20px; color: #e5e5e5;">')
    .replace(/<ol>/g, '<ol style="margin: 0 0 16px; padding-left: 20px; color: #e5e5e5;">')
    .replace(/<li>/g, '<li style="margin-bottom: 8px; color: #e5e5e5; line-height: 1.6;">')
    .replace(/<blockquote>/g, '<blockquote style="margin: 20px 0; padding: 15px 20px; border-left: 4px solid #d4af37; background: rgba(212, 175, 55, 0.1); color: #e5e5e5; font-style: italic;">')
    .replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" ');
}
