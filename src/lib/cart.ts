import type { CartItem } from "./patterns";

const KEY = "estampa-cart";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("estampa-cart-updated"));
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  notifyChange();
}

export function addToCart(item: CartItem) {
  const items = readCart();
  items.push(item);
  writeCart(items);
}

export function updateQuantity(id: string, qty: number) {
  const items = readCart();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], quantity: Math.max(1, Math.min(10, qty)) };
  writeCart(items);
}

export function removeFromCart(id: string) {
  const items = readCart().filter((i) => i.id !== id);
  writeCart(items);
}

export function clearCart() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  notifyChange();
}

export function getCartItem(id: string): CartItem | undefined {
  return readCart().find((i) => i.id === id);
}

export function updateCartItem(id: string, patch: Partial<CartItem>) {
  const items = readCart();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...patch };
  writeCart(items);
}
