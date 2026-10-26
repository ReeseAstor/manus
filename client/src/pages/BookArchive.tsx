import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Quote } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function BookArchive() {
  const [question, setQuestion] = useState("");
  const [seriesSlug, setSeriesSlug] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState<{ question: string; seriesSlug?: string }>();
  const { data: series } = trpc.canon.listSeries.useQuery();
  const { data, isFetching } = trpc.canon.ask.useQuery(submitted!, { enabled: Boolean(submitted) });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (trimmed.length < 3) return;
    setSubmitted({ question: trimmed, seriesSlug });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] py-16">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <BookOpen className="mx-auto h-10 w-10 text-[#d4af37] mb-4" />
          <h1 className="font-serif text-4xl font-bold text-white">Ask the Book Archive</h1>
          <p className="mt-3 text-gray-400">Answers are limited to author-approved book excerpts and include their source.</p>
        </div>

        <Card className="p-6 bg-white/5 border-white/10">
          <form onSubmit={submit} className="space-y-4">
            {series?.length ? (
              <select
                value={seriesSlug ?? ""}
                onChange={(event) => setSeriesSlug(event.target.value || undefined)}
                className="h-10 w-full rounded-md border border-white/20 bg-[#0a0e1a] px-3 text-sm text-white"
                aria-label="Series"
              >
                <option value="">All published series</option>
                {series.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
            ) : null}
            <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a character, scene, or timeline" className="bg-white/5 border-white/20 text-white" maxLength={1000} />
            <Button type="submit" disabled={isFetching || question.trim().length < 3} className="bg-[#d4af37] text-black hover:bg-[#e5c65c]">
              <Search className="mr-2 h-4 w-4" /> Search approved archive
            </Button>
          </form>
        </Card>

        {submitted && !isFetching && data?.refusal ? (
          <Card className="mt-6 p-6 bg-white/5 border-white/10 text-gray-300">{data.refusal}</Card>
        ) : null}
        {data?.excerpts?.length ? (
          <div className="mt-6 space-y-4">
            {data.excerpts.map((excerpt, index) => (
              <Card key={`${excerpt.citation}-${index}`} className="p-6 bg-white/5 border-white/10">
                <Quote className="h-5 w-5 text-[#d4af37] mb-3" />
                <p className="whitespace-pre-wrap text-gray-200 leading-7">{excerpt.content}</p>
                <p className="mt-4 text-sm text-[#d4af37]">Source: {excerpt.citation}</p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
