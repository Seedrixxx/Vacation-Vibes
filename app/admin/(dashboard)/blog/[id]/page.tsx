import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error || !post) notFound();

  async function update(formData: FormData) {
    "use server";
    const supabase = createAdminClient();
    const wasPublished = post.is_published;
    const nowPublished = formData.get("is_published") === "on";
    const publishedAt = !wasPublished && nowPublished ? new Date().toISOString() : post.published_at;

    await supabase
      .from("blog_posts")
      .update({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: (formData.get("content") as string) || null,
        hero_image_url: (formData.get("hero_image_url") as string) || null,
        author_name: (formData.get("author_name") as string) || null,
        published_at: publishedAt,
        is_published: nowPublished,
      })
      .eq("id", id);
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
          hero_image_url: post.hero_image_url,
          author_name: post.author_name,
          is_published: post.is_published,
        }}
      />
    </div>
  );
}
