/**
 * Script to generate short preview audio clips (10-15 seconds) for non-members
 * Run with: npx tsx scripts/generate-preview-audio.ts
 */

import { config } from "dotenv";
config({ path: ".env" });

import { storagePut } from "../server/storage";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set");
  process.exit(1);
}

// Voice IDs from ElevenLabs
const VOICES = {
  bella: "EXAVITQu4vr4xnSDxMaL",
  rachel: "21m00Tcm4TlvDq8ikWAM",
  charlotte: "XB0fDUnXU5powFXDhCwa",
};

// Short preview clips (10-15 seconds when narrated)
const PREVIEW_SAMPLES = [
  {
    id: 1,
    title: "Midnight Confessions",
    voice: "bella",
    text: `The penthouse was dark except for the Manhattan skyline glowing through the floor-to-ceiling windows. Sarah's heart raced as Michael stepped closer, his presence commanding even in the shadows.`,
  },
  {
    id: 2,
    title: "The Boardroom Surrender",
    voice: "rachel",
    text: `Elena had never felt so exposed, standing alone with David in the empty boardroom after everyone had left. The tension between them had been building for weeks, and now there was nowhere to hide.`,
  },
  {
    id: 3,
    title: "Forbidden Desires",
    voice: "charlotte",
    text: `Sophia knew she should walk away. Dominic Kane was everything she'd sworn to avoid—powerful, possessive, and utterly intoxicating.`,
  },
  {
    id: 4,
    title: "One Night in Manhattan",
    voice: "bella",
    text: `Victoria had promised herself this would be just one night. No names, no complications, just the electric chemistry that had sparked between them the moment their eyes met across the crowded gala.`,
  },
  {
    id: 5,
    title: "Second Chance Seduction",
    voice: "rachel",
    text: `Five years. Five years since she'd last seen him, and now here he was, standing in her office like no time had passed at all.`,
  },
];

async function generateAudio(text: string, voiceId: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log("🎙️ Starting Preview Audio Generation...\n");

  const results: { id: number; title: string; previewUrl: string }[] = [];

  for (const story of PREVIEW_SAMPLES) {
    console.log(`📖 Generating preview for: "${story.title}"...`);

    try {
      const voiceId = VOICES[story.voice as keyof typeof VOICES];
      const audioBuffer = await generateAudio(story.text, voiceId);

      // Upload to S3
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `audio/vip-previews/story-${story.id}-preview-${timestamp}-${randomSuffix}.mp3`;

      const { url } = await storagePut(fileKey, audioBuffer, "audio/mpeg");

      results.push({
        id: story.id,
        title: story.title,
        previewUrl: url,
      });

      console.log(`   ✅ Generated: ${url}\n`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Failed to generate preview for "${story.title}":`, error);
    }
  }

  console.log("\n📊 Summary:");
  console.log("=".repeat(50));
  results.forEach((r) => {
    console.log(`Story ${r.id}: ${r.title}`);
    console.log(`   Preview URL: ${r.previewUrl}`);
  });

  // Output SQL update statements
  console.log("\n📝 SQL Update Statements:");
  console.log("=".repeat(50));
  results.forEach((r) => {
    console.log(`UPDATE steamy_stories SET previewAudioUrl = '${r.previewUrl}' WHERE id = ${r.id};`);
  });

  console.log("\n✨ Preview audio generation complete!");
}

main().catch(console.error);
