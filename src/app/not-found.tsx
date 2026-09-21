import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-5xl">Not here.</h1>
      <p className="mt-4 opacity-70">That page doesn’t exist. The shop does.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-[var(--season-fg)] px-6 py-3 text-white">
        Back to UNDERSTOOD.
      </Link>
    </div>
  );
}
