import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";
import { Link } from "wouter";
import { MessageCircle, BellRing, ShieldCheck } from "lucide-react";

const SMS_NUMBER_DISPLAY = "+1 (518) 888-7883";
const SMS_NUMBER_E164 = "+15188887883";
const OPT_IN_KEYWORD = "JOIN";

export default function SmsAlerts() {
  useEffect(() => {
    document.title = "Text Alerts | Reese Astor";
  }, []);

  return (
    <div className="min-h-screen py-12">
      <EnhancedSEOHead
        title="Join Reese Astor Text Alerts"
        description="Subscribe to Reese Astor SMS text alerts for new release and sale announcements. Recurring automated marketing messages. Msg & data rates may apply. Reply STOP to opt out."
        canonical="/sms"
      />
      <div className="container max-w-3xl">
        <div className="text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wide">
            <BellRing className="h-4 w-4" />
            Reese Astor Text Alerts
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
            Be first to know. By text.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get new release alerts and sale news from author Reese Astor &mdash; sent straight to your phone, never anywhere else.
          </p>
        </div>

        {/* Opt-in card */}
        <div className="rounded-2xl border border-primary/30 bg-card p-8 space-y-6 text-center">
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Two ways to subscribe
          </h2>
          <p className="text-muted-foreground">
            Text <strong className="text-foreground">{OPT_IN_KEYWORD}</strong> to{" "}
            <strong className="text-foreground">{SMS_NUMBER_DISPLAY}</strong>
          </p>
          <a
            href={`sms:${SMS_NUMBER_E164}?&body=${OPT_IN_KEYWORD}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            Tap to text {OPT_IN_KEYWORD} to subscribe
          </a>
          <p className="text-xs text-muted-foreground">
            (On a computer? Send a text with the word {OPT_IN_KEYWORD} to {SMS_NUMBER_DISPLAY} from your phone.)
          </p>
        </div>

        {/* What you get */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <BellRing className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">New release alerts</h3>
            <p className="text-sm text-muted-foreground">Know the moment a new book goes live.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Sale news</h3>
            <p className="text-sm text-muted-foreground">Hear when a book goes on sale.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Easy opt-out</h3>
            <p className="text-sm text-muted-foreground">Reply STOP anytime. Reply HELP for help.</p>
          </div>
        </div>

        {/* Compliance disclosure */}
        <div className="mt-10 rounded-xl border border-border/60 bg-muted/30 p-6">
          <h2 className="font-semibold text-foreground mb-3">Program details &amp; consent</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By opting in, you agree to receive recurring automated marketing text
            messages (such as new release announcements and exclusive offers) from
            Reese Astor at the mobile number used to opt in. Consent is not a
            condition of any purchase. Message frequency varies. Message &amp; data
            rates may apply. Reply <strong className="text-foreground">HELP</strong> for help or{" "}
            <strong className="text-foreground">STOP</strong> to unsubscribe at any time. Carriers
            are not liable for delayed or undelivered messages.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            See our{" "}
            <Link href="/privacy"><a className="text-primary hover:underline">Privacy Policy</a></Link>{" "}
            and{" "}
            <Link href="/terms"><a className="text-primary hover:underline">Terms of Service</a></Link>.
            We do not sell or share your mobile information with third parties or
            affiliates for their marketing or promotional purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
