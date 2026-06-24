"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-(--color-gold)/5 via-transparent to-(--color-teal)/5 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <Mail
          size={32}
          className="mx-auto mb-4"
          style={{ color: "var(--color-gold)" }}
        />

        <h2 className="font-(family-name:--font-display) text-4xl text-white">
          Travel Inspiration, Direct to Your Inbox
        </h2>

        <p
          className="font-(family-name:--font-body) text-base mt-3"
          style={{ color: "var(--color-white-muted)" }}
        >
          Exclusive deals, destination guides, and insider tips. Every week.
        </p>

        {/* Form */}
        <div className="mt-8 max-w-md mx-auto">
          <div
            className="flex gap-0 rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--color-navy-border)" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 font-(family-name:--font-body) text-white text-sm outline-none border-none"
              style={{
                backgroundColor: "var(--color-navy-surface)",
                color: "var(--color-white)",
              }}
            />
            <button
              onClick={() => console.log(email)}
              className="px-6 py-3 font-(family-name:--font-body) font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: "var(--color-gold)",
                color: "var(--color-navy)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-gold-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-gold)";
              }}
            >
              Subscribe
            </button>
          </div>

          <p
            className="mt-3 text-xs font-(family-name:--font-body)"
            style={{ color: "var(--color-text-secondary)" }}
          >
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
