import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Advertise With Us | Aircraft Detailing 101",
  description:
    "Reach aircraft detailing decision-makers. Advertise on Aircraft Detailing 101.",
};

const PLACEMENTS = [
  {
    type: "top_banner",
    name: "Top Banner",
    price: "$199/mo",
    dimensions: "728 x 90",
    description:
      "Premium placement at the top of every page. Maximum visibility for your brand.",
  },
  {
    type: "sidebar",
    name: "Sidebar",
    price: "$149/mo",
    dimensions: "300 x 250",
    description:
      "Persistent sidebar placement visible throughout browsing sessions.",
  },
  {
    type: "featured_boost",
    name: "Featured Boost",
    price: "$99/mo",
    dimensions: "200 x 200",
    description:
      "Boost your product to the top of search results with a featured badge.",
  },
  {
    type: "category_sponsor",
    name: "Category Sponsor",
    price: "$249/mo",
    dimensions: "728 x 90",
    description:
      "Own an entire category page with exclusive banner placement.",
  },
  {
    type: "homepage_spotlight",
    name: "Homepage Spotlight",
    price: "$299/mo",
    dimensions: "600 x 400",
    description:
      "Large featured placement on the homepage. Ideal for brand awareness.",
  },
  {
    type: "popup",
    name: "Popup",
    price: "$349/mo",
    dimensions: "500 x 400",
    description:
      "High-impact popup shown to visitors once per session. Highest conversion rate.",
  },
] as const;

const STATS = [
  { value: "10,000+", label: "Monthly Visitors" },
  { value: "50+", label: "Listed Companies" },
  { value: "All 50", label: "US States" },
];

const FAQS = [
  {
    q: "How does billing work?",
    a: "All ad placements are billed monthly via Stripe. You can cancel anytime from your advertiser dashboard.",
  },
  {
    q: "Can I change my ad creative?",
    a: "Yes. You can update your ad image, title, and destination URL at any time from your dashboard.",
  },
  {
    q: "How are impressions tracked?",
    a: "Every ad view and click is tracked in real time. View detailed analytics in your advertiser dashboard.",
  },
  {
    q: "What image formats are supported?",
    a: "We accept PNG, JPG, and WebP images. Upload a URL to your hosted image during checkout.",
  },
];

export default function AdvertisePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy-900 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Advertise With Us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-200">
              Reach thousands of aircraft detailing decision-makers every month.
              Place your brand in front of the professionals who matter.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-gray-200 bg-white py-12">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Placements grid */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-navy-900">
              Available Ad Placements
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
              Choose the placement that best fits your advertising goals.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PLACEMENTS.map((p) => (
                <div
                  key={p.type}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-navy-900">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {p.price}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {p.dimensions} pixels
                  </p>
                  <p className="mt-3 flex-1 text-sm text-gray-600">
                    {p.description}
                  </p>
                  <Link
                    href={`/advertise/checkout?placement=${p.type}`}
                    className="mt-6 block rounded-lg bg-navy-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-navy-900">
              Frequently Asked Questions
            </h2>
            <dl className="mt-10 space-y-8">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt className="text-base font-semibold text-gray-900">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 text-sm text-gray-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-900 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white">
              Ready to Grow Your Business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-navy-300">
              Start advertising today and connect with aircraft detailing
              professionals across the country.
            </p>
            <Link
              href="/advertise/checkout?placement=top_banner"
              className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gray-100"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
