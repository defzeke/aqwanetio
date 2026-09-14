import type { ReactNode } from "react";

type CardProps = {
 children: ReactNode;
 className?: string;
 padding?: string; // tailwind padding, default p-6
 variant?: "surface" | "muted";
};

export default function Card({ children, className = "", padding = "p-6", variant = "surface" }: CardProps) {
 const bg = variant === "muted" ? "bg-admin-bg" : "bg-admin-surface";
 return (
  <div className={`${bg} border border-admin-border rounded-sm shadow-sm ${padding} ${className}`}>
   {children}
  </div>
 );
}
