"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tier } from "@vector/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/locations", label: "Locations" },
  { href: "/dashboard/certifications", label: "Certifications" },
  { href: "/dashboard/media", label: "Photos & Media" },
  { href: "/dashboard/leads", label: "Leads", badge: "Premium+" },
  { href: "/dashboard/upgrade", label: "Upgrade" },
];

const TIER_COLORS: Record<Tier, string> = {
  basic: "bg-ivory-200 text-noir-900",
  enhanced: "bg-ivory-200 text-noir-900",
  premium: "bg-noir-900 text-ivory-100",
  featured: "bg-gold-500 text-noir-900",
  bundle_all: "bg-gold-500 text-noir-900",
};

interface SidebarProps {
  companyName: string;
  tier: Tier;
}

export function DashboardSidebar({ companyName, tier }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-6">
            <p className="font-heading text-sm font-semibold text-noir-900 truncate">
              {companyName}
            </p>
            <span
              className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold capitalize rounded-sm ${TIER_COLORS[tier]}`}
            >
              {tier === "bundle_all" ? "Bundle" : tier}
            </span>
          </div>

          <nav aria-label="Dashboard" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors rounded-sm ${
                    active
                      ? "border-l-2 border-gold-500 bg-noir-900/5 text-noir-900 font-semibold"
                      : "text-ivory-500 hover:text-noir-900"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="bg-noir-900 px-1.5 py-0.5 text-[10px] font-semibold text-gold-500 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile horizontal nav */}
      <nav
        aria-label="Dashboard"
        className="mb-6 flex gap-1 overflow-x-auto pb-2 lg:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors rounded-sm ${
                active
                  ? "bg-noir-900 text-gold-500"
                  : "text-ivory-500 hover:text-noir-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
