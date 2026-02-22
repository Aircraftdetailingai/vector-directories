import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { ContactForm } from "./components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Aviation Detailing Hub",
  description:
    "Get in touch with Aviation Detailing Hub. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-teal-600">
            Contact Us
          </h1>
          <p className="mt-2 text-gray-600">
            Have a question or feedback? Fill out the form below and we&apos;ll
            get back to you.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
