import Link from "next/link";

interface SideNavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

export default function SideNavLink({ href, icon, label, active, disabled }: SideNavLinkProps) {
  const className = `flex gap-4 items-center px-4 py-3 w-full text-[11px] font-bold tracking-[0.55px] ${
    active
      ? "bg-admin-nav-active border-r-4 border-admin-nav-border text-admin-text-muted rounded-r"
      : "text-admin-text-secondary"
  }`;

  if (disabled) {
    return (
      <span className={className}>
        <span className="shrink-0">{icon}</span>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
