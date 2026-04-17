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

const links = [{ href: "/collection", label: "Collection" }];

function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem("sub-cart");
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
        "font-black text-2xl uppercase text-primary tracking-[0.15em] select-none",
        className
      )}
      aria-label="SUB home"
    >
      SUB
    </Link>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-primary hover:bg-light transition-colors"
      aria-label={`Cart (${count} items)`}
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

export function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCartCount(getCartCount());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sub-cart") setCartCount(getCartCount());
    };
    const onCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener("storage", onStorage);
    window.addEventListener("sub-cart-updated", onCartUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("sub-cart-updated", onCartUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Logo />
          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <CartIcon count={cartCount} />
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
                    SUB
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1">
                  {links.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      href="/cart"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/faq"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      FAQ
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-light transition-colors"
                    >
                      About
                    </Link>
                  </SheetClose>
                </nav>
                <div className="mt-6">
                  <SheetClose asChild>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/collection">Shop the Collection</Link>
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
