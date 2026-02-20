import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { CartContent } from "./components/cart-content";

export const metadata: Metadata = {
  title: "Shopping Cart | Aircraft Detailing 101",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <CartContent />
      </main>
      <Footer />
    </div>
  );
}
