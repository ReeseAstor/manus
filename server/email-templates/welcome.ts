/**
 * Welcome Email Template
 *
 * Sent automatically after a successful newsletter sign-up.
 * Includes a link to download the free prequel novella.
 */

export interface WelcomeEmailData {
  subscriberName?: string;
}

const PREQUEL_BOOKFUNNEL_URL = "https://swiy.co/05";
const PREQUEL_AMAZON_URL = "https://swiy.co/3rd";

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const greeting = data.subscriberName
    ? `Hello ${data.subscriberName},`
    : "Hello,";

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Welcome to the Inner Circle</title>
  <style type="text/css">
    .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
  </style>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .outlook-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e27; font-family: Georgia, 'Times New Roman', serif;">
  <span class="preheader">Your free book is waiting! Download The First Acquisition now.</span>

  <!-- Email Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0e27;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Main Content Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: #1a1f3a; border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 16px; overflow: hidden;">

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
          <tr>
            <td style="padding: 0 40px 20px;">
              <p style="margin: 0; color: #e5e5e5; font-size: 18px; line-height: 1.6;">
                ${greeting}
              </p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <p style="margin: 0 0 16px; color: #e5e5e5; font-size: 16px; line-height: 1.8;">
                Welcome to the inner circle! I'm so thrilled you're here. As a thank-you for joining, I have a special gift for you&mdash;a <strong style="color: #d4af37;">free copy</strong> of my steamy billionaire romance novella.
              </p>
            </td>
          </tr>

          <!-- Book Feature Box -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="margin: 0 0 6px; color: rgba(212, 175, 55, 0.7); font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                      YOUR FREE BOOK
                    </p>
                    <h2 style="margin: 0 0 8px; color: #d4af37; font-size: 24px; font-weight: bold; line-height: 1.3;">
                      The First Acquisition
                    </h2>
                    <p style="margin: 0 0 6px; color: rgba(229, 229, 229, 0.6); font-size: 14px;">
                      A Manhattan Billionaire Romance (Hudson Dynasty)
                    </p>
                    <p style="margin: 0 0 24px; color: #e5e5e5; font-size: 15px; line-height: 1.7;">
                      She was hired to audit his empire. Falling for him could destroy them both. A high-heat corporate billionaire romance novella.
                    </p>

                    <!-- Download Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 50px; background: linear-gradient(135deg, #d4af37 0%, #c9a961 100%);">
                          <a href="${PREQUEL_BOOKFUNNEL_URL}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #000000; font-size: 16px; font-weight: bold; text-decoration: none; font-family: Arial, sans-serif; letter-spacing: 0.5px;">
                            &#128214;&nbsp; Download Your Free Book
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 16px 0 0; color: rgba(229, 229, 229, 0.5); font-size: 13px;">
                      Also available on <a href="${PREQUEL_AMAZON_URL}" target="_blank" style="color: #d4af37; text-decoration: underline;">Amazon</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 16px; color: #d4af37; font-size: 20px; font-weight: bold;">
                What You Can Look Forward To
              </h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #e5e5e5; font-size: 15px; line-height: 1.6;">
                    &#128276;&nbsp;&nbsp;New release alerts before anyone else
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #e5e5e5; font-size: 15px; line-height: 1.6;">
                    &#127873;&nbsp;&nbsp;Bonus scenes from the series
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #e5e5e5; font-size: 15px; line-height: 1.6;">
                    &#128064;&nbsp;&nbsp;Early cover reveals and ARC team invitations
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #e5e5e5; font-size: 15px; line-height: 1.6;">
                    &#128150;&nbsp;&nbsp;Sales and release-day news
                  </td>
                </tr>
              </table>
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
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.com" style="color: #d4af37; text-decoration: none; font-size: 14px;">Website</a>
                  </td>
                  <td style="padding: 0 10px; color: rgba(229, 229, 229, 0.3);">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.com/books" style="color: #d4af37; text-decoration: none; font-size: 14px;">Books</a>
                  </td>
                  <td style="padding: 0 10px; color: rgba(229, 229, 229, 0.3);">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://reeseastor.com/blog" style="color: #d4af37; text-decoration: none; font-size: 14px;">Blog</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: rgba(229, 229, 229, 0.4); font-size: 12px; line-height: 1.6;">
                You're receiving this email because you signed up for new release alerts from Reese Astor.
              </p>
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
