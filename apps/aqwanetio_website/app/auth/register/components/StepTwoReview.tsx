"use client";

import { useTranslation } from "@/lib/translations";

export default function StepTwoReview() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-raised p-6 shadow-[var(--shadow-press-sm)]">
        <h3 className="text-lg font-semibold text-cyan">{t("auth.reviewInfo")}</h3>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div><span className="font-medium text-ink">{t("auth.fullName")}:</span> <span className="text-muted">{t("auth.fromForm")}</span></div>
          <div><span className="font-medium text-ink">{t("auth.organization")}:</span> <span className="text-muted">{t("auth.fromForm")}</span></div>
          <div className="sm:col-span-2"><span className="font-medium text-ink">{t("auth.email")}:</span> <span className="text-muted">{t("auth.fromForm")}</span></div>
        </div>
        <p className="text-xs text-muted">
          {t("auth.verificationNotice")}
        </p>
      </div>
    </div>
  );
}
