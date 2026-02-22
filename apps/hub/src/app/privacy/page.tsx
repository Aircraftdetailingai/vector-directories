import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Aviation Detailing Hub",
  description:
    "Learn how Aviation Detailing Hub collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-teal-600">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Effective date: February 20, 2026
          </p>

          <div className="mt-10 space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-teal-600">
                Information We Collect
              </h2>
              <p className="mt-3">
                When you use Aviation Detailing Hub (aviationdetailinghub.com),
                we may collect the following types of information:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong>Account Information:</strong> Name, email address, and
                  password when you create an account.
                </li>
                <li>
                  <strong>Business Listing Data:</strong> Company name, address,
                  phone number, services offered, and other details you provide
                  when claiming or creating a listing.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, search queries,
                  browser type, device information, and IP address collected
                  automatically through server logs and analytics.
                </li>
                <li>
                  <strong>Contact Information:</strong> Name, email, and message
                  content when you reach out through our contact form.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">
                How We Use Your Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>To operate, maintain, and improve our platform.</li>
                <li>
                  To display business listings and connect users with aviation
                  detailing service providers.
                </li>
                <li>To respond to inquiries and provide customer support.</li>
                <li>To send transactional emails related to your account.</li>
                <li>
                  To detect, prevent, and address fraud or technical issues.
                </li>
                <li>
                  To analyze usage trends and improve the user experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">
                Information Sharing
              </h2>
              <p className="mt-3">
                We do not sell your personal information. We may share data in
                the following circumstances:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  vendors who assist in operating our platform (hosting, email
                  delivery, analytics).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  regulation, or legal process.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets.
                </li>
                <li>
                  <strong>Public Listings:</strong> Business information
                  submitted for directory listings is displayed publicly by
                  design.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">Cookies</h2>
              <p className="mt-3">
                We use cookies and similar tracking technologies to maintain your
                session, remember your preferences, and understand how you
                interact with our platform. You can manage cookie preferences
                through your browser settings. Disabling cookies may affect
                certain features of the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">
                Data Security
              </h2>
              <p className="mt-3">
                We implement industry-standard security measures to protect your
                personal information, including encryption in transit (TLS/SSL)
                and secure storage practices. However, no method of transmission
                over the Internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">
                Your Rights
              </h2>
              <p className="mt-3">
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your personal data.</li>
                <li>Opt out of marketing communications.</li>
                <li>
                  Request a portable copy of your data in a structured format.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please visit our{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 underline hover:text-teal-700"
                >
                  contact page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-600">Contact</h2>
              <p className="mt-3">
                If you have questions or concerns about this Privacy Policy,
                please reach out through our{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 underline hover:text-teal-700"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
