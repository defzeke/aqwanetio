import DashboardHeader from "./components/DashboardHeader";
import KpiCardGrid from "./components/KpiCardGrid";
import PondStatusTable from "./components/PondStatusTable";
import SystemAlertsFeed from "./components/SystemAlertsFeed";
import NetworkHealthChart from "./components/NetworkHealthChart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-24 px-6 max-w-[1440px] mx-auto">
      <DashboardHeader />
      <KpiCardGrid />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <PondStatusTable />
        <SystemAlertsFeed />
        <NetworkHealthChart />
      </div>
    </div>
  );
}
