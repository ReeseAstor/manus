import { useReducedMotion } from "framer-motion";
import { GOLD, GOLD_SOFT } from "./tokens";

type Props = {
  src: string;
  alt: string;
  /** Width in px. Cover height is computed at 3:2 aspect. */
  width?: number;
  className?: string;
};

/**
 * The Reese Astor signature cover treatment. A gold radial halo sits behind
 * the cover via ::before / pseudo-element-equivalent (here a positioned div),
 * not a Photoshop effect. Respects prefers-reduced-motion: when reduced, the
 * halo is static; otherwise it pulses subtly.
 */
export function CoverHalo({ src, alt, width = 280, className = "" }: Props) {
  const reduce = useReducedMotion();
  const haloSize = width * 1.55;
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width, padding: width * 0.18 }}
    >
      <div
        aria-hidden
        className={reduce ? "" : "kit-halo-pulse"}
        style={{
          position: "absolute",
          inset: `calc(50% - ${haloSize / 2}px)`,
          width: haloSize,
          height: haloSize,
          background: `radial-gradient(circle at center, ${GOLD_SOFT} 0%, ${GOLD}00 65%)`,
          filter: "blur(6px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={Math.round(width * 1.5)}
        loading="lazy"
        decoding="async"
        className="relative block"
        style={{
          width: "100%",
          height: "auto",
          boxShadow: "0 22px 48px rgba(0, 0, 0, 0.55)",
          border: `1px solid ${GOLD}33`,
          zIndex: 1,
        }}
      />
    </div>
  );
}
