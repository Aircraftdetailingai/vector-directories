"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/browse/state", label: "Browse by State" },
  { href: "/airports", label: "Browse by Airport" },
  { href: "/a-z", label: "A-Z Index" },
  { href: "/search", label: "Search" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-forest-800"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 2L4 8v16l12 6 12-6V8L16 2z"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M16 2L4 8v16l12 6 12-6V8L16 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M16 10l-6 3v6l6 3 6-3v-6l-6-3z"
              fill="currentColor"
            />
          </svg>
          <span className="font-heading text-lg font-bold text-forest-800">
            Aircraft Detailing Directory
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-forest-100 hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/claim"
            className="ml-2 rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
          >
            Claim Listing
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-forest-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-forest-100 bg-white px-4 pb-4 pt-2 md:hidden" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-forest-100 hover:text-forest-800"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/claim"
            className="mt-2 block rounded-lg bg-forest-800 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-forest-700"
            onClick={() => setMobileOpen(false)}
          >
            Claim Listing
          </Link>
        </nav>
      )}
    </header>
  );
}
