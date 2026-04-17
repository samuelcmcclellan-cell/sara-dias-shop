import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Circle, Package, Truck, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type OrderStatus = "paid" | "production" | "shipped" | "delivered";

const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "paid", label: "Ordered", desc: "Payment confirmed" },
  { key: "production", label: "Printing", desc: "Your tee is being printed" },
  { key: "shipped", label: "Shipped", desc: "On its way to you" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your tee!" },
];

const STATUS_ORDER: OrderStatus[] = ["paid", "production", "shipped", "delivered"];

function stepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status as OrderStatus);
  return idx === -1 ? 0 : idx;
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try lookup by cuid id first, then by stripeSessionId (success page links with session_id).
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { stripeSessionId: id }] },
    include: { items: true },
  });

  if (!order) notFound();

  const currentStep = stepIndex(order.status);

  let shippingAddr: Record<string, unknown> = {};
  try {
    shippingAddr = JSON.parse(order.shippingAddress) as Record<string, unknown>;
  } catch {
    // ignore
  }

  const addrTo = (shippingAddr as { address?: Record<string, string> }).address ?? {};
  const addrName = (shippingAddr as { name?: string }).name ?? "";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(order.createdAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Order tracking</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-primary">
          Your Order
        </h1>
        <p className="mt-1 text-sm text-muted">
          Placed {formattedDate} · {order.email}
        </p>
      </div>

      {/* Status stepper */}
      <div className="mb-10 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={step.key} className="flex flex-1 flex-col items-center gap-2">
                {/* Connector line left */}
                <div className="flex w-full items-center">
                  <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || active ? "bg-accent" : "bg-border"}`} />
                  <div className="shrink-0">
                    {done ? (
                      <CheckCircle className="h-7 w-7 text-accent" />
                    ) : active ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                      </div>
                    ) : (
                      <Circle className="h-7 w-7 text-border" />
                    )}
                  </div>
                  <div className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "invisible" : done ? "bg-accent" : "bg-border"}`} />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wide ${active ? "text-accent" : done ? "text-primary" : "text-muted"}`}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 hidden text-xs text-muted sm:block">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated delivery note (visible while in production or shipped) */}
      {(order.status === "production" || order.status === "shipped") && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-light px-4 py-3">
          <Package className="h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm text-muted">
            Estimated delivery: <span className="font-semibold text-primary">5–12 business days</span> from print date.
          </p>
        </div>
      )}

      {/* Shipping card (once shipped) */}
      {(order.status === "shipped" || order.status === "delivered") && (
        <div className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <h2 className="text-base font-bold text-primary">Shipping Info</h2>
          </div>
          {order.trackingNumber && (
            <p className="text-sm text-muted">
              Tracking:{" "}
              <span className="font-mono font-semibold text-primary">{order.trackingNumber}</span>
            </p>
          )}
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Track shipment <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
          {addrName && (
            <div className="mt-3 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <span>
                {addrName}
                {addrTo.line1 && <>, {addrTo.line1}</>}
                {addrTo.line2 && <> {addrTo.line2}</>}
                {addrTo.city && <>, {addrTo.city}</>}
                {addrTo.state && <> {addrTo.state}</>}
                {addrTo.postal_code && <> {addrTo.postal_code}</>}
                {addrTo.country && <>, {addrTo.country}</>}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Order items card */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-primary">Order Details</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              {item.mockupImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.mockupImageUrl}
                  alt={item.patternName}
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{item.patternName}</p>
                <p className="text-xs text-muted">
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-mono text-sm font-bold text-primary">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border pt-4 text-right">
          <p className="text-xs text-muted">
            Total (incl. free shipping):{" "}
            <span className="font-mono text-base font-black text-primary">
              ${(order.total / 100).toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="outline" size="xl">
          <Link href="/collection">Shop More Designs</Link>
        </Button>
      </div>
    </div>
  );
}
