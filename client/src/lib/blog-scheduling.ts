export type BlogSaveAction = "draft" | "scheduled" | "published";

/** datetime-local uses the operator's timezone, not UTC. */
export function localScheduleInput(value: Date | string | null): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (!Number.isFinite(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function resolveBlogSchedule(
  localValue: string,
  action: BlogSaveAction,
  original: string | null,
  now = Date.now()
):
  | { ok: true; scheduledPublishAt: string | null | undefined }
  | { ok: false; error: string } {
  if (action === "published") return { ok: true, scheduledPublishAt: null };
  if (!localValue) {
    return action === "scheduled"
      ? {
          ok: false,
          error:
            "Choose a future date and time before saving a scheduled draft.",
        }
      : { ok: true, scheduledPublishAt: null };
  }

  const unchanged =
    original !== null && localValue === localScheduleInput(original);
  // Omit unchanged values on update: don't round seconds/milliseconds away or
  // reschedule an already-due blocked draft while its content is being fixed.
  if (unchanged && action === "draft") {
    return { ok: true, scheduledPublishAt: undefined };
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localValue)) {
    return { ok: false, error: "Enter a valid local date and time." };
  }
  const date = new Date(localValue);
  if (
    !Number.isFinite(date.getTime()) ||
    localScheduleInput(date) !== localValue
  ) {
    return {
      ok: false,
      error:
        "Enter a valid local date and time (check daylight-saving changes).",
    };
  }
  const exactDate = unchanged ? new Date(original!) : date;
  if (exactDate.getTime() <= now) {
    return {
      ok: false,
      error:
        "Choose a future date and time. To keep an existing due schedule unchanged, use Save as Draft.",
    };
  }
  return {
    ok: true,
    scheduledPublishAt: unchanged ? undefined : date.toISOString(),
  };
}
