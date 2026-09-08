"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/translations";

const footerLinks = ["footer.contact", "footer.privacy", "footer.dost", "footer.tos"] as const;

export default function AuthFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-line bg-surface px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 pb-6 pt-5 sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="neu-inset h-8 w-8 shrink-0 overflow-hidden rounded-lg p-1">
            <img src="/dostasti-logo.png" alt="DOST-ASTI" className="h-full w-full object-contain" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold text-ink">{t("footer.brand")}</span>
            <span className="text-[11px] font-medium text-muted">{t("header.subtitle")}</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-muted" aria-label="Legal links">
          {footerLinks.map((key, i) => (
            <Fragment key={key}>
              {i > 0 && <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />}
              <Link href="#" className="transition-colors hover:text-cyan">{t(key)}</Link>
            </Fragment>
          ))}
        </nav>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-1.5 py-3 sm:flex-row">
          <p className="text-xs font-medium text-muted">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}