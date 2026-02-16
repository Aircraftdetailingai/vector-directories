import Link from "next/link";

const RANKINGS_LINKS = [
  { label: "Top Detailers", href: "/" },
  { label: "By Region", href: "/regions/northeast" },
  { label: "Full Rankings", href: "/search" },
];

const BUSINESS_LINKS = [
  { label: "Claim Listing", href: "/claim" },
  { label: "Pricing", href: "/pricing" },
  { label: "Methodology", href: "#methodology" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300">
      {/* ── Gold rule ──────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand Column ───────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Small shield icon */}
              <svg
                viewBox="0 0 40 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M20 2L4 10V22C4 33 20 42 20 42C20 42 36 33 36 22V10L20 2Z"
                  fill="currentColor"
                  className="text-gold-500"
                />
                <path
                  d="M12 20L16 14L20 18L24 14L28 20V26H12V20Z"
                  fill="currentColor"
                  className="text-navy-950"
                />
              </svg>
              <span className="font-heading font-bold text-gold-400 text-lg leading-tight">
                Aircraft Detailing Authority
              </span>
            </div>
            <p className="text-sm leading-relaxed text-navy-400 max-w-xs">
              The definitive editorial standard for aircraft detailing
              excellence. Expert rankings, rigorous methodology, and in-depth
              industry analysis since 2024.
            </p>
          </div>

          {/* ── Rankings ───────────────────────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-gold-400 text-sm tracking-wide uppercase mb-4">
              Rankings
            </h3>
            <ul className="space-y-2.5">
              {RANKINGS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── For Businesses ─────────────────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-gold-400 text-sm tracking-wide uppercase mb-4">
              For Businesses
            </h3>
            <ul className="space-y-2.5">
              {BUSINESS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ────────────────────────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-gold-400 text-sm tracking-wide uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            &copy; 2025 Aircraft Detailing Authority. All rights reserved.
          </p>
          <p className="text-xs text-navy-600 italic font-heading">
            Setting the standard in aviation detailing excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
