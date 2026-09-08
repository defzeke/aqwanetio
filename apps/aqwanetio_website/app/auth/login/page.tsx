"use client";

import Link from "next/link";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./components/LoginForm";
import { useTranslation } from "@/lib/translations";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <>
      <AuthHeader mode="login" />

      <AuthShell>
        <div className="flex flex-col gap-7">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{t("auth.signIn")}</h1>
            <div className="mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-cyan to-gold" />
            <p className="mt-4 text-base text-muted">{t("auth.loginDesc")}</p>
          </div>

          <LoginForm />

          <div className="border-t border-line pt-5 text-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan transition-colors hover:text-cyan-light"
            >
              {t("auth.continueAsGuest")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </AuthShell>

      <AuthFooter />
    </>
  );
}