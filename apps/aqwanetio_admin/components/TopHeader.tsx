export default function TopHeader({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-admin-surface border-b border-admin-border flex items-center justify-between px-4 lg:px-6 z-30">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className="p-2 -ml-2 rounded hover:bg-admin-gray-100 lg:hover:bg-transparent text-admin-text"
        >
          <MenuIcon />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-8 bg-admin-surface rounded-lg flex items-center justify-center overflow-hidden border border-admin-border">
            <img src="/dostasti-logo.png" alt="DOST-ASTI" className="h-full w-full object-contain p-1" />
          </div>
          <div className="size-8 bg-admin-surface rounded-lg flex items-center justify-center overflow-hidden border border-admin-border">
            <img src="/dost-logo.png" alt="DOST" className="h-full w-full object-contain p-1" />
          </div>
        </div>
        <span className="font-bold text-admin-text text-lg tracking-tight">AqWaNetIO</span>
        <span className="text-admin-text-muted text-xs font-bold tracking-[0.55px] ml-2">ADMIN</span>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
      <line x1="1" y1="1.5" x2="19" y2="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="12.5" x2="19" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
