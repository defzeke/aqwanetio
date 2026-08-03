const recipients = [
  { initials: "SJ", avatarBg: "#b0c8eb", avatarText: "#314865", name: "SARAH JENKINS", role: "Site Manager", channels: [true, true, false] },
  { initials: "MC", avatarBg: "#e0e3e5", avatarText: "#43474d", name: "MARCUS CHEN", role: "Chief Technician", channels: [true, false, true] },
];

export default function NotificationEscalationCard() {
  const channelIcons = [<SmsIcon />, <ChatIcon />, <BellIcon />];
  return (
    <section className="col-span-5 bg-white border border-[#c4c6ce] rounded-[2px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 p-[25px] pb-[101px]">
      <div className="flex gap-2 items-center">
        <EscalationIcon />
        <h2 className="text-[20px] font-semibold text-[#000f22]">Notification Escalation</h2>
      </div>
      <div className="flex flex-col gap-4">
        {recipients.map((r) => (
          <div key={r.name} className="bg-[#f2f4f6] rounded-[2px] flex items-center justify-between pl-[13px] pr-[13px] py-[13px]">
            <div className="flex gap-3 items-center">
              <div className="size-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: r.avatarBg, color: r.avatarText }}>
                <span className="text-[14px] font-bold">{r.initials}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#191c1e] tracking-[0.55px]">{r.name}</p>
                <p className="text-[12px] text-[#43474d]">{r.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {r.channels.map((on, i) => (
                <button
                  key={i}
                  className={`size-8 rounded-[2px] flex items-center justify-center ${
                    on ? "bg-[#0a2540] text-[#768dad]" : "bg-[#e6e8ea] text-[#74777e]"
                  }`}
                >
                  {channelIcons[i]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="border border-dashed border-[#c4c6ce] flex items-center justify-center py-[9px] text-[11px] font-bold text-[#43474d] tracking-[0.55px]">
        + ADD RECIPIENT
      </button>
    </section>
  );
}

function EscalationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C6.7 2 4 4.7 4 8V12L2 14V15H18V14L16 12V8C16 4.7 13.3 2 10 2Z" stroke="#000f22" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8.5 17.5C8.9 18.4 9.4 19 10 19C10.6 19 11.1 18.4 11.5 17.5" stroke="#000f22" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
      <path d="M1 1H14V9H4.5L1 11.5V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4" cy="6" r="0.8" fill="currentColor"/>
      <circle cx="7.5" cy="6" r="0.8" fill="currentColor"/>
      <circle cx="11" cy="6" r="0.8" fill="currentColor"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
      <path d="M6 1C3.5 1 2 3 2 5.5V9L0.5 11.5H11.5L10 9V5.5C10 3 8.5 1 6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M4.5 13.5C4.9 14.2 5.4 14.5 6 14.5C6.6 14.5 7.1 14.2 7.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
