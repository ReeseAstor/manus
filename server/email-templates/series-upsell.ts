/**
 * Series Completion / Upsell Sequence Email Templates
 * 3 emails triggered when a reader finishes a Hudson Dynasty book
 * Purpose: move readers to the next book, then convert the binge-reader to the full collection
 * Design: Dark luxury gold Manhattan aesthetic matching all other sequences
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
                  <td style="padding: 0 12px;"><a href="${SITE_URL}/shop" style="color: #d4af37; text-decoration: none; font-size: 13px; font-family: Arial, sans-serif;">Shop</a></td>
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

// ─── Email 1: The Binge Hook (Day 0 — reader finishes book 1) ──────────────

export function generateSeriesUpsellEmail1(options?: {
  subscriberName?: string;
  finishedTitle?: string;
  nextTitle?: string;
  nextBookLink?: string;
}): string {
  const { subscriberName, finishedTitle = "The First Acquisition", nextTitle = "Hostile Tender", nextBookLink = "https://swiy.co/HD1" } = options ?? {};
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
                You finished ${finishedTitle}. I know that breathless feeling — the last page closes, and you just sit there, staring at the ceiling, replaying everything.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Here's the thing: that story was only the beginning. The Hudson family doesn't close a file that easily — and the next one is already waiting.
              </p>
            </td>
          </tr>

          <!-- Next Book Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px;">
                <tr>
                  <td style="padding: 28px 28px; text-align: center;">
                    <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Hudson Dynasty, Book 2</p>
                    <h2 style="margin: 0 0 10px; color: #f5d76e; font-size: 26px; font-weight: bold; font-family: Georgia, serif;">${nextTitle}</h2>
                    <p style="margin: 0 0 16px; color: #c8c8c8; font-size: 15px; line-height: 1.7; font-style: italic;">
                      A hostile takeover. A rival who plays to win. And a bargain that turns lethal the moment it turns intimate.
                    </p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px; font-family: Arial, sans-serif;">
                      The perfect next chapter of your Manhattan binge.
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
                    <a href="${nextBookLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Continue the Dynasty — Get ${nextTitle}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 40px 24px; text-align: center;">
              <a href="${SITE_URL}/books" style="color: #d4af37; text-decoration: underline; font-size: 14px;">
                See the full reading order
              </a>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Once you start, you won't want to stop. Trust me — I've lived in this world for years.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: `Finished ${finishedTitle}? The dynasty continues...`,
    preheader: `The next Hudson Dynasty novel is waiting — and the stakes just got higher`,
    bodyContent,
  });
}

// ─── Email 2: The Consequences (Day 3) ─────────────────────────────────────

export function generateSeriesUpsellEmail2(options?: {
  subscriberName?: string;
  finishedTitle?: string;
  nextTitle?: string;
  nextBookLink?: string;
}): string {
  const { subscriberName, finishedTitle = "The First Acquisition", nextTitle = "Hostile Tender", nextBookLink = "https://swiy.co/HD1" } = options ?? {};
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
                You know what happens after a deal in Manhattan? The aftermath. The reckoning. The person who thinks they've won — realizing they haven't.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                In ${nextTitle}, I wrote the aftermath of everything you loved about ${finishedTitle} — but sharper, steamier, and with a hero who's spent his whole life never losing. Until her.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                A small, completely spoiler-free promise:
              </p>
            </td>
          </tr>

          <!-- Promise Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px; text-align: center;">
                    <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">One Promise, No Spoilers</p>
                    <p style="margin: 0; color: #c8c8c8; font-size: 17px; line-height: 1.8; font-style: italic; font-family: Georgia, serif;">
                      "The character you thought you knew? You don't." — yet
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
                    <a href="${nextBookLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Uncover the Truth — Get ${nextTitle}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Read it with the lights low and the skyline on. That's how it's meant to be experienced.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: `The deal you thought was over? It's just beginning`,
    preheader: `A spoiler-free promise about what comes next — you're not ready for this one`,
    bodyContent,
  });
}

// ─── Email 3: The Full Collection (Day 7) ──────────────────────────────────

export function generateSeriesUpsellEmail3(options?: {
  subscriberName?: string;
  collectionLink?: string;
}): string {
  const { subscriberName, collectionLink = `${SITE_URL}/books` } = options ?? {};
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
                If you've made it this far into the Hudson Dynasty, you already know the feeling: characters who linger, tension that hums, and endings that make you want to start the next one immediately.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                The entire collection is waiting — every Hudson book, in reading order, one click away. No waiting on the next installment. No "what happens next" guessing games. Just the full dynasty, at your fingertips:
              </p>
            </td>
          </tr>

          <!-- Collection Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px;">
                <tr>
                  <td style="padding: 28px 28px; text-align: center;">
                    <p style="margin: 0 0 12px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">The Complete Collection</p>
                    <p style="margin: 0 0 10px; color: #f5d76e; font-size: 19px; font-weight: bold; font-family: Georgia, serif;">Every Hudson Dynasty novel</p>
                    <p style="margin: 0 0 4px; color: #c8c8c8; font-size: 15px; line-height: 1.7;">All the deals. All the betrayals. All the happily-ever-afters.</p>
                    <p style="margin: 0; color: rgba(200,200,200,0.6); font-size: 13px; font-family: Arial, sans-serif;">Read in order &bull; Binge with zero interruptions</p>
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
                    <a href="${collectionLink}" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Browse the Full Collection
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 10px 40px 20px;">
              <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                And if reader club perks sound like your kind of penthouse — members get first looks at new covers, bonus scenes, and early excerpts. The door's open:
              </p>
              <p style="margin: 0 0 14px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                <a href="${SITE_URL}/reader-club" style="color: #d4af37; text-decoration: underline;">Join the Reader's Club &rarr;</a>
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Thank you for reading these stories. It honestly means the world.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "The full Hudson Dynasty, ready when you are",
    preheader: "Every Hudson novel in reading order — plus a reader club perk for the dedicated",
    bodyContent,
  });
}

export const seriesUpsellSequence = [
  {
    id: 1,
    name: "The Binge Hook — Next Book",
    subject: "Finished book one? The dynasty continues...",
    delay: "Day 0 — reader completes book",
    purpose: "Immediate next-book conversion while the binge momentum is highest",
    generate: generateSeriesUpsellEmail1,
  },
  {
    id: 2,
    name: "The Consequences — Deep Hook",
    subject: "The deal you thought was over? It's just beginning",
    delay: "Day 3 — after book completion",
    purpose: "Second conversion window with spoiler-free stakes to break hesitation",
    generate: generateSeriesUpsellEmail2,
  },
  {
    id: 3,
    name: "The Full Collection",
    subject: "The full Hudson Dynasty, ready when you are",
    delay: "Day 7 — after book completion",
    purpose: "Convert the committed binge-reader to the complete collection + Reader's Club",
    generate: generateSeriesUpsellEmail3,
  },
];