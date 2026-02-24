import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminInquiriesPage() {
  const supabase = createAdminClient();
  const { data: list } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  const inquiries = (list ?? []) as { id: string; name: string; email: string; source_page: string | null; created_at: string }[];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Inquiries</h1>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Source</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((i: { id: string; name: string; email: string; source_page: string | null; created_at: string }) => (
              <tr key={i.id} className="border-b border-charcoal/5">
                <td className="p-4">{i.name}</td>
                <td className="p-4">{i.email}</td>
                <td className="p-4 text-charcoal/70">{i.source_page ?? "—"}</td>
                <td className="p-4 text-charcoal/70">{new Date(i.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
