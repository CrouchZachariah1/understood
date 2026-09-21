"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images }: { images: { url: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active] ?? images[0];
  if (!current) return <div className="aspect-square rounded-3xl bg-[var(--season-muted)]" />;

  return (
    <div>
      <button
        type="button"
        className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-white"
        onClick={() => setZoom(true)}
        aria-label="Zoom image"
      >
        <Image src={current.url} alt={current.alt} fill quality={90} className="object-contain p-6" sizes="(max-width:1024px) 100vw, 50vw" />
      </button>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-2xl ${i === active ? "ring-2 ring-[var(--season-primary)]" : ""}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {zoom ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setZoom(false)}>
          <div className="relative h-[90vh] w-full max-w-3xl">
            <Image src={current.url} alt={current.alt} fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
