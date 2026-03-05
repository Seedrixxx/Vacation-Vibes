import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { TemplatesTableActions } from "./TemplatesTableActions";
import { SeedTemplatesButton } from "./SeedTemplatesButton";

export const dynamic = "force-dynamic";

export default async function TripBuilderTemplatesPage() {
  const templates = await prisma.itineraryTemplate.findMany({
    orderBy: [{ tripType: "asc" }, { country: "asc" }, { durationNights: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Itinerary Templates
        </h1>
        <div className="flex gap-2">
          <SeedTemplatesButton />
          <Link href="/admin/trip-builder/templates/new">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Template
            </button>
          </Link>
        </div>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip type</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights / Days</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-charcoal/60 py-8">
                  No templates. Use &quot;Seed Sri Lanka templates&quot; or create one.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.tripType ?? "—"}</TableCell>
                  <TableCell>{t.country ?? "—"}</TableCell>
                  <TableCell>{t.durationNights}n / {t.durationDays}d</TableCell>
                  <TableCell>
                    {t.tags.length ? t.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>
                    )) : "—"}
                  </TableCell>
                  <TableCell>{t.enabled ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <TemplatesTableActions templateId={t.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
