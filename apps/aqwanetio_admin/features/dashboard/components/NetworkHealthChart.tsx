import { nodesService } from "@/services";

export default function NetworkHealthChart() {
  const health = nodesService.getNetworkHealth();

  return (
    <div className="col-span-12 row-span-1 bg-[#f7f9fb] border border-[#c4c6ce] rounded-sm p-[25px] flex flex-col gap-4">
      <div className="flex items-end justify-between w-full">
        <div>
          <h3 className="text-[20px] font-semibold text-[#000f22]">Network Health</h3>
          <p className="text-[12px] text-[#43474d]">LoRaWAN packet loss analysis over the last 24h operational cycle.</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <div className="size-3 rounded-full bg-[#000f22]" />
            <span className="text-[11px] font-bold text-[#191c1e] tracking-[0.55px]">Avg Loss: {health.avgLoss}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="size-3 rounded-full bg-[#ba1a1a]" />
            <span className="text-[11px] font-bold text-[#191c1e] tracking-[0.55px]">Peak Loss: {health.peakLoss}</span>
          </div>
        </div>
      </div>
      <div className="relative h-[200px] w-full pt-2">
        <div className="absolute inset-[8px_0.02px_0_0] flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-[#e0e3e5] w-full" />
          ))}
        </div>
        <div className="flex items-end justify-between h-full gap-[3px] relative">
          {health.data.map((d, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${Math.max(d.value, 3)}%`,
                backgroundColor: d.isPeak ? "rgba(186,26,26,0.4)" : "rgba(0,15,34,0.1)",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-mono font-medium text-[#43474d]">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}
