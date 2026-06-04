import Stripe from 'stripe';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Book bundle products to create
const bookProducts = [
  {
    name: "Single Book - Manhattan Money Kings",
    description: "Choose any book from the Manhattan Money Kings series. Includes instant digital delivery in ePub, Mobi & PDF formats.",
    price: 399, // $3.99
    metadata: { type: 'single_book', books: '1' }
  },
  {
    name: "Complete Series - Manhattan Money Kings",
    description: "All 4 Manhattan Money Kings books plus bonus character interviews and deleted scenes. Instant digital delivery.",
    price: 999, // $9.99
    metadata: { type: 'series', books: '4' }
  },
  {
    name: "Ultimate Collection - Manhattan Money Kings",
    description: "Complete trilogy + prequel, exclusive bonus chapters, behind-the-scenes content, character mood boards, author's playlist, and early access to Book 4.",
    price: 1299, // $12.99
    metadata: { type: 'ultimate', books: '4' }
  },
  {
    name: "The Billionaire's Executive Assistant",
    description: "Book 1 of the Manhattan Money Kings series. A steamy enemies-to-lovers billionaire romance.",
    price: 399, // $3.99
    metadata: { type: 'individual_book', book_id: '1' }
  },
  {
    name: "The Billionaire's Fake Wife",
    description: "Book 2 of the Manhattan Money Kings series. A fake marriage billionaire romance.",
    price: 399, // $3.99
    metadata: { type: 'individual_book', book_id: '2' }
  },
  {
    name: "The Billionaire's Baby Secret",
    description: "Book 3 of the Manhattan Money Kings series. A secret baby billionaire romance.",
    price: 399, // $3.99
    metadata: { type: 'individual_book', book_id: '3' }
  }
];

async function setupStripeProducts() {
  console.log('Setting up Stripe products...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const createdProducts = [];

  for (const product of bookProducts) {
    try {
      // Create product in Stripe
      console.log(`Creating product: ${product.name}`);
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata,
      });

      // Create price in Stripe
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
      });

      console.log(`  ✓ Stripe Product ID: ${stripeProduct.id}`);
      console.log(`  ✓ Stripe Price ID: ${stripePrice.id}`);

      // Insert into database
      await connection.execute(
        `INSERT INTO products (name, description, price, currency, stripeProductId, stripePriceId, type, active, createdAt, updatedAt)
         VALUES (?, ?, ?, 'usd', ?, ?, 'one_time', true, NOW(), NOW())`,
        [
          product.name,
          product.description,
          product.price,
          stripeProduct.id,
          stripePrice.id,
        ]
      );

      console.log(`  ✓ Added to database\n`);
      
      createdProducts.push({
        name: product.name,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
        price: product.price,
      });

    } catch (error) {
      console.error(`  ✗ Error creating ${product.name}:`, error.message);
    }
  }

  await connection.end();

  console.log('\n=== Summary ===');
  console.log(`Created ${createdProducts.length} products:\n`);
  createdProducts.forEach(p => {
    console.log(`${p.name}`);
    console.log(`  Price: $${(p.price / 100).toFixed(2)}`);
    console.log(`  Stripe Price ID: ${p.stripePriceId}\n`);
  });
}

setupStripeProducts().catch(console.error);
