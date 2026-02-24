import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="flex h-14 items-center justify-between px-6">
          <Link href="/admin" className="font-serif text-xl font-semibold text-teal">
            Vacation Vibez Admin
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin/destinations" className="text-sm text-charcoal/70 hover:text-charcoal">Destinations</Link>
            <Link href="/admin/experiences" className="text-sm text-charcoal/70 hover:text-charcoal">Experiences</Link>
            <Link href="/admin/packages" className="text-sm text-charcoal/70 hover:text-charcoal">Packages</Link>
            <Link href="/admin/blog" className="text-sm text-charcoal/70 hover:text-charcoal">Blog</Link>
            <Link href="/admin/inquiries" className="text-sm text-charcoal/70 hover:text-charcoal">Inquiries</Link>
            <Link href="/admin/payments" className="text-sm text-charcoal/70 hover:text-charcoal">Payments</Link>
          </nav>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
