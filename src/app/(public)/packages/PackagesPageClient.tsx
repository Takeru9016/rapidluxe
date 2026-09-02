"use client";

import { Check, PackageSearch, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  type ApiPackage,
  type PackagesQuery,
  usePackages,
} from "@/hooks/api/usePackages";
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
  { value: "popular", label: "Curated" },
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
const PAGE_SIZE = 12;

// ─── DestinationChipRow ───────────────────────────────────────────────────────

interface DestinationChipRowProps {
  destinations: PackageFilterDestination[];
  selected: string[];
  onToggle: (slug: string) => void;
  onClear: () => void;
}

function DestinationChipRow({
  destinations,
  selected,
  onToggle,
  onClear,
}: DestinationChipRowProps) {
  if (destinations.length === 0) return null;

  return (
    <fieldset className="flex min-w-0 gap-2 overflow-x-auto md:flex-wrap md:overflow-visible pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden border-0 p-0 m-0">
      <legend className="sr-only">Filter by destination</legend>
      <Button
        type="button"
        variant={selected.length === 0 ? "gold" : "outline-gold"}
        size="sm"
        aria-pressed={selected.length === 0}
        onClick={onClear}
        className="shrink-0 rounded-full h-auto px-4 py-2 font-sans gap-1.5"
      >
        {selected.length === 0 && <Check className="size-3.5" />}
        All Destinations
      </Button>
      {destinations.map((dest) => {
        const isSelected = selected.includes(dest.slug);
        return (
          <Button
            key={dest.id}
            type="button"
            variant={isSelected ? "gold" : "outline-gold"}
            size="sm"
            aria-pressed={isSelected}
            onClick={() => onToggle(dest.slug)}
            className="shrink-0 rounded-full h-auto px-4 py-2 font-sans gap-1.5"
          >
            {isSelected && <Check className="size-3.5" />}
            {dest.name}
          </Button>
        );
      })}
    </fieldset>
  );
}

// ─── FilterPanel (secondary refinement: duration / budget / tags) ────────────

interface FilterPanelProps {
  allTags: string[];
  selectedDuration: string | null;
  priceRange: { min: number; max: number };
  priceValue: [number, number];
  selectedTags: string[];
  onToggleDuration: (key: string) => void;
  onPriceChange: (val: [number, number]) => void;
  onToggleTag: (tag: string) => void;
  onReset: () => void;
}

function FilterPanel({
  allTags,
  selectedDuration,
  priceRange,
  priceValue,
  selectedTags,
  onToggleDuration,
  onPriceChange,
  onToggleTag,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedDuration !== null ||
    priceValue[0] > priceRange.min ||
    priceValue[1] < priceRange.max ||
    selectedTags.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-white">
          Refine
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
              <span className="text-sm text-(--color-white-muted) group-hover:text-white transition-colors font-sans">
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

  const [page, setPage] = useState(1);
  const [loadedPackages, setLoadedPackages] = useState<ApiPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { sort, setSort } = useSearchStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: filtersData } = usePackageFilters();
  const destinations = filtersData?.destinations ?? [];
  const priceRange = filtersData?.priceRange ?? FALLBACK_PRICE_RANGE;
  const catalogueTags = filtersData?.tags ?? [];

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

  // Applied price bounds — undefined when they match the full range, so a
  // fallback-to-real priceRange swap on load isn't mistaken for a user filter change.
  const priceMinApplied =
    effectivePriceValue[0] > priceRange.min
      ? effectivePriceValue[0]
      : undefined;
  const priceMaxApplied =
    effectivePriceValue[1] < priceRange.max
      ? effectivePriceValue[1]
      : undefined;

  // Reset pagination whenever the effective filter/sort combination changes.
  const filterSignature = [
    selectedDestinations.slice().sort().join(","),
    selectedDuration,
    priceMinApplied,
    priceMaxApplied,
    selectedTags.slice().sort().join(","),
    sort,
  ].join("|");
  const prevSignatureRef = useRef(filterSignature);

  useEffect(() => {
    if (prevSignatureRef.current === filterSignature) return;
    prevSignatureRef.current = filterSignature;
    setPage(1);
    setLoadedPackages([]);
  }, [filterSignature]);

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesError,
  } = usePackages({
    destination:
      selectedDestinations.length > 0
        ? selectedDestinations.join(",")
        : undefined,
    priceMin: priceMinApplied,
    priceMax: priceMaxApplied,
    durationMin: durationBucket?.min,
    durationMax: durationBucket?.max,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sort: SORT_TO_API[sort as SortValue] ?? "featured",
    page,
    limit: PAGE_SIZE,
  });

  useEffect(() => {
    if (!packagesData) return;
    setLoadedPackages((prev) =>
      page === 1 ? packagesData.data : [...prev, ...packagesData.data],
    );
    setTotal(packagesData.pagination.total);
    setTotalPages(packagesData.pagination.totalPages);
  }, [packagesData, page]);

  const hasMore = page < totalPages;
  const isInitialLoad = packagesLoading && loadedPackages.length === 0;

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function handleReset() {
    setSelectedDestinations([]);
    setSelectedDuration(null);
    setPriceValue([priceRange.min, priceRange.max]);
    setSelectedTags([]);
  }

  function handleResetSecondary() {
    setSelectedDuration(null);
    setPriceValue([priceRange.min, priceRange.max]);
    setSelectedTags([]);
  }

  const activeSecondaryCount =
    (selectedDuration !== null ? 1 : 0) +
    (effectivePriceValue[0] > priceRange.min ||
    effectivePriceValue[1] < priceRange.max
      ? 1
      : 0) +
    (selectedTags.length > 0 ? 1 : 0);

  const filterPanelProps: FilterPanelProps = {
    allTags: catalogueTags,
    selectedDuration,
    priceRange,
    priceValue: effectivePriceValue,
    selectedTags,
    onToggleDuration: (key) =>
      setSelectedDuration((prev) => (prev === key ? null : key)),
    onPriceChange: setPriceValue,
    onToggleTag: (tag) => setSelectedTags((prev) => toggle(prev, tag)),
    onReset: handleResetSecondary,
  };

  return (
    <>
      {/* Editorial intro */}
      <div className="py-14 md:py-20 px-4 text-center">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-(--color-gold) mb-3">
          Explore
        </p>
        <h1
          id="journeys-heading"
          className="font-display text-4xl md:text-5xl font-light text-white mb-4"
        >
          Journeys
        </h1>
        <p className="text-sm md:text-base font-body text-(--color-text-secondary) max-w-xl mx-auto">
          Bespoke journeys, handpicked by experts — curated for how they make
          you feel, not just where they take you.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 md:pb-16">
        {/* Destination discovery */}
        <DestinationChipRow
          destinations={destinations}
          selected={selectedDestinations}
          onToggle={(slug) =>
            setSelectedDestinations((prev) => toggle(prev, slug))
          }
          onClear={() => setSelectedDestinations([])}
        />

        {/* Sort + result count + Refine */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-8 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Desktop Refine */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex border-(--color-navy-border) bg-(--color-navy-surface) text-(--color-white-muted) hover:text-white hover:bg-(--color-navy-border) gap-2"
                >
                  <SlidersHorizontal className="size-4" />
                  Refine
                  {activeSecondaryCount > 0 && (
                    <span className="inline-flex items-center justify-center size-4 rounded-full bg-(--color-gold) text-(--color-navy) text-[10px] font-bold">
                      {activeSecondaryCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-80 max-h-[70vh] overflow-y-auto bg-(--color-navy-surface) border-(--color-navy-border) p-5"
              >
                <FilterPanel {...filterPanelProps} />
              </PopoverContent>
            </Popover>

            {/* Mobile Refine */}
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden border-(--color-navy-border) bg-(--color-navy-surface) text-(--color-white-muted) hover:text-white hover:bg-(--color-navy-border) gap-2"
                >
                  <SlidersHorizontal className="size-4" />
                  Refine
                  {activeSecondaryCount > 0 && (
                    <span className="inline-flex items-center justify-center size-4 rounded-full bg-(--color-gold) text-(--color-navy) text-[10px] font-bold">
                      {activeSecondaryCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 max-w-[85vw] bg-(--color-navy-surface) border-r border-(--color-navy-border) overflow-y-auto"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-display text-xl text-white">
                    Refine
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <FilterPanel
                    {...filterPanelProps}
                    onReset={() => {
                      handleResetSecondary();
                      setMobileFilterOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="text-sm font-body text-(--color-text-secondary)"
            >
              {isInitialLoad
                ? "Loading Journeys…"
                : `${total} ${total === 1 ? "Journey" : "Journeys"} found`}
            </span>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-48 bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white-muted) text-sm focus:ring-0 focus:ring-offset-0">
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
        {isInitialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : packagesError && loadedPackages.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Unable to load Journeys"
            description="We're having trouble fetching Journeys right now. Please try again in a moment."
            action={{
              label: "Retry",
              onClick: () => window.location.reload(),
            }}
          />
        ) : loadedPackages.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No Journeys found"
            description="Try adjusting your filters to discover more Journeys."
            action={{ label: "Reset Filters", onClick: handleReset }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loadedPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} variant="default" />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline-gold"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={packagesLoading}
                  className="font-sans px-8"
                >
                  {packagesLoading ? "Loading…" : "Load More Journeys"}
                </Button>
              </div>
            )}
          </>
        )}
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
