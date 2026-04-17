import Stripe from "stripe";

export const STRIPE_PLACEHOLDER = "sk_test_placeholder";
export const STRIPE_WEBHOOK_PLACEHOLDER = "whsec_placeholder";

export function isStripeDemoMode(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !key || key === STRIPE_PLACEHOLDER;
}

export function isWebhookDemoMode(): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  return !secret || secret === STRIPE_WEBHOOK_PLACEHOLDER;
}

/**
 * Lazily-constructed Stripe client. Throws if called in demo mode — callers
 * should branch on `isStripeDemoMode()` first.
 */
export function getStripe(): Stripe {
  if (isStripeDemoMode()) {
    throw new Error("Stripe is in demo mode — do not call getStripe().");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}
