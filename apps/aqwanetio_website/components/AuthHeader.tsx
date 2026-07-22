"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";

type AuthHeaderProps = {
  mode: "login" | "register";
};

export default function AuthHeader({ mode }: AuthHeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-navy/80"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("authHeader.back")}
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-8 w-8 overflow-hidden rounded">
            <img
              src="/dostasti-logo.png"
              alt="DOST-ASTI"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-bold text-navy">{t("header.brand")}</span>
          <span className="hidden text-sm font-medium text-gray-600 md:inline">
            {t("header.subtitle")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {mode === "login" ? (
          <>
            <span className="hidden text-gray-600 sm:inline">{t("authHeader.noAccount")}</span>
            <Link
              href="/auth/register"
              className="font-bold text-navy transition-colors hover:text-navy/80"
            >
              {t("header.register")}
            </Link>
          </>
        ) : (
          <>
            <span className="hidden text-gray-600 sm:inline">{t("authHeader.hasAccount")}</span>
            <Link
              href="/auth/login"
              className="font-bold text-navy transition-colors hover:text-navy/80"
            >
              {t("header.signIn")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
