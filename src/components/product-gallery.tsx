"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Pattern } from "@/lib/patterns";

interface GalleryImage {
  src: string;
  alt: string;
  /** "lifestyle" | "mockup" | "tile" — used only to label the pattern-tile thumb. */
  role: "lifestyle" | "mockup" | "tile";
}

/**
 * Product page image viewer.
 *
 * - If `pattern.lifestyle` is empty/missing, renders the pre-existing
 *   mockup + pattern-tile vertical stack (legacy mode, non-regression).
 * - Otherwise renders a main image + thumbnail strip, with state, crossfade,
 *   and keyboard navigation.
 */
export function ProductGallery({ pattern }: { pattern: Pattern }) {
  const images = useMemo<GalleryImage[]>(() => {
    const list: GalleryImage[] = [];
    const seen = new Set<string>();
    const push = (img: GalleryImage) => {
      if (seen.has(img.src)) return;
      seen.add(img.src);
      list.push(img);
    };
    for (const shot of pattern.lifestyle ?? []) {
      push({ src: shot.src, alt: shot.alt, role: "lifestyle" });
    }
    push({
      src: pattern.mockupImage,
      alt: `${pattern.name} tee mockup — full print`,
      role: "mockup",
    });
    push({
      src: pattern.patternTile,
      alt: `${pattern.name} pattern tile detail`,
      role: "tile",
    });
    return list;
  }, [pattern]);

  // Legacy mode — visually identical to the pre-existing stacked layout.
  if (!pattern.lifestyle || pattern.lifestyle.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-light">
          <Image
            src={pattern.mockupImage}
            alt={`${pattern.name} mockup`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Pattern Detail
          </h3>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-light">
            <Image
              src={pattern.patternTile}
              alt={`${pattern.name} pattern tile detail`}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  // Gallery mode
  return <GalleryImpl images={images} patternName={pattern.name} />;
}

function GalleryImpl({
  images,
  patternName,
}: {
  images: GalleryImage[];
  patternName: string;
}) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => (i + 1) % images.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => (i - 1 + images.length) % images.length);
    }
  }

  return (
    <div className="space-y-3">
      {/* Main image — crossfade by stacking all images and toggling opacity */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-light">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div
        ref={stripRef}
        role="tablist"
        aria-label={`${patternName} image gallery`}
        onKeyDown={handleKeyDown}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {images.map((img, i) => {
          const isActive = i === active;
          return (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-pressed={isActive}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 bg-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-20 ${
                isActive
                  ? "border-accent"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
              {img.role === "tile" && (
                <span className="absolute bottom-0.5 left-0.5 rounded-sm bg-primary/80 px-1 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                  Pattern
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
