import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const wasPublished = post.isPublished;
  const currentPublishedAt = post.publishedAt;

  async function update(formData: FormData) {
    "use server";
    const nowPublished = formData.get("is_published") === "on";
    const publishedAt =
      !wasPublished && nowPublished ? new Date() : currentPublishedAt;

    const newSlug = formData.get("slug") as string;
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        slug: newSlug,
        excerpt: (formData.get("excerpt") as string) || null,
        content: (formData.get("content") as string) || null,
        heroImageUrl: (formData.get("hero_image_url") as string) || null,
        authorName: (formData.get("author_name") as string) || null,
        publishedAt,
        isPublished: nowPublished,
      },
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/blog/${newSlug}`);
    revalidateTag("blog");
    redirect("/admin/blog");
  }

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-teal hover:underline">← Blog</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">Edit post</h1>
      <AdminBlogForm
        action={update}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          hero_image_url: post.heroImageUrl,
          author_name: post.authorName,
          is_published: post.isPublished,
        }}
      />
    </div>
  );
}
