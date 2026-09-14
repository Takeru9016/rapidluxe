"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PILL_BUTTON_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm font-sans text-(--color-gold)">
        ✓ You&apos;re on the list!
      </p>
    );
  }

  return (
    <div>
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
        className="h-11 rounded-full bg-white/5 border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold) focus-visible:border-(--color-gold)"
      />
      <Button
        variant="gold"
        onClick={handleSubscribe}
        disabled={loading}
        className={cn(PILL_BUTTON_CLASS, "w-full mt-2 font-sans font-medium")}
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </Button>
    </div>
  );
}
