import { GOLD } from "./tokens";

type Props = {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  color?: string;
  className?: string;
};

export function Eyebrow({ children, align = "left", color = GOLD, className = "" }: Props) {
  return (
    <div
      className={`font-inter text-[11px] font-semibold uppercase ${className}`}
      style={{ color, letterSpacing: "0.34em", textAlign: align }}
    >
      {children}
    </div>
  );
}
