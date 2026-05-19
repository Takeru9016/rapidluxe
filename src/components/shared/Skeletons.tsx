import { cn } from "@/lib/utils";

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
