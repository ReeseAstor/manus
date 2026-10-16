/**
 * Post-Purchase Nurture Email Sequence Templates
 * 3 emails triggered after Stripe purchase confirmation
 * Design: Dark luxury gold Manhattan aesthetic matching welcome series
 */

const SITE_URL = "https://reeseastor.com";

function wrapInTemplate(options: {
  subject: string;
  preheader: string;
  bodyContent: string;
}): string {
  const { subject, preheader, bodyContent } = options;
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject}</title>
  <style type="text/css">
    .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .content-cell { padding: 24px 20px !important; }
      .header-cell { padding: 30px 20px 20px !important; }
      .hero-heading { font-size: 22px !important; }
      .cta-button { width: 100% !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .outlook-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e27; font-family: Georgia, 'Times New Roman', serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <span class="preheader">${preheader}</span>
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0e27;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="margin: 0 auto; max-width: 600px; background-color: #111633; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; overflow: hidden;">
          
          <!-- Header with Gold Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #d4af37 0%, #f5d76e 50%, #d4af37 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="header-cell" style="padding: 40px 40px 24px; text-align: center;">
              <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: Arial, sans-serif;">Romance Author</p>
              <h1 style="margin: 0; color: #d4af37; font-size: 30px; font-weight: bold; letter-spacing: 2px; font-family: Georgia, serif;">REESE ASTOR</h1>
            </td>
          </tr>

          <!-- Body Content -->
${bodyContent}

          <!-- Signature -->
          <tr>
            <td class="content-cell" style="padding: 10px 40px 30px;">
              <p style="margin: 0 0 8px; color: #c8c8c8; font-size: 16px; font-style: italic;">With love and gratitude,</p>
              <p style="margin: 0; color: #d4af37; font-size: 22px; font-weight: bold; font-family: Georgia, serif;">Reese Astor</p>
              <p style="margin: 4px 0 0; color: rgba(200, 200, 200, 0.5); font-size: 12px; font-family: Arial, sans-serif;">Romance Author</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="height: 1px; background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent); font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 16px;">
                <tr>
                  <td style="padding: 0 12px;"><a href="${SITE_URL}" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Website</a></td>
                  <td style="color: rgba(200,200,200,0.25); font-size: 13px;">|</td>
                  <td style="padding: 0 12px;"><a href="${SITE_URL}/books" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Books</a></td>
                  <td style="color: rgba(200,200,200,0.25); font-size: 13px;">|</td>
                  <td style="padding: 0 12px;"><a href="${SITE_URL}/newsletter" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Newsletter</a></td>
                  <td style="color: rgba(200,200,200,0.25); font-size: 13px;">|</td>
                  <td style="padding: 0 12px;"><a href="${SITE_URL}/blog" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Blog</a></td>
                </tr>
              </table>
              <p style="margin: 0 0 8px; color: rgba(200,200,200,0.35); font-size: 11px; line-height: 1.5; font-family: Arial, sans-serif;">
                You're receiving this because you purchased from Reese Astor's bookshop.
              </p>
              <p style="margin: 0; font-size: 11px; font-family: Arial, sans-serif;">
                <a href="{$unsubscribe}" style="color: rgba(212,175,55,0.5); text-decoration: underline;">Unsubscribe</a>
                <span style="color: rgba(200,200,200,0.2);"> &middot; </span>
                <a href="${SITE_URL}" style="color: rgba(212,175,55,0.5); text-decoration: underline;">View in browser</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Email 1: Thank You + Series Reading Order (Day 1) ────────────────────

export function generatePostPurchaseEmail1(buyerName?: string): string {
  const greeting = buyerName ? `Dear ${buyerName}` : "Dear Reader";
  
  const bodyContent = `
          <tr>
            <td class="content-cell" style="padding: 0 40px 10px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 17px; line-height: 1.7;">
                ${greeting},
              </p>
            </td>
          </tr>
          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I just saw your order come through, and I had to write to you personally. <strong style="color: #e5e5e5;">Thank you.</strong> Every single purchase means the world to me as an indie author — you're not just buying a book, you're supporting a dream.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                In case it helps, here is the Manhattan Money Kings series in reading order:
              </p>
            </td>
          </tr>

          <!-- Bonus Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">The Series</p>
                    <h2 style="margin: 0 0 14px; color: #f5d76e; font-size: 22px; font-weight: bold;">Manhattan Money Kings, in order</h2>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Prequel: The Billionaire&rsquo;s One Night Stand</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Book 1: The Billionaire&rsquo;s Executive Assistant</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Book 2: The Billionaire&rsquo;s Fake Wife</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Book 3: The Billionaire&rsquo;s Baby Secret</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Book 4: The Billionaire&rsquo;s Forbidden Nanny</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 24px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${SITE_URL}/books" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      See the Full Series
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                One more thing — if you have any questions about the books, want to share your thoughts, or just want to say hi, simply reply to this email. I read every single response.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Happy reading. I hope the Manhattan Money Kings sweep you off your feet.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "Thank you for your order",
    preheader: "A personal thank you from Reese",
    bodyContent,
  });
}

// ─── Email 2: Check-In (Day 5) ─────────────────────────────────────

export function generatePostPurchaseEmail2(buyerName?: string): string {
  const greeting = buyerName ? `Dear ${buyerName}` : "Dear Reader";
  
  const bodyContent = `
          <tr>
            <td class="content-cell" style="padding: 0 40px 10px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 17px; line-height: 1.7;">
                ${greeting},
              </p>
            </td>
          </tr>
          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I hope you're settling into the Manhattan Money Kings world. I wanted to check in and say thank you again for reading.
              </p>
              <p style="margin: 0 0 16px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                If the book gave you a good few hours, an honest review on Amazon, even a sentence or two, is the single most helpful thing you can do for an independent author. It helps the next reader find the series.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 24px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${SITE_URL}/books" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Browse the Books
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                If you have any questions about the books or just want to say hi, simply reply to this email. I read every response.</p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Thank you for supporting independent romance.</p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "How is the reading going?",
    preheader: "A quick hello and a small favor",
    bodyContent,
  });
}

// ─── Email 3: What to Read Next (Day 14) ──────────────────────────────────────────

export function generatePostPurchaseEmail3(buyerName?: string): string {
  const greeting = buyerName ? `Dear ${buyerName}` : "Dear Reader";
  
  const bodyContent = `
          <tr>
            <td class="content-cell" style="padding: 0 40px 10px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 17px; line-height: 1.7;">
                ${greeting},
              </p>
            </td>
          </tr>
          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                It's been two weeks since you stepped into the Manhattan Money Kings world, and I hope these characters have found a permanent place in your heart — they certainly have in mine.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I wanted to point you to what you can read next.
              </p>
            </td>
          </tr>

          <!-- What's Coming Next Box -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Also by Reese Astor</p>
                    <h2 style="margin: 0 0 6px; color: #f5d76e; font-size: 22px; font-weight: bold;">The Hudson Dynasty Series</h2>
                    <p style="margin: 0 0 16px; color: rgba(200,200,200,0.6); font-size: 13px; font-family: Arial, sans-serif;">Manhattan billionaire romance</p>
                    <p style="margin: 0; color: #c8c8c8; font-size: 15px; line-height: 1.8;">
                      The Hudson Dynasty starts with The First Acquisition, a free prequel novella, and continues with Hostile Tender, Poison Pill and Golden Parachute. If you enjoyed the Manhattan Money Kings books, it is the next place to go.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider text -->
          <tr>
            <td class="content-cell" style="padding: 0 40px 16px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                And if you haven't read the whole Manhattan Money Kings series yet, here it is in order:
              </p>
            </td>
          </tr>

          <!-- Series Cards -->
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Billionaire&rsquo;s One Night Stand</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Manhattan Money Kings, Prequel</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Billionaire&rsquo;s Executive Assistant</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Manhattan Money Kings, Book 1</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Billionaire&rsquo;s Fake Wife</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Manhattan Money Kings, Book 2</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Billionaire&rsquo;s Baby Secret</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Manhattan Money Kings, Book 3</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Billionaire&rsquo;s Forbidden Nanny</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Manhattan Money Kings, Book 4</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 16px 40px 24px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${SITE_URL}/books" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Browse All the Books
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Thank you for being part of this journey. Whether you've read one book or all of them, you're part of the Manhattan Money Kings family now — and I couldn't be more grateful.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "Finished the series? Here's where to read next",
    preheader: "The Hudson Dynasty, and the Manhattan Money Kings in order",
    bodyContent,
  });
}

export const postPurchaseSequence = [
  {
    id: 1,
    name: "Thank You + Series Reading Order",
    subject: "Thank you for your order",
    delay: "1 day after purchase",
    purpose: "Thank the buyer and point to the rest of the series in reading order",
    generate: generatePostPurchaseEmail1,
  },
  {
    id: 2,
    name: "Check-In + Review Request",
    subject: "How is the reading going?",
    delay: "5 days after purchase",
    purpose: "Check in with the buyer and ask for an honest review",
    generate: generatePostPurchaseEmail2,
  },
  {
    id: 3,
    name: "What to Read Next",
    subject: "Finished the series? Here's where to read next",
    delay: "14 days after purchase",
    purpose: "Point readers to the rest of the catalog",
    generate: generatePostPurchaseEmail3,
  },
];
