import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Loader2, Copy, ArrowLeft, ChevronDown, ChevronUp,
  BookOpen, Lock, Building2, FileText, PenTool,
  Scissors, Search, Heart, ClipboardCheck, Package,
  Sparkles, Download, RotateCcw
} from "lucide-react";
import { Link } from "wouter";
import { workflows, workflowCategories, productionPhases, type Workflow } from "@/data/workflows";

const categoryIcons: Record<string, any> = {
  control: Lock,
  architecture: Building2,
  drafting: PenTool,
  editing: Scissors,
  audit: Search,
  packaging: Package,
};

const categoryColors: Record<string, string> = {
  control: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  architecture: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  drafting: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  editing: "bg-red-500/20 text-red-300 border-red-500/30",
  audit: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  packaging: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const categoryBgColors: Record<string, string> = {
  control: "from-amber-900/40 to-amber-950/60",
  architecture: "from-blue-900/40 to-blue-950/60",
  drafting: "from-emerald-900/40 to-emerald-950/60",
  editing: "from-red-900/40 to-red-950/60",
  audit: "from-purple-900/40 to-purple-950/60",
  packaging: "from-orange-900/40 to-orange-950/60",
};

export default function WritingStudio() {
  const { user, loading: authLoading } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [history, setHistory] = useState<{ workflow: string; input: string; output: string; timestamp: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const runWorkflow = trpc.workflow.run.useMutation();

  useEffect(() => {
    if (outputText && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [outputText]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A962]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-[#12121a] border-[#C9A962]/20 p-8 text-center">
          <Lock className="w-12 h-12 text-[#C9A962] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-white mb-2">Writing Studio</h2>
          <p className="text-gray-400 mb-6">
            This tool is exclusively available to Reese Astor. Please log in with your admin account to access the Hudson Dynasty AI Workflow System.
          </p>
          <Link href="/auth/login">
            <Button className="bg-[#C9A962] hover:bg-[#B8954F] text-black font-semibold">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleRunWorkflow = async () => {
    if (!selectedWorkflow || !inputText.trim()) {
      toast.error("Please enter text to process");
      return;
    }

    setIsRunning(true);
    setOutputText("");

    try {
      const userPrompt = selectedWorkflow.userPromptTemplate.replace("{{INPUT}}", inputText);
      const payload = {
        workflowId: selectedWorkflow.id,
        systemPrompt: selectedWorkflow.systemPrompt,
        userPrompt,
      };

      let output: string;
      let streamed = false;

      try {
        const res = await fetch("/api/ai/workflow-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok || !res.body) throw new Error(`stream failed (${res.status})`);
        streamed = true;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setOutputText(accumulated);
        }
        const trailing = decoder.decode();
        if (trailing) {
          accumulated += trailing;
          setOutputText(accumulated);
        }
        output = accumulated;
        if (output.includes("[Error]")) {
          throw new Error(output.split("[Error]")[1]?.trim() || "Stream failed");
        }
      } catch {
        if (streamed) throw new Error("Stream interrupted. Please try again.");
        const result = await runWorkflow.mutateAsync(payload);
        output = result.output;
      }

      setOutputText(output);
      setHistory(prev => [{
        workflow: selectedWorkflow.title,
        input: inputText.slice(0, 200) + (inputText.length > 200 ? "..." : ""),
        output: output.slice(0, 300) + (output.length > 300 ? "..." : ""),
        timestamp: new Date().toISOString(),
      }, ...prev].slice(0, 20));

      toast.success(`${selectedWorkflow.shortTitle} workflow complete`);
    } catch (error: any) {
      toast.error(error.message || "Failed to run workflow");
    } finally {
      setIsRunning(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Output copied to clipboard");
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedWorkflow?.id || "workflow"}-output.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Workflow Selection View ──────────────────────────────────────────
  if (!selectedWorkflow) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Admin
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A962] to-[#8B7340] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif text-white">Writing Studio</h1>
                <p className="text-gray-400 text-sm">Hudson Dynasty AI Workflow System</p>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
              Ten production workflows that take a book from concept to KDP-ready manuscript. 
              Each workflow enforces canon, prevents AI drift, and maintains series continuity.
            </p>
          </div>
        </div>

        {/* Production Pipeline */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Phase Accordion */}
          <div className="space-y-3">
            {productionPhases.map((phase) => {
              const phaseWorkflows = workflows.filter(w => (phase.workflows as readonly number[]).includes(w.number));
              const isExpanded = expandedPhase === phase.phase || expandedPhase === null;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[#1e1e2e] bg-[#12121a] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#1a1a2a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#C9A962] font-mono text-xs tracking-wider uppercase">
                        {phase.phase}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {phaseWorkflows.length} workflow{phaseWorkflows.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {phaseWorkflows.map((workflow) => {
                            const Icon = categoryIcons[workflow.category] || FileText;
                            return (
                              <motion.button
                                key={workflow.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setSelectedWorkflow(workflow)}
                                className={`text-left p-5 rounded-lg border border-[#2a2a3a] bg-gradient-to-br ${categoryBgColors[workflow.category]} hover:border-[#C9A962]/40 transition-all group`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">
                                    <Icon className="w-5 h-5 text-[#C9A962]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[#C9A962] font-mono text-xs">
                                        #{workflow.number}
                                      </span>
                                      <Badge className={`text-[10px] px-1.5 py-0 border ${categoryColors[workflow.category]}`}>
                                        {workflow.category}
                                      </Badge>
                                    </div>
                                    <h3 className="text-white font-semibold text-sm group-hover:text-[#C9A962] transition-colors">
                                      {workflow.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                                      {workflow.description}
                                    </p>
                                  </div>
                                  <Sparkles className="w-4 h-4 text-[#C9A962]/0 group-hover:text-[#C9A962]/60 transition-all mt-1" />
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Reference */}
          <div className="mt-10 rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6">
            <h3 className="text-white font-serif text-lg mb-4">Production Order</h3>
            <div className="flex flex-wrap gap-2">
              {productionPhases.map((phase, i) => (
                <div key={phase.phase} className="flex items-center gap-2">
                  <span className="text-[#C9A962] font-mono text-xs">{phase.phase}</span>
                  {i < productionPhases.length - 1 && (
                    <span className="text-gray-600">→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { role: "AI 1", label: "Architect", desc: "Developmental editor" },
                { role: "AI 2", label: "Draft Writer", desc: "Scene execution" },
                { role: "AI 3", label: "Line Editor", desc: "Prose quality" },
                { role: "AI 4", label: "Continuity", desc: "Canon & logic" },
                { role: "AI 5", label: "Romance", desc: "Chemistry & heat" },
              ].map((ai) => (
                <div key={ai.role} className="p-3 rounded-lg bg-[#1a1a2a] border border-[#2a2a3a]">
                  <div className="text-[#C9A962] font-mono text-xs mb-1">{ai.role}</div>
                  <div className="text-white text-sm font-medium">{ai.label}</div>
                  <div className="text-gray-500 text-xs">{ai.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Workflow Execution View ──────────────────────────────────────────
  const Icon = categoryIcons[selectedWorkflow.category] || FileText;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedWorkflow(null);
              setOutputText("");
              setInputText("");
            }}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> All Workflows
          </Button>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryBgColors[selectedWorkflow.category]} border border-[#2a2a3a] flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-[#C9A962]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#C9A962] font-mono text-xs">#{selectedWorkflow.number}</span>
              <Badge className={`text-[10px] px-1.5 py-0 border ${categoryColors[selectedWorkflow.category]}`}>
                {selectedWorkflow.category}
              </Badge>
              <span className="text-gray-500 text-xs">{selectedWorkflow.phase}</span>
            </div>
            <h1 className="text-2xl font-serif text-white">{selectedWorkflow.title}</h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">{selectedWorkflow.description}</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {selectedWorkflow.inputLabel}
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedWorkflow.inputPlaceholder}
              className="min-h-[250px] bg-[#12121a] border-[#2a2a3a] text-white placeholder:text-gray-600 focus:border-[#C9A962]/50 focus:ring-[#C9A962]/20 font-mono text-sm leading-relaxed resize-y"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500 text-xs">
                {inputText.length.toLocaleString()} characters · ~{Math.ceil(inputText.split(/\s+/).filter(Boolean).length)} words
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputText("")}
                  className="text-gray-500 hover:text-white text-xs"
                  disabled={!inputText || isRunning}
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Clear
                </Button>
                <Button
                  onClick={handleRunWorkflow}
                  disabled={!inputText.trim() || isRunning}
                  className="bg-[#C9A962] hover:bg-[#B8954F] text-black font-semibold px-6"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Run {selectedWorkflow.shortTitle}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <AnimatePresence>
            {(outputText || isRunning) && (
              <motion.div
                ref={outputRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-serif text-lg">Output</h3>
                  {outputText && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyOutput}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadOutput}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-[#2a2a3a] bg-[#12121a] p-6 min-h-[200px]">
                  {isRunning && !outputText ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#C9A962] mb-3" />
                      <p className="text-sm">Running {selectedWorkflow.title}...</p>
                      <p className="text-xs text-gray-500 mt-1">This may take 30-60 seconds for complex workflows</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#C9A962] prose-headings:font-serif prose-strong:text-white prose-code:text-[#C9A962] prose-code:bg-[#1a1a2a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a2a] prose-pre:border prose-pre:border-[#2a2a3a] prose-td:border-[#2a2a3a] prose-th:border-[#2a2a3a] prose-th:text-[#C9A962]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {outputText}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session History */}
          {history.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" />
                Session History ({history.length})
                {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 space-y-2"
                  >
                    {history.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#C9A962] font-medium">{item.workflow}</span>
                          <span className="text-gray-500">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-400 line-clamp-1">{item.input}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
