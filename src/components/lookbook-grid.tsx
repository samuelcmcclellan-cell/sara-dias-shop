import Link from "next/link";
import Image from "next/image";

export interface LookbookTile {
  src: string;
  alt: string;
  name: string;
  slug: string;
}

/**
 * Bento-style lookbook grid.
 *
 * 4 tiles — original layout:
 *   Desktop: 3-col × 2-row. Tile 1 tall (row-span-2), tiles 2–3 stack right,
 *   tile 4 wide (col-span-2) at bottom-right.
 *
 * 6 tiles — rich editorial layout:
 *   Desktop: 3-col × 3-row. Tile 1 tall (row-span-2), tiles 2–5 fill 2×2 right
 *   block, tile 6 spans full width as a cinematic bottom strip.
 *
 * Mobile (both): horizontal scroll-snap strip.
 */
export function LookbookGrid({ tiles }: { tiles: LookbookTile[] }) {
  if (tiles.length < 4) return null;

  if (tiles.length >= 6) {
    const [t1, t2, t3, t4, t5, t6] = tiles;
    return (
      <>
        {/* Mobile: horizontal scroll-snap */}
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:hidden">
          {tiles.slice(0, 6).map((tile) => (
            <LookbookCard
              key={tile.src}
              tile={tile}
              className="w-[85%] shrink-0 snap-center aspect-[4/5]"
            />
          ))}
        </div>

        {/* Desktop: 6-tile bento — 3×3 with wide bottom strip */}
        <div className="hidden gap-4 md:grid md:grid-cols-3 md:grid-rows-3">
          {/* Hero portrait — spans rows 1–2 */}
          <LookbookCard
            tile={t1}
            className="row-span-2 aspect-[3/5]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          {/* Top-right 2×2 block */}
          <LookbookCard
            tile={t2}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          <LookbookCard
            tile={t3}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          <LookbookCard
            tile={t4}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          <LookbookCard
            tile={t5}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          {/* Cinematic bottom strip — full width */}
          <LookbookCard
            tile={t6}
            className="col-span-3 aspect-[21/9]"
            sizes="(min-width: 768px) 100vw, 100vw"
          />
        </div>
      </>
    );
  }

  // 4-tile fallback (original layout)
  const [tall, topRight, midRight, wide] = tiles;
  return (
    <>
      {/* Mobile: horizontal scroll-snap */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:hidden">
        {tiles.map((tile) => (
          <LookbookCard
            key={tile.src}
            tile={tile}
            className="w-[85%] shrink-0 snap-center aspect-[4/5]"
          />
        ))}
      </div>

      {/* Desktop: bento */}
      <div className="hidden gap-4 md:grid md:grid-cols-3 md:grid-rows-2">
        <LookbookCard
          tile={tall}
          className="row-span-2 aspect-[3/5]"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        <LookbookCard
          tile={topRight}
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        <LookbookCard
          tile={midRight}
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        <LookbookCard
          tile={wide}
          className="col-span-2 aspect-[16/7]"
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
      </div>
    </>
  );
}

function LookbookCard({
  tile,
  className,
  sizes = "85vw",
}: {
  tile: LookbookTile;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={`/product/${tile.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-border bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
      />
      {/* Caption scrim + label */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
        <span className="text-sm font-bold text-white drop-shadow">{tile.name}</span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/95 drop-shadow">
          Shop →
        </span>
      </div>
    </Link>
  );
}
