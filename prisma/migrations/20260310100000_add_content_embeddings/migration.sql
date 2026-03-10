-- ContentEmbedding table for chat vector search (packages, destinations, experiences, faq).
-- Uses BYTEA for embedding so migration runs without pgvector. To use pgvector later:
--   CREATE EXTENSION IF NOT EXISTS vector;
--   ALTER TABLE "ContentEmbedding" ALTER COLUMN "embedding" TYPE vector(1536) USING embedding::text::vector(1536);

CREATE TABLE "ContentEmbedding" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT,
    "chunkText" TEXT NOT NULL,
    "embedding" BYTEA NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContentEmbedding_contentType_contentId_idx" ON "ContentEmbedding"("contentType", "contentId");
