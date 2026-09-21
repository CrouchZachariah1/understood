import { prisma } from "@/lib/db";

export default async function ReturnsPage() {
  const page = await prisma.contentPage.findUnique({ where: { key: "returns" } });
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">{page?.title ?? "Returns"}</h1>
      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed opacity-85">{page?.body}</div>
    </article>
  );
}
