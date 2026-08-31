export default function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2">
      <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-gradient-to-r from-cyan to-cyan-light" : "bg-line"}`} />
      <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-gradient-to-r from-cyan to-cyan-light" : "bg-line"}`} />
      <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-gradient-to-r from-cyan to-cyan-light" : "bg-line"}`} />
    </div>
  );
}
