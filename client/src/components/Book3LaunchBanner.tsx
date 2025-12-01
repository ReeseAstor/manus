import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function Book3LaunchBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b border-primary/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container relative py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Announcement */}
          <div className="flex items-center gap-3 text-center md:text-left">
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
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider bg-primary text-primary-foreground rounded-full">
                  JUST LAUNCHED
                </span>
              </div>
              <h3 className="font-playfair text-lg md:text-2xl font-bold text-foreground">
                The Billionaire's Baby Secret is Now Available!
              </h3>
              <p className="text-sm text-muted-foreground hidden md:block">
                The thrilling conclusion to the Manhattan Money Kings series
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <a href="https://swiy.co/3rd" target="_blank" rel="noopener noreferrer">
                Get It Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hidden md:inline-flex border-primary/30 hover:bg-primary/10"
            >
              <a href="/books">
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
