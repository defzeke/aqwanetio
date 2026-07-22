export default function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2">
      <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-teal-dark" : "bg-gray-300"}`} />
      <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-teal-dark" : "bg-gray-300"}`} />
    </div>
  );
}
