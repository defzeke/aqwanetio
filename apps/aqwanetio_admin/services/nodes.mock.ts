import type { NodesService } from "./nodes.service";
import type { SensorHardware, MaintenanceEntry, ConsumableItem } from "@/types/admin";

const mockNodes = [
  { id: "PND-042-ALPHA", name: "AquaSense Node 01", ammonia: 0.24, ammoniaUnit: "mg/L", signal: -64, signalUnit: "dBm", signalBars: 4, lastTransmission: "4s ago", lastTransmissionRaw: new Date(Date.now() - 4000), status: "stable" as const },
  { id: "PND-043-BETA", name: "AquaSense Node 02", ammonia: 0.88, ammoniaUnit: "mg/L", signal: -88, signalUnit: "dBm", signalBars: 2, lastTransmission: "16s ago", lastTransmissionRaw: new Date(Date.now() - 16000), status: "critical" as const },
  { id: "PND-044-GAMMA", name: "AquaSense Node 03", ammonia: 0.31, ammoniaUnit: "mg/L", signal: -72, signalUnit: "dBm", signalBars: 3, lastTransmission: "1m ago", lastTransmissionRaw: new Date(Date.now() - 60000), status: "stable" as const },
  { id: "PND-045-DELTA", name: "AquaSense Node 04", ammonia: 0.28, ammoniaUnit: "mg/L", signal: -61, signalUnit: "dBm", signalBars: 4, lastTransmission: "46s ago", lastTransmissionRaw: new Date(Date.now() - 46000), status: "stable" as const },
];

const mockKpis = [
  { label: "AVERAGE AMMONIA", value: "0.32", unit: "ppm", trend: "+2% vs avg", trendColor: "#006c49", icon: "ammonia" },
  { label: "ACTIVE ALERTS", value: "2", unit: undefined, trend: "Urgent", trendColor: "#ba1a1a", icon: "alerts" },
  { label: "GATEWAY UPTIME", value: "99.9%", unit: undefined, trend: "Optimal", trendColor: "#006c49", icon: "uptime" },
  { label: "EDGE LATENCY", value: "<1", unit: "ms", trend: "Stable", trendColor: "#314865", icon: "latency" },
];

const mockAlerts = [
  { severity: "critical" as const, title: "CRITICAL THRESHOLD BREACH", description: "Pond PND-043-BETA ammonia concentration exceeded 0.8 mg/L limit.", timestamp: "12:44:21 PM", source: "NODE_43" },
  { severity: "info" as const, title: "GATEWAY REBOOT", description: "Substation-09 performed a scheduled firmware synchronization.", timestamp: "11:15:04 AM", source: "SYS_LOG" },
  { severity: "critical" as const, title: "SENSOR DISCONNECTED", description: "Node PND-012 reported low battery voltage; signal lost after retry.", timestamp: "10:22:58 AM", source: "BATT_LOW" },
  { severity: "info" as const, title: "CALIBRATION COMPLETE", description: "Auto-calibration for Node PND-045-DELTA successful.", timestamp: "09:12:11 AM", source: "SENSOR_CAL" },
];

const barValues = [28.8, 23.03, 34.55, 86.39, 57.59, 48, 38.39, 28.8, 19.19, 163.19, 76.8, 67.19, 48, 38.39, 28.8, 34.55, 42.23, 28.8, 19.19, 23.03, 38.39, 48, 34.55, 28.8];
const maxBar = Math.max(...barValues);

const mockNetworkHealth = {
  avgLoss: "0.12%",
  peakLoss: "1.45%",
  data: barValues.map((v, i) => ({
    label: `${String(Math.floor(i * 60 / 60)).padStart(2, "0")}:00`,
    value: Number((v / maxBar * 100).toFixed(1)),
    isPeak: i === 9,
  })),
};

const mockSensors: SensorHardware[] = [
  { id: "S-X109-A", pondMapping: "Primary Grow-out (P1)", depth: "0.5m", battery: 92, online: true, lastCalibration: "2023-11-12", drift: "nominal" },
  { id: "S-X109-B", pondMapping: "Primary Grow-out (P1)", depth: "0.5m", battery: 41, online: true, lastCalibration: "2023-09-28", drift: "needs_cal" },
  { id: "S-X110-A", pondMapping: "Nursery Pond (P2)", depth: "0.3m", battery: 15, online: false, lastCalibration: "2023-08-15", drift: "needs_cal" },
  { id: "S-X111-A", pondMapping: "Hatchery Tank (P3)", depth: "0.8m", battery: 78, online: true, lastCalibration: "2023-11-05", drift: "nominal" },
];

const mockMaintenanceLogs: MaintenanceEntry[] = [
  { date: "2023-11-14", description: "pH sensor calibration routine completed for P1 array.", technician: "M. Reyes" },
  { date: "2023-11-10", description: "Firmware v2.4.1 rolled out to all gateway substations.", technician: "J. Cruz" },
];

const mockConsumables: ConsumableItem[] = [
  { name: "Ammonia Test Kits (50-pack)", stock: "3 remaining", status: "low", reorderAt: "5 remaining" },
  { name: "Dissolved Oxygen Membranes", stock: "12 remaining", status: "sufficient", reorderAt: "3 remaining" },
  { name: "Calibration Solution (pH 7.0)", stock: "1 remaining", status: "critical", reorderAt: "4 remaining" },
];

export const mockNodesService: NodesService = {
  getAll: () => mockNodes,
  getById: (id) => mockNodes.find((n) => n.id === id),
  getKpis: () => mockKpis,
  getAlerts: () => mockAlerts,
  getNetworkHealth: () => mockNetworkHealth,
  getSensors: () => mockSensors,
  getMaintenanceLogs: () => mockMaintenanceLogs,
  getConsumables: () => mockConsumables,
};
