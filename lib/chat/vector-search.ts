import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;

export type RelevantChunk = {
  contentType: string;
  contentId: string | null;
  chunkText: string;
};

/**
 * Get embedding for text using OpenAI. Returns null if API key missing or request fails.
 */
async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const openai = new OpenAI({ apiKey });
    const { data } = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 8000),
    });
    const vec = data[0]?.embedding;
    return Array.isArray(vec) && vec.length === EMBEDDING_DIM ? vec : null;
  } catch {
    return null;
  }
}

/**
 * Returns relevant context chunks for the user message (vector similarity).
 * Uses pgvector cosine distance. Returns [] if extension/table missing or embedding fails.
 */
export async function getRelevantChunks(
  userMessage: string,
  limit = 10
): Promise<RelevantChunk[]> {
  const embedding = await embedText(userMessage);
  if (!embedding) return [];

  const vectorStr = `[${embedding.join(",")}]`;
  try {
    const rows = await prisma.$queryRaw<
      Array<{ contentType: string; contentId: string | null; chunkText: string }>
    >`
      SELECT "contentType", "contentId", "chunkText"
      FROM "ContentEmbedding"
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${limit}
    `;
    return rows.map((r) => ({
      contentType: r.contentType,
      contentId: r.contentId,
      chunkText: r.chunkText,
    }));
  } catch {
    return [];
  }
}
