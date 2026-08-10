"use client";

import { useTranslation } from "@/lib/translations";

export default function SecurityNotice() {
  const { t } = useTranslation();
  return (
    <div className="border-t border-line px-6 py-5">
      <p className="text-center text-sm font-medium leading-relaxed text-muted">
        {t("auth.securityNotice")}
      </p>
    </div>
  );
}
