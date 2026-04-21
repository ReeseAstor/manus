import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  /** End date for the countdown. If not provided, defaults to end of current month */
  endDate?: Date;
  /** Label text shown before the timer */
  label?: string;
  /** Compact mode for inline use */
  compact?: boolean;
}

function getNextMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

export function CountdownTimer({
  endDate,
  label = "Launch Pricing Ends In",
  compact = false,
}: CountdownTimerProps) {
  const target = endDate || getNextMonthEnd();
  
  const calculateTimeLeft = () => {
    const difference = target.getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-[#d4af37]">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-mono font-semibold">
          {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-[#d4af37]">
          <Clock className="w-5 h-5" />
          <span className="font-semibold text-sm uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Sec" },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3">
              <div className="text-center">
                <div className="bg-[#0a0e27] border border-[#d4af37]/30 rounded-lg px-3 py-2 min-w-[52px]">
                  <span className="text-2xl font-mono font-bold text-[#d4af37]">
                    {pad(unit.value)}
                  </span>
                </div>
                <span className="text-[#e5e5e5]/50 text-xs mt-1 block">{unit.label}</span>
              </div>
              {i < 3 && (
                <span className="text-[#d4af37]/50 text-2xl font-bold mb-4">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
