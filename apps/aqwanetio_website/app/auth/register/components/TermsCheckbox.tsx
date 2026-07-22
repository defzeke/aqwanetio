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
        className="mt-[6px] h-5 w-5 shrink-0 rounded border border-gray-300 bg-white"
      />
      <label htmlFor="terms" className="text-base text-gray-600">
        {t("terms.prefix")}{" "}
        <a href="#" className="text-teal-dark transition-colors hover:text-teal-dark/80">
          {t("footer.tos")}
        </a>{" "}
        {t("terms.and")}{" "}
        <a href="#" className="text-teal-dark transition-colors hover:text-teal-dark/80">
          {t("footer.privacy")}
        </a>{" "}
        {t("terms.suffix")}
      </label>
    </div>
  );
}
