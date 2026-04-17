import type { ShirtSize } from "./patterns";

/**
 * Maps each shirt size to its Printify blueprint variant ID.
 * Replace these 0s with real variant IDs once you've fetched them from:
 *   GET https://api.printify.com/v1/catalog/blueprints/{blueprintId}/print_providers/{providerId}/variants.json
 */
export const SIZE_TO_VARIANT: Record<ShirtSize, number> = {
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  "2XL": 0,
  "3XL": 0,
};

/** Retail price in cents (what the customer pays). */
export const SELL_PRICE = 3000;

/** Printify base cost in cents (used for profit tracking; 0 until real costs are known). */
export const COST_PRICE = 0;
