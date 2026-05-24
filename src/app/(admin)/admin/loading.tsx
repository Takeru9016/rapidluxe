export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-6 border border-(--color-navy-border) flex flex-col gap-3"
          >
            <div className="h-4 w-1/2 bg-(--color-navy-border) rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-(--color-navy-border) rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-(--color-navy-border) overflow-hidden">
        <div className="h-12 bg-(--color-navy-border) animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-t border-(--color-navy-border) px-4 flex items-center gap-4"
          >
            <div className="h-4 w-1/4 bg-(--color-navy-border) rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-(--color-navy-border) rounded animate-pulse" />
            <div className="h-4 w-1/5 bg-(--color-navy-border) rounded animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
