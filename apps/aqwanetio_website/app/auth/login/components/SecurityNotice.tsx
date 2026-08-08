"use client";

import { useTranslation } from "@/lib/translations";

export default function SecurityNotice() {
  const { t } = useTranslation();
  return (
    <div className="border-t border-line px-6 pb-4 pt-4">
      <p className="text-center text-sm font-medium text-muted">
        {t("auth.securityNotice")}
      </p>
    </div>
  );
}
