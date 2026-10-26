import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ChevronLeft, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminCanonArchive() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [series, setSeries] = useState({ name: "", slug: "", description: "" });
  const [createdSeriesId, setCreatedSeriesId] = useState<number>();
  const [document, setDocument] = useState({ seriesId: "", title: "", storageKey: "", sourceType: "manuscript" });
  const [ingestion, setIngestion] = useState({ documentId: "", chapter: "", text: "" });
  const [selectedDocumentId, setSelectedDocumentId] = useState<number>();

  const documents = trpc.canon.admin.listDocuments.useQuery(undefined, { enabled: user?.role === "admin" });
  const chunks = trpc.canon.admin.listChunks.useQuery({ documentId: selectedDocumentId! }, { enabled: Boolean(selectedDocumentId) });
  const createSeries = trpc.canon.admin.createSeries.useMutation({ onSuccess: (created) => { toast.success("Series created as a draft"); setCreatedSeriesId(created.id); setSeries({ name: "", slug: "", description: "" }); }, onError: (error) => toast.error(error.message) });
  const publishSeries = trpc.canon.admin.setSeriesStatus.useMutation({ onSuccess: () => { toast.success("Series published to archive search"); utils.canon.listSeries.invalidate(); }, onError: (error) => toast.error(error.message) });
  const registerDocument = trpc.canon.admin.registerDocument.useMutation({ onSuccess: (created) => { toast.success("Document registered"); setDocument({ seriesId: "", title: "", storageKey: "", sourceType: "manuscript" }); setSelectedDocumentId(created.id); documents.refetch(); }, onError: (error) => toast.error(error.message) });
  const ingestText = trpc.canon.admin.ingestText.useMutation({ onSuccess: (result) => { toast.success(`${result.chunksCreated} draft excerpts created`); setIngestion({ documentId: "", chapter: "", text: "" }); setSelectedDocumentId(result.documentId); chunks.refetch(); documents.refetch(); }, onError: (error) => toast.error(error.message) });
  const approveChunks = trpc.canon.admin.approveChunks.useMutation({ onSuccess: () => { toast.success("Approved excerpts are now available to readers"); chunks.refetch(); }, onError: (error) => toast.error(error.message) });

  if (loading) return null;
  if (!user || user.role !== "admin") { setLocation("/"); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] py-12">
      <div className="container max-w-6xl space-y-8">
        <Link href="/admin/dashboard"><Button variant="ghost" className="text-gray-400 hover:text-white"><ChevronLeft className="mr-1 h-4 w-4" />Dashboard</Button></Link>
        <div><h1 className="font-serif text-4xl font-bold text-white">Canon Archive</h1><p className="mt-2 text-gray-400">Private manuscript references stay private. Only excerpts you approve can appear in reader answers.</p></div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><BookOpen className="h-5 w-5 text-[#d4af37]" />1. Add series</h2>
            <Input value={series.name} onChange={(event) => setSeries({ ...series, name: event.target.value })} placeholder="Series name" className="bg-white/5 border-white/20 text-white" />
            <Input value={series.slug} onChange={(event) => setSeries({ ...series, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="series-slug" className="bg-white/5 border-white/20 text-white" />
            <Textarea value={series.description} onChange={(event) => setSeries({ ...series, description: event.target.value })} placeholder="Optional internal description" className="bg-white/5 border-white/20 text-white" />
            <div className="flex flex-wrap gap-2"><Button onClick={() => createSeries.mutate(series)} disabled={!series.name || !series.slug || createSeries.isPending} className="bg-[#d4af37] text-black">Create draft series</Button>{createdSeriesId ? <Button variant="outline" onClick={() => publishSeries.mutate({ seriesId: createdSeriesId, status: "published" })} disabled={publishSeries.isPending} className="border-[#d4af37]/50 text-[#d4af37]">Publish series #{createdSeriesId}</Button> : null}</div>
          </Card>
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><FileText className="h-5 w-5 text-[#d4af37]" />2. Register manuscript</h2>
            <Input type="number" value={document.seriesId} onChange={(event) => setDocument({ ...document, seriesId: event.target.value })} placeholder="Series ID" className="bg-white/5 border-white/20 text-white" />
            <Input value={document.title} onChange={(event) => setDocument({ ...document, title: event.target.value })} placeholder="Book or document title" className="bg-white/5 border-white/20 text-white" />
            <Input value={document.storageKey} onChange={(event) => setDocument({ ...document, storageKey: event.target.value })} placeholder="Private storage key, not a public URL" className="bg-white/5 border-white/20 text-white" />
            <Button onClick={() => registerDocument.mutate({ ...document, seriesId: Number(document.seriesId), sourceType: document.sourceType as "manuscript" })} disabled={!document.seriesId || !document.title || !document.storageKey || registerDocument.isPending} className="bg-[#d4af37] text-black">Register document</Button>
          </Card>
        </div>

        <Card className="p-6 bg-white/5 border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">3. Index text as private draft excerpts</h2>
          <p className="text-sm text-gray-400">Paste one chapter at a time. It creates drafts only; reader search remains blocked until you approve excerpts below.</p>
          <div className="grid gap-4 md:grid-cols-2"><Input type="number" value={ingestion.documentId} onChange={(event) => setIngestion({ ...ingestion, documentId: event.target.value })} placeholder="Document ID" className="bg-white/5 border-white/20 text-white" /><Input value={ingestion.chapter} onChange={(event) => setIngestion({ ...ingestion, chapter: event.target.value })} placeholder="Chapter label" className="bg-white/5 border-white/20 text-white" /></div>
          <Textarea value={ingestion.text} onChange={(event) => setIngestion({ ...ingestion, text: event.target.value })} placeholder="Paste manuscript text" className="min-h-48 bg-white/5 border-white/20 text-white" />
          <Button onClick={() => ingestText.mutate({ documentId: Number(ingestion.documentId), chapter: ingestion.chapter || undefined, text: ingestion.text })} disabled={!ingestion.documentId || !ingestion.text || ingestText.isPending} className="bg-[#d4af37] text-black">Create draft excerpts</Button>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10"><h2 className="text-lg font-semibold text-white mb-4">Registered documents</h2><div className="space-y-2">{documents.data?.map((item) => <button key={item.id} onClick={() => setSelectedDocumentId(item.id)} className={`w-full rounded border p-3 text-left ${selectedDocumentId === item.id ? "border-[#d4af37] bg-[#d4af37]/10" : "border-white/10"}`}><span className="text-white">{item.title}</span><span className="ml-2 text-sm text-gray-400">{item.seriesName} · {item.status} · ID {item.id}</span></button>) ?? <p className="text-gray-400">No documents registered.</p>}</div></Card>

        {selectedDocumentId ? <Card className="p-6 bg-white/5 border-white/10"><h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4"><ShieldCheck className="h-5 w-5 text-[#d4af37]" />4. Review and approve excerpts</h2><div className="space-y-3">{chunks.data?.map((chunk) => <div key={chunk.id} className="rounded border border-white/10 p-4"><p className="whitespace-pre-wrap text-sm text-gray-200">{chunk.content}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-gray-400">{chunk.citation} · {chunk.approved ? (chunk.readerVisible ? "Reader visible" : "Approved, internal") : "Draft"}</span>{!chunk.approved && <Button size="sm" onClick={() => approveChunks.mutate({ chunkIds: [chunk.id], readerVisible: true })} disabled={approveChunks.isPending} className="bg-[#d4af37] text-black">Approve for readers</Button>}</div></div>) ?? <p className="text-gray-400">Select a document to review its excerpts.</p>}</div></Card> : null}
      </div>
    </div>
  );
}
