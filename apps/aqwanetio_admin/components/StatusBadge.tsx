export default function StatusBadge({ status }: { status: "stable" | "critical" | "warning" }) {
  const styles = {
    stable: "bg-admin-green-bg text-admin-green-text",
    critical: "bg-admin-red-bg text-admin-red-text",
    warning: "bg-amber-100 text-amber-900",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.5px] uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}
