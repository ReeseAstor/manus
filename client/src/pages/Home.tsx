import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { trpc } from "@/lib/trpc";
import {
  AuthorIntro,
  BookCard,
  BookHero,
  ChapterOne,
  Manifesto,
  NewsletterBand,
  PraiseQuote,
  SectionHeading,
  INK,
  SURFACE,
} from "@/components/author-kit";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Reese Astor",
  url: "https://reeseastor.com",
  description:
    "Official website of Reese Astor, USA Today Bestselling romance author of the Manhattan Money Kings series and Hudson Dynasty.",
  author: {
    "@type": "Person",
    name: "Reese Astor",
    url: "https://reeseastor.com/about",
    jobTitle: "Romance Author & Writing Coach",
    sameAs: [
      "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
      "https://www.instagram.com/reeseastor",
    ],
  },
};

export default function Home() {
  useEffect(() => {
    document.title = "Reese Astor | USA Today Bestselling Romance Author";
  }, []);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();
  const handleSubscribe = async (email: string) => {
    await subscribeMutation.mutateAsync({ email: email.trim() });
  };

  return (
    <div className="kit-grain min-h-screen font-cormorant" style={{ background: INK, color: "#F2ECDF" }}>
      <EnhancedSEOHead
        title="Reese Astor | USA Today Bestselling Romance Author"
        description="Discover Hudson Dynasty and the Manhattan Money Kings series by USA Today Bestselling author Reese Astor. Manhattan billionaire romance — power, passion, and the promise of being wholly seen."
        canonical="/"
        keywords={[
          "Reese Astor",
          "romance author",
          "billionaire romance",
          "Manhattan Money Kings",
          "Hudson Dynasty",
          "Hostile Tender",
          "USA Today bestselling author",
          "free romance book",
        ]}
        structuredData={[homeStructuredData]}
      />

      <BookHero
        kicker="Hudson Dynasty · Book I · New Release"
        title="Hostile|Tender"
        byline="A Hudson Dynasty Novel · Reese Astor · 2026"
        tagline={"“A record outlives the men who keep it. The discipline is in waiting.”"}
        blurb="Nia Carter has spent eight years building a case Hudson Vale Holdings cannot bury. Sebastian Hudson has spent twice that long ensuring no one ever could. The federal response file reaches her at 5:14 a.m. — and the most dangerous man in Manhattan has already lost control of his own building."
        cover="/author-kit/hudson-dynasty-1-hostile-tender.jpg"
        primaryCta="Order the novel"
        primaryHref="/books/hostile-tender"
        secondaryCta="Read chapter one"
        secondaryHref="#chapter-one"
      />

      <section className="px-16 py-[160px]" style={{ background: SURFACE }}>
        <div className="max-w-[1240px] mx-auto">
          <SectionHeading
            kicker="The Series"
            title="Manhattan|Money Kings"
            lead="Six interlinked novels of dynastic obsession, set inside the boardrooms, penthouses, and private clubs of New York's most powerful family."
          />
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ columnGap: 56, rowGap: 88 }}
          >
            <BookCard
              index="I"
              kicker="Available"
              title="The Billionaire's Executive Assistant"
              blurb="The boardroom was never the most dangerous room."
              cover="/author-kit/mmk-1-executive-assistant.jpg"
              href="/books/the-billionaire-s-executive-assistant"
              delay={0}
            />
            <BookCard
              index="II"
              kicker="Available"
              title="The Billionaire's Fake Wife"
              blurb="A ruthless engagement that turns devastatingly real."
              cover="/author-kit/mmk-2-fake-wife.jpg"
              href="/books/the-billionaire-s-fake-wife"
              delay={0.08}
            />
            <BookCard
              index="III"
              kicker="Available"
              title="The Billionaire's Baby Secret"
              blurb="Some secrets shatter empires. Others build a family."
              cover="/author-kit/mmk-3-baby-secret.jpg"
              href="/books/the-billionaire-s-baby-secret"
              delay={0.16}
            />
            <BookCard
              index="IV"
              kicker="New Release"
              title="The Forbidden Nanny"
              blurb="He hired her to protect his daughter. Not to ruin his life."
              cover="/author-kit/mmk-4-forbidden-nanny.jpg"
              href="/books/the-billionaires-forbidden-nanny"
              delay={0}
            />
            <BookCard
              index="—"
              kicker="Standalone · Free"
              title="The One Night Stand"
              blurb="One reckless night. One name they could not take back."
              cover="/author-kit/book-one-night-stand-cover.jpg"
              href="/free-book"
              delay={0.08}
            />
            <BookCard
              index="—"
              kicker="Hudson Dynasty · New"
              title="Hostile Tender"
              blurb="A record outlives the men who keep it. The discipline is in waiting."
              cover="/author-kit/hudson-dynasty-1-hostile-tender.jpg"
              href="/books/hostile-tender"
              delay={0.16}
            />
          </div>
        </div>
      </section>

      <Manifesto />

      <ChapterOne />

      <AuthorIntro />

      <section className="px-16 py-[160px]" style={{ background: SURFACE }}>
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading kicker="Acclaim" title="What readers|are saying" />
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 56 }}
          >
            <PraiseQuote
              quote="I devoured this in one night. Reese Astor writes the kind of billionaire I want to ruin my life — and then build me a new one."
              attribution="Goodreads · ★★★★★"
              delay={0}
            />
            <PraiseQuote
              quote="Heart-wrenching, scandalous, and unputdownable. The Manhattan Money Kings are my new obsession."
              attribution="BookBub Reviewer"
              delay={0.08}
            />
            <PraiseQuote
              quote="The slow burn alone is worth the cover price. Then she breaks your heart in chapter twelve."
              attribution="Amazon Top Reviewer"
              delay={0.16}
            />
          </div>
        </div>
      </section>

      <NewsletterBand onSubscribe={handleSubscribe} freeBookHref="/free-book" />
    </div>
  );
}
