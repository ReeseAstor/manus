/**
 * Lightweight bot detection for public newsletter signup forms.
 *
 * Signals (any one is enough to silently drop the signup):
 *  - honeypot: the hidden `company_website` field has a value. Real people
 *    never see that field; form-filling bots do.
 *  - too_fast: the form was submitted less than MIN_FORM_FILL_MS after it
 *    rendered. Both timestamps come from the browser's clock, so client/server
 *    clock skew can't cause false positives.
 *  - dotted_gmail: a gmail.com / googlemail.com address whose local part
 *    (before any +tag) contains 3 or more dots. Gmail ignores dots, and bots
 *    use heavily dotted variants (e.g. e.van.s.r.ebecca1.10@gmail.com) to
 *    sign strangers up in bulk.
 *
 * All fields are optional so older callers keep working unchanged.
 */

export const HONEYPOT_FIELD = "company_website" as const;
export const MIN_FORM_FILL_MS = 2000;
export const MAX_GMAIL_LOCAL_DOTS = 2;

export type BotSignupReason = "honeypot" | "too_fast" | "dotted_gmail";

export interface BotGuardInput {
  email: string;
  company_website?: string;
  formRenderedAt?: number;
  formSubmittedAt?: number;
}

export function isDottedGmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 1) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  const local = email.slice(0, at).split("+")[0];
  const dots = (local.match(/\./g) || []).length;
  return dots > MAX_GMAIL_LOCAL_DOTS;
}

export function detectBotSignup(
  input: BotGuardInput,
  now: number = Date.now()
): BotSignupReason | null {
  if (input.company_website && input.company_website.trim() !== "") {
    return "honeypot";
  }

  if (typeof input.formRenderedAt === "number" && Number.isFinite(input.formRenderedAt)) {
    const submittedAt =
      typeof input.formSubmittedAt === "number" && Number.isFinite(input.formSubmittedAt)
        ? input.formSubmittedAt
        : now;
    const elapsed = submittedAt - input.formRenderedAt;
    if (elapsed < MIN_FORM_FILL_MS) {
      return "too_fast";
    }
  }

  if (isDottedGmail(input.email)) {
    return "dotted_gmail";
  }

  return null;
}
