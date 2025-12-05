import { useEffect, useState } from "react";

interface UseExitIntentOptions {
  threshold?: number; // Pixels from top to trigger
  delay?: number; // Delay in ms before showing popup
  onExitIntent?: () => void;
}

export function useExitIntent({
  threshold = 20,
  delay = 1000,
  onExitIntent,
}: UseExitIntentOptions = {}) {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSubscribed = localStorage.getItem("newsletter_subscribed");
    const hasDismissed = localStorage.getItem("newsletter_dismissed");
    const dismissedAt = localStorage.getItem("newsletter_dismissed_at");

    if (hasSubscribed) {
      return; // Don't show if already subscribed
    }

    // Show again after 7 days if dismissed
    if (hasDismissed && dismissedAt) {
      const dismissedTime = parseInt(dismissedAt);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDaysInMs) {
        return; // Don't show if dismissed within last 7 days
      }
    }

    let timeoutId: NodeJS.Timeout;
    let isActive = false;

    // Wait for delay before activating exit intent detection
    timeoutId = setTimeout(() => {
      isActive = true;
    }, delay);

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from top of viewport
      // and we haven't triggered yet and delay has passed
      if (
        isActive &&
        !hasTriggered &&
        e.clientY <= threshold &&
        e.relatedTarget === null
      ) {
        setHasTriggered(true);
        setShouldShow(true);
        onExitIntent?.();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [threshold, delay, hasTriggered, onExitIntent]);

  const dismiss = () => {
    setShouldShow(false);
    localStorage.setItem("newsletter_dismissed", "true");
    localStorage.setItem("newsletter_dismissed_at", Date.now().toString());
  };

  const reset = () => {
    setHasTriggered(false);
    setShouldShow(false);
  };

  return {
    shouldShow,
    dismiss,
    reset,
  };
}
