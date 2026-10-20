import { describe, expect, it } from "vitest";
import { CHARACTER_VOICE_MAPPINGS } from "./_core/audioService";

describe("character voices", () => {
  it("names the Executive Assistant leads Sarah Shah and Michael Hastings", () => {
    const names = CHARACTER_VOICE_MAPPINGS.filter(
      (voice) => voice.bookTitle === "The Billionaire's Executive Assistant",
    ).map((voice) => voice.characterName);
    expect(names).toEqual(["Sarah Shah", "Michael Hastings"]);
    expect(names.join(" ")).not.toMatch(/Chen/);
  });
});
