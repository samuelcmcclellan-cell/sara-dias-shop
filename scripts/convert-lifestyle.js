/* eslint-disable */
/**
 * Convert lifestyle PNG photography to .webp for web delivery.
 *
 * Globs every `{slug}-flatlay.png` and `{slug}-model-*.png` in
 * public/patterns/ and writes a `.webp` sibling at quality 82.
 * The PNG originals stay in git as masters.
 *
 * Run:  node scripts/convert-lifestyle.js
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "public", "patterns");
const QUALITY = 82;

// Lifestyle suffixes we want to convert. Tee-mockup .jpg files are skipped.
const SUFFIXES = ["-flatlay", "-model-studio", "-model-cabin", "-model-pastel"];

function isLifestylePng(name) {
  if (!name.endsWith(".png")) return false;
  const base = name.replace(/\.png$/, "");
  return SUFFIXES.some((s) => base.endsWith(s));
}

async function convert(name) {
  const src = path.join(DIR, name);
  const dest = path.join(DIR, name.replace(/\.png$/, ".webp"));

  const srcBytes = fs.statSync(src).size;
  await sharp(src).webp({ quality: QUALITY }).toFile(dest);
  const destBytes = fs.statSync(dest).size;
  const pct = Math.round(100 - (destBytes / srcBytes) * 100);
  console.log(
    `  ✓ ${name.padEnd(40)}  ${(srcBytes / 1024).toFixed(0).padStart(5)} KB  →  ${(destBytes / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`
  );
}

async function main() {
  const files = fs.readdirSync(DIR).filter(isLifestylePng).sort();
  if (files.length === 0) {
    console.error("No lifestyle PNGs found in public/patterns/");
    process.exit(1);
  }
  console.log(`Converting ${files.length} files at quality ${QUALITY}...\n`);
  for (const name of files) {
    await convert(name);
  }
  console.log(`\nDone — ${files.length} .webp files written to public/patterns/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
