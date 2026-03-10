-- ContentEmbedding table for chat vector search (packages, destinations, experiences, faq).
-- Requires pgvector. Enable it before running migrations:
--   Local: install pgvector (e.g. brew install pgvector), then in psql: CREATE EXTENSION IF NOT EXISTS vector;
--   Hosted (Supabase/Neon/etc.): enable "vector" in the provider dashboard, then run migrations.
-- Optional: after seeding embeddings, add a vector index for faster search, e.g.:
--   CREATE INDEX "ContentEmbedding_embedding_idx" ON "ContentEmbedding" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

CREATE TABLE "ContentEmbedding" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT,
    "chunkText" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContentEmbedding_contentType_contentId_idx" ON "ContentEmbedding"("contentType", "contentId");
