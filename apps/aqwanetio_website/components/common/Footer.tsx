"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-300 bg-gray-200 px-4 pb-8 pt-[33px] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-navy">{t("footer.brand")}</span>
          <span className="text-base text-gray-900">
            &copy; {new Date().getFullYear()} {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-gray-600">
          <Link href="#" className="transition-colors hover:text-navy">{t("footer.contact")}</Link>
          <Link href="#" className="transition-colors hover:text-navy">{t("footer.privacy")}</Link>
          <Link href="#" className="transition-colors hover:text-navy">{t("footer.dost")}</Link>
          <Link href="#" className="transition-colors hover:text-navy">{t("footer.tos")}</Link>
        </div>
      </div>
    </footer>
  );
}
