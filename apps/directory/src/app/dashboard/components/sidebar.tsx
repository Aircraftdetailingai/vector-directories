"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tier } from "@vector/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/profile", label: "Company Profile" },
  { href: "/dashboard/locations", label: "Locations" },
  { href: "/dashboard/certifications", label: "Certifications" },
  { href: "/dashboard/media", label: "Photos & Media" },
  { href: "/dashboard/leads", label: "Leads", badge: "Premium+" },
  { href: "/dashboard/upgrade", label: "Upgrade Plan" },
];

const TIER_COLORS: Record<Tier, string> = {
  basic: "bg-gray-100 text-gray-600",
  enhanced: "bg-blue-100 text-blue-700",
  premium: "bg-forest-100 text-forest-700",
  featured: "bg-amber-100 text-amber-700",
  bundle_all: "bg-purple-100 text-purple-700",
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
            <p className="font-heading text-sm font-bold text-forest-900 truncate">
              {companyName}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${TIER_COLORS[tier]}`}
            >
              {tier}
            </span>
          </div>

          <nav aria-label="Dashboard" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-forest-100 text-forest-800"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-forest-100 px-1.5 py-0.5 text-[10px] font-semibold text-forest-700">
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
              className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest-100 text-forest-800"
                  : "text-gray-600 hover:bg-gray-100"
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
