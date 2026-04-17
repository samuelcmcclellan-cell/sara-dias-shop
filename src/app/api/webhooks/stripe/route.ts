import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getPattern } from "@/lib/patterns";
import { getStripe, isStripeDemoMode, isWebhookDemoMode } from "@/lib/stripe";
import {
  uploadImage,
  createProduct,
  createOrder,
  sendToProduction,
} from "@/lib/printify";
import { SIZE_TO_VARIANT, SELL_PRICE } from "@/lib/printify-variants";
import type { ShirtSize } from "@/lib/patterns";

interface CompactItem {
  s: string; // patternSlug
  sz: string; // size
  q: number; // quantity
}

function parseMetadataItems(raw: string | null | undefined): CompactItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CompactItem[];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  let event: Stripe.Event;

  if (isWebhookDemoMode()) {
    // Skip signature verification in demo mode — parse directly.
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else if (isStripeDemoMode()) {
    // No Stripe SDK available to verify — treat as demo.
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signature verification failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency — if we already recorded this session, skip.
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) return NextResponse.json({ received: true });

    const email = session.customer_details?.email ?? "unknown@sub.local";
    // `shipping_details` was renamed/removed across Stripe API versions —
    // read via index access so older + newer API versions both work.
    const shipping =
      (session as unknown as { shipping_details?: unknown }).shipping_details ??
      (session as unknown as { collected_information?: { shipping_details?: unknown } })
        .collected_information?.shipping_details ??
      null;
    const compactItems = parseMetadataItems(session.metadata?.items);

    const items = compactItems
      .map((ci) => {
        const pattern = getPattern(ci.s);
        if (!pattern) return null;
        return {
          patternSlug: pattern.slug,
          patternName: pattern.name,
          mockupImageUrl: pattern.mockupImage,
          size: ci.sz,
          quantity: ci.q,
          price: pattern.price,
        };
      })
      .filter((i): i is NonNullable<typeof i> => i !== null);

    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        email,
        status: "paid",
        shippingAddress: shipping ? JSON.stringify(shipping) : "{}",
        total:
          typeof session.amount_total === "number"
            ? session.amount_total
            : items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    // -----------------------------------------------------------------------
    // Printify fulfillment — wrapped in try/catch so errors never cause a
    // webhook retry storm. The order is already saved; fulfillment failure
    // just leaves status="paid" for manual intervention.
    // -----------------------------------------------------------------------
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

      // Collect unique pattern slugs among ordered items.
      const uniqueSlugs = [...new Set(order.items.map((i) => i.patternSlug))];

      // For each unique pattern, resolve or upload its Printify image ID.
      const slugToProductId: Record<string, string> = {};
      for (const slug of uniqueSlugs) {
        const pattern = getPattern(slug);
        if (!pattern) continue;

        // Use pre-uploaded image ID when available; otherwise upload now.
        let imageId = pattern.printifyImageId ?? "";
        if (!imageId) {
          const tileUrl = `${appUrl}${pattern.patternTile}`;
          imageId = await uploadImage(tileUrl, `${slug}-tile.jpg`);
        }

        // Size variants needed for this pattern across all order items.
        const patternItems = order.items.filter((i) => i.patternSlug === slug);
        const variantIds = [...new Set(patternItems.map((i) => i.size as ShirtSize))].map(
          (size) => ({ variantId: SIZE_TO_VARIANT[size], price: SELL_PRICE })
        );

        const { productId } = await createProduct({
          title: pattern.name,
          description: pattern.description,
          printifyImageId: imageId,
          variants: variantIds,
        });

        slugToProductId[slug] = productId;
      }

      // Build Printify line items.
      const lineItems = order.items.map((item) => ({
        productId: slugToProductId[item.patternSlug] ?? "",
        variantId: SIZE_TO_VARIANT[item.size as ShirtSize],
        quantity: item.quantity,
      }));

      // Parse shipping address stored as JSON.
      let addr: Record<string, string> = {};
      try {
        addr = JSON.parse(order.shippingAddress) as Record<string, string>;
      } catch {
        // leave as empty object; Printify will error and it'll surface in logs
      }

      const nameParts = (
        (addr as unknown as { name?: string }).name ?? "Unknown Customer"
      ).split(" ");
      const firstName = nameParts[0] ?? "Unknown";
      const lastName = nameParts.slice(1).join(" ") || "Customer";

      const addrTo = (addr as unknown as {
        address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string };
      }).address ?? {};

      const printifyOrderId = await createOrder({
        externalId: order.id,
        lineItems,
        address: {
          first_name: firstName,
          last_name: lastName,
          email: order.email,
          phone: "",
          country: addrTo.country ?? "US",
          region: addrTo.state ?? "",
          address1: addrTo.line1 ?? "",
          address2: addrTo.line2 ?? "",
          city: addrTo.city ?? "",
          zip: addrTo.postal_code ?? "",
        },
      });

      await sendToProduction(printifyOrderId);

      await prisma.order.update({
        where: { id: order.id },
        data: { printifyOrderId, status: "production" },
      });
    } catch (err) {
      console.error("[stripe-webhook] Printify fulfillment failed:", err);
      // Do NOT rethrow — order is saved, webhook must return 200.
    }
  }

  return NextResponse.json({ received: true });
}
