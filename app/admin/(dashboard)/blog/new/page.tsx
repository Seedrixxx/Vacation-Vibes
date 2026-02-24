import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export default async function NewBlogPostPage() {
  async function save(formData: FormData) {
    "use server";
    const supabase = createAdminClient();
    const publishedAt = formData.get("is_published") === "on" ? new Date().toISOString() : null;
    await supabase.from("blog_posts").insert({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      content: (formData.get("content") as string) || null,
      hero_image_url: (formData.get("hero_image_url") as string) || null,
      author_name: (formData.get("author_name") as string) || null,
      published_at: publishedAt,
      is_published: formData.get("is_published") === "on",
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
