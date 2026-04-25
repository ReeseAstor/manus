import { useState } from "react";
import { Download, Copy, Check, Instagram, Share2, Image, Hash, Calendar, Sparkles } from "lucide-react";

const socialMediaAssets = [
  {
    id: "story-quiz-cta",
    title: "Instagram Story — Quiz CTA",
    description: "Manhattan skyline with 'Which Romance Trope Are You?' headline. Perfect for Instagram/TikTok Stories.",
    platform: "Instagram Stories / TikTok",
    dimensions: "1080x1920 (9:16)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-1-X8rBMneGsyzwW8jUUi7VfP.png",
    caption: `Which romance trope are you? \u2728\n\nAre you an Enemies-to-Lovers firecracker or a Forbidden Love dreamer? Take my free quiz and find out which romance trope matches your personality!\n\nLink in bio \u2192 reeseastor.com/romance-quiz\n\n#RomanceTrope #BookTok #RomanceReaders #WhichAreYou #BookQuiz #RomanceBooks #ReaderLife #BookishQuiz #ManhattanMoneyKings #ReeseAstor`,
    bestTime: "Tuesday/Thursday 11am-1pm EST",
    tips: "Add a poll sticker asking 'Enemies to Lovers or Forbidden Love?' to boost engagement before sharing the quiz link."
  },
  {
    id: "story-trope-icons",
    title: "Instagram Story — Trope Icons",
    description: "Four gold trope icons (Crown, Swords, Heart, Briefcase) with 'Find Your Perfect Romance Trope' header.",
    platform: "Instagram Stories / TikTok",
    dimensions: "1080x1920 (9:16)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-2-D4B8EAFgiPDWkZzzYxabc9.png",
    caption: `Find your perfect romance trope \ud83d\udc51\u2694\ufe0f\ud83d\udc94\ud83d\udcbc\n\nForbidden Love \u2022 Enemies to Lovers \u2022 Second Chance \u2022 Boss Romance\n\nWhich one calls to your heart? Take the free quiz and I'll recommend the perfect book for you!\n\nSwipe up or link in bio \u2192\n\n#RomanceTropes #BookRecommendations #RomanceQuiz #BookTok #ReaderQuiz #WhatsYourTrope #BillionaireRomance #RomanceAuthor`,
    bestTime: "Wednesday/Friday 7-9pm EST",
    tips: "Use the 'Add Yours' sticker template asking followers to share their result. Creates viral chain sharing."
  },
  {
    id: "post-four-tropes",
    title: "Instagram Post — Four Tropes Grid",
    description: "Cinematic 4-quadrant grid showing each romance trope scene with Manhattan backdrop. High engagement format.",
    platform: "Instagram Feed / Facebook",
    dimensions: "1080x1080 (1:1)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-3-V69D3XBhEZk6iDT2QHt2at.png",
    caption: `What\u2019s YOUR romance trope? \ud83d\udd25\n\n\u2694\ufe0f Enemies to Lovers \u2014 The tension. The banter. The moment everything changes.\n\ud83d\udc51 Forbidden Love \u2014 They shouldn\u2019t want each other. But they can\u2019t stop.\n\u2615 Second Chance \u2014 Some loves deserve a do-over.\n\ud83d\udcbc Boss Romance \u2014 Professional by day. Irresistible by night.\n\nI created a free 7-question quiz that reveals your romance personality AND recommends the perfect book from my Manhattan Money Kings series.\n\nTake it now \u2192 Link in bio!\n\nDrop your result in the comments \ud83d\udc47\n\n#RomanceTrope #EnemiestoLovers #ForbiddenLove #SecondChanceRomance #BossRomance #BookQuiz #RomanceReaders #BookTok #BillionaireRomance #ManhattanMoneyKings #ReeseAstor #RomanceAuthor #BookRecommendation #WhatToReadNext`,
    bestTime: "Monday/Wednesday 12-2pm EST",
    tips: "Pin this post to your profile grid. Ask followers to 'Drop your trope in the comments!' to boost algorithm reach."
  },
  {
    id: "pinterest-discover",
    title: "Pinterest Pin — Discover Your Romance Personality",
    description: "Tall Pinterest-optimized pin with open book, floating hearts, and trope icons. Drives long-tail search traffic.",
    platform: "Pinterest",
    dimensions: "1000x1500 (2:3)",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663125551617/RvRnCdwCjDUcBqafgeNQQ4/quiz-promo-4-heWRQXEr4icePDCjayiVmn.png",
    caption: `Discover Your Romance Personality \ud83d\udcd6\u2728\n\nTake this free 7-question quiz to find out which romance trope matches your reading personality \u2014 then get a personalized book recommendation from the Manhattan Money Kings series!\n\nEnemies to Lovers \u2022 Slow Burn \u2022 Second Chance \u2022 Forced Proximity\n\nTake the quiz: reeseastor.com/romance-quiz`,
    bestTime: "Saturday/Sunday 8-11pm EST",
    tips: "Add to boards: 'Romance Books', 'Book Quizzes', 'What to Read Next', 'Romance Recommendations'. Pinterest drives traffic for months."
  }
];

const hashtagSets = {
  primary: ["#RomanceTrope", "#BookTok", "#RomanceReaders", "#BookQuiz", "#RomanceBooks", "#ReaderLife"],
  engagement: ["#WhichAreYou", "#DropYourResult", "#BookishQuiz", "#WhatToReadNext", "#BookRecommendation"],
  niche: ["#BillionaireRomance", "#ManhattanMoneyKings", "#ReeseAstor", "#RomanceAuthor", "#ContemporaryRomance"],
  trending: ["#BookTok2026", "#RomanceBookTok", "#BookstagramReels", "#AuthorLife", "#IndieAuthor"]
};

const weeklySchedule = [
  { day: "Monday", content: "Post: Four Tropes Grid (Feed Post)", time: "12pm EST", platform: "Instagram + Facebook" },
  { day: "Tuesday", content: "Story: Quiz CTA with poll sticker", time: "11am EST", platform: "Instagram Stories" },
  { day: "Wednesday", content: "Reel: Film yourself revealing your trope result", time: "7pm EST", platform: "Instagram Reels + TikTok" },
  { day: "Thursday", content: "Story: Share a follower's quiz result (UGC)", time: "1pm EST", platform: "Instagram Stories" },
  { day: "Friday", content: "Story: Trope Icons with 'Add Yours' sticker", time: "7pm EST", platform: "Instagram Stories" },
  { day: "Saturday", content: "Pin: Discover Your Romance Personality", time: "9pm EST", platform: "Pinterest" },
  { day: "Sunday", content: "Carousel: '4 Signs You're an Enemies-to-Lovers Reader'", time: "10am EST", platform: "Instagram + Facebook" },
];

export default function AdminSocialMediaKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"graphics" | "schedule" | "hashtags">("graphics");

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
            Ready-to-post graphics, captions, and hashtags for promoting the Romance Trope Quiz across all platforms.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: "graphics" as const, label: "Graphics & Captions", icon: Image },
              { id: "schedule" as const, label: "Posting Schedule", icon: Calendar },
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
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      className="max-h-96 w-auto rounded-lg shadow-lg object-contain"
                    />
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
                      <a
                        href={asset.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#c9a96e] text-black rounded-lg text-sm font-medium hover:bg-[#e8d5a3] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
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

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div>
            <div className="bg-[#12121a] border border-[#c9a96e]/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Weekly Quiz Promotion Schedule</h2>
              <p className="text-gray-400 text-sm mb-6">
                Follow this 7-day rotation to maximize quiz traffic. Consistency is key — aim for at least 4 posts per week.
              </p>

              <div className="space-y-3">
                {weeklySchedule.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-black/20 rounded-lg p-4 border border-white/5"
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-bold text-[#c9a96e]">{item.day}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 w-24 text-right">{item.time}</div>
                    <div className="text-xs bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-1 rounded w-40 text-center">
                      {item.platform}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reel Script Template */}
            <div className="bg-[#12121a] border border-[#c9a96e]/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Instagram Reel Script Templates</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Reel 1: 'Which Romance Trope Are You?' Reveal",
                    script: `[Hook — 0-3 sec] "I just found out which romance trope I am and I'm SHOOK"\n[Build — 3-10 sec] Show yourself taking the quiz on your phone, react to each question\n[Reveal — 10-20 sec] Show your result card, react dramatically\n[CTA — 20-25 sec] "Link in bio to take the quiz — drop your result in the comments!"\n\nAudio: Trending sound or "Oh No" remix\nText overlay: "Which Romance Trope Are You? \ud83d\udd25"`,
                    duration: "15-30 sec"
                  },
                  {
                    title: "Reel 2: 'POV: You're Each Romance Trope'",
                    script: `[Scene 1 — Enemies to Lovers] Glare at camera, then slowly smile\n[Scene 2 — Forbidden Love] Look around nervously, then lean in\n[Scene 3 — Second Chance] Scroll through old photos, look wistful\n[Scene 4 — Boss Romance] Adjust blazer, look powerful\n[CTA] "Which one are you? Take the quiz — link in bio!"\n\nAudio: "Aesthetic" trending sound\nText overlay: Each trope name as you act it out`,
                    duration: "15-20 sec"
                  },
                  {
                    title: "Reel 3: 'Your Romance Trope Based on Your Coffee Order'",
                    script: `[Hook] "Your romance trope based on your coffee order"\n[Black coffee] = Enemies to Lovers (you like it intense)\n[Vanilla latte] = Second Chance (sweet and comforting)\n[Espresso martini] = Forbidden Love (a little dangerous)\n[Caramel macchiato] = Boss Romance (sophisticated but sweet)\n[CTA] "Accurate? Take the full quiz — link in bio!"\n\nAudio: Upbeat trending sound\nText overlay: Coffee + trope pairings`,
                    duration: "20-30 sec"
                  },
                  {
                    title: "Reel 4: 'Reading the Comments on My Romance Quiz'",
                    script: `[Hook] "Reading your romance quiz results and I have THOUGHTS"\n[Show comments/DMs] React to different results\n[Engage] "If you got Enemies to Lovers, we need to talk"\n[CTA] "Haven't taken it yet? Link in bio!"\n\nAudio: Conversational/reaction trending sound\nText overlay: Highlight funny or relatable results`,
                    duration: "30-60 sec"
                  }
                ].map((reel, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-white">{reel.title}</h3>
                      <span className="text-xs text-gray-500">{reel.duration}</span>
                    </div>
                    <div className="bg-black/30 rounded p-3 text-xs text-gray-300 whitespace-pre-line mb-2">
                      {reel.script}
                    </div>
                    <button
                      onClick={() => copyToClipboard(reel.script, `reel-${i}`)}
                      className="flex items-center gap-1 text-xs text-[#c9a96e] hover:text-[#e8d5a3] transition-colors"
                    >
                      {copiedId === `reel-${i}` ? (
                        <><Check className="w-3 h-3" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy Script</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
                <h3 className="text-lg font-bold text-white">Complete Hashtag Block (30 tags)</h3>
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
                    <><Copy className="w-4 h-4" /> Copy All 30 Hashtags</>
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
