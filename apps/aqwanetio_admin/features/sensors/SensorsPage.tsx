import SensorsHeader from "./components/SensorsHeader";
import GatewayHealthCard from "./components/GatewayHealthCard";
import NetworkReachCard from "./components/NetworkReachCard";
import SignalTrendChart from "./components/SignalTrendChart";
import SensorInventoryTable from "./components/SensorInventoryTable";
import MaintenanceLog from "./components/MaintenanceLog";
import ConsumablesReorder from "./components/ConsumablesReorder";

export default function SensorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-4 pt-24 px-6 max-w-[1440px]">
      <SensorsHeader />
      <div className="grid grid-cols-12 gap-6 w-full">
        <div className="col-span-4">
          <GatewayHealthCard />
        </div>
        <div className="col-span-8">
          <NetworkReachCard />
        </div>
      </div>
      <SignalTrendChart />
      <SensorInventoryTable />
      <div className="flex gap-6 w-full">
        <MaintenanceLog />
        <ConsumablesReorder />
      </div>
    </div>
  );
}
