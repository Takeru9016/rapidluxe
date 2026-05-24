import { DestinationCardSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <DestinationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
