-- Postgres schema catch-up for reeseastor.com.
-- Generated from drizzle/schema.ts on main (a583f2a). Not applied.
-- Additive only: no DROP, DELETE, TRUNCATE, or UPDATE.
-- Run as the database owner, with autocommit. The runtime app role is not required to have CREATE.
-- Privilege: CREATE and USAGE on schema public, plus ALTER on any table that already exists.
-- Foreign keys are omitted so an orphan row cannot abort the script.
-- A new NOT NULL column with no default is added nullable. A populated table cannot accept NOT NULL without a default.
-- Existing column types are not rewritten. If a column exists with a different type, this file leaves it alone.

-- Enums
DO $$ BEGIN
  CREATE TYPE "action" AS ENUM ('create', 'update', 'delete', 'publish', 'unpublish');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "action" ADD VALUE IF NOT EXISTS 'create';
ALTER TYPE "action" ADD VALUE IF NOT EXISTS 'update';
ALTER TYPE "action" ADD VALUE IF NOT EXISTS 'delete';
ALTER TYPE "action" ADD VALUE IF NOT EXISTS 'publish';
ALTER TYPE "action" ADD VALUE IF NOT EXISTS 'unpublish';

DO $$ BEGIN
  CREATE TYPE "aiContentType" AS ENUM ('blog_post', 'story_idea', 'book_cover', 'character_portrait', 'social_graphic');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "aiContentType" ADD VALUE IF NOT EXISTS 'blog_post';
ALTER TYPE "aiContentType" ADD VALUE IF NOT EXISTS 'story_idea';
ALTER TYPE "aiContentType" ADD VALUE IF NOT EXISTS 'book_cover';
ALTER TYPE "aiContentType" ADD VALUE IF NOT EXISTS 'character_portrait';
ALTER TYPE "aiContentType" ADD VALUE IF NOT EXISTS 'social_graphic';

DO $$ BEGIN
  CREATE TYPE "aiRole" AS ENUM ('user', 'assistant');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "aiRole" ADD VALUE IF NOT EXISTS 'user';
ALTER TYPE "aiRole" ADD VALUE IF NOT EXISTS 'assistant';

DO $$ BEGIN
  CREATE TYPE "category" AS ENUM ('romance', 'passion', 'fantasy', 'reunion', 'forbidden', 'first_time', 'system', 'vip', 'order', 'marketing', 'social', 'email', 'other', 'business', 'tool', 'audio', 'video', 'design', 'writing', 'analytics', 'kdp');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'romance';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'passion';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'fantasy';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'reunion';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'forbidden';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'first_time';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'system';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'vip';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'order';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'marketing';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'social';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'email';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'other';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'tool';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'audio';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'video';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'design';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'writing';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'analytics';
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'kdp';

DO $$ BEGIN
  CREATE TYPE "checkType" AS ENUM ('pricing', 'links', 'content', 'characters', 'full_audit');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "checkType" ADD VALUE IF NOT EXISTS 'pricing';
ALTER TYPE "checkType" ADD VALUE IF NOT EXISTS 'links';
ALTER TYPE "checkType" ADD VALUE IF NOT EXISTS 'content';
ALTER TYPE "checkType" ADD VALUE IF NOT EXISTS 'characters';
ALTER TYPE "checkType" ADD VALUE IF NOT EXISTS 'full_audit';

DO $$ BEGIN
  CREATE TYPE "clickType" AS ENUM ('inline', 'card', 'favorites');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "clickType" ADD VALUE IF NOT EXISTS 'inline';
ALTER TYPE "clickType" ADD VALUE IF NOT EXISTS 'card';
ALTER TYPE "clickType" ADD VALUE IF NOT EXISTS 'favorites';

DO $$ BEGIN
  CREATE TYPE "eventType" AS ENUM ('opt_in', 'opt_out', 'resubscribe');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "eventType" ADD VALUE IF NOT EXISTS 'opt_in';
ALTER TYPE "eventType" ADD VALUE IF NOT EXISTS 'opt_out';
ALTER TYPE "eventType" ADD VALUE IF NOT EXISTS 'resubscribe';

DO $$ BEGIN
  CREATE TYPE "gender" AS ENUM ('male', 'female', 'neutral');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "gender" ADD VALUE IF NOT EXISTS 'male';
ALTER TYPE "gender" ADD VALUE IF NOT EXISTS 'female';
ALTER TYPE "gender" ADD VALUE IF NOT EXISTS 'neutral';

DO $$ BEGIN
  CREATE TYPE "issueType" AS ENUM ('pricing_mismatch', 'broken_link', 'content_error', 'character_inconsistency', 'missing_data');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "issueType" ADD VALUE IF NOT EXISTS 'pricing_mismatch';
ALTER TYPE "issueType" ADD VALUE IF NOT EXISTS 'broken_link';
ALTER TYPE "issueType" ADD VALUE IF NOT EXISTS 'content_error';
ALTER TYPE "issueType" ADD VALUE IF NOT EXISTS 'character_inconsistency';
ALTER TYPE "issueType" ADD VALUE IF NOT EXISTS 'missing_data';

DO $$ BEGIN
  CREATE TYPE "lastStatus" AS ENUM ('active', 'broken', 'redirected', 'unknown');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "lastStatus" ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE "lastStatus" ADD VALUE IF NOT EXISTS 'broken';
ALTER TYPE "lastStatus" ADD VALUE IF NOT EXISTS 'redirected';
ALTER TYPE "lastStatus" ADD VALUE IF NOT EXISTS 'unknown';

DO $$ BEGIN
  CREATE TYPE "linkType" AS ENUM ('amazon', 'social', 'affiliate', 'resource', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "linkType" ADD VALUE IF NOT EXISTS 'amazon';
ALTER TYPE "linkType" ADD VALUE IF NOT EXISTS 'social';
ALTER TYPE "linkType" ADD VALUE IF NOT EXISTS 'affiliate';
ALTER TYPE "linkType" ADD VALUE IF NOT EXISTS 'resource';
ALTER TYPE "linkType" ADD VALUE IF NOT EXISTS 'other';

DO $$ BEGIN
  CREATE TYPE "platform" AS ENUM ('amazon', 'apple', 'kobo', 'barnes_noble', 'google_play', 'direct');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'amazon';
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'apple';
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'kobo';
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'barnes_noble';
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'google_play';
ALTER TYPE "platform" ADD VALUE IF NOT EXISTS 'direct';

DO $$ BEGIN
  CREATE TYPE "preferredFormat" AS ENUM ('epub', 'mobi', 'pdf');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "preferredFormat" ADD VALUE IF NOT EXISTS 'epub';
ALTER TYPE "preferredFormat" ADD VALUE IF NOT EXISTS 'mobi';
ALTER TYPE "preferredFormat" ADD VALUE IF NOT EXISTS 'pdf';

DO $$ BEGIN
  CREATE TYPE "priority" AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "priority" ADD VALUE IF NOT EXISTS 'low';
ALTER TYPE "priority" ADD VALUE IF NOT EXISTS 'medium';
ALTER TYPE "priority" ADD VALUE IF NOT EXISTS 'high';
ALTER TYPE "priority" ADD VALUE IF NOT EXISTS 'urgent';

DO $$ BEGIN
  CREATE TYPE "published" AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "published" ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE "published" ADD VALUE IF NOT EXISTS 'published';

DO $$ BEGIN
  CREATE TYPE "purchaseType" AS ENUM ('single', 'bundle', 'subscription', 'one_time');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "purchaseType" ADD VALUE IF NOT EXISTS 'single';
ALTER TYPE "purchaseType" ADD VALUE IF NOT EXISTS 'bundle';
ALTER TYPE "purchaseType" ADD VALUE IF NOT EXISTS 'subscription';
ALTER TYPE "purchaseType" ADD VALUE IF NOT EXISTS 'one_time';

DO $$ BEGIN
  CREATE TYPE "relationshipType" AS ENUM ('romantic', 'family', 'friend', 'rival', 'colleague', 'enemy');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'romantic';
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'family';
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'friend';
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'rival';
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'colleague';
ALTER TYPE "relationshipType" ADD VALUE IF NOT EXISTS 'enemy';

DO $$ BEGIN
  CREATE TYPE "reminderType" AS ENUM ('broken_link', 'pricing_check', 'content_review', 'qa_issue', 'custom');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "reminderType" ADD VALUE IF NOT EXISTS 'broken_link';
ALTER TYPE "reminderType" ADD VALUE IF NOT EXISTS 'pricing_check';
ALTER TYPE "reminderType" ADD VALUE IF NOT EXISTS 'content_review';
ALTER TYPE "reminderType" ADD VALUE IF NOT EXISTS 'qa_issue';
ALTER TYPE "reminderType" ADD VALUE IF NOT EXISTS 'custom';

DO $$ BEGIN
  CREATE TYPE "reportType" AS ENUM ('daily_overview', 'weekly_summary', 'monthly_summary');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "reportType" ADD VALUE IF NOT EXISTS 'daily_overview';
ALTER TYPE "reportType" ADD VALUE IF NOT EXISTS 'weekly_summary';
ALTER TYPE "reportType" ADD VALUE IF NOT EXISTS 'monthly_summary';

DO $$ BEGIN
  CREATE TYPE "responseStatus" AS ENUM ('success', 'failed', 'pending');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "responseStatus" ADD VALUE IF NOT EXISTS 'success';
ALTER TYPE "responseStatus" ADD VALUE IF NOT EXISTS 'failed';
ALTER TYPE "responseStatus" ADD VALUE IF NOT EXISTS 'pending';

DO $$ BEGIN
  CREATE TYPE "role" AS ENUM ('user', 'admin', 'protagonist', 'love_interest', 'antagonist', 'supporting', 'side_character', 'minor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'user';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'protagonist';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'love_interest';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'antagonist';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'supporting';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'side_character';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'minor';

DO $$ BEGIN
  CREATE TYPE "severity" AS ENUM ('critical', 'warning', 'info');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "severity" ADD VALUE IF NOT EXISTS 'critical';
ALTER TYPE "severity" ADD VALUE IF NOT EXISTS 'warning';
ALTER TYPE "severity" ADD VALUE IF NOT EXISTS 'info';

DO $$ BEGIN
  CREATE TYPE "status" AS ENUM ('draft', 'scheduled', 'sent', 'active', 'pending', 'queued', 'passed', 'open', 'failed', 'delivered', 'undelivered', 'approved', 'rejected', 'warning', 'resolved', 'ignored', 'unsubscribed', 'subscribed', 'bounced', 'complained', 'completed', 'cancelled', 'refunded', 'processing', 'shipped', 'paused', 'missed', 'archived', 'dismissed', 'needs_login', 'expired', 'snoozed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'scheduled';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'sent';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'queued';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'passed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'open';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'failed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'delivered';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'undelivered';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'warning';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'resolved';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'ignored';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'unsubscribed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'subscribed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'bounced';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'complained';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'refunded';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'shipped';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'paused';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'missed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'dismissed';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'needs_login';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE "status" ADD VALUE IF NOT EXISTS 'snoozed';

DO $$ BEGIN
  CREATE TYPE "storylineType" AS ENUM ('main_plot', 'subplot', 'romance_arc', 'character_arc', 'mystery');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "storylineType" ADD VALUE IF NOT EXISTS 'main_plot';
ALTER TYPE "storylineType" ADD VALUE IF NOT EXISTS 'subplot';
ALTER TYPE "storylineType" ADD VALUE IF NOT EXISTS 'romance_arc';
ALTER TYPE "storylineType" ADD VALUE IF NOT EXISTS 'character_arc';
ALTER TYPE "storylineType" ADD VALUE IF NOT EXISTS 'mystery';

DO $$ BEGIN
  CREATE TYPE "type" AS ENUM ('bonus_chapter', 'interview', 'behind_scenes');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE "type" ADD VALUE IF NOT EXISTS 'bonus_chapter';
ALTER TYPE "type" ADD VALUE IF NOT EXISTS 'interview';
ALTER TYPE "type" ADD VALUE IF NOT EXISTS 'behind_scenes';

-- Tables that are missing are created empty. Tables that already exist are left in place.
CREATE TABLE IF NOT EXISTS "admin_reminders" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "title" varchar(255) NOT NULL,
  "description" text,
  "reminderType" reminderType NOT NULL,
  "priority" priority DEFAULT 'medium' NOT NULL,
  "relatedEntityType" varchar(50),
  "relatedEntityId" integer,
  "dueDate" timestamp,
  "status" status DEFAULT 'pending' NOT NULL,
  "snoozedUntil" timestamp,
  "completedAt" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "affiliate_clicks" (
  "id" serial PRIMARY KEY,
  "productName" varchar(255) NOT NULL,
  "productId" varchar(64),
  "affiliateUrl" text NOT NULL,
  "sourceSlug" varchar(255) NOT NULL,
  "clickType" clickType DEFAULT 'inline' NOT NULL,
  "sessionHash" varchar(64),
  "userAgent" text,
  "referrer" text,
  "country" varchar(2),
  "userId" integer,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "affiliate_metrics_daily" (
  "id" serial PRIMARY KEY,
  "metricDate" timestamp NOT NULL,
  "totalClicks" integer DEFAULT 0 NOT NULL,
  "uniqueClicks" integer DEFAULT 0 NOT NULL,
  "topProduct" text,
  "topSource" text,
  "clickTypeBreakdown" text,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ai_chat_messages" (
  "id" serial PRIMARY KEY,
  "session_id" varchar(255) NOT NULL,
  "role" aiRole NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ai_generated_content" (
  "id" serial PRIMARY KEY,
  "user_id" integer,
  "content_type" aiContentType NOT NULL,
  "prompt" text NOT NULL,
  "result" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ai_studio_conversations" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "model" varchar(100) NOT NULL,
  "system_prompt" text,
  "messages" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audio_usage" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "minutesUsed" integer NOT NULL,
  "characterCount" integer NOT NULL,
  "voiceId" varchar(100) NOT NULL,
  "storyId" varchar(255),
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "excerpt" text NOT NULL,
  "content" text NOT NULL,
  "category" varchar(100) NOT NULL,
  "readTime" varchar(50) NOT NULL,
  "published" published DEFAULT 'draft' NOT NULL,
  "authorId" integer NOT NULL,
  "featuredImage" text,
  "audioUrl" text,
  "scheduledPublishAt" timestamp,
  "seoKeywords" text,
  "metaDescription" varchar(320),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "publishedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "book_characters" (
  "id" serial PRIMARY KEY,
  "bookId" integer NOT NULL,
  "fullName" varchar(255) NOT NULL,
  "nickname" varchar(100),
  "role" role NOT NULL,
  "description" text,
  "physicalDescription" text,
  "personality" text,
  "backstory" text,
  "occupation" varchar(255),
  "age" varchar(50),
  "displayOrder" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "book_pricing_history" (
  "id" serial PRIMARY KEY,
  "bookId" integer NOT NULL,
  "platform" platform NOT NULL,
  "price" varchar(50) NOT NULL,
  "priceInCents" integer,
  "currency" varchar(3) DEFAULT 'USD',
  "verifiedAt" timestamp NOT NULL,
  "verificationSource" varchar(100),
  "previousPrice" varchar(50),
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "book_reviews" (
  "id" serial PRIMARY KEY,
  "bookId" integer NOT NULL,
  "reviewerName" varchar(255) NOT NULL,
  "reviewerPhoto" text,
  "rating" integer NOT NULL,
  "review" text NOT NULL,
  "source" varchar(100),
  "featured" boolean DEFAULT false,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "book_storylines" (
  "id" serial PRIMARY KEY,
  "bookId" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "storylineType" storylineType NOT NULL,
  "description" text NOT NULL,
  "keyEvents" text,
  "resolution" text,
  "displayOrder" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "books" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "series" varchar(255),
  "seriesOrder" integer,
  "coverImage" text NOT NULL,
  "description" text NOT NULL,
  "sampleChapter" text,
  "rating" integer DEFAULT 5,
  "reviewCount" integer DEFAULT 0,
  "tropes" text,
  "heatLevel" integer DEFAULT 3,
  "pageCount" integer,
  "publishDate" varchar(100),
  "amazonUrl" text,
  "appleUrl" text,
  "koboUrl" text,
  "barnesNobleUrl" text,
  "googlePlayUrl" text,
  "retailPrice" integer DEFAULT 499,
  "directPrice" integer DEFAULT 399,
  "memberPrice" integer DEFAULT 299,
  "directSaleUrl" text,
  "audioSampleUrl" text,
  "trailerVideoUrl" text,
  "featured" boolean DEFAULT false,
  "displayOrder" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "browsing_history" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "bookId" integer NOT NULL,
  "viewCount" integer DEFAULT 1 NOT NULL,
  "lastViewedAt" timestamp DEFAULT now() NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "business_goals" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "description" text,
  "category" category NOT NULL,
  "targetValue" integer NOT NULL,
  "currentValue" integer DEFAULT 0 NOT NULL,
  "unit" varchar(50) NOT NULL,
  "startDate" timestamp NOT NULL,
  "endDate" timestamp NOT NULL,
  "status" status DEFAULT 'active' NOT NULL,
  "notes" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "business_metrics" (
  "id" serial PRIMARY KEY,
  "date" timestamp NOT NULL,
  "totalSubscribers" integer DEFAULT 0,
  "newSubscribers" integer DEFAULT 0,
  "unsubscribes" integer DEFAULT 0,
  "emailOpenRate" numeric(5, 2),
  "emailClickRate" numeric(5, 2),
  "pageViews" integer DEFAULT 0,
  "uniqueVisitors" integer DEFAULT 0,
  "dailyRevenue" integer DEFAULT 0,
  "ordersCount" integer DEFAULT 0,
  "instagramFollowers" integer,
  "tiktokFollowers" integer,
  "goodreadsFollowers" integer,
  "amazonRanking" integer,
  "reviewCount" integer,
  "averageRating" numeric(3, 2),
  "kdpRoyalties" integer,
  "pagesRead" integer,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "character_relationships" (
  "id" serial PRIMARY KEY,
  "character1Id" integer NOT NULL,
  "character2Id" integer NOT NULL,
  "relationshipType" relationshipType NOT NULL,
  "description" text,
  "bookId" integer,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "character_voice_assignments" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "characterName" varchar(100) NOT NULL,
  "bookTitle" varchar(255),
  "voicePresetId" integer,
  "elevenLabsVoiceId" varchar(100) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "content_access" (
  "id" serial PRIMARY KEY,
  "memberId" integer NOT NULL,
  "contentId" integer NOT NULL,
  "accessedAt" timestamp DEFAULT now() NOT NULL,
  "viewCount" integer DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "content_audit_log" (
  "id" serial PRIMARY KEY,
  "entityType" varchar(50) NOT NULL,
  "entityId" integer NOT NULL,
  "action" action NOT NULL,
  "fieldChanged" varchar(100),
  "oldValue" text,
  "newValue" text,
  "changedBy" integer,
  "changeReason" text,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "custom_story_requests" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "prompt" text NOT NULL,
  "characters" text,
  "setting" varchar(255),
  "heatLevel" integer DEFAULT 4,
  "status" status DEFAULT 'pending' NOT NULL,
  "generatedStoryId" integer,
  "audioUrl" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "completedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "daily_briefings" (
  "id" serial PRIMARY KEY,
  "briefingDate" timestamp NOT NULL,
  "executiveSummary" text NOT NULL,
  "subscriberUpdate" text,
  "revenueUpdate" text,
  "contentUpdate" text,
  "goalProgress" text,
  "actionItems" text,
  "alerts" text,
  "toolRecommendations" text,
  "dataSnapshot" text,
  "emailSent" boolean DEFAULT false,
  "emailSentAt" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "daily_reports" (
  "id" serial PRIMARY KEY,
  "reportDate" timestamp NOT NULL,
  "reportType" reportType DEFAULT 'daily_overview' NOT NULL,
  "pageViews" integer DEFAULT 0,
  "uniqueVisitors" integer DEFAULT 0,
  "bounceRate" numeric(5, 2),
  "avgSessionDuration" integer,
  "newSubscribers" integer DEFAULT 0,
  "unsubscribes" integer DEFAULT 0,
  "blogPostViews" integer DEFAULT 0,
  "bookPageViews" integer DEFAULT 0,
  "qaChecksPassed" integer DEFAULT 0,
  "qaChecksFailed" integer DEFAULT 0,
  "openIssues" integer DEFAULT 0,
  "resolvedIssues" integer DEFAULT 0,
  "brokenLinksFound" integer DEFAULT 0,
  "totalOrders" integer DEFAULT 0,
  "totalRevenue" integer DEFAULT 0,
  "summary" text,
  "alerts" text,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "exclusive_content" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "type" type NOT NULL,
  "category" varchar(100),
  "description" text,
  "content" text NOT NULL,
  "coverImage" text,
  "bookId" integer,
  "featured" boolean DEFAULT false,
  "displayOrder" integer DEFAULT 0,
  "publishDate" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "external_links" (
  "id" serial PRIMARY KEY,
  "url" text NOT NULL,
  "displayText" varchar(255),
  "linkType" linkType DEFAULT 'other' NOT NULL,
  "location" varchar(255) NOT NULL,
  "componentPath" varchar(255),
  "lastChecked" timestamp,
  "lastStatus" lastStatus DEFAULT 'unknown' NOT NULL,
  "httpStatus" integer,
  "responseTime" integer,
  "checkCount" integer DEFAULT 0 NOT NULL,
  "failCount" integer DEFAULT 0 NOT NULL,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "generated_audio" (
  "id" varchar(36) PRIMARY KEY,
  "userId" integer NOT NULL,
  "storyId" varchar(255),
  "title" varchar(255) NOT NULL,
  "audioUrl" text NOT NULL,
  "durationSeconds" integer NOT NULL,
  "voiceId" varchar(100) NOT NULL,
  "characterCount" integer NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "mailerlite_webhook_events" (
  "id" serial PRIMARY KEY,
  "eventType" varchar(100) NOT NULL,
  "subscriberId" varchar(100),
  "subscriberEmail" varchar(320),
  "groupId" varchar(100),
  "groupName" varchar(255),
  "payload" text NOT NULL,
  "processed" boolean DEFAULT false NOT NULL,
  "processedAt" timestamp,
  "error" text,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" serial PRIMARY KEY,
  "email" varchar(320) NOT NULL UNIQUE,
  "name" varchar(255),
  "status" status DEFAULT 'active' NOT NULL,
  "source" varchar(100),
  "mailerLiteId" varchar(100),
  "subscribedAt" timestamp DEFAULT now() NOT NULL,
  "unsubscribedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "newsletters" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "subject" varchar(255) NOT NULL,
  "preheader" varchar(255),
  "content" text NOT NULL,
  "status" status DEFAULT 'draft' NOT NULL,
  "scheduledAt" timestamp,
  "sentAt" timestamp,
  "recipientCount" integer DEFAULT 0,
  "openCount" integer DEFAULT 0,
  "clickCount" integer DEFAULT 0,
  "createdBy" integer NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "productId" integer NOT NULL,
  "stripeSessionId" varchar(255),
  "stripePaymentIntentId" varchar(255),
  "amount" integer NOT NULL,
  "currency" varchar(3) DEFAULT 'usd' NOT NULL,
  "status" status DEFAULT 'pending' NOT NULL,
  "customerEmail" varchar(320),
  "customerName" varchar(255),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "partner_applications" (
  "id" serial PRIMARY KEY,
  "authorName" varchar(255) NOT NULL,
  "email" varchar(320) NOT NULL,
  "website" text,
  "bookTitle" varchar(255) NOT NULL,
  "genre" varchar(100) NOT NULL,
  "tropes" text,
  "bookDescription" text NOT NULL,
  "downloadLink" text,
  "coverImageUrl" text,
  "subscriberCount" varchar(50),
  "socialLinks" text,
  "status" status DEFAULT 'pending' NOT NULL,
  "adminNotes" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "price" integer NOT NULL,
  "currency" varchar(3) DEFAULT 'usd' NOT NULL,
  "type" purchaseType NOT NULL,
  "stripeProductId" varchar(255),
  "stripePriceId" varchar(255),
  "features" text,
  "downloadUrl" text,
  "active" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "qa_checks" (
  "id" serial PRIMARY KEY,
  "checkDate" timestamp NOT NULL,
  "checkType" checkType NOT NULL,
  "status" status DEFAULT 'passed' NOT NULL,
  "itemsChecked" integer DEFAULT 0 NOT NULL,
  "issuesFound" integer DEFAULT 0 NOT NULL,
  "details" text,
  "autoResolved" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "qa_issues" (
  "id" serial PRIMARY KEY,
  "checkId" integer,
  "issueType" issueType NOT NULL,
  "severity" severity DEFAULT 'warning' NOT NULL,
  "location" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "expectedValue" text,
  "actualValue" text,
  "status" status DEFAULT 'open' NOT NULL,
  "resolvedAt" timestamp,
  "resolvedBy" integer,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "quiz_results" (
  "id" serial PRIMARY KEY,
  "email" varchar(320),
  "result" varchar(255) NOT NULL,
  "personality" text NOT NULL,
  "answers" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reader_club_members" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "email" varchar(320) NOT NULL UNIQUE,
  "name" varchar(255),
  "joinedAt" timestamp DEFAULT now() NOT NULL,
  "lastAccessAt" timestamp,
  "active" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "sms_analytics_daily" (
  "id" serial PRIMARY KEY,
  "date" timestamp NOT NULL,
  "totalSent" integer DEFAULT 0 NOT NULL,
  "totalDelivered" integer DEFAULT 0 NOT NULL,
  "totalFailed" integer DEFAULT 0 NOT NULL,
  "totalOptIns" integer DEFAULT 0 NOT NULL,
  "totalOptOuts" integer DEFAULT 0 NOT NULL,
  "totalResponses" integer DEFAULT 0 NOT NULL,
  "deliveryRate" numeric(5, 2),
  "responseRate" numeric(5, 2),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sms_incoming_messages" (
  "id" serial PRIMARY KEY,
  "fromPhoneNumber" varchar(20) NOT NULL,
  "messageBody" text NOT NULL,
  "twilioSid" varchar(64),
  "keyword" varchar(20),
  "processed" boolean DEFAULT false NOT NULL,
  "responseStatus" responseStatus DEFAULT 'pending' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sms_message_log" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "templateId" integer,
  "toPhoneNumber" varchar(20) NOT NULL,
  "messageBody" text NOT NULL,
  "twilioSid" varchar(64),
  "status" status DEFAULT 'queued' NOT NULL,
  "errorMessage" text,
  "sentAt" timestamp DEFAULT now() NOT NULL,
  "deliveredAt" timestamp
);

CREATE TABLE IF NOT EXISTS "sms_opt_events" (
  "id" serial PRIMARY KEY,
  "phoneNumber" varchar(20) NOT NULL,
  "userId" integer,
  "eventType" eventType NOT NULL,
  "source" varchar(50),
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sms_templates" (
  "id" serial PRIMARY KEY,
  "slug" varchar(100) NOT NULL UNIQUE,
  "name" varchar(200) NOT NULL,
  "description" text,
  "messageTemplate" text NOT NULL,
  "category" category DEFAULT 'system' NOT NULL,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "steamy_stories" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "description" text NOT NULL,
  "content" text NOT NULL,
  "excerpt" text,
  "audioUrl" text,
  "previewAudioUrl" text,
  "audioDuration" integer,
  "coverImage" text,
  "category" category DEFAULT 'romance' NOT NULL,
  "heatLevel" integer DEFAULT 4,
  "characters" text,
  "bookId" integer,
  "minTier" integer DEFAULT 1,
  "featured" boolean DEFAULT false,
  "published" boolean DEFAULT false,
  "publishedAt" timestamp,
  "playCount" integer DEFAULT 0,
  "likeCount" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "story_likes" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "storyId" integer NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "story_play_history" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "storyId" integer NOT NULL,
  "progress" integer DEFAULT 0,
  "completed" boolean DEFAULT false,
  "playedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "productId" integer NOT NULL,
  "stripeSubscriptionId" varchar(255) NOT NULL,
  "stripeCustomerId" varchar(255) NOT NULL,
  "status" status DEFAULT 'active' NOT NULL,
  "currentPeriodStart" timestamp NOT NULL,
  "currentPeriodEnd" timestamp NOT NULL,
  "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tool_inventory" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "url" text NOT NULL,
  "category" category NOT NULL,
  "plan" varchar(100),
  "loginEmail" varchar(320),
  "loginMethod" varchar(50),
  "status" status DEFAULT 'active' NOT NULL,
  "description" text,
  "kdpUseCases" text,
  "features" text,
  "usageLimits" text,
  "lastChecked" timestamp,
  "iconEmoji" varchar(10),
  "displayOrder" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_preferences" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL UNIQUE,
  "emailNewReleases" boolean DEFAULT true NOT NULL,
  "emailNewsletter" boolean DEFAULT true NOT NULL,
  "emailPromotions" boolean DEFAULT true NOT NULL,
  "emailBlogPosts" boolean DEFAULT false NOT NULL,
  "preferredFormat" preferredFormat DEFAULT 'epub' NOT NULL,
  "displayName" varchar(100),
  "bio" text,
  "favoriteGenres" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_purchases" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "bookId" integer NOT NULL,
  "orderId" integer,
  "purchaseType" purchaseType DEFAULT 'single' NOT NULL,
  "purchasePrice" integer,
  "bonusContentUnlocked" boolean DEFAULT false NOT NULL,
  "downloadCount" integer DEFAULT 0 NOT NULL,
  "lastDownloadAt" timestamp,
  "purchasedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_sms_preferences" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL UNIQUE,
  "phoneNumber" varchar(20),
  "phoneVerified" boolean DEFAULT false NOT NULL,
  "smsOptIn" boolean DEFAULT false NOT NULL,
  "smsNewReleases" boolean DEFAULT true NOT NULL,
  "smsVipAlerts" boolean DEFAULT true NOT NULL,
  "smsOrderUpdates" boolean DEFAULT true NOT NULL,
  "smsMarketing" boolean DEFAULT false NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" role DEFAULT 'user' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "lastSignedIn" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "vip_members" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL UNIQUE,
  "tierId" integer NOT NULL,
  "stripeSubscriptionId" varchar(255),
  "stripeCustomerId" varchar(255),
  "status" status DEFAULT 'active' NOT NULL,
  "currentPeriodStart" timestamp NOT NULL,
  "currentPeriodEnd" timestamp NOT NULL,
  "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
  "customStoriesUsed" integer DEFAULT 0,
  "joinedAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "vip_tiers" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "slug" varchar(100) NOT NULL UNIQUE,
  "description" text NOT NULL,
  "price" integer NOT NULL,
  "features" text NOT NULL,
  "stripePriceId" varchar(255),
  "stripeProductId" varchar(255),
  "storiesPerMonth" integer DEFAULT 0,
  "customStoriesAllowed" boolean DEFAULT false,
  "personalizedMessages" boolean DEFAULT false,
  "displayOrder" integer DEFAULT 0,
  "active" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "voice_presets" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "name" varchar(100) NOT NULL,
  "elevenLabsVoiceId" varchar(100) NOT NULL,
  "description" text,
  "style" varchar(50),
  "gender" gender NOT NULL,
  "isPremium" boolean DEFAULT false NOT NULL,
  "stability" integer DEFAULT 50,
  "similarityBoost" integer DEFAULT 75,
  "styleIntensity" integer DEFAULT 50,
  "isActive" boolean DEFAULT true NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Columns the Drizzle schema expects, added only when absent.
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "reminderType" reminderType;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "priority" priority DEFAULT 'medium' NOT NULL;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "relatedEntityType" varchar(50);
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "relatedEntityId" integer;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "dueDate" timestamp;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'pending' NOT NULL;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "snoozedUntil" timestamp;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "completedAt" timestamp;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "admin_reminders" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "productName" varchar(255);
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "productId" varchar(64);
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "affiliateUrl" text;
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "sourceSlug" varchar(255);
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "clickType" clickType DEFAULT 'inline' NOT NULL;
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "sessionHash" varchar(64);
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "userAgent" text;
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "referrer" text;
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "country" varchar(2);
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "affiliate_clicks" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "metricDate" timestamp;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "totalClicks" integer DEFAULT 0 NOT NULL;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "uniqueClicks" integer DEFAULT 0 NOT NULL;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "topProduct" text;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "topSource" text;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "clickTypeBreakdown" text;
ALTER TABLE "affiliate_metrics_daily" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "ai_chat_messages" ADD COLUMN IF NOT EXISTS "session_id" varchar(255);
ALTER TABLE "ai_chat_messages" ADD COLUMN IF NOT EXISTS "role" aiRole;
ALTER TABLE "ai_chat_messages" ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE "ai_chat_messages" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "ai_generated_content" ADD COLUMN IF NOT EXISTS "user_id" integer;
ALTER TABLE "ai_generated_content" ADD COLUMN IF NOT EXISTS "content_type" aiContentType;
ALTER TABLE "ai_generated_content" ADD COLUMN IF NOT EXISTS "prompt" text;
ALTER TABLE "ai_generated_content" ADD COLUMN IF NOT EXISTS "result" text;
ALTER TABLE "ai_generated_content" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "user_id" integer;
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "model" varchar(100);
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "system_prompt" text;
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "messages" text;
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "ai_studio_conversations" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "minutesUsed" integer;
ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "characterCount" integer;
ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "voiceId" varchar(100);
ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "storyId" varchar(255);
ALTER TABLE "audio_usage" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "slug" varchar(255);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "excerpt" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category" varchar(100);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "readTime" varchar(50);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "published" published DEFAULT 'draft' NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "authorId" integer;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "featuredImage" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "scheduledPublishAt" timestamp;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seoKeywords" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "metaDescription" varchar(320);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "publishedAt" timestamp;

ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "fullName" varchar(255);
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "nickname" varchar(100);
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "role" role;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "physicalDescription" text;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "personality" text;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "backstory" text;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "occupation" varchar(255);
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "age" varchar(50);
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "book_characters" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "platform" platform;
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "price" varchar(50);
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "priceInCents" integer;
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "currency" varchar(3);
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "verifiedAt" timestamp;
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "verificationSource" varchar(100);
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "previousPrice" varchar(50);
ALTER TABLE "book_pricing_history" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "reviewerName" varchar(255);
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "reviewerPhoto" text;
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "rating" integer;
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "review" text;
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "source" varchar(100);
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "featured" boolean;
ALTER TABLE "book_reviews" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "storylineType" storylineType;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "keyEvents" text;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "resolution" text;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "book_storylines" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "slug" varchar(255);
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "series" varchar(255);
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "seriesOrder" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "coverImage" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "sampleChapter" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "rating" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "reviewCount" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "tropes" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "heatLevel" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "pageCount" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "publishDate" varchar(100);
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "amazonUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "appleUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "koboUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "barnesNobleUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "googlePlayUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "retailPrice" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "directPrice" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "memberPrice" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "directSaleUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "audioSampleUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "trailerVideoUrl" text;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "featured" boolean;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "browsing_history" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "browsing_history" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "browsing_history" ADD COLUMN IF NOT EXISTS "viewCount" integer DEFAULT 1 NOT NULL;
ALTER TABLE "browsing_history" ADD COLUMN IF NOT EXISTS "lastViewedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "browsing_history" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "category" category;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "targetValue" integer;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "currentValue" integer DEFAULT 0 NOT NULL;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "unit" varchar(50);
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "startDate" timestamp;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "endDate" timestamp;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'active' NOT NULL;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "business_goals" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "date" timestamp;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "totalSubscribers" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "newSubscribers" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "unsubscribes" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "emailOpenRate" numeric(5, 2);
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "emailClickRate" numeric(5, 2);
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "pageViews" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "uniqueVisitors" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "dailyRevenue" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "ordersCount" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "instagramFollowers" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "tiktokFollowers" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "goodreadsFollowers" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "amazonRanking" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "reviewCount" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "averageRating" numeric(3, 2);
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "kdpRoyalties" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "pagesRead" integer;
ALTER TABLE "business_metrics" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "character1Id" integer;
ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "character2Id" integer;
ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "relationshipType" relationshipType;
ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "character_relationships" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "characterName" varchar(100);
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "bookTitle" varchar(255);
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "voicePresetId" integer;
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "elevenLabsVoiceId" varchar(100);
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "character_voice_assignments" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "content_access" ADD COLUMN IF NOT EXISTS "memberId" integer;
ALTER TABLE "content_access" ADD COLUMN IF NOT EXISTS "contentId" integer;
ALTER TABLE "content_access" ADD COLUMN IF NOT EXISTS "accessedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "content_access" ADD COLUMN IF NOT EXISTS "viewCount" integer;

ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "entityType" varchar(50);
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "entityId" integer;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "action" action;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "fieldChanged" varchar(100);
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "oldValue" text;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "newValue" text;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "changedBy" integer;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "changeReason" text;
ALTER TABLE "content_audit_log" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "prompt" text;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "characters" text;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "setting" varchar(255);
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "heatLevel" integer;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'pending' NOT NULL;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "generatedStoryId" integer;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "custom_story_requests" ADD COLUMN IF NOT EXISTS "completedAt" timestamp;

ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "briefingDate" timestamp;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "executiveSummary" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "subscriberUpdate" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "revenueUpdate" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "contentUpdate" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "goalProgress" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "actionItems" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "alerts" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "toolRecommendations" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "dataSnapshot" text;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "emailSent" boolean;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "emailSentAt" timestamp;
ALTER TABLE "daily_briefings" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "reportDate" timestamp;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "reportType" reportType DEFAULT 'daily_overview' NOT NULL;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "pageViews" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "uniqueVisitors" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "bounceRate" numeric(5, 2);
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "avgSessionDuration" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "newSubscribers" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "unsubscribes" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "blogPostViews" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "bookPageViews" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "qaChecksPassed" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "qaChecksFailed" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "openIssues" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "resolvedIssues" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "brokenLinksFound" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "totalOrders" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "totalRevenue" integer;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "summary" text;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "alerts" text;
ALTER TABLE "daily_reports" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "slug" varchar(255);
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "type" type;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "category" varchar(100);
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "coverImage" text;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "featured" boolean;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "publishDate" timestamp;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "exclusive_content" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "url" text;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "displayText" varchar(255);
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "linkType" linkType DEFAULT 'other' NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "location" varchar(255);
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "componentPath" varchar(255);
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "lastChecked" timestamp;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "lastStatus" lastStatus DEFAULT 'unknown' NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "httpStatus" integer;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "responseTime" integer;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "checkCount" integer DEFAULT 0 NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "failCount" integer DEFAULT 0 NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "external_links" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "storyId" varchar(255);
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "durationSeconds" integer;
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "voiceId" varchar(100);
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "characterCount" integer;
ALTER TABLE "generated_audio" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "eventType" varchar(100);
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "subscriberId" varchar(100);
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "subscriberEmail" varchar(320);
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "groupId" varchar(100);
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "groupName" varchar(255);
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "payload" text;
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "processed" boolean DEFAULT false NOT NULL;
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "processedAt" timestamp;
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "error" text;
ALTER TABLE "mailerlite_webhook_events" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "email" varchar(320);
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'active' NOT NULL;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "source" varchar(100);
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "mailerLiteId" varchar(100);
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "subscribedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "unsubscribedAt" timestamp;

ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "subject" varchar(255);
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "preheader" varchar(255);
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'draft' NOT NULL;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "scheduledAt" timestamp;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "sentAt" timestamp;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "recipientCount" integer;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "openCount" integer;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "clickCount" integer;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "createdBy" integer;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "newsletters" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "productId" integer;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripeSessionId" varchar(255);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" varchar(255);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "amount" integer;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "currency" varchar(3) DEFAULT 'usd' NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'pending' NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerEmail" varchar(320);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerName" varchar(255);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "authorName" varchar(255);
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "email" varchar(320);
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "website" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "bookTitle" varchar(255);
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "genre" varchar(100);
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "tropes" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "bookDescription" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "downloadLink" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "coverImageUrl" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "subscriberCount" varchar(50);
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "socialLinks" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'pending' NOT NULL;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "adminNotes" text;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "partner_applications" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "price" integer;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" varchar(3) DEFAULT 'usd' NOT NULL;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" purchaseType;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "stripeProductId" varchar(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "stripePriceId" varchar(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "features" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "downloadUrl" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true NOT NULL;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "checkDate" timestamp;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "checkType" checkType;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'passed' NOT NULL;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "itemsChecked" integer DEFAULT 0 NOT NULL;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "issuesFound" integer DEFAULT 0 NOT NULL;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "details" text;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "autoResolved" integer;
ALTER TABLE "qa_checks" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "checkId" integer;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "issueType" issueType;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "severity" severity DEFAULT 'warning' NOT NULL;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "location" varchar(255);
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "expectedValue" text;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "actualValue" text;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'open' NOT NULL;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "resolvedAt" timestamp;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "resolvedBy" integer;
ALTER TABLE "qa_issues" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "email" varchar(320);
ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "result" varchar(255);
ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "personality" text;
ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "answers" text;
ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "email" varchar(320);
ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "joinedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "lastAccessAt" timestamp;
ALTER TABLE "reader_club_members" ADD COLUMN IF NOT EXISTS "active" boolean;

ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "date" timestamp;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalSent" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalDelivered" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalFailed" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalOptIns" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalOptOuts" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "totalResponses" integer DEFAULT 0 NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "deliveryRate" numeric(5, 2);
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "responseRate" numeric(5, 2);
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "sms_analytics_daily" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "fromPhoneNumber" varchar(20);
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "messageBody" text;
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "twilioSid" varchar(64);
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "keyword" varchar(20);
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "processed" boolean DEFAULT false NOT NULL;
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "responseStatus" responseStatus DEFAULT 'pending' NOT NULL;
ALTER TABLE "sms_incoming_messages" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "templateId" integer;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "toPhoneNumber" varchar(20);
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "messageBody" text;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "twilioSid" varchar(64);
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'queued' NOT NULL;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "errorMessage" text;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "sentAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "sms_message_log" ADD COLUMN IF NOT EXISTS "deliveredAt" timestamp;

ALTER TABLE "sms_opt_events" ADD COLUMN IF NOT EXISTS "phoneNumber" varchar(20);
ALTER TABLE "sms_opt_events" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "sms_opt_events" ADD COLUMN IF NOT EXISTS "eventType" eventType;
ALTER TABLE "sms_opt_events" ADD COLUMN IF NOT EXISTS "source" varchar(50);
ALTER TABLE "sms_opt_events" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "slug" varchar(100);
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "name" varchar(200);
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "messageTemplate" text;
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "category" category DEFAULT 'system' NOT NULL;
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true NOT NULL;
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "sms_templates" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "title" varchar(255);
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "slug" varchar(255);
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "content" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "excerpt" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "audioUrl" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "previewAudioUrl" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "audioDuration" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "coverImage" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "category" category DEFAULT 'romance' NOT NULL;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "heatLevel" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "characters" text;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "minTier" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "featured" boolean;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "published" boolean;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "publishedAt" timestamp;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "playCount" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "likeCount" integer;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "steamy_stories" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "story_likes" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "story_likes" ADD COLUMN IF NOT EXISTS "storyId" integer;
ALTER TABLE "story_likes" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "story_play_history" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "story_play_history" ADD COLUMN IF NOT EXISTS "storyId" integer;
ALTER TABLE "story_play_history" ADD COLUMN IF NOT EXISTS "progress" integer;
ALTER TABLE "story_play_history" ADD COLUMN IF NOT EXISTS "completed" boolean;
ALTER TABLE "story_play_history" ADD COLUMN IF NOT EXISTS "playedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "productId" integer;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" varchar(255);
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "stripeCustomerId" varchar(255);
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'active' NOT NULL;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "currentPeriodStart" timestamp;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" timestamp;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "url" text;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "category" category;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "plan" varchar(100);
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "loginEmail" varchar(320);
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "loginMethod" varchar(50);
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'active' NOT NULL;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "kdpUseCases" text;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "features" text;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "usageLimits" text;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "lastChecked" timestamp;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "iconEmoji" varchar(10);
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "tool_inventory" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "emailNewReleases" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "emailNewsletter" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "emailPromotions" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "emailBlogPosts" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "preferredFormat" preferredFormat DEFAULT 'epub' NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "displayName" varchar(100);
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "bio" text;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "favoriteGenres" text;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "bookId" integer;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "orderId" integer;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "purchaseType" purchaseType DEFAULT 'single' NOT NULL;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "purchasePrice" integer;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "bonusContentUnlocked" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "downloadCount" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "lastDownloadAt" timestamp;
ALTER TABLE "user_purchases" ADD COLUMN IF NOT EXISTS "purchasedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "phoneNumber" varchar(20);
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "phoneVerified" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "smsOptIn" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "smsNewReleases" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "smsVipAlerts" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "smsOrderUpdates" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "smsMarketing" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user_sms_preferences" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "openId" varchar(64);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar(320);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "loginMethod" varchar(64);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" role DEFAULT 'user' NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastSignedIn" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "tierId" integer;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" varchar(255);
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "stripeCustomerId" varchar(255);
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "status" status DEFAULT 'active' NOT NULL;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "currentPeriodStart" timestamp;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" timestamp;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "customStoriesUsed" integer;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "joinedAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "vip_members" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "name" varchar(100);
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "slug" varchar(100);
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "price" integer;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "features" text;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "stripePriceId" varchar(255);
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "stripeProductId" varchar(255);
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "storiesPerMonth" integer;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "customStoriesAllowed" boolean;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "personalizedMessages" boolean;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "displayOrder" integer;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true NOT NULL;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "vip_tiers" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "userId" integer;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "name" varchar(100);
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "elevenLabsVoiceId" varchar(100);
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "style" varchar(50);
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "gender" gender;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "isPremium" boolean DEFAULT false NOT NULL;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "stability" integer;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "similarityBoost" integer;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "styleIntensity" integer;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true NOT NULL;
ALTER TABLE "voice_presets" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;

-- Unique columns from the Drizzle schema.
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_key" ON "blog_posts" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "books_slug_key" ON "books" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "exclusive_content_slug_key" ON "exclusive_content" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_email_key" ON "newsletter_subscribers" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "reader_club_members_email_key" ON "reader_club_members" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "sms_templates_slug_key" ON "sms_templates" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "steamy_stories_slug_key" ON "steamy_stories" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "user_preferences_userId_key" ON "user_preferences" ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_sms_preferences_userId_key" ON "user_sms_preferences" ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "users_openId_key" ON "users" ("openId");
CREATE UNIQUE INDEX IF NOT EXISTS "vip_members_userId_key" ON "vip_members" ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "vip_tiers_slug_key" ON "vip_tiers" ("slug");

-- Required by the play-progress upsert in PR #55 (cursor/vip-dashboard-real-stats-8210).
-- If story_play_history already contains two rows for the same user and story, this statement fails.
-- This file does not delete those rows. Collapse them by hand, keeping the greatest progress, then rerun this statement.
CREATE UNIQUE INDEX IF NOT EXISTS "story_play_history_user_story_idx" ON "story_play_history" ("userId", "storyId");
