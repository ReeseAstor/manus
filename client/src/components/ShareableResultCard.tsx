import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Copy, Share2 } from "lucide-react";

interface ShareableResultCardProps {
  trope: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bookTitle: string;
  bookCover: string;
  siteUrl: string;
}

export function ShareableResultCard({
  trope,
  title,
  subtitle,
  icon,
  color,
  bookTitle,
  bookCover,
  siteUrl,
}: ShareableResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const quizUrl = `${siteUrl}/romance-quiz`;
  const shareText = `I'm a ${title} reader! ${icon} Take the quiz to find your romance trope:`;
  const hashtags = "#RomanceBooks #BookTok #RomanceTrope #ReaderQuiz #ManhattanMoneyKings";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${quizUrl}`);
    toast.success("Share text + link copied to clipboard!");
  };

  const handleShareTwitter = () => {
    const text = `${shareText}\n${quizUrl}\n\n${hashtags}`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleSharePinterest = () => {
    const desc = `${shareText} ${hashtags}`;
    window.open(`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(quizUrl)}&description=${encodeURIComponent(desc)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm a ${title} reader!`,
          text: shareText,
          url: quizUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCard = async () => {
    setIsSharing(true);
    try {
      // Use html2canvas-like approach with canvas API
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, "#4A3B3A");
      gradient.addColorStop(0.5, "#4A3B3A");
      gradient.addColorStop(1, "#4A3B3A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Gold border
      ctx.strokeStyle = "#7A4F4C";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1000);

      // Inner border
      ctx.strokeStyle = "rgba(201, 163, 160, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(55, 55, 970, 970);

      // Top badge
      ctx.fillStyle = "rgba(201, 163, 160, 0.15)";
      roundRect(ctx, 370, 100, 340, 44, 22);
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 163, 160, 0.3)";
      ctx.lineWidth = 1;
      roundRect(ctx, 370, 100, 340, 44, 22);
      ctx.stroke();

      ctx.fillStyle = "#7A4F4C";
      ctx.font = "600 14px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MY ROMANCE TROPE IS", 540, 128);

      // Icon
      ctx.font = "80px serif";
      ctx.textAlign = "center";
      ctx.fillText(icon, 540, 230);

      // Title
      ctx.fillStyle = "#4A3B3A";
      ctx.font = "bold 56px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.fillText(title, 540, 310);

      // Subtitle
      ctx.fillStyle = "#7A4F4C";
      ctx.font = "italic 24px 'Georgia', serif";
      ctx.fillText(`"${subtitle}"`, 540, 360);

      // Divider line
      ctx.strokeStyle = "rgba(201, 163, 160, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(340, 400);
      ctx.lineTo(740, 400);
      ctx.stroke();

      // Book recommendation label
      ctx.fillStyle = "#7A4F4C";
      ctx.font = "600 13px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MY PERFECT BOOK MATCH", 540, 450);

      // Book title
      ctx.fillStyle = "#4A3B3A";
      ctx.font = "bold 30px 'Georgia', serif";
      ctx.fillText(bookTitle, 540, 500);

      // Stars
      ctx.fillStyle = "#7A4F4C";
      ctx.font = "20px serif";
      ctx.fillText("★ ★ ★ ★ ★", 540, 540);

      // Load and draw book cover
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = bookCover;
        });

        // Book cover with shadow
        ctx.shadowColor = "rgba(74, 59, 58, 0.5)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        const coverWidth = 180;
        const coverHeight = 270;
        const coverX = (1080 - coverWidth) / 2;
        const coverY = 570;

        // Rounded rect clip for book cover
        ctx.save();
        roundRect(ctx, coverX, coverY, coverWidth, coverHeight, 12);
        ctx.clip();
        ctx.drawImage(img, coverX, coverY, coverWidth, coverHeight);
        ctx.restore();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } catch {
        // If image fails, draw placeholder
        ctx.fillStyle = "rgba(201, 163, 160, 0.1)";
        roundRect(ctx, 450, 570, 180, 270, 12);
        ctx.fill();
        ctx.fillStyle = "#7A4F4C";
        ctx.font = "16px 'Inter', sans-serif";
        ctx.fillText(bookTitle, 540, 710);
      }

      // Bottom CTA
      ctx.fillStyle = "rgba(201, 163, 160, 0.15)";
      roundRect(ctx, 280, 880, 520, 50, 25);
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 163, 160, 0.4)";
      ctx.lineWidth = 1;
      roundRect(ctx, 280, 880, 520, 50, 25);
      ctx.stroke();

      ctx.fillStyle = "#7A4F4C";
      ctx.font = "600 16px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Take the quiz → reeseastor.com/romance-quiz", 540, 912);

      // Author branding
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "14px 'Inter', sans-serif";
      ctx.fillText("Reese Astor • Manhattan Money Kings Series", 540, 970);

      // Download
      const link = document.createElement("a");
      link.download = `my-romance-trope-${trope}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Result card downloaded! Share it on Instagram or TikTok 💕");
    } catch {
      toast.error("Could not generate image. Try taking a screenshot instead!");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="mt-10">
      {/* Visual Result Card Preview */}
      <div className="mb-6">
        <p className="text-sm text-[#7A4F4C] font-medium tracking-wider uppercase text-center mb-4">
          Share Your Result
        </p>

        {/* Card Preview */}
        <div
          ref={cardRef}
          className="mx-auto max-w-sm aspect-square rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #FAF7F7 0%, #F0E6E5 50%, #4A3B3A 100%)",
            border: "2px solid #B59A6A",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/20 mb-3">
              <span className="text-[10px] text-[#7A4F4C] font-semibold tracking-[0.2em] uppercase">
                My Romance Trope Is
              </span>
            </div>

            {/* Icon */}
            <span className="text-5xl mb-2">{icon}</span>

            {/* Title */}
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3B3A] text-center mb-1">
              {title}
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-[#7A4F4C] italic mb-4">"{subtitle}"</p>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A3A0]/40 to-transparent mb-4" />

            {/* Book Match */}
            <p className="text-[10px] text-[#7A4F4C] font-semibold tracking-[0.2em] uppercase mb-2">
              My Perfect Book Match
            </p>

            {/* Book Cover */}
            <div className="w-20 h-28 rounded-lg overflow-hidden shadow-2xl border border-[#4A3B3A]/10 mb-3">
              <img
                src={bookCover}
                alt={bookTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-[#4A3B3A] font-medium text-center">{bookTitle}</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[#7A4F4C] text-[10px]">★</span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#C9A3A0]/10 border border-[#B59A6A]/30">
              <p className="text-[10px] text-[#7A4F4C] font-medium">
                Take the quiz → reeseastor.com/romance-quiz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4">
        {/* Primary: Download for Instagram/TikTok */}
        <Button
          onClick={handleDownloadCard}
          disabled={isSharing}
          className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full max-w-xs"
        >
          <Download className="mr-2 h-5 w-5" />
          {isSharing ? "Generating..." : "Download for Instagram / TikTok"}
        </Button>

        {/* Social Share Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#4A3B3A]/10 text-[#6E5F5A] hover:bg-[#EBD6D3]/30 rounded-full gap-2"
            onClick={handleShareTwitter}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-[#4A3B3A]/10 text-[#6E5F5A] hover:bg-[#EBD6D3]/30 rounded-full gap-2"
            onClick={handleShareFacebook}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-[#4A3B3A]/10 text-[#6E5F5A] hover:bg-[#EBD6D3]/30 rounded-full gap-2"
            onClick={handleSharePinterest}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
            </svg>
            Pinterest
          </Button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#4A3B3A]/10 text-[#6E5F5A] hover:bg-[#EBD6D3]/30 rounded-full gap-2"
              onClick={handleNativeShare}
            >
              <Share2 className="h-4 w-4" />
              More
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-[#4A3B3A]/10 text-[#6E5F5A] hover:bg-[#EBD6D3]/30 rounded-full gap-2"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </Button>
        </div>

        {/* Hashtag suggestion */}
        <div className="text-center mt-2">
          <p className="text-xs text-[#6E5F5A] mb-1">Suggested hashtags:</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hashtags);
              toast.success("Hashtags copied!");
            }}
            className="text-xs text-[#7A4F4C]/60 hover:text-[#7A4F4C] transition-colors cursor-pointer"
          >
            {hashtags} <span className="text-[#6E5F5A] ml-1">(tap to copy)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper: draw rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
