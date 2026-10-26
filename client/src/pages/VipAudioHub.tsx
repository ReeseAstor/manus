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

/** Reader-facing voice picker. Off so stock voice names are not shown. Flip to restore. */
const SHOW_READER_VOICE_LIBRARY = false;

export default function VipAudioHub() {
  const { user, loading: authLoading } = useAuth();
  const [selectedVoice, setSelectedVoice] = useState<string>("bella");

  // Fetch audio data
  const { data: voices } = trpc.audio.getVoices.useQuery(
    { includePremium: true },
    { enabled: SHOW_READER_VOICE_LIBRARY },
  );
  const { data: usage, isLoading: usageLoading } = trpc.audio.getUsage.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: library } = trpc.audio.getLibrary.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );
  const { data: characterVoices } = trpc.audio.getCharacterVoices.useQuery(undefined, {
    enabled: SHOW_READER_VOICE_LIBRARY,
  });

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
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7A4F4C]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7]">
        <div className="container py-20 text-center">
          <Lock className="h-16 w-16 text-[#7A4F4C] mx-auto mb-6" />
          <h1 className="text-4xl font-serif text-[#4A3B3A] mb-4">VIP Audio Hub</h1>
          <p className="text-[#6E5F5A] mb-8 max-w-md mx-auto">
            Sign in to open your audio library.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] hover:from-[#C9A3A0] hover:to-[#C9A3A0]">
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7]">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A3A0]/20 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="text-center mb-12">
            <Badge className="bg-[#7A4F4C]/20 text-[#7A4F4C] border-[#C9A3A0]/30 mb-4">
              <Headphones className="h-3 w-3 mr-1" />
              VIP Audio Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif text-[#4A3B3A] mb-4">
              Your Personal <span className="text-[#7A4F4C] ">Audio Library</span>
            </h1>
            <p className="text-[#6E5F5A] max-w-2xl mx-auto">
              Your stories, ready to play.
            </p>
          </div>

          {/* Usage Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7A4F4C]/20 rounded-lg">
                    <Clock className="h-5 w-5 text-[#7A4F4C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5F5A]">Minutes Used</p>
                    <p className="text-xl font-bold text-[#4A3B3A]">
                      {usageLoading ? "..." : usage?.usage.minutesUsed || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7A4F4C]/20 rounded-lg">
                    <Zap className="h-5 w-5 text-[#7A4F4C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5F5A]">Minutes Remaining</p>
                    <p className="text-xl font-bold text-[#4A3B3A]">
                      {usageLoading ? "..." : usage?.usage.minutesRemaining || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7A4F4C]/20 rounded-lg">
                    <Music className="h-5 w-5 text-[#7A4F4C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5F5A]">Audio added this month</p>
                    <p className="text-xl font-bold text-[#4A3B3A]">
                      {usageLoading ? "..." : usage?.usage.generationsThisMonth || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7A4F4C]/20 rounded-lg">
                    <Crown className="h-5 w-5 text-[#7A4F4C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5F5A]">Your Tier</p>
                    <p className="text-xl font-bold text-[#4A3B3A] capitalize">
                      {usageLoading ? "..." : usage?.tier || "Free"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Progress */}
          {usage && (
            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20 mb-12">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#6E5F5A]">Monthly Usage</span>
                  <span className="text-sm text-[#7A4F4C]">
                    {usage.usage.minutesUsed} / {usage.limits.monthlyMinutes === 999999 ? "∞" : usage.limits.monthlyMinutes} minutes
                  </span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                {usagePercent > 80 && usage.tier !== "gold" && (
                  <p className="text-xs text-[#7A4F4C] mt-2">
                    ⚠️ Running low on minutes! <Link href="/newsletter" className="underline">Upgrade your plan</Link> for more.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Voice Library and Character Voices stay in source. SHOW_READER_VOICE_LIBRARY restores them. */}
      {SHOW_READER_VOICE_LIBRARY && (
      <>
      <section className="py-12 border-t border-[#C9A3A0]/10">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-[#4A3B3A] mb-2">Voice Library</h2>
              <p className="text-[#6E5F5A]">Choose the perfect voice for your stories</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {voices?.all.map((voice) => (
              <Card
                key={voice.id}
                className={`bg-[#FAF7F7]/50 border-[#C9A3A0]/20 hover:border-[#C9A3A0]/40 transition-all cursor-pointer ${
                  selectedVoice === voice.id ? "ring-2 ring-[#C9A3A0]" : ""
                }`}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-[#4A3B3A]">{voice.name}</h3>
                      <p className="text-xs text-[#6E5F5A] capitalize">{voice.gender} • {voice.style}</p>
                    </div>
                    {voice.isPremium && (
                      <Badge className="bg-[#4A3B3A] text-[#FAF7F7] text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#6E5F5A] mb-3">{voice.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#C9A3A0]/30 text-[#7A4F4C] hover:bg-[#7A4F4C]/20"
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
      <section className="py-12 border-t border-[#C9A3A0]/10">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-[#4A3B3A] mb-2">Character Voices</h2>
            <p className="text-[#6E5F5A]">Each character has a perfectly matched voice</p>
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
                <Card key={bookTitle} className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#7A4F4C]">
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
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A3A0]/30 to-[#C9A3A0]/30 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#7A4F4C]">
                                  {mapping.characterName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-[#4A3B3A] font-medium">{mapping.characterName}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="border-[#C9A3A0]/30 text-[#7A4F4C] text-xs">
                                <Mic className="h-3 w-3 mr-1" />
                                {defaultVoice?.name || mapping.defaultVoiceId}
                              </Badge>
                              {premiumVoice && (
                                <Badge className="bg-gradient-to-r from-[#C9A3A0]/20 to-[#C9A3A0]/20 text-[#7A4F4C] border border-[#C9A3A0]/30 text-xs">
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
      </>
      )}

      {/* Recent Audio Library */}
      <section className="py-12 border-t border-[#C9A3A0]/10">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-[#4A3B3A] mb-2">Your Audio Library</h2>
              <p className="text-[#6E5F5A]">Recently added</p>
            </div>
          </div>

          {library && library.length > 0 ? (
            <div className="space-y-4">
              {library.map((audio) => (
                <Card key={audio.id} className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-[#4A3B3A] mb-1">{audio.title}</h3>
                        <p className="text-xs text-[#6E5F5A]">
                          {Math.round(audio.durationSeconds / 60)} min • {new Date(audio.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <AudioPlayer
                        audioUrl={audio.audioUrl}
                        storyId={/^\d+$/.test(audio.storyId ?? "") ? Number(audio.storyId) : undefined}
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
            <Card className="bg-[#FAF7F7]/50 border-[#C9A3A0]/20">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-[#7A4F4C] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#4A3B3A] mb-2">No Audio Yet</h3>
                <p className="text-[#6E5F5A] mb-6">
                  Pick a story from the library to add it here.
                </p>
                <Link href="/newsletter">
                  <Button className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0]">
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
        <section className="py-12 border-t border-[#C9A3A0]/10">
          <div className="container">
            <Card className="bg-gradient-to-r from-[#C9A3A0]/30 to-[#C9A3A0]/30 border-[#C9A3A0]/30">
              <CardContent className="p-8 text-center">
                <Crown className="h-12 w-12 text-[#7A4F4C] mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-[#4A3B3A] mb-2">Unlock Premium Features</h2>
                <p className="text-[#6E5F5A] mb-6 max-w-md mx-auto">
                  Gold has no monthly audio limit and adds the Gold-only stories.
                </p>
                <Link href="/newsletter">
                  <Button className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] hover:from-[#C9A3A0] hover:to-[#C9A3A0]">
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
