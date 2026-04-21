/**
 * Win-Back / Re-Engagement Email Sequence Templates
 * 3 emails triggered when subscriber is inactive for 60+ days
 * Design: Dark luxury gold Manhattan aesthetic matching welcome series
 */

const SITE_URL = "https://reeseastor.manus.space";

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
              <p style="margin: 0 0 6px; color: #d4af37; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: Arial, sans-serif;">USA Today Bestselling Author</p>
              <h1 style="margin: 0; color: #d4af37; font-size: 30px; font-weight: bold; letter-spacing: 2px; font-family: Georgia, serif;">REESE ASTOR</h1>
            </td>
          </tr>

          <!-- Body Content -->
${bodyContent}

          <!-- Signature -->
          <tr>
            <td class="content-cell" style="padding: 10px 40px 30px;">
              <p style="margin: 0 0 8px; color: #c8c8c8; font-size: 16px; font-style: italic;">Always here for you,</p>
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

// ─── Email 1: "I Miss You" (Day 0 — triggered at 60 days inactive) ──────────

export function generateWinBackEmail1(subscriberName?: string): string {
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
                It's been a while since I've heard from you, and I just wanted to check in. Life gets busy — I completely understand. But I've missed having you in my world.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                A lot has happened since we last connected. I've been writing new stories, sharing behind-the-scenes glimpses of the Manhattan Money Kings universe, and building something special for my most dedicated readers.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                To welcome you back, I have something I think you'll love:
              </p>
            </td>
          </tr>

          <!-- Welcome Back Gift Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #d4af37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Welcome Back Gift</p>
                    <h2 style="margin: 0 0 12px; color: #f5d76e; font-size: 22px; font-weight: bold;">An Exclusive Bonus Chapter</h2>
                    <p style="margin: 0 0 16px; color: #c8c8c8; font-size: 15px; line-height: 1.7;">
                      I wrote a brand-new bonus chapter that takes place after the events of the Manhattan Money Kings trilogy. It's never been published anywhere — and it's yours, just for coming back.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="color: #d4af37;">&#9733; &#9733; &#9733; &#9733; &#9733;</span>
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
            <td style="padding: 0 40px 10px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 40px;">
                    <a href="${SITE_URL}/welcome-back" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Claim Your Bonus Chapter
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stay on list CTA -->
          <tr>
            <td style="padding: 10px 40px 24px; text-align: center;">
              <a href="${SITE_URL}/stay-subscribed" style="color: #d4af37; text-decoration: underline; font-size: 14px;">
                Click here to stay on my VIP reader list
              </a>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I hope to see you back in the Manhattan Money Kings world soon. The penthouse lights are always on for you.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "Still there? I have something special for you",
    preheader: "I've missed you — and I have an exclusive bonus chapter waiting",
    bodyContent,
  });
}

// ─── Email 2: "One Last Thing" (Day 7) ──────────────────────────────────────

export function generateWinBackEmail2(subscriberName?: string): string {
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
                I sent you an email last week with an exclusive bonus chapter, and I noticed you haven't had a chance to open it yet. No pressure at all — I just want to make sure my emails are still something you want to receive.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I have a simple question for you:
              </p>
            </td>
          </tr>

          <!-- Question Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 10px;">
                <tr>
                  <td style="padding: 30px 28px; text-align: center;">
                    <h2 style="margin: 0 0 16px; color: #f5d76e; font-size: 24px; font-weight: bold;">Should I keep sending you emails?</h2>
                    <p style="margin: 0 0 24px; color: #c8c8c8; font-size: 15px; line-height: 1.7;">
                      I only want to be in your inbox if you want me there. A quick click is all it takes.
                    </p>
                    
                    <!-- Yes Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 12px;">
                      <tr>
                        <td style="background-color: #d4af37; border-radius: 8px; padding: 14px 50px;">
                          <a href="${SITE_URL}/stay-subscribed" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; display: inline-block;">
                            Yes! Keep me on the list
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- No link -->
                    <p style="margin: 0; font-size: 13px;">
                      <a href="{$unsubscribe}" style="color: rgba(200,200,200,0.4); text-decoration: underline;">No thanks, I'd like to unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                Either way, I'm grateful you were part of my reader community. If you choose to stay, I promise to keep bringing you stories that make your heart race and characters you'll never forget.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                And if life is just busy right now — I completely understand. The Manhattan Money Kings will be here whenever you're ready.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "Should I keep sending you emails?",
    preheader: "A quick question — one click is all it takes",
    bodyContent,
  });
}

// ─── Email 3: "Goodbye (For Now)" (Day 14) ──────────────────────────────────

export function generateWinBackEmail3(subscriberName?: string): string {
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
                This is my last email to you — and I want you to know it's bittersweet.
              </p>
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                I'm cleaning up my reader list to make sure I'm only sending emails to people who truly want them. Since I haven't heard from you in a while, I'll be removing your email address <strong style="color: #e5e5e5;">tomorrow</strong>.
              </p>
            </td>
          </tr>

          <!-- Urgency Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(220, 53, 69, 0.08); border: 1px solid rgba(220, 53, 69, 0.2); border-radius: 10px;">
                <tr>
                  <td style="padding: 24px 28px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #dc3545; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Final Notice</p>
                    <h2 style="margin: 0 0 12px; color: #e5e5e5; font-size: 22px; font-weight: bold;">You'll be removed tomorrow</h2>
                    <p style="margin: 0 0 16px; color: #c8c8c8; font-size: 15px; line-height: 1.7;">
                      Once removed, you'll lose access to:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto; text-align: left;">
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #dc3545; font-size: 14px;">&#10006;</span>
                          <span style="color: #c8c8c8; font-size: 14px; padding-left: 8px;">Exclusive bonus chapters & deleted scenes</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #dc3545; font-size: 14px;">&#10006;</span>
                          <span style="color: #c8c8c8; font-size: 14px; padding-left: 8px;">Early access to new releases</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px;">
                          <span style="color: #dc3545; font-size: 14px;">&#10006;</span>
                          <span style="color: #c8c8c8; font-size: 14px; padding-left: 8px;">Subscriber-only discounts & flash sales</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 0;">
                          <span style="color: #dc3545; font-size: 14px;">&#10006;</span>
                          <span style="color: #c8c8c8; font-size: 14px; padding-left: 8px;">Behind-the-scenes author updates</span>
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
            <td style="padding: 0 40px 10px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4af37; border-radius: 8px; padding: 16px 50px;">
                    <a href="${SITE_URL}/stay-subscribed" class="cta-button" style="color: #0a0e27; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.5px; display: inline-block;">
                      Wait — Keep Me Subscribed!
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px 20px; text-align: center;">
              <p style="margin: 0; color: rgba(200,200,200,0.5); font-size: 13px; font-family: Arial, sans-serif;">
                Click the button above before tomorrow to stay on my list
              </p>
            </td>
          </tr>

          <tr>
            <td class="content-cell" style="padding: 0 40px 20px;">
              <p style="margin: 0 0 18px; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                If this is goodbye, I want you to know — thank you. Thank you for being part of my world, even for a little while. The door is always open if you want to come back.
              </p>
              <p style="margin: 0; color: #c8c8c8; font-size: 16px; line-height: 1.8;">
                And if you click that button? I'll be here with open arms and new stories to tell.
              </p>
            </td>
          </tr>`;

  return wrapInTemplate({
    subject: "Removing you from my list tomorrow",
    preheader: "This is your last chance to stay — I don't want to say goodbye",
    bodyContent,
  });
}

export const winBackSequence = [
  {
    id: 1,
    name: "I Miss You — Welcome Back Gift",
    subject: "Still there? I have something special for you",
    delay: "Triggered at 60 days inactive",
    purpose: "Emotional reconnection with a compelling offer (bonus chapter)",
    generate: generateWinBackEmail1,
  },
  {
    id: 2,
    name: "One Last Thing — Stay or Go",
    subject: "Should I keep sending you emails?",
    delay: "7 days after Email 1",
    purpose: "Direct question that forces a decision — simple yes/no engagement check",
    generate: generateWinBackEmail2,
  },
  {
    id: 3,
    name: "Goodbye (For Now) — Final Chance",
    subject: "Removing you from my list tomorrow",
    delay: "14 days after Email 1",
    purpose: "Loss aversion trigger — subscribers who don't engage are removed for list health",
    generate: generateWinBackEmail3,
  },
];
