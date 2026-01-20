import mysql from 'mysql2/promise';

const templates = [
  {
    slug: 'vip-welcome',
    name: 'VIP Welcome Message',
    description: 'Sent when a new member joins the VIP Spicy Stories Club',
    messageTemplate: '🎉 Welcome to the VIP Spicy Stories Club, {{name}}! Your {{tier}} membership is now active. Get ready for exclusive steamy stories, audio narrations, and more! 📚💕 - Reese Astor',
    category: 'vip',
    isActive: true,
  },
  {
    slug: 'new-story-release',
    name: 'New Story Release Alert',
    description: 'Sent when a new exclusive story is published',
    messageTemplate: '🔥 Hot off the press, {{name}}! A new steamy story is waiting for you: "{{storyTitle}}" Listen now in your VIP Audio Library! 🎧 - Reese Astor',
    category: 'vip',
    isActive: true,
  },
  {
    slug: 'order-confirmation',
    name: 'Order Confirmation',
    description: 'Sent when an order is placed',
    messageTemplate: '📦 Order confirmed! Your order #{{orderNumber}} for "{{itemName}}" is being processed. Thank you for your purchase! - Reese Astor',
    category: 'order',
    isActive: true,
  },
  {
    slug: 'subscription-renewal',
    name: 'Subscription Renewal Reminder',
    description: 'Sent before subscription renewal',
    messageTemplate: '⏰ Heads up, {{name}}! Your VIP membership renews in 3 days. Keep enjoying unlimited steamy stories! 💕 - Reese Astor',
    category: 'vip',
    isActive: true,
  },
  {
    slug: 'book-launch',
    name: 'Book Launch Announcement',
    description: 'Sent when a new book is released',
    messageTemplate: '📚 NEW RELEASE! "{{bookTitle}}" is now available! As a VIP member, you get early access. Grab your copy now! 🔥 - Reese Astor',
    category: 'marketing',
    isActive: true,
  },
];

async function seedTemplates() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'reese_astor',
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  console.log('Connected to database');

  for (const template of templates) {
    try {
      // Check if template exists
      const [existing] = await connection.execute(
        'SELECT id FROM sms_templates WHERE slug = ?',
        [template.slug]
      );

      if (existing.length > 0) {
        // Update existing template
        await connection.execute(
          `UPDATE sms_templates SET 
            name = ?, description = ?, messageTemplate = ?, category = ?, isActive = ?
           WHERE slug = ?`,
          [template.name, template.description, template.messageTemplate, template.category, template.isActive, template.slug]
        );
        console.log(`✓ Updated template: ${template.slug}`);
      } else {
        // Insert new template
        await connection.execute(
          `INSERT INTO sms_templates (slug, name, description, messageTemplate, category, isActive)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [template.slug, template.name, template.description, template.messageTemplate, template.category, template.isActive]
        );
        console.log(`✓ Created template: ${template.slug}`);
      }
    } catch (error) {
      console.error(`✗ Error with template ${template.slug}:`, error.message);
    }
  }

  await connection.end();
  console.log('\\nDone! SMS templates seeded successfully.');
}

seedTemplates().catch(console.error);
