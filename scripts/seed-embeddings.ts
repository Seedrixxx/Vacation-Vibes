/**
 * Seed ContentEmbedding table for chat vector search.
 * Run: npx tsx scripts/seed-embeddings.ts
 * Requires: OPENAI_API_KEY, DATABASE_URL, pgvector migration applied.
 */
import { prisma } from "../lib/prisma";
import { getPackages, getDestinations, getExperiences } from "../lib/data/public";
import { getGeneralContext } from "../lib/chat/general-context";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";

async function embed(text: string): Promise<number[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { data } = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000),
  });
  const vec = data[0]?.embedding;
  if (!Array.isArray(vec)) throw new Error("No embedding returned");
  return vec;
}

function chunkText(text: string, maxLen = 1000): string[] {
  const chunks: string[] = [];
  let rest = text.trim();
  while (rest.length > 0) {
    if (rest.length <= maxLen) {
      chunks.push(rest);
      break;
    }
    const slice = rest.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    chunks.push(lastSpace > 0 ? slice.slice(0, lastSpace) : slice);
    rest = rest.slice(chunks[chunks.length - 1].length).trim();
  }
  return chunks;
}

export async function main() {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error("OPENAI_API_KEY required");
    process.exit(1);
  }

  const toInsert: { id: string; contentType: string; contentId: string | null; chunkText: string; embedding: number[] }[] = [];

  const packages = await getPackages({ limit: 100 });
  for (const p of packages) {
    const text = `${p.title}. ${p.overview ?? ""}`.trim();
    if (!text) continue;
    const embedding = await embed(text);
    toInsert.push({
      id: `pkg-${p.id}`,
      contentType: "package",
      contentId: p.id,
      chunkText: text,
      embedding,
    });
  }

  const destinations = await getDestinations();
  for (const d of destinations) {
    const text = `${d.name}. ${d.summary ?? ""}`.trim();
    if (!text) continue;
    const embedding = await embed(text);
    toInsert.push({
      id: `dest-${d.id}`,
      contentType: "destination",
      contentId: d.id,
      chunkText: text,
      embedding,
    });
  }

  const experiences = await getExperiences();
  for (const e of experiences) {
    const text = `${e.name}. ${e.description ?? ""}`.trim();
    if (!text) continue;
    const embedding = await embed(text);
    toInsert.push({
      id: `exp-${e.id}`,
      contentType: "experience",
      contentId: e.id,
      chunkText: text,
      embedding,
    });
  }

  const faqContext = getGeneralContext();
  const faqChunks = chunkText(faqContext, 1500);
  for (let i = 0; i < faqChunks.length; i++) {
    const embedding = await embed(faqChunks[i]);
    toInsert.push({
      id: `faq-${i}`,
      contentType: "faq",
      contentId: null,
      chunkText: faqChunks[i],
      embedding,
    });
  }

  for (const row of toInsert) {
    const vectorStr = `[${row.embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ContentEmbedding" ("id", "contentType", "contentId", "chunkText", "embedding", "createdAt")
       VALUES ($1, $2, $3, $4, $5::vector, NOW())
       ON CONFLICT ("id") DO UPDATE SET "chunkText" = $4, "embedding" = $5::vector`,
      row.id,
      row.contentType,
      row.contentId,
      row.chunkText,
      vectorStr
    );
  }

  console.log(`Seeded ${toInsert.length} embeddings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
