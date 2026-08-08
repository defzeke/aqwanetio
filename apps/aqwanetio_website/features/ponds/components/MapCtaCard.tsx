"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";

export default function MapCtaCard() {
  const { t } = useTranslation();
  return (
    <div className="relative max-w-[300px] rounded-xl border border-line bg-gradient-to-br from-raised to-background p-4 shadow-[var(--shadow-raise)] md:p-5">
      <div className="flex items-center gap-2">
        <svg className="h-3.5 w-3.5 shrink-0 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <h3 className="text-sm font-semibold text-gold">{t("ctaCard.title")}</h3>
      </div>
      <p className="mt-2 text-xs font-medium leading-relaxed text-muted md:text-sm">
        {t("ctaCard.desc")}
      </p>
      <Link
        href="/auth/register"
        className="btn btn-gold mt-3 w-full py-3 text-sm font-bold md:mt-4 md:py-3.5"
      >
        {t("ctaCard.button")}
      </Link>
      <div className="absolute bottom-[-6px] right-[-6px] md:bottom-[-8px] md:right-[-8px]">
        <svg className="h-8 w-8 text-gold/40 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </div>
  );
}
