"use client";

import Link from "next/link";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import LoginForm from "./components/LoginForm";
import SecurityNotice from "./components/SecurityNotice";
import { useTranslation } from "@/lib/translations";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <>
      <AuthHeader mode="login" />

      <main className="flex flex-1 items-center justify-center px-4 py-2">
        <div className="neu-surface w-full max-w-[1100px] overflow-clip p-px">
          <div className="p-6">
            <div className="pb-4">
              <h1 className="text-2xl font-semibold text-ink">{t("auth.signIn")}</h1>
              <div className="mt-2.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-cyan to-gold" />
              <p className="mt-4 text-base text-muted">
                {t("auth.loginDesc")}
              </p>
            </div>

            <LoginForm />

            <div className="pt-3">
              <div className="border-t border-line py-3 text-center">
                <Link href="/map" className="text-base text-cyan transition-colors hover:text-cyan-light">
                  {t("auth.continueAsGuest")}
                </Link>
              </div>
            </div>
          </div>

          <SecurityNotice />
        </div>
      </main>

      <AuthFooter />
    </>
  );
}
