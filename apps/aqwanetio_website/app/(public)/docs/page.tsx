"use client";

import { useTranslation } from "@/lib/translations";

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {t("docsPage.title")}
      </h1>
      <div className="mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-cyan to-gold" />
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("docsPage.subtitle")}
      </p>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="neu-tile p-6">
          <h2 className="text-xl font-semibold text-ink">{t("docsPage.whatIsTitle")}</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">
            {t("docsPage.whatIsDesc")}
          </p>
        </div>

        <div className="neu-tile p-6">
          <h2 className="text-xl font-semibold text-ink">{t("docsPage.monitoringTitle")}</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">
            {t("docsPage.monitoringDesc")}
          </p>
        </div>

        <div className="neu-tile p-6 sm:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold text-ink">{t("docsPage.thresholdsTitle")}</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-safe shrink-0" aria-hidden="true" />
              <span className="text-base text-muted"><strong className="font-semibold text-ink">{t("docsPage.safeLabel")}</strong> {t("docsPage.safeDesc")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-warning shrink-0" aria-hidden="true" />
              <span className="text-base text-muted"><strong className="font-semibold text-ink">{t("docsPage.warningLabel")}</strong> {t("docsPage.warningDesc")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-alert shrink-0" aria-hidden="true" />
              <span className="text-base text-muted"><strong className="font-semibold text-ink">{t("docsPage.toxicLabel")}</strong> {t("docsPage.toxicDesc")}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
