import { Container } from "@/components/ui/Container";

export default function PackagesLoading() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <header className="mb-12 text-center">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-charcoal/10" />
          <div className="mx-auto mt-4 h-5 max-w-2xl animate-pulse rounded bg-charcoal/10" />
        </header>
        <div className="mb-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-charcoal/10" />
          ))}
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <div className="aspect-[4/3] animate-pulse bg-charcoal/10" />
              <div className="space-y-3 p-6">
                <div className="h-5 w-3/4 animate-pulse rounded bg-charcoal/10" />
                <div className="h-4 w-full animate-pulse rounded bg-charcoal/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-charcoal/10" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
