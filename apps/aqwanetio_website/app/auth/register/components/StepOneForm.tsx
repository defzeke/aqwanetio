"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/translations";

export default function StepOneForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="fullName">{t("auth.fullName")}</label>
          <input
            id="fullName"
            type="text"
            placeholder={t("auth.fullNamePlaceholder")}
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="organization">{t("auth.organization")}</label>
          <input
            id="organization"
            type="text"
            placeholder={t("auth.orgPlaceholder")}
            className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base text-gray-900" htmlFor="regEmail">{t("auth.emailOfficial")}</label>
        <input
          id="regEmail"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-[17px] text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="regPassword">{t("auth.password")}</label>
          <div className="relative">
            <input
              id="regPassword"
              type={showPassword ? "text" : "password"}
              className="h-10 w-full rounded border border-gray-300 bg-gray-100 pl-[17px] pr-10 text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-800 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
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
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-base text-gray-900" htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="h-10 w-full rounded border border-gray-300 bg-gray-100 pl-[17px] pr-10 text-base text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-800 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
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
          </div>
        </div>
      </div>
    </div>
  );
}
