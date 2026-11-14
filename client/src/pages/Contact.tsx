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
    <div className="min-h-screen overflow-x-clip bg-gradient-to-b from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7]">
      <EnhancedSEOHead
        title="Contact Reese Astor | Romance Author & Writing Coach"
        description="Contact Reese Astor for reader questions, media and rights inquiries, and ARC requests."
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
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
        </div>

        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#C9A3A0]/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#B59A6A]/30 bg-[#C9A3A0]/5 backdrop-blur-sm">
              <MessageCircle className="h-4 w-4 text-[#7A4F4C]" />
              <span className="text-sm font-medium text-[#7A4F4C] tracking-widest uppercase">
                Let's Connect
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#4A3B3A] leading-tight">
              Get In Touch
            </h1>

            <p className="text-xl md:text-2xl text-[#6E5F5A] font-light max-w-3xl mx-auto leading-relaxed">
              Have a question about the books? I'd love to hear from you.
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
              className="p-10 rounded-3xl bg-gradient-to-br from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 shadow-2xl"
            >
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-[#4A3B3A] mb-3">
                  Send a Message
                </h2>
                <p className="text-[#6E5F5A]">
                  Fill out the form below and I'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[#4A3B3A] font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-[#4A3B3A]/20 focus:border-[#B59A6A] bg-[#EBD6D3]/30 backdrop-blur-sm text-[#4A3B3A] placeholder:text-[#6E5F5A]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#4A3B3A] font-medium">
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
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-[#4A3B3A]/20 focus:border-[#B59A6A] bg-[#EBD6D3]/30 backdrop-blur-sm text-[#4A3B3A] placeholder:text-[#6E5F5A]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-[#4A3B3A] font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-[#4A3B3A]/20 focus:border-[#B59A6A] bg-[#EBD6D3]/30 backdrop-blur-sm text-[#4A3B3A] placeholder:text-[#6E5F5A]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-[#4A3B3A] font-medium">
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
                    className="px-6 py-6 text-lg rounded-2xl border-2 border-[#4A3B3A]/20 focus:border-[#B59A6A] bg-[#EBD6D3]/30 backdrop-blur-sm text-[#4A3B3A] placeholder:text-[#6E5F5A] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
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
                <h2 className="font-serif text-3xl font-bold text-[#4A3B3A] mb-6">
                  Other Ways to Connect
                </h2>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 flex items-center justify-center">
                        <Mail className="h-7 w-7 text-[#7A4F4C]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#4A3B3A] text-lg mb-2">Email</h3>
                        <a
                          href="mailto:contact@reeseastor.com"
                          className="text-[#6E5F5A] hover:text-[#7A4F4C] transition-colors"
                        >
                          contact@reeseastor.com
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 flex items-center justify-center">
                        <Instagram className="h-7 w-7 text-[#7A4F4C]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#4A3B3A] text-lg mb-2">Instagram</h3>
                        <a
                          href="https://www.instagram.com/reeseastor/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6E5F5A] hover:text-[#7A4F4C] transition-colors"
                        >
                          @reeseastor
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF7F7]/5 to-[#FAF7F7]/[0.02] backdrop-blur-xl border border-[#4A3B3A]/10 hover:border-[#B59A6A]/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 flex items-center justify-center">
                        <Facebook className="h-7 w-7 text-[#7A4F4C]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#4A3B3A] text-lg mb-2">Facebook</h3>
                        <a
                          href="https://www.facebook.com/profile.php?id=61571178214136"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6E5F5A] hover:text-[#7A4F4C] transition-colors"
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
                className="p-8 rounded-3xl bg-gradient-to-br from-[#C9A3A0]/10 via-transparent to-[#C9A3A0]/5 border-2 border-[#B59A6A]/20 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A3A0]/20 to-[#C9A3A0]/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#7A4F4C]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#4A3B3A] mb-2">
                      Response Time
                    </h3>
                  </div>
                </div>
                <p className="text-[#6E5F5A] leading-relaxed">
                  I typically respond to messages within 24-48 hours during business days. For media or rights inquiries, please say so in your subject line.
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
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F7]/98 via-[#FAF7F7]/95 to-[#FAF7F7]/98" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-6">
              Looking for something specific?
            </h2>
            <p className="text-xl text-[#6E5F5A] mb-8">
              Browse the books, or grab your free copy of The First Acquisition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7] font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <a href="/books">View Books</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#4A3B3A]/20 bg-[#EBD6D3]/30 hover:bg-[#EBD6D3]/60 text-[#4A3B3A] font-semibold px-10 py-7 rounded-full"
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
