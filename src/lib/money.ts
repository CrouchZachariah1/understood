/** All store money is integer South African cents. Never use floats for totals. */

export function randsToCents(rands: string | number): number {
  if (typeof rands === "number") {
    if (!Number.isFinite(rands)) return 0;
    return Math.round(rands * 100);
  }
  const cleaned = rands.replace(/[R\s,]/gi, "").trim();
  if (!cleaned) return 0;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

export function formatZar(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const rands = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `${sign}R${rands.toLocaleString("en-ZA")}.${remainder.toString().padStart(2, "0")}`;
}

export function clampCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
