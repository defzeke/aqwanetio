"use client";

import { useState, useEffect } from "react";
import TopHeader from "@/components/TopHeader";
import SideNavBar from "@/components/SideNavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // ponytail: open by default on desktop, closed on mobile — sync once on mount
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setOpen(true);
  }, []);
  return (
    <>
      <TopHeader onToggle={() => setOpen((v) => !v)} />
      <SideNavBar open={open} onClose={() => setOpen(false)} />
      <main className={`flex-1 mt-16 transition-all duration-200 ${open ? "lg:ml-[280px]" : "ml-0"}`}>{children}</main>
    </>
  );
}
