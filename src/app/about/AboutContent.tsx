"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";

export function AboutContent() {
  const { locale } = useLanguage();
  const tr = t[locale];

  return (
    <div className="flex flex-col">
      {/* EDITORIAL HERO */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-light px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
                {tr.about_eyebrow}
              </span>
              <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
                {tr.about_heading_line1}
                <br />
                {tr.about_heading_line2}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                {tr.about_intro}
              </p>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <Image
                src="/patterns/pineapple-scarf-model-pastel.webp"
                alt="Model wearing the Pineapple Scarf tee against pastel arches and geometric egg shapes"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-light py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
              {tr.about_story_eyebrow}
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-primary sm:text-5xl">
              {tr.about_story_heading}
            </h2>
          </div>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-sm">
              <Image
                src="/patterns/midnight-bloom-flatlay.webp"
                alt="Midnight Bloom tee flat-lay on a cream surface with pattern sketches around it"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>{tr.about_story_p1}</p>
              <p>{tr.about_story_p2}</p>
            </div>
          </div>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg lg:order-2">
              <p>
                {tr.about_story_p3_prefix}{" "}
                <span className="font-semibold text-primary">Sara Dias</span>
                {tr.about_story_p3_suffix}
              </p>
              <p>{tr.about_story_p4}</p>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-sm lg:order-1">
              <Image
                src="/patterns/pineapple-scarf-flatlay.webp"
                alt="Pineapple Scarf tee flat-lay on a warm wood surface with a paper roll and decorative ball"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MEET SARA */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-xl">
              <Image
                src="/patterns/midnight-bloom-model-cabin.webp"
                alt="Portrait shot in a wooden geodesic-cabin interior"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-light px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
                {tr.about_artist_eyebrow}
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-primary sm:text-5xl">
                Sara Dias
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                {tr.about_artist_bio}
              </p>
              <a
                href="https://instagram.com/saradiasestampa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-accent hover:underline"
              >
                <Instagram className="h-4 w-4" />
                {tr.about_artist_follow}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {tr.about_cta_heading}
            </h2>
            <p className="max-w-xl text-base text-white/90 sm:text-lg">
              {tr.about_cta_body}
            </p>
            <Button
              asChild
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Link href="/collection">
                {tr.about_cta_button} <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
