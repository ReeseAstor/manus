import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function Books() {
  const books = [
    {
      id: 1,
      title: "The Billionaire's Executive Assistant",
      subtitle: "Manhattan Money Kings Book 1",
      cover: "/book1-cover.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      fullBlurb: "Sarah Shah never expected to work for Manhattan's most ruthless billionaire. Michael Hastings is demanding, arrogant, and devastatingly attractive. As his executive assistant, she's determined to keep things professional—but when late nights at the office turn into stolen glances and forbidden touches, the line between business and pleasure begins to blur. With a corporate takeover threatening everything they've built and a scandal that could destroy them both, Sarah must decide: is love worth risking her career, her reputation, and her heart?",
      price: "$0.99",
      regularPrice: "$4.99",
      link: "https://www.amazon.com/dp/B0F2W8QL7S",
      genre: ["Billionaire Romance", "Office Romance", "Steamy"],
      pages: 320,
      rating: 4.5,
      reviews: 1247,
      available: true,
    },
    {
      id: 2,
      title: "The Billionaire's Fake Wife",
      subtitle: "Manhattan Money Kings Book 2",
      cover: "/book2-cover.jpg",
      description: "He caught her breaking into his office. She was after evidence that could destroy his rival. His solution? A marriage contract neither expected to fulfill.",
      fullBlurb: "When Russian reformer Elena Volkov breaks into billionaire David Kim's penthouse office, she expects prison. Instead, he offers a deal: become his wife for one year in exchange for the resources to expose corruption threatening thousands of families. It's strictly business. A merger of convenience. Until forced proximity ignites something neither can control. As they navigate Manhattan's elite circles, their fake relationship becomes a dangerous game of power and desire. But when enemies close in and secrets emerge, they must decide what they're truly fighting for. A marriage on paper. A war behind closed doors. And a victory neither saw coming.",
      price: "$2.99",
      regularPrice: "$4.99",
      preorder: false,
      releaseDate: "Available Now",
      link: "https://www.amazon.com/dp/B0FCCBNF8X",
      genre: ["Fake Marriage", "Suspense", "Billionaire Romance"],
      pages: 350,
      rating: 0,
      reviews: 0,
      available: true,
    },
    {
      id: 3,
      title: "The Billionaire's Baby Secret",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "/book3-cover.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden.",
      fullBlurb: "Three years ago, Sophia Reed walked away from a hotel room and a man she should've never trusted—rising mogul Dominic Kane. She built stability the hard way: early trains, late invoices, and a tiny apartment where nothing could touch the life growing inside her. Now the CEO who controls outcomes for a living is back… and the daughter Sophia's protected has the storm-gray eyes he can't deny. When Dominic returns to reclaim his empire, he discovers the truth he was never meant to miss—and a city eager to devour the scandal. He can buy silence, clear rooms, bend markets. But Sophia has rules: boundaries around her child, transparency instead of power plays, and love that's earned, not purchased. Between boardroom wars, paparazzi flash storms, and a custody fight waiting to ignite, he has to become more than a headline and more than a boss. He has to be the father Bella needs…and the partner Sophia deserves.",
      price: "$2.99",
      regularPrice: "$4.99",
      preorder: false,
      releaseDate: "Available Now",
      link: "https://www.amazon.com/dp/B0DRZG5KKD",
      genre: ["Secret Baby", "Second Chance", "Billionaire Romance"],
      pages: 340,
      rating: 0,
      reviews: 0,
      available: true,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
            Manhattan Money Kings
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A steamy billionaire romance series set in the heart of New York City, where power, passion, and happily-ever-afters collide.
          </p>
        </div>

        {/* Books Grid */}
        <div className="space-y-12">
          {books.map((book, index) => (
            <Card key={book.id} className="overflow-hidden bg-card border-border">
              <CardContent className="p-0">
                <div className={`grid md:grid-cols-2 gap-8 p-8 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Book Cover */}
                  <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="relative group">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full max-w-md mx-auto rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                      {book.id === 3 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            New Release
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className={`flex flex-col justify-center space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    <div>
                      <p className="text-sm text-primary font-semibold mb-2">{book.subtitle}</p>
                      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {book.title}
                      </h2>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {book.genre.map((g) => (
                          <Badge key={g} variant="outline" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>

                      {book.rating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(book.rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {book.rating} ({book.reviews} reviews)
                          </span>
                        </div>
                      )}

                      <p className="text-muted-foreground mb-4">
                        {book.fullBlurb}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">{book.pages} pages</span>
                        {book.preorder && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              Available {book.releaseDate}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-primary">{book.price}</span>
                        <span className="text-lg text-muted-foreground line-through">
                          {book.regularPrice}
                        </span>
                        <Badge variant="secondary" className="ml-2">
                          Limited Time
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a href={book.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {book.preorder ? "Preorder Now" : "Buy Now"}
                          </Button>
                        </a>
                        <Button variant="outline" size="lg">
                          <Heart className="mr-2 h-5 w-5" />
                          Add to Wishlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Series Info */}
        <div className="mt-16 p-8 rounded-lg bg-card/50 border border-border">
          <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
            About the Manhattan Money Kings Series
          </h3>
          <p className="text-muted-foreground mb-4">
            Welcome to Manhattan, where billion-dollar deals are made in boardrooms and hearts are won in bedrooms. The Manhattan Money Kings series follows powerful billionaires who rule the business world but find themselves powerless against the women who capture their hearts.
          </p>
          <p className="text-muted-foreground">
            Each book is a standalone romance with a guaranteed happily-ever-after, but they're best enjoyed in order to catch all the interconnected storylines and cameos from your favorite characters.
          </p>
        </div>
      </div>
    </div>
  );
}
