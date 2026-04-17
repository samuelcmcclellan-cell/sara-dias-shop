import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPattern, SHIRT_SIZES, type CartItem, type ShirtSize } from "@/lib/patterns";
import { getStripe, isStripeDemoMode } from "@/lib/stripe";

interface CheckoutBody {
  items: CartItem[];
}

const DEMO_SHIPPING = {
  name: "Demo Customer",
  line1: "123 Prototype Ln",
  city: "Testville",
  state: "CA",
  postal: "94000",
  country: "US",
};

function validate(items: unknown): items is CartItem[] {
  if (!Array.isArray(items) || items.length === 0) return false;
  for (const item of items) {
    if (!item || typeof item !== "object") return false;
    const it = item as Partial<CartItem>;
    if (typeof it.patternSlug !== "string" || !getPattern(it.patternSlug)) return false;
    if (typeof it.size !== "string" || !SHIRT_SIZES.includes(it.size as ShirtSize)) return false;
    if (typeof it.quantity !== "number" || it.quantity < 1 || it.quantity > 10) return false;
    if (typeof it.price !== "number") return false;
    if (typeof it.patternName !== "string") return false;
    if (typeof it.mockupImage !== "string") return false;
  }
  return true;
}

function isPublicHttpUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname;
    // Stripe rejects localhost / 127.* URLs in product images
    if (host === "localhost" || host.startsWith("127.") || host.endsWith(".local")) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!validate(body.items)) {
    return NextResponse.json(
      { error: "Invalid cart items — check pattern, size, and quantity." },
      { status: 400 }
    );
  }

  const items = body.items;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // --- DEMO MODE ---
  if (isStripeDemoMode()) {
    const sessionId = `demo_${crypto.randomUUID()}`;
    await prisma.order.create({
      data: {
        stripeSessionId: sessionId,
        email: "demo@sub.local",
        status: "paid",
        shippingAddress: JSON.stringify(DEMO_SHIPPING),
        total,
        items: {
          create: items.map((i) => ({
            patternSlug: i.patternSlug,
            patternName: i.patternName,
            mockupImageUrl: i.mockupImage,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });
    return NextResponse.json({
      url: `/checkout/success?session_id=${sessionId}`,
    });
  }

  // --- REAL STRIPE MODE ---
  try {
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const line_items = items.map((i) => {
      const fullImageUrl = `${appUrl}${i.mockupImage}`;
      const imagesField = isPublicHttpUrl(fullImageUrl) ? [fullImageUrl] : undefined;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `SUB — ${i.patternName} (Size ${i.size})`,
            ...(imagesField ? { images: imagesField } : {}),
          },
          unit_amount: i.price,
        },
        quantity: i.quantity,
      };
    });

    // Stripe metadata values have a 500-char cap per key — use short keys.
    const compactItems = items.map((i) => ({
      s: i.patternSlug,
      sz: i.size,
      q: i.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        items: JSON.stringify(compactItems),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe returned no session URL" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
