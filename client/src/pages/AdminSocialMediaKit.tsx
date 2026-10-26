import { useState } from "react";
import { Download, Copy, Check, Instagram, Share2, Image, Hash, Calendar, Sparkles } from "lucide-react";

const socialMediaAssets = [
  {
    id: "story-quiz-cta",
    imageRetired: true,
    title: "Instagram Story: Quiz CTA",
    description: "Story caption for the 5-question Manhattan Money Kings match quiz at /quiz.",
    platform: "Instagram Stories / TikTok",
    dimensions: "1080x1920 (9:16)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-1-X8rBMneGsyzwW8jUUi7VfP.png",
    caption: `Which Manhattan Money King is your match?\n\nTake my free 5-question quiz and meet your billionaire book boyfriend.\n\nLink in bio: reeseastor.com/quiz\n\n#BookTok #RomanceReaders #BookQuiz #BillionaireRomance #ManhattanMoneyKings #ReeseAstor`,
    bestTime: "Tuesday/Thursday 11am-1pm EST",
    tips: "Add a link sticker to reeseastor.com/quiz."
  },
  {
    id: "pinterest-discover",
    imageRetired: true,
    title: "Pinterest Pin: Which Manhattan Money King Is Your Match?",
    description: "Pin caption for the 5-question Manhattan Money Kings match quiz at /quiz. Drives long-tail search traffic.",
    platform: "Pinterest",
    dimensions: "1000x1500 (2:3)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-4-heWRQXEr4icePDCjayiVmn.png",
    caption: `Which Manhattan Money King Is Your Match?\n\nTake this free 5-question quiz to meet your billionaire book boyfriend, then get the Manhattan Money Kings book to start with.\n\nTake the quiz: reeseastor.com/quiz`,
    bestTime: "Saturday/Sunday 8-11pm EST",
    tips: "Add to boards: 'Romance Books', 'Book Quizzes', 'What to Read Next', 'Romance Recommendations'. Pinterest drives traffic for months."
  }
];

const hashtagSets = {
  primary: ["#BookTok", "#RomanceReaders", "#BookQuiz", "#RomanceBooks", "#ReaderLife"],
  engagement: ["#WhichAreYou", "#DropYourResult", "#BookishQuiz", "#WhatToReadNext", "#BookRecommendation"],
  niche: ["#BillionaireRomance", "#ManhattanMoneyKings", "#ReeseAstor", "#RomanceAuthor", "#ContemporaryRomance"],
  trending: ["#BookTok2026", "#RomanceBookTok", "#BookstagramReels", "#AuthorLife", "#IndieAuthor"]
};

export default function AdminSocialMediaKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"graphics" | "hashtags">("graphics");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] border-b border-[#c9a96e]/20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#c9a96e]/10 rounded-lg">
              <Share2 className="w-6 h-6 text-[#c9a96e]" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#c9a96e] to-[#e8d5a3] bg-clip-text text-transparent">
              Social Media Kit
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            Ready-to-post captions and hashtags for the Manhattan Money Kings quiz at reeseastor.com/quiz.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: "graphics" as const, label: "Graphics & Captions", icon: Image },
              { id: "hashtags" as const, label: "Hashtag Sets", icon: Hash },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#c9a96e] text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Graphics Tab */}
        {activeTab === "graphics" && (
          <div className="space-y-8">
            {socialMediaAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#12121a] border border-[#c9a96e]/10 rounded-xl overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Preview */}
                  <div className="lg:w-80 flex-shrink-0 bg-black/30 p-4 flex items-center justify-center">
                    {asset.imageRetired ? (
                      <p className="text-sm text-gray-400 text-center">
                        Image hidden: it promotes the retired trope quiz. A new image for /quiz is needed before posting.
                      </p>
                    ) : (
                      <img
                        src={asset.imageUrl}
                        alt={asset.title}
                        className="max-h-96 w-auto rounded-lg shadow-lg object-contain"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{asset.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{asset.description}</p>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-1 rounded">
                            {asset.platform}
                          </span>
                          <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                            {asset.dimensions}
                          </span>
                        </div>
                      </div>
                      {!asset.imageRetired && <a
                        href={asset.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm font-medium hover:bg-[#e8d5a3] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>}
                    </div>

                    {/* Caption */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#c9a96e]">Ready-to-Post Caption</span>
                        <button
                          onClick={() => copyToClipboard(asset.caption, `caption-${asset.id}`)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a96e] transition-colors"
                        >
                          {copiedId === `caption-${asset.id}` ? (
                            <><Check className="w-3 h-3" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy Caption</>
                          )}
                        </button>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-line max-h-40 overflow-y-auto border border-white/5">
                        {asset.caption}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="flex items-start gap-3 bg-[#c9a96e]/5 rounded-lg p-3 border border-[#c9a96e]/10">
                      <Sparkles className="w-4 h-4 text-[#c9a96e] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-[#c9a96e]">Pro Tip</span>
                        <p className="text-xs text-gray-400 mt-0.5">{asset.tips}</p>
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="mt-3 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Best posting time: {asset.bestTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hashtags Tab */}
        {activeTab === "hashtags" && (
          <div className="space-y-6">
            {Object.entries(hashtagSets).map(([category, tags]) => (
              <div key={category} className="bg-[#12121a] border border-[#c9a96e]/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white capitalize">{category} Hashtags</h3>
                  <button
                    onClick={() => copyToClipboard(tags.join(" "), `hashtag-${category}`)}
                    className="flex items-center gap-1 text-sm text-[#c9a96e] hover:text-[#e8d5a3] transition-colors"
                  >
                    {copiedId === `hashtag-${category}` ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy All</>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-[#c9a96e]/10 text-[#c9a96e] px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-[#c9a96e]/20 transition-colors"
                      onClick={() => copyToClipboard(tag, `tag-${tag}`)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Full Hashtag Block */}
            <div className="bg-[#12121a] border border-[#c9a96e]/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Complete Hashtag Block ({Object.values(hashtagSets).flat().length} tags)</h3>
                <button
                  onClick={() => copyToClipboard(
                    Object.values(hashtagSets).flat().join(" "),
                    "all-hashtags"
                  )}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm font-medium hover:bg-[#e8d5a3] transition-colors"
                >
                  {copiedId === "all-hashtags" ? (
                    <><Check className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy All {Object.values(hashtagSets).flat().length} Hashtags</>
                  )}
                </button>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 border border-white/5">
                {Object.values(hashtagSets).flat().join(" ")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
