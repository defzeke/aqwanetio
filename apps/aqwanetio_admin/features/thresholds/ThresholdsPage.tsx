import AmmoniaThresholdsCard from "./components/AmmoniaThresholdsCard";
import NotificationEscalationCard from "./components/NotificationEscalationCard";
import ValidationCard from "./components/ValidationCard";
import UserAccessCard from "./components/UserAccessCard";

export default function ThresholdsPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-12 pt-24 px-6 max-w-[1200px]">
      <header>
        <h1 className="text-[32px] font-bold text-[#000f22] tracking-[-0.64px] leading-10">
          System Thresholds &amp; Alerts
        </h1>
        <p className="text-[16px] text-[#43474d] leading-6">
          Configure critical alert parameters and operational safety boundaries for Node 01.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-4 w-full">
        <AmmoniaThresholdsCard />
        <NotificationEscalationCard />
        <ValidationCard />
        <UserAccessCard />
      </div>
    </div>
  );
}
