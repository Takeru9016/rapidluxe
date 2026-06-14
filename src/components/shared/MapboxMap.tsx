"use client";

import { useEffect, useRef } from "react";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";

interface Marker {
  lat: number;
  lng: number;
  label?: string;
}

interface MapboxMapProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  markers?: Marker[];
  className?: string;
}

export function MapboxMap({
  lat,
  lng,
  zoom = 10,
  markers,
  className,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);

  useEffect(() => {
    if (!lat || !lng || !containerRef.current) return;

    let map: import("mapbox-gl").Map;

    import("mapbox-gl").then((mapboxgl) => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token || !containerRef.current) return;

      mapboxgl.default.accessToken = token;

      map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom,
        attributionControl: false,
      });

      map.addControl(
        new mapboxgl.default.AttributionControl({ compact: true }),
        "bottom-right",
      );

      new mapboxgl.default.Marker({ color: "#C9A84C" })
        .setLngLat([lng, lat])
        .addTo(map);

      if (markers) {
        markers.forEach(({ lat: mLat, lng: mLng, label }) => {
          const el = document.createElement("div");
          el.className =
            "w-3 h-3 rounded-full bg-[#C9A84C] border-2 border-white shadow";
          const m = new mapboxgl.default.Marker({ element: el }).setLngLat([
            mLng,
            mLat,
          ]);
          if (label) {
            m.setPopup(
              new mapboxgl.default.Popup({ offset: 12 }).setText(label),
            );
          }
          m.addTo(map);
        });
      }

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom, markers]);

  if (!lat || !lng) {
    return (
      <div
        className={cn(
          "rounded-xl border border-(--color-navy-border) bg-(--color-navy-surface) flex flex-col items-center justify-center gap-3",
          className,
        )}
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,transparent,transparent 39px,var(--color-navy-border) 39px,var(--color-navy-border) 40px),
            repeating-linear-gradient(90deg,transparent,transparent 39px,var(--color-navy-border) 39px,var(--color-navy-border) 40px)
          `,
        }}
      >
        <Map size={32} className="text-(--color-gold)" />
        <p className="font-sans text-xs text-(--color-text-secondary)">
          Map unavailable
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-xl overflow-hidden border border-(--color-navy-border)",
        className,
      )}
    />
  );
}
