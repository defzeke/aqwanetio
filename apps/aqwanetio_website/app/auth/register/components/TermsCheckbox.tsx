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
    <div className="flex items-start gap-4 pb-2 pt-1">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-[6px] h-5 w-5 shrink-0 rounded border border-line bg-surface accent-cyan"
      />
      <label htmlFor="terms" className="text-base text-muted">
        {t("terms.prefix")}{" "}
        <a href="#" className="text-cyan transition-colors hover:text-cyan-light">
          {t("footer.tos")}
        </a>{" "}
        {t("terms.and")}{" "}
        <a href="#" className="text-cyan transition-colors hover:text-cyan-light">
          {t("footer.privacy")}
        </a>{" "}
        {t("terms.suffix")}
      </label>
    </div>
  );
}
