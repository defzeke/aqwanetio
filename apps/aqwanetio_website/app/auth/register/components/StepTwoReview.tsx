"use client";

import { useTranslation } from "@/lib/translations";

export default function StepTwoReview() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-gray-100 p-6">
        <h3 className="text-lg font-semibold text-navy">{t("auth.reviewInfo")}</h3>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div><span className="font-medium text-gray-900">{t("auth.fullName")}:</span> <span className="text-gray-600">{t("auth.fromForm")}</span></div>
          <div><span className="font-medium text-gray-900">{t("auth.organization")}:</span> <span className="text-gray-600">{t("auth.fromForm")}</span></div>
          <div className="sm:col-span-2"><span className="font-medium text-gray-900">{t("auth.email")}:</span> <span className="text-gray-600">{t("auth.fromForm")}</span></div>
        </div>
        <p className="text-xs text-gray-600">
          {t("auth.verificationNotice")}
        </p>
      </div>
    </div>
  );
}
