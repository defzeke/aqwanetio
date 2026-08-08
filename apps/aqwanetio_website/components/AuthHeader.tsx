"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";

type AuthHeaderProps = {
  mode: "login" | "register";
};

export default function AuthHeader({ mode }: AuthHeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-line bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="btn btn-ghost flex items-center gap-1.5 px-2 py-1 text-sm font-semibold text-muted"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("authHeader.back")}
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="neu-inset h-8 w-8 overflow-hidden rounded-lg p-1">
            <img
              src="/dostasti-logo.png"
              alt="DOST-ASTI"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-bold text-ink">{t("header.brand")}</span>
          <span className="hidden text-sm font-medium text-muted md:inline">
            {t("header.subtitle")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {mode === "login" ? (
          <>
            <span className="hidden text-muted sm:inline">{t("authHeader.noAccount")}</span>
            <Link
              href="/auth/register"
              className="btn btn-cyan px-3 py-1.5 font-bold"
            >
              {t("header.register")}
            </Link>
          </>
        ) : (
          <>
            <span className="hidden text-muted sm:inline">{t("authHeader.hasAccount")}</span>
            <Link
              href="/auth/login"
              className="btn btn-cyan px-3 py-1.5 font-bold"
            >
              {t("header.signIn")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
