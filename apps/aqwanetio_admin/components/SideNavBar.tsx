"use client";

import { usePathname } from "next/navigation";
import SideNavLink from "./SideNavLink";
import PondSelector from "./PondSelector";

const navLinks = [
  { href: "/", label: "DASHBOARD", icon: <DashboardIcon /> },
  { href: "/sensors", label: "SENSORS & NETWORK", icon: <SensorsIcon /> },
  { href: "/analytics", label: "MODEL ANALYTICS", icon: <AnalyticsIcon /> },
  { href: "/thresholds", label: "THRESHOLDS", icon: <ThresholdsIcon /> },
  { href: "/trends", label: "TRENDS & METADATA", icon: <TrendsIcon /> },
];

const bottomLinks = [
  { href: "/logs", label: "SYSTEM LOGS", icon: <LogsIcon />, disabled: true },
  { href: "/support", label: "SUPPORT", icon: <SupportIcon />, disabled: true },
];

export default function SideNavBar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 w-[280px] h-[calc(100vh-64px)] bg-[#f2f4f6] border-r border-[#c4c6ce] flex flex-col justify-between overflow-auto py-6">
      <div className="flex flex-col gap-8 items-center w-full">
        <PondSelector />
        <nav className="flex flex-col gap-1 w-full px-4">
          {navLinks.map((link) => (
            <SideNavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>
        <button className="flex gap-2 items-center justify-center bg-[#000f22] text-white text-[11px] font-bold tracking-[0.55px] rounded py-3 w-[215px]">
          <AddIcon />
          ADD NEW POND
        </button>
      </div>
      <nav className="flex flex-col gap-1 w-full px-4">
        {bottomLinks.map((link) => (
          <SideNavLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            active={pathname === link.href}
            disabled={link.disabled}
          />
        ))}
      </nav>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function SensorsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.5" cy="9.5" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9.5" cy="9.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9.5" cy="9.5" r="1" fill="currentColor"/>
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
      <rect x="1" y="9" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="7" y="5" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="1" width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="19" y="3" width="2" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
    </svg>
  );
}

function ThresholdsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 16L7 5L12 11L16 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="2" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function TrendsIcon() {
  return (
    <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
      <path d="M1 12L6 7L10 10L19 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="19" cy="1" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <rect x="1" y="1" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="4" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="4" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8C7 6.5 8.5 5.5 10 5.5C11.5 5.5 13 6.5 13 8C13 9.5 11.5 10 11.5 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <line x1="4" y1="0.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="0.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
