"use client";

import Image from "next/image";

interface AuthImagePanelProps {
  side: "left" | "right";
  tagline: string;
  stats: { label: string; sub: string }[];
  blobTagline: string;
}

export function AuthImagePanel({
  side,
  tagline,
  stats,
  blobTagline,
}: AuthImagePanelProps) {
  const blobRadius =
    side === "right" ? "2rem 0.75rem 2rem 0.75rem" : "0.75rem 2rem 0.75rem 2rem";
  const blobPosition =
    side === "right"
      ? "absolute top-10 right-8 max-w-[280px] p-6 text-right"
      : "absolute top-10 left-8 max-w-[280px] p-6";
  const gradient =
    side === "right"
      ? "absolute inset-0 bg-linear-to-br from-[#0B0F1A]/75 via-[#0B0F1A]/30 to-[#0B0F1A]/65"
      : "absolute inset-0 bg-linear-to-bl from-[#0B0F1A]/75 via-[#0B0F1A]/30 to-[#0B0F1A]/65";

  return (
    <div className="relative hidden lg:block overflow-hidden">
      <Image
        src="/auth-hero.png"
        alt="Luxury travel destination — RapidLuxe"
        fill
        sizes="50vw"
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay */}
      <div className={gradient} />

      {/* Blob info card */}
      <div
        className={blobPosition}
        style={{
          background: "rgba(11,15,26,0.68)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: blobRadius,
          border: "1px solid rgba(201,168,76,0.18)",
        }}
      >
        <p className="font-(--font-display) text-xl leading-snug text-[#FAF9F6]">
          {blobTagline.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < blobTagline.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* Bottom stats card */}
      <div className="absolute bottom-10 left-8 right-8">
        <div
          className="flex flex-col gap-3 p-6"
          style={{
            background: "rgba(11,15,26,0.62)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          <p className="font-(--font-display) text-[#C9A84C] text-lg italic">
            {tagline}
          </p>
          <div className="flex items-center gap-6">
            {stats.map(({ label, sub }) => (
              <div key={sub} className="flex flex-col">
                <span className="font-(--font-mono) text-[#C9A84C] text-base">
                  {label}
                </span>
                <span className="font-(--font-body) text-[#9CA3AF] text-xs">
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
