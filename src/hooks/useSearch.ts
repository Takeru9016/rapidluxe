"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchStore } from "@/store/searchStore";

export function useSearch(initialQuery?: string) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery ?? "");
  const storeSetQuery = useSearchStore((s) => s.setQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    storeSetQuery(debouncedQuery);
  }, [debouncedQuery, storeSetQuery]);

  return { query, setQuery, debouncedQuery };
}
