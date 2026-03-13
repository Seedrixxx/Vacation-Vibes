import { Container } from "@/components/ui/Container";

export default function PackageDetailLoading() {
  return (
    <div>
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="animate-pulse bg-charcoal/20 absolute inset-0" />
        <Container className="relative z-10 flex min-h-[50vh] flex-col justify-end pb-12 pt-24">
          <div className="h-12 w-3/4 max-w-2xl animate-pulse rounded bg-white/30" />
          <div className="mt-4 flex gap-4">
            <div className="h-5 w-24 animate-pulse rounded bg-white/20" />
            <div className="h-5 w-20 animate-pulse rounded bg-white/20" />
          </div>
        </Container>
      </section>
      <Container className="py-12 lg:py-16">
        <div className="mb-8 flex flex-wrap gap-4 rounded-lg border border-charcoal/10 bg-sand-100/30 px-4 py-3">
          <div className="h-5 w-32 animate-pulse rounded bg-charcoal/10" />
          <div className="h-5 w-24 animate-pulse rounded bg-charcoal/10" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-charcoal/10" />
          <div className="h-4 w-full animate-pulse rounded bg-charcoal/10" />
          <div className="h-4 w-full animate-pulse rounded bg-charcoal/10" />
        </div>
        <div className="mt-12 space-y-6">
          <div className="h-6 w-40 animate-pulse rounded bg-charcoal/10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-charcoal/10 bg-sand-100/30 p-5">
              <div className="h-5 w-24 animate-pulse rounded bg-charcoal/10" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-charcoal/10" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-charcoal/10" />
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <div className="h-11 w-40 animate-pulse rounded-lg bg-charcoal/10" />
          <div className="h-11 w-32 animate-pulse rounded-lg bg-charcoal/10" />
        </div>
      </Container>
    </div>
  );
}
