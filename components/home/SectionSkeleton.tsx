import { Container } from "@/components/ui/Container";

/** Generic loading skeleton for streamed homepage sections. */
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <section className={className}>
      <Container>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-charcoal/10" />
          <div className="h-4 w-full max-w-xl rounded bg-charcoal/10" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-charcoal/10" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
