import MetricsCard from "./components/MetricsCard";
import BiasCorrectionCard from "./components/BiasCorrectionCard";
import RetrainingCard from "./components/RetrainingCard";
import ErrorDistributionCard from "./components/ErrorDistributionCard";
import ModelComparisonCard from "./components/ModelComparisonCard";
import NeuralNetworkHealthCard from "./components/NeuralNetworkHealthCard";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-12 pt-24 px-6">
      <header className="flex flex-wrap gap-4 items-end justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold text-[#000f22] tracking-[-0.64px] leading-10">
            Model Performance Intelligence
          </h1>
          <p className="text-[16px] text-[#43474d] leading-6 max-w-[672px]">
            Analytical deep-dive into AquaSense Node 01 predictive models. Real-time telemetry compared against
            historical validation sets for precision aquaculture management.
          </p>
        </div>
        <div className="flex gap-3 items-center bg-white border border-[#e2e8f0] rounded-[4px] px-[17px] py-[9px]">
          <span className="text-[11px] font-bold text-[#43474d] tracking-[0.55px]">Shapiro-Wilk Test</span>
          <CheckIcon />
          <span className="text-[13px] font-mono font-medium text-[#006c49]">Normal</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4 w-full">
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
