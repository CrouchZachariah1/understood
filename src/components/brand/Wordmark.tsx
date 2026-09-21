import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  href = "/",
  className,
  size = "md",
}: {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-4xl sm:text-6xl",
  };
  return (
    <Link
      href={href}
      className={cn("font-display font-bold tracking-[-0.04em] leading-none", sizes[size], className)}
      aria-label="UNDERSTOOD. home"
    >
      <span className="relative inline-block">
        <span>UNDER</span>
        <span
          aria-hidden
          className="absolute left-0 -bottom-0.5 h-[3px] w-full rounded-full bg-[var(--season-accent)]"
        />
      </span>
      <span>STOOD.</span>
    </Link>
  );
}
