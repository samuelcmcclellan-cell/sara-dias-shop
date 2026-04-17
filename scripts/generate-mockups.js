/* eslint-disable */
/**
 * Generate t-shirt mockup JPEGs for each {slug}-tile.jpg in public/patterns/.
 *
 * For every tile:
 *   1. Resize the tile to cover an 800×1000 area (centered).
 *   2. Clip it to a classic crew-neck tee silhouette using sharp's 'dest-in'
 *      composite against an SVG mask.
 *   3. Composite a soft drop-shadow (offset y=8, blur 20, black @ 15%)
 *      onto an off-white (#f5f5f5) 800×1000 canvas, behind the tee.
 *   4. Write the flat JPEG to {slug}-mockup.jpg at quality 85.
 *
 * Run:  node scripts/generate-mockups.js
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "public", "patterns");
const W = 800;
const H = 1000;

// Classic crew-neck tee silhouette on an 800×1000 canvas.
const TEE_PATH =
  "M 260 180 L 340 130 Q 400 100 460 130 L 540 180 L 720 240 L 770 395 Q 778 418 750 428 L 655 408 L 650 885 Q 650 920 612 924 L 188 924 Q 150 920 150 885 L 145 408 L 50 428 Q 22 418 30 395 L 80 240 Z";

// Pure-white-on-transparent mask: sharp's 'dest-in' keeps the tile only
// where this is opaque.
const TEE_MASK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${TEE_PATH}" fill="#ffffff"/>
</svg>`;

// Shadow: the tee silhouette drawn in black @ 15% alpha, offset down 8px,
// blurred via feGaussianBlur.
const SHADOW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="blur" x="-10%" y="-10%" width="120%" height="130%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  <g transform="translate(0,8)" filter="url(#blur)">
    <path d="${TEE_PATH}" fill="#000000" fill-opacity="0.15"/>
  </g>
</svg>`;

// A faint outline + collar detail overlaid on the tee so edges read cleanly
// even when the pattern itself has low contrast around the silhouette.
const DETAIL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${TEE_PATH}" fill="none" stroke="#000" stroke-width="2" stroke-opacity="0.22" stroke-linejoin="round"/>
  <path d="M 340 130 Q 400 200 460 130 Q 450 170 400 185 Q 350 170 340 130 Z"
    fill="none" stroke="#000" stroke-width="1.5" stroke-opacity="0.28"/>
</svg>`;

async function generate(slug) {
  const tilePath = path.join(DIR, `${slug}-tile.jpg`);
  const outPath = path.join(DIR, `${slug}-mockup.jpg`);

  if (!fs.existsSync(tilePath)) {
    console.warn(`  skip (missing tile): ${slug}`);
    return;
  }

  // Step 1: resize the tile to fill the tee bounding box, preserving aspect.
  const filled = await sharp(tilePath)
    .resize(W, H, { fit: "cover", position: "center" })
    .png()
    .toBuffer();

  // Step 2: clip the filled tile to the tee silhouette (dest-in keeps only
  // pixels where the mask is opaque).
  const teeShaped = await sharp(filled)
    .composite([{ input: Buffer.from(TEE_MASK_SVG), blend: "dest-in" }])
    .png()
    .toBuffer();

  // Step 3: paint shadow + tee onto the off-white canvas.
  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: "#f5f5f5",
    },
  })
    .composite([
      { input: Buffer.from(SHADOW_SVG) },
      { input: teeShaped },
      { input: Buffer.from(DETAIL_SVG) },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(outPath);

  console.log(`  ✓ ${slug}`);
}

async function main() {
  const tiles = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith("-tile.jpg"))
    .map((f) => f.replace(/-tile\.jpg$/, ""))
    .sort();

  if (tiles.length === 0) {
    console.error("No *-tile.jpg files found in public/patterns/");
    process.exit(1);
  }

  for (const slug of tiles) {
    await generate(slug);
  }
  console.log(`\nDone — ${tiles.length} mockups written to public/patterns/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
