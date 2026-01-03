import { ENV } from "./env";

/**
 * Generate audio from text using ElevenLabs Text-to-Speech API
 * 
 * @param text - The text content to convert to speech
 * @param voiceId - Optional voice ID (defaults to professional female narrator)
 * @returns Audio buffer that can be uploaded to S3
 */
export async function generateSpeech(
  text: string,
  voiceId?: string
): Promise<Buffer> {
  const apiKey = ENV.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  // Default to a professional female narrator voice
  // You can browse voices at: https://elevenlabs.io/voice-library
  const selectedVoiceId = voiceId || "EXAVITQu4vr4xnSDxMaL"; // Sarah - warm, professional female voice

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
    {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2", // Highest quality model
        voice_settings: {
          stability: 0.5, // Balance between consistency and expressiveness
          similarity_boost: 0.75, // High similarity to original voice
          style: 0.5, // Moderate style/emotion
          use_speaker_boost: true, // Enhance voice clarity
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

/**
 * Generate speech with streaming support for real-time playback
 * 
 * @param text - The text content to convert to speech
 * @param voiceId - Optional voice ID
 * @returns Readable stream of audio data
 */
export async function generateSpeechStream(
  text: string,
  voiceId?: string
): Promise<ReadableStream> {
  const apiKey = ENV.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const selectedVoiceId = voiceId || "EXAVITQu4vr4xnSDxMaL";

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}/stream`,
    {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5", // Faster model for streaming
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

  if (!response.body) {
    throw new Error("Response body is null");
  }

  return response.body;
}

/**
 * Get available voices from ElevenLabs
 * Useful for letting users choose different narrators
 */
export async function getAvailableVoices() {
  const apiKey = ENV.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  return response.json();
}
