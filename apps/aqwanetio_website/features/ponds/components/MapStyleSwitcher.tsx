"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Layers } from "lucide-react";
import { type MapStyleId } from "@/lib/map-styles";
import { useTranslation } from "@/lib/translations";

const OPTIONS: MapStyleId[] = ["auto", "colored", "minimal", "dark", "satellite"];

export default function MapStyleSwitcher({
  current,
  onChange,
}: {
  current: MapStyleId;
  onChange: (id: MapStyleId) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className="absolute left-3 top-[84px] z-[100]">
      <button
        type="button"
        aria-label={t("mapStyles.label")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface/90 text-ink shadow-[var(--shadow-raise-sm)] backdrop-blur transition-colors hover:bg-surface"
      >
        <Layers className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-12 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-[var(--shadow-raise-sm)]"
        >
          {OPTIONS.map((id) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={id === current}
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-ink/5"
            >
              <span>{t(`mapStyles.${id}`)}</span>
              {id === current && <Check className="h-4 w-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
