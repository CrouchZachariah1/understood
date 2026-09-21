"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { OrderStatus, SeasonKey } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import { setOrderStatus, applyVerifiedPayment } from "@/lib/orders";
import { publishTheme, rollbackTheme, PREVIEW_COOKIE } from "@/lib/theme/engine";
import { saveSettings, type StoreSettings } from "@/lib/settings";
import { slugify } from "@/lib/slug";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  const staff = await requireStaff();
  await setOrderStatus(orderId, status, staff.email);
  await writeAudit({ userId: staff.id, action: "order.status", entity: "order", entityId: orderId, meta: { status } });
  revalidatePath("/admin/orders");
}

export async function markOrderPaidAction(orderId: string) {
  const staff = await requireStaff();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  await applyVerifiedPayment({
    orderId: order.id,
    orderNumber: order.number,
    amountCents: order.totalCents,
    provider: "manual",
    providerRef: `admin-${staff.id}`,
    webhookId: `admin-${order.id}-${Date.now()}`,
  });
  await writeAudit({ userId: staff.id, action: "order.markPaid", entity: "order", entityId: orderId });
  revalidatePath("/admin/orders");
}

export async function updateVariantStockAction(variantId: string, stock: number) {
  const staff = await requireStaff();
  await prisma.variant.update({ where: { id: variantId }, data: { stock: Math.max(0, Math.round(stock)) } });
  await writeAudit({ userId: staff.id, action: "inventory.update", entity: "variant", entityId: variantId });
  revalidatePath("/admin/inventory");
}

export async function publishSeasonAction(themeId: string) {
  const staff = await requireStaff();
  await publishTheme(themeId);
  await writeAudit({ userId: staff.id, action: "theme.publish", entity: "theme", entityId: themeId });
  revalidatePath("/", "layout");
  revalidatePath("/admin/themes");
}

export async function previewThemeAction(themeId: string) {
  await requireStaff();
  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, themeId, { httpOnly: true, path: "/", maxAge: 60 * 60 });
  revalidatePath("/", "layout");
}

export async function clearPreviewAction() {
  await requireStaff();
  const jar = await cookies();
  jar.delete(PREVIEW_COOKIE);
  revalidatePath("/", "layout");
}

export async function rollbackThemeAction() {
  const staff = await requireStaff();
  await rollbackTheme();
  await writeAudit({ userId: staff.id, action: "theme.rollback", entity: "theme" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/themes");
}

export async function saveCustomThemeAction(formData: FormData) {
  const staff = await requireStaff();
  const theme = await prisma.theme.create({
    data: {
      season: "CUSTOM",
      label: String(formData.get("label") || "Custom"),
      primary: String(formData.get("primary")),
      secondary: String(formData.get("secondary")),
      accent: String(formData.get("accent")),
      background: String(formData.get("background")),
      foreground: String(formData.get("foreground")),
      muted: String(formData.get("muted") || "#F3E4C8"),
      heroHeading: String(formData.get("heroHeading")),
      heroSubtitle: String(formData.get("heroSubtitle")),
      ctaPrimary: String(formData.get("ctaPrimary") || "Shop now"),
      ctaSecondary: String(formData.get("ctaSecondary") || "Explore"),
      bannerText: String(formData.get("bannerText") || ""),
      heroImage: String(formData.get("heroImage") || "/themes/hero-summer.jpg"),
      campaignImage: String(formData.get("campaignImage") || "/themes/campaign-summer.jpg"),
      decorative: String(formData.get("decorative") || "sun"),
      published: false,
    },
  });
  await writeAudit({ userId: staff.id, action: "theme.create", entity: "theme", entityId: theme.id });
  revalidatePath("/admin/themes");
}

export async function saveContentAction(key: string, title: string, body: string) {
  const staff = await requireStaff();
  await prisma.contentPage.upsert({
    where: { key },
    update: { title, body },
    create: { key, title, body },
  });
  await writeAudit({ userId: staff.id, action: "content.save", entity: "content", entityId: key });
  revalidatePath("/admin/content");
}

export async function saveSettingsAction(formData: FormData) {
  const staff = await requireStaff();
  const data: Partial<StoreSettings> = {
    whatsapp: String(formData.get("whatsapp") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    newsletterHeading: String(formData.get("newsletterHeading") ?? ""),
    newsletterText: String(formData.get("newsletterText") ?? ""),
    freeDeliveryCents: Number(formData.get("freeDeliveryCents") || 65000),
    flatDeliveryCents: Number(formData.get("flatDeliveryCents") || 7500),
  };
  await saveSettings(data);
  await writeAudit({ userId: staff.id, action: "settings.save", entity: "settings" });
  revalidatePath("/admin/settings");
}

export async function createDiscountAction(formData: FormData) {
  const staff = await requireStaff();
  const code = String(formData.get("code") || "").toUpperCase() || null;
  await prisma.discount.create({
    data: {
      name: String(formData.get("name")),
      code,
      type: String(formData.get("type") || "PERCENT") as never,
      percentOff: formData.get("percentOff") ? Number(formData.get("percentOff")) : null,
      amountCents: formData.get("amountCents") ? Number(formData.get("amountCents")) : null,
      minSpendCents: formData.get("minSpendCents") ? Number(formData.get("minSpendCents")) : null,
      firstOrderOnly: formData.get("firstOrderOnly") === "on",
      automatic: formData.get("automatic") === "on",
      usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
      active: true,
    },
  });
  await writeAudit({ userId: staff.id, action: "discount.create", entity: "discount" });
  revalidatePath("/admin/discounts");
}

export async function toggleDiscountAction(id: string, active: boolean) {
  await requireStaff();
  await prisma.discount.update({ where: { id }, data: { active } });
  revalidatePath("/admin/discounts");
}

export async function createBundleAction(formData: FormData) {
  const staff = await requireStaff();
  const name = String(formData.get("name"));
  await prisma.bundle.create({
    data: {
      name,
      slug: slugify(name),
      description: String(formData.get("description") || ""),
      pickCount: Number(formData.get("pickCount") || 3),
      priceCents: Number(formData.get("priceCents") || 0),
      homepage: formData.get("homepage") === "on",
      active: true,
    },
  });
  await writeAudit({ userId: staff.id, action: "bundle.create", entity: "bundle" });
  revalidatePath("/admin/bundles");
}

export async function addProductToClearanceAction(productId: string) {
  const staff = await requireStaff();
  const clearance = await prisma.collection.findUnique({ where: { slug: "clearance" } });
  await prisma.product.update({ where: { id: productId }, data: { clearance: true } });
  if (clearance) {
    await prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: clearance.id, productId } },
      update: {},
      create: { collectionId: clearance.id, productId },
    });
  }
  await writeAudit({ userId: staff.id, action: "product.clearance", entity: "product", entityId: productId });
  revalidatePath("/admin/stock");
}

export async function featureProductAction(productId: string) {
  await requireStaff();
  await prisma.product.update({ where: { id: productId }, data: { featured: true } });
  revalidatePath("/admin/stock");
  revalidatePath("/");
}

export async function createCollectionAction(formData: FormData) {
  const staff = await requireStaff();
  const name = String(formData.get("name"));
  await prisma.collection.create({
    data: {
      name,
      slug: slugify(name),
      description: String(formData.get("description") || ""),
      homepage: formData.get("homepage") === "on",
      featured: true,
    },
  });
  await writeAudit({ userId: staff.id, action: "collection.create", entity: "collection" });
  revalidatePath("/admin/collections");
}

export async function createCampaignAction(formData: FormData) {
  const staff = await requireStaff();
  const title = String(formData.get("title"));
  await prisma.campaign.create({
    data: {
      title,
      slug: slugify(title),
      description: String(formData.get("description") || ""),
      bannerText: String(formData.get("bannerText") || ""),
      season: (formData.get("season") as SeasonKey) || null,
      homepage: formData.get("homepage") === "on",
      status: "ACTIVE",
    },
  });
  await writeAudit({ userId: staff.id, action: "campaign.create", entity: "campaign" });
  revalidatePath("/admin/campaigns");
}
