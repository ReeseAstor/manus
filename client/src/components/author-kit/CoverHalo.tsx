import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GOLD, GOLD_SOFT, TEXT } from "./tokens";

type Props = {
  /** Cover image URL. When missing (or when it fails to load) a typographic placeholder is shown. */
  src?: string | null;
  /** Title shown on the placeholder. */
  title?: string;
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
export function CoverHalo({ src, title, alt, width = 280, className = "" }: Props) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
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
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          width={width}
          height={Math.round(width * 1.5)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="relative block"
          style={{
            width: "100%",
            height: "auto",
            boxShadow: "0 22px 48px rgba(74, 59, 58, 0.55)",
            border: `1px solid ${GOLD}33`,
            zIndex: 1,
          }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="relative flex items-center justify-center text-center font-display italic"
          style={{
            width: "100%",
            aspectRatio: "2 / 3",
            background: "#FAF7F7",
            color: TEXT,
            padding: "12%",
            fontSize: Math.max(14, Math.round(width * 0.075)),
            lineHeight: 1.3,
            boxShadow: "0 22px 48px rgba(74, 59, 58, 0.55)",
            border: `1px solid ${GOLD}33`,
            zIndex: 1,
          }}
        >
          {title ?? ""}
        </div>
      )}
    </div>
  );
}
