import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { CheckCircle, Sparkles, Headphones, BookOpen } from 'lucide-react';

export default function VipWelcome() {
  const [location, setLocation] = useLocation();
  const sessionId = new URLSearchParams(window.location.search).get('session_id');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioRef] = useState(new Audio());

  const { data: user } = trpc.auth.me.useQuery();
  // Display subscription tier info (will be populated after webhook processes payment)
  const subscription = null; // TODO: Fetch from user's subscription data after webhook

  // Get first story to showcase (doesn't require active membership yet)
  const { data: firstStory, isLoading: isLoadingStory } = trpc.vip.getWelcomeStory.useQuery(
    undefined,
    { enabled: !!user }
  );

  useEffect(() => {
    if (!sessionId) {
      setLocation('/vip-club');
    }
  }, [sessionId, setLocation]);

  useEffect(() => {
    if (firstStory?.audioUrl) {
      audioRef.src = firstStory.audioUrl;
      audioRef.addEventListener('timeupdate', () => {
        if (audioRef.duration) {
          setAudioProgress((audioRef.currentTime / audioRef.duration) * 100);
        }
      });
      audioRef.addEventListener('ended', () => {
        setAudioPlaying(false);
        setAudioProgress(0);
      });
    }
  }, [firstStory, audioRef]);

  const toggleAudio = () => {
    if (audioPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setAudioPlaying(!audioPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBD6D3] via-[#EBD6D3] to-[#EBD6D3]">
      {/* Success Header */}
      <div className="bg-[#4A3B3A] text-[#FAF7F7] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EBD6D3]/100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to the VIP Spicy Stories Club!
          </h1>
          <p className="text-xl text-[#7A4F4C] max-w-2xl mx-auto">
            {firstStory?.audioUrl
              ? "Your VIP membership is active. Your first steamy story is below, with audio."
              : "Your VIP membership is active. Your first steamy story is below."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* What's Included Section */}
        <div className="bg-[#FAF7F7] rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#7A4F4C]" />
            <h2 className="text-3xl font-bold text-[#4A3B3A]">
              What's Included in Your Membership
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl">
              <BookOpen className="w-10 h-10 text-[#7A4F4C] mb-4" />
              <h3 className="text-xl font-bold text-[#4A3B3A] mb-2">
                Exclusive Stories
              </h3>
              <p className="text-[#4A3B3A]">
                Access to steamy bonus scenes featuring your favorite Manhattan Money Kings couples
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl">
              <Headphones className="w-10 h-10 text-[#7A4F4C] mb-4" />
              <h3 className="text-xl font-bold text-[#4A3B3A] mb-2">
                Audio Included
              </h3>
              <p className="text-[#4A3B3A]">
                Stories come with audio you can play here
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl">
              <Sparkles className="w-10 h-10 text-[#7A4F4C] mb-4" />
              <h3 className="text-xl font-bold text-[#4A3B3A] mb-2">
                New Content Monthly
              </h3>
              <p className="text-[#4A3B3A]">
                Fresh steamy stories added every month, plus deleted scenes and bonus content
              </p>
            </div>
          </div>
        </div>

        {/* First Story Showcase */}
        {isLoadingStory ? (
          <div className="bg-[#FAF7F7] rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-[#4A3B3A] mb-6">
              Start with Your First Story
            </h2>
            <div className="flex flex-col items-center justify-center py-12">
              {/* Animated Loading Spinner */}
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#C9A3A0]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A3A0] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#C9A3A0] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <Headphones className="absolute inset-0 m-auto w-8 h-8 text-[#7A4F4C] animate-pulse" />
              </div>
              <p className="text-[#6E5F5A] text-lg animate-pulse">Loading your first steamy story...</p>
              <div className="flex gap-1 mt-4">
                <span className="w-2 h-2 bg-[#C9A3A0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-[#7A4F4C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-[#7A4F4C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        ) : firstStory ? (
          <div className="bg-[#FAF7F7] rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-[#4A3B3A] mb-6">
              Start with Your First Story
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="inline-block px-4 py-1 bg-[#EBD6D3] text-[#7A4F4C] rounded-full text-sm font-semibold mb-4">
                  {firstStory.category?.toUpperCase() || 'ROMANCE'}
                </div>
                <h3 className="text-2xl font-bold text-[#4A3B3A] mb-2">
                  {firstStory.title}
                </h3>
                <p className="text-[#6E5F5A] mb-4">
                  {firstStory.characters || 'Manhattan Money Kings'}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: firstStory.heatLevel || 4 }).map((_, i) => (
                    <span key={i} className="text-[#7A4F4C]">🔥</span>
                  ))}
                </div>
                <p className="text-[#4A3B3A] mb-6 line-clamp-4">
                  {firstStory.content?.substring(0, 200)}...
                </p>
                <button
                  onClick={() => setLocation('/vip-audio-library')}
                  className="px-6 py-3 bg-[#4A3B3A] text-[#FAF7F7] rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Read Full Story
                </button>
              </div>

              {firstStory.audioUrl && (
                <div className="bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl p-8 flex flex-col items-center justify-center">
                  <Headphones className="w-16 h-16 text-[#7A4F4C] mb-4" />
                  <h4 className="text-xl font-bold text-[#4A3B3A] mb-2">
                    Listen Now
                  </h4>
                  <p className="text-[#6E5F5A] text-center mb-6">
                    Press play to listen.
                  </p>
                  <div className="w-full">
                    <button
                      onClick={toggleAudio}
                      className="w-full px-8 py-4 bg-[#4A3B3A] text-[#FAF7F7] rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
                    >
                      {audioPlaying ? '⏸ Pause' : '▶ Play Audio'}
                    </button>

                    {audioPlaying && (
                      <div className="w-full bg-[#F0E6E5] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] h-2 rounded-full transition-all"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Next Steps */}
        <div className="bg-[#4A3B3A] rounded-2xl shadow-xl p-8 text-[#FAF7F7] text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-[#7A4F4C] mb-6 max-w-2xl mx-auto">
            Browse the full library of exclusive stories, manage your favorites, and track your listening history in your member dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation('/vip-audio-library')}
              className="px-8 py-3 bg-[#FAF7F7] text-[#7A4F4C] rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Story Library
            </button>
            <button
              onClick={() => setLocation('/vip-club/dashboard')}
              className="px-8 py-3 bg-[#EBD6D3]/100 text-[#4A3B3A] rounded-lg font-semibold hover:bg-[#EBD6D3]/100 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
