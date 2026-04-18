"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/translations";

export function FaqContent() {
  const { locale } = useLanguage();
  const tr = t[locale];

  const groups = [
    {
      id: "shipping",
      title: tr.faq_group_shipping,
      items: [
        { q: tr.faq_ship_q1, a: tr.faq_ship_a1 },
        { q: tr.faq_ship_q2, a: tr.faq_ship_a2 },
        { q: tr.faq_ship_q3, a: tr.faq_ship_a3 },
      ],
    },
    {
      id: "returns",
      title: tr.faq_group_returns,
      items: [
        { q: tr.faq_ret_q1, a: tr.faq_ret_a1 },
        { q: tr.faq_ret_q2, a: tr.faq_ret_a2 },
      ],
    },
    {
      id: "sublimation",
      title: tr.faq_group_sublimation,
      items: [
        { q: tr.faq_sub_q1, a: tr.faq_sub_a1 },
        { q: tr.faq_sub_q2, a: tr.faq_sub_a2 },
        { q: tr.faq_sub_q3, a: tr.faq_sub_a3 },
      ],
    },
    {
      id: "care",
      title: tr.faq_group_care,
      items: [
        { q: tr.faq_care_q1, a: tr.faq_care_a1 },
        { q: tr.faq_care_q2, a: tr.faq_care_a2 },
        { q: tr.faq_care_q3, a: tr.faq_care_a3 },
        { q: tr.faq_care_q4, a: tr.faq_care_a4 },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-light px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
            {tr.faq_eyebrow}
          </span>
          <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-primary sm:text-6xl">
            {tr.faq_heading}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {tr.faq_intro}
          </p>
        </div>
      </section>

      {/* FAQ GROUPS */}
      <section className="bg-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          {groups.map((group) => (
            <div key={group.id}>
              <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
                {group.title}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mt-4 rounded-2xl border border-border bg-white px-6 shadow-sm"
              >
                {group.items.map((item, idx) => (
                  <AccordionItem
                    key={`${group.id}-${idx}`}
                    value={`${group.id}-${idx}`}
                    className="last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-base sm:text-base">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted sm:text-base">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {tr.faq_cta_heading}
            </h2>
            <p className="max-w-xl text-base text-white/90 sm:text-lg">
              {tr.faq_cta_body}
            </p>
            <Button
              asChild
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <a href="mailto:hello@estampa.com">
                <Mail /> {tr.faq_cta_button}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
