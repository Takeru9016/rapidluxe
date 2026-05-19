"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculate(expiresAt: Date): TimeLeft {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function useCountdown(expiresAt: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculate(expiresAt),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculate(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}
