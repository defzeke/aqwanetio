import SensorsHeader from "./components/SensorsHeader";
import GatewayHealthCard from "./components/GatewayHealthCard";
import NetworkReachCard from "./components/NetworkReachCard";
import SignalTrendChart from "./components/SignalTrendChart";
import SensorInventoryTable from "./components/SensorInventoryTable";
import MaintenanceLog from "./components/MaintenanceLog";
import ConsumablesReorder from "./components/ConsumablesReorder";

export default function SensorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-24 px-6 max-w-[1440px] mx-auto">
      <SensorsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <div className="col-span-12 lg:col-span-4">
          <GatewayHealthCard />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <NetworkReachCard />
        </div>
      </div>
      <SignalTrendChart />
      <SensorInventoryTable />
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <MaintenanceLog />
        <ConsumablesReorder />
      </div>
    </div>
  );
}
