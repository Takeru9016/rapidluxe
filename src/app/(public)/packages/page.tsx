"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, PackageSearch } from "lucide-react";

import { dummyPackages } from "@/lib/dummy/packages";
import { dummyDestinations } from "@/lib/dummy/destinations";
import { formatPrice } from "@/lib/utils";

import { useSearchStore } from "@/store/searchStore";

import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_BUDGET = 500000;

const DURATION_OPTIONS = [
  { label: "Up to 5N", test: (n: number) => n <= 5 },
  { label: "6–9N", test: (n: number) => n >= 6 && n <= 9 },
  { label: "10–14N", test: (n: number) => n >= 10 && n <= 14 },
  { label: "15N+", test: (n: number) => n >= 15 },
] as const;

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "duration", label: "Duration" },
] as const;

const DUMMY_RATINGS: Record<string, number> = {
  "pkg-bali": 4.8,
  "pkg-maldives": 4.9,
  "pkg-kerala": 4.6,
  "pkg-switzerland": 4.7,
  "pkg-santorini": 4.8,
  "pkg-dubai": 4.5,
  "pkg-rajasthan": 4.7,
  "pkg-singapore": 4.6,
};

const ALL_TAGS = Array.from(
  new Set(dummyPackages.flatMap((p) => p.tags)),
).sort();

// ─── FilterPanel ──────────────────────────────────────────────────────────────

interface FilterPanelProps {
  selectedDestinations: string[];
  selectedDurations: string[];
  budgetMax: number;
  selectedTags: string[];
  onToggleDestination: (id: string) => void;
  onToggleDuration: (label: string) => void;
  onBudgetChange: (val: number) => void;
  onToggleTag: (tag: string) => void;
  onReset: () => void;
}

function FilterPanel({
  selectedDestinations,
  selectedDurations,
  budgetMax,
  selectedTags,
  onToggleDestination,
  onToggleDuration,
  onBudgetChange,
  onToggleTag,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedDestinations.length > 0 ||
    selectedDurations.length > 0 ||
    budgetMax < MAX_BUDGET ||
    selectedTags.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-(--color-white)">
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
          {dummyDestinations.map((dest) => (
            <label
              key={dest.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDestinations.includes(dest.id)}
                onChange={() => onToggleDestination(dest.id)}
                className="w-4 h-4 rounded border border-(--color-navy-border) cursor-pointer accent-(--color-gold) shrink-0"
              />
              <span className="text-sm text-(--color-white-muted) group-hover:text-(--color-white) transition-colors">
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
          {DURATION_OPTIONS.map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDurations.includes(opt.label)}
                onChange={() => onToggleDuration(opt.label)}
                className="w-4 h-4 rounded border border-(--color-navy-border) cursor-pointer accent-(--color-gold) shrink-0"
              />
              <span className="text-sm text-(--color-white-muted) group-hover:text-(--color-white) transition-colors font-mono">
                {opt.label}
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
          <span className="text-(--color-gold)">{formatPrice(0)}</span>
          <span className="text-(--color-gold)">{formatPrice(budgetMax)}</span>
        </div>
        <Slider
          value={[budgetMax]}
          min={0}
          max={MAX_BUDGET}
          step={5000}
          onValueChange={(val) => onBudgetChange(val[0])}
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
          {ALL_TAGS.map((tag) => (
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
              <span className="text-sm text-(--color-white-muted) group-hover:text-(--color-white) transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PackagesPage ─────────────────────────────────────────────────────────────

export default function PackagesPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [budgetMax, setBudgetMax] = useState(MAX_BUDGET);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { sort, setSort } = useSearchStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function handleReset() {
    setSelectedDestinations([]);
    setSelectedDurations([]);
    setBudgetMax(MAX_BUDGET);
    setSelectedTags([]);
  }

  const filteredPackages = useMemo(() => {
    let result = dummyPackages.filter((p) => p.status === "PUBLISHED");

    if (selectedDestinations.length > 0) {
      result = result.filter((p) =>
        selectedDestinations.includes(p.destinationId),
      );
    }

    if (selectedDurations.length > 0) {
      result = result.filter((p) =>
        selectedDurations.some((label) => {
          const opt = DURATION_OPTIONS.find((o) => o.label === label);
          return opt ? opt.test(p.durationNights) : false;
        }),
      );
    }

    result = result.filter((p) => p.pricePerPerson <= budgetMax);

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((t) => p.tags.includes(t)),
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
        break;
      case "rating":
        sorted.sort(
          (a, b) => (DUMMY_RATINGS[b.id] ?? 4.5) - (DUMMY_RATINGS[a.id] ?? 4.5),
        );
        break;
      case "duration":
        sorted.sort((a, b) => a.durationNights - b.durationNights);
        break;
      default:
        sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return sorted;
  }, [selectedDestinations, selectedDurations, budgetMax, selectedTags, sort]);

  const filterPanelProps: FilterPanelProps = {
    selectedDestinations,
    selectedDurations,
    budgetMax,
    selectedTags,
    onToggleDestination: (id) =>
      setSelectedDestinations((prev) => toggle(prev, id)),
    onToggleDuration: (label) =>
      setSelectedDurations((prev) => toggle(prev, label)),
    onBudgetChange: setBudgetMax,
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
          <h1 className="font-display text-4xl md:text-5xl font-light text-(--color-white) mb-3">
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
                      className="lg:hidden border-(--color-navy-border) bg-(--color-navy-surface) text-(--color-white-muted) hover:text-(--color-white) hover:bg-(--color-navy-border) gap-2"
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
                      <SheetTitle className="font-display text-xl text-(--color-white)">
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
                  {mounted ? filteredPackages.length : dummyPackages.length}{" "}
                  packages found
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
                      className="text-(--color-white-muted) focus:bg-(--color-navy-border) focus:text-(--color-white) cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            {!mounted ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PackageCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No packages found"
                description="Try adjusting your filters to discover more travel options."
                action={{ label: "Reset Filters", onClick: handleReset }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
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
