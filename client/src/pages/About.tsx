import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Briefcase, Heart, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
            About Reese Astor
          </h1>
          <p className="text-xl text-muted-foreground">
            From Corporate Finance VP to Bestselling Romance Author & Writing Coach
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Bio Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-playfair text-3xl font-bold text-foreground">
                My Journey
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I spent years climbing the corporate ladder as a VP in finance, mastering spreadsheets and boardroom negotiations. But at night, I was writing steamy romance novels, creating worlds where passion and power collide.
                </p>
                <p>
                  The turning point came when I realized I could help other women do the same—turn their creative dreams into profitable businesses. I left corporate America to write full-time and teach aspiring authors the business strategies that actually work.
                </p>
                <p>
                  Today, I'm a bestselling romance author with the Manhattan Money Kings series and a business strategist helping women build sustainable author careers. I bring my corporate expertise to the creative world, showing writers how to treat their passion like the business it deserves to be.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Heart className="h-32 w-32 text-primary/40" />
              </div>
            </div>
          </div>

          {/* What I Do */}
          <div className="space-y-8">
            <h2 className="font-playfair text-3xl font-bold text-foreground text-center">
              What I Do
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground">
                    Write Romance
                  </h3>
                  <p className="text-muted-foreground">
                    Crafting steamy billionaire romance novels with strong heroines, powerful heroes, and guaranteed happily-ever-afters that make hearts race.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground">
                    Business Coaching
                  </h3>
                  <p className="text-muted-foreground">
                    Teaching aspiring authors the business side of writing—from KDP mastery to marketing strategies that actually convert readers into fans.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground">
                    Empower Women
                  </h3>
                  <p className="text-muted-foreground">
                    Helping women turn their creative passion into profitable businesses and build the freedom-based lifestyle they deserve.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Writing Philosophy */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8 rounded-lg border border-border">
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
              My Writing Philosophy
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I believe romance novels are more than just entertainment—they're empowerment. My stories feature strong, independent women who don't need saving but choose partnership. They're about equals finding love while building empires, raising families, and changing the world.
              </p>
              <p>
                Every book I write celebrates female ambition, sexual agency, and the radical idea that women can have it all: the career, the love, the passion, and the happily-ever-after.
              </p>
            </div>
          </div>

          {/* Expertise */}
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-foreground text-center">
              Areas of Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Romance Writing",
                "KDP Publishing",
                "Author Marketing",
                "Business Strategy",
                "Creative Entrepreneurship",
                "Content Creation",
                "Brand Building",
                "Reader Engagement",
              ].map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 py-12">
            <h2 className="font-playfair text-3xl font-bold text-foreground">
              Ready to Start Your Author Journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're here for steamy romance or writing coaching, I'm excited to connect with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read My Books
                </Button>
              </Link>
              <Link href="/coaching">
                <Button size="lg" variant="outline">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Coaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
