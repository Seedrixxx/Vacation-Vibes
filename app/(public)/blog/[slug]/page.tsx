import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/public";
import { Container } from "@/components/ui/Container";
import { sanitizeHtml } from "@/lib/sanitize";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/seo/json-ld";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog | Vacation Vibez" };
  return {
    title: `${post.title} | Vacation Vibez`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: `${post.title} | Vacation Vibez`,
      description: post.excerpt ?? undefined,
      images: post.hero_image_url ? [post.hero_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const content = post.content ? sanitizeHtml(post.content) : "";
  const postUrl = `${BASE}/blog/${post.slug}`;
  const published = post.published_at ?? post.created_at;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: BASE || "/" },
    { name: "Blog", url: `${BASE}/blog` },
    { name: post.title, url: postUrl },
  ]);
  const article = articleJsonLd({
    title: post.title,
    description: post.excerpt ?? undefined,
    url: postUrl,
    image: post.hero_image_url ?? undefined,
    datePublished: published,
    dateModified: published,
    author: post.author_name ?? undefined,
  });

  return (
    <div className="bg-sand py-16 lg:py-24">
      <JsonLd data={breadcrumb} />
      <JsonLd data={article} />
      <Container className="max-w-3xl">
        <Link href="/blog" className="text-sm text-teal hover:underline">← Blog</Link>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-charcoal">{post.title}</h1>
        {post.published_at && (
          <time className="mt-2 block text-charcoal/60" dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString()}
            {post.author_name && ` · ${post.author_name}`}
          </time>
        )}
        {post.excerpt && <p className="mt-4 text-lg text-charcoal/70">{post.excerpt}</p>}
        <div
          className="prose prose-charcoal mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </div>
  );
}
