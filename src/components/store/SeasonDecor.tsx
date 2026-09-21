export function SeasonDecor({ kind }: { kind: string }) {
  if (kind === "bloom") {
    return (
      <svg aria-hidden viewBox="0 0 120 120" className="h-24 w-24 text-[var(--season-primary)] opacity-70">
        <circle cx="60" cy="60" r="8" fill="currentColor" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <ellipse key={i} cx={60 + Math.cos(a) * 22} cy={60 + Math.sin(a) * 22} rx="8" ry="14" fill="currentColor" opacity="0.55" transform={`rotate(${i * 45} ${60 + Math.cos(a) * 22} ${60 + Math.sin(a) * 22})`} />;
        })}
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className="h-20 w-20 text-[var(--season-primary)] opacity-80">
        <path d="M12 68 C28 20, 70 12, 68 12 C70 28, 28 52, 12 68 Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "rain") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className="h-16 w-16 text-[var(--season-secondary)] opacity-50">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={8 + i * 8} y={10 + (i % 3) * 8} width="2" height="18" rx="1" fill="currentColor" />
        ))}
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 120 120" className="h-28 w-28 text-[var(--season-accent)]">
      <circle cx="60" cy="60" r="18" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <rect
            key={i}
            x="58"
            y="8"
            width="4"
            height="16"
            rx="2"
            fill="currentColor"
            transform={`rotate(${i * 30} 60 60)`}
          />
        );
      })}
    </svg>
  );
}
