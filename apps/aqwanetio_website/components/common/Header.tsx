"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translations";

const navLinks = [
  { href: "/map", labelKey: "header.map" },
  { href: "/docs", labelKey: "header.docs" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications, toggleNotifications, language, setLanguage } = useSettings();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 overflow-hidden rounded">
            <img src="/dostasti-logo.png" alt="DOST-ASTI" className="h-full w-full object-contain" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-navy">{t("header.brand")}</span>
            <span className="text-sm font-medium text-gray-600 sm:text-base">{t("header.subtitle")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-[6px] text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-teal-dark font-bold text-navy"
                    : "font-medium text-gray-600 hover:text-navy"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <SettingsDropdown />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-gray-50"
            >
              {t("header.signIn")}
            </Link>
            <Link
              href="/auth/register"
              className="rounded bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90"
            >
              {t("header.register")}
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-gray-300 bg-white shadow-lg md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-gray-100 font-bold text-navy" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <hr className="my-2 border-gray-300" />
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                {t("header.signOut")} ({user.name})
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="block rounded px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>{t("header.signIn")}</Link>
                <Link href="/auth/register" className="block rounded px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>{t("header.register")}</Link>
              </>
            )}
            <hr className="my-2 border-gray-300" />
            <div className="space-y-3 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{t("settings.title")}</span>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {t("settings.notifications")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications}
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    notifications ? "bg-navy" : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 translate-y-0 rounded-full bg-white shadow-sm transition-transform ${
                    notifications ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("settings.language")}
                </span>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "fil" : "en")}
                  className="rounded border border-gray-300 px-2 py-0.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  {language === "en" ? "EN" : "FIL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header> 
  );
}
