import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set env before importing
process.env.KIE_API_KEY = "test-kie-api-key-123";

import {
  getCredits,
  getTaskStatus,
  parseResultUrls,
  generateImage,
  generateImageV2,
  generateImageGrid,
  generateVideo,
  generateMusic,
  getSunoTaskStatus,
  geminiChat,
  IMAGE_MODELS,
  VIDEO_MODELS,
  MUSIC_MODELS,
  LLM_MODELS,
  ASPECT_RATIOS,
  RESOLUTIONS,
} from "./kie-service";

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── Helper ───────────────────────────────────────────────────────────────

function mockKieResponse(data: any, code = 200) {
  return {
    status: 200,
    json: async () => ({ code, data, msg: code === 200 ? "ok" : "error" }),
  };
}

// ─── Credits ──────────────────────────────────────────────────────────────

describe("getCredits", () => {
  it("returns credit balance from KIE API", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse(2536.5));
    const credits = await getCredits();
    expect(credits).toBe(2536.5);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.kie.ai/api/v1/chat/credit",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-kie-api-key-123",
        }),
      })
    );
  });

  it("throws on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ code: 401, msg: "Unauthorized" }),
    });
    await expect(getCredits()).rejects.toThrow("KIE API error 401: Unauthorized");
  });

  it("throws on rate limit", async () => {
    mockFetch.mockResolvedValueOnce({ status: 429 });
    await expect(getCredits()).rejects.toThrow("rate limited");
  });

  it("throws on server error", async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    await expect(getCredits()).rejects.toThrow("server error");
  });
});

// ─── Task Status ──────────────────────────────────────────────────────────

describe("getTaskStatus", () => {
  it("fetches task status by ID", async () => {
    const taskData = { taskId: "abc123", model: "nano-banana-pro", state: "success", resultJson: '{"resultUrls":["https://example.com/img.png"]}' };
    mockFetch.mockResolvedValueOnce(mockKieResponse(taskData));
    const result = await getTaskStatus("abc123");
    expect(result.taskId).toBe("abc123");
    expect(result.state).toBe("success");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=abc123",
      expect.any(Object)
    );
  });
});

describe("parseResultUrls", () => {
  it("parses result URLs from JSON", () => {
    const urls = parseResultUrls('{"resultUrls":["https://a.com/1.png","https://a.com/2.png"]}');
    expect(urls).toEqual(["https://a.com/1.png", "https://a.com/2.png"]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseResultUrls("invalid")).toEqual([]);
  });

  it("returns empty array for missing resultUrls", () => {
    expect(parseResultUrls('{"other":"data"}')).toEqual([]);
  });
});

// ─── Image Generation ─────────────────────────────────────────────────────

describe("generateImage", () => {
  it("creates a Nano Banana Pro task with correct payload", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "img-task-1" }));
    const result = await generateImage({ prompt: "A romantic sunset" });
    expect(result.taskId).toBe("img-task-1");

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.kie.ai/api/v1/jobs/createTask");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("nano-banana-pro");
    expect(body.input.prompt).toBe("A romantic sunset");
    expect(body.input.aspect_ratio).toBe("1:1");
    expect(body.input.resolution).toBe("2k");
    expect(body.input.output_format).toBe("png");
    expect(body.input.image_input).toEqual([]);
  });

  it("passes custom options", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "img-task-2" }));
    await generateImage({
      prompt: "test",
      aspectRatio: "16:9",
      resolution: "4k",
      outputFormat: "jpg",
      imageUrls: ["https://ref.com/img.jpg"],
    });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input.aspect_ratio).toBe("16:9");
    expect(body.input.resolution).toBe("4k");
    expect(body.input.output_format).toBe("jpg");
    expect(body.input.image_input).toEqual(["https://ref.com/img.jpg"]);
  });
});

describe("generateImageV2", () => {
  it("creates a Nano Banana 2 task", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "img-v2-1" }));
    const result = await generateImageV2({ prompt: "test", webSearch: true });
    expect(result.taskId).toBe("img-v2-1");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe("nano-banana-2");
    expect(body.input.web_search).toBe(true);
  });
});

describe("generateImageGrid", () => {
  it("creates a 2x2 grid task", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "grid-1" }));
    const result = await generateImageGrid("book covers", "2x2");
    expect(result.taskId).toBe("grid-1");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input.prompt).toContain("2x2 grid");
    expect(body.input.prompt).toContain("book covers");
  });

  it("creates a 3x3 grid task", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "grid-2" }));
    await generateImageGrid("social media", "3x3", "16:9", "4k");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input.prompt).toContain("3x3 grid");
    expect(body.input.aspect_ratio).toBe("16:9");
    expect(body.input.resolution).toBe("4k");
  });
});

// ─── Video Generation ─────────────────────────────────────────────────────

describe("generateVideo", () => {
  it("creates a Kling 3.0 video task", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "vid-1" }));
    const result = await generateVideo({ prompt: "A book trailer scene" });
    expect(result.taskId).toBe("vid-1");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe("kling-3.0/video");
    expect(body.input.prompt).toBe("A book trailer scene");
    expect(body.input.mode).toBe("single");
  });

  it("passes optional video parameters", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "vid-2" }));
    await generateVideo({
      prompt: "test",
      mode: "multi",
      aspectRatio: "9:16",
      duration: 10,
      withAudio: true,
      firstFrameUrl: "https://frame.com/1.jpg",
    });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.input.mode).toBe("multi");
    expect(body.input.aspect_ratio).toBe("9:16");
    expect(body.input.duration).toBe(10);
    expect(body.input.with_audio).toBe(true);
    expect(body.input.first_frame_url).toBe("https://frame.com/1.jpg");
  });
});

// ─── Music Generation ─────────────────────────────────────────────────────

describe("generateMusic", () => {
  it("creates a Suno music task with defaults", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "music-1" }));
    const result = await generateMusic({ prompt: "upbeat jazz" });
    expect(result.taskId).toBe("music-1");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.prompt).toBe("upbeat jazz");
    expect(body.customMode).toBe(false);
    expect(body.instrumental).toBe(false);
    expect(body.model).toBe("V4_5");
  });

  it("sends custom mode parameters", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse({ taskId: "music-2" }));
    await generateMusic({
      prompt: "lyrics here",
      customMode: true,
      instrumental: false,
      model: "V5",
      style: "Pop",
      title: "My Song",
      vocalGender: "f",
    });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.customMode).toBe(true);
    expect(body.model).toBe("V5");
    expect(body.style).toBe("Pop");
    expect(body.title).toBe("My Song");
    expect(body.vocalGender).toBe("f");
  });
});

describe("getSunoTaskStatus", () => {
  it("fetches Suno task status", async () => {
    const sunoData = { data: { status: "SUCCESS", response: { sunoData: [] } } };
    mockFetch.mockResolvedValueOnce({ status: 200, json: async () => sunoData });
    const result = await getSunoTaskStatus("suno-123");
    expect(result.data.status).toBe("SUCCESS");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.kie.ai/api/v1/generate/record-info?taskId=suno-123",
      expect.any(Object)
    );
  });
});

// ─── LLM Chat ─────────────────────────────────────────────────────────────

describe("geminiChat", () => {
  it("sends chat completion request to correct Gemini endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ choices: [{ message: { content: "Here's a subject line idea..." } }] }),
    });
    const content = await geminiChat({
      model: "gemini-3-flash",
      messages: [{ role: "user", content: "Write a newsletter subject line" }],
    });
    expect(content).toBe("Here's a subject line idea...");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.kie.ai/gemini-3-flash/v1/chat/completions",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("passes temperature and maxTokens", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ choices: [{ message: { content: "response" } }] }),
    });
    await geminiChat({
      model: "gemini-3-pro",
      messages: [{ role: "user", content: "test" }],
      temperature: 0.7,
      maxTokens: 1000,
    });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.temperature).toBe(0.7);
    expect(body.max_tokens).toBe(1000);
    expect(body.model).toBe("gemini-3-pro");
  });

  it("throws on unknown model", async () => {
    await expect(geminiChat({
      model: "unknown-model" as any,
      messages: [{ role: "user", content: "test" }],
    })).rejects.toThrow("Unknown Gemini model");
  });

  it("throws on empty response", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ choices: [] }),
    });
    await expect(geminiChat({
      messages: [{ role: "user", content: "test" }],
    })).rejects.toThrow("No content");
  });
});

// ─── Constants ────────────────────────────────────────────────────────────

describe("model constants", () => {
  it("exports correct image models", () => {
    expect(IMAGE_MODELS).toHaveLength(2);
    expect(IMAGE_MODELS[0].id).toBe("nano-banana-pro");
    expect(IMAGE_MODELS[1].id).toBe("nano-banana-2");
  });

  it("exports correct video models", () => {
    expect(VIDEO_MODELS).toHaveLength(1);
    expect(VIDEO_MODELS[0].id).toBe("kling-3.0/video");
  });

  it("exports correct music models", () => {
    expect(MUSIC_MODELS.length).toBeGreaterThanOrEqual(4);
    expect(MUSIC_MODELS.map(m => m.id)).toContain("V4_5");
  });

  it("exports correct LLM models", () => {
    expect(LLM_MODELS.length).toBe(4);
    expect(LLM_MODELS.map(m => m.id)).toContain("gemini-3-pro");
    expect(LLM_MODELS.map(m => m.id)).toContain("gemini-3-flash");
  });

  it("exports aspect ratios and resolutions", () => {
    expect(ASPECT_RATIOS).toContain("1:1");
    expect(ASPECT_RATIOS).toContain("16:9");
    expect(RESOLUTIONS).toContain("2k");
  });
});

// ─── API Key ──────────────────────────────────────────────────────────────

describe("API key handling", () => {
  it("includes Authorization header in all requests", async () => {
    mockFetch.mockResolvedValueOnce(mockKieResponse(100));
    await getCredits();
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer test-kie-api-key-123");
  });
});
