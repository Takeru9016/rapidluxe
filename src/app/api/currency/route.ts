import { NextResponse } from "next/server";

export const revalidate = 86400;

interface ERAPIResponse {
  result?: string;
  rates?: Record<string, number>;
}

export interface CurrencyRates {
  USD: number;
  GBP: number;
  AED: number;
  EUR: number;
}

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error("Exchange rate fetch failed");

    const json = (await res.json()) as ERAPIResponse;

    if (json.result !== "success" || !json.rates) {
      throw new Error("Invalid exchange rate response");
    }

    const rates: CurrencyRates = {
      USD: json.rates["USD"] ?? 0.012,
      GBP: json.rates["GBP"] ?? 0.0094,
      AED: json.rates["AED"] ?? 0.044,
      EUR: json.rates["EUR"] ?? 0.011,
    };

    return NextResponse.json({ data: rates });
  } catch {
    // Fallback rates (approximate as of mid-2026)
    return NextResponse.json({
      data: { USD: 0.012, GBP: 0.0094, AED: 0.044, EUR: 0.011 },
    });
  }
}
