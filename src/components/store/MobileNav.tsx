"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-full p-2 hover:bg-white"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[var(--season-bg)] p-6">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-full p-2">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-5 font-display text-3xl">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
