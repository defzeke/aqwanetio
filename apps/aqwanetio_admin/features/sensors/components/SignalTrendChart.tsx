"use client";

import { useState } from "react";

const ranges = ["1H", "6H", "24H"] as const;

const yLabels = ["-40 dBm", "-70 dBm", "-100 dBm", "-130 dBm"];

// ponytail: static SVG polyline matching the Figma shape; replace with recharts when interactive filtering is needed
const chartPath = "M0,80 Q20,70 40,85 T80,75 T120,90 T160,60 T200,95 T240,65 T280,70 T320,50 T360,100 T400,55 T440,85 T480,60 T520,75 T560,65 T600,80 T640,55 T680,90 T720,70 T760,85 T800,60 T840,75 T880,65 L880,160 L0,160Z";

export default function SignalTrendChart() {
  const [active, setActive] = useState<string>("1H");

  return (
    <div className="bg-white border border-[#c4c6ce] rounded-sm shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-4 p-[25px] w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-semibold text-[#191c1e]">LoRaWAN Signal Strength Trend (RSSI)</h3>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className={`px-3 py-1 rounded text-[11px] font-bold tracking-[0.55px] ${
                active === r ? "bg-[#eceef0] text-[#191c1e]" : "text-[#43474d]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-[192px] w-full">
        <div className="absolute inset-0 grid grid-rows-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-dashed border-[#e6e8ea]" />
          ))}
        </div>
        <svg viewBox="0 0 880 160" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#006c49" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#006c49" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={chartPath} fill="url(#chartFill)" />
          <path d={chartPath.replace("L0,160 L880,160Z", "")} fill="none" stroke="#006c49" strokeWidth="2" />
        </svg>
        <div className="absolute left-0 top-0 bottom-0 w-[43px] flex flex-col justify-between pb-1 pt-[3px]">
          {yLabels.map((l) => (
            <span key={l} className="text-[9px] font-mono font-medium text-[#74777e]">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
