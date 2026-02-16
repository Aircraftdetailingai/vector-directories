"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tier } from "@vector/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/locations", label: "Locations" },
  { href: "/dashboard/certifications", label: "Certifications" },
  { href: "/dashboard/media", label: "Media" },
  { href: "/dashboard/leads", label: "Leads", badge: "Premium+" },
  { href: "/dashboard/upgrade", label: "Upgrade" },
];

const TIER_BADGES: Record<Tier, { className: string; label: string }> = {
  basic: {
    className: "bg-slate-700 text-slate-300",
    label: "Basic",
  },
  enhanced: {
    className: "bg-slate-600 text-slate-200",
    label: "Enhanced",
  },
  premium: {
    className: "bg-electric-500/10 text-electric-400 border border-electric-500/30",
    label: "Premium",
  },
  featured: {
    className: "bg-electric-500/20 text-electric-400 border border-electric-500/40",
    label: "Featured",
  },
  bundle_all: {
    className: "bg-electric-500/20 text-electric-400 border border-electric-500/40",
    label: "Bundle All",
  },
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

  const tierBadge = TIER_BADGES[tier];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-900 p-4">
            <p className="truncate font-heading text-sm font-bold text-white">
              {companyName}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold ${tierBadge.className}`}
            >
              {tier === "bundle_all" && (
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
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
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-l-2 border-electric-500 bg-electric-500/10 text-electric-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-lg bg-electric-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-electric-400">
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
                  ? "bg-electric-500/10 text-electric-400"
                  : "text-slate-400 hover:bg-slate-800"
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
