import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { GOLD, GOLD_SOFT, INK, TEXT, TEXT_SOFT } from "./tokens";

type Props = {
  src: string;
  /** Caption shown above the controls — usually the chapter title. */
  caption: string;
  /** Visible duration label, e.g. "2:14". */
  durationLabel?: string;
  /** Direct download URL exposed to keyboard / SR users. */
  downloadHref?: string;
};

/**
 * Lazy-loaded audio sample player. Uses preload="none" so the audio file
 * does not block first paint. Exposes a download link for accessibility +
 * users on locked-down browsers that block media.
 */
export function AudioSamplePlayer({ src, caption, durationLabel, downloadHref }: Props) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div
      className="rounded-[10px] p-6"
      style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${GOLD_SOFT}` }}
    >
      <div
        className="font-inter text-[11px] font-semibold uppercase mb-3"
        style={{ color: GOLD, letterSpacing: "0.32em" }}
      >
        {caption}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause sample" : "Play sample"}
          className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
          style={{
            background: GOLD,
            color: INK,
            width: 48,
            height: 48,
            borderRadius: 999,
          }}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-[1px]" />}
        </button>

        <div className="flex-1">
          <div
            className="relative h-[3px] w-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
            role="progressbar"
            aria-label="Audio sample playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${progress * 100}%`,
                background: GOLD,
                transition: "width 120ms linear",
              }}
            />
          </div>
          <div
            className="font-cormorant italic text-[14px] mt-2"
            style={{ color: TEXT_SOFT }}
          >
            {durationLabel ?? "Sample"} · listen with headphones
          </div>
        </div>
      </div>

      <audio ref={ref} src={src} preload="none" controls={false} />

      <div className="mt-4 text-[12px]" style={{ color: TEXT }}>
        <a
          href={downloadHref ?? src}
          download
          className="font-inter no-underline"
          style={{ color: GOLD, letterSpacing: "0.16em" }}
        >
          Download sample (MP3)
        </a>
      </div>
    </div>
  );
}
