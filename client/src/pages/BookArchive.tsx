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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] py-16">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <BookOpen className="mx-auto h-10 w-10 text-[#7A4F4C] mb-4" />
          <h1 className="font-serif text-4xl font-bold text-[#4A3B3A]">Ask the Book Archive</h1>
          <p className="mt-3 text-[#6E5F5A]">Answers are limited to author-approved book excerpts and include their source.</p>
        </div>

        <Card className="p-6 bg-[#EBD6D3]/30 border-[#4A3B3A]/10">
          <form onSubmit={submit} className="space-y-4">
            {series?.length ? (
              <select
                value={seriesSlug ?? ""}
                onChange={(event) => setSeriesSlug(event.target.value || undefined)}
                className="h-10 w-full rounded-md border border-[#4A3B3A]/20 bg-[#FAF7F7] px-3 text-sm text-[#4A3B3A]"
                aria-label="Series"
              >
                <option value="">All published series</option>
                {series.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
            ) : null}
            <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a character, scene, or timeline" className="bg-[#EBD6D3]/30 border-[#4A3B3A]/20 text-[#4A3B3A]" maxLength={1000} />
            <Button type="submit" disabled={isFetching || question.trim().length < 3} className="bg-[#4A3B3A] text-[#4A3B3A] hover:bg-[#7A4F4C]">
              <Search className="mr-2 h-4 w-4" /> Search approved archive
            </Button>
          </form>
        </Card>

        {submitted && !isFetching && data?.refusal ? (
          <Card className="mt-6 p-6 bg-[#EBD6D3]/30 border-[#4A3B3A]/10 text-[#6E5F5A]">{data.refusal}</Card>
        ) : null}
        {data?.excerpts?.length ? (
          <div className="mt-6 space-y-4">
            {data.excerpts.map((excerpt, index) => (
              <Card key={`${excerpt.citation}-${index}`} className="p-6 bg-[#EBD6D3]/30 border-[#4A3B3A]/10">
                <Quote className="h-5 w-5 text-[#7A4F4C] mb-3" />
                <p className="whitespace-pre-wrap text-[#4A3B3A] leading-7">{excerpt.content}</p>
                <p className="mt-4 text-sm text-[#7A4F4C]">Source: {excerpt.citation}</p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
