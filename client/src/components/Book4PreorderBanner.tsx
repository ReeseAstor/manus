import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export function Book4PreorderBanner() {
  const launchDate = new Date('2026-02-03T00:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#e8c4c4]/20 via-[#d4af37]/20 to-[#e8c4c4]/20 border-b border-[#d4af37]/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Sparkle Effects */}
      <motion.div
        className="absolute top-2 left-[10%] w-2 h-2 bg-[#d4af37] rounded-full"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="absolute top-4 right-[20%] w-1.5 h-1.5 bg-[#e8c4c4] rounded-full"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-3 left-[30%] w-1 h-1 bg-[#d4af37] rounded-full"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative py-4 md:py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Announcement */}
          <div className="flex items-center gap-4 text-center lg:text-left">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="w-8 h-8 text-[#d4af37]" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start flex-wrap">
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black rounded-full">
                  PRE-ORDER NOW
                </span>
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider bg-[#e8c4c4] text-black rounded-full">
                  $0.99 LAUNCH PRICE
                </span>
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-white">
                The Billionaire's Forbidden Nanny — Book 4 Coming Feb 3rd!
              </h3>
            </div>
          </div>

          {/* Center: Countdown */}
          <div className="flex items-center gap-2 md:gap-3">
            <Clock className="w-4 h-4 text-[#d4af37] hidden md:block" />
            <div className="flex items-center gap-1 md:gap-2">
              <div className="text-center px-2 md:px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-[#d4af37]/30">
                <div className="text-lg md:text-xl font-bold text-[#d4af37]">{timeLeft.days}</div>
                <div className="text-[10px] text-gray-400 uppercase">Days</div>
              </div>
              <span className="text-[#d4af37] font-bold">:</span>
              <div className="text-center px-2 md:px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-[#d4af37]/30">
                <div className="text-lg md:text-xl font-bold text-[#d4af37]">{timeLeft.hours}</div>
                <div className="text-[10px] text-gray-400 uppercase">Hrs</div>
              </div>
              <span className="text-[#d4af37] font-bold">:</span>
              <div className="text-center px-2 md:px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-[#d4af37]/30">
                <div className="text-lg md:text-xl font-bold text-[#d4af37]">{timeLeft.minutes}</div>
                <div className="text-[10px] text-gray-400 uppercase">Min</div>
              </div>
              <span className="text-[#d4af37] font-bold hidden md:inline">:</span>
              <div className="text-center px-2 md:px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-[#d4af37]/30 hidden md:block">
                <div className="text-lg md:text-xl font-bold text-[#d4af37]">{timeLeft.seconds}</div>
                <div className="text-[10px] text-gray-400 uppercase">Sec</div>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <a href="https://swiy.co/4rd" target="_blank" rel="noopener noreferrer">
                Pre-Order $0.99
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
