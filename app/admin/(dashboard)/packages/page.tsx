import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPackagesPage() {
  const supabase = createAdminClient();
  const { data: list } = await supabase.from("packages").select("*, destination:destinations(name)").order("created_at", { ascending: false });
  const packages = (list ?? []) as { id: string; title: string; slug: string; duration_days: number; is_published: boolean; destination?: { name: string } | null }[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Packages</h1>
        <Link href="/admin/packages/new" className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white">
          Add package
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Days</th>
              <th className="p-4 font-medium">Published</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p: { id: string; title: string; slug: string; duration_days: number; is_published: boolean; destination?: { name: string } | null }) => (
              <tr key={p.id} className="border-b border-charcoal/5">
                <td className="p-4">{p.title}</td>
                <td className="p-4 text-charcoal/70">{p.slug}</td>
                <td className="p-4">{p.destination?.name ?? "—"}</td>
                <td className="p-4">{p.duration_days}</td>
                <td className="p-4">{p.is_published ? "Yes" : "No"}</td>
                <td className="p-4">
                  <Link href={`/admin/packages/${p.id}`} className="text-teal hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
