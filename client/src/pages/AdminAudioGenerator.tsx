import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Volume2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminAudioGenerator() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; audioUrl?: string; error?: string } | null>(null);

  const { data: blogPosts } = trpc.blog.list.useQuery({ published: true });
  const generateAudioMutation = trpc.blog.generateAudio.useMutation();

  const handleGenerateAudio = async (slug: string, title: string) => {
    setGenerating(true);
    setResult(null);

    try {
      toast.info(`Generating audio for "${title}"...`, {
        description: "This may take 30-60 seconds",
      });

      const response = await generateAudioMutation.mutateAsync({ slug });

      setResult({ success: true, audioUrl: response.audioUrl });
      toast.success("Audio generated successfully!", {
        description: "The audio player will now appear on the blog post",
      });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
      toast.error("Failed to generate audio", {
        description: error.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] py-20">
      <div className="container max-w-4xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Blog Audio Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Generate AI narration for your blog posts using ElevenLabs
          </p>
        </div>

        {result && (
          <Card className="mb-8 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4">
              {result.success ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Audio Generated Successfully!</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      The audio player will now appear on the blog post page.
                    </p>
                    {result.audioUrl && (
                      <audio controls className="w-full" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
                        <source src={result.audioUrl} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Generation Failed</h3>
                    <p className="text-sm text-gray-400">{result.error}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {blogPosts?.map((post) => (
            <Card
              key={post.id}
              className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    {post.audioUrl && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#d4af37]">
                          <Volume2 className="h-3 w-3" />
                          Audio Available
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleGenerateAudio(post.slug, post.title)}
                  disabled={generating}
                  className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-6 rounded-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : post.audioUrl ? (
                    "Regenerate Audio"
                  ) : (
                    "Generate Audio"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {!blogPosts || blogPosts.length === 0 && (
          <Card className="p-12 text-center bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
            <p className="text-gray-400">No published blog posts found.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
