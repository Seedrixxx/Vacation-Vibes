import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data/public";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Blog | Vacation Vibez",
  description: "Travel tips, destination guides, and stories from Sri Lanka and beyond.",
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    posts = await getBlogPosts();
  } catch {
    // fallback
  }

  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Blog</h1>
        <p className="mt-4 text-charcoal/70">Travel inspiration and practical guides.</p>
        <div className="mt-12 space-y-8">
          {posts.length === 0 ? (
            <p className="text-charcoal/60">No posts yet. Check back soon.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="font-serif text-xl font-semibold text-charcoal group-hover:text-teal">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-1 text-charcoal/70">{post.excerpt}</p>}
                  {post.published_at && (
                    <time className="mt-2 block text-sm text-charcoal/50" dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString()}
                    </time>
                  )}
                </Link>
              </article>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
