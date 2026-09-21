"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Something snagged.</h1>
      <p className="mt-3 opacity-70">Please try again. If this is checkout, your card has not been charged until payment is verified.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-[var(--season-fg)] px-6 py-3 text-white">
        Try again
      </button>
    </div>
  );
}
