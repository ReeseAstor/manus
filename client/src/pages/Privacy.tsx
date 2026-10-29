import { useEffect } from "react";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Reese Astor";
  }, []);

  return (
    <div className="min-h-screen py-12">
      <EnhancedSEOHead
        title="Privacy Policy | Reese Astor"
        description="Privacy policy for reeseastor.com. Learn how we collect, use, and protect your personal data when you visit our website or subscribe to our newsletter."
        canonical="/privacy"
      />
      <div className="container max-w-4xl">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            <strong className="text-foreground">Last updated:</strong> November 28, 2025
          </p>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Introduction</h2>
            <p>
              Welcome to Reese Astor's website. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Identity Data:</strong> first name, last name, username</li>
              <li><strong className="text-foreground">Contact Data:</strong> email address, social media handles</li>
              <li><strong className="text-foreground">Technical Data:</strong> IP address, browser type, device information</li>
              <li><strong className="text-foreground">Usage Data:</strong> information about how you use our website</li>
              <li><strong className="text-foreground">Marketing Data:</strong> your preferences in receiving marketing from us</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">How We Use Your Information</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide you with our newsletter and marketing communications</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To improve our website and services</li>
              <li>To send you information about new book releases and coaching services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Email Marketing</h2>
            <p>
              If you subscribe to our newsletter, we will send you regular updates about new book releases, writing tips, and coaching opportunities. You can unsubscribe at any time by clicking the unsubscribe link in any email we send you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">SMS / Text Messaging</h2>
            <p>
              If you opt in to our SMS program, we collect your mobile phone number and your consent to receive recurring automated marketing text messages (such as new release announcements and exclusive offers) from Reese Astor. Consent is not a condition of any purchase. Message frequency varies, and message and data rates may apply. You can opt out at any time by replying STOP, or reply HELP for help.
            </p>
            <p>
              <strong className="text-foreground">No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> Sharing with subcontractors who provide support services (for example, SMS delivery via our messaging provider, Twilio) is permitted solely to operate the program. All other categories of data sharing described in this policy exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. We use Google Analytics to understand how visitors use the site; it sets its own cookies. You can opt out with Google's browser add-on at https://tools.google.com/dlpage/gaoptout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Third-Party Services</h2>
            <p>We may share your data with third-party service providers who assist us in operating our website and conducting our business, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email marketing platforms</li>
              <li>Website analytics services (Google Analytics)</li>
              <li>Payment processors (for coaching services)</li>
              <li>Social media platforms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Your Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="text-foreground">
              Email: <a href="mailto:contact@reeseastor.com" className="text-primary hover:underline">contact@reeseastor.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-foreground">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
