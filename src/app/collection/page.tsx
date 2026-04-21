"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  PATTERNS,
  type CategoryOption,
  type Pattern,
} from "@/lib/patterns";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "az" | "za";

export default function CollectionPage() {
  const [category, setCategory] = useState<CategoryOption["slug"]>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered: Pattern[] = useMemo(() => {
    const base =
      category === "all" ? PATTERNS.slice() : PATTERNS.filter((p) => p.category === category);
    if (sort === "az") base.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") base.sort((a, b) => b.name.localeCompare(a.name));
    // "newest" = original PATTERNS order (most recently added first in the array)
    return base;
  }, [category, sort]);

  return (
    <div className="site-container py-12 xl:py-16">
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-border aspect-[16/9] md:aspect-[21/9] xl:mb-14 xl:aspect-[24/8]">
        <Image
          src="/patterns/midnight-bloom-model-pastel.webp"
          alt="Model wearing the Midnight Bloom tee in a pastel studio set"
          fill
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 xl:p-14">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl xl:text-7xl">
            The Collection
          </h1>
          <p className="mt-2 text-base text-white/90 drop-shadow sm:text-lg xl:text-xl">
            Exclusive all-over-print patterns by Sara Dias
          </p>
        </div>
      </div>

      {/* Filter + sort toolbar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                category === c.slug
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-primary hover:border-accent hover:text-accent"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 md:shrink-0">
          <span className="text-xs uppercase tracking-wider text-muted">Sort</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="az">Name A–Z</SelectItem>
              <SelectItem value="za">Name Z–A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted">
        Showing <span className="font-mono font-semibold text-primary">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "design" : "designs"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">No designs in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.slug} pattern={p} />
          ))}
        </div>
      )}
    </div>
  );
}
