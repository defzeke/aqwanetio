import TrendsHeader from "./components/TrendsHeader";
import PondMetadataCard from "./components/PondMetadataCard";
import PondAgingIndicatorCard from "./components/PondAgingIndicatorCard";
import PrimaryTrendChart from "./components/PrimaryTrendChart";
import DiurnalCycleCard from "./components/DiurnalCycleCard";
import ResidualNoiseCard from "./components/ResidualNoiseCard";
import TelemetryTable from "./components/TelemetryTable";

export default function TrendsPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-12 pt-24 px-6 max-w-[1440px]">
      <TrendsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-4 gap-4 min-w-0">
          <PondMetadataCard />
          <PondAgingIndicatorCard />
        </div>
        <PrimaryTrendChart />
        <DiurnalCycleCard />
        <ResidualNoiseCard />
        <TelemetryTable />
      </div>
    </div>
  );
}
