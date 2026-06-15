"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Grid2x2, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DetailPhotoGridProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

export function DetailPhotoGrid({
  images,
  alt,
  priority = false,
}: DetailPhotoGridProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const all =
    images.length >= 5
      ? images
      : [
          ...images,
          ...Array.from(
            { length: 5 - images.length },
            (_, i) => images[i % images.length],
          ),
        ];

  const thumbs = all.slice(1, 5);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + all.length) % all.length);
  }, [all.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % all.length);
  }, [all.length]);

  const close = useCallback(() => setGalleryOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!galleryOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen, prev, next, close]);

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:flex gap-2 h-[480px]">
        <div
          className="relative flex-3 overflow-hidden rounded-l-xl cursor-pointer"
          onClick={() => {
            setActiveIndex(0);
            setGalleryOpen(true);
          }}
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
              onClick={() => {
                setActiveIndex(i + 1);
                setGalleryOpen(true);
              }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(0);
                      setGalleryOpen(true);
                    }}
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
          onClick={() => {
            setActiveIndex(0);
            setGalleryOpen(true);
          }}
        >
          <Image
            src={all[0]}
            alt={`${alt} — main`}
            fill
            className="object-cover"
            priority={priority}
          />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {all.slice(1).map((url, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
              onClick={() => {
                setActiveIndex(i + 1);
                setGalleryOpen(true);
              }}
            >
              <Image
                src={url}
                alt={`${alt} — photo ${i + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <button
          className="mt-2 flex items-center gap-1.5 text-sm font-sans text-(--color-text-secondary) hover:text-white transition-colors"
          onClick={() => {
            setActiveIndex(0);
            setGalleryOpen(true);
          }}
        >
          <Grid2x2 size={14} />
          View all photos
        </button>
      </div>

      {/* ── Fullscreen lightbox ── */}
      {galleryOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
          >
            {/* Close + counter — top right */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              <span className="font-mono text-sm text-white/60">
                {activeIndex + 1} / {all.length}
              </span>
              <button
                onClick={close}
                aria-label="Close gallery"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image area — clicking backdrop closes */}
            <div
              className="flex-1 flex items-center justify-center relative px-16"
              onClick={close}
            >
              <div
                className="flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={all[activeIndex]}
                  alt={`${alt} — photo ${activeIndex + 1}`}
                  width={1400}
                  height={900}
                  className="max-h-[80vh] w-auto object-contain"
                  priority
                />
              </div>

              {/* Prev arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails row */}
            <div className="pb-6 flex justify-center">
              <div className="flex gap-2 overflow-x-auto px-4">
                {all.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                      i === activeIndex
                        ? "ring-2 ring-[#C9A84C]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${alt} — thumb ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
