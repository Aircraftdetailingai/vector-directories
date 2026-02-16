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

const TIER_BADGE: Record<Tier, { className: string; label: string; icon?: string }> = {
  basic: {
    className: "bg-gray-100 text-gray-600",
    label: "Basic",
  },
  enhanced: {
    className: "bg-teal-100 text-teal-700",
    label: "Enhanced",
  },
  premium: {
    className: "bg-coral-100 text-coral-700",
    label: "Premium",
  },
  featured: {
    className: "bg-coral-100 text-coral-700",
    label: "Featured",
    icon: "\u2605",
  },
  bundle_all: {
    className: "bg-coral-100 text-coral-700",
    label: "Bundle All",
    icon: "\u265B",
  },
};

interface SidebarProps {
  companyName: string;
  tier: Tier;
}

export function DashboardSidebar({ companyName, tier }: SidebarProps) {
  const pathname = usePathname();
  const tierBadge = TIER_BADGE[tier];

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
            <p className="font-heading text-sm font-bold text-gray-900 truncate">
              {companyName}
            </p>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierBadge.className}`}
            >
              {tierBadge.icon && (
                <span className="text-[10px]">{tierBadge.icon}</span>
              )}
              {tierBadge.label}
            </span>
          </div>

          <nav aria-label="Dashboard" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-teal-50 text-teal-700 border-l-2 border-coral-400 font-semibold"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-coral-100 px-1.5 py-0.5 text-[10px] font-semibold text-coral-700">
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
              className={`flex-shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-teal-50"
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

export default DashboardSidebar;
