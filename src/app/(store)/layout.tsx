import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";
import { getSettings } from "@/lib/settings";
import { getActiveTheme } from "@/lib/theme/engine";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, theme] = await Promise.all([getSettings(), getActiveTheme()]);
  return (
    <>
      <div className="bg-[var(--season-fg)] px-4 py-2 text-center text-xs font-medium tracking-wide text-[var(--season-bg)] sm:text-sm">
        {theme.bannerText}
      </div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp} />
    </>
  );
}
