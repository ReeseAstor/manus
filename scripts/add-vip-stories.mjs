import { readFileSync } from 'fs';
import { getDb } from '../server/db.ts';
import { steamyStories } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();

// Read the story files
const boardroomStory = readFileSync('/home/ubuntu/story-boardroom-confession.md', 'utf-8');
const midnightStory = readFileSync('/home/ubuntu/story-midnight-chen-tech.md', 'utf-8');
const threeYearsStory = readFileSync('/home/ubuntu/story-three-years-later.md', 'utf-8');

// Extract just the story content (remove the metadata header)
const extractContent = (markdown) => {
  const lines = markdown.split('\n');
  const contentStart = lines.findIndex(line => line.startsWith('---') && lines.indexOf(line) > 0) + 2;
  return lines.slice(contentStart).join('\n').trim();
};

const stories = [
  {
    title: 'The Boardroom Confession',
    slug: 'the-boardroom-confession',
    excerpt: 'David\'s hand found the small of my back, his touch sending electricity through the silk of my dress. "We shouldn\'t," I whispered, even as I leaned into him. His gilded eyes darkened. "Then tell me to stop." But we both knew I wouldn\'t.',
    content: extractContent(boardroomStory),
    category: 'passion',
    heatLevel: 4,
    characters: JSON.stringify(['Elena Volkov', 'David Kim']),
    requiredTier: 'bronze',
    wordCount: 2400
  },
  {
    title: 'Late Night on the Executive Floor',
    slug: 'late-night-executive-floor',
    excerpt: 'The office was silent except for the hum of my computer and the pounding of my heart. I didn\'t hear Michael approach until his shadow fell across my desk. "You\'re still here," he said, his voice rough with exhaustion—or something else entirely.',
    content: extractContent(midnightStory),
    category: 'romance',
    heatLevel: 4,
    characters: JSON.stringify(['Sarah Shah', 'Michael Hastings']),
    requiredTier: 'bronze',
    wordCount: 1800
  },
  {
    title: 'Three Years Later',
    slug: 'three-years-later',
    excerpt: 'The last person I expected to see at Kane Industries was Dominic Kane himself. Three years hadn\'t changed him—same intense dark eyes, same commanding presence that once made my knees weak. Still made them weak, apparently.',
    content: extractContent(threeYearsStory),
    category: 'reunion',
    heatLevel: 5,
    characters: JSON.stringify(['Sophia Romano', 'Dominic Kane']),
    requiredTier: 'silver',
    wordCount: 2200
  }
];

console.log('Adding VIP stories to database...\n');

for (const story of stories) {
  try {
    // Check if story already exists
    const existing = await db.select().from(steamyStories).where(eq(steamyStories.slug, story.slug)).limit(1);
    
    if (existing.length > 0) {
      // Update existing story
      await db.update(steamyStories)
        .set(story)
        .where(eq(steamyStories.slug, story.slug));
      console.log(`✓ Updated: ${story.title}`);
    } else {
      // Insert new story
      await db.insert(steamyStories).values(story);
      console.log(`✓ Added: ${story.title}`);
    }
  } catch (error) {
    console.error(`✗ Error with ${story.title}:`, error.message);
  }
}

console.log('\nDone!');
process.exit(0);
