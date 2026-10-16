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
                  <td style="padding: 0 12px;"><a href="${SITE_URL}/shop" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Shop</a></td>
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

// ─── Email 1: Thank You + Your Reading Companion (Day 1) ────────────────────

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
                I want to make sure your reading experience is absolutely perfect, so I've put together something special just for my buyers:
              </p>
            </td>
          </tr>

          <!-- Bonus Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Your Exclusive Bonus</p>
                    <h2 style="margin: 0 0 14px; color: #f5d76e; font-size: 22px; font-weight: bold;">Manhattan Money Kings Reading Companion</h2>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Character relationship map for the entire series</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Curated Spotify playlist — the soundtrack I wrote to</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Recommended reading order guide</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 0;">
                          <span style="color: #d4af37; font-size: 14px;">&#10022;</span>
                          <span style="color: #c8c8c8; font-size: 15px; padding-left: 8px;">Manhattan landmarks map from the series</span>
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
                    <a href="${SITE_URL}/reading-companion" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Download Your Reading Companion
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
    subject: "Your books are on their way — plus a surprise inside",
    preheader: "A personal thank you and an exclusive reading companion just for you",
    bodyContent,
  });
}

// ─── Email 2: Behind the Scenes (Day 5) ─────────────────────────────────────

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
                I hope you're settling into the Manhattan Money Kings world. Today I want to share something I've never published anywhere — a deleted scene from Book 1 that almost made the final cut.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                My editor and I debated this scene for weeks. It reveals a side of the hero that changes everything you think you know about him. In the end, we decided the mystery was more powerful — but I've always wondered if readers would have preferred to see this moment.
              </p>
            </td>
          </tr>

          <!-- Deleted Scene Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.06); border-left: 4px solid #d4af37; border-radius: 0 10px 10px 0;">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Exclusive Deleted Scene</p>
                    <h2 style="margin: 0 0 16px; color: #f5d76e; font-size: 20px; font-weight: bold; font-style: italic;">"The Night Before Everything Changed"</h2>
                    <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 15px; line-height: 1.8; font-style: italic;">
                      The penthouse was dark except for the amber glow of Manhattan below. He stood at the floor-to-ceiling windows, tie loosened, whiskey untouched in his hand. The city that had given him everything was about to take the one thing he couldn't buy back.
                    </p>
                    <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 15px; line-height: 1.8; font-style: italic;">
                      He pulled out his phone. Her name glowed on the screen — the last message she'd sent, three words that had unraveled every wall he'd spent a decade building...
                    </p>
                    <p style="margin: 0; color: rgba(212, 175, 55, 0.7); font-size: 14px; font-style: italic;">
                      [Scene continues — 1,200 words]
                    </p>
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
                    <a href="${SITE_URL}/deleted-scene" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Read the Full Deleted Scene
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                This is one of the things I love most about connecting with readers directly — I get to share the stories behind the stories. Things you'll never find on Amazon or in any bookstore.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I'd love to know what you think. Would you have kept this scene in? Hit reply and tell me — I genuinely want to know.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "The deleted scene I almost kept in Book 1",
    preheader: "An exclusive behind-the-scenes look that changes everything you thought you knew",
    bodyContent,
  });
}

// ─── Email 3: What's Next (Day 14) ──────────────────────────────────────────

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
                I wanted to give you a sneak peek at what's coming next — because the story is far from over.
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
                      The Hudson Dynasty starts with The First Acquisition, a prequel novella, and continues with Hostile Tender and Poison Pill. If you enjoyed the Manhattan Money Kings books, it is the next place to go.
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
                But first — have you explored the complete Manhattan Money Kings collection? Here's what's waiting for you:
              </p>
            </td>
          </tr>

          <!-- Product Cards -->
          <tr>
            <td style="padding: 0 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(26, 31, 58, 0.8); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 70%;">
                          <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Complete Trilogy Bundle</p>
                          <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">All 3 books + bonus content</p>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                          <span style="color: rgba(200,200,200,0.4); font-size: 13px; text-decoration: line-through;">$44.97</span>
                          <span style="color: #d4af37; font-size: 18px; font-weight: bold; padding-left: 6px;">$29.99</span>
                        </td>
                      </tr>
                    </table>
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
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 70%;">
                          <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">The Ultimate Collection</p>
                          <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Trilogy + prequel + exclusive extras</p>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                          <span style="color: rgba(200,200,200,0.4); font-size: 13px; text-decoration: line-through;">$59.96</span>
                          <span style="color: #d4af37; font-size: 18px; font-weight: bold; padding-left: 6px;">$39.99</span>
                        </td>
                      </tr>
                    </table>
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
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 70%;">
                          <p style="margin: 0 0 4px; color: #d4af37; font-size: 15px; font-weight: bold;">VIP Club Membership</p>
                          <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px;">Early access, exclusive content, signed editions</p>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                          <span style="color: #d4af37; font-size: 18px; font-weight: bold;">$9.99<span style="font-size: 12px; font-weight: normal;">/mo</span></span>
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
            <td style="padding: 16px 40px 24px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${SITE_URL}/shop" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Explore the Full Collection
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
    subject: "Finished the series? Here's what's coming next",
    preheader: "A sneak peek at the Hudson Dynasty series + exclusive collection offers",
    bodyContent,
  });
}

export const postPurchaseSequence = [
  {
    id: 1,
    name: "Thank You + Your Reading Companion",
    subject: "Your books are on their way — plus a surprise inside",
    delay: "1 day after purchase",
    purpose: "Immediate gratification, reduce buyer's remorse, deliver bonus content",
    generate: generatePostPurchaseEmail1,
  },
  {
    id: 2,
    name: "Behind the Scenes — Deleted Scene",
    subject: "The deleted scene I almost kept in Book 1",
    delay: "5 days after purchase",
    purpose: "Exclusive content that rewards the purchase decision",
    generate: generatePostPurchaseEmail2,
  },
  {
    id: 3,
    name: "What's Next — Upsell & Preview",
    subject: "Finished the series? Here's what's coming next",
    delay: "14 days after purchase",
    purpose: "Forward momentum toward next purchase, introduce new series",
    generate: generatePostPurchaseEmail3,
  },
];
