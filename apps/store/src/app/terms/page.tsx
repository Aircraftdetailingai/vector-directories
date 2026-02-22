import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Aircraft Detailing 101",
  description:
    "Read the terms and conditions for using Aircraft Detailing 101.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-[#0F172A]">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 20, 2026
          </p>

          <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using Aircraft Detailing 101
                (aircraftdetailing101.com), you agree to be bound by these Terms
                of Service. If you do not agree to these terms, please do not
                use our website.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                2. Description of Service
              </h2>
              <p className="mt-3">
                Aircraft Detailing 101 is an online store and resource platform
                for professional aircraft detailing products, supplies, and
                training materials. We provide product listings, training
                resources, supplier connections, and tools for detailing
                professionals.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                3. User Accounts
              </h2>
              <p className="mt-3">
                Some features of our service require you to create an account.
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                4. Orders and Payments
              </h2>
              <p className="mt-3">
                All orders placed through our website are subject to
                acceptance and availability. We reserve the right to refuse or
                cancel any order for any reason. Prices are subject to change
                without notice. Payment must be received before orders are
                processed and shipped.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                5. Shipping and Returns
              </h2>
              <p className="mt-3">
                Shipping times and costs vary by location and shipping method.
                Please review our shipping and return policies at the time of
                purchase for specific details regarding returns, exchanges, and
                refunds.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                6. Intellectual Property
              </h2>
              <p className="mt-3">
                All content on this website, including but not limited to text,
                graphics, logos, images, product descriptions, and software, is
                the property of Aircraft Detailing 101 or its content suppliers
                and is protected by intellectual property laws. You may not
                reproduce, distribute, or create derivative works without our
                prior written consent.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                7. Prohibited Conduct
              </h2>
              <p className="mt-3">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Use the service for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Submit false, misleading, or inaccurate information.
                </li>
                <li>
                  Interfere with or disrupt the service or servers connected to
                  the service.
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  service.
                </li>
                <li>
                  Scrape, harvest, or collect information from the service
                  without our consent.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                8. Disclaimer of Warranties
              </h2>
              <p className="mt-3">
                The service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, either express
                or implied. We do not warrant that the service will be
                uninterrupted, error-free, or free of viruses or other harmful
                components.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                9. Limitation of Liability
              </h2>
              <p className="mt-3">
                To the fullest extent permitted by law, Aircraft Detailing 101
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or relating
                to your use of the service, including but not limited to
                product purchases.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                10. Termination
              </h2>
              <p className="mt-3">
                We reserve the right to terminate or suspend your access to the
                service at any time, without prior notice or liability, for any
                reason, including if you breach these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                11. Changes to Terms
              </h2>
              <p className="mt-3">
                We may revise these Terms of Service at any time. Changes will
                be effective when posted on this page with an updated date.
                Your continued use of the service after any changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                12. Governing Law
              </h2>
              <p className="mt-3">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the United States, without regard
                to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-[#0F172A]">
                13. Contact Us
              </h2>
              <p className="mt-3">
                If you have any questions about these Terms of Service, please
                visit our{" "}
                <a href="/contact" className="text-[#F97316] underline hover:text-orange-600">
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
