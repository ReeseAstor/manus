import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Out of Service - Reese Astor";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#d4af37]/10 border-2 border-[#d4af37]/30">
            <svg
              className="w-12 h-12 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
            Out of Service
          </h1>

          {/* Message */}
          <p className="text-xl text-gray-300 leading-relaxed">
            This website is temporarily unavailable.
            <br />
            We apologize for any inconvenience.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-400">
            Please check back later or contact us for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
