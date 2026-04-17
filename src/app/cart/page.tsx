"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { readCart, removeFromCart, updateQuantity } from "@/lib/cart";
import type { CartItem } from "@/lib/patterns";
import { formatPrice } from "@/lib/utils";

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-10 w-48 animate-pulse rounded-md bg-light" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex h-28 animate-pulse rounded-xl border border-border bg-white"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light">
        <ShoppingBag className="h-7 w-7 text-muted" />
      </div>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-primary sm:text-4xl">
        Your cart is empty
      </h1>
      <p className="mt-3 text-base text-muted">
        Find a pattern you love — every shirt is $50 with free shipping.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/collection">Shop the Collection</Link>
      </Button>
    </div>
  );
}

export default function CartPage() {
  const { toast } = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
    const onUpdate = () => setItems(readCart());
    window.addEventListener("estampa-cart-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("estampa-cart-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleQty = (id: string, qty: number) => {
    updateQuantity(id, qty);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = async () => {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Checkout failed");
      }
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url as string;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast({ title: "Checkout error", description: msg, variant: "destructive" });
      setCheckingOut(false);
    }
  };

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">Your Cart</h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} {items.length === 1 ? "item" : "items"} · Free shipping on every order
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <ul className="space-y-4">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;
            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${item.patternSlug}`}
                  className="relative aspect-[4/5] h-auto w-24 shrink-0 overflow-hidden rounded-md border border-border bg-light sm:h-28 sm:w-24"
                >
                  <Image
                    src={item.mockupImage}
                    alt={`${item.patternName} mockup`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.patternSlug}`}
                      className="block truncate text-base font-semibold text-primary hover:text-accent"
                    >
                      {item.patternName}
                    </Link>
                    <p className="text-xs text-muted">
                      Size <span className="font-mono font-semibold text-primary">{item.size}</span>
                      {" · "}
                      <span className="font-mono">{formatPrice(item.price)}</span> each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => handleQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-l-md hover:bg-light disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-9 w-10 items-center justify-center font-mono text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => handleQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="flex h-9 w-9 items-center justify-center rounded-r-md hover:bg-light disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-mono text-base font-bold text-primary w-20 text-right">
                      {formatPrice(lineTotal)}
                    </span>

                    <button
                      type="button"
                      aria-label={`Remove ${item.patternName} from cart`}
                      onClick={() => handleRemove(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-light hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Order Summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-mono font-semibold text-primary">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-mono font-semibold text-success">FREE</dd>
              </div>
              <div className="border-t border-border pt-3" />
              <div className="flex items-center justify-between">
                <dt className="text-base font-semibold text-primary">Total</dt>
                <dd className="font-mono text-2xl font-bold text-primary">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>

            <Button
              size="xl"
              className="mt-6 w-full"
              onClick={handleCheckout}
              disabled={checkingOut || items.length === 0}
            >
              {checkingOut && <Loader2 className="h-5 w-5 animate-spin" />}
              <span>{checkingOut ? "Redirecting…" : "Checkout"}</span>
            </Button>

            <p className="mt-3 text-center text-xs text-muted">
              Secure checkout · Pay once · Free shipping
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
