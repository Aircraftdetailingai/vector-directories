"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Collections", href: "/collections/editors-choice-2025" },
  { label: "Awards", href: "/awards" },
  { label: "Search", href: "/search" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-noir-900 text-ivory-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" className="group">
          <span className="font-heading text-gold-500 text-lg tracking-[0.2em] uppercase">
            Best Aircraft Detailer
          </span>
        </Link>

        {/* ── Desktop Nav ──────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ivory-300 hover:text-gold-500 text-sm tracking-widest uppercase font-body transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/claim"
            className="ml-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-noir-900 px-4 py-2 text-xs tracking-widest uppercase transition-colors"
          >
            List Your Business
          </Link>
        </nav>

        {/* ── Mobile Hamburger ─────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 text-ivory-300 hover:text-gold-500 transition-colors"
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
        <nav className="lg:hidden border-t border-noir-800 bg-noir-900">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-ivory-300 hover:text-gold-500 text-sm tracking-widest uppercase font-body py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/claim"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-noir-900 px-4 py-2.5 text-xs tracking-widest uppercase transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
