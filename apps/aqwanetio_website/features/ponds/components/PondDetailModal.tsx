"use client";

import { useEffect, useRef } from "react";
import { pondsService } from "../services";
import { readingsService } from "@/features/readings/services";
import { predictionsService } from "@/features/predictions/services";
import PondChart from "./PondChart";
import { useTranslation } from "@/lib/translations";

export default function PondDetailModal({
  pondId,
  onClose,
}: {
  pondId: string;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const pond = pondsService.getById(pondId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!pond) return null;

  const readings = readingsService.getByPond(pondId, 12);
  const predictions = predictionsService.getPrediction(pondId);

  const statusStyles: Record<string, string> = {
    safe: "bg-safe/10 text-safe border-safe/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    toxic: "bg-alert/10 text-alert border-alert/20",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-clip rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-navy">{pond.name}</h2>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                statusStyles[pond.status]
              }`}
            >
              NH₃: {pond.ammoniaLevel} ppm
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 transition-colors hover:text-gray-900"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <PondChart readings={readings} predictions={predictions} />
        </div>

        <div className="flex justify-end border-t border-gray-300 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
          >
            {t("modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
