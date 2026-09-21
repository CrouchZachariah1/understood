import { prisma } from "@/lib/db";

export default async function SizeGuidePage() {
  const page = await prisma.contentPage.findUnique({ where: { key: "size-guide" } });
  const sizes = await prisma.sizeDefinition.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">{page?.title ?? "Size guide"}</h1>
      <p className="mt-6 whitespace-pre-line text-lg opacity-80">{page?.body}</p>
      <table className="mt-10 w-full overflow-hidden rounded-3xl bg-white text-left text-sm">
        <thead className="bg-[var(--season-muted)]">
          <tr>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Waist (cm)</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((s) => (
            <tr key={s.id} className="border-t border-[var(--season-muted)]">
              <td className="px-4 py-3 font-semibold">{s.name}</td>
              <td className="px-4 py-3">{s.ageLabel}</td>
              <td className="px-4 py-3">
                {s.waistMin && s.waistMax ? `${s.waistMin}–${s.waistMax}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
