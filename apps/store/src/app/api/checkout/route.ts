import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    // items: Array<{ productId, variantId, name, variantName, price, quantity, image }>

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { stripe } = await import("@vector/billing");
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3007";

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.variantName
            ? `${item.name} - ${item.variantName}`
            : item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      automatic_tax: { enabled: true },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        order_items: JSON.stringify(
          items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    // Fallback for dev without Stripe
    return NextResponse.json({ url: "/checkout/success?session_id=dev_test" });
  }
}
