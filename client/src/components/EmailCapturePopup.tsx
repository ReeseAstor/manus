import { NewsletterPopup } from "./NewsletterPopup";
import { useExitIntent } from "@/hooks/useExitIntent";

export function EmailCapturePopup() {
  const { shouldShow, dismiss } = useExitIntent({
    threshold: 20,
    delay: 5000, // Wait 5 seconds before activating exit-intent detection
  });

  return <NewsletterPopup isOpen={shouldShow} onClose={dismiss} />;
}
