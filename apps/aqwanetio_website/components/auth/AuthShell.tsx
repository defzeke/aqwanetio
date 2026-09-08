"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/lib/translations";

export default function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-5xl">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-cyan/40 via-line to-gold/40 p-px shadow-[var(--shadow-panel)]">
          <div className="grid overflow-hidden rounded-[calc(1.75rem-1px)] bg-surface lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-raised to-surface p-10 lg:flex">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

              <div className="relative flex items-center gap-3">
                <span className="neu-inset flex h-12 w-12 shrink-0 overflow-hidden rounded-xl p-1.5">
                  <img src="/dostasti-logo.png" alt="DOST-ASTI" className="h-full w-full object-contain" />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-ink">{t("header.brand")}</p>
                  <p className="text-sm font-medium text-cyan">{t("header.subtitle")}</p>
                </div>
              </div>

              <div className="relative">
                <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-ink">
                  {t("authShell.tagline")}
                </h2>
                <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-cyan to-gold" />
              </div>

              <p className="relative flex items-start gap-2 text-xs font-medium leading-relaxed text-muted">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                {t("auth.securityNotice")}
              </p>
            </aside>

            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}