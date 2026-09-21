import Link from "next/link";
import { requireStaff } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";
import { Wordmark } from "@/components/brand/Wordmark";

const NAV = [
  ["Dashboard", "/admin"],
  ["Orders", "/admin/orders"],
  ["Products", "/admin/products"],
  ["Collections", "/admin/collections"],
  ["Inventory", "/admin/inventory"],
  ["Stock to move", "/admin/stock"],
  ["Bundles", "/admin/bundles"],
  ["Discounts", "/admin/discounts"],
  ["Customers", "/admin/customers"],
  ["Campaigns", "/admin/campaigns"],
  ["Themes", "/admin/themes"],
  ["Content", "/admin/content"],
  ["Analytics", "/admin/analytics"],
  ["Delivery", "/admin/settings"],
  ["Settings", "/admin/settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1b1b1b]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-black/5 bg-white p-5 md:block">
          <Wordmark href="/admin" size="sm" />
          <p className="mt-2 text-xs opacity-50">{staff.name} · {staff.role}</p>
          <nav className="mt-6 flex flex-col gap-1 text-sm">
            {NAV.map(([label, href]) => (
              <Link key={href + label} href={href} className="rounded-lg px-3 py-2 hover:bg-[#f6f3ee]">
                {label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-8">
            <button className="text-xs underline">Log out</button>
          </form>
          <Link href="/" className="mt-3 block text-xs underline">
            View store
          </Link>
        </aside>
        <div className="flex-1">
          <div className="flex gap-2 overflow-x-auto border-b border-black/5 bg-white px-3 py-3 text-sm md:hidden">
            {NAV.slice(0, 6).map(([label, href]) => (
              <Link key={href + label} href={href} className="whitespace-nowrap rounded-full bg-[#f6f3ee] px-3 py-1">
                {label}
              </Link>
            ))}
          </div>
          <div className="p-4 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
