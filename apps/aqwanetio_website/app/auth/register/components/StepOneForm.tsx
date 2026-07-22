"use client";

import { useTranslation } from "@/lib/translations";

export default function StepOneForm() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="fullName">{t("auth.fullName")}</label>
          <input
            id="fullName"
            type="text"
            placeholder={t("auth.fullNamePlaceholder")}
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="organization">{t("auth.organization")}</label>
          <input
            id="organization"
            type="text"
            placeholder={t("auth.orgPlaceholder")}
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base text-gray-900" htmlFor="regEmail">{t("auth.emailOfficial")}</label>
        <input
          id="regEmail"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="regPassword">{t("auth.password")}</label>
          <input
            id="regPassword"
            type="password"
            placeholder="••••••••"
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
    </div>
  );
}
