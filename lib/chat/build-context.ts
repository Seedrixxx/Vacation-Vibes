import { prisma } from "@/lib/prisma";
import { getActivityLabel } from "@/lib/trip-builder/activity-labels";
import { getDestinations, getExperiences } from "@/lib/data/public";
import { getGeneralContext } from "@/lib/chat/general-context";
import { getRelevantChunks } from "@/lib/chat/vector-search";

const MAX_CONTEXT_CHARS = 10000;

export type ChatContextFilters = {
  durationDays?: number;
  country?: string;
};

/**
 * Build a single context string for the chatbot. When USE_CHAT_VECTOR_SEARCH=true
 * and userMessage is provided, uses pgvector similarity search to return only
 * relevant chunks; otherwise loads full context (templates, packages, destinations, experiences).
 */
export async function buildChatContext(
  _filters?: ChatContextFilters,
  userMessage?: string
): Promise<string> {
  const useVectorSearch =
    process.env.USE_CHAT_VECTOR_SEARCH === "true" && userMessage?.trim();
  if (useVectorSearch) {
    const chunks = await getRelevantChunks(userMessage!.trim(), 10);
    if (chunks.length > 0) {
      const intro = getGeneralContext().split("\n").slice(0, 5).join("\n");
      const chunkTexts = chunks.map((c) => c.chunkText).join("\n\n");
      const out = `${intro}\n\n## Relevant context\n${chunkTexts}`.trim();
      return out.slice(0, MAX_CONTEXT_CHARS) + (out.length > MAX_CONTEXT_CHARS ? "\n\n[Context truncated.]" : "");
    }
  }

  const parts: string[] = [];

  // 0. General Q&A and FAQs (company, Sri Lanka travel, services, booking)
  parts.push(getGeneralContext());
  parts.push("\n\n");

  // 1. Itinerary templates (Prisma) — select only fields used in context
  try {
    const templates = await prisma.itineraryTemplate.findMany({
      where: { enabled: true },
      select: { templateJson: true, durationNights: true, durationDays: true, country: true },
      orderBy: { durationDays: "asc" },
    });
    if (templates.length > 0) {
      parts.push("## Itinerary templates (Build Your Trip)\n");
      for (const t of templates) {
        const data = t.templateJson as {
          name?: string;
          days?: Array<{
            dayNumber?: number;
            day?: number;
            from?: string;
            to?: string;
            title?: string;
            description?: string;
            modules?: string[];
          }>;
          rules?: { interestToModules?: Record<string, string[]> };
        };
        const name = data?.name ?? `${t.durationNights}N/${t.durationDays}D`;
        parts.push(`### ${name} (${t.country ?? "Sri Lanka"}, ${t.durationDays} days)\n`);
        const rawDays = Array.isArray(data?.days) ? data.days : [];
        for (const d of rawDays) {
          const dayNum = d.dayNumber ?? d.day ?? 0;
          const from = d.from ? getActivityLabel(d.from) : "";
          const to = d.to ? getActivityLabel(d.to) : "";
          const moduleLabels = (d.modules ?? [])
            .map((m) => getActivityLabel(m))
            .filter(Boolean);
          parts.push(
            `- Day ${dayNum}: ${from} → ${to}. Activities: ${moduleLabels.join(", ") || "—"}\n`
          );
        }
        if (data?.rules?.interestToModules && Object.keys(data.rules.interestToModules).length > 0) {
          parts.push(
            "  Interest themes: " +
              Object.entries(data.rules.interestToModules)
                .map(([k, v]) => `${k} (${(v as string[]).map(getActivityLabel).join(", ")})`)
                .join("; ") +
              "\n"
          );
        }
        parts.push("\n");
      }
    }
  } catch (e) {
    // Prisma may be unconfigured
  }

  // 2. Packages with package days (Prisma) — select only fields used in context
  try {
    const packages = await prisma.package.findMany({
      where: { isPublished: true },
      select: {
        title: true,
        durationDays: true,
        summary: true,
        packageDays: {
          orderBy: { order: "asc" as const },
          select: { dayNumber: true, fromLocation: true, toLocation: true, title: true, description: true },
        },
      },
      orderBy: { title: "asc" },
      take: 30,
    });
    if (packages.length > 0) {
      parts.push("## Tour packages (day-by-day)\n");
      for (const pkg of packages) {
        parts.push(`### ${pkg.title} (${pkg.durationDays} days)\n`);
        parts.push(`${pkg.summary ?? ""}\n`);
        for (const day of pkg.packageDays) {
          parts.push(
            `- Day ${day.dayNumber}: ${day.fromLocation ?? ""} → ${day.toLocation ?? ""}. ${day.title ?? ""}. ${day.description}\n`
          );
        }
        parts.push("\n");
      }
    }
  } catch {
    // ignore
  }

  // 3. Destinations & experiences (Supabase – optional)
  try {
    const [destinations, experiences] = await Promise.all([
      getDestinations(),
      getExperiences(),
    ]);
    if (destinations.length > 0) {
      parts.push("## Destinations\n");
      for (const d of destinations) {
        parts.push(`- ${d.name} (${d.country}): ${d.summary ?? ""}\n`);
      }
    }
    if (experiences.length > 0) {
      parts.push("## Experiences\n");
      for (const e of experiences.slice(0, 50)) {
        parts.push(`- ${e.name}: ${e.description ?? ""}\n`);
      }
    }
  } catch {
    // Supabase optional
  }

  let out = parts.join("").trim();
  if (out.length > MAX_CONTEXT_CHARS) {
    out = out.slice(0, MAX_CONTEXT_CHARS) + "\n\n[Context truncated.]";
  }
  return out || "No itinerary or package data available yet.";
}
