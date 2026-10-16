/**
 * Purchase Confirmation Email Template
 * 
 * Generates a luxury Manhattan-themed HTML email for purchase confirmations
 * with personalized download links for purchased ebooks.
 */

export interface PurchaseConfirmationData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  purchaseDate: string;
  bookTitle: string;
  bookCover?: string;
  purchasePrice: string;
  downloadLinks: {
    epub: string;
    mobi: string;
    pdf: string;
  };
}

export function generatePurchaseConfirmationEmail(data: PurchaseConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Purchase Confirmation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0a0e27;
      color: #e5e5e5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1f3a;
    }
    .header {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      padding: 40px 20px;
      text-align: center;
      border-bottom: 2px solid #d4af37;
    }
    .logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: bold;
      color: #d4af37;
      margin: 0;
    }
    .content {
      padding: 40px 20px;
    }
    .greeting {
      font-size: 24px;
      color: #d4af37;
      margin: 0 0 20px 0;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #e5e5e5;
      margin: 0 0 30px 0;
    }
    .book-details {
      background-color: #0a0e27;
      border: 1px solid #d4af37;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .book-cover {
      width: 120px;
      height: 180px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
    }
    .book-info {
      flex: 1;
    }
    .book-title {
      font-size: 20px;
      font-weight: bold;
      color: #d4af37;
      margin: 0 0 10px 0;
    }
    .order-info {
      font-size: 14px;
      color: #e5e5e5;
      opacity: 0.8;
      margin: 5px 0;
    }
    .download-section {
      background-color: #0a0e27;
      border: 1px solid #d4af37;
      border-radius: 8px;
      padding: 30px 20px;
      margin: 30px 0;
      text-align: center;
    }
    .download-title {
      font-size: 20px;
      color: #d4af37;
      margin: 0 0 20px 0;
    }
    .download-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 20px;
    }
    .download-btn {
      display: inline-block;
      background-color: #d4af37;
      color: #0a0e27;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .download-btn:hover {
      background-color: #c9a961;
    }
    .format-label {
      font-size: 12px;
      color: #e5e5e5;
      opacity: 0.6;
      margin-top: 4px;
    }
    .help-section {
      background-color: rgba(212, 175, 55, 0.1);
      border-left: 3px solid #d4af37;
      padding: 20px;
      margin: 30px 0;
    }
    .help-title {
      font-size: 16px;
      font-weight: bold;
      color: #d4af37;
      margin: 0 0 10px 0;
    }
    .help-text {
      font-size: 14px;
      line-height: 1.6;
      color: #e5e5e5;
      margin: 0;
    }
    .footer {
      background-color: #0a0e27;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #d4af37;
    }
    .footer-text {
      font-size: 14px;
      color: #e5e5e5;
      opacity: 0.6;
      margin: 5px 0;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-link {
      color: #d4af37;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .book-details {
        flex-direction: column;
        text-align: center;
      }
      .download-buttons {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">Reese Astor</h1>
      <p style="margin: 10px 0 0 0; color: #e5e5e5; opacity: 0.8;">Romance Author</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2 class="greeting">Thank You for Your Purchase, ${data.customerName}!</h2>
      
      <p class="message">
        Your order has been confirmed and your ebook is ready to download. Thank you for supporting my work and choosing to read the Manhattan Money Kings series!
      </p>

      <!-- Book Details -->
      <div class="book-details">
        ${data.bookCover ? `<img src="${data.bookCover}" alt="${data.bookTitle}" class="book-cover">` : ""}
        <div class="book-info">
          <h3 class="book-title">${data.bookTitle}</h3>
          <p class="order-info"><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p class="order-info"><strong>Purchase Date:</strong> ${data.purchaseDate}</p>
          <p class="order-info"><strong>Amount Paid:</strong> ${data.purchasePrice}</p>
        </div>
      </div>

      <!-- Download Section -->
      <div class="download-section">
        <h3 class="download-title">Download Your Ebook</h3>
        <p class="message">Choose your preferred format below. All three formats are included with your purchase:</p>
        
        <div class="download-buttons">
          <a href="${data.downloadLinks.epub}" class="download-btn">
            Download ePub
            <div class="format-label">For most e-readers (Kobo, Nook, Apple Books)</div>
          </a>
          
          <a href="${data.downloadLinks.mobi}" class="download-btn">
            Download Mobi
            <div class="format-label">For Kindle devices and apps</div>
          </a>
          
          <a href="${data.downloadLinks.pdf}" class="download-btn">
            Download PDF
            <div class="format-label">Universal format for any device</div>
          </a>
        </div>
      </div>

      <!-- Help Section -->
      <div class="help-section">
        <h4 class="help-title">Need Help?</h4>
        <p class="help-text">
          If you have any trouble downloading your ebook or need assistance transferring it to your device, 
          please don't hesitate to contact me at <a href="mailto:support@reeseastor.com" style="color: #d4af37;">support@reeseastor.com</a>. 
          I'm here to help!
        </p>
      </div>

      <p class="message">
        You can also access your purchased ebooks anytime by logging into your account on my website 
        and visiting the <a href="https://reeseastor.us/my-purchases" style="color: #d4af37;">My Purchases</a> page.
      </p>

      <p class="message">
        Happy reading! I hope you enjoy this story as much as I enjoyed writing it. If you love it, 
        I'd be incredibly grateful if you could leave a review on Amazon or Goodreads.
      </p>

      <p class="message" style="margin-top: 30px;">
        With love and gratitude,<br>
        <strong style="color: #d4af37;">Reese Astor</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social-links">
        <a href="https://reeseastor.us" class="social-link">Website</a>
        <a href="https://reeseastor.us/blog" class="social-link">Blog</a>
        <a href="https://reeseastor.us/reader-club" class="social-link">Reader's Club</a>
      </div>
      
      <p class="footer-text">
        This email was sent to ${data.customerEmail}
      </p>
      <p class="footer-text">
        © ${new Date().getFullYear()} Reese Astor. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
