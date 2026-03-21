import { int, mysqlTable, text, timestamp, varchar, mysqlEnum, boolean, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User preferences for email and notification settings
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  // Email preferences
  emailNewReleases: boolean("emailNewReleases").default(true).notNull(),
  emailNewsletter: boolean("emailNewsletter").default(true).notNull(),
  emailPromotions: boolean("emailPromotions").default(true).notNull(),
  emailBlogPosts: boolean("emailBlogPosts").default(false).notNull(),
  // Reading preferences
  preferredFormat: mysqlEnum("preferredFormat", ["epub", "mobi", "pdf"]).default("epub").notNull(),
  // Profile info
  displayName: varchar("displayName", { length: 100 }),
  bio: text("bio"),
  favoriteGenres: text("favoriteGenres"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

/**
 * User purchases for tracking book ownership
 */
export const userPurchases = mysqlTable("user_purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  bookId: int("bookId").notNull(),
  orderId: int("orderId"),
  purchaseType: mysqlEnum("purchaseType", ["single", "bundle", "subscription"]).default("single").notNull(),
  purchasePrice: int("purchasePrice"), // in cents
  bonusContentUnlocked: boolean("bonusContentUnlocked").default(false).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  lastDownloadAt: timestamp("lastDownloadAt"),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertUserPurchase = typeof userPurchases.$inferInsert;

/**
 * Blog posts table for content management
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: varchar("readTime", { length: 50 }).notNull(),
  published: mysqlEnum("published", ["draft", "published"]).default("draft").notNull(),
  authorId: int("authorId").notNull().references(() => users.id),
  audioUrl: text("audioUrl"), // URL to generated audio narration
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Books table for book catalog and details
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  series: varchar("series", { length: 255 }),
  seriesOrder: int("seriesOrder"),
  coverImage: text("coverImage").notNull(),
  description: text("description").notNull(),
  sampleChapter: text("sampleChapter"),
  rating: int("rating").default(5), // 1-5 stars
  reviewCount: int("reviewCount").default(0),
  tropes: text("tropes"), // JSON array of tropes
  heatLevel: int("heatLevel").default(3), // 1-5 heat level
  pageCount: int("pageCount"),
  publishDate: varchar("publishDate", { length: 100 }),
  amazonUrl: text("amazonUrl"),
  appleUrl: text("appleUrl"),
  koboUrl: text("koboUrl"),
  barnesNobleUrl: text("barnesNobleUrl"),
  googlePlayUrl: text("googlePlayUrl"),
  // Pricing fields for direct sales
  retailPrice: int("retailPrice").default(499), // Price in cents (e.g., 499 = $4.99)
  directPrice: int("directPrice").default(399), // Direct sales price in cents
  memberPrice: int("memberPrice").default(299), // Reader's Club member price in cents
  directSaleUrl: text("directSaleUrl"), // URL for direct purchase
  audioSampleUrl: text("audioSampleUrl"), // URL to audio sample narration
  featured: boolean("featured").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Book reviews table for reader testimonials
 */
export const bookReviews = mysqlTable("book_reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  reviewerPhoto: text("reviewerPhoto"),
  rating: int("rating").notNull(), // 1-5 stars
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
export const newsletters = mysqlTable("newsletters", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  preheader: varchar("preheader", { length: 255 }),
  content: text("content").notNull(), // HTML content
  status: mysqlEnum("status", ["draft", "scheduled", "sent"]).default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  recipientCount: int("recipientCount").default(0),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  createdBy: int("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

/**
 * Reader's Club exclusive content
 */
export const exclusiveContent = mysqlTable("exclusive_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  type: mysqlEnum("type", ["bonus_chapter", "interview", "behind_scenes"]).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  bookId: int("bookId").references(() => books.id),
  featured: boolean("featured").default(false),
  displayOrder: int("displayOrder").default(0),
  publishDate: timestamp("publishDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExclusiveContent = typeof exclusiveContent.$inferSelect;
export type InsertExclusiveContent = typeof exclusiveContent.$inferInsert;

/**
 * Reader's Club members tracking
 */
export const readerClubMembers = mysqlTable("reader_club_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
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
export const contentAccess = mysqlTable("content_access", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull().references(() => readerClubMembers.id),
  contentId: int("contentId").notNull().references(() => exclusiveContent.id),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
  viewCount: int("viewCount").default(1),
});

export type ContentAccess = typeof contentAccess.$inferSelect;
export type InsertContentAccess = typeof contentAccess.$inferInsert;

/**
 * Newsletter subscribers table
 */
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
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
export const aiChatMessages = mysqlTable('ai_chat_messages', {
  id: int('id').autoincrement().primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'assistant']).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Character Quiz Results - stores quiz completions
 */
export const quizResults = mysqlTable('quiz_results', {
  id: int('id').autoincrement().primaryKey(),
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
export const aiGeneratedContent = mysqlTable('ai_generated_content', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.id),
  contentType: mysqlEnum('content_type', [
    'blog_post',
    'story_idea',
    'book_cover',
    'character_portrait',
    'social_graphic',
  ]).notNull(),
  prompt: text('prompt').notNull(),
  result: text('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AiGeneratedContent = typeof aiGeneratedContent.$inferSelect;
export type InsertAiGeneratedContent = typeof aiGeneratedContent.$inferInsert;

/**
 * AI Studio Conversations - stores admin AI chat history
 */
export const aiStudioConversations = mysqlTable('ai_studio_conversations', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  systemPrompt: text('system_prompt'),
  messages: text('messages').notNull(), // JSON array of {role, content}
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type AiStudioConversation = typeof aiStudioConversations.$inferSelect;
export type InsertAiStudioConversation = typeof aiStudioConversations.$inferInsert;

/**
 * Digital Products table for Stripe integration
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: int("price").notNull(), // Price in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  type: mysqlEnum("type", ["one_time", "subscription"]).notNull(),
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  features: text("features"), // JSON array of features
  downloadUrl: text("downloadUrl"), // For digital products
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table for tracking purchases
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  productId: int("productId").notNull().references(() => products.id),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  amount: int("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerName: varchar("customerName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Subscriptions table for recurring payments
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productId: int("productId").notNull().references(() => products.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;


/**
 * Browsing history table for tracking user book views
 */
export const browsingHistory = mysqlTable("browsing_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  bookId: int("bookId").notNull().references(() => books.id),
  viewCount: int("viewCount").default(1).notNull(),
  lastViewedAt: timestamp("lastViewedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrowsingHistory = typeof browsingHistory.$inferSelect;
export type InsertBrowsingHistory = typeof browsingHistory.$inferInsert;


/**
 * VIP Membership Tiers
 */
export const vipTiers = mysqlTable("vip_tiers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // Bronze, Silver, Gold
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  price: int("price").notNull(), // Monthly price in cents
  features: text("features").notNull(), // JSON array of features
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  stripeProductId: varchar("stripeProductId", { length: 255 }),
  storiesPerMonth: int("storiesPerMonth").default(0), // Number of new stories per month
  customStoriesAllowed: boolean("customStoriesAllowed").default(false),
  personalizedMessages: boolean("personalizedMessages").default(false),
  displayOrder: int("displayOrder").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VipTier = typeof vipTiers.$inferSelect;
export type InsertVipTier = typeof vipTiers.$inferInsert;

/**
 * VIP Members - tracks VIP subscription status
 */
export const vipMembers = mysqlTable("vip_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  tierId: int("tierId").notNull().references(() => vipTiers.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "trial"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  customStoriesUsed: int("customStoriesUsed").default(0), // Track custom story requests this month
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VipMember = typeof vipMembers.$inferSelect;
export type InsertVipMember = typeof vipMembers.$inferInsert;

/**
 * Steamy Audio Stories - exclusive VIP content
 */
export const steamyStories = mysqlTable("steamy_stories", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Full story text
  excerpt: text("excerpt"), // Preview text for non-VIP
  audioUrl: text("audioUrl"), // ElevenLabs generated audio URL (full story)
  previewAudioUrl: text("previewAudioUrl"), // Short preview clip for non-members (10-15 seconds)
  audioDuration: int("audioDuration"), // Duration in seconds
  coverImage: text("coverImage"),
  category: mysqlEnum("category", ["romance", "passion", "fantasy", "reunion", "forbidden", "first_time"]).default("romance").notNull(),
  heatLevel: int("heatLevel").default(4), // 1-5 heat level
  characters: text("characters"), // JSON array of character names
  bookId: int("bookId").references(() => books.id), // Optional link to a book
  minTier: int("minTier").default(1), // Minimum tier required (1=Bronze, 2=Silver, 3=Gold)
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  publishedAt: timestamp("publishedAt"),
  playCount: int("playCount").default(0),
  likeCount: int("likeCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SteamyStory = typeof steamyStories.$inferSelect;
export type InsertSteamyStory = typeof steamyStories.$inferInsert;

/**
 * Custom Story Requests - Gold tier feature
 */
export const customStoryRequests = mysqlTable("custom_story_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  prompt: text("prompt").notNull(), // User's story request/fantasy
  characters: text("characters"), // Preferred characters
  setting: varchar("setting", { length: 255 }), // Story setting
  heatLevel: int("heatLevel").default(4), // Requested heat level
  status: mysqlEnum("status", ["pending", "generating", "completed", "failed"]).default("pending").notNull(),
  generatedStoryId: int("generatedStoryId").references(() => steamyStories.id),
  audioUrl: text("audioUrl"), // Generated audio URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CustomStoryRequest = typeof customStoryRequests.$inferSelect;
export type InsertCustomStoryRequest = typeof customStoryRequests.$inferInsert;

/**
 * Story Likes - track user favorites
 */
export const storyLikes = mysqlTable("story_likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  storyId: int("storyId").notNull().references(() => steamyStories.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoryLike = typeof storyLikes.$inferSelect;
export type InsertStoryLike = typeof storyLikes.$inferInsert;

/**
 * Story Play History - track listening history
 */
export const storyPlayHistory = mysqlTable("story_play_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  storyId: int("storyId").notNull().references(() => steamyStories.id),
  progress: int("progress").default(0), // Playback progress in seconds
  completed: boolean("completed").default(false),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
});

export type StoryPlayHistory = typeof storyPlayHistory.$inferSelect;
export type InsertStoryPlayHistory = typeof storyPlayHistory.$inferInsert;


/**
 * Audio Usage Tracking - tracks ElevenLabs usage per user
 */
export const audioUsage = mysqlTable("audio_usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  minutesUsed: int("minutesUsed").notNull(), // Minutes of audio generated
  characterCount: int("characterCount").notNull(), // Characters processed
  voiceId: varchar("voiceId", { length: 100 }).notNull(), // Voice used
  storyId: varchar("storyId", { length: 255 }), // Optional story reference
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AudioUsage = typeof audioUsage.$inferSelect;
export type InsertAudioUsage = typeof audioUsage.$inferInsert;

/**
 * Generated Audio Library - stores user's generated audio files
 */
export const generatedAudio = mysqlTable("generated_audio", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: int("userId").notNull().references(() => users.id),
  storyId: varchar("storyId", { length: 255 }), // Optional story reference
  title: varchar("title", { length: 255 }).notNull(),
  audioUrl: text("audioUrl").notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  voiceId: varchar("voiceId", { length: 100 }).notNull(),
  characterCount: int("characterCount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedAudio = typeof generatedAudio.$inferSelect;
export type InsertGeneratedAudio = typeof generatedAudio.$inferInsert;

/**
 * Voice Library - custom voices and presets
 */
export const voicePresets = mysqlTable("voice_presets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id), // null = system preset
  name: varchar("name", { length: 100 }).notNull(),
  elevenLabsVoiceId: varchar("elevenLabsVoiceId", { length: 100 }).notNull(),
  description: text("description"),
  style: varchar("style", { length: 50 }), // warm, commanding, sensual, etc.
  gender: mysqlEnum("gender", ["male", "female", "neutral"]).notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  stability: int("stability").default(50), // 0-100
  similarityBoost: int("similarityBoost").default(75), // 0-100
  styleIntensity: int("styleIntensity").default(50), // 0-100
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VoicePreset = typeof voicePresets.$inferSelect;
export type InsertVoicePreset = typeof voicePresets.$inferInsert;

/**
 * Character Voice Assignments - map characters to voices
 */
export const characterVoiceAssignments = mysqlTable("character_voice_assignments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id), // null = default assignment
  characterName: varchar("characterName", { length: 100 }).notNull(),
  bookTitle: varchar("bookTitle", { length: 255 }),
  voicePresetId: int("voicePresetId").references(() => voicePresets.id),
  elevenLabsVoiceId: varchar("elevenLabsVoiceId", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CharacterVoiceAssignment = typeof characterVoiceAssignments.$inferSelect;
export type InsertCharacterVoiceAssignment = typeof characterVoiceAssignments.$inferInsert;

/**
 * MailerLite Webhook Events Log - tracks all webhook events received
 */
export const mailerLiteWebhookEvents = mysqlTable("mailerlite_webhook_events", {
  id: int("id").autoincrement().primaryKey(),
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
export const smsTemplates = mysqlTable("sms_templates", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  messageTemplate: text("messageTemplate").notNull(),
  category: mysqlEnum("category", ["vip", "order", "marketing", "system"]).default("system").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SmsTemplate = typeof smsTemplates.$inferSelect;
export type InsertSmsTemplate = typeof smsTemplates.$inferInsert;

/**
 * User SMS preferences and phone number storage
 */
export const userSmsPreferences = mysqlTable("user_sms_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  phoneVerified: boolean("phoneVerified").default(false).notNull(),
  smsOptIn: boolean("smsOptIn").default(false).notNull(),
  smsNewReleases: boolean("smsNewReleases").default(true).notNull(),
  smsVipAlerts: boolean("smsVipAlerts").default(true).notNull(),
  smsOrderUpdates: boolean("smsOrderUpdates").default(true).notNull(),
  smsMarketing: boolean("smsMarketing").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSmsPreferences = typeof userSmsPreferences.$inferSelect;
export type InsertUserSmsPreferences = typeof userSmsPreferences.$inferInsert;

/**
 * SMS message log for tracking sent messages
 */
export const smsMessageLog = mysqlTable("sms_message_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  templateId: int("templateId").references(() => smsTemplates.id),
  toPhoneNumber: varchar("toPhoneNumber", { length: 20 }).notNull(),
  messageBody: text("messageBody").notNull(),
  twilioSid: varchar("twilioSid", { length: 64 }),
  status: mysqlEnum("status", ["queued", "sent", "delivered", "failed", "undelivered"]).default("queued").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

export type SmsMessageLog = typeof smsMessageLog.$inferSelect;
export type InsertSmsMessageLog = typeof smsMessageLog.$inferInsert;


/**
 * SMS analytics daily aggregation for dashboard metrics
 */
export const smsAnalyticsDaily = mysqlTable("sms_analytics_daily", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  totalSent: int("totalSent").default(0).notNull(),
  totalDelivered: int("totalDelivered").default(0).notNull(),
  totalFailed: int("totalFailed").default(0).notNull(),
  totalOptIns: int("totalOptIns").default(0).notNull(),
  totalOptOuts: int("totalOptOuts").default(0).notNull(),
  totalResponses: int("totalResponses").default(0).notNull(),
  deliveryRate: decimal("deliveryRate", { precision: 5, scale: 2 }),
  responseRate: decimal("responseRate", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SmsAnalyticsDaily = typeof smsAnalyticsDaily.$inferSelect;
export type InsertSmsAnalyticsDaily = typeof smsAnalyticsDaily.$inferInsert;

/**
 * SMS opt-in/opt-out events for tracking trends
 */
export const smsOptEvents = mysqlTable("sms_opt_events", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  userId: int("userId").references(() => users.id),
  eventType: mysqlEnum("eventType", ["opt_in", "opt_out", "resubscribe"]).notNull(),
  source: varchar("source", { length: 50 }), // e.g., "vip_signup", "sms_reply", "admin", "webhook"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsOptEvent = typeof smsOptEvents.$inferSelect;
export type InsertSmsOptEvent = typeof smsOptEvents.$inferInsert;

/**
 * SMS incoming messages for response tracking
 */
export const smsIncomingMessages = mysqlTable("sms_incoming_messages", {
  id: int("id").autoincrement().primaryKey(),
  fromPhoneNumber: varchar("fromPhoneNumber", { length: 20 }).notNull(),
  messageBody: text("messageBody").notNull(),
  twilioSid: varchar("twilioSid", { length: 64 }),
  keyword: varchar("keyword", { length: 20 }), // STOP, START, HELP, etc.
  processed: boolean("processed").default(false).notNull(),
  responseStatus: mysqlEnum("responseStatus", ["success", "failed", "pending"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsIncomingMessage = typeof smsIncomingMessages.$inferSelect;
export type InsertSmsIncomingMessage = typeof smsIncomingMessages.$inferInsert;


/**
 * QA Checks - tracks daily consistency checks across the website
 */
export const qaChecks = mysqlTable("qa_checks", {
  id: int("id").autoincrement().primaryKey(),
  checkDate: timestamp("checkDate").notNull(),
  checkType: mysqlEnum("checkType", ["pricing", "links", "content", "characters", "full_audit"]).notNull(),
  status: mysqlEnum("status", ["passed", "failed", "warning"]).default("passed").notNull(),
  itemsChecked: int("itemsChecked").default(0).notNull(),
  issuesFound: int("issuesFound").default(0).notNull(),
  details: text("details"), // JSON with detailed check results
  autoResolved: int("autoResolved").default(0), // Issues auto-fixed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QaCheck = typeof qaChecks.$inferSelect;
export type InsertQaCheck = typeof qaChecks.$inferInsert;

/**
 * QA Issues - individual issues found during QA checks
 */
export const qaIssues = mysqlTable("qa_issues", {
  id: int("id").autoincrement().primaryKey(),
  checkId: int("checkId").references(() => qaChecks.id),
  issueType: mysqlEnum("issueType", ["pricing_mismatch", "broken_link", "content_error", "character_inconsistency", "missing_data"]).notNull(),
  severity: mysqlEnum("severity", ["critical", "warning", "info"]).default("warning").notNull(),
  location: varchar("location", { length: 255 }).notNull(), // Page/component where issue was found
  description: text("description").notNull(),
  expectedValue: text("expectedValue"),
  actualValue: text("actualValue"),
  status: mysqlEnum("status", ["open", "resolved", "ignored"]).default("open").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolvedBy: int("resolvedBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QaIssue = typeof qaIssues.$inferSelect;
export type InsertQaIssue = typeof qaIssues.$inferInsert;

/**
 * External Links - tracks all external links used across the website
 */
export const externalLinks = mysqlTable("external_links", {
  id: int("id").autoincrement().primaryKey(),
  url: text("url").notNull(),
  displayText: varchar("displayText", { length: 255 }),
  linkType: mysqlEnum("linkType", ["amazon", "social", "affiliate", "resource", "other"]).default("other").notNull(),
  location: varchar("location", { length: 255 }).notNull(), // Page where link appears
  componentPath: varchar("componentPath", { length: 255 }), // Component file path
  lastChecked: timestamp("lastChecked"),
  lastStatus: mysqlEnum("lastStatus", ["active", "broken", "redirected", "unknown"]).default("unknown").notNull(),
  httpStatus: int("httpStatus"),
  responseTime: int("responseTime"), // in milliseconds
  checkCount: int("checkCount").default(0).notNull(),
  failCount: int("failCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExternalLink = typeof externalLinks.$inferSelect;
export type InsertExternalLink = typeof externalLinks.$inferInsert;

/**
 * Book Characters - detailed character information for each book
 */
export const bookCharacters = mysqlTable("book_characters", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }),
  role: mysqlEnum("role", ["protagonist", "love_interest", "antagonist", "supporting", "minor"]).notNull(),
  description: text("description"),
  physicalDescription: text("physicalDescription"),
  personality: text("personality"),
  backstory: text("backstory"),
  occupation: varchar("occupation", { length: 255 }),
  age: varchar("age", { length: 50 }),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookCharacter = typeof bookCharacters.$inferSelect;
export type InsertBookCharacter = typeof bookCharacters.$inferInsert;

/**
 * Character Relationships - tracks relationships between characters
 */
export const characterRelationships = mysqlTable("character_relationships", {
  id: int("id").autoincrement().primaryKey(),
  character1Id: int("character1Id").notNull().references(() => bookCharacters.id),
  character2Id: int("character2Id").notNull().references(() => bookCharacters.id),
  relationshipType: mysqlEnum("relationshipType", ["romantic", "family", "friend", "rival", "colleague", "enemy"]).notNull(),
  description: text("description"),
  bookId: int("bookId").references(() => books.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship = typeof characterRelationships.$inferInsert;

/**
 * Book Storylines - tracks main plot points and storylines
 */
export const bookStorylines = mysqlTable("book_storylines", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id),
  title: varchar("title", { length: 255 }).notNull(),
  storylineType: mysqlEnum("storylineType", ["main_plot", "subplot", "romance_arc", "character_arc", "mystery"]).notNull(),
  description: text("description").notNull(),
  keyEvents: text("keyEvents"), // JSON array of key plot points
  resolution: text("resolution"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookStoryline = typeof bookStorylines.$inferSelect;
export type InsertBookStoryline = typeof bookStorylines.$inferInsert;

/**
 * Book Pricing History - tracks pricing changes over time
 */
export const bookPricingHistory = mysqlTable("book_pricing_history", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull().references(() => books.id),
  platform: mysqlEnum("platform", ["amazon", "apple", "kobo", "barnes_noble", "google_play", "direct"]).notNull(),
  price: varchar("price", { length: 50 }).notNull(), // e.g., "$2.99"
  priceInCents: int("priceInCents"),
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
export const dailyReports = mysqlTable("daily_reports", {
  id: int("id").autoincrement().primaryKey(),
  reportDate: timestamp("reportDate").notNull(),
  reportType: mysqlEnum("reportType", ["daily_overview", "weekly_summary", "monthly_summary"]).default("daily_overview").notNull(),
  // Traffic metrics
  pageViews: int("pageViews").default(0),
  uniqueVisitors: int("uniqueVisitors").default(0),
  bounceRate: decimal("bounceRate", { precision: 5, scale: 2 }),
  avgSessionDuration: int("avgSessionDuration"), // in seconds
  // Content metrics
  newSubscribers: int("newSubscribers").default(0),
  unsubscribes: int("unsubscribes").default(0),
  blogPostViews: int("blogPostViews").default(0),
  bookPageViews: int("bookPageViews").default(0),
  // QA metrics
  qaChecksPassed: int("qaChecksPassed").default(0),
  qaChecksFailed: int("qaChecksFailed").default(0),
  openIssues: int("openIssues").default(0),
  resolvedIssues: int("resolvedIssues").default(0),
  brokenLinksFound: int("brokenLinksFound").default(0),
  // Revenue metrics
  totalOrders: int("totalOrders").default(0),
  totalRevenue: int("totalRevenue").default(0), // in cents
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
export const adminReminders = mysqlTable("admin_reminders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  reminderType: mysqlEnum("reminderType", ["broken_link", "pricing_check", "content_review", "qa_issue", "custom"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }), // "book", "link", "blog", etc.
  relatedEntityId: int("relatedEntityId"),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["pending", "completed", "dismissed", "snoozed"]).default("pending").notNull(),
  snoozedUntil: timestamp("snoozedUntil"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminReminder = typeof adminReminders.$inferSelect;
export type InsertAdminReminder = typeof adminReminders.$inferInsert;

/**
 * Content Audit Log - tracks all content changes for QA
 */
export const contentAuditLog = mysqlTable("content_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 50 }).notNull(), // "book", "blog", "character", etc.
  entityId: int("entityId").notNull(),
  action: mysqlEnum("action", ["create", "update", "delete", "publish", "unpublish"]).notNull(),
  fieldChanged: varchar("fieldChanged", { length: 100 }),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  changedBy: int("changedBy").references(() => users.id),
  changeReason: text("changeReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentAuditLog = typeof contentAuditLog.$inferSelect;
export type InsertContentAuditLog = typeof contentAuditLog.$inferInsert;


/**
 * Business Metrics - daily tracking of KDP business KPIs
 */
export const businessMetrics = mysqlTable("business_metrics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  // MailerLite metrics
  totalSubscribers: int("totalSubscribers").default(0),
  newSubscribers: int("newSubscribers").default(0),
  unsubscribes: int("unsubscribes").default(0),
  emailOpenRate: decimal("emailOpenRate", { precision: 5, scale: 2 }),
  emailClickRate: decimal("emailClickRate", { precision: 5, scale: 2 }),
  // Website metrics
  pageViews: int("pageViews").default(0),
  uniqueVisitors: int("uniqueVisitors").default(0),
  // Revenue metrics
  dailyRevenue: int("dailyRevenue").default(0), // in cents
  ordersCount: int("ordersCount").default(0),
  // Social metrics
  instagramFollowers: int("instagramFollowers"),
  tiktokFollowers: int("tiktokFollowers"),
  goodreadsFollowers: int("goodreadsFollowers"),
  // Book metrics
  amazonRanking: int("amazonRanking"),
  reviewCount: int("reviewCount"),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }),
  // KDP-specific
  kdpRoyalties: int("kdpRoyalties"), // in cents
  pagesRead: int("pagesRead"), // Kindle Unlimited
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BusinessMetric = typeof businessMetrics.$inferSelect;
export type InsertBusinessMetric = typeof businessMetrics.$inferInsert;

/**
 * Business Goals - monthly/quarterly goal tracking
 */
export const businessGoals = mysqlTable("business_goals", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "subscribers", "revenue", "books", "content", "social", "launches", "other"
  ]).notNull(),
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., "subscribers", "dollars", "posts"
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["active", "completed", "missed", "paused"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BusinessGoal = typeof businessGoals.$inferSelect;
export type InsertBusinessGoal = typeof businessGoals.$inferInsert;

/**
 * Tool Inventory - catalog of all AppSumo and business tools
 */
export const toolInventory = mysqlTable("tool_inventory", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  category: mysqlEnum("category", [
    "video", "audio", "design", "writing", "marketing", "analytics", "kdp", "social", "email", "other"
  ]).notNull(),
  plan: varchar("plan", { length: 100 }), // e.g., "AppSumo Single", "All Access", "Premium"
  loginEmail: varchar("loginEmail", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 50 }), // "email", "google", "manual"
  status: mysqlEnum("status", ["active", "needs_login", "expired", "pending"]).default("active").notNull(),
  description: text("description"),
  kdpUseCases: text("kdpUseCases"), // JSON array of use cases
  features: text("features"), // JSON array of features
  usageLimits: text("usageLimits"), // JSON object with usage/limits info
  lastChecked: timestamp("lastChecked"),
  iconEmoji: varchar("iconEmoji", { length: 10 }),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ToolInventoryItem = typeof toolInventory.$inferSelect;
export type InsertToolInventoryItem = typeof toolInventory.$inferInsert;

/**
 * Daily Briefings - AI-generated executive summaries
 */
export const dailyBriefings = mysqlTable("daily_briefings", {
  id: int("id").autoincrement().primaryKey(),
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
