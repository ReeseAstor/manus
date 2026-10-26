import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  storyId?: number;
  onDownload?: () => void;
  canDownload?: boolean;
  showSpeedControl?: boolean;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  title,
  storyId,
  onDownload,
  canDownload = false,
  showSpeedControl = true,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastReportAt = useRef(0);
  const reportProgress = trpc.vip.updatePlayProgress.useMutation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const sendProgress = (completed: boolean) => {
      if (!storyId) return;
      const progress = Math.min(6 * 60 * 60, Math.max(0, Math.floor(audio.currentTime)));
      lastReportAt.current = Date.now();
      reportProgress.mutate({ storyId, progress, completed });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (!audio.paused && Date.now() - lastReportAt.current >= 30_000) {
        sendProgress(false);
      }
    };

    const handlePause = () => {
      if (audio.currentTime > 0 && !audio.ended) sendProgress(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      sendProgress(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioUrl, storyId]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (speed: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSpeed = parseFloat(speed);
    audio.playbackRate = newSpeed;
    setPlaybackRate(newSpeed);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-gradient-to-r from-[#C9A3A0]/20 to-[#C9A3A0]/10 border border-[#C9A3A0]/30 rounded-xl p-4 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      {title && (
        <div className="mb-3 text-[#7A4F4C] font-medium text-sm truncate">
          🎧 {title}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-[#7A4F4C]/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Play controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            className="h-8 w-8 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
            disabled={isLoading}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            className="h-8 w-8 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
            disabled={isLoading}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: Speed control */}
        {showSpeedControl && (
          <Select value={playbackRate.toString()} onValueChange={handleSpeedChange}>
            <SelectTrigger className="w-20 h-8 text-xs bg-transparent border-[#C9A3A0]/30 text-[#7A4F4C]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Right: Volume and Download */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-16"
          />

          {canDownload && onDownload && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              className="h-8 w-8 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for inline use
export function CompactAudioPlayer({
  audioUrl,
  className = "",
}: {
  audioUrl: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="h-8 w-8 text-[#7A4F4C] hover:text-[#7A4F4C] hover:bg-[#7A4F4C]/20 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1 h-1 bg-[#7A4F4C]/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
