"use client";

import { PackageSearch, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
  type PackageFilterDestination,
  usePackageFilters,
} from "@/hooks/api/usePackageFilters";
import { type PackagesQuery, usePackages } from "@/hooks/api/usePackages";
import { formatPrice } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_BUCKETS = [
  { key: "1-3", label: "1–3 nights", min: 1, max: 3 },
  { key: "4-7", label: "4–7 nights", min: 4, max: 7 },
  { key: "8-14", label: "8–14 nights", min: 8, max: 14 },
  { key: "15+", label: "15+ nights", min: 15, max: undefined },
] as const;

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const SORT_TO_API: Record<SortValue, PackagesQuery["sort"]> = {
  popular: "featured",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  duration: "duration_asc",
};

const FALLBACK_PRICE_RANGE = { min: 0, max: 500000 };

// ─── FilterPanel ──────────────────────────────────────────────────────────────

interface FilterPanelProps {
  destinations: PackageFilterDestination[];
  allTags: string[];
  selectedDestinations: string[];
  selectedDuration: string | null;
  priceRange: { min: number; max: number };
  priceValue: [number, number];
  selectedTags: string[];
  onToggleDestination: (slug: string) => void;
  onToggleDuration: (key: string) => void;
  onPriceChange: (val: [number, number]) => void;
  onToggleTag: (tag: string) => void;
  onReset: () => void;
}

function FilterPanel({
  destinations,
  allTags,
  selectedDestinations,
  selectedDuration,
  priceRange,
  priceValue,
  selectedTags,
  onToggleDestination,
  onToggleDuration,
  onPriceChange,
  onToggleTag,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedDestinations.length > 0 ||
    selectedDuration !== null ||
    priceValue[0] > priceRange.min ||
    priceValue[1] < priceRange.max ||
    selectedTags.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-white">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-(--color-gold) hover:text-(--color-gold-light) hover:bg-transparent px-0 text-sm"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Destination */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-(--color-white-muted) uppercase tracking-widest font-body">
          Destination
        </p>
        <div className="flex flex-col gap-2">
          {destinations.map((dest) => (
            <label
              key={dest.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDestinations.includes(dest.slug)}
                onChange={() => onToggleDestination(dest.slug)}
                className="w-4 h-4 rounded border border-(--color-navy-border) cursor-pointer accent-(--color-gold) shrink-0"
              />
              <span className="text-sm text-(--color-white-muted) group-hover:text-white transition-colors">
                {dest.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      {/* Duration */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-(--color-white-muted) uppercase tracking-widest font-body">
          Duration
        </p>
        <div className="flex flex-col gap-2">
          {DURATION_BUCKETS.map((bucket) => (
            <label
              key={bucket.key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDuration === bucket.key}
                onChange={() => onToggleDuration(bucket.key)}
                className="w-4 h-4 rounded border border-(--color-navy-border) cursor-pointer accent-(--color-gold) shrink-0"
              />
              <span className="text-sm text-(--color-white-muted) group-hover:text-white transition-colors font-mono">
                {bucket.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-(--color-navy-border)" />

      {/* Budget */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-(--color-white-muted) uppercase tracking-widest font-body">
          Budget
        </p>
        <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-(--color-gold)">
            {formatPrice(priceValue[0])}
          </span>
          <span className="text-(--color-gold)">
            {formatPrice(priceValue[1])}
          </span>
        </div>
        <Slider
          value={priceValue}
          min={priceRange.min}
          max={priceRange.max}
          step={5000}
          onValueChange={(val) => onPriceChange([val[0], val[1]])}
          className="w-full"
        />
      </div>

      <Separator className="bg-(--color-navy-border)" />

      {/* Travel Type */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-(--color-white-muted) uppercase tracking-widest font-body">
          Travel Type
        </p>
        <div className="flex flex-col gap-2">
          {allTags.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => onToggleTag(tag)}
                className="w-4 h-4 rounded border border-(--color-navy-border) cursor-pointer accent-(--color-gold) shrink-0"
              />
              <span className="text-sm text-(--color-white-muted) group-hover:text-white transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PackagesContent ──────────────────────────────────────────────────────────

function PackagesContent() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState<[number, number] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  const { sort, setSort } = useSearchStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: filtersData } = usePackageFilters();
  const destinations = filtersData?.destinations ?? [];
  const priceRange = filtersData?.priceRange ?? FALLBACK_PRICE_RANGE;

  // Restore filter state from URL once filter bounds are known.
  useEffect(() => {
    if (initializedFromUrl || !filtersData) return;

    const destParam = searchParams.get("destination");
    if (destParam)
      setSelectedDestinations(destParam.split(",").filter(Boolean));

    const durationParam = searchParams.get("duration");
    if (
      durationParam &&
      DURATION_BUCKETS.some((b) => b.key === durationParam)
    ) {
      setSelectedDuration(durationParam);
    }

    const minParam = searchParams.get("minPrice");
    const maxParam = searchParams.get("maxPrice");
    setPriceValue([
      minParam ? Number(minParam) : filtersData.priceRange.min,
      maxParam ? Number(maxParam) : filtersData.priceRange.max,
    ]);

    const sortParam = searchParams.get("sort");
    if (sortParam && SORT_OPTIONS.some((o) => o.value === sortParam)) {
      setSort(sortParam as SortValue);
    }

    setInitializedFromUrl(true);
  }, [filtersData, initializedFromUrl, searchParams, setSort]);

  const effectivePriceValue: [number, number] = priceValue ?? [
    priceRange.min,
    priceRange.max,
  ];

  // Sync filter state to the URL (debounced so slider drags don't spam history).
  useEffect(() => {
    if (!initializedFromUrl) return;
    if (urlSyncTimeout.current) clearTimeout(urlSyncTimeout.current);

    urlSyncTimeout.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedDestinations.length > 0)
        params.set("destination", selectedDestinations.join(","));
      if (effectivePriceValue[0] > priceRange.min)
        params.set("minPrice", String(effectivePriceValue[0]));
      if (effectivePriceValue[1] < priceRange.max)
        params.set("maxPrice", String(effectivePriceValue[1]));
      if (selectedDuration) params.set("duration", selectedDuration);
      if (sort !== "popular") params.set("sort", sort);

      const qs = params.toString();
      router.push(qs ? `/packages?${qs}` : "/packages", { scroll: false });
    }, 400);

    return () => {
      if (urlSyncTimeout.current) clearTimeout(urlSyncTimeout.current);
    };
  }, [
    selectedDestinations,
    selectedDuration,
    effectivePriceValue,
    priceRange.min,
    priceRange.max,
    sort,
    initializedFromUrl,
    router,
  ]);

  const durationBucket = DURATION_BUCKETS.find(
    (b) => b.key === selectedDuration,
  );

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesError,
  } = usePackages({
    destination:
      selectedDestinations.length > 0
        ? selectedDestinations.join(",")
        : undefined,
    priceMin:
      effectivePriceValue[0] > priceRange.min
        ? effectivePriceValue[0]
        : undefined,
    priceMax:
      effectivePriceValue[1] < priceRange.max
        ? effectivePriceValue[1]
        : undefined,
    durationMin: durationBucket?.min,
    durationMax: durationBucket?.max,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sort: SORT_TO_API[sort as SortValue] ?? "featured",
    limit: 50,
  });

  const allPackages = packagesData?.data ?? [];

  const allTags = useMemo(
    () => Array.from(new Set(allPackages.flatMap((p) => p.tags))).sort(),
    [allPackages],
  );

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function handleReset() {
    setSelectedDestinations([]);
    setSelectedDuration(null);
    setPriceValue([priceRange.min, priceRange.max]);
    setSelectedTags([]);
  }

  const filterPanelProps: FilterPanelProps = {
    destinations,
    allTags,
    selectedDestinations,
    selectedDuration,
    priceRange,
    priceValue: effectivePriceValue,
    selectedTags,
    onToggleDestination: (slug) =>
      setSelectedDestinations((prev) => toggle(prev, slug)),
    onToggleDuration: (key) =>
      setSelectedDuration((prev) => (prev === key ? null : key)),
    onPriceChange: setPriceValue,
    onToggleTag: (tag) => setSelectedTags((prev) => toggle(prev, tag)),
    onReset: handleReset,
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-(--color-navy-surface) border-b border-(--color-navy-border) py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs font-body font-medium tracking-widest uppercase text-(--color-gold) mb-3">
            Explore
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-3">
            All Packages
          </h1>
          <p className="text-sm font-body text-(--color-text-secondary) max-w-lg">
            Curated escapes for every kind of traveller — from beach retreats to
            mountain epics.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
            <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6">
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet
                  open={mobileFilterOpen}
                  onOpenChange={setMobileFilterOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden border-(--color-navy-border) bg-(--color-navy-surface) text-(--color-white-muted) hover:text-white hover:bg-(--color-navy-border) gap-2"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 bg-(--color-navy-surface) border-r border-(--color-navy-border) overflow-y-auto"
                  >
                    <SheetHeader className="mb-6">
                      <SheetTitle className="font-display text-xl text-white">
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <FilterPanel
                      {...filterPanelProps}
                      onReset={() => {
                        handleReset();
                        setMobileFilterOpen(false);
                      }}
                    />
                  </SheetContent>
                </Sheet>

                <span className="text-sm font-body text-(--color-text-secondary)">
                  {packagesLoading
                    ? "Loading…"
                    : `${allPackages.length} packages found`}
                </span>
              </div>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-48 bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white-muted) text-sm focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-(--color-white-muted) focus:bg-(--color-navy-border) focus:text-white cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            {packagesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PackageCardSkeleton key={i} />
                ))}
              </div>
            ) : allPackages.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No packages found"
                description="Try adjusting your filters to discover more travel options."
                action={{ label: "Reset Filters", onClick: handleReset }}
              />
            ) : packagesError ? (
              <EmptyState
                icon={PackageSearch}
                title="Unable to load packages"
                description="We're having trouble fetching packages right now. Please try again in a moment."
                action={{
                  label: "Retry",
                  onClick: () => window.location.reload(),
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} variant="default" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PackagesPageClient() {
  return (
    <Suspense fallback={null}>
      <PackagesContent />
    </Suspense>
  );
}
