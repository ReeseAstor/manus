import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook for triggering animations when elements scroll into view.
 * Uses IntersectionObserver for performance.
 */
export function useScrollAnimation(options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook for staggered animation of child elements.
 */
export function useStaggerAnimation(itemCount: number, options?: {
  baseDelay?: number;
  staggerDelay?: number;
}) {
  const { baseDelay = 0, staggerDelay = 100 } = options || {};
  const { ref, isVisible } = useScrollAnimation();

  const getItemStyle = useCallback((index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s ease ${baseDelay + index * staggerDelay}ms, transform 0.6s ease ${baseDelay + index * staggerDelay}ms`,
  }), [isVisible, baseDelay, staggerDelay]);

  return { ref, isVisible, getItemStyle };
}
