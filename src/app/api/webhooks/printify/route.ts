import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PrintifyWebhookEvent {
  type: string;
  resource?: {
    id?: string;
    data?: {
      shipments?: {
        number?: string;
        url?: string;
        carrier?: string;
        status?: string;
      }[];
    };
  };
}

export async function POST(req: Request) {
  let event: PrintifyWebhookEvent;
  try {
    event = (await req.json()) as PrintifyWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const printifyOrderId = event.resource?.id;
  if (!printifyOrderId) return NextResponse.json({ received: true });

  const order = await prisma.order.findFirst({
    where: { printifyOrderId },
  });

  if (!order) {
    // Unknown order — acknowledge so Printify doesn't keep retrying.
    return NextResponse.json({ received: true });
  }

  if (event.type === "order:sent-to-production") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "production" },
    });
  } else if (event.type === "order:shipment:created") {
    const shipment = event.resource?.data?.shipments?.[0];
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "shipped",
        trackingNumber: shipment?.number ?? null,
        trackingUrl: shipment?.url ?? null,
      },
    });
  } else if (event.type === "order:shipment:delivered") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "delivered" },
    });
  }

  return NextResponse.json({ received: true });
}
