"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/lib/cart";

export function SuccessView() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") ?? "";

  useEffect(() => {
    // Clear the cart on arrival (runs once per mount).
    clearCart();
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={2} />
      </div>

      <h1 className="mt-6 text-4xl font-black tracking-tight text-primary sm:text-5xl">
        Thank you for your order!
      </h1>

      <p className="mt-4 max-w-md text-base text-muted">
        Your shirt is being printed! You&apos;ll receive a confirmation email shortly.
      </p>

      {sessionId && (
        <div className="mt-6 rounded-lg border border-border bg-light px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-muted">Order number</p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary break-all">
            {sessionId}
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 text-sm text-muted">
        <Package className="h-4 w-4" />
        <span>
          Estimated delivery:{" "}
          <span className="font-semibold text-primary">5–12 business days</span>
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {sessionId && (
          <Button asChild size="lg" variant="outline">
            <Link href={`/orders/${sessionId}`}>Track Your Order</Link>
          </Button>
        )}
        <Button asChild size="lg">
          <Link href="/collection">
            <Sparkles className="h-4 w-4" />
            Shop More Designs
          </Link>
        </Button>
      </div>
    </div>
  );
}
