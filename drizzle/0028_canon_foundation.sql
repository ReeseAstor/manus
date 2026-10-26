CREATE TABLE "series" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "description" text,
  "status" varchar(32) NOT NULL DEFAULT 'draft',
  "displayOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "canon_documents" (
  "id" serial PRIMARY KEY,
  "seriesId" integer NOT NULL REFERENCES "series"("id"),
  "bookId" integer REFERENCES "books"("id"),
  "title" varchar(255) NOT NULL,
  "storageKey" text NOT NULL,
  "sourceType" varchar(32) NOT NULL DEFAULT 'manuscript',
  "status" varchar(32) NOT NULL DEFAULT 'uploaded',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "canon_chunks" (
  "id" serial PRIMARY KEY,
  "documentId" integer NOT NULL REFERENCES "canon_documents"("id"),
  "chapter" varchar(255),
  "sequence" integer NOT NULL,
  "content" text NOT NULL,
  "citation" varchar(512) NOT NULL,
  "approved" boolean NOT NULL DEFAULT false,
  "readerVisible" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "reader_entitlements" (
  "id" serial PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES "users"("id"),
  "productId" integer REFERENCES "products"("id"),
  "entitlementKey" varchar(255) NOT NULL,
  "sourceOrderId" integer REFERENCES "orders"("id"),
  "status" varchar(32) NOT NULL DEFAULT 'active',
  "expiresAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "editorial_approvals" (
  "id" serial PRIMARY KEY,
  "resourceType" varchar(64) NOT NULL,
  "resourceId" integer NOT NULL,
  "status" varchar(32) NOT NULL DEFAULT 'draft',
  "approvedBy" integer REFERENCES "users"("id"),
  "approvedAt" timestamp,
  "notes" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "canon_documents_series_idx" ON "canon_documents" ("seriesId");
CREATE INDEX "canon_chunks_document_idx" ON "canon_chunks" ("documentId", "sequence");
CREATE INDEX "canon_chunks_reader_idx" ON "canon_chunks" ("approved", "readerVisible");
CREATE INDEX "reader_entitlements_user_idx" ON "reader_entitlements" ("userId", "status");
