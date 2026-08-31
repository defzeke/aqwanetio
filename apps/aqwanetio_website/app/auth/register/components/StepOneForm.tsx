"use client";

import { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslation } from "@/lib/translations";

const iconClass = "pointer-events-none absolute inset-y-0 left-3.5 flex items-center";
const inputClass = "neu-input h-12 w-full rounded-xl pl-[41px] text-base";
const inputErrorClass = "neu-input h-12 w-full rounded-xl pl-[41px] text-base border-alert focus:border-alert focus:ring-alert/20";

function Field({
  id,
  label,
  icon,
  children,
  className,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 flex-col gap-2 ${className ?? ""}`}>
      <label className="text-sm font-medium text-ink" htmlFor={id}>{label}</label>
      <div className="relative">
        <div className={iconClass}>{icon}</div>
        {children}
      </div>
    </div>
  );
}

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}

export default function StepOneForm({
  firstName,
  lastName,
  email,
  phone,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: Props) {
  const { t } = useTranslation();
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneTrimmed = phone.trim();
  const phoneValid = phoneTrimmed === "" ? false : isValidPhoneNumber(phoneTrimmed, "PH");
  const showPhoneError = phoneTouched && !phoneValid;
  const phoneErrorMsg = phoneTrimmed === "" ? t("auth.phoneRequired") : t("auth.phoneInvalid");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Field
          id="firstName"
          label={t("auth.firstName")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        >
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder={t("auth.firstNamePlaceholder")}
            className={inputClass}
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            maxLength={50}
            required
          />
        </Field>

        <Field
          id="lastName"
          label={t("auth.lastName")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        >
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder={t("auth.lastNamePlaceholder")}
            className={inputClass}
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            maxLength={50}
            required
          />
        </Field>
      </div>

      <Field
        id="regEmail"
        label={t("auth.emailOfficial")}
        icon={
          <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        }
      >
        <input
          id="regEmail"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
          className={inputClass}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </Field>

      <Field
        id="phone"
        label={t("auth.phoneNumber")}
        icon={
          <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.75 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
          </svg>
        }
      >
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={t("auth.phonePlaceholder")}
          className={showPhoneError ? inputErrorClass : inputClass}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          onBlur={() => setPhoneTouched(true)}
          required
          aria-invalid={showPhoneError}
          aria-describedby={showPhoneError ? "phone-error" : undefined}
        />
        {showPhoneError && (
          <p id="phone-error" className="mt-1.5 text-xs text-alert">{phoneErrorMsg}</p>
        )}
      </Field>
    </div>
  );
}
