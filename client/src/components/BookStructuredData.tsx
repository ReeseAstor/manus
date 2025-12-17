import { useEffect } from "react";

interface BookStructuredDataProps {
  book: {
    id: number;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    amazonUrl: string | null;
    retailPrice?: number | null;
    directPrice?: number | null;
    series?: string | null;
    seriesOrder?: number | null;
    publishDate?: string | null;
  };
  reviews?: {
    rating: number;
    reviewerName: string;
    review: string;
    createdAt: Date;
  }[];
  averageRating?: number;
  reviewCount?: number;
}

export function BookStructuredData({ book, reviews, averageRating, reviewCount }: BookStructuredDataProps) {
  useEffect(() => {
    // Remove any existing book structured data
    const existingScript = document.querySelector('script[data-type="book-structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create the structured data object
    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": book.title,
      "description": book.description,
      "author": {
        "@type": "Person",
        "name": "Reese Astor",
        "url": "https://reeseastor.us/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Reese Astor Publishing"
      },
      "url": `https://reeseastor.us/books/${book.slug}`,
      "bookFormat": "EBook",
      "inLanguage": "en",
      "genre": ["Romance", "Contemporary Romance", "Billionaire Romance"]
    };

    // Add cover image if available
    if (book.coverImage) {
      structuredData["image"] = book.coverImage.startsWith("http") 
        ? book.coverImage 
        : `https://reeseastor.us${book.coverImage}`;
    }

    // Add publish date if available
    if (book.publishDate) {
      structuredData["datePublished"] = book.publishDate;
    }

    // Add series information if available
    if (book.series) {
      structuredData["isPartOf"] = {
        "@type": "BookSeries",
        "name": book.series,
        "position": book.seriesOrder || 1
      };
    }

    // Add offers (pricing) if available
    if (book.directPrice || book.retailPrice) {
      structuredData["offers"] = {
        "@type": "Offer",
        "price": book.directPrice || book.retailPrice,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `https://reeseastor.us/shop`,
        "seller": {
          "@type": "Organization",
          "name": "Reese Astor"
        }
      };
    }

    // Add Amazon work example if available
    if (book.amazonUrl) {
      structuredData["workExample"] = {
        "@type": "Book",
        "bookFormat": "EBook",
        "url": book.amazonUrl
      };
    }

    // Add aggregate rating if we have reviews
    if (averageRating && reviewCount && reviewCount > 0) {
      structuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": reviewCount,
        "reviewCount": reviewCount
      };
    }

    // Add individual reviews if available
    if (reviews && reviews.length > 0) {
      structuredData["review"] = reviews.slice(0, 5).map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.reviewerName
        },
        "datePublished": review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
        "reviewBody": review.review,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5",
          "worstRating": "1"
        }
      }));
    }

    // Create and inject the script tag
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-type", "book-structured-data");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-type="book-structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [book, reviews, averageRating, reviewCount]);

  // This component doesn't render anything visible
  return null;
}

// Component for the author/organization structured data on the homepage
export function AuthorStructuredData() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-type="author-structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Reese Astor",
      "url": "https://reeseastor.us",
      "image": "https://reeseastor.us/author-photo.jpg",
      "jobTitle": "Romance Author",
      "description": "USA Today bestselling author of the Manhattan Money Kings series. Steamy billionaire romance with alpha heroes and happily ever afters.",
      "sameAs": [
        "https://www.instagram.com/reeseastor/",
        "https://www.facebook.com/profile.php?id=61571178214136",
        "https://www.amazon.com/stores/Reese-Astor/author/B0DJQHF3TQ"
      ],
      "knowsAbout": ["Romance Writing", "Self-Publishing", "Author Marketing"],
      "award": "USA Today Bestselling Author"
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-type", "author-structured-data");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-type="author-structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}

// Component for book series structured data
export function BookSeriesStructuredData() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-type="book-series-structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BookSeries",
      "name": "Manhattan Money Kings",
      "author": {
        "@type": "Person",
        "name": "Reese Astor"
      },
      "description": "A steamy billionaire romance series set in Manhattan, featuring powerful alpha heroes and the women who capture their hearts.",
      "genre": ["Romance", "Contemporary Romance", "Billionaire Romance"],
      "numberOfBooks": 4,
      "hasPart": [
        {
          "@type": "Book",
          "name": "The Billionaire's One Night Stand",
          "position": 0,
          "url": "https://reeseastor.us/books/the-billionaires-one-night-stand"
        },
        {
          "@type": "Book",
          "name": "The Billionaire's Executive Assistant",
          "position": 1,
          "url": "https://reeseastor.us/books/the-billionaires-executive-assistant"
        },
        {
          "@type": "Book",
          "name": "The Billionaire's Fake Wife",
          "position": 2,
          "url": "https://reeseastor.us/books/the-billionaires-fake-wife"
        },
        {
          "@type": "Book",
          "name": "The Billionaire's Baby Secret",
          "position": 3,
          "url": "https://reeseastor.us/books/the-billionaires-baby-secret"
        }
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-type", "book-series-structured-data");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-type="book-series-structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}
