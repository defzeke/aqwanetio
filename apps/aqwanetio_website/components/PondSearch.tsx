"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { focusPond } from "@/lib/pond-focus";
import { useTranslation } from "@/lib/translations";
import { pondsService } from "@/features/ponds/services";
import { fetchStations, type Station } from "@/features/stations/services/stations.service";

const statusDot: Record<string, string> = {
  safe: "bg-safe",
  warning: "bg-warning",
  toxic: "bg-alert",
};

export default function PondSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<Station[]>([]);

  const ponds = pondsService.getAll();

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStations(ctrl.signal)
      .then((rows) => {
        if (!ctrl.signal.aborted) setStations(rows);
      })
      .catch((e: any) => {
        if (e?.name === "AbortError") return;
        console.warn("GET /stations failed (backend down on :8000?)", e);
        if (!ctrl.signal.aborted) setStations([]);
      });
    return () => ctrl.abort();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return stations.filter(
      (s) =>
        s.location.toLowerCase().includes(q) ||
        s.municipality.toLowerCase().includes(q) ||
        s.province.toLowerCase().includes(q)
    );
  }, [query, stations]);

  const select = (id: string) => {
    focusPond(id);
    setQuery("");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const outside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("mousedown", outside);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("mousedown", outside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results.length > 0) select(String(results[0].stationId));
        }}
        placeholder={t("header.searchPond")}
        aria-label={t("header.searchPond")}
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="pond-search-results"
        aria-autocomplete="list"
        autoComplete="off"
        className="neu-input h-9 w-52 rounded-full pl-5 pr-8 text-sm transition-[width] duration-200 focus:w-60"
      />
      <svg
        className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          id="pond-search-results"
          aria-label={t("header.searchPond")}
          className="neu-card absolute right-0 top-full z-50 mt-2 max-h-72 w-64 overflow-y-auto p-1.5"
        >
          {results.map((s) => {
            const idx = stations.findIndex((x) => x.stationId === s.stationId);
            const mock = ponds[idx % ponds.length] || ponds[0];
            return (
              <li key={s.stationId} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => select(String(s.stationId))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-raised"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[mock.status]}`} aria-hidden="true" />
                  <span className="truncate">{s.location}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted">{s.municipality}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
