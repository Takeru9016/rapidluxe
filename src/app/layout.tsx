import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  JetBrains_Mono,
  Geist,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import "./globals.css";

import { cn } from "@/lib/utils";

import { ThemeProvider, Navbar, MobileMenu, Footer } from "@/components";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RapidLuxe — Luxury Travel, Curated for India",
    template: "%s | RapidLuxe",
  },
  description:
    "Discover handpicked luxury travel packages. Curated for discerning Indian travelers.",
  keywords: [
    "luxury travel",
    "travel packages",
    "India travel agency",
    "holiday packages",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RapidLuxe",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://localhost:3000'),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        cormorant.variable,
        dmSans.variable,
        jetbrainsMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className={dmSans.className}>
        <ThemeProvider>
          <ClerkProvider>
            <Navbar />
            <MobileMenu />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
          </ClerkProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
