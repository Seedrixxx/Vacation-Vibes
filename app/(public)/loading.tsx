import { SectionSkeleton } from "@/components/home/SectionSkeleton";

export default function PublicLoading() {
  return (
    <>
      <SectionSkeleton className="py-16 lg:py-24" />
      <SectionSkeleton className="py-16 lg:py-24" />
      <SectionSkeleton className="py-16 lg:py-24" />
    </>
  );
}
