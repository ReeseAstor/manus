import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Headphones, Play, Flame, Search, Filter, Music, Crown, Heart } from "lucide-react";
import { Link } from "wouter";
import { AudioPlayer } from "@/components/AudioPlayer";

export default function VipAudioLibrary() {
  const { user, isAuthenticated } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [heatLevelFilter, setHeatLevelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: membership } = trpc.vip.getMembership.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: stories, isLoading } = trpc.vip.getStories.useQuery(
    { category: categoryFilter === "all" ? undefined : categoryFilter },
    { enabled: !!membership }
  );
  const utils = trpc.useUtils();
  const { data: dashboard } = trpc.vip.getDashboard.useQuery(undefined, {
    enabled: !!membership,
  });
  const toggleLike = trpc.vip.toggleLike.useMutation({
    onSuccess: () => {
      utils.vip.getDashboard.invalidate();
    },
  });
  const likedIds = new Set(dashboard?.favorites.map((story) => story.id) ?? []);

  // Filter stories by heat level and search query
  const filteredStories = stories?.filter((story) => {
    const matchesHeatLevel = heatLevelFilter === "all" || story.heatLevel === parseInt(heatLevelFilter);
    const matchesSearch = searchQuery === "" || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHeatLevel && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7] flex items-center justify-center">
        <div className="container max-w-2xl text-center">
          <Music className="w-16 h-16 text-[#7A4F4C] mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold text-[#4A3B3A] mb-4">
            VIP Audio Library
          </h1>
          <p className="text-[#6E5F5A] mb-8">
            Sign in to access your exclusive audio story collection
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] hover:from-[#C9A3A0] hover:to-[#C9A3A0]"
            onClick={() => window.location.href = '/api/oauth/login?redirect=/vip-audio-library'}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7] flex items-center justify-center">
        <div className="container max-w-2xl text-center">
          <Crown className="w-16 h-16 text-[#7A4F4C] mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold text-[#4A3B3A] mb-4">
            VIP Membership Required
          </h1>
          <p className="text-[#6E5F5A] mb-8">
            Join the Spicy Stories Club to access our exclusive audio library
          </p>
          <Link href="/newsletter">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#C9A3A0] to-[#C9A3A0] hover:from-[#C9A3A0] hover:to-[#C9A3A0]"
            >
              View Membership Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#FAF7F7] to-[#FAF7F7]">
      {/* Header */}
      <section className="py-12 border-b border-[#E5D6D3]">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#4A3B3A] mb-2">
                Your Audio Library
              </h1>
              <p className="text-[#6E5F5A]">
                {membership.tier.name} Member • {filteredStories?.length || 0} stories available
              </p>
            </div>
            <Badge className="bg-[#4A3B3A] text-[#FAF7F7] font-bold px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              {membership.tier.name}
            </Badge>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F5A]" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F0E6E5]/50 border-[#E5D6D3] text-[#4A3B3A] placeholder:text-[#6E5F5A]"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-[#F0E6E5]/50 border-[#E5D6D3] text-[#4A3B3A]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="passion">Passion</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="reunion">Reunion</SelectItem>
                <SelectItem value="forbidden">Forbidden</SelectItem>
                <SelectItem value="first_time">First Time</SelectItem>
              </SelectContent>
            </Select>

            {/* Heat Level Filter */}
            <Select value={heatLevelFilter} onValueChange={setHeatLevelFilter}>
              <SelectTrigger className="bg-[#F0E6E5]/50 border-[#E5D6D3] text-[#4A3B3A]">
                <Flame className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Heat Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="3">🔥🔥🔥 (3/5)</SelectItem>
                <SelectItem value="4">🔥🔥🔥🔥 (4/5)</SelectItem>
                <SelectItem value="5">🔥🔥🔥🔥🔥 (5/5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-[#F0E6E5]/50 border-[#E5D6D3] animate-pulse">
                  <div className="aspect-[4/3] bg-[#EBD6D3]" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-[#EBD6D3] rounded mb-2" />
                    <div className="h-4 bg-[#EBD6D3] rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStories && filteredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="bg-[#F0E6E5]/50 border-[#E5D6D3] overflow-hidden group hover:border-[#C9A3A0]/50 transition-all">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#C9A3A0]/30 to-[#C9A3A0]/30">
                    {story.coverImage ? (
                      <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Headphones className="w-16 h-16 text-[#7A4F4C]/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#FAF7F7]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/vip-story/${story.slug}`}>
                        <Button size="lg" className="bg-[#7A4F4C] hover:bg-[#C9A3A0]">
                          <Play className="w-5 h-5 mr-2" />
                          Listen Now
                        </Button>
                      </Link>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#7A4F4C]/80">
                        <Flame className="w-3 h-3 mr-1" />
                        {story.heatLevel}/5
                      </Badge>
                    </div>
                    {story.minTier && story.minTier > 1 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#7A4F4C]/80 text-[#4A3B3A]">
                          <Crown className="w-3 h-3 mr-1" />
                          {story.minTier === 2 ? 'Silver+' : 'Gold'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-serif text-lg font-semibold text-[#4A3B3A] flex-1">{story.title}</h3>
                      <button
                        type="button"
                        aria-label={likedIds.has(story.id) ? "Remove from favorites" : "Save to favorites"}
                        onClick={() => toggleLike.mutate({ storyId: story.id })}
                        className="text-[#7A4F4C] hover:text-[#7A4F4C]"
                      >
                        <Heart className={`w-5 h-5 ${likedIds.has(story.id) ? "fill-[#7A4F4C]" : ""}`} />
                      </button>
                    </div>
                    <p className="text-[#6E5F5A] text-sm line-clamp-2 mb-3">{story.description}</p>
                    {story.audioUrl && (
                      <div className="mb-3">
                        <AudioPlayer audioUrl={story.audioUrl} storyId={story.id} showSpeedControl={false} />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[#6E5F5A]">
                        <Headphones className="w-4 h-4" />
                        <span>{story.audioDuration ? `${Math.floor(story.audioDuration / 60)} min` : 'N/A'}</span>
                      </div>
                      <Badge variant="outline" className="border-[#E5D6D3] text-[#6E5F5A]">
                        {story.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-[#6E5F5A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6E5F5A] mb-2">No stories found</h3>
              <p className="text-[#6E5F5A]">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
