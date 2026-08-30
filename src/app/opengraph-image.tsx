import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1B2A41",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 300,
          color: "#F9A826",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        RapidLuxe
      </div>

      <div
        style={{
          width: 200,
          height: 1,
          backgroundColor: "#F9A826",
          marginTop: 32,
          marginBottom: 32,
          opacity: 0.6,
        }}
      />

      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: "#D1CBC0",
          letterSpacing: "0.08em",
        }}
      >
        Luxury Travel, Curated for India
      </div>
    </div>,
    { ...size },
  );
}
