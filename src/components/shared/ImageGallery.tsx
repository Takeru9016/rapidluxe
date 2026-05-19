"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  priority?: boolean;
  className?: string;
}

export function ImageGallery({
  images,
  alt,
  priority = false,
  className,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  function handleThumbnailClick(i: number) {
    if (i === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(i);
      setFading(false);
    }, 150);
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Main image */}
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — image ${activeIndex + 1}`}
          fill
          priority={priority && activeIndex === 0}
          className={cn(
            "object-cover transition-opacity duration-300",
            fading ? "opacity-0" : "opacity-100",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
        <button
          aria-label="Expand image"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          <Expand size={16} />
        </button>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbnailClick(i)}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                i === activeIndex ?
                  "ring-2 ring-(--color-gold) ring-offset-2 ring-offset-(--color-navy) opacity-100"
                : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-(--color-gold)/50",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
