/**
 * Script to generate ElevenLabs audio samples for VIP steamy stories
 * Run with: npx tsx scripts/generate-vip-audio.ts
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
  bella: "EXAVITQu4vr4xnSDxMaL", // Soft, sensual voice
  rachel: "21m00Tcm4TlvDq8ikWAM", // Warm, intimate narrator
  charlotte: "XB0fDUnXU5powFXDhCwa", // Sultry, dramatic
};

// Story excerpts for audio generation (steamy but tasteful samples)
const STORY_SAMPLES = [
  {
    id: 1,
    title: "Midnight Confessions",
    voice: "bella",
    text: `The penthouse was dark except for the Manhattan skyline glowing through the floor-to-ceiling windows. Sarah's heart raced as Michael stepped closer, his presence commanding even in the shadows.

"I've been thinking about you all day," he murmured, his voice low and dangerous. "Every meeting, every call... all I could see was you."

She felt the warmth of his breath against her neck, sending shivers down her spine. "Michael, we shouldn't—"

"Tell me to stop," he challenged, his fingers brushing against her jaw. "Tell me you don't feel this too."

But she couldn't. Because every nerve in her body was alive with wanting him.`,
  },
  {
    id: 2,
    title: "The Boardroom Surrender",
    voice: "rachel",
    text: `Elena had never felt so exposed, standing alone with David in the empty boardroom after everyone had left. The tension between them had been building for weeks, and now there was nowhere to hide.

"You've been avoiding me," he said, loosening his tie as he approached. The predatory gleam in his eyes made her pulse quicken.

"I've been professional," she countered, though her voice betrayed her.

He smiled, that devastating smile that had haunted her dreams. "Is that what we're calling it?" His hand found the small of her back, pulling her closer. "Because I have another word for what's happening between us."

When his lips finally met hers, Elena forgot every reason why this was a bad idea.`,
  },
  {
    id: 3,
    title: "Forbidden Desires",
    voice: "charlotte",
    text: `Sophia knew she should walk away. Dominic Kane was everything she'd sworn to avoid—powerful, possessive, and utterly intoxicating.

"You came back," he said, not a question. He'd known she would.

"I shouldn't have." But even as she said it, she was moving toward him, drawn by an invisible force she couldn't resist.

His hands found her waist, pulling her against the hard planes of his body. "No, you shouldn't have. But you did." His voice dropped to a whisper. "And now I'm going to show you exactly why."

The kiss was fire and possession, claiming her completely. And Sophia surrendered to every delicious moment of it.`,
  },
  {
    id: 4,
    title: "One Night in Manhattan",
    voice: "bella",
    text: `Victoria had promised herself this would be just one night. No names, no complications, just the electric chemistry that had sparked between them the moment their eyes met across the crowded gala.

But now, in James's penthouse suite with the city lights twinkling below, she realized she'd underestimated him. Underestimated this.

"Stay," he breathed against her skin, his touch leaving trails of fire wherever it wandered. "The night is young."

"I don't do this," she whispered, even as her fingers tangled in his hair.

"Neither do I." His eyes held hers, dark with promise. "But something tells me we're both about to make an exception."

And when he kissed her again, Victoria stopped thinking about tomorrow.`,
  },
  {
    id: 5,
    title: "Second Chance Seduction",
    voice: "rachel",
    text: `Five years. Five years since she'd last seen him, and now here he was, standing in her office like no time had passed at all.

"Hello, sweetheart," Marcus said, that familiar smirk playing on his lips. "Miss me?"

"You have some nerve," she managed, though her traitorous heart was racing.

He closed the distance between them slowly, deliberately, giving her every chance to retreat. She didn't.

"I never stopped thinking about you," he confessed, his voice rough with emotion. "Not for a single day."

When he cupped her face in his hands, she saw the truth in his eyes. The same longing she'd tried so hard to bury.

"Then show me," she whispered. "Show me you mean it."

And he did.`,
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
  console.log("🎙️ Starting VIP Story Audio Generation...\n");

  const results: { id: number; title: string; audioUrl: string }[] = [];

  for (const story of STORY_SAMPLES) {
    console.log(`📖 Generating audio for: "${story.title}"...`);

    try {
      const voiceId = VOICES[story.voice as keyof typeof VOICES];
      const audioBuffer = await generateAudio(story.text, voiceId);

      // Upload to S3
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `audio/vip-stories/story-${story.id}-${timestamp}-${randomSuffix}.mp3`;

      const { url } = await storagePut(fileKey, audioBuffer, "audio/mpeg");

      results.push({
        id: story.id,
        title: story.title,
        audioUrl: url,
      });

      console.log(`   ✅ Generated: ${url}\n`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Failed to generate audio for "${story.title}":`, error);
    }
  }

  console.log("\n📊 Summary:");
  console.log("=".repeat(50));
  results.forEach((r) => {
    console.log(`Story ${r.id}: ${r.title}`);
    console.log(`   URL: ${r.audioUrl}`);
  });

  // Output SQL update statements
  console.log("\n📝 SQL Update Statements:");
  console.log("=".repeat(50));
  results.forEach((r) => {
    console.log(`UPDATE steamy_stories SET audioUrl = '${r.audioUrl}' WHERE id = ${r.id};`);
  });

  console.log("\n✨ Audio generation complete!");
}

main().catch(console.error);
