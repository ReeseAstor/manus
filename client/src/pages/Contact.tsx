import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Instagram, Facebook, Send, Sparkles, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { EnhancedSEOHead } from "@/components/ui/enhanced-seo-head";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Reese Astor | Romance Author & Writing Coach";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      <EnhancedSEOHead
        title="Contact Reese Astor | Romance Author & Writing Coach"
        description="Get in touch with Reese Astor for media inquiries or reader questions."
        canonical="/contact"
        keywords={["contact Reese Astor", "romance author contact", "writing coach inquiry", "book signing request", "media inquiry romance author"]}
      />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HErRnyWsgwDErssZ.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#d4af37]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-sm">
              <MessageCircle className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37] tracking-widest uppercase">
                Let's Connect
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">
              Get In Touch
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Have questions about my books or coaching services? I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/nkhgPTPhVEhCBAIZ.jpg')",
            backgroundSize: "cover",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form - Luxury Design */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-white mb-3">
                  Send a Message
                </h2>
                <p className="text-gray-400">
                  Fill out the form below and I'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-white font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-white font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-white font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me more..."
                    rows={6}
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-white/20 focus:border-[#d4af37] bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
                  disabled={submitMutation.isPending}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {submitMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info - Luxury Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-white mb-6">
                  Other Ways to Connect
                </h2>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center">
                        <Mail className="h-7 w-7 text-[#d4af37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-2">Email</h3>
                        <a
                          href="mailto:contact@reeseastor.com"
                          className="text-gray-400 hover:text-[#d4af37] transition-colors"
                        >
                          contact@reeseastor.com
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center">
                        <Instagram className="h-7 w-7 text-[#d4af37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-2">Instagram</h3>
                        <a
                          href="https://www.instagram.com/reeseastor/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#d4af37] transition-colors"
                        >
                          @reeseastor
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center">
                        <Facebook className="h-7 w-7 text-[#d4af37]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-2">Facebook</h3>
                        <a
                          href="https://www.facebook.com/profile.php?id=61571178214136"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#d4af37] transition-colors"
                        >
                          Reese Astor
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 border-2 border-[#d4af37]/20 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2">
                      Response Time
                    </h3>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  I typically respond to messages within 24-48 hours during business days. For urgent coaching inquiries, please mention that in your subject line.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/spKnuylVHBnEgELK.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Looking for something specific?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Check out my books, coaching services, or grab your free copy of The First Acquisition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <a href="/books">View Books</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-10 py-7 rounded-full"
              >
                <a href="/free-book">Get Free Book</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
