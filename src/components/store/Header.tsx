import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { getCart } from "@/lib/cart";
import { MobileNav } from "@/components/store/MobileNav";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/age/toddler", label: "Toddler" },
  { href: "/age/kids", label: "Kids" },
  { href: "/age/youth", label: "Youth" },
  { href: "/bundles", label: "Bundles" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const cart = await getCart();
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--season-fg)]/8 bg-[var(--season-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <MobileNav items={NAV} />
        <Wordmark />
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--season-primary)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/shop" aria-label="Search shop" className="rounded-full p-2 hover:bg-white">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/account" aria-label="Account" className="rounded-full p-2 hover:bg-white">
            <UserRound className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-full p-2 hover:bg-white">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--season-primary)] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
