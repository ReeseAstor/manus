import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { LazyImage } from './lazy-image';
import { cn } from '@/lib/utils';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  bookCover: string;
  preorderPrice?: string;
  originalPrice?: string;
  preorderLink: string;
  releaseDate?: string;
  rating?: number;
  reviewCount?: number;
  urgencyMessage?: string;
  className?: string;
}

export function CinematicHero({
  title,
  subtitle,
  description,
  bookCover,
  preorderPrice = "$0.99",
  originalPrice = "$4.99",
  preorderLink,
  releaseDate = "December 1, 2025",
  rating = 4.9,
  reviewCount = 2847,
  urgencyMessage = "Preorder price ends December 1st",
  className,
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const bookY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Floating animation state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for 3D book effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Particle effect
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex items-center overflow-hidden",
        "bg-gradient-to-b from-[#0E1620] via-[#0E1620]/95 to-[#0E1620]",
        className
      )}
    >
      {/* Parallax Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Manhattan Skyline Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/images/manhattan-skyline.jpg')",
            backgroundAttachment: 'fixed',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1620]/60 via-[#0E1620]/80 to-[#0E1620]" />
        
        {/* Animated Particles (City Lights) */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-[#D4AF37]/30 blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Luxury Gradient Glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Content Container */}
      <div className="container relative z-10 py-20">
        <motion.div
          style={{ opacity }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column: Text Content */}
          <motion.div
            style={{ y: textY }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6"
            >
              <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Bestselling Author</span>
            </motion.div>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[#D4AF37] uppercase tracking-wider text-sm md:text-base font-semibold mb-4"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Main Title with Gradient Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent animate-gradient">
                {title}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/80 text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {description}
            </motion.p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <span className="text-white/80 text-sm md:text-base">
                {rating}/5 from {reviewCount.toLocaleString()} readers
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href={preorderLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F2D984] hover:from-[#F2D984] hover:to-[#D4AF37] text-black font-bold text-lg px-10 py-6 shadow-xl shadow-[#D4AF37]/20"
                >
                  <span className="mr-2">Preorder Now {preorderPrice}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  document.getElementById('book-trailer')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-semibold text-lg px-10 py-6"
                >
                  Read Free Sample
                </Button>
              </motion.button>
            </motion.div>

            {/* Urgency Indicator */}
            {urgencyMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-white/60"
              >
                <Clock className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-sm">{urgencyMessage}</span>
              </motion.div>
            )}

            {/* Price Comparison */}
            {originalPrice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-4 flex items-center justify-center lg:justify-start gap-3"
              >
                <span className="text-white/40 line-through text-lg">{originalPrice}</span>
                <span className="text-[#D4AF37] font-bold text-2xl">{preorderPrice}</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs font-semibold">
                    Save {Math.round((1 - parseFloat(preorderPrice.replace('$', '')) / parseFloat(originalPrice.replace('$', ''))) * 100)}%
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Book Cover with 3D Effect */}
          <motion.div
            style={{ y: bookY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000"
          >
            <motion.div
              className="relative"
              animate={{
                rotateY: mousePosition.x * 5,
                rotateX: -mousePosition.y * 5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent rounded-3xl blur-2xl" />
              
              {/* Book Cover */}
              <LazyImage
                src={bookCover}
                alt={`${title} book cover`}
                className="relative w-80 md:w-96 lg:w-[420px] rounded-2xl shadow-2xl border border-[#D4AF37]/20 transform-gpu"
                priority
                aspectRatio={2/3}
              />
              
              {/* Floating Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-[#D4AF37] to-[#F2D984] text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl"
              >
                {preorderPrice}
              </motion.div>
              
              {/* Release Date Badge */}
              {releaseDate && (
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/30 text-white px-4 py-2 rounded-full text-sm shadow-xl"
                >
                  Available {releaseDate}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
          />
        </motion.div>
      </motion.div>


    </section>
  );
}
