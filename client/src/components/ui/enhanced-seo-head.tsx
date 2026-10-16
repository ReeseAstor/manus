import { Helmet } from 'react-helmet-async';
import { SITE_URL, toAbsoluteUrl } from '@/lib/seo-url';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'book' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: object[];
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
}

export function EnhancedSEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/reese-astor-author.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData = [],
  noindex = false,
  nofollow = false,
  author = 'Reese Astor',
  publishDate,
  modifiedDate,
}: SEOProps) {
  const fullCanonical = toAbsoluteUrl(canonical, SITE_URL);
  const fullOgImage = toAbsoluteUrl(ogImage, SITE_URL);
  
  // Optimize title for SEO (55-60 characters ideal)
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Optimize description for SEO (155-160 characters ideal)
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  const robotsContent = noindex || nofollow 
    ? `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}` 
    : 'index,follow';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Reese Astor" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={optimizedTitle} />
      <meta property="twitter:description" content={optimizedDescription} />
      <meta property="twitter:image" content={fullOgImage} />
      <meta property="twitter:image:alt" content={title} />
      <meta property="twitter:creator" content="@reeseastor" />
      
      {/* Article specific meta tags */}
      {ogType === 'article' && publishDate && (
        <>
          <meta property="article:published_time" content={publishDate} />
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Romance Writing" />
        </>
      )}
      
      {/* Book specific meta tags */}
      {ogType === 'book' && (
        <>
          <meta property="book:author" content={author} />
          <meta property="book:tag" content="billionaire romance" />
          <meta property="book:tag" content="steamy romance" />
          <meta property="book:tag" content="Manhattan Money Kings" />
        </>
      )}
      
      {/* Additional SEO tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0E1620" />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Helmet>
  );
}

// Helper function to generate book schema
export function generateBookSchema(book: {
  name: string;
  description: string;
  url: string;
  isbn?: string;
  genre: string;
  price?: string;
  currency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  publishDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.name,
    "description": book.description,
    "url": book.url,
    "author": {
      "@type": "Person",
      "name": "Reese Astor",
      "url": "https://reeseastor.com"
    },
    "genre": book.genre,
    "bookFormat": "https://schema.org/EBook",
    ...(book.isbn && { "isbn": book.isbn }),
    ...(book.publishDate && { "datePublished": book.publishDate }),
    ...(book.price && {
      "offers": {
        "@type": "Offer",
        "price": book.price,
        "priceCurrency": book.currency || "USD",
        "availability": book.availability || "https://schema.org/InStock"
      }
    }),
    ...(book.rating && book.reviewCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": book.rating,
        "reviewCount": book.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };
}

// Helper function to generate article schema
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishDate: string;
  modifiedDate?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "image": article.image,
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "author": {
      "@type": "Person",
      "name": "Reese Astor",
      "url": "https://reeseastor.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Reese Astor",
      "url": "https://reeseastor.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://reeseastor.com/images/logo.png"
      }
    },
    ...(article.keywords && { "keywords": article.keywords.join(', ') })
  };
}

// Helper function to generate breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": toAbsoluteUrl(item.url)
    }))
  };
}

// Helper function to generate product schema
export function generateProductSchema(product: {
  name: string;
  description: string;
  url: string;
  image: string;
  price: string;
  currency?: string;
  sku?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "url": product.url,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Reese Astor"
    },
    ...(product.sku && { "sku": product.sku }),
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "USD",
      "availability": "https://schema.org/InStock",
      "url": product.url
    },
    ...(product.rating && product.reviewCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };
}
