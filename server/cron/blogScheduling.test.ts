import { afterEach, describe, expect, it } from "vitest";
import {
  localScheduleInput,
  resolveBlogSchedule,
} from "../../client/src/lib/blog-scheduling";

const previousTimezone = process.env.TZ;
afterEach(() => {
  if (previousTimezone === undefined) delete process.env.TZ;
  else process.env.TZ = previousTimezone;
});

describe("editor scheduling payloads", () => {
  it("renders stored UTC dates in local time and submits a new schedule as UTC", () => {
    process.env.TZ = "America/New_York";
    expect(localScheduleInput("2026-11-05T18:30:42.123Z")).toBe(
      "2026-11-05T13:30"
    );
    expect(
      resolveBlogSchedule("2026-11-05T13:30", "scheduled", null, 0)
    ).toEqual({
      ok: true,
      scheduledPublishAt: "2026-11-05T18:30:00.000Z",
    });
  });

  it("omits unchanged timestamps on normal draft saves, retaining precise seconds and even existing past-due schedules", () => {
    process.env.TZ = "UTC";
    const original = "2026-11-05T18:30:42.123Z";
    expect(
      resolveBlogSchedule(
        localScheduleInput(original),
        "draft",
        original,
        Date.parse("2027-01-01")
      )
    ).toEqual({
      ok: true,
      scheduledPublishAt: undefined,
    });
  });

  it("omits unchanged future timestamps on an explicit scheduling action too", () => {
    const original = "2026-11-05T18:30:42.123Z";
    expect(
      resolveBlogSchedule(
        localScheduleInput(original),
        "scheduled",
        original,
        0
      )
    ).toEqual({
      ok: true,
      scheduledPublishAt: undefined,
    });
  });

  it("requires a date for scheduling but permits unscheduled drafts and explicit removal", () => {
    expect(resolveBlogSchedule("", "scheduled", null).ok).toBe(false);
    expect(resolveBlogSchedule("", "draft", null)).toEqual({
      ok: true,
      scheduledPublishAt: null,
    });
    expect(
      resolveBlogSchedule("", "draft", "2026-11-05T18:30:00.000Z")
    ).toEqual({ ok: true, scheduledPublishAt: null });
  });

  it.each([
    "not-a-date",
    "2026-02-30T12:00",
    "2026-13-05T12:00",
    "2026-11-05",
    "2026-11-05T25:00",
  ])("rejects invalid schedules: %s", value =>
    expect(resolveBlogSchedule(value, "scheduled", null, 0).ok).toBe(false)
  );

  it("rejects nonexistent local times during daylight-saving transitions", () => {
    process.env.TZ = "America/New_York";
    expect(
      resolveBlogSchedule("2027-03-14T02:30", "scheduled", null, 0).ok
    ).toBe(false);
  });

  it("rejects past/equal new schedules, including schedules entered while saving a draft", () => {
    process.env.TZ = "UTC";
    const now = Date.parse("2026-11-05T13:30:00.000Z");
    expect(
      resolveBlogSchedule("2026-11-05T13:30", "scheduled", null, now).ok
    ).toBe(false);
    expect(resolveBlogSchedule("2026-11-05T13:29", "draft", null, now).ok).toBe(
      false
    );
    expect(
      resolveBlogSchedule(
        "2026-11-05T13:29",
        "scheduled",
        "2026-11-05T13:29:22.000Z",
        now
      ).ok
    ).toBe(false);
  });

  it("publish now always clears scheduling, even when the input was invalid", () => {
    expect(
      resolveBlogSchedule("invalid", "published", "2026-11-05T18:30:00.000Z")
    ).toEqual({
      ok: true,
      scheduledPublishAt: null,
    });
  });

  it("returns an empty editor value for missing or invalid stored dates", () => {
    expect(localScheduleInput(null)).toBe("");
    expect(localScheduleInput("invalid")).toBe("");
  });
});
