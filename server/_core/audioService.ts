import { ENV } from "./env";
import { storagePut } from "../storage";

// ============================================
// VOICE LIBRARY DEFINITIONS
// ============================================

export interface Voice {
  id: string;
  elevenLabsId: string;
  name: string;
  description: string;
  style: string;
  gender: "male" | "female" | "neutral";
  isPremium: boolean;
  previewUrl?: string;
}

// Standard voices available to all tiers
export const STANDARD_VOICES: Voice[] = [
  {
    id: "rachel",
    elevenLabsId: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Warm, intimate narrator perfect for romance",
    style: "warm",
    gender: "female",
    isPremium: false,
  },
  {
    id: "drew",
    elevenLabsId: "29vD33N1CtxCmqQRPOHJ",
    name: "Drew",
    description: "Deep, commanding voice for billionaire heroes",
    style: "commanding",
    gender: "male",
    isPremium: false,
  },
  {
    id: "bella",
    elevenLabsId: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "Soft, sensual voice for steamy scenes",
    style: "sensual",
    gender: "female",
    isPremium: false,
  },
  {
    id: "antoni",
    elevenLabsId: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    description: "Smooth, charming voice for romantic leads",
    style: "charming",
    gender: "male",
    isPremium: false,
  },
];

// Premium voices for Gold tier only
export const PREMIUM_VOICES: Voice[] = [
  {
    id: "charlotte",
    elevenLabsId: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    description: "Sultry, dramatic voice for intense scenes",
    style: "sultry",
    gender: "female",
    isPremium: true,
  },
  {
    id: "clyde",
    elevenLabsId: "2EiwWnXFnvU5JabPnv8n",
    name: "Clyde",
    description: "Gravelly, dominant voice for alpha heroes",
    style: "dominant",
    gender: "male",
    isPremium: true,
  },
  {
    id: "elli",
    elevenLabsId: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    description: "Breathy, seductive voice for intimate moments",
    style: "seductive",
    gender: "female",
    isPremium: true,
  },
  {
    id: "josh",
    elevenLabsId: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    description: "Commanding, powerful voice for CEO characters",
    style: "powerful",
    gender: "male",
    isPremium: true,
  },
];

export const ALL_VOICES = [...STANDARD_VOICES, ...PREMIUM_VOICES];

// ============================================
// CHARACTER TO VOICE MAPPING
// ============================================

export interface CharacterVoiceMapping {
  characterName: string;
  bookTitle: string;
  defaultVoiceId: string;
  premiumVoiceId: string;
}

export const CHARACTER_VOICE_MAPPINGS: CharacterVoiceMapping[] = [
  // Book 1: The Billionaire's Executive Assistant
  { characterName: "Sarah Chen", bookTitle: "The Billionaire's Executive Assistant", defaultVoiceId: "rachel", premiumVoiceId: "charlotte" },
  { characterName: "Michael Chen", bookTitle: "The Billionaire's Executive Assistant", defaultVoiceId: "drew", premiumVoiceId: "josh" },
  
  // Book 2: The Billionaire's Fake Wife
  { characterName: "Elena Kim", bookTitle: "The Billionaire's Fake Wife", defaultVoiceId: "bella", premiumVoiceId: "elli" },
  { characterName: "David Kim", bookTitle: "The Billionaire's Fake Wife", defaultVoiceId: "antoni", premiumVoiceId: "clyde" },
  
  // Book 3: The Billionaire's Baby Secret
  { characterName: "Sophia Reed", bookTitle: "The Billionaire's Baby Secret", defaultVoiceId: "rachel", premiumVoiceId: "charlotte" },
  { characterName: "Dominic Kane", bookTitle: "The Billionaire's Baby Secret", defaultVoiceId: "drew", premiumVoiceId: "josh" },
  
  // Book 0.5: The Billionaire's One Night Stand
  { characterName: "Victoria Cruz", bookTitle: "The Billionaire's One Night Stand", defaultVoiceId: "bella", premiumVoiceId: "elli" },
  { characterName: "James Chen", bookTitle: "The Billionaire's One Night Stand", defaultVoiceId: "antoni", premiumVoiceId: "clyde" },
];

// ============================================
// SUBSCRIPTION TIER LIMITS
// ============================================

export type SubscriptionTier = "free" | "bronze" | "silver" | "gold";

export interface TierLimits {
  monthlyMinutes: number;
  canDownload: boolean;
  canUsePremiumVoices: boolean;
  canUseMultiVoice: boolean;
  canMapCharacterVoices: boolean;
  priorityGeneration: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    monthlyMinutes: 10,
    canDownload: false,
    canUsePremiumVoices: false,
    canUseMultiVoice: false,
    canMapCharacterVoices: false,
    priorityGeneration: false,
  },
  bronze: {
    monthlyMinutes: 60,
    canDownload: true,
    canUsePremiumVoices: false,
    canUseMultiVoice: false,
    canMapCharacterVoices: false,
    priorityGeneration: false,
  },
  silver: {
    monthlyMinutes: 180,
    canDownload: true,
    canUsePremiumVoices: false,
    canUseMultiVoice: true,
    canMapCharacterVoices: true,
    priorityGeneration: false,
  },
  gold: {
    monthlyMinutes: 999999, // Unlimited
    canDownload: true,
    canUsePremiumVoices: true,
    canUseMultiVoice: true,
    canMapCharacterVoices: true,
    priorityGeneration: true,
  },
};

// ============================================
// TEXT CHUNKING FOR LONG CONTENT
// ============================================

const MAX_CHUNK_LENGTH = 4500; // ElevenLabs limit is ~5000 chars

/**
 * Split long text into chunks for audio generation
 * Tries to split at sentence boundaries for natural pauses
 */
export function chunkText(text: string): string[] {
  if (text.length <= MAX_CHUNK_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";
  
  // Split by sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > MAX_CHUNK_LENGTH) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // If single sentence is too long, split by words
      if (sentence.length > MAX_CHUNK_LENGTH) {
        const words = sentence.split(" ");
        currentChunk = "";
        for (const word of words) {
          if ((currentChunk + " " + word).length > MAX_CHUNK_LENGTH) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += " " + word;
          }
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Estimate audio duration from text length
 * Average speaking rate is ~150 words per minute
 */
export function estimateDuration(text: string): number {
  const words = text.split(/\s+/).length;
  const minutes = words / 150;
  return Math.ceil(minutes * 60); // Return seconds
}

/**
 * Estimate minutes from character count
 * ~1000 characters ≈ 1 minute of audio
 */
export function estimateMinutes(characterCount: number): number {
  return Math.ceil(characterCount / 1000);
}

// ============================================
// AUDIO GENERATION
// ============================================

export interface GenerateAudioOptions {
  text: string;
  voiceId?: string;
  userId?: string;
  storyId?: string;
  sceneId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

export interface GenerateAudioResult {
  audioUrl: string;
  durationSeconds: number;
  characterCount: number;
  voiceUsed: string;
}

/**
 * Generate audio from text using ElevenLabs
 */
export async function generateAudio(options: GenerateAudioOptions): Promise<GenerateAudioResult> {
  const apiKey = ENV.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const {
    text,
    voiceId = "bella", // Default to Bella for romance content
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0.5,
  } = options;

  // Find the voice
  const voice = ALL_VOICES.find(v => v.id === voiceId) || STANDARD_VOICES[0];
  const elevenLabsVoiceId = voice.elevenLabsId;

  // Chunk text if needed
  const chunks = chunkText(text);
  const audioBuffers: Buffer[] = [];

  for (const chunk of chunks) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: chunk,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
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
    audioBuffers.push(Buffer.from(arrayBuffer));
  }

  // Concatenate audio buffers
  const combinedBuffer = Buffer.concat(audioBuffers);
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  const fileKey = `audio/generated/${timestamp}-${randomSuffix}.mp3`;
  
  // Upload to S3
  const { url } = await storagePut(fileKey, combinedBuffer, "audio/mpeg");
  
  return {
    audioUrl: url,
    durationSeconds: estimateDuration(text),
    characterCount: text.length,
    voiceUsed: voice.id,
  };
}

// ============================================
// MULTI-VOICE SCENE GENERATION
// ============================================

export interface DialogueLine {
  speaker: string;
  text: string;
  voiceId?: string;
}

/**
 * Parse scene text to identify dialogue and narration
 * Looks for patterns like: "Text," Character said.
 */
export function parseSceneDialogue(text: string, characterVoices: Map<string, string>): DialogueLine[] {
  const lines: DialogueLine[] = [];
  
  // Regex to match dialogue patterns
  const dialoguePattern = /"([^"]+)"\s*(?:,?\s*)?(\w+)?\s*(?:said|whispered|murmured|growled|asked|replied|breathed|moaned)?/gi;
  
  let lastIndex = 0;
  let match;
  
  while ((match = dialoguePattern.exec(text)) !== null) {
    // Add narration before this dialogue
    if (match.index > lastIndex) {
      const narration = text.substring(lastIndex, match.index).trim();
      if (narration) {
        lines.push({
          speaker: "narrator",
          text: narration,
          voiceId: "bella", // Default narrator voice
        });
      }
    }
    
    // Add the dialogue
    const dialogueText = match[1];
    const speaker = match[2]?.toLowerCase() || "unknown";
    const voiceId = characterVoices.get(speaker) || "bella";
    
    lines.push({
      speaker,
      text: dialogueText,
      voiceId,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining narration
  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex).trim();
    if (remaining) {
      lines.push({
        speaker: "narrator",
        text: remaining,
        voiceId: "bella",
      });
    }
  }
  
  // If no dialogue found, treat entire text as narration
  if (lines.length === 0) {
    lines.push({
      speaker: "narrator",
      text,
      voiceId: "bella",
    });
  }
  
  return lines;
}

/**
 * Generate multi-voice audio for a scene
 */
export async function generateMultiVoiceAudio(
  text: string,
  characterVoices: Map<string, string>
): Promise<GenerateAudioResult> {
  const dialogueLines = parseSceneDialogue(text, characterVoices);
  const audioBuffers: Buffer[] = [];
  
  const apiKey = ENV.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  for (const line of dialogueLines) {
    const voice = ALL_VOICES.find(v => v.id === line.voiceId) || STANDARD_VOICES[0];
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.elevenLabsId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: line.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.6,
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
    audioBuffers.push(Buffer.from(arrayBuffer));
  }

  // Concatenate all audio
  const combinedBuffer = Buffer.concat(audioBuffers);
  
  // Upload to S3
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  const fileKey = `audio/multivoice/${timestamp}-${randomSuffix}.mp3`;
  
  const { url } = await storagePut(fileKey, combinedBuffer, "audio/mpeg");
  
  return {
    audioUrl: url,
    durationSeconds: estimateDuration(text),
    characterCount: text.length,
    voiceUsed: "multi-voice",
  };
}

// ============================================
// VOICE PREVIEW
// ============================================

/**
 * Generate a short voice preview sample
 */
export async function generateVoicePreview(voiceId: string): Promise<string> {
  const previewText = "She looked into his eyes, her heart racing with anticipation. 'I've been waiting for this moment,' she whispered.";
  
  const result = await generateAudio({
    text: previewText,
    voiceId,
  });
  
  return result.audioUrl;
}

// ============================================
// EXPORTS
// ============================================

export {
  generateAudio as generateSpeechAdvanced,
};
