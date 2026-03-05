import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TripRequestStatusSelect } from "./TripRequestStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminTripRequestsPage() {
  const tripRequests = await prisma.tripRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-charcoal">
        Trip Requests
      </h1>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-charcoal/60">
                  No trip requests yet.
                </TableCell>
              </TableRow>
            ) : (
              tripRequests.map((tr) => (
                <TableRow key={tr.id}>
                  <TableCell className="font-medium">{tr.fullName}</TableCell>
                  <TableCell>{tr.email}</TableCell>
                  <TableCell className="text-charcoal/70">
                    {tr.startDate
                      ? new Date(tr.startDate).toLocaleDateString()
                      : "—"}
                    {tr.endDate &&
                      ` – ${new Date(tr.endDate).toLocaleDateString()}`}
                  </TableCell>
                  <TableCell>{tr.budget ?? "—"}</TableCell>
                  <TableCell>
                    <TripRequestStatusSelect
                      requestId={tr.id}
                      currentStatus={tr.status}
                    />
                  </TableCell>
                  <TableCell className="text-charcoal/60">
                    {new Date(tr.createdAt).toLocaleDateString()}
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
