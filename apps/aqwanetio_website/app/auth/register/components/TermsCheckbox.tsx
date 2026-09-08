"use client";

import { useTranslation } from "@/lib/translations";

export default function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <label className="flex cursor-pointer select-none items-start gap-3">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-input-bg transition-colors duration-150 peer-checked:border-cyan peer-checked:bg-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-cyan/50">
        <svg className="h-3 w-3 text-[#02131c] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
      <span className="text-base text-muted">
        {t("terms.prefix")}{" "}
        <a href="#" className="text-cyan transition-colors hover:text-cyan-light">
          {t("footer.tos")}
        </a>{" "}
        {t("terms.and")}{" "}
        <a href="#" className="text-cyan transition-colors hover:text-cyan-light">
          {t("footer.privacy")}
        </a>{" "}
        {t("terms.suffix")}
      </span>
    </label>
  );
}