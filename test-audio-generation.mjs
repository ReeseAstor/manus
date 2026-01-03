/**
 * Test script to generate audio for the "Day in the Life" blog post
 * Run with: node test-audio-generation.mjs
 */

import { createCaller } from "./server/_core/trpc.js";

async function testAudioGeneration() {
  console.log("🎵 Testing ElevenLabs audio generation...\n");

  try {
    // Create a mock admin context
    const mockContext = {
      user: {
        id: 1,
        openId: "test-admin",
        name: "Admin",
        email: "admin@test.com",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      },
      req: {},
      res: {},
    };

    const caller = createCaller(mockContext);

    console.log("📝 Generating audio for 'day-in-the-life-romance-author' blog post...");
    console.log("⏳ This may take 30-60 seconds depending on content length...\n");

    const result = await caller.blog.generateAudio({
      slug: "day-in-the-life-romance-author",
    });

    if (result.success) {
      console.log("✅ Audio generated successfully!");
      console.log(`🔊 Audio URL: ${result.audioUrl}`);
      console.log("\n📌 The audio player will now appear on the blog post page.");
      console.log("🌐 Visit: https://your-domain.com/blog/day-in-the-life-romance-author");
    }
  } catch (error) {
    console.error("❌ Error generating audio:");
    console.error(error.message);
    
    if (error.message.includes("ELEVENLABS_API_KEY")) {
      console.log("\n💡 Make sure ELEVENLABS_API_KEY is set in your environment variables.");
    }
  }
}

testAudioGeneration();
