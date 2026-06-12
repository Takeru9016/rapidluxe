"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { MobileMenu } from "./MobileMenu";
import { Navbar } from "./Navbar";

const CHROME_FREE_PREFIXES = ["/pay/"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const chromeFree = CHROME_FREE_PREFIXES.some((p) => pathname.startsWith(p));

  if (chromeFree) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <MobileMenu />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
