"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold) focus-visible:border-(--color-gold)"
      />
      <Button
        onClick={() => console.log("newsletter:", email)}
        className="w-full mt-2 bg-(--color-gold) text-[#0B0F1A] font-sans font-medium hover:bg-(--color-gold)/90"
      >
        Subscribe
      </Button>
    </div>
  );
}
