import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { InsertUser, users, blogPosts, InsertBlogPost, books, bookReviews, type Book, type InsertBook, type BookReview, type InsertBookReview, newsletters, newsletterSubscribers, type Newsletter, type InsertNewsletter, type NewsletterSubscriber, type InsertNewsletterSubscriber, exclusiveContent, readerClubMembers, contentAccess, type ExclusiveContent, type InsertExclusiveContent, type ReaderClubMember, type InsertReaderClubMember, type ContentAccess, type InsertContentAccess } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle({ connection: process.env.DATABASE_URL });
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

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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


// ============================================================================
// Reader's Club Functions
// ============================================================================

export async function getAllExclusiveContent(): Promise<ExclusiveContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exclusiveContent).orderBy(desc(exclusiveContent.displayOrder), desc(exclusiveContent.publishDate));
}

export async function getFeaturedExclusiveContent(): Promise<ExclusiveContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exclusiveContent).where(eq(exclusiveContent.featured, true)).orderBy(desc(exclusiveContent.displayOrder));
}

export async function getExclusiveContentBySlug(slug: string): Promise<ExclusiveContent | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(exclusiveContent).where(eq(exclusiveContent.slug, slug)).limit(1);
  return results[0] || null;
}

export async function getExclusiveContentById(id: number): Promise<ExclusiveContent | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(exclusiveContent).where(eq(exclusiveContent.id, id)).limit(1);
  return results[0] || null;
}

export async function getExclusiveContentByType(type: "bonus_chapter" | "interview" | "behind_scenes"): Promise<ExclusiveContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exclusiveContent).where(eq(exclusiveContent.type, type)).orderBy(desc(exclusiveContent.publishDate));
}

export async function createExclusiveContent(content: InsertExclusiveContent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(exclusiveContent).values(content);
  return result[0].insertId;
}

export async function updateExclusiveContent(id: number, content: Partial<InsertExclusiveContent>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(exclusiveContent).set(content).where(eq(exclusiveContent.id, id));
}

export async function deleteExclusiveContent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(exclusiveContent).where(eq(exclusiveContent.id, id));
}

// Reader's Club Members

export async function getReaderClubMemberByEmail(email: string): Promise<ReaderClubMember | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(readerClubMembers).where(eq(readerClubMembers.email, email)).limit(1);
  return results[0] || null;
}

export async function createReaderClubMember(member: InsertReaderClubMember): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(readerClubMembers).values(member);
  return result[0].insertId;
}

export async function updateReaderClubMemberAccess(memberId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(readerClubMembers).set({ lastAccessAt: new Date() }).where(eq(readerClubMembers.id, memberId));
}

export async function getAllReaderClubMembers(): Promise<ReaderClubMember[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readerClubMembers).orderBy(desc(readerClubMembers.joinedAt));
}

// Content Access Tracking

export async function trackContentAccess(memberId: number, contentId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if access record exists
  const existing = await db.select().from(contentAccess)
    .where(and(eq(contentAccess.memberId, memberId), eq(contentAccess.contentId, contentId)))
    .limit(1);
  
  if (existing.length > 0) {
    // Update view count
    const currentCount = existing[0].viewCount || 0;
    await db.update(contentAccess)
      .set({ viewCount: currentCount + 1, accessedAt: new Date() })
      .where(eq(contentAccess.id, existing[0].id));
  } else {
    // Create new access record
    await db.insert(contentAccess).values({ memberId, contentId });
  }
}

export async function getContentAccessStats(contentId: number): Promise<{ totalViews: number; uniqueMembers: number }> {
  const db = await getDb();
  if (!db) return { totalViews: 0, uniqueMembers: 0 };
  
  const results = await db.select().from(contentAccess).where(eq(contentAccess.contentId, contentId));
  const totalViews = results.reduce((sum, record) => sum + (record.viewCount || 0), 0);
  const uniqueMembers = results.length;
  
  return { totalViews, uniqueMembers };
}


// ==================== Browsing History Helpers ====================
import { browsingHistory, type BrowsingHistory, type InsertBrowsingHistory } from "../drizzle/schema";

export async function trackBookView(userId: number, bookId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  // Check if entry exists
  const [existing] = await db
    .select()
    .from(browsingHistory)
    .where(and(
      eq(browsingHistory.userId, userId),
      eq(browsingHistory.bookId, bookId)
    ));
  
  if (existing) {
    // Update existing entry
    await db
      .update(browsingHistory)
      .set({
        viewCount: existing.viewCount + 1,
        lastViewedAt: new Date(),
      })
      .where(eq(browsingHistory.id, existing.id));
  } else {
    // Create new entry
    await db.insert(browsingHistory).values({
      userId,
      bookId,
      viewCount: 1,
      lastViewedAt: new Date(),
    });
  }
}

export async function getRecentlyViewedBooks(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const history = await db
    .select({
      history: browsingHistory,
      book: books,
    })
    .from(browsingHistory)
    .innerJoin(books, eq(browsingHistory.bookId, books.id))
    .where(eq(browsingHistory.userId, userId))
    .orderBy(desc(browsingHistory.lastViewedAt))
    .limit(limit);
  
  return history;
}

export async function clearBrowsingHistory(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db
    .delete(browsingHistory)
    .where(eq(browsingHistory.userId, userId));
}


// ==================== User Profile Helpers ====================
import { userPreferences, type UserPreferences, type InsertUserPreferences } from "../drizzle/schema";

export async function getUserPreferences(userId: number): Promise<UserPreferences | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [prefs] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));
  
  return prefs || null;
}

export async function upsertUserPreferences(
  userId: number,
  preferences: Partial<InsertUserPreferences>
): Promise<UserPreferences | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Check if preferences exist
  const existing = await getUserPreferences(userId);
  
  if (existing) {
    // Update existing preferences
    await db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId));
  } else {
    // Create new preferences
    await db.insert(userPreferences).values({
      userId,
      ...preferences,
    });
  }
  
  return getUserPreferences(userId);
}

export async function getUserWithPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  
  if (!user) return null;
  
  const prefs = await getUserPreferences(userId);
  
  return {
    ...user,
    preferences: prefs,
  };
}

// ==================== User Purchases Helpers ====================
import { userPurchases, type UserPurchase, type InsertUserPurchase } from "../drizzle/schema";

export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const purchases = await db
    .select({
      purchase: userPurchases,
      book: books,
    })
    .from(userPurchases)
    .innerJoin(books, eq(userPurchases.bookId, books.id))
    .where(eq(userPurchases.userId, userId))
    .orderBy(desc(userPurchases.purchasedAt));
  
  return purchases;
}


export async function recordPurchase(data: {
  userId: number;
  productId: number;
  stripeSessionId: string;
  amount: number;
  currency: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // For now, we'll create a simplified purchase record
  // In a real implementation, you'd want to link this to actual products/books
  const result = await db.insert(userPurchases).values({
    userId: data.userId,
    bookId: data.productId, // Assuming productId maps to bookId
    purchasedAt: new Date(),
  });

  // Return the purchase record
  return {
    id: Date.now(), // Use timestamp as temporary ID
    ...data,
  };
}
