"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/translations";

const iconClass = "pointer-events-none absolute inset-y-0 left-3.5 flex items-center";
const inputClass = "neu-input h-12 w-full rounded-xl pl-[41px] text-base";

function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-ink"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? (
        <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
}

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

export default function StepOneForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Field
          id="fullName"
          label={t("auth.fullName")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        >
          <input id="fullName" type="text" autoComplete="name" placeholder={t("auth.fullNamePlaceholder")} className={inputClass} />
        </Field>

        <Field
          id="organization"
          label={t("auth.organization")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          }
        >
          <input id="organization" type="text" autoComplete="organization" placeholder={t("auth.orgPlaceholder")} className={inputClass} />
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
        <input id="regEmail" type="email" autoComplete="email" placeholder={t("auth.emailPlaceholder")} className={inputClass} />
      </Field>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Field
          id="regPassword"
          label={t("auth.password")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          }
        >
          <input id="regPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" className={`${inputClass} pr-10`} />
          <EyeButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        </Field>

        <Field
          id="confirmPassword"
          label={t("auth.confirmPassword")}
          icon={
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          }
        >
          <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" className={`${inputClass} pr-10`} />
          <EyeButton show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
        </Field>
      </div>
    </div>
  );
}