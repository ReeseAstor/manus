import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Headphones,
  Mic,
  Clock,
  Zap,
  Crown,
  Play,
  Music,
  Sparkles,
  ArrowRight,
  Volume2,
  Loader2,
  Lock,
} from "lucide-react";

export default function VipAudioHub() {
  const { user, loading: authLoading } = useAuth();
  const [selectedVoice, setSelectedVoice] = useState<string>("bella");

  // Fetch audio data
  const { data: voices } = trpc.audio.getVoices.useQuery({ includePremium: true });
  const { data: usage, isLoading: usageLoading } = trpc.audio.getUsage.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: library } = trpc.audio.getLibrary.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );
  const { data: characterVoices } = trpc.audio.getCharacterVoices.useQuery();

  // Voice preview mutation
  const previewVoice = trpc.audio.previewVoice.useMutation();

  const handlePreviewVoice = async (voiceId: string) => {
    try {
      const result = await previewVoice.mutateAsync({ voiceId });
      // Play the preview audio
      const audio = new Audio(result.audioUrl);
      audio.play();
    } catch (error) {
      console.error("Failed to preview voice:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container py-20 text-center">
          <Lock className="h-16 w-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl font-serif text-white mb-4">VIP Audio Hub</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Sign in to open your audio library.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
              Sign In to Access
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const usagePercent = usage
    ? Math.min(100, (usage.usage.minutesUsed / usage.limits.monthlyMinutes) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="text-center mb-12">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
              <Headphones className="h-3 w-3 mr-1" />
              VIP Audio Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-pink-400">Audio Library</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Your stories, ready to play.
            </p>
          </div>

          {/* Usage Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-slate-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Minutes Used</p>
                    <p className="text-xl font-bold text-white">
                      {usageLoading ? "..." : usage?.usage.minutesUsed || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Minutes Remaining</p>
                    <p className="text-xl font-bold text-white">
                      {usageLoading ? "..." : usage?.usage.minutesRemaining || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Music className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Stories in audio</p>
                    <p className="text-xl font-bold text-white">
                      {usageLoading ? "..." : usage?.usage.generationsThisMonth || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Crown className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Your Tier</p>
                    <p className="text-xl font-bold text-white capitalize">
                      {usageLoading ? "..." : usage?.tier || "Free"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Progress */}
          {usage && (
            <Card className="bg-slate-900/50 border-amber-500/20 mb-12">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Monthly Usage</span>
                  <span className="text-sm text-amber-400">
                    {usage.usage.minutesUsed} / {usage.limits.monthlyMinutes === 999999 ? "∞" : usage.limits.monthlyMinutes} minutes
                  </span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                {usagePercent > 80 && usage.tier !== "gold" && (
                  <p className="text-xs text-amber-400 mt-2">
                    ⚠️ Running low on minutes! <Link href="/vip-club" className="underline">Upgrade your plan</Link> for more.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Voice Library */}
      <section className="py-12 border-t border-amber-500/10">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">Voice Library</h2>
              <p className="text-slate-400">Choose the perfect voice for your stories</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {voices?.all.map((voice) => (
              <Card
                key={voice.id}
                className={`bg-slate-900/50 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer ${
                  selectedVoice === voice.id ? "ring-2 ring-amber-500" : ""
                }`}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{voice.name}</h3>
                      <p className="text-xs text-slate-400 capitalize">{voice.gender} • {voice.style}</p>
                    </div>
                    {voice.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{voice.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewVoice(voice.id);
                    }}
                    disabled={previewVoice.isPending}
                  >
                    {previewVoice.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4 mr-2" />
                    )}
                    Preview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Character Voice Mappings */}
      <section className="py-12 border-t border-amber-500/10">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-white mb-2">Character Voices</h2>
            <p className="text-slate-400">Each character has a perfectly matched voice</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Group characters by book */}
            {characterVoices && (() => {
              // Group by book title
              const bookGroups: Record<string, typeof characterVoices> = {};
              characterVoices.forEach((mapping) => {
                if (!bookGroups[mapping.bookTitle]) {
                  bookGroups[mapping.bookTitle] = [];
                }
                bookGroups[mapping.bookTitle].push(mapping);
              });
              
              return Object.entries(bookGroups).map(([bookTitle, characters]) => (
                <Card key={bookTitle} className="bg-slate-900/50 border-amber-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-amber-300">
                      {bookTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {characters.map((mapping) => {
                        const defaultVoice = voices?.all.find(v => v.id === mapping.defaultVoiceId);
                        const premiumVoice = voices?.all.find(v => v.id === mapping.premiumVoiceId);
                        return (
                          <div key={mapping.characterName} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-pink-500/30 flex items-center justify-center">
                                <span className="text-xs font-bold text-amber-300">
                                  {mapping.characterName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-white font-medium">{mapping.characterName}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-xs">
                                <Mic className="h-3 w-3 mr-1" />
                                {defaultVoice?.name || mapping.defaultVoiceId}
                              </Badge>
                              {premiumVoice && (
                                <Badge className="bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30 text-xs">
                                  <Crown className="h-3 w-3 mr-1" />
                                  {premiumVoice.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Recent Audio Library */}
      <section className="py-12 border-t border-amber-500/10">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">Your Audio Library</h2>
              <p className="text-slate-400">Recently added</p>
            </div>
          </div>

          {library && library.length > 0 ? (
            <div className="space-y-4">
              {library.map((audio) => (
                <Card key={audio.id} className="bg-slate-900/50 border-amber-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{audio.title}</h3>
                        <p className="text-xs text-slate-400">
                          {Math.round(audio.durationSeconds / 60)} min • {new Date(audio.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <AudioPlayer
                        audioUrl={audio.audioUrl}
                        canDownload={usage?.limits.canDownload}
                        showSpeedControl={false}
                        className="flex-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-amber-500/20">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Audio Yet</h3>
                <p className="text-slate-400 mb-6">
                  Pick a story from the library to add it here.
                </p>
                <Link href="/vip-club">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-600">
                    Browse Stories
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Upgrade CTA */}
      {usage?.tier !== "gold" && (
        <section className="py-12 border-t border-amber-500/10">
          <div className="container">
            <Card className="bg-gradient-to-r from-amber-900/30 to-pink-900/30 border-amber-500/30">
              <CardContent className="p-8 text-center">
                <Crown className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-white mb-2">Unlock Premium Features</h2>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Gold has no monthly audio limit and adds the Gold-only stories.
                </p>
                <Link href="/vip-club">
                  <Button className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600">
                    Upgrade to Gold
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
