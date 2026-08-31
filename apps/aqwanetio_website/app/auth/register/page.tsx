"use client";

import { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import AuthHeader from "@/components/AuthHeader";
import AuthFooter from "@/components/AuthFooter";
import AuthShell from "@/components/auth/AuthShell";
import ProgressBar from "./components/ProgressBar";
import StepOneForm from "./components/StepOneForm";
import StepTwoPasswords from "./components/StepTwoPasswords";
import StepTwoReview from "./components/StepTwoReview";
import TermsCheckbox from "./components/TermsCheckbox";
import { useTranslation } from "@/lib/translations";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const firstNameTrim = firstName.trim();
  const lastNameTrim = lastName.trim();
  const emailTrim = email.trim();
  const phoneTrim = phone.trim();

  const isPersonalValid =
    firstNameTrim.length > 0 &&
    firstNameTrim.length <= 50 &&
    lastNameTrim.length > 0 &&
    lastNameTrim.length <= 50 &&
    emailTrim.length > 0 &&
    phoneTrim.length > 0 &&
    isValidPhoneNumber(phoneTrim, "PH");

  const isPasswordValid =
    password.length >= 8 && password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!isPersonalValid) return;
      setStep(2);
    } else if (step === 2) {
      if (!isPasswordValid) return;
      setStep(3);
    } else if (step === 3) {
      // final submit handled here
      // ponytail: keep simple – would call API
    }
  };

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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {step === 1 && (
              <StepOneForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
              />
            )}
            {step === 2 && (
              <StepTwoPasswords
                password={password}
                confirmPassword={confirmPassword}
                onPasswordChange={setPassword}
                onConfirmChange={setConfirmPassword}
              />
            )}
            {step === 3 && (
              <StepTwoReview firstName={firstName} lastName={lastName} email={email} phone={phone} />
            )}

            {step === 3 && <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />}

            {step === 1 && (
              <button
                type="submit"
                disabled={!isPersonalValid}
                className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50"
              >
                {t("auth.next")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50"
                >
                  {t("auth.next")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  ← {t("auth.back")}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!termsAccepted}
                  className="btn btn-cyan btn-shine h-12 w-full rounded-xl text-base font-bold disabled:opacity-50"
                >
                  {t("auth.completeRegistration")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  ← {t("auth.back")}
                </button>
              </div>
            )}
          </form>
        </div>
      </AuthShell>

      <AuthFooter />
    </>
  );
}
