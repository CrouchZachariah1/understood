import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/app/actions/admin";

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl">Settings & delivery</h1>
      <form action={saveSettingsAction} className="mt-6 grid gap-3 rounded-2xl bg-white p-5">
        {[
          ["whatsapp", "WhatsApp number", s.whatsapp],
          ["instagram", "Instagram URL", s.instagram],
          ["facebook", "Facebook URL", s.facebook],
          ["tiktok", "TikTok URL", s.tiktok],
          ["contactEmail", "Contact email", s.contactEmail],
          ["contactPhone", "Contact phone", s.contactPhone],
          ["newsletterHeading", "Newsletter heading", s.newsletterHeading],
          ["newsletterText", "Newsletter text", s.newsletterText],
          ["freeDeliveryCents", "Free delivery (cents)", String(s.freeDeliveryCents)],
          ["flatDeliveryCents", "Flat delivery (cents)", String(s.flatDeliveryCents)],
        ].map(([name, label, value]) => (
          <label key={name} className="text-sm">
            {label}
            <input name={name} defaultValue={value} className="mt-1 h-11 w-full rounded-xl border px-3" />
          </label>
        ))}
        <button className="rounded-full bg-black px-4 py-2 text-sm text-white">Save settings</button>
      </form>
    </div>
  );
}
