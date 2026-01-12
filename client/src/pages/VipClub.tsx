import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Crown, Headphones, Heart, Sparkles, Star, Check, Play, Lock, Flame, Music } from "lucide-react";

export default function VipClub() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  const { data: tiers, isLoading: tiersLoading } = trpc.vip.getTiers.useQuery();
  const { data: membership } = trpc.vip.getMembership.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: featuredStories } = trpc.vip.getFeaturedStories.useQuery();
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});
  const [audioProgress, setAudioProgress] = useState<{ [key: number]: number }>({});

  const handlePreviewPlay = (storyId: number, previewUrl: string) => {
    // Stop all other audio
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.pause();
    });
    
    // Play this audio
    if (!audioRefs.current[storyId]) {
      const audio = new Audio(previewUrl);
      
      // Set up duration listener
      audio.addEventListener('loadedmetadata', () => {
        setAudioDurations(prev => ({ ...prev, [storyId]: Math.ceil(audio.duration) }));
      });
      
      // Set up progress listener
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(prev => ({ ...prev, [storyId]: progress }));
      });
      
      // Reset progress when ended
      audio.addEventListener('ended', () => {
        setAudioProgress(prev => ({ ...prev, [storyId]: 0 }));
      });
      
      audioRefs.current[storyId] = audio;
    }
    audioRefs.current[storyId]?.play();
  };

  const handlePreviewStop = (storyId: number) => {
    audioRefs.current[storyId]?.pause();
    if (audioRefs.current[storyId]) {
      audioRefs.current[storyId]!.currentTime = 0;
    }
    setAudioProgress(prev => ({ ...prev, [storyId]: 0 }));
  };
  
  const subscribeMutation = trpc.vip.subscribe.useMutation({
    onSuccess: (data: { checkoutUrl: string | null }) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });

  const handleSubscribe = (tierSlug: string) => {
    if (!isAuthenticated) {
      // Redirect to Supabase Auth login
      window.location.href = `/auth/login?redirect=/vip-club`;
      return;
    }
    subscribeMutation.mutate({ tierSlug });
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return <Crown className="w-8 h-8 text-amber-600" />;
      case 'silver': return <Crown className="w-8 h-8 text-gray-400" />;
      case 'gold': return <Crown className="w-8 h-8 text-yellow-400" />;
      default: return <Crown className="w-8 h-8" />;
    }
  };

  const getTierGradient = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return 'from-amber-900/20 to-amber-700/10 border-amber-600/30';
      case 'silver': return 'from-gray-700/20 to-gray-500/10 border-gray-400/30';
      case 'gold': return 'from-yellow-900/20 to-yellow-600/10 border-yellow-500/30 ring-2 ring-yellow-500/20';
      default: return 'from-gray-800 to-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/manhattan-night.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 px-4 py-1.5">
              <Flame className="w-4 h-4 mr-2" />
              Exclusive VIP Access
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Spicy Stories</span> Club
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Unlock exclusive steamy audio stories featuring your favorite Manhattan Money Kings characters. 
              Listen to professionally narrated scenes that go beyond the books.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Headphones className="w-5 h-5 text-pink-400" />
                <span>Professional Narration</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Heart className="w-5 h-5 text-pink-400" />
                <span>Exclusive Content</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>New Stories Monthly</span>
              </div>
            </div>
            
            {/* Listen to Sample Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="outline"
                className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 gap-2"
                onClick={() => document.querySelector('#featured-stories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5" />
                Listen to Audio Samples
                <span className="text-xs text-gray-400">(Hover over stories below)</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Membership Status */}
      {membership && (
        <section className="py-8 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border-y border-pink-500/20">
          <div className="container">
            <div className="flex items-center justify-center gap-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="text-lg text-white">
                You're a <strong className="text-yellow-400">{membership.tier.name}</strong> member!
              </span>
              <Link href="/vip-audio">
                <Button variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
                  <Music className="w-4 h-4 mr-2" />
                  Open Audio Hub
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Membership Tiers */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Choose Your VIP Experience
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the membership tier that's right for you. All plans include instant access to our steamy audio story library.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiersLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                  <CardHeader className="h-40" />
                  <CardContent className="h-60" />
                  <CardFooter className="h-20" />
                </Card>
              ))
            ) : (
              tiers?.map((tier: { id: number; name: string; slug: string; description: string; price: number; features: string; storiesPerMonth: number | null; customStoriesAllowed: boolean | null; personalizedMessages: boolean | null; displayOrder: number | null; active: boolean }) => (
                <Card 
                  key={tier.id} 
                  className={`relative bg-gradient-to-b ${getTierGradient(tier.name)} border transition-all duration-300 hover:scale-105`}
                >
                  {tier.name === 'Gold' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto mb-4">
                      {getTierIcon(tier.name)}
                    </div>
                    <CardTitle className="text-2xl font-serif text-white">{tier.name}</CardTitle>
                    <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">${(tier.price / 100).toFixed(2)}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    
                    <ul className="space-y-3 text-left">
                      {JSON.parse(tier.features as string).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        tier.name === 'Gold' 
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400' 
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400'
                      }`}
                      onClick={() => handleSubscribe(tier.slug)}
                      disabled={subscribeMutation.isPending || (membership?.tier.id === tier.id)}
                    >
                      {membership?.tier.id === tier.id ? 'Current Plan' : 'Join Now'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Stories Preview */}
      <section id="featured-stories" className="py-20 bg-gray-900/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Featured Steamy Stories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get a taste of what awaits you in our exclusive library. These professionally narrated stories 
              feature your favorite characters in scenes that go beyond the books.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredStories?.map((story: { id: number; title: string; slug: string; description: string; excerpt: string | null; coverImage: string | null; category: string; heatLevel: number | null; audioDuration: number | null; playCount: number | null; previewAudioUrl?: string | null }) => (
              <Card key={story.id} className="bg-gray-800/50 border-gray-700 overflow-hidden group">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-900/30 to-rose-900/30">
                  {story.coverImage ? (
                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Headphones className="w-16 h-16 text-pink-500/50" />
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseEnter={() => story.previewAudioUrl && !membership && handlePreviewPlay(story.id, story.previewAudioUrl)}
                    onMouseLeave={() => story.previewAudioUrl && !membership && handlePreviewStop(story.id)}
                  >
                    {membership ? (
                      <Button size="lg" className="bg-pink-500 hover:bg-pink-400">
                        <Play className="w-5 h-5 mr-2" />
                        Listen Now
                      </Button>
                    ) : story.previewAudioUrl ? (
                      <div className="text-center">
                        <div className="relative">
                          <Headphones className="w-12 h-12 text-pink-400 mx-auto mb-2 animate-pulse" />
                          <Play className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <span className="text-white font-medium">Hover to Preview</span>
                        <p className="text-gray-400 text-sm mt-1">
                          {audioDurations[story.id] ? `${audioDurations[story.id]}s sample` : 'Loading...'}
                        </p>
                        {/* Progress Bar */}
                        {audioProgress[story.id] > 0 && (
                          <div className="w-32 h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-pink-400 transition-all duration-100"
                              style={{ width: `${audioProgress[story.id]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-300">VIP Members Only</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-pink-500/80">
                      <Flame className="w-3 h-3 mr-1" />
                      {story.heatLevel}/5
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-white mb-2">{story.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{story.description}</p>
                  {story.audioDuration && (
                    <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                      <Headphones className="w-4 h-4" />
                      <span>{Math.floor(story.audioDuration / 60)} min</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {!membership && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
                onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Unlock All Stories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                What's Inside the VIP Club?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Professional Audio Narration</h3>
                <p className="text-gray-400">
                  Every story is brought to life with high-quality voice narration using cutting-edge AI technology. 
                  Listen anywhere, anytime.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Favorite Characters</h3>
                <p className="text-gray-400">
                  Exclusive stories featuring Elena & David, Sarah & Michael, Sophia & Dominic, and more 
                  from the Manhattan Money Kings universe.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Steamy Scenes Beyond the Books</h3>
                <p className="text-gray-400">
                  Discover what happens after the fade-to-black moments. Extended scenes, deleted chapters, 
                  and exclusive encounters.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">New Content Monthly</h3>
                <p className="text-gray-400">
                  Fresh stories added every month. Gold members can even request custom stories 
                  tailored to their fantasies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Exclusive Content      {/* Pricing Tiers */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
              Exclusive Previews
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Taste What Awaits You
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get a glimpse of the exclusive steamy content, bonus chapters, and behind-the-scenes material available to VIP members.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Preview Card 1: Story Excerpt */}
            <Card className="bg-gradient-to-br from-pink-950/50 to-purple-950/30 border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    Story Excerpt
                  </Badge>
                  <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <CardTitle className="text-white text-xl">
                  "The Boardroom Confession"
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Elena & David • Heat Level: 🔥🔥🔥🔥
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950/50 p-4 rounded-lg border border-pink-500/10 mb-4">
                  <p className="text-gray-300 text-sm italic leading-relaxed">
                    "David's hand found the small of my back, his touch sending electricity through the silk of my dress. 'We shouldn't,' I whispered, even as I leaned into him. His gilded eyes darkened. 'Then tell me to stop.' But we both knew I wouldn't..."
                  </p>
                  <div className="mt-3 text-center">
                    <span className="text-pink-400 text-xs font-semibold">— Continues for 2,400 words —</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4 text-pink-400" />
                  <span>Full story available to Bronze+ members</span>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card 2: Audio Sample */}
            <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Audio Preview
                  </Badge>
                  <Headphones className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle className="text-white text-xl">
                  "Midnight Confessions"
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Sarah & Michael • Narrated by Bella
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950/50 p-6 rounded-lg border border-purple-500/10 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <button className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-lg">
                        <Play className="w-8 h-8" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>0:00</span>
                    <div className="flex-1 mx-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                    <span>0:15</span>
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-3">15-second sample</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>Full 8-minute audio for Silver+ members</span>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card 3: Bonus Content */}
            <Card className="bg-gradient-to-br from-amber-950/50 to-yellow-950/30 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                    Bonus Content
                  </Badge>
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <CardTitle className="text-white text-xl">
                  Deleted Scene Collection
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Behind the Books • Exclusive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-950/50 p-3 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2"></div>
                      <div>
                        <p className="text-white text-sm font-medium">"The First Kiss" (Deleted Chapter)</p>
                        <p className="text-gray-400 text-xs mt-1">What really happened at the charity gala...</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-950/50 p-3 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2"></div>
                      <div>
                        <p className="text-white text-sm font-medium">Character Interview: Elena</p>
                        <p className="text-gray-400 text-xs mt-1">Exclusive Q&A about her relationship with David</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-950/50 p-3 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2"></div>
                      <div>
                        <p className="text-white text-sm font-medium">Author's Notes & Insights</p>
                        <p className="text-gray-400 text-xs mt-1">Behind-the-scenes writing process</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>12+ bonus items for Gold members</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Crown className="w-5 h-5 mr-2" />
              Unlock All Exclusive Content
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Join thousands of readers enjoying exclusive steamy content
            </p>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">       <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Ready to Unlock Your Fantasies?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the Spicy Stories Club today and get instant access to our library of 
              exclusive steamy audio content.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-lg px-8 py-6"
              onClick={() => handleSubscribe('bronze')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Your VIP Membership
            </Button>
            <p className="text-gray-500 mt-4 text-sm">
              Cancel anytime. No commitment required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
