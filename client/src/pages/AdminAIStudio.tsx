import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Image, Video, Music, MessageSquare, Coins, Loader2,
  Download, RefreshCw, CheckCircle, XCircle, Clock,
  Sparkles, Grid3X3, ArrowLeft, ExternalLink, Copy
} from "lucide-react";
import { Link, useLocation } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────

type Tab = "image" | "video" | "music" | "llm";
type TaskState = "waiting" | "queuing" | "generating" | "success" | "fail";

interface ActiveTask {
  taskId: string;
  type: Tab;
  state: TaskState;
  resultUrls?: string[];
  error?: string;
  startedAt: number;
}

// ─── Task Polling Hook ────────────────────────────────────────────────────

function useTaskPoller(taskId: string | null, type: Tab, onComplete: (task: ActiveTask) => void) {
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!taskId) return;

    const poll = async () => {
      try {
        let result: any;
        if (type === "music") {
          result = await utils.kie.getSunoTaskStatus.fetch({ taskId });
          // Suno has different response structure
          const data = result?.data;
          if (!data) return;
          const state = data.status;
          if (state === "SUCCESS" || state === "FIRST_SUCCESS") {
            if (pollRef.current) clearInterval(pollRef.current);
            // Extract audio URLs from Suno response
            const audioUrls: string[] = [];
            if (data.response?.sunoData) {
              for (const item of data.response.sunoData) {
                if (item.audioUrl) audioUrls.push(item.audioUrl);
              }
            }
            onComplete({ taskId, type, state: "success", resultUrls: audioUrls, startedAt: Date.now() });
          } else if (["CREATE_TASK_FAILED", "GENERATE_AUDIO_FAILED", "CALLBACK_EXCEPTION", "SENSITIVE_WORD_ERROR"].includes(state)) {
            if (pollRef.current) clearInterval(pollRef.current);
            onComplete({ taskId, type, state: "fail", error: state, startedAt: Date.now() });
          }
        } else {
          result = await utils.kie.getTaskStatus.fetch({ taskId });
          if (result.state === "success") {
            if (pollRef.current) clearInterval(pollRef.current);
            onComplete({ taskId, type, state: "success", resultUrls: result.resultUrls, startedAt: Date.now() });
          } else if (result.state === "fail") {
            if (pollRef.current) clearInterval(pollRef.current);
            onComplete({ taskId, type, state: "fail", error: result.failMsg || "Task failed", startedAt: Date.now() });
          }
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    };

    // Initial poll after 3 seconds, then every 5 seconds
    const timeout = setTimeout(() => {
      poll();
      pollRef.current = setInterval(poll, 5000);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [taskId, type]);
}

// ─── State Badge ──────────────────────────────────────────────────────────

function StateBadge({ state }: { state: TaskState | string }) {
  const config: Record<string, { color: string; icon: any; label: string }> = {
    waiting: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock, label: "Waiting" },
    queuing: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock, label: "In Queue" },
    generating: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Loader2, label: "Generating" },
    success: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle, label: "Complete" },
    fail: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle, label: "Failed" },
  };
  const c = config[state] || config.waiting;
  const Icon = c.icon;
  return (
    <Badge className={`${c.color} border gap-1.5`}>
      <Icon className={`h-3 w-3 ${state === "generating" ? "animate-spin" : ""}`} />
      {c.label}
    </Badge>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function AdminAIStudio() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("image");
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [pollingTaskId, setPollingTaskId] = useState<string | null>(null);
  const [pollingType, setPollingType] = useState<Tab>("image");

  // Credits
  const { data: creditsData, refetch: refetchCredits } = trpc.kie.getCredits.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Mutations
  const generateImageMut = trpc.kie.generateImage.useMutation();
  const generateGridMut = trpc.kie.generateImageGrid.useMutation();
  const generateVideoMut = trpc.kie.generateVideo.useMutation();
  const generateMusicMut = trpc.kie.generateMusic.useMutation();
  const geminiChatMut = trpc.kie.geminiChat.useMutation();

  // Task completion handler
  const handleTaskComplete = (task: ActiveTask) => {
    setActiveTasks(prev => prev.map(t => t.taskId === task.taskId ? task : t));
    setPollingTaskId(null);
    refetchCredits();
    if (task.state === "success") {
      toast.success("Generation complete!", { description: `Your ${task.type} asset is ready.` });
    } else {
      toast.error("Generation failed", { description: task.error });
    }
  };

  useTaskPoller(pollingTaskId, pollingType, handleTaskComplete);

  const startPolling = (taskId: string, type: Tab) => {
    const newTask: ActiveTask = { taskId, type, state: "generating", startedAt: Date.now() };
    setActiveTasks(prev => [newTask, ...prev]);
    setPollingTaskId(taskId);
    setPollingType(type);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400">Admin access required.</p>
            <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] text-black font-bold px-8 py-6 rounded-full">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "image" as Tab, label: "Images", icon: Image, color: "from-purple-500/20 to-purple-600/10" },
    { id: "video" as Tab, label: "Video", icon: Video, color: "from-blue-500/20 to-blue-600/10" },
    { id: "music" as Tab, label: "Music", icon: Music, color: "from-pink-500/20 to-pink-600/10" },
    { id: "llm" as Tab, label: "AI Chat", icon: MessageSquare, color: "from-emerald-500/20 to-emerald-600/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-[#d4af37]" />
                  AI Studio
                </h1>
                <p className="text-gray-400 mt-1">Generate images, videos, music, and AI content for newsletters</p>
              </div>
              <div className="flex items-center gap-3">
                <Card className="px-4 py-2 bg-gradient-to-r from-[#d4af37]/10 to-[#c9a961]/10 border border-[#d4af37]/30 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-[#d4af37]" />
                  <span className="text-[#d4af37] font-bold">{creditsData?.credits?.toFixed(1) ?? "..."}</span>
                  <span className="text-gray-400 text-sm">credits</span>
                </Card>
                <Button onClick={() => refetchCredits()} variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#d4af37]/20 to-[#c9a961]/20 text-[#d4af37] border border-[#d4af37]/40"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generator Panel */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === "image" && <ImageGenerator onSubmit={startPolling} generateImage={generateImageMut} generateGrid={generateGridMut} />}
                  {activeTab === "video" && <VideoGenerator onSubmit={startPolling} generateVideo={generateVideoMut} />}
                  {activeTab === "music" && <MusicGenerator onSubmit={startPolling} generateMusic={generateMusicMut} />}
                  {activeTab === "llm" && <LLMChat geminiChat={geminiChatMut} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Task History */}
            <div>
              <h3 className="font-serif text-xl font-bold text-white mb-4">Recent Tasks</h3>
              {activeTasks.length === 0 ? (
                <Card className="p-6 bg-white/5 border border-white/10 text-center">
                  <p className="text-gray-500 text-sm">No tasks yet. Generate something!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeTasks.map(task => (
                    <TaskCard key={task.taskId} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Image Generator ──────────────────────────────────────────────────────

function ImageGenerator({ onSubmit, generateImage, generateGrid }: {
  onSubmit: (taskId: string, type: Tab) => void;
  generateImage: any;
  generateGrid: any;
}) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<"nano-banana-pro" | "nano-banana-2">("nano-banana-pro");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("2k");
  const [gridMode, setGridMode] = useState(false);
  const [gridSize, setGridSize] = useState<"2x2" | "3x3">("2x2");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }
    setLoading(true);
    try {
      let result;
      if (gridMode) {
        result = await generateGrid.mutateAsync({ prompt, gridSize, aspectRatio, resolution });
      } else {
        result = await generateImage.mutateAsync({ prompt, model, aspectRatio, resolution, outputFormat: "png" });
      }
      toast.info("Image generation started!", { description: `Task ID: ${result.taskId.slice(0, 12)}...` });
      onSubmit(result.taskId, "image");
      setPrompt("");
    } catch (err: any) {
      toast.error("Failed to start generation", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/[0.02] border border-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Image className="h-5 w-5 text-purple-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">Image Generation</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Prompt</label>
          <Textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate for your newsletter..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px] focus:border-purple-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Model</label>
            <select value={model} onChange={e => setModel(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
              <option value="nano-banana-pro">Nano Banana Pro (Gemini 3 Pro)</option>
              <option value="nano-banana-2">Nano Banana 2 (Gemini 3.1 Flash)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Aspect Ratio</label>
            <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
              {["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Resolution</label>
            <select value={resolution} onChange={e => setResolution(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
              <option value="1k">1K</option>
              <option value="2k">2K (recommended)</option>
              <option value="4k">4K</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Grid Mode</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGridMode(!gridMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  gridMode ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-white/5 text-gray-400 border border-white/10"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                {gridMode ? "On" : "Off"}
              </button>
              {gridMode && (
                <select value={gridSize} onChange={e => setGridSize(e.target.value as any)}
                  className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
                  <option value="2x2">2×2 Grid</option>
                  <option value="3x3">3×3 Grid</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate} disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-6 rounded-xl"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
          {gridMode ? `Generate ${gridSize} Grid` : "Generate Image"}
        </Button>
      </div>
    </Card>
  );
}

// ─── Video Generator ──────────────────────────────────────────────────────

function VideoGenerator({ onSubmit, generateVideo }: {
  onSubmit: (taskId: string, type: Tab) => void;
  generateVideo: any;
}) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [withAudio, setWithAudio] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }
    setLoading(true);
    try {
      const result = await generateVideo.mutateAsync({ prompt, duration, aspectRatio, withAudio, mode: "single" });
      toast.info("Video generation started!", { description: `Task ID: ${result.taskId.slice(0, 12)}... (may take 1-3 minutes)` });
      onSubmit(result.taskId, "video");
      setPrompt("");
    } catch (err: any) {
      toast.error("Failed to start generation", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/[0.02] border border-blue-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Video className="h-5 w-5 text-blue-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">Video Generation</h2>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border text-xs">Kling 3.0</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Prompt</label>
          <Textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the video scene for your newsletter campaign..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px] focus:border-blue-500/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Duration (sec)</label>
            <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} max={15}
              className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Aspect Ratio</label>
            <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Audio</label>
            <button
              onClick={() => setWithAudio(!withAudio)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                withAudio ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {withAudio ? "With Audio" : "No Audio"}
            </button>
          </div>
        </div>

        <Button
          onClick={handleGenerate} disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-6 rounded-xl"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Video className="h-5 w-5 mr-2" />}
          Generate Video
        </Button>
      </div>
    </Card>
  );
}

// ─── Music Generator ──────────────────────────────────────────────────────

function MusicGenerator({ onSubmit, generateMusic }: {
  onSubmit: (taskId: string, type: Tab) => void;
  generateMusic: any;
}) {
  const [prompt, setPrompt] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [instrumental, setInstrumental] = useState(false);
  const [model, setModel] = useState("V4_5");
  const [style, setStyle] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }
    setLoading(true);
    try {
      const input: any = { prompt, customMode, instrumental, model };
      if (customMode && style) input.style = style;
      if (customMode && title) input.title = title;
      const result = await generateMusic.mutateAsync(input);
      toast.info("Music generation started!", { description: `Task ID: ${result.taskId.slice(0, 12)}... (may take 2-5 minutes)` });
      onSubmit(result.taskId, "music");
      setPrompt("");
    } catch (err: any) {
      toast.error("Failed to start generation", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-500/5 to-pink-600/[0.02] border border-pink-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-pink-500/20">
          <Music className="h-5 w-5 text-pink-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">Music Generation</h2>
        <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 border text-xs">Suno</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">
            {customMode ? "Lyrics / Prompt" : "Description"}
          </label>
          <Textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder={customMode ? "Write your lyrics here..." : "Describe the music you want (e.g., 'upbeat jazz for a book launch newsletter')"}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px] focus:border-pink-500/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Model</label>
            <select value={model} onChange={e => setModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
              <option value="V4">Suno V4</option>
              <option value="V4_5">Suno V4.5</option>
              <option value="V4_5PLUS">Suno V4.5+</option>
              <option value="V5">Suno V5</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Custom Mode</label>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                customMode ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {customMode ? "Custom" : "Simple"}
            </button>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Instrumental</label>
            <button
              onClick={() => setInstrumental(!instrumental)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                instrumental ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {instrumental ? "Yes" : "No"}
            </button>
          </div>
        </div>

        {customMode && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Style</label>
              <Input value={style} onChange={e => setStyle(e.target.value)} placeholder="e.g., Jazz, Pop, Cinematic"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Song title"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerate} disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold py-6 rounded-xl"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Music className="h-5 w-5 mr-2" />}
          Generate Music
        </Button>
      </div>
    </Card>
  );
}

// ─── LLM Chat ─────────────────────────────────────────────────────────────

function LLMChat({ geminiChat }: { geminiChat: any }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-3-flash");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful newsletter content assistant for a romance author. Help generate subject lines, email copy, social media captions, and campaign ideas.");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...newMessages,
      ];
      const result = await geminiChat.mutateAsync({ model, messages: apiMessages });
      setMessages(prev => [...prev, { role: "assistant", content: result.content }]);
    } catch (err: any) {
      toast.error("Chat failed", { description: err.message });
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-600/[0.02] border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <MessageSquare className="h-5 w-5 text-emerald-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">AI Chat</h2>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border text-xs">Gemini</Badge>
        <select value={model} onChange={e => setModel(e.target.value)}
          className="ml-auto bg-white/5 border border-white/10 text-white rounded-md px-2 py-1 text-xs">
          <option value="gemini-3-flash">Gemini 3 Flash</option>
          <option value="gemini-3-pro">Gemini 3 Pro</option>
          <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
          <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">System Prompt</label>
        <Textarea
          value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
          className="bg-white/5 border-white/10 text-gray-300 text-xs min-h-[60px] focus:border-emerald-500/50 mb-4"
        />
      </div>

      {/* Chat Messages */}
      <div className="bg-black/20 rounded-xl border border-white/5 p-4 mb-4 max-h-[400px] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">Start a conversation to generate newsletter content ideas...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/20"
                : "bg-white/5 text-gray-300 border border-white/10"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.role === "assistant" && (
                <button
                  onClick={() => { navigator.clipboard.writeText(msg.content); toast.success("Copied!"); }}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask for newsletter content ideas, subject lines, email copy..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500/50"
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-6">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </Card>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: ActiveTask }) {
  const typeConfig: Record<Tab, { icon: any; color: string }> = {
    image: { icon: Image, color: "text-purple-400" },
    video: { icon: Video, color: "text-blue-400" },
    music: { icon: Music, color: "text-pink-400" },
    llm: { icon: MessageSquare, color: "text-emerald-400" },
  };
  const config = typeConfig[task.type];
  const Icon = config.icon;

  return (
    <Card className="p-4 bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className="text-white text-sm font-medium capitalize">{task.type}</span>
        <StateBadge state={task.state} />
      </div>
      <p className="text-gray-500 text-xs font-mono mb-2">{task.taskId.slice(0, 20)}...</p>

      {task.state === "success" && task.resultUrls && task.resultUrls.length > 0 && (
        <div className="space-y-2">
          {task.resultUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              {task.type === "image" && (
                <img src={url} alt={`Result ${i + 1}`} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
              )}
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="text-[#d4af37] text-xs hover:underline flex items-center gap-1 truncate">
                <Download className="h-3 w-3 flex-shrink-0" />
                {task.type === "music" ? "Play Audio" : "Download"}
              </a>
            </div>
          ))}
        </div>
      )}

      {task.state === "fail" && task.error && (
        <p className="text-red-400 text-xs">{task.error}</p>
      )}

      {(task.state === "generating" || task.state === "waiting" || task.state === "queuing") && (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing...
        </div>
      )}
    </Card>
  );
}
