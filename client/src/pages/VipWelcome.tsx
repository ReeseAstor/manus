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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to the VIP Spicy Stories Club!
          </h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Your VIP membership is active. Your first steamy story is below, with audio.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* What's Included Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              What's Included in Your Membership
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <BookOpen className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exclusive Stories
              </h3>
              <p className="text-gray-700">
                Access to steamy bonus scenes featuring your favorite Manhattan Money Kings couples
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Headphones className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Audio Included
              </h3>
              <p className="text-gray-700">
                Every story has an audio version you can play here
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl">
              <Sparkles className="w-10 h-10 text-rose-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                New Content Monthly
              </h3>
              <p className="text-gray-700">
                Fresh steamy stories added every month, plus deleted scenes and bonus content
              </p>
            </div>
          </div>
        </div>

        {/* First Story Showcase */}
        {isLoadingStory ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Start with Your First Story
            </h2>
            <div className="flex flex-col items-center justify-center py-12">
              {/* Animated Loading Spinner */}
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <Headphones className="absolute inset-0 m-auto w-8 h-8 text-pink-600 animate-pulse" />
              </div>
              <p className="text-gray-600 text-lg animate-pulse">Loading your first steamy story...</p>
              <div className="flex gap-1 mt-4">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        ) : firstStory ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Start with Your First Story
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="inline-block px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold mb-4">
                  {firstStory.category?.toUpperCase() || 'ROMANCE'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {firstStory.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {firstStory.characters || 'Manhattan Money Kings'}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: firstStory.heatLevel || 4 }).map((_, i) => (
                    <span key={i} className="text-orange-500">🔥</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 line-clamp-4">
                  {firstStory.content?.substring(0, 200)}...
                </p>
                <button
                  onClick={() => setLocation('/vip-audio-library')}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Read Full Story
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 flex flex-col items-center justify-center">
                <Headphones className="w-16 h-16 text-purple-600 mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Listen Now
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  Press play to listen.
                </p>

                {firstStory.audioUrl && (
                  <div className="w-full">
                    <button
                      onClick={toggleAudio}
                      className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
                    >
                      {audioPlaying ? '⏸ Pause' : '▶ Play Audio'}
                    </button>

                    {audioPlaying && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Browse the full library of exclusive stories, manage your favorites, and track your listening history in your member dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation('/vip-audio-library')}
              className="px-8 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Story Library
            </button>
            <button
              onClick={() => setLocation('/vip-club/dashboard')}
              className="px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
