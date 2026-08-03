export default function NeuralNetworkHealthCard() {
  return (
    <section className="col-span-12 bg-gradient-to-r from-[rgba(0,15,34,0.8)] to-[rgba(0,15,34,0)] rounded-[8px] overflow-clip flex items-center px-12 h-[192px]">
      <div>
        <h3 className="text-[16px] text-white">Neural Network Health</h3>
        <p className="text-[14px] text-[#b0c8eb] leading-5 mt-1">
          Currently processing 4.2k sensor events per second. Gradient descent convergence achieved at step 840,211.
        </p>
        <div className="flex gap-4 items-center mt-2">
          <div>
            <p className="text-[10px] text-[#d2e4ff]">GPU UTILIZATION</p>
            <p className="text-[16px] font-mono font-medium text-white">42%</p>
          </div>
          <div className="w-px h-8 bg-[rgba(255,255,255,0.2)]" />
          <div>
            <p className="text-[10px] text-[#d2e4ff]">MEMORY LOAD</p>
            <p className="text-[16px] font-mono font-medium text-white">1.4 GB</p>
          </div>
        </div>
      </div>
    </section>
  );
}
