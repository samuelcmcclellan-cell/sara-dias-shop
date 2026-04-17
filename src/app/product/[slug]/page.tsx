import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "./ProductDetail";
import { ProductCard } from "@/components/product-card";
import { PATTERNS, getPattern, getRelatedPatterns } from "@/lib/patterns";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: `${pattern.name} — SUB`,
    description: pattern.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const related = getRelatedPatterns(slug, 3);

  return (
    <>
      <ProductDetail pattern={pattern} />

      {related.length > 0 && (
        <section className="border-t border-border bg-light">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-black tracking-tight text-primary sm:text-3xl">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} pattern={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
