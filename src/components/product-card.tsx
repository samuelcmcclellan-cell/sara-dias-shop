"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPriceBRL } from "@/lib/utils";
import { PRICE_BRL, type Pattern } from "@/lib/patterns";
import { useLanguage } from "@/lib/language-context";

export function ProductCard({ pattern, priority = false }: { pattern: Pattern; priority?: boolean }) {
  const { locale } = useLanguage();
  const priceDisplay =
    locale === "pt" ? formatPriceBRL(PRICE_BRL) : formatPrice(pattern.price);

  return (
    <Link
      href={`/product/${pattern.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:shadow-lg hover:scale-[1.02] motion-reduce:hover:scale-100"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-light">
        <Image
          src={pattern.mockupImage}
          alt={`${pattern.name} pattern mockup`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 xl:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-primary line-clamp-1 xl:text-xl">{pattern.name}</h3>
          <span className="font-mono text-lg font-bold text-primary whitespace-nowrap xl:text-xl">
            {priceDisplay}
          </span>
        </div>
        <Badge variant="secondary" className="self-start text-[10px] uppercase tracking-wider">
          {pattern.category}
        </Badge>
      </div>
    </Link>
  );
}
