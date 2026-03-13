"use client";

import { useState } from "react";
import Link from "next/link";
import { CartIcon } from "./cart-icon";
import { CartProvider } from "./cart-provider";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Brands", href: "/shop" },
  { label: "Training", href: "/training" },
  { label: "Directories", href: "/directories" },
  { label: "Advertise", href: "/advertise" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-lg font-bold text-white">
          Aircraft Detailing 101
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white transition-colors hover:text-blue-300"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/vendor/register"
            className="text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Become a Supplier
          </Link>

          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 transition-colors hover:text-white"
          >
            Sign In
          </Link>

          <CartProvider>
            <CartIcon />
          </CartProvider>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <CartProvider>
            <CartIcon />
          </CartProvider>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-800 bg-slate-900 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/vendor/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Become a Supplier
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Sign In
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
