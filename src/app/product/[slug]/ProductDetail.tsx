"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Minus, Plus, Ruler } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/cart";
import {
  PRICE_CENTS,
  PRICE_BRL,
  SHIRT_SIZES,
  SIZE_CHART,
  type CartItem,
  type Pattern,
  type ShirtSize,
} from "@/lib/patterns";
import { cn, formatPrice, formatPriceBRL } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";

function SizeChartDialog({ tr }: { tr: typeof t["en"] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          <Ruler className="h-3 w-3" /> {tr.size_chart}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tr.size_chart}</DialogTitle>
          <DialogDescription>{tr.measurements_in}</DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Size</th>
                <th className="px-4 py-2 text-left font-semibold">Chest</th>
                <th className="px-4 py-2 text-left font-semibold">Length</th>
                <th className="px-4 py-2 text-left font-semibold">Sleeve</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-t border-border">
                  <td className="px-4 py-2 font-bold">{row.size}</td>
                  <td className="px-4 py-2">{row.chest}</td>
                  <td className="px-4 py-2">{row.length}</td>
                  <td className="px-4 py-2">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDetail({ pattern }: { pattern: Pattern }) {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const tr = t[locale];
  const [size, setSize] = useState<ShirtSize>("M");
  const [quantity, setQuantity] = useState(1);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  const totalUsd = PRICE_CENTS * quantity;
  const totalBrl = PRICE_BRL * quantity;

  const priceDisplay = locale === "pt" ? formatPriceBRL(PRICE_BRL) : formatPrice(PRICE_CENTS);
  const totalDisplay =
    locale === "pt" ? formatPriceBRL(totalBrl) : formatPrice(totalUsd);
  const unitLabel = locale === "pt" ? `R$120 × ${quantity} = ` : `$50 × ${quantity} = `;

  const handleAdd = async () => {
    setPhase("loading");
    const item: CartItem = {
      id: crypto.randomUUID(),
      patternSlug: pattern.slug,
      patternName: pattern.name,
      mockupImage: pattern.mockupImage,
      size,
      quantity,
      price: PRICE_CENTS,
      createdAt: new Date().toISOString(),
    };
    await new Promise((r) => setTimeout(r, 350));
    addToCart(item);
    setPhase("done");
    toast({ title: tr.added_to_cart, description: `${pattern.name} · ${size} × ${quantity}` });
    setTimeout(() => setPhase("idle"), 1600);
  };

  const incQuantity = () => setQuantity((q) => Math.min(10, q + 1));
  const decQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const addLabel =
    phase === "done"
      ? locale === "pt" ? "Adicionado!" : "Added!"
      : phase === "loading"
      ? locale === "pt" ? "Adicionando…" : "Adding…"
      : tr.add_to_cart;

  return (
    <div className="site-container py-8 xl:py-12">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/collection" className="hover:text-accent">
          ← Back to collection
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[55%_45%] lg:gap-12 xl:gap-16 2xl:gap-20">
        {/* Images */}
        <ProductGallery pattern={pattern} />

        {/* Info */}
        <div className="flex flex-col gap-6 xl:gap-7 xl:pt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl xl:text-5xl">
              {pattern.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                {pattern.category}
              </Badge>
            </div>
            <p className="mt-4 font-mono text-4xl font-bold text-accent xl:text-5xl">{priceDisplay}</p>
          </div>

          <p className="text-base leading-relaxed text-muted xl:text-lg">{pattern.description}</p>

          <div className="h-px bg-border" />

          {/* Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Size</h3>
              <SizeChartDialog tr={tr} />
            </div>
            <div className="grid grid-cols-6 gap-1.5 xl:gap-2">
              {SHIRT_SIZES.map((s) => {
                const selected = s === size;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={selected}
                    className={cn(
                      "h-11 rounded-md border text-sm font-semibold transition-colors xl:h-12 xl:text-base",
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-primary hover:border-accent hover:text-accent"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Quantity */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Quantity
            </h3>
            <div className="inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                onClick={decQuantity}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-l-md text-primary hover:bg-light disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center font-mono text-base font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incQuantity}
                aria-label="Increase quantity"
                disabled={quantity >= 10}
                className="flex h-10 w-10 items-center justify-center rounded-r-md text-primary hover:bg-light disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Price summary */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted">Total</span>
            <span className="font-mono text-2xl font-bold text-primary">
              {quantity > 1 ? (
                <>
                  <span className="text-sm font-normal text-muted">{unitLabel}</span>
                  {totalDisplay}
                </>
              ) : (
                totalDisplay
              )}
            </span>
          </div>

          {/* Add to cart */}
          <Button
            size="xl"
            className="w-full"
            onClick={handleAdd}
            disabled={phase !== "idle"}
            aria-label={tr.add_to_cart}
          >
            {phase === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
            {phase === "done" && <Check className="h-5 w-5" />}
            {phase === "idle" && null}
            <span>{addLabel}</span>
          </Button>

          <div className="h-px bg-border" />

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="print">
              <AccordionTrigger>About This Print</AccordionTrigger>
              <AccordionContent>
                All-over sublimation printing embeds the ink directly into the polyester fibers,
                so the design never cracks, peels, or fades the way a screen-printed tee does.
                Edge-to-edge coverage means every shirt is cut from a fully-printed panel — each
                piece is slightly unique.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="material">
              <AccordionTrigger>Material & Fit</AccordionTrigger>
              <AccordionContent>
                100% premium performance polyester, soft-handed and breathable. Unisex regular
                fit with a classic crew neck. Runs true to size — when in doubt, size up.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                Free shipping on every order. Printed on demand and delivered in 5–12 days. Since
                each tee is printed to order, we only accept returns for manufacturing
                defects — reach out within 30 days and we&apos;ll make it right.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="text-xs text-muted">
            Designed by{" "}
            <a
              href="https://instagram.com/saradiasestampa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-accent"
            >
              Sara Dias
            </a>
            . Follow{" "}
            <a
              href="https://instagram.com/saradiasestampa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @saradiasestampa
            </a>{" "}
            on Instagram.
          </p>
        </div>
      </div>
    </div>
  );
}
