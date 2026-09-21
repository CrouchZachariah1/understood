import { prisma } from "@/lib/db";
import { createCampaignAction } from "@/app/actions/admin";

export default async function CampaignsAdmin() {
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl">Campaigns</h1>
      <form action={createCampaignAction} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
        <input name="title" required placeholder="Summer Understood" className="h-11 rounded-xl border px-3" />
        <select name="season" className="h-11 rounded-xl border px-3">
          <option value="SUMMER">Summer</option>
          <option value="SPRING">Spring</option>
          <option value="AUTUMN">Autumn</option>
          <option value="WINTER">Winter</option>
        </select>
        <input name="bannerText" placeholder="Banner" className="h-11 rounded-xl border px-3 sm:col-span-2" />
        <textarea name="description" placeholder="Description" className="min-h-24 rounded-xl border p-3 sm:col-span-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="homepage" defaultChecked /> Homepage
        </label>
        <button className="rounded-full bg-black px-4 py-2 text-sm text-white">Create campaign</button>
      </form>
      <ul className="mt-6 space-y-2">
        {campaigns.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4">
            <p className="font-semibold">{c.title}</p>
            <p className="text-sm opacity-60">{c.status} · {c.season}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
