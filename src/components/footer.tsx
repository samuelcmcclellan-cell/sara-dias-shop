"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";

export function Footer() {
  const { locale } = useLanguage();
  const tr = t[locale];

  return (
    <footer className="border-t border-border bg-light">
      <div className="site-container py-12 xl:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 xl:gap-12">
          {/* Brand */}
          <div>
            <div className="font-black text-2xl uppercase tracking-[0.15em] text-primary">
              ESTAMPA
            </div>
            <p className="mt-3 text-sm text-muted max-w-xs">{tr.tagline}</p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
              {tr.footer_company}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted hover:text-accent transition-colors">
                  {tr.footer_about}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted hover:text-accent transition-colors">
                  {tr.footer_faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
              {tr.footer_legal}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted hover:text-accent transition-colors">
                  {tr.footer_terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-accent transition-colors">
                  {tr.footer_privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
              {tr.footer_social}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84Z" />
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-1 border-t border-border pt-6 text-center text-sm text-muted">
          <span>{tr.footer_copyright}</span>
          <span>
            {tr.footer_patterns_by}{" "}
            <a
              href="https://instagram.com/saradiasestampa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-accent transition-colors"
            >
              Sara Dias
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
