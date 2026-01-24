import { getDb } from './server/db.js';

async function updateBook4() {
  const db = await getDb();
  
  console.log('Updating Book 4 information...');
  
  // Update book 4 with accurate information
  const result = await db.run(`
    UPDATE books 
    SET 
      title = 'The Billionaire''s Forbidden Nanny',
      subtitle = 'Forbidden and Forever',
      description = 'She''s the nanny. He''s her boss. His mother wants her gone.

Camille Torres doesn''t belong in a Park Avenue penthouse. She belongs in the Bronx, finishing her teaching degree and keeping her family afloat. But when a billionaire offers her a salary that could change everything, she takes the job—and walks straight into trouble.

Ethan Calloway hasn''t smiled since his wife died. His five-year-old daughter hasn''t spoken. Seven nannies have quit. He doesn''t need another complication—especially not one with quick wit, warm hands, and a mouth that talks back.

But Lily starts drawing again. Then laughing. Then reaching for Camille like she''s safety.

And Ethan? He''s reaching too.

One kiss in the kitchen. One night that changes everything. One secret that his mother will use to destroy them both.

Gloria Calloway doesn''t lose. She has money, connections, and a custody lawyer on speed dial. Camille has a thrift-store blazer and the Bronx.

But she also has something Gloria will never understand:
A little girl who finally calls her Mama.',
      amazonLink = 'https://swiy.co/4rd',
      price = 0.99,
      seriesOrder = 4,
      tropes = 'billionaire romance, nanny romance, forbidden love, single father, widower, found family, class divide'
    WHERE slug = 'the-billionaires-forbidden-nanny'
  `);
  
  console.log('Book 4 updated:', result.changes, 'rows affected');
  
  // Check if book exists
  const book = await db.get(`SELECT * FROM books WHERE slug = 'the-billionaires-forbidden-nanny'`);
  
  if (book) {
    console.log('Book 4 found:', book.title);
  } else {
    console.log('Book 4 not found, creating...');
    await db.run(`
      INSERT INTO books (
        title, subtitle, slug, description, coverImage, amazonLink, 
        price, seriesOrder, tropes, publishDate, pageCount, heatLevel
      ) VALUES (
        'The Billionaire''s Forbidden Nanny',
        'Forbidden and Forever',
        'the-billionaires-forbidden-nanny',
        'She''s the nanny. He''s her boss. His mother wants her gone.

Camille Torres doesn''t belong in a Park Avenue penthouse. She belongs in the Bronx, finishing her teaching degree and keeping her family afloat. But when a billionaire offers her a salary that could change everything, she takes the job—and walks straight into trouble.

Ethan Calloway hasn''t smiled since his wife died. His five-year-old daughter hasn''t spoken. Seven nannies have quit. He doesn''t need another complication—especially not one with quick wit, warm hands, and a mouth that talks back.

But Lily starts drawing again. Then laughing. Then reaching for Camille like she''s safety.

And Ethan? He''s reaching too.

One kiss in the kitchen. One night that changes everything. One secret that his mother will use to destroy them both.

Gloria Calloway doesn''t lose. She has money, connections, and a custody lawyer on speed dial. Camille has a thrift-store blazer and the Bronx.

But she also has something Gloria will never understand:
A little girl who finally calls her Mama.',
        '/book4-cover.jpg',
        'https://swiy.co/4rd',
        0.99,
        4,
        'billionaire romance, nanny romance, forbidden love, single father, widower, found family, class divide',
        '2026-02-03',
        350,
        'Explicit'
      )
    `);
    console.log('Book 4 created');
  }
  
  console.log('Done!');
  process.exit(0);
}

updateBook4().catch(console.error);
