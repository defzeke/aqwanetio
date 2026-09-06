"use client";

import { useState } from "react";

const ranges = ["7D", "30D", "90D", "Custom"] as const;

export default function TrendsHeader() {
  const [active, setActive] = useState<string>("7D");

  return (
    <header className="flex flex-wrap gap-4 items-end justify-between w-full">
      <div className="flex flex-col gap-2">
        <nav className="flex gap-2 items-center text-[11px] font-bold tracking-[0.55px]">
          <span className="text-admin-text-secondary">Fleet View</span>
          <ChevronIcon />
          <span className="text-admin-text-secondary">Node 01</span>
          <ChevronIcon />
          <span className="text-admin-text">Pond A-12 Trends</span>
        </nav>
        <h1 className="text-[32px] font-bold text-admin-text tracking-[-0.64px] leading-10">
          Historical Performance &amp; Biomass
        </h1>
      </div>
      <div className="flex gap-3 items-center">
        <div className="bg-admin-gray-100 border border-admin-border rounded-sm flex items-start p-[5px]">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className={`px-4 py-1.5 rounded-sm text-[11px] font-bold tracking-[0.55px] ${
                active === r
                  ? "bg-admin-surface drop-shadow-sm text-admin-gray-400"
                  : "text-admin-text-secondary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="bg-admin-text drop-shadow-sm rounded-sm flex items-center gap-8 pl-4 pr-6 py-2 text-[11px] font-bold text-white tracking-[0.55px]">
          <DownloadIcon />
          Export Data (CSV/PDF)
        </button>
      </div>
    </header>
  );
}

function ChevronIcon() {
  return (
    <svg width="4" height="7" viewBox="0 0 4 7" fill="none" className="shrink-0">
      <path d="M1 6L3 3.5L1 1" stroke="#43474d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1V8M6 8L3.5 5.5M6 8L8.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
