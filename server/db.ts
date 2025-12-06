import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogPosts, InsertBlogPost, books, bookReviews, type Book, type InsertBook, type BookReview, type InsertBookReview, newsletters, newsletterSubscribers, type Newsletter, type InsertNewsletter, type NewsletterSubscriber, type InsertNewsletterSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Blog post queries
 */
export async function getAllBlogPosts(published?: boolean, category?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog posts: database not available");
    return [];
  }

  try {
    const conditions = [];
    
    if (published) {
      conditions.push(eq(blogPosts.published, "published"));
    }
    
    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }
    
    let query = db.select().from(blogPosts);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const result = await query.orderBy(desc(blogPosts.publishedAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get blog post:", error);
    return undefined;
  }
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(blogPosts).values(post);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete blog post:", error);
    throw error;
  }
}

// ==================== BOOKS ====================

export async function getAllBooks(featuredOnly?: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    if (featuredOnly) {
      return await db.select().from(books).where(eq(books.featured, true)).orderBy(desc(books.displayOrder));
    }
    return await db.select().from(books).orderBy(desc(books.displayOrder));
  } catch (error) {
    console.error("[Database] Failed to get books:", error);
    throw error;
  }
}

export async function getBookBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.select().from(books).where(eq(books.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get book by slug:", error);
    throw error;
  }
}

export async function getBookById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get book by id:", error);
    throw error;
  }
}

export async function createBook(book: InsertBook) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(books).values(book);
  } catch (error) {
    console.error("[Database] Failed to create book:", error);
    throw error;
  }
}

export async function updateBook(id: number, book: Partial<InsertBook>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.update(books).set(book).where(eq(books.id, id));
  } catch (error) {
    console.error("[Database] Failed to update book:", error);
    throw error;
  }
}

export async function deleteBook(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.delete(books).where(eq(books.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete book:", error);
    throw error;
  }
}

// ==================== BOOK REVIEWS ====================

export async function getBookReviews(bookId: number, featuredOnly?: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    if (featuredOnly) {
      return await db
        .select()
        .from(bookReviews)
        .where(and(eq(bookReviews.bookId, bookId), eq(bookReviews.featured, true)))
        .orderBy(desc(bookReviews.createdAt));
    }
    return await db
      .select()
      .from(bookReviews)
      .where(eq(bookReviews.bookId, bookId))
      .orderBy(desc(bookReviews.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get book reviews:", error);
    throw error;
  }
}

export async function createBookReview(review: InsertBookReview) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(bookReviews).values(review);
  } catch (error) {
    console.error("[Database] Failed to create book review:", error);
    throw error;
  }
}

export async function deleteBookReview(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.delete(bookReviews).where(eq(bookReviews.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete book review:", error);
    throw error;
  }
}

// Helper: Get related books (same series or similar)
export async function getRelatedBooks(bookId: number, limit: number = 3) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const book = await getBookById(bookId);
    if (!book) return [];

    // If book is part of a series, get other books in the series
    if (book.series) {
      const seriesBooks = await db
        .select()
        .from(books)
        .where(and(eq(books.series, book.series), eq(books.id, bookId)))
        .orderBy(books.seriesOrder)
        .limit(limit);
      
      if (seriesBooks.length > 0) {
        return seriesBooks;
      }
    }

    // Otherwise, get other featured books
    return await db
      .select()
      .from(books)
      .where(and(eq(books.featured, true), eq(books.id, bookId)))
      .orderBy(desc(books.displayOrder))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get related books:", error);
    throw error;
  }
}

// ==================== NEWSLETTERS ====================

export async function getAllNewsletters() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get newsletters:", error);
    throw error;
  }
}

export async function getNewsletterById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get newsletter:", error);
    throw error;
  }
}

export async function createNewsletter(newsletter: InsertNewsletter) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(newsletters).values(newsletter);
  } catch (error) {
    console.error("[Database] Failed to create newsletter:", error);
    throw error;
  }
}

export async function updateNewsletter(id: number, newsletter: Partial<InsertNewsletter>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.update(newsletters).set(newsletter).where(eq(newsletters.id, id));
  } catch (error) {
    console.error("[Database] Failed to update newsletter:", error);
    throw error;
  }
}

export async function deleteNewsletter(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.delete(newsletters).where(eq(newsletters.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete newsletter:", error);
    throw error;
  }
}

// ==================== NEWSLETTER SUBSCRIBERS ====================

export async function getAllSubscribers(activeOnly?: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    if (activeOnly) {
      return await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "active"))
        .orderBy(desc(newsletterSubscribers.subscribedAt));
    }
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  } catch (error) {
    console.error("[Database] Failed to get subscribers:", error);
    throw error;
  }
}

export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get subscriber:", error);
    throw error;
  }
}

export async function createSubscriber(subscriber: InsertNewsletterSubscriber) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(newsletterSubscribers).values(subscriber);
  } catch (error) {
    console.error("[Database] Failed to create subscriber:", error);
    throw error;
  }
}

export async function updateSubscriber(id: number, subscriber: Partial<InsertNewsletterSubscriber>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.update(newsletterSubscribers).set(subscriber).where(eq(newsletterSubscribers.id, id));
  } catch (error) {
    console.error("[Database] Failed to update subscriber:", error);
    throw error;
  }
}

export async function unsubscribeByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db
      .update(newsletterSubscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.email, email));
  } catch (error) {
    console.error("[Database] Failed to unsubscribe:", error);
    throw error;
  }
}
