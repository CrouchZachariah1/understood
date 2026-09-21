import "server-only";
import { prisma } from "@/lib/db";

export type StoreSettings = {
  storeName: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  freeDeliveryCents: number;
  flatDeliveryCents: number;
  contactEmail: string;
  contactPhone: string;
  newsletterHeading: string;
  newsletterText: string;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "UNDERSTOOD.",
  tagline: "Comfort. Understood.",
  whatsapp: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  freeDeliveryCents: 65000,
  flatDeliveryCents: 7500,
  contactEmail: "hello@understood.co.za",
  contactPhone: "",
  newsletterHeading: "Colour, comfort, and the next drop.",
  newsletterText: "Season notes and bundle deals. No noise.",
};

export async function getSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    storeName: map.storeName ?? DEFAULT_SETTINGS.storeName,
    tagline: map.tagline ?? DEFAULT_SETTINGS.tagline,
    whatsapp: map.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
    instagram: map.instagram ?? DEFAULT_SETTINGS.instagram,
    facebook: map.facebook ?? DEFAULT_SETTINGS.facebook,
    tiktok: map.tiktok ?? DEFAULT_SETTINGS.tiktok,
    freeDeliveryCents: Number(map.freeDeliveryCents ?? DEFAULT_SETTINGS.freeDeliveryCents),
    flatDeliveryCents: Number(map.flatDeliveryCents ?? DEFAULT_SETTINGS.flatDeliveryCents),
    contactEmail: map.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
    contactPhone: map.contactPhone ?? DEFAULT_SETTINGS.contactPhone,
    newsletterHeading: map.newsletterHeading ?? DEFAULT_SETTINGS.newsletterHeading,
    newsletterText: map.newsletterText ?? DEFAULT_SETTINGS.newsletterText,
  };
}

export async function setSetting(key: keyof StoreSettings, value: string | number) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: String(value) },
    update: { value: String(value) },
  });
}

export async function saveSettings(partial: Partial<StoreSettings>) {
  await Promise.all(
    Object.entries(partial).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value: String(value ?? "") },
        update: { value: String(value ?? "") },
      }),
    ),
  );
}
