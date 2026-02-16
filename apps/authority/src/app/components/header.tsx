"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Rankings", href: "/" },
  { label: "Regions", href: "/regions/northeast" },
  { label: "Search", href: "/search" },
  { label: "Industry Insights", href: "#insights" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Crown/Shield SVG icon */}
          <svg
            viewBox="0 0 40 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 shrink-0"
            aria-hidden="true"
          >
            {/* Shield shape */}
            <path
              d="M20 2L4 10V22C4 33 20 42 20 42C20 42 36 33 36 22V10L20 2Z"
              fill="currentColor"
              className="text-gold-500"
            />
            {/* Crown detail */}
            <path
              d="M12 20L16 14L20 18L24 14L28 20V26H12V20Z"
              fill="currentColor"
              className="text-navy-900"
            />
            {/* Crown gems */}
            <circle cx="20" cy="13" r="1.5" className="text-navy-900" fill="currentColor" />
            <circle cx="15" cy="16" r="1" className="text-gold-300" fill="currentColor" />
            <circle cx="25" cy="16" r="1" className="text-gold-300" fill="currentColor" />
          </svg>

          <div className="flex flex-col">
            <span className="text-gold-400 font-heading font-bold text-lg leading-tight tracking-tight group-hover:text-gold-300 transition-colors">
              Aircraft Detailing Authority
            </span>
            <span className="text-navy-300 text-xs tracking-widest uppercase leading-none mt-0.5">
              The Definitive Industry Standard
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ──────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy-100 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/claim"
            className="ml-2 inline-flex items-center rounded px-4 py-2 text-sm font-semibold bg-gold-500 hover:bg-gold-600 text-navy-900 transition-colors shadow-sm"
          >
            Claim Listing
          </Link>
        </nav>

        {/* ── Mobile Hamburger ─────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 text-navy-100 hover:text-gold-400 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${
              mobileOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${
              mobileOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-navy-800 bg-navy-900">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-navy-100 hover:text-gold-400 text-sm font-medium py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/claim"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded px-4 py-2.5 text-sm font-semibold bg-gold-500 hover:bg-gold-600 text-navy-900 transition-colors"
            >
              Claim Listing
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
