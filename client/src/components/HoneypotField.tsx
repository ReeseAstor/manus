/**
 * Hidden honeypot input for public signup forms.
 *
 * Moved off-screen (not display:none, which many bots skip) and hidden from
 * assistive tech and keyboard navigation, so real readers never fill it in.
 * Any value in it tells the server the submission came from a bot.
 */
export const HONEYPOT_FIELD_NAME = "company_website";

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD_NAME}>Company website</label>
      <input
        type="text"
        id={HONEYPOT_FIELD_NAME}
        name={HONEYPOT_FIELD_NAME}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </div>
  );
}
