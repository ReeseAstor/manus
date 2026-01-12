import { getDb } from '../server/db.ts';
import { products } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();

const vipProducts = [
  {
    name: 'VIP Bronze Membership',
    slug: 'vip-bronze',
    description: 'Access to our library of steamy audio stories featuring your favorite Manhattan Money Kings characters.',
    price: 9.99,
    currency: 'usd',
    type: 'subscription',
    stripePriceId: null, // You'll need to create this in Stripe Dashboard
    active: true,
    metadata: JSON.stringify({
      tier: 'bronze',
      features: [
        'Access to 10+ steamy audio stories',
        'New story added monthly',
        'Listen on any device',
        'Early access to new releases'
      ]
    })
  },
  {
    name: 'VIP Silver Membership',
    slug: 'vip-silver',
    description: 'Enhanced access with more stories and exclusive bonus content from the Manhattan Money Kings universe.',
    price: 19.99,
    currency: 'usd',
    type: 'subscription',
    stripePriceId: null, // You'll need to create this in Stripe Dashboard
    active: true,
    metadata: JSON.stringify({
      tier: 'silver',
      features: [
        'Everything in Bronze',
        'Access to 25+ steamy audio stories',
        '2 new stories monthly',
        'Exclusive bonus chapters',
        'Behind-the-scenes content',
        'Priority support'
      ]
    })
  },
  {
    name: 'VIP Gold Membership',
    slug: 'vip-gold',
    description: 'The ultimate VIP experience with custom story requests and personalized voice messages from Reese Astor.',
    price: 29.99,
    currency: 'usd',
    type: 'subscription',
    stripePriceId: null, // You'll need to create this in Stripe Dashboard
    active: true,
    metadata: JSON.stringify({
      tier: 'gold',
      features: [
        'Everything in Silver',
        'Unlimited story access',
        '3 new stories monthly',
        'Custom story requests (2/month)',
        'Personalized voice messages',
        'Exclusive Gold-only stories',
        'Direct author Q&A access'
      ]
    })
  }
];

console.log('Adding VIP tier products to database...\n');

for (const product of vipProducts) {
  try {
    // Check if product already exists
    const existing = await db.select().from(products).where(eq(products.slug, product.slug)).limit(1);
    
    if (existing.length > 0) {
      // Update existing product
      await db.update(products)
        .set(product)
        .where(eq(products.slug, product.slug));
      console.log(`✓ Updated: ${product.name}`);
    } else {
      // Insert new product
      await db.insert(products).values(product);
      console.log(`✓ Added: ${product.name}`);
    }
  } catch (error) {
    console.error(`✗ Error with ${product.name}:`, error.message);
  }
}

console.log('\n⚠️  IMPORTANT: You need to create Stripe Price IDs for these products:');
console.log('1. Go to https://dashboard.stripe.com/products');
console.log('2. Create 3 recurring products:');
console.log('   - VIP Bronze: $9.99/month');
console.log('   - VIP Silver: $19.99/month');
console.log('   - VIP Gold: $29.99/month');
console.log('3. Copy the Price IDs (they start with price_)');
console.log('4. Update the products in your database with these Price IDs\n');

console.log('Done!');
process.exit(0);
