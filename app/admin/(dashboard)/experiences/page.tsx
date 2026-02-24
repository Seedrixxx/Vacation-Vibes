import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminExperiencesPage() {
  const supabase = createAdminClient();
  const { data: list } = await supabase.from("experiences").select("*, destination:destinations(name)").order("name");
  const experiences = (list ?? []) as { id: string; name: string; slug: string; destination?: { name: string } | null }[];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Experiences</h1>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Destination</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((e: { id: string; name: string; slug: string; destination?: { name: string } | null }) => (
              <tr key={e.id} className="border-b border-charcoal/5">
                <td className="p-4">{e.name}</td>
                <td className="p-4 text-charcoal/70">{e.slug}</td>
                <td className="p-4">{e.destination?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
