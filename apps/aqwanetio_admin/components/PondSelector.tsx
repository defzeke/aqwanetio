export default function PondSelector() {
  return (
    <div className="flex gap-3 items-center bg-admin-bg border border-admin-border rounded p-3 w-[231px]">
      <div className="size-2 rounded-full bg-admin-green" />
      <div>
        <p className="font-bold text-[11px] text-admin-text tracking-[0.55px] leading-4">AquaSense Node 01</p>
        <p className="text-[10px] text-admin-text-secondary leading-[15px]">Gateway: Online</p>
      </div>
    </div>
  );
}
