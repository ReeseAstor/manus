import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Target, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Coaching() {
  const services = [
    {
      title: "Romance Writing Foundations",
      icon: BookOpen,
      description: "Master the craft of writing compelling romance novels that readers can't put down.",
      features: [
        "Story structure and pacing",
        "Character development techniques",
        "Writing steamy scenes with confidence",
        "Crafting satisfying happily-ever-afters",
        "Genre-specific tropes and reader expectations",
      ],
      ideal: "Aspiring romance authors ready to write their first book",
    },
    {
      title: "KDP Publishing Mastery",
      icon: Target,
      description: "Learn the complete process of self-publishing on Amazon KDP from manuscript to market.",
      features: [
        "Formatting for KDP (ebook and print)",
        "Cover design principles and resources",
        "Keyword research and optimization",
        "Pricing strategies for maximum profit",
        "Launch planning and execution",
      ],
      ideal: "Authors ready to publish their completed manuscript",
    },
    {
      title: "Author Business Strategy",
      icon: TrendingUp,
      description: "Build a sustainable, profitable author business with proven marketing and growth strategies.",
      features: [
        "Building your author brand",
        "Email list growth and engagement",
        "Social media marketing for authors",
        "Advertising strategies (AMS, Facebook)",
        "Creating multiple income streams",
      ],
      ideal: "Published authors looking to scale their business",
    },
    {
      title: "Group Coaching Program",
      icon: Users,
      description: "Join a community of ambitious romance authors and get ongoing support, accountability, and feedback.",
      features: [
        "Weekly group coaching calls",
        "Private community access",
        "Monthly writing challenges",
        "Manuscript feedback and critique",
        "Networking with fellow authors",
      ],
      ideal: "Authors who thrive in community and want ongoing support",
    },
  ];

  const testimonials = [
    {
      name: "Jessica M.",
      role: "Romance Author",
      content: "Reese's coaching transformed my writing career. I went from struggling to finish my first book to publishing three bestsellers in one year. Her business strategies actually work!",
    },
    {
      name: "Amanda K.",
      role: "First-Time Author",
      content: "I was terrified of self-publishing, but Reese made it so simple. Her KDP course walked me through every step, and I launched my debut novel with confidence.",
    },
    {
      name: "Sarah L.",
      role: "Full-Time Author",
      content: "The group coaching program gave me the accountability I needed. Being surrounded by other ambitious authors pushed me to write faster and smarter. Best investment I've made!",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Writing & Publishing Coaching
          </Badge>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
            Turn Your Writing Passion Into Profit
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn the business strategies that helped me go from corporate VP to bestselling romance author—and how you can build your own successful author career.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-8 mb-16">
          <h2 className="font-playfair text-3xl font-bold text-foreground text-center">
            Coaching Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-playfair text-2xl text-foreground">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">What You'll Learn:</p>
                      <ul className="space-y-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Ideal for:</span> {service.ideal}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Why Work With Me */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 rounded-lg border border-border mb-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-foreground text-center">
              Why Work With Me?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm not just a writing coach—I'm a romance author who's been in the trenches. I've written bestselling books, built a profitable author business, and navigated the challenges you're facing right now.
              </p>
              <p>
                My unique background in corporate finance means I bring business strategy to creative work. I'll teach you not just how to write great books, but how to build a sustainable career that gives you creative freedom and financial independence.
              </p>
              <p>
                Whether you're writing your first romance novel or scaling your existing author business, I'll give you the tools, strategies, and support you need to succeed.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-8 mb-16">
          <h2 className="font-playfair text-3xl font-bold text-foreground text-center">
            What Authors Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center space-y-6 py-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
            Ready to Build Your Author Career?
          </h2>
          <p className="text-lg text-muted-foreground">
            Let's talk about your writing goals and how I can help you achieve them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Read Free Writing Tips
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
