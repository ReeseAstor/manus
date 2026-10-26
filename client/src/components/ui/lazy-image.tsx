import { useState, useEffect, useRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  lqipSrc?: string; // Low-quality image placeholder
  webpSrc?: string; // WebP version of the image
  srcSet?: string; // Responsive srcset
  sizes?: string; // Responsive sizes
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // For above-the-fold images
  onLoad?: () => void;
  aspectRatio?: number; // width/height ratio
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fadeInDuration?: number; // ms for fade-in animation
  threshold?: number; // Intersection Observer threshold
  rootMargin?: string; // Intersection Observer margin
  style?: CSSProperties;
}

export function LazyImage({
  src,
  alt,
  lqipSrc,
  webpSrc,
  srcSet,
  sizes,
  width,
  height,
  className,
  priority = false,
  onLoad,
  aspectRatio,
  objectFit = 'cover',
  fadeInDuration = 300,
  threshold = 0.1,
  rootMargin = '50px',
  style,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(lqipSrc || '');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [priority, threshold, rootMargin]);

  // Load the actual image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    // Set srcset if available
    if (srcSet) {
      img.srcset = srcSet;
    }
    
    // Set sizes if available
    if (sizes) {
      img.sizes = sizes;
    }

    img.onload = () => {
      setCurrentSrc(img.src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      // Fallback to original src if WebP fails
      if (webpSrc && img.src === webpSrc) {
        img.src = src;
      }
    };

    // Try WebP first if supported and available
    if (webpSrc && supportsWebP()) {
      img.src = webpSrc;
    } else {
      img.src = src;
    }
  }, [isInView, src, webpSrc, srcSet, sizes, onLoad]);

  // Calculate container styles for aspect ratio
  const containerStyles: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  if (aspectRatio && !height) {
    containerStyles.paddingBottom = `${(1 / aspectRatio) * 100}%`;
    containerStyles.height = 0;
  } else if (height) {
    containerStyles.height = height;
  }

  if (width) {
    containerStyles.width = width;
  }

  const imageStyles: CSSProperties = {
    objectFit,
    transition: `opacity ${fadeInDuration}ms ease-in-out, filter ${fadeInDuration}ms ease-in-out`,
    opacity: isLoaded ? 1 : 0,
    filter: isLoaded ? 'blur(0)' : 'blur(20px)',
  };

  if (aspectRatio && !height) {
    imageStyles.position = 'absolute';
    imageStyles.top = 0;
    imageStyles.left = 0;
    imageStyles.width = '100%';
    imageStyles.height = '100%';
  }

  return (
    <div
      ref={containerRef}
      className={cn('lazy-image-container', className)}
      style={containerStyles}
      data-testid={`lazy-image-${alt.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* LQIP or placeholder background */}
      {lqipSrc && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${lqipSrc})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !lqipSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E6E5] to-[#F0E6E5] dark:from-[#FAF7F7] dark:to-[#F0E6E5] animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <picture>
          {webpSrc && (
            <source
              type="image/webp"
              srcSet={webpSrc}
              sizes={sizes}
            />
          )}
          {srcSet && (
            <source
              srcSet={srcSet}
              sizes={sizes}
            />
          )}
          <img
            ref={imgRef}
            src={currentSrc || src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={imageStyles}
            className={cn(
              'lazy-image',
              !aspectRatio && !height && 'w-full h-full',
              className
            )}
          />
        </picture>
      )}
    </div>
  );
}

// Check WebP support
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
}