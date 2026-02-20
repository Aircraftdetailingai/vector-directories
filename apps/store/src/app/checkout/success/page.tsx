import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { SuccessContent } from "./components/success-content";

export const metadata: Metadata = {
  title: "Order Confirmed | Aircraft Detailing 101",
  description: "Your order has been confirmed. Thank you for your purchase.",
};

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const sessionId = searchParams.session_id ?? null;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <SuccessContent sessionId={sessionId} />
      </main>
      <Footer />
    </div>
  );
}
