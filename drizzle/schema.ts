import { pgEnum, integer, pgTable, text, timestamp, varchar, boolean, json, serial, numeric, uniqueIndex } from "drizzle-orm/pg-core";



export const roleEnum = pgEnum("role", ["user", "admin", "protagonist", "love_interest", "antagonist", "supporting", "side_character", "minor"]);
export const preferredFormatEnum = pgEnum("preferredFormat", ["epub", "mobi", "pdf"]);
export const purchaseTypeEnum = pgEnum("purchaseType", ["single", "bundle", "subscription", "one_time"]);
export const publishedEnum = pgEnum("published", ["draft", "published"]);
export const statusEnum = pgEnum("status", ["draft", "scheduled", "sent", "active", "pending", "queued", "passed", "open", "failed", "delivered", "undelivered", "approved", "rejected", "warning", "resolved", "ignored", "unsubscribed", "subscribed", "bounced", "complained", "completed", "cancelled", "refunded", "processing", "shipped", "paused", "missed", "archived", "dismissed", "needs_login", "expired", "snoozed"]);
export const typeEnum = pgEnum("type", ["bonus_chapter", "interview", "behind_scenes"]);
export const aiRoleEnum = pgEnum("aiRole", ["user", "assistant"]);
export const aiContentTypeEnum = pgEnum("aiContentType", ["blog_post", "story_idea", "book_cover", "character_portrait", "social_graphic"]);
export const categoryEnum = pgEnum("category", ["romance", "passion", "fantasy", "reunion", "forbidden", "first_time", "system", "vip", "order", "marketing", "social", "email", "other", "business", "tool", "audio", "video", "design", "writing", "analytics", "kdp"]);
export const genderEnum = pgEnum("gender", ["male", "female", "neutral"]);
export const eventTypeEnum = pgEnum("eventType", ["opt_in", "opt_out", "resubscribe"]);
export const responseStatusEnum = pgEnum("responseStatus", ["success", "failed", "pending"]);
export const checkTypeEnum = pgEnum("checkType", ["pricing", "links", "content", "characters", "full_audit"]);
export const issueTypeEnum = pgEnum("issueType", ["pricing_mismatch", "broken_link", "content_error", "character_inconsistency", "missing_data"]);
export const severityEnum = pgEnum("severity", ["critical", "warning", "info"]);
export const linkTypeEnum = pgEnum("linkType", ["amazon", "social", "affiliate", "resource", "other"]);
export const lastStatusEnum = pgEnum("lastStatus", ["active", "broken", "redirected", "unknown"]);
export const relationshipTypeEnum = pgEnum("relationshipType", ["romantic", "family", "friend", "rival", "colleague", "enemy"]);
export const storylineTypeEnum = pgEnum("storylineType", ["main_plot", "subplot", "romance_arc", "character_arc", "mystery"]);
export const platformEnum = pgEnum("platform", ["amazon", "apple", "kobo", "barnes_noble", "google_play", "direct"]);
export const reportTypeEnum = pgEnum("reportType", ["daily_overview", "weekly_summary", "monthly_summary"]);
export const reminderTypeEnum = pgEnum("reminderType", ["broken_link", "pricing_check", "content_review", "qa_issue", "custom"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "urgent"]);
export const actionEnum = pgEnum("action", ["create", "update", "delete", "publish", "unpublish"]);
export const clickTypeEnum = pgEnum("clickType", ["inline", "card", "favorites"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User preferences for email and notification settings
 */
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id).unique(),
  // Email preferences
  emailNewReleases: boolean("emailNewReleases").default(true).notNull(),
  emailNewsletter: boolean("emailNewsletter").default(true).notNull(),
  emailPromotions: boolean("emailPromotions").default(true).notNull(),
  emailBlogPosts: boolean("emailBlogPosts").default(false).notNull(),
  // Reading preferences
  preferredFormat: preferredFormatEnum("preferredFormat").default("epub").notNull(),
  // Profile info
  displayName: varchar("displayName", { length: 100 }),
  bio: text("bio"),
  favoriteGenres: text("favoriteGenres"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

/**
 * User purchases for tracking book ownership
 */
export const userPurchases = pgTable("user_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  bookId: integer("bookId").notNull(),
  orderId: integer("orderId"),
  purchaseType: purchaseTypeEnum("purchaseType").default("single").notNull(),
  purchasePrice: integer("purchasePrice"), // in cents
  bonusContentUnlocked: boolean("bonusContentUnlocked").default(false).notNull(),
  downloadCount: integer("downloadCount").default(0).notNull(),
  lastDownloadAt: timestamp("lastDownloadAt"),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertUserPurchase = typeof userPurchases.$inferInsert;

/**
 * Blog posts table for content management
 */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: varchar("readTime", { length: 50 }).notNull(),
  published: publishedEnum("published").default("draft").notNull(),
  authorId: integer("authorId").notNull().references(() => users.id),
  featuredImage: text("featuredImage"), // URL to featured hero image for blog cards
  audioUrl: text("audioUrl"), // URL to generated audio narration
  scheduledPublishAt: timestamp("scheduledPublishAt"), // When to auto-publish this draft
  seoKeywords: text("seoKeywords"), // Comma-separated SEO keywords
  metaDescription: varchar("metaDescription", { length: 320 }), // SEO meta description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Books table for book catalog and details
 */
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  series: varchar("series", { length: 255 }),
  seriesOrder: integer("seriesOrder"),
  coverImage: text("coverImage").notNull(),
  description: text("description").notNull(),
  sampleChapter: text("sampleChapter"),
  rating: integer("rating").default(5), // 1-5 stars
  reviewCount: integer("reviewCount").default(0),
  tropes: text("tropes"), // JSON array of tropes
  heatLevel: integer("heatLevel").default(3), // 1-5 heat level
  pageCount: integer("pageCount"),
  publishDate: varchar("publishDate", { length: 100 }),
  amazonUrl: text("amazonUrl"),
  appleUrl: text("appleUrl"),
  koboUrl: text("koboUrl"),
  barnesNobleUrl: text("barnesNobleUrl"),
  googlePlayUrl: text("googlePlayUrl"),
  // Pricing fields for direct sales
  retailPrice: integer("retailPrice").default(499), // Price in cents (e.g., 499 = $4.99)
  directPrice: integer("directPrice").default(399), // Direct sales price in cents
  memberPrice: integer("memberPrice").default(299), // Reader's Club member price in cents
  directSaleUrl: text("directSaleUrl"), // URL for direct purchase
  audioSampleUrl: text("audioSampleUrl"), // URL to audio sample narration
  trailerVideoUrl: text("trailerVideoUrl"), // URL to animated book trailer video
  featured: boolean("featured").default(false),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Book reviews table for reader testimonials
 */
export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId").notNull().references(() => books.id),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  reviewerPhoto: text("reviewerPhoto"),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review").notNull(),
  source: varchar("source", { length: 100 }), // e.g., "Amazon", "Goodreads"
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookReview = typeof bookReviews.$inferSelect;
export type InsertBookReview = typeof bookReviews.$inferInsert;

/**
 * Newsletters table for managing email campaigns
 */
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  preheader: varchar("preheader", { length: 255 }),
  content: text("content").notNull(), // HTML content
  status: statusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  recipientCount: integer("recipientCount").default(0),
  openCount: integer("openCount").default(0),
  clickCount: integer("clickCount").default(0),
  createdBy: integer("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

/**
 * Reader's Club exclusive content
 */
export const exclusiveContent = pgTable("exclusive_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: typeEnum("type").notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  bookId: integer("bookId").references(() => books.id),
  featured: boolean("featured").default(false),
  displayOrder: integer("displayOrder").default(0),
  publishDate: timestamp("publishDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ExclusiveContent = typeof exclusiveContent.$inferSelect;
export type InsertExclusiveContent = typeof exclusiveContent.$inferInsert;

/**
 * Reader's Club members tracking
 */
export const readerClubMembers = pgTable("reader_club_members", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastAccessAt: timestamp("lastAccessAt"),
  active: boolean("active").default(true),
});

export type ReaderClubMember = typeof readerClubMembers.$inferSelect;
export type InsertReaderClubMember = typeof readerClubMembers.$inferInsert;

/**
 * Content access tracking
 */
export const contentAccess = pgTable("content_access", {
  id: serial("id").primaryKey(),
  memberId: integer("memberId").notNull().references(() => readerClubMembers.id),
  contentId: integer("contentId").notNull().references(() => exclusiveContent.id),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
  viewCount: integer("viewCount").default(1),
});

export type ContentAccess = typeof contentAccess.$inferSelect;
export type InsertContentAccess = typeof contentAccess.$inferInsert;

/**
 * Newsletter subscribers table
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  status: statusEnum("status").default("active").notNull(),
  source: varchar("source", { length: 100 }), // e.g., "website", "free_book", "quiz"
  mailerLiteId: varchar("mailerLiteId", { length: 100 }), // MailerLite subscriber ID
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
/**
 * AI Chat Messages - stores conversation history
 */
export const aiChatMessages = pgTable('ai_chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  role: aiRoleEnum("role").notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Character Quiz Results - stores quiz completions
 */
export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }),
  result: varchar('result', { length: 255 }).notNull(),
  personality: text('personality').notNull(),
  answers: text('answers').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;

/**
 * AI Generated Content - tracks AI usage
 */
export const aiGeneratedContent = pgTable('ai_generated_content', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  contentType: aiContentTypeEnum("content_type").notNull(),
  prompt: text('prompt').notNull(),
  result: text('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AiGeneratedContent = typeof aiGeneratedContent.$inferSelect;
export type InsertAiGeneratedContent = typeof aiGeneratedContent.$inferInsert;

/**
 * AI Studio Conversations - stores admin AI chat history
 */
export const aiStudioConversations = pgTable('ai_studio_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  systemPrompt: text('system_prompt'),
  messages: text('messages').notNull(), // JSON array of {role, content}
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type AiStudioConversation = typeof aiStudioConversations.$inferSelect;
export type InsertAiStudioConversation = typeof aiStudioConversations.$inferInsert;

/**
 * Digital Products table for Stripe integration
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  type: purchaseTypeEnum("type").notNull(),
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  features: text("features"), // JSON array of features
  downloadUrl: text("downloadUrl"), // For digital products
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table for tracking purchases
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  productId: integer("productId").notNull().references(() => products.id),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  amount: integer("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: statusEnum("status").default("pending").notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerName: varchar("customerName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Subscriptions table for recurring payments
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  productId: integer("productId").notNull().references(() => products.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull(),
  status: statusEnum("status").default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;


/**
 * Browsing history table for tracking user book views
 */
export const browsingHistory = pgTable("browsing_history", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  bookId: integer("bookId").notNull().references(() => books.id),
  viewCount: integer("viewCount").default(1).notNull(),
  lastViewedAt: timestamp("lastViewedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrowsingHistory = typeof browsingHistory.$inferSelect;
export type InsertBrowsingHistory = typeof browsingHistory.$inferInsert;


/**
 * VIP Membership Tiers
 */
export const vipTiers = pgTable("vip_tiers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // Bronze, Silver, Gold
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Monthly price in cents
  features: text("features").notNull(), // JSON array of features
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  storiesPerMonth: integer("storiesPerMonth").default(0), // Number of new stories per month
  customStoriesAllowed: boolean("customStoriesAllowed").default(false),
  personalizedMessages: boolean("personalizedMessages").default(false),
  displayOrder: integer("displayOrder").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VipTier = typeof vipTiers.$inferSelect;
export type InsertVipTier = typeof vipTiers.$inferInsert;

/**
 * VIP Members - tracks VIP subscription status
 */
export const vipMembers = pgTable("vip_members", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id).unique(),
  tierId: integer("tierId").notNull().references(() => vipTiers.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  status: statusEnum("status").default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  customStoriesUsed: integer("customStoriesUsed").default(0), // Track custom story requests this month
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VipMember = typeof vipMembers.$inferSelect;
export type InsertVipMember = typeof vipMembers.$inferInsert;

/**
 * Steamy Audio Stories - exclusive VIP content
 */
export const steamyStories = pgTable("steamy_stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Full story text
  excerpt: text("excerpt"), // Preview text for non-VIP
  audioUrl: text("audioUrl"), // ElevenLabs generated audio URL (full story)
  previewAudioUrl: text("previewAudioUrl"), // Short preview clip for non-members (10-15 seconds)
  audioDuration: integer("audioDuration"), // Duration in seconds
  coverImage: text("coverImage"),
  category: categoryEnum("category").default("romance").notNull(),
  heatLevel: integer("heatLevel").default(4), // 1-5 heat level
  characters: text("characters"), // JSON array of character names
  bookId: integer("bookId").references(() => books.id), // Optional link to a book
  minTier: integer("minTier").default(1), // Minimum tier required (1=Bronze, 2=Silver, 3=Gold)
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  publishedAt: timestamp("publishedAt"),
  playCount: integer("playCount").default(0),
  likeCount: integer("likeCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

/**
 * Shared rate-limit counters. Applied by hand from
 * drizzle/postgres/0028_ai_rate_limits.sql. The app does not create this table.
 * One row is one bucket (`${feature}:${caller}` or `global:${feature}`).
 * windowStart is a UTC wall-clock timestamp without time zone.
 */
export const aiRateLimits = pgTable("ai_rate_limits", {
  bucketId: varchar("bucketId", { length: 255 }).primaryKey(),
  count: integer("count").notNull(),
  windowStart: timestamp("windowStart").notNull(),
});

export type SteamyStory = typeof steamyStories.$inferSelect;
export type InsertSteamyStory = typeof steamyStories.$inferInsert;

/**
 * Custom Story Requests - Gold tier feature
 */
export const customStoryRequests = pgTable("custom_story_requests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  prompt: text("prompt").notNull(), // User's story request/fantasy
  characters: text("characters"), // Preferred characters
  setting: varchar("setting", { length: 255 }), // Story setting
  heatLevel: integer("heatLevel").default(4), // Requested heat level
  status: statusEnum("status").default("pending").notNull(),
  generatedStoryId: integer("generatedStoryId").references(() => steamyStories.id),
  audioUrl: text("audioUrl"), // Generated audio URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CustomStoryRequest = typeof customStoryRequests.$inferSelect;
export type InsertCustomStoryRequest = typeof customStoryRequests.$inferInsert;

/**
 * Story Likes - track user favorites
 */
export const storyLikes = pgTable("story_likes", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  storyId: integer("storyId").notNull().references(() => steamyStories.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoryLike = typeof storyLikes.$inferSelect;
export type InsertStoryLike = typeof storyLikes.$inferInsert;

/**
 * Story Play History - track listening history
 */
export const storyPlayHistory = pgTable("story_play_history", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  storyId: integer("storyId").notNull().references(() => steamyStories.id),
  progress: integer("progress").default(0), // Furthest playback position in seconds
  completed: boolean("completed").default(false),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("story_play_history_user_story_idx").on(table.userId, table.storyId),
]);

export type StoryPlayHistory = typeof storyPlayHistory.$inferSelect;
export type InsertStoryPlayHistory = typeof storyPlayHistory.$inferInsert;


/**
 * Audio Usage Tracking - tracks ElevenLabs usage per user
 */
export const audioUsage = pgTable("audio_usage", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  minutesUsed: integer("minutesUsed").notNull(), // Minutes of audio generated
  characterCount: integer("characterCount").notNull(), // Characters processed
  voiceId: varchar("voiceId", { length: 100 }).notNull(), // Voice used
  storyId: varchar("storyId", { length: 255 }), // Optional story reference
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AudioUsage = typeof audioUsage.$inferSelect;
export type InsertAudioUsage = typeof audioUsage.$inferInsert;

/**
 * Generated Audio Library - stores user's generated audio files
 */
export const generatedAudio = pgTable("generated_audio", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: integer("userId").notNull().references(() => users.id),
  storyId: varchar("storyId", { length: 255 }), // Optional story reference
  title: varchar("title", { length: 255 }).notNull(),
  audioUrl: text("audioUrl").notNull(),
  durationSeconds: integer("durationSeconds").notNull(),
  voiceId: varchar("voiceId", { length: 100 }).notNull(),
  characterCount: integer("characterCount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedAudio = typeof generatedAudio.$inferSelect;
export type InsertGeneratedAudio = typeof generatedAudio.$inferInsert;

/**
 * Voice Library - custom voices and presets
 */
export const voicePresets = pgTable("voice_presets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id), // null = system preset
  name: varchar("name", { length: 100 }).notNull(),
  elevenLabsVoiceId: varchar("elevenLabsVoiceId", { length: 100 }).notNull(),
  description: text("description"),
  style: varchar("style", { length: 50 }), // warm, commanding, sensual, etc.
  gender: genderEnum("gender").notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  stability: integer("stability").default(50), // 0-100
  similarityBoost: integer("similarityBoost").default(75), // 0-100
  styleIntensity: integer("styleIntensity").default(50), // 0-100
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VoicePreset = typeof voicePresets.$inferSelect;
export type InsertVoicePreset = typeof voicePresets.$inferInsert;

/**
 * Character Voice Assignments - map characters to voices
 */
export const characterVoiceAssignments = pgTable("character_voice_assignments", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id), // null = default assignment
  characterName: varchar("characterName", { length: 100 }).notNull(),
  bookTitle: varchar("bookTitle", { length: 255 }),
  voicePresetId: integer("voicePresetId").references(() => voicePresets.id),
  elevenLabsVoiceId: varchar("elevenLabsVoiceId", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CharacterVoiceAssignment = typeof characterVoiceAssignments.$inferSelect;
export type InsertCharacterVoiceAssignment = typeof characterVoiceAssignments.$inferInsert;

/**
 * MailerLite Webhook Events Log - tracks all webhook events received
 */
export const mailerLiteWebhookEvents = pgTable("mailerlite_webhook_events", {
  id: serial("id").primaryKey(),
  eventType: varchar("eventType", { length: 100 }).notNull(), // e.g., "subscriber.created"
  subscriberId: varchar("subscriberId", { length: 100 }), // MailerLite subscriber ID
  subscriberEmail: varchar("subscriberEmail", { length: 320 }),
  groupId: varchar("groupId", { length: 100 }), // For group-related events
  groupName: varchar("groupName", { length: 255 }),
  payload: text("payload").notNull(), // Full webhook payload as JSON string
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processedAt"),
  error: text("error"), // Error message if processing failed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MailerLiteWebhookEvent = typeof mailerLiteWebhookEvents.$inferSelect;
export type InsertMailerLiteWebhookEvent = typeof mailerLiteWebhookEvents.$inferInsert;


/**
 * SMS notification templates for automated messaging
 */
export const smsTemplates = pgTable("sms_templates", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  messageTemplate: text("messageTemplate").notNull(),
  category: categoryEnum("category").default("system").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SmsTemplate = typeof smsTemplates.$inferSelect;
export type InsertSmsTemplate = typeof smsTemplates.$inferInsert;

/**
 * User SMS preferences and phone number storage
 */
export const userSmsPreferences = pgTable("user_sms_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id).unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  phoneVerified: boolean("phoneVerified").default(false).notNull(),
  smsOptIn: boolean("smsOptIn").default(false).notNull(),
  smsNewReleases: boolean("smsNewReleases").default(true).notNull(),
  smsVipAlerts: boolean("smsVipAlerts").default(true).notNull(),
  smsOrderUpdates: boolean("smsOrderUpdates").default(true).notNull(),
  smsMarketing: boolean("smsMarketing").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserSmsPreferences = typeof userSmsPreferences.$inferSelect;
export type InsertUserSmsPreferences = typeof userSmsPreferences.$inferInsert;

/**
 * SMS message log for tracking sent messages
 */
export const smsMessageLog = pgTable("sms_message_log", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  templateId: integer("templateId").references(() => smsTemplates.id),
  toPhoneNumber: varchar("toPhoneNumber", { length: 20 }).notNull(),
  messageBody: text("messageBody").notNull(),
  twilioSid: varchar("twilioSid", { length: 64 }),
  status: statusEnum("status").default("queued").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

export type SmsMessageLog = typeof smsMessageLog.$inferSelect;
export type InsertSmsMessageLog = typeof smsMessageLog.$inferInsert;


/**
 * SMS analytics daily aggregation for dashboard metrics
 */
export const smsAnalyticsDaily = pgTable("sms_analytics_daily", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalSent: integer("totalSent").default(0).notNull(),
  totalDelivered: integer("totalDelivered").default(0).notNull(),
  totalFailed: integer("totalFailed").default(0).notNull(),
  totalOptIns: integer("totalOptIns").default(0).notNull(),
  totalOptOuts: integer("totalOptOuts").default(0).notNull(),
  totalResponses: integer("totalResponses").default(0).notNull(),
  deliveryRate: numeric("deliveryRate", { precision: 5, scale: 2 }),
  responseRate: numeric("responseRate", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SmsAnalyticsDaily = typeof smsAnalyticsDaily.$inferSelect;
export type InsertSmsAnalyticsDaily = typeof smsAnalyticsDaily.$inferInsert;

/**
 * SMS opt-in/opt-out events for tracking trends
 */
export const smsOptEvents = pgTable("sms_opt_events", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  userId: integer("userId").references(() => users.id),
  eventType: eventTypeEnum("eventType").notNull(),
  source: varchar("source", { length: 50 }), // e.g., "vip_signup", "sms_reply", "admin", "webhook"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsOptEvent = typeof smsOptEvents.$inferSelect;
export type InsertSmsOptEvent = typeof smsOptEvents.$inferInsert;

/**
 * SMS incoming messages for response tracking
 */
export const smsIncomingMessages = pgTable("sms_incoming_messages", {
  id: serial("id").primaryKey(),
  fromPhoneNumber: varchar("fromPhoneNumber", { length: 20 }).notNull(),
  messageBody: text("messageBody").notNull(),
  twilioSid: varchar("twilioSid", { length: 64 }),
  keyword: varchar("keyword", { length: 20 }), // STOP, START, HELP, etc.
  processed: boolean("processed").default(false).notNull(),
  responseStatus: responseStatusEnum("responseStatus").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsIncomingMessage = typeof smsIncomingMessages.$inferSelect;
export type InsertSmsIncomingMessage = typeof smsIncomingMessages.$inferInsert;


/**
 * QA Checks - tracks daily consistency checks across the website
 */
export const qaChecks = pgTable("qa_checks", {
  id: serial("id").primaryKey(),
  checkDate: timestamp("checkDate").notNull(),
  checkType: checkTypeEnum("checkType").notNull(),
  status: statusEnum("status").default("passed").notNull(),
  itemsChecked: integer("itemsChecked").default(0).notNull(),
  issuesFound: integer("issuesFound").default(0).notNull(),
  details: text("details"), // JSON with detailed check results
  autoResolved: integer("autoResolved").default(0), // Issues auto-fixed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QaCheck = typeof qaChecks.$inferSelect;
export type InsertQaCheck = typeof qaChecks.$inferInsert;

/**
 * QA Issues - individual issues found during QA checks
 */
export const qaIssues = pgTable("qa_issues", {
  id: serial("id").primaryKey(),
  checkId: integer("checkId").references(() => qaChecks.id),
  issueType: issueTypeEnum("issueType").notNull(),
  severity: severityEnum("severity").default("warning").notNull(),
  location: varchar("location", { length: 255 }).notNull(), // Page/component where issue was found
  description: text("description").notNull(),
  expectedValue: text("expectedValue"),
  actualValue: text("actualValue"),
  status: statusEnum("status").default("open").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolvedBy: integer("resolvedBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QaIssue = typeof qaIssues.$inferSelect;
export type InsertQaIssue = typeof qaIssues.$inferInsert;

/**
 * External Links - tracks all external links used across the website
 */
export const externalLinks = pgTable("external_links", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  displayText: varchar("displayText", { length: 255 }),
  linkType: linkTypeEnum("linkType").default("other").notNull(),
  location: varchar("location", { length: 255 }).notNull(), // Page where link appears
  componentPath: varchar("componentPath", { length: 255 }), // Component file path
  lastChecked: timestamp("lastChecked"),
  lastStatus: lastStatusEnum("lastStatus").default("unknown").notNull(),
  httpStatus: integer("httpStatus"),
  responseTime: integer("responseTime"), // in milliseconds
  checkCount: integer("checkCount").default(0).notNull(),
  failCount: integer("failCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ExternalLink = typeof externalLinks.$inferSelect;
export type InsertExternalLink = typeof externalLinks.$inferInsert;

/**
 * Book Characters - detailed character information for each book
 */
export const bookCharacters = pgTable("book_characters", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId").notNull().references(() => books.id),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }),
  role: roleEnum("role").notNull(),
  description: text("description"),
  physicalDescription: text("physicalDescription"),
  personality: text("personality"),
  backstory: text("backstory"),
  occupation: varchar("occupation", { length: 255 }),
  age: varchar("age", { length: 50 }),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BookCharacter = typeof bookCharacters.$inferSelect;
export type InsertBookCharacter = typeof bookCharacters.$inferInsert;

/**
 * Character Relationships - tracks relationships between characters
 */
export const characterRelationships = pgTable("character_relationships", {
  id: serial("id").primaryKey(),
  character1Id: integer("character1Id").notNull().references(() => bookCharacters.id),
  character2Id: integer("character2Id").notNull().references(() => bookCharacters.id),
  relationshipType: relationshipTypeEnum("relationshipType").notNull(),
  description: text("description"),
  bookId: integer("bookId").references(() => books.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship = typeof characterRelationships.$inferInsert;

/**
 * Book Storylines - tracks main plot points and storylines
 */
export const bookStorylines = pgTable("book_storylines", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId").notNull().references(() => books.id),
  title: varchar("title", { length: 255 }).notNull(),
  storylineType: storylineTypeEnum("storylineType").notNull(),
  description: text("description").notNull(),
  keyEvents: text("keyEvents"), // JSON array of key plot points
  resolution: text("resolution"),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BookStoryline = typeof bookStorylines.$inferSelect;
export type InsertBookStoryline = typeof bookStorylines.$inferInsert;

/**
 * Book Pricing History - tracks pricing changes over time
 */
export const bookPricingHistory = pgTable("book_pricing_history", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId").notNull().references(() => books.id),
  platform: platformEnum("platform").notNull(),
  price: varchar("price", { length: 50 }).notNull(), // e.g., "$2.99"
  priceInCents: integer("priceInCents"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  verifiedAt: timestamp("verifiedAt").notNull(),
  verificationSource: varchar("verificationSource", { length: 100 }), // "manual", "api", "scrape"
  previousPrice: varchar("previousPrice", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookPricingHistory = typeof bookPricingHistory.$inferSelect;
export type InsertBookPricingHistory = typeof bookPricingHistory.$inferInsert;

/**
 * Daily Reports - automated daily website health reports
 */
export const dailyReports = pgTable("daily_reports", {
  id: serial("id").primaryKey(),
  reportDate: timestamp("reportDate").notNull(),
  reportType: reportTypeEnum("reportType").default("daily_overview").notNull(),
  // Traffic metrics
  pageViews: integer("pageViews").default(0),
  uniqueVisitors: integer("uniqueVisitors").default(0),
  bounceRate: numeric("bounceRate", { precision: 5, scale: 2 }),
  avgSessionDuration: integer("avgSessionDuration"), // in seconds
  // Content metrics
  newSubscribers: integer("newSubscribers").default(0),
  unsubscribes: integer("unsubscribes").default(0),
  blogPostViews: integer("blogPostViews").default(0),
  bookPageViews: integer("bookPageViews").default(0),
  // QA metrics
  qaChecksPassed: integer("qaChecksPassed").default(0),
  qaChecksFailed: integer("qaChecksFailed").default(0),
  openIssues: integer("openIssues").default(0),
  resolvedIssues: integer("resolvedIssues").default(0),
  brokenLinksFound: integer("brokenLinksFound").default(0),
  // Revenue metrics
  totalOrders: integer("totalOrders").default(0),
  totalRevenue: integer("totalRevenue").default(0), // in cents
  // Summary
  summary: text("summary"), // AI-generated or manual summary
  alerts: text("alerts"), // JSON array of important alerts
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyReport = typeof dailyReports.$inferSelect;
export type InsertDailyReport = typeof dailyReports.$inferInsert;

/**
 * Admin Reminders - scheduled reminders for admin tasks
 */
export const adminReminders = pgTable("admin_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  reminderType: reminderTypeEnum("reminderType").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }), // "book", "link", "blog", etc.
  relatedEntityId: integer("relatedEntityId"),
  dueDate: timestamp("dueDate"),
  status: statusEnum("status").default("pending").notNull(),
  snoozedUntil: timestamp("snoozedUntil"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AdminReminder = typeof adminReminders.$inferSelect;
export type InsertAdminReminder = typeof adminReminders.$inferInsert;

/**
 * Content Audit Log - tracks all content changes for QA
 */
export const contentAuditLog = pgTable("content_audit_log", {
  id: serial("id").primaryKey(),
  entityType: varchar("entityType", { length: 50 }).notNull(), // "book", "blog", "character", etc.
  entityId: integer("entityId").notNull(),
  action: actionEnum("action").notNull(),
  fieldChanged: varchar("fieldChanged", { length: 100 }),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  changedBy: integer("changedBy").references(() => users.id),
  changeReason: text("changeReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentAuditLog = typeof contentAuditLog.$inferSelect;
export type InsertContentAuditLog = typeof contentAuditLog.$inferInsert;


/**
 * Business Metrics - daily tracking of KDP business KPIs
 */
export const businessMetrics = pgTable("business_metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  // MailerLite metrics
  totalSubscribers: integer("totalSubscribers").default(0),
  newSubscribers: integer("newSubscribers").default(0),
  unsubscribes: integer("unsubscribes").default(0),
  emailOpenRate: numeric("emailOpenRate", { precision: 5, scale: 2 }),
  emailClickRate: numeric("emailClickRate", { precision: 5, scale: 2 }),
  // Website metrics
  pageViews: integer("pageViews").default(0),
  uniqueVisitors: integer("uniqueVisitors").default(0),
  // Revenue metrics
  dailyRevenue: integer("dailyRevenue").default(0), // in cents
  ordersCount: integer("ordersCount").default(0),
  // Social metrics
  instagramFollowers: integer("instagramFollowers"),
  tiktokFollowers: integer("tiktokFollowers"),
  goodreadsFollowers: integer("goodreadsFollowers"),
  // Book metrics
  amazonRanking: integer("amazonRanking"),
  reviewCount: integer("reviewCount"),
  averageRating: numeric("averageRating", { precision: 3, scale: 2 }),
  // KDP-specific
  kdpRoyalties: integer("kdpRoyalties"), // in cents
  pagesRead: integer("pagesRead"), // Kindle Unlimited
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BusinessMetric = typeof businessMetrics.$inferSelect;
export type InsertBusinessMetric = typeof businessMetrics.$inferInsert;

/**
 * Business Goals - monthly/quarterly goal tracking
 */
export const businessGoals = pgTable("business_goals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  targetValue: integer("targetValue").notNull(),
  currentValue: integer("currentValue").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., "subscribers", "dollars", "posts"
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: statusEnum("status").default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BusinessGoal = typeof businessGoals.$inferSelect;
export type InsertBusinessGoal = typeof businessGoals.$inferInsert;

/**
 * Tool Inventory - catalog of all AppSumo and business tools
 */
export const toolInventory = pgTable("tool_inventory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  category: categoryEnum("category").notNull(),
  plan: varchar("plan", { length: 100 }), // e.g., "AppSumo Single", "All Access", "Premium"
  loginEmail: varchar("loginEmail", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 50 }), // "email", "google", "manual"
  status: statusEnum("status").default("active").notNull(),
  description: text("description"),
  kdpUseCases: text("kdpUseCases"), // JSON array of use cases
  features: text("features"), // JSON array of features
  usageLimits: text("usageLimits"), // JSON object with usage/limits info
  lastChecked: timestamp("lastChecked"),
  iconEmoji: varchar("iconEmoji", { length: 10 }),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ToolInventoryItem = typeof toolInventory.$inferSelect;
export type InsertToolInventoryItem = typeof toolInventory.$inferInsert;

/**
 * Daily Briefings - AI-generated executive summaries
 */
export const dailyBriefings = pgTable("daily_briefings", {
  id: serial("id").primaryKey(),
  briefingDate: timestamp("briefingDate").notNull(),
  // Sections
  executiveSummary: text("executiveSummary").notNull(),
  subscriberUpdate: text("subscriberUpdate"),
  revenueUpdate: text("revenueUpdate"),
  contentUpdate: text("contentUpdate"),
  goalProgress: text("goalProgress"),
  actionItems: text("actionItems"), // JSON array of action items
  alerts: text("alerts"), // JSON array of alerts/warnings
  toolRecommendations: text("toolRecommendations"), // JSON array
  // Metadata
  dataSnapshot: text("dataSnapshot"), // JSON object with all raw data used
  emailSent: boolean("emailSent").default(false),
  emailSentAt: timestamp("emailSentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyBriefing = typeof dailyBriefings.$inferSelect;
export type InsertDailyBriefing = typeof dailyBriefings.$inferInsert;

/**
 * Affiliate click tracking for Amazon Associates and other affiliate programs.
 * Tracks clicks on affiliate links to measure performance by product, article, and source.
 */
export const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  /** The product name or identifier that was clicked */
  productName: varchar("productName", { length: 255 }).notNull(),
  /** The Amazon ASIN or product identifier */
  productId: varchar("productId", { length: 64 }),
  /** The affiliate URL that was clicked */
  affiliateUrl: text("affiliateUrl").notNull(),
  /** The blog post slug or page where the click originated */
  sourceSlug: varchar("sourceSlug", { length: 255 }).notNull(),
  /** The type of click: 'inline' (text link), 'card' (product card CTA), 'favorites' (favorites page) */
  clickType: clickTypeEnum("clickType").default("inline").notNull(),
  /** Anonymous session identifier for deduplication (hashed) */
  sessionHash: varchar("sessionHash", { length: 64 }),
  /** User agent string for device analytics */
  userAgent: text("userAgent"),
  /** Referrer URL */
  referrer: text("referrer"),
  /** IP-based country code (2-letter) for geo analytics */
  country: varchar("country", { length: 2 }),
  /** Logged-in user ID (nullable for anonymous visitors) */
  userId: integer("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = typeof affiliateClicks.$inferInsert;

/**
 * Daily aggregated affiliate metrics for dashboard charts.
 * Pre-computed daily rollups to avoid expensive queries on the raw clicks table.
 */
export const affiliateMetricsDaily = pgTable("affiliate_metrics_daily", {
  id: serial("id").primaryKey(),
  /** The date for this metrics row */
  metricDate: timestamp("metricDate").notNull(),
  /** Total clicks across all products */
  totalClicks: integer("totalClicks").default(0).notNull(),
  /** Unique sessions (deduplicated by sessionHash) */
  uniqueClicks: integer("uniqueClicks").default(0).notNull(),
  /** Top product by clicks (JSON: {name, clicks, url}) */
  topProduct: text("topProduct"),
  /** Top source article by clicks (JSON: {slug, clicks}) */
  topSource: text("topSource"),
  /** Breakdown by click type (JSON: {inline, card, favorites}) */
  clickTypeBreakdown: text("clickTypeBreakdown"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateMetricsDaily = typeof affiliateMetricsDaily.$inferSelect;
export type InsertAffiliateMetricsDaily = typeof affiliateMetricsDaily.$inferInsert;


/**
 * Partner author applications for group promo events
 */
export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  /** Author's full name */
  authorName: varchar("authorName", { length: 255 }).notNull(),
  /** Author's email address */
  email: varchar("email", { length: 320 }).notNull(),
  /** Author's website URL */
  website: text("website"),
  /** Book title being offered for the promo */
  bookTitle: varchar("bookTitle", { length: 255 }).notNull(),
  /** Book genre (e.g., Billionaire Romance, Dark Romance) */
  genre: varchar("genre", { length: 100 }).notNull(),
  /** Comma-separated tropes */
  tropes: text("tropes"),
  /** Short book description / blurb */
  bookDescription: text("bookDescription").notNull(),
  /** BookFunnel or StoryOrigin download link */
  downloadLink: text("downloadLink"),
  /** Book cover image URL */
  coverImageUrl: text("coverImageUrl"),
  /** Author's newsletter subscriber count (approximate) */
  subscriberCount: varchar("subscriberCount", { length: 50 }),
  /** Social media links (JSON) */
  socialLinks: text("socialLinks"),
  /** Application status */
  status: statusEnum("status").default("pending").notNull(),
  /** Admin notes */
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = typeof partnerApplications.$inferInsert;
