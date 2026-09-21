"use client";

import { useEffect } from "react";

export function RecentlyViewed({ id }: { id: string }) {
  useEffect(() => {
    const key = "und_recent";
    const prev = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(next));
  }, [id]);
  return null;
}
