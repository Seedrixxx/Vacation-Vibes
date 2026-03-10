import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Blog</h1>
        <Link href="/admin/blog/new" className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white">
          New post
        </Link>
      </div>
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-soft">
            <div>
              <Link href={`/admin/blog/${p.id}`} className="font-medium text-charcoal hover:text-teal">{p.title}</Link>
              <span className="ml-2 text-sm text-charcoal/50">{p.slug}</span>
            </div>
            <span className="text-sm text-charcoal/60">{p.isPublished ? "Published" : "Draft"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
