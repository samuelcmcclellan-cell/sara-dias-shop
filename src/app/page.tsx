import Link from "next/link";
import Image from "next/image";
import { Truck, Shield, Palette, Clock, ArrowRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { LookbookGrid, type LookbookTile } from "@/components/lookbook-grid";
import { getFeaturedPatterns } from "@/lib/patterns";

export default function HomePage() {
  const featured = getFeaturedPatterns();

  const lookbookTiles: LookbookTile[] = [
    {
      src: "/patterns/pineapple-scarf-model-cabin.webp",
      alt: "Model wearing the Pineapple Scarf tee in a wooden geodesic-cabin interior",
      name: "Pineapple Scarf",
      slug: "pineapple-scarf",
    },
    {
      src: "/patterns/midnight-bloom-model-pastel.webp",
      alt: "Model wearing the Midnight Bloom tee in a pastel studio set",
      name: "Midnight Bloom",
      slug: "midnight-bloom",
    },
    {
      src: "/patterns/pineapple-scarf-model-pastel.webp",
      alt: "Model wearing the Pineapple Scarf tee amid pastel arches and geometric egg shapes",
      name: "Pineapple Scarf",
      slug: "pineapple-scarf",
    },
    {
      src: "/patterns/midnight-bloom-model-studio.webp",
      alt: "Male model wearing the Midnight Bloom tee against a cream studio backdrop",
      name: "Midnight Bloom",
      slug: "midnight-bloom",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-to-b from-white via-light to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,77,0,0.12) 0, transparent 45%), radial-gradient(circle at 80% 60%, rgba(236,72,153,0.12) 0, transparent 40%)",
          }}
        />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Exclusive artist collaborations
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              Bold Patterns.
              <br />
              Premium Tees.
              <br />
              <span className="text-accent font-mono">$30.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted sm:text-lg">
              Exclusive all-over-print designs by Sara Dias. Sublimation-printed on premium
              polyester. Delivered to your door.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/collection">
                  Shop the Collection <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs text-muted">
              <span className="font-mono">★★★★★</span>
              <span>Designed with love in Brazil · Printed & shipped worldwide</span>
            </div>
          </div>

          {/* Hero visual — split: primary lifestyle shot + floating flat-lay */}
          <div className="relative lg:ml-auto lg:max-w-xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
              <Image
                src="/patterns/midnight-bloom-model-cabin.webp"
                alt="Model wearing the Midnight Bloom tee in a wooden geodesic-cabin interior"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="object-cover"
              />
              <div className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
                $30
              </div>
              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                Featured: Midnight Bloom
              </div>
            </div>
            {/* Floating flat-lay — desktop only */}
            <div
              aria-hidden="true"
              className="absolute -bottom-8 -left-8 hidden w-40 overflow-hidden rounded-2xl border border-border bg-white shadow-xl sm:block sm:w-48 lg:w-56"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src="/patterns/midnight-bloom-flatlay.webp"
                  alt=""
                  fill
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
                Featured Designs
              </h2>
              <p className="mt-2 text-base text-muted">
                A taste of what&apos;s in the collection right now.
              </p>
            </div>
            <Link
              href="/collection"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} pattern={p} priority={i === 0} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Preview images — final production art will be delivered unwatermarked.
          </p>
        </div>
      </section>

      {/* IN THE WILD — lookbook */}
      <section className="bg-white pb-20 pt-4 sm:pb-24 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
              In the wild
            </h2>
            <p className="mt-2 text-base text-muted">Sara&apos;s patterns, photographed.</p>
          </div>
          <LookbookGrid tiles={lookbookTiles} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-light py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-base text-muted">
              Three steps from browse to wardrobe.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                num: "01",
                title: "Browse",
                desc: "Explore our curated collection of exclusive patterns.",
              },
              {
                num: "02",
                title: "Pick Your Size",
                desc: "Choose from S to 3XL — same bold print on every size.",
              },
              {
                num: "03",
                title: "We Print & Ship",
                desc: "All-over sublimation printing on premium polyester. Free shipping.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative flex flex-col items-center rounded-2xl border border-border bg-white p-8 text-center transition-shadow hover:shadow-lg"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent bg-white font-mono text-2xl font-bold text-accent">
                  {step.num}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-primary">{step.title}</h3>
                <p className="mt-3 text-base text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIST */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-light px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
                The Artist
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-primary sm:text-5xl">
                Designed by Sara Dias
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                Sara Dias is a Brazilian pattern designer known for vibrant tropical and
                botanical prints. Each SUB design is an exclusive collaboration bringing her
                bold artwork to premium sublimation tees.
              </p>
              <a
                href="https://instagram.com/saradiasestampa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-accent hover:underline"
              >
                <Instagram className="h-4 w-4" />
                Follow her on Instagram → @saradiasestampa
              </a>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-xl">
                <Image
                  src="/patterns/pineapple-scarf-model-cabin.webp"
                  alt="Portrait of Sara Dias photographed in a wooden geodesic-cabin interior"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: Shield, label: "Premium Quality" },
              { icon: Palette, label: "Exclusive Designs" },
              { icon: Clock, label: "5-12 Day Delivery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-semibold text-primary">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Find your pattern.
            </h2>
            <p className="max-w-xl text-base text-white/90 sm:text-lg">
              Nine exclusive designs. One premium tee. Free shipping on every order.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Link href="/collection">
                Shop the Collection <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
