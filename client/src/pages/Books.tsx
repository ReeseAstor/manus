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
      cover: "https://m.media-amazon.com/images/I/81n7gqi8zAL._SL1500_.jpg",
      description: "A steamy office romance between a ruthless billionaire and the assistant he can't resist. When forbidden attraction meets corporate rivalry, everything is at stake.",
      fullBlurb: "Sarah Shah never expected to work for Manhattan's most ruthless billionaire. Michael Hastings is demanding, arrogant, and devastatingly attractive. As his executive assistant, she's determined to keep things professional—but when late nights at the office turn into stolen glances and forbidden touches, the line between business and pleasure begins to blur. With a corporate takeover threatening everything they've built and a scandal that could destroy them both, Sarah must decide: is love worth risking her career, her reputation, and her heart?",
      price: "$0.99",
      regularPrice: "$4.99",
      link: "https://amzn.to/4ja7blJ",
      genre: ["Billionaire Romance", "Office Romance", "Steamy"],
      pages: 320,
      rating: 4.5,
      reviews: 1247,
      available: true,
    },
    {
      id: 3,
      title: "The Billionaire's Baby Secret: Hidden and His",
      subtitle: "Manhattan Money Kings Book 3",
      cover: "https://m.media-amazon.com/images/I/81n7gqi8zAL._SL1500_.jpg",
      description: "One night. One secret. One second chance he refuses to lose. When Dominic Kane reclaims his empire, he discovers the daughter Sophia Reed kept hidden.",
      fullBlurb: "One passionate night changed everything. Sophia Reed never told Dominic Kane about their daughter—how could she, when he disappeared to rebuild his fallen empire? Three years later, he's back, more powerful and determined than ever. When he discovers the truth, Dominic demands his place in their lives. To protect their family from scandal and give their daughter the life she deserves, they must navigate a world of boardroom battles and paparazzi. But as forced proximity reignites their undeniable chemistry, can they trade power plays for trust and build the family they both secretly crave?",
      price: "$0.99",
      regularPrice: "$4.99",
      preorder: true,
      releaseDate: "December 1, 2025",
      link: "https://swiy.co/3rd",
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
                      {book.preorder && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            Preorder
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
