export type PondStatus = "stable" | "critical" | "warning";

export interface PondNode {
  id: string;
  name: string;
  ammonia: number;
  ammoniaUnit: string;
  signal: number;
  signalUnit: string;
  signalBars: number;
  lastTransmission: string;
  lastTransmissionRaw: Date;
  status: PondStatus;
}

export interface KpiData {
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendColor: string;
  icon: string;
}

export type AlertSeverity = "critical" | "info";

export interface Alert {
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  isPeak?: boolean;
}

export interface NetworkHealth {
  avgLoss: string;
  peakLoss: string;
  data: ChartDataPoint[];
}

export interface SensorHardware {
  id: string;
  pondMapping: string;
  depth: string;
  battery: number;
  online: boolean;
  lastCalibration: string;
  drift: "nominal" | "needs_cal" | "warning";
}

export interface MaintenanceEntry {
  date: string;
  description: string;
  technician: string;
}

export interface ConsumableItem {
  name: string;
  stock: string;
  status: "sufficient" | "low" | "critical";
  reorderAt: string;
}
