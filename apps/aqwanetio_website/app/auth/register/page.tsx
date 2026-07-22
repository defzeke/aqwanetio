"use client";

import { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import ProgressBar from "./components/ProgressBar";
import StepOneForm from "./components/StepOneForm";
import StepTwoReview from "./components/StepTwoReview";
import TermsCheckbox from "./components/TermsCheckbox";
import { useTranslation } from "@/lib/translations";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <>
      <AuthHeader mode="register" />

      <main className="flex flex-1 items-center justify-center px-4 py-2">
        <div className="w-full max-w-[1100px] overflow-clip rounded-lg border border-gray-300 bg-white p-px shadow-sm">
          <div className="p-6">
            <div className="pb-3">
              <p className="text-base text-navy">{t("auth.createAccount")}</p>
              <p className="mt-2 text-base text-gray-600">
                {t("auth.registerDesc")}
              </p>
            </div>

            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 1) setStep(2);
              }}
            >
              <ProgressBar step={step} />

              {step === 1 && <StepOneForm />}
              {step === 2 && <StepTwoReview />}

              <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

              {step === 1 && (
                <button
                  type="submit"
                  disabled={!termsAccepted}
                  className="flex h-11 w-full items-center justify-center gap-4 rounded bg-navy text-base font-bold text-white shadow-sm transition-colors hover:bg-navy/90 disabled:opacity-50"
                >
                  {t("auth.registerButton")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              )}

              {step === 2 && (
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-4 rounded bg-navy text-base font-bold text-white shadow-sm transition-colors hover:bg-navy/90"
                >
                  {t("auth.completeRegistration")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              )}
            </form>

            <div className="pt-3">
              <div className="border-t border-gray-300 py-3 text-center">
                <p className="text-base text-gray-600">
                  {t("auth.version")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthFooter />
    </>
  );
}
