import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SEASON_THEMES, type ThemeTokens } from "@/lib/theme/defaults";
import type { SeasonKey, Theme } from "@prisma/client";

export const PREVIEW_COOKIE = "und_theme_preview";

export function themeToTokens(theme: Theme): ThemeTokens {
  const pack = SEASON_THEMES[theme.season];
  const custom = theme.season === "CUSTOM";
  return {
    season: theme.season,
    label: theme.label,
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    background: theme.background,
    foreground: theme.foreground,
    muted: theme.muted,
    heroHeading: theme.heroHeading,
    heroSubtitle: theme.heroSubtitle,
    ctaPrimary: theme.ctaPrimary,
    ctaSecondary: theme.ctaSecondary,
    bannerText: theme.bannerText,
    heroImage: custom && theme.heroImage ? theme.heroImage : pack.heroImage,
    campaignImage: custom && theme.campaignImage ? theme.campaignImage : pack.campaignImage,
    decorative: theme.decorative ?? pack.decorative,
  };
}

export function tokensToCss(tokens: ThemeTokens): Record<string, string> {
  return {
    "--season-primary": tokens.primary,
    "--season-secondary": tokens.secondary,
    "--season-accent": tokens.accent,
    "--season-bg": tokens.background,
    "--season-fg": tokens.foreground,
    "--season-muted": tokens.muted,
  };
}

export async function getActiveTheme(): Promise<ThemeTokens> {
  const jar = await cookies();
  const previewId = jar.get(PREVIEW_COOKIE)?.value;
  if (previewId) {
    const preview = await prisma.theme.findUnique({ where: { id: previewId } });
    if (preview) return themeToTokens(preview);
  }
  const published = await prisma.theme.findFirst({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  });
  if (published) return themeToTokens(published);
  return SEASON_THEMES.SUMMER;
}

export async function publishTheme(id: string) {
  const next = await prisma.theme.findUnique({ where: { id } });
  if (!next) throw new Error("Theme not found");
  const current = await prisma.theme.findFirst({ where: { published: true } });
  if (current) {
    await prisma.themeSnapshot.create({
      data: { payload: JSON.stringify(themeToTokens(current)) },
    });
  }
  await prisma.$transaction([
    prisma.theme.updateMany({ data: { published: false } }),
    prisma.theme.update({ where: { id }, data: { published: true } }),
  ]);
}

export async function rollbackTheme() {
  const snap = await prisma.themeSnapshot.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!snap) return null;
  const tokens = JSON.parse(snap.payload) as ThemeTokens;
  const restored = await prisma.theme.create({
    data: {
      season: tokens.season,
      label: tokens.label,
      primary: tokens.primary,
      secondary: tokens.secondary,
      accent: tokens.accent,
      background: tokens.background,
      foreground: tokens.foreground,
      muted: tokens.muted,
      heroHeading: tokens.heroHeading,
      heroSubtitle: tokens.heroSubtitle,
      ctaPrimary: tokens.ctaPrimary,
      ctaSecondary: tokens.ctaSecondary,
      bannerText: tokens.bannerText,
      heroImage: tokens.heroImage,
      campaignImage: tokens.campaignImage,
      decorative: tokens.decorative,
      published: false,
    },
  });
  await publishTheme(restored.id);
  return restored;
}

export function seasonKeyLabel(key: SeasonKey) {
  return SEASON_THEMES[key].label;
}
