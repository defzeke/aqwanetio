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
        <div className="w-full max-w-[1100px] overflow-clip rounded-lg border border-gray-300 bg-white p-px shadow-sm">
          <div className="p-6">
            <div className="pb-4">
              <h1 className="text-2xl font-semibold text-navy">{t("auth.signIn")}</h1>
              <div className="mt-2.5 h-[3px] w-10 bg-accent" />
              <p className="mt-4 text-base text-gray-600">
                {t("auth.loginDesc")}
              </p>
            </div>

            <LoginForm />

            <div className="pt-3">
              <div className="border-t border-gray-300 py-3 text-center">
                <Link href="/map" className="text-base text-navy transition-colors hover:text-navy/80">
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
