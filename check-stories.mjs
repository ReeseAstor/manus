import { db } from './server/db.js';
import { steamyStories } from './drizzle/schema.js';

const stories = await db.select().from(steamyStories);
console.log(JSON.stringify(stories, null, 2));
process.exit(0);
