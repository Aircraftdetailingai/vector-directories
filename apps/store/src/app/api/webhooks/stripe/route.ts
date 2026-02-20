import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_STORE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_STORE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    const { stripe } = await import("@vector/billing");

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await handleCheckoutCompleted(session);
        break;
      }
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  const orderItemsRaw = session.metadata?.order_items;
  if (!orderItemsRaw) {
    console.warn("No order_items in session metadata");
    return;
  }

  let parsedItems: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPrice: number;
  }>;

  try {
    parsedItems = JSON.parse(orderItemsRaw);
  } catch {
    console.error("Failed to parse order_items metadata");
    return;
  }

  const shippingDetails = session.shipping_details ?? session.shipping ?? null;
  const shippingName = shippingDetails?.name ?? null;
  const shippingAddress = shippingDetails?.address
    ? {
        line1: shippingDetails.address.line1,
        line2: shippingDetails.address.line2,
        city: shippingDetails.address.city,
        state: shippingDetails.address.state,
        postal_code: shippingDetails.address.postal_code,
        country: shippingDetails.address.country,
      }
    : null;

  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const taxAmount = (session.total_details?.amount_tax ?? 0) / 100;
  const shippingAmount = (session.total_details?.amount_shipping ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // Determine supplier_id from the first item's product
    let supplierId: string | null = null;
    if (parsedItems.length > 0) {
      const { data: productData } = await client
        .from("store_products")
        .select("supplier_id")
        .eq("id", parsedItems[0].productId)
        .single();

      supplierId = productData?.supplier_id ?? null;
    }

    // Create the order
    const { data: order, error: orderError } = await client
      .from("store_orders")
      .insert({
        email,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent ?? null,
        status: "paid",
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total,
        shipping_name: shippingName,
        shipping_address_json: shippingAddress,
        supplier_id: supplierId,
        user_id: null,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
      return;
    }

    // Create order items
    const orderItems = parsedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }));

    const { error: itemsError } = await client
      .from("store_order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Failed to create order items:", itemsError);
    }

    console.log(`Order ${order.id} created successfully for session ${session.id}`);
  } catch (err) {
    console.error("DB unavailable, order not persisted:", err);
  }
}
