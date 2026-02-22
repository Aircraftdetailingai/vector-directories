import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Best Aircraft Detailer",
  description:
    "Learn how Best Aircraft Detailer collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-noir-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 20, 2026
          </p>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                1. Introduction
              </h2>
              <p className="mt-3">
                Best Aircraft Detailer (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) operates the website bestaircraftdetailer.com.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                We may collect information about you in a variety of ways,
                including:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong>Personal Data:</strong> Name, email address, and other
                  contact information you voluntarily provide when using our
                  contact form or creating an account.
                </li>
                <li>
                  <strong>Business Data:</strong> Company name, service details,
                  and portfolio information submitted by detailing professionals
                  who claim or create listings.
                </li>
                <li>
                  <strong>Usage Data:</strong> Browser type, operating system,
                  pages visited, time spent on pages, and other diagnostic data
                  collected automatically.
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> We use cookies and
                  similar tracking technologies to monitor activity and store
                  certain information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                3. How We Use Your Information
              </h2>
              <p className="mt-3">
                We use the information we collect to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Operate, maintain, and improve our website and services.</li>
                <li>
                  Process and manage listing claims and business profiles.
                </li>
                <li>
                  Respond to your inquiries and provide customer support.
                </li>
                <li>
                  Send you updates, marketing communications, and other
                  information that may be of interest to you (you may opt out at
                  any time).
                </li>
                <li>Monitor and analyze usage and trends to improve user experience.</li>
                <li>Detect, prevent, and address technical issues or fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                4. Sharing of Information
              </h2>
              <p className="mt-3">
                We do not sell your personal information. We may share
                information with third parties in the following situations:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with third-party vendors who perform services on our behalf,
                  such as hosting, analytics, and email delivery.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required to do so by law or in response to
                  valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets, your information may
                  be transferred.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                5. Data Security
              </h2>
              <p className="mt-3">
                We use administrative, technical, and physical security measures
                to protect your personal information. However, no method of
                transmission over the Internet or electronic storage is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                6. Your Rights
              </h2>
              <p className="mt-3">
                Depending on your location, you may have certain rights
                regarding your personal information, including the right to
                access, correct, or delete your data. To exercise these rights,
                please visit our{" "}
                <a href="/contact" className="text-gold-500 underline hover:text-gold-600">
                  contact page
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                7. Third-Party Links
              </h2>
              <p className="mt-3">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of those
                sites. We encourage you to review the privacy policy of every
                site you visit.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                8. Children&apos;s Privacy
              </h2>
              <p className="mt-3">
                Our services are not directed to individuals under the age of
                13. We do not knowingly collect personal information from
                children under 13. If we learn that we have collected such
                information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                9. Changes to This Policy
              </h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date. You are advised
                to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-noir-900">
                10. Contact Us
              </h2>
              <p className="mt-3">
                If you have any questions about this Privacy Policy, please
                visit our{" "}
                <a href="/contact" className="text-gold-500 underline hover:text-gold-600">
                  contact page
                </a>
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
