import { prisma } from "@/lib/db";

export default async function AboutPage() {
  const page = await prisma.contentPage.findUnique({ where: { key: "about" } });
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">{page?.title ?? "About UNDERSTOOD."}</h1>
      <div className="prose-understood mt-8 space-y-4 whitespace-pre-line text-lg leading-relaxed opacity-85">
        {page?.body}
      </div>
    </article>
  );
}
