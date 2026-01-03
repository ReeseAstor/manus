import { readFileSync } from 'fs';
import { generateSpeech } from './server/_core/textToSpeech.ts';
import { storagePut } from './server/storage.ts';

const books = [
  { id: 'book05', title: 'The Billionaire\'s One Night Stand', file: 'book05-excerpt.txt' },
  { id: 'book1', title: 'The Billionaire\'s Executive Assistant', file: 'book1-excerpt.txt' },
  { id: 'book2', title: 'The Billionaire\'s Fake Wife', file: 'book2-excerpt.txt' },
  { id: 'book3', title: 'The Billionaire\'s Baby Secret', file: 'book3-excerpt.txt' },
];

async function generateAudioSamples() {
  console.log('Starting audio sample generation...\n');

  for (const book of books) {
    try {
      console.log(`Processing: ${book.title}`);
      
      // Read excerpt text
      const excerptPath = `./book-audio-excerpts/${book.file}`;
      const excerptText = readFileSync(excerptPath, 'utf-8');
      
      // Extract just the scene content (between "---" markers)
      const sceneMatch = excerptText.match(/---\n\n([\s\S]*?)\n\n---/);
      if (!sceneMatch) {
        console.log(`  ⚠️  No scene content found in ${book.file}`);
        continue;
      }
      
      const sceneText = sceneMatch[1];
      console.log(`  📝 Extracted ${sceneText.length} characters`);
      
      // Generate audio using ElevenLabs
      console.log('  🎙️  Generating audio with ElevenLabs...');
      const audioBuffer = await generateSpeech(sceneText);
      
      // Upload to S3
      console.log('  ☁️  Uploading to S3...');
      const fileKey = `book-samples/${book.id}-sample-${Date.now()}.mp3`;
      const { url } = await storagePut(fileKey, audioBuffer, 'audio/mpeg');
      
      console.log(`  ✅ Success! Audio URL: ${url}\n`);
      
      // Save URL to a file for reference
      const urlsFile = './book-audio-excerpts/audio-urls.json';
      let urls = {};
      try {
        urls = JSON.parse(readFileSync(urlsFile, 'utf-8'));
      } catch (e) {
        // File doesn't exist yet
      }
      urls[book.id] = url;
      
      const { writeFileSync } = await import('fs');
      writeFileSync(urlsFile, JSON.stringify(urls, null, 2));
      
    } catch (error) {
      console.error(`  ❌ Error processing ${book.title}:`, error.message);
    }
  }
  
  console.log('\n✨ Audio sample generation complete!');
}

generateAudioSamples().catch(console.error);
