import Link from "next/link";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Polishes", href: "/shop?category=polishes" },
  { label: "Towels", href: "/shop?category=towels" },
  { label: "Ceramic Coatings", href: "/shop?category=ceramic-coatings" },
  { label: "Cleaners", href: "/shop?category=cleaners" },
  { label: "Tools", href: "/shop?category=tools" },
  { label: "Kits", href: "/shop?category=kits" },
];

const resourceLinks = [
  { label: "Training", href: "/training" },
  { label: "Directories", href: "/directories" },
  { label: "Supplier Portal", href: "/supplier" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              Aircraft Detailing 101
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-navy-300">
              Your trusted source for professional aircraft detailing products
              and supplies. Shop top brands, explore training resources, and
              connect with the detailing community.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-navy-800 pt-8">
          <p className="text-center text-sm text-navy-400">
            &copy; {new Date().getFullYear()} Aircraft Detailing 101. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
