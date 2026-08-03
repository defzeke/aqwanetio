export default function StatusBadge({ status }: { status: "stable" | "critical" | "warning" }) {
  const styles = {
    stable: "bg-[#6cf8bb] text-[#00714d]",
    critical: "bg-[#ffdad6] text-[#93000a]",
    warning: "bg-[#fff3cd] text-[#856404]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.5px] uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}
