export default function NetworkReachCard() {
  return (
    <div className="bg-white border border-[#c4c6ce] rounded-sm shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 p-[25px]">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-semibold text-[#191c1e]">868 MHz Network Reach</h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            <div className="size-3 rounded-full bg-[#006c49]" />
            <span className="text-[10px] text-[#43474d]">OPTIMAL</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="size-3 rounded-full bg-[#ffb95f]" />
            <span className="text-[10px] text-[#43474d]">FRINGE</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="col-span-2 bg-[#f2f4f6] border border-[#c4c6ce] rounded-sm h-[192px] flex items-center justify-center">
          <div className="bg-[rgba(0,108,73,0.1)] border border-[#006c49] rounded-2xl size-24 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 4 5 4 9C4 13 8 18 12 22C16 18 20 13 20 9C20 5 16 2 12 2Z" stroke="#006c49" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="9" r="2" fill="#006c49"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-[#f2f4f6] border border-[#c4c6ce] rounded-sm p-[13px]">
            <p className="text-[10px] text-[#43474d]">AVG SNR</p>
            <p className="text-[18px] font-mono font-medium text-[#000f22]">+8.5 dB</p>
          </div>
          <div className="bg-[#f2f4f6] border border-[#c4c6ce] rounded-sm p-[13px]">
            <p className="text-[10px] text-[#43474d]">PACKET LOSS</p>
            <p className="text-[18px] font-mono font-medium text-[#006c49]">0.02%</p>
          </div>
          <div className="bg-[#f2f4f6] border border-[#c4c6ce] rounded-sm p-[13px]">
            <p className="text-[10px] text-[#43474d]">ACTIVE NODES</p>
            <p className="text-[18px] font-mono font-medium text-[#000f22]">12 / 12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
