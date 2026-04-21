"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";

function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem("estampa-cart");
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-black text-2xl lg:text-[1.65rem] uppercase text-primary tracking-[0.15em] select-none",
        className
      )}
      aria-label="ESTAMPA home"
    >
      ESTAMPA
    </Link>
  );
}

function CartIcon({ count, label }: { count: number; label: string }) {
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-primary hover:bg-light transition-colors"
      aria-label={`${label} (${count} items)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => setLocale("en")}
        title="Switch to English"
        className={cn(
          "rounded-md p-1 text-xl transition-all",
          locale === "en" ? "bg-light scale-110" : "opacity-40 hover:opacity-70"
        )}
      >
        🇺🇸
      </button>
      <button
        onClick={() => setLocale("pt")}
        title="Mudar para Português"
        className={cn(
          "rounded-md p-1 text-xl transition-all",
          locale === "pt" ? "bg-light scale-110" : "opacity-40 hover:opacity-70"
        )}
      >
        🇧🇷
      </button>
    </div>
  );
}

export function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();
  const tr = t[locale];

  useEffect(() => {
    setCartCount(getCartCount());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "estampa-cart") setCartCount(getCartCount());
    };
    const onCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("storage", onStorage);
    window.addEventListener("estampa-cart-updated", onCartUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("estampa-cart-updated", onCartUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="site-container flex h-16 items-center justify-between lg:h-20">
        {/* Logo + desktop nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Logo />
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/collection"
                className="text-sm lg:text-[0.95rem] font-medium text-primary hover:text-accent transition-colors"
              >
                {tr.nav_collection}
              </Link>
              <Link
                href="/faq"
                className="text-sm lg:text-[0.95rem] font-medium text-primary hover:text-accent transition-colors"
              >
                {tr.nav_faq}
              </Link>
              <Link
                href="/about"
                className="text-sm lg:text-[0.95rem] font-medium text-primary hover:text-accent transition-colors"
              >
                {tr.nav_about}
              </Link>
            </nav>
            <span className="border border-border rounded-full px-3 py-1 text-xs text-muted bg-white">
              {tr.ships_to}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-3">
          <LanguageToggle />
          <CartIcon count={cartCount} label={tr.nav_cart} />
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-primary"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-left font-black uppercase tracking-[0.15em]">
                    ESTAMPA
                  </SheetTitle>
                </SheetHeader>
                {/* Language toggle + shipping pill */}
                <div className="mt-4 flex items-center gap-2">
                  <LanguageToggle />
                  <span className="text-xs text-muted">{tr.ships_to}</span>
                </div>
                <nav className="mt-6 flex flex-col gap-1">
                  <SheetClose asChild>
                    <Link
                      href="/collection"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      {tr.nav_collection}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/cart"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      {tr.nav_cart} {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/faq"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      {tr.nav_faq}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      {tr.nav_about}
                    </Link>
                  </SheetClose>
                </nav>
                <div className="mt-6">
                  <SheetClose asChild>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/collection">{tr.hero_cta_primary}</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
