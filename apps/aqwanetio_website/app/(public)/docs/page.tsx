"use client";

import { useTranslation } from "@/lib/translations";

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text">{t("docsPage.title")}</h1>
      <p className="mt-2 text-text-muted">
        {t("docsPage.subtitle")}
      </p>

      <section className="mt-8 space-y-6">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">{t("docsPage.whatIsTitle")}</h2>
          <p className="mt-2 text-text-muted leading-relaxed">
            {t("docsPage.whatIsDesc")}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">{t("docsPage.monitoringTitle")}</h2>
          <p className="mt-2 text-text-muted leading-relaxed">
            {t("docsPage.monitoringDesc")}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">{t("docsPage.thresholdsTitle")}</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-safe shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">{t("docsPage.safeLabel")}</strong> {t("docsPage.safeDesc")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-warning shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">{t("docsPage.warningLabel")}</strong> {t("docsPage.warningDesc")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-alert shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">{t("docsPage.toxicLabel")}</strong> {t("docsPage.toxicDesc")}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
