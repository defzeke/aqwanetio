import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-[#f7f9fb]">{children}</div>;
}
