import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/lib/supabase/types";

function mapToBlogPost(p: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  heroImageUrl: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  isPublished: boolean;
  createdAt: Date;
}): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    hero_image_url: p.heroImageUrl,
    author_name: p.authorName,
    published_at: p.publishedAt?.toISOString() ?? null,
    is_published: p.isPublished,
    created_at: p.createdAt.toISOString(),
  };
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const list = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: limit ?? 100,
  });
  return list.map(mapToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
  });
  return post ? mapToBlogPost(post) : null;
}
