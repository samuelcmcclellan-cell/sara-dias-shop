/**
 * Printify REST API helpers.
 *
 * Every function checks IS_DEMO first and returns plausible mock data without
 * making any network call when PRINTIFY_API_TOKEN is missing or "placeholder".
 */

const TOKEN = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const BLUEPRINT_ID = process.env.PRINTIFY_BLUEPRINT_ID;
const PRINT_PROVIDER_ID = process.env.PRINTIFY_PRINT_PROVIDER_ID;

const IS_DEMO = !TOKEN || TOKEN === "placeholder";
const BASE = "https://api.printify.com/v1";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };
}

async function pfy<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: headers() });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Printify ${init?.method ?? "GET"} ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// uploadImage
// ---------------------------------------------------------------------------

/**
 * Upload an image URL to Printify's media library.
 * Returns the Printify image ID (used when creating products).
 */
export async function uploadImage(imageUrl: string, fileName: string): Promise<string> {
  if (IS_DEMO) return `demo_img_${fileName.replace(/\W/g, "_")}`;

  const data = await pfy<{ id: string }>("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, url: imageUrl }),
  });
  return data.id;
}

// ---------------------------------------------------------------------------
// createProduct
// ---------------------------------------------------------------------------

export interface CreateProductParams {
  title: string;
  description: string;
  /** Printify image ID (from uploadImage). */
  printifyImageId: string;
  /** Array of { variantId, price } pairs. */
  variants: { variantId: number; price: number }[];
}

export interface CreatedProduct {
  productId: string;
  /** Map from variantId → Printify variant ID (same values, kept for clarity). */
  variants: { variantId: number; price: number }[];
}

/**
 * Create a Printify product for a single pattern.
 * Returns the product ID and variant list.
 */
export async function createProduct(params: CreateProductParams): Promise<CreatedProduct> {
  if (IS_DEMO) {
    return {
      productId: `demo_prod_${params.title.replace(/\W/g, "_").toLowerCase()}`,
      variants: params.variants,
    };
  }

  const blueprintId = Number(BLUEPRINT_ID);
  const providerId = Number(PRINT_PROVIDER_ID);

  const body = {
    title: params.title,
    description: params.description,
    blueprint_id: blueprintId,
    print_provider_id: providerId,
    variants: params.variants.map((v) => ({
      id: v.variantId,
      price: v.price,
      is_enabled: true,
    })),
    print_areas: [
      {
        variant_ids: params.variants.map((v) => v.variantId),
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: params.printifyImageId,
                x: 0.5,
                y: 0.5,
                scale: 1,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const data = await pfy<{ id: string }>(`/shops/${SHOP_ID}/products.json`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return { productId: data.id, variants: params.variants };
}

// ---------------------------------------------------------------------------
// createOrder
// ---------------------------------------------------------------------------

export interface PrintifyLineItem {
  productId: string;
  variantId: number;
  quantity: number;
}

export interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
}

export interface CreateOrderParams {
  externalId: string; // our Order.id
  lineItems: PrintifyLineItem[];
  address: PrintifyAddress;
}

/**
 * Submit an order to Printify.
 * Returns the Printify order ID.
 */
export async function createOrder(params: CreateOrderParams): Promise<string> {
  if (IS_DEMO) return `demo_pfy_order_${params.externalId}`;

  const body = {
    external_id: params.externalId,
    line_items: params.lineItems.map((li) => ({
      product_id: li.productId,
      variant_id: li.variantId,
      quantity: li.quantity,
    })),
    shipping_method: 1, // standard
    is_printify_express: false,
    send_shipping_notification: false,
    address_to: params.address,
  };

  const data = await pfy<{ id: string }>(`/shops/${SHOP_ID}/orders.json`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.id;
}

// ---------------------------------------------------------------------------
// sendToProduction
// ---------------------------------------------------------------------------

/**
 * Approve a Printify order for production.
 */
export async function sendToProduction(printifyOrderId: string): Promise<void> {
  if (IS_DEMO) return;

  await pfy<unknown>(`/shops/${SHOP_ID}/orders/${printifyOrderId}/send_to_production.json`, {
    method: "POST",
  });
}

// ---------------------------------------------------------------------------
// getProductMockups
// ---------------------------------------------------------------------------

/**
 * Fetch Printify-generated mockup image URLs for a product.
 * Returns an array of image URLs (may be empty if mockups aren't ready yet).
 */
export async function getProductMockups(productId: string): Promise<string[]> {
  if (IS_DEMO) return [];

  const data = await pfy<{ images: { src: string; is_default: boolean }[] }>(
    `/shops/${SHOP_ID}/products/${productId}.json`
  );
  return (data.images ?? []).map((img) => img.src);
}
