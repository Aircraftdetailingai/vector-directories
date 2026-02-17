import Link from "next/link";

const COLLECTION_LINKS = [
  { label: "Editor's Choice 2025", href: "/collections/editors-choice-2025" },
  { label: "Best in the Southeast", href: "/collections/best-southeast" },
  { label: "Best on the West Coast", href: "/collections/best-west-coast" },
  { label: "Best Ceramic Coating", href: "/collections/best-ceramic-coating" },
];

const DETAILER_LINKS = [
  { label: "Claim Listing", href: "/claim" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const CONTACT_LINKS = [
  { label: "press@bestaircraftdetailer.com", href: "mailto:press@bestaircraftdetailer.com" },
  { label: "Advertise", href: "/advertise" },
  { label: "Partnerships", href: "/partnerships" },
];

export default function Footer() {
  return (
    <footer className="bg-noir-900 border-t border-noir-800">
      {/* ── Gold divider ──────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Curated Collections ───────────────────────── */}
          <div>
            <h3 className="font-heading text-gold-500 text-sm tracking-widest uppercase mb-5">
              Curated Collections
            </h3>
            <ul className="space-y-3">
              {COLLECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── For Detailers ─────────────────────────────── */}
          <div>
            <h3 className="font-heading text-gold-500 text-sm tracking-widest uppercase mb-5">
              For Detailers
            </h3>
            <ul className="space-y-3">
              {DETAILER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ───────────────────────────────────── */}
          <div>
            <h3 className="font-heading text-gold-500 text-sm tracking-widest uppercase mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────── */}
          <div>
            <h3 className="font-heading text-gold-500 text-sm tracking-widest uppercase mb-5">
              Contact
            </h3>
            <ul className="space-y-3">
              {CONTACT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory-400 hover:text-gold-500 transition-colors"
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
      <div className="border-t border-noir-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-heading text-gold-500 text-sm tracking-[0.2em] uppercase">
            Best Aircraft Detailer
          </Link>
          <p className="text-xs text-ivory-500">
            &copy; {new Date().getFullYear()} Best Aircraft Detailer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
