import { cn } from "@/lib/utils";
import { UsefulLinks } from "./UsefulLinks";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-(--color-navy-border) rounded animate-pulse",
        className,
      )}
    />
  );
}

export function PackageCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-(--color-navy-border)",
        className,
      )}
    >
      <Bone className="aspect-4/3 rounded-none" />
      <div className="p-5">
        <Bone className="h-6 w-3/4 mt-3" />
        <Bone className="h-4 w-1/2 mt-3" />
        <Bone className="h-4 w-1/3 mt-2" />
        <Bone className="h-8 w-2/3 mt-4" />
      </div>
    </div>
  );
}

export function DestinationCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden aspect-3/4 relative bg-(--color-navy-border)",
        className,
      )}
    >
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
        <Bone className="h-5 w-2/3" />
        <Bone className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function DealCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-(--color-navy-border)",
        className,
      )}
    >
      <Bone className="aspect-video rounded-none" />
      <div className="p-5">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/2 mt-2" />
        <Bone className="h-4 w-2/3 mt-2" />
        <Bone className="h-8 w-full mt-4" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 border border-(--color-navy-border)",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Bone className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Bone className="h-4 w-1/3" />
          <Bone className="h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-4/5" />
      </div>
      <div className="mt-4">
        <Bone className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-(--color-navy-border)",
        className,
      )}
    >
      <Bone className="aspect-video rounded-none" />
      <div className="p-5 flex flex-col gap-2">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function PackageDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Bone className="h-96 w-full rounded-xl mb-8" />
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <Bone className="h-8 w-2/3" />
          <Bone className="h-5 w-1/3" />
          <Bone className="h-5 w-1/2" />
          <div className="flex gap-3 mt-4">
            {["overview", "itinerary", "hotels", "activities", "reviews"].map(
              (t) => (
                <Bone key={t} className="h-8 w-20" />
              ),
            )}
          </div>
          <Bone className="h-48 w-full mt-4 rounded-xl" />
        </div>
        <aside className="hidden lg:block w-80 xl:w-96 shrink-0">
          <Bone className="h-96 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}

export function DestinationDetailSkeleton() {
  return (
    <div>
      <Bone className="w-full h-64 md:h-[480px] rounded-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="pt-6 md:pt-8">
          <Bone className="h-4 w-40 mb-3" />
          <Bone className="h-10 md:h-14 w-2/3 md:w-1/2" />
          <Bone className="h-4 w-24 mt-2" />
        </div>

        <section className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-8" />
          <div className="flex flex-col gap-3 max-w-3xl">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
          </div>
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-2" />
          <Bone className="h-4 w-1/2 mb-8" />
          <Bone className="h-64 w-full rounded-xl" />
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-8" />
          <div className="max-w-3xl flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-(--color-navy-border)">
          <Bone className="h-8 w-1/3 mb-8" />
          <div className="max-w-2xl flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-5 w-full" />
            ))}
          </div>
        </section>

        <section className="py-8 border-t border-(--color-navy-border)">
          <Bone className="h-96 w-full rounded-xl" />
        </section>

        <UsefulLinks />
      </div>
    </div>
  );
}

export function BookingCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl p-5 border border-(--color-navy-border)",
        className,
      )}
    >
      <div className="flex gap-4">
        <Bone className="w-24 h-24 rounded-lg shrink-0" />
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <Bone className="h-5 w-3/4" />
          <Bone className="h-4 w-1/2" />
          <Bone className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}
