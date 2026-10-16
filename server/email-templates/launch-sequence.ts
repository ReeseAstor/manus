/**
 * New Release Launch Sequence Email Templates
 * 3 emails triggered on release day for a new book in the Hudson Dynasty series
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
              <p style="margin: 0 0 8px; color: #c8c8c8; font-size: 16px; font-style: italic;">Yours in all things Manhattan,</p>
              <p style="margin: 0; color: #d4af37; font-size: 22px; font-weight: bold; font-family: Georgia, serif;">Reese Astor</p>
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
                </tr>
              </table>
              <p style="margin: 0 0 8px; color: rgba(200,200,200,0.35); font-size: 11px; line-height: 1.5; font-family: Arial, sans-serif;">
                You're receiving this because you subscribed to Reese Astor's newsletter.
              </p>
              <p style="margin: 0; font-size: 11px; font-family: Arial, sans-serif;">
                <a href="{$unsubscribe}" style="color: rgba(212,175,55,0.5); text-decoration: underline;">Unsubscribe</a>
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

// ─── Email 1: Release Day Announcement (Day 0) ──────────────────────────────

export function generateLaunchEmail1(options?: {
  subscriberName?: string;
  bookTitle?: string;
  bookLink?: string;
}): string {
  const { subscriberName, bookTitle = "The First Acquisition", bookLink = "https://swiy.co/05" } = options ?? {};
  const greeting = subscriberName ? `Dear ${subscriberName}` : "Dear Reader";

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
                Tonight, the champagne is on ice, the skyline is lit, and my new book is <strong style="color: #f5d76e;">finally live</strong>.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I've been guarding this story for months — and you're one of the very first to know. No trailers, no hype. Just the story, exactly as I dreamed it.
              </p>
            </td>
          </tr>

          <!-- Book Announcement Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px;">
                <tr>
                  <td style="padding: 28px 28px; text-align: center;">
                    <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">A Hudson Dynasty Novel</p>
                    <h2 style="margin: 0 0 10px; color: #f5d76e; font-size: 26px; font-weight: bold; font-family: Georgia, serif;">${bookTitle}</h2>
                    <p style="margin: 0 0 4px; color: #c8c8c8; font-size: 15px; line-height: 1.7; font-style: italic;">
                      He built an empire on control. She was the one deal he couldn't walk away from.
                    </p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px; font-family: Arial, sans-serif;">
                      Enemies to lovers &bull; Billionaire &bull; Steamy &bull; HEA guaranteed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 10px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${bookLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Get It Now on Kindle
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 40px 24px; text-align: center;">
              <a href="${SITE_URL}/books" style="color: #d4af37; text-decoration: underline; font-size: 14px;">
                Browse the full Hudson Dynasty collection
              </a>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Release week is the loudest window a book ever gets — and this one, I genuinely believe in with my whole heart.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Thank you for being here. This story has your name on it, in a way.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: `It's here: ${bookTitle} is LIVE`,
    preheader: `Release day. ${bookTitle} is available right now — get it before the week's over`,
    bodyContent,
  });
}

// ─── Email 2: First Chapters + Early Reactions (Day 2) ─────────────────────

export function generateLaunchEmail2(options?: {
  subscriberName?: string;
  bookTitle?: string;
  bookLink?: string;
}): string {
  const { subscriberName, bookTitle = "The First Acquisition", bookLink = "https://swiy.co/05" } = options ?? {};
  const greeting = subscriberName ? `Dear ${subscriberName}` : "Dear Reader";

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
                I keep telling myself to stop refreshing the reviews page. I keep failing.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                ${bookTitle} has been out for two days, and the early readers have been incredible. A few of my favorite reactions from the launch:
              </p>
            </td>
          </tr>

          <!-- Social Proof Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 12px; color: #d4af37; font-size: 14px; font-style: italic; font-family: Georgia, serif;">"Finished at 3am. I have work tomorrow. Zero regrets."</p>
                    <p style="margin: 0 0 16px; color: rgba(200,200,200,0.55); font-size: 12px; font-family: Arial, sans-serif;">&mdash; early reader review</p>
                    <p style="margin: 0 0 12px; color: #d4af37; font-size: 14px; font-style: italic; font-family: Georgia, serif;">"The tension. The slow burn. THE MANHATTAN POWER PLAY. Reese, how dare you."</p>
                    <p style="margin: 0 0 16px; color: rgba(200,200,200,0.55); font-size: 12px; font-family: Arial, sans-serif;">&mdash; early reader review</p>
                    <p style="margin: 0; color: #d4af37; font-size: 14px; font-style: italic; font-family: Georgia, serif;">"I skipped sleep to finish this. Worth every missed hour."</p>
                    <p style="margin: 0 0 4px; color: rgba(200,200,200,0.55); font-size: 12px; font-family: Arial, sans-serif;">&mdash; early reader review</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                If you haven't started yet — here's your sign. Grab it while release week buzz is still in the air:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 10px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${bookLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Read ${bookTitle} Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                And if you've already read it and loved it — the kindest thing you can do for a new release is leave a quick review. It moves mountains for indie authors.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                P.S. There's a scene between chapters 11 and 12 that I'm slightly obsessed with. You'll know it when you feel your heart stop.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: `What early readers are saying about ${bookTitle}...`,
    preheader: "3am finishes, zero regrets, and one very exhausted author — the reviews are in",
    bodyContent,
  });
}

// ─── Email 3: Release Week Finale (Day 5) ──────────────────────────────────

export function generateLaunchEmail3(options?: {
  subscriberName?: string;
  bookTitle?: string;
  bookLink?: string;
  nextBookTitle?: string;
}): string {
  const { subscriberName, bookTitle = "The First Acquisition", bookLink = "https://swiy.co/05", nextBookTitle = "Hostile Tender" } = options ?? {};
  const greeting = subscriberName ? `Dear ${subscriberName}` : "Dear Reader";

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
                ${bookTitle}'s release week is wrapping up — and what a week it's been. Thank you to every single one of you who grabbed a copy, left a review, or just sent good energy into the universe.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                If the launch buzz is fading but the story is still waiting — it's never too late. The penthouse is still open:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 10px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${bookLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      One Last Chance — Get ${bookTitle}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next Box -->
          <tr>
            <td style="padding: 24px 40px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px; text-align: center;">
                    <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Next in the Hudson Dynasty</p>
                    <h2 style="margin: 0 0 10px; color: #f5d76e; font-size: 22px; font-weight: bold; font-family: Georgia, serif;">${nextBookTitle}</h2>
                    <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 15px; line-height: 1.7;">
                      The next book in the Hudson Dynasty. New release announcements land first in this inbox — stay close.
                    </p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px; font-family: Arial, sans-serif;">
                      You're on the VIP list. You'll hear it here first.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Until next time — keep the skyline lit.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: `Release week ends tonight — plus what's next`,
    preheader: `Last call for ${bookTitle} + a first look at what's coming next in the dynasty`,
    bodyContent,
  });
}

export const launchSequence = [
  {
    id: 1,
    name: "Release Day Announcement",
    subject: "It's here: the new release is LIVE",
    delay: "Day 0 — release day",
    purpose: "Announce the new release with synopsis and buy link while visibility is highest",
    generate: generateLaunchEmail1,
  },
  {
    id: 2,
    name: "First Chapters & Early Reactions",
    subject: "What early readers are saying...",
    delay: "Day 2 — after release",
    purpose: "Social proof + second conversion window for readers who haven't bought yet",
    generate: generateLaunchEmail2,
  },
  {
    id: 3,
    name: "Release Week Finale",
    subject: "Release week ends tonight — plus what's next",
    delay: "Day 5 — after release",
    purpose: "Last-chance conversion + tease the next book in the series",
    generate: generateLaunchEmail3,
  },
];
