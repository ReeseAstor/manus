import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ArrowLeft, Save, Send, Eye } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterEditor() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/newsletter/:id");
  const newsletterId = params?.id && params.id !== "new" ? parseInt(params.id) : null;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { data: newsletter, isLoading } = trpc.newsletters.getById.useQuery(
    { id: newsletterId! },
    { enabled: !!newsletterId }
  );

  const createMutation = trpc.newsletters.create.useMutation({
    onSuccess: () => {
      alert("Newsletter created successfully!");
      setLocation("/admin/newsletters");
    },
    onError: (error) => {
      alert(error.message || "Failed to create newsletter");
    },
  });

  const updateMutation = trpc.newsletters.update.useMutation({
    onSuccess: () => {
      alert("Newsletter updated successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to update newsletter");
    },
  });

  useEffect(() => {
    if (newsletter) {
      setTitle(newsletter.title);
      setSubject(newsletter.subject);
      setPreheader(newsletter.preheader || "");
      setContent(newsletter.content);
    }
  }, [newsletter]);

  const handleSave = () => {
    if (!title || !subject || !content) {
      alert("Please fill in all required fields");
      return;
    }

    if (newsletterId) {
      updateMutation.mutate({
        id: newsletterId,
        title,
        subject,
        preheader,
        content,
        status: "draft",
      });
    } else {
      createMutation.mutate({
        title,
        subject,
        preheader,
        content,
        status: "draft",
      });
    }
  };

  const sendMutation = trpc.newsletters.send.useMutation({
    onSuccess: (data) => {
      alert(`Newsletter sent successfully to ${data.recipientCount} subscribers!`);
      setLocation("/admin/newsletters");
    },
    onError: (error) => {
      alert(error.message || "Failed to send newsletter");
    },
  });

  const handleSend = () => {
    if (!title || !subject || !content) {
      alert("Please fill in all required fields");
      return;
    }

    if (!newsletterId) {
      alert("Please save the newsletter as a draft first before sending");
      return;
    }

    if (confirm("Are you sure you want to send this newsletter to all subscribers? This action cannot be undone.")) {
      sendMutation.mutate({ id: newsletterId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => setLocation("/admin/newsletters")}
            variant="ghost"
            className="text-[#d4af37] hover:bg-[#d4af37]/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Newsletters
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-serif font-bold text-[#e5e5e5] mb-2">
                {newsletterId ? "Edit Newsletter" : "Create Newsletter"}
              </h1>
              <p className="text-[#e5e5e5]/60 text-lg">
                Craft your message to your readers
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Preview"}
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleSend}
                className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27] font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-[#e5e5e5] font-semibold mb-2">
              Newsletter Title <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Monthly Update - January 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-[#d4af37]/20 text-[#e5e5e5] placeholder:text-[#e5e5e5]/40"
            />
            <p className="text-[#e5e5e5]/40 text-sm mt-1">
              Internal name for this newsletter (not visible to subscribers)
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[#e5e5e5] font-semibold mb-2">
              Email Subject <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., New Release Alert: The Billionaire's Baby Secret"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/10 border-[#d4af37]/20 text-[#e5e5e5] placeholder:text-[#e5e5e5]/40"
            />
            <p className="text-[#e5e5e5]/40 text-sm mt-1">
              This will appear in your subscribers' inbox
            </p>
          </div>

          {/* Preheader */}
          <div>
            <label className="block text-[#e5e5e5] font-semibold mb-2">
              Preheader Text (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., Get ready for the thrilling conclusion..."
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
              className="bg-white/10 border-[#d4af37]/20 text-[#e5e5e5] placeholder:text-[#e5e5e5]/40"
            />
            <p className="text-[#e5e5e5]/40 text-sm mt-1">
              Preview text shown after the subject line in email clients
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-[#e5e5e5] font-semibold mb-2">
              Newsletter Content <span className="text-red-400">*</span>
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your newsletter content here..."
            />
          </div>
        </motion.div>

        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/5 backdrop-blur-xl border-2 border-[#d4af37]/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif font-bold text-[#e5e5e5] mb-6">
              Email Preview
            </h2>
            <div className="bg-white rounded-lg p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 pb-6 border-b-2 border-[#d4af37]/20">
                  <h1 className="text-4xl font-serif font-bold text-[#d4af37] mb-2">
                    Reese Astor
                  </h1>
                  <p className="text-gray-600 text-sm tracking-wider">
                    USA TODAY BESTSELLING AUTHOR
                  </p>
                </div>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-500">
                  <p>With love and passion,</p>
                  <p className="text-[#d4af37] font-bold text-lg mt-2">Reese Astor</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
