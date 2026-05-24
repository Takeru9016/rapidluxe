export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="aspect-[16/9] w-full bg-(--color-navy-border) rounded-xl animate-pulse" />
      <div className="mt-6 h-12 w-2/3 bg-(--color-navy-border) rounded animate-pulse" />
      <div className="mt-6 flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 bg-(--color-navy-border) rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
