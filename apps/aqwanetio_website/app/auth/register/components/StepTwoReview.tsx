"use client";

import { useTranslation } from "@/lib/translations";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function StepTwoReview({ firstName, lastName, email, phone }: Props) {
  const { t } = useTranslation();
  const display = (v: string) => v.trim() || t("auth.fromForm");
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-raised p-6 shadow-[var(--shadow-press-sm)]">
        <h3 className="text-lg font-semibold text-cyan">{t("auth.reviewInfo")}</h3>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div><span className="font-medium text-ink">{t("auth.firstName")}:</span> <span className="text-muted">{display(firstName)}</span></div>
          <div><span className="font-medium text-ink">{t("auth.lastName")}:</span> <span className="text-muted">{display(lastName)}</span></div>
          <div><span className="font-medium text-ink">{t("auth.email")}:</span> <span className="text-muted">{display(email)}</span></div>
          <div><span className="font-medium text-ink">{t("auth.phoneNumber")}:</span> <span className="text-muted">{display(phone)}</span></div>
        </div>
        <p className="text-xs text-muted">
          {t("auth.verificationNotice")}
        </p>
      </div>
    </div>
  );
}
