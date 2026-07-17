import type { CrowdLevel, VisitRecommendation } from "@/types/destination";

export function describeWeather(temp: number, rainfall: number): string {
  const tempLabel =
    temp >= 30 ? "Hot" : temp >= 22 ? "Warm" : temp >= 14 ? "Mild" : "Cool";
  const rainLabel =
    rainfall < 40
      ? "dry"
      : rainfall < 100
        ? "light rain"
        : rainfall < 180
          ? "rainy"
          : "heavy rain";
  return `${tempLabel}, ${Math.round(temp)}°C — ${rainLabel}`;
}

// Rating (1-5) reflects weather favorability, not literal tourist volume.
// A comfortable, dry month maps to LOW crowd (favorable) and a harsh month to
// HIGH (unfavorable) so the existing teal/gold/coral badge colors stay meaningful.
export function deriveCrowdLevel(rating: number): CrowdLevel {
  if (rating >= 4) return "LOW";
  if (rating === 3) return "MEDIUM";
  return "HIGH";
}

export function deriveRecommendation(
  crowdLevel: CrowdLevel,
  rating: number,
): VisitRecommendation {
  if (crowdLevel === "HIGH" || rating < 3) return "Not recommended";
  return "Recommended";
}
