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
      ? "bg-[#0a2540] border-r-4 border-[#000f22] text-[#768dad] rounded-r"
      : "text-[#43474d]"
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
