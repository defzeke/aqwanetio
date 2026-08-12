"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import SettingsDropdown from "@/components/SettingsDropdown";
import PondSearch from "@/components/PondSearch";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translations";

const navLinks = [
  { href: "/map", labelKey: "header.map" },
  { href: "/docs", labelKey: "header.docs" },
];

const switchClass = (on: boolean) =>
  `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
    on ? "bg-cyan" : "bg-line"
  }`;

const knobClass = (on: boolean) =>
  `inline-block h-4 w-4 translate-y-0 rounded-full bg-white shadow transition-transform ${
    on ? "translate-x-4" : "translate-x-0"
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications, toggleNotifications, theme, toggleTheme, language, setLanguage } =
    useSettings();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[1003] flex flex-col items-center px-3 sm:px-6">
      <header className="pointer-events-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 rounded-full border border-line bg-surface/85 px-4 shadow-[var(--shadow-raise)] backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="neu-inset h-8 w-8 shrink-0 overflow-hidden rounded-lg p-1">
              <img src="/dostasti-logo.png" alt="DOST-ASTI" className="h-full w-full object-contain" />
            </span>
            <span className="neu-inset hidden h-8 w-8 shrink-0 overflow-hidden rounded-lg p-1 sm:block">
              <img src="/dost-logo.png" alt="DOST" className="h-full w-full object-contain" />
            </span>
            <span className="truncate text-xl font-bold text-ink">{t("header.brand")}</span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-cyan/25 bg-cyan/15 text-cyan"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
          {pathname === "/map" && (
            <div className="hidden md:block">
              <PondSearch />
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SettingsDropdown />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{user.name}</span>
              <button onClick={logout} className="btn btn-ghost px-4 py-2 text-sm text-muted">
                {t("header.signOut")}
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost px-4 py-2 text-sm text-ink">
                {t("header.signIn")}
              </Link>
              <Link href="/auth/register" className="btn btn-cyan px-4 py-2 text-sm">
                {t("header.register")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn btn-ghost p-2 text-muted md:hidden"
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
      </header>

      {mobileOpen && (
        <div className="neu-card pointer-events-auto mt-2 w-full max-w-[1240px] p-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-cyan/15 font-bold text-cyan" : "text-muted hover:bg-raised"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <hr className="my-2 border-line" />
            {pathname === "/map" && (
              <div className="md:hidden">
                <PondSearch />
              </div>
            )}
            <hr className="my-2 border-line" />
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted hover:bg-raised"
              >
                {t("header.signOut")} ({user.name})
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-raised" onClick={() => setMobileOpen(false)}>{t("header.signIn")}</Link>
                <Link href="/auth/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-raised" onClick={() => setMobileOpen(false)}>{t("header.register")}</Link>
              </>
            )}
            <hr className="my-2 border-line" />
            <div className="space-y-3 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-wide text-muted">{t("settings.title")}</span>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  {t("settings.darkMode")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === "dark"}
                  onClick={toggleTheme}
                  className={switchClass(theme === "dark")}
                >
                  <span className={knobClass(theme === "dark")} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {t("settings.notifications")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications}
                  onClick={toggleNotifications}
                  className={switchClass(notifications)}
                >
                  <span className={knobClass(notifications)} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("settings.language")}
                </span>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "fil" : "en")}
                  className="btn btn-ghost px-2 py-0.5 text-sm font-semibold text-muted"
                >
                  {language === "en" ? "EN" : "FIL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}