/**
 * KIE API Service Layer
 * Unified service for interacting with KIE.ai API endpoints:
 * - Nano Banana Pro (image generation)
 * - Kling 3.0 (video generation)
 * - Suno (music generation)
 * - Gemini (LLM chat completions)
 * - Credits & task polling
 */

const KIE_BASE_URL = "https://api.kie.ai";
const CREATE_TASK_URL = `${KIE_BASE_URL}/api/v1/jobs/createTask`;
const RECORD_INFO_URL = `${KIE_BASE_URL}/api/v1/jobs/recordInfo`;
const CREDIT_URL = `${KIE_BASE_URL}/api/v1/chat/credit`;
const SUNO_GENERATE_URL = `${KIE_BASE_URL}/api/v1/generate`;
const SUNO_RECORD_INFO_URL = `${KIE_BASE_URL}/api/v1/generate/record-info`;

// Gemini chat completions endpoints (OpenAI-compatible)
const GEMINI_URLS: Record<string, string> = {
  "gemini-3-pro": `${KIE_BASE_URL}/gemini-3-pro/v1/chat/completions`,
  "gemini-3-flash": `${KIE_BASE_URL}/gemini-3-flash/v1/chat/completions`,
  "gemini-2.5-pro": `${KIE_BASE_URL}/gemini-2.5-pro/v1/chat/completions`,
  "gemini-2.5-flash": `${KIE_BASE_URL}/gemini-2.5-flash/v1/chat/completions`,
};

// ─── Types ────────────────────────────────────────────────────────────────

export type TaskState = "waiting" | "queuing" | "generating" | "success" | "fail";

export interface TaskRecord {
  taskId: string;
  model: string;
  state: TaskState;
  param?: string;
  resultJson?: string;
  failCode?: string | null;
  failMsg?: string | null;
  costTime?: number;
  completeTime?: number;
  createTime?: number;
}

export interface KieResponse<T = any> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
}

export type NanoBananaResolution = "1k" | "2k" | "4k";
export type NanoBananaFormat = "png" | "jpg" | "webp";
export type NanoBananaAspectRatio =
  | "1:1" | "3:4" | "4:3" | "9:16" | "16:9"
  | "2:3" | "3:2" | "1:2" | "2:1";

export interface ImageGenerateInput {
  prompt: string;
  aspectRatio?: NanoBananaAspectRatio;
  resolution?: NanoBananaResolution;
  outputFormat?: NanoBananaFormat;
  imageUrls?: string[]; // reference images
}

export interface VideoGenerateInput {
  prompt: string;
  mode?: "single" | "multi";
  aspectRatio?: string;
  duration?: number;
  withAudio?: boolean;
  firstFrameUrl?: string;
  lastFrameUrl?: string;
}

export type SunoModel = "V4" | "V4_5" | "V4_5PLUS" | "V4_5ALL" | "V5";

export interface MusicGenerateInput {
  prompt: string;
  customMode?: boolean;
  instrumental?: boolean;
  model?: SunoModel;
  style?: string;
  title?: string;
  negativeTags?: string;
  vocalGender?: "m" | "f";
}

export type GeminiModel = "gemini-3-pro" | "gemini-3-flash" | "gemini-2.5-pro" | "gemini-2.5-flash";

export interface GeminiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GeminiChatInput {
  model?: GeminiModel;
  messages: GeminiMessage[];
  temperature?: number;
  maxTokens?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.KIE_API_KEY;
  if (!key) throw new Error("KIE_API_KEY environment variable is not set");
  return key;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

async function kiePost<T = any>(url: string, body: any): Promise<KieResponse<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("KIE API rate limited (429). Try again shortly.");
  if (res.status >= 500) throw new Error(`KIE API server error (${res.status})`);
  const json = await res.json() as KieResponse<T>;
  if (json.code !== 200) {
    throw new Error(`KIE API error ${json.code}: ${json.msg || json.message || "Unknown error"}`);
  }
  return json;
}

async function kieGet<T = any>(url: string): Promise<KieResponse<T>> {
  const res = await fetch(url, { headers: headers() });
  if (res.status === 429) throw new Error("KIE API rate limited (429). Try again shortly.");
  if (res.status >= 500) throw new Error(`KIE API server error (${res.status})`);
  const json = await res.json() as KieResponse<T>;
  if (json.code !== 200) {
    throw new Error(`KIE API error ${json.code}: ${json.msg || json.message || "Unknown error"}`);
  }
  return json;
}

// ─── Credits ──────────────────────────────────────────────────────────────

export async function getCredits(): Promise<number> {
  const res = await kieGet<number>(CREDIT_URL);
  return res.data;
}

// ─── Task Polling ─────────────────────────────────────────────────────────

export async function getTaskStatus(taskId: string): Promise<TaskRecord> {
  const res = await kieGet<TaskRecord>(`${RECORD_INFO_URL}?taskId=${encodeURIComponent(taskId)}`);
  return res.data;
}

export function parseResultUrls(resultJson: string): string[] {
  try {
    const parsed = JSON.parse(resultJson);
    return parsed.resultUrls || [];
  } catch {
    return [];
  }
}

// ─── Image Generation (Nano Banana Pro) ───────────────────────────────────

export async function generateImage(input: ImageGenerateInput): Promise<{ taskId: string }> {
  const payload = {
    model: "nano-banana-pro",
    input: {
      prompt: input.prompt,
      aspect_ratio: input.aspectRatio || "1:1",
      resolution: input.resolution || "2k",
      output_format: input.outputFormat || "png",
      image_input: input.imageUrls || [],
    },
  };
  const res = await kiePost<{ taskId: string }>(CREATE_TASK_URL, payload);
  return res.data;
}

// ─── Image Generation (Nano Banana 2) ─────────────────────────────────────

export async function generateImageV2(input: ImageGenerateInput & { webSearch?: boolean }): Promise<{ taskId: string }> {
  const payload = {
    model: "nano-banana-2",
    input: {
      prompt: input.prompt,
      aspect_ratio: input.aspectRatio || "1:1",
      resolution: input.resolution || "2k",
      output_format: input.outputFormat || "png",
      image_input: input.imageUrls || [],
      ...(input.webSearch !== undefined ? { web_search: input.webSearch } : {}),
    },
  };
  const res = await kiePost<{ taskId: string }>(CREATE_TASK_URL, payload);
  return res.data;
}

// ─── Grid Generation (multiple images in one prompt) ──────────────────────

export async function generateImageGrid(
  prompt: string,
  gridSize: "2x2" | "3x3",
  aspectRatio: NanoBananaAspectRatio = "1:1",
  resolution: NanoBananaResolution = "2k",
): Promise<{ taskId: string }> {
  // For grid generation, we modify the prompt to instruct the model
  const gridPrompt = gridSize === "2x2"
    ? `Create a 2x2 grid of 4 images. ${prompt}`
    : `Create a 3x3 grid of 9 images. ${prompt}`;

  return generateImage({
    prompt: gridPrompt,
    aspectRatio,
    resolution,
    outputFormat: "png",
  });
}

// ─── Video Generation (Kling 3.0) ─────────────────────────────────────────

export async function generateVideo(input: VideoGenerateInput): Promise<{ taskId: string }> {
  const payloadInput: any = {
    prompt: input.prompt,
    mode: input.mode || "single",
  };
  if (input.aspectRatio) payloadInput.aspect_ratio = input.aspectRatio;
  if (input.duration) payloadInput.duration = input.duration;
  if (input.withAudio !== undefined) payloadInput.with_audio = input.withAudio;
  if (input.firstFrameUrl) payloadInput.first_frame_url = input.firstFrameUrl;
  if (input.lastFrameUrl) payloadInput.last_frame_url = input.lastFrameUrl;

  const payload = {
    model: "kling-3.0/video",
    input: payloadInput,
  };
  const res = await kiePost<{ taskId: string }>(CREATE_TASK_URL, payload);
  return res.data;
}

// ─── Music Generation (Suno) ──────────────────────────────────────────────

export interface SunoTaskResult {
  taskId: string;
}

export async function generateMusic(input: MusicGenerateInput): Promise<SunoTaskResult> {
  const payload: any = {
    prompt: input.prompt,
    customMode: input.customMode ?? false,
    instrumental: input.instrumental ?? false,
    model: input.model || "V4_5",
    callBackUrl: "https://example.com/kie-suno-callback",
  };
  if (input.style) payload.style = input.style;
  if (input.title) payload.title = input.title;
  if (input.negativeTags) payload.negativeTags = input.negativeTags;
  if (input.vocalGender) payload.vocalGender = input.vocalGender;

  const res = await kiePost<{ taskId: string }>(SUNO_GENERATE_URL, payload);
  return res.data;
}

export async function getSunoTaskStatus(taskId: string): Promise<any> {
  const res = await fetch(`${SUNO_RECORD_INFO_URL}?taskId=${encodeURIComponent(taskId)}`, {
    headers: headers(),
  });
  const json = await res.json();
  return json;
}

// ─── LLM Chat (Gemini) ───────────────────────────────────────────────────

export async function geminiChat(input: GeminiChatInput): Promise<string> {
  const model = input.model || "gemini-3-flash";
  const url = GEMINI_URLS[model];
  if (!url) throw new Error(`Unknown Gemini model: ${model}`);

  const body: any = {
    model,
    messages: input.messages,
  };
  if (input.temperature !== undefined) body.temperature = input.temperature;
  if (input.maxTokens !== undefined) body.max_tokens = input.maxTokens;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (res.status === 429) throw new Error("KIE Gemini rate limited (429).");
  if (res.status >= 500) throw new Error(`KIE Gemini server error (${res.status})`);

  const json = await res.json() as any;
  if (json.error) {
    throw new Error(`Gemini error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in Gemini response");
  return content;
}

// ─── Model Constants (for UI dropdowns) ───────────────────────────────────

export const IMAGE_MODELS = [
  { id: "nano-banana-pro", name: "Nano Banana Pro", description: "Google Gemini 3 Pro Image - 2K/4K, text rendering, character consistency" },
  { id: "nano-banana-2", name: "Nano Banana 2", description: "Gemini 3.1 Flash Image - Fast with Pro-level quality" },
] as const;

export const VIDEO_MODELS = [
  { id: "kling-3.0/video", name: "Kling 3.0", description: "Single/multi-shot video, native audio, up to 15s" },
] as const;

export const MUSIC_MODELS = [
  { id: "V4", name: "Suno V4", description: "Standard quality" },
  { id: "V4_5", name: "Suno V4.5", description: "Improved quality (recommended)" },
  { id: "V4_5PLUS", name: "Suno V4.5+", description: "Enhanced quality" },
  { id: "V4_5ALL", name: "Suno V4.5 All", description: "All styles" },
  { id: "V5", name: "Suno V5", description: "Latest model" },
] as const;

export const LLM_MODELS = [
  { id: "gemini-3-pro", name: "Gemini 3 Pro", description: "Most capable, best for complex tasks" },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", description: "Fast and efficient" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Previous gen, stable" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Previous gen, fast" },
] as const;

export const ASPECT_RATIOS = [
  "1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "1:2", "2:1",
] as const;

export const RESOLUTIONS = ["1k", "2k", "4k"] as const;
