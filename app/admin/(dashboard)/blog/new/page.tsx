import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export default async function NewBlogPostPage() {
  async function save(formData: FormData) {
    "use server";
    const isPublished = formData.get("is_published") === "on";
    await prisma.blogPost.create({
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: (formData.get("content") as string) || null,
        heroImageUrl: (formData.get("hero_image_url") as string) || null,
        authorName: (formData.get("author_name") as string) || null,
        publishedAt: isPublished ? new Date() : null,
        isPublished,
      },
    });
    redirect("/admin/blog");
  }

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-teal hover:underline">← Blog</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">New post</h1>
      <AdminBlogForm action={save} />
    </div>
  );
}
