"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [{ label: "Dashboard", href: "/admin" }];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-forest-800 text-white">
      {/* Heading */}
      <div className="border-b border-forest-700 px-6 py-5">
        <h2 className="text-lg font-bold tracking-tight">Master Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-forest-700 text-white"
                  : "text-forest-200 hover:bg-forest-700/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="border-t border-forest-700 px-6 py-4">
        <Link
          href="/"
          className="text-sm text-forest-300 transition-colors hover:text-white"
        >
          &larr; Back to Site
        </Link>
      </div>
    </aside>
  );
}
