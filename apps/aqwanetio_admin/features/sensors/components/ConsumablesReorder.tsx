import { nodesService } from "@/services";

const statusColors = {
  sufficient: { dot: "#006c49", text: "#00714d" },
  low: { dot: "#ffb95f", text: "#856404" },
  critical: { dot: "#ba1a1a", text: "#93000a" },
};

export default function ConsumablesReorder() {
  const items = nodesService.getConsumables();

  return (
    <div className="bg-white border border-[#c4c6ce] rounded-sm flex-1 p-6">
      <div className="flex items-center gap-2 mb-8">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <rect x="1" y="1" width="18" height="14" rx="2" stroke="#43474d" strokeWidth="1.5"/>
          <line x1="1" y1="7" x2="19" y2="7" stroke="#43474d" strokeWidth="1.5"/>
          <line x1="7" y1="1" x2="7" y2="15" stroke="#43474d" strokeWidth="1.5"/>
        </svg>
        <h4 className="text-[20px] font-semibold text-[#191c1e]">Consumables Reorder</h4>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.name} className="border-b border-[#c4c6ce] flex items-center justify-between pb-3">
            <span className="text-[13px] leading-4 text-[#191c1e]">{item.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono font-medium text-[#191c1e]">{item.stock}</span>
              <div className="flex gap-1.5 items-center">
                <div className="size-2 rounded-full" style={{ backgroundColor: statusColors[item.status].dot }} />
                <span className="text-[10px]" style={{ color: statusColors[item.status].text }}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
