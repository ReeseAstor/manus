import { Link } from "wouter";
import { GOLD, INK, RULE_SOFT, TEXT } from "./tokens";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
};

export function RAButton({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  onClick,
  className = "",
}: Props) {
  const base = {
    primary: { background: GOLD,         color: INK,  border: `1px solid ${GOLD}` },
    outline: { background: "transparent", color: GOLD, border: `1px solid ${GOLD}` },
    ghost:   { background: "transparent", color: TEXT, border: `1px solid ${RULE_SOFT}` },
  }[variant];
  const sz = size === "lg" ? { padding: "16px 34px", fontSize: 12 } : { padding: "11px 22px", fontSize: 11 };
  const style: React.CSSProperties = {
    ...base, ...sz,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    borderRadius: 0,
    fontWeight: 600, letterSpacing: "0.24em",
    textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
    transition: "all 240ms cubic-bezier(0.65,0.05,0.36,1)",
    position: "relative",
    overflow: "hidden",
  };
  const hoverClass = "hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(201,166,70,0.22)] active:translate-y-[0px] active:scale-[0.98]";

  const cls = `font-inter inline-flex ${hoverClass} ${className}`;

  if (href) {
    if (external || /^https?:/i.test(href)) {
      return (
        <a href={href} style={style} className={cls} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href}>
        <span style={style} className={cls} onClick={onClick}>
          {children}
        </span>
      </Link>
    );
  }
  return (
    <button style={style} className={cls} onClick={onClick} type="button">
      {children}
    </button>
  );
}
