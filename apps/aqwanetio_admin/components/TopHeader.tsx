export default function TopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#c4c6ce] flex items-center px-6 z-10">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-[#006c49] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-[#000f22] text-lg tracking-tight">AquaNetIO</span>
        <span className="text-[#768dad] text-xs font-bold tracking-[0.55px] ml-2">ADMIN</span>
      </div>
    </header>
  );
}
