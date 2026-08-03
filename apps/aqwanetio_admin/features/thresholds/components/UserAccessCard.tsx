const users = [
  { initials: "AJ", avatarBg: "#b0c8eb", avatarText: "#314865", name: "Administrator J.", email: "admin@aquasense.ind", role: "SYSTEM ADMIN", roleClass: "bg-[#000f22] text-white", lastLogin: "2023-10-27 10:05" },
  { initials: "RT", avatarBg: "#e0e3e5", avatarText: "#43474d", name: "Robert T.", email: "r.tech@aquasense.ind", role: "TECHNICIAN", roleClass: "bg-[#e0e3e5] border border-[#c4c6ce] text-[#43474d]", lastLogin: "2023-10-26 16:42" },
];

export default function UserAccessCard() {
  return (
    <section className="col-span-12 bg-white border border-[#c4c6ce] rounded-[2px] overflow-clip shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pb-12">
      <div className="flex items-center justify-between px-6 pb-[17px] pt-4 border-b border-[#c4c6ce]">
        <div className="flex gap-2 items-center">
          <UsersIcon />
          <h2 className="text-[20px] font-semibold text-[#000f22]">User Access Management</h2>
        </div>
        <button className="border border-[#000f22] rounded-[2px] flex gap-2 items-center px-[13px] py-[7px] text-[11px] font-bold text-[#000f22] tracking-[0.55px]">
          <UserPlusIcon />
          Invite User
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#f2f4f6] border-b border-[#c4c6ce]">
            {["USER IDENTITY", "SYSTEM ROLE", "LAST LOGIN", "ACTIONS"].map((h, i) => (
              <th
                key={h}
                className={`px-6 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px] ${
                  i === 3 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.name} className={i > 0 ? "border-t border-[#c4c6ce]" : ""}>
              <td className="px-6 py-4">
                <div className="flex gap-3 items-center">
                  <div className="size-8 rounded-[2px] flex items-center justify-center text-[16px] font-bold" style={{ backgroundColor: u.avatarBg, color: u.avatarText }}>
                    {u.initials}
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#191c1e] leading-6">{u.name}</p>
                    <p className="text-[16px] text-[#43474d] leading-6">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-[2px] px-2 py-0.5 text-[10px] ${u.roleClass}`}>{u.role}</span>
              </td>
              <td className="px-6 py-4 text-[13px] font-mono font-medium text-[#191c1e]">{u.lastLogin}</td>
              <td className="px-6 py-4 text-right">
                <button className="size-5 text-[#74777e]">
                  <GearIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="17" viewBox="0 0 20 17" fill="none">
      <circle cx="7" cy="6" r="3" stroke="#000f22" strokeWidth="1.3"/>
      <path d="M1 16C1 12.7 3.7 10.5 7 10.5C10.3 10.5 13 12.7 13 16" stroke="#000f22" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="14.5" cy="6.5" r="2.3" stroke="#000f22" strokeWidth="1.3"/>
      <path d="M14 10.8C16.8 11 19 12.9 19 16" stroke="#000f22" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <circle cx="5" cy="4" r="2.8" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M0.5 11.5C0.5 8.7 2.5 7 5 7C7.5 7 9.5 8.7 9.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M13 3V9M10 6H16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 1.5V4M10 16V18.5M18.5 10H16M4 10H1.5M16.3 3.7L14.6 5.4M5.4 14.6L3.7 16.3M16.3 16.3L14.6 14.6M5.4 5.4L3.7 3.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
