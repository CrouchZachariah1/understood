"use client";

import { useTransition } from "react";
import type { Theme } from "@prisma/client";
import { SEASON_THEMES } from "@/lib/theme/defaults";
import {
  clearPreviewAction,
  previewThemeAction,
  publishSeasonAction,
  rollbackThemeAction,
  saveCustomThemeAction,
} from "@/app/actions/admin";

export function ThemeControls({ themes }: { themes: Theme[] }) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-6 space-y-8">
      <div className="grid gap-3 md:grid-cols-2">
        {themes.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">{t.label}</h2>
              {t.published ? <span className="text-xs uppercase tracking-widest">Live</span> : null}
            </div>
            <p className="mt-2 text-sm opacity-70">{t.heroHeading}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SEASON_THEMES[t.season].heroImage}
              alt=""
              className="mt-3 h-28 w-full rounded-xl object-cover"
            />
            <div className="mt-3 flex gap-2">
              {[t.primary, t.secondary, t.accent, t.background].map((c) => (
                <span key={c} className="h-8 w-8 rounded-full border" style={{ background: c }} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => previewThemeAction(t.id))}
                className="rounded-full bg-[#f6f3ee] px-3 py-2 text-xs"
              >
                Preview
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => publishSeasonAction(t.id))}
                className="rounded-full bg-black px-3 py-2 text-xs text-white"
              >
                Publish
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => start(() => clearPreviewAction())} className="rounded-full bg-white px-4 py-2 text-sm">
          Exit preview
        </button>
        <button type="button" onClick={() => start(() => rollbackThemeAction())} className="rounded-full bg-white px-4 py-2 text-sm">
          Rollback previous
        </button>
      </div>
      <form action={saveCustomThemeAction} className="rounded-2xl bg-white p-5">
        <h2 className="font-display text-2xl">Custom theme</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["label", "Season label"],
            ["primary", "Primary colour"],
            ["secondary", "Secondary colour"],
            ["accent", "Accent colour"],
            ["background", "Background"],
            ["foreground", "Text colour"],
            ["heroHeading", "Homepage heading"],
            ["heroSubtitle", "Subtitle"],
            ["ctaPrimary", "CTA text"],
            ["bannerText", "Campaign banner"],
            ["heroImage", "Hero image path"],
          ].map(([name, label]) => (
            <label key={name} className="text-sm">
              {label}
              <input name={name} required={name !== "heroImage"} className="mt-1 h-11 w-full rounded-xl border px-3" />
            </label>
          ))}
        </div>
        <button className="mt-4 rounded-full bg-black px-4 py-2 text-sm text-white">Save custom</button>
      </form>
    </div>
  );
}
