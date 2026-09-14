import MetricsCard from "./components/MetricsCard";
import BiasCorrectionCard from "./components/BiasCorrectionCard";
import RetrainingCard from "./components/RetrainingCard";
import ErrorDistributionCard from "./components/ErrorDistributionCard";
import ModelComparisonCard from "./components/ModelComparisonCard";
import NeuralNetworkHealthCard from "./components/NeuralNetworkHealthCard";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-24 px-6 max-w-[1440px] mx-auto">
      <header className="flex flex-wrap gap-4 items-end justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold text-admin-text tracking-[-0.64px] leading-10">
            Model Performance Intelligence
          </h1>
          <p className="text-[16px] text-admin-text-secondary leading-6 max-w-[672px]">
            Analytical deep-dive into AquaSense Node 01 predictive models. Real-time telemetry compared against
            historical validation sets for precision aquaculture management.
          </p>
        </div>
        <div className="flex gap-3 items-center bg-admin-surface border border-admin-gray-100 rounded-sm px-4 py-2">
          <span className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">Shapiro-Wilk Test</span>
          <CheckIcon />
          <span className="text-[13px] font-mono font-medium text-admin-green">Normal</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <MetricsCard />
        <BiasCorrectionCard />
        <RetrainingCard />
        <ErrorDistributionCard />
        <ModelComparisonCard />
        <NeuralNetworkHealthCard />
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5.5" stroke="#006c49" strokeWidth="1"/>
      <path d="M3.5 6L5.5 8L8.5 4.5" stroke="#006c49" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
