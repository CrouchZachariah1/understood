"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({
  number,
  productName,
  size,
  color,
  url,
}: {
  number: string;
  productName?: string;
  size?: string;
  color?: string;
  url?: string;
}) {
  if (!number) return null;
  const digits = number.replace(/[^\d]/g, "");
  const text = productName
    ? `Hello!\nI'm interested in:\n${productName}\nSize: ${size ?? "—"}\nColour: ${color ?? "—"}\n${url ?? ""}`
    : "Hello! I have a question about UNDERSTOOD.";
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
