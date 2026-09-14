import { nodesService } from "@/services";
import StatusBadge from "@/components/StatusBadge";

function SignalStrength({ bars }: { bars: number }) {
  const heights = [12, 16, 20, 24];
  return (
    <div className="flex gap-1 items-center pl-6">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[2.89px] rounded-full"
          style={{
            height: `${h}px`,
            backgroundColor: i < bars ? "#006c49" : "#c4c6ce",
          }}
        />
      ))}
      <span className="text-[12px] font-mono text-admin-gray-400 leading-4">&nbsp;dbm</span>
    </div>
  );
}

export default function PondStatusTable() {
  const nodes = nodesService.getAll();

  return (
    <div className="col-span-12 lg:col-span-8 row-span-1 bg-admin-bg border border-admin-border rounded-sm overflow-clip flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-admin-border">
          <h3 className="text-[20px] font-semibold text-admin-text">Live Pond Status</h3>
          <button className="text-[11px] font-bold text-admin-blue tracking-[0.55px]">View All Ponds</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-admin-surface">
              <th className="text-left px-6 py-5 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">POND ID</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] leading-4">CURRENT<br />AMMONIA</th>
              <th className="text-left px-6 py-5 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">SIGNAL</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] leading-4">LAST<br />TRANSMISSION</th>
              <th className="text-right px-6 py-5 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, i) => (
              <tr key={node.id} className={i > 0 ? "border-t border-admin-border" : ""}>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-mono font-medium text-admin-text">
                    {node.id.split("-").map((s, j) => <span key={j}>{s}{j < 2 ? "-" : ""}<br /></span>)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[13px] font-mono font-medium ${node.status === "critical" ? "text-admin-red" : "text-admin-gray-400"}`}>
                    {node.ammonia.toFixed(2)} {node.ammoniaUnit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <SignalStrength bars={node.signalBars} />
                </td>
                <td className="px-6 py-4 text-[16px] text-admin-text-secondary">{node.lastTransmission}</td>
                <td className="px-6 py-4 text-right">
                  <StatusBadge status={node.status} />
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
      <div className="bg-admin-surface border-t border-admin-border flex items-center justify-between px-4 py-[17px]">
        <span className="text-[16px] text-admin-text-secondary">Showing 4 of 12 active nodes</span>
        <div className="flex gap-2">
          <button className="border border-admin-border rounded px-3 py-1 text-[16px] text-admin-gray-400">Prev</button>
          <button className="border border-admin-border rounded px-3 py-1 text-[16px] text-admin-gray-400">Next</button>
        </div>
      </div>
    </div>
  );
}
