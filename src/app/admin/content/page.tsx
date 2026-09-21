import { prisma } from "@/lib/db";
import { saveContentAction } from "@/app/actions/admin";

export default async function ContentAdmin() {
  const pages = await prisma.contentPage.findMany();
  return (
    <div>
      <h1 className="font-display text-4xl">Content</h1>
      <div className="mt-6 space-y-6">
        {pages.map((p) => (
          <form
            key={p.key}
            action={async (formData) => {
              "use server";
              await saveContentAction(p.key, String(formData.get("title")), String(formData.get("body")));
            }}
            className="rounded-2xl bg-white p-5"
          >
            <input name="title" defaultValue={p.title} className="h-11 w-full rounded-xl border px-3 font-display text-xl" />
            <textarea name="body" defaultValue={p.body} className="mt-3 min-h-40 w-full rounded-xl border p-3 text-sm" />
            <button className="mt-3 rounded-full bg-black px-4 py-2 text-sm text-white">Save {p.key}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
