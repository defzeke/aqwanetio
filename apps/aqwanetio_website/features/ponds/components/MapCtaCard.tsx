"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";

export default function MapCtaCard() {
  const { t } = useTranslation();

  return (
    <div className="neu-card pointer-events-auto w-[300px] max-w-[calc(100vw-2.5rem)] overflow-hidden">
      <div className="flex items-center gap-2 p-4 pb-2 md:p-5 md:pb-2">
        <svg className="h-3.5 w-3.5 shrink-0 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <h3 className="text-sm font-semibold text-gold">{t("ctaCard.title")}</h3>
      </div>

      <p className="px-4 text-xs font-medium leading-relaxed text-muted md:px-5 md:text-sm">
        {t("ctaCard.desc")}
      </p>
      <Link
        href="/auth/register"
        className="btn btn-gold mx-4 mb-4 mt-3 w-[calc(100%-2rem)] py-3 text-sm font-bold md:mx-5 md:mb-5 md:mt-4 md:w-[calc(100%-2.5rem)] md:py-3.5"
      >
        {t("ctaCard.button")}
      </Link>

      <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-dark to-background" aria-hidden="true" />
    </div>
  );
}