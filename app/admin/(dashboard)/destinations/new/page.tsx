import { redirect } from "next/navigation";
import { AdminDestinationForm } from "@/components/admin/AdminDestinationForm";

export default function NewDestinationPage() {
  async function save(formData: FormData) {
    "use server";
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("destinations").insert({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      country: formData.get("country") as string,
      focus_inbound: formData.get("focus_inbound") === "on",
      summary: (formData.get("summary") as string) || null,
      hero_image_url: (formData.get("hero_image_url") as string) || null,
    });
    redirect("/admin/destinations");
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">New destination</h1>
      <AdminDestinationForm action={save} />
    </div>
  );
}
