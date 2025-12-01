import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
  description: string;
  price: string;
  link: string;
  badge?: string;
}

interface Interactive3DBookShowcaseProps {
  books: Book[];
}

export default function Interactive3DBookShowcase({ books }: Interactive3DBookShowcaseProps) {
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/luxury-texture.jpg')",
          backgroundSize: "cover",
        }}
      />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
            Manhattan Money Kings
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A steamy billionaire romance series that will leave you breathless
          </p>
        </motion.div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredBook(book.id)}
              onHoverEnd={() => setHoveredBook(null)}
            >
              <Card className="group relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={hoveredBook === book.id ? {
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 0%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
                    ],
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <CardContent className="p-6 relative z-10">
                  {/* Book Cover with 3D Effect */}
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ 
                      rotateY: 15,
                      rotateX: -10,
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {book.badge && (
                      <Badge className="absolute -top-2 -right-2 z-20 bg-primary text-primary-foreground font-semibold shadow-lg">
                        {book.badge}
                      </Badge>
                    )}
                    
                    <div className="relative">
                      {/* Shadow */}
                      <motion.div
                        className="absolute -inset-4 bg-primary/20 blur-2xl rounded-lg"
                        animate={hoveredBook === book.id ? {
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="relative w-full rounded-lg shadow-2xl"
                      />
                    </div>

                    {/* Floating Hearts */}
                    {hoveredBook === book.id && (
                      <motion.div
                        className="absolute top-0 right-0 text-primary"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -30 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Heart className="h-6 w-6 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Book Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-playfair text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {book.subtitle}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <p className="text-3xl font-bold text-primary">{book.price}</p>
                      </div>
                      
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105"
                      >
                        <a href={book.link} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Buy Now
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
