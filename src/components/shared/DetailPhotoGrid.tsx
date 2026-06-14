"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid2x2, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DetailPhotoGridProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

export function DetailPhotoGrid({ images, alt, priority = false }: DetailPhotoGridProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pad to 5 images if fewer provided
  const all =
    images.length >= 5
      ? images
      : [...images, ...Array.from({ length: 5 - images.length }, (_, i) => images[i % images.length])];

  const thumbs = all.slice(1, 5);

  function prev() {
    setActiveIndex((i) => (i - 1 + all.length) % all.length);
  }
  function next() {
    setActiveIndex((i) => (i + 1) % all.length);
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:flex gap-2 h-[480px]">
        <div
          className="relative flex-3 overflow-hidden rounded-l-xl cursor-pointer"
          onClick={() => { setActiveIndex(0); setGalleryOpen(true); }}
        >
          <Image
            src={all[0]}
            alt={`${alt} — main`}
            fill
            className="object-cover hover:brightness-110 transition-all duration-300"
            priority={priority}
          />
        </div>

        <div className="flex-2 grid grid-cols-2 gap-2">
          {thumbs.map((url, i) => (
            <div
              key={i}
              className={`relative overflow-hidden cursor-pointer${i === 0 ? " rounded-tr-xl" : ""}${i === 3 ? " rounded-br-xl" : ""}`}
              onClick={() => { setActiveIndex(i + 1); setGalleryOpen(true); }}
            >
              <Image
                src={url}
                alt={`${alt} — photo ${i + 2}`}
                fill
                className="object-cover hover:brightness-110 transition-all duration-300"
              />
              {i === 3 && (
                <div className="absolute bottom-3 right-3">
                  <button
                    className="flex items-center gap-1.5 bg-(--color-navy-surface)/90 backdrop-blur-sm border border-(--color-navy-border) text-white text-sm px-3 py-1.5 rounded-lg hover:bg-(--color-navy-surface) transition-colors font-sans"
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(0); setGalleryOpen(true); }}
                  >
                    <Grid2x2 size={14} />
                    View gallery
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden">
        <div
          className="relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer"
          onClick={() => { setActiveIndex(0); setGalleryOpen(true); }}
        >
          <Image src={all[0]} alt={`${alt} — main`} fill className="object-cover" priority={priority} />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {all.slice(1).map((url, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
              onClick={() => { setActiveIndex(i + 1); setGalleryOpen(true); }}
            >
              <Image src={url} alt={`${alt} — photo ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
        <button
          className="mt-2 flex items-center gap-1.5 text-sm font-sans text-(--color-text-secondary) hover:text-white transition-colors"
          onClick={() => { setActiveIndex(0); setGalleryOpen(true); }}
        >
          <Grid2x2 size={14} />
          View all photos
        </button>
      </div>

      {/* ── Gallery Dialog ── */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl bg-(--color-navy-surface) border-(--color-navy-border) p-6">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden">
            <Image
              src={all[activeIndex]}
              alt={`${alt} — photo ${activeIndex + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-(--color-navy-surface)/80 backdrop-blur-sm border border-(--color-navy-border) text-white hover:bg-(--color-navy-surface) transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-(--color-navy-surface)/80 backdrop-blur-sm border border-(--color-navy-border) text-white hover:bg-(--color-navy-surface) transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {all.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all${
                    i === activeIndex ? " ring-2 ring-(--color-gold)" : " opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={url} alt={`${alt} — thumb ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <span className="font-mono text-sm text-(--color-text-secondary) shrink-0 ml-4">
              {activeIndex + 1} / {all.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
