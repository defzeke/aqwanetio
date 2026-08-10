"use client";

import { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import AuthShell from "@/components/auth/AuthShell";
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

      <AuthShell>
        <div className="flex flex-col gap-7">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{t("auth.createAccount")}</h1>
            <div className="mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-cyan to-gold" />
            <p className="mt-4 text-base text-muted">{t("auth.registerDesc")}</p>
          </div>

          <ProgressBar step={step} />

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) setStep(2);
            }}
          >
            {step === 1 && <StepOneForm />}
            {step === 2 && <StepTwoReview />}

            <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

            {step === 1 && (
              <button
                type="submit"
                disabled={!termsAccepted}
                className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50"
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
                className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold"
              >
                {t("auth.completeRegistration")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}
          </form>
        </div>
      </AuthShell>

      <AuthFooter />
    </>
  );
}