import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function CodeOfConduct() {
  useEffect(() => {
    document.title = "Code of Conduct | Reese Astor";
  }, []);

  return (
    <div className="min-h-screen py-12">
      <EnhancedSEOHead
        title="Code of Conduct | Reese Astor"
        description="Community guidelines for the Reese Astor reader community, VIP Club, comment threads, and live events. How we keep our spaces safe, welcoming, and fun."
        canonical="/code-of-conduct"
      />
      <div className="container max-w-4xl">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
          Code of Conduct
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            <strong className="text-foreground">Last updated:</strong> June 3, 2026
          </p>

          <p>
            Our reader community — the Reader Club, the VIP Club, comment threads, newsletters, group chats, live events, and any other space hosted by Reese Astor — is built on a love of romance, a respect for craft, and a care for one another. This Code of Conduct describes what we expect from everyone who shows up. By participating, you agree to follow it.
          </p>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Who This Applies To</h2>
            <p>
              These guidelines apply to every member, guest, moderator, and team member in any space we host, including private members-only areas. They also apply when you represent the community elsewhere — for example, tagging the author on social media or posting in spaces created off the back of ours.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">The Short Version</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be kind. Disagreement is welcome; cruelty is not.</li>
              <li>Respect consent — in fiction discussions and in real interactions with other members.</li>
              <li>Keep this space adult-only and reader-focused.</li>
              <li>Don't pirate, don't spoil without warning, and don't spam.</li>
              <li>If something feels off, tell us.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Adults Only (18+)</h2>
            <p>
              Reese Astor writes adult romance with explicit content. Our community spaces are restricted to readers who are 18 years of age or older. If we have reason to believe a member is under 18, that member will be removed. Sharing sexual content involving minors — including fictional characters depicted as minors — is a hard rule break and will result in an immediate, permanent ban and, where applicable, a report to authorities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Respect Other Members</h2>
            <p>We don't tolerate:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harassment, threats, stalking, or doxxing of any kind.</li>
              <li>Slurs or attacks based on race, ethnicity, nationality, religion, sex, gender identity, sexual orientation, disability, body type, age, or class.</li>
              <li>Unwanted sexual attention, including unsolicited explicit DMs to other members.</li>
              <li>Tone-policing, dogpiling, or coordinated harassment of someone whose taste, identity, or kink differs from yours.</li>
            </ul>
            <p>
              You can absolutely dislike a trope, a pairing, or a book. Say so. Don't attack the people who love it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Consent — On and Off the Page</h2>
            <p>
              Romance, especially the dark and spicy end of it, leans on fantasies that wouldn't be okay in real life. Discussing those scenes — even loving them — is welcome here. But:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Don't use fiction as cover for harassing or grooming other members.</li>
              <li>Don't pressure anyone to read, watch, or discuss content they've said they don't want to engage with.</li>
              <li>Respect "no" — to a DM, to a friend request, to a roleplay invitation, to a meet-up — the first time it's said.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Spoilers and Content Warnings</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tag spoilers for any book released in the last 90 days, or use the designated spoiler channels.</li>
              <li>When discussing heavy themes (assault, suicide, abuse, etc.), include a brief content warning so members can opt in.</li>
              <li>Trigger warnings are a courtesy to other readers, not a debate topic. Don't argue with someone for asking for one.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">No Piracy</h2>
            <p>
              Don't share, request, or link to pirated copies of Reese Astor's work or anyone else's. This includes ePub/PDF files, ARC leaks, audiobook rips, and screenshots of paid content posted publicly. Authors get paid when readers buy books; piracy is what makes the next book not get written. Members caught pirating will be removed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Self-Promotion and Spam</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>This is a reader space, not a marketing channel. Other authors are welcome as readers, not as advertisers.</li>
              <li>No MLM pitches, crypto promotion, OnlyFans/cam-site marketing, or off-topic affiliate links.</li>
              <li>Sharing your own book in a thread that explicitly invites recommendations is fine. Drive-by promo is not.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Privacy</h2>
            <p>
              What members share here — health, relationships, kinks, identities — stays here. Don't screenshot private channels and post them publicly. Don't share another member's personal information without their explicit, ongoing consent. If you'd want a courtesy check before being quoted, give one.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Moderation</h2>
            <p>
              Moderators and team members enforce this Code of Conduct. Depending on the severity and pattern of behavior, we may:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Edit or remove a post.</li>
              <li>Issue a private warning.</li>
              <li>Mute or restrict your account temporarily.</li>
              <li>Remove you from a specific space (e.g., the VIP Club) while leaving others intact.</li>
              <li>Ban you permanently from all Reese Astor communities.</li>
            </ul>
            <p>
              Egregious behavior — threats, doxxing, sexual content involving minors, coordinated harassment — skips the warning ladder and results in an immediate permanent ban. Refunds for paid memberships are handled per our{" "}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Reporting</h2>
            <p>
              If you see or experience something that breaks this Code of Conduct — even if you're not sure — tell us. Reports are kept confidential. You will not be punished for reporting in good faith, even if we ultimately decide no rule was broken.
            </p>
            <p className="text-foreground">
              Email: <a href="mailto:conduct@reeseastor.com" className="text-primary hover:underline">conduct@reeseastor.com</a>
            </p>
            <p>
              For anything urgent involving immediate safety, contact local emergency services first, then let us know so we can act on our end.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Changes</h2>
            <p>
              We may update this Code of Conduct as the community grows. Material changes will be announced in the newsletter and pinned in members-only spaces. Continued participation after an update means you accept the revised version.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
