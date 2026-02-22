import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Aircraft Detailing Near Me",
  description:
    "Privacy Policy for Aircraft Detailing Near Me. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 20, 2026
          </p>

          <div className="mt-10 space-y-10 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Information We Collect
              </h2>
              <p className="mt-3 leading-relaxed">
                When you use Aircraft Detailing Near Me, we may collect personal
                information that you voluntarily provide, including your name and
                email address when you submit forms on our site. We also collect
                usage data automatically, such as pages visited, time spent on
                the site, and browsing patterns, to help us understand how our
                services are used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
              <p className="mt-3 leading-relaxed">
                We use the information we collect to respond to your inquiries
                and requests, improve our services and user experience, send you
                relevant communications about Aircraft Detailing Near Me, and
                maintain the security and functionality of our platform at
                aircraftdetailingnearme.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Information Sharing
              </h2>
              <p className="mt-3 leading-relaxed">
                We do not sell your personal data to third parties. We may share
                your information with trusted service providers who assist us in
                operating our website, conducting our business, or servicing you,
                so long as those parties agree to keep your information
                confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Cookies and Tracking
              </h2>
              <p className="mt-3 leading-relaxed">
                Aircraft Detailing Near Me uses standard cookies to ensure the
                proper functionality of our website. These cookies help us
                remember your preferences, understand how you navigate our site,
                and provide a better overall experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="mt-3 leading-relaxed">
                We implement reasonable security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the Internet or electronic storage is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Your Rights
              </h2>
              <p className="mt-3 leading-relaxed">
                You have the right to access, correct, or delete your personal
                data that we hold. You may also request a copy of the information
                we have collected about you. We will respond to your request in a
                reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
              <p className="mt-3 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please visit our{" "}
                <a
                  href="/contact"
                  className="text-sky-500 underline hover:text-sky-600"
                >
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
