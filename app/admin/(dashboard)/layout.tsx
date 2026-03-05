import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebarWrapper } from "@/components/admin/AdminSidebarWrapper";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-sand-200 lg:flex">
      <AdminSidebarWrapper />
      <main className="flex-1 p-4 pt-16 lg:pt-6 lg:pl-6">
        {children}
      </main>
    </div>
  );
}
