import Link from "next/link";
import { Camera, Globe, Video, AtSign } from "lucide-react";

import { NewsletterForm } from "@/components/layout/NewsletterForm";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Partnerships", href: "/partnerships" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  { Icon: Camera, label: "Instagram", href: "https://instagram.com" },
  { Icon: Globe, label: "Facebook", href: "https://facebook.com" },
  { Icon: Video, label: "YouTube", href: "https://youtube.com" },
  { Icon: AtSign, label: "Twitter", href: "https://twitter.com" },
];

const paymentMethods = ["UPI", "Visa", "Mastercard", "RuPay"];

const footerLinkClass =
  "text-sm font-sans text-[var(--color-white-muted)] hover:text-[var(--color-gold)] py-1 block transition-colors";

export function Footer() {
  return (
    <footer className="bg-(--color-navy-surface) border-t border-(--color-navy-border)">
      {/* Top section */}
      <div className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Brand */}
          <div>
            <Link href="/">
              <span className="font-display text-2xl">
                <span style={{ color: "var(--color-gold)" }}>Rapid</span>
                <span style={{ color: "var(--color-white)" }}>Luxe</span>
              </span>
            </Link>
            <p className="font-sans text-sm text-(--color-white-muted) mt-3 max-w-xs">
              Luxury Travel. Curated for India.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Company */}
          <div>
            <h3 className="font-sans font-semibold text-white text-sm mb-4">
              Company
            </h3>
            <nav className="flex flex-col">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={footerLinkClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Support */}
          <div>
            <h3 className="font-sans font-semibold text-white text-sm mb-4">
              Support
            </h3>
            <nav className="flex flex-col">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={footerLinkClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h3 className="font-sans font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-(--color-white-muted) mb-4 font-sans">
              Travel inspiration, deals, and expert tips.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-(--color-navy-border)">
        <div className="py-6 max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-(--color-text-secondary) font-sans">
            © 2026 RapidLuxe. All rights reserved.
          </p>
          <div className="flex items-center gap-3 opacity-60">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="h-6 px-2 flex items-center border border-(--color-navy-border) rounded text-xs font-mono text-(--color-white-muted)"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
