import Link from "next/link";

const serviceLinks = [
  { name: "Ceramic Coating", href: "/services/ceramic-coating" },
  { name: "Interior Detailing", href: "/services/interior-detailing" },
  { name: "Paint Correction", href: "/services/paint-correction" },
  { name: "Brightwork Polish", href: "/services/brightwork-polish" },
  { name: "Exterior Wash", href: "/services/exterior-wash" },
  { name: "Full Detail", href: "/services/full-detail" },
  { name: "Window Treatment", href: "/services/window-treatment" },
  { name: "Engine Detailing", href: "/services/engine-detailing" },
];

const businessLinks = [
  { name: "Claim Your Listing", href: "/claim" },
  { name: "Pricing & Plans", href: "/pricing" },
  { name: "Advertise With Us", href: "/advertise" },
  { name: "Business Resources", href: "/resources" },
];

const communityLinks = [
  { name: "About the Hub", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-teal-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* ── Brand Column ───────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-teal-300"
              >
                <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M8 20l8-6 4 1 8-7 1 1-5 9-1 4-6 8z" fill="currentColor" opacity="0.9" />
                <circle cx="7" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
                <circle cx="28" cy="26" r="1.5" fill="currentColor" opacity="0.4" />
                <circle cx="26" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
              </svg>
              <span className="text-white font-heading font-bold text-lg">
                Aviation Detailing Hub
              </span>
            </div>
            <p className="text-teal-300 text-sm leading-relaxed mb-6 max-w-xs">
              The friendliest community for aircraft care. Connect with trusted
              detailing professionals and keep your aircraft looking its best.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-teal-400 font-body">Follow us:</span>
              {/* Social placeholder icons */}
              {["facebook", "instagram", "twitter"].map((platform) => (
                <a
                  key={platform}
                  href={`https://${platform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-teal-800 hover:bg-coral-400 flex items-center justify-center transition-colors"
                  aria-label={platform}
                >
                  <span className="text-xs text-teal-200 hover:text-white">
                    {platform[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Services Column ─────────────────────────────────────── */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-teal-300 hover:text-coral-400 text-sm font-body transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── For Businesses Column ───────────────────────────────── */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              For Businesses
            </h3>
            <ul className="space-y-2.5">
              {businessLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-teal-300 hover:text-coral-400 text-sm font-body transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Community Column ────────────────────────────────────── */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-teal-300 hover:text-coral-400 text-sm font-body transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────── */}
      <div className="border-t border-teal-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-teal-400 text-xs font-body text-center sm:text-left">
            &copy; 2025 Aviation Detailing Hub. Made with care for the aviation community.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-teal-400 hover:text-coral-400 text-xs font-body transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-teal-400 hover:text-coral-400 text-xs font-body transition-colors">
              Terms
            </Link>
            <Link href="/sitemap" className="text-teal-400 hover:text-coral-400 text-xs font-body transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
