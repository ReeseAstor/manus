import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface PurchaseNotification {
  name: string;
  location: string;
  product: string;
  timeAgo: string;
}

const recentPurchases: PurchaseNotification[] = [
  { name: "Sarah", location: "New York", product: "Complete Trilogy", timeAgo: "2 minutes ago" },
  { name: "Jessica", location: "Los Angeles", product: "Ultimate Collection", timeAgo: "5 minutes ago" },
  { name: "Amanda", location: "Chicago", product: "The Billionaire's Executive Assistant", timeAgo: "8 minutes ago" },
  { name: "Emily", location: "Houston", product: "Complete Trilogy", timeAgo: "12 minutes ago" },
  { name: "Rachel", location: "Miami", product: "The Billionaire's Fake Wife", timeAgo: "15 minutes ago" },
  { name: "Lauren", location: "Seattle", product: "Ultimate Collection", timeAgo: "18 minutes ago" },
  { name: "Megan", location: "Denver", product: "Complete Trilogy", timeAgo: "22 minutes ago" },
  { name: "Christina", location: "Atlanta", product: "The Billionaire's Baby Secret", timeAgo: "25 minutes ago" },
];

export function RecentPurchaseToast() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const showNext = useCallback(() => {
    if (dismissed) return;
    setCurrentIndex((prev) => (prev + 1) % recentPurchases.length);
    setVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }, [dismissed]);

  useEffect(() => {
    // Show first notification after 15 seconds
    const initialTimeout = setTimeout(() => {
      if (!dismissed) {
        setVisible(true);
        setTimeout(() => setVisible(false), 5000);
      }
    }, 15000);

    // Then show every 30-45 seconds
    const interval = setInterval(() => {
      showNext();
    }, 30000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showNext, dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  const purchase = recentPurchases[currentIndex];

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-[#1a1f3a]/95 backdrop-blur-xl border border-[#d4af37]/30 rounded-xl p-4 shadow-2xl shadow-black/50">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-[#e5e5e5]/40 hover:text-[#e5e5e5]/70 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-[#d4af37]/20 rounded-lg p-2 flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <p className="text-[#e5e5e5] text-sm font-medium">
                  {purchase.name} from {purchase.location}
                </p>
                <p className="text-[#e5e5e5]/60 text-xs mt-0.5">
                  purchased <span className="text-[#d4af37]">{purchase.product}</span>
                </p>
                <p className="text-[#e5e5e5]/40 text-xs mt-1">{purchase.timeAgo}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
