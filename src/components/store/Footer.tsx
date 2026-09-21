import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import type { StoreSettings } from "@/lib/settings";

export function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-20 border-t border-[var(--season-fg)]/10 bg-[var(--season-fg)] text-[var(--season-bg)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <Wordmark className="text-[var(--season-bg)]" />
          <p className="max-w-xs text-sm opacity-80">{settings.tagline}</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-70">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop">All</Link></li>
            <li><Link href="/age/toddler">Toddler</Link></li>
            <li><Link href="/age/kids">Kids</Link></li>
            <li><Link href="/age/youth">Youth</Link></li>
            <li><Link href="/bundles">Bundles</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-70">Help</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/size-guide">Size guide</Link></li>
            <li><Link href="/delivery">Delivery</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-70">Visit</p>
          <ul className="space-y-2 text-sm">
            {settings.instagram ? <li><a href={settings.instagram}>Instagram</a></li> : null}
            {settings.facebook ? <li><a href={settings.facebook}>Facebook</a></li> : null}
            {settings.tiktok ? <li><a href={settings.tiktok}>TikTok</a></li> : null}
            <li><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} UNDERSTOOD. South Africa. Prices in ZAR.
      </div>
    </footer>
  );
}
